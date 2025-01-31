"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ModuleName, MODULES } from "@/constants/modules";
import { formatRole } from "@/lib/utils";
import { api } from "@/trpc/client";
import { useState } from "react";
import SelectionPermission from "./components/SelectionPermission";

const PermissionTable = () => {
  const [selectedModule, setSelectModule] = useState<string | undefined>();

  const {
    data: roles = [],
    // isLoading
  } = api.roles.getAdminRoles.useQuery();
  const {
    data: role_module_permissions = [],
    // isLoading: isLoadingRoleModulePermissons,
    refetch: refetchRoleModulePermissions
  } = api.roleModulePermissons.getRoleModulePermissions.useQuery();

  const handleClickRow = (value: string) => {
    setSelectModule(value);
  };

  const onDialogClose = () => {
    setSelectModule(undefined);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            {roles.map((role, idx) => (
              <TableHead key={idx}>{formatRole(role.name)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(MODULES).map((key) => {
            const moduleKey = key as ModuleName;
            return (
              <TableRow
                key={moduleKey}
                onClick={() => handleClickRow(MODULES[moduleKey])}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <TableCell>{moduleKey}</TableCell>
                {roles.map((role, idx) => {
                  const permissions = role_module_permissions.find(
                    (permission) =>
                      permission.role_id === role.id &&
                      permission.module === MODULES[moduleKey]
                  );

                  const permissionValue = permissions?.permissions ?? 0;
                  return (
                    <TableCell key={idx}>
                      {permissionValue & 1 ? "View" : ""}
                      {permissionValue & 2 ? ", Insert" : ""}
                      {permissionValue & 4 ? ", Update" : ""}
                      {permissionValue & 8 ? ", Delete" : ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedModule !== undefined && (
        <SelectionPermission
          roles={roles}
          role_module_permissions={role_module_permissions}
          module={selectedModule}
          isOpen={selectedModule !== undefined}
          refetchRoleModulePermissions={refetchRoleModulePermissions}
          onClose={onDialogClose}
        />
      )}
    </>
  );
};

export default PermissionTable;
