import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser, isAuthenticated ? {} : "skip");
  const { signIn, signOut } = useAuthActions();

  // Do not block the auth screen while the optional profile query is resolving.
  // Convex Auth is the source of truth for authentication state.
  const isLoading = isAuthLoading;

  return {
    isLoading,
    isAuthenticated,
    user: user ?? null,
    signIn,
    signOut,
  };
}
