import type { CSSProperties } from "react";

export function LogoMark({ size = 36, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 56"
      fill="none"
      width={size}
      height={size * (56 / 52)}
      className={className}
      style={style}
    >
      {/* FC Logo Mark — compact chord diagram with both F and C */}
      {/* Labels */}
      <text x="4" y="10" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="currentColor" opacity="0.7">F</text>
      <text x="42" y="10" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="currentColor" opacity="0.7">C</text>
      {/* Open string markers (for C chord) */}
      <circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      <circle cx="24" cy="7" r="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      {/* Nut */}
      <line x1="2" y1="14" x2="50" y2="14" stroke="currentColor" strokeWidth="2.5" opacity="0.65" />
      {/* Fret lines */}
      <line x1="2" y1="24" x2="50" y2="24" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      <line x1="2" y1="34" x2="50" y2="34" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      <line x1="2" y1="44" x2="50" y2="44" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      <line x1="2" y1="54" x2="50" y2="54" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      {/* 6 strings */}
      <line x1="4" y1="14" x2="4" y2="54" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      <line x1="14" y1="14" x2="14" y2="54" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      <line x1="24" y1="14" x2="24" y2="54" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      <line x1="34" y1="14" x2="34" y2="54" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      <line x1="44" y1="14" x2="44" y2="54" stroke="currentColor" strokeWidth="0.6" opacity="0.18" />
      {/* F chord — barre fret 1 + dots */}
      <rect x="2" y="16" width="44" height="5" rx="2.5" fill="currentColor" opacity="0.08" />
      <circle cx="4" cy="19" r="2.8" fill="currentColor" opacity="0.85" />
      <circle cx="44" cy="19" r="2.8" fill="currentColor" opacity="0.85" />
      <circle cx="24" cy="29" r="3" fill="currentColor" opacity="0.85" />
      {/* C chord — dots in lower frets */}
      <circle cx="14" cy="39" r="3" fill="currentColor" opacity="0.85" />
      <circle cx="34" cy="39" r="3" fill="currentColor" opacity="0.85" />
      <circle cx="44" cy="49" r="3" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
