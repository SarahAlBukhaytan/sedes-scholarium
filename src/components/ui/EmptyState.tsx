import type { LucideIcon } from "lucide-react";
import { Hourglass } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Calm, intentional state for content that does not exist yet
 * (pending documentation, no results, empty lists).
 */
export function EmptyState({
  icon: Icon = Hourglass,
  title,
  children,
  action,
  variant = "pending",
  compact = false,
}: {
  icon?: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  variant?: "pending" | "empty";
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-dashed ${
        variant === "pending" ? "border-sand/70 bg-sand-soft/40" : "border-line-strong bg-surface"
      } ${compact ? "p-5" : "p-7 md:p-8"}`}
    >
      <div className="flex gap-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
            variant === "pending" ? "bg-sand-soft text-sand-ink" : "bg-surface-muted text-muted"
          }`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-deep">{title}</p>
          {children && <div className="mt-1.5 text-sm leading-7 text-muted">{children}</div>}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  );
}
