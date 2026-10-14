import Link from "next/link";
import type { ConferenceBundle } from "@/lib/content";
import { getActivities } from "@/lib/content";
import { activityVariant, formatTime, formatTimeRange } from "@/lib/labels";
import { routes } from "@/lib/routes";
import { ActivityTypeBadge } from "@/components/activity/ActivityTypeBadge";

type Row =
  | { kind: "program"; id: string; start?: string; end?: string; title: string; note?: string }
  | { kind: "activities"; start: string; items: ReturnType<typeof getActivities> };

/** Day-by-day program: ceremonies and breaks interleaved with parallel activities. */
export function ProgramTimeline({ bundle }: { bundle: ConferenceBundle }) {
  const c = bundle.conference;
  const all = getActivities(bundle);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
      {c.days.map((day) => {
        const slots = new Map<string, typeof all>();
        for (const a of all.filter((x) => x.dayId === day.id)) {
          const key = a.start ?? "";
          slots.set(key, [...(slots.get(key) ?? []), a]);
        }
        const rows: Row[] = [
          ...c.programItems
            .filter((p) => p.dayId === day.id)
            .map((p) => ({ kind: "program" as const, ...p })),
          ...[...slots.entries()].map(([start, items]) => ({ kind: "activities" as const, start, items })),
        ].sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));

        return (
          <section key={day.id} aria-labelledby={`${day.id}-h`} className="card overflow-hidden">
            <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 bg-deep px-4 py-4 text-ivory md:px-5">
              <h3 id={`${day.id}-h`} className="font-display text-xl font-bold md:text-2xl">
                {day.label}
              </h3>
              <p className="text-base font-semibold text-sand">
                {day.weekday} {day.dateLabel}
              </p>
            </header>
            <ol className="divide-y divide-line">
              {rows.map((row, i) =>
                row.kind === "program" ? (
                  <li key={row.id} className="grid gap-0.5 px-4 py-3.5 text-[0.95rem] md:grid-cols-[6.5rem_1fr] md:gap-4 md:px-5">
                    <span className="text-sm tabular-nums text-muted md:text-[0.95rem]">{row.start ? formatTime(row.start) : row.note}</span>
                    <span className="text-muted">
                      {row.title}
                      {row.start && row.end && (
                        <span className="sr-only"> ({formatTimeRange(row.start, row.end)})</span>
                      )}
                    </span>
                  </li>
                ) : (
                  <li key={`slot-${i}`} className="grid gap-2 px-4 py-4 md:grid-cols-[6.5rem_1fr] md:gap-4 md:px-5">
                    {/* phones: the time sits above its activities; desktop: a time column */}
                    <span className="text-lg font-bold tabular-nums text-teal md:pt-1 md:text-deep">
                      {formatTime(row.start)}
                    </span>
                    <ul className="space-y-3">
                      {row.items.map((a) => (
                        <li key={a.id}>
                          <Link
                            href={routes.activity(c.slug, a.slug)}
                            className="group block rounded-lg border border-transparent p-2 -m-2 hover:border-line hover:bg-surface"
                          >
                            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              <ActivityTypeBadge variant={activityVariant(a)} />
                              {a.location && <span className="text-sm text-muted">{a.location}</span>}
                              <span className="text-sm tabular-nums text-muted">
                                حتى {formatTime(a.end)}
                              </span>
                            </span>
                            <span className="mt-1.5 block text-[1.05rem] leading-8 font-bold break-words text-deep group-hover:text-teal md:text-[1.1rem]">
                              {a.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ),
              )}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
