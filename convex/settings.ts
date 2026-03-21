import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    if (!settings) return null;

    const heroImageUrl = settings.heroImage
      ? await ctx.storage.getUrl(settings.heroImage)
      : null;

    return { ...settings, heroImageUrl };
  },
});

export const upsert = mutation({
  args: {
    token: v.string(),
    heroSubtitle: v.optional(v.string()),
    siteTitle: v.string(),
    metaDescription: v.optional(v.string()),
    contactEmail: v.string(),
    socialLinks: v.array(
      v.object({ platform: v.string(), url: v.string() }),
    ),
    heroImage: v.optional(v.id("_storage")),
    ogStyle: v.optional(v.string()),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);

    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      if (data.heroImage && existing.heroImage && data.heroImage !== existing.heroImage) {
        await ctx.storage.delete(existing.heroImage);
      }
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("siteSettings", data);
    }
  },
});
