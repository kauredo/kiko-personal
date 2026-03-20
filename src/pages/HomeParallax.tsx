/**
 * PARALLAX — "The Reel"
 * Cinematic scroll-driven experience. Every scroll pixel is choreographed.
 * Layers move at different speeds. Text scales and transforms.
 * Horizontal scroll section. Image reveals. Speed-based depth.
 * Think: Apple product page meets concert documentary.
 */
import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { LogoMark } from "@/components/ui/LogoMark";
import { LogoFull } from "@/components/ui/LogoFull";
import { ArrowUpRight } from "lucide-react";

const MEDIA = Array.from({ length: 5 }, (_, i) => ({
  id: String(i),
  label: ["Live Performance", "Studio Session", "Backstage", "Music Video", "Album Art"][i],
}));

const EVENTS = [
  { date: "APR 15", title: "Rock Soul Night", venue: "Coliseu de Lisboa" },
  { date: "MAY 02", title: "Jazz & Soul Session", venue: "Hot Clube" },
  { date: "JUN 20", title: "Summer Festival", venue: "Parque das Nacoes" },
];

export function HomeParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    const container = containerRef.current;

    const ctx = gsap.context(() => {
      // ── Hero name scale-down on scroll ──
      const heroName = container.querySelector(".hero-name");
      const heroSubtext = container.querySelector(".hero-subtext");
      if (heroName) {
        gsap.to(heroName, {
          scale: 0.4,
          y: -200,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroName,
            start: "top top",
            end: "+=600",
            scrub: true,
          },
        });
      }
      if (heroSubtext) {
        gsap.to(heroSubtext, {
          y: -100,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroSubtext,
            start: "top 30%",
            end: "+=400",
            scrub: true,
          },
        });
      }

      // ── Statement text: scale from huge to readable ──
      const statementText = container.querySelector(".statement-text");
      if (statementText) {
        gsap.fromTo(
          statementText,
          { scale: 2.5, opacity: 0, filter: "blur(10px)" },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: statementText,
              start: "top bottom",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      }

      // ── Horizontal scroll gallery ──
      const hSection = container.querySelector(".h-scroll-section");
      const hTrack = container.querySelector(".h-scroll-track");
      if (hSection && hTrack) {
        const totalWidth = (hTrack as HTMLElement).scrollWidth - window.innerWidth;
        gsap.to(hTrack, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: hSection,
            start: "top top",
            end: () => `+=${totalWidth * 0.7}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });
      }

      // ── Parallax background layers ──
      container.querySelectorAll("[data-speed]").forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.speed || "0");
        gsap.to(el, {
          y: () => speed * 200,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // ── Fade-in reveals ──
      container.querySelectorAll(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });

      // ── Counter animation ──
      container.querySelectorAll(".counter").forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.target || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
          onUpdate: () => {
            (el as HTMLElement).textContent = Math.floor(obj.val) + "+";
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[oklch(0.05_0.005_260)] text-white overflow-hidden"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      {/* ═══ BACKGROUND STRINGS ═══ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {[15, 29, 43, 57, 71, 85].map((pct, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={{
              left: `${pct}%`,
              width: [2.5, 2, 1.5, 1.2, 1, 0.8][i],
              background: "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.07) 70%, rgba(255,255,255,0.03))",
            }}
          />
        ))}
      </div>

      {/* ═══ NAV ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 mix-blend-difference md:px-16 lg:px-24"
      >
        <LogoMark size={32} />
        <div className="flex items-center gap-6">
          {[
            { label: "About", id: "#parallax-about" },
            { label: "Portfolio", id: "#parallax-portfolio" },
            { label: "Work", id: "#parallax-work" },
            { label: "Events", id: "#parallax-events" },
            { label: "Contact", id: "#parallax-contact" },
          ].map(({ label, id }) => (
            <button key={label} onClick={() => document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="hidden text-xs uppercase text-white/50 transition-colors hover:text-white md:block" style={{ letterSpacing: "0.15em" }}>
              {label}
            </button>
          ))}
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ═══ HERO — Name scales down as you scroll ═══ */}
      <section className="relative flex min-h-[150vh] flex-col">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center">

          <div className="hero-name text-center" style={{ willChange: "transform" }}>
            <h1
              className="leading-[0.85]"
              style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 9vw, 10rem)",
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
              }}
            >
              <span className="block">Francisco</span>
              <span className="block" style={{ color: "oklch(0.62 0.25 28)" }}>Catarro</span>
            </h1>
          </div>

          <div className="hero-subtext mt-8 text-center">
            <p className="text-sm tracking-[0.3em] uppercase text-white/40">
              Guitar &middot; Keys &middot; Musical Direction &middot; Production
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 flex flex-col items-center gap-2">
            <div className="h-12 w-px bg-gradient-to-b from-transparent to-white/30" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          </div>
        </div>
      </section>

      {/* ═══ STATEMENT — Text scales from huge to readable ═══ */}
      <section className="flex min-h-screen items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="statement-text max-w-4xl text-center" style={{ willChange: "transform" }}>
          <p
            className="text-3xl leading-snug md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Born in Portugal, based in the UK — over 10 years of guitar, keys, and bass. He doesn't
            just show up, he{" "}
            <span style={{ color: "oklch(0.62 0.25 28)" }}>transforms</span> the room.
          </p>
        </div>
      </section>

      {/* ═══ LOGO REVEAL ═══ */}
      <section className="flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="reveal" data-speed="-0.1">
          <LogoFull size={280} className="text-white/30" />
        </div>
      </section>

      {/* ═══ STATS — Counters animate on scroll ═══ */}
      <section className="grid grid-cols-2 border-t border-b border-white/10 md:grid-cols-4">
        {[
          { target: 10, label: "Years" },
          { target: 200, label: "Shows" },
          { target: 50, label: "Sessions" },
          { target: 4, label: "Instruments" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center py-16 md:py-20" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
            <span
              className="counter text-4xl md:text-5xl"
              data-target={stat.target}
              style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700 }}
            >
              0+
            </span>
            <span className="mt-2 text-[11px] tracking-[0.2em] uppercase text-white/40">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="parallax-about" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="reveal mb-3 text-[10px] tracking-[0.3em] uppercase text-white/30">Background</p>
            <h2
              className="reveal text-3xl md:text-5xl"
              style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em" }}
            >
              About
            </h2>
          </div>
          <div className="space-y-6 text-white/70 leading-relaxed">
            <p className="reveal">
              Francisco Catarro is a guitarist, pianist, musical director, and producer whose playing
              carries the raw energy of a live stage and the precision of years behind the keys.
            </p>
            <p className="reveal">
              From rock clubs to symphony halls — he doesn't just show up, he transforms the room.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="parallax-services" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <p className="reveal mb-3 text-[10px] tracking-[0.3em] uppercase text-white/30">What I do</p>
          <h2
            className="reveal mb-16 text-3xl md:text-5xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em" }}
          >
            Services
          </h2>
          <div className="grid gap-px md:grid-cols-2" style={{ background: "rgba(255,255,255,0.1)" }}>
            {[
              { title: "Live Performance", desc: "High-energy sets on guitar, keys, and bass — from intimate venues to festival stages." },
              { title: "Musical Direction", desc: "Shaping the sound, leading rehearsals, and running the show from first note to last." },
              { title: "Production", desc: "Full-cycle music production — arrangement, recording, mixing, and creative direction." },
              { title: "Session Work", desc: "Reliable, versatile session musician for studio recordings and live collaborations." },
            ].map((service, i) => (
              <div
                key={i}
                className="reveal p-8 md:p-10"
                style={{ background: "oklch(0.05 0.005 260)" }}
              >
                <h3
                  className="mb-3 text-lg font-bold uppercase md:text-xl"
                  style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HORIZONTAL SCROLL GALLERY ═══ */}
      <section id="parallax-portfolio" className="h-scroll-section overflow-hidden">
        <div className="flex min-h-screen flex-col justify-center py-16">
          <div className="mb-10 flex items-end justify-between px-8 md:px-16 lg:px-24">
            <div>
              <p className="mb-2 text-[10px] tracking-[0.3em] uppercase text-white/30">Portfolio</p>
              <h2
                className="text-3xl md:text-5xl"
                style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em" }}
              >
                See &amp; Hear
              </h2>
            </div>
          </div>

          <div className="h-scroll-track flex gap-4 px-8 md:px-16 lg:px-24">
            {MEDIA.map((item, i) => (
              <div
                key={item.id}
                className="group relative flex-shrink-0 cursor-pointer overflow-hidden"
                style={{
                  width: i === 0 ? "50vw" : "35vw",
                  aspectRatio: i === 0 ? "4/3" : "3/4",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                data-speed={i % 2 === 0 ? "0.05" : "-0.05"}
              >
                <div className="flex h-full items-center justify-center text-white/10">
                  <span className="text-[10px] tracking-[0.2em] uppercase">{item.label}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-black/80 p-5 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WORK / RESUME ═══ */}
      <section id="parallax-work" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <p className="reveal mb-3 text-[10px] tracking-[0.3em] uppercase text-white/30">Experience</p>
          <h2
            className="reveal mb-16 text-3xl md:text-5xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em" }}
          >
            Work
          </h2>
          {[
            { role: "Lead Guitar", project: "Don Gabriel", period: "2020 —" },
            { role: "Function Duo", project: "with Milena Galasso", period: "2021 —" },
            { role: "Band Leader", project: "Studio80", period: "2019 — 2020" },
            { role: "Composer", project: "Tabora / Lucas Wild", period: "2017 — 2020" },
          ].map((item, i) => (
            <div
              key={i}
              className="reveal flex items-center justify-between border-b border-white/10 py-8"
            >
              <div className="flex items-baseline gap-8 md:gap-12">
                <span
                  className="w-36 text-sm font-bold uppercase md:text-base"
                  style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
                >
                  {item.role}
                </span>
                <span className="text-white/40">{item.project}</span>
              </div>
              <span className="text-sm text-white/30">{item.period}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="parallax-testimonials" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <p className="reveal mb-3 text-[10px] tracking-[0.3em] uppercase text-white/30">Kind words</p>
          <h2
            className="reveal mb-16 text-3xl md:text-5xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em" }}
          >
            Testimonials
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
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
            ].map((t, i) => (
              <blockquote
                key={i}
                className="reveal border-l-2 py-2 pl-8"
                style={{ borderColor: "oklch(0.62 0.25 28)" }}
              >
                <p className="mb-6 text-lg leading-relaxed text-white/70">"{t.quote}"</p>
                <footer>
                  <span
                    className="text-sm font-bold uppercase"
                    style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
                  >
                    {t.name}
                  </span>
                  <span className="ml-2 text-sm text-white/30">— {t.title}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EVENTS with parallax offset ═══ */}
      <section id="parallax-events" className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <p className="reveal mb-3 text-[10px] tracking-[0.3em] uppercase text-white/30">Upcoming</p>
          <h2
            className="reveal mb-16 text-3xl md:text-5xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.02em" }}
          >
            Catch me live
          </h2>
          {EVENTS.map((event, i) => (
            <div key={i} className="reveal group flex items-center justify-between border-b border-white/10 py-8 transition-colors hover:bg-white/[0.02]">
              <div className="flex items-baseline gap-8 md:gap-12">
                <span
                  className="w-24 text-3xl text-white/20 md:text-4xl"
                  style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 700 }}
                  data-speed="0.02"
                >
                  {event.date}
                </span>
                <div>
                  <h3
                    className="text-lg font-bold uppercase md:text-xl"
                    style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
                  >
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/40">{event.venue}</p>
                </div>
              </div>
              <ArrowUpRight size={20} className="text-white/20 transition-colors group-hover:text-white/60" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT — Dramatic reveal ═══ */}
      <section id="parallax-contact" className="relative flex min-h-[60vh] items-center justify-center overflow-hidden" style={{ background: "oklch(0.62 0.25 28)" }}>
        <div className="reveal relative z-10 text-center px-8">
          <h2
            className="mb-6 text-4xl font-bold uppercase md:text-6xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.02em" }}
          >
            Let's work together
          </h2>
          <p className="mb-10 text-white/70">Booking, collaboration, sessions, or just say hi.</p>
          <a
            href="mailto:contact@franciscocatarro.com"
            className="inline-flex items-center gap-3 border-2 border-white px-12 py-5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex items-center justify-between px-8 py-8 text-[11px] tracking-[0.15em] text-white/20 md:px-16 lg:px-24">
        <span>&copy; {new Date().getFullYear()} Francisco Catarro</span>
        <span>Guitar &middot; Keys &middot; MD &middot; Production</span>
      </footer>
    </div>
  );
}
