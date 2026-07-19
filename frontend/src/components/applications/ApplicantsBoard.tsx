import { useState } from "react";
import { Users, CalendarPlus, MessageSquarePlus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useApplicationsByJob, useUpdateApplicationStatus } from "@/hooks/useApplications";
import { ScheduleInterviewModal } from "@/components/interviews/ScheduleInterviewModal";
import { FeedbackModal } from "@/components/applications/FeedbackModal";
import { ApplicationStatus, applicationStatusLabel } from "@/types/enums";
import { formatDate } from "@/lib/utils";

export function ApplicantsBoard({ jobId }: { jobId: string }) {
  const { data: applications, isLoading } = useApplicationsByJob(jobId);
  const updateStatus = useUpdateApplicationStatus();
  const [schedulingFor, setSchedulingFor] = useState<string | null>(null);
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No applicants yet"
        description="Candidates who apply to this role will show up here for review."
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {applications.map((app) => (
          <Card key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-ink">
                Candidate #{app.candidateId.slice(0, 8)}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-ink-muted">
                <span>Applied {formatDate(app.appliedDate)}</span>
                {app.candidate?.experienceYears !== undefined && (
                  <span>{app.candidate.experienceYears} yrs experience</span>
                )}
                {app.candidate?.skills && <span className="truncate max-w-xs">{app.candidate.skills}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={applicationStatusLabel(app.status)} />
              <Select
                value={applicationStatusLabel(app.status)}
                onChange={(e) => updateStatus.mutate({ id: app.id, payload: { status: e.target.value } })}
                className="w-40"
              >
                {ApplicationStatus.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Button variant="secondary" size="sm" onClick={() => setSchedulingFor(app.id)}>
                <CalendarPlus className="h-3.5 w-3.5" /> Interview
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setFeedbackFor(app.id)}>
                <MessageSquarePlus className="h-3.5 w-3.5" /> Feedback
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ScheduleInterviewModal
        applicationId={schedulingFor}
        open={schedulingFor !== null}
        onClose={() => setSchedulingFor(null)}
      />

      <FeedbackModal applicationId={feedbackFor} open={feedbackFor !== null} onClose={() => setFeedbackFor(null)} />
    </>
  );
}
