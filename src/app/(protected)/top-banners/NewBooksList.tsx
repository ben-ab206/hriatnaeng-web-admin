"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import TopBannerItem from "./components/TopBannerItem";
import _ from "lodash";
import { TopBanner } from "@/@types/top-banner";
import { Book } from "@/@types/book";
import { LucideLoader2 } from "lucide-react";
import { api } from "@/trpc/client";

interface NewBooksListProps {
  onActionClick: (topBanner: TopBanner) => void;
  selectedTopBanners: TopBanner[];
  pageType: string;
}

const NewBooksList = ({
  onActionClick,
  selectedTopBanners,
  pageType,
}: NewBooksListProps) => {
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

  const { data: all_books, isFetching: isFetchingAllBooksContent } =
    api.books.getBooksContent.useQuery({
      query: debouncedQuery,
    });

  const isIncluded = (b: Book) =>
    selectedTopBanners.some((item) => item.book_id === b.id);

  const onSelectBook = (b: Book) => {
    onActionClick({
      page: "books",
      book_id: b.id,
      books: b,
    } as TopBanner);
    setQuery("");
    setDebouncedQuery("");
  };

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

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
            <div className="flex flex-row space-x-2">
              {isFetchingAllBooksContent && (
                <LucideLoader2 size={18} className="animate-spin text-gray-400" />
              )}
              {query !== "" && (
                <span
                  className="cursor-pointer text-red-500"
                  onClick={() => {
                    setQuery("");
                    setDebouncedQuery("");
                  }}
                >
                  <AiOutlineClose fontWeight="900" />
                </span>
              )}
            </div>
          }
          onChange={handleInputChange}
        />
      </div>
      <div>
        {all_books?.map(
          (book: Book, idx: number) =>
            !isIncluded(book) && (
              <TopBannerItem
                key={idx}
                item={{
                  page: "books",
                  book_id: book.id,
                  books: book,
                }}
                isAdded={false}
                pageType={pageType}
                onActionClick={() => onSelectBook(book)}
              />
            )
        )}
      </div>
    </div>
  );
};

export default NewBooksList;
