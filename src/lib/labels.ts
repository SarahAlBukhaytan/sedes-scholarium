import type { Activity, ConferenceStatus } from "@/content/types";

export type ActivityVariant = "keynote" | "scientific" | "workshop";

export function activityVariant(a: Pick<Activity, "kind" | "sessionType">): ActivityVariant {
  if (a.kind === "workshop") return "workshop";
  return a.sessionType === "keynote" ? "keynote" : "scientific";
}

export const variantLabel: Record<ActivityVariant, string> = {
  keynote: "جلسة رئيسة",
  scientific: "جلسة علمية",
  workshop: "ورشة عمل",
};

export const variantPlural: Record<ActivityVariant, string> = {
  keynote: "الجلسات الرئيسة",
  scientific: "الجلسات العلمية",
  workshop: "الورش",
};

export const statusLabel: Record<ConferenceStatus, string> = {
  upcoming: "قادم",
  "in-progress": "قيد الرصد والتوثيق",
  documented: "موثّق",
};

/** "13:30" → "1:30 م" */
export function formatTime(t?: string): string {
  if (!t) return "";
  const [hStr, m] = t.split(":");
  const h = Number(hStr);
  const suffix = h < 12 ? "ص" : "م";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${suffix}`;
}

export function formatTimeRange(start?: string, end?: string): string {
  if (!start) return "";
  if (!end) return formatTime(start);
  return `${formatTime(start)} – ${formatTime(end)}`;
}

/** Arabic plural-aware counts for common nouns. */
export function countLabel(n: number, forms: [one: string, two: string, few: string, many: string]) {
  if (n === 0) return `لا ${forms[2]}`;
  if (n === 1) return forms[0];
  if (n === 2) return forms[1];
  if (n >= 3 && n <= 10) return `${n} ${forms[2]}`;
  return `${n} ${forms[3]}`;
}

export const activityForms: [string, string, string, string] = [
  "فعالية واحدة",
  "فعاليتان",
  "فعاليات",
  "فعالية",
];
