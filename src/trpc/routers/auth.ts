import { User } from "@supabase/supabase-js";
import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from "../schema/auth";
import { router, publicProcedure, protectedProcedure } from "../server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { data: authData, error: authError } =
          await ctx.supabase.auth.signUp({
            email: input.email,
            password: input.password,
          });

        if (authError || !authData.user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: authError?.message || "Failed to create user",
          });
        }

        const { data: userData, error: userError } = await ctx.supabase
          .from("users")
          .insert([
            {
              id: authData.user.id,
              email: input.email,
              name: input.name,
              role: "user",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (userError) {
          await ctx.supabase.auth.admin.deleteUser(authData.user.id);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user profile",
          });
        }

        return {
          user: userData,
          session: authData.session,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during sign up",
          cause: error,
        });
      }
    }),

  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { data: authData, error: authError } =
          await ctx.supabase.auth.signInWithPassword(input);

        if (authError || !authData.user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid email or password",
          });
        }

        const { data: userData, error: userError } = await ctx.supabase
          .from("users")
          .select("*")
          .eq("user_id", authData.user.id)
          .single();

        if (userError) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        if (userData.is_active === false) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Account is inactive. Please contact an administrator.",
          });
        }

        await ctx.supabase.auth.setSession({
          access_token: authData.session!.access_token,
          refresh_token: authData.session!.refresh_token,
        });

        return {
          user: userData,
          session: authData.session,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during sign in",
          cause: error,
        });
      }
    }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const { error } = await ctx.supabase.auth.signOut();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sign out",
        });
      }

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred during sign out",
        cause: error,
      });
    }
  }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { error } = await ctx.supabase.auth.resetPasswordForEmail(
          input.email,
          {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
          }
        );

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send reset password email",
          });
        }

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during password reset request",
          cause: error,
        });
      }
    }),

  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { error } = await ctx.supabase.auth.updateUser({
          password: input.password,
        });

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update password",
          });
        }

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during password update",
          cause: error,
        });
      }
    }),

  getSession: publicProcedure.query(async ({ ctx }) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await ctx.supabase.auth.getSession();

      if (sessionError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get session",
        });
      }

      if (!session?.user) {
        return { user: null, session: null };
      }

      const { data: userData, error: userError } = await ctx.supabase
        .from("users")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .single();

      if (userError) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found",
        });
      }

      return {
        user: userData as User,
        session,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching session",
        cause: error,
      });
    }
  }),

  setSessionByToken: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.supabase.auth.setSession({
          access_token: input.accessToken,
          refresh_token: input.refreshToken,
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while defining session",
          cause: error,
        });
      }
    }),
});
