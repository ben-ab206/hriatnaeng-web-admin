import { IoIosAddCircleOutline  } from "react-icons/io";
import { CiCircleMinus } from "react-icons/ci";
import { MdDragIndicator } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { TopBanner } from "@/@types/top-banner";
import Image from 'next/image'

interface TopBannerItemProps {
  item: TopBanner;
  isAdded: boolean;
  pageType: string;
  // onActionClick: () => void;
  onActionClick: (type?: string | null) => void;
  isEdit: boolean
}

const TopBannerItem = ({
  item,
  isAdded,
  pageType,
  onActionClick,
  isEdit,
}: TopBannerItemProps) => {
  
  return (
    <div className="flex flex-row items-center justify-between space-x-3">
         
      <div
        className="flex flex-row flex-1 py-3 px-3 items-center justify-between my-2 rounded-[8px] border border-[#D2DAE5] cursor-pointer"
        onClick={() => {
          if (!isAdded) {
            onActionClick();
          }
        }}
      >
        <div className="flex flex-row items-center">
          {isAdded && (
            <div className="mr-3">
              {pageType === "home" ? <MdDragIndicator size={20} /> : null}
            </div>
          )}
          <div>
          {/* image from supabase  */}
          {item.image_path ? (
            <div className="relative">
              <Image
                src={item.image_path}
                alt="Selected"
                width={24}
                height={24}
                className="h-10 w-10 rounded-full"
                unoptimized
              />
              {isAdded && (
                <button
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (isEdit === true) 
                      onActionClick('edit');
                  }}
                >
                  <Image src={'/icons/edit-white-icon.png'} alt="Edit" width={24} height={24} />
                </button>
              )}
            </div>
          )
          
          : isAdded && item.image && item.image.filePath ? (
            <Image
              src={item.image.filePath}
              alt="Selected"
              width={24}
              height={24}
              className="h-10 w-10 rounded-full"
              unoptimized
            />
          ) 
          :  isAdded ? (
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 bg-gray-300">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  if (isEdit === true) 
                    onActionClick('edit');
                }}
              >
                <Image src={'/icons/edit-white-icon.png'} alt="Edit" width={24} height={24} />
              </button>
            </div>
          ) : null}
            
          </div>
          <div className="flex flex-row space-x-2">
            <span className="pl-3 text-[16px] font-normal">
              {item.page === "books" ? item.books?.title : item.podcasts?.title}
            </span>
            <div>
              {pageType === "home" ? (
                <Badge variant={"secondary"} className="bg-[#F0F5FE] font-medium text-[#3662E3] text-[10px]">{item.page}</Badge>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <button
            className="rounded-full p-1 hover:shadow"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onActionClick();
            }}
          >
            {isAdded ? (
              pageType === "home" && isEdit === true ? (
                <CiCircleMinus size={25}/>
              ) : null
            ) : (
              <IoIosAddCircleOutline size={25} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBannerItem;
