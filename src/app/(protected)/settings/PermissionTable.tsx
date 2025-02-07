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
import { Eye, Plus, Pencil, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const PermissionTable = () => {
  const { data: roles = [] } = api.roles.getAdminRoles.useQuery();
  const { data: role_module_permissions = [] } = api.roleModulePermissons.getRoleModulePermissions.useQuery();
  
 
  const { toast } = useToast();y

  const view = () => {

    toast({
      title: "View",
      description: "This is view",
      duration: 1000,
      className: "border-sky-300",
    });
  };

  const Add = () => {

    toast({
      title: "Success",
      description: "This is Add",
      duration: 1000,
      className: "border-green-500",
    });
  };

  return (
    <div className="p-6 w-full  overflow-auto space-y-5">
      <h2 className="text-xl font-medium">Settings</h2>
      <Table className="min-w-full border border-gray-200 table-fixed">
        <TableHeader>
          <TableRow className="border-b border-gray-300">
            <TableHead className="text-left p-3 w-1/4">Module</TableHead>
            {roles.map((role, idx) => (
              <TableHead key={idx} className="text-center p-3 w-1/6">
                {formatRole(role.name)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(MODULES).map((key) => {
            const moduleKey = key as ModuleName;
            return (
              <TableRow key={moduleKey} className="border-b border-gray-300">
                <TableCell className="font-semibold p-3 w-1/4 break-words">{moduleKey}</TableCell>
                {roles.map((role, idx) => {
                  const permissions = role_module_permissions.find(
                    (permission) =>
                      permission.role_id === role.id &&
                      permission.module === MODULES[moduleKey]
                  );

                  const permissionValue = permissions?.permissions ?? 0;
                  return (
                    <TableCell key={idx} className="p-3 text-center w-1/6">
                      <div
                        className={`grid ${
                          [1, 2, 4, 8].filter((val) => permissionValue & val).length === 1
                            ? "grid-cols-1"
                            : "grid-cols-2"
                        } gap-1 items-center justify-center`}
                      >
                        {permissionValue & 1 ? (
                          <div className="p-1 border border-gray-300 rounded flex items-center justify-center">
                            <Eye onClick={view} className="w-5 h-5 text-blue-400 cursor-pointer" />
                          </div>
                        ) : null}
                        {permissionValue & 2 ? (
                          <div className="p-1 border border-gray-300 rounded flex items-center justify-center">
                            <Plus onClick={Add} className="w-5 h-5 text-green-400" />
                          </div>
                        ) : null}
                        {permissionValue & 4 ? (
                          <div className="p-1 border border-gray-300 rounded flex items-center justify-center">
                            <Pencil className="w-5 h-5 text-yellow-400" />
                          </div>
                        ) : null}
                        {permissionValue & 8 ? (
                          <div className="p-1 border border-gray-300 rounded flex items-center justify-center">
                            <Trash className="w-5 h-5 text-red-400" />
                          </div>
                        ) : null}
                      </div>
                    </TableCell>

                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PermissionTable;
