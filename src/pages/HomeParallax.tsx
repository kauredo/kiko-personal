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
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 mix-blend-difference md:px-16 lg:px-24">
        <LogoMark size={32} />
        <div className="flex items-center gap-6">
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ═══ HERO — Name scales down as you scroll ═══ */}
      <section className="relative flex min-h-[150vh] flex-col">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
          {/* Background parallax layers */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            data-speed="-0.3"
            style={{
              backgroundImage: "url(/svg/soundwave.svg)",
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center",
            }}
          />

          <div className="hero-name text-center" style={{ willChange: "transform" }}>
            <h1
              className="leading-[0.85]"
              style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(5rem, 18vw, 20rem)",
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

      {/* ═══ HORIZONTAL SCROLL GALLERY ═══ */}
      <section className="h-scroll-section overflow-hidden">
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

      {/* ═══ EVENTS with parallax offset ═══ */}
      <section className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
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
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden" style={{ background: "oklch(0.62 0.25 28)" }}>
        <div className="absolute inset-0 opacity-10" data-speed="-0.15" style={{ backgroundImage: "url(/svg/soundwave.svg)", backgroundSize: "120% auto", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
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
