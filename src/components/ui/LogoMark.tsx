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
      {/* FC Logo Mark — simplified chord diagram for nav/favicon */}
      {/* 6 strings */}
      <line x1="8" y1="4" x2="8" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.10" />
      <line x1="16" y1="4" x2="16" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.10" />
      <line x1="24" y1="4" x2="24" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.10" />
      <line x1="40" y1="4" x2="40" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.10" />
      <line x1="48" y1="4" x2="48" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.10" />
      <line x1="56" y1="4" x2="56" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.10" />
      {/* F */}
      <rect x="7" y="14" width="2.5" height="36" rx="0.5" fill="currentColor" />
      <rect x="7" y="14" width="20" height="2.5" rx="0.5" fill="currentColor" />
      <rect x="7" y="28" width="14" height="2" rx="0.5" fill="currentColor" />
      {/* C */}
      <path
        d="M56 22 C56 17 51 14 46 14 C40 14 37 18 37 24 L37 40 C37 46 40 50 46 50 C51 50 56 47 56 42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Chord dots */}
      <circle cx="8" cy="22" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="35" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="48" cy="42" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
