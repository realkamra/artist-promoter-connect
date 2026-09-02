import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Play, Radio, Sparkles, Waves } from "lucide-react";
import { useNavigate } from "react-router";

const featured = [
  { name: "Maya Chen", specialty: "Electronic / club", score: "96", color: "#ff9d5c" },
  { name: "Late Night Radio", specialty: "Indie / alt pop", score: "91", color: "#c4b5fd" },
  { name: "Juno Collective", specialty: "R&B / discovery", score: "88", color: "#89dceb" },
];

const bars = [32, 46, 38, 62, 52, 76, 64, 89, 73, 94, 82, 100, 78, 91, 67, 83, 59, 71, 52, 64];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#08080a] text-[#e7e5e4]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:64px_64px]" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <button type="button" onClick={() => navigate("/")} className="group flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg border border-[#ff9d5c]/40 bg-[#ff9d5c]/10 text-[#ff9d5c] transition group-hover:bg-[#ff9d5c] group-hover:text-[#08080a]"><Waves className="size-4" /></span><span className="font-mono text-sm font-bold tracking-tight text-white">SONAR<span className="text-[#ff9d5c]">/MATCH</span></span></button>
        <button type="button" onClick={() => navigate("/auth")} className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-white/50 transition hover:text-white">Enter workspace <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></button>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-28 pt-20 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:pb-40 lg:pt-28">
        <div className="pointer-events-none absolute -left-48 top-20 size-[36rem] rounded-full bg-[#ff6b2c]/10 blur-[130px]" />
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative">
          <p className="mb-7 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.28em] text-[#ff9d5c]"><span className="size-1.5 rounded-full bg-[#a6e3a1] shadow-[0_0_12px_#a6e3a1]" /> Independent artist intelligence</p>
          <h1 className="max-w-2xl text-5xl font-medium leading-[.96] tracking-[-.07em] text-white sm:text-7xl lg:text-[5.7rem]">Find the people who move <span className="text-[#ff9d5c]">sound.</span></h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-white/50 sm:text-lg">Sonar/match turns your sound into a living network of promoters, tastemakers, and cultural signals worth knowing.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4"><button type="button" onClick={() => navigate("/auth")} className="group flex items-center gap-3 rounded-lg bg-[#ff9d5c] px-5 py-3.5 text-sm font-bold text-[#08080a] transition hover:bg-[#ffc091]">Build my matches <ArrowUpRight className="size-4" /></button><button type="button" onClick={() => document.getElementById("signal")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-2 rounded-lg border border-white/[.14] px-5 py-3.5 text-sm font-semibold text-white/60 transition hover:border-white/30 hover:text-white"><Play className="size-3.5 fill-current" /> See the signal</button></div>
          <div className="mt-12 flex items-center gap-8 border-t border-white/[.1] pt-5"><div><p className="font-mono text-xl text-white">1,284</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/30">promoters indexed</p></div><div className="h-8 w-px bg-white/10" /><div><p className="font-mono text-xl text-white">89.6%</p><p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/30">average fit</p></div></div>
        </motion.div>

        <motion.div id="signal" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .15 }} className="relative">
          <div className="absolute -inset-5 rounded-[2rem] border border-[#ff9d5c]/10" /><div className="relative overflow-hidden rounded-2xl border border-white/[.12] bg-white/[.035] p-5 backdrop-blur-xl sm:p-7">
            <div className="absolute -right-32 -top-32 size-72 rounded-full bg-[#ff6b2c]/10 blur-[80px]" />
            <div className="relative flex items-start justify-between border-b border-white/[.1] pb-5"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-white/35">Signal scan / 001</p><p className="mt-2 text-lg font-medium text-white">Your strongest connections</p></div><Radio className="size-5 text-[#ff9d5c]" /></div>
            <div className="relative my-6 flex h-28 items-end gap-1 border-b border-white/[.1] pb-3">{bars.map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * .035, duration: .5 }} className={`flex-1 rounded-t-sm ${index > 11 ? "bg-[#ff9d5c]" : "bg-[#ff9d5c]/25"}`} />)}<div className="absolute left-0 top-2 font-mono text-[9px] uppercase tracking-wider text-white/25">compatibility field</div></div>
            <div className="space-y-3">{featured.map((person, index) => <motion.div key={person.name} whileHover={{ x: 5 }} className="flex items-center gap-4 rounded-xl border border-white/[.1] bg-[#0d0d10]/70 p-4"><span className="flex size-10 items-center justify-center rounded-lg font-mono text-xs font-bold text-[#08080a]" style={{ backgroundColor: person.color }}>{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{person.name}</p><p className="mt-1 text-xs text-white/35">{person.specialty}</p></div><div className="text-right"><p className="font-mono text-lg" style={{ color: person.color }}>{person.score}<span className="text-xs">%</span></p><p className="font-mono text-[9px] uppercase tracking-wider text-white/25">fit</p></div></motion.div>)}</div>
            <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#a6e3a1]/10 px-4 py-3 text-xs font-medium text-[#a6e3a1]"><Sparkles className="size-3.5" /> Updated from your artist profile</div>
          </div>
        </motion.div>
      </section>

      <section className="relative border-y border-white/[.1] bg-white/[.025]"><div className="mx-auto grid max-w-7xl gap-0 px-6 lg:grid-cols-3 lg:px-10">{[["01 / Tune your signal","Tell us what you make and where you want it heard."],["02 / Read the fit","See why a promoter fits before you spend your time."],["03 / Make the intro","Send a clear request. Keep the conversation human."]].map(([label, description]) => <div key={label} className="border-b border-white/[.1] py-9 lg:border-b-0 lg:border-r lg:px-8 lg:last:border-r-0"><p className="font-mono text-xs text-[#ff9d5c]">{label}</p><p className="mt-3 max-w-xs text-sm leading-6 text-white/45">{description}</p></div>)}</div></section>
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="relative overflow-hidden rounded-2xl border border-white/[.12] bg-white/[.035] px-7 py-14 text-center sm:px-12"><div className="absolute inset-x-1/3 top-0 h-px bg-[#ff9d5c] shadow-[0_0_35px_#ff9d5c]" /><div className="absolute left-1/2 top-0 size-48 -translate-x-1/2 rounded-full bg-[#ff6b2c]/10 blur-[70px]" /><div className="relative"><p className="font-mono text-[10px] uppercase tracking-[.24em] text-white/35">Your next signal is closer</p><h2 className="mx-auto mt-4 max-w-xl text-3xl font-medium tracking-[-.04em] text-white sm:text-5xl">Put your release in the right room.</h2><button type="button" onClick={() => navigate("/auth")} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#ff9d5c] px-5 py-3 text-sm font-bold text-[#08080a] transition hover:bg-[#ffc091]">Enter sonar/match <ArrowUpRight className="size-4" /></button></div></div></section>
      <footer className="border-t border-white/[.1] px-6 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row"><p className="font-mono text-xs text-white/35">SONAR<span className="text-[#ff9d5c]">/MATCH</span> · artist intelligence</p><p className="font-mono text-[10px] uppercase tracking-wider text-white/25">Make better introductions.</p></div></footer>
    </main>
  );
}