import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // A promoter's public listing: what they do, what they charge, and proof they're good.
    listings: defineTable({
      promoterId: v.id("users"),
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
      vouchCount: v.number(),
      ratingSum: v.number(),
    })
      .index("by_promoter", ["promoterId"])
      .index("by_handle", ["handle"]),

    // Vouches: 1-5 star ratings + a short comment. One per user per listing.
    vouches: defineTable({
      listingId: v.id("listings"),
      authorId: v.id("users"),
      rating: v.number(),
      comment: v.string(),
    }).index("by_listing", ["listingId"]),

    // add other tables here

    // tableName: defineTable({
    //   ...
    //   // table fields
    // }).index("by_field", ["field"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
