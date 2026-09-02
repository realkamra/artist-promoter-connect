import { ArrowLeft, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080a] px-6 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c3aed]/15 blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#ff9d5c]/40 bg-[#ff9d5c]/10 text-[#ff9d5c]"><Radio className="size-6" /></div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[.3em] text-[#ff9d5c]">Signal lost / 404</p>
        <h1 className="mt-4 text-6xl font-medium tracking-[-.08em] text-white">Off the grid.</h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-white/45">This frequency doesn&apos;t exist. Return to the matching desk and keep moving.</p>
        <button type="button" onClick={() => navigate("/")} className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#ff9d5c] px-5 py-3 text-sm font-bold text-[#08080a] transition hover:bg-[#ffc091]"><ArrowLeft className="size-4" />Back to sonar/match</button>
      </motion.div>
    </main>
  );
}
