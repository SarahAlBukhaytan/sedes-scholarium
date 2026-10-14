import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { features } from "@/config/features";
import { KnowledgeConstellation, type MapTopicView } from "@/components/map/KnowledgeConstellation";
import { getActivities, getMapTopics, getTopicsByIds } from "@/lib/content";
import { activityVariant, variantLabel } from "@/lib/labels";
import { conferenceCrumbs, requireBundle } from "@/lib/page";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ conference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = requireBundle((await params).conference);
  return { title: `خريطة الترابط المعرفي — ${b.conference.shortTitle}` };
}

export default async function KnowledgeMapPage({ params }: Props) {
  const bundle = requireBundle((await params).conference);
  const c = bundle.conference;
  const activities = getActivities(bundle);

  const mapTopics = getMapTopics(bundle);
  const byId = new Map(activities.map((a) => [a.id, a]));
  /**
   * Related circles: two map topics are related when their keywords appear
   * together in the reports of at least TWO activities (one shared activity
   * is treated as coincidence). The shared activities are the stated reason.
   */
  const MIN_SHARED = 2;
  const relatedOf = (m: (typeof mapTopics)[number]) =>
    mapTopics
      .filter((o) => o.id !== m.id)
      .map((o) => ({ o, shared: m.activityIds.filter((id) => o.activityIds.includes(id)) }))
      .filter((r) => r.shared.length >= MIN_SHARED)
      .sort((x, y) => y.shared.length - x.shared.length || x.o.order - y.o.order)
      .map(({ o, shared }) => ({
        id: o.id,
        nameAr: o.nameAr,
        shared: shared.map((id) => byId.get(id)!).filter(Boolean).map((a) => ({ title: a.shortTitle, href: routes.activity(c.slug, a.slug) })),
      }));
  /** Each keyword once, with how many reports used it (most used first). */
  const keywordCounts = (m: (typeof mapTopics)[number]) => {
    const counts = new Map<string, number>();
    for (const id of m.activityIds)
      for (const k of byId.get(id)?.report?.keywords ?? []) if (m.keywords.includes(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([text, count]) => ({ text, count }));
  };

  // Resolve every link on the server; the client only renders.
  const view: MapTopicView[] = mapTopics.map((m) => ({
    id: m.id,
    slug: m.slug,
    order: m.order,
    nameAr: m.nameAr,
    nameEn: m.nameEn,
    icon: m.icon,
    description: m.description,
    activities: activities
      .filter((a) => m.activityIds.includes(a.id))
      .map((a) => ({
        id: a.id,
        title: a.title,
        href: routes.activity(c.slug, a.slug),
        type: a.programLabel ?? variantLabel[activityVariant(a)],
      })),
    keywords: keywordCounts(m),
    related: relatedOf(m),
    relatedIds: m.relatedMapTopicIds,
    // Links to the 12 knowledge topics appear only while that section is on.
    knowledgeTopics: getTopicsByIds(bundle, features.knowledgeTopics ? m.knowledgeTopicIds : []).map((t) => ({
      id: t.id,
      name: t.name,
      href: routes.topic(c.slug, t.slug),
    })),
  }));

  return (
    <>
      <PageHeader
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [{ label: "خريطة الترابط المعرفي" }])}
        eyebrow={c.shortTitle}
        title="خريطة الترابط المعرفي"
        lead="استكشف العلاقات بين الموضوعات والأفكار والجلسات وورش العمل، وكيف امتدت القضايا المشتركة عبر محتوى المؤتمر. اختر أي دائرة لعرض تفاصيلها."
      />
      <div className="container-page pt-8 pb-24 md:pt-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-surface-muted" aria-busy="true" />}>
          <KnowledgeConstellation topics={view} />
        </Suspense>
      </div>
    </>
  );
}
