import { Link } from "react-router-dom";
import { Briefcase, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";
import { useAllJobs } from "@/hooks/useJobs";

export default function ManagerJobsPage() {
  const { data: jobs, isLoading } = useAllJobs();

  return (
    <div>
      <PageHeader
        eyebrow="Hiring manager portal"
        title="Review candidates"
        description="Pick a role to see its applicants, update their status, and give feedback."
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
            <JobCard
              key={job.id}
              job={job}
              action={
                <Link to={`/manager/jobs/${job.id}/applicants`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    <ClipboardCheck className="h-4 w-4" /> Review applicants
                  </Button>
                </Link>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={Briefcase} title="No published jobs" description="There are no open roles to review right now." />
      )}
    </div>
  );
}
