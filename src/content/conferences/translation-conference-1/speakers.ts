import type { Speaker } from "../../types";

/**
 * المتحدثون ومقدّمو الورش
 *
 * These five names were first read from the program image and are now
 * confirmed by the activity reports (التقارير.pdf), so they are no longer
 * flagged. Every other person (panels, moderators) is shown on the activity
 * page straight from its report — see reports.ts → `people`.
 *
 * Bios stay empty here on purpose: the report bio is shown with the report.
 */
export const speakers: Speaker[] = [
  { id: "hind-alkhalifa", honorific: "أ.د.", name: "هند الخليفة" },
  { id: "fahad-alhathloul", honorific: "د.", name: "فهد الهذلول" },
  { id: "maymounah-saleh", honorific: "أ.", name: "ميمونة صالح" },
  { id: "rasha-alzahrawi", honorific: "د.", name: "رشا الزهراوي" },
  { id: "mashael-alhammad", honorific: "د.", name: "مشاعل إبراهيم الحماد" },
];
