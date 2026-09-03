import {
  Loader2,
  Music,
  Plus,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

const MAX_MESSAGE = 500;

export function RequestDialog({
  listing,
  open,
  onOpenChange,
}: {
  listing: Doc<"listings">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const tracks = useQuery(api.tracks.listMyTracks, open ? {} : "skip");
  const createRequest = useMutation(api.requests.createRequest);

  const [trackId, setTrackId] = useState<Id<"tracks"> | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const trackCount = tracks?.length ?? 0;

  const submit = async () => {
    if (sending) return;
    if (!message.trim()) {
      toast.error("Write a short message — say what you want and why they fit.");
      return;
    }
    setSending(true);
    try {
      await createRequest({
        listingId: listing._id,
        trackId: trackId ?? undefined,
        message: message.trim(),
      });
      toast.success(`Request sent to ${listing.name}. They'll see it in their Requests tab.`);
      onOpenChange(false);
      setMessage("");
      setTrackId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't send the request.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/12 bg-[#101018] text-[#ecebf3] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-medium text-white">
            Request {listing.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-white/55">
            ${listing.pricePerUnit} / {listing.unit} · minimum {listing.minQuantity}. You agree on
            the final terms directly with them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Track picker */}
          <div>
            <p className="text-sm font-medium text-white/80">Attach a track</p>
            {tracks === undefined ? (
              <p className="mt-3 text-sm text-white/40">Loading your tracks…</p>
            ) : trackCount === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-white/15 bg-white/[.04] p-4 text-center">
                <Music className="mx-auto size-4 text-white/35" />
                <p className="mt-2 text-xs text-white/55">
                  Post a track first so they can hear what you make.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/dashboard?post=1");
                  }}
                  className="mt-3 border-white/15 bg-white/[.06] text-white/85 hover:bg-white/12 hover:text-white"
                >
                  <Plus className="size-3.5" /> Post a track
                </Button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setTrackId(null)}
                  aria-pressed={trackId === null}
                  className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                    trackId === null
                      ? "border-[#8b6cff] bg-[#8b6cff]/15 text-white"
                      : "border-white/10 bg-white/[.04] text-white/65 hover:border-white/25 hover:text-white"
                  }`}
                >
                  No track — just the message
                </button>
                {tracks.map((track) => (
                  <button
                    key={track._id}
                    type="button"
                    onClick={() => setTrackId(track._id)}
                    aria-pressed={trackId === track._id}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left transition ${
                      trackId === track._id
                        ? "border-[#8b6cff] bg-[#8b6cff]/15"
                        : "border-white/10 bg-white/[.04] hover:border-white/25"
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{track.title}</p>
                    <p className="mt-0.5 truncate text-xs text-white/45">
                      {track.genres.join(" · ") || track.link}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="request-message" className="text-sm font-medium text-white/80">
              Your message
            </label>
            <Textarea
              id="request-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
              placeholder={`Hi ${listing.name.split(" ")[0]} — I have an alt R&B single dropping next month and your edit style fits it perfectly. Are you open to a 3-video package?`}
              rows={4}
              maxLength={MAX_MESSAGE}
              className="mt-2 resize-none border-white/12 bg-black/25 text-white placeholder:text-white/25 focus-visible:ring-[var(--action)]"
            />
            <p className="mt-1 text-right text-[11px] text-white/30">
              {message.length}/{MAX_MESSAGE}
            </p>
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
          <Button
            type="button"
            onClick={submit}
            disabled={sending}
            className="bg-[#8b6cff] text-white hover:bg-[#9a80ff]"
          >
            {sending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Send request <Send className="size-3.5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
