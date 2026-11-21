import type { CalendarEvent } from "@/lib/calendar-shared";

/**
 * تقويم المؤتمرات — the verified STARTING list (used until the list is first
 * saved from the admin dashboard, which then becomes the source).
 *
 * Every entry was checked on the organiser's official website on 2026-11-21
 * (see `verifiedFrom`); nothing is added from aggregator listings alone.
 * Left out on purpose: `startTime` (no opening hour announced) and the exact
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
    verifiedFrom: "futuremineralsforum.com — «JAN 12-14, 2027»",
  },
  {
    id: "smf-2027",
    name: "المنتدى السعودي للإعلام 2027",
    field: "إعلامي",
    startDate: "2027-02-01",
    endDate: "2027-02-03",
    venue: "الرياض",
    url: "https://saudimf.sa/",
    sedes: false,
    verifiedFrom: "saudimf.sa — «Riyadh, Saudi Arabia · February 1 - 3, 2027»",
  },
  {
    id: "leap-2027",
    name: "مؤتمر ليب التقني 2027 (LEAP)",
    field: "تقني",
    startDate: "2027-04-12",
    endDate: "2027-04-15",
    venue: "مركز الرياض للمعارض والمؤتمرات، ملهم",
    url: "https://onegiantleap.com/",
    sedes: false,
    verifiedFrom: "onegiantleap.com — «12th - 15th April 2027, RECC Malham, Saudi Arabia»; mcit.gov.sa/en/node/256607",
  },
  {
    id: "blackhat-mea-2027",
    name: "بلاك هات الشرق الأوسط وأفريقيا 2027 (Black Hat MEA)",
    field: "أمني",
    startDate: "2027-05-31",
    endDate: "2027-06-02",
    venue: "ملهم، الرياض",
    url: "https://blackhatmea.com/",
    sedes: false,
    verifiedFrom: "blackhatmea.com — «MALHAM · 31 MAY - 2 JUN 2027» (moved from 1–3 Dec 2026)",
  },
  {
    id: "fii10-2027",
    name: "مبادرة مستقبل الاستثمار FII10",
    field: "اقتصادي",
    startDate: "2027-10-25",
    endDate: "2027-10-28",
    venue: "الرياض",
    url: "https://fii-institute.org/",
    sedes: false,
    verifiedFrom: "fii-institute.org — «rescheduled … to October 25–28, 2027, in Riyadh»",
  },
  {
    id: "wds-2028",
    name: "معرض الدفاع العالمي 2028 (World Defense Show)",
    field: "دفاعي",
    startDate: "2028-01-16",
    endDate: "2028-01-20",
    venue: "الرياض",
    url: "https://worlddefenseshow.com/",
    sedes: false,
    verifiedFrom: "worlddefenseshow.com/en/about-the-show/what-to-expect — «16–20 January 2028» in Riyadh",
  },
];
