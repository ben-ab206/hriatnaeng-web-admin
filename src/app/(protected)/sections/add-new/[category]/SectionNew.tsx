"use client";

import SectionForm from "../../SectionForm";
import { FormModel } from "../../StaticTypes";
import { useEffect, useState } from "react";
import { Loading } from "@/components/shared";
import { usePathname, useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { api } from "@/trpc/client";

type CategoryType = "book" | "podcast";

const SectionNew = () => {
  const navigate = useRouter();
  const pathname = usePathname();
  const [category, setCategory] = useState<CategoryType | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: addSection, isPending: isAddingSections } =
    api.sections.addSection.useMutation({
      onError: (error) => {
        showErrorToast(
          `Failed to create section: ${
            error.message || "Unknown error occurred"
          }`
        );
      },
    });

  const { mutateAsync: addContentSection, isPending: isAddingContent } =
    api.sections.addContentSection.useMutation({
      onError: (error) => {
        showErrorToast(
          `Failed to add content to section: ${
            error.message || "Unknown error occurred"
          }`
        );
      },
    });

  const handleSubmit = async (values: FormModel) => {
    if (!values.name || !category) return;

    setIsSubmitting(true);
    try {
      // Create the section first
      const newSection = await addSection({
        name: values.name,
        type: category,
      });

      if (!newSection) {
        throw new Error("Failed to create section");
      }

      if (values.items?.length) {
        await Promise.all(
          values.items.map((item, idx) =>
            addContentSection({
              section_id: newSection.id,
              book_id: item.type === "book" ? item.id : undefined,
              podcast_id: item.type === "podcast" ? item.id : undefined,
              order_number: idx + 1,
            })
          )
        );
      }

      showSuccessToast(
        `The section <b>${values.name}</b> has been created and media items have been added successfully.`
      );

      navigate.back();
    } catch (error) {
      console.error(error);
      showErrorToast(
        "Failed to create the section. Please check your inputs and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] as CategoryType;
    if (lastPart === "book" || lastPart === "podcast") {
      setCategory(lastPart);
    }
  }, [pathname]);

  const isLoading = !category || isAddingSections || isAddingContent;

  return (
    <Loading loading={isLoading}>
      {category && (
        <SectionForm
          category={category}
          onFormSubmit={handleSubmit}
          onDiscard={() => navigate.back()}
          isSubmitting={isSubmitting}
        />
      )}
    </Loading>
  );
};

export default SectionNew;
