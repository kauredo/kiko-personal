/**
 * ANALOG — "The Record"
 * Warm editorial. Vinyl sleeve meets indie magazine.
 * DM Serif Display italic. Cream + burnt sienna. Offset shadows.
 * Split-screen hero, alternating media layout, inline testimonials.
 */
import { motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { LogoMark } from "@/components/ui/LogoMark";
import { LogoFull } from "@/components/ui/LogoFull";
import { ArrowDown } from "lucide-react";

const WORK = [
  { title: "Lead Guitar", org: "Don Gabriel", period: "2020 —", desc: "Lead guitar, composition and writing for Don Gabriel." },
  { title: "Function Duo", org: "with Milena Galasso", period: "2021 —", desc: "Self-managed function duo performing across venues and events." },
  { title: "Band Leader & Lead Guitar", org: "Studio80 Function Band", period: "2019 — 2020", desc: "Band leader and lead guitarist for events and private functions." },
  { title: "Composer & Writer", org: "Tabora / Lucas Wild", period: "2017 — 2020", desc: "Original material across multiple projects. Recorded 3 EPs." },
];

const MEDIA = [
  { id: "1", label: "Live at Coliseu", type: "photo", tall: true },
  { id: "2", label: "Studio Session", type: "video", tall: false },
  { id: "3", label: "Backstage", type: "photo", tall: false },
  { id: "4", label: "Music Video", type: "video", tall: true },
  { id: "5", label: "Album Recording", type: "music", tall: false },
  { id: "6", label: "Rehearsal", type: "photo", tall: false },
];

const EVENTS = [
  { date: "Apr 15", title: "Rock Soul Night", venue: "Coliseu de Lisboa" },
  { date: "May 02", title: "Jazz & Soul Session", venue: "Hot Clube" },
  { date: "Jun 20", title: "Summer Festival", venue: "Parque das Nacoes" },
];

const bg = "oklch(0.93 0.015 75)";
const fg = "oklch(0.15 0.03 40)";
const primary = "oklch(0.38 0.14 28)";
const muted = "oklch(0.83 0.025 68)";
const mutedFg = "oklch(0.50 0.02 50)";
const card = "oklch(0.88 0.02 68)";
const headingFont = "'DM Serif Display', Georgia, serif";
const bodyFont = "'Space Grotesk', system-ui, sans-serif";

export function HomeAnalog() {
  const lenis = useLenis();

  return (
    <div className="min-h-screen" style={{ background: bg, color: fg, fontFamily: bodyFont }}>
      {/* ═══ HERO — Split screen ═══ */}
      <section className="grid min-h-screen md:grid-cols-2">
        {/* Left: Image */}
        <div style={{ background: card }} className="flex items-center justify-center">
          <LogoFull size={240} style={{ color: primary, opacity: 0.6 }} />
        </div>

        {/* Right: Name + Info */}
        <div className="flex flex-col justify-between px-8 py-12 md:px-12 lg:px-16">
          <nav className="flex items-center justify-end gap-6">
            {[
              { label: "Work", id: "#analog-work" },
              { label: "Media", id: "#analog-media" },
              { label: "Events", id: "#analog-events" },
              { label: "Contact", id: "#analog-contact" },
            ].map(({ label, id }) => (
              <button key={label} onClick={() => lenis?.scrollTo(id, { offset: -40, duration: 1.5 })} className="hidden text-xs uppercase transition-colors hover:opacity-70 md:block" style={{ letterSpacing: "0.15em", color: mutedFg }}>
                {label}
              </button>
            ))}
            <ThemeSwitcher variant="dark" />
          </nav>

          <div>
            <h1 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1, letterSpacing: "-0.02em" }}>
              Francisco<br />
              <span style={{ color: primary }}>Catarro</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-relaxed" style={{ color: mutedFg }}>
              Guitarist, pianist &amp; multi-instrumentalist. Born in Portugal,
              based in the UK. Over 10 years of live and studio experience.
            </p>
            <button
              onClick={() => lenis?.scrollTo("#analog-contact", { offset: -40, duration: 1.5 })}
              className="mt-8 inline-flex items-center gap-2 border-2 px-8 py-3.5 text-xs font-medium uppercase transition-colors hover:text-white"
              style={{ borderColor: primary, color: primary, letterSpacing: "0.15em", borderRadius: "3px", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = primary; e.currentTarget.style.color = bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = primary; }}
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
      <section className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
        <blockquote
          className="mx-auto max-w-3xl text-center text-xl leading-relaxed md:text-2xl lg:text-3xl"
          style={{ fontFamily: headingFont, fontStyle: "italic", color: fg }}
        >
          "One of the most versatile musicians I've worked with. He can go from a soulful ballad to a face-melting rock solo in the same set."
        </blockquote>
        <p className="mt-6 text-center text-xs" style={{ color: mutedFg, letterSpacing: "0.15em" }}>
          — JOAO SILVA, BAND LEADER
        </p>
      </section>

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
        {[
          { value: "10+", label: "Years" },
          { value: "200+", label: "Shows" },
          { value: "50+", label: "Sessions" },
          { value: "4", label: "Instruments" },
        ].map((stat, i) => (
          <div key={stat.label} className="flex flex-col items-center py-10 md:py-14" style={{ borderRight: i < 3 ? `1px solid ${muted}` : "none" }}>
            <span className="text-3xl md:text-4xl" style={{ fontFamily: headingFont, color: primary }}>{stat.value}</span>
            <span className="mt-2 text-[11px] uppercase" style={{ color: mutedFg, letterSpacing: "0.15em" }}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ═══ MEDIA — Dark breakout section ═══ */}
      <section id="analog-media" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ background: fg, color: bg }}>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase" style={{ color: `${bg}88`, letterSpacing: "0.2em" }}>Portfolio</p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: bg }}>See &amp; Hear</h2>
          </div>
          <span className="text-xs uppercase cursor-pointer" style={{ color: `${bg}88`, letterSpacing: "0.15em" }}>View all</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {MEDIA.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className={`group relative cursor-pointer overflow-hidden ${item.tall ? "row-span-2" : ""}`}
              style={{
                background: `${fg}dd`,
                aspectRatio: item.tall ? "3/5" : "4/5",
                borderRadius: "3px",
                border: `1px solid ${bg}15`,
              }}
            >
              <div className="flex h-full items-center justify-center" style={{ color: `${bg}33` }}>
                <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>{item.type}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0" style={{ background: fg }}>
                <p className="text-xs font-medium" style={{ color: bg }}>{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ WORK / RESUME ═══ */}
      <section id="analog-work" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mb-12">
          <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Resume</p>
          <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>The work so far</h2>
        </div>
        {WORK.map((w, i) => (
          <div key={i} className="grid gap-2 py-6 md:grid-cols-[120px_1fr_1.5fr] md:gap-8" style={{ borderTop: `1px solid ${muted}` }}>
            <span className="text-xs" style={{ color: mutedFg, letterSpacing: "0.1em" }}>{w.period}</span>
            <div>
              <h3 className="text-base font-medium">{w.title}</h3>
              <p className="text-sm" style={{ color: primary }}>{w.org}</p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: mutedFg }}>{w.desc}</p>
          </div>
        ))}
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="analog-services" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ background: card }}>
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Services</p>
          <h2 className="mb-12" style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>What I do</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              { title: "Live Performance", desc: "Guitar and keys for any setting — from intimate jazz clubs to arena stages." },
              { title: "Musical Direction", desc: "Leading bands, arranging setlists, and shaping the musical identity of any project." },
              { title: "Production", desc: "Studio production, mixing, and arranging across rock, soul, jazz, and pop." },
              { title: "Session Work", desc: "Reliable, versatile session musician for recordings, tours, and one-off gigs." },
            ].map((s) => (
              <div key={s.title} className="border-t py-6" style={{ borderColor: muted }}>
                <h3 className="text-base font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: mutedFg }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EVENTS ═══ */}
      <section id="analog-events" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ borderTop: `1px solid ${muted}` }}>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase" style={{ color: primary, letterSpacing: "0.2em" }}>Live</p>
            <h2 style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Catch me live</h2>
          </div>
        </div>
        {EVENTS.map((e, i) => (
          <div key={i} className="flex items-center justify-between py-5" style={{ borderTop: `1px solid ${muted}` }}>
            <div className="flex items-baseline gap-6">
              <span className="text-sm" style={{ color: mutedFg }}>{e.date}</span>
              <h3 className="font-medium">{e.title}</h3>
            </div>
            <span className="text-sm" style={{ color: mutedFg }}>{e.venue}</span>
          </div>
        ))}
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="analog-contact" className="px-6 md:px-12 lg:px-24 xl:px-32 py-20 md:py-28" style={{ background: card }}>
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-center" style={{ fontFamily: headingFont, fontStyle: "italic", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            Let's make something
          </h2>
          <p className="mb-10 text-center text-sm" style={{ color: mutedFg }}>
            Booking, collaboration, lessons, or just say hi.
          </p>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Your name" className="w-full border px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none" style={{ borderColor: muted, background: bg, borderRadius: "3px", color: fg }} />
              <input type="email" placeholder="Your email" className="w-full border px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none" style={{ borderColor: muted, background: bg, borderRadius: "3px", color: fg }} />
            </div>
            <textarea placeholder="Your message" rows={4} className="w-full resize-none border px-4 py-3 text-sm placeholder:opacity-40 focus:outline-none" style={{ borderColor: muted, background: bg, borderRadius: "3px", color: fg }} />
            <div className="flex justify-center">
              <button
                type="submit"
                className="border-2 px-10 py-3.5 text-xs font-medium uppercase transition-colors"
                style={{ borderColor: primary, color: primary, letterSpacing: "0.15em", borderRadius: "3px" }}
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex flex-col items-center gap-4 px-6 md:px-12 lg:px-24 xl:px-32 py-12 text-center md:flex-row md:justify-between" style={{ borderTop: `1px solid ${muted}` }}>
        <p className="text-[11px] uppercase" style={{ color: mutedFg, letterSpacing: "0.15em" }}>
          &copy; {new Date().getFullYear()} Francisco Catarro
        </p>
        <p className="text-sm" style={{ fontFamily: headingFont, fontStyle: "italic", color: `${fg}99` }}>
          Music is the only language that doesn't need translation.
        </p>
      </footer>
    </div>
  );
}
