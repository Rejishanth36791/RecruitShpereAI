import { Link } from "react-router-dom";
import { Briefcase, ClipboardCheck, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAllJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { data: jobs, isLoading } = useAllJobs();

  return (
    <div>
      <PageHeader
        eyebrow="Hiring manager portal"
        title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? ""}`}
        description="Review candidates across every open role and keep the pipeline moving."
      />

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <StatCard label="Published roles" value={isLoading ? "—" : jobs?.length ?? 0} icon={Briefcase} tone="warn" />
        <StatCard label="Awaiting review" value="See per role" icon={ClipboardCheck} tone="indigo" />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-ink">Open roles</h2>
          <Link to="/manager/applications" className="text-sm text-indigo-accent hover:underline inline-flex items-center gap-1">
            Review candidates <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-2">
            {jobs.slice(0, 6).map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-xl border border-base-border bg-base-elevated/40 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{job.title}</p>
                  <p className="text-xs text-ink-faint">Posted {formatDate(job.createdAt)}</p>
                </div>
                <Link to={`/manager/jobs/${job.id}/applicants`}>
                  <Button variant="secondary" size="sm">
                    Review
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No published roles right now.</p>
        )}
      </Card>
    </div>
  );
}
