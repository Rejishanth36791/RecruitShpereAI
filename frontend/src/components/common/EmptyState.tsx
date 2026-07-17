import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="h-12 w-12 rounded-2xl bg-brand-gradient-soft flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-indigo-accent" />
      </div>
      <h3 className="font-display font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
