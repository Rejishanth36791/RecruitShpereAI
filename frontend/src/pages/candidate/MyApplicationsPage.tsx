import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronDown, Star } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { useMyApplications } from "@/hooks/useApplications";
import { useFeedbackByApplication } from "@/hooks/useFeedback";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { applicationStatusLabel } from "@/types/enums";
import type { Application } from "@/types/api";

function ApplicationRow({ app }: { app: Application }) {
  const [expanded, setExpanded] = useState(false);
  const { data: feedback, isLoading } = useFeedbackByApplication(expanded ? app.id : undefined);

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/candidate/jobs/${app.jobPostingId}`}
            className="font-display font-semibold text-ink hover:text-indigo-accent transition-colors"
          >
            {app.jobPosting?.title ?? "Job posting"}
          </Link>
          <p className="text-xs text-ink-muted mt-1">Applied {formatDate(app.appliedDate)}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={applicationStatusLabel(app.status)} />
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors"
          >
            Feedback <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-base-border/60">
          {isLoading ? (
            <p className="text-sm text-ink-faint">Loading feedback...</p>
          ) : feedback && feedback.length > 0 ? (
            <div className="space-y-2">
              {feedback.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-base-border bg-base-elevated/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    {entry.rating && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn("h-3 w-3", i < (entry.rating ?? 0) ? "fill-warn text-warn" : "text-ink-faint")}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-ink-faint">{formatDateTime(entry.createdAt)}</span>
                  </div>
                  <p className="text-sm text-ink-muted">{entry.comments}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">No feedback recorded on this application yet.</p>
          )}
        </div>
      )}
    </Card>
  );
}

export default function MyApplicationsPage() {
  const { data: applications, isLoading } = useMyApplications();

  return (
    <div>
      <PageHeader
        eyebrow="Candidate portal"
        title="My applications"
        description="Track the status of every role you've applied to."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : applications && applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationRow key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Once you apply to a job, it'll show up here so you can track its progress."
        />
      )}
    </div>
  );
}
