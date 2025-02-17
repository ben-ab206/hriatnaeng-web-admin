import CollectionForm from "../../CollectionForm";
import { FormModel } from "../../StaticTypes";
import { useEffect, useState } from "react";
import { Loading } from "@/components/shared";
import { api } from "@/trpc/client";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

const CollectionNew = () => {
  const [category, setCategory] = useState<string | undefined>();
  const router = useRouter();
  const pathname = usePathname();

  const { data: user } = api.users.getMe.useQuery();

  const { mutate: addCollection, isPending } =
    api.collections.addCollection.useMutation({
      onSuccess: () => {
        showSuccessToast("The collection has been created successfully.");
        router.back();
      },
      onError: () => {
        showErrorToast("Failed to create the collection. Please try again.");
      },
    });

  const {
    mutate: addContentCollection,
    isPending: isLoadingContentCollection,
  } = api.collections.addContentCollection.useMutation();

  const handleSubmit = (values: FormModel) => {
    if (!user) return;

    addCollection(
      {
        name: values.name,
        type: category ?? "",
        created_by: user.id,
      },
      {
        onSuccess: (newCollection) => {
          if (newCollection && values.items?.length) {
            Promise.all(
              values.items.map((m) =>
                addContentCollection({
                  collection_id: newCollection.id,
                  book_id: m.type === "book" ? m.id : undefined,
                  podcast_id: m.type === "podcast" ? m.id : undefined,
                })
              )
            ).then(() => {
              showSuccessToast(
                `The collection <b>${values.name}</b> has been created and media items have been added successfully.`
              );
            });
          }
        },
      }
    );
  };

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    setCategory(pathParts[pathParts.length - 1]);
  }, [pathname]);

  return (
    <Loading loading={category === undefined}>
      <CollectionForm
        category={category ?? "book"}
        isSubmitting={isPending || isLoadingContentCollection}
        onFormSubmit={handleSubmit}
        onDiscard={() => router.back()}
      />
    </Loading>
  );
};

export default CollectionNew;
