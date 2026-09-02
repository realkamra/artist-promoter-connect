import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Globe,
  Heart,
  Instagram,
  Loader2,
  MapPin,
  Music,
  Star,
  Users,
  Youtube,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { formatFollowers, formatRating, initialsOf } from "@/lib/format";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const PLATFORM_ICONS: Record<string, typeof Globe> = {
  TikTok: Music,
  Instagram: Instagram,
  YouTube: Youtube,
  Website: Globe,
  Spotify: Music,
  Twitter: Globe,
};

function Stars({
  value,
  onChange,
  size = "size-5",
}: {
  value: number;
  onChange?: (next: number) => void;
  size?: string;
}) {
  const [hover, setHover] = useState(0);
  const interactive = Boolean(onChange);
  return (
    <div className="flex items-center gap-1" role={interactive ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || value);
        const content = (
          <Star
            className={`${size} transition ${active ? "fill-[#f9e2af] text-[#f9e2af]" : "text-white/25"}`}
          />
        );
        if (!interactive) return <span key={star}>{content}</span>;
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(star)}
            className="transition-transform hover:scale-110"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

export default function PromoterProfile() {
  const { handle = "" } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const data = useQuery(api.listings.getListingByHandle, { handle });
  const myVouch = useQuery(
    api.vouches.myVouch,
    data?.listing ? { listingId: data.listing._id } : "skip",
  );
  const addVouch = useMutation(api.vouches.addVouch);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (myVouch) {
      setRating(myVouch.rating);
      setComment(myVouch.comment);
    }
  }, [myVouch]);

  if (data === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070e] text-[#ecebf3]">
        <Loader2 className="size-5 animate-spin text-white/40" />
      </main>
    );
  }

  if (data === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#07070e] px-6 text-center text-[#ecebf3]">
        <p className="font-display text-3xl font-medium text-white">No promoter at this link.</p>
        <p className="mt-3 text-sm text-white/50">The listing may have been removed or renamed.</p>
        <Button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-8 bg-[#8b6cff] text-white hover:bg-[#9a80ff]"
        >
          Browse promoters
        </Button>
      </main>
    );
  }

  const { listing, vouches } = data;
  const avg = formatRating(listing.ratingSum, listing.vouchCount);

  const submitVouch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (rating < 1) {
      toast.error("Pick a star rating first.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Write a few words about working together.");
      return;
    }
    setSubmitting(true);
    try {
      await addVouch({ listingId: listing._id, rating, comment: comment.trim() });
      toast.success("Thanks — your vouch is live.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't save your vouch.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07070e] pb-24 text-[#ecebf3]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-16rem] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#6d4dff]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="size-4" /> Back to dashboard
        </button>

        {/* Header */}
        <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#8b6cff]/15 text-xl font-bold text-[#c9b8ff]">
              {initialsOf(listing.name)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-medium text-white sm:text-4xl">
                  {listing.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#a6e3a1]/10 px-2.5 py-1 text-[11px] font-medium text-[#a6e3a1]">
                  <BadgeCheck className="size-3.5" /> Verified promoter
                </span>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">{listing.headline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/45">
                {listing.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {listing.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" /> {formatFollowers(listing.followers)} followers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="size-3.5 fill-[#f9e2af] text-[#f9e2af]" />
                  {avg}
                  <span className="text-white/30">
                    ({listing.vouchCount} vouch{listing.vouchCount === 1 ? "" : "es"})
                  </span>
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
            className="self-start rounded-full border border-white/12 bg-white/[.05] p-3 transition hover:border-white/25 hover:bg-white/10"
            aria-label={liked ? "Remove from saved" : "Save promoter"}
          >
            <Heart className={`size-5 transition ${liked ? "fill-[#f5c2e7] text-[#f5c2e7]" : "text-white/50"}`} />
          </button>
        </header>

        {/* Body */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* About */}
            <section className="rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-medium text-white">About</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/65">
                {listing.about || "This promoter hasn't written an about section yet."}
              </p>
            </section>

            {/* Portfolio */}
            <section className="rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-medium text-white">Portfolio</h2>
              {listing.portfolio.length === 0 ? (
                <p className="mt-3 text-sm text-white/50">No portfolio links yet.</p>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {listing.portfolio.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 transition hover:border-[#8b6cff]/40 hover:bg-white/[.07]"
                      >
                        <span className="text-sm font-medium text-white/85">{item.label || item.url}</span>
                        <ArrowUpRight className="size-4 shrink-0 text-white/30 transition group-hover:text-[#c9b8ff]" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Vouches */}
            <section ref={formRef} className="rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-medium text-white">
                  Vouches {listing.vouchCount > 0 && <span className="text-white/35">({listing.vouchCount})</span>}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-sm text-white/60">
                  <Star className="size-4 fill-[#f9e2af] text-[#f9e2af]" /> {avg}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {vouches.length === 0 ? (
                  <p className="text-sm text-white/50">
                    No vouches yet. Worked with {listing.name.split(" ")[0]}? Be the first.
                  </p>
                ) : (
                  vouches.map((vouch) => (
                    <div key={vouch._id} className="rounded-xl border border-white/10 bg-white/[.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{vouch.authorName}</p>
                        <Stars value={vouch.rating} size="size-3.5" />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/60">{vouch.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Vouch form */}
              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-sm font-semibold text-white">
                  {myVouch ? "Update your vouch" : `Vouch for ${listing.name.split(" ")[0]}`}
                </h3>
                {!isAuthenticated ? (
                  <Button
                    type="button"
                    onClick={() => navigate(`/auth?returnTo=${encodeURIComponent(`/promoter/${handle}`)}`)}
                    className="mt-4 bg-[#8b6cff] text-white hover:bg-[#9a80ff]"
                  >
                    Sign in to vouch
                  </Button>
                ) : (
                  <form onSubmit={submitVouch} className="mt-4 space-y-3">
                    <Stars value={rating} onChange={setRating} />
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Quick, honest, specific — what was it like working together?"
                      maxLength={400}
                      className="border-white/12 bg-black/25 text-white placeholder:text-white/25 focus-visible:ring-[var(--action)]"
                    />
                    <motion.span whileTap={{ scale: 0.98 }} className="inline-flex w-full">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#8b6cff] text-white hover:bg-[#9a80ff]"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Posting…
                          </>
                        ) : myVouch ? (
                          <>
                            <Check className="size-4" /> Update vouch
                          </>
                        ) : (
                          "Post vouch"
                        )}
                      </Button>
                    </motion.span>
                  </form>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-medium text-white">Pricing</h2>
              <p className="mt-3 text-3xl font-semibold text-white">
                ${listing.pricePerUnit}
                <span className="ml-1 text-sm font-normal text-white/45">/ {listing.unit}</span>
              </p>
              <p className="mt-1 text-xs text-white/45">Minimum {listing.minQuantity} {listing.unit}s</p>
              <Button
                type="button"
                className="mt-5 w-full bg-[#8b6cff] text-white hover:bg-[#9a80ff]"
                onClick={() => toast.success(`Intro sent to ${listing.name}.`)}
              >
                Send intro
              </Button>
              <p className="mt-3 text-center text-[11px] text-white/35">
                You agree on terms directly with the promoter.
              </p>
            </section>

            <section className="rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-medium text-white">What they make</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.services.map((service) => (
                  <span key={service} className="rounded-full bg-white/[.07] px-3 py-1 text-xs text-white/70">
                    {service}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-medium text-white">Genres</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.genres.map((genre) => (
                  <span key={genre} className="rounded-full bg-white/[.07] px-3 py-1 text-xs text-white/70">
                    {genre}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl">
              <h2 className="font-display text-lg font-medium text-white">Find them online</h2>
              {listing.socials.length === 0 ? (
                <p className="mt-3 text-sm text-white/50">No social links yet.</p>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {listing.socials.map((social) => {
                    const Icon = PLATFORM_ICONS[social.platform] ?? Globe;
                    return (
                      <li key={`${social.platform}-${social.url}`}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 transition hover:border-[#8b6cff]/40 hover:bg-white/[.07]"
                        >
                          <Icon className="size-4 text-[#b59aff]" />
                          <span className="flex-1 text-sm text-white/80">{social.platform}</span>
                          <ArrowUpRight className="size-4 text-white/25 transition group-hover:text-[#c9b8ff]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
