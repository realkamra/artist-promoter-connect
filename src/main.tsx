import React, { lazy, StrictMode, Suspense, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Headphones } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import "./types/global.d.ts";

const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const CreateListing = lazy(() => import("./pages/CreateListing.tsx"));
const PromoterProfile = lazy(() => import("./pages/PromoterProfile.tsx"));
const StatefulButtonDemo = lazy(() => import("./components/StatefulButtonDemo.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07070e] text-[#ecebf3]">
      <span className="flex size-10 animate-pulse items-center justify-center rounded-xl bg-[#8b6cff]/20 text-[#c9b8ff]">
        <Headphones className="size-5" />
      </span>
      <p className="text-sm text-white/50">Loading…</p>
    </main>
  );
}

const MISSING_URL = "VITE_CONVEX_URL is missing.\n\nFix in GitHub:\n1. Settings > Secrets and variables > Actions\n2. New repository secret\n3. Name: VITE_CONVEX_URL\n4. Value: https://jovial-lynx-583.convex.cloud\n5. Save\n6. Actions > Deploy to GitHub Pages > Run workflow > main";

function SetupError({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#11111b] px-6 text-[#cdd6f4]">
      <div className="w-full max-w-2xl rounded-2xl border border-[#f38ba8]/30 bg-[#1e1e2e] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f38ba8]">Configuration error</p>
        <h1 className="mt-3 text-2xl font-semibold text-[#f5e0dc]">{title}</h1>
        <pre className="mt-5 max-h-96 overflow-auto rounded-lg bg-[#11111b] p-4 font-mono text-xs text-[#a6adc8]">{message}</pre>
      </div>
    </main>
  );
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage({ type: "iframe-route-change", path: location.pathname }, "*");
  }, [location.pathname]);
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  return null;
}

function App() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
  if (!convexUrl) {
    return <SetupError title="sonar/match is not configured" message={MISSING_URL} />;
  }
  const convex = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);
  return (
    <ConvexAuthProvider client={convex}>
      <BrowserRouter basename="/artist-promoter-connect">
        <ErrorBoundary>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/create-listing" element={<RequireAuth><CreateListing /></RequireAuth>} />
              <Route path="/promoter/:handle" element={<PromoterProfile />} />
              <Route path="/demo" element={<RequireAuth><StatefulButtonDemo /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </ConvexAuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);