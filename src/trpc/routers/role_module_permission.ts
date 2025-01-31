import { TABLE_ROLE_MODULE_PERMISSIONS } from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import { z } from "zod";
import { RoleModulePermissons } from "@/@types/role-module-permissions";
import {
  createRoleModulePermissionSchema,
  updateRoleModulePermissonSchema,
} from "../schema/role-module-permission-schema";

export const roleModulePermissionRouter = router({
  getRoleModulePermissions: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from(TABLE_ROLE_MODULE_PERMISSIONS)
      .select("*");

    if (error) throw error;
    return data as RoleModulePermissons[];
  }),
  getRoleModulePermissonById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_ROLE_MODULE_PERMISSIONS)
        .select("*")
        .eq("id", input)
        .single();

      if (error) throw error;
      return data as RoleModulePermissons;
    }),

  getRoleModulePermissonByModule: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_ROLE_MODULE_PERMISSIONS)
        .select("*")
        .eq("module", input);

      if (error) throw error;
      return data as RoleModulePermissons[];
    }),

  updateRoleModulePermission: protectedProcedure
    .input(updateRoleModulePermissonSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_ROLE_MODULE_PERMISSIONS)
        .update(input)
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw error;
      return data as RoleModulePermissons;
    }),
  insertRoleModulePermission: protectedProcedure
    .input(createRoleModulePermissionSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_ROLE_MODULE_PERMISSIONS)
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data as RoleModulePermissons;
    }),
});
