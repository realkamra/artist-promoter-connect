import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Headphones,
  LogOut,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Users,
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

  const genres = ["All genres", "Electronic", "Indie", "Alt pop", "R&B", "Ambient"];

  const filtered = useMemo(
    () => promoters.filter((promoter) => {
      const matchesQuery = `${promoter.name} ${promoter.location} ${promoter.genres.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (genre === "All genres" || promoter.genres.includes(genre));
    }),
    [genre, query],
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#09090c] pb-28 text-[#e7e5e4]">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:64px_64px]" />
      <header className="relative border-b border-white/[.08] bg-[#09090c]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <button type="button" onClick={() => navigate("/")} className="group flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-[#ff8a3d]/40 bg-[#ff8a3d]/10 text-[#ff9d5c] transition group-hover:bg-[#ff8a3d] group-hover:text-[#09090c]"><Headphones className="size-4" /></span>
            <span className="font-mono text-sm font-bold tracking-tight text-white">SONAR<span className="text-[#ff9d5c]">/MATCH</span></span>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold text-white">{user?.name || "Artist"}</p><p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Active profile</p></div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out" className="text-white/50 hover:bg-white/10 hover:text-white"><LogOut className="size-4" /></Button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.24em] text-[#ff9d5c]"><span className="size-1.5 rounded-full bg-[#a6e3a1] shadow-[0_0_12px_#a6e3a1]" /> Signal scan / live</p>
            <h1 className="max-w-2xl text-4xl font-medium tracking-[-.055em] text-white sm:text-6xl">Find your <span className="text-[#ff9d5c]">amplifier.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/50">A living shortlist of promoters aligned with your sound, audience, and ambition.</p>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-white/[.1] bg-white/[.035] px-5 py-4"><div><p className="font-mono text-[10px] uppercase tracking-wider text-white/35">Profile signal</p><p className="mt-1 text-sm font-semibold text-white">Strong match potential</p></div><div className="relative size-12"><svg viewBox="0 0 36 36" className="size-full -rotate-90"><circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity=".1" strokeWidth="3" /><circle cx="18" cy="18" r="15" fill="none" stroke="#ff9d5c" strokeWidth="3" strokeDasharray="75 100" strokeLinecap="round" /></svg><span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#ffb17b]">80%</span></div></div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-[1.4fr_.8fr_.8fr]">
          <div className="relative overflow-hidden rounded-xl border border-white/[.1] bg-white/[.035] p-5"><div className="flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/35">Match velocity</p><p className="mt-2 text-2xl font-medium text-white">+24.8% <span className="text-xs text-[#a6e3a1]">this week</span></p></div><TrendingUp className="size-4 text-[#a6e3a1]" /></div><div className="mt-6 flex h-20 items-end gap-1.5">{bars.map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * .025, duration: .45 }} className={`flex-1 rounded-t-sm ${index > 15 ? "bg-[#ff8a3d]" : "bg-[#ff8a3d]/30"}`} />)}</div><div className="mt-2 flex justify-between font-mono text-[9px] text-white/25"><span>MON</span><span>NOW</span></div></div>
          <div className="rounded-xl border border-white/[.1] bg-white/[.035] p-5"><Users className="size-4 text-[#c4b5fd]" /><p className="mt-5 font-mono text-[10px] uppercase tracking-[.18em] text-white/35">Active network</p><p className="mt-2 text-2xl font-medium text-white">1,284</p><p className="mt-1 text-xs text-white/40">promoters indexed</p></div>
          <div className="rounded-xl border border-white/[.1] bg-white/[.035] p-5"><Target className="size-4 text-[#89dceb]" /><p className="mt-5 font-mono text-[10px] uppercase tracking-[.18em] text-white/35">Average fit</p><p className="mt-2 text-2xl font-medium text-white">89.6%</p><p className="mt-1 text-xs text-white/40">across your shortlist</p></div>
        </section>

        <div id="matches" className="mb-8 flex flex-col gap-3 sm:flex-row" role="search"><div className="relative flex-1"><Search className="absolute left-3.5 top-3 size-4 text-white/30" /><label htmlFor="promoter-search" className="sr-only">Search promoters</label><Input id="promoter-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search promoters, genres, cities..." className="h-11 border-white/[.1] bg-white/[.035] pl-10 text-white placeholder:text-white/30 focus-visible:ring-[#ff8a3d]" autoComplete="off" /></div><Button variant="outline" onClick={() => setFilterOpen((value) => !value)} aria-expanded={filterOpen} className="h-11 gap-2 border-white/[.1] bg-white/[.035] text-white/60 hover:bg-white/10 hover:text-white"><SlidersHorizontal className="size-4" /> Filters {genre !== "All genres" && <span className="size-1.5 rounded-full bg-[#ff9d5c]" />}</Button></div>

        <AnimatePresence>{filterOpen && <motion.div initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} className="mb-7 overflow-hidden"><div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[.1] bg-white/[.035] p-4"><span className="mr-2 font-mono text-[10px] uppercase tracking-wider text-white/35">Genre</span>{genres.map((item) => <button key={item} type="button" onClick={() => setGenre(item)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${genre === item ? "bg-[#ff9d5c] text-[#09090c]" : "bg-white/[.07] text-white/50 hover:text-white"}`}>{item}</button>)}{genre !== "All genres" && <button type="button" onClick={() => setGenre("All genres")} aria-label="Clear genre filter" className="ml-auto text-white/40 hover:text-white"><X className="size-4" /></button>}</div></motion.div>}</AnimatePresence>

        <div className="mb-4 flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/35">{filtered.length} matches found</p><p className="hidden text-xs text-white/30 sm:block">Sorted by compatibility <ChevronDown className="ml-1 inline size-3" /></p></div>
        <ul className="grid gap-4 lg:grid-cols-2">{filtered.map((promoter, index) => <motion.li layout key={promoter.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} className="group rounded-xl border border-white/[.1] bg-white/[.035] p-5 transition hover:-translate-y-0.5 hover:border-[#ff9d5c]/50 hover:bg-white/[.055]"><article><div className="flex items-start gap-4"><div className={`flex size-12 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ${promoter.tone === "pink" ? "bg-[#f5c2e7]/15 text-[#f5c2e7]" : promoter.tone === "blue" ? "bg-[#89dceb]/15 text-[#89dceb]" : promoter.tone === "yellow" ? "bg-[#f9e2af]/15 text-[#f9e2af]" : "bg-[#a6e3a1]/15 text-[#a6e3a1]"}`}>{promoter.name.split(" ").map((part) => part[0]).join("")}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-white">{promoter.name}</h2><Badge variant="secondary" className="bg-[#a6e3a1]/10 font-mono text-[10px] text-[#a6e3a1]">{promoter.fit}% fit</Badge></div><p className="mt-1 font-mono text-[10px] text-white/35">{promoter.handle} · {promoter.location}</p></div></div><p className="mt-5 text-sm leading-6 text-white/50">{promoter.bio}</p><div className="mt-4 flex flex-wrap gap-2">{promoter.genres.map((item) => <span key={item} className="rounded-md bg-white/[.07] px-2.5 py-1 font-mono text-[10px] text-white/50">{item}</span>)}<span className="rounded-md bg-white/[.07] px-2.5 py-1 font-mono text-[10px] text-white/50">{promoter.reach}</span></div><div className="mt-5 flex items-center justify-between border-t border-white/[.08] pt-4"><span className="text-[11px] text-white/35">{requested.includes(promoter.name) ? "Intro request sent" : promoter.response}</span><Button size="sm" variant={requested.includes(promoter.name) ? "secondary" : "default"} disabled={requested.includes(promoter.name)} onClick={() => setRequested((current) => [...current, promoter.name])}>{requested.includes(promoter.name) ? <><Check className="size-3.5" /> Requested</> : <>Request intro <ArrowUpRight className="size-3.5" /></>}</Button></div></article></motion.li>)}</ul>
        {filtered.length === 0 && <div className="rounded-xl border border-dashed border-white/[.15] bg-white/[.035] p-16 text-center"><Sparkles className="mx-auto size-6 text-white/30" /><p className="mt-4 text-sm text-white/50">No matching signals found.</p><button type="button" onClick={() => { setQuery(""); setGenre("All genres"); }} className="mt-3 text-xs font-semibold text-[#ff9d5c] hover:underline">Reset search</button></div>}
      </div>
      <FloatingDock items={createArtistDockItems({ onSignOut: handleSignOut })} />
    </main>
  );
}