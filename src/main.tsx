import React, { lazy, StrictMode, Suspense, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

import { RequireAuth } from "@/components/RequireAuth";
import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import "@vly-ai/integrations";

import "./index.css";
import "./types/global.d.ts";

const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const StatefulButtonDemo = lazy(
  () => import("./components/StatefulButtonDemo.tsx"),
);
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#11111b] text-[#cdd6f4]">
      <p className="animate-pulse font-mono text-sm text-[#a6adc8]">
        Loading sonar/match...
      </p>
    </main>
  );
}

const MISSING_URL_LINES = [
  "VITE_CONVEX_URL is missing.",
  "",
  "Fix this in GitHub:",
  "",
  "1. Go to Settings > Secrets and variables > Actions",
  "2. Click New repository secret",
  "3. Name: VITE_CONVEX_URL",
  "4. Value: https://jovial-lynx-583.convex.cloud",
  "5. Save",
  "6. Go to Actions > Deploy to GitHub Pages > Run workflow > main",
].join("\n");

function SetupError({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#11111b] px-6 text-[#cdd6f4]">
      <div className="w-full max-w-2xl rounded-2xl border border-[#f38ba8]/30 bg-[#1e1e2e] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f38ba8]">
          Configuration error
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[#f5e0dc]">{title}</h1>
        <pre className="mt-5 max-h-96 overflow-auto rounded-lg bg-[#11111b] p-4 font-mono text-xs text-[#a6adc8]">
          {message}
        </pre>
      </div>
    </main>
  );
}

function App() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

  if (!convexUrl) {
    return