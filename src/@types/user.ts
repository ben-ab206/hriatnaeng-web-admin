import { Role } from "./role";

export type User = {
  id: number;
  role_id: number;
  phone_number?: string;
  name: string;
  roles?: Role;
  created_at: string;
  updated_at?: string;
  email?: string;
  is_active: boolean;
  profile_path?: string;
};
