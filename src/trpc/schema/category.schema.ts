import { z } from "zod";

const newCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, {
        message: "name is required",
    }),
    description: z.string().optional(),
    image: z.string().optional(),
    filePath: z.string().optional(),
    parent_id: z.number().optional(),
    created_by: z.number().optional(),
});

export { newCategorySchema };
