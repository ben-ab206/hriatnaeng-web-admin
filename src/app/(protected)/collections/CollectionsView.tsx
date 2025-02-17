"use client";

import { useEffect, useState } from "react";
import CollectionsTableHeader from "./_components/CollectionsTableHeader";
import CollectionsTableSearchTool from "./_components/CollectionsTableSearchTool";
import CollectionTable from "./CollectionTable";
import { Collection } from "@/@types/collection";
import CollectionDeleteConfirmation from "./_components/CollectionDeleteConfirmation";
import { PagingData } from "@/@types/paging-data";
import { api } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CollectionsView = () => {
  const navigate = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<
    Collection | undefined
  >();
  const [pagingData, setPagingData] = useState<PagingData>({
    total: 0,
    page: 1,
    size: 10,
  });

  const { data: user } = api.users.getMe.useQuery();

  const { data, isLoading, isFetching, refetch } =
    api.collections.fetchAllCollections.useQuery({
      page: pagingData.page,
      size: pagingData.size,
      query: searchValue,
    });

  const { mutate: modifyCollection } =
    api.collections.updateCollection.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const onCloseDialog = () => {
    setShowDialog(false);
    setShowDeleteDialog(false);
  };

  const onPageChange = (v: number) => {
    setPagingData((prev) => ({
      ...prev,
      pageIndex: v,
    }));
  };

  const onSelectChange = (v: number) => {
    setPagingData((prev) => ({
      ...prev,
      pageSize: v,
      pageIndex: 1,
    }));
  };

  const onRefresh = () => {
    refetch();
  };

  const onDelete = (v: Collection) => {
    setSelectedCollection(v);
    setShowDeleteDialog(true);
  };

  const onChangePublished = (v: Collection) => {
    if (user)
      modifyCollection({
        id: v.id,
        updated_by: user.id,
        status: v.status === "Published" ? "Unpublished" : "Published",
        updated_at: new Date(),
      });
  };

  useEffect(() => {
    if (data) {
      setPagingData((prev) => ({
        ...prev,
        total: data.total ?? 0,
      }));
    }
  }, [data]);

  return (
    <div className="space-y-5">
      <CollectionsTableHeader onAddNew={() => setShowDialog(true)} />
      <CollectionsTableSearchTool onChange={(v) => setSearchValue(v)} />
      <CollectionTable
        pagingData={pagingData}
        data={data?.data ?? []}
        isLoading={isLoading || isFetching}
        onChangePublished={onChangePublished}
        onDelete={onDelete}
        onEdit={(v) => navigate.push(`${v.id}/${v.type}`)}
        onPageChange={onPageChange}
        onSelectChange={onSelectChange}
      />
      <Dialog open={showDialog === true} onOpenChange={onCloseDialog}>
        <DialogContent>
          <DialogTitle>Choose New Collection Category</DialogTitle>
          <div className="space-y-5 w-full">
            <div>
              <Button
                className="w-full"
                onClick={() => navigate.push("collections/add-new/book")}
              >
                Books
              </Button>
            </div>
            <div>
              <Button
                className="w-full"
                onClick={() => navigate.push("collections/add-new/podcast")}
              >
                Podcasts
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {selectedCollection && (
        <CollectionDeleteConfirmation
          dialogOpen={showDeleteDialog}
          collection_id={selectedCollection.id}
          onClose={onCloseDialog}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default CollectionsView;
