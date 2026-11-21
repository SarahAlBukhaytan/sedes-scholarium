import type { Metadata } from "next";
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
 * overview, vision / mission / goal and the meaning of the name. Texts are
 * used verbatim (site.ts). The organisational structure (pp.3–4) is for
 * internal use only and is deliberately not shown.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "الرئيسة", href: routes.home() }, { label: "عن المبادرة" }]}
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
      </div>
    </>
  );
}
