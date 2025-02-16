"use client";

import { useEffect, useState } from "react";
import AdministratorHeader from "./components/AdministratorHeader";
import AdministratorHeaderTools from "./components/AdministratorHeaderTools";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AdministratorForm from "./AdministratorForm";
import { NewAdminType } from "./StaticTypes";
import { User } from "@/@types/user";
import { api } from "@/trpc/client";
import AdministratorTable from "./AdministratorTable";
import { PagingData } from "@/@types/paging-data";
import { showErrorToast, showSuccessToast } from "@/lib/utils";

const AdministratorsView = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toEditItem, setToEditItem] = useState<User | undefined>();
  const [pagingData, setPagingData] = useState<PagingData>({
    total: 0,
    page: 1,
    size: 10,
  });

  const {
    data: admin_users,
    isLoading,
    refetch,
  } = api.users.getAdminUsers.useQuery({
    query: searchQuery,
    page: pagingData.page,
    size: pagingData.size,
  });

  const { mutateAsync: createAdminUser, isPending } =
    api.users.inviteAdminUser.useMutation({
      onSuccess: async () => {
        refetch();
        onDialogClose();
        showSuccessToast("Successfully invited admin user");
      },
      onError: (error) => {
        showErrorToast(error.message);
      },
    });

  const onDialogClose = () => {
    setShowDialog(false);
  };

  const onPageChange = (v: number) => {
    setPagingData((prev) => ({
        ...prev,
        page: v,
    }))
  }

  const onSelectChange = (v: number) => {
    console.log("Changing page size to:", v);
    setPagingData((prev) => ({
        ...prev,
        size: v,
        page: 1,
    }))
    
}

  const handleSave = async (values: NewAdminType) => {
    await createAdminUser({
      email: values.email,
      name: values.name,
      role_id: parseInt(values.role_id),
    });
  };

  useEffect(() => {
    if (admin_users?.total !== undefined) {
      setPagingData((prev) => ({
        ...prev,
        total: admin_users.total ,
      }));
    }
  }, [admin_users?.total]);

  useEffect(() => {
    refetch(); // Re-fetch data when the page size changes
    console.log("Refetching data with page size:", pagingData.size);
  }, [pagingData.size, refetch]);

  return (
    <div className="space-y-5">
      <AdministratorHeader onClickAddNew={() => setShowDialog(true)} />
      <AdministratorHeaderTools
        searchValue={searchQuery}
        onChangeSearchValue={(v) => setSearchQuery(v)}
      />
      <AdministratorTable
        data={admin_users?.data ?? []}
        pagingData={pagingData}
        loading={isLoading}
        onPageChange={onPageChange}
        onSelectChange={onSelectChange}
        onEdit={(v) => setToEditItem(v)}
        onDelete={(v) => console.info(v)}
      />
      <Dialog open={showDialog === true} onOpenChange={onDialogClose}>
        <DialogContent>
          <DialogTitle>
            {toEditItem ? `Edit ${toEditItem.name}` : "New Administrator"}
          </DialogTitle>
          <AdministratorForm
            loading={isPending}
            initialData={
              toEditItem
                ? ({
                    id: toEditItem.id,
                    email: toEditItem.email,
                    name: toEditItem.name,
                    role_id: toEditItem.role_id.toString(),
                  } as NewAdminType)
                : undefined
            }
            onClickSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdministratorsView;
