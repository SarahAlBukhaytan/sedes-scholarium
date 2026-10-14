import { notFound } from "next/navigation";
import { getBundle } from "./content";
import { routes } from "./routes";
import type { Crumb } from "@/components/layout/Breadcrumbs";

/** Resolve a conference bundle from route params or render the 404 page. */
export function requireBundle(slug: string) {
  const bundle = getBundle(slug);
  if (!bundle) notFound();
  return bundle;
}

/** Breadcrumb trail down to a conference. */
export function conferenceCrumbs(slug: string, title: string, trailing: Crumb[] = []): Crumb[] {
  return [
    { label: "الرئيسية", href: routes.home() },
    { label: "المؤتمرات", href: routes.conferences() },
    { label: title, href: routes.conference(slug) },
    ...trailing,
  ];
}
