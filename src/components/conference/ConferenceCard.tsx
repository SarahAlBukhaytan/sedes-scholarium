import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import type { Conference } from "@/content/types";
import { routes } from "@/lib/routes";
import { ConferenceVisual } from "./ConferenceVisual";

/**
 * Conference card.
 * Header: conference name + partnership + date. Body: official theme,
 * approved description, location, and counts derived from the program data.
 */
export function ConferenceCard({
  conference,
  stats,
}: {
  conference: Conference;
  /** Quick preview numbers — derived from structured data only. */
  stats?: { label: string; value: number }[];
}) {
  return (
    <article className="card group relative grid overflow-hidden transition-shadow hover:shadow-lift md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <ConferenceVisual conference={conference} className="min-h-48 md:min-h-full" />
      <div className="flex flex-col">
        {/* Header */}
        <header className="border-b border-line px-6 py-6 md:px-9">
          {/* 1 — conference name: the largest, most prominent line */}
          <h2 className="font-display text-2xl leading-snug font-bold text-deep md:text-[1.85rem]">
            <Link
              href={routes.conference(conference.slug)}
              className="after:absolute after:inset-0 after:rounded-[var(--radius-card)]"
            >
              {conference.title}
            </Link>
          </h2>
          {/* 2 — partnership, smaller and clear */}
          <p className="mt-1.5 text-[0.95rem] leading-7 text-muted">بالشراكة مع {conference.partner}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-sand-ink">
            <CalendarDays className="size-4" aria-hidden="true" />
            {conference.dateLabelShort ?? conference.dateLabel}
          </p>
        </header>

        {/* Body */}
        <div className="flex flex-1 flex-col px-6 py-6 md:px-9 md:py-7">
          {/* 3 — theme: a medium secondary heading */}
          {conference.theme && (
            <p className="font-display text-xl leading-snug font-bold text-teal md:text-[1.35rem]">{conference.theme}</p>
          )}
          <p className="mt-4 leading-8 text-ink/85">{conference.summary}</p>
          <p className="mt-4 flex items-start gap-1.5 text-sm leading-7 text-muted">
            <MapPin className="mt-1.5 size-4 shrink-0 text-teal" aria-hidden="true" />
            <span>
              {conference.city}
              <br />
              {conference.venue}
            </span>
          </p>
          {stats && (
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dd className="font-display text-2xl leading-none font-bold text-deep tabular-nums">{s.value}</dd>
                  <dt className="order-last mt-1.5 text-xs text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          )}
          <span className="mt-7 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-deep px-6 py-2.5 text-sm font-semibold text-ivory transition-colors group-hover:bg-teal">
            استكشف المؤتمر
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
