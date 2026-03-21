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
import { ArrowUpRight, Mail, Instagram, Youtube, Music2, Linkedin } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { useHomeData } from "@/hooks/useHomeData";
import { useGallery } from "@/context/GalleryContext";
import { AudioCard } from "@/components/ui/AudioCard";
import { VideoCard } from "@/components/ui/VideoCard";

const accent = "oklch(0.62 0.25 28)";
const bgColor = "oklch(0.06 0.005 260)";

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return Instagram;
  if (p.includes("youtube")) return Youtube;
  if (p.includes("spotify") || p.includes("music")) return Music2;
  if (p.includes("linkedin")) return Linkedin;
  return Mail;
}

const NAV_LINKS = [
  { label: "About", id: "#electric-about" },
  { label: "Portfolio", id: "#electric-portfolio" },
  { label: "Work", id: "#electric-work" },
  { label: "Events", id: "#electric-events" },
  { label: "Contact", id: "#electric-contact" },
];

export function HomeElectric() {
  const { events, experiences, testimonials, stats, services, settings, media, photos, videos, music, bio } = useHomeData();
  const openGallery = useGallery();
  const allMedia = [...photos, ...videos, ...music];
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
        style={{ background: `linear-gradient(to bottom, ${bgColor} 0%, oklch(0.06 0.005 260 / 0.8) 60%, transparent 100%)` }}
      >
        <div className="flex items-center gap-3">
          <LogoMark size={28} className="text-white" />
          <span className="hidden text-xs font-bold uppercase tracking-wider text-white sm:block" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>{bio.name}</span>
        </div>
        <div className="flex items-center gap-8">
          {NAV_LINKS.map(({ label, id }) => (
            <button key={label} onClick={() => lenis?.scrollTo(id, { offset: -60, duration: 1.5 })} className="hidden text-xs uppercase text-white/50 transition-colors hover:text-white focus-visible:underline md:block" style={{ letterSpacing: "0.15em" }}>
              {label}
            </button>
          ))}
          <ThemeSwitcher />
          <MobileMenu links={NAV_LINKS} scrollTo={(id) => lenis?.scrollTo(id, { offset: -60, duration: 1.5 })} color="white" bgColor={bgColor} headingFont="'Syne', system-ui, sans-serif" />
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
            <span className="block text-white">{bio.firstName}</span>
            <span className="block text-[oklch(0.62_0.25_28)]">{bio.lastName}</span>
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
      <section id="electric-about" className="border-t border-white/10 px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-12 md:flex-row md:items-center md:gap-20">
          <LogoFull size={200} className="flex-shrink-0 text-white/40" />
          <p
            className="text-2xl leading-relaxed text-white/70 md:text-3xl lg:text-4xl"
            style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 400 }}
          >
            Born in Portugal, based in the UK. Guitar, keys, bass — over 10 years
            making rooms <span className="text-[oklch(0.62_0.25_28)]">louder, tighter, and impossible to leave</span>.
          </p>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section id="electric-stats" className="border-t border-b border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat) => (
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
          {services.map((service) => (
            <div key={service.title} className="border border-white/10 p-8">
              <h3
                className="text-lg font-bold uppercase text-white"
                style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
              >
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PHOTOS ═══ */}
      {photos.length > 0 && (
        <section id="electric-portfolio" className="border-t border-white/10 py-16 md:py-24">
          <div className="mb-10 px-8 md:px-16 lg:px-24">
            <h2
              className="text-xs uppercase text-white/40"
              style={{ letterSpacing: "0.25em" }}
            >
              Photos
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-8 pb-4 md:px-16 lg:px-24">
            {photos.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="group relative aspect-[3/4] w-64 flex-shrink-0 overflow-hidden bg-white/[0.10] text-left focus-visible:ring-2 focus-visible:ring-[oklch(0.62_0.25_28)] md:w-80"
                onClick={() => openGallery(allMedia, allMedia.findIndex(m => m.id === item.id))}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/15">
                    <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>photo</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-[oklch(0.06_0.005_260)] p-4 translate-y-0 md:translate-y-full transition-transform duration-300 md:group-hover:translate-y-0">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ═══ VIDEOS ═══ */}
      {videos.length > 0 && (
        <section className="border-t border-white/10 py-16 md:py-24">
          <div className="mb-10 px-8 md:px-16 lg:px-24">
            <h2 className="text-xs uppercase text-white/40" style={{ letterSpacing: "0.25em" }}>Videos</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-8 pb-4 md:px-16 lg:px-24">
            {videos.map((item, i) => (
              item.imageUrl ? (
                <VideoCard key={item.id} src={item.imageUrl!} title={item.title} className="h-64 flex-shrink-0 bg-white/[0.10] md:h-80" onClick={() => openGallery(allMedia, allMedia.findIndex(m => m.id === item.id))} />
              ) : (
                <div key={item.id} className="aspect-video h-64 flex-shrink-0 bg-white/[0.10] md:h-80">
                  <div className="flex h-full items-center justify-center text-white/15">
                    <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>video</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {/* ═══ MUSIC ═══ */}
      {music.length > 0 && (
        <section className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
          <h2 className="mb-8 text-xs uppercase text-white/40" style={{ letterSpacing: "0.25em" }}>Music</h2>
          <div className="mx-auto max-w-3xl">
            {music.map((item) => (
              <AudioCard key={item.id} item={item} accentColor={accent} bgColor={bgColor} fgColor="white" mutedColor="rgba(255,255,255,0.4)" />
            ))}
          </div>
        </section>
      )}

      {/* ═══ WORK / RESUME ═══ */}
      {experiences.length > 0 && (
        <section id="electric-work" className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
          <h2
            className="mb-12 text-xs uppercase text-white/40"
            style={{ letterSpacing: "0.25em" }}
          >
            Experience
          </h2>
          {experiences.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 border-t border-white/10 py-5 md:flex-row md:items-baseline md:justify-between md:py-6"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                <h3
                  className="text-lg font-bold uppercase text-white md:text-xl"
                  style={{ fontFamily: "'Syne', system-ui, sans-serif", letterSpacing: "-0.01em" }}
                >
                  {item.title}
                </h3>
                <span className="text-sm text-white/40">— {item.organization}</span>
              </div>
              <span className="text-xs text-white/30" style={{ letterSpacing: "0.15em" }}>
                {item.period}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* ═══ TESTIMONIALS ═══ */}
      {testimonials.length > 0 && (
        <section id="electric-testimonials" className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
          <h2
            className="mb-12 text-xs uppercase text-white/40"
            style={{ letterSpacing: "0.25em" }}
          >
            Testimonials
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.authorName} className="border-l-2 border-[oklch(0.62_0.25_28)] pl-6">
                <p
                  className="text-lg leading-relaxed text-white/70 md:text-xl"
                  style={{ fontFamily: "'Syne', system-ui, sans-serif", fontWeight: 400 }}
                >
                  "{t.quote}"
                </p>
                <footer className="mt-4">
                  <span className="text-sm font-medium text-white">{t.authorName}</span>
                  <span className="ml-2 text-xs text-white/40">— {t.authorRole}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* ═══ EVENTS ═══ */}
      {events.length > 0 && (
        <section id="electric-events" className="border-t border-white/10 px-8 py-16 md:px-16 md:py-24 lg:px-24">
          <h2
            className="mb-12 text-xs uppercase text-white/40"
            style={{ letterSpacing: "0.25em" }}
          >
            Events
          </h2>
          {events.map((event, i) => (
            <div
              key={i}
              className="group flex flex-col gap-3 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between md:py-8"
            >
              <div className="flex items-baseline gap-6 md:gap-10">
                <span
                  className="text-lg font-medium text-white/30 md:w-20 md:text-3xl"
                  style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
                >
                  {event.dateShort}
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
              {event.ticketUrl && (
                <a href={event.ticketUrl} className="flex items-center gap-2 text-xs font-medium uppercase text-[oklch(0.62_0.25_28)] transition-colors hover:text-white" style={{ letterSpacing: "0.15em" }}>
                  Tickets <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          ))}
        </section>
      )}

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
            href={`mailto:${settings.contactEmail}`}
            className="inline-flex items-center gap-3 border-2 border-white px-10 py-4 text-sm font-medium uppercase text-white transition-colors hover:bg-white hover:text-[oklch(0.62_0.25_28)]"
            style={{ letterSpacing: "0.2em" }}
          >
            <Mail size={16} /> Get in touch
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex flex-col items-center gap-4 border-t border-white/10 px-8 py-8 text-xs text-white/30 md:flex-row md:justify-between md:px-16 lg:px-24" style={{ letterSpacing: "0.1em" }}>
        <span>&copy; {new Date().getFullYear()} {bio.name}</span>
        <div className="flex items-center gap-4">
          {settings.socialLinks.map((link) => {
            const Icon = getSocialIcon(link.platform);
            return (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform} className="flex h-10 w-10 items-center justify-center text-white/30 transition-colors hover:text-white/60">
                <Icon size={16} />
              </a>
            );
          })}
        </div>
        <span>GUITAR &middot; KEYS &middot; MD &middot; PRODUCTION</span>
      </footer>
    </div>
  );
}
