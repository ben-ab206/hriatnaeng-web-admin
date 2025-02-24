"use client";

import { Role } from "@/@types/role";
import { RoleModulePermissons } from "@/@types/role-module-permissions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PERMISSIONS } from "@/constants/permissons";
import { formatRole, showErrorToast, showSuccessToast } from "@/lib/utils";
import { api } from "@/trpc/client";
import { useState } from "react";

interface SelectionPermissionProps {
  roles: Role[];
  role_module_permissions: RoleModulePermissons[];
  module: string;
  isOpen: boolean;
  onClose: () => void;
  refetchRoleModulePermissions: () => void;
}

const SelectionPermission = ({
  roles,
  role_module_permissions,
  module,
  isOpen,
  onClose,
  refetchRoleModulePermissions,
}: SelectionPermissionProps) => {
  const [statePermission, setStatePermission] = useState<
    RoleModulePermissons[]
  >(role_module_permissions);

  const { data: user } = api.users.getMe.useQuery();

  const { mutateAsync: insertPermission, isPending: isInserting } =
    api.roleModulePermissons.insertRoleModulePermission.useMutation();
  const { mutateAsync: updatePermission, isPending: isUpdating } =
    api.roleModulePermissons.updateRoleModulePermission.useMutation();

  const handleCheck = ({
    id,
    role_id,
    checked,
    value,
  }: {
    id: number;
    role_id: number;
    value: number;
    checked: boolean;
  }) => {
    if (!user?.id) return;

    const roleModulePermission = statePermission.find((item) => item.id === id);
    if (roleModulePermission) {
      setStatePermission((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                permissions: checked
                  ? p.permissions | value
                  : p.permissions & ~value,
              }
            : p
        )
      );
    } else {
      setStatePermission((prev) => [
        ...prev,
        {
          id,
          module,
          permissions: value,
          role_id,
          created_by: user.id,
        },
      ]);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      for (const permission of statePermission) {
        if (permission.id === 0) {
          await insertPermission({
            module: permission.module,
            role_id: permission.role_id,
            permissions: permission.permissions,
            created_by: permission.created_by,
          });
        } else {
          await updatePermission({
            id: permission.id,
            permissions: permission.permissions,
            updated_by: user.id,
          });
        }
      }
      onClose();
      refetchRoleModulePermissions();
      showSuccessToast("Permissions saved successfully!");
    } catch (error) {
      console.error("Failed to save permissions:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      showErrorToast(`Failed to save permissions: ${errorMessage}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant or Update Permissions for Roles</DialogTitle>
          <p className="text-sm text-muted-foreground">Module: {module}</p>
        </DialogHeader>
        <div className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Insert</TableHead>
                <TableHead>Update</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => {
                const permissions = statePermission.find(
                  (permission) =>
                    permission.role_id === role.id &&
                    permission.module === module
                );

                const permissionValue = permissions?.permissions ?? 0;

                return (
                  <TableRow key={role.id}>
                    <TableCell>{formatRole(role.name)}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={!!(permissionValue & PERMISSIONS.VIEW)}
                        onCheckedChange={(checked) =>
                          handleCheck({
                            id: permissions?.id ?? 0,
                            checked: checked === true,
                            role_id: role.id,
                            value: PERMISSIONS.VIEW,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={!!(permissionValue & PERMISSIONS.INSERT)}
                        onCheckedChange={(checked) =>
                          handleCheck({
                            id: permissions?.id ?? 0,
                            checked: checked === true,
                            role_id: role.id,
                            value: PERMISSIONS.INSERT,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={!!(permissionValue & PERMISSIONS.UPDATE)}
                        onCheckedChange={(checked) =>
                          handleCheck({
                            id: permissions?.id ?? 0,
                            checked: checked === true,
                            role_id: role.id,
                            value: PERMISSIONS.UPDATE,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={!!(permissionValue & PERMISSIONS.DELETE)}
                        onCheckedChange={(checked) =>
                          handleCheck({
                            id: permissions?.id ?? 0,
                            checked: checked === true,
                            role_id: role.id,
                            value: PERMISSIONS.DELETE,
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex flex-row w-full justify-end items-center">
            <Button loading={isInserting || isUpdating} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectionPermission;
