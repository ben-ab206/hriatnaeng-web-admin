import { IoIosAddCircleOutline } from "react-icons/io";
import { CiCircleMinus } from "react-icons/ci";
import { MdDragIndicator } from "react-icons/md";
import { FormItem } from "../StaticTypes";

interface FormContentItemProps {
  item: FormItem;
  isAdded: boolean;
  onActionClick: () => void;
}

const FormContentItem = ({
  item,
  isAdded,
  onActionClick,
}: FormContentItemProps) => {
  return (
    <div
      className="flex flex-row py-3 px-3 items-center justify-between my-2 shadow rounded-[8px] border border-gray-700"
      onClick={onActionClick}
    >
      <div className="flex flex-row items-center">
        {isAdded && (
          <div className="mr-3">
            <MdDragIndicator size={20} />
          </div>
        )}
        <div className="flex flex-row space-x-2">
          <span className="pl-3">{item.title}</span>
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
            <CiCircleMinus size={25} />
          ) : (
            <IoIosAddCircleOutline size={25} />
          )}
        </button>
      </div>
    </div>
  );
};

export default FormContentItem;
