import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Headphones,
  Heart,
  LogOut,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
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
    response: "Usually replies in 4h",
    price: 250,
    minQty: 3,
    tag: "Playlist & promotion",
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
    response: "Usually replies in 1d",
    price: 180,
    minQty: 2,
    tag: "Radio & discovery",
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
    response: "Usually replies in 8h",
    price: 320,
    minQty: 4,
    tag: "Tastemakers & editors",
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
    response: "Usually replies in 2d",
    price: 140,
    minQty: 5,
    tag: "Curated sessions",
  },
  {
    name: "Velvet Cuts",
    handle: "@velvetcuts",
    location: "Los Angeles, US",
    genres: ["R&B", "Soul"],
    reach: "110k monthly",
    bio: "High-energy TikTok edits and animated visuals built to make your record impossible to scroll past.",
    fit: 82,
    tone: "pink",
    response: "Usually replies in 6h",
    price: 275,
    minQty: 2,
    tag: "TikTok edits & animation",
  },
];

const bars = [34, 48, 42, 66, 54, 78, 63, 86, 72, 96, 77, 88, 100, 82, 92, 74, 84, 68, 79, 62, 71, 54];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [genre, setGenre] = useState("All genres");
  const [liked, setLiked] = useState<string[]>([]);

  const genres = ["All genres", "Electronic", "Indie", "Alt pop", "R&B", "Ambient"];

  const filtered = useMemo(
    () =>
      promoters.filter((promoter) => {
        const matchesQuery = `${promoter.name} ${promoter.location} ${promoter.genres.join(" ")} ${promoter.tag}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesQuery && (genre === "All genres" || promoter.genres.includes(genre));
      }),
    [genre, query],
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#07070e] pb-28 text-[#ecebf3]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-16rem] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#6d4dff]/15 blur-[140px]" />

      <header className="relative border-b border-white/[.07] bg-[#07070e]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <button type="button" onClick={() => navigate("/")} className="group flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white shadow-[0_0_20px_rgba(139,92,246,.45)] transition group-hover:shadow-[0_0_30px_rgba(139,92,246,.6)]">
              <Headphones className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              sonar<span className="text-[#a58bff]">/match</span>
            </span>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">{user?.name || "Artist"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out" className="text-white/50 hover:bg-white/10 hover:text-white">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <h1 className="font-display max-w-2xl text-4xl font-medium text-white sm:text-5xl">
              Find your promoter.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
              People who can promote your music — with prices up front. Like the ones you want to work with.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[.07] px-5 py-4 backdrop-blur-xl">
            <div>
              <p className="text-xs text-white/55">Profile</p>
              <p className="mt-1 text-sm font-semibold text-white">Almost complete</p>
            </div>
            <div className="relative size-12">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity=".1" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#a58bff" strokeWidth="3" strokeDasharray="75 100" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#c9b8ff]">80%</span>
            </div>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-white/12 bg-white/[.07] p-5 backdrop-blur-xl">
          <div className="grid gap-6 sm:grid-cols-[1.6fr_1fr_1fr] sm:gap-8">
            <div>
              <div className="flex items-start justify-between">
                <p className="text-xs text-white/55">New matches</p>
                <TrendingUp className="size-4 text-[#a6e3a1]" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">+24 <span className="text-xs font-normal text-[#a6e3a1]">this week</span></p>
              <div className="mt-4 flex h-16 items-end gap-1.5">
                {bars.map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.025, duration: 0.45 }}
                    className={`flex-1 rounded-t-sm ${index > 15 ? "bg-[#a58bff]" : "bg-[#a58bff]/30"}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-t border-white/[.08] pt-4 sm:block sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <p className="text-xs text-white/55">Promoters</p>
              <p className="mt-0 text-2xl font-semibold text-white sm:mt-3">1,284</p>
              <p className="mt-0 text-xs text-white/45 sm:mt-1">to browse right now</p>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-t border-white/[.08] pt-4 sm:block sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <p className="text-xs text-white/55">Average match</p>
              <p className="mt-0 text-2xl font-semibold text-white sm:mt-3">88%</p>
              <p className="mt-0 text-xs text-white/45 sm:mt-1">fit with your sound</p>
            </div>
          </div>
        </section>

        <div id="matches" className="mb-8 flex flex-col gap-3 sm:flex-row" role="search">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 size-4 text-white/30" />
            <label htmlFor="promoter-search" className="sr-only">Search promoters</label>
            <Input
              id="promoter-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search promoters, genres, cities..."
              className="h-11 border-white/[.09] bg-white/[.04] pl-10 text-white placeholder:text-white/30 backdrop-blur focus-visible:ring-[#8b6cff]"
              autoComplete="off"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setFilterOpen((value) => !value)}
            aria-expanded={filterOpen}
            className="h-11 gap-2 border-white/[.09] bg-white/[.04] text-white/60 backdrop-blur hover:bg-white/10 hover:text-white"
          >
            <SlidersHorizontal className="size-4" /> Filters {genre !== "All genres" && <span className="size-1.5 rounded-full bg-[#a58bff]" />}
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
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/[.09] bg-white/[.04] p-4 backdrop-blur">
                <span className="mr-2 text-[10px] uppercase tracking-wider text-white/35">Genre</span>
                {genres.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGenre(item)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      genre === item
                        ? "bg-gradient-to-r from-[#a58bff] to-[#6d4dff] text-white"
                        : "bg-white/[.07] text-white/50 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                {genre !== "All genres" && (
                  <button type="button" onClick={() => setGenre("All genres")} aria-label="Clear genre filter" className="ml-auto text-white/40 hover:text-white">
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-white/55">{filtered.length} promoters</p>
          <p className="hidden text-xs text-white/40 sm:block">Best match first <ChevronDown className="ml-1 inline size-3" /></p>
        </div>

        <ul className="grid gap-4 lg:grid-cols-2">
          {filtered.map((promoter, index) => (
            <motion.li
              layout
              key={promoter.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-2xl border border-white/[.09] bg-white/[.04] p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#8b6cff]/40 hover:bg-white/[.06]"
            >
              <article>
                <div className="flex items-start gap-4">
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl font-semibold ${
                    promoter.tone === "pink"
                      ? "bg-[#f5c2e7]/15 text-[#f5c2e7]"
                      : promoter.tone === "blue"
                        ? "bg-[#89dceb]/15 text-[#89dceb]"
                        : promoter.tone === "yellow"
                          ? "bg-[#f9e2af]/15 text-[#f9e2af]"
                          : "bg-[#a6e3a1]/15 text-[#a6e3a1]"
                  }`}>
                    {promoter.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-white">{promoter.name}</h2>
                      <Badge variant="secondary" className="bg-[#a58bff]/15 font-semibold text-[#c9b8ff]">
                        {promoter.fit}% match
                      </Badge>
                      <button
                        type="button"
                        aria-label="Like promoter"
                        onClick={() => setLiked((current) => (current.includes(promoter.name) ? current.filter((n) => n !== promoter.name) : [...current, promoter.name]))}
                        className="ml-auto"
                      >
                        <Heart className={`size-4 transition ${liked.includes(promoter.name) ? "fill-[#f5c2e7] text-[#f5c2e7]" : "text-white/30 hover:text-[#f5c2e7]"}`} />
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] text-white/35">{promoter.handle} · {promoter.location}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[#8b6cff]/30 bg-[#8b6cff]/12 px-2.5 py-1 text-xs font-medium text-[#c9b8ff]">
                    <BadgeCheck className="size-3.5" /> {promoter.tag}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/50">{promoter.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {promoter.genres.map((item) => (
                    <span key={item} className="rounded-md bg-white/[.07] px-2.5 py-1 text-[10px] text-white/50">{item}</span>
                  ))}
                  <span className="rounded-md bg-white/[.07] px-2.5 py-1 text-[10px] text-white/50">{promoter.reach}</span>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/[.08] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-xl font-semibold text-white">${promoter.price}</p>
                    <p className="text-xs text-white/45">per video · at least {promoter.minQty}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/40">{requested.includes(promoter.name) ? "Intro sent" : promoter.response}</span>
                    <Button
                      size="sm"
                      variant={requested.includes(promoter.name) ? "secondary" : "default"}
                      disabled={requested.includes(promoter.name)}
                      onClick={() => setRequested((current) => [...current, promoter.name])}
                    >
                      {requested.includes(promoter.name) ? (
                        <><Check className="size-3.5" /> Requested</>
                      ) : (
                        <>Send intro <ArrowUpRight className="size-3.5" /></>
                      )}
                    </Button>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[.15] bg-white/[.04] p-16 text-center backdrop-blur">
            <Sparkles className="mx-auto size-6 text-white/30" />
            <p className="mt-4 text-sm text-white/60">No promoters match that search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGenre("All genres");
              }}
              className="mt-3 text-xs font-semibold text-[#a58bff] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <FloatingDock items={createArtistDockItems({ onSignOut: handleSignOut })} />
    </main>
  );
}
