import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ConferenceCalendar } from "@/components/calendar/ConferenceCalendar";
import { getCalendarEvents, riyadhToday } from "@/lib/calendar";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "تقويم المؤتمرات" };
// edits from the admin dashboard show up on the next visit
export const dynamic = "force-dynamic";

/** «تقويم المؤتمرات» — verified upcoming conferences in Riyadh. */
export default async function CalendarPage() {
  const { events } = await getCalendarEvents();
  // internal verification notes stay on the server
  const publicEvents = events.map(({ verifiedFrom: _v, ...e }) => {
    void _v;
    return e;
  });
  return (
    <div className="container-page pt-6 pb-20 md:pt-10">
      <Breadcrumbs items={[{ label: "الرئيسة", href: routes.home() }, { label: "تقويم المؤتمرات" }]} />
      <div className="mx-auto mt-8 max-w-2xl text-center">
        <CalendarDays className="mx-auto size-10 text-deep" aria-hidden="true" />
        <h1 className="mt-4 font-display text-[1.85rem] leading-snug font-bold text-deep md:text-[2.6rem] md:leading-tight">تقويم المؤتمرات</h1>
        <p className="mt-4 text-base leading-8 text-muted md:text-lg md:leading-9">
          استكشف أبرز المؤتمرات المرتقبة في الرياض، وتعرّف على مواعيدها ومجالاتها، وتابع العدّ التنازلي لانطلاقها.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-4xl">
        <ConferenceCalendar events={publicEvents} today={riyadhToday()} />
      </div>
    </div>
  );
}
