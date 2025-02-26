"use client";

import { useEffect, useState } from "react";
import AdministratorHeader from "./_components/AdministratorHeader";
import AdministratorHeaderTools from "./_components/AdministratorHeaderTools";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AdministratorForm from "./AdministratorForm";
import { NewAdminType } from "./StaticTypes";
import { User } from "@/@types/user";
import { api } from "@/trpc/client";
import AdministratorTable from "./AdministratorTable";
import { PagingData } from "@/@types/paging-data";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { ConfirmDialog } from "./_components/ConfirmDialog";

const AdministratorsView = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toEditItem, setToEditItem] = useState<User | undefined>();
  const [toRemoveItem, setToRemoveItem] = useState<User | undefined>();
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

  const { mutateAsync: updateAdminInfo, isPending: isUpdating } =
    api.users.updateUserInfo.useMutation({
      onSuccess: async () => {
        refetch();
        onDialogClose();
      },
      onError: (error) => {
        showErrorToast(error.message);
      },
    });

  const onDialogClose = () => {
    setShowDialog(false);
    setToRemoveItem(undefined);
  };

  const onPageChange = (v: number) => {
    setPagingData((prev) => ({
      ...prev,
      page: v,
    }));
  };

  const onSelectChange = (v: number) => {
    setPagingData((prev) => ({
      ...prev,
      size: v,
      page: 1,
    }));
  };

  const handleSave = async (values: NewAdminType) => {
    if (values.id) {
      await updateAdminInfo({
        id: values.id,
        role_id: +values.role_id,
      });
      showSuccessToast("Successfully updated user role");
    } else {
      await createAdminUser({
        email: values.email,
        name: values.name,
        role_id: parseInt(values.role_id),
      });
      showSuccessToast("Successfully invited user");
    }
  };

  const handleOnDelete = async () => {
    if (toRemoveItem && toRemoveItem.id)
      await updateAdminInfo({
        id: toRemoveItem.id,
        is_active: false,
      });
    showSuccessToast("Successfully deactivated user");
  };

  useEffect(() => {
    if (admin_users?.total !== undefined) {
      setPagingData((prev) => ({
        ...prev,
        total: admin_users.total,
      }));
    }
  }, [admin_users?.total]);

  useEffect(() => {
    refetch();
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
        onEdit={(v) => {
          setToEditItem(v);
          setShowDialog(true);
        }}
        onDelete={(v) => setToRemoveItem(v)}
      />
      <Dialog open={showDialog === true} onOpenChange={onDialogClose}>
        <DialogContent>
          <DialogTitle>
            {toEditItem ? `Edit ${toEditItem.name}` : "New Administrator"}
          </DialogTitle>
          <AdministratorForm
            loading={isPending || isUpdating}
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
            onClose={onDialogClose}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={toRemoveItem !== undefined}
        onClick={handleOnDelete}
        onClose={onDialogClose}
        loading={isUpdating}
      />
    </div>
  );
};

export default AdministratorsView;
