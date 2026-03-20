import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

const mediaTypeValidator = v.union(
  v.literal("photo"),
  v.literal("video"),
  v.literal("music"),
);

async function resolveMediaUrls(
  ctx: { storage: { getUrl: (id: string) => Promise<string | null> } },
  item: Record<string, unknown>,
) {
  return {
    ...item,
    imageUrl: item.imageFile
      ? await ctx.storage.getUrl(item.imageFile as string)
      : null,
    thumbnailUrl: item.thumbnail
      ? await ctx.storage.getUrl(item.thumbnail as string)
      : null,
    audioFileUrl: item.audioFile
      ? await ctx.storage.getUrl(item.audioFile as string)
      : null,
  };
}

// Public queries
export const list = query({
  args: {
    type: v.optional(mediaTypeValidator),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { type, featured }) => {
    let q = ctx.db.query("media");
    if (type) {
      q = q.withIndex("by_type", (idx) => idx.eq("type", type));
    }
    const items = await q.collect();

    let filtered = items;
    if (featured !== undefined) {
      filtered = filtered.filter((i) => i.featured === featured);
    }

    filtered.sort((a, b) => a.order - b.order);

    return Promise.all(filtered.map((item) => resolveMediaUrls(ctx, item)));
  },
});

// Admin mutations
export const create = mutation({
  args: {
    token: v.string(),
    type: mediaTypeValidator,
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    imageFile: v.optional(v.id("_storage")),
    caption: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    thumbnail: v.optional(v.id("_storage")),
    musicUrl: v.optional(v.string()),
    audioFile: v.optional(v.id("_storage")),
    album: v.optional(v.string()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);

    const existing = await ctx.db.query("media").collect();
    const maxOrder = existing.reduce(
      (max, item) => Math.max(max, item.order),
      -1,
    );

    return await ctx.db.insert("media", {
      ...data,
      featured: data.featured ?? false,
      order: maxOrder + 1,
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("media"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    imageFile: v.optional(v.id("_storage")),
    caption: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    thumbnail: v.optional(v.id("_storage")),
    musicUrl: v.optional(v.string()),
    audioFile: v.optional(v.id("_storage")),
    album: v.optional(v.string()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, { token, id, ...data }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Not found");

    // Clean up old files if replacing
    if (data.imageFile && existing.imageFile && data.imageFile !== existing.imageFile) {
      await ctx.storage.delete(existing.imageFile);
    }
    if (data.audioFile && existing.audioFile && data.audioFile !== existing.audioFile) {
      await ctx.storage.delete(existing.audioFile);
    }
    if (data.thumbnail && existing.thumbnail && data.thumbnail !== existing.thumbnail) {
      await ctx.storage.delete(existing.thumbnail);
    }

    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("media") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const item = await ctx.db.get(id);
    if (!item) return;

    if (item.imageFile) await ctx.storage.delete(item.imageFile);
    if (item.audioFile) await ctx.storage.delete(item.audioFile);
    if (item.thumbnail) await ctx.storage.delete(item.thumbnail);

    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: { token: v.string(), ids: v.array(v.id("media")) },
  handler: async (ctx, { token, ids }) => {
    await requireAdmin(ctx, token);
    for (let i = 0; i < ids.length; i++) {
      await ctx.db.patch(ids[i], { order: i });
    }
  },
});
