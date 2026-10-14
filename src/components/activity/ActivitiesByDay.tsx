import type { ConferenceBundle } from "@/lib/content";
import type { Activity } from "@/content/types";
import { toActivityCardData } from "@/lib/view-models";
import { ActivityCard } from "./ActivityCard";

/**
 * Activities grouped by conference day, in schedule order — the natural
 * structure for category pages (no filters needed at this content volume).
 */
export function ActivitiesByDay({ bundle, activities }: { bundle: ConferenceBundle; activities: Activity[] }) {
  const days = bundle.conference.days
    .map((d) => ({ day: d, items: activities.filter((a) => a.dayId === d.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-14">
      {days.map(({ day, items }) => {
        const headingId = `${day.id}-h`;
        // "30 سبتمبر 2026" → "30 سبتمبر" for a lighter heading.
        const shortDate = day.dateLabel.replace(/\s*\d{4}$/, "");
        return (
          <section key={day.id} aria-labelledby={headingId}>
            <h2 id={headingId} className="flex items-center gap-4 font-display text-lg font-bold text-deep md:text-xl">
              {day.label} — {shortDate}
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {items.map((a) => (
                <li key={a.id}>
                  <ActivityCard data={toActivityCardData(bundle, a)} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
