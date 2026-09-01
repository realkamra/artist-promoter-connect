import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { convexAuth } from "@convex-dev/auth/server";

import { emailOtp } from "./auth/emailOtp";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Anonymous,
    ConvexCredentials,
    emailOtp,
  ],
});