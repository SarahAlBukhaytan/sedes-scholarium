/**
 * الزيارات اليومية — column chart over a REAL time axis.
 *
 * Why the old chart looked like one big blue rectangle: it drew one flex-1
 * column per *recorded* day, scaled to the day's own maximum. With a single
 * recorded day that column took the full width and full height, and there
 * was no axis or scale to read it against.
 *
 * Now:
 *  - the x axis is every calendar day (UTC) from the day counting started —
 *    or 29 days ago, whichever is later — up to today; days inside that span
 *    with no visits are real zeros (empty slots), days before counting
 *    started are not drawn at all (nothing is invented);
 *  - columns have a capped width and a 2px gap, rounded tops, one blue;
 *  - a y scale with light grid lines, date ticks, and a tooltip per column;
 *  - an accessible table with the same numbers.
 */
const fmt = new Intl.NumberFormat("ar-SA-u-nu-latn");
const fmtLong = new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", { day: "numeric", month: "long", timeZone: "UTC" });
const fmtTick = new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", { day: "numeric", month: "short", timeZone: "UTC" });

const DAY = 86_400_000;
const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);

/** A readable top value for the scale: 1, 2, 5 × 10ⁿ ≥ max. */
function niceMax(max: number) {
  if (max <= 4) return Math.max(1, max);
  const p = 10 ** Math.floor(Math.log10(max));
  return [1, 2, 5, 10].map((m) => m * p).find((v) => v >= max)!;
}

export function DailyVisitsChart({ byDay, since, now }: { byDay: Record<string, number>; since: string | null; now: number }) {
  const today = Date.parse(isoDay(now));
  const start = Math.max(since ? Date.parse(since.slice(0, 10)) : today, today - 29 * DAY);
  const days: { key: string; value: number }[] = [];
  for (let t = start; t <= today; t += DAY) days.push({ key: isoDay(t), value: byDay[isoDay(t)] ?? 0 });

  const total = days.reduce((s, d) => s + d.value, 0);
  if (!since || total === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-[var(--radius-control)] border border-dashed border-line-strong text-center">
        <p className="font-semibold text-deep">لا توجد زيارات مسجّلة في هذه الفترة بعد</p>
        <p className="mt-1 text-sm text-muted">يظهر الرسم تلقائيًا مع أول زيارات حقيقية.</p>
      </div>
    );
  }

  const top = niceMax(Math.max(...days.map((d) => d.value)));
  const ticks = top <= 4 ? Array.from({ length: top + 1 }, (_, i) => i) : [0, top / 2, top];
  const every = Math.max(1, Math.ceil(days.length / 6));

  return (
    <figure>
      <div dir="ltr" className="flex gap-3">
        {/* y axis */}
        <div className="relative h-52 w-8 shrink-0 text-right text-xs text-muted tabular-nums" aria-hidden="true">
          {ticks.map((v) => (
            <span key={v} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(v / top) * 100}%` }}>
              {fmt.format(v)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {/* plot */}
          <div className="relative h-52 border-b border-line-strong" role="img" aria-label={`الزيارات اليومية: ${fmt.format(total)} زيارة خلال ${days.length} يومًا`}>
            {ticks.map((v) => (
              <span key={v} aria-hidden="true" className="absolute inset-x-0 border-t border-line" style={{ bottom: `${(v / top) * 100}%` }} />
            ))}
            <div className="absolute inset-0 flex items-end gap-[2px]">
              {days.map((d) => (
                <div key={d.key} className="group relative flex h-full max-w-9 flex-1 items-end justify-center">
                  {d.value > 0 && (
                    <span className="block w-full rounded-t-[4px] bg-royal transition-colors group-hover:bg-blue" style={{ height: `${(d.value / top) * 100}%` }} />
                  )}
                  {/* tooltip */}
                  <span
                    dir="rtl"
                    className="pointer-events-none absolute bottom-full z-10 mb-2 hidden rounded-md bg-deep px-2.5 py-1.5 text-xs whitespace-nowrap text-ivory group-hover:block"
                  >
                    {fmtLong.format(Date.parse(d.key))}: <b className="tabular-nums">{fmt.format(d.value)}</b> زيارة
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* x axis */}
          <div className="mt-2 flex gap-[2px] text-[0.7rem] text-muted" aria-hidden="true">
            {days.map((d, i) => (
              <span key={d.key} className="max-w-9 flex-1 text-center whitespace-nowrap">
                {i % every === 0 || i === days.length - 1 ? fmtTick.format(Date.parse(d.key)) : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-xs text-muted">
        {fmt.format(total)} زيارة في {fmt.format(days.length)} {days.length === 1 ? "يوم" : "يومًا"} — مرّر المؤشر على العمود لعرض قيمته.
      </figcaption>
      <table className="sr-only">
        <caption>الزيارات اليومية</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.key}>
              <th scope="row">{fmtLong.format(Date.parse(d.key))}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
