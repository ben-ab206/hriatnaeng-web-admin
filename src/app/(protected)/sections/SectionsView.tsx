"use client";

import { useState } from "react";
import SectionTableHeader from "./_components/SectionsTableHeader";
import SectionTableSearchTool from "./_components/SectionTableSearchTool";
import SectionTable from "./SectionTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SectionsView = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useRouter();

  const { data, isLoading, isFetching, refetch } =
    api.sections.fetchAllSections.useQuery({
      query: searchValue,
    });

  const onCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="space-y-5">
      <SectionTableHeader onAddNew={() => setShowDialog(true)} />
      <SectionTableSearchTool onChange={(v) => setSearchValue(v)} />
      <SectionTable
        data={data ?? []}
        isLoading={isLoading || isFetching}
        onRefresh={()=>refetch()}
      />
      <Dialog open={showDialog} onOpenChange={onCloseDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                Choose New Section Category
                </DialogTitle>
            </DialogHeader>
          <div className="space-y-5 w-full">
            <div>
              <Button
                className="w-full"
                onClick={() => navigate.push("sections/add-new/book")}
              >
                Books
              </Button>
            </div>
            <div>
              <Button
                className="w-full"
                onClick={() => navigate.push("sections/add-new/podcast")}
              >
                Podcasts
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionsView;
