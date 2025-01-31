import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../server";
import { TABLE_USERS } from "@/constants/tables.constant";
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
