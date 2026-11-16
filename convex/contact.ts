import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

// Public: submit contact form
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    inquiryType: v.union(
      v.literal("booking"),
      v.literal("collaboration"),
      v.literal("lesson"),
      v.literal("general"),
    ),
    message: v.string(),
    // Honeypot: hidden from people, so only a bot fills it in. The name means
    // nothing to browser autofill.
    hp: v.optional(v.string()),
  },
  handler: async (ctx, { hp, ...data }) => {
    if (hp) return null;
    const name = data.name.trim();
    const email = data.email.trim();
    const message = data.message.trim();
    if (!name || name.length > 100) throw new Error("Invalid name");
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email");
    }
    if (data.phone !== undefined && data.phone.length > 40) {
      throw new Error("Invalid phone");
    }
    if (!message || message.length > 5000) throw new Error("Invalid message");
    return await ctx.db.insert("contactSubmissions", {
      ...data,
      name,
      email,
      message,
      read: false,
    });
  },
});

// Admin: list submissions
export const list = query({
  args: {
    token: v.string(),
    read: v.optional(v.boolean()),
  },
  handler: async (ctx, { token, read }) => {
    await requireAdmin(ctx, token);

    let items;
    if (read !== undefined) {
      items = await ctx.db
        .query("contactSubmissions")
        .withIndex("by_read", (q) => q.eq("read", read))
        .collect();
    } else {
      items = await ctx.db.query("contactSubmissions").collect();
    }

    return items.sort(
      (a, b) => b._creationTime - a._creationTime,
    );
  },
});

export const markAsRead = mutation({
  args: { token: v.string(), id: v.id("contactSubmissions") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { read: true });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("contactSubmissions") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const unreadCount = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    const unread = await ctx.db
      .query("contactSubmissions")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    return unread.length;
  },
});
