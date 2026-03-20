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
          {[
            { label: "Work", id: "#electric-work" },
            { label: "Events", id: "#electric-events" },
            { label: "Contact", id: "#electric-contact" },
          ].map(({ label, id }) => (
            <button key={label} onClick={() => lenis?.scrollTo(id, { offset: -60, duration: 1.5 })} className="hidden text-xs uppercase text-white/50 transition-colors hover:text-white md:block" style={{ letterSpacing: "0.15em" }}>
              {label}
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

      {/* ═══ STATS ═══ */}
      <section id="electric-stats" className="border-t border-b border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {[
            { value: "10+", label: "Years" },
            { value: "200+", label: "Shows" },
            { value: "50+", label: "Sessions" },
            { value: "4", label: "Instruments" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-4xl text-[oklch(0.62_0.25_28)] md:text-5xl"
                style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 800 }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase text-white/40" style={{ letterSpacing: "0.25em" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="electric-services" className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
        <h2
          className="mb-12 text-xs uppercase text-white/40"
          style={{ letterSpacing: "0.25em" }}
        >
          Services
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2">
          {[
            { title: "Live Performance", desc: "High-energy shows on guitar, keys, and bass — from intimate jazz clubs to festival stages." },
            { title: "Musical Direction", desc: "Full band arrangement, rehearsal coordination, and on-stage leadership for live acts." },
            { title: "Production", desc: "Recording, mixing, and sonic shaping for tracks that need edge and warmth." },
            { title: "Session Work", desc: "Reliable, versatile studio musician available for remote and in-person sessions." },
          ].map((service) => (
            <div key={service.title} className="border border-white/10 p-8">
              <h3
                className="text-lg font-bold uppercase text-white"
                style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
              >
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{service.desc}</p>
            </div>
          ))}
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

      {/* ═══ WORK / RESUME ═══ */}
      <section id="electric-work" className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
        <h2
          className="mb-12 text-xs uppercase text-white/40"
          style={{ letterSpacing: "0.25em" }}
        >
          Experience
        </h2>
        {[
          { role: "Lead Guitar", project: "Don Gabriel", period: "2020 —" },
          { role: "Function Duo", project: "with Milena Galasso", period: "2021 —" },
          { role: "Band Leader", project: "Studio80", period: "2019 — 2020" },
          { role: "Composer", project: "Tabora / Lucas Wild", period: "2017 — 2020" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between border-t border-white/10 py-5 md:py-6"
          >
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
              <h3
                className="text-lg font-bold uppercase text-white md:text-xl"
                style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
              >
                {item.role}
              </h3>
              <span className="text-sm text-white/40">— {item.project}</span>
            </div>
            <span className="text-xs text-white/30" style={{ letterSpacing: "0.15em" }}>
              {item.period}
            </span>
          </div>
        ))}
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="electric-testimonials" className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
        <h2
          className="mb-12 text-xs uppercase text-white/40"
          style={{ letterSpacing: "0.25em" }}
        >
          Testimonials
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
          {[
            {
              quote: "One of the most versatile musicians I've worked with. He can go from a soulful ballad to a face-melting rock solo in the same set.",
              name: "Joao Silva",
              title: "Band Leader",
            },
            {
              quote: "Francisco brings something rare — technical precision with genuine emotion. Every note has intention.",
              name: "Maria Santos",
              title: "Producer",
            },
          ].map((t) => (
            <blockquote key={t.name} className="border-l-2 border-[oklch(0.62_0.25_28)] pl-6">
              <p
                className="text-lg leading-relaxed text-white/70 md:text-xl"
                style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 400 }}
              >
                "{t.quote}"
              </p>
              <footer className="mt-4">
                <span className="text-sm font-medium text-white">{t.name}</span>
                <span className="ml-2 text-xs text-white/40">— {t.title}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ═══ EVENTS ═══ */}
      <section id="electric-events" className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
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
