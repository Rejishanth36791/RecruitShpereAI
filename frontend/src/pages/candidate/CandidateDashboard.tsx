import { Link } from "react-router-dom";
import { FileText, CalendarClock, Search, Sparkles, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMyApplications } from "@/hooks/useApplications";
import { useMyInterviews } from "@/hooks/useInterviews";
import { useAuth } from "@/hooks/useAuth";
import { applicationStatusLabel } from "@/types/enums";
import { formatDate } from "@/lib/utils";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const { data: applications, isLoading: loadingApps } = useMyApplications();
  const { data: interviews, isLoading: loadingInterviews } = useMyInterviews();

  const activeApplications = applications?.filter((a) => applicationStatusLabel(a.status) !== "Rejected").length ?? 0;
  const upcomingInterviews =
    interviews?.filter((i) => new Date(i.scheduledDate).getTime() > Date.now()).length ?? 0;

  return (
    <div>
      <PageHeader eyebrow="Candidate portal" title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? ""}`} description="Here's where things stand with your job search." />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Applications" value={loadingApps ? "—" : applications?.length ?? 0} icon={FileText} tone="indigo" />
        <StatCard label="Active" value={loadingApps ? "—" : activeApplications} icon={Sparkles} tone="cyan" />
        <StatCard label="Upcoming interviews" value={loadingInterviews ? "—" : upcomingInterviews} icon={CalendarClock} tone="success" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink">Recent applications</h2>
            <Link to="/candidate/applications" className="text-sm text-indigo-accent hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {loadingApps ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="space-y-2">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-xl border border-base-border bg-base-elevated/40 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{app.jobPosting?.title ?? "Job posting"}</p>
                    <p className="text-xs text-ink-faint">Applied {formatDate(app.appliedDate)}</p>
                  </div>
                  <StatusBadge status={applicationStatusLabel(app.status)} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">No applications yet — start by browsing open roles.</p>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-semibold text-ink mb-4">Quick actions</h2>
          <div className="space-y-2">
            <Link to="/candidate/jobs" className="flex items-center gap-3 rounded-xl border border-base-border bg-base-elevated/40 px-4 py-3 hover:border-indigo-accent/40 transition-colors">
              <Search className="h-4 w-4 text-indigo-accent" />
              <span className="text-sm text-ink">Search open jobs</span>
            </Link>
            <Link to="/candidate/ai-tools" className="flex items-center gap-3 rounded-xl border border-base-border bg-base-elevated/40 px-4 py-3 hover:border-indigo-accent/40 transition-colors">
              <Sparkles className="h-4 w-4 text-indigo-accent" />
              <span className="text-sm text-ink">Run AI resume tools</span>
            </Link>
            <Link to="/candidate/interviews" className="flex items-center gap-3 rounded-xl border border-base-border bg-base-elevated/40 px-4 py-3 hover:border-indigo-accent/40 transition-colors">
              <CalendarClock className="h-4 w-4 text-indigo-accent" />
              <span className="text-sm text-ink">Check interview schedule</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
