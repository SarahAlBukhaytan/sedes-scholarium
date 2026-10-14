import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { features } from "@/config/features";
import { TopicIndex } from "@/components/topics/TopicIndex";
import { getTopicIndex } from "@/lib/content";
import { conferenceCrumbs, requireBundle } from "@/lib/page";

type Props = { params: Promise<{ conference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = requireBundle((await params).conference);
  return { title: `الموضوعات المعرفية — ${b.conference.shortTitle}` };
}

export default async function TopicsPage({ params }: Props) {
  // Section hidden by the initiative director — see src/config/features.ts.
  if (!features.knowledgeTopics) notFound();
  const bundle = requireBundle((await params).conference);
  const c = bundle.conference;
  // The activity count in the closing note is computed from the program data.
  const activityCount = bundle.activities.length;

  return (
    <>
      <PageHeader
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [{ label: "الموضوعات المعرفية" }])}
        eyebrow={c.shortTitle}
        title="الموضوعات المعرفية"
        lead={
          <>
            <p>
              استكشف الموضوعات التي برزت عبر جلسات المؤتمر وورش عمله، وتتبّع حضورها وتقاطعاتها بين مختلف الفعاليات.
            </p>
            <p className="mt-2 text-sm text-muted">
              يرتبط كل موضوع بفعالية فقط حين تدل عليه كلماتها المفتاحية أو ملخصها في تقريرها الرسمي.
            </p>
          </>
        }
      />
      <div className="surface-gray container-page py-10 md:py-14">
        <TopicIndex
          items={getTopicIndex(bundle)}
          conferenceSlug={c.slug}
          showCounts={c.topicLinksStatus !== "proposed"}
        />
        <p className="mt-10 max-w-3xl border-t border-line pt-6 text-sm leading-7 text-muted">
          رُبطت الموضوعات بفعاليات المؤتمر الـ{activityCount} اعتمادًا على الكلمات المفتاحية والملخصات الواردة في التقارير
          المعرفية لكل جلسة وورشة، ويظهر سبب الربط في صفحة كل موضوع. تُعتمد هذه الروابط نهائيًا بعد مراجعة فريق التوثيق.
        </p>
      </div>
    </>
  );
}
