import { CalendarClock, Video } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { useMyInterviews } from "@/hooks/useInterviews";
import { formatDateTime } from "@/lib/utils";
import { interviewStatusLabel } from "@/types/enums";

export default function MyInterviewsPage() {
  const { data: interviews, isLoading } = useMyInterviews();

  return (
    <div>
      <PageHeader
        eyebrow="Candidate portal"
        title="My interviews"
        description="Upcoming and past interviews scheduled by recruiters."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : interviews && interviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <Card key={interview.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display font-semibold text-ink">
                  {interview.application?.jobPosting?.title ?? "Interview"}
                </p>
                <p className="text-xs text-ink-muted mt-1 inline-flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" /> {formatDateTime(interview.scheduledDate)}
                </p>
                {interview.meetingLink && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-accent inline-flex items-center gap-1.5 mt-1 hover:underline"
                  >
                    <Video className="h-3.5 w-3.5" /> {interview.meetingLink}
                  </a>
                )}
              </div>
              <StatusBadge status={interviewStatusLabel(interview.status)} />
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarClock}
          title="No interviews scheduled"
          description="When a recruiter schedules an interview for one of your applications, it'll appear here."
        />
      )}
    </div>
  );
}
