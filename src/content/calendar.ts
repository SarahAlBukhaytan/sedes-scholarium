import type { CalendarEvent } from "@/lib/calendar-shared";

/**
 * تقويم المؤتمرات — the verified STARTING list (used until the list is first
 * saved from the admin dashboard, which then becomes the source).
 *
 * Every entry was checked on the organiser's official website (see
 * `verifiedFrom`); nothing is added from aggregator listings alone. Fields
 * left out on purpose: `startTime` (no opening hour announced) and the exact
 * hall when the official page names only the city.
 * `sedes` stays false until the initiative's participation is confirmed.
 */
export const calendarSeed: CalendarEvent[] = [
  {
    id: "fmf-2027",
    name: "منتدى مستقبل المعادن 2027 (Future Minerals Forum)",
    field: "اقتصادي",
    startDate: "2027-01-12",
    endDate: "2027-01-14",
    venue: "الرياض",
    url: "https://futuremineralsforum.com/",
    sedes: false,
    verifiedFrom: "futuremineralsforum.com — «JAN 12-14, 2027» (checked 2026-11-21)",
  },
  {
    id: "leap-2027",
    name: "مؤتمر ليب التقني 2027 (LEAP)",
    field: "تقني",
    startDate: "2027-04-12",
    endDate: "2027-04-15",
    venue: "الرياض",
    url: "https://www.onegiantleap.com/",
    sedes: false,
    verifiedFrom:
      "mcit.gov.sa/en/node/256607 (organiser, Ministry of Communications and IT): «the sixth edition will be held from April 12 to 15, 2027» (checked 2026-11-21)",
  },
];
