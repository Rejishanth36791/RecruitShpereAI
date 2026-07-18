import { Link } from "react-router-dom";
import { Briefcase, Users, FileText, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAllJobs } from "@/hooks/useJobs";
import { useAdminAnalytics } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { jobStatusLabel } from "@/types/enums";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: jobs, isLoading: loadingJobs } = useAllJobs();
  const { data: analytics, isLoading: loadingAnalytics } = useAdminAnalytics();

  return (
    <div>
      <PageHeader
        eyebrow="Admin portal"
        title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? ""}`}
        description="A platform-wide view of what's live on RecruitSphere AI."
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Total users" value={loadingAnalytics ? "—" : analytics?.totalUsers ?? 0} icon={Users} tone="violet" />
        <StatCard
          label="Job postings (all)"
          value={loadingAnalytics ? "—" : analytics?.totalJobPostings ?? 0}
          icon={Briefcase}
          tone="indigo"
        />
        <StatCard
          label="Applications"
          value={loadingAnalytics ? "—" : analytics?.totalApplications ?? 0}
          icon={FileText}
          tone="cyan"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2 mb-8">
        <Link to="/admin/users" className="glass-panel p-5 flex items-center justify-between hover:border-indigo-accent/40 transition-colors">
          <div>
            <p className="font-display font-semibold text-ink">Manage users</p>
            <p className="text-sm text-ink-muted mt-1">View every account across all four roles.</p>
          </div>
          <ArrowRight className="h-4 w-4 text-indigo-accent" />
        </Link>
        <Link to="/admin/analytics" className="glass-panel p-5 flex items-center justify-between hover:border-indigo-accent/40 transition-colors">
          <div>
            <p className="font-display font-semibold text-ink">Full analytics</p>
            <p className="text-sm text-ink-muted mt-1">Breakdowns by role, job status, and pipeline stage.</p>
          </div>
          <ArrowRight className="h-4 w-4 text-indigo-accent" />
        </Link>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-ink">Recently published jobs</h2>
          <Link to="/admin/jobs" className="text-sm text-indigo-accent hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loadingJobs ? (
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
                <StatusBadge status={jobStatusLabel(job.status)} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No published jobs yet.</p>
        )}
      </Card>
    </div>
  );
}
