import type { Metadata } from "next";
import { Briefcase, Cpu, GraduationCap, HeartHandshake, Scale, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PendingNote } from "@/components/ui/PendingNote";
import { conferenceCrumbs, requireBundle } from "@/lib/page";

type Props = { params: Promise<{ conference: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = requireBundle((await params).conference);
  return { title: `محاور المؤتمر — ${b.conference.shortTitle}` };
}

/** One icon per official axis (decorative; the text is the content). */
const axisIcons: Record<string, LucideIcon> = {
  "axis-1": HeartHandshake,
  "axis-2": GraduationCap,
  "axis-3": Cpu,
  "axis-4": Briefcase,
  "axis-5": Scale,
};

/**
 * Official conference axes. Content comes only from `conference.axes`
 * (official list, texts unchanged) — never from the knowledge topics or map.
 */
export default async function AxesPage({ params }: Props) {
  const bundle = requireBundle((await params).conference);
  const c = bundle.conference;
  const axes = [...c.axes].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHeader
        crumbs={conferenceCrumbs(c.slug, c.shortTitle, [{ label: "محاور المؤتمر" }])}
        eyebrow={c.shortTitle}
        title="محاور المؤتمر"
        lead="المحاور الرسمية الخمسة التي شكّلت الإطار الموضوعي لبرنامج المؤتمر وفعالياته."
      />
      <div>
        <div className="surface-gray container-page py-10 md:py-14">
          {axes.length === 0 ? (
            <PendingNote>تُضاف محاور المؤتمر الرسمية بأسمائها كما وردت في المصدر الرسمي.</PendingNote>
          ) : (
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {axes.map((axis) => {
                const Icon = axisIcons[axis.id] ?? Briefcase;
                return (
                  <li
                    key={axis.id}
                    className="relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-card md:p-7"
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-blue to-sky" />
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex size-12 items-center justify-center rounded-full bg-deep text-sand" aria-hidden="true">
                        <Icon className="size-6" />
                      </span>
                      <span className="font-latin text-3xl font-bold text-lilac tabular-nums" aria-hidden="true">
                        {String(axis.order).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="sr-only">المحور {axis.order}</p>
                    <h2 className="mt-5 font-display text-xl leading-9 font-bold text-deep md:text-[1.35rem]">{axis.title}</h2>
                    {axis.description && <p className="mt-2 leading-8 text-ink">{axis.description}</p>}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </>
  );
}
