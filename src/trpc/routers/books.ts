import { TABLE_BOOKS } from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import { z } from "zod";
import { Book } from "@/@types/book";

export const booksRouter = router({
  // without pagingation
  fetchBooksContent: protectedProcedure
    .input(z.object({
        query: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_BOOKS)
        .select("*")
        .eq("status", "active")
        .or(`title.ilike.%${input.query}%,title_mizo.ilike.%${input.query}%`);

      if (error) {
        console.error("Error fetching books:", error);
        throw error.message;
      }

      return data as Book[];
    }),
});
