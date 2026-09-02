import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const myVouch = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, { listingId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const vouches = await ctx.db
      .query("vouches")
      .withIndex("by_listing", (q) => q.eq("listingId", listingId))
      .collect();
    return vouches.find((v) => v.authorId === userId) ?? null;
  },
});

export const addVouch = mutation({
  args: {
    listingId: v.id("listings"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, { listingId, rating, comment }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Sign in to vouch for a promoter.");

    const listing = await ctx.db.get(listingId);
    if (!listing) throw new ConvexError("That listing no longer exists.");
    if (listing.promoterId === userId) {
      throw new ConvexError("You can't vouch for your own listing.");
    }

    const ratingValue = Math.round(rating);
    if (ratingValue < 1 || ratingValue > 5) {
      throw new ConvexError("Rating must be between 1 and 5.");
    }
    const text = comment.trim().slice(0, 400);
    if (!text) throw new ConvexError("Write a few words about working together.");

    const existing = await ctx.db
      .query("vouches")
      .withIndex("by_listing", (q) => q.eq("listingId", listingId))
      .collect();
    const mine = existing.find((v) => v.authorId === userId);

    if (mine) {
      await ctx.db.patch(mine._id, { rating: ratingValue, comment: text });
      // Adjust aggregates by the delta so counts stay exact.
      await ctx.db.patch(listingId, {
        ratingSum: listing.ratingSum - mine.rating + ratingValue,
      });
      return "updated" as const;
    }

    await ctx.db.insert("vouches", {
      listingId,
      authorId: userId,
      rating: ratingValue,
      comment: text,
    });
    await ctx.db.patch(listingId, {
      vouchCount: listing.vouchCount + 1,
      ratingSum: listing.ratingSum + ratingValue,
    });
    return "created" as const;
  },
});
