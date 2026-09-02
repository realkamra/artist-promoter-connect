import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const handleRegex = /^[a-z0-9-]{3,32}$/;

const listingFields = {
  handle: v.string(),
  name: v.string(),
  headline: v.string(),
  about: v.string(),
  services: v.array(v.string()),
  genres: v.array(v.string()),
  pricePerUnit: v.number(),
  unit: v.string(),
  minQuantity: v.number(),
  followers: v.number(),
  location: v.string(),
  portfolio: v.array(v.object({ label: v.string(), url: v.string() })),
  socials: v.array(v.object({ platform: v.string(), url: v.string() })),
};

export const upsertMyListing = mutation({
  args: listingFields,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Sign in to create a listing.");

    const handle = args.handle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
      .replace(/^-+|-+$/g, "");

    if (!handleRegex.test(handle)) {
      throw new Error(
        "Handle must be 3-32 characters: lowercase letters, numbers, or dashes.",
      );
    }
    if (!args.name.trim()) throw new Error("Enter a display name.");
    if (!args.headline.trim()) throw new Error("Write a one-line headline.");
    if (args.pricePerUnit <= 0) throw new Error("Price must be greater than zero.");
    if (args.minQuantity < 1) throw new Error("Minimum quantity must be at least 1.");
    if (args.followers < 0) throw new Error("Follower count can't be negative.");

    // A handle must belong to exactly one listing across the whole site.
    const handleOwner = await ctx.db
      .query("listings")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .first();
    if (handleOwner && handleOwner.promoterId !== userId) {
      throw new Error(`The handle "${handle}" is already taken.`);
    }

    const existing = await ctx.db
      .query("listings")
      .withIndex("by_promoter", (q) => q.eq("promoterId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, handle });
      return existing._id;
    }

    return await ctx.db.insert("listings", {
      promoterId: userId,
      ...args,
      handle,
      vouchCount: 0,
      ratingSum: 0,
    });
  },
});

export const getMyListing = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db
      .query("listings")
      .withIndex("by_promoter", (q) => q.eq("promoterId", userId))
      .first();
  },
});

export const listListings = query({
  args: {},
  handler: async (ctx) => {
    // Defensive reads: a doc written before a schema change (or by hand in the
    // dashboard) can be missing fields the UI assumes. Skip instead of crashing.
    const docs = await ctx.db.query("listings").collect();
    return docs.filter(
      (doc) =>
        typeof doc.handle === "string" &&
        typeof doc.name === "string" &&
        Array.isArray(doc.services) &&
        Array.isArray(doc.genres) &&
        typeof doc.pricePerUnit === "number",
    );
  },
});

export const getListingByHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const listing = await ctx.db
      .query("listings")
      .withIndex("by_handle", (q) => q.eq("handle", handle))
      .first();
    if (!listing) return null;
    const promoter = await ctx.db.get(listing.promoterId);
    const vouchDocs = await ctx.db
      .query("vouches")
      .withIndex("by_listing", (q) => q.eq("listingId", listing._id))
      .collect();
    const authors = await Promise.all(vouchDocs.map((v) => ctx.db.get(v.authorId)));
    return {
      listing,
      promoterName: promoter?.name ?? listing.name,
      vouches: vouchDocs
        .map((vouch, i) => ({
          _id: vouch._id,
          rating: vouch.rating,
          comment: vouch.comment,
          authorName: authors[i]?.name ?? "Artist",
          _creationTime: vouch._creationTime,
        }))
        .reverse(), // newest first
    };
  },
});

// Sample listings so the marketplace isn't empty on day one. Creates invisible
// demo users to own them. Safe to run repeatedly — does nothing if any exist.
export const seedDemoListings = mutation({
  args: {},
  handler: async (ctx) => {
    const anyListing = await ctx.db.query("listings").first();
    if (anyListing) return;

    const demo = [
      {
        name: "Maya Chen",
        handle: "maya-chen",
        headline: "TikTok edits that make alt records impossible to scroll past",
        about:
          "I've been editing music content for three years. Most of my work is anime and lyric edits for alt, R&B, and hyperpop artists. My last campaign averaged 120k views per video.",
        services: ["TikTok edits", "Lyric videos", "Animation"],
        genres: ["Alt", "R&B", "Hyperpop"],
        pricePerUnit: 120,
        unit: "video",
        minQuantity: 3,
        followers: 480000,
        location: "Berlin, DE",
        portfolio: [
          { label: "Edit reel 2025", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
          { label: "Campaign case study", url: "https://example.com/maya-case" },
        ],
        socials: [
          { platform: "TikTok", url: "https://www.tiktok.com/@mayamixes" },
          { platform: "Instagram", url: "https://instagram.com/mayamixes" },
        ],
      },
      {
        name: "Late Night Radio",
        handle: "late-night-radio",
        headline: "Playlist placement for indie and alt-pop, 92k monthly listeners",
        about:
          "Independent discovery channel running since 2021. I place two tracks per week and share every placement publicly, so you always know where your song landed.",
        services: ["Playlist placement", "Radio feature", "Track review"],
        genres: ["Indie", "Alt pop"],
        pricePerUnit: 80,
        unit: "slot",
        minQuantity: 1,
        followers: 210000,
        location: "Worldwide",
        portfolio: [
          { label: "Latest placements", url: "https://example.com/lnr-placements" },
        ],
        socials: [{ platform: "Spotify", url: "https://open.spotify.com" }],
      },
      {
        name: "Juno Collective",
        handle: "juno-collective",
        headline: "Animated visualizers and cover art for R&B and soul releases",
        about:
          "A small team of animators and designers. We've made visuals for 40+ independent releases, from single cover loops to full lyric videos.",
        services: ["Visualizers", "Cover animation", "Lyric videos"],
        genres: ["R&B", "Soul", "Alt pop"],
        pricePerUnit: 150,
        unit: "video",
        minQuantity: 2,
        followers: 64000,
        location: "Toronto, CA",
        portfolio: [
          { label: "Visualizer portfolio", url: "https://example.com/juno-reel" },
          { label: "Client list", url: "https://example.com/juno-clients" },
        ],
        socials: [
          { platform: "Instagram", url: "https://instagram.com/junocollective" },
          { platform: "Website", url: "https://example.com/juno" },
        ],
      },
    ];

    for (const entry of demo) {
      const demoUserId = await ctx.db.insert("users", {
        name: entry.name,
        isAnonymous: true,
      });
      await ctx.db.insert("listings", {
        promoterId: demoUserId,
        ...entry,
        vouchCount: 0,
        ratingSum: 0,
      });
    }
  },
});
