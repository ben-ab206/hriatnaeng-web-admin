import { z } from "zod";

const newPeopleSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, {
        message: "name is required",
    }),
    people_role_id: z.number().optional(),
    date_of_birth: z.union([z.date(), z.null()]).optional(),
    date_of_death: z.union([z.date(), z.null()]).optional(),
    nationality: z.string().optional(),
    biography: z.string().optional(),
    website: z.string().optional(),
    email: z.string().optional(),
    image_path: z.string().optional(),
    filePath: z.string().optional(),
    created_by: z.number().optional(),

});

export { newPeopleSchema };
