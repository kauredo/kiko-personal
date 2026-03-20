import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const init = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) =>
        q.eq("email", "admin@franciscocatarro.com"),
      )
      .first();

    if (existingUser) return "Already seeded";

    // Create admin via auth module
    await ctx.scheduler.runAfter(0, api.auth.createAdmin, {
      email: "admin@franciscocatarro.com",
      password: "changeme123",
      name: "Francisco Catarro",
    });

    // ── Site Settings ──
    await ctx.db.insert("siteSettings", {
      heroTagline: "Francisco Catarro",
      heroSubtitle: "Guitar | Keys | Musical Direction | Production",
      siteTitle: "Francisco Catarro — Musician",
      metaDescription:
        "Francisco Catarro — versatile musician specializing in guitar, keys, bass, and live performance. Born in Portugal, based in the UK. Over 10 years of experience.",
      contactEmail: "contact@franciscocatarro.com",
      socialLinks: [
        { platform: "instagram", url: "https://www.instagram.com/francisco.catarro/" },
        { platform: "linkedin", url: "https://www.linkedin.com/in/francisco-catarro-64a65b1a6/" },
        { platform: "audio", url: "https://audio.com/francisco-catarro" },
      ],
    });

    // ── Bio ──
    await ctx.db.insert("bio", {
      name: "Francisco Catarro",
      title: "Musician — Guitar, Keys, Bass & Production",
      content:
        "<p>Versatile musician and university graduate, specializing in guitar, keys, bass, recording and live performance. Born in Portugal, now based in the UK.</p><p>Highly driven and motivated by all types of genres and instruments. Over 10 years of experience in guitar along with several years of arranging music for live scenarios — bands, duos and trios. From rock clubs to symphony halls, from the studio console to center stage.</p><p>Good communication skills and highly professional. Available for session work, live performance, musical direction, composition, and arranging.</p>",
      socialLinks: [
        { platform: "instagram", url: "https://www.instagram.com/francisco.catarro/" },
        { platform: "linkedin", url: "https://www.linkedin.com/in/francisco-catarro-64a65b1a6/" },
        { platform: "audio", url: "https://audio.com/francisco-catarro" },
      ],
    });

    // ── Experience ──
    const experiences = [
      {
        title: "Lead Guitar",
        organization: "Don Gabriel",
        startDate: "2020-01",
        description: "Lead guitar for Don Gabriel. Ongoing collaboration including live performances and studio recordings.",
        category: "performance" as const,
        order: 0,
      },
      {
        title: "Function Duo (Self-Managed)",
        organization: "Duo with Milena Galasso",
        startDate: "2021-01",
        description: "Self-managed function duo performing across various venues and events.",
        category: "performance" as const,
        order: 1,
      },
      {
        title: "Piano",
        organization: "Aruna Chaudhuri",
        startDate: "2020-01",
        description: "Pianist for Aruna Chaudhuri's live performances and recordings.",
        category: "performance" as const,
        order: 2,
      },
      {
        title: "Band Leader & Lead Guitar",
        organization: "Studio80 Function Band",
        startDate: "2019-01",
        endDate: "2020-12",
        description: "Band leader and lead guitarist for Studio80, a function band performing at events and venues.",
        category: "directing" as const,
        order: 3,
      },
      {
        title: "Bass",
        organization: "Tabora",
        startDate: "2017-01",
        endDate: "2020-12",
        description: "Bass player, composer and writer for Tabora.",
        category: "performance" as const,
        order: 4,
      },
      {
        title: "Lead Guitar",
        organization: "Lucas Wild",
        startDate: "2017-01",
        endDate: "2019-12",
        description: "Lead guitarist, composer and writer for Lucas Wild.",
        category: "performance" as const,
        order: 5,
      },
      {
        title: "Guitar & Arranger",
        organization: "Patrick Kearns Acoustic",
        startDate: "2021-01",
        endDate: "2021-12",
        description: "Guitar and arrangement for Patrick Kearns Acoustic sessions.",
        category: "performance" as const,
        order: 6,
      },
      {
        title: "Piano & Guitar",
        organization: "Mike Walsh Acoustic Sessions",
        startDate: "2021-01",
        endDate: "2021-12",
        description: "Piano, guitar and arrangement for Mike Walsh Acoustic Sessions.",
        category: "performance" as const,
        order: 7,
      },
      {
        title: "Composer & Writer",
        organization: "Don Gabriel / Tabora / Lucas Wild",
        startDate: "2017-01",
        description: "Composing and writing original material across multiple projects. Recorded 3 EPs.",
        category: "producing" as const,
        order: 8,
      },
    ];

    for (const exp of experiences) {
      await ctx.db.insert("experiences", exp);
    }

    // ── Skills ──
    const skills = [
      { name: "Electric Guitar", category: "instruments" },
      { name: "Acoustic Guitar", category: "instruments" },
      { name: "Bass Guitar", category: "instruments" },
      { name: "Piano / Keys", category: "instruments" },
      { name: "Live Performance", category: "performance" },
      { name: "Band Leadership", category: "performance" },
      { name: "Musical Direction", category: "performance" },
      { name: "Composition", category: "production" },
      { name: "Arranging", category: "production" },
      { name: "Recording", category: "production" },
      { name: "Session Work", category: "production" },
    ];

    for (const skill of skills) {
      await ctx.db.insert("skills", skill);
    }

    // ── Events (placeholder upcoming) ──
    const events = [
      {
        title: "Live Session",
        date: "2026-04-15",
        venue: "TBA",
        city: "London",
        type: "upcoming" as const,
        featured: true,
        description: "Upcoming live performance.",
      },
    ];

    for (const event of events) {
      await ctx.db.insert("events", event);
    }

    // ── Testimonials (placeholder — to be updated via admin) ──
    await ctx.db.insert("testimonials", {
      quote: "One of the most versatile musicians I've worked with. He can go from a soulful ballad to a face-melting rock solo in the same set.",
      authorName: "Collaborator",
      authorRole: "Musician",
      featured: true,
      order: 0,
    });

    return "Seeded with Francisco Catarro's real data. Admin: admin@franciscocatarro.com / changeme123";
  },
});
