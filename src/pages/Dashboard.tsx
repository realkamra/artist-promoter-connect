import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Headphones,
  Heart,
  Loader2,
  LogOut,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingDock, createArtistDockItems } from "@/components/FloatingDock";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { formatFollowers, formatRating, initialsOf } from "@/lib/format";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const GENRES = ["All genres", "Alt", "R&B", "Indie", "Alt pop", "Hyperpop", "Electronic", "Soul"];
const bars = [34, 48, 42, 66, 54, 78, 63, 86, 72, 96, 77, 88, 100, 82, 92, 74, 84, 68, 79, 62, 71, 54];

function fitTone(fit: number) {
  if (fit >= 90) return "bg-[#8b6cff]/15 text-[#c9b8ff]";
  if (fit >= 80) return "bg-white/[.08] text-white/70";
  return "bg-white/[.05] text-white/45";
}

function SkeletonCard() {
  return (
    <li className="animate-pulse rounded-2xl border border-white/[.09] bg-white/[.04] p-5">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-xl bg-white/[.07]" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-40 rounded bg-white/[.07]" />
          <div className="h-2.5 w-28 rounded bg-white/[.05]" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2.5 w-full rounded bg-white/[.05]" />
        <div className="h-2.5 w-4/5 rounded bg-white/[.05]" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="h-6 w-24 rounded bg-white/[.06]" />
        <div className="h-8 w-28 rounded-lg bg-white/[.06]" />
      </div>
    </li>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const listings = useQuery(api.listings.listListings, {});
  const seedDemo = useMutation(api.listings.seedDemoListings);
  const myListing = useQuery(api.listings.getMyListing, {});

  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<string[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [genre, setGenre] = useState("All genres");
  const [liked, setLiked] = useState<string[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    void seedDemo({});
  }, [seedDemo]);

  // Brief skeleton pass whenever the search or genre changes — the list visibly reacts.
  useEffect(() => {
    setResultsLoading(true);
    const timer = window.setTimeout(() => setResultsLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, [query, genre]);

  const filtered = useMemo(() => {
    if (!listings) return [];
    const text = query.trim().toLowerCase();
    return listings.filter((listing) => {
      const services = Array.isArray(listing.services) ? listing.services : [];
      const genres = Array.isArray(listing.genres) ? listing.genres : [];
      const haystack = `${listing.name} ${listing.location ?? ""} ${services.join(" ")} ${genres.join(" ")} ${listing.headline ?? ""}`
        .toLowerCase();
      if (text && !haystack.includes(text)) return false;
      return genre === "All genres" || genres.includes(genre);
    });
  }, [listings, query, genre]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sendIntro = (name: string) => {
    setSending(name);
    // Simulated round-trip until intros are backed by Convex.
    window.setTimeout(() => {
      setSending(null);
      setRequested((current) => [...current, name]);
      toast.success(`Intro sent to ${name}.`);
    }, 900);
  };

  const totalFollowers = (listings ?? []).reduce(
    (sum, l) => sum + (typeof l.followers === "number" ? l.followers : 0),
    0,
  );

  const isLoading = listings === undefined;

  return (
    <main className="min-h-screen bg-[#07070e] pb-28 text-[#ecebf3]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-16rem] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#6d4dff]/15 blur-[140px]" />

      <header className="relative border-b border-white/[.07] bg-[#07070e]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <button type="button" onClick={() => navigate("/")} className="group flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#8b6cff] text-white shadow-[0_0_20px_rgba(139,108,255,.35)] transition group-hover:shadow-[0_0_30px_rgba(139,108,255,.5)]">
              <Headphones className="size-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              sonar<span className="text-[#b59aff]">/match</span>
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
          {myListing ? (
            <button
              type="button"
              onClick={() => navigate(`/promoter/${myListing.handle}`)}
              className="flex items-center gap-4 rounded-2xl border border-[#8b6cff]/30 bg-[#8b6cff]/[.08] px-5 py-4 text-left backdrop-blur-xl transition hover:border-[#8b6cff]/60"
            >
              <div>
                <p className="text-xs text-white/55">Your listing is live</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  sonar/match/promoter/{myListing.handle}
                </p>
              </div>
              <ArrowUpRight className="size-4 text-[#c9b8ff]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/create-listing")}
              className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[.07] px-5 py-4 text-left backdrop-blur-xl transition hover:border-[#8b6cff]/50"
            >
              <div>
                <p className="text-xs text-white/55">Promote other artists?</p>
                <p className="mt-1 text-sm font-semibold text-white">Create your listing →</p>
              </div>
            </button>
          )}
        </div>

        <section className="mb-8 rounded-2xl border border-white/12 bg-white/[.07] p-5 backdrop-blur-xl">
          <div className="grid gap-6 sm:grid-cols-[1.6fr_1fr_1fr] sm:gap-8">
            <div>
              <div className="flex items-start justify-between">
                <p className="text-xs text-white/55">New matches</p>
                <TrendingUp className="size-4 text-[#a6e3a1]" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">
                {isLoading ? "—" : `+${Math.max(3, Math.round((listings?.length ?? 0) / 2))}`}{" "}
                <span className="text-xs font-normal text-[#a6e3a1]">this week</span>
              </p>
              <div className="mt-4 flex h-16 items-end gap-1.5">
                {bars.map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.025, duration: 0.45 }}
                    className={`flex-1 rounded-t-sm ${index > 15 ? "bg-[#8b6cff]" : "bg-[#8b6cff]/30"}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-t border-white/[.08] pt-4 sm:block sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <p className="text-xs text-white/55">Promoters</p>
              <p className="mt-0 text-2xl font-semibold text-white sm:mt-3">
                {isLoading ? "—" : (listings?.length ?? 0)}
              </p>
              <p className="mt-0 text-xs text-white/45 sm:mt-1">live listings right now</p>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-t border-white/[.08] pt-4 sm:block sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <p className="text-xs text-white/55">Combined reach</p>
              <p className="mt-0 text-2xl font-semibold text-white sm:mt-3">
                {isLoading ? "—" : `${formatFollowers(totalFollowers)}`}
              </p>
              <p className="mt-0 text-xs text-white/45 sm:mt-1">followers across every listing</p>
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
              className="h-11 border-white/[.09] bg-white/[.04] pl-10 text-white placeholder:text-white/30 backdrop-blur focus-visible:ring-[var(--action)]"
              autoComplete="off"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setFilterOpen((value) => !value)}
            aria-expanded={filterOpen}
            className="h-11 gap-2 border-white/[.09] bg-white/[.04] text-white/60 backdrop-blur hover:bg-white/10 hover:text-white"
          >
            <SlidersHorizontal className="size-4" /> Filters {genre !== "All genres" && <span className="size-1.5 rounded-full bg-[#8b6cff]" />}
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
                {GENRES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGenre(item)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      genre === item
                        ? "bg-[#8b6cff] text-white"
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
          <p className="text-xs text-white/55">
            {isLoading
              ? "Loading listings…"
              : filtered.length === 0
                ? "No promoters yet"
                : filtered.length === (listings?.length ?? 0)
                  ? "All promoters"
                  : `${filtered.length} promoters`}
          </p>
          <p className="hidden text-xs text-white/40 sm:block">Best match first <ChevronDown className="ml-1 inline size-3" /></p>
        </div>

        <ul className="grid gap-4 lg:grid-cols-2">
          {isLoading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}
          {!isLoading &&
            filtered.map((listing, index) => (
              <motion.li
                layout
                key={listing._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="group rounded-2xl border border-white/[.09] bg-white/[.04] p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#8b6cff]/40 hover:bg-white/[.06]"
              >
                <article>
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#8b6cff]/15 font-bold text-[#c9b8ff]">
                      {initialsOf(listing.name || "?")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-white">{listing.name}</h2>
                        <Badge variant="secondary" className={fitTone(fitFor(listing))}>
                          {fitFor(listing)}% fit
                        </Badge>
                        <button
                          type="button"
                          aria-label="Like promoter"
                          onClick={() => setLiked((current) => (current.includes(listing.name) ? current.filter((n) => n !== listing.name) : [...current, listing.name]))}
                          className="ml-auto"
                        >
                          <motion.span
                            key={liked.includes(listing.name) ? "on" : "off"}
                            initial={{ scale: 1 }}
                            animate={{ scale: liked.includes(listing.name) ? [1, 1.5, 1] : 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            <Heart
                              className={`size-4 transition ${
                                liked.includes(listing.name)
                                  ? "fill-[#f5c2e7] text-[#f5c2e7]"
                                  : "text-white/30 hover:text-[#f5c2e7]"
                              }`}
                            />
                          </motion.span>
                        </button>
                      </div>
                      <p className="mt-1 text-[10px] text-white/35">{listing.location}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/55">{listing.headline}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#8b6cff]/30 bg-[#8b6cff]/12 px-2.5 py-1 text-xs font-medium text-[#c9b8ff]">
                      <BadgeCheck className="size-3.5" /> {listing.services[0] ?? "Promoter"}
                    </span>
                    {listing.services.slice(1, 3).map((service) => (
                      <span key={service} className="rounded-md bg-white/[.07] px-2.5 py-1 text-[10px] text-white/50">
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/45">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5" /> {formatFollowers(listing.followers)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="size-3.5 fill-[#f9e2af] text-[#f9e2af]" />
                      {formatRating(listing.ratingSum, listing.vouchCount)}
                      <span className="text-white/25">({listing.vouchCount})</span>
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-white/[.08] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-xl font-semibold text-white">${listing.pricePerUnit}</p>
                      <p className="text-xs text-white/45">/ {listing.unit} · min {listing.minQuantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/promoter/${listing.handle}`)}
                        className="text-white/55 hover:bg-white/10 hover:text-white"
                      >
                        View profile
                      </Button>
                      <Button
                        size="sm"
                        variant={requested.includes(listing.name) ? "secondary" : "default"}
                        disabled={requested.includes(listing.name)}
                        onClick={() => sendIntro(listing.name)}
                      >
                        {requested.includes(listing.name) ? (
                          <>
                            <Check className="size-3.5 text-[#a6e3a1]" /> Requested
                          </>
                        ) : sending === listing.name ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" /> Sending…
                          </>
                        ) : (
                          <>
                            Send intro <ArrowUpRight className="size-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
        </ul>

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[.15] bg-white/[.04] p-16 text-center backdrop-blur">
            <Sparkles className="mx-auto size-6 text-white/30" />
            <p className="mt-4 text-sm font-medium text-white/70">
              {query || genre !== "All genres"
                ? "Nothing matches that. Try a genre or clear the filters."
                : "New promoters are joining all the time — check back soon."}
            </p>
            {(query || genre !== "All genres") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGenre("All genres");
                }}
                className="mt-4 rounded-full border border-white/15 bg-white/[.06] px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
      <FloatingDock items={createArtistDockItems({ onSignOut: handleSignOut, onCreateListing: () => navigate("/create-listing") })} />
    </main>
  );
}

// A deterministic placeholder "fit" derived from the listing itself until real
// matching logic exists. Same listing always gets the same number.
function fitFor(listing: { followers: number; name: string }): number {
  let hash = 0;
  for (const char of listing.name) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return Math.min(98, 72 + ((hash + (listing.followers % 50)) % 27));
}
