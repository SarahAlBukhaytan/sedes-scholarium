import type { MapTopic } from "../../types";
import { reports } from "./reports";

/**
 * موضوعات خريطة الترابط المعرفي — the 14 knowledge-map topics.
 *
 * Arabic and English names are the APPROVED labels, kept exactly as supplied.
 * This list is DIFFERENT from the 12 knowledge topics (topics.ts) and must not
 * be merged with it (`knowledgeTopicIds` stays empty).
 *
 * Links to activities are DERIVED, not typed by hand: a circle is linked to an
 * activity only when one of the report's printed keywords («الكلمات المفتاحية»
 * in التقارير.pdf) matches the circle exactly as listed in `match` below.
 * The matched keywords are shown in the circle's details as the evidence.
 *
 * `relatedMapTopicIds` (the lines between circles) stays EMPTY: the reports
 * do not state relations between these topics, so no line is drawn.
 */

type Seed = Omit<MapTopic, "activityIds" | "keywords" | "relatedMapTopicIds" | "knowledgeTopicIds"> & {
  /** Report keywords that count as evidence for this circle (exact match). */
  match: string[];
};

const seeds: Seed[] = [
  {
    id: "m-ai", slug: "artificial-intelligence", order: 1, nameAr: "الذكاء الاصطناعي", nameEn: "Artificial Intelligence", icon: "ai",
    match: ["الذكاء الاصطناعي", "الذكاء الاصطناعي التوليدي", "الذكاء الاصطناعي في الترجمة", "تقنيات الذكاء الاصطناعي", "الذكاء الاصطناعي اللغوي"],
  },
  { id: "m-literary", slug: "literary-translation", order: 2, nameAr: "الترجمة الأدبية", nameEn: "Literary Translation", icon: "literary", match: ["الترجمة الأدبية"] },
  { id: "m-interpreting", slug: "interpreting", order: 3, nameAr: "الترجمة الشفوية", nameEn: "Interpreting", icon: "interpreting", match: ["الترجمة الشفوية", "الترجمة الشفهية"] },
  { id: "m-context", slug: "cultural-semantic-context", order: 4, nameAr: "السياق الثقافي والدلالي", nameEn: "Cultural and Semantic Context", icon: "culture", match: ["السياق الثقافي والدلالي"] },
  { id: "m-curricula", slug: "curricula-education", order: 5, nameAr: "المناهج والتعليم", nameEn: "Curricula and Education", icon: "education", match: ["المناهج", "المناهج الأكاديمية", "تعليم الترجمة"] },
  { id: "m-corpus", slug: "linguistic-corpus", order: 6, nameAr: "المدونة اللغوية", nameEn: "Linguistic Corpus", icon: "corpus", match: ["المدونة اللغوية"] },
  { id: "m-quality", slug: "translation-quality", order: 7, nameAr: "جودة الترجمة", nameEn: "Translation Quality", icon: "quality", match: ["جودة الترجمة", "تقييم الجودة", "تقييم جودة الترجمة"] },
  { id: "m-skills", slug: "skills", order: 8, nameAr: "المهارات", nameEn: "Skills", icon: "skills", match: ["المهارات", "المهارات القابلة للنقل", "مهارات المترجم"] },
  { id: "m-prompt", slug: "prompt-engineering", order: 9, nameAr: "هندسة الأوامر", nameEn: "Prompt Engineering", icon: "prompt", match: ["هندسة الأوامر"] },
  { id: "m-hajj", slug: "hajj-season", order: 10, nameAr: "موسم الحج", nameEn: "Hajj Season", icon: "hajj", match: ["موسم الحج", "الترجمة خلال موسم الحج"] },
  {
    id: "m-post-editing", slug: "post-editing", order: 11, nameAr: "المراجعة البشرية", nameEn: "Post-Editing", icon: "post-editing",
    match: ["المراجعة البشرية", "ما بعد التحرير", "التحرير البشري (Post-Editing)"],
  },
  { id: "m-labour", slug: "labour-market", order: 12, nameAr: "سوق العمل", nameEn: "Labour Market", icon: "labour", match: ["سوق العمل"] },
  { id: "m-tech", slug: "technologies", order: 13, nameAr: "التقنيات", nameEn: "Technologies", icon: "technologies", match: ["التقنيات", "تقنيات الترجمة", "التقنيات اللغوية الحديثة"] },
  { id: "m-mt", slug: "machine-translation", order: 14, nameAr: "الترجمة الآلية", nameEn: "Machine Translation", icon: "machine-translation", match: ["الترجمة الآلية", "الترجمة الآلية الميدانية"] },
];

export const mapTopics: MapTopic[] = seeds.map(({ match, ...topic }) => {
  const hits = Object.entries(reports).filter(([, r]) => r.keywords.some((k) => match.includes(k)));
  return {
    ...topic,
    activityIds: hits.map(([activityId]) => activityId),
    keywords: [...new Set(hits.flatMap(([, r]) => r.keywords.filter((k) => match.includes(k))))],
    relatedMapTopicIds: [],
    knowledgeTopicIds: [],
  };
});
