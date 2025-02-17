"use client";

import TopBannerItems from "./TopBannerItems";
import { useEffect, useState } from "react";
import { Loading, StickyFooter } from "@/components/shared";
import { Button } from "@/components/ui/button";
import AddButtonBooks from "./components/AddButtonBooks";
import AddButtonPodcasts from "./components/AddButtonPodcasts";
import NewBooksList from "./NewBooksList";
import NewPodcastsList from "./NewPodcastsList";
import { TopBanner } from "@/@types/top-banner";
import { api } from "@/trpc/client";

interface TopBannerFormProps {
  pageType: string;
  query: string;
}

const TopBannerForm = ({ pageType, query }: TopBannerFormProps) => {
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
            await updateBanner.mutateAsync({
              id: item.id,
              order_number: idx + 1,
              updated_at: new Date(),
              updated_by: user.id,
            });
          } else {
            await addBanner.mutateAsync({
              created_by: user?.id,
              page: item.page,
              order_number:
                pageType === "home" ? idx + 1 : largestSortOrder ?? 0 + 1,
              book_id: item.book_id,
              podcast_id: item.podcast_id,
            });
          }
        })
      );
    }
    refetch();
    setAddNewType(undefined);
    setSubmitting(false);
  };

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
          onActionClick={(idx) => {
            setFormData((prev) => prev.filter((_, i) => i !== idx));
          }}
        />
      </Loading>
      {addNewType === undefined && (
        <div className="space-y-5">
          {(pageType === "home" || pageType === "books") && (
            <AddButtonBooks onActionNew={() => setAddNewType("books")} />
          )}

          {(pageType === "home" || pageType === "podcasts") && (
            <AddButtonPodcasts onAddNew={() => setAddNewType("podcasts")} />
          )}
        </div>
      )}
      {addNewType === "books" && (
        <NewBooksList
          pageType={pageType}
          selectedTopBanners={formData}
          onActionClick={(v) => setFormData((prev) => [...prev, v])}
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
        stickyClass="border-t border-gray-800"
      >
        <div className="flex flex-row space-x-3 items-center">
          <Button
            className="bg-gray-600"
            size={"lg"}
            type="button"
            onClick={() => refetch()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size={"lg"}
            loading={submitting}
            onClick={handleSubmit}
          >
            <span className="text-white">Save</span>
          </Button>
        </div>
      </StickyFooter>
    </div>
  );
};

export default TopBannerForm;
