import { useRef, useState, useMemo, useEffect } from "react";
import FormSectionItem from "./FormContentItem";
import { IoIosClose } from "react-icons/io";
import { FormItem } from "../StaticTypes";
import { Book } from "@/@types/book";
import _ from "lodash";
import { Loader2Icon } from "lucide-react";
import { api } from "@/trpc/client";
import { Input } from "@/components/ui/input";

interface SelectMoviesShowsListProps {
  onActionClick: (item: FormItem) => void;
  selectedItems: FormItem[];
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

const NewBooksList = ({
  onActionClick,
  selectedItems,
}: SelectMoviesShowsListProps) => {
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

  const { data: all_books, isFetching: isFetchingAllBooksContent } =
    api.books.fetchBooksContent.useQuery({
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

  const isIncluded = (newItem: FormItem) =>
    selectedItems.some((item) => item.id === newItem.id);

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
              isLoading={isFetchingAllBooksContent}
              showXIcon={query !== ""}
              onClick={handleClear}
            />
          }
          onChange={handleInputChange}
        />
      </div>
      <div>
        {all_books?.map(
          (book: Book, idx: number) =>
            !isIncluded({
              id: book.id,
              title: book.title,
              type: "book",
            }) && (
              <FormSectionItem
                key={idx}
                isAdded={false}
                item={{
                  id: book.id,
                  title: book.title,
                  type: "book",
                  image_path: book.cover_path,
                }}
                onActionClick={() => {
                  onActionClick({
                    id: book.id,
                    title: book.title,
                    type: "book",
                    image_path: book.cover_path,
                  });
                  setQuery("");
                  setDebouncedQuery("");
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
              />
            )
        )}
      </div>
    </div>
  );
};

export default NewBooksList;
