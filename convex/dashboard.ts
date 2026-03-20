import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireAdmin } from "./auth";

export const getStats = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);

    const [photos, videos, music, upcomingEvents, unreadMessages, testimonials] =
      await Promise.all([
        ctx.db
          .query("media")
          .withIndex("by_type", (q) => q.eq("type", "photo"))
          .collect()
          .then((r) => r.length),
        ctx.db
          .query("media")
          .withIndex("by_type", (q) => q.eq("type", "video"))
          .collect()
          .then((r) => r.length),
        ctx.db
          .query("media")
          .withIndex("by_type", (q) => q.eq("type", "music"))
          .collect()
          .then((r) => r.length),
        ctx.db
          .query("events")
          .withIndex("by_type", (q) => q.eq("type", "upcoming"))
          .collect()
          .then((r) => r.length),
        ctx.db
          .query("contactSubmissions")
          .withIndex("by_read", (q) => q.eq("read", false))
          .collect()
          .then((r) => r.length),
        ctx.db
          .query("testimonials")
          .collect()
          .then((r) => r.length),
      ]);

    return {
      photos,
      videos,
      music,
      totalMedia: photos + videos + music,
      upcomingEvents,
      unreadMessages,
      testimonials,
    };
  },
});
