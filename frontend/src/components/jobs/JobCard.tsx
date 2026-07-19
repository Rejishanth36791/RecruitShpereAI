import { MapPin, DollarSign, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate, formatSalary } from "@/lib/utils";
import { jobStatusLabel } from "@/types/enums";
import type { JobPosting } from "@/types/api";

export function JobCard({
  job,
  action,
  showStatus = false,
}: {
  job: JobPosting;
  action?: React.ReactNode;
  showStatus?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="min-w-0">
          <CardTitle className="truncate">{job.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-ink-muted">
            {job.organization?.name && (
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> {job.organization.name}
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" /> {formatSalary(job.salary)}
            </span>
          </div>
        </div>
        {showStatus && <StatusBadge status={jobStatusLabel(job.status)} />}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-ink-muted line-clamp-3">{job.description}</p>
        <p className="text-xs text-ink-faint mt-3">Posted {formatDate(job.createdAt)}</p>
      </CardContent>
      {action && <div className="p-5 pt-0 flex items-center gap-2">{action}</div>}
    </Card>
  );
}
