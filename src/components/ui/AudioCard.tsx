import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import type { HomeMedia } from "@/data/fallbacks";

type AudioCardProps = {
  item: HomeMedia;
  accentColor?: string;
  bgColor?: string;
  fgColor?: string;
  mutedColor?: string;
};

export function AudioCard({ item, accentColor = "#fff", bgColor = "transparent", fgColor = "#fff", mutedColor = "rgba(255,255,255,0.4)" }: AudioCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const url = item.audioUrl || item.imageUrl;

  function toggle() {
    if (!audioRef.current || !url) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  function onTimeUpdate() {
    if (!audioRef.current) return;
    const pct = audioRef.current.duration
      ? (audioRef.current.currentTime / audioRef.current.duration) * 100
      : 0;
    setProgress(pct);
  }

  return (
    <div className="flex items-center gap-4 py-4" style={{ borderBottom: `1px solid ${mutedColor}33` }}>
      <button
        onClick={toggle}
        disabled={!url}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
        style={{ background: url ? accentColor : `${mutedColor}33`, color: url ? bgColor : mutedColor }}
      >
        {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" style={{ color: fgColor }}>{item.title}</p>
        {(item.album || item.year) && (
          <p className="truncate text-xs" style={{ color: mutedColor }}>
            {[item.album, item.year].filter(Boolean).join(" · ")}
          </p>
        )}
        {url && (
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full" style={{ background: `${mutedColor}33` }}>
            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${progress}%`, background: accentColor }} />
          </div>
        )}
      </div>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => { setPlaying(false); setProgress(0); }}
          preload="none"
        />
      )}
    </div>
  );
}
