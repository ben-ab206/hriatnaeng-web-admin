import { z } from "zod";

const newAdminSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "name is required",
  }),
  role_id: z.string().min(1, {
    message: "role_id is required",
  }),
  email: z.string().email().min(1, {
    message: "email is required",
  }),
});

const updateUserProfileSchema = z.object({
  id: z.number().min(1, { message: "id is required"}),
  name: z.string().optional(),
  phone_number: z.string().optional(),
  profile_path: z.string().optional()
});

export { newAdminSchema, updateUserProfileSchema };
