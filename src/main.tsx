import React, { lazy, StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router";
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

function RuntimeErrorScreen({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#11111b] px-6 text-[#cdd6f4]">
      <div className="w-full max-w-lg rounded-2xl border border-[#f38ba8]/30 bg-[#1e1e2e] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f38ba8]">
          Runtime error
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[#f5e0dc]">
          sonar/match could not start
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#a6adc8]">
          Check the browser console for the complete error and verify that the
          production Convex URL is configured in GitHub Actions.
        </p>
        <pre className="mt-5 overflow-auto rounded-lg bg-[#11111b] p-4 text-xs text-[#f38ba8]">
          {message}
        </pre>
      </div>
    </main>
  );
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <RuntimeErrorScreen message={this.state.error.message} />;
    }

    return this.props.children;
  }
}

function RouteSyncer() {
  const location = useLocation();

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "iframe-route-change",
        path: location.pathname,
      },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") {
          window.history.back();
        }

        if (event.data.direction === "forward") {
          window.history.forward();
        }
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "VITE_CONVEX_URL is missing. Add it to GitHub Actions repository secrets and redeploy.",
  );
}

const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <VlyToolbar />

      <InstrumentationProvider>
        <ConvexAuthProvider client={convex}>
          <BrowserRouter basename="/artist-promoter-connect">
            <RouteSyncer />

            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Landing />} />

                <Route
                  path="/auth"
                  element={<AuthPage redirectAfterAuth="/dashboard" />}
                />

                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/demo"
                  element={
                    <RequireAuth>
                      <StatefulButtonDemo />
                    </RequireAuth>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>

          <Toaster />
        </ConvexAuthProvider>
      </InstrumentationProvider>
    </AppErrorBoundary>
  </StrictMode>,
);