import type { Metadata } from "next";
import { ConferenceCard } from "@/components/conference/ConferenceCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getBundle, getConferences, getConferenceStats } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "المؤتمرات" };

export default function ConferencesPage() {
  const conferences = getConferences();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "الرئيسة", href: routes.home() }, { label: "المؤتمرات" }]}
        title="المؤتمرات"
        lead="المؤتمرات التي ترصدها المبادرة وتترجم مضامينها وتوثّقها."
      />
      <div className="surface-gray container-page py-10 md:py-14">
        {conferences.length === 0 ? (
          <EmptyState variant="empty" title="لا توجد مؤتمرات منشورة بعد" />
        ) : (
          <ul className="space-y-8">
            {conferences.map((c) => {
              const s = getConferenceStats(getBundle(c.slug)!);
              return (
                <li key={c.id}>
                  <ConferenceCard
                    conference={c}
                    stats={[
                      { label: "الجلسات الرئيسة", value: s.keynotes },
                      { label: "الجلسات العلمية", value: s.scientific },
                      { label: "ورش العمل", value: s.workshops },
                    ]}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
