import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlayIcon,
  Volume2Icon,
  PauseIcon,
  VolumeXIcon,
} from "lucide-react";

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(total);
    setProgress((current / total) * 100 || 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const newTime = (clickX / width) * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full flex flex-row p-1 items-center space-x-2 bg-[#87817E] rounded-[10px] px-2 text-white">
      <div className="flex flex-row space-x-1 items-center">
        <button type="button">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={togglePlay}>
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </button>
        <button type="button">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src="/abc.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex-grow">
        <div className="flex flex-row items-center space-x-2">
          <div>{formatTime(currentTime)}</div>
          <div className="flex-grow" onClick={handleSeek}>
            <div className="w-full h-2 rounded-full bg-[#9D9895] cursor-pointer">
              <div
                className="h-2 rounded-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div>{formatTime(duration)}</div>
        </div>
      </div>

      <button type="button" onClick={toggleMute}>
        {isMuted ? (
          <VolumeXIcon className="h-4 w-4" />
        ) : (
          <Volume2Icon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
