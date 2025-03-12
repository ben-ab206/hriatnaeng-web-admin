"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import TopBannerItem from "./_components/TopBannerItem";
import _ from "lodash";
import { TopBanner } from "@/@types/top-banner";
import { Book } from "@/@types/book";
import { LucideLoader2 } from "lucide-react";
import { api } from "@/trpc/client";
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { generateTimestamp } from "@/lib/utils";



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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSelectBook, setIsSelectBook] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const debouncedSetQuery = useMemo(
    () =>
      _.debounce((value: string) => {
        setDebouncedQuery(value);
      }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value)
    setQuery(value);
    debouncedSetQuery(value);
  };

  const { data: all_books, isFetching: isFetchingAllBooksContent } =
    api.books.fetchBooksContent.useQuery({
      query: debouncedQuery,
    });

  const isIncluded = (b: Book) =>
    selectedTopBanners.some((item) => item.book_id === b.id);

  const onSelectBook = (b: Book) => {
    setIsSelectBook(true)
    setSelectedBook(b)
    setQuery("");
    setDebouncedQuery("");
  };

  const AddNewValue = (b: Book) => {
    onActionClick({
        page: "books",
        book_id: b.id,
        books: b,
        image: {
          fileName: imageName,
          filePath: selectedImage,
        }
      } as TopBanner);
      setIsSelectBook(false);
      setSelectedBook(null)
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

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

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
        {isSelectBook ? (

        <div
          className="flex flex-row flex-1 py-3 px-3 items-center justify-between my-2 rounded-[8px] border border-[#D2DAE5] cursor-pointer"
          onClick={() => {
              // onActionClick();
            
          }}
        >
          <div className="flex flex-row items-center">
            <div className="flex flex-row space-x-2">
              <span className="pl-3 text-[16px] font-normal">
              { selectedBook ? selectedBook.title  : null}
              </span>
            </div>
          </div>
        </div>
        ): (
          <Input
            autoFocus
            type="text"
            value={query}
            placeholder="Search"
            className="flex-grow"
            suffix={
              <div className="flex flex-row space-x-2">
                {isFetchingAllBooksContent && (
                  <LucideLoader2
                    size={18}
                    className="animate-spin text-gray-400"
                  />
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
        ) }
        
        <Button
          className="bg-[#EBEEF3] text-[#1F2532] rounded-sm"
          size={"sm"}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            // onActionClick();'
            if (selectedBook) {
              AddNewValue(selectedBook);
            }
          }}
        >
          Add
        </Button>
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
                  image: {
                    fileName : imageName,
                    filePath: selectedImage,
                  },
                  image_path: ""
                }}
                isAdded={false}
                pageType={pageType}
                onActionClick={() => onSelectBook(book)}
                isEdit={false}
              />
            )
        )}
      </div>
    </div>
  );
};

export default NewBooksList;
