/**
 * محتوى المبادرة — Initiative-level copy.
 *
 * All texts below are the APPROVED wording supplied by the initiative and are
 * used verbatim. Source of definition / vision / mission / goal:
 * «Sedes Scholarium COLS KSU.pdf» (the approved initiative profile, p.2) —
 * definition, vision, mission and goal copied verbatim from that page,
 * which is also the source of `naming` and `college`. Its organisational
 * structure (pp.3–4) is internal and must not be published.
 *  - `name` / `publicName`  the initiative's name: "Sedes Scholarium".
 *    Latin script — render inside <bdi dir="ltr">.
 * Changing a value here updates every place that uses it.
 */

export const initiative = {
  /** Initiative name (browser titles, share data, logo alt text). */
  name: "Sedes Scholarium",
  /** Public name used in new content. Latin script — render inside <bdi>/dir="ltr". */
  publicName: "Sedes Scholarium",
  descriptor: "للرصد والترجمة والتوثيق المعرفي للمؤتمرات",
  umbrella: "تحت مظلة كلية اللغات وعلومها بجامعة الملك سعود",
  fullName:
    "مبادرة طلبة وخريجي كلية اللغات وعلومها للرصد والترجمة والتوثيق المعرفي للمؤتمرات",
  tagline: "نرصد المعرفة، ونترجمها، ونوثّقها",
  definition:
    "مبادرة معرفية تُعنى بالرصد والترجمة والتوثيق المعرفي للمؤتمرات، من خلال رصد أبرز ما يُطرح في جلساتها من أفكار ورسائل ومخرجات، واستخلاصه وصياغته وترجمته في محتوى موجز، ثم تقديمه في قوالب معرفية وبصرية موحدة؛ بما يسهم في توثيق محتوى المؤتمرات، وعكس تنوع الأفكار المطروحة، وتوسيع نطاق وصولها وصداها، وتعزيز امتداد أثرها بعد اختتام أعمالها.",
  vision: "الريادة في ترسيخ ذاكرة معرفية مستدامة للمؤتمرات، يمتد أثرها إلى ما بعد انعقادها.",
  mission:
    "بناء منظومة متكاملة للرصد والتوثيق المعرفي، ترتكز على تكامل التخصصات في تحويل محتوى المؤتمرات إلى معرفة موثقة ومحكمة وميسّرة للوصول؛ بما يحفظ قيمتها ويعزز استدامة أثرها.",
  goal: "تحويل أبرز ما تزخر به المؤتمرات من أفكار ورؤى ورسائل ومخرجات إلى محتوى معرفي منتقى وموثّق ومحكم الصياغة، من خلال تكامل التخصصات؛ بما يعزز أثر المؤتمرات، ويوسع نطاق الانتفاع بمحتواها، ويتيح للطلبة والخريجين توظيف معارفهم ومهاراتهم في تجربة تطبيقية تكاملية.",
  /** «دلالة التسمية» — COLS KSU profile, p.2. Contains the Latin name: keep it in <bdi>. */
  naming:
    "استُقي اسم المبادرة Sedes Scholarium من اللغة اللاتينية، لما لها من عراقة وأثر راسخ في نشأة لغات عديدة وتطورها، استلهامًا لأصالتها، وتعبيرًا عن سمو الفكرة التي تنهض عليها المبادرة؛ ليكون الاسم عنوانًا لهويتها العلمية، لا مجرد وصف لأنشطتها، مستحضرًا ما للعلم من منزلة، ولأهله من مكانة، ومؤصّلًا لحيّز معرفي تتلاقى فيه العقول، وتتآزر فيه الجهود على اختلاف تخصصاتها ولغاتها، وتتجسّد رسالته في صون ما تنتجه المحافل العلمية من حصيلة فكرية، وإعادة تقديمها في مخرجات معرفية منظّمة تتيح تداولها والانتفاع بها؛ فلا ينقضي أثر المعرفة بانقضاء مناسبتها، ولا ينحصر عطاؤها في حدود منشئها.",
  /** College of Language Sciences, King Saud University — homepage section. */
  college: {
    name: "كلية اللغات وعلومها",
    text: "نفخر بانطلاق مبادرة Sedes Scholarium تحت مظلة كلية اللغات وعلومها بجامعة الملك سعود، امتدادًا لرسالتها في إثراء المعرفة، وتعزيز البحث العلمي، ومدّ جسور التواصل بين اللغات والثقافات.",
    cta: "تعرّف على الكلية",
    url: "https://cols.ksu.edu.sa/ar",
  },
  /** Official contact address (contact page, footer). */
  email: "sscolsksu@gmail.com",
  /** "كيف تعمل Sedes Scholarium؟" — the six approved stages, in order. */
  workflowIntro: "رحلة المادة المعرفية من قاعة المؤتمر إلى مخرج رقمي تفاعلي.",
  workflow: [
    {
      id: "monitoring",
      title: "الرصد الميداني",
      text: "حضور الجلسات وورش العمل وتدوين ما يُطرح فيها قدر الإمكان، دون تلخيص أو معالجة أثناء الرصد.",
    },
    {
      id: "extraction",
      title: "الاستخلاص والتحرير",
      text: "مراجعة المادة المرصودة، واستخلاص أبرز الأفكار والرسائل والمخرجات، وصياغتها وفق القالب المعتمد.",
    },
    {
      id: "translation",
      title: "الترجمة",
      text: "ترجمة المحتوى المعتمد إلى اللغات المستهدفة، مع الحفاظ على المعنى والسياق وتوحيد المصطلحات.",
    },
    {
      id: "review",
      title: "المراجعة والتدقيق",
      text: "مراجعة المحتوى والتحقق من دقته وسلامة لغته واتساق الأسماء والمصطلحات والصياغة.",
    },
    {
      id: "synthesis",
      title: "الحصيلة المعرفية والربط المعرفي",
      text: "قراءة محتوى المؤتمر في صورته الكلية، واستخلاص حصيلته المعرفية، وربط الموضوعات والكلمات المفتاحية والأفكار المشتركة بين جلساته وورش عمله.",
    },
    {
      id: "design",
      title: "التصميم والإخراج الرقمي",
      text: "تحويل المحتوى المعتمد وروابطه المعرفية إلى تجربة رقمية تفاعلية موحدة، تيسّر استكشاف المعرفة وتحفظ أثر المؤتمر وتوسّع نطاق الانتفاع به.",
    },
  ],
} as const;
