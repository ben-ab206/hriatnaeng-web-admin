import { Edit2Icon, Trash2Icon } from "lucide-react";
import { BookContentModel } from "../StaticTypes";

interface ContentItemProps {
  data: BookContentModel;
  onEdit: () => void;
  onDelete: () => void;
}

const ContentItem = ({ data, onEdit, onDelete }: ContentItemProps) => {
  return (
    <div className="w-full p-2 rounded-[10px] flex flex-row items-center justify-between border">
      <div className="space-x-9 pl-4">
      <span>{data.label}</span>
      <span>{data.title}</span>
      </div>
      <div className="flex flex-row space-x-3 items-center">
        <button onClick={onEdit} className="hover:bg-gray-200 rounded-full p-1">
          <Edit2Icon className="h-4 w-4 text-gray-800" />
        </button>
        <button
          onClick={onDelete}
          className="hover:bg-gray-200 rounded-full p-1"
        >
          <Trash2Icon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ContentItem;
