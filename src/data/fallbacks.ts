// Shared types and fallback constants for homepage data.
// Fallbacks mirror the original hardcoded content so pages render
// identically before Convex data is seeded.

export type HomeEvent = {
  title: string;
  date: string;
  dateFormatted: string;
  dateShort: string;
  year: string;
  venue: string;
  city: string;
  ticketUrl: string | null;
};

export type HomeExperience = {
  title: string;
  organization: string;
  period: string;
  startYear: string;
  description: string;
};

export type HomeTestimonial = {
  quote: string;
  authorName: string;
  authorRole: string;
};

export type HomeMedia = {
  id: string;
  type: "photo" | "video" | "music";
  title: string;
  description: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  album: string | null;
  year: number | null;
};

export type HomeStat = {
  value: string;
  numericTarget: number;
  label: string;
};

export type HomeService = {
  title: string;
  description: string;
};

export type ThemeAbout = {
  dark_electric?: string;
  raw_textured?: string;
  hybrid?: string;
  parallax?: string;
  piano?: string;
  guitar?: string;
};

export type HomeBio = {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  content: string;
  profilePhotoUrl: string | null;
  themeAbout: ThemeAbout;
};

export type HomeSettings = {
  heroSubtitle: string;
  siteTitle: string;
  metaDescription: string;
  contactEmail: string;
  socialLinks: { platform: string; url: string }[];
};

// ── Static constants (no Convex table) ─────────────────────────────────────

export const STATS: HomeStat[] = [
  { value: "10+", numericTarget: 10, label: "Years performing" },
  { value: "200+", numericTarget: 200, label: "Live shows" },
  { value: "50+", numericTarget: 50, label: "Studio sessions" },
  { value: "4", numericTarget: 4, label: "Instruments" },
];

export const SERVICES: HomeService[] = [
  { title: "Live Performance", description: "Guitar and keys for any setting — from intimate jazz clubs to arena stages." },
  { title: "Musical Direction", description: "Arranging, rehearsing, and leading bands for tours, shows, and recordings." },
  { title: "Production", description: "Full studio production from arrangement to final mix, across genres." },
  { title: "Session Work", description: "Available for studio sessions — rock, soul, jazz, latin, classical." },
];

// ── Fallback data (shown while Convex loads or if not seeded) ──────────────

export const FALLBACK_EVENTS: HomeEvent[] = [
  { title: "Rock Soul Night", date: "2026-04-15", dateFormatted: "Apr 15", dateShort: "APR 15", year: "2026", venue: "Coliseu de Lisboa", city: "Lisbon", ticketUrl: null },
  { title: "Jazz & Soul Session", date: "2026-05-02", dateFormatted: "May 02", dateShort: "MAY 02", year: "2026", venue: "Hot Clube", city: "Lisbon", ticketUrl: null },
  { title: "Summer Festival", date: "2026-06-20", dateFormatted: "Jun 20", dateShort: "JUN 20", year: "2026", venue: "Parque das Nacoes", city: "Lisbon", ticketUrl: null },
];

export const FALLBACK_EXPERIENCES: HomeExperience[] = [
  { title: "Lead Guitar", organization: "Don Gabriel", period: "2020 —", startYear: "2020", description: "Lead guitar, composition and writing for Don Gabriel." },
  { title: "Function Duo", organization: "with Milena Galasso", period: "2021 —", startYear: "2021", description: "Self-managed function duo performing across venues and events." },
  { title: "Band Leader & Lead Guitar", organization: "Studio80 Function Band", period: "2019 — 2020", startYear: "2019", description: "Band leader and lead guitarist for events and private functions." },
  { title: "Composer & Writer", organization: "Tabora / Lucas Wild", period: "2017 — 2020", startYear: "2017", description: "Original material across multiple projects. Recorded 3 EPs." },
];

export const FALLBACK_TESTIMONIALS: HomeTestimonial[] = [
  { quote: "Francisco brings something rare — technical precision with genuine emotion. Every note has intention.", authorName: "Maria Santos", authorRole: "Producer" },
  { quote: "Every arrangement was thoughtful, dynamic, and perfectly suited to the moment.", authorName: "Ana Costa", authorRole: "Theater Director" },
];

export const FALLBACK_MEDIA: HomeMedia[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i),
  type: (["photo", "video", "music"] as const)[i % 3],
  title: ["Live at Coliseu", "Studio Session", "Album Track", "Backstage", "Music Video", "Rehearsal"][i],
  description: null,
  imageUrl: null,
  thumbnailUrl: null,
  videoUrl: null,
  audioUrl: null,
  album: null,
  year: null,
}));

export const FALLBACK_BIO: HomeBio = {
  name: "Francisco Catarro",
  firstName: "Francisco",
  lastName: "Catarro",
  title: "Guitar | Keys | Musical Direction | Production",
  content: "",
  profilePhotoUrl: null,
  themeAbout: {
    dark_electric: "Born in Portugal, based in the UK. Guitar, keys, bass — over 10 years making rooms louder, tighter, and impossible to leave.",
    raw_textured: "Born in Portugal, now based in the UK — Francisco picked up a guitar at fourteen and never put it down. Over a decade later, he plays guitar, keys, and bass across stages, studios, and sessions throughout Europe.\n\nHe's shared stages with Kevin Davy White, Carla Prata, and Marta Per — and directed bands from intimate jazz clubs to festival crowds of thousands.",
    hybrid: "A multi-instrumentalist and musical director whose career spans concert stages, recording studios, and festival grounds across Portugal and the UK.\n\nFrancisco brings a rare combination: the instinct of a performer, the ear of a producer, and the discipline of someone who has led bands in front of thousands.",
    parallax: "Born in Portugal. Over a decade on stages across Europe — from underground jazz clubs in London to arena tours and festival headliners. Guitar, keys, bass, and musical direction.\n\nHe's opened for Westlife at Scarborough, directed bands at Festival Iminente in Lisbon, and held down residencies in London's live music scene. Every show is the only show.",
    piano: "Francisco Catarro is a guitarist, pianist, musical director, and producer who treats every performance like a composition — deliberate, dynamic, and impossible to ignore.\n\nBorn in Portugal, based in the UK. Over a decade moving between rock stages, jazz clubs, and studio sessions across Europe.",
    guitar: "Portuguese-born, UK-based. Guitar, keys, bass — 10+ years of performing, composing, and directing. The kind of musician who learns every part, understands every arrangement, and makes the band sound bigger than it is.",
  },
};

export const FALLBACK_SETTINGS: HomeSettings = {
  heroSubtitle: "Guitar | Keys | Musical Direction | Production",
  siteTitle: "Francisco Catarro — Musician",
  metaDescription: "Francisco Catarro — versatile guitarist, pianist, musical director, and producer. Born in Portugal, based in the UK. Over 10 years of live and studio experience.",
  contactEmail: "contact@franciscocatarro.com",
  socialLinks: [
    { platform: "instagram", url: "https://www.instagram.com/francisco.catarro/" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/francisco-catarro-64a65b1a6/" },
  ],
};
