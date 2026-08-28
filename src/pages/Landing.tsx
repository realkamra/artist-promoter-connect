import { motion } from "framer-motion";
import { ArrowRight, Check, Headphones, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router";

const notes = ["Find your sound's people", "Review real campaign fit", "Send one clear brief"];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <button className="flex items-center gap-3" onClick={() => navigate("/")}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/10">
            <Headphones className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">sonar<span className="text-primary">.match</span></span>
        </button>
        <button onClick={() => navigate("/auth")} className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">Sign in <ArrowRight className="ml-1 inline size-4" /></button>
      </nav>

      <section className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-36 lg:pt-24">
        <div className="pointer-events-none absolute -left-24 top-0 size-96 rounded-full bg-primary/10 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="relative">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground"><Sparkles className="size-3.5 text-yellow" /> The smarter way to release</div>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.04em] sm:text-7xl">Your music deserves the <span className="text-primary">right ears.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">sonar.match connects independent artists with promoters who already understand their sound, audience, and next move.</p>
          <button onClick={() => navigate("/auth")} className="mt-9 inline-flex items-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90">Find my promoters <ArrowRight className="size-4" /></button>
          <p className="mt-4 text-xs text-muted-foreground">Built for artists. No gatekeeping. No noisy marketplaces.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .15 }} className="relative">
          <div className="absolute -right-8 -top-8 size-24 rounded-full border border-blue/20 bg-blue/5" />
          <div className="relative rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-5"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Your match board</p><p className="mt-1 text-xl font-bold">Promoters for your sound</p></div><span className="rounded-lg bg-green/10 px-2.5 py-1 text-xs font-bold text-green">3 great fits</span></div>
            <div className="space-y-3 pt-5">
              {[{ name: "Maya Chen", type: "Electronic · Berlin", color: "bg-pink/15 text-pink", initials: "MC", score: "96%" }, { name: "Late Night Radio", type: "Indie · Global", color: "bg-blue/15 text-blue", initials: "LN", score: "91%" }, { name: "Juno Collective", type: "Alt pop · Toronto", color: "bg-yellow/15 text-yellow", initials: "JC", score: "88%" }].map((person, i) => <div key={person.name} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 p-3.5"><div className={`flex size-11 items-center justify-center rounded-xl text-xs font-bold ${person.color}`}>{person.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{person.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{person.type}</p></div><div className="text-right"><p className="text-sm font-bold text-green">{person.score}</p><p className="text-[10px] text-muted-foreground">fit score</p></div>{i === 0 && <span className="absolute" />}</div>)}
            </div>
            <div className="mt-5 rounded-2xl bg-muted/60 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Check className="size-4 text-green" /> Matched from your genre, goals, and audience</div></div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-border bg-card/40"><div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3 lg:px-8">{notes.map((note, i) => <div key={note} className="flex items-center gap-4"><span className="font-mono text-sm text-primary">0{i + 1}</span><p className="font-semibold">{note}</p></div>)}</div></section>
      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center lg:px-8"><div><p className="text-2xl font-bold tracking-tight">Ready to find your next amplifier?</p><p className="mt-2 text-muted-foreground">Start with a free artist profile and get matched in minutes.</p></div><button onClick={() => navigate("/auth")} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold transition hover:border-primary/50 hover:bg-muted">Get started <Users className="size-4 text-primary" /></button></section>
    </main>
  );
}
