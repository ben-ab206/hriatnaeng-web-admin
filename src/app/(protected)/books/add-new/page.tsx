"use client";

import { LanguageType } from "@/@types/language";
import BookForm from "../BookForm";
import { AudioContentModel, InformationFormModel } from "../StaticTypes";
import { api } from "@/trpc/client";
import { useState } from "react";
import {
  convertFileToBase64,
  generateTimestamp,
  getFileExtension,
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils";
import { useRouter } from "next/navigation";

const BooksNew = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useRouter();
  const { mutateAsync: uploadFile } = api.fileUpload.fileUpload.useMutation();
  const { mutateAsync: createBook } = api.books.insertBooks.useMutation();
  const { mutateAsync: createAudio } = api.audios.insertAudio.useMutation();
  const { mutateAsync: createBookContent } =
    api.bookContents.insertBookContent.useMutation();
  const { mutateAsync: createPeopleRelation } =
    api.people.insertContentPeopleRelation.useMutation();
  const { mutateAsync: createCategoryRelation } =
    api.categories.insertCOntentCategoriesRelation.useMutation();

  const { data: user } = api.users.getMe.useQuery();

  const onSave = async ({
    language,
    information,
    audioContentForm = [],
  }: {
    language: LanguageType;
    information: InformationFormModel;
    audioContentForm: AudioContentModel[];
  }) => {
    setSubmitting(true);
    try {
      let uploadedCover = undefined;
      if (information.cover_image && information.cover_image[0].file) {
        const base64 = await convertFileToBase64(
          information.cover_image[0].file
        );
        uploadedCover = await uploadFile({
          file: {
            content: base64,
            name: information.cover_image[0].file.name,
            size: information.cover_image[0].file.size,
            type: information.cover_image[0].file.type,
          },
          file_path: `covers/${generateTimestamp()}.${getFileExtension(
            information.cover_image[0].file.name
          )}`,
        });
      }
      if (!user) {
        return;
      }

      const new_book = await createBook({
        created_by: user.id,
        language: language,
        title: information.title,
        about: information.about,
        background_color: information.background_color,
        cover_path: uploadedCover?.publicUrl,
        price_model: information.price_model,
        read_duration: Number(information.read_duration),
        subtitle: information.subtitle,
      });

      if (information.author && information.author.length > 0) {
        information.author.map(async (au) => {
          await createPeopleRelation({
            people_id: Number(au.value),
            book_id: new_book.id,
          });
        });
      }

      if (information.translator && information.translator.length > 0) {
        information.translator.map(async (au) => {
          await createPeopleRelation({
            people_id: Number(au.value),
            book_id: new_book.id,
          });
        });
      }

      if (information.categories && information.categories.length > 0) {
        information.categories.map(async (c) => {
          await createCategoryRelation({
            category_id: Number(c.value),
            book_id: new_book.id,
          });
        });
      }

      if (audioContentForm.length > 0) {
        audioContentForm.map(async (audio) => {
          if (!audio.audio_file) return;

          const base64 = await convertFileToBase64(audio.audio_file);
          const audioFile = await uploadFile({
            file: {
              content: base64,
              name: audio.audio_file.name,
              size: audio.audio_file.size,
              type: audio.audio_file.type,
            },
            file_path: `audios/${generateTimestamp()}.${getFileExtension(
              audio.audio_file.name
            )}`,
          });

          const new_audio = await createAudio({
            file_path: audioFile.publicUrl,
            name: audio.name,
          });

          audio.content_data.map(async (cd) => {
            await createBookContent({
              audio_id: new_audio.id,
              book_id: new_book.id,
              content: cd.content,
              created_by: user.id,
              label: cd.label,
              start_time: cd.start_time,
              title: cd.title,
            });
          });
        });
      }
      showSuccessToast("Book data inserted successfully.");
      navigate.back();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      showErrorToast(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col">
      <span className="text-2xl font-bold">Add Book</span>
      <BookForm
        isSubmitting={submitting}
        onSubmit={onSave}
        onDiscard={() => navigate.back()}
      />
    </div>
  );
};

export default BooksNew;
