"use client";

import TopBannerItems from "./TopBannerItems";
import { useEffect, useState } from "react";
import { Loading, StickyFooter } from "@/components/shared";
import { Button } from "@/components/ui/button";
import AddButtonBooks from "./_components/AddButtonBooks";
import AddButtonPodcasts from "./_components/AddButtonPodcasts";
// import AddButtonCollections from "./_components/AddButtonCollections" 
import NewBooksList from "./NewBooksList";
import NewPodcastsList from "./NewPodcastsList";
import { TopBanner } from "@/@types/top-banner";
import { api } from "@/trpc/client";

interface TopBannerFormProps {
  pageType: string;
  query: string;
  isEdit: boolean;
}

const TopBannerForm = ({ pageType, query, isEdit }: TopBannerFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<TopBanner[]>([]);
  const [addNewType, setAddNewType] = useState<
    "books" | "podcasts" | undefined
  >(undefined);

  const { data: user } = api.users.getMe.useQuery();

  const { data: largestSortOrder } = api.topBanner.getMaxSortOrder.useQuery();

  const { data, isLoading, refetch, isFetching } =
    api.topBanner.getAllTopBanners.useQuery({
      pageType,
      query,
    });

  const deleteBanner = api.topBanner.deleteBannerById.useMutation();
  const updateBanner = api.topBanner.updateTopBanner.useMutation();
  const addBanner = api.topBanner.addTopBanner.useMutation();
  const uploadImage = api.topBanner.uploadTopBannerImage.useMutation();

  const handleSubmit = async () => {
    setSubmitting(true);
    const removedItems =
      data?.filter(
        (oldItem) => !formData.some((newItem) => newItem.id === oldItem.id)
      ) ?? [];

    await Promise.all(
      removedItems.map(async (toRemove) => {
        if (toRemove.id) {
          await deleteBanner.mutateAsync(toRemove.id);
        }
      })
    );

    if (user) {
      await Promise.all(
        formData.map(async (item, idx) => {
          if (item.id) {
            let image;
            if (item.image && item.image.fileName && item.image.filePath) {
              const updateFileName = item.image.fileName
              const updateResponse = await fetch(item.image.filePath)
              const updateBlob = await updateResponse.blob()
              const updatebast64 = await convertBlobToBase64(updateBlob)
              image = await uploadImage.mutateAsync({
                fileName: updateFileName,
                filePath: updatebast64
              })
            }

            await updateBanner.mutateAsync({
              id: item.id,
              order_number: idx + 1,
              updated_at: new Date(),
              updated_by: user.id,
              image_path:  image?.url || item.image_path
            });
          } else {
            let image;
            if (item.image.fileName && item.image.filePath) {
              const fileName = item.image.fileName
              const response = await fetch(item.image.filePath);
              const blob = await response.blob();
              // const imageUrl = new File([blob], fileName, { type: blob.type }); 

              const base64String = await convertBlobToBase64(blob);
              image = await uploadImage.mutateAsync({
                fileName: fileName,
                filePath: base64String,
              })

            }
            await addBanner.mutateAsync({
              created_by: user?.id,
              page: item.page,
              order_number:
              pageType === "home" ? idx + 1 : largestSortOrder ?? 0 + 1,
              book_id: item.book_id,
              podcast_id: item.podcast_id,
              image_path: image?.url || ''
            });
          }
        })
      );
    }
    refetch();
    setAddNewType(undefined);
    setSubmitting(false);
  };

  function convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1]; // Remove prefix
        if (base64String) resolve(base64String);
        else reject(new Error("Failed to convert blob to base64"));
      };
      reader.onerror = reject;
    });
  }
  
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data, isFetching, isLoading]);

  useEffect(() => {
    if (pageType) setAddNewType(undefined);
  }, [pageType]);

  return (
    <div className="space-y-5">
      <Loading loading={isLoading || isFetching}>
        <TopBannerItems
          topBanners={formData}
          pageType={pageType}
          onOrderChange={(newOrder) => setFormData(newOrder)}
          onActionClick={(idx,topbanner) => {
            if(topbanner) {
              setFormData((prev) => {
                if (!topbanner || !topbanner.id) {
                  return prev;
                }
                const updatedData = prev.map((item) =>
                  item.id === topbanner.id ? { ...item, ...topbanner } : item
                );
                return [...updatedData]; 
              });
              
            }else {
              setFormData((prev) => prev.filter((_, i) => i !== idx));
            }
          }}
          isEdit={isEdit}
        />
      </Loading>
      {isEdit === true && (

        <>
          {addNewType === undefined && (
            <div className="space-y-5">
              {(pageType === "home" || pageType === "books") && (
                <AddButtonBooks onActionNew={() => setAddNewType("books")} />
              )}

              {(pageType === "home" || pageType === "podcasts") && (
                <AddButtonPodcasts onAddNew={() => setAddNewType("podcasts")} />
              )}

              {/* {(pageType === "home" || pageType === "podcasts") && (
                <AddButtonCollections onAddNew={() => setAddNewType("podcasts")} />
              )} */}
            </div>
          )}
          {addNewType === "books" && (
            <NewBooksList
              pageType={pageType}
              selectedTopBanners={formData}
              onActionClick={(v) => {
                setFormData((prev) => [...prev, v])}}
            />
          )}
          {addNewType === "podcasts" && (
            <NewPodcastsList
              pageType={pageType}
              selectedTopBanners={formData}
              onActionClick={(v) => setFormData((prev) => [...prev, v])}
            />
          )}
          <StickyFooter
            className="px-8 flex items-center justify-end py-4"
            stickyClass="border-t border  -gray-800 bg-white"
          >
            <div className="flex flex-row space-x-3 items-center">
              <Button
                className="bg-[#7C94B4] rounded-sm"
                size={"lg"}
                type="button"
                onClick={() => refetch()}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#447AED] rounded-sm"
                type="button"
                size={"lg"}
                loading={submitting}
                onClick={handleSubmit}
              >
                <span className="text-white">Save</span>
              </Button>
            </div>
          </StickyFooter>
        </>
      )}
    </div>
  );
};

export default TopBannerForm;
