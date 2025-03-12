import { protectedProcedure, router } from "../server";
import { z } from "zod";
import { TABLE_BOOK_CONTENTS } from "@/constants/tables.constant";
import { BookContents } from "@/@types/book_content";

export const bookContentRouter = router({
  insertBookContent: protectedProcedure
    .input(
      z.object({
        label: z.string().min(1, "label is required"),
        title: z.string().min(1, "title is requied"),
        audio_id: z.number().min(1, "audio_id is required"),
        content: z.string().min(1, "content is required"),
        start_time: z.string().min(1, "start_time is required"),
        created_by: z.number().min(1, "created_by is required"),
        book_id: z.number().min(1, "book_id is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_BOOK_CONTENTS)
        .insert(input)
        .select("*")
        .single();

      if (error) throw error.message;

      return data as BookContents;
    }),
  updateContentBooking: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "id is required"),
        label: z.string().optional(),
        title: z.string().optional(),
        audio_id: z.number().optional(),
        content: z.string().optional(),
        start_time: z.string().optional(),
        updated_by: z.number().min(1, "updated_by is required"),
        book_id: z.number().min(1, "book_id is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_BOOK_CONTENTS)
        .update(input)
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw error.message;

      return data as BookContents;
    }),
  getBookContentsListByBookIdAndAudioId: protectedProcedure
    .input(
      z.object({
        book_id: z.number().min(1, "book_id is required."),
        audio_id: z.number().min(1, "audio_id is required."),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data = [], error } = await ctx.supabase
        .from(TABLE_BOOK_CONTENTS)
        .select("*")
        .eq("book_id", input.book_id)
        .eq("audio_id", input.audio_id);
      if (error) throw error;
      return data as BookContents[];
    }),
});
