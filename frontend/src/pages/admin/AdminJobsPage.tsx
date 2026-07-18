import { Briefcase } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { JobCard } from "@/components/jobs/JobCard";
import { useAllJobs } from "@/hooks/useJobs";

export default function AdminJobsPage() {
  const { data: jobs, isLoading } = useAllJobs();

  return (
    <div>
      <PageHeader
        eyebrow="Admin portal"
        title="All job postings"
        description="Every published role across the platform. The API currently only exposes published listings here — draft/closed/archived postings live under each recruiter's own dashboard."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} showStatus />
          ))}
        </div>
      ) : (
        <EmptyState icon={Briefcase} title="No published jobs" description="Nothing published on the platform yet." />
      )}
    </div>
  );
}
