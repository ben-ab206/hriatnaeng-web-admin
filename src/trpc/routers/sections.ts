import {
  TABLE_CONTENT_SECTIONS_RELATION,
  TABLE_SECTIONS,
} from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import { z } from "zod";
import {
  GET_ALL_SECTIONS,
  GET_SECTION_DETAILS,
} from "@/constants/functions.constant";
import { Status } from "@/@types/status";
import { Book } from "@/@types/book";
import { Podcast } from "@/@types/podcast";
import {
  createContentSectionRelationSchema,
  createSectionSchema,
  updateSectionSchema,
} from "../schema/section.schema";
import { ContentSectionsRelation, Sections } from "@/@types/section";

export const sectionsRouter = router({
  fetchAllSections: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.rpc(GET_ALL_SECTIONS, {
        query: input.query === "" ? null : input.query,
      });

      if (error) {
        console.error(error);
        throw error.message;
      }
      return data as {
        id: number;
        name: string;
        order_number: number;
        created_at: string;
        status: Status;
        updated_at: string;
        type: string;
        books: Book[];
        podcasts: Podcast[];
      }[];
    }),

  addSection: protectedProcedure
    .input(createSectionSchema)
    .mutation(async ({ ctx, input }) => {
      const { data: latestSection, error: latestSectionError } =
        await ctx.supabase
          .from(TABLE_SECTIONS)
          .select("*")
          .order("order_number", { ascending: false })
          .maybeSingle();

      if (latestSectionError) {
        console.error(
          "Error fetching the latest section:",
          latestSectionError.message
        );
        throw new Error(latestSectionError.message);
      }

      const orderNumber = latestSection ? latestSection.order_number + 1 : 1;

      const tempData = { ...input, order_number: orderNumber };

      const { data, error } = await ctx.supabase
        .from(TABLE_SECTIONS)
        .insert([tempData])
        .select()
        .single();

      if (error) {
        console.error("Error inserting new section:", error.message);
        throw new Error(error.message);
      }

      return data as Sections;
    }),

  addContentSection: protectedProcedure
    .input(createContentSectionRelationSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_CONTENT_SECTIONS_RELATION)
        .insert([input])
        .select()
        .single();

      if (error) {
        console.error(error);
        throw error.message;
      }
      return data as ContentSectionsRelation;
    }),

  updateSection: protectedProcedure
    .input(updateSectionSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_SECTIONS)
        .update(input)
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        console.error(error);
        throw error.message;
      }
      return data as Sections;
    }),

  fetchSection: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1, { message: "id is required" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_SECTIONS)
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        console.error(error);
        throw error.message;
      }

      return data as Sections;
    }),

  fetchContentSectionBySectionId: protectedProcedure
    .input(
      z.object({
        section_id: z.number().min(1, { message: "section_id is required" }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.rpc(GET_SECTION_DETAILS, {
        p_section_id: input.section_id,
      });

      if (error) {
        console.error(error);
        throw error.message;
      }

      if (!data || data.length === 0) {
        console.warn(
          "No section details found for the given section ID:",
          input.section_id
        );
        return null;
      }

      return data[0] as {
        id: number;
        name: string;
        order_number: number;
        created_at: string;
        status: Status;
        type: string;
        updated_at: string;
        books: {
          book: Book;
          order_number: number;
        }[];
        podcasts: {
          podcast: Podcast;
          order_number: number;
        }[];
      };
    }),
  deleteMediaSectionsInSpecificSection: protectedProcedure
    .input(
      z.object({
        section_id: z.number().min(1, { message: "section_id is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_CONTENT_SECTIONS_RELATION)
        .delete()
        .eq("section_id", input.section_id);

      if (error) {
        console.error(error);
        throw error.message;
      }
      return null;
    }),
});
