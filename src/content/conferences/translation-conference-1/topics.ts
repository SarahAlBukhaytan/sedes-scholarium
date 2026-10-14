import type { Topic } from "../../types";

/**
 * الموضوعات المعرفية — the 12 knowledge topics.
 *
 * Names and order are the APPROVED list supplied by the initiative.
 * ids/slugs are unchanged so existing URLs keep working.
 *
 * Fields:
 *  - `intro`     approved short note on how the topic appeared in the
 *                conference — EMPTY until supplied (the page shows a pending note).
 *  - `keyIdeas`  approved ideas linked to the topic — EMPTY until supplied.
 *  - `draftNote` internal editorial draft written for the prototype; never
 *                rendered to visitors (kept only for search matching).
 *  - `mapTopicIds` optional link to topics of the knowledge map (map-topics.ts).
 *                The two lists are different; fill only when a link is approved.
 *
 * Topic ↔ activity links live in activities.ts (`topicIds`); their approval
 * status is `conference.topicLinksStatus`.
 */

const C = "translation-conference-1";

export const topics: Topic[] = [
  {
    id: "ai",
    order: 1,
    slug: "artificial-intelligence",
    conferenceId: C,
    name: "الذكاء الاصطناعي في الترجمة",
    draftNote: "أثر الذكاء الاصطناعي في الترجمة: في أدوات العمل، وتعليم الترجمة، والترجمة الشفهية، وأسئلة الجودة والأخلاقيات.",
  },
  {
    id: "machine-translation",
    order: 2,
    slug: "machine-translation-quality",
    conferenceId: C,
    name: "الترجمة الآلية وتقييم الجودة",
    draftNote: "أدوات الترجمة الآلية، ومعايير تقييم مخرجاتها، وحدود الاعتماد عليها.",
  },
  {
    id: "language-tech",
    order: 3,
    slug: "language-technologies",
    conferenceId: C,
    name: "التقنيات اللغوية وأتمتة العمل",
    draftNote: "المختبرات الافتراضية والأدوات السحابية ومنظومات العمل المؤتمتة.",
  },
  {
    id: "education",
    order: 4,
    slug: "translation-education",
    conferenceId: C,
    name: "تعليم الترجمة والتأهيل",
    draftNote: "إعداد المترجمين وتطوير المناهج وأساليب التدريب.",
  },
  {
    id: "labor-market",
    order: 5,
    slug: "labor-market",
    conferenceId: C,
    name: "سوق العمل والممارسة المهنية",
    draftNote: "اقتصاد سوق الترجمة واحتياجاته والممارسة المهنية.",
  },
  {
    id: "profession",
    order: 6,
    slug: "future-of-the-profession",
    conferenceId: C,
    name: "مستقبل المهنة والمسار المهني",
    draftNote: "مستقبل مهنة الترجمة وبناء مسارات مهنية مستدامة.",
  },
  {
    id: "identity-ethics",
    order: 7,
    slug: "translator-identity-ethics",
    conferenceId: C,
    name: "هوية المترجم وأخلاقيات المهنة",
    draftNote: "موقع المترجم بين الإنسان والآلة، وأخلاقيات المهنة.",
  },
  {
    id: "culture",
    order: 8,
    slug: "translation-culture-society",
    conferenceId: C,
    name: "الترجمة والثقافة والمجتمع",
    draftNote: "الترجمة جسرًا للتبادل الثقافي والتواصل العالمي.",
  },
  {
    id: "interpreting",
    order: 9,
    slug: "interpreting",
    conferenceId: C,
    name: "الترجمة الشفهية",
    draftNote: "الترجمة الشفهية والفورية وتطبيقاتها الميدانية.",
  },
  {
    id: "literary",
    order: 10,
    slug: "literary-translation",
    conferenceId: C,
    name: "الترجمة الأدبية",
    draftNote: "ترجمة النصوص الأدبية وقضاياها الدلالية والثقافية.",
  },
  {
    id: "llm",
    order: 11,
    slug: "large-language-models",
    conferenceId: C,
    name: "النماذج اللغوية الكبيرة",
    draftNote: "النماذج اللغوية الكبيرة والذكاء الاصطناعي التوليدي في يد المترجم.",
  },
  {
    id: "terminology",
    order: 12,
    slug: "terminology-lexical-choice",
    conferenceId: C,
    name: "المصطلحات واختيار المفردات",
    draftNote: "القرارات المعجمية والمصطلحية التي يتخذها المترجم.",
  },
];
