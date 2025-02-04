import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../server";
import { TABLE_ROLES, TABLE_USERS } from "@/constants/tables.constant";
import { User } from "@/@types/user";

export const usersRouter = router({
  getUser: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { data: user, error } = await ctx.supabase
        .from("users")
        .select("*")
        .eq("id", input)
        .single();

      if (error) throw error;
      return user;
    }),

  getAdminUsers: protectedProcedure
    .input(
      z.object({
        query: z.string().optional().default(""),
        page: z.number().optional().default(1),
        size: z.number().optional().default(10),
        sort_by_created_at: z.enum(["asc", "desc"]).optional().default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, page, size, sort_by_created_at } = input;

      const { data: audienceRole, error: roleError } = await ctx.supabase
        .from(TABLE_ROLES)
        .select("id")
        .eq("name", "audience")
        .single();

      if (roleError) throw roleError;

      let queryBuilder = ctx.supabase
        .from(TABLE_USERS)
        .select("*, roles!inner(*)", { count: "exact" })
        .neq("role_id", audienceRole.id);

      if (query) {
        queryBuilder = queryBuilder.ilike("name", `%${query}%`);
      }

      const from = (page - 1) * size;
      const to = from + size - 1;
      queryBuilder = queryBuilder.range(from, to);

      if (sort_by_created_at) {
        queryBuilder = queryBuilder.order("created_at", {
          ascending: sort_by_created_at === "asc",
        });
      }

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      return { data: data as User[], total: count ?? 0 };
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    const { data: authUser, error } = await ctx.supabase.auth.getUser();

    if (error) throw error;

    const { data: user, error: userError } = await ctx.supabase
      .from(TABLE_USERS)
      .select("*")
      .eq("user_id", authUser.user.id)
      .single();

    if (userError) throw userError;

    return user as User;
  }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("users")
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    }),
});
