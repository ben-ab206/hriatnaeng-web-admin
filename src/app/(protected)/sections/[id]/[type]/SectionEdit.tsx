"use client";

import { useEffect, useState } from "react";
import { FormModel, SectionFormItem } from "../../StaticTypes";
import { Loading } from "@/components/shared";
import SectionForm from "../../SectionForm";
import { usePathname, useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { api } from "@/trpc/client";
import { Status } from "@/@types/status";
import { Book } from "@/@types/book";
import { Podcast } from "@/@types/podcast";

type CategoryType = "book" | "podcast";

interface ContentSections {
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
}

const SectionEdit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<CategoryType>("book");
  const navigate = useRouter();
  const pathname = usePathname();

  // Extract section ID from pathname
  const sectionId = (() => {
    const pathParts = pathname.split("/").filter(Boolean);
    return parseInt(pathParts[pathParts.length - 2]);
  })();

  // TRPC queries and mutations
  const { data: section, isLoading: isSectionLoading } =
    api.sections.fetchSection.useQuery(
      { id: sectionId },
      { enabled: !!sectionId }
    );

  const { data: mediaSections, isLoading: isMediaSectionsLoading } =
    api.sections.fetchContentSectionBySectionId.useQuery(
      { section_id: sectionId },
      { enabled: !!sectionId }
    );

  const { mutateAsync: updateSection } = api.sections.updateSection.useMutation(
    {
      onError: (error) => {
        showErrorToast(
          `Failed to update section: ${
            error.message || "Unknown error occurred"
          }`
        );
      },
    }
  );

  const { mutateAsync: deleteContentSections } =
    api.sections.deleteMediaSectionsInSpecificSection.useMutation({
      onError: (error) => {
        showErrorToast(
          `Failed to delete existing content: ${
            error.message || "Unknown error occurred"
          }`
        );
      },
    });

  const { mutateAsync: addContentSection } =
    api.sections.addContentSection.useMutation({
      onError: (error) => {
        showErrorToast(
          `Failed to add content: ${error.message || "Unknown error occurred"}`
        );
      },
    });

  // Transform data for the form
  const formData: FormModel | undefined =
    section && mediaSections
      ? {
          id: section.id,
          name: section.name,
          items: getSortedItems(mediaSections),
        }
      : undefined;

  // Helper function to sort and transform media items
  function getSortedItems(mediaSections: ContentSections): SectionFormItem[] {
    const tempItems: { order_number: number; item: SectionFormItem }[] = [];

    // Add books
    if (mediaSections.books) {
      mediaSections.books.forEach((m) => {
        if (m?.book) {
          tempItems.push({
            order_number: m.order_number,
            item: {
              id: m.book.id,
              title: m.book.title,
              type: "book",
            },
          });
        }
      });
    }

    // Add podcasts
    if (mediaSections.podcasts) {
      mediaSections.podcasts.forEach((m) => {
        if (m?.podcast) {
          tempItems.push({
            order_number: m.order_number,
            item: {
              id: m.podcast.id,
              title: m.podcast.title,
              type: "podcast",
            },
          });
        }
      });
    }

    // Sort by order_number and return just the items
    return tempItems
      .sort((a, b) => a.order_number - b.order_number)
      .map((entry) => entry.item);
  }

  const handleSubmit = async (values: FormModel) => {
    if (!values.id || !values.name) return;

    setIsSubmitting(true);
    try {
      // Update section name
      await updateSection({
        id: values.id,
        name: values.name,
      });

      // Delete existing content sections
      await deleteContentSections({ section_id: values.id });

      // Add new content sections
      if (values.items?.length) {
        const sectionId = values.id;
        await Promise.all(
          values.items.map((item, idx) =>
            addContentSection({
              section_id: sectionId,
              book_id: item.type === "book" ? item.id : undefined,
              podcast_id: item.type === "podcast" ? item.id : undefined,
              order_number: idx + 1,
            })
          )
        );
      }

      showSuccessToast("Section updated successfully.");
      navigate.back();
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to update section. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update category from pathname
  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] as CategoryType;
    if (lastPart === "book" || lastPart === "podcast") {
      setCategory(lastPart);
    }
  }, [pathname]);

  const isLoading = isSectionLoading || isMediaSectionsLoading;

  return (
    <Loading loading={isLoading}>
      {formData && (
        <SectionForm
          category={category}
          initialData={formData}
          onFormSubmit={handleSubmit}
          onDiscard={() => navigate.back()}
          isSubmitting={isSubmitting}
        />
      )}
    </Loading>
  );
};

export default SectionEdit;
