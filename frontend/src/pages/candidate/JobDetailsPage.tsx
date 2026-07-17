import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Building2, CalendarDays, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useJob } from "@/hooks/useJobs";
import { useSubmitApplication } from "@/hooks/useApplications";
import { extractErrorMessage } from "@/api/client";
import { formatDate, formatSalary } from "@/lib/utils";
import { jobStatusLabel } from "@/types/enums";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJob(id);
  const submitApplication = useSubmitApplication();
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    if (!id) return;
    setError(null);
    try {
      await submitApplication.mutateAsync({ jobPostingId: id });
      setApplied(true);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not submit your application."));
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!job) {
    return <ErrorAlert message="This job posting could not be found." />;
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-ink-muted">
              {job.organization?.name && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> {job.organization.name}
                </span>
              )}
              {job.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" /> {formatSalary(job.salary)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Posted {formatDate(job.createdAt)}
              </span>
            </div>
          </div>
          <StatusBadge status={jobStatusLabel(job.status)} />
        </div>

        <CardContent className="px-0">
          <h2 className="text-sm font-semibold text-ink mb-2 mt-4">Description</h2>
          <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">{job.description}</p>

          {job.requirements && (
            <>
              <h2 className="text-sm font-semibold text-ink mb-2 mt-6">Requirements</h2>
              <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </>
          )}
        </CardContent>

        <div className="mt-4">
          <ErrorAlert message={error} className="mb-4" />
          {applied ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" /> Application submitted — check "My applications" for status.
            </div>
          ) : (
            <Button size="lg" loading={submitApplication.isPending} onClick={handleApply}>
              Apply for this role
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
