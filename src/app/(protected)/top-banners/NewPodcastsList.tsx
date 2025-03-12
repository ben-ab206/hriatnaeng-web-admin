"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import TopBannerItem from "./_components/TopBannerItem";
import _ from "lodash";
import { TopBanner } from "@/@types/top-banner";
import { Podcast } from "@/@types/podcast";
import { LucideLoader2 } from "lucide-react";
import { api } from "@/trpc/client";
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { generateTimestamp } from "@/lib/utils";

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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isSelectPodcast, setIsSelectPodcast] = useState(false)
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    
    
    

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
    setIsSelectPodcast(true)
    setSelectedPodcast(p)
    // onActionClick({
    //   page: "podcasts",
    //   podcast_id: p.id,
    //   podcasts: p,
    // } as TopBanner);
    setQuery("");
    setDebouncedQuery("");

  };

  const AddNewValue = (p: Podcast) => {
    onActionClick( {
      page: "podcasts",
      podcast_id: p.id,
      podcasts: p,
      image: {
        fileName: imageName,
        filePath: selectedImage,
      }
    } as TopBanner)
    setIsSelectPodcast(false)
    setSelectedPodcast(null)
    setSelectedImage(null)
  }

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        const fileExt = file.name.split(".").pop();
        const filePath = `${generateTimestamp()}.${fileExt}`
        setImageName(filePath)
      }
    };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <button
          onClick={triggerFileInput}
          className="w-10 h-10 flex items-center justify-center border-2 border-dotted border-gray-400 rounded-md"
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt="Selected"
              width={24}
              height={24} 
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            // <Image size={24} className="text-gray-500" />
            <Image
              src={'/icons/image-icon.png'}
              width={24}
              height={24} 
              alt="Preview"
              className="cursor-pointer"
              unoptimized
            />
          )}
        </button>

        <input
          type="file"
          accept="image/*"
          ref={(el) => {
            fileInputRef.current = el; // Assign without returning anything
          }}
          onChange={handleImageSelect}
          className="hidden"
        />
        {isSelectPodcast ? (
          <div
            className="flex flex-row flex-1 py-3 px-3 items-center justify-between my-2 rounded-[8px] border border-[#D2DAE5] cursor-pointer"
            onClick={() => {
                // onActionClick();
              
            }}
          >
            <div className="flex flex-row items-center">
              <div className="flex flex-row space-x-2">
                <span className="pl-3 text-[16px] font-normal">
                { selectedPodcast ? selectedPodcast.title  : null}
                </span>
              </div>
            </div>
          </div>
        ) : (
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
                {query !== "" && (
                  <span
                    className="cursor-pointer absolute right-12 text-red-500"
                    onClick={() => setQuery("")}
                  >
                    <AiOutlineClose fontWeight="900" />
                  </span>
                )}
              </div>
            }
            onChange={handleInputChange}
          />
        )}
        <Button
          className="bg-[#EBEEF3] text-[#1F2532] rounded-sm"
          size={"sm"}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            // onActionClick();'
            if (selectedPodcast) {
              AddNewValue(selectedPodcast);
            }
          }}
        >
          Add
        </Button>
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
                    image: {
                      fileName: imageName,
                      filePath: selectedImage,
                    },
                    image_path: ""
                  } as TopBanner
                }
                isAdded={false}
                isEdit={false}
                onActionClick={() => onSelectPodcast(podcast)}
              />
            )
        )}
      </div>
    </div>
  );
};

export default NewPodcastsList;
