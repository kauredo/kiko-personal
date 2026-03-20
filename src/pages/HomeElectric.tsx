/**
 * ELECTRIC — "The Stage"
 * Brutalist concert poster. Maximum impact, minimal sections.
 * Full-bleed name, horizontal media strip, bold event ticker.
 * Syne 800 uppercase. Red on black. Zero radius.
 */
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HeroScene } from "@/components/three/HeroScene";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { LogoMark } from "@/components/ui/LogoMark";
import { LogoFull } from "@/components/ui/LogoFull";
import { ArrowUpRight, Mail } from "lucide-react";

const MEDIA_ITEMS = Array.from({ length: 6 }, (_, i) => ({
  id: String(i),
  type: (["photo", "video", "music"] as const)[i % 3],
  label: ["Live at Coliseu", "Studio Session", "Album Track", "Backstage", "Music Video", "Rehearsal"][i],
}));

const EVENTS = [
  { date: "APR 15", title: "Rock Soul Night", venue: "Coliseu de Lisboa", tickets: true },
  { date: "MAY 02", title: "Jazz & Soul Session", venue: "Hot Clube", tickets: false },
  { date: "JUN 20", title: "Summer Festival", venue: "Parque das Nacoes", tickets: true },
];

export function HomeElectric() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    if (prefersReducedMotion || !nameRef.current) return;
    gsap.fromTo(nameRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, ease: "expo.out", delay: 0.3 });
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen bg-[oklch(0.06_0.005_260)] text-white" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      {/* ═══ NAV ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 md:px-16 lg:px-24"
        style={{ background: "linear-gradient(to bottom, oklch(0.06 0.005 260) 0%, oklch(0.06 0.005 260 / 0.8) 60%, transparent 100%)" }}
      >
        <LogoMark size={36} className="text-white" />
        <div className="flex items-center gap-8">
          {["Work", "Events", "Contact"].map((l) => (
            <button key={l} onClick={() => lenis?.scrollTo(`#electric-${l.toLowerCase()}`, { offset: -40, duration: 1.5 })} className="hidden text-xs uppercase text-white/50 transition-colors hover:text-white md:block" style={{ letterSpacing: "0.15em" }}>
              {l}
            </button>
          ))}
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-screen flex-col justify-end px-8 pb-20 md:px-16 lg:px-24">
        <HeroScene />
        <div className="relative z-10">
          <h1
            ref={nameRef}
            className="leading-[0.88]"
            style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 8vw, 8rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
            }}
          >
            <span className="block text-white">Francisco</span>
            <span className="block text-[oklch(0.62_0.25_28)]">Catarro</span>
          </h1>

          <div className="mt-10 flex flex-col gap-8">
            <button
              onClick={() => lenis?.scrollTo("#electric-contact", { offset: -40, duration: 1.5 })}
              className="group inline-flex w-fit items-center gap-4 bg-[oklch(0.62_0.25_28)] px-12 py-5 text-sm font-bold uppercase text-white transition-opacity hover:opacity-90"
              style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "0.15em" }}
            >
              Work with me
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <p className="text-xs text-white/40" style={{ letterSpacing: "0.2em" }}>
              GUITAR &middot; KEYS &middot; MUSICAL DIRECTION &middot; PRODUCTION
            </p>
          </div>
        </div>
      </section>

      {/* ═══ STATEMENT ═══ */}
      <section className="border-t border-white/10 px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-12 md:flex-row md:items-center md:gap-20">
          <LogoFull size={200} className="flex-shrink-0 text-white/40" />
          <p
            className="text-2xl leading-relaxed text-white/70 md:text-3xl lg:text-4xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 400 }}
          >
            Born in Portugal, based in the UK — over 10 years on guitar, keys, and bass.
            He doesn't just show up, he <span className="text-[oklch(0.62_0.25_28)]">transforms the room</span>.
          </p>
        </div>
      </section>

      {/* ═══ MEDIA STRIP ═══ */}
      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between px-6 md:px-12 lg:px-24 xl:px-32">
          <h2
            className="text-xs uppercase text-white/40"
            style={{ letterSpacing: "0.25em" }}
          >
            Portfolio
          </h2>
          <span className="text-xs uppercase text-[oklch(0.62_0.25_28)]" style={{ letterSpacing: "0.2em" }}>
            View all
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-8 pb-4 md:px-16 lg:px-24">
          {MEDIA_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="group relative aspect-[3/4] w-64 flex-shrink-0 cursor-pointer overflow-hidden bg-white/[0.10] md:w-80"
            >
              <div className="flex h-full items-center justify-center text-white/15">
                <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>{item.type}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-[oklch(0.06_0.005_260)] p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <p className="text-sm font-medium text-white">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ EVENTS ═══ */}
      <section className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
        <h2
          className="mb-12 text-xs uppercase text-white/40"
          style={{ letterSpacing: "0.25em" }}
        >
          Upcoming
        </h2>
        {EVENTS.map((event, i) => (
          <div
            key={i}
            className="group flex items-center justify-between border-b border-white/10 py-6 transition-colors hover:bg-white/[0.02] md:py-8"
          >
            <div className="flex items-baseline gap-6 md:gap-10">
              <span
                className="w-20 text-2xl font-medium text-white/30 md:text-3xl"
                style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
              >
                {event.date}
              </span>
              <div>
                <h3
                  className="text-lg font-bold uppercase text-white md:text-xl"
                  style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
                >
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-white/40">{event.venue}</p>
              </div>
            </div>
            {event.tickets && (
              <a href="#" className="flex items-center gap-2 text-xs font-medium uppercase text-[oklch(0.62_0.25_28)] transition-colors hover:text-white" style={{ letterSpacing: "0.15em" }}>
                Tickets <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        ))}
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="electric-contact" className="bg-[oklch(0.62_0.25_28)] px-8 py-20 md:px-16 md:py-28 lg:px-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="mb-6 text-3xl font-bold uppercase text-white md:text-5xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.02em" }}
          >
            Let's work together
          </h2>
          <p className="mb-10 text-white/70">
            Booking, collaboration, sessions, or just say hi.
          </p>
          <a
            href="mailto:contact@franciscocatarro.com"
            className="inline-flex items-center gap-3 border-2 border-white px-10 py-4 text-sm font-medium uppercase text-white transition-colors hover:bg-white hover:text-[oklch(0.62_0.25_28)]"
            style={{ letterSpacing: "0.2em" }}
          >
            <Mail size={16} /> Get in touch
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex items-center justify-between border-t border-white/10 px-8 py-8 text-xs text-white/30 md:px-16 lg:px-24" style={{ letterSpacing: "0.1em" }}>
        <span>&copy; {new Date().getFullYear()} Francisco Catarro</span>
        <span>GUITAR &middot; KEYS &middot; MD &middot; PRODUCTION</span>
      </footer>
    </div>
  );
}
