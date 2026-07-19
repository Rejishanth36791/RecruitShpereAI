import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label, Textarea } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useFeedbackByApplication, useSubmitFeedback } from "@/hooks/useFeedback";
import { extractErrorMessage } from "@/api/client";
import { cn, formatDateTime } from "@/lib/utils";

export function FeedbackModal({
  applicationId,
  open,
  onClose,
}: {
  applicationId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const submitFeedback = useSubmitFeedback();
  const { data: history, isLoading: loadingHistory } = useFeedbackByApplication(applicationId ?? undefined);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!applicationId) return;
    setError(null);
    try {
      await submitFeedback.mutateAsync({ applicationId, comments, rating });
      setComments("");
      setRating(undefined);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not save this feedback."));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Candidate feedback" description="Visible to other reviewers on this application.">
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <ErrorAlert message={error} />

        <div>
          <Label htmlFor="comments">Your feedback</Label>
          <Textarea
            id="comments"
            required
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="How did this candidate perform? What stood out?"
          />
        </div>

        <div>
          <Label>Rating (optional)</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(rating === value ? undefined : value)}
                className="p-1"
                aria-label={`Rate ${value} out of 5`}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    rating && value <= rating ? "fill-warn text-warn" : "text-ink-faint",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" loading={submitFeedback.isPending} disabled={!comments.trim()}>
          Save feedback
        </Button>
      </form>

      <div className="border-t border-base-border/60 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-3">Previous feedback</p>
        {loadingHistory ? (
          <p className="text-sm text-ink-faint">Loading...</p>
        ) : history && history.length > 0 ? (
          <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin pr-1">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-base-border bg-base-elevated/50 p-3">
                <div className="flex items-center justify-between mb-1">
                  {entry.rating && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn("h-3 w-3", i < (entry.rating ?? 0) ? "fill-warn text-warn" : "text-ink-faint")}
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-xs text-ink-faint">{formatDateTime(entry.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-muted">{entry.comments}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-faint">No feedback recorded yet.</p>
        )}
      </div>
    </Modal>
  );
}
