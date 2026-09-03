import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRequest = mutation({
  args: {
    listingId: v.id("listings"),
    trackId: v.optional(v.id("tracks")),
    message: v.string(),
  },
  handler: async (ctx, { listingId, trackId, message }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Sign in to send a request.");

    const listing = await ctx.db.get(listingId);
    if (!listing) throw new ConvexError("That listing no longer exists.");
    if (listing.promoterId === userId) {
      throw new ConvexError("You can't request your own services.");
    }

    const text = message.trim().slice(0, 500);
    if (!text) throw new ConvexError("Write a short message.");

    if (trackId) {
      const track = await ctx.db.get(trackId);
      if (!track || track.artistId !== userId) {
        throw new ConvexError("Pick one of your own tracks.");
      }
    }

    // One pending request per artist per listing — prevents spam, still lets
    // them re-approach after the promoter responds.
    const mine = await ctx.db
      .query("requests")
      .withIndex("by_artist", (q) => q.eq("artistId", userId))
      .collect();
    const duplicate = mine.find(
      (r) => r.listingId === listingId && r.status === "pending",
    );
    if (duplicate) {
      throw new ConvexError(
        `You already have a pending request with ${listing.name}.`,
      );
    }

    return await ctx.db.insert("requests", {
      artistId: userId,
      promoterId: listing.promoterId,
      listingId,
      trackId,
      message: text,
      status: "pending",
    });
  },
});

export const listMySentRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const docs = await ctx.db
      .query("requests")
      .withIndex("by_artist", (q) => q.eq("artistId", userId))
      .collect();
    // Attach the promoter + listing info for display.
    return Promise.all(
      docs.map(async (req) => {
        const listing = await ctx.db.get(req.listingId);
        return {
          _id: req._id,
          _creationTime: req._creationTime,
          status: req.status,
          message: req.message,
          listingName: listing?.name ?? "Removed listing",
          listingHandle: listing?.handle,
        };
      }),
    ).then((rows) => rows.reverse());
  },
});

export const listIncomingRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const docs = await ctx.db
      .query("requests")
      .withIndex("by_promoter", (q) => q.eq("promoterId", userId))
      .collect();
    return Promise.all(
      docs.map(async (req) => {
        const artist = await ctx.db.get(req.artistId);
        const track = req.trackId ? await ctx.db.get(req.trackId) : null;
        return {
          _id: req._id,
          _creationTime: req._creationTime,
          status: req.status,
          message: req.message,
          artistName: artist?.name ?? "Artist",
          trackTitle: track?.title ?? null,
          trackLink: track?.link ?? null,
          trackGenres: track?.genres ?? [],
          trackDescription: track?.description ?? null,
        };
      }),
    ).then((rows) => rows.reverse());
  },
});

export const respondToRequest = mutation({
  args: {
    requestId: v.id("requests"),
    status: v.union(v.literal("accepted"), v.literal("declined")),
  },
  handler: async (ctx, { requestId, status }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Sign in first.");
    const request = await ctx.db.get(requestId);
    if (!request) throw new ConvexError("Request not found.");
    if (request.promoterId !== userId) {
      throw new ConvexError("Only the promoter can respond to this request.");
    }
    if (request.status !== "pending") {
      throw new ConvexError("This request was already answered.");
    }
    await ctx.db.patch(requestId, { status });
  },
});
