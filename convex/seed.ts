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

    // Create default site settings
    await ctx.db.insert("siteSettings", {
      heroTagline: "Francisco Catarro",
      heroSubtitle: "Guitarist | Pianist | Musical Director | Producer",
      siteTitle: "Francisco Catarro — Musician",
      metaDescription:
        "Portfolio of Francisco Catarro — versatile guitarist, pianist, musical director, and producer.",
      contactEmail: "contact@franciscocatarro.com",
      socialLinks: [],
    });

    // Create default bio
    await ctx.db.insert("bio", {
      name: "Francisco Catarro",
      title: "Musician & Producer",
      content: "<p>Welcome to my portfolio.</p>",
      socialLinks: [],
    });

    return "Seeded: admin@franciscocatarro.com / changeme123";
  },
});
