import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

const GENRE_OPTIONS = ["Alt", "R&B", "Indie", "Alt pop", "Hyperpop", "Electronic", "Soul"];
const MAX_DESCRIPTION = 400;

export function PostTrackDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createTrack = useMutation(api.tracks.createMyTrack);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleGenre = (genre: string) =>
    setGenres((current) =>
      current.includes(genre)
        ? current.filter((g) => g !== genre)
        : current.length < 6
          ? [...current, genre]
          : current,
    );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (!title.trim()) {
      toast.error("Give the track a title.");
      return;
    }
    if (!/^https?:\/\//.test(link.trim())) {
      toast.error("Link must start with https:// — Spotify, SoundCloud, YouTube, Drive all work.");
      return;
    }
    setSaving(true);
    try {
      await createTrack({
        title: title.trim(),
        link: link.trim(),
        description: description.trim(),
        genres,
      });
      toast.success("Track posted. Promoters can see it now.");
      onOpenChange(false);
      setTitle("");
      setLink("");
      setDescription("");
      setGenres([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't post the track.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/12 bg-[#101018] text-[#ecebf3] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-medium text-white">
            Post a track
          </DialogTitle>
          <DialogDescription className="text-sm text-white/55">
            Paste a link to your track and say what you're looking for. Promoters browse these
            when deciding who to work with.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="track-title" className="text-sm font-medium text-white/80">
              Title
            </label>
            <Input
              id="track-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="static bloom — demo mix"
              maxLength={80}
              className="mt-2 border-white/12 bg-black/25 text-white placeholder:text-white/25 focus-visible:ring-[var(--action)]"
              required
            />
          </div>

          <div>
            <label htmlFor="track-link" className="text-sm font-medium text-white/80">
              Link
            </label>
            <Input
              id="track-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://open.spotify.com/track/…"
              className="mt-2 border-white/12 bg-black/25 text-white placeholder:text-white/25 focus-visible:ring-[var(--action)]"
              required
            />
            <p className="mt-1 text-[11px] text-white/35">
              Spotify, SoundCloud, YouTube, a private Drive link — anything they can click.
            </p>
          </div>

          <div>
            <label htmlFor="track-description" className="text-sm font-medium text-white/80">
              What are you looking for? <span className="font-normal text-white/40">(optional)</span>
            </label>
            <Textarea
              id="track-description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION))}
              placeholder="Alt R&B demo, mixed at home. Looking for TikTok edits that fit the moodier side of the genre."
              rows={3}
              maxLength={MAX_DESCRIPTION}
              className="mt-2 resize-none border-white/12 bg-black/25 text-white placeholder:text-white/25 focus-visible:ring-[var(--action)]"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-white/80">Genres <span className="font-normal text-white/40">(up to 6)</span></p>
            <div className="mt-2 flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => {
                const active = genres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      active
                        ? "border-[#8b6cff] bg-[#8b6cff]/20 text-[#c9b8ff]"
                        : "border-white/15 bg-white/[.05] text-white/55 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white/50 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-[#8b6cff] text-white hover:bg-[#9a80ff]">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Posting…
                </>
              ) : (
                <>
                  <Plus className="size-4" /> Post track
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
