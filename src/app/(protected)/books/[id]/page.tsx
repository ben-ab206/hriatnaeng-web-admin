"use client";

import { useState } from "react";
import BookForm from "../BookForm";
import { api } from "@/trpc/client";
import { usePathname, useRouter } from "next/navigation";
import {
  AudioContentModel,
  BookContentModel,
  InformationFormModel,
} from "../StaticTypes";
import { Option } from "@/@types/option";
import { LanguageType } from "@/@types/language";
import {
  convertFileToBase64,
  generateTimestamp,
  getFileExtension,
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils";
import { Loading } from "@/components/shared";

const BookEdit = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useRouter();
  const pathname = usePathname();

  const { mutateAsync: uploadFile } = api.fileUpload.fileUpload.useMutation();
  const { mutateAsync: removeFile } =
    api.fileUpload.removeFileFromSupabse.useMutation();
  const { mutateAsync: updateBook } = api.books.updateBook.useMutation();
  const { mutateAsync: deletePeople } =
    api.people.deleteContentPeopleRelationByBookId.useMutation();
  const { mutateAsync: createPeopleRelation } =
    api.people.insertContentPeopleRelation.useMutation();
  const { mutateAsync: createCategoryRelation } =
    api.categories.insertCOntentCategoriesRelation.useMutation();
  const { mutateAsync: deleteCategories } =
    api.categories.deleteContentCategoriesRelationByBookId.useMutation();
  const { mutateAsync: createAudio } = api.audios.insertAudio.useMutation();
  const { mutateAsync: createBookContent } =
    api.bookContents.insertBookContent.useMutation();
  const { mutateAsync: updateBookContent } =
    api.bookContents.updateContentBooking.useMutation();
  const { mutateAsync: updateAudio } = api.audios.updateAudio.useMutation();

  const id = (() => {
    const pathParts = pathname.split("/").filter(Boolean);
    return parseInt(pathParts[pathParts.length - 1]);
  })();

  const { data: user } = api.users.getMe.useQuery();

  const {
    data: book,
    isLoading,
    isFetching,
  } = api.books.fetchBookDetails.useQuery(id);

  const onSave = async ({
    id,
    language,
    information,
    audioContentForm = [],
  }: {
    id?: number;
    language: LanguageType;
    information: InformationFormModel;
    audioContentForm: AudioContentModel[];
  }) => {
    setSubmitting(true);

    try {
      if (!id) throw new Error("Your book id is invalid.");
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

      if (information.cover_path) {
        await removeFile({
          file_path: information.cover_path,
        });
      }

      if (!user) {
        return;
      }

      const updated_book = await updateBook({
        updated_by: user.id,
        id: id,
        language: language,
        title: information.title,
        about: information.about,
        background_color: information.background_color,
        cover_path: uploadedCover?.publicUrl,
        price_model: information.price_model,
        read_duration: Number(information.read_duration),
        subtitle: information.subtitle,
      });

      await deletePeople(updated_book.id);

      if (information.author && information.author.length > 0) {
        information.author.map(async (au) => {
          await createPeopleRelation({
            people_id: Number(au.value),
            book_id: updated_book.id,
          });
        });
      }

      if (information.translator && information.translator.length > 0) {
        information.translator.map(async (au) => {
          await createPeopleRelation({
            people_id: Number(au.value),
            book_id: updated_book.id,
          });
        });
      }

      if (information.categories && information.categories.length > 0) {
        await deleteCategories(updated_book.id);
        information.categories.map(async (c) => {
          await createCategoryRelation({
            category_id: Number(c.value),
            book_id: updated_book.id,
          });
        });
      }

      if (audioContentForm.length > 0) {
        audioContentForm.map(async (audio) => {
          let publicUrl = audio.file_path ?? "";
          if (audio.audio_file) {
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
            publicUrl = audioFile.publicUrl;
          }

          if (audio.id && typeof audio.id === "number") {
            const updated_audio = await updateAudio({
              file_path: publicUrl,
              name: audio.name,
              id: Number(audio.id),
            });

            audio.content_data.map(async (cd) => {
              if (cd.id && typeof cd.id === "number") {
                await updateBookContent({
                  audio_id: updated_audio.id,
                  book_id: updated_book.id,
                  content: cd.content,
                  updated_by: user.id,
                  label: cd.label,
                  start_time: cd.start_time,
                  title: cd.title,
                  id: Number(cd.id),
                });
              } else {
                await createBookContent({
                  audio_id: updated_audio.id,
                  book_id: updated_book.id,
                  content: cd.content,
                  created_by: user.id,
                  label: cd.label,
                  start_time: cd.start_time,
                  title: cd.title,
                });
              }
            });
          } else {
            const new_audio = await createAudio({
              file_path: publicUrl,
              name: audio.name,
            });

            audio.content_data.map(async (cd) => {
              await createBookContent({
                audio_id: new_audio.id,
                book_id: updated_book.id,
                content: cd.content,
                created_by: user.id,
                label: cd.label,
                start_time: cd.start_time,
                title: cd.title,
              });
            });
          }
        });
      }
      showSuccessToast("Updated Book information.");
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
      <span className="text-2xl font-bold">Edit Book</span>
      <Loading loading={isLoading || isFetching}>
        <BookForm
          initialAudiosData={
            book?.audios?.map(
              (au) =>
                ({
                  content_data: au.book_contents,
                  name: au.name,
                  file_path: au.file_path,
                  id: au.id,
                } as AudioContentModel)
            ) ?? []
          }
          initialBookContentsData={
            book?.book_contents?.map(
              (bc) =>
                ({
                  content: bc.content,
                  label: bc.label,
                  start_time: bc.start_time,
                  title: bc.title,
                  id: bc.id,
                } as BookContentModel)
            ) ?? []
          }
          initialDataOfBook={
            book
              ? {
                  price_model: book.price_model,
                  language: book.language,
                  published: book.published,
                  subtitle: book.subtitle ?? "",
                  title: book.title,
                  about: book.about,
                  author: book.authors?.map(
                    (au) =>
                      ({
                        value: String(au.id),
                        label: au.name,
                        image: au.image_path,
                      } as Option)
                  ),
                  background_color: book.background_color,
                  categories: book.categories?.map(
                    (c) =>
                      ({
                        value: String(c.id),
                        label: c.name,
                        image: c.image_path,
                      } as Option)
                  ),
                  content_type: book.content_type,
                  cover_image: [
                    {
                      id: book.cover_path,
                      name: book.cover_path.split("/")[
                        book.cover_path.split("/").length - 1
                      ],
                      url: book.cover_path,
                    },
                  ],
                  cover_path: book.cover_path,
                  read_duration: book.read_duration,
                  id: book.id,
                  translator: book.translators?.map(
                    (t) =>
                      ({
                        value: String(t.id),
                        label: t.name,
                        image: t.image_path,
                      } as Option)
                  ),
                }
              : undefined
          }
          isSubmitting={submitting}
          onDiscard={() => navigate.back()}
          onSubmit={onSave}
        />
      </Loading>
    </div>
  );
};

export default BookEdit;
