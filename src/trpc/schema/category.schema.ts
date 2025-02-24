import { z } from "zod";

const newCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, {
        message: "name is required",
    }),
    description: z.string().optional(),
    // image: z.instanceof(File).nullable().optional(), 
    image: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    parent_id: z.number().optional(),
    created_by: z.number().optional(),
});

export { newCategorySchema };
