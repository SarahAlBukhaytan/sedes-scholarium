import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StarGlyph, StarPattern } from "@/components/motif/StarPattern";
import { initiative } from "@/content/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "عن المبادرة" };

/** Renders the initiative's Latin name inside a sentence in its own LTR span. */
function WithName({ text }: { text: string }) {
  const parts = text.split(initiative.publicName);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <bdi dir="ltr">{initiative.publicName}</bdi>}
        </span>
      ))}
    </>
  );
}

/**
 * «عن المبادرة» — the initiative profile («Sedes Scholarium COLS KSU.pdf»):
 * overview, vision / mission / goal, the meaning of the name and the
 * four-level organisational structure. Texts are used verbatim (site.ts).
 */
export default function AboutPage() {
  const { structure } = initiative;
  return (
    <>
      <PageHeader
        crumbs={[{ label: "الرئيسية", href: routes.home() }, { label: "عن المبادرة" }]}
        title="عن المبادرة"
        lead={initiative.umbrella}
      />

      <div className="container-page space-y-14 pt-4 pb-20 md:space-y-20 md:pt-6">
        {/* Overview */}
        <section aria-labelledby="overview-h" className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <span className="section-rule" aria-hidden="true" />
            <h2 id="overview-h" className="mt-4 font-display text-2xl font-bold text-deep md:text-3xl">
              نبذة عن مبادرة <bdi dir="ltr">{initiative.publicName}</bdi>
            </h2>
            <p className="mt-5 text-lg leading-9 text-ink md:text-[1.15rem] md:leading-[2.2rem]">{initiative.definition}</p>
          </div>
          <dl className="space-y-8 border-s border-line-strong ps-7 md:ps-9">
            {[
              { term: "الرؤية", text: initiative.vision },
              { term: "الرسالة", text: initiative.mission },
              { term: "الهدف", text: initiative.goal },
            ].map((x) => (
              <div key={x.term} className="relative">
                <StarGlyph color="var(--sedes-blue)" className="absolute top-1.5 -right-[2.35rem] size-5 bg-[var(--sedes-gray-200)] md:-right-[2.85rem]" />
                <dt className="font-display text-xl font-bold text-deep">{x.term}</dt>
                <dd className="mt-2 text-[1.05rem] leading-8 text-ink">{x.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Meaning of the name */}
        <section
          aria-labelledby="naming-h"
          className="on-dark relative overflow-hidden rounded-[1.5rem] bg-deep px-6 py-10 text-ivory md:px-12 md:py-14"
        >
          <StarPattern tone="dark" density="sparse" className="absolute inset-0 h-full w-full" />
          <div className="relative max-w-3xl">
            <span className="section-rule" aria-hidden="true" />
            <h2 id="naming-h" className="mt-4 font-display text-2xl font-bold text-sky md:text-3xl">
              دلالة التسمية
            </h2>
            <p className="mt-5 text-[1.05rem] leading-9 text-ivory/90 md:text-lg md:leading-[2.2rem]">
              <WithName text={initiative.naming} />
            </p>
          </div>
        </section>

        {/* Organisational structure */}
        <section aria-labelledby="structure-h">
          <span className="section-rule" aria-hidden="true" />
          <h2 id="structure-h" className="mt-4 font-display text-2xl font-bold text-deep md:text-3xl">
            الهيكل التنظيمي
          </h2>
          <p className="mt-3 text-lg leading-8 text-ink">{structure.intro}</p>

          <ol className="mt-8 grid gap-5 lg:grid-cols-2">
            {structure.levels.map((level, i) => (
              <li key={level.id} className="card flex flex-col p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-deep font-display text-lg font-bold text-sky tabular-nums">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-xl leading-8 font-bold text-deep">{level.title}</h3>
                </div>
                <p className="mt-4 text-[1.02rem] leading-8 text-ink">{level.text}</p>
                {"list" in level && (
                  <ul className="mt-2 list-disc space-y-1 ps-6 text-[1.02rem] leading-8 text-ink marker:text-blue">
                    {level.list.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                )}
                {"after" in level && <p className="mt-2 text-[1.02rem] leading-8 text-ink">{level.after}</p>}
                <h4 className="mt-6 border-s-[3px] border-blue ps-3 font-display text-base font-bold text-blue">المهام والمسؤوليات</h4>
                <ul className="mt-3 list-disc space-y-1.5 ps-6 text-[0.98rem] leading-8 text-ink marker:text-blue">
                  {level.tasks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <Link
            href={routes.team()}
            className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-deep/25 bg-transparent px-5 font-semibold text-deep transition-colors hover:border-deep hover:bg-deep hover:text-ivory"
          >
            تعرّف على الفريق
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
