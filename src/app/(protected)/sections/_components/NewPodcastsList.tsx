import { useRef, useState, useMemo, useEffect } from "react";
import FormSectionItem from "./FormSectionItem";
import { IoIosClose } from "react-icons/io";
import { Podcast } from "@/@types/podcast";
import { SectionFormItem } from "../StaticTypes";
import _ from "lodash";
import { Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/client";

interface NewPodcastsListProps {
  onActionClick: (item: SectionFormItem) => void;
  selectedItems: SectionFormItem[];
}

const SuffixIcons = ({
  isLoading,
  showXIcon,
  onClick,
}: {
  isLoading: boolean;
  showXIcon: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="flex flex-row space-x-2">
      {isLoading && <Loader2Icon size={18} className="animate-spin" />}
      {showXIcon && (
        <IoIosClose size={20} className="text-red-500" onClick={onClick} />
      )}
    </div>
  );
};

const NewPodcastsList = ({
  onActionClick,
  selectedItems,
}: NewPodcastsListProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSetQuery = useMemo(
    () =>
      _.debounce((value: string) => {
        setDebouncedQuery(value);
      }, 500),
    []
  );

  const { data, isFetching } = api.podcasts.getPodcastContent.useQuery({
    query: debouncedQuery,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSetQuery(value);
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isIncluded = (newMusic: SectionFormItem) =>
    selectedItems.some((item) => item.id === newMusic.id);

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  return (
    <div>
      <div className="flex items-center">
        <Input
          ref={inputRef}
          autoFocus
          type="text"
          value={query}
          placeholder="Search"
          className="flex-grow"
          suffix={
            <SuffixIcons
              isLoading={isFetching}
              showXIcon={query !== ""}
              onClick={handleClear}
            />
          }
          onChange={handleInputChange}
        />
      </div>
      <div>
        {data?.map(
          (podcast: Podcast, idx: number) =>
            !isIncluded({
              id: podcast.id,
              title: podcast.title,
              type: "podcast",
            }) && (
              <FormSectionItem
                key={idx}
                isAdded={false}
                item={{
                  id: podcast.id,
                  title: podcast.title,
                  type: "podcast",
                }}
                onActionClick={() =>
                  onActionClick({
                    id: podcast.id,
                    title: podcast.title,
                    type: "podcast",
                  })
                }
              />
            )
        )}
      </div>
    </div>
  );
};

export default NewPodcastsList;
