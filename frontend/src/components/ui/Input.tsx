import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("block text-sm font-medium text-ink-muted mb-1.5", className)} {...props} />
  ),
);
Label.displayName = "Label";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      onWheel={(e) => e.currentTarget.blur()}
      className={cn(
        "flex h-11 w-full rounded-xl border border-base-border bg-base-elevated/70 px-3.5 text-sm text-ink placeholder:text-ink-faint transition-all duration-150",
        "focus:outline-none focus:border-indigo-accent/60 focus:ring-4 focus:ring-indigo-accent/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-xl border border-base-border bg-base-elevated/70 px-3.5 py-3 text-sm text-ink placeholder:text-ink-faint transition-all duration-150 min-h-[110px] resize-y",
        "focus:outline-none focus:border-indigo-accent/60 focus:ring-4 focus:ring-indigo-accent/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-base-border bg-base-elevated/70 px-3.5 text-sm text-ink transition-all duration-150 appearance-none",
        "focus:outline-none focus:border-indigo-accent/60 focus:ring-4 focus:ring-indigo-accent/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
