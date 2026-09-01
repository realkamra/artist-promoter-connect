import type { AuthConfig } from "convex/server";

const freebuffIssuer =
  process.env.VLY_CONVEX_AUTH_ISSUER ?? "https://auth.freebuff.app";

const convexSiteUrl = process.env.CONVEX_SITE_URL;

if (!convexSiteUrl) {
  throw new Error(
    "Missing CONVEX_SITE_URL. Convex normally provides this automatically.",
  );
}

export default {
  providers: [
    {
      domain: convexSiteUrl,
      applicationID: "convex",
    },
    {
      type: "customJwt",
      issuer: freebuffIssuer,
      jwks: `${freebuffIssuer}/api/web/.well-known/jwks.json`,
      applicationID: "vly-convex",
      algorithm: "RS256",
    },
  ],
} satisfies AuthConfig;