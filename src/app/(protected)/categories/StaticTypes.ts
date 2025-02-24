import { newCategorySchema } from "@/trpc/schema/category.schema";
import { z } from "zod";

export type SortKeys =
    | 'created_at'
    | 'name'

export type SortData = {
    created_at: string
    name: string
}

export type NewCategoryType = z.infer<typeof newCategorySchema>;