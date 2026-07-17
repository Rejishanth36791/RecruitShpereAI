import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-accent mb-1.5">{eyebrow}</p>
        )}
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">{title}</h1>
        {description && <p className="text-ink-muted mt-1.5 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
