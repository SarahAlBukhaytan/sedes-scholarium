import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { PlatformVisitCounter } from "@/components/analytics/PlatformVisitCounter";
import { StarGlyph, StarPattern } from "@/components/motif/StarPattern";
import { initiative } from "@/content/site";
import { team } from "@/content/team";
import { routes } from "@/lib/routes";

export default function HomePage() {
  return (
    <>
      {/* ───────── Hero (navy, as in the identity's key visual) ───────── */}
      <section className="on-dark relative overflow-hidden bg-deep text-ivory">
        <StarPattern tone="dark" className="absolute inset-0 h-full w-full" />
        <div className="container-page relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="text-sm font-semibold text-sand md:text-base">{initiative.umbrella}</p>
            <h1 className="mt-4">
              <bdi
                dir="ltr"
                className="block text-right font-latin text-[2.1rem] leading-tight font-bold tracking-wide sm:text-5xl lg:text-[3.4rem]"
              >
                {initiative.publicName.toUpperCase()}
              </bdi>
              <span className="mt-4 block max-w-xl text-xl leading-9 font-medium text-lilac-soft md:text-2xl md:leading-[2.6rem]">
                {initiative.descriptor}
              </span>
            </h1>
            <Link
              href={routes.conferences()}
              className="group mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-sand px-7 py-3 font-bold text-deep transition-colors hover:bg-ivory"
            >
              استكشف المؤتمرات
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          {/* brand mark only — the name is already the page title, so the word mark is not repeated */}
          <BrandMark tone="light" variant="mark" priority className="mx-auto h-auto w-56 sm:w-72 lg:w-full lg:max-w-sm" />
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section id="about" aria-labelledby="about-h" className="scroll-mt-24">
        <div className="container-page grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <span className="section-rule" aria-hidden="true" />
            <h2 id="about-h" className="mt-4 font-display text-3xl font-bold text-deep md:text-4xl">
              عن المبادرة
            </h2>
            <p className="mt-5 text-lg leading-9 text-ink md:text-[1.15rem] md:leading-[2.2rem]">{initiative.definition}</p>
          </div>
          <dl className="space-y-8 border-s border-line-strong ps-7 md:ps-9">
            {[
              { term: "رؤيتنا", text: initiative.vision },
              { term: "رسالتنا", text: initiative.mission },
              { term: "هدفنا", text: initiative.goal },
            ].map((x) => (
              <div key={x.term} className="relative">
                <StarGlyph color="var(--sedes-blue)" className="absolute top-1.5 -right-[2.35rem] size-5 bg-[var(--sedes-gray-200)] md:-right-[2.85rem]" />
                <dt className="font-display text-xl font-bold text-deep">{x.term}</dt>
                <dd className="mt-2 text-[1.05rem] leading-8 text-ink">{x.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────── How it works — six stages ───────── */}
      <section aria-labelledby="how-h" className="container-page">
        <div className="on-dark relative overflow-hidden rounded-[1.5rem] bg-royal px-6 py-12 text-ivory md:px-12 md:py-16">
        <StarPattern tone="dark" density="sparse" className="absolute inset-0 h-full w-full" />
        <div className="relative">
          <span className="section-rule" aria-hidden="true" />
          <h2 id="how-h" className="mt-4 font-display text-3xl font-bold md:text-4xl">
            كيف تعمل المبادرة؟
          </h2>
          <p className="mt-3 max-w-xl text-lg leading-8 text-ivory/85">{initiative.workflowIntro}</p>

          {/* phones: one vertical line · tablet: 2 columns · desktop: 3 × 2 */}
          <ol className="relative mt-10 grid gap-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-12">
            {initiative.workflow.map((step, i) => (
              <li key={step.id} className="relative flex gap-5 pb-8 last:pb-0 sm:block sm:border-t sm:border-lilac-soft sm:pt-6 sm:pb-0">
                {i < initiative.workflow.length - 1 && (
                  <span aria-hidden="true" className="absolute top-12 right-6 bottom-0 w-px bg-lilac-soft sm:hidden" />
                )}
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-sand bg-royal font-display text-lg font-bold text-sand tabular-nums">
                  {i + 1}
                </span>
                <div className="pt-2 sm:mt-5 sm:pt-0">
                  <h3 className="font-display text-lg leading-8 font-bold">{step.title}</h3>
                  <p className="mt-2 text-base leading-8 text-ivory/85">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        </div>
      </section>

      {/* ───────── Team ───────── */}
      <section aria-labelledby="team-h">
        <div className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <div>
            <span className="section-rule" aria-hidden="true" />
            <h2 id="team-h" className="mt-4 font-display text-3xl font-bold text-deep md:text-4xl">
              فريق العمل
            </h2>
            <p className="mt-4 max-w-md text-lg leading-8 text-ink">
              تعمل المبادرة عبر ثلاثة مسارات تتكامل في إعداد المادة المعرفية.
            </p>
            <Link
              href={routes.team()}
              className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-deep/25 bg-transparent px-5 font-semibold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-ivory"
            >
              تعرّف على الفريق
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {team.tracks.map((t) => (
              <li key={t.id} className="relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface p-6">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-blue" />
                <StarGlyph className="size-5" />
                <span className="mt-4 font-display text-lg leading-8 font-bold text-deep">{t.name}</span>
                {t.leader && (
                  <span className="mt-2 text-sm leading-6 text-muted">
                    قائدة المسار: <span className="font-semibold text-ink">{t.leader.name}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Platform-wide visit counter (before the footer) ───────── */}
      <PlatformVisitCounter />
    </>
  );
}
