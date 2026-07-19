import { Link } from "react-router-dom";
import { Briefcase, PlusCircle, ArrowRight, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useMyJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { jobStatusLabel } from "@/types/enums";
import { formatDate } from "@/lib/utils";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { data: jobs, isLoading } = useMyJobs();

  const published = jobs?.filter((j) => jobStatusLabel(j.status) === "Published").length ?? 0;
  const closed = jobs?.filter((j) => jobStatusLabel(j.status) === "Closed").length ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="Recruiter portal"
        title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? ""}`}
        description="Manage your pipeline and get new roles in front of candidates fast."
        action={
          <Link to="/recruiter/jobs/new">
            <Button>
              <PlusCircle className="h-4 w-4" /> Post a job
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Total postings" value={isLoading ? "—" : jobs?.length ?? 0} icon={Briefcase} tone="indigo" />
        <StatCard label="Published" value={isLoading ? "—" : published} icon={TrendingUp} tone="cyan" />
        <StatCard label="Closed" value={isLoading ? "—" : closed} icon={Briefcase} tone="warn" />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-ink">Your postings</h2>
          <Link to="/recruiter/jobs" className="text-sm text-indigo-accent hover:underline inline-flex items-center gap-1">
            Manage all <ArrowRight className="h-3.5 w-3.5" />
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
              <Link
                key={job.id}
                to={`/recruiter/jobs/${job.id}/applicants`}
                className="flex items-center justify-between rounded-xl border border-base-border bg-base-elevated/40 px-4 py-3 hover:border-indigo-accent/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{job.title}</p>
                  <p className="text-xs text-ink-faint">Posted {formatDate(job.createdAt)}</p>
                </div>
                <StatusBadge status={jobStatusLabel(job.status)} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">You haven't posted any jobs yet.</p>
        )}
      </Card>
    </div>
  );
}
