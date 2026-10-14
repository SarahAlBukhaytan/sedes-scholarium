import type { ReactNode } from "react";
import { StarPattern } from "@/components/motif/StarPattern";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export type PageWidth = "wide" | "reading";

/** Container class for a page width — header and body must use the same one. */
export const containerClass: Record<PageWidth, string> = {
  wide: "container-page",
  reading: "container-reading",
};

/**
 * Standard page intro: breadcrumb/back link, eyebrow, title, short lead.
 * `width` must match the page body so both share the same right edge.
 */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  motif = true,
  width = "wide",
}: {
  crumbs?: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  motif?: boolean;
  width?: PageWidth;
}) {
  return (
    <div className="relative overflow-hidden">
      {motif && (
        <StarPattern
          density="sparse"
          className="absolute -top-10 left-0 h-[130%] w-full md:w-2/3"
        />
      )}
      <div className={`${containerClass[width]} relative pt-6 pb-10 md:pt-10 md:pb-14`}>
        {crumbs && <Breadcrumbs items={crumbs} />}
        {/* On wide pages the intro keeps a readable measure; reading pages already have one. */}
        <div className={`mt-6 md:mt-8 ${width === "wide" ? "max-w-3xl" : ""}`}>
          {eyebrow && <div className="mb-3 text-sm font-semibold text-sand-ink">{eyebrow}</div>}
          <h1 className="font-display text-[1.85rem] leading-snug font-bold break-words text-deep md:text-[2.6rem] md:leading-tight">
            {title}
          </h1>
          {lead && <div className="mt-4 text-base leading-8 text-muted md:text-lg md:leading-9">{lead}</div>}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
