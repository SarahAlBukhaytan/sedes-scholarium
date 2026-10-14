"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Cpu,
  Database,
  Globe2,
  GraduationCap,
  Headphones,
  Languages,
  Layers,
  MessageSquareCode,
  PenLine,
  Target,
  Tent,
  X,
  type LucideIcon,
} from "lucide-react";
import type { MapIcon } from "@/content/types";
import { PendingNote } from "@/components/ui/PendingNote";
import { activityForms, countLabel } from "@/lib/labels";

/** Resolved, serialisable view of a map topic (built on the server). */
export interface MapTopicView {
  id: string;
  slug: string;
  order: number;
  nameAr: string;
  nameEn: string;
  icon: MapIcon;
  description?: string;
  activities: { id: string; title: string; href: string; type: string }[];
  /** Report keywords behind the circle, each once, with how many reports used it. */
  keywords: { text: string; count: number }[];
  /** Documented relations drawn as lines (none today — the reports state none). */
  relatedIds: string[];
  /** Circles sharing ≥2 activities with this one, with those activities as the reason. */
  related: { id: string; nameAr: string; shared: { title: string; href: string }[] }[];
  knowledgeTopics: { id: string; name: string; href: string }[];
}

const icons: Record<MapIcon, LucideIcon> = {
  ai: Cpu,
  literary: BookOpen,
  interpreting: Headphones,
  culture: Globe2,
  education: GraduationCap,
  corpus: Database,
  quality: BadgeCheck,
  skills: Target,
  prompt: MessageSquareCode,
  hajj: Tent,
  "post-editing": PenLine,
  labour: Briefcase,
  technologies: Layers,
  "machine-translation": Languages,
};

/**
 * Horizontal positions (0–100, from the left) for each circle, in order.
 * Desktop: a lively, slightly irregular zigzag. Phones: a gentler one so
 * no circle is clipped and labels never overlap.
 */
const X_DESKTOP = [72, 30, 56, 20, 78, 42, 66, 26, 58, 80, 36, 64, 22, 50];
const X_MOBILE = [62, 38, 55, 39, 61, 44, 58, 40, 56, 62, 41, 58, 40, 52];

interface Frame {
  xs: number[];
  rowH: number; // px between circle centres (vertical)
  pad: number; // px above the first / below the last centre
  size: string; // circle diameter (CSS)
}
const DESKTOP: Frame = { xs: X_DESKTOP, rowH: 212, pad: 112, size: "11rem" };
const MOBILE: Frame = { xs: X_MOBILE, rowH: 188, pad: 96, size: "8.75rem" };

/**
 * خريطة الترابط المعرفي — a long, vertically scrolling constellation of the
 * map topics. The gold thread only links circles visually in reading order;
 * teal lines are drawn ONLY for documented relations (`relatedIds`).
 */
export function KnowledgeConstellation({ topics }: { topics: MapTopicView[] }) {
  const params = useSearchParams();
  const fromUrl = params.get("topic");
  const [selectedId, setSelectedId] = useState<string | null>(
    () => topics.find((t) => t.slug === fromUrl)?.id ?? null,
  );
  const selected = topics.find((t) => t.id === selectedId) ?? null;

  // Esc closes the details.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (id: string) => setSelectedId((cur) => (cur === id ? null : id));
  const nothingLinked = topics.every((t) => !t.activities.length && !t.relatedIds.length && !t.keywords.length);
  const hasRelations = topics.some((t) => t.relatedIds.length > 0);

  return (
    <div>
      <Legend showRelations={hasRelations} />
      <div className="mt-5">
        <PendingNote>
          {nothingLinked
            ? "تُعرض موضوعات الخريطة الأربعة عشر، وتُضاف روابطها بالجلسات وورش العمل وعلاقاتها المعرفية بعد اعتماد المحتوى."
            : "تُربط كل دائرة بالجلسات وورش العمل التي وردت في كلماتها المفتاحية في التقارير. لا تُرسم خطوط بين الدوائر لأن التقارير لا تنص على علاقات مباشرة بين هذه الموضوعات."}
        </PendingNote>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div>
          {/* phones & tablets */}
          <div className="lg:hidden">
            <Constellation frame={MOBILE} topics={topics} selectedId={selectedId} onToggle={toggle} />
          </div>
          {/* desktop */}
          <div className="hidden lg:block">
            <Constellation frame={DESKTOP} topics={topics} selectedId={selectedId} onToggle={toggle} />
          </div>
        </div>

        {/* desktop side panel */}
        <aside className="hidden lg:block" aria-live="polite">
          <div className="sticky top-24">
            {selected ? (
              <div className="card p-6">
                <Details topic={selected} onSelect={setSelectedId} onClose={() => setSelectedId(null)} />
              </div>
            ) : (
              <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong p-5 text-sm leading-7 text-muted">
                اختر دائرة موضوع لعرض الجلسات وورش العمل والكلمات المفتاحية والموضوعات المرتبطة به.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* phones & tablets: bottom sheet */}
      {selected && (
        <section
          aria-live="polite"
          aria-label="تفاصيل الموضوع المحدد"
          className="animate-fade-up fixed inset-x-0 bottom-0 z-40 max-h-[55vh] overflow-y-auto rounded-t-2xl border-t border-line bg-surface px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_-12px_rgb(10_9_49/0.3)] lg:hidden"
        >
          <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong" />
          <Details topic={selected} onSelect={setSelectedId} onClose={() => setSelectedId(null)} />
        </section>
      )}
    </div>
  );
}

function Constellation({
  frame,
  topics,
  selectedId,
  onToggle,
}: {
  frame: Frame;
  topics: MapTopicView[];
  selectedId: string | null;
  onToggle: (id: string) => void;
}) {
  const n = topics.length;
  const height = frame.pad * 2 + (n - 1) * frame.rowH;
  const pos = topics.map((_, i) => ({ x: frame.xs[i % frame.xs.length], y: frame.pad + i * frame.rowH }));
  const selected = topics.find((t) => t.id === selectedId);
  const index = new Map(topics.map((t, i) => [t.id, i]));

  // Documented relations only (deduplicated pairs).
  const relations: [number, number][] = [];
  topics.forEach((t, i) =>
    t.relatedIds.forEach((rid) => {
      const j = index.get(rid);
      if (j !== undefined && i < j) relations.push([i, j]);
    }),
  );

  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const my = (a.y + b.y) / 2;
    return `M${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {/* lines: x in % (viewBox 0–100), y in px; strokes stay crisp at any width */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        fill="none"
      >
        {pos.slice(1).map((p, i) => (
          <path
            key={`thread-${i}`}
            d={curve(pos[i], p)}
            stroke="var(--brand-sand)"
            strokeOpacity={selectedId ? 0.35 : 0.7}
            strokeWidth="1.4"
            strokeDasharray="2 7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {relations.map(([i, j]) => {
          const lit = selectedId && (topics[i].id === selectedId || topics[j].id === selectedId);
          return (
            <path
              key={`rel-${i}-${j}`}
              d={curve(pos[i], pos[j])}
              stroke="var(--brand-teal)"
              strokeOpacity={lit ? 0.9 : selectedId ? 0.12 : 0.45}
              strokeWidth={lit ? 2.2 : 1.4}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* small knots between circles */}
      {pos.slice(1).map((p, i) => (
        <span
          key={`dot-${i}`}
          aria-hidden="true"
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand"
          style={{ left: `${(pos[i].x + p.x) / 2}%`, top: (pos[i].y + p.y) / 2, opacity: selectedId ? 0.4 : 0.85 }}
        />
      ))}

      <ol className="contents">
        {topics.map((t, i) => {
          const Icon = icons[t.icon];
          const isSel = t.id === selectedId;
          const related = selected?.relatedIds.includes(t.id) || t.relatedIds.includes(selectedId ?? "");
          const dim = Boolean(selectedId) && !isSel && !related;
          return (
            <li
              key={t.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos[i].x}%`, top: pos[i].y, width: frame.size, height: frame.size }}
            >
              <button
                type="button"
                aria-pressed={isSel}
                aria-label={`${t.nameAr} — ${t.nameEn}`}
                data-track-map={t.id}
                onClick={() => onToggle(t.id)}
                className={`group relative flex size-full items-center justify-center rounded-full transition-[opacity,transform] duration-300 focus-visible:outline-offset-8 ${
                  dim ? "opacity-45" : "opacity-100"
                } ${isSel ? "scale-[1.04]" : "hover:scale-[1.03]"}`}
              >
                {/* outer rings */}
                <span
                  aria-hidden="true"
                  className={`absolute -inset-3 rounded-full border border-dashed transition-colors ${
                    isSel ? "border-sand" : "border-sand/50 group-hover:border-sand"
                  }`}
                />
                <span aria-hidden="true" className="absolute -inset-1 rounded-full border border-teal/15" />
                {/* orbit dot */}
                <span aria-hidden="true" className="absolute -top-3 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand" />
                {/* disc */}
                <span
                  className={`relative flex size-full flex-col items-center justify-center rounded-full border px-3 text-center shadow-card transition-colors ${
                    isSel ? "border-deep bg-deep text-ivory" : "border-teal/25 bg-surface text-deep group-hover:border-teal/50"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-8 items-center justify-center rounded-full lg:size-9 ${
                      isSel ? "bg-ivory/10 text-sand" : "bg-teal-soft text-teal"
                    }`}
                  >
                    <Icon className="size-4 lg:size-[1.1rem]" />
                  </span>
                  <span className="mt-2 font-display text-[0.8rem] leading-5 font-bold lg:text-[0.95rem] lg:leading-6">
                    {t.nameAr}
                  </span>
                  {t.activities.length > 0 && (
                    <span className={`mt-0.5 text-[0.62rem] leading-4 tabular-nums lg:text-[0.7rem] ${isSel ? "text-sand" : "text-sand-ink"}`}>
                      {countLabel(t.activities.length, activityForms)}
                    </span>
                  )}
                  <span dir="ltr" className={`mt-0.5 text-[0.62rem] leading-4 lg:text-[0.7rem] ${isSel ? "text-ivory/70" : "text-muted"}`}>
                    {t.nameEn}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Legend({ showRelations }: { showRelations: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/80">
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="size-4 rounded-full border border-teal/40 bg-surface ring-1 ring-sand/60 ring-offset-2 ring-offset-ivory" />
        موضوع
      </span>
      <span className="flex items-center gap-2 text-muted">
        <svg width="28" height="10" aria-hidden="true">
          <line x1="2" y1="5" x2="26" y2="5" stroke="var(--brand-sand)" strokeWidth="1.6" strokeDasharray="2 5" strokeLinecap="round" />
        </svg>
        خيط بصري لتسلسل العرض
      </span>
      {showRelations && (
        <span className="flex items-center gap-2 text-muted">
          <svg width="28" height="10" aria-hidden="true">
            <line x1="2" y1="5" x2="26" y2="5" stroke="var(--brand-teal)" strokeWidth="1.8" />
          </svg>
          علاقة موثّقة بين موضوعين
        </span>
      )}
    </div>
  );
}

function Details({
  topic,
  onSelect,
  onClose,
}: {
  topic: MapTopicView;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-sand-ink">موضوع في الخريطة</p>
          <h2 className="mt-1 font-display text-xl leading-8 font-bold text-deep">{topic.nameAr}</h2>
          <p dir="ltr" className="text-end text-sm text-muted">
            {topic.nameEn}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-m-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-deep"
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">إغلاق التفاصيل</span>
        </button>
      </div>

      {topic.description && <p className="mt-3 text-sm leading-7 text-ink/85">{topic.description}</p>}

      <DetailBlock title="الجلسات وورش العمل المرتبطة">
        {topic.activities.length ? (
          <ul className="space-y-1">
            {topic.activities.map((a) => (
              <li key={a.id}>
                <Link href={a.href} className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm leading-6 hover:bg-teal-soft">
                  <ArrowLeft className="mt-1 size-3.5 shrink-0 text-teal" aria-hidden="true" />
                  <span>
                    <span className="block text-xs text-sand-ink">{a.type}</span>
                    <span className="text-deep">{a.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <PendingNote>تُضاف بعد اعتماد الروابط بين الموضوع والفعاليات.</PendingNote>
        )}
      </DetailBlock>

      <DetailBlock title="الكلمات المفتاحية في التقارير">
        {topic.keywords.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {topic.keywords.map((k) => (
              <li key={k.text}>
                <Link
                  href={`/search?q=${encodeURIComponent(k.text)}`}
                  data-track-keyword={k.text}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-3 py-1 text-xs text-deep hover:bg-teal-soft"
                >
                  {k.text}
                  {k.count > 1 && <span className="text-muted tabular-nums">×{k.count}</span>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <PendingNote>تُضاف عند اعتماد الكلمات المفتاحية.</PendingNote>
        )}
      </DetailBlock>

      {/* shown only when a documented relation exists (no empty heading) */}
      {topic.related.length > 0 && (
        <DetailBlock title="موضوعات مرتبطة">
          <p className="mb-2 text-xs leading-5 text-muted">وردت كلماتها المفتاحية معه في تقارير فعاليتين أو أكثر.</p>
          <ul className="space-y-2">
            {topic.related.map((r) => (
              <li key={r.id} className="rounded-lg border border-line bg-surface px-3 py-2">
                <button
                  type="button"
                  onClick={() => onSelect(r.id)}
                  data-track-map={r.id}
                  className="inline-flex min-h-8 items-center gap-1.5 text-sm font-semibold text-teal hover:text-deep"
                >
                  {r.nameAr}
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                </button>
                <p className="text-xs leading-5 text-muted">
                  معًا في: {r.shared.map((s) => s.title).join("، ")}
                </p>
              </li>
            ))}
          </ul>
        </DetailBlock>
      )}

      {topic.knowledgeTopics.length > 0 && (
        <DetailBlock title="في الموضوعات المعرفية">
          <ul className="space-y-1">
            {topic.knowledgeTopics.map((k) => (
              <li key={k.id}>
                <Link href={k.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-deep">
                  {k.name}
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </DetailBlock>
      )}
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-line pt-4">
      <p className="mb-2 text-xs font-semibold text-muted">{title}</p>
      {children}
    </div>
  );
}
