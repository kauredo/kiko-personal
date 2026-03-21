import { useRef, useState } from "react";
import { Volume2, VolumeX, Maximize2 } from "lucide-react";

type VideoCardProps = {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
};

export function VideoCard({ src, title, className = "", style }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  function handleMouseEnter() {
    videoRef.current?.play();
    setPlaying(true);
  }

  function handleMouseLeave() {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setPlaying(false);
    setMuted(true);
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  }

  function openFullscreen(e: React.MouseEvent) {
    e.stopPropagation();
    videoRef.current?.requestFullscreen?.();
  }

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* Controls — visible on hover */}
      <div className="absolute right-2 bottom-2 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={toggleMute}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <button
          onClick={openFullscreen}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          <Maximize2 size={14} />
        </button>
      </div>
      {/* Title overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 translate-y-full backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
        <p className="text-sm font-medium text-white">{title}</p>
      </div>
    </div>
  );
}
