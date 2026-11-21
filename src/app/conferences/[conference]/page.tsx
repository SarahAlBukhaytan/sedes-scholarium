import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  CalendarDays,
  Clock,
  Compass,
  Hash,
  MapPin,
  Mic,
  Network,
  PenTool,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { MediaGallery } from "@/components/conference/MediaGallery";
import { ProgramTimeline } from "@/components/conference/ProgramTimeline";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StarPattern } from "@/components/motif/StarPattern";
import { features } from "@/config/features";
import { getConferenceStats } from "@/lib/content";
import { countLabel } from "@/lib/labels";
import { requireBundle } from "@/lib/page";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ conference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = requireBundle((await params).conference);
  return { title: b.conference.title, description: b.conference.summary };
}

interface Entry {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
  cta: string;
  /** Knowledge-layer entries get a navy icon for gentle emphasis. */
  knowledge?: boolean;
}

export default async function ConferencePage({ params }: Props) {
  const bundle = requireBundle((await params).conference);
  const c = bundle.conference;
  const s = getConferenceStats(bundle);

  // Counts shown here are derived from the program data, never typed in.
  const stats = [
    { value: s.keynotes, label: "الجلسات الرئيسة" },
    { value: s.scientific, label: "الجلسات العلمية" },
    { value: s.workshops, label: "ورش العمل" },
  ];

  const axesCount = c.axes.length;
  // «محتوى المؤتمر» — seven entries, in the approved order.
  const entries: Entry[] = [
    {
      href: routes.mainSessions(c.slug),
      icon: Mic,
      title: "الجلسات الرئيسة",
      text: `${countLabel(s.keynotes, ["جلسة رئيسة واحدة تتناول", "جلستان رئيستان تتناولان", "جلسات رئيسة تتناول", "جلسة رئيسة تتناول"])} القضايا الكبرى والتحولات المؤثرة في قطاع الترجمة.`,
      cta: "استعرض الجلسات",
    },
    {
      href: routes.scientificSessions(c.slug),
      icon: BookOpenText,
      title: "الجلسات العلمية",
      text: `${countLabel(s.scientific, ["جلسة علمية واحدة تناقش", "جلستان علميتان تناقشان", "جلسات علمية تناقش", "جلسة علمية تناقش"])} قضايا الترجمة من زوايا أكاديمية وبحثية ومهنية متنوعة.`,
      cta: "استعرض الجلسات",
    },
    {
      href: routes.workshops(c.slug),
      icon: PenTool,
      title: "ورش العمل",
      text: `${countLabel(s.workshops, ["ورشة عمل واحدة تقدم", "ورشتا عمل تقدمان", "ورش عمل تقدم", "ورشة عمل تقدم"])} محتوى تطبيقيًا متخصصًا في مجالات الترجمة وتقنياتها وممارساتها.`,
      cta: "استعرض الورش",
    },
    {
      href: routes.axes(c.slug),
      icon: Compass,
      title: "محاور المؤتمر",
      // The number appears only once the official axes are entered in the data.
      text:
        axesCount > 0
          ? `${countLabel(axesCount, ["محور رئيس واحد شكّل", "محوران رئيسان شكّلا", "محاور رئيسة شكّلت", "محورًا رئيسًا شكّلت"])} الإطار الموضوعي الرسمي لبرنامج المؤتمر وفعالياته.`
          : "المحاور الرئيسة التي شكّلت الإطار الموضوعي الرسمي لبرنامج المؤتمر وفعالياته.",
      cta: "استكشف المحاور",
    },
    ...(features.knowledgeTopics
      ? [
          {
            href: routes.topics(c.slug),
            icon: Hash,
            title: "الموضوعات المعرفية",
            text: "الموضوعات المستخلصة من تقارير الجلسات وورش العمل وكلماتها المفتاحية، وما تكرر منها وتقاطع بين الفعاليات.",
            cta: "استكشف الموضوعات",
            knowledge: true,
          },
        ]
      : []),
    {
      href: routes.knowledgeMap(c.slug),
      icon: Network,
      title: "خريطة الترابط المعرفي",
      text: "استكشف العلاقات بين الموضوعات والأفكار والجلسات وورش العمل، وكيف امتدت القضايا المشتركة عبر محتوى المؤتمر.",
      cta: "استكشف الخريطة",
      knowledge: true,
    },
    {
      href: routes.outcome(c.slug),
      icon: ScrollText,
      title: "حصيلة المؤتمر",
      text: "قراءة كلية تستخلص أبرز ما خلص إليه المؤتمر من أفكار واتجاهات ورسائل ومخرجات معرفية.",
      cta: "استكشف الحصيلة",
      knowledge: true,
    },
  ];

  const meta = [
    { icon: CalendarDays, label: "التاريخ", value: c.dateLabel },
    { icon: Clock, label: "الوقت", value: c.dailyHours },
    { icon: MapPin, label: "المكان", value: `${c.venue}، ${c.city}` },
  ].filter((m) => m.value);

  return (
    <>
      {/* ───── A. Hero ───── */}
      <section className="on-dark relative overflow-hidden bg-deep text-ivory">
        <StarPattern tone="dark" className="absolute inset-0 h-full w-full" />
        <div className="container-page relative pt-6 pb-12 md:pt-10 md:pb-14">
          <Breadcrumbs
            tone="dark"
            items={[
              { label: "الرئيسة", href: routes.home() },
              { label: "المؤتمرات", href: routes.conferences() },
              { label: c.shortTitle },
            ]}
          />
          <div className="mt-8 max-w-3xl md:mt-10">
            <h1 className="font-display text-[2.1rem] leading-tight font-bold md:text-[3.25rem] md:leading-[1.25]">{c.title}</h1>
            <p className="mt-2 text-base text-ivory/85 md:text-lg">بالشراكة مع {c.partner}</p>
            {c.theme && <p className="mt-4 font-display text-xl font-bold text-sand md:text-2xl">{c.theme}</p>}
            <p className="mt-5 max-w-2xl text-lg leading-9 text-ivory md:text-xl md:leading-10">{c.summary}</p>
          </div>
          <dl className="mt-9 grid gap-3 sm:grid-cols-3 md:max-w-4xl">
            {meta.map((m) => (
              <div key={m.label} className="flex items-start gap-3 rounded-[var(--radius-card)] bg-indigo px-4 py-3.5">
                <m.icon className="mt-1 size-5 shrink-0 text-sand" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-sm text-ivory/75">{m.label}</dt>
                  <dd className="mt-0.5 text-base leading-7 font-semibold">{m.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───── B. Statistics ───── */}
      <section aria-label="المؤتمر بالأرقام" className="border-b border-line-strong">
        <dl className="container-page grid grid-cols-3 [&>div+div]:border-s [&>div+div]:border-line">
          {stats.map((st) => (
            <div key={st.label} className="flex flex-col py-6 text-center md:py-8">
              <dd className="font-display text-3xl font-bold text-deep tabular-nums md:text-4xl">{st.value}</dd>
              <dt className="order-last mt-1 text-sm text-muted md:text-base">{st.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ───── C. Conference content — seven equal cards ───── */}
      <div>
      <section id="content" aria-labelledby="content-h" className="container-page scroll-mt-24 py-14 md:py-16">
        <span className="section-rule" aria-hidden="true" />
        <h2 id="content-h" className="mt-4 font-display text-2xl font-bold text-deep md:text-3xl">
          محتوى المؤتمر
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted md:text-lg">
          استكشف الحصيلة المعرفية للمؤتمر، من جلساته وورش عمله إلى محاوره والموضوعات التي برزت وتقاطعت عبر فعالياته.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {entries.map((e) => (
            <li key={e.title}>
              <Link
                href={e.href}
                className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-[box-shadow,border-color] hover:border-teal/40 hover:shadow-lift md:p-7"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-11 items-center justify-center rounded-full ${
                    e.knowledge ? "bg-deep text-sand" : "bg-teal-soft text-teal"
                  }`}
                >
                  <e.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-deep group-hover:text-teal">{e.title}</h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-8 text-muted">{e.text}</p>
                <span className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-base font-semibold text-teal">
                  {e.cta}
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      </div>

      {/* ───── D. Program ───── */}
      <section id="program" aria-labelledby="program-h" className="container-page scroll-mt-24 py-14 md:py-16">
        <h2 id="program-h" className="font-display text-2xl font-bold text-deep md:text-3xl">
          برنامج المؤتمر
        </h2>
        <div className="mt-7">
          <ProgramTimeline bundle={bundle} />
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">
          المصدر: البرنامج الرسمي المنشور للمؤتمر.
        </p>
      </section>

      {/* ───── E. Photo / video coverage ───── */}
      {c.media && c.media.length > 0 && (
        <section id="coverage" aria-labelledby="coverage-h" className="surface-gray scroll-mt-24">
          <div className="container-page py-14 md:py-16">
            <span className="section-rule" aria-hidden="true" />
            <h2 id="coverage-h" className="mt-4 font-display text-2xl font-bold text-deep md:text-3xl">
              التغطية المصورة
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
              صور ومقطع مصوّر من أيام المؤتمر. اختر أي صورة لعرضها بحجم أكبر.
            </p>
            <div className="mt-8">
              <MediaGallery items={c.media} label={`التغطية المصورة — ${c.title}`} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
