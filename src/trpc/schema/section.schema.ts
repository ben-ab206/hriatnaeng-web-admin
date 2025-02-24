import { z } from "zod";

const createSectionSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  type: z.enum(["book", "podcast"]),
});

export type MediaSectionsRelationInsert = {
  book_id?: number;
  podcast_id?: number;
  section_id: number;
  order_number: number;
};

const createContentSectionRelationSchema = z.object({
  section_id: z.number().min(1, { message: "section_id is required" }),
  order_number: z.number().min(1, { message: "order_number is required" }),
  book_id: z.number().optional(),
  podcast_id: z.number().optional(),
});

const updateSectionSchema = z.object({
  id: z.number().min(1, { message: "id is required" }),
  status: z.enum(["active", "inactive"]).optional(),
  name: z.string().optional(),
  updated_at: z.date().optional().default(new Date()),
  order_number: z.number().optional(),
});

export {
  createSectionSchema,
  createContentSectionRelationSchema,
  updateSectionSchema,
};
