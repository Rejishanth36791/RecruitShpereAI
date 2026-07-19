import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useUpdateJob } from "@/hooks/useJobs";
import { extractErrorMessage } from "@/api/client";
import type { JobPosting } from "@/types/api";

export function EditJobModal({ job, open, onClose }: { job: JobPosting | null; open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updateJob = useUpdateJob();

  // Re-populate the form whenever a different job is opened for editing.
  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description);
      setRequirements(job.requirements ?? "");
      setLocation(job.location ?? "");
      setSalary(job.salary != null ? String(job.salary) : "");
      setError(null);
    }
  }, [job]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!job) return;
    setError(null);
    try {
      await updateJob.mutateAsync({
        id: job.id,
        payload: {
          title,
          description,
          requirements: requirements || undefined,
          location: location || undefined,
          salary: salary ? Number(salary) : undefined,
        },
      });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not save these changes."));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit job posting" description="Changes are visible to candidates immediately.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorAlert message={error} />

        <div>
          <Label htmlFor="edit-title">Job title</Label>
          <Input id="edit-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-location">Location</Label>
            <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-salary">Salary (annual, USD)</Label>
            <Input
              id="edit-salary"
              type="number"
              min={0}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[140px]"
          />
        </div>

        <div>
          <Label htmlFor="edit-requirements">Requirements (optional)</Label>
          <Textarea id="edit-requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} />
        </div>

        <Button type="submit" className="w-full" loading={updateJob.isPending}>
          Save changes
        </Button>
      </form>
    </Modal>
  );
}
