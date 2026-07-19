import { useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, PlusCircle, Users, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { JobCard } from "@/components/jobs/JobCard";
import { EditJobModal } from "@/components/jobs/EditJobModal";
import { useMyJobs, useUpdateJobStatus, useDeleteJob } from "@/hooks/useJobs";
import { JobStatus, jobStatusLabel } from "@/types/enums";
import type { JobPosting } from "@/types/api";

export default function MyJobsPage() {
  const { data: jobs, isLoading } = useMyJobs();
  const updateStatus = useUpdateJobStatus();
  const deleteJob = useDeleteJob();

  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);

  async function handleConfirmDelete() {
    if (!deletingJob) return;
    await deleteJob.mutateAsync(deletingJob.id);
    setDeletingJob(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Recruiter portal"
        title="My job postings"
        description="Manage the roles you've published and jump into each candidate pipeline."
        action={
          <Link to="/recruiter/jobs/new">
            <Button>
              <PlusCircle className="h-4 w-4" /> Post a job
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showStatus
              action={
                <div className="flex w-full flex-wrap gap-2">
                  <Select
                    value={jobStatusLabel(job.status)}
                    onChange={(e) => updateStatus.mutate({ id: job.id, payload: { status: e.target.value } })}
                    className="flex-1 min-w-[120px]"
                  >
                    {JobStatus.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                  <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                    <Button variant="secondary" size="icon" aria-label="View applicants">
                      <Users className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="secondary" size="icon" aria-label="Edit job" onClick={() => setEditingJob(job)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" aria-label="Delete job" onClick={() => setDeletingJob(job)}>
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No job postings yet"
          description="Post your first role to start receiving applications."
          action={
            <Link to="/recruiter/jobs/new">
              <Button>Post a job</Button>
            </Link>
          }
        />
      )}

      <EditJobModal job={editingJob} open={editingJob !== null} onClose={() => setEditingJob(null)} />

      <ConfirmDialog
        open={deletingJob !== null}
        onClose={() => setDeletingJob(null)}
        onConfirm={handleConfirmDelete}
        title="Delete this job posting?"
        description={`"${deletingJob?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleteJob.isPending}
      />
    </div>
  );
}
