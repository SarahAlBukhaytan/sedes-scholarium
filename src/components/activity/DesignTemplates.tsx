"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { Download, ExternalLink, FileText, Maximize2, X } from "lucide-react";
import type { DesignTemplate } from "@/content/types";
import { PendingNote } from "@/components/ui/PendingNote";
import { RuledHeading } from "@/components/ui/RuledHeading";

const slots = [
  { key: "ar", label: "النسخة العربية", lang: "ar" },
  { key: "en", label: "النسخة الإنجليزية", lang: "en" },
] as const;

/**
 * «القوالب المعرفية» for a session/workshop.
 * - `report`: the official Arabic report template rebuilt in HTML/CSS
 *   (ReportTemplate), with `pdf` = this activity's own report file.
 * - `templates`: designer image files (Arabic + English), when supplied.
 *   Each version has its own clearly labelled slot.
 * - Images keep their native aspect ratio (explicit width/height), load lazily,
 *   and can be enlarged in a dialog or opened in a new tab for reading.
 * - Until the Graphic Designers' files are supplied, nothing fake is shown.
 */
export function DesignTemplates({
  templates,
  report,
  pdf,
}: {
  templates?: { ar?: DesignTemplate; en?: DesignTemplate };
  report?: ReactNode;
  pdf?: string;
}) {
  const hasAny = Boolean(templates?.ar || templates?.en);

  return (
    <section aria-labelledby="templates-h">
      <RuledHeading id="templates-h">القوالب المعرفية</RuledHeading>
      <div className="mt-5">
        {report ? (
          <div>
            {report}
            {pdf && (
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track-event="report-pdf-open"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-deep px-5 text-sm font-semibold text-ivory hover:bg-teal"
                >
                  <FileText className="size-4" aria-hidden="true" />
                  التقرير الأصلي (PDF)
                </a>
                <a
                  href={pdf}
                  download
                  data-track-event="report-pdf-download"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal/30 bg-surface px-5 text-sm font-semibold text-teal hover:border-teal hover:bg-teal-soft"
                >
                  <Download className="size-4" aria-hidden="true" />
                  تحميل
                </a>
              </div>
            )}
          </div>
        ) : !hasAny ? (
          <PendingNote>تُضاف القوالب الرسمية للجلسة بالعربية والإنجليزية عند اعتمادها من فريق التصميم.</PendingNote>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {slots.map((s) => {
              const t = templates?.[s.key];
              return (
                <figure key={s.key} className="min-w-0">
                  <figcaption className="mb-3 text-sm font-semibold text-sand-ink">{s.label}</figcaption>
                  {t ? (
                    <TemplateImage template={t} label={s.label} lang={s.lang} />
                  ) : (
                    <PendingNote>تُضاف {s.label} عند اعتمادها.</PendingNote>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function TemplateImage({ template, label, lang }: { template: DesignTemplate; label: string; lang: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div lang={lang}>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group relative block w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface"
      >
        <Image
          src={template.src}
          alt={template.alt}
          width={template.width}
          height={template.height}
          sizes="(min-width: 768px) 26rem, 100vw"
          loading="lazy"
          className="h-auto w-full"
        />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-deep/85 px-3 py-1.5 text-xs font-semibold text-ivory opacity-90 transition-opacity group-hover:opacity-100">
          <Maximize2 className="size-3.5" aria-hidden="true" />
          تكبير
        </span>
        <span className="sr-only">تكبير {label}</span>
      </button>
      <a
        href={template.src}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-teal hover:text-deep"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        فتح الصورة بحجمها الكامل
      </a>

      <dialog
        ref={dialogRef}
        aria-label={label}
        className="m-auto max-h-[94vh] w-[min(96vw,64rem)] overflow-auto rounded-[var(--radius-card)] bg-ivory p-0 backdrop:bg-deep/70"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ivory/95 px-4 py-2">
          <p className="text-sm font-semibold text-deep">{label}</p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex size-10 items-center justify-center rounded-full text-deep hover:bg-surface-muted"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">إغلاق</span>
          </button>
        </div>
        <Image
          src={template.src}
          alt={template.alt}
          width={template.width}
          height={template.height}
          sizes="96vw"
          className="h-auto w-full"
        />
      </dialog>
    </div>
  );
}
