import { ConvexError, v } from "convex/values";
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

export const updateProfilePhoto = mutation({
  args: {
    token: v.string(),
    photoStorageId: v.id("_storage"),
  },
  handler: async (ctx, { token, photoStorageId }) => {
    await requireAdmin(ctx, token);
    const bio = await ctx.db.query("bio").first();
    if (!bio) throw new ConvexError("Bio not found");
    await ctx.db.patch(bio._id, { profilePhoto: photoStorageId });
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
    themeAbout: v.optional(
      v.object({
        dark_electric: v.optional(v.string()),
        raw_textured: v.optional(v.string()),
        hybrid: v.optional(v.string()),
        parallax: v.optional(v.string()),
        piano: v.optional(v.string()),
        guitar: v.optional(v.string()),
      }),
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
