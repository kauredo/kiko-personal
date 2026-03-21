/**
 * PIANO — "The Keys"
 * Interactive piano as hero. Keys play real tones via Web Audio API.
 * Sheet-music inspired typography. Musical notation as design language.
 * Monochrome + single accent. Elegant, playful, unexpected.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { LogoMark } from "@/components/ui/LogoMark";
import { AudioCard } from "@/components/ui/AudioCard";
import { VideoCard } from "@/components/ui/VideoCard";
import { ArrowUpRight, Mail, Instagram, Youtube, Music2, Linkedin } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { useHomeData } from "@/hooks/useHomeData";
import { useGallery } from "@/context/GalleryContext";

// ── Web Audio Piano ──
const NOTE_FREQS: Record<string, number> = {
  C4: 261.63, "C#4": 277.18, D4: 293.66, "D#4": 311.13,
  E4: 329.63, F4: 349.23, "F#4": 369.99, G4: 392.00,
  "G#4": 415.30, A4: 440.00, "A#4": 466.16, B4: 493.88,
  C5: 523.25, "C#5": 554.37, D5: 587.33,
};

const KEYBOARD_MAP: Record<string, string> = {
  a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4",
  f: "F4", t: "F#4", g: "G4", y: "G#4", h: "A4",
  u: "A#4", j: "B4", k: "C5", o: "C#5", l: "D5",
};

const WHITE_KEYS = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"];
const BLACK_KEYS: { note: string; offset: number }[] = [
  { note: "C#4", offset: 0 },
  { note: "D#4", offset: 1 },
  { note: "F#4", offset: 3 },
  { note: "G#4", offset: 4 },
  { note: "A#4", offset: 5 },
  { note: "C#5", offset: 7 },
];

function useAudioContext() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((freq: number) => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  }, []);

  return play;
}

function PianoKeyboard({ activeNote, onPlay }: { activeNote: string | null; onPlay: (note: string) => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const keyW = 80;
  const keyH = 260;
  const blackW = 48;
  const blackH = 165;
  const totalW = WHITE_KEYS.length * keyW;

  useEffect(() => {
    function updateScale() {
      if (wrapperRef.current) {
        const containerW = wrapperRef.current.clientWidth;
        setScale(Math.min(1, containerW / totalW));
      }
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [totalW]);

  return (
    <div ref={wrapperRef} className="mx-auto w-full select-none overflow-hidden" style={{ maxWidth: totalW, height: keyH * scale }}>
      <div className="relative origin-top-left" style={{ width: totalW, height: keyH, transform: `scale(${scale})` }}>
      {/* White keys */}
      {WHITE_KEYS.map((note, i) => (
        <button
          key={note}
          aria-label={note}
          onPointerDown={() => onPlay(note)}
          className="absolute top-0 transition-all duration-100 focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.15_45)] focus-visible:ring-offset-1"
          style={{
            left: i * keyW,
            width: keyW - 2,
            height: keyH,
            background: activeNote === note
              ? "linear-gradient(to bottom, white 0%, oklch(0.91 0.01 70) 100%)"
              : "linear-gradient(to bottom, oklch(0.96 0.005 80) 0%, white 100%)",
            borderLeft: "1px solid oklch(0.78 0.01 80)",
            borderBottom: "1px solid oklch(0.78 0.01 80)",
            borderRadius: "0 0 6px 6px",
            transformOrigin: "top center",
            transform: activeNote === note ? "perspective(330px) rotateX(-2deg)" : "none",
            boxShadow: activeNote === note
              ? "inset 2px 0 3px rgba(0,0,0,0.1), inset -5px 5px 20px rgba(0,0,0,0.15), 0 0 3px rgba(0,0,0,0.1)"
              : "-1px 0 0 rgba(255,255,255,0.8) inset, 0 0 5px oklch(0.82 0.01 80) inset, 0 0 3px rgba(0,0,0,0.15)",
          }}
        >
          <span aria-hidden="true" className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-black/30">
            {Object.entries(KEYBOARD_MAP).find(([, n]) => n === note)?.[0]?.toUpperCase()}
          </span>
        </button>
      ))}
      {/* Black keys */}
      {BLACK_KEYS.map(({ note, offset }) => (
        <button
          key={note}
          aria-label={note}
          onPointerDown={() => onPlay(note)}
          className="absolute top-0 z-10 transition-all duration-100 focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.15_45)]"
          style={{
            left: offset * keyW + keyW - blackW / 2,
            width: blackW,
            height: blackH,
            background: activeNote === note
              ? "linear-gradient(to right, oklch(0.27 0.01 260), oklch(0.13 0.005 260))"
              : "linear-gradient(45deg, oklch(0.13 0.005 260), oklch(0.22 0.01 260))",
            border: "1px solid black",
            borderRadius: "0 0 4px 4px",
            transformOrigin: "top center",
            transform: activeNote === note ? "perspective(1500px) rotateX(-6deg)" : "none",
            boxShadow: activeNote === note
              ? "-1px -1px 2px rgba(255,255,255,0.2) inset, 0 -2px 2px 3px rgba(0,0,0,0.6) inset, 0 1px 2px rgba(0,0,0,0.5)"
              : "-1px -1px 2px rgba(255,255,255,0.2) inset, 0 -5px 2px 3px rgba(0,0,0,0.6) inset, 0 2px 4px rgba(0,0,0,0.5)",
          }}
        />
      ))}
      </div>
    </div>
  );
}

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return Instagram;
  if (p.includes("youtube")) return Youtube;
  if (p.includes("spotify") || p.includes("music")) return Music2;
  if (p.includes("linkedin")) return Linkedin;
  return Mail;
}

export function HomePiano() {
  const { events, experiences, testimonials, stats, services, settings, media, photos, videos, music, bio } = useHomeData();
  const openGallery = useGallery();
  const allMedia = [...photos, ...videos, ...music];
  const play = useAudioContext();
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);

  const handlePlay = useCallback((note: string) => {
    const freq = NOTE_FREQS[note];
    if (!freq) return;
    play(freq);
    setActiveNote(note);
    setPlayedNotes((prev) => [...prev.slice(-11), note]);
    setTimeout(() => setActiveNote(null), 200);
  }, [play]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const note = KEYBOARD_MAP[e.key.toLowerCase()];
      if (note) handlePlay(note);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePlay]);

  const bg = "oklch(0.97 0.005 80)";
  const fg = "oklch(0.10 0.02 260)";
  const primary = "oklch(0.55 0.15 45)";
  const muted = "oklch(0.85 0.01 80)";
  const mutedFg = "oklch(0.50 0.01 260)";

  return (
    <div className="min-h-screen" style={{ background: bg, color: fg, fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      {/* ═══ NAV ═══ */}
      <nav className="flex items-center justify-between px-8 py-6 md:px-16 lg:px-24">
        <div className="flex items-center gap-3">
          <LogoMark size={28} style={{ color: fg }} />
          <span className="hidden text-sm sm:block" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: fg }}>{bio.name}</span>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: "About", id: "#piano-about" },
            { label: "Portfolio", id: "#piano-media" },
            { label: "Work", id: "#piano-work" },
            { label: "Events", id: "#piano-events" },
            { label: "Contact", id: "#piano-contact" },
          ].map(({ label, id }) => (
            <button key={label} onClick={() => document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="hidden text-xs uppercase transition-colors hover:opacity-70 focus-visible:underline md:block" style={{ letterSpacing: "0.15em", color: mutedFg }}>
              {label}
            </button>
          ))}
          <ThemeSwitcher variant="dark" />
          <MobileMenu
            links={[
              { label: "About", id: "#piano-about" },
              { label: "Portfolio", id: "#piano-media" },
              { label: "Work", id: "#piano-work" },
              { label: "Events", id: "#piano-events" },
              { label: "Contact", id: "#piano-contact" },
            ]}
            scrollTo={(id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            color={fg}
            bgColor={bg}
            headingFont="'DM Serif Display', Georgia, serif"
          />
        </div>
      </nav>

      {/* ═══ HERO — Interactive Piano ═══ */}
      <section className="px-8 pb-16 pt-8 md:px-16 lg:px-24">
        <div className="mb-12 max-w-2xl">
          <h1
            className="mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {bio.firstName} <span style={{ fontStyle: "italic" }}>{bio.lastName}</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: mutedFg }}>
            Guitarist, pianist, musical director & producer.<br />
            <span className="hidden md:inline">Play the keys below — or use your keyboard (A-L).</span>
            <span className="md:hidden">Tap the keys below to play.</span>
          </p>
        </div>

        <PianoKeyboard activeNote={activeNote} onPlay={handlePlay} />

        {/* Played notes visualization */}
        <div className="mt-6 flex h-8 items-center justify-center gap-1">
          {playedNotes.map((note, i) => (
            <motion.span
              key={`${note}-${i}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 - i * 0.07 }}
              className="text-xs font-medium"
              style={{ color: mutedFg }}
            >
              {note}
            </motion.span>
          ))}
          {playedNotes.length === 0 && (
            <span className="text-xs" style={{ color: `${mutedFg}88` }}>Your notes will appear here...</span>
          )}
        </div>
      </section>

      {/* ═══ ABOUT — Musical staff inspired ═══ */}
      <section id="piano-about" className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-3 text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>About</p>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
              Where every note<br /><span style={{ fontStyle: "italic" }}>has purpose.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <p className="leading-relaxed" style={{ color: fg }}>
              Francisco Catarro is a guitarist, pianist, musical director, and producer whose playing
              carries the raw energy of a live stage and the precision of years behind the keys.
            </p>
            <p className="leading-relaxed" style={{ color: mutedFg }}>
              From rock clubs to symphony halls — he doesn't just show up, he transforms the room.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section id="piano-stats" className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="mb-2"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: 1, color: primary }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="piano-services" className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>Services</p>
          <h2 className="mb-12" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
            What I <span style={{ fontStyle: "italic" }}>do</span>
          </h2>
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {services.map((service) => (
              <div key={service.title} className="py-6" style={{ borderTop: `1px solid ${muted}` }}>
                <h3 className="mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "1.25rem" }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: mutedFg }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MEDIA ═══ */}
      {photos.length > 0 && (
      <section id="piano-media" className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>Portfolio</p>
          <h2 className="mb-12" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
            In the <span style={{ fontStyle: "italic" }}>moment</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {photos.slice(0, 5).map((item, i) => (
              <button
                key={item.id}
                className={`relative flex items-end overflow-hidden p-5 text-left focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.15_45)] ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                onClick={() => openGallery(allMedia, allMedia.findIndex(m => m.id === item.id))}
                style={{ background: muted, border: `1px solid ${muted}`, aspectRatio: i === 0 ? undefined : "1/1", minHeight: i === 0 ? 280 : undefined }}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>
                    {item.title}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══ VIDEOS ═══ */}
      {videos.length > 0 && (
        <section className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>Videos</p>
            <h2 className="mb-12" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
              In <span style={{ fontStyle: "italic" }}>motion</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {videos.map((item) => (
                item.imageUrl ? (
                  <VideoCard key={item.id} src={item.imageUrl!} title={item.title} onClick={() => openGallery(allMedia, allMedia.findIndex(m => m.id === item.id))} style={{ background: muted, border: `1px solid ${muted}` }} />
                ) : (
                  <div key={item.id} style={{ aspectRatio: "16/9", background: muted, border: `1px solid ${muted}` }}>
                    <div className="flex h-full items-center justify-center" style={{ color: mutedFg }}>
                      <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>video</span>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ MUSIC ═══ */}
      {music.length > 0 && (
        <section className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>Music</p>
            <h2 className="mb-12" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
              On <span style={{ fontStyle: "italic" }}>record</span>
            </h2>
            {music.map((item) => (
              <AudioCard key={item.id} item={item} accentColor={primary} bgColor={bg} fgColor={fg} mutedColor={mutedFg} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ WORK ═══ */}
      {experiences.length > 0 && (
      <section id="piano-work" className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>Experience</p>
          <h2 className="mb-12" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
            The work so far
          </h2>
          {experiences.map((w, i) => (
            <div key={i} className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between" style={{ borderTop: `1px solid ${muted}` }}>
              <div>
                <h3 className="text-base font-medium" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{w.title}</h3>
                <p className="mt-0.5 text-sm" style={{ color: mutedFg }}>{w.organization}</p>
              </div>
              <span className="text-sm" style={{ color: mutedFg }}>{w.startYear} —</span>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ═══ TESTIMONIALS ═══ */}
      {testimonials.length > 0 && (
      <section id="piano-testimonials" className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>Testimonials</p>
          <h2 className="mb-12" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
            Kind <span style={{ fontStyle: "italic" }}>words</span>
          </h2>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {testimonials.map((t) => (
              <div key={t.authorName}>
                <blockquote
                  className="mb-6 text-lg leading-relaxed md:text-xl"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic" }}
                >
                  "{t.quote}"
                </blockquote>
                <p className="text-sm font-medium">{t.authorName}</p>
                <p className="mt-0.5 text-xs" style={{ color: mutedFg }}>{t.authorRole}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══ EVENTS ═══ */}
      {events.length > 0 && (
      <section id="piano-events" className="px-8 py-20 md:px-16 md:py-28 lg:px-24" style={{ background: fg, color: bg, borderTop: `3px solid ${primary}` }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[10px] uppercase text-white/40" style={{ letterSpacing: "0.2em" }}>Live</p>
          <h2 className="mb-12" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1 }}>
            Catch me live
          </h2>
          {events.map((e, i) => (
            <div key={i} className="flex flex-col gap-2 border-t border-white/10 py-5 md:flex-row md:items-center md:justify-between md:py-6">
              <div className="flex items-baseline gap-6">
                <span className="text-sm text-white/50">{e.dateFormatted}</span>
                <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{e.title}</h3>
              </div>
              <span className="text-sm text-white/50">{e.venue}</span>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ═══ CONTACT ═══ */}
      <section id="piano-contact" className="px-8 py-24 text-center md:px-16 md:py-32 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <h2 className="mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1 }}>
          Let's make <span style={{ fontStyle: "italic" }}>music</span>
        </h2>
        <p className="mx-auto mb-10 max-w-md text-sm" style={{ color: mutedFg }}>
          Available for booking, collaboration, session work, and musical direction.
        </p>
        <a
          href={`mailto:${settings.contactEmail}`}
          className="inline-flex items-center gap-2 border-2 px-10 py-4 text-xs font-medium uppercase transition-colors focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.15_45)] focus-visible:ring-offset-2"
          style={{ borderColor: primary, color: primary, letterSpacing: "0.15em" }}
        >
          Get in touch <ArrowUpRight size={14} />
        </a>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex flex-col items-center gap-4 px-8 py-12 text-center md:flex-row md:justify-between md:px-16 lg:px-24" style={{ borderTop: `1px solid ${muted}` }}>
        <p className="text-[11px] uppercase" style={{ color: mutedFg, letterSpacing: "0.15em" }}>
          &copy; {new Date().getFullYear()} {bio.name}
        </p>
        <div className="flex items-center gap-4">
          {settings.socialLinks.map((link) => {
            const Icon = getSocialIcon(link.platform);
            return (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform} className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70" style={{ color: mutedFg }}>
                <Icon size={16} />
              </a>
            );
          })}
        </div>
        <p className="text-sm" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontStyle: "italic", color: `${fg}66` }}>
          Music is the only language that doesn't need translation.
        </p>
      </footer>
    </div>
  );
}
