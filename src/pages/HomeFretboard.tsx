/**
 * FRETBOARD — "The Neck"
 * The entire page IS a guitar fretboard.
 * 6 evenly-spaced strings run the full height. Fret-wire dividers between sections.
 * Each section features a proper SVG chord diagram with nut, frets, dots, X/O markers.
 * Content sits alongside the diagram in alternating two-column layout.
 * Dark rosewood background. Strings always visible.
 */
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { LogoMark } from "@/components/ui/LogoMark";
import { LogoFull } from "@/components/ui/LogoFull";
import { ArrowUpRight } from "lucide-react";

// ── Chord Data ──
// Standard guitar chord voicings: [lowE, A, D, G, B, highE]
// null = muted, 0 = open, 1-5 = fret number
const CHORDS: Record<string, { name: string; frets: (number | null)[]; barre?: number }> = {
  F:  { name: "F",  frets: [1, 1, 2, 3, 3, 1], barre: 1 },
  C:  { name: "C",  frets: [null, 3, 2, 0, 1, 0] },
  Am: { name: "Am", frets: [null, 0, 2, 2, 1, 0] },
  G:  { name: "G",  frets: [3, 2, 0, 0, 0, 3] },
  Dm: { name: "Dm", frets: [null, null, 0, 2, 3, 1] },
};

// ── Background strings — 6 evenly spaced from 15% to 85% ──
const BG_STRINGS = [15, 29, 43, 57, 71, 85];
const BG_WIDTHS = [2.5, 2, 1.5, 1.2, 1, 0.8];

// ── SVG Chord Diagram ──
function ChordDiagram({
  chord,
  scale = 1,
  className,
  showLabel = false,
}: {
  chord: keyof typeof CHORDS;
  scale?: number;
  className?: string;
  showLabel?: boolean;
}) {
  const c = CHORDS[chord];
  const sw = 18 * scale;   // string spacing
  const fh = 24 * scale;   // fret spacing
  const nFrets = 4;
  const dotR = 6 * scale;
  const px = 20 * scale;   // horizontal padding
  const py = 28 * scale;   // top padding (room for X/O markers)
  const labelFontSize = Math.min(14 * scale, 24);
  const labelH = showLabel ? labelFontSize * 2.5 : 6 * scale;
  const w = sw * 5 + px * 2;
  const h = fh * nFrets + py + labelH;
  const x0 = px;
  const y0 = py;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={{ overflow: "visible", maxWidth: "100%", height: "auto" }}
    >
      {/* Nut — thick top bar */}
      <line
        x1={x0 - 2}
        y1={y0}
        x2={x0 + sw * 5 + 2}
        y2={y0}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={3 * Math.min(scale, 2)}
        strokeLinecap="round"
      />

      {/* Fret wires */}
      {Array.from({ length: nFrets }, (_, i) => (
        <line
          key={`f${i}`}
          x1={x0}
          y1={y0 + (i + 1) * fh}
          x2={x0 + sw * 5}
          y2={y0 + (i + 1) * fh}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />
      ))}

      {/* Strings — varying thickness low to high */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`s${i}`}
          x1={x0 + i * sw}
          y1={y0}
          x2={x0 + i * sw}
          y2={y0 + nFrets * fh}
          stroke="rgba(255,255,255,0.13)"
          strokeWidth={2.2 - i * 0.25}
        />
      ))}

      {/* Barre bar */}
      {c.barre && (
        <rect
          x={x0 - dotR * 0.4}
          y={y0 + (c.barre - 0.5) * fh - dotR * 0.7}
          width={sw * 5 + dotR * 0.8}
          height={dotR * 1.4}
          rx={dotR * 0.7}
          fill="white"
          opacity={0.08}
        />
      )}

      {/* X/O markers + fretted dots */}
      {c.frets.map((fret, i) => {
        const sx = x0 + i * sw;
        const markerY = y0 - 13 * scale;

        if (fret === null) {
          const sz = 3.5 * scale;
          return (
            <g key={i} opacity={0.3}>
              <line x1={sx - sz} y1={markerY - sz} x2={sx + sz} y2={markerY + sz} stroke="white" strokeWidth={1.5} strokeLinecap="round" />
              <line x1={sx + sz} y1={markerY - sz} x2={sx - sz} y2={markerY + sz} stroke="white" strokeWidth={1.5} strokeLinecap="round" />
            </g>
          );
        }

        if (fret === 0) {
          return (
            <circle
              key={i}
              cx={sx}
              cy={markerY}
              r={dotR * 0.55}
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.5}
            />
          );
        }

        return (
          <circle
            key={i}
            cx={sx}
            cy={y0 + (fret - 0.5) * fh}
            r={dotR}
            fill="white"
            opacity={0.85}
            className="chord-dot"
          />
        );
      })}

      {/* Chord name label */}
      {showLabel && (
        <text
          x={x0 + (sw * 5) / 2}
          y={y0 + nFrets * fh + labelFontSize * 1.5}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize={labelFontSize}
          fontFamily="'Syne', system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="0.05em"
        >
          {c.name}
        </text>
      )}
    </svg>
  );
}

// ── Content Data ──
const EXPERIENCE = [
  { title: "Lead Guitar — Don Gabriel", period: "2020 —" },
  { title: "Function Duo — with Milena Galasso", period: "2021 —" },
  { title: "Band Leader — Studio80", period: "2019 — 2020" },
  { title: "Composer — Tabora / Lucas Wild", period: "2017 — 2020" },
];

const EVENTS = [
  { date: "APR 15", title: "Rock Soul Night", venue: "Coliseu de Lisboa" },
  { date: "MAY 02", title: "Jazz & Soul Session", venue: "Hot Clube" },
  { date: "JUN 20", title: "Summer Festival", venue: "Parque das Nacoes" },
];

export function HomeFretboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      // Animate hero logo — dots pop in, lines fade in
      const heroLogo = container.querySelector(".hero-logo svg");
      if (heroLogo) {
        const circles = heroLogo.querySelectorAll("circle");
        const lines = heroLogo.querySelectorAll("line");
        const rects = heroLogo.querySelectorAll("rect");
        gsap.from(lines, { opacity: 0, duration: 0.8, stagger: 0.04, ease: "power2.out" });
        gsap.from(rects, { opacity: 0, scaleX: 0, transformOrigin: "left center", duration: 0.6, stagger: 0.08, delay: 0.3, ease: "power3.out" });
        gsap.from(circles, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.06, delay: 0.5, ease: "back.out(2)" });
      }

      container.querySelectorAll(".fret-section").forEach((section) => {
        // Cascade: diagram → text → dots
        const diagram = section.querySelector(".chord-diagram");
        if (diagram) {
          gsap.from(diagram, {
            scale: 0.85,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: section, start: "top 75%" },
          });
        }

        const texts = section.querySelectorAll(".fret-text");
        gsap.from(texts, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 60%" },
        });

        const dots = section.querySelectorAll(".chord-dot");
        if (dots.length) {
          gsap.from(dots, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "back.out(2.5)",
            scrollTrigger: { trigger: section, start: "top 50%" },
          });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      style={{ background: "oklch(0.065 0.008 40)", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      {/* ═══ BACKGROUND STRINGS ═══ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {BG_STRINGS.map((pct, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${pct}%`,
              width: BG_WIDTHS[i],
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.06) 70%, rgba(255,255,255,0.03))",
            }}
          />
        ))}
        {/* Fret inlays — subtle position markers between middle strings */}
        {[20, 36, 52, 68, 84].map((top) => (
          <div
            key={top}
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: `${top}%`,
              width: 6,
              height: 6,
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>

      {/* ═══ NAV ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 lg:px-24"
        style={{ background: "linear-gradient(to bottom, oklch(0.065 0.008 40) 0%, oklch(0.065 0.008 40 / 0.8) 60%, transparent 100%)" }}
      >
        <LogoMark size={32} className="text-white" />
        <div className="flex items-center gap-6">
          {["About", "Experience", "Events"].map((l) => (
            <span key={l} className="hidden text-xs uppercase text-white/40 transition-colors hover:text-white/70 md:block" style={{ letterSpacing: "0.15em", cursor: "pointer" }}>{l}</span>
          ))}
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ═══ HERO — FC Logo Chord Diagram ═══ */}
      <section className="fret-section relative flex min-h-screen flex-col items-center justify-center px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:items-center md:gap-20">
          <div className="hero-logo flex-shrink-0">
            <LogoFull size={280} className="text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1
              className="fret-text mb-4 font-bold uppercase text-white"
              style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
            >
              Francisco<br />Catarro
            </h1>
            <p className="fret-text text-xs tracking-[0.3em] uppercase text-white/40">
              Guitar &middot; Keys &middot; Bass &middot; Live Performance
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT — C Chord ═══ */}
      <section className="fret-section relative py-24 md:py-32">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-white/[0.12]" />
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-12 px-8 md:flex-row md:items-center md:gap-20 md:px-16 lg:px-24">
          <div className="chord-diagram flex-shrink-0">
            <ChordDiagram chord="C" scale={2.5} showLabel />
          </div>
          <div>
            <h2
              className="fret-text mb-8 text-xl font-bold uppercase text-white md:text-2xl"
              style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "0.05em" }}
            >
              About
            </h2>
            <p className="fret-text max-w-md text-sm leading-relaxed text-white/60">
              Born in Portugal, based in the UK. Over 10 years of performing, composing,
              arranging, and recording across genres. From rock clubs to symphony halls
              — he doesn't just show up, he transforms the room.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ EXPERIENCE — Am Chord ═══ */}
      <section className="fret-section relative py-24 md:py-32">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-white/[0.12]" />
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-12 px-8 md:flex-row-reverse md:items-start md:gap-20 md:px-16 lg:px-24">
          <div className="chord-diagram flex-shrink-0 md:mt-8">
            <ChordDiagram chord="Am" scale={2.5} showLabel />
          </div>
          <div className="flex-1">
            <h2
              className="fret-text mb-8 text-xl font-bold uppercase text-white md:text-2xl"
              style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "0.05em" }}
            >
              Experience
            </h2>
            {EXPERIENCE.map((item, i) => (
              <div key={i} className="fret-text border-t border-white/[0.08] py-4 transition-colors hover:bg-white/[0.02]">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-0.5 text-xs text-white/35">{item.period}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EVENTS — G Chord ═══ */}
      <section className="fret-section relative py-24 md:py-32">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-white/[0.12]" />
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-12 px-8 md:flex-row md:items-start md:gap-20 md:px-16 lg:px-24">
          <div className="chord-diagram flex-shrink-0 md:mt-8">
            <ChordDiagram chord="G" scale={2.5} showLabel />
          </div>
          <div className="flex-1">
            <h2
              className="fret-text mb-8 text-xl font-bold uppercase text-white md:text-2xl"
              style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "0.05em" }}
            >
              Catch me live
            </h2>
            {EVENTS.map((event, i) => (
              <div key={i} className="fret-text border-t border-white/[0.08] py-5 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-baseline justify-between gap-8">
                  <div>
                    <p className="text-sm font-medium text-white">{event.title}</p>
                    <p className="mt-0.5 text-xs text-white/35">{event.venue}</p>
                  </div>
                  <span
                    className="text-sm font-bold text-white/40"
                    style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
                  >
                    {event.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA — Dm Chord ═══ */}
      <section className="fret-section relative flex min-h-[60vh] flex-col items-center justify-center px-8">
        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-white/[0.12]" />
        <div className="chord-diagram mb-10">
          <ChordDiagram chord="Dm" scale={3} showLabel />
        </div>
        <h2
          className="fret-text mb-4 text-center text-xl font-bold uppercase text-white md:text-2xl"
          style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "0.05em" }}
        >
          Let's work together
        </h2>
        <p className="fret-text mb-10 text-xs text-white/40">Booking &middot; Collaboration &middot; Sessions</p>
        <a
          href="mailto:contact@franciscocatarro.com"
          className="fret-text inline-flex items-center gap-3 bg-white px-10 py-4 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-85"
          style={{ color: "oklch(0.065 0.008 40)" }}
        >
          Get in touch <ArrowUpRight size={14} />
        </a>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 flex items-center justify-between px-6 py-8 text-[10px] tracking-[0.15em] text-white/20 md:px-12 lg:px-24">
        <span>&copy; {new Date().getFullYear()} Francisco Catarro</span>
        <span>F &middot; C &middot; Am &middot; G &middot; Dm</span>
      </footer>
    </div>
  );
}
