import { Audios } from "@/@types/audios";
import AudioPlayer from "../../_components/AudioPlayer";

interface AudioDetailsProps {
  audio?: Audios[];
}

const AudioDetails = ({ audio = [] }: AudioDetailsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <span className="text-xl font-bold">Audio</span>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {audio.map((au, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-gray-500">{au.name}</div>
            <div className="w-full p-2 rounded-[10px] flex flex-row items-center justify-between border">
              {au.file_path.split("/")[au.file_path.split("/").length - 1]}
            </div>
            <AudioPlayer audio_file={au.file_path} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioDetails;
