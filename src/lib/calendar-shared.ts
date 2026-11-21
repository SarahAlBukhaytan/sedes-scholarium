/**
 * Calendar types and pure helpers — safe for both server and browser code.
 * Storage lives in ./calendar.ts (server only).
 */

export const CALENDAR_FIELDS = [
  "تعليمي",
  "علمي",
  "ثقافي",
  "إبداعي",
  "ابتكاري",
  "تقني",
  "اقتصادي",
  "دفاعي",
  "أمني",
  "عسكري",
  "صحي",
  "إعلامي",
  "أخرى",
] as const;
export type CalendarField = (typeof CALENDAR_FIELDS)[number];

export interface CalendarEvent {
  id: string;
  name: string;
  field: CalendarField;
  /** YYYY-MM-DD (Riyadh) */
  startDate: string;
  /** YYYY-MM-DD (Riyadh); same as startDate for one-day events */
  endDate: string;
  /** HH:MM (Riyadh) — only when officially announced */
  startTime?: string;
  venue: string;
  /** organiser's official website */
  url: string;
  /** Sedes Scholarium officially takes part — only once confirmed */
  sedes: boolean;
  /** where the details were verified (internal, not shown publicly) */
  verifiedFrom?: string;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Riyadh is UTC+3 all year. */
export const RIYADH_OFFSET_H = 3;

/** Today's date in Riyadh as YYYY-MM-DD. */
export function riyadhToday(now = Date.now()) {
  return new Date(now + RIYADH_OFFSET_H * 3600_000).toISOString().slice(0, 10);
}

/** The instant an event starts: its announced hour, or the start of its first day. */
export function startInstant(e: Pick<CalendarEvent, "startDate" | "startTime">) {
  const [y, m, d] = e.startDate.split("-").map(Number);
  const [hh, mm] = (e.startTime ?? "00:00").split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh - RIYADH_OFFSET_H, mm);
}

function validDate(s: string) {
  if (!DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Validates one event from untrusted input; returns an Arabic error or the clean event. */
export function cleanEvent(raw: Record<string, unknown>): { ok: true; event: CalendarEvent } | { ok: false; error: string } {
  const str = (k: string, max = 300) => (typeof raw[k] === "string" ? (raw[k] as string).trim().slice(0, max) : "");
  const name = str("name", 200);
  const field = str("field") as CalendarField;
  const startDate = str("startDate", 10);
  const endDate = str("endDate", 10) || startDate;
  const startTime = str("startTime", 5);
  const venue = str("venue", 200);
  const url = str("url", 500);
  if (!name) return { ok: false, error: "اسم المؤتمر مطلوب." };
  if (!CALENDAR_FIELDS.includes(field)) return { ok: false, error: "اختر مجال المؤتمر." };
  if (!validDate(startDate)) return { ok: false, error: "تاريخ البداية غير صحيح." };
  if (!validDate(endDate) || endDate < startDate) return { ok: false, error: "تاريخ النهاية يجب أن يكون في يوم البداية أو بعده." };
  if (startTime && !TIME.test(startTime)) return { ok: false, error: "وقت الانطلاق غير صحيح (مثال: 09:30)." };
  if (!venue) return { ok: false, error: "مكان الانعقاد مطلوب." };
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {}
  if (!parsed || (parsed.protocol !== "https:" && parsed.protocol !== "http:")) {
    return { ok: false, error: "رابط الموقع الرسمي غير صحيح (يبدأ بـ https://)." };
  }
  const id = str("id", 80) || `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    ok: true,
    event: {
      id,
      name,
      field,
      startDate,
      endDate,
      ...(startTime ? { startTime } : {}),
      venue,
      url: parsed.toString(),
      sedes: raw.sedes === true || raw.sedes === "on" || raw.sedes === "true",
      ...(str("verifiedFrom") ? { verifiedFrom: str("verifiedFrom") } : {}),
    },
  };
}

export const byStart = (a: CalendarEvent, b: CalendarEvent) =>
  startInstant(a) - startInstant(b) || a.name.localeCompare(b.name, "ar");
