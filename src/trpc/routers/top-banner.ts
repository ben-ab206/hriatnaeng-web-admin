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
  uploadTopBannerImage: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        filePath: z.string(), // Ensure this expects a base64 string
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { fileName, filePath } = input;

      const { error } = await ctx.supabase.storage
        .from("store") 
        .upload(`top_banners/${fileName}`, Buffer.from(filePath, "base64"), {
          contentType: "image/png",
        });

      if (error) throw error;

      const { data: urlData } = ctx.supabase.storage
        .from("store")
        .getPublicUrl(`top_banners/${fileName}`);

      return { url: urlData.publicUrl };
    }),
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
      const { data: top_banner, error: topBannerError } = await ctx.supabase
        .from(TABLE_TOP_BANNERS)
        .select("image_path")
        .eq("id", input)
        .single();

      if (topBannerError) {
        throw new Error(`Failed to fetch top banner: ${topBannerError.message}`);
      }

      if (top_banner?.image_path) {
        const urlParts = top_banner.image_path.split("/store/top_banners/"); 
        if (urlParts.length > 1) {
          const filename = `top_banners/${urlParts[1]}`;
          const { error } = await ctx.supabase.storage
            .from("store")
            .remove([filename]);

          if (error) throw error;
        }
      }

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
      const { data: selectImage, error: selectImageError } = await ctx.supabase
        .from(TABLE_TOP_BANNERS)
        .select("image_path")
        .neq("image_path", input.image_path)
        .limit(1) // Ensure only one row is fetched
        .maybeSingle();
      
      if (selectImageError) {
        throw new Error(`Failed to fetch IMage : ${selectImageError.message}`);
      }

      const deleteImage = async (imagePath: string) => {
        const urlParts = imagePath.split("/store/top_banners/");
        if (urlParts.length > 1) {
          const filename = `top_banners/${urlParts[1]}`;
          const { error } = await ctx.supabase.storage
            .from("store")
            .remove([filename]);

          if (error) throw error;
        }
      };
      
      if (selectImage?.image_path) {
        await deleteImage(selectImage.image_path);
      } 
      
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
