"use client";

import { useState, useRef } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/shared";
import TopBannerItem from "./_components/TopBannerItem";
import { TopBanner } from "@/@types/top-banner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generateTimestamp } from "@/lib/utils";

interface TopBannerItemsProps {
  topBanners: TopBanner[];
  pageType: string;
  onActionClick: (idx: number | null, topBanner?: TopBanner | null) => void;
  onOrderChange: (newOrder: TopBanner[]) => void;
  isEdit: boolean;
}

const TopBannerItems = ({
  topBanners,
  pageType,
  onActionClick,
  onOrderChange,
  isEdit,
}: TopBannerItemsProps) => {
  const [isSelectTopbanner, setIsSelectTopbanner] = useState(false);
  // const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedTopbanner, setSelectedTopbanner] = useState<TopBanner | null>(
    null
  );
  const [orderId, setOrderId] = useState<number | null>(null);

  const reorderData = (startIndex: number, endIndex: number) => {
    const newData = [...topBanners];
    const [movedItem] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedItem);
    onOrderChange(newData);
  };

  const handleDragEnd = (result: DropResult) => {
    if (pageType === "home") {
      const { source, destination } = result;
      if (!destination) return;
      reorderData(source.index, destination.index);
    }
  };
  const onSelect = (b: TopBanner, index: number) => {
    if (selectedTopbanner?.id === b.id) {
      // Clear selection
      setOrderId(index);
      setIsSelectTopbanner(false);
      setSelectedTopbanner(null);

      // Remove the selected banner from the list
      // const updatedBanners = topBanners.filter((banner) => banner.id !== b.id);
      // onOrderChange(updatedBanners);
    } else {
      // Select the new banner
      setOrderId(index);
      setIsSelectTopbanner(true);
      setSelectedTopbanner(b);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      const fileExt = file.name.split(".").pop();
      const filePath = `${generateTimestamp()}.${fileExt}`;
      setImageName(filePath);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const UpdateValue = () => {
    if (selectedTopbanner?.book_id) {
      // Prepare the updated top banner with image data
      const updatedTopBanner: TopBanner = {
        page: "books",
        book_id: selectedTopbanner.book_id,
        id: selectedTopbanner.id,
        books: selectedTopbanner.books,
        image: {
          fileName: imageName,
          filePath: selectedImage,
        },
        image_path: "",
      };

      // Update the order with the modified banner
      // const updatedBanners = [...topBanners, updatedTopBanner];
      // onOrderChange(updatedBanners); // Update the state
      onActionClick(orderId, updatedTopBanner);
    } else {
      const updatedTopBanner1: TopBanner = {
        page: "podcasts",
        podcast_id: selectedTopbanner?.podcast_id,
        id: selectedTopbanner?.id,
        podcasts: selectedTopbanner?.podcasts,
        image: {
          fileName: imageName,
          filePath: selectedImage,
        },
        image_path: "",
      };
      onActionClick(orderId, updatedTopBanner1);
    }

    setOrderId(null);
    setIsSelectTopbanner(false);
    // setSelectedTopbanner(null);
    setSelectedImage(null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId="item-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {topBanners
              // .filter((banner) => banner.id !== selectedTopbanner?.id )
              // .filter((banner) => !selectedTopbanner || banner.id !== selectedTopbanner.id)
              .map((topBanner, index) => (
                <Draggable
                  // key={topBanner?.id}
                  // draggableId={index.toString()}
                  key={topBanner.id ?? `topBanner-${index}`} // Ensure key is unique
                  draggableId={(
                    topBanner.id ?? `topBanner-${index}`
                  ).toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      <TopBannerItem
                        item={topBanner}
                        pageType={pageType}
                        isAdded={true}
                        onActionClick={(type) => {
                          if (type) {
                            onSelect(topBanner, index);
                          } else {
                            onActionClick(index);
                          }
                        }}
                        isEdit={isEdit}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
            {isSelectTopbanner && (
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
                  ) : selectedTopbanner?.image_path ? (
                    <Image
                      src={selectedTopbanner.image_path}
                      alt="Selected"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover rounded-md"
                      unoptimized
                    />
                  ) : (
                    // <Image size={24} className="text-gray-500" />
                    <Image
                      src={"/icons/image-icon.png"}
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
                    fileInputRef.current = el;
                  }}
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex flex-row flex-1 py-3 px-3 items-center justify-between my-2 rounded-[8px] border border-[#D2DAE5] cursor-pointer">
                  <div className="flex flex-row items-center">
                    <div className="flex flex-row space-x-2">
                      <span className="pl-3 text-[16px] font-normal">
                        {selectedTopbanner?.books?.title
                          ? selectedTopbanner.books?.title
                          : selectedTopbanner?.podcasts?.title}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  className="bg-[#EBEEF3] text-[#1F2532] rounded-sm"
                  size={"sm"}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    // onActionClick();'
                    if (selectedImage) {
                      UpdateValue();
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default TopBannerItems;
