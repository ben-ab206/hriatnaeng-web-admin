import { z } from "zod";

const addTopBannerSchema = z.object({
  page: z.string().min(1, { message: "page is required" }),
  order_number: z.number().min(1, { message: "order_number is required" }),
  book_id: z.number().optional(),
  image_path: z.string().optional(),
  podcast_id: z.number().optional(),
  created_by: z.number().min(1, { message: "created_by is required" }),
});

const updateTopBannerSchema = z.object({
  id: z.number().min(1, { message: "id is required" }),
  order_number: z.number().min(1, { message: "order_number is required" }),
  image_path: z.string().optional(),
  updated_by: z.number().min(1, { message: "updated_by is required" }),
  updated_at: z.date().optional(),
});

export { addTopBannerSchema, updateTopBannerSchema };
