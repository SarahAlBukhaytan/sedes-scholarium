import type { Metadata } from "next";
import { ActivitiesByDay } from "@/components/activity/ActivitiesByDay";
import { PageHeader } from "@/components/layout/PageHeader";
import { getWorkshops } from "@/lib/content";
import { conferenceCrumbs, requireBundle } from "@/lib/page";

type Props = { params: Promise<{ conference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = requireBundle((await params).conference);
  return { title: `ورش العمل — ${b.conference.shortTitle}` };
}

export default async function WorkshopsPage({ params }: Props) {
  const bundle = requireBundle((await params).conference);
  const c = bundle.conference;

  return (
    <>
      <PageHeader
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [{ label: "ورش العمل" }])}
        eyebrow={c.shortTitle}
        title="ورش العمل"
        lead="ورش تطبيقية تنتقل من النقاش إلى الممارسة، مرتبةً وفق برنامج المؤتمر."
      />
      <div className="surface-gray container-page py-10 md:py-14">
        <ActivitiesByDay bundle={bundle} activities={getWorkshops(bundle)} />
      </div>
    </>
  );
}
