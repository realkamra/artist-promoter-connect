import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const handleRegex = /^[a-z0-9-]{3,32}$/;

// Fills in defaults for any field an older or hand-edited doc may be missing, so
// the UI never crashes on malformed data.
function normalizeListing(doc: {
  _id: Id<"listings">;
  _creationTime: number;
  handle?: unknown;
  name?: unknown;
  headline?: unknown;
  about?: unknown;
  services?: unknown;
  genres?: unknown;
  pricePerUnit?: unknown;
  unit?: unknown;
  minQuantity?: unknown;
  followers?: unknown;
  location?: unknown;
  portfolio?: unknown;
  socials?: unknown;
  vouchCount?: unknown;
  ratingSum?: unknown;
}) {
  const portfolio = Array.isArray(doc.portfolio) ? doc.portfolio : [];
  const socials = Array.isArray(doc.socials) ? doc.socials : [];

  // Return a new object instead of spreading the database document. This keeps
  // undefined values from legacy records out of Convex's serialized response.
  return {
    _id: doc._id,
    _creationTime: doc._creationTime,
    handle: typeof doc.handle === "string" ? doc.handle : "",
    name: typeof doc.name === "string" ? doc.name : "",
    headline: typeof doc.headline === "string" ? doc.headline : "",
    about: typeof doc.about === "string" ? doc.about : "",
    services: Array.isArray(doc.services)
      ? doc.services.filter((service): service is string => typeof service === "string")
      : [],
    genres: Array.isArray(doc.genres)
      ? doc.genres.filter((genre): genre is string => typeof genre === "string")
      : [],
    pricePerUnit: typeof doc.pricePerUnit === "number" ? doc.pricePerUnit : 0,
    unit: typeof doc.unit === "string" && doc.unit ? doc.unit : "video",
    minQuantity: typeof doc.minQuantity === "number" ? doc.minQuantity : 1,
    followers: typeof doc.followers === "number" ? doc.followers : 0,
    location: typeof doc.location === "string" ? doc.location : "",
    portfolio: portfolio.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const value = item as { label?: unknown; url?: unknown };
      return typeof value.url === "string"
        ? [{ label: typeof value.label === "string" ? value.label : "", url: value.url }]
        : [];
    }),
    socials: socials.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const value = item as { platform?: unknown; url?: unknown };
      return typeof value.url === "string"
        ? [{
            platform: typeof value.platform === "string" ? value.platform : "Link",
            url: value.url,
          }]
        : [];
    }),
    vouchCount: typeof doc.vouchCount === "number" ? doc.vouchCount : 0,
    ratingSum: typeof doc.ratingSum === "number" ? doc.ratingSum : 0,
  };
}

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
    const doc = await ctx.db
      .query("listings")
      .withIndex("by_promoter", (q) => q.eq("promoterId", userId))
      .first();
    return doc ? normalizeListing(doc) : null;
  },
});

export const listListings = query({
  args: {},
  handler: async (ctx) => {
    // Defensive reads: a doc written before a schema change (or by hand in the
    // dashboard) can be missing fields the UI assumes. Skip instead of crashing.
    const docs = await ctx.db.query("listings").collect();
    return docs
      .filter(
        (doc) =>
          typeof doc.handle === "string" &&
          typeof doc.name === "string",
      )
      .map((doc) => normalizeListing(doc));
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
    const normalized = normalizeListing(listing);
    const promoter = await ctx.db.get(listing.promoterId);
    const vouchDocs = await ctx.db
      .query("vouches")
      .withIndex("by_listing", (q) => q.eq("listingId", listing._id))
      .collect();
    const authors = await Promise.all(vouchDocs.map((v) => ctx.db.get(v.authorId)));
    return {
      listing: normalized,
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

    const createdListingIds: Id<"listings">[] = [];
    for (const entry of demo) {
      const demoUserId = await ctx.db.insert("users", {
        name: entry.name,
        isAnonymous: true,
      });
      const listingId = await ctx.db.insert("listings", {
        promoterId: demoUserId,
        ...entry,
        vouchCount: 0,
        ratingSum: 0,
      });
      createdListingIds.push(listingId);
    }

    // Demo vouches from invisible demo users, so profiles aren't dead on day one.
    const demoVouches: Array<{ listing: number; rating: number; author: string; comment: string }> = [
      { listing: 0, rating: 5, author: "Kairo M.", comment: "Maya's edit hit 300k in a week. Fast, communicative, and the comments were full of people asking about the song." },
      { listing: 0, rating: 4, author: "Sena P.", comment: "Great edits, clear about revisions. Worth the price." },
      { listing: 1, rating: 5, author: "Dario V.", comment: "Got a real placement, not a bot playlist. Shared the stats after." },
      { listing: 2, rating: 5, author: "Nia O.", comment: "The visualizer carried the whole single rollout. Booked them again." },
    ];
    for (const vouch of demoVouches) {
      const listingId = createdListingIds[vouch.listing];
      const listing = await ctx.db.get(listingId);
      if (!listing) continue;
      const authorId = await ctx.db.insert("users", {
        name: vouch.author,
        isAnonymous: true,
      });
      await ctx.db.insert("vouches", {
        listingId,
        authorId,
        rating: vouch.rating,
        comment: vouch.comment,
      });
      await ctx.db.patch(listingId, {
        vouchCount: listing.vouchCount + 1,
        ratingSum: listing.ratingSum + vouch.rating,
      });
    }

    // A couple of demo tracks so promoters who sign in see a live feed.
    const demoTracks = [
      {
        artist: "Kairo M.",
        title: "static bloom — demo mix",
        link: "https://soundcloud.com/",
        description: "Alt R&B demo, mixed at home. Looking for TikTok edits that fit the moodier side of the genre.",
        genres: ["Alt", "R&B"],
      },
      {
        artist: "Sena P.",
        title: "Neon Teeth (snippet)",
        link: "https://www.youtube.com/",
        description: "Hyperpop snippet, 40k on SoundCloud so far. Want animated visualizers for the full release.",
        genres: ["Hyperpop", "Electronic"],
      },
    ];
    for (const track of demoTracks) {
      const artistId = await ctx.db.insert("users", {
        name: track.artist,
        isAnonymous: true,
      });
      await ctx.db.insert("tracks", {
        artistId,
        title: track.title,
        link: track.link,
        description: track.description,
        genres: track.genres,
      });
    }
  },
});
