import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatTimeRange } from "@/lib/labels";
import type { ActivityCardData } from "@/lib/view-models";
import { ActivityTypeBadge } from "./ActivityTypeBadge";

/**
 * Shared card for sessions and workshops. Used on category pages, where the
 * day is already given by the section heading (pass `showDay` elsewhere).
 */
export function ActivityCard({
  data,
  headingLevel = "h3",
  showDay = false,
}: {
  data: ActivityCardData;
  headingLevel?: "h2" | "h3";
  showDay?: boolean;
}) {
  const H = headingLevel;
  const isWorkshop = data.variant === "workshop";
  const meta = [
    showDay ? data.dayLabel : null,
    formatTimeRange(data.start, data.end),
    data.location,
  ].filter(Boolean);

  return (
    <article className="card group relative flex h-full flex-col p-5 transition-shadow duration-200 hover:shadow-lift md:p-6">
      <div className="self-start">
        <ActivityTypeBadge variant={data.variant} label={data.programLabel} />
      </div>

      <H className="mt-3.5 text-lg leading-8 font-bold break-words text-deep md:text-xl md:leading-9">
        <Link href={data.href} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]">
          {data.title}
        </Link>
      </H>

      {meta.length > 0 && <p className="mt-1.5 text-sm font-medium text-teal tabular-nums">{meta.join(" · ")}</p>}

      <p className="mt-2 text-sm leading-7">
        <span className="text-muted">{isWorkshop ? "مقدّم/ة الورشة: " : "المتحدثون: "}</span>
        {data.speakers.length > 0 ? (
          <span className="text-ink">{data.speakers.join("، ")}</span>
        ) : (
          <span className="text-muted">{data.speakersPending ? "تُستكمل من البرنامج الرسمي" : "—"}</span>
        )}
      </p>

      {data.topics.length > 0 && (
        <div className="relative z-10 mt-4">
          <p id={`${data.id}-topics`} className="text-xs font-semibold text-sand-ink">
            أبرز الموضوعات
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-labelledby={`${data.id}-topics`}>
            {data.topics.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.href}
                  className="inline-flex min-h-8 items-center rounded-full border border-teal/15 bg-teal-soft/60 px-3 text-xs text-deep transition-colors hover:border-teal/40 hover:bg-teal-soft"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action pinned to the card foot so cards in a row align. */}
      <div className="mt-auto pt-5" aria-hidden="true">
        <span className="flex items-center gap-1.5 border-t border-line pt-4 text-sm font-semibold text-teal">
          {isWorkshop ? "عرض الورشة" : "عرض الجلسة"}
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>
    </article>
  );
}
