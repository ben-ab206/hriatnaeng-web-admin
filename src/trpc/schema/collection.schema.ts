import { z } from "zod";

const createCollectionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "name is required" }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "type is required" }),
  created_by: z.number().min(1, { message: "created_by is required" }),
});

const updateCollectionSchema = z.object({
  id: z.number().min(1, { message: "id is required" }),
  name: z.string().optional(),
  description: z.string().optional(),
  updated_at: z.date({ required_error: "updated_at is required" }),
  status: z.string().optional(),
  updated_by: z.number().min(1, { message: "updated_by is required" }),
});

const createContentCollectionRelationSchema = z
  .object({
    book_id: z.number().optional(),
    podcast_id: z.number().optional(),
    collection_id: z.number().min(1, { message: "collection_id is required" }),
  })
  .refine((data) => !(data.book_id && data.podcast_id), {
    message: "Only one of book_id or podcast_id should be provided",
  });

export {
  createCollectionSchema,
  updateCollectionSchema,
  createContentCollectionRelationSchema,
};
