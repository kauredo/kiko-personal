import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Auth
  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    name: v.string(),
    isAdmin: v.boolean(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  // Bio (single-row)
  bio: defineTable({
    name: v.string(),
    title: v.string(),
    content: v.string(),
    profilePhoto: v.optional(v.id("_storage")),
    socialLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
      }),
    ),
  }),

  // Media (polymorphic)
  media: defineTable({
    type: v.union(
      v.literal("photo"),
      v.literal("video"),
      v.literal("music"),
    ),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    order: v.number(),
    featured: v.boolean(),
    // Photo
    imageFile: v.optional(v.id("_storage")),
    caption: v.optional(v.string()),
    // Video
    videoUrl: v.optional(v.string()),
    thumbnail: v.optional(v.id("_storage")),
    // Music
    musicUrl: v.optional(v.string()),
    audioFile: v.optional(v.id("_storage")),
    album: v.optional(v.string()),
    year: v.optional(v.number()),
  })
    .index("by_type", ["type"])
    .index("by_type_and_order", ["type", "order"])
    .index("by_featured", ["featured"]),

  // Resume: Experience
  experiences: defineTable({
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
    order: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"]),

  // Resume: Education
  education: defineTable({
    institution: v.string(),
    degree: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.number(),
  }).index("by_order", ["order"]),

  // Resume: Skills
  skills: defineTable({
    name: v.string(),
    category: v.string(),
    order: v.optional(v.number()),
  }).index("by_category", ["category"]),

  // Resume: Awards/Credits
  awards: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    year: v.optional(v.number()),
    order: v.optional(v.number()),
  }).index("by_year", ["year"]),

  // Testimonials
  testimonials: defineTable({
    quote: v.string(),
    authorName: v.string(),
    authorRole: v.optional(v.string()),
    photo: v.optional(v.id("_storage")),
    featured: v.boolean(),
    order: v.number(),
  })
    .index("by_featured", ["featured"])
    .index("by_order", ["order"]),

  // Events
  events: defineTable({
    title: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    venue: v.optional(v.string()),
    city: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.union(v.literal("upcoming"), v.literal("past")),
    ticketUrl: v.optional(v.string()),
    featured: v.boolean(),
    imageFile: v.optional(v.id("_storage")),
  })
    .index("by_type", ["type"])
    .index("by_date", ["date"])
    .index("by_type_and_date", ["type", "date"]),

  // Contact submissions
  contactSubmissions: defineTable({
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
    read: v.boolean(),
  }).index("by_read", ["read"]),

  // Site settings (single-row)
  siteSettings: defineTable({
    heroTagline: v.string(),
    heroSubtitle: v.optional(v.string()),
    siteTitle: v.string(),
    metaDescription: v.optional(v.string()),
    contactEmail: v.string(),
    socialLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
      }),
    ),
    heroImage: v.optional(v.id("_storage")),
  }),
});
