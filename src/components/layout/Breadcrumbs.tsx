import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Desktop: a quiet breadcrumb trail (the last crumb is the current page).
 * Mobile: a single stable "العودة إلى …" link to the direct parent page —
 * never browser-history back.
 */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const base = dark ? "text-ivory/60" : "text-muted";
  const hover = dark ? "hover:text-ivory" : "hover:text-deep";
  const current = dark ? "text-ivory/90" : "text-ink/80";
  const parent = [...items.slice(0, -1)].reverse().find((c) => c.href);

  return (
    <nav aria-label="مسار التنقل" className="text-sm">
      {parent?.href && (
        <Link
          href={parent.href}
          className={`inline-flex min-h-11 items-center gap-2 font-medium md:hidden ${
            dark ? "text-sand" : "text-teal"
          }`}
        >
          <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">العودة إلى {parent.label}</span>
        </Link>
      )}
      <ol className={`hidden flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8rem] md:flex ${base}`}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className={`underline-offset-4 ${hover} hover:underline`}>
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`line-clamp-1 ${last ? current : ""}`}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronLeft className="size-3 shrink-0 opacity-50" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
