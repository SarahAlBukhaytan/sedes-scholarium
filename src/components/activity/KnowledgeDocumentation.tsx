"use client";

import { useState } from "react";
import { ChevronDown, Download, FileText } from "lucide-react";

export interface ReportPage {
  src: string;
  width: number;
  height: number;
}

/**
 * «تقرير الجلسة / الورشة» — ONE drop-down showing the activity's single,
 * original approved report: its page(s) as high-resolution images rendered
 * from the official PDF (same layout, colours, stars and text; no PDF reader
 * UI), followed by a small «تحميل التقرير PDF» button (the unchanged file).
 * No second version of the report is shown. Images load only when opened.
 */
export function KnowledgeDocumentation({
  noun,
  pages,
  pdf,
  fileName,
}: {
  noun: string;
  pages: ReportPage[];
  pdf: string | null;
  fileName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section aria-labelledby="documentation-h">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="documentation-panel"
        onClick={() => setOpen((v) => !v)}
        data-track-event={open ? undefined : "report-pdf-open"}
        className="flex w-full items-center gap-4 rounded-[var(--radius-card)] bg-surface px-5 py-4 text-start text-deep transition-colors hover:bg-lilac-soft"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-deep text-sky" aria-hidden="true">
          <FileText className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span id="documentation-h" className="block font-display text-lg font-bold md:text-xl">
            تقرير {noun}
          </span>
          <span className="block text-sm text-muted">التقرير المعرفي الأصلي المعتمد</span>
        </span>
        <ChevronDown className={`size-5 shrink-0 text-royal transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div id="documentation-panel" className="mt-3 space-y-4 rounded-[var(--radius-card)] bg-surface p-3 md:p-6">
          <div>
            <div className="space-y-3">
              {pages.length === 0 ? (
                <p className="rounded-[var(--radius-control)] bg-[var(--sedes-gray-200)] p-4 text-center text-deep">
                  {pdf ? "معاينة التقرير غير متاحة حاليًا، ويمكن تحميله أدناه." : "التقرير غير متاح حاليًا."}
                </p>
              ) : (
                pages.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- pre-rendered report page with its exact pixel size
                  <img
                    key={p.src}
                    src={p.src}
                    width={p.width}
                    height={p.height}
                    alt={pages.length > 1 ? `تقرير ${noun} — الصفحة ${i + 1} من ${pages.length}` : `تقرير ${noun} بتصميمه الأصلي`}
                    decoding="async"
                    className="mx-auto block h-auto w-full max-w-[56rem] rounded-[var(--radius-control)] border border-line"
                  />
                ))
              )}
            </div>
          </div>

          {pdf && (
            <div className="border-t border-line pt-4">
              <a
                href={pdf}
                download={fileName}
                data-track-event="report-pdf-download"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-semibold text-deep hover:border-deep hover:bg-deep hover:text-ivory"
              >
                <Download className="size-4" aria-hidden="true" />
                تحميل التقرير PDF
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
