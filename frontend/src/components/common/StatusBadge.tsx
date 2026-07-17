import { Badge } from "@/components/ui/Badge";
import { splitPascalCase } from "@/lib/utils";

const toneMap: Record<string, "success" | "danger" | "warn" | "indigo" | "cyan" | "neutral"> = {
  // Job status
  Draft: "neutral",
  Published: "success",
  Closed: "warn",
  Archived: "neutral",
  // Application status
  Submitted: "indigo",
  UnderReview: "cyan",
  Interviewing: "warn",
  Accepted: "success",
  Rejected: "danger",
  // Interview status
  Scheduled: "indigo",
  Completed: "success",
  Cancelled: "danger",
  NoShow: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = toneMap[status] ?? "neutral";
  return <Badge tone={tone}>{splitPascalCase(status)}</Badge>;
}
