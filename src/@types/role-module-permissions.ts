import { Role } from "./role";

export type RoleModulePermissons = {
  id: number;
  role_id: number;
  role?: Role;
  module: string;
  permissions: number;
  updated_at?: string;
  created_at?: string;
  created_by: number;
};
