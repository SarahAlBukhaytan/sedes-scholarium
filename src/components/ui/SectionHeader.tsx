import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  id,
  as: Tag = "h2",
  tone = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  id?: string;
  as?: "h1" | "h2" | "h3";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p
            className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
              dark ? "text-sand" : "text-sand-ink"
            }`}
          >
            <span aria-hidden="true" className="h-px w-6 bg-current" />
            {eyebrow}
          </p>
        )}
        <Tag
          id={id}
          className={`font-display text-2xl font-bold md:text-3xl ${dark ? "text-ivory" : "text-deep"}`}
        >
          {title}
        </Tag>
        {description && (
          <p className={`mt-3 leading-8 ${dark ? "text-ivory/75" : "text-muted"}`}>{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={`group inline-flex shrink-0 items-center gap-2 text-sm font-semibold ${
            dark ? "text-sand hover:text-ivory" : "text-teal hover:text-deep"
          }`}
        >
          {action.label}
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
