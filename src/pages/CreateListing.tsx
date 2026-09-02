import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  AtSign,
  Check,
  Film,
  Globe,
  Instagram,
  Loader2,
  Music,
  Plus,
  Star,
  Trash2,
  Users,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { formatRating, initialsOf } from "@/lib/format";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const SERVICE_OPTIONS = [
  "TikTok edits",
  "Lyric videos",
  "Playlist placement",
  "Animation",
  "Visualizers",
  "Cover art",
  "Radio feature",
];
const GENRE_OPTIONS = ["Alt", "R&B", "Indie", "Alt pop", "Hyperpop", "Electronic", "Soul"];
const UNIT_OPTIONS = ["video", "slot", "post", "visual"];

const PLATFORM_ICONS: Record<string, typeof Globe> = {
  TikTok: Music,
  Instagram: Instagram,
  YouTube: Youtube,
  Website: Globe,
  Spotify: Music,
  Twitter: AtSign,
};

function toggle(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function field(value: string | undefined): string {
  return value ?? "";
}

export default function CreateListing() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const myListing = useQuery(api.listings.getMyListing, {});
  const seedDemo = useMutation(api.listings.seedDemoListings);
  const upsert = useMutation(api.listings.upsertMyListing);

  const editing = myListing !== undefined && myListing !== null;

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [unit, setUnit] = useState("video");
  const [minQuantity, setMinQuantity] = useState("1");
  const [followers, setFollowers] = useState("");
  const [location, setLocation] = useState("");
  const [portfolio, setPortfolio] = useState([{ label: "", url: "" }]);
  const [socials, setSocials] = useState([{ platform: "TikTok", url: "" }]);
  const [saving, setSaving] = useState(false);
  const [loadedFrom, setLoadedFrom] = useState(false);

  // Prefill once the existing listing arrives; never overwrite live typing.
  useEffect(() => {
    if (loadedFrom || !myListing) return;
    setName(field(myListing.name));
    setHandle(field(myListing.handle));
    setHeadline(field(myListing.headline));
    setAbout(field(myListing.about));
    setServices(myListing.services ?? []);
    setGenres(myListing.genres ?? []);
    setPricePerUnit(String(myListing.pricePerUnit ?? ""));
    setUnit(field(myListing.unit) || "video");
    setMinQuantity(String(myListing.minQuantity ?? 1));
    setFollowers(String(myListing.followers ?? ""));
    setLocation(field(myListing.location));
    setPortfolio(
      myListing.portfolio?.length ? myListing.portfolio : [{ label: "", url: "" }],
    );
    setSocials(
      myListing.socials?.length ? myListing.socials : [{ platform: "TikTok", url: "" }],
    );
    setLoadedFrom(true);
  }, [myListing, loadedFrom]);

  // First visit: make sure the marketplace has sample content to browse.
  useEffect(() => {
    void seedDemo({});
  }, [seedDemo]);

  const addPortfolioRow = () =>
    setPortfolio((rows) => [...rows, { label: "", url: "" }]);
  const addSocialRow = () =>
    setSocials((rows) => [...rows, { platform: "TikTok", url: "" }]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const trimmedPortfolio = portfolio
      .map((row) => ({ label: row.label.trim(), url: row.url.trim() }))
      .filter((row) => row.label || row.url);
    if (trimmedPortfolio.some((row) => !row.url)) {
      toast.error("Every portfolio link needs a URL.");
      return;
    }
    const trimmedSocials = socials
      .map((row) => ({ platform: row.platform, url: row.url.trim() }))
      .filter((row) => row.url);

    setSaving(true);
    try {
      await upsert({
        name: name.trim(),
        handle: handle.trim(),
        headline: headline.trim(),
        about: about.trim(),
        services,
        genres,
        pricePerUnit: Number(pricePerUnit) || 0,
        unit,
        minQuantity: Number(minQuantity) || 1,
        followers: Number(followers) || 0,
        location: location.trim(),
        portfolio: trimmedPortfolio,
        socials: trimmedSocials,
      });
      toast.success(editing ? "Listing updated." : "Your listing is live.");
      navigate(`/promoter/${handle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't save your listing.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || myListing === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070e] text-[#ecebf3]">
        <Loader2 className="size-5 animate-spin text-white/40" />
      </main>
    );
  }

  const inputClass =
    "border-white/12 bg-black/25 text-white placeholder:text-white/25 backdrop-blur focus-visible:ring-[var(--action)]";
  const sectionClass = "rounded-2xl border border-white/12 bg-white/[.05] p-6 backdrop-blur-xl";
  const labelClass = "block text-sm font-medium text-white/80";

  return (
    <main className="min-h-screen bg-[#07070e] pb-24 text-[#ecebf3]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-16rem] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-[#6d4dff]/15 blur-[140px]" />

      <div className="relative mx-auto max-w-3xl px-6 py-10">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="size-4" /> Back to dashboard
        </button>

        <div className="mt-8">
          <h1 className="font-display text-4xl font-medium text-white">
            {editing ? "Edit your listing" : "Create your listing"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
            {editing
              ? "Update anything below — changes go live immediately."
              : "Tell artists what you make, what it costs, and where they can see your work. You can edit all of this later."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {/* The basics */}
          <section className={sectionClass}>
            <h2 className="font-display text-lg font-medium text-white">The basics</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="listing-name" className={labelClass}>Display name</label>
                <Input
                  id="listing-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maya Chen"
                  className={`mt-2 ${inputClass}`}
                  required
                />
              </div>
              <div>
                <label htmlFor="listing-handle" className={labelClass}>Your link</label>
                <div className="mt-2 flex items-center gap-2 rounded-md border border-white/12 bg-black/25 px-3 backdrop-blur">
                  <span className="shrink-0 text-sm text-white/35">/promoter/</span>
                  <input
                    id="listing-handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase())}
                    placeholder="maya-chen"
                    className="h-9 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="listing-location" className={labelClass}>Location</label>
                <Input
                  id="listing-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Berlin, DE"
                  className={`mt-2 ${inputClass}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="listing-headline" className={labelClass}>One-line headline</label>
                <Input
                  id="listing-headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="TikTok edits that make alt records impossible to scroll past"
                  className={`mt-2 ${inputClass}`}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="listing-about" className={labelClass}>About your work</label>
                <textarea
                  id="listing-about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="What you make, who you've worked with, what an artist can expect when they hire you."
                  rows={4}
                  className="mt-2 w-full rounded-md border border-white/12 bg-black/25 px-3 py-2 text-sm text-white outline-none backdrop-blur placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-[var(--action)]"
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className={sectionClass}>
            <h2 className="font-display text-lg font-medium text-white">Pricing</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="listing-price" className={labelClass}>Price per</label>
                <div className="mt-2 flex items-center gap-1 rounded-md border border-white/12 bg-black/25 px-3 backdrop-blur">
                  <span className="text-sm text-white/50">$</span>
                  <input
                    id="listing-price"
                    type="number"
                    min={1}
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    placeholder="120"
                    className="h-9 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="listing-unit" className={labelClass}>Per unit</label>
                <select
                  id="listing-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="mt-2 h-9 w-full rounded-md border border-white/12 bg-black/25 px-2 text-sm text-white outline-none backdrop-blur"
                >
                  {UNIT_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-[#0d0d16]">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="listing-min" className={labelClass}>Minimum</label>
                <Input
                  id="listing-min"
                  type="number"
                  min={1}
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  className={`mt-2 ${inputClass}`}
                />
              </div>
            </div>
          </section>

          {/* Reach */}
          <section className={sectionClass}>
            <h2 className="font-display text-lg font-medium text-white">Reach</h2>
            <div className="mt-5">
              <label htmlFor="listing-followers" className={labelClass}>
                Total followers across your pages
              </label>
              <Input
                id="listing-followers"
                type="number"
                min={0}
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="480000"
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </section>

          {/* What you make */}
          <section className={sectionClass}>
            <h2 className="font-display text-lg font-medium text-white">What you make</h2>
            <p className="mt-1 text-xs text-white/45">Pick everything that applies.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((option) => {
                const active = services.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setServices((cur) => toggle(cur, option))}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-[#8b6cff] bg-[#8b6cff]/20 text-[#c9b8ff]"
                        : "border-white/15 bg-white/[.05] text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Genres */}
          <section className={sectionClass}>
            <h2 className="font-display text-lg font-medium text-white">Genres you fit</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((option) => {
                const active = genres.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setGenres((cur) => toggle(cur, option))}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-[#8b6cff] bg-[#8b6cff]/20 text-[#c9b8ff]"
                        : "border-white/15 bg-white/[.05] text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Portfolio */}
          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-white">Portfolio</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addPortfolioRow}
                className="border-white/15 bg-white/[.05] text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Plus className="size-3.5" /> Add link
              </Button>
            </div>
            <p className="mt-1 text-xs text-white/45">
              Reels, case studies, your site — anywhere artists can see your work.
            </p>
            <div className="mt-4 space-y-3">
              {portfolio.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={row.label}
                    onChange={(e) =>
                      setPortfolio((rows) =>
                        rows.map((r, i) => (i === index ? { ...r, label: e.target.value } : r)),
                      )
                    }
                    placeholder="Edit reel 2025"
                    className={inputClass}
                  />
                  <Input
                    value={row.url}
                    onChange={(e) =>
                      setPortfolio((rows) =>
                        rows.map((r, i) => (i === index ? { ...r, url: e.target.value } : r)),
                      )
                    }
                    placeholder="https://"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    aria-label="Remove link"
                    onClick={() =>
                      setPortfolio((rows) =>
                        rows.length > 1 ? rows.filter((_, i) => i !== index) : rows,
                      )
                    }
                    className="shrink-0 rounded-md p-2 text-white/30 transition hover:bg-white/10 hover:text-[#fb7185]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Socials */}
          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-white">Socials</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addSocialRow}
                className="border-white/15 bg-white/[.05] text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Plus className="size-3.5" /> Add account
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {socials.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={row.platform}
                    onChange={(e) =>
                      setSocials((rows) =>
                        rows.map((r, i) => (i === index ? { ...r, platform: e.target.value } : r)),
                      )
                    }
                    className="h-9 rounded-md border border-white/12 bg-black/25 px-2 text-sm text-white outline-none backdrop-blur"
                    aria-label="Platform"
                  >
                    {Object.keys(PLATFORM_ICONS).map((platform) => (
                      <option key={platform} className="bg-[#0d0d16]">
                        {platform}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={row.url}
                    onChange={(e) =>
                      setSocials((rows) =>
                        rows.map((r, i) => (i === index ? { ...r, url: e.target.value } : r)),
                      )
                    }
                    placeholder="https://tiktok.com/@you"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    aria-label="Remove account"
                    onClick={() =>
                      setSocials((rows) =>
                        rows.length > 1 ? rows.filter((_, i) => i !== index) : rows,
                      )
                    }
                    className="shrink-0 rounded-md p-2 text-white/30 transition hover:bg-white/10 hover:text-[#fb7185]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-white/50 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <motion.span whileTap={{ scale: 0.98 }} className="inline-flex">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#8b6cff] px-8 text-white hover:bg-[#9a80ff]"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving…
                  </>
                ) : editing ? (
                  "Save changes"
                ) : (
                  "Publish listing"
                )}
              </Button>
            </motion.span>
          </div>
        </form>
      </div>
    </main>
  );
}
