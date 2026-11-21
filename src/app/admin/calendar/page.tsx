import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { calendarEditable, getCalendarEvents, riyadhToday } from "@/lib/calendar";
import { AdminShell } from "../AdminShell";
import { CalendarManager } from "./CalendarManager";

export const metadata: Metadata = { title: "تقويم المؤتمرات", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** إدارة تقويم المؤتمرات — system admins (owner) only; checked on the server. */
export default async function AdminCalendarPage() {
  const me = await requireAdmin("owner");
  const { events, source } = await getCalendarEvents();
  return (
    <AdminShell session={me} active="calendar" title="تقويم المؤتمرات">
      <div className="max-w-3xl space-y-2 leading-8 text-ink">
        <p>
          أضيفي المؤتمرات وعدّليها واحذفيها من هنا، وتظهر التعديلات في صفحة «تقويم المؤتمرات» فورًا دون إعادة نشر الموقع.
        </p>
        <p className="text-sm text-muted">
          لا يُضاف مؤتمر إلا بعد التحقق من اسمه وموعده ومكانه من موقع الجهة المنظمة الرسمي. اتركي «ساعة الانطلاق» فارغة ما لم تُعلن
          رسميًا (يعدّ العدّاد التنازلي حينها بالأيام). لا تفعّلي «بمشاركة Sedes Scholarium» إلا بعد تأكيد المشاركة رسميًا.
        </p>
        {source === "seed" && (
          <p className="text-sm text-muted">القائمة الحالية هي القائمة المبدئية المتحقق منها؛ أول حفظ ينقلها إلى مخزن البيانات.</p>
        )}
      </div>
      {!calendarEditable() ? (
        <p className="rounded-[var(--radius-card)] bg-surface p-5 leading-8">
          مخزن البيانات غير متصل في هذه البيئة، فلا يمكن حفظ التقويم من اللوحة. على Vercel يلزم ربط Upstash Redis (انظر README).
        </p>
      ) : (
        <CalendarManager events={events} today={riyadhToday()} />
      )}
    </AdminShell>
  );
}
