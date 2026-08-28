import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Check, Headphones, LogOut, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

const promoters = [
  { name: "Maya Chen", handle: "@mayamixes", location: "Berlin, DE", genres: ["Electronic", "House"], reach: "180k monthly", bio: "Playlist curator and campaign strategist for forward-thinking electronic artists.", fit: 96, tone: "pink" },
  { name: "Late Night Radio", handle: "@latenightradio", location: "Worldwide", genres: ["Indie", "Alt pop"], reach: "92k monthly", bio: "Independent radio and discovery channel finding the next late-night obsession.", fit: 91, tone: "blue" },
  { name: "Juno Collective", handle: "@junocollective", location: "Toronto, CA", genres: ["Alt pop", "R&B"], reach: "64k monthly", bio: "A small, trusted network of tastemakers, writers, and playlist editors.", fit: 88, tone: "yellow" },
  { name: "Soft Signal", handle: "@softsignal.fm", location: "London, UK", genres: ["Ambient", "Electronic"], reach: "41k monthly", bio: "Curated releases and intimate listening sessions for boundary-pushing sounds.", fit: 84, tone: "green" },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<string[]>([]);
  const filtered = useMemo(() => promoters.filter((p) => `${p.name} ${p.location} ${p.genres.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const handleSignOut = async () => { await signOut(); navigate("/"); };
  return <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-sidebar/70"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8"><button onClick={() => navigate("/")} className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Headphones className="size-4" /></span><span className="font-bold tracking-tight">sonar<span className="text-primary">.match</span></span></button><div className="flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user?.name || "Artist"}</p><p className="text-xs text-muted-foreground">Artist profile</p></div><Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out"><LogOut className="size-4" /></Button></div></div></header>
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8"><div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" /> Your discovery desk</div><h1 className="text-4xl font-bold tracking-[-.03em] sm:text-5xl">Find your <span className="text-primary">amplifier.</span></h1><p className="mt-3 max-w-xl text-muted-foreground">Promoters selected for your sound, your audience, and where you want to go next.</p></div><div className="rounded-2xl border border-border bg-card px-5 py-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile strength</p><div className="mt-2 flex items-center gap-3"><div className="h-2 w-28 overflow-hidden rounded-full bg-muted"><div className="h-full w-4/5 rounded-full bg-green" /></div><span className="text-sm font-bold">80%</span></div></div></div>
      <div className="mb-7 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by genre, location, or promoter" className="h-11 border-border bg-card pl-10" /></div><Button variant="outline" className="h-11 gap-2"><SlidersHorizontal className="size-4" /> Filters</Button></div>
      <div className="grid gap-4 lg:grid-cols-2">{filtered.map((promoter) => <article key={promoter.name} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-black/10"><div className="flex items-start gap-4"><div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-${promoter.tone}/15 text-lg font-bold text-${promoter.tone}`}>{promoter.name.split(" ").map((n) => n[0]).join("")}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{promoter.name}</h2><Badge variant="secondary" className="bg-green/10 text-green">{promoter.fit}% match</Badge></div><p className="mt-1 text-sm text-muted-foreground">{promoter.handle} · {promoter.location}</p></div></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{promoter.bio}</p><div className="mt-4 flex flex-wrap gap-2">{promoter.genres.map((genre) => <span key={genre} className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{genre}</span>)}<span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{promoter.reach}</span></div><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">{requested.includes(promoter.name) ? "Request sent — we'll let you know" : "Open to new artist campaigns"}</span><Button size="sm" variant={requested.includes(promoter.name) ? "secondary" : "default"} disabled={requested.includes(promoter.name)} onClick={() => setRequested((current) => [...current, promoter.name])}>{requested.includes(promoter.name) ? <><Check className="mr-2 size-4" /> Requested</> : <>Request intro <ArrowRight className="ml-2 size-4" /></>}</Button></div></article>)}</div>{filtered.length === 0 && <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No promoters match that search yet.</div>}
    </div>
  </main>;
}
