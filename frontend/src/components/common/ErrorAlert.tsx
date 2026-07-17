import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorAlert({ message, className }: { message: string | null | undefined; className?: string }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger",
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
