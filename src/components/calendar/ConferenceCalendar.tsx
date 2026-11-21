"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpLeft, CalendarDays, ChevronLeft, ChevronRight, Filter, MapPin } from "lucide-react";
import { StarGlyph } from "@/components/motif/StarPattern";
import { initiative } from "@/content/site";
import { CALENDAR_FIELDS, riyadhToday, startInstant, type CalendarEvent } from "@/lib/calendar-shared";

const WEEKDAYS = ["س", "ح", "ن", "ث", "ر", "خ", "ج"]; // Saturday first
const WEEKDAY_NAMES = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const num = new Intl.NumberFormat("ar-SA-u-nu-latn");

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function formatRange(e: CalendarEvent) {
  const [y1, m1, d1] = e.startDate.split("-").map(Number);
  const [y2, m2, d2] = e.endDate.split("-").map(Number);
  if (e.startDate === e.endDate) return `${d1} ${MONTHS[m1 - 1]} ${y1}`;
  if (y1 === y2 && m1 === m2) return `${d1}–${d2} ${MONTHS[m1 - 1]} ${y1}`;
  if (y1 === y2) return `${d1} ${MONTHS[m1 - 1]} – ${d2} ${MONTHS[m2 - 1]} ${y1}`;
  return `${d1} ${MONTHS[m1 - 1]} ${y1} – ${d2} ${MONTHS[m2 - 1]} ${y2}`;
}

/** Whole days between two YYYY-MM-DD dates. */
function dayDiff(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

function SedesStar({ className = "size-4" }: { className?: string }) {
  return <StarGlyph color="var(--sedes-blue)" className={className} />;
}

/* ── countdown to the next conference that has not started yet ───────── */
function Countdown({ events }: { events: CalendarEvent[] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  // before mount: the first upcoming one by date (no clock needed to pick it)
  const next = now === null ? events[0] : events.find((e) => startInstant(e) > now);
  if (!next) return null;

  const hasTime = Boolean(next.startTime);
  let parts: { label: string; value: number | null }[];
  if (now === null) {
    parts = (hasTime ? ["يوم", "ساعة", "دقيقة", "ثانية"] : ["يوم"]).map((label) => ({ label, value: null }));
  } else if (hasTime) {
    const s = Math.max(0, Math.floor((startInstant(next) - now) / 1000));
    parts = [
      { label: "يوم", value: Math.floor(s / 86400) },
      { label: "ساعة", value: Math.floor((s % 86400) / 3600) },
      { label: "دقيقة", value: Math.floor((s % 3600) / 60) },
      { label: "ثانية", value: s % 60 },
    ];
  } else {
    parts = [{ label: "يوم", value: dayDiff(riyadhToday(now), next.startDate) }];
  }

  return (
    <section aria-labelledby="next-h" className="rounded-[1.5rem] bg-deep px-5 py-8 text-center text-ivory md:px-10">
      <h2 id="next-h" className="font-display text-xl font-bold md:text-2xl">
        المؤتمر القادم
      </h2>
      <p className="mt-3 flex items-center justify-center gap-2 font-display text-lg leading-8 font-bold text-sky md:text-xl">
        {next.sedes && <SedesStar className="size-5" />}
        {next.name}
      </p>
      <p className="mt-1 text-sm text-ivory/75">{formatRange(next)}</p>
      <p className="mt-5 text-sm text-ivory/80">الوقت المتبقي على الانطلاق</p>
      <div className={`mx-auto mt-3 grid gap-2.5 sm:gap-4 ${hasTime ? "max-w-xl grid-cols-4" : "max-w-[10rem] grid-cols-1"}`} role="timer" aria-live="off">
        {parts.map((p) => (
          <div key={p.label} className="rounded-[var(--radius-card)] bg-ivory/10 px-1 py-4 ring-1 ring-ivory/15">
            <p className="font-latin text-3xl font-bold tabular-nums md:text-4xl">{p.value === null ? "—" : num.format(p.value)}</p>
            <p className="mt-1 text-sm text-ivory/80">{p.label}</p>
          </div>
        ))}
      </div>
      {!hasTime && <p className="mt-3 text-xs text-ivory/65">لم تُعلن ساعة الانطلاق رسميًا، فيُحتسب العدّ بالأيام حسب توقيت الرياض.</p>}
    </section>
  );
}

/* ── one conference card ────────────────────────────────────────────── */
function EventCard({ e }: { e: CalendarEvent }) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] bg-surface p-5 shadow-card md:p-6">
      <h3 className="flex items-start gap-2 font-display text-lg leading-8 font-bold text-deep">
        {e.sedes && (
          <span className="mt-1.5 shrink-0" title="محطّة من محطّات Sedes Scholarium">
            <SedesStar className="size-5" />
          </span>
        )}
        {e.name}
      </h3>
      {e.sedes && (
        <p className="mt-1 text-sm font-semibold text-blue">
          بمشاركة <bdi dir="ltr">{initiative.publicName}</bdi>
        </p>
      )}
      <dl className="mt-4 space-y-2 text-[0.95rem] text-ink">
        <div className="flex items-center gap-2">
          <dt className="sr-only">تاريخ الانعقاد</dt>
          <CalendarDays className="size-4 shrink-0 text-royal" aria-hidden="true" />
          <dd>
            {formatRange(e)}
            {e.startTime && <span className="text-muted"> · الساعة <bdi dir="ltr">{e.startTime}</bdi> بتوقيت الرياض</span>}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">مكان الانعقاد</dt>
          <MapPin className="size-4 shrink-0 text-royal" aria-hidden="true" />
          <dd>{e.venue}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <span className="rounded-full bg-lilac-soft/70 px-3 py-1 text-xs font-semibold text-deep">
          <span className="sr-only">المجال: </span>
          {e.field}
        </span>
        <a
          href={e.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-deep/25 px-4 text-sm font-semibold text-deep hover:border-deep hover:bg-deep hover:text-ivory"
        >
          الموقع الرسمي
          <ArrowUpLeft className="size-4" aria-hidden="true" />
          <span className="sr-only">(يفتح في تبويب جديد)</span>
        </a>
      </div>
    </article>
  );
}

/**
 * Interactive part of «تقويم المؤتمرات»: countdown, monthly calendar (with
 * month navigation, marked days and a details panel for a chosen day), a
 * field filter and the chronological list of upcoming conferences.
 */
export function ConferenceCalendar({ events, today }: { events: CalendarEvent[]; today: string }) {
  const [field, setField] = useState<string>("all");
  const upcoming = useMemo(() => events.filter((e) => e.endDate >= today), [events, today]);
  const shown = useMemo(() => (field === "all" ? upcoming : upcoming.filter((e) => e.field === field)), [upcoming, field]);
  const fieldsInUse = CALENDAR_FIELDS.filter((f) => upcoming.some((e) => e.field === f));

  // open on the month of the next conference (or the current month while one is running)
  const [ty, tm] = (upcoming[0] && upcoming[0].startDate > today ? upcoming[0].startDate : today).split("-").map(Number);
  const [month, setMonth] = useState({ y: ty, m: tm - 1 });
  const [selected, setSelected] = useState<string | null>(null);

  // events by day (multi-day conferences mark every day they run)
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of shown) {
      for (let d = e.startDate; d <= e.endDate; ) {
        map.set(d, [...(map.get(d) ?? []), e]);
        const t = new Date(`${d}T00:00:00Z`);
        t.setUTCDate(t.getUTCDate() + 1);
        d = t.toISOString().slice(0, 10);
      }
    }
    return map;
  }, [shown]);

  const firstWeekday = (new Date(Date.UTC(month.y, month.m, 1)).getUTCDay() + 1) % 7; // Saturday = 0
  const daysInMonth = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const move = (delta: number) => {
    setSelected(null);
    setMonth(({ y, m }) => {
      const t = m + delta;
      return { y: y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 };
    });
  };
  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];

  if (!upcoming.length) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
        <CalendarDays className="mx-auto size-10 text-royal" aria-hidden="true" />
        <p className="mt-4 font-display text-xl font-bold text-deep">لا توجد مؤتمرات مؤكدة في التقويم حاليًا</p>
        <p className="mx-auto mt-2 max-w-md leading-8 text-muted">
          نضيف المؤتمرات بعد التحقق من مواعيدها عبر مواقع الجهات المنظمة الرسمية. تابعونا قريبًا.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Countdown events={upcoming} />

      {/* monthly calendar */}
      <section aria-labelledby="month-h" className="rounded-[1.5rem] bg-surface p-4 shadow-card sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => move(-1)} className="inline-flex size-11 items-center justify-center rounded-full text-deep hover:bg-surface-muted">
            <ChevronRight className="size-5" aria-hidden="true" />
            <span className="sr-only">الشهر السابق</span>
          </button>
          <h2 id="month-h" className="font-display text-xl font-bold text-deep" aria-live="polite">
            {MONTHS[month.m]} <span className="font-latin">({month.y})</span>
          </h2>
          <button type="button" onClick={() => move(1)} className="inline-flex size-11 items-center justify-center rounded-full text-deep hover:bg-surface-muted">
            <ChevronLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">الشهر التالي</span>
          </button>
        </div>

        <div role="grid" aria-labelledby="month-h" className="mt-4">
          <div role="row" className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {WEEKDAYS.map((w, i) => (
              <div key={w} role="columnheader" className="py-1 text-center text-sm font-semibold text-muted">
                <abbr title={WEEKDAY_NAMES[i]} className="no-underline">
                  {w}
                </abbr>
              </div>
            ))}
          </div>
          {Array.from({ length: cells.length / 7 }, (_, r) => (
            <div key={r} role="row" className="mt-1.5 grid grid-cols-7 gap-1.5 sm:mt-2 sm:gap-2">
              {cells.slice(r * 7, r * 7 + 7).map((d, i) => {
                if (d === null) return <div key={i} role="gridcell" className="aspect-square sm:aspect-[4/3]" />;
                const key = iso(month.y, month.m, d);
                const evs = byDay.get(key) ?? [];
                const has = evs.length > 0;
                const sedes = evs.some((e) => e.sedes);
                const isToday = key === today;
                const isSel = key === selected;
                return (
                  <div key={i} role="gridcell">
                    <button
                      type="button"
                      disabled={!has}
                      onClick={() => setSelected(isSel ? null : key)}
                      aria-pressed={has ? isSel : undefined}
                      aria-label={`${d} ${MONTHS[month.m]}${has ? ` — ${evs.map((e) => e.name).join("، ")}` : ""}${isToday ? " (اليوم)" : ""}`}
                      className={`flex aspect-square w-full flex-col items-center justify-center rounded-[var(--radius-control)] text-[0.95rem] font-semibold tabular-nums transition-colors sm:aspect-[4/3] ${
                        isSel
                          ? "bg-deep text-ivory"
                          : has
                            ? "bg-lilac-soft text-deep hover:bg-lilac/60"
                            : "bg-[var(--sedes-gray-200)]/60 text-ink/70"
                      } ${isToday ? "ring-2 ring-blue ring-offset-1" : ""}`}
                    >
                      {d}
                      {has &&
                        (sedes ? (
                          <StarGlyph color={isSel ? "var(--sedes-sky)" : "var(--sedes-blue)"} className="mt-0.5 size-3.5" />
                        ) : (
                          <span aria-hidden="true" className={`mt-1 size-1.5 rounded-full ${isSel ? "bg-sky" : "bg-royal"}`} />
                        ))}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rounded-full bg-royal" /> يوم فيه مؤتمر
          </li>
          <li className="flex items-center gap-2">
            <SedesStar /> محطّات <bdi dir="ltr">{initiative.publicName}</bdi>
          </li>
        </ul>

        <div aria-live="polite">
          {selected && selectedEvents.length > 0 && (
            <div className="mt-6 space-y-4 border-t border-line pt-5">
              <p className="text-sm font-semibold text-muted">
                مؤتمرات يوم {Number(selected.slice(8))} {MONTHS[Number(selected.slice(5, 7)) - 1]}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {selectedEvents.map((e) => (
                  <EventCard key={e.id} e={e} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* upcoming list */}
      <section aria-labelledby="list-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="list-h" className="font-display text-2xl font-bold text-deep">
            المؤتمرات المرتقبة
          </h2>
          <label className="relative inline-flex items-center">
            <span className="sr-only">تصفية حسب المجال</span>
            <Filter className="pointer-events-none absolute start-4 size-4 text-muted" aria-hidden="true" />
            <select
              value={field}
              onChange={(e) => {
                setField(e.target.value);
                setSelected(null);
              }}
              className="min-h-11 appearance-none rounded-full border border-line-strong bg-surface ps-10 pe-6 text-sm font-semibold text-deep focus:border-blue focus:outline-none"
            >
              <option value="all">جميع المجالات</option>
              {fieldsInUse.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>
        {shown.length ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {shown.map((e) => (
              <li key={e.id}>
                <EventCard e={e} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-4 py-8 text-center text-muted">
            لا توجد مؤتمرات مرتقبة في هذا المجال حاليًا.
          </p>
        )}
      </section>
    </div>
  );
}
