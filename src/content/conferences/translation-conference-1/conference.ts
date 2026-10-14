import type { Conference } from "../../types";

/**
 * مؤتمر جمعية الترجمة الأول
 *
 * Sources:
 *  - theme, description, location: approved text supplied by the initiative.
 *  - dates, daily hours, program items: the official program image in
 *    /refrences (30 Sep – 1 Oct 2026, 10:00 AM – 6:00 PM).
 *
 * Unresolved source conflicts (NOT displayed — see CONTENT_STATUS.md):
 *  - another text mentions 12 October; the official program shows 30 Sep – 1 Oct.
 *  - another text mentions 8:00 AM; the program image shows 10:00 AM – 6:00 PM.
 * Re-check both against the official guide PDF when it is supplied.
 */
export const conference: Conference = {
  id: "translation-conference-1",
  slug: "translation-conference-1",
  title: "مؤتمر جمعية الترجمة الأول",
  shortTitle: "مؤتمر الترجمة الأول",
  theme: "الترجمة في عالم يتحول",
  organizer: "جمعية الترجمة",
  partner: "كلية اللغات وعلومها بجامعة الملك سعود",
  summary:
    "يهدف المؤتمر إلى تعزيز التعاون بين الأوساط الأكاديمية وقطاع صناعة الترجمة، والارتقاء بالمعايير المهنية، ودعم الابتكار والبحث العلمي في هذا المجال، وتأتي أهداف المؤتمر منسجمةً مع رؤية المملكة 2030، حيث يُركز على التبادل الثقافي، والتوطين، والتميز المهني.",
  city: "الرياض",
  venue: "كلية اللغات وعلومها - جامعة الملك سعود",
  startDate: "2026-09-30",
  endDate: "2026-10-01",
  dateLabel: "30 سبتمبر – 1 أكتوبر 2026",
  dateLabelShort: "30 سبتمبر - 1 أكتوبر",
  // Phrased with words (من … إلى …) so the Arabic/number mix always reads in order.
  dailyHours: "من 10:00 صباحًا إلى 6:00 مساءً",
  /**
   * محاور المؤتمر الخمسة — official, supplied by the initiative director
   * (14 Oct 2026). Texts and order exactly as supplied. Kept separate from
   * the knowledge topics and the knowledge map.
   */
  axes: [
    { id: "axis-1", order: 1, title: "بيئة العمل وجودة حياة المترجمين" },
    { id: "axis-2", order: 2, title: "تطوير مهارات المترجمين والتأهيل الأكاديمي والمهني" },
    { id: "axis-3", order: 3, title: "الابتكار والتقنية في مهنة الترجمة" },
    { id: "axis-4", order: 4, title: "اقتصاد الترجمة وفرص سوق العمل في المملكة" },
    { id: "axis-5", order: 5, title: "التنظيم المهني والأنظمة والتشريعات المتعلقة بالترجمة" },
  ],  /**
   * Status of the topic ↔ activity links (activities.ts → topicIds).
   * "report-derived": every link is backed by a keyword or phrase from the
   * activity report (activities.ts → topicEvidence), so counts are shown and
   * labelled "بحسب التقارير". Switch to "approved" once the team confirms.
   */
  topicLinksStatus: "report-derived",
  /**
   * التغطية المصورة — original files from "media for ksu.zip", renamed in
   * order (IMG_0258 → photo-01 … IMG_0269 → photo-12). No captions: the
   * source gives none. Thumbnails are resized copies; originals are untouched.
   */
  media: [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
      const n = String(i).padStart(2, "0");
      return {
        kind: "image" as const,
        src: `/media/translation-conference-1/photo-${n}.jpg`,
        thumb: `/media/translation-conference-1/thumbs/photo-${n}.webp`,
        width: i === 1 ? 1280 : 720,
        height: 1280,
      };
    }),
    { kind: "video", src: "/media/translation-conference-1/video-01.mp4", type: "video/mp4" },
  ],
  days: [
    {
      id: "day-1",
      label: "اليوم الأول",
      weekday: "الأربعاء",
      date: "2026-09-30",
      dateLabel: "30 سبتمبر 2026",
    },
    {
      id: "day-2",
      label: "اليوم الثاني",
      weekday: "الخميس",
      date: "2026-10-01",
      dateLabel: "1 أكتوبر 2026",
    },
  ],
  status: "in-progress",
  programItems: [
    { id: "d1-registration", dayId: "day-1", title: "الاستقبال والتسجيل", start: "09:30", end: "10:00" },
    { id: "d1-opening", dayId: "day-1", title: "حفل الافتتاح في المسرح الرئيسي", start: "10:00", end: "10:30" },
    { id: "d1-fair", dayId: "day-1", title: "افتتاح معرض التوظيف والجولة (الطابق الثاني)", start: "10:30", end: "11:00" },
    { id: "d1-lunch", dayId: "day-1", title: "صلاة الظهر + غداء وتواصل", start: "12:30", end: "13:30" },
    { id: "d1-break", dayId: "day-1", title: "صلاة العصر + استراحة قهوة", start: "15:30", end: "15:50" },
    { id: "d2-registration", dayId: "day-2", title: "الاستقبال والتسجيل", start: "09:30", end: "10:00" },
    { id: "d2-fair", dayId: "day-2", title: "معرض التوظيف", note: "طوال اليوم" },
    { id: "d2-lunch", dayId: "day-2", title: "صلاة الظهر + غداء وتواصل", start: "12:00", end: "13:00" },
    { id: "d2-break", dayId: "day-2", title: "صلاة العصر + استراحة قهوة", start: "15:30", end: "15:50" },
    { id: "d2-closing", dayId: "day-2", title: "الحفل الختامي، وعرض توصيات المؤتمر، والتكريم", start: "15:30", end: "16:30" },
  ],
  source: "official-program",
};
