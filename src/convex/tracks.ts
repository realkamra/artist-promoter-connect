import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple URL sanity check — we accept anything http(s) so Spotify, SoundCloud,
// YouTube, Google Drive and private links all work.
function assertHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("bad");
    }
    return url;
  } catch {
    throw new ConvexError("Link must start with https://");
  }
}

export const createMyTrack = mutation({
  args: {
    title: v.string(),
    link: v.string(),
    description: v.string(),
    genres: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Sign in to post a track.");

    const title = args.title.trim().slice(0, 80);
    if (!title) throw new ConvexError("Give the track a title.");
    const link = assertHttpUrl(args.link.trim());
    const description = args.description.trim().slice(0, 400);
    const genres = args.genres.filter(Boolean).slice(0, 6);

    return await ctx.db.insert("tracks", {
      artistId: userId,
      title,
      link,
      description,
      genres,
    });
  },
});

export const listMyTracks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("tracks")
      .withIndex("by_artist", (q) => q.eq("artistId", userId))
      .collect();
  },
});

export const listTracks = query({
  args: {},
  handler: async (ctx) => {
    // Newest first. Defensive: skip malformed docs rather than crash the feed.
    const docs = await ctx.db.query("tracks").order("desc").collect();
    return docs.filter(
      (doc) =>
        typeof doc.title === "string" &&
        typeof doc.link === "string" &&
        Array.isArray(doc.genres),
    );
  },
});

export const deleteMyTrack = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, { trackId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Sign in first.");
    const track = await ctx.db.get(trackId);
    if (!track) throw new ConvexError("Track not found.");
    if (track.artistId !== userId) {
      throw new ConvexError("You can only delete your own tracks.");
    }
    await ctx.db.delete(trackId);
  },
});
