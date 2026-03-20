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
      {/* FC Logo Mark — fretboard with nut + fret lines + strings */}
      {/* Nut (thick top line) */}
      <line x1="6" y1="10" x2="58" y2="10" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      {/* Fret lines (horizontal) */}
      <line x1="6" y1="24" x2="58" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="6" y1="38" x2="58" y2="38" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="6" y1="52" x2="58" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      {/* 6 strings (vertical) */}
      <line x1="8" y1="10" x2="8" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="16" y1="10" x2="16" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="24" y1="10" x2="24" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="40" y1="10" x2="40" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="48" y1="10" x2="48" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      <line x1="56" y1="10" x2="56" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      {/* F */}
      <rect x="7" y="16" width="2.5" height="34" rx="0.5" fill="currentColor" />
      <rect x="7" y="16" width="20" height="2.5" rx="0.5" fill="currentColor" />
      <rect x="7" y="30" width="14" height="2" rx="0.5" fill="currentColor" />
      {/* C */}
      <path
        d="M56 24 C56 19 51 16 46 16 C40 16 37 20 37 26 L37 40 C37 46 40 50 46 50 C51 50 56 47 56 42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
