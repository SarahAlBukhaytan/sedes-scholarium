import type { ActivityVariant } from "./labels";

/** Central URL builders — change URL structure in one place. */
export const routes = {
  home: () => "/",
  aboutSection: () => "/#about",
  team: () => "/team",
  search: (q?: string) => (q ? `/search?q=${encodeURIComponent(q)}` : "/search"),
  conferences: () => "/conferences",
  conference: (c: string) => `/conferences/${c}`,
  mainSessions: (c: string) => `/conferences/${c}/main-sessions`,
  scientificSessions: (c: string) => `/conferences/${c}/scientific-sessions`,
  workshops: (c: string) => `/conferences/${c}/workshops`,
  axes: (c: string) => `/conferences/${c}/axes`,
  topics: (c: string) => `/conferences/${c}/topics`,
  topic: (c: string, slug: string) => `/conferences/${c}/topics/${slug}`,
  activity: (c: string, slug: string) => `/conferences/${c}/activities/${slug}`,
  knowledgeMap: (c: string, focusTopic?: string) =>
    `/conferences/${c}/knowledge-map${focusTopic ? `?topic=${encodeURIComponent(focusTopic)}` : ""}`,
  outcome: (c: string) => `/conferences/${c}/outcome`,
};

/** The category page an activity belongs to (used for breadcrumbs / back links). */
export function activityListing(c: string, variant: ActivityVariant) {
  switch (variant) {
    case "keynote":
      return { label: "الجلسات الرئيسة", href: routes.mainSessions(c) };
    case "scientific":
      return { label: "الجلسات العلمية", href: routes.scientificSessions(c) };
    case "workshop":
      return { label: "ورش العمل", href: routes.workshops(c) };
  }
}
