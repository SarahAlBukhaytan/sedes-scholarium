import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ActivityVariant } from "@/lib/labels";
import { ActivityTypeBadge } from "./ActivityTypeBadge";

export interface RelatedItem {
  id: string;
  href: string;
  title: string;
  variant: ActivityVariant;
  meta: string;
  /** Why it is related, e.g. the shared topics. */
  reason: string[];
}

/** Compact list of related activities with the shared topics that connect them. */
export function RelatedContent({ items }: { items: RelatedItem[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {items.map((r) => (
        <li key={r.id}>
          <Link
            href={r.href}
            className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-shadow hover:shadow-lift"
          >
            <div className="flex items-center justify-between gap-2">
              <ActivityTypeBadge variant={r.variant} />
              <span className="text-xs text-muted">{r.meta}</span>
            </div>
            <p className="mt-3 font-semibold leading-7 break-words text-deep group-hover:text-teal">{r.title}</p>
            <p className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs text-muted">
              {r.reason.length > 0 ? (
                <span>
                  <span className="font-semibold text-sand-ink">الموضوعات المشتركة: </span>
                  {r.reason.join("، ")}
                </span>
              ) : (
                <span className="font-semibold text-teal">{r.variant === "workshop" ? "عرض الورشة" : "عرض الجلسة"}</span>
              )}
              <ArrowLeft className="size-4 shrink-0 text-teal" aria-hidden="true" />
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
