import { newAdminSchema } from "@/trpc/schema/admin.schema";
import { z } from "zod";

export type PagingData = {
    total: number
    pageIndex: number
    pageSize: number
}

export type SortKeys =
    | 'created_at'

export type SortData = {
    created_at: string
}

export type NewAdminType = z.infer<typeof newAdminSchema>;