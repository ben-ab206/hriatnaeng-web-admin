"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import TopBannerItem from "./_components/TopBannerItem";
import _ from "lodash";
import { TopBanner } from "@/@types/top-banner";
import { Podcast } from "@/@types/podcast";
import { LucideLoader2 } from "lucide-react";
import { api } from "@/trpc/client";

interface NewPodcastsListProps {
  onActionClick: (topBanner: TopBanner) => void;
  selectedTopBanners: TopBanner[];
  pageType: string;
}

const NewPodcastsList = ({
  onActionClick,
  selectedTopBanners,
  pageType,
}: NewPodcastsListProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSetQuery = useMemo(
    () =>
      _.debounce((value: string) => {
        setDebouncedQuery(value);
      }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSetQuery(value);
  };

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const { data: all_podcasts, isFetching: isFetchingAllPodcasts } =
    api.podcasts.getPodcastContent.useQuery({
      query: debouncedQuery,
    });

  const isIncluded = (p: Podcast) =>
    selectedTopBanners.some((item) => item.podcast_id === p.id);

  const onSelectPodcast = (p: Podcast) => {
    onActionClick({
      page: "podcasts",
      podcast_id: p.id,
      podcasts: p,
    } as TopBanner);
    setQuery("");
  };

  return (
    <div>
      <div className="flex items-center">
        <Input
          autoFocus
          type="text"
          value={query}
          placeholder="Search"
          className="flex-grow"
          suffix={
            <div className="w-6 h-6 flex items-center justify-center">
              {isFetchingAllPodcasts && (
                <LucideLoader2 size={18} className="animate-spin" />
              )}
            </div>
          }
          onChange={handleInputChange}
        />
        {query !== "" && (
          <span
            className="cursor-pointer absolute right-12 text-red-500"
            onClick={() => setQuery("")}
          >
            <AiOutlineClose fontWeight="900" />
          </span>
        )}
      </div>
      <div>
        {all_podcasts?.map(
          (podcast: Podcast, idx: number) =>
            !isIncluded(podcast) && (
              <TopBannerItem
                key={idx}
                pageType={pageType}
                item={
                  {
                    page: "podcasts",
                    podcast_id: podcast.id,
                    podcasts: podcast,
                  } as TopBanner
                }
                isAdded={false}
                onActionClick={() => onSelectPodcast(podcast)}
              />
            )
        )}
      </div>
    </div>
  );
};

export default NewPodcastsList;
