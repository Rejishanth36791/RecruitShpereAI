import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "indigo" | "cyan" | "success" | "danger" | "warn";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-base-elevated text-ink-muted border-base-border",
  indigo: "bg-indigo-accent/10 text-indigo-accent border-indigo-accent/30",
  cyan: "bg-cyan-accent/10 text-cyan-accent border-cyan-accent/30",
  success: "bg-success/10 text-success border-success/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  warn: "bg-warn/10 text-warn border-warn/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
