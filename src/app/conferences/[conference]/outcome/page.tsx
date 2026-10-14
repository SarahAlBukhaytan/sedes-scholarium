import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Link2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNote } from "@/components/ui/PendingNote";
import { features } from "@/config/features";
import { RuledHeading } from "@/components/ui/RuledHeading";
import type { OutcomeSection } from "@/content/types";
import type { ConferenceBundle } from "@/lib/content";
import { getActivities, getTopicPairs, getTopicsByIds, getTopicsWithStats } from "@/lib/content";
import { activityForms, activityVariant, countLabel, variantLabel } from "@/lib/labels";
import { conferenceCrumbs, requireBundle } from "@/lib/page";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ conference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = requireBundle((await params).conference);
  return { title: `حصيلة المؤتمر — ${b.conference.shortTitle}` };
}

function Part({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <p className="mb-2 font-display text-sm font-bold text-sand-ink tabular-nums" aria-hidden="true">
        {String(n).padStart(2, "0")}
      </p>
      <RuledHeading id={id} size="lg">
        {title}
      </RuledHeading>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * حصيلة المؤتمر. Only what the sources support is shown:
 *  01 topics — derived from the evidence-backed topic links;
 *  02 messages — the highlighted statement of each activity report, quoted
 *     as printed and attributed to its activity (no general conclusions);
 *  03 shared ideas — topic pairs that meet in the same activities;
 *  04 official recommendations and 05 the overall reading are hidden for
 *     now (features.outcomeRecommendations / outcomeOverallReading).
 */
export default async function OutcomePage({ params }: Props) {
  const bundle = requireBundle((await params).conference);
  const c = bundle.conference;
  const outcome = bundle.outcome;
  const prominent = getTopicsWithStats(bundle).filter((t) => t.total >= 3);
  const pairs = getTopicPairs(bundle, 5).filter((p) => p.activities.length >= 2);
  const messages = getActivities(bundle).filter((a) => a.report?.highlight && !a.report.highlightNeedsReview);

  return (
    <>
      <PageHeader
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [{ label: "حصيلة المؤتمر" }])}
        width="reading"
        eyebrow={c.shortTitle}
        title="حصيلة المؤتمر"
        lead="قراءة موجزة للصورة المعرفية للمؤتمر كما تظهر في تقارير جلساته وورش عمله: ما برز من موضوعات، وما حملته الفعاليات من رسائل."
      />

      <div>
      <div className="container-reading space-y-14 py-12 md:py-14">
        <Part id="topics-h" n={1} title="الموضوعات التي برزت">
          {!features.knowledgeTopics || prominent.length === 0 ? (
            <PendingNote>تُضاف الموضوعات التي برزت في المؤتمر بعد ربطها بالفعاليات.</PendingNote>
          ) : (
            <>
              <ul className="flex flex-wrap gap-2.5">
                {prominent.map(({ topic, total }) => (
                  <li key={topic.id}>
                    <Link
                      href={routes.topic(c.slug, topic.slug)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-deep transition-colors hover:border-teal hover:bg-teal-soft"
                    >
                      {topic.name}
                      <span className="text-sm text-muted tabular-nums">({total})</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-7 text-muted">
                الموضوعات التي ارتبطت بثلاث فعاليات أو أكثر، والرقم عدد الفعاليات بحسب الكلمات المفتاحية والملخصات في تقاريرها.
              </p>
            </>
          )}
        </Part>

        <Part id="messages-h" n={2} title="أبرز الرسائل">
          {messages.length === 0 ? (
            <PendingNote>تُستخلص من تقارير الجلسات والورش بعد وصولها.</PendingNote>
          ) : (
            <>
              <p className="mb-6 text-sm leading-7 text-muted">
                العبارة البارزة في تقرير كل فعالية، بنصها كما وردت، منسوبةً إلى فعاليتها.
              </p>
              <ol className="space-y-6">
                {messages.map((a) => (
                  <li key={a.id} className="border-s-2 border-blue ps-5">
                    <p className="font-display text-lg leading-9 text-deep md:text-xl md:leading-10">«{a.report!.highlight}»</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {a.report!.highlightAttribution && <span className="text-ink">{a.report!.highlightAttribution} — </span>}
                      <Link href={routes.activity(c.slug, a.slug)} className="inline-flex items-center gap-1 font-semibold text-teal hover:text-deep">
                        {a.programLabel ?? variantLabel[activityVariant(a)]}: {a.shortTitle}
                        <ArrowLeft className="size-3.5" aria-hidden="true" />
                      </Link>
                    </p>
                  </li>
                ))}
              </ol>
            </>
          )}
        </Part>

        <Part id="shared-h" n={3} title="الأفكار المشتركة">
          {outcome?.crossCuttingIdeas.items?.length ? (
            <OutcomeItems section={outcome.crossCuttingIdeas} bundle={bundle} />
          ) : !features.knowledgeTopics || pairs.length === 0 ? (
            <PendingNote>تُضاف الأفكار المشتركة بين الجلسات وورش العمل بعد اعتماد الحصيلة.</PendingNote>
          ) : (
            <>
              <p className="leading-8 text-ink">موضوعات التقت في فعاليتين أو أكثر، بحسب ربط الموضوعات بالفعاليات:</p>
              <ul className="mt-5 space-y-3">
                {pairs.map((p) => (
                  <li key={`${p.a.id}-${p.b.id}`} className="rounded-[var(--radius-card)] border border-line bg-surface p-4 md:p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <Link
                        href={routes.topic(c.slug, p.a.slug)}
                        className="rounded-full bg-teal-soft px-3.5 py-1.5 font-semibold text-deep hover:bg-deep hover:text-ivory"
                      >
                        {p.a.name}
                      </Link>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
                        <Link2 className="size-4" aria-hidden="true" />
                        يتقاطع مع
                      </span>
                      <Link
                        href={routes.topic(c.slug, p.b.slug)}
                        className="rounded-full bg-teal-soft px-3.5 py-1.5 font-semibold text-deep hover:bg-deep hover:text-ivory"
                      >
                        {p.b.name}
                      </Link>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      معًا في {countLabel(p.activities.length, activityForms)}:{" "}
                      {p.activities.map((a, i) => (
                        <span key={a.id}>
                          {i > 0 && "، "}
                          <Link href={routes.activity(c.slug, a.slug)} className="text-teal hover:text-deep hover:underline">
                            {a.shortTitle}
                          </Link>
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Part>

        {/* 04 and 05 are hidden for now (src/config/features.ts) — code and data kept. */}
        {features.outcomeRecommendations && (
          <Part id="recs-h" n={4} title="المخرجات والتوصيات">
            <OutcomeItems section={outcome?.recommendations} bundle={bundle}>
              {outcome?.recommendations.note ?? "تُنشر بنصها المعتمد من الجهة المنظمة دون إعادة صياغة."}
            </OutcomeItems>
          </Part>
        )}

        {features.outcomeOverallReading && (
          <Part id="reading-h" n={5} title="الصورة المعرفية للمؤتمر">
            {outcome?.overallReading ? (
              <p className="font-display text-xl leading-10 text-deep">{outcome.overallReading}</p>
            ) : (
              <PendingNote>تُكتب القراءة الختامية بعد اكتمال التوثيق ومراجعته.</PendingNote>
            )}
          </Part>
        )}
      </div>
      </div>
    </>
  );
}

/** Editorial items with optional topic links — or a quiet pending line. */
function OutcomeItems({
  section,
  bundle,
  children,
}: {
  section?: OutcomeSection;
  bundle: ConferenceBundle;
  children?: ReactNode;
}) {
  if (!section?.items?.length) return <PendingNote>{children}</PendingNote>;
  const c = bundle.conference;
  return (
    <ol className="space-y-6">
      {section.items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="font-display font-bold text-sand-ink tabular-nums">{i + 1}</span>
          <div>
            <p className="text-lg leading-9">{item.text}</p>
            {features.knowledgeTopics && item.topicIds?.length ? (
              <p className="mt-1 text-sm text-muted">
                {getTopicsByIds(bundle, item.topicIds).map((t, j) => (
                  <span key={t.id}>
                    {j > 0 && "، "}
                    <Link href={routes.topic(c.slug, t.slug)} className="text-teal hover:underline">
                      {t.name}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
