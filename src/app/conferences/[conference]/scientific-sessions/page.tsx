import type { Metadata } from "next";
import { ActivitiesByDay } from "@/components/activity/ActivitiesByDay";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSessions } from "@/lib/content";
import { conferenceCrumbs, requireBundle } from "@/lib/page";

type Props = { params: Promise<{ conference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = requireBundle((await params).conference);
  return { title: `الجلسات العلمية — ${b.conference.shortTitle}` };
}

export default async function ScientificSessionsPage({ params }: Props) {
  const bundle = requireBundle((await params).conference);
  const c = bundle.conference;
  const sessions = getSessions(bundle).filter((s) => s.sessionType === "scientific");

  return (
    <>
      <PageHeader
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [{ label: "الجلسات العلمية" }])}
        eyebrow={c.shortTitle}
        title="الجلسات العلمية"
        lead="جلسات النقاش العلمي المتوازية، مرتبةً وفق برنامج المؤتمر."
      />
      <div className="surface-gray container-page py-10 md:py-14">
        <ActivitiesByDay bundle={bundle} activities={sessions} />
      </div>
    </>
  );
}
