import type { Metadata } from "next";
import { BrandMark } from "@/components/brand/BrandMark";
import { PageHeader } from "@/components/layout/PageHeader";
import { StarGlyph } from "@/components/motif/StarPattern";
import { team } from "@/content/team";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "فريق العمل" };

/**
 * Web rendering of the official team chart (Sedes Scholarium V2.pdf, p.1):
 * founder → «القيادات» (track leaders) → the three tracks with their members
 * → academic supervision. Same order and wording as the chart, built as
 * real text so it stays readable and searchable on every screen size.
 */
export default function TeamPage() {
  const founder = team.head[0];
  return (
    <>
      <PageHeader
        crumbs={[{ label: "الرئيسية", href: routes.home() }, { label: "فريق العمل" }]}
        title="فريق العمل"
        lead="الهيكل التنظيمي للمبادرة كما ورد في ملفها الرسمي: الرئاسة، والقيادات، والمسارات الثلاثة بأعضائها، والإشراف الأكاديمي."
      />

      <div className="container-page space-y-6 pt-10 pb-20 md:pt-12">
        {/* Founder */}
        {founder && (
          <section aria-label="رئاسة المبادرة" className="card flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <p className="font-display text-2xl font-bold text-blue md:text-3xl">{founder.name}</p>
              <p className="mt-1.5 text-lg text-deep">{founder.role}</p>
            </div>
            <BrandMark variant="full" className="h-auto w-32 md:w-40" />
          </section>
        )}

        {/* Leaders */}
        {/* as in the official chart: blue band, navy title bar, navy names, white roles */}
        <section aria-labelledby="leaders-h" className="relative overflow-hidden rounded-[var(--radius-card)] bg-blue px-5 py-8 text-ivory md:px-8 md:py-10">
          <h2 id="leaders-h" className="relative mx-auto w-fit rounded-lg bg-deep px-10 py-2 font-display text-xl font-bold md:text-2xl">
            القيادات
          </h2>
          <ul className="relative mt-8 grid gap-6 text-center sm:grid-cols-3">
            {team.tracks
              .filter((t) => t.leader)
              .map((t) => (
                <li key={t.id}>
                  <p className="font-display text-xl font-bold text-deep md:text-2xl">{t.leader!.name}</p>
                  <p className="mt-1 text-base text-ivory">{t.leader!.role}</p>
                </li>
              ))}
          </ul>
        </section>

        {/* Tracks and members */}
        {team.tracks.map((t) => (
          <section key={t.id} aria-labelledby={`${t.id}-h`} className="card p-5 md:p-7">
            <div className="relative flex items-center">
              <StarGlyph className="absolute -right-1 size-9 md:size-11" />
              <h2
                id={`${t.id}-h`}
                className="mx-4 flex-1 rounded-md bg-deep px-4 py-2 text-center font-display text-lg font-bold text-sand md:mx-5 md:text-xl"
              >
                {t.name}
                <span className="sr-only"> — {t.members.length} أعضاء</span>
              </h2>
              <StarGlyph className="absolute -left-1 size-9 md:size-11" />
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {t.members.map((m) => (
                <li key={m} className="rounded-lg bg-[var(--sedes-gray-200)] px-3 py-2 text-center text-[0.95rem] leading-7 text-ink">
                  {m}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Academic supervision */}
        {team.supervision && (
          <section aria-label="الإشراف الأكاديمي" className="relative overflow-hidden rounded-[var(--radius-card)] bg-deep px-6 py-9 text-center text-ivory">
            <p className="relative font-display text-2xl font-bold md:text-3xl">{team.supervision.name}</p>
            <p className="relative mt-2 text-xl font-bold text-blue">{team.supervision.role}</p>
          </section>
        )}
      </div>
    </>
  );
}
