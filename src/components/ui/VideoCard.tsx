import { useRef, useState, useCallback, useEffect } from "react";
import { Volume2, VolumeX, Expand } from "lucide-react";

type VideoCardProps = {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export function VideoCard({ src, title, className = "", style, onClick }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [aspect, setAspect] = useState<string | undefined>(undefined);

  const onLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (v && v.videoWidth && v.videoHeight) {
      setAspect(`${v.videoWidth}/${v.videoHeight}`);
    }
  }, []);

  // Autoplay on scroll for touch devices (no hover available)
  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (!isTouchDevice || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function handleMouseEnter() {
    videoRef.current?.play();
  }

  function handleMouseLeave() {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setMuted(true);
    if (videoRef.current) videoRef.current.muted = true;
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  }

  return (
    <div
      ref={containerRef}
      className={`group relative cursor-pointer overflow-hidden ${className}`}
      style={{ ...style, aspectRatio: aspect ?? style?.aspectRatio }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
      />
      {/* Title overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-black/70 px-4 py-3 translate-y-0 md:translate-y-full backdrop-blur-sm transition-transform duration-300 md:group-hover:translate-y-0">
        <p className="text-sm font-medium text-white">{title}</p>
      </div>
      {/* Controls */}
      <div className="absolute right-3 top-3 z-20 flex gap-1.5 opacity-100 md:opacity-0 transition-opacity duration-200 md:group-hover:opacity-100">
        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          aria-label="Open fullscreen"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          <Expand size={16} />
        </button>
      </div>
    </div>
  );
}
