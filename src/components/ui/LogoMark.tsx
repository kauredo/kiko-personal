import type { CSSProperties } from "react";

export function LogoMark({ size = 36, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      {/* FC Logo Mark — minimal chord diagram: nut + 3x3 grid + dots */}
      {/* Nut */}
      <line x1="4" y1="4" x2="28" y2="4" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
      {/* Frets */}
      <line x1="4" y1="13" x2="28" y2="13" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="4" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      {/* Strings */}
      <line x1="7" y1="4" x2="7" y2="28" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <line x1="25" y1="4" x2="25" y2="28" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      {/* Dots — abstract FC chord positions */}
      <circle cx="7" cy="8.5" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="25" cy="8.5" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="16" cy="17.5" r="3" fill="currentColor" opacity="0.9" />
      <circle cx="25" cy="26" r="3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
