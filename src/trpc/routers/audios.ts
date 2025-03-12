import { TABLE_AUDIOS } from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import { z } from "zod";
import { Audios } from "@/@types/audios";

export const audioRouter = router({
  insertAudio: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "name is required"),
        description: z.string().optional(),
        file_path: z.string().min(1, "file_path is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_AUDIOS)
        .insert(input)
        .select("*")
        .single();

      if (error) throw error.message;

      return data as Audios;
    }),
  updateAudio: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "id is required"),
        name: z.string().optional(),
        description: z.string().optional(),
        file_path: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_AUDIOS)
        .update(input)
        .eq("id", input.id)
        .select("*")
        .single();

      if (error) throw error.message;

      return data as Audios;
    }),
});
