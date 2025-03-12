import { BookContents } from "@/@types/book_content";
import { EyeIcon } from "lucide-react";

interface ContentDetailsProps {
  contents?: BookContents[];
  onView?: (v: BookContents) => void;
}

const ContentDetails = ({ contents = [], onView }: ContentDetailsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <span className="text-xl font-bold">Content</span>
      </div>
      <div>
        <span className="text-gray-600">Content Chapters</span>
      </div>
      <div className="space-y-4">
        {contents.map((c, idx) => (
          <div key={idx}>
            <div className="w-full space-x-5 p-2 rounded-[10px] flex flex-row items-center justify-between border">
              <div className="flex">{c.label}</div>
              <div className="flex-grow">{c.title}</div>
              <div className="flex">
                <button
                  onClick={() => onView?.(c)}
                  className="hover:bg-gray-200 rounded-full p-1"
                >
                  <EyeIcon className="h-4 w-4 text-gray-800" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentDetails;
