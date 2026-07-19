import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useScheduleInterview } from "@/hooks/useInterviews";
import { extractErrorMessage } from "@/api/client";

export function ScheduleInterviewModal({
  applicationId,
  open,
  onClose,
}: {
  applicationId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [scheduledDate, setScheduledDate] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scheduleInterview = useScheduleInterview();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!applicationId) return;
    setError(null);
    try {
      await scheduleInterview.mutateAsync({
        applicationId,
        scheduledDate: new Date(scheduledDate).toISOString(),
        mode,
      });
      setScheduledDate("");
      setMode("");
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not schedule this interview."));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule interview" description="The candidate will see this on their interviews page.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert message={error} />
        <div>
          <Label htmlFor="scheduledDate">Date &amp; time</Label>
          <Input
            id="scheduledDate"
            type="datetime-local"
            required
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="mode">Meeting link / mode</Label>
          <Input
            id="mode"
            required
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            placeholder="https://meet.google.com/... or 'On-site, HQ'"
          />
        </div>
        <Button type="submit" className="w-full" loading={scheduleInterview.isPending}>
          Schedule interview
        </Button>
      </form>
    </Modal>
  );
}
