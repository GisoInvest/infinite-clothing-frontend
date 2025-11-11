import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /**
   * Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user.
   * This mirrors the Manus account and should be used for authentication lookups.
   */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table for e-commerce inventory
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in cents to avoid decimal issues
  category: mysqlEnum("category", ["men", "women", "unisex", "kids-baby"]).notNull(),
  subcategory: varchar("subcategory", { length: 100 }).notNull(), // e.g., "t-shirt", "hoodies", etc.
  stock: int("stock").default(0).notNull(),
  images: json("images").$type<string[]>().notNull(), // Array of image URLs
  videos: json("videos").$type<string[]>().notNull(), // Array of video URLs
  colors: json("colors").$type<string[]>().notNull(), // Available colors
  sizes: json("sizes").$type<string[]>().notNull(), // Available sizes (S, M, L, XL, 2XL)
  discount: int("discount").default(0).notNull(), // Discount percentage (0-100)
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table for tracking customer purchases
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }),
  shippingAddress: json("shippingAddress").$type<{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>().notNull(),
  items: json("items").$type<Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number; // Price at time of purchase
  }>>().notNull(),
  subtotal: int("subtotal").notNull(), // In cents
  shipping: int("shipping").notNull(), // In cents
  tax: int("tax").notNull(), // In cents
  total: int("total").notNull(), // In cents
  status: mysqlEnum("status", [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded"
  ]).default("pending").notNull(),
  paymentIntentId: varchar("paymentIntentId", { length: 255 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "succeeded", "failed"]).default("pending").notNull(),
  shippingLabelUrl: text("shippingLabelUrl"),
  trackingNumber: varchar("trackingNumber", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Background audio tracks for the website
 */
export const audioTracks = mysqlTable("audioTracks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  active: boolean("active").default(true).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AudioTrack = typeof audioTracks.$inferSelect;
export type InsertAudioTrack = typeof audioTracks.$inferInsert;

/**
 * Site settings for global configuration
 */
export const siteSettings = mysqlTable("siteSettings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(), // e.g., "background_music_enabled"
  value: text("value").notNull(), // JSON string for complex values
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Blog posts table for content management
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly version of title
  excerpt: text("excerpt"), // Short summary for listing pages
  content: text("content").notNull(), // Full blog post content (HTML)
  coverImage: text("coverImage"), // Main image URL
  images: json("images").$type<string[]>().default([]), // Additional images
  category: varchar("category", { length: 100 }), // e.g., "Fashion Tips", "New Arrivals", "Style Guide"
  tags: json("tags").$type<string[]>().default([]), // e.g., ["streetwear", "cyberpunk", "winter"]
  authorId: int("authorId").notNull(), // Reference to users table
  authorName: varchar("authorName", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["draft", "published", "scheduled"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"), // When the post was/will be published
  viewCount: int("viewCount").default(0).notNull(),
  // SEO fields
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  // Social media formatted content
  facebookPost: text("facebookPost"), // Pre-formatted for Facebook
  instagramPost: text("instagramPost"), // Pre-formatted for Instagram with hashtags
  tiktokPost: text("tiktokPost"), // Pre-formatted for TikTok
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
