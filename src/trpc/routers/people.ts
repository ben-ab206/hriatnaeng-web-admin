import { z } from "zod";
import { protectedProcedure, router } from "../server";
import {
  TABLE_CONTENT_PEOPLE_RELATION,
  TABLE_PEOPLE,
  TABLE_PEOPLE_ROLES,
} from "@/constants/tables.constant";
import { People } from "@/@types/people";

export const peopleRouter = router({
  uploadPeopleImage: protectedProcedure
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
        .upload(`people/${filePath}`, Buffer.from(file, "base64"), {
          contentType: "image/png",
        });

      if (error) throw error;

      // Return the public URL
      const { data: urlData } = ctx.supabase.storage
        .from("store")
        .getPublicUrl(`people/${filePath}`);

      return { url: urlData.publicUrl };
    }),
  getPeopleRole: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from(TABLE_PEOPLE_ROLES)
      .select("*");

    if (error) throw error;

    return data;
  }),
  getPeople: protectedProcedure
    .input(
      z.object({
        query: z.string().optional().default(""),
        page: z.number().optional().default(1),
        size: z.number().optional().default(10),
        sort_by_created_at: z.enum(["asc", "desc"]).optional().default("desc"),
        sort_by_name: z.enum(["asc", "desc"]).optional().default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, page, size, sort_by_created_at, sort_by_name } = input;

      let queryBuilder = ctx.supabase
        .from(TABLE_PEOPLE)
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

      return { data: data as People[], total: count ?? 0 };
    }),
  getAllCAtegories: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase.from(TABLE_PEOPLE).select("*");

    if (error) throw error;

    return data as People[];
  }),
  createPeople: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image_path: z.string().nullable().optional(),
        people_role_id: z.number().nullable().optional(),
        date_of_birth: z.date().nullable().optional(), // Allow null or undefined
        date_of_death: z.date().nullable().optional(),
        nationality: z.string(),
        biography: z.string(),
        website: z.string(),
        email: z.string(),
        created_by: z.number().optional().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_PEOPLE)
        .insert([input])
        .select("*")
        .single();

      if (error) throw error;
      return data;
    }),

  updatePeople: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        image_path: z.string().nullable().optional(),
        people_role_id: z.number().nullable().optional(),
        date_of_birth: z.union([z.date(), z.string(), z.null()]).optional(),
        date_of_death: z.union([z.date(), z.string(), z.null()]).optional(),
        nationality: z.string(),
        biography: z.string(),
        website: z.string(),
        email: z.string(),
        updated_by: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const { data: currentPerson, error: fetchError } = await ctx.supabase
        .from(TABLE_PEOPLE)
        .select("image_path")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(
          `Failed to fetch current person: ${fetchError.message}`
        );
      }

      const deleteImage = async (imagePath: string) => {
        const urlParts = imagePath.split("/store/people/");
        if (urlParts.length > 1) {
          const filename = `people/${urlParts[1]}`;
          const { error } = await ctx.supabase.storage
            .from("store")
            .remove([filename]);

          if (error) throw error;
        }
      };

      if (currentPerson?.image_path) {
        await deleteImage(currentPerson.image_path);
      }

      const { data: updatedPerson, error: updateError } = await ctx.supabase
        .from(TABLE_PEOPLE)
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();

      if (updateError) throw updateError;
      return updatedPerson;
    }),

  deletePeople: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletePeople = async (people: { id: number }) => {
        const { data: relations, error: relationError } = await ctx.supabase
          .from("content_people_relation")
          .select("*")
          .eq("people_id", people.id);

        if (relationError) throw relationError;

        if (relations.length === 0) {
          return await deletePeopleAndImage(people.id);
        }

        for (const relation of relations) {
          const isInactive = await checkInactiveStatus(relation);
          if (isInactive) {
            await deleteRelation(relation.people_id);
            return await deletePeopleAndImage(people.id);
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

      const deleteRelation = async (peopleId: number) => {
        const { error } = await ctx.supabase
          .from("content_people_relation")
          .delete()
          .eq("category_id", peopleId);

        if (error) throw error;
      };

      const deletePeopleAndImage = async (peopleId: number) => {
        const { data: peopleData, error: fetchError } = await ctx.supabase
          .from("people")
          .select("image_path")
          .eq("id", peopleId)
          .single();

        if (fetchError) throw fetchError;

        if (peopleData?.image_path) {
          await deleteImage(peopleData.image_path);
        }

        const { error: deleteError } = await ctx.supabase
          .from(TABLE_PEOPLE)
          .delete()
          .eq("id", peopleId);

        if (deleteError) throw deleteError;
        return true;
      };

      const deleteImage = async (imagePath: string) => {
        const urlParts = imagePath.split("/store/people/");
        if (urlParts.length > 1) {
          const filename = `people/${urlParts[1]}`;
          const { error } = await ctx.supabase.storage
            .from("store")
            .remove([filename]);

          if (error) throw error;
        }
      };

      return await deletePeople(input);
    }),

  getPeopleByRoleName: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { data: role } = await ctx.supabase
        .from(TABLE_PEOPLE_ROLES)
        .select("*")
        .eq("name", input)
        .single();
      if (!role) throw new Error("There is no author roles");
      const { data = [], error } = await ctx.supabase
        .from(TABLE_PEOPLE)
        .select("*")
        .eq("people_role_id", role.id);

      if (error) throw error;
      return data as People[];
    }),

  insertContentPeopleRelation: protectedProcedure
    .input(
      z.object({
        book_id: z.number().optional(),
        podcast_id: z.number().optional(),
        people_id: z.number().min(1, "people_id is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(TABLE_CONTENT_PEOPLE_RELATION)
        .insert(input)
        .select()
        .single();
      if (error) throw error.message;
      return data;
    }),
  deleteContentPeopleRelationByBookId: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from(TABLE_CONTENT_PEOPLE_RELATION)
        .delete()
        .eq("book_id", input);

      if (error) throw error.message;
    }),
});
