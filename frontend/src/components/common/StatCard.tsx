import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses = {
  indigo: "from-indigo-accent/20 to-transparent text-indigo-accent",
  cyan: "from-cyan-accent/20 to-transparent text-cyan-accent",
  success: "from-success/20 to-transparent text-success",
  warn: "from-warn/20 to-transparent text-warn",
  violet: "from-violet-accent/20 to-transparent text-violet-accent",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "indigo",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <div className="glass-panel p-5 relative overflow-hidden">
      <div className={cn("absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl", toneClasses[tone])} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-display font-bold text-ink mt-1.5">{value}</p>
        </div>
        <div className={cn("h-10 w-10 rounded-xl bg-base-elevated border border-base-border flex items-center justify-center", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
