import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: { featured: v.optional(v.boolean()) },
  handler: async (ctx, { featured }) => {
    let items = await ctx.db.query("testimonials").collect();

    if (featured !== undefined) {
      items = items.filter((i) => i.featured === featured);
    }

    items.sort((a, b) => a.order - b.order);

    return Promise.all(
      items.map(async (item) => ({
        ...item,
        photoUrl: item.photo ? await ctx.storage.getUrl(item.photo) : null,
      })),
    );
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    quote: v.string(),
    authorName: v.string(),
    authorRole: v.optional(v.string()),
    photo: v.optional(v.id("_storage")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.query("testimonials").collect();
    const maxOrder = existing.reduce((max, i) => Math.max(max, i.order), -1);
    return await ctx.db.insert("testimonials", {
      ...data,
      featured: data.featured ?? false,
      order: maxOrder + 1,
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("testimonials"),
    quote: v.optional(v.string()),
    authorName: v.optional(v.string()),
    authorRole: v.optional(v.string()),
    photo: v.optional(v.id("_storage")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { token, id, ...data }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new ConvexError("Not found");

    if (data.photo && existing.photo && data.photo !== existing.photo) {
      await ctx.storage.delete(existing.photo);
    }

    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("testimonials") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const item = await ctx.db.get(id);
    if (!item) return;
    if (item.photo) await ctx.storage.delete(item.photo);
    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: { token: v.string(), ids: v.array(v.id("testimonials")) },
  handler: async (ctx, { token, ids }) => {
    await requireAdmin(ctx, token);
    for (let i = 0; i < ids.length; i++) {
      await ctx.db.patch(ids[i], { order: i });
    }
  },
});
