import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "secondary";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
          variant === "default" &&
            "bg-[var(--accent-soft)] text-[var(--text-primary)]",
          variant === "success" &&
            "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
          variant === "warning" &&
            "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
          variant === "error" &&
            "bg-[var(--status-error-bg)] text-[var(--status-error-text)]",
          variant === "secondary" &&
            "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
