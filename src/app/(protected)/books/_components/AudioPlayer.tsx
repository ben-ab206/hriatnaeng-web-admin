import { ChevronLeft, ChevronRight, PlayIcon, Volume2Icon } from "lucide-react";

const AudioPlayer = () => {
  return (
    <div className="w-full flex flex-row p-1">
      <div className="flex flex-row space-x-1">
        <button>
          <ChevronLeft />
        </button>
        <button>
          <PlayIcon />
        </button>
        <button>
          <ChevronRight />
        </button>
      </div>
      <div className="flex-grow">
        <div className="flex flex-row">
          <div>00:00</div>
          <div className="flex-grow">
            <div className="w-full rounded-full p-1 bg-gray-200">
              <div className="rounded-full w-[2/3] bg-white" />
            </div>
          </div>
          <div>30:00</div>
        </div>
      </div>
      <div>
        <button>
          <Volume2Icon />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
