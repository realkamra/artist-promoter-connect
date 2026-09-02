import { motion, useInView } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Film,
  Gauge,
  Headphones,
  Heart,
  Play,
  Radio,
  Sparkles,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

const chartPoints =
  "0 132 22 120 44 126 66 108 88 114 110 92 132 98 154 74 176 82 198 60 220 66 242 42 264 48 292 24";

const faq = [
  [
    "What is sonar/match?",
    "A focused matching marketplace between artists and promoters. Post your music or a short description and we surface the people who can actually move it.",
  ],
  [
    "How does matching work?",
    "Your genre, energy, audience, and campaign intent are compared against each promoter's focus and reach, then you like or pass — Tinder-style.",
  ],
  [
    "Is this a record label?",
    "No. sonar/match is a two-sided marketplace. We never take your masters, release your music, or handle distribution.",
  ],
  [
    "How do promoters get paid?",
    "Promoters set their own price per video and minimum quantity. You agree on terms before any work starts.",
  ],
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: 0.16 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
      animate={
        visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 26, filter: "blur(8px)" }
      }
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[.1] bg-white/[.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[.2em] text-[#b8a6ff] backdrop-blur">
      {children}
    </span>
  );
}

function Wordmark() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      className="group flex items-center gap-2.5"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white shadow-[0_0_24px_rgba(139,92,246,.5)]">
        <Waves className="size-4" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-white">
        sonar<span className="text-[#a58bff]">/match</span>
      </span>
    </button>
  );
}

function Nav() {
  const navigate = useNavigate();
  return (
    <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
      <Wordmark />
      <div className="hidden items-center gap-8 md:flex">
        <a href="#why" className="text-sm text-white/50 transition hover:text-white">
          Features
        </a>
        <a href="#how" className="text-sm text-white/50 transition hover:text-white">
          How it works
        </a>
        <a href="#faq" className="text-sm text-white/50 transition hover:text-white">
          FAQ
        </a>
      </div>
      <button
        type="button"
        onClick={() => navigate("/auth")}
        className="group inline-flex items-center gap-2 rounded-full border border-white/[.12] bg-white/[.04] px-5 py-2 text-sm font-medium text-white backdrop-blur transition hover:border-[#a58bff]/60 hover:bg-white/[.08]"
      >
        Book a call
        <ArrowUpRight className="size-3.5" />
      </button>
    </nav>
  );
}

function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: 0.25 });
  const navItems = [
    ["Overline", Activity, true],
    ["Dashboard", Headphones, false],
    ["Matches", Heart, false],
    ["Requests", Play, false],
    ["Portfolio", Film, false],
    ["Profile", Users, false],
  ] as const;

  return (
    <Reveal delay={0.1} className="relative mx-auto mt-16 max-w-6xl">
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-b from-[#8b5cf6]/25 via-[#6d4dff]/5 to-transparent opacity-70 blur-2xl" />
      <div
        ref={ref}
        id="signal"
        className="relative overflow-hidden rounded-2xl border border-white/[.1] bg-[#0d0d16]/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-4"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="grid gap-3 md:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <div className="hidden flex-col rounded-xl border border-white/[.07] bg-white/[.03] p-3 md:flex">
            <div className="flex items-center gap-2 px-2 py-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-[10px] text-white">
                S
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                sonar/match
              </span>
            </div>
            <div className="mt-2 space-y-1">
              {navItems.map(([label, Icon, active]) => (
                <div
                  key={label}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs ${
                    active
                      ? "bg-white/[.08] text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-lg border border-[#8b5cf6]/25 bg-[#8b5cf6]/10 p-3">
              <p className="text-[11px] font-medium text-[#c9b8ff]">Profile signal</p>
              <p className="mt-1 font-mono text-[10px] text-white/40">Strong match potential</p>
            </div>
          </div>

          {/* Main */}
          <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-xl border border-white/[.07] bg-white/[.03] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/35">
                    Top connections
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
                    $45.5K <span className="text-xs font-normal text-white/40">value</span>
                  </p>
                </div>
                <span className="rounded-full bg-[#a6e3a1]/15 px-2.5 py-1 font-mono text-[10px] text-[#a6e3a1]">
                  +18.4%
                </span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {["from-[#f5c2e7] to-[#e3a6ff]", "from-[#89dceb] to-[#6db7ff]", "from-[#a6e3a1] to-[#8fe0a0]"].map(
                    (g, i) => (
                      <span
                        key={i}
                        className={`size-6 rounded-full border border-[#0d0d16] bg-gradient-to-br ${g}`}
                      />
                    ),
                  )}
                </div>
                <span className="font-mono text-[10px] text-white/40">3 active campaigns</span>
              </div>
              <div className="relative mt-6 h-44">
                <svg
                  viewBox="0 0 292 150"
                  preserveAspectRatio="none"
                  className="absolute inset-0 size-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="landingArea" x1="0" x2="0" y1="0" y2="1">
                      <stop stopColor="#8b6cff" stopOpacity=".35" />
                      <stop offset="1" stopColor="#8b6cff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="landingLine" x1="0" x2="1" y1="0" y2="0">
                      <stop stopColor="#6d4dff" />
                      <stop offset="1" stopColor="#b59aff" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 132 L22 120 L44 126 L66 108 L88 114 L110 92 L132 98 L154 74 L176 82 L198 60 L220 66 L242 42 L264 48 L292 24 L292 150 L0 150 Z"
                    fill="url(#landingArea)"
                    opacity={visible ? 1 : 0}
                  />
                  <motion.polyline
                    points={chartPoints}
                    fill="none"
                    stroke="url(#landingLine)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-x-0 bottom-0 border-b border-white/[.08]" />
                <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-white/[.06]" />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[9px] text-white/25">
                <span>MAR</span>
                <span>APR</span>
                <span>MAY</span>
                <span>JUN</span>
                <span>NOW</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex-1 rounded-xl border border-white/[.07] bg-white/[.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/35">
                    Track portfolio
                  </p>
                  <Heart className="size-3.5 text-[#b59aff]" />
                </div>
                <p className="mt-3 text-[13px] font-medium text-white">Your matches</p>
                <div className="mt-4 space-y-2.5">
                  {[
                    ["MC", "Maya Chen", "96%", "from-[#f5c2e7] to-[#e3a6ff]"],
                    ["LN", "Late Night Radio", "91%", "from-[#89dceb] to-[#6db7ff]"],
                    ["JC", "Juno Collective", "88%", "from-[#a6e3a1] to-[#8fe0a0]"],
                  ].map(([initials, name, score, g]) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: 14 }}
                      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
                      transition={{ delay: 0.4 + chartPoints.length * 0, duration: 0.4 }}
                      className="flex items-center gap-2.5 rounded-lg border border-white/[.07] bg-white/[.03] p-2.5"
                    >
                      <span
                        className={`flex size-7 items-center justify-center rounded-md bg-gradient-to-br ${g} text-[9px] font-bold text-[#0d0d16]`}
                      >
                        {initials}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-white">
                        {name}
                      </span>
                      <span className="font-mono text-[11px] text-[#b59aff]">{score}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-[#8b5cf6]/25 bg-[#8b5cf6]/[.08] p-4">
                <div className="flex items-center gap-2">
                  <Gauge className="size-3.5 text-[#c9b8ff]" />
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#c9b8ff]">
                    Managed assets
                  </p>
                </div>
                <p className="mt-2 text-lg font-semibold text-white">4,256.48</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#a6e3a1]">+0.22%</span>
                  <span className="font-mono text-[10px] text-white/40">this cycle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TrustStrip() {
  const logos = ["Logopsum", "VLVTRX", "Kalopsia", "Late Night", "Tonewave"];
  return (
    <Reveal className="mx-auto mt-12 max-w-5xl border-y border-white/[.07] px-2 py-8">
      <p className="text-center font-mono text-[10px] uppercase tracking-[.24em] text-white/30">
        Inspiring experiences
      </p>
      <p className="mt-2 text-center text-sm text-white/25">
        Trusted by innovators bringing sound to audiences
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
        {logos.map((logo, index) => (
          <div key={logo} className="flex items-center gap-2 opacity-40 transition hover:opacity-80">
            <span className="size-2.5 rounded-full bg-white/40" />
            <span className="text-sm font-semibold tracking-tight text-white/70">{logo}</span>
            {index === 1 && <span className="font-mono text-[9px] text-white/30">●</span>}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function BentoCard({
  icon,
  title,
  text,
  children,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/[.09] bg-white/[.03] p-6 backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(139,92,246,.16),transparent_40%)] opacity-60 transition duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl border border-white/[.1] bg-white/[.05] text-[#b59aff]">
            {icon}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">Sonar</span>
        </div>
        <h3 className="mt-6 text-xl font-medium tracking-[-.02em] text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-white/45">{text}</p>
        {children}
      </div>
    </motion.article>
  );
}

function FeatureBars() {
  const bars = [30, 44, 38, 58, 50, 74, 62, 86, 70, 96, 78, 92, 68, 82, 60];
  return (
    <div className="mt-8 flex h-16 items-end gap-1.5">
      {bars.map((height, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          viewport={{ once: false }}
          transition={{ delay: index * 0.04, duration: 0.5 }}
          className={`flex-1 rounded-t-sm ${
            index > 8 ? "bg-[#a58bff]" : "bg-[#a58bff]/30"
          }`}
        />
      ))}
    </div>
  );
}

function FeatureChecklist() {
  const items = ["Profile tuned", "Promoter matched", "Intro sent"];
  return (
    <div className="mt-8 space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 rounded-lg border border-white/[.08] bg-white/[.03] px-3 py-2.5"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white">
            <Check className="size-3" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">
            {item}
          </span>
          <span className="ml-auto text-[10px] text-white/25">0{index + 1}</span>
        </motion.div>
      ))}
    </div>
  );
}

function FeatureOrbit() {
  return (
    <div className="relative mt-8 h-24">
      <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8b6cff]/30 animate-[spin_10s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#a58bff] to-[#6d4dff] shadow-[0_0_30px_rgba(139,92,246,.6)]" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-[#8b6cff]/30" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-[#8b6cff]/30" />
    </div>
  );
}

function FeatureNetwork() {
  return (
    <div className="relative mt-8 h-24">
      <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a58bff] bg-[#a58bff]/20 shadow-[0_0_30px_rgba(139,92,246,.4)] animate-pulse" />
      <div className="absolute left-[18%] top-1/2 h-px w-[64%] bg-gradient-to-r from-transparent via-[#a58bff]/60 to-transparent" />
      <div className="absolute left-[15%] top-1/2 size-3 -translate-y-1/2 rounded-full bg-[#e3a6ff]" />
      <div className="absolute right-[15%] top-1/2 size-3 -translate-y-1/2 rounded-full bg-[#89dceb]" />
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <main className="min-h-screen overflow-hidden bg-[#07070e] text-[#ecebf3]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-20rem] h-[40rem] w-[62rem] -translate-x-1/2 rounded-full bg-[#6d4dff]/18 blur-[150px]" />
      <div className="pointer-events-none fixed right-[-8rem] top-40 h-[24rem] w-[24rem] rounded-full bg-[#8b5cf6]/10 blur-[120px]" />

      <Nav />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-10 lg:pt-20">
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <Pill>
            <Sparkles className="size-3 text-[#b59aff]" />
            Boost your reach, not just your numbers
          </Pill>
          <h1 className="mt-7 text-5xl font-semibold leading-[1.04] tracking-[-.05em] text-white sm:text-6xl lg:text-7xl">
            Transform music into
            <br />
            <span className="bg-gradient-to-r from-[#c9b8ff] via-[#a58bff] to-[#6d4dff] bg-clip-text text-transparent">
              movements with AI.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
            Unlock growth potential with smart matchmaking between artists and promoters.
            Connect with the right people who move your sound — and do it in minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a58bff] to-[#6d4dff] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,.4)] transition hover:shadow-[0_0_60px_rgba(139,92,246,.6)]"
            >
              Get started
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("signal")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-white/[.14] px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
            >
              See how it works
            </button>
          </div>
        </Reveal>
        <ProductPreview />
        <TrustStrip />
      </section>

      {/* Features */}
      <section id="why" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>
            <Zap className="size-3 text-[#b59aff]" />
            Features
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl">
            Powerful features to simplify your matching.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/45">
            Discover how sonar/match optimizes your visibility and boosts your productivity and
            shortlist.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal delay={0.05}>
            <BentoCard
              icon={<Gauge />}
              title="Adaptive signal"
              text="An intelligent matching engine tuned to your sound and audience intent."
            >
              <FeatureBars />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.12}>
            <BentoCard
              icon={<Activity />}
              title="Smart matchmaking"
              text="Get insightful matches to your style, reach, and campaign goals automatically."
            >
              <FeatureChecklist />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.19}>
            <BentoCard
              icon={<Sparkles />}
              title="Generate momentum"
              text="Shortlist recommendations that align with how your music actually travels."
            >
              <FeatureOrbit />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.26}>
            <BentoCard
              icon={<Users />}
              title="Collaboration tools"
              text="Coordinate with trusted promoters and foster collaboration throughout your campaign."
            >
              <FeatureNetwork />
            </BentoCard>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section id="how" className="border-y border-white/[.06] bg-white/[.018] px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Pill>
              <Radio className="size-3 text-[#b59aff]" />
              Work process
            </Pill>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl">
              Getting started with sonar/match.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/45">
              See how easy it is to navigate your matching and boost your reach with powerful
              guidance.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Share your sound",
                text: "Post your music or a description. Our engine reads the energy and direction behind it.",
              },
              {
                number: "02",
                title: "Read the fit",
                text: "See the people, reach, and context behind every recommendation before you commit.",
              },
              {
                number: "03",
                title: "Make the intro",
                text: "Like or pass, Tinder-style. Agree on terms and start a conversation with signal.",
              },
            ].map(({ number, title, text }, index) => (
              <Reveal key={number} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative h-full overflow-hidden rounded-2xl border border-white/[.09] bg-white/[.03] p-6 backdrop-blur-sm"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-xl border border-white/[.1] bg-white/[.05] text-[#b59aff]">
                      <Radio className="size-4" />
                    </span>
                    <span className="font-mono text-[10px] text-white/25">{number}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-medium tracking-[-.02em] text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
                  <div className="mt-6 flex gap-2">
                    <span className="rounded-full border border-white/[.1] bg-white/[.03] px-3 py-1 font-mono text-[10px] text-white/50">
                      Workflow
                    </span>
                    <span className="rounded-full border border-[#8b6cff]/30 bg-[#8b6cff]/10 px-3 py-1 font-mono text-[10px] text-[#c9b8ff]">
                      Optimized
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>
            <Users className="size-3 text-[#b59aff]" />
            Testimonials
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl">
            Better matches feel different.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["Finally, a shortlist that feels like someone actually listened to the record.", "Nia S.", "Producer / alt R&B"],
            ["I stopped pitching into the void. The fit context changes everything.", "Kairo M.", "Independent artist"],
            ["The right promoter is a creative partner. Sonar helped me find that.", "Ari V.", "Electronic artist"],
          ].map(([quote, name, role], index) => (
            <Reveal key={name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className={`h-full rounded-2xl border p-6 backdrop-blur-sm ${
                  index === 1
                    ? "border-[#8b6cff]/40 bg-[#8b6cff]/[.06]"
                    : "border-white/[.09] bg-white/[.03]"
                }`}
              >
                <p className="text-base leading-7 text-white/70">&ldquo;{quote}&rdquo;</p>
                <div className="mt-8 border-t border-white/[.08] pt-4">
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-white/30">
                    {role}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
        <Reveal className="text-center">
          <Pill>
            <ChevronDown className="size-3 text-[#b59aff]" />
            Questions
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] text-white">
            We&apos;ve got answers.
          </h2>
        </Reveal>
        <div className="mt-10 space-y-2">
          {faq.map(([question, answer], index) => (
            <Reveal key={question} delay={index * 0.04}>
              <div
                className={`overflow-hidden rounded-2xl border backdrop-blur-sm ${
                  openFaq === index
                    ? "border-[#8b6cff]/50 bg-[#8b6cff]/[.06]"
                    : "border-white/[.09] bg-white/[.02]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`size-4 text-white/40 transition ${
                      openFaq === index ? "rotate-180 text-[#b59aff]" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <p className="px-5 pb-5 text-sm leading-6 text-white/45">{answer}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[#8b6cff]/30 bg-[#0c0c16] px-7 py-16 text-center shadow-[0_0_80px_rgba(139,92,246,.15)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a58bff] to-transparent" />
            <div className="absolute left-1/2 top-0 size-80 -translate-x-1/2 rounded-full bg-[#6d4dff]/15 blur-[100px] animate-pulse" />
            <div className="relative">
              <Pill>
                <Sparkles className="size-3 text-[#b59aff]" />
                Ready when you are
              </Pill>
              <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-.04em] text-white sm:text-6xl">
                Put your release in the right room.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/45">
                Your next connection should feel less like a pitch and more like a fit.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a58bff] to-[#6d4dff] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,.45)] transition hover:shadow-[0_0_60px_rgba(139,92,246,.65)]"
              >
                Start matching
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/[.07] px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white">
              <Waves className="size-3" />
            </span>
            <p className="font-mono text-xs text-white/40">
              SONAR<span className="text-[#a58bff]">/MATCH</span> · make better introductions.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/25">
            For artists, not algorithms.
          </p>
        </div>
      </footer>
    </main>
  );
}
