import {
  TABLE_COLLECTIONS,
  TABLE_CONTENT_COLLECTIONS_RELATION,
} from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import {
  createCollectionSchema,
  createContentCollectionRelationSchema,
  updateCollectionSchema,
} from "../schema/collection.schema";
import { z } from "zod";
import { Collection, ContentCollectionRelation } from "@/@types/collection";
import {
  GET_ALL_COLLECTIONS,
  GET_COLLECTION_DETAILS,
} from "@/constants/functions.constant";

export const collectionsRouter = router({
  addCollection: protectedProcedure
    .input(createCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_COLLECTIONS)
        .insert([input])
        .select()
        .single();

      if (error) {
        console.error("Error inserting new section:", error.message);
        throw new Error(error.message);
      }

      return data as Collection;
    }),
  updateCollection: protectedProcedure
    .input(updateCollectionSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_COLLECTIONS)
        .update(input)
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        console.error(error);
        throw error.message;
      }
      return data as Collection;
    }),

  fetchCollection: protectedProcedure
    .input(z.object({ id: z.number().min(1, { message: "id is required" }) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_COLLECTIONS)
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        console.error(error);
        throw error.message;
      }

      return data as Collection;
    }),

  fetchContentCollectionByCollectionId: protectedProcedure
    .input(z.object({ id: z.number().min(1, { message: "id is required" }) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.rpc(GET_COLLECTION_DETAILS, {
        p_id: input.id,
      });
      if (error) {
        console.error(error);
        throw error.message;
      }
      if (!data || data.length === 0) {
        console.warn(
          "No collection details found for the given collection ID:",
          input
        );
        return null;
      }
      return data[0] as Collection;
    }),
  deleteContentCollectionInSpecificCollection: protectedProcedure
    .input(z.number().min(1, { message: "id is required" }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_CONTENT_COLLECTIONS_RELATION)
        .delete()
        .eq("collection_id", input);

      if (error) {
        console.error(error);
        throw error.message;
      }
      return null;
    }),

  deleteCollection: protectedProcedure
    .input(z.number().min(1, { message: "id is required" }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_COLLECTIONS)
        .delete()
        .eq("id", input);

      if (error) {
        console.error(error);
        throw error.message;
      }
      return null;
    }),

  fetchAllCollections: protectedProcedure
    .input(
      z.object({
        query: z.string().optional().default(""),
        page: z.number().optional().default(1),
        size: z.number().optional().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.rpc(GET_ALL_COLLECTIONS, {
        query: input.query === "" ? null : input.query,
        page: input.page,
        size: input.size,
      });

      if (error) {
        console.error(error);
        throw error.message;
      }
      const totalCount = data.length > 0 ? data[0].total : 0;
      return {
        data: data as Collection[],
        total: totalCount as number,
      };
    }),
  addContentCollection: protectedProcedure
    .input(createContentCollectionRelationSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_CONTENT_COLLECTIONS_RELATION)
        .insert([input])
        .select()
        .single();

      if (error) {
        console.error(error);
        throw error.message;
      }
      return data as ContentCollectionRelation;
    }),
});
