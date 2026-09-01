import { motion } from "framer-motion";
import { ArrowUpRight, Play, Radio, Sparkles, Waves } from "lucide-react";
import { useNavigate } from "react-router";

const featured = [
  {
    name: "Maya Chen",
    specialty: "Electronic / club",
    score: "96",
    color: "bg-[#f5c2e7]",
  },
  {
    name: "Late Night Radio",
    specialty: "Indie / alt pop",
    score: "91",
    color: "bg-[#89b4fa]",
  },
  {
    name: "Juno Collective",
    specialty: "R&B / discovery",
    score: "88",
    color: "bg-[#f9e2af]",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#11111b] text-[#cdd6f4]">
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(203,166,247,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(203,166,247,.06)_1px,transparent_1px)] [background-size:72px_72px]" />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <button
          className="group flex items-center gap-3"
          onClick={() => navigate("/")}
        >
          <span className="flex size-9 items-center justify-center rounded-lg border border-[#cba6f7]/40 bg-[#cba6f7]/10 text-[#cba6f7] transition group-hover:bg-[#cba6f7] group-hover:text-[#1e1e2e]">
            <Waves className="size-4" />
          </span>

          <span className="font-mono text-sm font-bold tracking-tight text-[#f5e0dc]">
            SONAR<span className="text-[#cba6f7]">/MATCH</span>
          </span>
        </button>

        <button
          onClick={() => navigate("/auth")}
          className="group flex items-center gap-1 text-sm font-semibold text-[#a6adc8] transition hover:text-[#f5e0dc]"
        >
          Enter workspace
          <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[.95fr_1.05fr] lg:px-10 lg:pb-36 lg:pt-28">
        <div className="absolute -left-40 top-10 size-[34rem] rounded-full bg-[#cba6f7]/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <p className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.24em] text-[#89dceb]">
            <span className="size-1.5 rounded-full bg-[#a6e3a1] shadow-[0_0_12px_#a6e3a1]" />
            Live matching for independent artists
          </p>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-[#f5e0dc] sm:text-7xl">
            Put your next release{" "}
            <span className="text-[#cba6f7]">in motion.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-7 text-[#a6adc8] sm:text-lg">
            A focused network for artists looking past vanity metrics. Find
            promoters who understand your sound and can move it forward.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="group flex items-center gap-3 rounded-lg bg-[#cba6f7] px-5 py-3.5 text-sm font-bold text-[#1e1e2e] transition hover:bg-[#f5c2e7]"
            >
              Build my matches
              <ArrowUpRight className="size-4" />
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 rounded-lg border border-[#313244] px-5 py-3.5 text-sm font-semibold text-[#a6adc8] transition hover:border-[#89dceb]/50 hover:text-[#f5e0dc]"
            >
              <Play className="size-3.5 fill-current" />
              See how it works
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-5 rounded-[2rem] border border-[#cba6f7]/10" />

          <div className="relative rounded-2xl border border-[#313244] bg-[#1e1e2e]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-[#313244] pb-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#6c7086]">
                  Signal scan / 001
                </p>
                <p className="mt-2 text-lg font-semibold text-[#f5e0dc]">
                  Your strongest connections
                </p>
              </div>

              <Radio className="size-5 text-[#89dceb]" />
            </div>

            <div className="space-y-3 py-5">
              {featured.map((person, index) => (
                <motion.div
                  key={person.name}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center gap-4 rounded-xl border border-[#313244] bg-[#181825]/70 p-4"
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-lg font-mono text-xs font-bold text-[#1e1e2e] ${person.color}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#f5e0dc]">
                      {person.name}
                    </p>
                    <p className="mt-1 text-xs text-[#6c7086]">
                      {person.specialty}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg text-[#a6e3a1]">
                      {person.score}
                      <span className="text-xs">%</span>
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[#6c7086]">
                      compatibility
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#89dceb]/10 px-4 py-3 text-xs font-medium text-[#89dceb]">
              <Sparkles className="size-3.5" />
              Updated from your artist profile
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="how-it-works"
        className="relative border-y border-[#313244] bg-[#181825]/70"
      >
        <div className="mx-auto grid max-w-7xl gap-0 px-6 lg:grid-cols-3 lg:px-10">
          {[
            [
              "01 / Tune your signal",
              "Tell us what you make and where you want it heard.",
            ],
            [
              "02 / Review the fit",
              "See why a promoter fits before you spend your time.",
            ],
            [
              "03 / Send the intro",
              "Send a clear request. Keep the conversation human.",
            ],
          ].map(([label, description]) => (
            <div
              key={label}
              className="border-b border-[#313244] py-8 lg:border-b-0 lg:border-r lg:px-8 lg:last:border-r-0"
            >
              <p className="font-mono text-xs text-[#cba6f7]">{label}</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#a6adc8]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-20 sm:flex-row sm:items-center lg:px-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#6c7086]">
            No noise. Just signal.
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#f5e0dc]">
            Your music, better placed.
          </h2>
        </div>

        <button
          onClick={() => navigate("/auth")}
          className="group flex items-center gap-3 self-start rounded-lg border border-[#cba6f7]/50 px-5 py-3 text-sm font-semibold text-[#cba6f7] transition hover:bg-[#cba6f7] hover:text-[#1e1e2e]"
        >
          Enter sonar/match
          <ArrowUpRight className="size-4" />
        </button>
      </section>
    </main>
  );
}