import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

// ─── Experiences ─────────────────────────────────────

export const listExperiences = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    const items = category
      ? await ctx.db.query("experiences").withIndex("by_category", (idx) =>
          idx.eq("category", category as "performance" | "directing" | "producing" | "teaching"),
        ).collect()
      : await ctx.db.query("experiences").collect();
    return items.sort((a, b) => a.order - b.order);
  },
});

export const createExperience = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    organization: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("performance"),
      v.literal("directing"),
      v.literal("producing"),
      v.literal("teaching"),
    ),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.query("experiences").collect();
    const maxOrder = existing.reduce((max, i) => Math.max(max, i.order), -1);
    return await ctx.db.insert("experiences", { ...data, order: maxOrder + 1 });
  },
});

export const updateExperience = mutation({
  args: {
    token: v.string(),
    id: v.id("experiences"),
    title: v.optional(v.string()),
    organization: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("performance"),
        v.literal("directing"),
        v.literal("producing"),
        v.literal("teaching"),
      ),
    ),
  },
  handler: async (ctx, { token, id, ...data }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, data);
  },
});

export const deleteExperience = mutation({
  args: { token: v.string(), id: v.id("experiences") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

// ─── Awards ──────────────────────────────────────────

export const listAwards = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("awards").collect();
  },
});

export const createAward = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, { token, ...data }) => {
    await requireAdmin(ctx, token);
    return await ctx.db.insert("awards", data);
  },
});

export const updateAward = mutation({
  args: {
    token: v.string(),
    id: v.id("awards"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, { token, id, ...data }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, data);
  },
});

export const deleteAward = mutation({
  args: { token: v.string(), id: v.id("awards") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});
