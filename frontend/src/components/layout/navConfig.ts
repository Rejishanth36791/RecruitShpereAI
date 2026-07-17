import {
  LayoutDashboard,
  Search,
  FileText,
  CalendarClock,
  Sparkles,
  PlusCircle,
  Briefcase,
  Users,
  ClipboardCheck,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const navByRole: Record<string, NavItem[]> = {
  Candidate: [
    { label: "Dashboard", to: "/candidate", icon: LayoutDashboard, end: true },
    { label: "Find jobs", to: "/candidate/jobs", icon: Search },
    { label: "My applications", to: "/candidate/applications", icon: FileText },
    { label: "My interviews", to: "/candidate/interviews", icon: CalendarClock },
    { label: "AI tools", to: "/candidate/ai-tools", icon: Sparkles },
  ],
  Recruiter: [
    { label: "Dashboard", to: "/recruiter", icon: LayoutDashboard, end: true },
    { label: "Post a job", to: "/recruiter/jobs/new", icon: PlusCircle },
    { label: "My job postings", to: "/recruiter/jobs", icon: Briefcase,end: true },
  ],
  HiringManager: [
    { label: "Dashboard", to: "/manager", icon: LayoutDashboard, end: true },
    { label: "Review candidates", to: "/manager/applications", icon: ClipboardCheck },
  ],
  Admin: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "All job postings", to: "/admin/jobs", icon: Briefcase },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  ],
};

export const roleAccent: Record<string, string> = {
  Candidate: "indigo",
  Recruiter: "cyan",
  HiringManager: "warn",
  Admin: "violet",
};

export const roleIcon: Record<string, LucideIcon> = {
  Candidate: Users,
  Recruiter: Briefcase,
  HiringManager: ClipboardCheck,
  Admin: ShieldCheck,
};
