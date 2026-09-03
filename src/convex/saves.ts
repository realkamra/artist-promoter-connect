import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const mySaves = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("saves")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const toggleSave = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, { listingId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new ConvexError("Sign in to save promoters.");

    const listing = await ctx.db.get(listingId);
    if (!listing) throw new ConvexError("That listing no longer exists.");

    const existing = await ctx.db
      .query("saves")
      .withIndex("by_user_listing", (q) =>
        q.eq("userId", userId).eq("listingId", listingId),
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      return "removed" as const;
    }
    await ctx.db.insert("saves", { userId, listingId });
    return "saved" as const;
  },
});
