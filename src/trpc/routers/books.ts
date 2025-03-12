import { TABLE_BOOKS } from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import { z } from "zod";
import { Book } from "@/@types/book";
import {
  GET_ALL_BOOKS,
  GET_ALL_BOOKS_DETAILS,
} from "@/constants/functions.constant";

export const booksRouter = router({
  // without pagingation
  fetchBooksContent: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.query.trim()) {
        return [];
      }
      const { data, error } = await ctx.supabase
        .from(TABLE_BOOKS)
        .select("*")
        .eq("status", "active")
        // .or(`title.ilike.%${input.query}%,title_mizo.ilike.%${input.query}%`);

      if (error) {
        console.error("Error fetching books:", error);
        throw error.message;
      }

      return data as Book[];
    }),
  insertBooks: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required."),
        about: z.string().optional(),
        read_duration: z.number().optional(),
        cover_path: z.string().optional(),
        background_color: z.string().optional(),
        subtitle: z.string().optional(),
        language: z.string().min(1, "language is required."),
        price_model: z.string().optional(),
        created_by: z.number().min(1, "created_by is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_BOOKS)
        .insert(input)
        .select()
        .single();

      if (error) throw error.message;

      return data as Book;
    }),
  fetchAllBooks: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        page: z.number().optional(),
        size: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data = [], error } = await ctx.supabase.rpc(GET_ALL_BOOKS, {
        query: input.query,
        page: input.page,
        size: input.size,
      });

      if (error) throw error.message;
      return {
        data: data as Book[],
        total: data.length > 0 ? (data[0].total as number) : 0,
      };
    }),

  updatePublished: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "id is required"),
        published: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_BOOKS)
        .update({
          published: input.published,
        })
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Book;
    }),
  fetchBookDetails: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const { data: book, error } = await ctx.supabase.rpc(
        GET_ALL_BOOKS_DETAILS,
        {
          p_id: input,
        }
      );

      if (error) throw error;
      return book as Book;
    }),
  updateBook: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, "id is required."),
        title: z.string().optional(),
        about: z.string().optional(),
        read_duration: z.number().optional(),
        cover_path: z.string().optional(),
        background_color: z.string().optional(),
        subtitle: z.string().optional(),
        language: z.string().optional(),
        price_model: z.string().optional(),
        updated_by: z.number().min(1, "updated_by is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_BOOKS)
        .update(input)
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw error.message;

      return data as Book;
    }),
});
