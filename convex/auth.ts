import { v } from "convex/values";
import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";

// Simple crypto helpers using Web Crypto API
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Shared helper: validate session and return user
export async function getAuthenticatedUser(
  ctx: QueryCtx | MutationCtx,
  token: string,
) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    return null;
  }

  return await ctx.db.get(session.userId);
}

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  token: string,
) {
  const user = await getAuthenticatedUser(ctx, token);
  if (!user || !user.isAdmin) {
    throw new Error("Unauthorized");
  }
  return user;
}

// Mutations & queries

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("Invalid credentials");

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passwordHash) throw new Error("Invalid credentials");

    // Clean up old sessions for this user
    const oldSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const s of oldSessions) {
      await ctx.db.delete(s._id);
    }

    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
    });

    return { token, user: { name: user.name, email: user.email } };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const me = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, { token }) => {
    if (!token) return null;
    const user = await getAuthenticatedUser(ctx, token);
    if (!user) return null;
    return { name: user.name, email: user.email, isAdmin: user.isAdmin };
  },
});

export const changePassword = mutation({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { token, currentPassword, newPassword }) => {
    const user = await requireAdmin(ctx, token);

    const currentHash = await hashPassword(currentPassword, user.salt);
    if (currentHash !== user.passwordHash) {
      throw new Error("Current password is incorrect");
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    await ctx.db.patch(user._id, { passwordHash, salt });

    return "Password updated";
  },
});

// Used by seed to create the initial admin
export const createAdmin = mutation({
  args: { email: v.string(), password: v.string(), name: v.string() },
  handler: async (ctx, { email, password, name }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) return "Admin already exists";

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    await ctx.db.insert("users", {
      email,
      passwordHash,
      salt,
      name,
      isAdmin: true,
    });

    return "Admin created";
  },
});
