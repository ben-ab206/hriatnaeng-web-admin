import { newPeopleSchema } from "@/trpc/schema/people.schema";
import { z } from "zod";

export type SortKeys =
    | 'created_at'
    | 'name'

export type SortData = {
    created_at: string
    name: string
}

export type NewPeopleType = z.infer<typeof newPeopleSchema>;