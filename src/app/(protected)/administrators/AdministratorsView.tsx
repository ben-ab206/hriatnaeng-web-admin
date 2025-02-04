"use client";

import { useEffect, useState } from "react";
import AdministratorHeader from "./components/AdministratorHeader";
import AdministratorHeaderTools from "./components/AdministratorHeaderTools";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AdministratorForm from "./AdministratorForm";
import { NewAdminType, PagingData } from "./StaticTypes";
import { User } from "@/@types/user";
import { api } from "@/trpc/client";
import AdministratorTable from "./AdministratorTable";

const AdministratorsView = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toEditItem, setToEditItem] = useState<User | undefined>();
  const [pagingData, setPagingData] = useState<PagingData>({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const { data: admin_users, isLoading } = api.users.getAdminUsers.useQuery({
    query: searchQuery,
    page: pagingData.pageIndex,
    size: pagingData.pageSize,
  });

  const onDialogClose = () => {
    setShowDialog(false);
  };

  const handleSave = (values: NewAdminType) => {
    console.log(values);
  };

  useEffect(() => {
    if (admin_users?.total !== undefined) {
      setPagingData((prev) => ({
        ...prev,
        total: admin_users.total,
      }));
    }
  }, [admin_users?.total]);

  return (
    <div className="space-y-5">
      <AdministratorHeader />
      <AdministratorHeaderTools onClickAddNew={() => setShowDialog(true)} />
      <AdministratorTable
        data={admin_users?.data ?? []}
        pagingData={pagingData}
        isLoading={isLoading}
      />
      <Dialog open={showDialog === true} onOpenChange={onDialogClose}>
        <DialogContent>
          <DialogTitle>
            {toEditItem ? `Edit ${toEditItem.name}` : "New Administrator"}
          </DialogTitle>
          <AdministratorForm
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
