import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const bio = await ctx.db.query("bio").first();
    if (!bio) return null;

    const profilePhotoUrl = bio.profilePhoto
      ? await ctx.storage.getUrl(bio.profilePhoto)
      : null;

    return { ...bio, profilePhotoUrl };
  },
});

export const upsert = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    title: v.string(),
    content: v.string(),
    profilePhoto: v.optional(v.id("_storage")),
    socialLinks: v.array(
      v.object({ platform: v.string(), url: v.string() }),
    ),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);

    const existing = await ctx.db.query("bio").first();
    if (existing) {
      // Delete old photo if replacing
      if (data.profilePhoto && existing.profilePhoto && data.profilePhoto !== existing.profilePhoto) {
        await ctx.storage.delete(existing.profilePhoto);
      }
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("bio", data);
    }
  },
});
