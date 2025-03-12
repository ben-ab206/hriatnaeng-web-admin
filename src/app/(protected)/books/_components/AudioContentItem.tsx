import { Edit2Icon, Trash2Icon } from "lucide-react";
import { AudioContentModel } from "../StaticTypes";
import AudioPlayer from "./AudioPlayer";

interface ContentItemProps {
  data: AudioContentModel;
  onEdit: () => void;
  onDelete: () => void;
}

const AudioContentItem = ({ data, onEdit, onDelete }: ContentItemProps) => {
  return (
    <div className="space-y-2">
      <div className="w-full p-2 rounded-[10px] flex flex-row items-center justify-between border">
        <div className="pl-4">
          <span>{data.name}</span>
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <button
            onClick={onEdit}
            className="hover:bg-gray-200 rounded-full p-1"
          >
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
      <AudioPlayer
        audio_file={data.audio_file ? data.audio_file : data.file_path}
      />
    </div>
  );
};

export default AudioContentItem;
