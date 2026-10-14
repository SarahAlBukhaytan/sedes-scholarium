import { routes } from "@/lib/routes";

/**
 * Primary navigation — only the main site sections. Search is a separate
 * header action (not a nav item); the Team page is reached from the homepage
 * tracks section and the footer. Conference sections are reached from each
 * conference overview page (no secondary navigation bar).
 */
export const mainNav = [
  { href: routes.home(), label: "الرئيسية" },
  { href: routes.conferences(), label: "المؤتمرات" },
];
