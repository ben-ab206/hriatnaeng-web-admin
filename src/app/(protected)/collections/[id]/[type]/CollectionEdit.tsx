"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/shared";
import { FormItem, FormModel } from "../../StaticTypes";
import { useRouter } from "next/router";
import { api } from "@/trpc/client";
import CollectionForm from "../../CollectionForm";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { usePathname } from "next/navigation";

const CollectionEdit = () => {
  const [collectionData, setCollectionData] = useState<FormModel>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const navigate = useRouter();

  const pathname = usePathname();

  const { data: user } = api.users.getMe.useQuery();

  const { mutate: updateCollection } =
    api.collections.updateCollection.useMutation();

  const {
    mutate: deleteContentCollectionInSpecificCollection
  } = api.collections.deleteContentCollectionInSpecificCollection.useMutation();

  const { mutate: addContentCollection } =
    api.collections.addContentCollection.useMutation();

  const fetchCollectionData = async (id: string) => {
    setLoading(true);

    const { data: collection } = api.collections.fetchCollection.useQuery({
      id: +id,
    });

    const { data: contentCollections } =
      api.collections.fetchContentCollectionByCollectionId.useQuery({
        id: +id,
      });

    // Create a temporary array with order_number
    const tempItems: FormItem[] = [];

    // Add movies with order_number to the temporary array
    if (contentCollections?.books) {
      contentCollections.books.forEach((m) => {
        if (m) {
          tempItems.push({
            id: m.id,
            title: m.title,
            type: "book",
          });
        }
      });
    }

    // Add music videos with order_number to the temporary array
    if (contentCollections?.podcasts) {
      contentCollections.podcasts.forEach((m) => {
        if (m) {
          tempItems.push({
            id: m.id,
            title: m.title,
            type: "podcast",
          });
        }
      });
    }

    setCollectionData({
      id: collection?.id,
      name: collection?.name ?? "",
      items: tempItems,
    });
    setLoading(false);
  };

  const handleSubmit = async (values: FormModel) => {
    try {
      if (values.id && user) {
        await updateCollection({
          id: values.id,
          name: values.name,
          updated_by: user.id,
          updated_at: new Date(),
        });

        await deleteContentCollectionInSpecificCollection(values.id);
      }

      await Promise.all(
        values.items!.map(async (m) => {
          if (values.id) {
            await addContentCollection({
              collection_id: values.id,
              book_id: m.type === "book" ? m.id : undefined,
              podcast_id: m.type === "podcast" ? m.id : undefined,
            });
          }
        })
      );
      showSuccessToast("Collection updated successfully.");
      navigate.back();
    } catch (error) {
      console.error(error);
      showErrorToast("Updating collection is failed.");
    }
  };

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const id = pathParts[pathParts.length - 2];
    const category = pathParts[pathParts.length - 1];
    setCategory(category);

    if (id) fetchCollectionData(id);
  }, [pathname]);

  return (
    <Loading loading={loading}>
      <CollectionForm
        category={category ?? "book"}
        initialData={collectionData}
        onFormSubmit={handleSubmit}
        onDiscard={() => navigate.back()}
      />
    </Loading>
  );
};

export default CollectionEdit;
