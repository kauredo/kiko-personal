/**
 * EDITORIAL — "The Folio"
 * Magazine / lookbook. Centered, generous whitespace.
 * Instrument Serif. Gold on deep brown. Elegant and stately.
 * Numbers-driven: years of experience, projects, genres.
 */
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { LogoMark } from "@/components/ui/LogoMark";
import { LogoFull } from "@/components/ui/LogoFull";
import { ArrowDown } from "lucide-react";

const STATS = [
  { number: "10+", label: "Years performing" },
  { number: "200+", label: "Live shows" },
  { number: "50+", label: "Studio sessions" },
  { number: "4", label: "Instruments" },
];

const SERVICES = [
  { title: "Live Performance", desc: "Guitar and keys for any setting — from intimate jazz clubs to arena stages." },
  { title: "Musical Direction", desc: "Arranging, rehearsing, and leading bands for tours, shows, and recordings." },
  { title: "Production", desc: "Full studio production from arrangement to final mix, across genres." },
  { title: "Session Work", desc: "Available for studio sessions — rock, soul, jazz, latin, classical." },
];

const TESTIMONIALS = [
  { quote: "Francisco brings an energy to the stage that's impossible to ignore.", author: "Maria Santos", role: "Producer" },
  { quote: "Every arrangement was thoughtful, dynamic, and perfectly suited to the moment.", author: "Ana Costa", role: "Theater Director" },
];

const EVENTS = [
  { date: "15 Apr", title: "Rock Soul Night", venue: "Coliseu de Lisboa", year: "2026" },
  { date: "02 May", title: "Jazz & Soul Session", venue: "Hot Clube", year: "2026" },
  { date: "20 Jun", title: "Summer Festival", venue: "Parque das Nacoes", year: "2026" },
];

const bg = "oklch(0.10 0.01 55)";
const fg = "oklch(0.90 0.015 65)";
const primary = "oklch(0.72 0.12 70)";
const muted = "oklch(0.18 0.01 55)";
const mutedFg = "oklch(0.50 0.01 55)";
const card = "oklch(0.14 0.01 55)";
const border = "oklch(0.24 0.01 55)";
const headingFont = "'Instrument Serif', Georgia, serif";
const bodyFont = "'Space Grotesk', system-ui, sans-serif";

export function HomeEditorial() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;
    const els = heroRef.current.querySelectorAll(".hero-fade");
    gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.4 });
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen" style={{ background: bg, color: fg, fontFamily: bodyFont }}>
      {/* ═══ NAV ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-24 xl:px-32 py-5"
        style={{ background: `linear-gradient(to bottom, ${bg} 0%, ${bg}cc 60%, transparent 100%)` }}
      >
        <LogoMark size={36} style={{ color: fg }} />
        <div className="flex items-center gap-8">
          {[
            { label: "About", id: "#editorial-about" },
            { label: "Services", id: "#editorial-services" },
            { label: "Events", id: "#editorial-events" },
            { label: "Contact", id: "#editorial-contact" },
          ].map(({ label, id }) => (
            <button key={label} onClick={() => lenis?.scrollTo(id, { offset: -60, duration: 1.5 })} className="hidden text-xs uppercase md:block" style={{ color: mutedFg, letterSpacing: "0.15em", cursor: "pointer" }}>
              {label}
            </button>
          ))}
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ═══ HERO — Centered, stately ═══ */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 md:px-12 lg:px-24 xl:px-32 text-center">
        <div ref={heroRef}>
          <p className="hero-fade mb-6 text-xs uppercase" style={{ color: mutedFg, letterSpacing: "0.3em" }}>
            Guitarist &middot; Pianist &middot; Musical Director &middot; Producer
          </p>
          <h1
            className="hero-fade"
            style={{ fontFamily: headingFont, fontSize: "clamp(3.5rem, 10vw, 9rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            Francisco<br />
            <span style={{ color: primary }}>Catarro</span>
          </h1>
          <p className="hero-fade mx-auto mt-8 max-w-md text-sm leading-relaxed" style={{ color: mutedFg }}>
            A versatile musician born in Portugal, based in the UK. Over a decade of
            performing, composing, arranging, and recording across genres and stages.
          </p>
          <button
            onClick={() => lenis?.scrollTo("#editorial-about", { offset: -40, duration: 1.5 })}
            className="hero-fade mt-10 inline-flex items-center gap-2 text-xs uppercase transition-opacity hover:opacity-70"
            style={{ color: primary, letterSpacing: "0.2em" }}
          >
            Discover <ArrowDown size={14} />
          </button>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col items-center py-10 md:py-14"
            style={{ borderRight: i < 3 ? `1px solid ${border}` : "none" }}
          >
            <span className="text-3xl md:text-4xl" style={{ fontFamily: headingFont, color: primary }}>{stat.number}</span>
            <span className="mt-2 text-[11px] uppercase" style={{ color: mutedFg, letterSpacing: "0.15em" }}>{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* ═══ BRAND ═══ */}
      <section className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${border}` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:gap-20">
          <LogoFull size={180} className="flex-shrink-0" style={{ color: primary, opacity: 0.5 }} />
          <div>
            <p className="text-xs uppercase" style={{ color: mutedFg, letterSpacing: "0.25em" }}>The FC chord diagram</p>
            <p className="mt-3 text-xl leading-relaxed md:text-2xl" style={{ fontFamily: headingFont, lineHeight: 1.3 }}>
              Two chords that spell a name.<br />One musician who fills a room.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="editorial-about" className="px-6 md:px-12 lg:px-24 xl:px-32 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-3 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>About</p>
            <h2 style={{ fontFamily: headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
              Rooted in rock.<br />Shaped by soul.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-6">
            <p className="leading-relaxed" style={{ color: fg }}>
              Francisco Catarro is a guitarist, pianist, musical director, and
              producer whose playing carries the raw energy of a live stage and
              the precision of years behind the keys.
            </p>
            <p className="leading-relaxed" style={{ color: mutedFg }}>
              From rock clubs to symphony halls, from the studio console to
              center stage — he doesn't just show up, he transforms the room.
            </p>
          </div>
        </div>

        {/* Full-width image */}
        <div
          className="mx-auto mt-16 max-w-6xl overflow-hidden"
          style={{ aspectRatio: "21/9", background: card, border: `1px solid ${border}` }}
        >
          <div className="flex h-full items-center justify-center">
            <LogoFull size={200} style={{ color: primary, opacity: 0.2 }} />
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="editorial-services" className="px-6 md:px-12 lg:px-24 xl:px-32 py-16 md:px-16 md:py-24 lg:px-24" style={{ borderTop: `1px solid ${border}` }}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Services</p>
          <h2 className="mb-16" style={{ fontFamily: headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
            What I do
          </h2>
          <div className="grid gap-px md:grid-cols-2" style={{ background: border }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 md:p-10"
                style={{ background: bg }}
              >
                <h3 className="mb-3 text-lg" style={{ fontFamily: headingFont }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: `${fg}cc` }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:px-16 md:py-28 lg:px-24" style={{ background: card }}>
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
          {TESTIMONIALS.map((t, i) => (
            <div key={i}>
              <blockquote className="mb-6 text-xl leading-relaxed md:text-2xl" style={{ fontFamily: headingFont }}>
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-px w-8" style={{ background: `${primary}66` }} />
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs" style={{ color: mutedFg }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ EVENTS ═══ */}
      <section id="editorial-events" className="px-6 md:px-12 lg:px-24 xl:px-32 py-16 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Live</p>
              <h2 style={{ fontFamily: headingFont, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>Upcoming</h2>
            </div>
          </div>
          {EVENTS.map((e, i) => (
            <div key={i} className="flex items-center justify-between py-6" style={{ borderTop: `1px solid ${border}` }}>
              <div className="flex items-baseline gap-6 md:gap-10">
                <span className="w-16 text-sm" style={{ color: mutedFg }}>{e.date}</span>
                <div>
                  <h3 style={{ fontFamily: headingFont }}>{e.title}</h3>
                  <p className="mt-0.5 text-sm" style={{ color: mutedFg }}>{e.venue}</p>
                </div>
              </div>
              <span className="text-sm" style={{ color: mutedFg }}>{e.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section id="editorial-contact" className="px-6 md:px-12 lg:px-24 xl:px-32 py-24 text-center md:py-32" style={{ borderTop: `1px solid ${border}` }}>
        <h2 className="mb-6" style={{ fontFamily: headingFont, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.1 }}>
          Let's create together
        </h2>
        <p className="mx-auto mb-10 max-w-md text-sm" style={{ color: mutedFg }}>
          Available for booking, collaboration, session work, and musical direction.
        </p>
        <a
          href="mailto:contact@franciscocatarro.com"
          className="inline-flex items-center gap-2 border px-10 py-4 text-xs uppercase transition-colors"
          style={{ borderColor: primary, color: primary, letterSpacing: "0.2em" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = primary; e.currentTarget.style.color = bg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = primary; }}
        >
          Get in touch <ArrowDown size={14} className="rotate-[-90deg]" />
        </a>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex flex-col items-center gap-6 px-6 md:px-12 lg:px-24 xl:px-32 py-16 text-center md:flex-row md:justify-between md:px-16 lg:px-24" style={{ borderTop: `1px solid ${border}` }}>
        <p className="text-[11px] uppercase" style={{ color: mutedFg, letterSpacing: "0.15em" }}>
          &copy; {new Date().getFullYear()} Francisco Catarro
        </p>
        <p className="text-sm" style={{ fontFamily: headingFont, color: `${fg}88` }}>
          Music is the only language that doesn't need translation.
        </p>
      </footer>
    </div>
  );
}
