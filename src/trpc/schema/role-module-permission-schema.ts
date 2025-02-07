import { z } from "zod";

const updateRoleModulePermissonSchema = z.object({
  id: z.number().min(1, { message: "id is required" }),
  module: z.string().optional(),
  role_id: z.number().optional(),
  permissions: z.number().optional(),
  updated_by: z.number().min(1, { message: "updated_by is required" }),
});

const createRoleModulePermissionSchema = z.object({
  module: z.string().min(1, { message: "module is required" }),
  role_id: z.number().min(1, { message: "role_id is required" }),
  permissions: z.number().min(1, { message: "permissions is required" }),
  created_by: z.number().min(1, { message: "created_by is required" }),
});

export { updateRoleModulePermissonSchema, createRoleModulePermissionSchema };
export type UpdateRoleModulePermission = z.infer<typeof updateRoleModulePermissonSchema>;
export type CreateRoleModulePermission = z.infer<typeof createRoleModulePermissionSchema>;
