import { useState, useRef, useEffect } from "react";
import { PlayIcon, Volume2Icon, PauseIcon, VolumeXIcon } from "lucide-react";
import Image from "next/image";

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

interface AudioPlayerProps {
  audio_file?: File | string;
}

const AudioPlayer = ({ audio_file }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioSrc && audioSrc.startsWith("blob:")) {
      URL.revokeObjectURL(audioSrc);
    }

    if (audio_file instanceof File) {
      const url = URL.createObjectURL(audio_file);
      setAudioSrc(url);
    } else if (typeof audio_file === "string") {
      setAudioSrc(audio_file);
    }

    return () => {
      if (audioSrc && audioSrc.startsWith("blob:")) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audio_file]);

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

  const handlePrevTrack = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - 10);
      audioRef.current.currentTime = newTime;
    }
  };

  const handleNextTrack = () => {
    if (audioRef.current) {
      const newTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="w-full flex flex-row p-1 items-center space-x-2 bg-[#87817E] rounded-[10px] px-2 text-white">
      <div className="flex flex-row space-x-2 items-center">
        <button type="button" onClick={handlePrevTrack}>
          <Image
            alt="rotate-cw"
            src={"/icons/rotate-cw.png"}
            width={15}
            height={15}
          />
        </button>
        <button type="button" onClick={togglePlay}>
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </button>
        <button type="button" onClick={handleNextTrack}>
          <Image
            alt="rotate-ccw"
            src={"/icons/rotate-ccw.png"}
            width={15}
            height={15}
          />
        </button>
      </div>

      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

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
