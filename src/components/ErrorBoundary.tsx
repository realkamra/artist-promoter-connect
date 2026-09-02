import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  componentStack: string | null;
}

function diagnose(error: Error): string | null {
  const message = `${error.message}`;
  if (/could not find (public )?function|no function|function not found/i.test(message)) {
    return (
      "The page is asking for a backend function that doesn't exist on this Convex " +
      "deployment yet. Fix: run `npx convex dev --once` in your Codespace (this pushes " +
      "the listings/vouches functions to your deployment), then hard-refresh the page " +
      "with Ctrl + Shift + R."
    );
  }
  if (/could not find public function|unauthorized|permission/i.test(message)) {
    return "The backend rejected the request. If you just changed the schema, run `npx convex dev --once` in your Codespace and refresh.";
  }
  if (/failed to fetch|networkerror|websocket/i.test(message)) {
    return "The page can't reach the Convex server. Check your connection, then reload.";
  }
  return null;
}

/**
 * Catches any render/runtime error (including Convex query failures and failed
 * lazy-chunk loads after a deploy) and shows the message on screen instead of
 * unmounting to a blank page. Without this, a crash anywhere in a route
 * renders nothing at all — a plain black screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, componentStack: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("sonar/match render error:", error, info.componentStack);
    this.setState({ componentStack: info.componentStack ?? null });
  }

  render() {
    const { error, componentStack } = this.state;
    if (!error) return this.props.children;

    const hint = diagnose(error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070e] px-6 py-12 text-[#ecebf3]">
        <div className="w-full max-w-2xl rounded-2xl border border-[#fb7185]/25 bg-white/[.04] p-8 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[.2em] text-[#fb7185]">Something broke</p>
          <h1 className="font-display mt-3 text-2xl font-medium text-white">This page hit an error</h1>
          {hint && (
            <p className="mt-4 rounded-xl border border-[#8b6cff]/30 bg-[#8b6cff]/[.08] px-4 py-3 text-sm leading-6 text-[#c9b8ff]">
              {hint}
            </p>
          )}
          <p className="mt-4 text-sm leading-6 text-white/60">
            If the suggestion doesn&apos;t fix it, copy the error below and send it back — it says exactly what failed.
          </p>
          <pre className="mt-5 max-h-80 overflow-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs leading-5 text-[#c9b8ff]">
            {error.message}
            {componentStack ? `\n\n${componentStack.trim()}` : ""}
          </pre>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-[#8b6cff] text-white hover:bg-[#9a80ff]"
            >
              Reload page
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.location.href = "/artist-promoter-connect/";
              }}
              className="border-white/15 bg-white/[.06] text-white/80 hover:bg-white/12 hover:text-white"
            >
              Go home
            </Button>
          </div>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
