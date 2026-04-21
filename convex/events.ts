import { ConvexError, v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("upcoming"), v.literal("past"))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { type, featured }) => {
    let items;
    if (type) {
      items = await ctx.db
        .query("events")
        .withIndex("by_type", (q) => q.eq("type", type))
        .collect();
    } else {
      items = await ctx.db.query("events").collect();
    }

    if (featured !== undefined) {
      items = items.filter((i) => i.featured === featured);
    }

    items.sort((a, b) => a.date.localeCompare(b.date));

    return Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: item.imageFile
          ? await ctx.storage.getUrl(item.imageFile)
          : null,
      })),
    );
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    venue: v.optional(v.string()),
    city: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.union(v.literal("upcoming"), v.literal("past")),
    ticketUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    imageFile: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);
    return await ctx.db.insert("events", {
      ...data,
      featured: data.featured ?? false,
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("events"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    venue: v.optional(v.string()),
    city: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal("upcoming"), v.literal("past"))),
    ticketUrl: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    imageFile: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { token, id, ...data }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new ConvexError("Not found");

    if (data.imageFile && existing.imageFile && data.imageFile !== existing.imageFile) {
      await ctx.storage.delete(existing.imageFile);
    }

    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("events") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const item = await ctx.db.get(id);
    if (!item) return;
    if (item.imageFile) await ctx.storage.delete(item.imageFile);
    await ctx.db.delete(id);
  },
});

// Cron: auto-mark past events
export const markPastEvents = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = await ctx.db
      .query("events")
      .withIndex("by_type", (q) => q.eq("type", "upcoming"))
      .collect();

    for (const event of upcoming) {
      if (event.date < today) {
        await ctx.db.patch(event._id, { type: "past" });
      }
    }
  },
});
