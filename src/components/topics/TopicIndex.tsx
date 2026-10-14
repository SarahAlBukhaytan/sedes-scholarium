import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Topic } from "@/content/types";
import { countLabel } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { StarGlyph } from "@/components/motif/StarPattern";

export interface TopicIndexItem {
  topic: Topic;
  /** Unique activities connected to the topic (derived). */
  total: number;
}

/**
 * Editorial knowledge index — ONE card system:
 *  - every card has the same width and the same height (`auto-rows-fr`
 *    equalises all rows, so a long title never makes one row taller);
 *  - every card carries the same details (number, star ornament, rule);
 *  - order is the approved editorial order; the number is never a rank;
 *  - the occurrence count is plain text, shown only once links are backed by
 *    the reports (or approved),
 *    and changes nothing visually.
 * Grid: 1 column (phones) → 2 (tablet) → 3 (desktop).
 */
export function TopicIndex({
  items,
  conferenceSlug,
  showCounts,
}: {
  items: TopicIndexItem[];
  conferenceSlug: string;
  /** Only true once topic ↔ activity links are evidence-backed or approved. */
  showCounts: boolean;
}) {
  return (
    <ol className="grid auto-rows-fr gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {items.map(({ topic, total }) => (
        <li key={topic.id} className="min-w-0">
          <Link
            href={routes.topic(conferenceSlug, topic.slug)}
            className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-surface p-6 transition-[box-shadow,border-color] duration-200 hover:border-teal/35 hover:shadow-lift md:p-7"
          >
            {/* the same star ornament on every card */}
            <StarGlyph className="pointer-events-none absolute top-5 left-5 size-6 opacity-60 transition-opacity duration-200 group-hover:opacity-100" />

            <span className="relative flex items-center gap-3">
              <span className="font-display text-sm font-bold text-sand-ink tabular-nums">
                {String(topic.order).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="h-px w-6 bg-blue" />
            </span>

            {/* reserves two lines so titles of any length keep the rhythm */}
            <h2 className="relative mt-6 flex min-h-[5rem] items-start font-display text-xl leading-10 font-bold break-words text-deep">
              {topic.name}
            </h2>
            <p className="relative text-sm text-muted">
              {!showCounts
                ? "ارتباطه بالفعاليات قيد الاعتماد"
                : total > 0
                  ? `ورد في ${countLabel(total, ["فعالية واحدة", "فعاليتين", "فعاليات", "فعالية"])}`
                  : "لم يرد بعد في تقارير الفعاليات"}
            </p>

            <span className="relative mt-auto pt-6">
              <span className="flex items-center gap-1.5 border-t border-line pt-4 text-sm font-semibold text-teal">
                استكشف الموضوع
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
