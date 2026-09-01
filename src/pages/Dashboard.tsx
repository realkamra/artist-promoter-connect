import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Headphones, LogOut, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingDock, createArtistDockItems } from "@/components/FloatingDock";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

const promoters = [
  {
    name: "Maya Chen",
    handle: "@mayamixes",
    location: "Berlin, DE",
    genres: ["Electronic", "House"],
    reach: "180k monthly",
    bio: "Playlist curator and campaign strategist for forward-thinking electronic artists.",
    fit: 96,
    tone: "pink",
  },
  {
    name: "Late Night Radio",
    handle: "@latenightradio",
    location: "Worldwide",
    genres: ["Indie", "Alt pop"],
    reach: "92k monthly",
    bio: "Independent radio and discovery channel finding the next late-night obsession.",
    fit: 91,
    tone: "blue",
  },
  {
    name: "Juno Collective",
    handle: "@junocollective",
    location: "Toronto, CA",
    genres: ["Alt pop", "R&B"],
    reach: "64k monthly",
    bio: "A small, trusted network of tastemakers, writers, and playlist editors.",
    fit: 88,
    tone: "yellow",
  },
  {
    name: "Soft Signal",
    handle: "@softsignal.fm",
    location: "London, UK",
    genres: ["Ambient", "Electronic"],
    reach: "41k monthly",
    bio: "Curated releases and intimate listening sessions for boundary-pushing sounds.",
    fit: 84,
    tone: "green",
  },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [genre, setGenre] = useState("All genres");

  const genres = ["All genres", "Electronic", "Indie", "Alt pop", "R&B", "Ambient"];

  const filtered = useMemo(
    () =>
      promoters.filter((promoter) => {
        const matchesQuery = `${promoter.name} ${promoter.location} ${promoter.genres.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());

        return (
          matchesQuery &&
          (genre === "All genres" || promoter.genres.includes(genre))
        );
      }),
    [genre, query],
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dockItems = createArtistDockItems({ onSignOut: handleSignOut });

  return (
    <main className="min-h-screen bg-[#11111b] pb-28 text-[#cdd6f4]">
      <header className="border-b border-[#313244] bg-[#11111b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-3"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-[#cba6f7]/40 bg-[#cba6f7]/10 text-[#cba6f7] transition group-hover:bg-[#cba6f7] group-hover:text-[#1e1e2e]">
              <Headphones className="size-4" />
            </span>

            <span className="font-mono text-sm font-bold text-[#f5e0dc]">
              SONAR<span className="text-[#cba6f7]">/MATCH</span>
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#f5e0dc]">
                {user?.name || "Artist"}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#6c7086]">
                Active profile
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="text-[#a6adc8] hover:bg-[#313244] hover:text-[#f5e0dc]"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.24em] text-[#89dceb]">
              <span className="size-1.5 rounded-full bg-[#a6e3a1] shadow-[0_0_12px_#a6e3a1]" />
              Signal scan / live
            </p>

            <h1 className="text-4xl font-semibold tracking-[-.04em] text-[#f5e0dc] sm:text-5xl">
              Find your <span className="text-[#cba6f7]">amplifier.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#a6adc8]">
              A shortlist of promoters aligned with your sound, audience, and ambition.
            </p>
          </div>

          <div className="flex items-center gap-5 rounded-xl border border-[#313244] bg-[#1e1e2e] px-5 py-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#6c7086]">
                Profile signal
              </p>
              <p className="mt-1 text-sm font-semibold text-[#f5e0dc]">
                Strong match potential
              </p>
            </div>

            <div className="relative size-12">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#313244"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#a6e3a1"
                  strokeWidth="3"
                  strokeDasharray="75 100"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#a6e3a1]">
                80%
              </span>
            </div>
          </div>
        </div>

        <div
          id="matches"
          className="mb-8 flex flex-col gap-3 sm:flex-row"
          role="search"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 size-4 text-[#6c7086]" />
            <label htmlFor="promoter-search" className="sr-only">
              Search promoters
            </label>
            <Input
              id="promoter-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search promoters, genres, cities..."
              className="h-11 border-[#313244] bg-[#1e1e2e] pl-10 text-[#f5e0dc] placeholder:text-[#6c7086] focus-visible:ring-[#cba6f7]"
              autoComplete="off"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setFilterOpen((value) => !value)}
            aria-expanded={filterOpen}
            className="h-11 gap-2 border-[#313244] bg-[#1e1e2e] text-[#a6adc8] hover:bg-[#292c3c] hover:text-[#f5e0dc]"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {genre !== "All genres" && (
              <span className="size-1.5 rounded-full bg-[#cba6f7]" />
            )}
          </Button>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              className="mb-7 overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#313244] bg-[#1e1e2e] p-4">
                <span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-[#6c7086]">
                  Genre
                </span>

                {genres.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGenre(item)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      genre === item
                        ? "bg-[#cba6f7] text-[#1e1e2e]"
                        : "bg-[#292c3c] text-[#a6adc8] hover:text-[#f5e0dc]"
                    }`}
                  >
                    {item}
                  </button>
                ))}

                {genre !== "All genres" && (
                  <button
                    type="button"
                    onClick={() => setGenre("All genres")}
                    aria-label="Clear genre filter"
                    className="ml-auto text-[#6c7086] hover:text-[#f5e0dc]"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#6c7086]">
            {filtered.length} matches found
          </p>
          <p className="hidden text-xs text-[#6c7086] sm:block">
            Sorted by compatibility
          </p>
        </div>

        <ul className="grid gap-4 lg:grid-cols-2">
          {filtered.map((promoter, index) => (
            <motion.li
              layout
              key={promoter.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-xl border border-[#313244] bg-[#1e1e2e] p-5 transition hover:-translate-y-0.5 hover:border-[#cba6f7]/50 hover:shadow-2xl hover:shadow-black/20"
            >
              <article>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold transition group-hover:scale-105 ${
                      promoter.tone === "pink"
                        ? "bg-[#f5c2e7]/15 text-[#f5c2e7]"
                        : promoter.tone === "blue"
                          ? "bg-[#89dceb]/15 text-[#89dceb]"
                          : promoter.tone === "yellow"
                            ? "bg-[#f9e2af]/15 text-[#f9e2af]"
                            : "bg-[#a6e3a1]/15 text-[#a6e3a1]"
                    }`}
                    aria-hidden="true"
                  >
                    {promoter.name
                      .split(" ")
                      .map((namePart) => namePart[0])
                      .join("")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-[#f5e0dc]">
                        {promoter.name}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="bg-[#a6e3a1]/10 font-mono text-[10px] text-[#a6e3a1]"
                      >
                        {promoter.fit}% fit
                      </Badge>
                    </div>

                    <p className="mt-1 font-mono text-[10px] text-[#6c7086]">
                      {promoter.handle} · {promoter.location}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#a6adc8]">
                  {promoter.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {promoter.genres.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-[#292c3c] px-2.5 py-1 font-mono text-[10px] text-[#a6adc8]"
                    >
                      {item}
                    </span>
                  ))}

                  <span className="rounded-md bg-[#292c3c] px-2.5 py-1 font-mono text-[10px] text-[#a6adc8]">
                    {promoter.reach}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#313244] pt-4">
                  <span className="text-[11px] text-[#6c7086]">
                    {requested.includes(promoter.name)
                      ? "Intro request sent"
                      : "Open to new campaigns"}
                  </span>

                  <Button
                    size="sm"
                    variant={
                      requested.includes(promoter.name)
                        ? "secondary"
                        : "default"
                    }
                    disabled={requested.includes(promoter.name)}
                    onClick={() =>
                      setRequested((current) => [...current, promoter.name])
                    }
                  >
                    {requested.includes(promoter.name) ? (
                      <>
                        <Check className="size-3.5" />
                        Requested
                      </>
                    ) : (
                      <>
                        Request intro
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#313244] bg-[#1e1e2e] p-16 text-center">
            <Search className="mx-auto size-6 text-[#6c7086]" />
            <p className="mt-4 text-sm text-[#a6adc8]">
              No matching signals found.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGenre("All genres");
              }}
              className="mt-3 text-xs font-semibold text-[#cba6f7] hover:underline"
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      <FloatingDock items={dockItems} />
    </main>
  );
}