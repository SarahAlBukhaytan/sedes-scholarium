import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Network } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { features } from "@/config/features";
import { RuledHeading } from "@/components/ui/RuledHeading";
import { PendingNote } from "@/components/ui/PendingNote";
import {
  getActivitiesForTopic,
  getBundle,
  getConferences,
  getDay,
  getMapTopic,
  getRelatedTopics,
  getSpeakersByIds,
  getTopic,
  speakerDisplayName,
} from "@/lib/content";
import { activityVariant, countLabel, formatTimeRange, variantLabel, type ActivityVariant } from "@/lib/labels";
import { conferenceCrumbs, requireBundle } from "@/lib/page";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ conference: string; slug: string }> };

export function generateStaticParams() {
  return getConferences().flatMap((c) =>
    getBundle(c.slug)!.topics.map((t) => ({ conference: c.slug, slug: t.slug })),
  );
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conference, slug } = await params;
  const topic = getTopic(requireBundle(conference), slug);
  return topic ? { title: topic.name } : {};
}

const groupOrder: { variant: ActivityVariant; title: string }[] = [
  { variant: "keynote", title: "الجلسات الرئيسة" },
  { variant: "scientific", title: "الجلسات العلمية" },
  { variant: "workshop", title: "ورش العمل" },
];

export default async function TopicPage({ params }: Props) {
  // Section hidden by the initiative director — see src/config/features.ts.
  if (!features.knowledgeTopics) notFound();
  const { conference, slug } = await params;
  const bundle = requireBundle(conference);
  const topic = getTopic(bundle, slug);
  if (!topic) notFound();
  const c = bundle.conference;
  // Counts are shown once every link is backed by report evidence (or approved).
  const approved = c.topicLinksStatus !== "proposed";

  // Both lists come from the shared knowledge model (unique activities / co-occurrence).
  const acts = getActivitiesForTopic(bundle, topic.id);
  const crossing = getRelatedTopics(bundle, topic.id);
  const groups = groupOrder
    .map((g) => ({ ...g, items: acts.filter((a) => activityVariant(a) === g.variant) }))
    .filter((g) => g.items.length > 0);
  // Focus the knowledge map only when an approved link to a map topic exists.
  const mapTopic = topic.mapTopicIds?.length === 1 ? getMapTopic(bundle, topic.mapTopicIds[0]) : undefined;

  return (
    <>
      <PageHeader
        width="reading"
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [
          { label: "الموضوعات المعرفية", href: routes.topics(c.slug) },
          { label: topic.name },
        ])}
        eyebrow="موضوع معرفي"
        title={topic.name}
      />

      <div className="container-reading space-y-14 pt-10 pb-20 md:pt-12">
        {/* 2 — short note */}
        <section aria-labelledby="intro-h">
          <RuledHeading id="intro-h">نبذة موجزة</RuledHeading>
          <div className="mt-5">
            {topic.intro ? (
              <p className="text-lg leading-9 text-ink/85">{topic.intro}</p>
            ) : (
              <PendingNote>تُضاف نبذة معتمدة عن حضور هذا الموضوع في سياق المؤتمر.</PendingNote>
            )}
          </div>
        </section>

        {/* 3 — where it appeared */}
        <section aria-labelledby="appeared-h">
          <RuledHeading id="appeared-h">ظهر في</RuledHeading>
          {acts.length > 0 && (
            <p className="mt-3 text-sm leading-7 text-muted">
              {approved
                ? "يظهر تحت كل فعالية سبب ربطها بهذا الموضوع، كما ورد في تقريرها."
                : "ارتباطات أولية بين الموضوع والفعاليات، قيد الاعتماد."}
            </p>
          )}
          <div className="mt-6 space-y-10">
            {groups.length === 0 && <PendingNote>تُضاف الفعاليات المرتبطة بهذا الموضوع بعد اعتمادها.</PendingNote>}
            {groups.map((g) => (
              <section key={g.variant} aria-labelledby={`${g.variant}-h`}>
                <h3 id={`${g.variant}-h`} className="flex items-baseline gap-3 border-b border-line-strong pb-3">
                  <span className="font-display text-xl font-bold text-deep">{g.title}</span>
                  {approved && <span className="text-sm text-muted tabular-nums">{g.items.length}</span>}
                </h3>
                <ul className="divide-y divide-line">
                  {g.items.map((a) => {
                    const d = getDay(c, a.dayId);
                    const presenters = a.report
                      ? a.report.people.filter((p) => !p.participant).map((p) => p.name)
                      : getSpeakersByIds(bundle, a.speakerIds).map(speakerDisplayName);
                    const evidence = a.topicEvidence?.[topic.id];
                    const meta = [
                      d && `${d.label}، ${d.weekday}`,
                      formatTimeRange(a.start, a.end),
                      a.kind === "workshop" && presenters.length ? presenters.join("، ") : null,
                    ].filter(Boolean);
                    return (
                      <li key={a.id}>
                        <Link
                          href={routes.activity(c.slug, a.slug)}
                          className="group -mx-3 flex items-center gap-5 rounded-lg px-3 py-5 transition-colors hover:bg-surface"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold text-sand-ink">
                              {a.programLabel ?? variantLabel[activityVariant(a)]}
                            </span>
                            <span className="mt-1 block text-lg leading-8 font-semibold break-words text-deep group-hover:text-teal">
                              {a.title}
                            </span>
                            <span className="mt-1 block text-sm text-muted tabular-nums">{meta.join(" · ")}</span>
                            {evidence && (
                              <span className="mt-1.5 block text-sm leading-6 text-sand-ink">سبب الربط: {evidence}</span>
                            )}
                          </span>
                          <ArrowLeft
                            className="size-5 shrink-0 text-teal transition-transform group-hover:-translate-x-1"
                            aria-hidden="true"
                          />
                          <span className="sr-only">{a.kind === "workshop" ? "عرض الورشة" : "عرض الجلسة"}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </section>

        {/* 4 — key ideas */}
        <section aria-labelledby="ideas-h">
          <RuledHeading id="ideas-h">أبرز الأفكار المرتبطة به</RuledHeading>
          <div className="mt-5">
            {topic.keyIdeas?.length ? (
              <ol className="space-y-4">
                {topic.keyIdeas.map((idea, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-display font-bold text-sand-ink tabular-nums">{i + 1}</span>
                    <p className="leading-8">{idea}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <PendingNote>تُدرج أبرز الأفكار بعد أن يعتمدها فريق التوثيق، وحتى ذلك الحين تُقرأ في تقارير الفعاليات أعلاه.</PendingNote>
            )}
          </div>
        </section>

        {/* 5 — related topics (co-occurrence in the same activities) */}
        {crossing.length > 0 && (
          <section aria-labelledby="crossing-h">
            <RuledHeading id="crossing-h">موضوعات تتقاطع معه</RuledHeading>
            <p className="mt-3 text-sm leading-7 text-muted">
              موضوعات ظهرت معه ضمن الجلسات وورش العمل نفسها{approved ? "." : "، وفق الارتباطات الأولية قيد الاعتماد."}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {crossing.map((r) => (
                <li key={r.topic.id} className="flex flex-col rounded-xl border border-line bg-surface p-4">
                  <Link
                    href={routes.topic(c.slug, r.topic.slug)}
                    className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-deep hover:text-teal"
                  >
                    {r.topic.name}
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </Link>
                  {approved && (
                    <p className="mt-1.5 text-sm leading-6 text-muted">
                      معًا في {countLabel(r.shared, ["فعالية واحدة", "فعاليتين", "فعاليات", "فعالية"])}:{" "}
                      {r.activities.map((a, i) => (
                        <span key={a.id}>
                          {i > 0 && "، "}
                          <Link href={routes.activity(c.slug, a.slug)} className="text-teal hover:text-deep hover:underline">
                            {a.shortTitle}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 6 — to the knowledge map */}
        <div>
          <Link
            href={routes.knowledgeMap(c.slug, mapTopic?.slug)}
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-deep px-6 font-semibold text-ivory transition-colors hover:bg-teal"
          >
            <Network className="size-4" aria-hidden="true" />
            استكشف في خريطة الترابط المعرفي
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
