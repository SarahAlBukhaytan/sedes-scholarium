import type { TeamStructure } from "./types";

/**
 * هيكل الفريق — the OFFICIAL structure from "Sedes Scholarium_Folder V2.zip"
 * → Sedes Scholarium V2.pdf, page 1 («فريق العمل»).
 *
 * Names, titles, tracks and their order are copied from that page (members
 * in the order they appear, right to left, row by row). Nothing is added.
 * Points to confirm are listed in CONTENT_STATUS.md (e.g. the stray word
 * «الهدف» printed over one name in the artwork).
 */
export const team: TeamStructure = {
  head: [{ id: "founder", role: "مؤسسة ورئيسة المبادرة", name: "شوق الشهري" }],
  supervision: { role: "المشرفة الأكاديمية", name: "أ. الجوهرة الحربي" },
  tracks: [
    {
      id: "content-editing",
      name: "مسار المحتوى والتحرير",
      leader: { role: "قائدة مسار المحتوى والتحرير", name: "سفانة الهديب" },
      members: [
        "أروى فهد",
        "تميم السلمي",
        "ديم البداح",
        "ريم القحطاني",
        "ريماس الخوير",
        "سارة المقري",
        "شذى الدوحان",
        "علياء العريفي",
        "لين الحمصي",
        "نجلاء النفيسي",
      ],
    },
    {
      id: "languages-translation",
      name: "مسار اللغات والترجمة",
      leader: { role: "قائدة مسار اللغات والترجمة", name: "تالا الخريجي" },
      members: [
        "أروان المالكي",
        "بثينة السلامة",
        "جواهر الشهري",
        "جود الحصيني",
        "حنين الحارثي",
        "ديمة العنقري",
        "رغد هزاع",
        "رهف رفيد",
        "روان القحطاني",
        "ريناد الحميدان",
        "سارة العمري",
        "سارة العجيان",
        "سعود المطيري",
        "شجون المنسي",
        "شهد زيدان",
        "صالح البدراني",
        "عبدالعزيز العبدلي",
        "عبدالله الأسمري",
        "علي الضنكي",
        "العنود الدوسري",
        "غادة العمري",
        "غيداء الحويطي",
        "فلوة الحوشان",
        "محمد الميموني",
        "مناحي آل الجرو",
        "منار القحطاني",
        "موضي آل داوود",
        "هاجر آل داوود",
        "وضحى العجمي",
      ],
    },
    {
      id: "tech-design",
      name: "مسار التقنية والتصميم",
      leader: { role: "قائدة مسار التقنية والتصميم", name: "الهنوف الوهيبي" },
      members: ["بدر الشهري", "ثريا العسكر", "سارة البخيتان", "قرار العويسي", "مشاعل البخيتان"],
    },
  ],
};
