import type { CSSProperties } from "react";

export function LogoFull({ size = 200, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      {/* Full FC Logo — Chord diagram with F barre + C open */}
      {/* 6 strings */}
      <line x1="48" y1="32" x2="48" y2="208" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="72" y1="32" x2="72" y2="208" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="96" y1="32" x2="96" y2="208" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="144" y1="32" x2="144" y2="208" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="168" y1="32" x2="168" y2="208" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="192" y1="32" x2="192" y2="208" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Fret lines */}
      <line x1="36" y1="68" x2="204" y2="68" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="36" y1="104" x2="204" y2="104" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="36" y1="140" x2="204" y2="140" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="36" y1="176" x2="204" y2="176" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Nut */}
      <line x1="36" y1="32" x2="204" y2="32" stroke="currentColor" strokeWidth="3" opacity="0.5" />
      {/* F chord: barre at fret 1 */}
      <rect x="42" y="40" width="156" height="18" rx="9" fill="currentColor" opacity="0.12" />
      <circle cx="48" cy="50" r="5" fill="currentColor" opacity="0.8" />
      <circle cx="192" cy="50" r="5" fill="currentColor" opacity="0.8" />
      <circle cx="96" cy="86" r="6" fill="currentColor" opacity="0.85" />
      <circle cx="144" cy="122" r="6" fill="currentColor" opacity="0.85" />
      <circle cx="168" cy="122" r="6" fill="currentColor" opacity="0.85" />
      {/* F label */}
      <text x="48" y="26" fontFamily="Georgia, serif" fontSize="14" fill="currentColor" opacity="0.7" textAnchor="middle" fontWeight="700">F</text>
      {/* C chord: open position */}
      <circle cx="72" cy="158" r="6" fill="currentColor" opacity="0.85" />
      <circle cx="144" cy="158" r="6" fill="currentColor" opacity="0.85" />
      <circle cx="168" cy="194" r="6" fill="currentColor" opacity="0.85" />
      {/* C label */}
      <text x="192" y="26" fontFamily="Georgia, serif" fontSize="14" fill="currentColor" opacity="0.7" textAnchor="middle" fontWeight="700">C</text>
      {/* Open string indicators */}
      <circle cx="72" cy="24" r="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="96" cy="24" r="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  );
}
