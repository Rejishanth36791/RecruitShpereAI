import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApplicantsBoard } from "@/components/applications/ApplicantsBoard";
import { useJob } from "@/hooks/useJobs";

export default function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJob(id);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <PageHeader
        eyebrow="Recruiter portal"
        title={isLoading ? "Loading role..." : job?.title ?? "Applicants"}
        description="Review candidates, update their status, and schedule interviews."
      />

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : id ? (
        <ApplicantsBoard jobId={id} />
      ) : null}
    </div>
  );
}
