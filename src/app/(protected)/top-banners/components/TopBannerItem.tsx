import { IoIosAddCircleOutline } from "react-icons/io";
import { CiCircleMinus } from "react-icons/ci";
import { MdDragIndicator } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { TopBanner } from "@/@types/top-banner";

interface TopBannerItemProps {
  item: TopBanner;
  isAdded: boolean;
  pageType: string;
  onActionClick: () => void;
}

const TopBannerItem = ({
  item,
  isAdded,
  pageType,
  onActionClick,
}: TopBannerItemProps) => {
  return (
    <div
      className="flex flex-row py-3 px-3 items-center justify-between my-2 shadow rounded-[8px] border border-gray-700 cursor-pointer"
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
        {/* <div>
                    {item.book_id && (
                        <img
                            src={item?.books?.cover_path}
                            className="h-10 w-10 rounded-full"
                        />
                    )}
                </div> */}
        <div className="flex flex-row space-x-2">
          <span className="pl-3">
            {item.page === "books" ? item.books?.title : item.podcasts?.title}
          </span>
          <div>
            {pageType === "home" ? (
              <Badge variant={"outline"} className="border border-gray-400">{item.page}</Badge>
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
            pageType === "home" ? (
              <CiCircleMinus size={25} />
            ) : null
          ) : (
            <IoIosAddCircleOutline size={25} />
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBannerItem;
