import { Users as UsersIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useAdminUsers } from "@/hooks/useAdmin";
import { getInitials } from "@/lib/utils";

const roleTone: Record<string, "indigo" | "cyan" | "warn" | "neutral"> = {
  Candidate: "indigo",
  Recruiter: "cyan",
  HiringManager: "warn",
  Admin: "neutral",
};

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();

  return (
    <div>
      <PageHeader
        eyebrow="Admin portal"
        title="Users"
        description="Every account registered on RecruitSphere AI."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : users && users.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-base-border/60">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-semibold text-white shrink-0">
                    {getInitials(user.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{user.fullName}</p>
                    <p className="text-xs text-ink-muted truncate">{user.email}</p>
                  </div>
                </div>
                <Badge tone={roleTone[user.role] ?? "neutral"}>{user.role === "HiringManager" ? "Hiring Manager" : user.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState icon={UsersIcon} title="No users found" description="No accounts have been registered yet." />
      )}
    </div>
  );
}
