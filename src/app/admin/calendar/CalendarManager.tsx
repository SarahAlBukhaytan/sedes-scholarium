"use client";

import { useActionState, useEffect, useState } from "react";
import { CalendarPlus, Pencil, Save, Trash2, X } from "lucide-react";
import { CALENDAR_FIELDS, type CalendarEvent } from "@/lib/calendar-shared";
import { manageCalendarAction, type CalendarActionState } from "../actions";

const field = "block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface px-3 focus:border-blue focus:outline-none";
const lbl = "mb-1.5 block text-sm font-semibold text-deep";

function EventForm({ initial, onDone }: { initial?: CalendarEvent; onDone: () => void }) {
  const [state, action, pending] = useActionState<CalendarActionState, FormData>(manageCalendarAction, {});
  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="op" value="save" />
      {initial && <input type="hidden" name="id" value={initial.id} />}
      {initial?.verifiedFrom && <input type="hidden" name="verifiedFrom" value={initial.verifiedFrom} />}
      <label className="md:col-span-2">
        <span className={lbl}>اسم المؤتمر</span>
        <input name="name" required maxLength={200} defaultValue={initial?.name} className={field} />
      </label>
      <label>
        <span className={lbl}>المجال</span>
        <select name="field" required defaultValue={initial?.field ?? ""} className={field}>
          <option value="" disabled>
            اختاري المجال
          </option>
          {CALENDAR_FIELDS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </label>
      <label>
        <span className={lbl}>مكان الانعقاد</span>
        <input name="venue" required maxLength={200} defaultValue={initial?.venue ?? "الرياض"} className={field} />
      </label>
      <label>
        <span className={lbl}>تاريخ البداية</span>
        <input name="startDate" type="date" required defaultValue={initial?.startDate} className={field} />
      </label>
      <label>
        <span className={lbl}>تاريخ النهاية</span>
        <input name="endDate" type="date" defaultValue={initial?.endDate} className={field} />
      </label>
      <label>
        <span className={lbl}>ساعة الانطلاق بتوقيت الرياض (اختياري، إن أُعلنت رسميًا)</span>
        <input name="startTime" type="time" defaultValue={initial?.startTime} className={field} />
      </label>
      <label>
        <span className={lbl}>رابط الموقع الرسمي</span>
        <input name="url" type="url" required dir="ltr" placeholder="https://" defaultValue={initial?.url} className={`${field} text-left`} />
      </label>
      <label className="flex items-center gap-3 md:col-span-2">
        <input name="sedes" type="checkbox" defaultChecked={initial?.sedes} className="size-5 accent-[var(--sedes-blue)]" />
        <span className="text-sm font-semibold text-deep">بمشاركة Sedes Scholarium (محطّة مؤكدة رسميًا)</span>
      </label>
      {state.ok === false && (
        <p role="alert" className="rounded-lg border border-[#c0392b]/30 bg-[#fdecea] px-4 py-3 text-sm text-[#8e2a20] md:col-span-2">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <button
          disabled={pending}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-deep px-5 font-semibold text-ivory hover:bg-royal disabled:opacity-60"
        >
          <Save className="size-4" aria-hidden="true" /> {pending ? "جارٍ الحفظ…" : initial ? "حفظ التعديلات" : "إضافة إلى التقويم"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 font-semibold text-deep hover:border-deep"
        >
          <X className="size-4" aria-hidden="true" /> إلغاء
        </button>
      </div>
    </form>
  );
}

function DeleteButton({ e }: { e: CalendarEvent }) {
  const [state, action, pending] = useActionState<CalendarActionState, FormData>(manageCalendarAction, {});
  return (
    <form
      action={action}
      onSubmit={(ev) => {
        if (!confirm(`حذف «${e.name}» من التقويم؟`)) ev.preventDefault();
      }}
    >
      <input type="hidden" name="op" value="delete" />
      <input type="hidden" name="id" value={e.id} />
      <button
        disabled={pending}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#c0392b]/40 px-3 text-xs font-semibold text-[#8e2a20] hover:bg-[#fdecea] disabled:opacity-50"
      >
        <Trash2 className="size-3.5" aria-hidden="true" /> حذف
      </button>
      {state.ok === false && <span className="text-xs text-[#8e2a20]">{state.error}</span>}
    </form>
  );
}

export function CalendarManager({ events, today }: { events: CalendarEvent[]; today: string }) {
  const [editing, setEditing] = useState<string | null>(null); // event id, "new", or null
  const close = () => setEditing(null);

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-card)] bg-surface p-5 md:p-6">
        {editing === "new" ? (
          <>
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-deep">
              <CalendarPlus className="size-5 text-blue" aria-hidden="true" /> إضافة مؤتمر
            </h2>
            <EventForm key="new" onDone={close} />
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-deep px-5 font-semibold text-ivory hover:bg-royal"
          >
            <CalendarPlus className="size-4" aria-hidden="true" /> إضافة مؤتمر
          </button>
        )}
      </section>

      <section className="rounded-[var(--radius-card)] bg-surface p-5 md:p-6">
        <h2 className="font-display text-lg font-bold text-deep">المؤتمرات في التقويم ({events.length})</h2>
        {!events.length ? (
          <p className="mt-4 text-muted">لا توجد مؤتمرات بعد.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {events.map((e) => (
              <li key={e.id} className="py-4">
                {editing === e.id ? (
                  <EventForm key={e.id} initial={e} onDone={close} />
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-deep">
                        {e.sedes && <span className="text-blue">★ </span>}
                        {e.name}
                        {e.endDate < today && <span className="ms-2 rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted">منتهٍ</span>}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {e.field} · <bdi dir="ltr">{e.startDate === e.endDate ? e.startDate : `${e.startDate} → ${e.endDate}`}</bdi>
                        {e.startTime && (
                          <>
                            {" "}
                            · <bdi dir="ltr">{e.startTime}</bdi>
                          </>
                        )}{" "}
                        · {e.venue}
                      </p>
                      <a href={e.url} target="_blank" rel="noopener noreferrer" dir="ltr" className="mt-1 inline-block text-xs break-all text-royal underline">
                        {e.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(e.id)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line-strong px-3 text-xs font-semibold text-deep hover:border-deep"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" /> تعديل
                      </button>
                      <DeleteButton e={e} />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
