import { ArrowLeft, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070e] px-6 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6d4dff]/20 blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white shadow-[0_0_30px_rgba(139,92,246,.5)]">
          <Radio className="size-6" />
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[.3em] text-[#a58bff]">Signal lost / 404</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-[-.08em] text-white">Off the grid.</h1>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-white/45">This frequency doesn&apos;t exist. Return to the matching desk and keep moving.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a58bff] to-[#6d4dff] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,.4)] transition hover:shadow-[0_0_45px_rgba(139,92,246,.6)]"
        >
          <ArrowLeft className="size-4" />
          Back to sonar/match
        </button>
      </motion.div>
    </main>
  );
}
