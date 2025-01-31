import { Role } from "./role";

export type User = {
    id: number;
    role_id: number;
    name: string;
    role?: Role,
    created_at: string
    updated_at?: string
    email?: string
}