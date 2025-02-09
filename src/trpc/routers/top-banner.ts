import { TABLE_TOP_BANNERS } from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import { z } from "zod";
import { TopBanner } from "@/@types/top-banner";
import { GET_ALL_TOP_BANNERS } from "@/constants/functions.constant";
import {
  addTopBannerSchema,
  updateTopBannerSchema,
} from "../schema/top-banner.schema";

export const topBannerRouters = router({
  getAllTopBanners: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        pageType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.rpc(GET_ALL_TOP_BANNERS, {
        query: input.query,
        _page: input.pageType === "home" ? null : input.pageType,
      });

      if (error) throw error;
      return data as TopBanner[];
    }),
  addTopBanner: protectedProcedure
    .input(addTopBannerSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_TOP_BANNERS)
        .insert([input])
        .select()
        .single();

      if (error) {
        console.error(error);
        throw error;
      }
      return data as TopBanner;
    }),
  deleteBannerById: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_TOP_BANNERS)
        .delete()
        .eq("id", input);

      if (error) {
        console.error(error);
        throw error;
      }
      return null;
    }),
  deleteBannerByPodcastId: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_TOP_BANNERS)
        .delete()
        .eq("podcast_id", input);

      if (error) {
        console.error(error);
        throw error;
      }
      return null;
    }),

  deleteBannerByBookId: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_TOP_BANNERS)
        .delete()
        .eq("book_id", input);

      if (error) {
        console.error(error);
        throw error;
      }
      return null;
    }),

  updateTopBanner: protectedProcedure
    .input(updateTopBannerSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_TOP_BANNERS)
        .update(input)
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        console.error(error);
        throw error.message;
      }
      return data as TopBanner;
    }),

  getMaxSortOrder: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from(TABLE_TOP_BANNERS)
      .select("order_number")
      .order("order_number", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching max sort_order:", error);
      return null;
    }
    return data?.order_number as number;
  }),
});
