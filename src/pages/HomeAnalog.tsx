/**
 * ANALOG — "The Record"
 * Warm editorial. Vinyl sleeve meets indie magazine.
 * DM Serif Display italic. Cream + burnt sienna. Offset shadows.
 * Split-screen hero, alternating media layout, inline testimonials.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLenis } from "@/hooks/useLenis";
import { useHomeData } from "@/hooks/useHomeData";
import { useGallery } from "@/context/GalleryContext";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { LogoMark } from "@/components/ui/LogoMark";
import { LogoFull } from "@/components/ui/LogoFull";
import { ArrowDown, Mail, Instagram, Youtube, Music2, Linkedin } from "lucide-react";
import { AudioCard } from "@/components/ui/AudioCard";
import { VideoCard } from "@/components/ui/VideoCard";

const bg = "oklch(0.93 0.015 75)";
const fg = "oklch(0.15 0.03 40)";
const primary = "oklch(0.38 0.14 28)";
const muted = "oklch(0.83 0.025 68)";
const mutedFg = "oklch(0.50 0.02 50)";
const card = "oklch(0.88 0.02 68)";
const headingFont = "'DM Serif Display', Georgia, serif";
const bodyFont = "'Space Grotesk', system-ui, sans-serif";

function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return Instagram;
  if (p.includes("youtube")) return Youtube;
  if (p.includes("spotify") || p.includes("music")) return Music2;
  if (p.includes("linkedin")) return Linkedin;
  return Mail;
}

const NAV_LINKS = [
  { label: "About", id: "#analog-about" },
  { label: "Portfolio", id: "#analog-media" },
  { label: "Work", id: "#analog-work" },
  { label: "Events", id: "#analog-events" },
  { label: "Contact", id: "#analog-contact" },
];

export function HomeAnalog() {
  const lenis = useLenis();
  const { events, experiences, testimonials, stats, services, settings, media, photos, videos, music, bio } = useHomeData();
  const openGallery = useGallery();
  const allMedia = [...photos, ...videos, ...music];
  const submitContact = useMutation(api.contact.submit);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  return (
    <div className="min-h-screen" style={{ background: bg, color: fg, fontFamily: bodyFont }}>
      {/* ═══ HERO — Split screen ═══ */}
      <section className="grid md:min-h-screen md:grid-cols-2">
        {/* Left: Image */}
        <div style={{ background: card }} className="hidden items-center justify-center md:flex">
          <LogoFull size={240} style={{ color: primary, opacity: 0.6 }} />
        </div>

        {/* Right: Name + Info */}
        <div className="flex min-h-[85vh] flex-col justify-between px-8 py-8 md:min-h-0 md:px-12 md:py-12 lg:px-16">
          <nav className="flex items-center justify-between">
            <div>
              <LogoMark size={24} style={{ color: fg }} />
            </div>
            <div className="flex items-center gap-6">
              {NAV_LINKS.map(({ label, id }) => (
                <button key={label} onClick={() => lenis?.scrollTo(id, { offset: -40, duration: 1.5 })} className="hidden text-xs uppercase transition-colors hover:opacity-70 md:block" style={{ letterSpacing: "0.15em", color: mutedFg }}>
                  {label}
                </button>
              ))}
              <ThemeSwitcher variant="dark" />
              <MobileMenu links={NAV_LINKS} scrollTo={(id) => lenis?.scrollTo(id, { offset: -40, duration: 1.5 })} color={fg} bgColor={bg} headingFont={headingFont} />
            </div>
          </nav>

          <div>
            <h1 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {bio.firstName}<br />
              <span style={{ color: primary }}>{bio.lastName}</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-relaxed" style={{ color: mutedFg }}>
              Guitarist, pianist &amp; multi-instrumentalist. Born in Portugal,
              based in the UK. Over 10 years of live and studio experience.
            </p>
            <button
              onClick={() => lenis?.scrollTo("#analog-contact", { offset: -40, duration: 1.5 })}
              className="mt-8 inline-flex items-center gap-2 border-2 px-8 py-3.5 text-xs font-medium uppercase transition-colors"
              style={{ borderColor: primary, color: primary, letterSpacing: "0.15em", borderRadius: "3px", background: "transparent" }}
            >
              Work with me <ArrowDown size={14} />
            </button>
          </div>

          <p className="text-[10px] uppercase" style={{ color: mutedFg, letterSpacing: "0.2em" }}>
            Guitar &middot; Keys &middot; MD &middot; Production
          </p>
        </div>
      </section>

      {/* ═══ QUOTE BREAK ═══ */}
      {testimonials.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
          <blockquote
            className="mx-auto max-w-3xl text-center text-xl leading-relaxed md:text-2xl lg:text-3xl"
            style={{ fontFamily: headingFont, fontStyle: "italic", color: fg }}
          >
            "{testimonials[0].quote}"
          </blockquote>
          <p className="mt-6 text-center text-xs" style={{ color: mutedFg, letterSpacing: "0.15em" }}>
            — {testimonials[0].authorName.toUpperCase()}{testimonials[0].authorRole ? `, ${testimonials[0].authorRole.toUpperCase()}` : ""}
          </p>
        </section>
      )}

      {/* ═══ ABOUT ═══ */}
      <section id="analog-about" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>About</p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Where soul<br />meets precision.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <p className="leading-relaxed" style={{ color: fg }}>
              Francisco Catarro is a guitarist, pianist, musical director, and producer whose playing
              carries the raw energy of a live stage and the precision of years behind the keys.
            </p>
            <p className="leading-relaxed" style={{ color: mutedFg }}>
              Born in Portugal, based in the UK. Over 10 years of performing, composing, arranging,
              and recording across genres — from rock clubs to symphony halls.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section id="analog-stats" className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${muted}`, borderBottom: `1px solid ${muted}` }}>
        {stats.map((stat, i) => (
          <div key={stat.label} className={`flex flex-col items-center py-10 md:py-14 ${i % 2 === 0 ? "max-md:border-r" : ""} ${i < stats.length - 1 ? "md:border-r" : ""}`} style={{ borderColor: muted }}>
            <span className="text-3xl md:text-4xl" style={{ fontFamily: headingFont, color: primary }}>{stat.value}</span>
            <span className="mt-2 text-[11px] uppercase" style={{ color: mutedFg, letterSpacing: "0.15em" }}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ═══ PHOTOS — Dark breakout section ═══ */}
      {photos.length > 0 && (
        <section id="analog-media" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ background: fg, color: bg }}>
          <div className="mb-12">
            <p className="mb-2 text-xs uppercase" style={{ color: `${bg}88`, letterSpacing: "0.2em" }}>Portfolio</p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: bg }}>Photos</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {photos.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group relative cursor-pointer overflow-hidden"
                onClick={() => openGallery(allMedia, allMedia.findIndex(m => m.id === item.id))}
                style={{
                  background: `${fg}dd`,
                  aspectRatio: "4/5",
                  borderRadius: "3px",
                  border: `1px solid ${bg}15`,
                }}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center" style={{ color: `${bg}33` }}>
                    <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>photo</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-2.5 opacity-100 md:translate-y-full md:opacity-0 md:transition-all md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100" style={{ background: `linear-gradient(to top, ${fg}, transparent)` }}>
                  <p className="text-[11px] font-medium" style={{ color: bg }}>{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ VIDEOS ═══ */}
      {videos.length > 0 && (
        <section className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ background: fg, color: bg, borderTop: `1px solid ${bg}15` }}>
          <div className="mb-12">
            <p className="mb-2 text-xs uppercase" style={{ color: `${bg}88`, letterSpacing: "0.2em" }}>Portfolio</p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: bg }}>Videos</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {videos.map((item) => (
              item.imageUrl ? (
                <VideoCard key={item.id} src={item.imageUrl!} title={item.title} onClick={() => openGallery(allMedia, allMedia.findIndex(m => m.id === item.id))} style={{ background: `${fg}dd`, borderRadius: "3px", border: `1px solid ${bg}15` }} />
              ) : (
                <div key={item.id} style={{ background: `${fg}dd`, aspectRatio: "16/9", borderRadius: "3px", border: `1px solid ${bg}15` }}>
                  <div className="flex h-full items-center justify-center" style={{ color: `${bg}33` }}>
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
        <section className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
          <div className="mb-12">
            <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Listen</p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Music</h2>
          </div>
          <div className="mx-auto max-w-3xl">
            {music.map((item) => (
              <AudioCard key={item.id} item={item} accentColor={primary} bgColor={bg} fgColor={fg} mutedColor={mutedFg} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ WORK / RESUME ═══ */}
      {experiences.length > 0 && (
        <section id="analog-work" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
          <div className="mb-12">
            <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Experience</p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>The work so far</h2>
          </div>
          {experiences.map((w, i) => (
            <div key={i} className="grid gap-2 py-6 md:grid-cols-[120px_1fr_1.5fr] md:gap-8" style={{ borderTop: `1px solid ${muted}` }}>
              <span className="text-xs" style={{ color: mutedFg, letterSpacing: "0.1em" }}>{w.period}</span>
              <div>
                <h3 className="text-base font-medium">{w.title}</h3>
                <p className="text-sm" style={{ color: primary }}>{w.organization}</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: mutedFg }}>{w.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* ═══ SERVICES ═══ */}
      <section id="analog-services" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ background: card }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Services</p>
          <h2 className="mb-12" style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>What I do</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.title} className="border-t py-6" style={{ borderColor: muted }}>
                <h3 className="text-base font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: mutedFg }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EVENTS ═══ */}
      {events.length > 0 && (
        <section id="analog-events" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Events</p>
              <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Catch me live</h2>
            </div>
          </div>
          {events.map((e, i) => (
            <div key={i} className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between" style={{ borderTop: `1px solid ${muted}` }}>
              <div className="flex items-baseline gap-6">
                <span className="text-sm" style={{ color: mutedFg }}>{e.dateFormatted}</span>
                <h3 className="font-medium">{e.title}</h3>
              </div>
              <span className="text-sm" style={{ color: mutedFg }}>{e.venue}</span>
            </div>
          ))}
        </section>
      )}

      {/* ═══ CONTACT ═══ */}
      <section id="analog-contact" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ background: card }}>
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-center" style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Let's make something
          </h2>
          <p className="mb-10 text-center text-sm" style={{ color: mutedFg }}>
            Booking, collaboration, lessons, or just say hi.
          </p>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!formData.name || !formData.email || !formData.message) return;
            setFormStatus("sending");
            try {
              await submitContact({ name: formData.name, email: formData.email, message: formData.message, inquiryType: "general" });
              setFormStatus("sent");
              setFormData({ name: "", email: "", message: "" });
              setTimeout(() => setFormStatus("idle"), 3000);
            } catch {
              setFormStatus("error");
            }
          }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} className="w-full border px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:border-[oklch(0.38_0.14_28)]" style={{ borderColor: muted, background: bg, borderRadius: "3px", color: fg }} />
              <input type="email" placeholder="Your email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} className="w-full border px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:border-[oklch(0.38_0.14_28)]" style={{ borderColor: muted, background: bg, borderRadius: "3px", color: fg }} />
            </div>
            <textarea placeholder="Your message" rows={4} value={formData.message} onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))} className="w-full resize-none border px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none focus:border-[oklch(0.38_0.14_28)]" style={{ borderColor: muted, background: bg, borderRadius: "3px", color: fg }} />
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="border-2 px-10 py-3.5 text-xs font-medium uppercase transition-colors"
                style={{ borderColor: primary, color: primary, letterSpacing: "0.15em", borderRadius: "3px" }}
              >
                {formStatus === "sending" ? "Sending..." : formStatus === "sent" ? "Sent!" : "Send message"}
              </button>
            </div>
            {formStatus === "error" && (
              <p className="text-center text-sm" style={{ color: primary }}>Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex flex-col items-center gap-4 px-6 md:px-12 lg:px-24 xl:px-32 py-12 text-center md:flex-row md:justify-between" style={{ borderTop: `1px solid ${muted}` }}>
        <p className="text-[11px] uppercase" style={{ color: mutedFg, letterSpacing: "0.15em" }}>
          &copy; {new Date().getFullYear()} {bio.name}
        </p>
        <div className="flex items-center gap-4">
          {settings.socialLinks.map((link) => {
            const Icon = getSocialIcon(link.platform);
            return (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform} style={{ color: mutedFg }} className="flex h-10 w-10 items-center justify-center transition-colors hover:opacity-70">
                <Icon size={16} />
              </a>
            );
          })}
        </div>
        <p className="text-sm" style={{ fontFamily: headingFont, fontStyle: "italic", color: `${fg}99` }}>
          Music is the only language that doesn't need translation.
        </p>
      </footer>
    </div>
  );
}
