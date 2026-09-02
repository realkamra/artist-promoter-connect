import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Film,
  Heart,
  Music,
  Radio,
  Sparkles,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

const CHART_W = 292;
const CHART_H = 150;
const CHART_STEPS = 14;

// A fresh, wobbly climb every time it plays — never the same line twice.
function makeChartSeries(): number[] {
  const pts: number[] = [];
  for (let i = 0; i < CHART_STEPS; i++) {
    const t = i / (CHART_STEPS - 1);
    const climb = -84 * Math.pow(t, 1.12);
    const wobble = (Math.random() - 0.5) * 24 * (0.3 + t);
    const pullback = Math.random() < 0.24 ? 9 + Math.random() * 13 : 0;
    pts.push(Math.min(138, Math.max(12, 118 + climb + wobble + pullback)));
  }
  pts[0] = Math.min(134, Math.max(16, 116 + (Math.random() - 0.5) * 12));
  return pts;
}

const faq = [
  [
    "What is sonar/match?",
    "A matchmaking site for music. Artists post a track, promoters list what they make and what they charge, and both sides swipe through matches.",
  ],
  [
    "How does matching work?",
    "We compare your sound with each promoter's style, audience, and past work. You get a stack of cards — swipe right on the ones you like.",
  ],
  [
    "Is this a record label?",
    "No. We never own your music or take a cut of anything. Promoters set their own prices and you pay them directly.",
  ],
  [
    "What does it cost?",
    "Browsing and matching is free for artists. Promoters keep 100% of what they charge — you agree on the price before any work starts.",
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
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
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
      className="flex items-center gap-2.5"
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
        <a href="#how" className="text-sm text-white/60 transition hover:text-white">
          How it works
        </a>
        <a href="#features" className="text-sm text-white/60 transition hover:text-white">
          Features
        </a>
        <a href="#faq" className="text-sm text-white/60 transition hover:text-white">
          FAQ
        </a>
      </div>
      <button
        type="button"
        onClick={() => navigate("/auth")}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur transition hover:border-white/30 hover:bg-white/15"
      >
        Sign in
        <ArrowUpRight className="size-3.5" />
      </button>
    </nav>
  );
}

/* ---------------- Hero preview: projected streams, two lines ---------------- */

function ProductPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: 0.25 });
  const [series, setSeries] = useState<number[]>(makeChartSeries);
  const progress = useMotionValue(0);

  // Re-roll the data and redraw every time the preview re-enters the viewport.
  useEffect(() => {
    if (!visible) {
      progress.set(0);
      return;
    }
    setSeries(makeChartSeries());
    const controls = animate(progress, 1, {
      duration: 1.9,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [visible, progress]);

  const chartPoints = series
    .map(
      (y, i) =>
        `${((i * CHART_W) / (CHART_STEPS - 1)).toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ");
  const areaPath = `M0 ${series[0].toFixed(1)} ${series
    .slice(1)
    .map(
      (y, i) =>
        `L${(((i + 1) * CHART_W) / (CHART_STEPS - 1)).toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ")} L${CHART_W} ${CHART_H} L0 ${CHART_H} Z`;
  const dotX = useTransform(progress, (p) => p * CHART_W);
  const dotY = useTransform(progress, (p) => {
    const x = p * (CHART_STEPS - 1);
    const i = Math.min(CHART_STEPS - 2, Math.floor(x));
    const f = x - i;
    return series[i] + (series[i + 1] - series[i]) * f;
  });
  const dotOpacity = useTransform(progress, [0, 0.015, 1], [0, 1, 1]);

  const matches = [
    ["MC", "Maya Chen", "TikTok edits", "$120 / video", "from-[#f5c2e7] to-[#e3a6ff]"],
    ["LN", "Late Night Radio", "Playlist pushes", "$80 / slot", "from-[#89dceb] to-[#6db7ff]"],
    ["JC", "Juno Collective", "Visualizers", "$150 / video", "from-[#a6e3a1] to-[#8fe0a0]"],
  ];

  return (
    <Reveal delay={0.1} className="relative mx-auto mt-16 max-w-6xl">
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-b from-[#8b5cf6]/30 via-[#6d4dff]/8 to-transparent opacity-80 blur-2xl" />
      <div
        ref={ref}
        id="signal"
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d16]/70 p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-4"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          {/* Chart card */}
          <div className="rounded-xl border border-white/10 bg-white/[.06] p-4 backdrop-blur-xl sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-white/60">
                  Your streams over 6 months
                </p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
                  +312%{" "}
                  <span className="text-xs font-normal text-[#a6e3a1]">
                    with matches
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-white/60">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#a58bff]" /> With
                  sonar/match
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-white/30" /> Without
                </span>
              </div>
            </div>
            <div className="relative mt-5 h-44">
              <svg
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
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
                  <clipPath id="landingReveal">
                    <motion.rect
                      x="0"
                      y={-24}
                      width={CHART_W + 8}
                      height={CHART_H + 48}
                      style={{ scaleX: progress, originX: 0, originY: 0 }}
                    />
                  </clipPath>
                </defs>
                {/* Flat "without" line — the honest baseline */}
                <line
                  x1="0"
                  y1="128"
                  x2={CHART_W}
                  y2="112"
                  stroke="rgba(255,255,255,.28)"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                />
                <g clipPath="url(#landingReveal)">
                  <path d={areaPath} fill="url(#landingArea)" />
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="url(#landingLine)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <motion.g style={{ x: dotX, y: dotY, opacity: dotOpacity }}>
                  <motion.circle
                    r="13"
                    fill="#8b6cff"
                    initial={{ opacity: 0 }}
                    animate={
                      visible
                        ? { opacity: [0.35, 0], scale: [1, 2.1] }
                        : { opacity: 0 }
                    }
                    transition={{
                      duration: 1.7,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.9,
                    }}
                  />
                  <circle
                    r="4.5"
                    fill="#b59aff"
                    stroke="#0d0d16"
                    strokeWidth="1.5"
                  />
                  <circle r="1.8" fill="#fff" />
                  <g transform="translate(0,-17)">
                    <rect
                      x="-15"
                      y="-14"
                      width="30"
                      height="13"
                      rx="6.5"
                      fill="#8b6cff"
                    />
                    <text
                      x="0"
                      y="-4.5"
                      textAnchor="middle"
                      fontSize="6.5"
                      fill="#fff"
                      fontFamily="ui-monospace, SFMono-Regular, monospace"
                      letterSpacing="1.5"
                    >
                      NOW
                    </text>
                  </g>
                </motion.g>
              </svg>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-white/35">
              <span>Month 1</span>
              <span>Month 3</span>
              <span>Month 6</span>
            </div>
            <p className="mt-4 rounded-lg bg-[#a6e3a1]/10 px-3 py-2 text-xs text-[#a6e3a1]">
              Based on promoters you match with — not a guarantee.
            </p>
          </div>

          {/* Match rows card */}
          <div className="flex flex-col gap-3">
            <div className="flex-1 rounded-xl border border-white/10 bg-white/[.06] p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-white/60">
                  Promoters in your stack
                </p>
                <Heart className="size-3.5 text-[#b59aff]" />
              </div>
              <div className="mt-4 space-y-2.5">
                {matches.map(([initials, name, service, price, g], i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: 14 }}
                    animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
                    transition={{ delay: 0.35 + i * 0.12, duration: 0.4 }}
                    className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[.05] p-2.5"
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${g} text-[9px] font-bold text-[#0d0d16]`}
                    >
                      {initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-white">
                        {name}
                      </span>
                      <span className="block truncate text-[10px] text-white/45">
                        {service}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold text-[#b59aff]">
                      {price}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-white/40">
                Swipe right to send an intro. Prices are set by promoters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Feature visuals — each one explains the product ---------------- */

function SwipeVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: 0.4 });
  return (
    <div ref={ref} className="relative mt-8 h-40 select-none">
      {/* Card underneath */}
      <div className="absolute inset-x-8 bottom-0 top-4 rounded-xl border border-white/10 bg-white/[.08] p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#89dceb] to-[#6db7ff] text-[10px] font-bold text-[#0d0d16]">
            LN
          </span>
          <div>
            <p className="text-xs font-semibold text-white">Late Night Radio</p>
            <p className="text-[10px] text-white/45">Playlist curator · 210K followers</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-white/55">
          Synthwave &amp; chill playlists. $80 per slot.
        </p>
      </div>
      {/* Top card that swipes away */}
      <motion.div
        className="absolute inset-x-6 bottom-2 top-0 rounded-xl border border-[#a58bff]/40 bg-[#15121f]/90 p-4 shadow-[0_0_40px_rgba(139,92,246,.25)] backdrop-blur-xl"
        animate={
          visible
            ? { x: [0, 0, 130], rotate: [0, 0, 12], opacity: [1, 1, 0] }
            : { x: 0, rotate: 0, opacity: 1 }
        }
        transition={
          visible
            ? { duration: 2.6, times: [0, 0.55, 1], repeat: Infinity, repeatDelay: 0.5, ease: "easeIn" }
            : { duration: 0.3 }
        }
      >
        <motion.span
          className="absolute right-3 top-3 rounded-md border-2 border-[#a6e3a1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a6e3a1]"
          animate={visible ? { opacity: [0, 0, 1, 1], scale: [0.7, 0.7, 1.1, 1] } : { opacity: 0 }}
          transition={
            visible
              ? { duration: 2.6, times: [0, 0.55, 0.68, 1], repeat: Infinity, repeatDelay: 0.5 }
              : { duration: 0.2 }
          }
        >
          Match
        </motion.span>
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f5c2e7] to-[#e3a6ff] text-[10px] font-bold text-[#0d0d16]">
            MC
          </span>
          <div>
            <p className="text-xs font-semibold text-white">Maya Chen</p>
            <p className="text-[10px] text-white/45">TikTok editor · 480K followers</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-white/55">
          Anime &amp; lyric edits for alt / hyperpop. $120 per video.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/70">
            <X className="size-3" /> Pass
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#8b6cff]/25 px-2.5 py-1 text-[10px] text-[#c9b8ff]">
            <Heart className="size-3" /> Like
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function PricingVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: 0.4 });
  const rows = [
    ["TikTok edit", "$120 / video", "min. 3 videos", true],
    ["Lyric video", "$95 / video", "min. 2 videos", false],
    ["Playlist slot", "$80 / slot", "min. 1 week", false],
  ];
  return (
    <div ref={ref} className="mt-8 space-y-2">
      {rows.map(([service, price, min, highlight], i) => (
        <motion.div
          key={service as string}
          initial={{ opacity: 0, y: 12 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: i * 0.12, duration: 0.45 }}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
            highlight
              ? "border-[#a58bff]/50 bg-[#8b6cff]/15"
              : "border-white/10 bg-white/[.05]"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-white">{service}</p>
            <p className="mt-0.5 text-[10px] text-white/45">{min}</p>
          </div>
          <p className={`text-sm font-semibold ${highlight ? "text-[#c9b8ff]" : "text-white/80"}`}>
            {price}
          </p>
        </motion.div>
      ))}
      <p className="pt-1 text-[11px] text-white/40">
        Every listing shows the price before you message anyone.
      </p>
    </div>
  );
}

function FitVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: 0.4 });
  const rows: [string, number, string][] = [
    ["Genre fit", 92, "alt R&B ↔ they post alt R&B edits"],
    ["Audience overlap", 78, "your listeners follow pages like theirs"],
    ["Reply speed", 64, "usually replies within a day"],
  ];
  return (
    <div ref={ref} className="mt-8 space-y-4">
      {rows.map(([label, value, note], i) => (
        <div key={label}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-white/80">{label}</span>
            <span className="font-semibold text-[#b59aff]">{value}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#6d4dff] to-[#b59aff]"
              initial={{ width: 0 }}
              animate={visible ? { width: `${value}%` } : { width: 0 }}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-1 text-[10px] text-white/40">{note}</p>
        </div>
      ))}
    </div>
  );
}

function NoLabelVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, amount: 0.4 });
  const items = ["You keep your masters", "No cut of your streams", "You approve every post"];
  return (
    <div ref={ref} className="mt-8 space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -12 }}
          animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.05] px-4 py-3"
        >
          <motion.span
            className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white"
            animate={visible ? { scale: [0.6, 1.15, 1] } : { scale: 0.6 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
          >
            <Check className="size-3" />
          </motion.span>
          <span className="text-xs font-medium text-white/85">{item}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- Sections ---------------- */

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
      whileHover={{ y: -5 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/12 bg-white/[.06] p-6 backdrop-blur-xl transition-colors hover:border-white/25 hover:bg-white/[.09]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative flex h-full flex-col">
        <span className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#b59aff]">
          {icon}
        </span>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
        {children}
      </div>
    </motion.article>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <main className="min-h-screen overflow-hidden bg-[#07070e] text-[#ecebf3]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-20rem] h-[40rem] w-[62rem] -translate-x-1/2 rounded-full bg-[#6d4dff]/25 blur-[150px]" />
      <div className="pointer-events-none fixed right-[-8rem] top-40 h-[24rem] w-[24rem] rounded-full bg-[#8b5cf6]/14 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10rem] left-[-6rem] h-[24rem] w-[28rem] rounded-full bg-[#6d4dff]/12 blur-[130px]" />

      <Nav />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-10 lg:pt-20">
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <Pill>
            <Music className="size-3.5 text-[#b59aff]" />
            For artists and promoters
          </Pill>
          <h1 className="mt-7 text-5xl font-semibold leading-[1.06] tracking-[-.04em] text-white sm:text-6xl lg:text-7xl">
            Get your music
            <br />
            promoted by{" "}
            <span className="bg-gradient-to-r from-[#c9b8ff] via-[#a58bff] to-[#6d4dff] bg-clip-text text-transparent">
              the right people.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
            Artists post a track. Promoters list what they make and what they
            charge. You swipe through matches and pick the one that fits.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a58bff] to-[#6d4dff] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,.4)] transition hover:shadow-[0_0_60px_rgba(139,92,246,.6)]"
            >
              Start matching — free
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-7 py-3.5 text-sm font-medium text-white/85 backdrop-blur transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              See how it works
            </button>
          </div>
        </Reveal>
        <ProductPreview />
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>
            <Radio className="size-3.5 text-[#b59aff]" />
            How it works
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.03em] text-white sm:text-5xl">
            Three steps. That&apos;s it.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              number: "1",
              title: "Post your sound",
              text: "Paste a link to your track or write two lines about it. Takes about a minute.",
            },
            {
              number: "2",
              title: "Swipe through promoters",
              text: "Every card shows their work, their audience size, and their price. Like or pass.",
            },
            {
              number: "3",
              title: "Agree on the deal",
              text: "Found a fit? Agree on how many videos and for how much. Then they get to work.",
            },
          ].map(({ number, title, text }, index) => (
            <Reveal key={number} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className="relative h-full rounded-2xl border border-white/12 bg-white/[.06] p-6 backdrop-blur-xl transition-colors hover:border-white/25 hover:bg-white/[.09]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-base font-bold text-white shadow-[0_0_24px_rgba(139,92,246,.4)]">
                  {number}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>
            <Sparkles className="size-3.5 text-[#b59aff]" />
            Features
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.03em] text-white sm:text-5xl">
            Everything you need to find a fit.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal delay={0.05}>
            <BentoCard
              icon={<Heart />}
              title="Swipe to match"
              text="Like or pass, one card at a time. Every card shows what the promoter makes and how big their audience is."
            >
              <SwipeVisual />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.12}>
            <BentoCard
              icon={<Film />}
              title="Prices up front"
              text="Promoters list a price per video and a minimum. No “DM for rates,” no guessing."
            >
              <PricingVisual />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.19}>
            <BentoCard
              icon={<Radio />}
              title="See why it's a fit"
              text="Each match comes with a simple breakdown, so you know why they showed up in your stack."
            >
              <FitVisual />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.26}>
            <BentoCard
              icon={<Music />}
              title="No label, no cut"
              text="We're a matchmaker, not a label. You and the promoter agree on terms — we stay out of it."
            >
              <NoLabelVisual />
            </BentoCard>
          </Reveal>
        </div>
      </section>

      {/* Two sides */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>
            <Waves className="size-3.5 text-[#b59aff]" />
            Two sides, one marketplace
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.03em] text-white sm:text-5xl">
            Built for both of you.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal delay={0.05}>
            <motion.div
              whileHover={{ y: -5 }}
              className="h-full rounded-2xl border border-[#a58bff]/35 bg-[#8b6cff]/[.09] p-7 backdrop-blur-xl transition-colors hover:border-[#a58bff]/60"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white shadow-[0_0_28px_rgba(139,92,246,.5)]">
                <Music className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">For artists &amp; producers</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "Post a track or a short description",
                  "Swipe through promoters who fit your sound",
                  "See price and audience size before you message",
                  "Keep 100% of your music and your money",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#b59aff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </Reveal>
          <Reveal delay={0.12}>
            <motion.div
              whileHover={{ y: -5 }}
              className="h-full rounded-2xl border border-white/12 bg-white/[.06] p-7 backdrop-blur-xl transition-colors hover:border-white/25 hover:bg-white/[.09]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#b59aff]">
                <Film className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">For promoters</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "List what you make — edits, animations, playlists",
                  "Set your own price per video and minimum",
                  "Get matched with tracks that fit your page",
                  "Free to join. You keep every dollar you charge",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#b59aff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Pill>
            <Heart className="size-3.5 text-[#b59aff]" />
            What people say
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.03em] text-white sm:text-5xl">
            Better matches feel different.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["Finally, a shortlist that feels like someone actually listened to the track.", "Nia S.", "Producer, alt R&B"],
            ["I used to DM fifty pages and hear back from two. Now I see prices first and pick.", "Kairo M.", "Independent artist"],
            ["As a promoter, the matches actually fit my page. Less scrolling, better work.", "Ari V.", "TikTok editor"],
          ].map(([quote, name, role], index) => (
            <Reveal key={name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className={`h-full rounded-2xl border p-6 backdrop-blur-xl transition-colors ${
                  index === 1
                    ? "border-[#a58bff]/40 bg-[#8b6cff]/[.1] hover:border-[#a58bff]/65"
                    : "border-white/12 bg-white/[.06] hover:border-white/25 hover:bg-white/[.09]"
                }`}
              >
                <p className="text-base leading-7 text-white/80">&ldquo;{quote}&rdquo;</p>
                <div className="mt-8 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="mt-1 text-xs text-white/45">{role}</p>
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
            <ChevronDown className="size-3.5 text-[#b59aff]" />
            Questions
          </Pill>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.03em] text-white">
            Straight answers.
          </h2>
        </Reveal>
        <div className="mt-10 space-y-2">
          {faq.map(([question, answer], index) => (
            <Reveal key={question} delay={index * 0.04}>
              <div
                className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors ${
                  openFaq === index
                    ? "border-[#a58bff]/50 bg-[#8b6cff]/[.1]"
                    : "border-white/12 bg-white/[.05] hover:border-white/25"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-white/50 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180 text-[#b59aff]" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <p className="px-5 pb-5 text-sm leading-6 text-white/60">{answer}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[#a58bff]/30 bg-[#0c0c16]/80 px-7 py-16 text-center shadow-[0_0_80px_rgba(139,92,246,.18)] backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a58bff] to-transparent" />
            <div className="absolute left-1/2 top-0 size-80 -translate-x-1/2 rounded-full bg-[#6d4dff]/20 blur-[100px]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-[-.03em] text-white sm:text-5xl">
                Your next promoter is one swipe away.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/60">
                Create a free profile, post your track, and start matching tonight.
              </p>
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a58bff] to-[#6d4dff] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,.45)] transition hover:shadow-[0_0_60px_rgba(139,92,246,.65)]"
              >
                Create your free profile
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white">
              <Waves className="size-3" />
            </span>
            <p className="text-xs text-white/50">
              sonar<span className="text-[#a58bff]">/match</span> — artists meet promoters.
            </p>
          </div>
          <p className="text-xs text-white/35">
            Not a label. You keep your music.
          </p>
        </div>
      </footer>
    </main>
  );
}
