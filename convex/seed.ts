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
      heroSubtitle: "Guitar | Keys | Musical Direction | Production",
      siteTitle: "Francisco Catarro — Musician",
      metaDescription:
        "Francisco Catarro — guitarist, pianist, and musical director. Born in Portugal, based in the UK. Live performance, session work, and production across Europe.",
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
        "<p>Born in Portugal, based in the UK. Francisco Catarro is a guitarist, pianist, and musical director with over a decade of live and studio experience across Europe.</p><p>He's opened for Westlife at Scarborough, played Festival Iminente in Lisbon with Carla Prata, toured with Kevin Davy White across Hungary and the UK, and held down residencies across London's live circuit — from The Half Moon to Jazz Cafe to The Troubadour.</p><p>Available for session work, live performance, musical direction, and production.</p>",
      socialLinks: [
        { platform: "instagram", url: "https://www.instagram.com/francisco.catarro/" },
        { platform: "linkedin", url: "https://www.linkedin.com/in/francisco-catarro-64a65b1a6/" },
        { platform: "audio", url: "https://audio.com/francisco-catarro" },
      ],
      themeAbout: {
        dark_electric:
          "Born in Portugal, based in the UK. Guitar, keys, bass — over 10 years making rooms louder, tighter, and impossible to leave.",
        raw_textured:
          "Born in Portugal, now based in the UK — Francisco picked up a guitar at fourteen and never put it down. Over a decade later, he plays guitar, keys, and bass across stages, studios, and sessions throughout Europe.\n\nHe's shared stages with Kevin Davy White, Carla Prata, and Marta Per — and directed bands from intimate jazz clubs to festival crowds of thousands.",
        hybrid:
          "A multi-instrumentalist and musical director whose career spans concert stages, recording studios, and festival grounds across Portugal and the UK.\n\nFrancisco brings a rare combination: the instinct of a performer, the ear of a producer, and the discipline of someone who has led bands in front of thousands.",
        parallax:
          "Born in Portugal. Over a decade on stages across Europe — from underground jazz clubs in London to arena tours and festival headliners. Guitar, keys, bass, and musical direction.\n\nHe's opened for Westlife at Scarborough, directed bands at Festival Iminente in Lisbon, and held down residencies in London's live music scene. Every show is the only show.",
        piano:
          "Francisco Catarro is a guitarist, pianist, musical director, and producer who treats every performance like a composition — deliberate, dynamic, and impossible to ignore.\n\nBorn in Portugal, based in the UK. Over a decade moving between rock stages, jazz clubs, and studio sessions across Europe.",
        guitar:
          "Portuguese-born, UK-based. Guitar, keys, bass — 10+ years of performing, composing, and directing. The kind of musician who learns every part, understands every arrangement, and makes the band sound bigger than it is.",
      },
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

    // Events and testimonials are managed via admin panel — no placeholders seeded.

    return "Seeded with Francisco Catarro's real data. Admin: admin@franciscocatarro.com / changeme123";
  },
});

export const seedThemeAbout = mutation({
  args: {},
  handler: async (ctx) => {
    const bio = await ctx.db.query("bio").first();
    if (!bio) return "No bio row found — run seed:init first";
    if (bio.themeAbout) return "themeAbout already set";

    await ctx.db.patch(bio._id, {
      themeAbout: {
        dark_electric:
          "Born in Portugal, based in the UK. Guitar, keys, bass — over 10 years making rooms louder, tighter, and impossible to leave.",
        raw_textured:
          "Born in Portugal, now based in the UK — Francisco picked up a guitar at fourteen and never put it down. Over a decade later, he plays guitar, keys, and bass across stages, studios, and sessions throughout Europe.\n\nHe's shared stages with Kevin Davy White, Carla Prata, and Marta Per — and directed bands from intimate jazz clubs to festival crowds of thousands.",
        hybrid:
          "A multi-instrumentalist and musical director whose career spans concert stages, recording studios, and festival grounds across Portugal and the UK.\n\nFrancisco brings a rare combination: the instinct of a performer, the ear of a producer, and the discipline of someone who has led bands in front of thousands.",
        parallax:
          "Born in Portugal. Over a decade on stages across Europe — from underground jazz clubs in London to arena tours and festival headliners. Guitar, keys, bass, and musical direction.\n\nHe's opened for Westlife at Scarborough, directed bands at Festival Iminente in Lisbon, and held down residencies in London's live music scene. Every show is the only show.",
        piano:
          "Francisco Catarro is a guitarist, pianist, musical director, and producer who treats every performance like a composition — deliberate, dynamic, and impossible to ignore.\n\nBorn in Portugal, based in the UK. Over a decade moving between rock stages, jazz clubs, and studio sessions across Europe.",
        guitar:
          "Portuguese-born, UK-based. Guitar, keys, bass — 10+ years of performing, composing, and directing. The kind of musician who learns every part, understands every arrangement, and makes the band sound bigger than it is.",
      },
    });

    return "themeAbout seeded";
  },
});
