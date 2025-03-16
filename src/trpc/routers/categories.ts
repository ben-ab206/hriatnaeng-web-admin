import { z } from "zod";
import { protectedProcedure, router } from "../server";
import {
  TABLE_CATEGORIES,
  TABLE_CONTENT_CATEGORY_RELATION,
} from "@/constants/tables.constant";
import { Category } from "@/@types/category";

export const categoriesRouter = router({
  uploadCategoryImage: protectedProcedure
    .input(
      z.object({
        filePath: z.string(),
        file: z.string(), // Ensure this expects a base64 string
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { filePath, file } = input;

      // Upload image to Supabase storage
      const { error } = await ctx.supabase.storage
        .from("store") // Update this with your actual storage bucket name
        .upload(`categories/${filePath}`, Buffer.from(file, "base64"), {
          contentType: "image/png",
        });

      if (error) throw error;

      // Return the public URL
      const { data: urlData } = ctx.supabase.storage
        .from("store")
        .getPublicUrl(`categories/${filePath}`);

      return { url: urlData.publicUrl };
    }),

  getCategories: protectedProcedure
    .input(
      z.object({
        query: z.string().optional().default(""),
        page: z.number().optional().default(1),
        size: z.number().optional().default(10),
        sort_by_created_at: z
          .enum(["asc", "desc", ""])
          .optional()
          .default("desc"),
        sort_by_name: z.enum(["asc", "desc", ""]).optional().default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, page, size, sort_by_created_at, sort_by_name } = input;

      let queryBuilder = ctx.supabase
        .from(TABLE_CATEGORIES)
        .select("*", { count: "exact" })
        .eq("status", "active");

      if (query) queryBuilder = queryBuilder.ilike("name", `%${query}%`);

      const from = (page - 1) * size;
      const to = from + size - 1;
      queryBuilder = queryBuilder.range(from, to);

      if (sort_by_created_at) {
        queryBuilder = queryBuilder.order("created_at", {
          ascending: sort_by_created_at === "asc",
        });
      }

      if (sort_by_name) {
        queryBuilder = queryBuilder.order("name", {
          ascending: sort_by_name === "asc",
        });
      }

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      return { data: data as Category[], total: count ?? 0 };
    }),
  getAllCAtegories: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from(TABLE_CATEGORIES)
      .select("*");

    if (error) throw error;

    return data as Category[];
  }),
  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        image_path: z.string().optional(),
        parent_id: z.number().nullable().optional(),
        created_by: z.number().optional().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_CATEGORIES)
        .insert([input])
        .select("*")
        .single();

      if (error) throw error;
      return data;
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        image_path: z.string().nullable().optional(),
        parent_id: z.number().nullable().optional(),
        updated_by: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const { data, error } = await ctx.supabase
        .from(TABLE_CATEGORIES)
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      return data;
    }),
  getQty: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Change `.mutation` to `.query`
      const { count, error } = await ctx.supabase
        .from(TABLE_CONTENT_CATEGORY_RELATION)
        .select("*", { count: "exact", head: true })
        .eq("category_id", input.id);

      if (error) throw error;
      return count ?? 0; // Return count directly instead of `data`
    }),

  deleteCategory: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteCategory = async (categories: { id: number }) => {
        const { data: relations, error: relationError } = await ctx.supabase
          .from("content_categories_relation")
          .select("*")
          .eq("category_id", categories.id);

        if (relationError) throw relationError;

        if (relations.length === 0) {
          return await deleteCategoryAndImage(categories.id);
        }

        for (const relation of relations) {
          const isInactive = await checkInactiveStatus(relation);
          if (isInactive) {
            await deleteRelation(relation.category_id);
            return await deleteCategoryAndImage(categories.id);
          }
        }

        return false;
      };

      const checkInactiveStatus = async (relation: {
        book_id?: string;
        podcast_id?: string;
      }) => {
        const table = relation.book_id ? "books" : "podcasts";
        const id = relation.book_id || relation.podcast_id;

        const { data, error } = await ctx.supabase
          .from(table)
          .select("status")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data?.status?.toLowerCase() === "inactive";
      };

      const deleteRelation = async (categoryId: number) => {
        const { error } = await ctx.supabase
          .from("content_categories_relation")
          .delete()
          .eq("category_id", categoryId);

        if (error) throw error;
      };

      const deleteCategoryAndImage = async (categoryId: number) => {
        const { data: categoryData, error: fetchError } = await ctx.supabase
          .from("categories")
          .select("image_path")
          .eq("id", categoryId)
          .single();

        if (fetchError) throw fetchError;

        if (categoryData?.image_path) {
          await deleteImage(categoryData.image_path);
        }

        const { error: deleteError } = await ctx.supabase
          .from("categories")
          .delete()
          .eq("id", categoryId);

        if (deleteError) throw deleteError;
        return true;
      };

      const deleteImage = async (imagePath: string) => {
        const urlParts = imagePath.split("/store/categories/");
        if (urlParts.length > 1) {
          const filename = `categories/${urlParts[1]}`;
          const { error } = await ctx.supabase.storage
            .from("store")
            .remove([filename]);

          if (error) throw error;
        }
      };

      return await deleteCategory(input);
    }),
  insertCOntentCategoriesRelation: protectedProcedure
    .input(
      z.object({
        book_id: z.number().optional(),
        podcast_id: z.number().optional(),
        category_id: z.number().min(1, "category_id is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_CONTENT_CATEGORY_RELATION)
        .insert(input)
        .select()
        .single();

      if (error) throw error.message;

      return data;
    }),
  deleteContentCategoriesRelationByBookId: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_CONTENT_CATEGORY_RELATION)
        .delete()
        .eq("book_id", input);

      if (error) throw error.message;
    }),
});
