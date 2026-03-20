import type { CSSProperties } from "react";

export function LogoMark({ size = 36, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      {/* FC Logo Mark — bold F and C on a fretboard grid */}
      {/* Nut (thick top line) */}
      <line x1="4" y1="8" x2="60" y2="8" stroke="currentColor" strokeWidth="3" opacity="0.6" />
      {/* Fret lines */}
      <line x1="4" y1="22" x2="60" y2="22" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="4" y1="36" x2="60" y2="36" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="4" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      {/* 6 strings */}
      <line x1="8" y1="8" x2="8" y2="58" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="16" y1="8" x2="16" y2="58" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="24" y1="8" x2="24" y2="58" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="40" y1="8" x2="40" y2="58" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="48" y1="8" x2="48" y2="58" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="56" y1="8" x2="56" y2="58" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      {/* F — bold */}
      <rect x="6" y="14" width="4" height="38" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="6" y="14" width="22" height="3.5" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="6" y="30" width="16" height="3" rx="1" fill="currentColor" opacity="0.9" />
      {/* C — bold */}
      <path
        d="M58 22 C58 16 52 13 46 13 C39 13 35 18 35 25 L35 41 C35 48 39 53 46 53 C52 53 58 50 58 44"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
