import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import type { HomeMedia } from "@/data/fallbacks";

type MediaGalleryProps = {
  items: HomeMedia[];
  initialIndex: number;
  onClose: () => void;
};

export function MediaGallery({ items, initialIndex, onClose }: MediaGalleryProps) {
  const [index, setIndex] = useState(initialIndex);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const item = items[index];

  const prev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : items.length - 1)), [items.length]);
  const next = useCallback(() => setIndex((i) => (i < items.length - 1 ? i + 1 : 0)), [items.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Auto-play videos when navigating to them
  useEffect(() => {
    if (item?.type === "video" && videoRef.current) {
      videoRef.current.muted = muted;
      videoRef.current.play();
    }
  }, [index, item?.type, muted]);

  if (!item) return null;

  const src = item.imageUrl;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 z-20 -translate-x-1/2 text-xs text-white/50">
        {index + 1} / {items.length}
      </div>

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6 md:h-12 md:w-12"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6 md:h-12 md:w-12"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Content */}
      <div
        className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center md:max-w-[80vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "video" && src ? (
          <>
            <video
              ref={videoRef}
              key={src}
              src={src}
              className="max-h-[75vh] w-auto rounded-sm"
              controls
              autoPlay
              loop
              playsInline
              muted={muted}
            />
            <button
              onClick={() => setMuted(!muted)}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </>
        ) : src ? (
          <img
            src={src}
            alt={item.title}
            className="max-h-[75vh] w-auto rounded-sm object-contain"
          />
        ) : (
          <div className="flex h-64 w-96 items-center justify-center rounded-sm bg-white/5 text-white/30">
            <span className="text-sm">{item.title}</span>
          </div>
        )}

        {/* Caption */}
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-white">{item.title}</p>
          {item.description && (
            <p className="mt-1 max-w-lg text-xs text-white/50">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
