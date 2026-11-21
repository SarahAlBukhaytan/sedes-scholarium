import { routes } from "@/lib/routes";

/**
 * Primary navigation — only the main site sections. Search and the language
 * menu are separate header actions (not nav items); the Team page is reached
 * from the homepage team section, the About page and the footer. Conference
 * sections are reached from each conference overview page.
 */
export const mainNav = [
  { href: routes.home(), label: "الرئيسية" },
  { href: routes.about(), label: "عن المبادرة" },
  { href: routes.conferences(), label: "المؤتمرات" },
  { href: routes.calendar(), label: "تقويم المؤتمرات" },
  { href: routes.contact(), label: "نقطة وصل" },
];
