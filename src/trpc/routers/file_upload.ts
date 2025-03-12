import { protectedProcedure, router } from "../server";
import { z } from "zod";

const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  content: z.string(),
});

export const fileRouter = router({
  fileUpload: protectedProcedure
    .input(
      z.object({
        file: fileSchema,
        file_path: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { file, file_path } = input;

      const base64Data = file.content.includes("base64,")
        ? file.content.split("base64,")[1]
        : file.content;

      const fileBuffer = Buffer.from(base64Data, "base64");

      const { data, error: uploadError } = await ctx.supabase.storage
        .from("store")
        .upload(`${file_path}`, fileBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = await ctx.supabase.storage
        .from("store")
        .getPublicUrl(data?.path || "");

      const publicUrl = publicUrlData?.publicUrl || "";
      const id = data.id;

      return { publicUrl, id } as { publicUrl: string; id: string };
    }),

  removeFileFromSupabse: protectedProcedure
    .input(
      z.object({
        file_path: z.string().min(1, "file_path is required."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.storage
        .from("stores")
        .remove([input.file_path]);

      if (error) {
        throw new Error(`Error removing file: ${error.message}`);
      }
    }),

  deleteFile: protectedProcedure
    .input(
      z.object({
        bucketName: z.string().min(1, "bucketName is required"),
        filePath: z.string().min(1, "file Path is required."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.storage
        .from(input.bucketName)
        .remove([input.filePath]);

      if (error) throw error.message;
    }),
});
