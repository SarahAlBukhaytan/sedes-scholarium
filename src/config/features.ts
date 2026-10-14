/**
 * مفاتيح تفعيل الأقسام — Feature switches.
 *
 * knowledgeTopics — قسم «الموضوعات المعرفية» (12 موضوعًا). مُفعَّل.
 *   Set to false to hide it again (pages 404, no links/cards/search results);
 *   all files and data are kept.
 *
 * outcomeRecommendations / outcomeOverallReading — the sections
 *   «04 المخرجات والتوصيات» and «05 الصورة المعرفية للمؤتمر» of the
 *   conference outcome page. Hidden for now by the initiative director's
 *   decision; their code and data are kept — set to true to show them again.
 *
 * The knowledge map (14 circles, map-topics.ts) is independent of these switches.
 */
export const features = {
  knowledgeTopics: true,
  outcomeRecommendations: false,
  outcomeOverallReading: false,
};
