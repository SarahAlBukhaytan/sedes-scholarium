/**
 * روابط الموضوعات المعرفية بالفعاليات — the SINGLE source for topic ↔ activity.
 *
 * Rule (revised 14 Oct 2026): a topic is linked to an activity only when the
 * topic is named in the activity's TITLE (program or report) or in its
 * report KEYWORDS («الكلمات المفتاحية»). A passing mention inside the summary
 * is not enough, and a mention of AI does not link the activity to AI's
 * sub-topics (LLMs, machine translation…) unless those are named themselves.
 * Each value is the evidence, shown on the topic page as «سبب الربط».
 *
 * Every count on the site (topic cards, topic pages, crossings, outcome) is
 * computed from this table — one activity is counted once per topic.
 */
export const topicLinks: Record<string, Record<string, string>> = {
  "keynote-1": {
    culture: "العنوان «تبادل الثقافات وتواصل عالمي»، والكلمة المفتاحية «الثقافة»",
    ai: "الكلمة المفتاحية «الذكاء الاصطناعي»",
  },
  "keynote-2": {
    ai: "العنوان «الترجمة في عصر الذكاء الاصطناعي»، والكلمة المفتاحية «الذكاء الاصطناعي»",
    "identity-ethics": "العنوان «…والأخلاقيات»، والكلمة المفتاحية «حقوق المترجم»",
    "language-tech": "الكلمة المفتاحية «المدونة اللغوية»",
  },
  "scientific-1": {
    culture: "العنوان «السياقات الثقافية»، والكلمة المفتاحية «الترجمة الثقافية»",
    "labor-market": "العنوان «اقتصاد سوق العمل»، والكلمة المفتاحية «سوق العمل»",
    "language-tech": "الكلمة المفتاحية «التقنيات اللغوية الحديثة»",
  },
  "scientific-2": {
    "labor-market": "العنوان «الممارسة المهنية»، والكلمة المفتاحية «سوق العمل»",
    interpreting: "الكلمة المفتاحية «الترجمة الشفهية»",
    ai: "الكلمة المفتاحية «تقنيات الذكاء الاصطناعي»",
  },
  "workshop-virtual-lab": {
    interpreting: "العنوان «مختبر افتراضي للترجمة الشفوية»، والكلمة المفتاحية «الترجمة الشفوية»",
    ai: "العنوان «…باستخدام الذكاء الاصطناعي»، والكلمة المفتاحية «الذكاء الاصطناعي التوليدي»",
  },
  "workshop-llm-translators": {
    llm: "العنوان والكلمة المفتاحية «النماذج اللغوية الكبيرة»",
    "machine-translation": "الكلمة المفتاحية «تقييم جودة الترجمة»، و«للترجمة الآلية» في عنوان التقرير",
  },
  "scientific-3": {
    ai: "العنوان «الذكاء الاصطناعي في تعليم الترجمة»، والكلمة المفتاحية «الذكاء الاصطناعي»",
    education: "العنوان «تعليم الترجمة»، والكلمتان المفتاحيتان «تعليم الترجمة» و«المناهج الأكاديمية»",
  },
  "workshop-automation": {
    "language-tech": "العنوان «من الترجمة إلى الأتمتة»، والكلمتان المفتاحيتان «الأتمتة» و«تقنيات الترجمة»",
    ai: "العنوان «…في عصر الذكاء الاصطناعي»، والكلمة المفتاحية «الذكاء الاصطناعي»",
  },
  "workshop-beyond-translation": {
    profession: "العنوان «بناء مسار مهني»، والكلمتان المفتاحيتان «المسار المهني» و«التطوير المهني»",
    ai: "الكلمة المفتاحية «الذكاء الاصطناعي»",
  },
  "scientific-4": {
    education: "العنوان «مواءمة المناهج»، والكلمتان المفتاحيتان «المناهج» و«الجامعات»",
    "labor-market": "العنوان «…مع سوق العمل»، والكلمة المفتاحية «سوق العمل»",
  },
  "workshop-last-word": {
    terminology: "العنوان «إستراتيجيات اختيار المفردات»",
    literary: "الكلمة المفتاحية «الترجمة الأدبية»",
    ai: "الكلمة المفتاحية «الذكاء الاصطناعي في الترجمة»",
  },
  "workshop-hajj-interpreting": {
    ai: "العنوان «الذكاء الاصطناعي ومستقبل…»، والكلمة المفتاحية «الذكاء الاصطناعي اللغوي»",
    "machine-translation": "الكلمة المفتاحية «الترجمة الآلية الميدانية»",
    culture: "الكلمة المفتاحية «السياق الثقافي والدلالي»",
  },
  "scientific-5": {
    "identity-ethics": "العنوان «هوية المترجم»، والكلمة المفتاحية «هوية المترجم»",
    literary: "الكلمة المفتاحية «الترجمة الأدبية»",
    ai: "الكلمة المفتاحية «الذكاء الاصطناعي التوليدي»",
  },
  "scientific-6": {
    "machine-translation": "العنوان «أدوات الترجمة الآلية وتقييم الجودة»، والكلمتان المفتاحيتان «الترجمة الآلية» و«تقييم الجودة»",
    ai: "الكلمة المفتاحية «الذكاء الاصطناعي»",
    "language-tech": "الكلمة المفتاحية «المدونة اللغوية»",
  },
  "workshop-generative-ai": {
    ai: "العنوان والكلمة المفتاحية «الذكاء الاصطناعي التوليدي»",
    "machine-translation": "الكلمة المفتاحية «جودة الترجمة»",
  },
  "workshop-disability-literary": {
    literary: "العنوان «…في النصوص الأدبية»، والكلمة المفتاحية «الترجمة الأدبية»",
    culture: "الكلمتان المفتاحيتان «ثقافة الصم» و«المصطلحات الثقافية»",
    terminology: "الكلمة المفتاحية «المصطلحات الثقافية»",
  },
};
