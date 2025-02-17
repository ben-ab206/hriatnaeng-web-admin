import { TABLE_PODCASTS } from "@/constants/tables.constant";
import { protectedProcedure, router } from "../server";
import { z } from "zod";
import { Podcast } from "@/@types/podcast";

export const podcastsRouter = router({
  // without pagingation
  getPodcastContent: protectedProcedure
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
        .from(TABLE_PODCASTS)
        .select("*")
        .eq("status", "active")
        .or(`title.ilike.%${input.query}%,title_mizo.ilike.%${input.query}%`);

      if (error) {
        console.error("Error fetching books:", error);
        throw error;
      }

      return data as Podcast[];
    }),
});
