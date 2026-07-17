import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-8 w-8 shrink-0 rounded-lg bg-brand-gradient shadow-glow flex items-center justify-center">
        <span className="text-white font-display font-bold text-sm">RS</span>
      </div>
      {!iconOnly && (
        <span className="font-display font-semibold text-ink text-lg tracking-tight">
          RecruitSphere<span className="text-gradient"> AI</span>
        </span>
      )}
    </div>
  );
}
