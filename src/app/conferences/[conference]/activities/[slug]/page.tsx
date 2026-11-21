import type { Metadata } from "next";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ActivityTypeBadge } from "@/components/activity/ActivityTypeBadge";
import { RelatedContent } from "@/components/activity/RelatedContent";
import { KnowledgeDocumentation, type ReportPage } from "@/components/activity/KnowledgeDocumentation";
import { SpeakerCard } from "@/components/activity/SpeakerCard";
import { DesignTemplates } from "@/components/activity/DesignTemplates";
import { PageHeader } from "@/components/layout/PageHeader";
import { features } from "@/config/features";
import { PendingNote } from "@/components/ui/PendingNote";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { RuledHeading } from "@/components/ui/RuledHeading";
import { TopicChip } from "@/components/ui/TopicChip";
import type { Activity, ActivityReport } from "@/content/types";
import {
  getActivity,
  getBundle,
  getConferences,
  getDay,
  getRelatedActivities,
  getSpeakersByIds,
  getTopicsOf,
  speakerDisplayName,
  type ConferenceBundle,
} from "@/lib/content";
import { activityVariant, formatTimeRange } from "@/lib/labels";
import { conferenceCrumbs, requireBundle } from "@/lib/page";
import { activityListing, routes } from "@/lib/routes";

type Props = { params: Promise<{ conference: string; slug: string }> };

/**
 * Report files per language: Arabic in /reports, English in /reports/en —
 * both split, unchanged, from the official «Sedes Scholarium تقارير.pdf»
 * (Arabic pp.3–18, English pp.20–35) and named after the activity slug.
 * The Arabic site uses "ar"; the English site will pass "en" once published.
 */
type ReportLang = "ar" | "en";
const reportDir = (conferenceSlug: string, lang: ReportLang) => `/documents/${conferenceSlug}/reports${lang === "en" ? "/en" : ""}`;

/** Each activity's own report file. Offered only when the file really exists. */
function reportPdf(conferenceSlug: string, activitySlug: string, lang: ReportLang = "ar"): string | null {
  const rel = `${reportDir(conferenceSlug, lang)}/${activitySlug}.pdf`;
  return existsSync(path.join(process.cwd(), "public", rel)) ? rel : null;
}

/**
 * The report's page(s) as high-resolution images rendered from the same PDF
 * (<report dir>/pages/, listed in that directory's pages.json).
 */
function reportPages(conferenceSlug: string, activitySlug: string, lang: ReportLang = "ar"): ReportPage[] {
  const dir = reportDir(conferenceSlug, lang);
  const file = path.join(process.cwd(), "public", dir, "pages.json");
  if (!existsSync(file)) return [];
  const all = JSON.parse(readFileSync(file, "utf8")) as Record<string, { src: string; width: number; height: number }[]>;
  return (all[activitySlug] ?? []).map((p) => ({ ...p, src: `${dir}/pages/${p.src}` }));
}

export function generateStaticParams() {
  return getConferences().flatMap((c) =>
    getBundle(c.slug)!.activities.map((a) => ({ conference: c.slug, slug: a.slug })),
  );
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conference, slug } = await params;
  const a = getActivity(requireBundle(conference), slug);
  return a ? { title: a.title, description: a.report?.summary[0] ?? a.description } : {};
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <RuledHeading id={id}>{title}</RuledHeading>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * Activity page: the full details of the session/workshop (speakers,
 * summary, highlighted statement, keywords) from its official report, then
 * ONE drop-down «تقرير الجلسة/الورشة»: the single original approved report
 * (its page images rendered from the PDF), then a small PDF download. Conflicts between report and
 * program stay internal (activity.reviewNotes) and are never shown.
 */
export default async function ActivityPage({ params }: Props) {
  const { conference, slug } = await params;
  const bundle = requireBundle(conference);
  const a = getActivity(bundle, slug);
  if (!a) notFound();
  const c = bundle.conference;

  const variant = activityVariant(a);
  const isWorkshop = variant === "workshop";
  const noun = isWorkshop ? "الورشة" : "الجلسة";
  const day = getDay(c, a.dayId);
  const topics = features.knowledgeTopics ? getTopicsOf(bundle, a) : [];
  const related = getRelatedActivities(bundle, a, 4);
  const listing = activityListing(c.slug, variant);
  const pdf = a.report ? reportPdf(c.slug, a.slug) : null;
  const pages = pdf ? reportPages(c.slug, a.slug) : [];
  const meta = [
    day && `${day.label}، ${day.weekday} ${day.dateLabel}`,
    formatTimeRange(a.start, a.end),
    a.location ?? c.venue,
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [listing, { label: a.shortTitle }])}
        eyebrow={<ActivityTypeBadge variant={variant} label={a.programLabel} />}
        title={a.title}
        lead={<p className="tabular-nums">{meta.join(" · ")}</p>}
        width="reading"
      >
        {topics.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold text-sand-ink">أبرز الموضوعات</p>
            <ul className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t.id}>
                  <TopicChip topic={t} conferenceSlug={c.slug} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </PageHeader>

      <div className="container-reading space-y-12 pt-4 pb-14">
        {a.report ? <ReportDetails report={a.report} noun={noun} /> : <ProgramOnlyBody bundle={bundle} a={a} noun={noun} isWorkshop={isWorkshop} />}

        {/* designer image templates, if ever supplied, keep their own section */}
        {(a.templates?.ar || a.templates?.en) && <DesignTemplates templates={a.templates} />}

        {/* ONE drop-down: the single original report → small download */}
        {a.report && (
          <KnowledgeDocumentation
            noun={noun}
            pages={pages}
            pdf={pdf}
            fileName={`تقرير-${a.slug}.pdf`}
          />
        )}
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related-h">
          <div className="container-reading pb-16">
            <RuledHeading id="related-h">المحتوى المرتبط</RuledHeading>
            <p className="mt-3 text-sm text-muted">فعاليات تلتقي مع هذه {noun} في موضوعاتها.</p>
            <div className="mt-8">
              <RelatedContent
                items={related.map((x) => {
                  const d = getDay(c, x.activity.dayId);
                  return {
                    id: x.activity.id,
                    href: routes.activity(c.slug, x.activity.slug),
                    title: x.activity.title,
                    variant: activityVariant(x.activity),
                    meta: [d?.label, formatTimeRange(x.activity.start)].filter(Boolean).join(" · "),
                    reason: features.knowledgeTopics ? x.sharedTopics.map((t) => t.name) : [],
                  };
                })}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** The session/workshop details from its official report (agreed facts only). */
function ReportDetails({ report: r, noun }: { report: ActivityReport; noun: string }) {
  const speakers = r.people.filter((p) => !p.participant);
  const participants = r.people.filter((p) => p.participant);
  return (
    <>
      <Section id="speakers-h" title={r.peopleHeading}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {speakers.map((p) => (
            <li key={p.name} className="rounded-[var(--radius-card)] bg-surface p-5">
              <p className="font-display text-lg font-bold text-royal">{p.name}</p>
              {p.bio && <p className="mt-1.5 text-[0.95rem] leading-7 text-ink">{p.bio}</p>}
            </li>
          ))}
        </ul>
        {(r.moderator || participants.length > 0) && (
          <dl className="mt-4 space-y-1.5 text-[0.95rem] leading-7">
            {r.moderator && (
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-muted">إدارة الجلسة:</dt>
                <dd className="font-semibold text-deep">{r.moderator}</dd>
              </div>
            )}
            {participants.map((p) => (
              <div key={p.name} className="flex flex-wrap gap-x-2">
                <dt className="text-muted">{p.bio}:</dt>
                <dd className="font-semibold text-deep">{p.name}</dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      <Section id="summary-h" title="الملخص المعرفي">
        {r.summaryWithheld ? (
          <PendingNote>يُضاف الملخص المعرفي لهذه {noun} بعد مراجعته.</PendingNote>
        ) : (
          <div className="space-y-5 text-[1.075rem] leading-9 text-ink">
            {r.summary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </Section>

      {r.highlight && (
        <QuoteBlock heading="عبارة بارزة" quote={{ kind: "documented", text: r.highlight }} attribution={r.highlightAttribution} />
      )}

      <Section id="keywords-h" title="الكلمات المفتاحية">
        <ul className="flex flex-wrap gap-2">
          {r.keywords.map((k) => (
            <li key={k}>
              <a
                href={`/search?q=${encodeURIComponent(k)}`}
                data-track-keyword={k}
                className="inline-flex min-h-9 items-center rounded-full bg-surface px-3.5 text-[0.95rem] text-deep hover:bg-deep hover:text-ivory"
              >
                {k}
              </a>
            </li>
          ))}
        </ul>
        {r.observers && r.observers.length > 0 && (
          <p className="mt-4 text-sm">
            <span className="font-semibold text-deep">{r.observersLabel ?? "الراصدون"}: </span>
            <span className="text-ink">{r.observers.join("، ")}</span>
          </p>
        )}
      </Section>
    </>
  );
}

/** Activities without a report: program data and honest pending states. */
function ProgramOnlyBody({ bundle, a, noun, isWorkshop }: { bundle: ConferenceBundle; a: Activity; noun: string; isWorkshop: boolean }) {
  const speakers = getSpeakersByIds(bundle, a.speakerIds);
  const moderators = getSpeakersByIds(bundle, a.moderatorIds);
  const quoteSpeaker =
    a.quote?.kind === "documented" && a.quote.speakerId ? getSpeakersByIds(bundle, [a.quote.speakerId])[0] : undefined;
  return (
    <>
      <Section id="speakers-h" title={isWorkshop ? "مقدّم/ة الورشة" : "المتحدثون"}>
        {speakers.length + moderators.length > 0 ? (
          <div className="space-y-5">
            {speakers.map((s) => (
              <SpeakerCard key={s.id} speaker={s} />
            ))}
            {moderators.map((s) => (
              <SpeakerCard key={s.id} speaker={s} role="إدارة الجلسة" />
            ))}
          </div>
        ) : (
          <PendingNote>تُضاف الأسماء بعد التحقق منها في البرنامج الرسمي.</PendingNote>
        )}
      </Section>
      <Section id="summary-h" title={`عن ${noun}`}>
        <div className="space-y-4">
          {a.description && <p className="text-lg leading-9 text-ink">{a.description}</p>}
          <PendingNote>يُضاف الملخص بعد وصول تقرير {noun}.</PendingNote>
        </div>
      </Section>
      {a.quote && (
        <QuoteBlock quote={a.quote} attribution={quoteSpeaker ? speakerDisplayName(quoteSpeaker) : a.quote.attribution} />
      )}
    </>
  );
}
