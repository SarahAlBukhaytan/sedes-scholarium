import { getBackend } from "@/lib/analytics/store";
import { calendarSeed } from "@/content/calendar";
import { byStart, cleanEvent, type CalendarEvent } from "./calendar-shared";

export * from "./calendar-shared";

/**
 * تقويم المؤتمرات — data for the conference calendar page.
 *
 * Where the list lives
 *   - Once anything is saved from «لوحة الإدارة ← تقويم المؤتمرات», the whole
 *     list is kept in the data store (Upstash Redis on Vercel, .data/ locally)
 *     under the record calendar → events, and the page shows it immediately.
 *   - Until then, the verified starting list in src/content/calendar.ts.
 *
 * Dates are calendar dates in Riyadh time (UTC+3, no daylight saving).
 * `startTime` is set ONLY when the organiser has published an opening hour;
 * without it the countdown shows days only.
 */

const KEY = "calendar";
const FIELD = "events";

export async function getCalendarEvents(): Promise<{ events: CalendarEvent[]; source: "store" | "seed" }> {
  const store = getBackend();
  if (store) {
    try {
      const json = (await store.hgetRecords(KEY))[FIELD];
      if (json) {
        const list = (JSON.parse(json) as Record<string, unknown>[])
          .map((r) => cleanEvent(r))
          .flatMap((r) => (r.ok ? [r.event] : []));
        return { events: list.sort(byStart), source: "store" };
      }
    } catch {
      // fall back to the verified starting list
    }
  }
  return { events: [...calendarSeed].sort(byStart), source: "seed" };
}

export async function saveCalendarEvents(events: CalendarEvent[]) {
  const store = getBackend();
  if (!store) throw new Error("no-store");
  await store.write([{ kind: "hset", key: KEY, field: FIELD, value: JSON.stringify([...events].sort(byStart)) }]);
}

export function calendarEditable() {
  return getBackend() !== null;
}
