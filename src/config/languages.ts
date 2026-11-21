/**
 * لغات الموقع — Site languages shown in the header language menu.
 *
 * status
 *   "active"  the published, approved version of the site (selectable).
 *   "pending" approved for the site but its translation is not complete or
 *             not yet approved — shown with «قريبًا», NOT selectable.
 *   "planned" a language to be added later — listed under «لغات ستُضاف لاحقًا»,
 *             greyed out, NOT selectable.
 *
 * To publish a language later: translate and approve every page, give it a
 * `href` (its URL prefix, e.g. "/en") and set its status to "active". `dir`
 * and `lang` are used for the page direction (RTL / LTR) and language tags.
 */
export type LanguageStatus = "active" | "pending" | "planned";

export interface SiteLanguage {
  code: string;
  /** Name in Arabic (the current interface language). */
  nameAr: string;
  /** Name in the language itself. */
  native: string;
  dir: "rtl" | "ltr";
  status: LanguageStatus;
  /** Root URL of that language version — only for active languages. */
  href?: string;
}

export const currentLanguage = "ar";

export const languages: SiteLanguage[] = [
  { code: "ar", nameAr: "العربية", native: "العربية", dir: "rtl", status: "active", href: "/" },
  { code: "en", nameAr: "الإنجليزية", native: "English", dir: "ltr", status: "pending" },
  { code: "de", nameAr: "الألمانية", native: "Deutsch", dir: "ltr", status: "planned" },
  { code: "fr", nameAr: "الفرنسية", native: "Français", dir: "ltr", status: "planned" },
  { code: "es", nameAr: "الإسبانية", native: "Español", dir: "ltr", status: "planned" },
  { code: "he", nameAr: "العبرية", native: "עברית", dir: "rtl", status: "planned" },
  { code: "tr", nameAr: "التركية", native: "Türkçe", dir: "ltr", status: "planned" },
  { code: "ru", nameAr: "الروسية", native: "Русский", dir: "ltr", status: "planned" },
  { code: "zh", nameAr: "الصينية", native: "中文", dir: "ltr", status: "planned" },
  { code: "ja", nameAr: "اليابانية", native: "日本語", dir: "ltr", status: "planned" },
  { code: "fa", nameAr: "الفارسية", native: "فارسی", dir: "rtl", status: "planned" },
];
