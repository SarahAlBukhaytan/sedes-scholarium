import { Hourglass } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Quiet one-line state for a section whose official content is not yet
 * available ("قيد التوثيق"). Deliberately unboxed to avoid visual clutter.
 */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 text-sm leading-7 text-muted">
      <Hourglass className="mt-1.5 size-4 shrink-0 text-sand-ink" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
