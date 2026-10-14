import type { ConferenceOutcome } from "../../types";

/**
 * حصيلة المؤتمر — Conference outcome (editorial synthesis).
 *
 * The official recommendations are announced at the closing ceremony. Until the
 * documentation team publishes the synthesis, the sections stay empty and the
 * page shows a clear "in documentation" state. Do NOT fill these with guesses.
 *
 * Example once documented:
 *   keyMessages: { items: [{ text: "…", topicIds: ["ai"], activityIds: ["keynote-2"] }] }
 */
export const outcome: ConferenceOutcome = {
  conferenceId: "translation-conference-1",
  status: "pending",
  intro:
    "تجمع هذه الصفحة الصورة المعرفية الكلية للمؤتمر: الموضوعات التي برزت، والرسائل الرئيسة، والأفكار المشتركة بين الجلسات والورش، والتوصيات. تُستكمل أقسامها بعد انتهاء المؤتمر واعتماد مادة التوثيق.",
  keyMessages: {},
  crossCuttingIdeas: {},
  recommendations: {
    note: "تُعلن توصيات المؤتمر في الحفل الختامي وفق البرنامج، وتُنشر هنا بنصها المعتمد.",
  },
};
