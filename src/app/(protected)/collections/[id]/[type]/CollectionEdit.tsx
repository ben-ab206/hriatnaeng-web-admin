"use client";

import { useEffect, useState } from "react";
import { Loading } from "@/components/shared";
import { FormItem, FormModel } from "../../StaticTypes";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/client";
import CollectionForm from "../../CollectionForm";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { usePathname } from "next/navigation";

const CollectionEdit = () => {
  const [collectionData, setCollectionData] = useState<FormModel>();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [collectionId, setCollectionId] = useState<number | null>(null);
  const navigate = useRouter();
  const pathname = usePathname();

  // Extract ID from pathname
  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    const id = pathParts[pathParts.length - 2];
    const category = pathParts[pathParts.length - 1];
    setCategory(category);

    if (id) {
      setCollectionId(+id);
    }
  }, [pathname]);

  // Move hooks to component level
  const { data: user } = api.users.getMe.useQuery();

  const { data: collection, isLoading: isCollectionLoading } =
    api.collections.fetchCollection.useQuery(
      { id: collectionId as number },
      { enabled: !!collectionId }
    );

  const { data: contentCollections, isLoading: isContentLoading } =
    api.collections.fetchContentCollectionByCollectionId.useQuery(
      { id: collectionId as number },
      { enabled: !!collectionId }
    );

  const { mutate: updateCollection } =
    api.collections.updateCollection.useMutation();

  const { mutate: deleteContentCollectionInSpecificCollection } =
    api.collections.deleteContentCollectionInSpecificCollection.useMutation();

  const { mutate: addContentCollection } =
    api.collections.addContentCollection.useMutation();

  // Process data when collection and contentCollections are loaded
  useEffect(() => {
    if (
      !isCollectionLoading &&
      !isContentLoading &&
      collection &&
      contentCollections
    ) {
      // Create a temporary array with order_number
      const tempItems: FormItem[] = [];

      // Add books with order_number to the temporary array
      if (contentCollections.books) {
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

      // Add podcasts with order_number to the temporary array
      if (contentCollections.podcasts) {
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
        id: collection.id,
        name: collection.name ?? "",
        items: tempItems,
      });

      setLoading(false);
    }
  }, [collection, contentCollections, isCollectionLoading, isContentLoading]);

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
      showErrorToast("Updating collection failed.");
    }
  };

  return (
    <Loading loading={loading || isCollectionLoading || isContentLoading}>
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
