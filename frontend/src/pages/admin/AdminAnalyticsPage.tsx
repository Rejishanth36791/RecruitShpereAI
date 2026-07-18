import { Briefcase, Users, FileText, CalendarClock, DollarSign, Building2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminAnalytics } from "@/hooks/useAdmin";
import { formatSalary, splitPascalCase } from "@/lib/utils";

function BreakdownList({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return <p className="text-sm text-ink-faint">No data yet.</p>;
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="space-y-3">
      {entries.map(([label, count]) => (
        <div key={label}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-ink-muted">{splitPascalCase(label)}</span>
            <span className="text-ink font-medium">{count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-base-elevated overflow-hidden">
            <div
              className="h-full bg-brand-gradient rounded-full"
              style={{ width: `${Math.max((count / max) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useAdminAnalytics();

  return (
    <div>
      <PageHeader
        eyebrow="Admin portal"
        title="Analytics"
        description="Platform-wide counts across every user, job posting, application and interview — computed server-side from the full dataset."
      />

      {isLoading || !analytics ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <StatCard label="Total users" value={analytics.totalUsers} icon={Users} tone="violet" />
            <StatCard label="Job postings" value={analytics.totalJobPostings} icon={Briefcase} tone="indigo" />
            <StatCard label="Applications" value={analytics.totalApplications} icon={FileText} tone="cyan" />
            <StatCard label="Interviews" value={analytics.totalInterviews} icon={CalendarClock} tone="success" />
            <StatCard
              label="Avg. disclosed salary"
              value={analytics.averageDisclosedSalary ? formatSalary(analytics.averageDisclosedSalary) : "—"}
              icon={DollarSign}
              tone="warn"
            />
            <StatCard label="Organizations" value={analytics.totalOrganizations} icon={Building2} tone="indigo" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="font-display font-semibold text-ink mb-4">Users by role</h2>
              <BreakdownList
                data={{
                  Candidate: analytics.totalCandidates,
                  Recruiter: analytics.totalRecruiters,
                  HiringManager: analytics.totalHiringManagers,
                  Admin: analytics.totalAdmins,
                }}
              />
            </Card>

            <Card className="p-5">
              <h2 className="font-display font-semibold text-ink mb-4">Jobs by status</h2>
              <BreakdownList data={analytics.jobsByStatus} />
            </Card>

            <Card className="p-5">
              <h2 className="font-display font-semibold text-ink mb-4">Applications by status</h2>
              <BreakdownList data={analytics.applicationsByStatus} />
            </Card>

            <Card className="p-5">
              <h2 className="font-display font-semibold text-ink mb-4">Interviews by status</h2>
              <BreakdownList data={analytics.interviewsByStatus} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
