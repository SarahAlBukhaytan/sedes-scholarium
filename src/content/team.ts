import type { TeamStructure } from "./types";

/**
 * هيكل الفريق — the OFFICIAL structure from «Sedes Scholarium-الهيكلة.pdf»
 * («فريق العمل»): names, titles, tracks and their order are copied from that
 * page (members in the order they appear, right to left, row by row).
 *
 * LinkedIn links come from «Team LinkedIn.xlsx» only. Each was matched by
 * first name + family name (the sheet gives three- or four-part names); the
 * tracking query string (utm_…) is removed, the profile path is unchanged.
 * Members without a row in the sheet have no link — none is guessed:
 * نجلاء النفيسي، ندى العتيبي، حنين الحارثي، شهد زيدان، مناحي آل الجرو، مشاعل البخيتان.
 */
const li = (slug: string) => `https://www.linkedin.com/in/${slug}`;

export const team: TeamStructure = {
  head: [
    { id: "founder", role: "مؤسِّسة ورئيسة المبادرة", name: "شوق الشهري", linkedin: li("shouq-al-shehri-7a3309152") },
  ],
  supervision: { role: "المشرفة الأكاديمية المؤسِّسة", name: "أ. الجوهرة الحربي", linkedin: li("aljawhara-alharbi-32522362") },
  tracks: [
    {
      id: "content-editing",
      name: "مسار المحتوى والتحرير",
      leader: { role: "قائدة مسار المحتوى والتحرير", name: "سفانة الهديب", linkedin: li("sffanh-alhudaib-%E7%B4%A2%E8%8A%B3-9629892b1") },
      members: [
        { name: "أروى فهد", linkedin: li("arwa-f-45a39132a") },
        { name: "تميم السلمي", linkedin: li("tamim-alsulami-b36961374") },
        { name: "ديم البداح", linkedin: li("deemalbdah-a201a7226") },
        { name: "ريم القحطاني", linkedin: li("reem-alqahtani-4b9576265") },
        { name: "ريماس الخوير", linkedin: li("remas-alkhuwayr-61b019338") },
        { name: "سارة المقري", linkedin: li("sarahalmugarry") },
        { name: "شذى الدوحان", linkedin: li("shatha-aldohan-977a68348") },
        { name: "علياء العريفي", linkedin: li("alya-alarifi") },
        { name: "لين الحمصي", linkedin: li("%D9%84%D9%8A%D9%86-%D8%A7%D9%84%D8%AD%D9%85%D8%B5%D9%8A-113274276") },
        { name: "نجلاء النفيسي" },
        { name: "منار القحطاني", linkedin: li("manar-al-qahtani-7a04742ba") },
        // membership confirmed by the initiative (Nov 2026); listed in «COLS KSU.pdf»
        { name: "ندى العتيبي" },
      ],
    },
    {
      id: "languages-translation",
      name: "مسار اللغات والترجمة",
      leader: { role: "قائدة مسار اللغات والترجمة", name: "تالا الخريجي", linkedin: li("tala-alkharaiji-23560b240") },
      members: [
        { name: "أروان المالكي", linkedin: li("arwan-almalki-062a19388") },
        { name: "بثينة السلامة", linkedin: li("buthinh-fahad-a37536423") },
        { name: "جواهر الشهري", linkedin: li("jawaher-alshehri-2a666823b") },
        { name: "جود الحصيني", linkedin: li("joud-alhusayni-862157411") },
        { name: "حنين الحارثي" },
        { name: "ديمة العنقري", linkedin: li("deemah-alangari") },
        { name: "رغد هزاع", linkedin: li("raghad-hazza-034946429") },
        { name: "رهف رفيد", linkedin: li("rahaf-rfid-50b259433") },
        { name: "روان القحطاني", linkedin: li("rawanalqahtani1") },
        { name: "ريناد الحميدان", linkedin: li("renad-alhumaidan-1b173b244") },
        { name: "سارة العمري", linkedin: li("sarah-alamri-3a15303a6") },
        { name: "سارة العجيان", linkedin: li("sarah-alojayan-30773b2a4") },
        { name: "سعود المطيري", linkedin: li("saud-almutairi-422aa33a8") },
        { name: "شجون المنسي", linkedin: li("shjoon-mohammed-aa5b9b3a2") },
        { name: "شهد زيدان" },
        { name: "صالح البدراني", linkedin: li("saleh-albadrani-062629392") },
        { name: "عبدالعزيز العبدلي", linkedin: li("abdulaziz-alabduly-66bb4739a") },
        { name: "عبدالله الأسمري", linkedin: li("abdallah-alasmari-b67b1a351") },
        { name: "علي الضنكي", linkedin: li("ali-aldhanki-6bba1128a") },
        { name: "العنود الدوسري", linkedin: li("alanood-aldossary") },
        { name: "غادة العمري", linkedin: li("ghada-alamri2005") },
        { name: "غيداء الحويطي", linkedin: li("ghaida-alhowaiti-118505290") },
        { name: "فلوة الحوشان", linkedin: li("felwah-alhoshan-16359125a") },
        { name: "محمد الميموني", linkedin: li("almimony75") },
        { name: "مناحي آل الجرو" },
        { name: "موضي آل داوود", linkedin: li("modhi-saad-0a8457445") },
        { name: "هاجر آل داوود", linkedin: li("hajar-saad-b65451445") },
        { name: "وضحى العجمي", linkedin: li("wadha-alajmi-b62847440") },
      ],
    },
    {
      id: "tech-design",
      name: "مسار التقنية والتصميم",
      leader: { role: "قائدة مسار التقنية والتصميم", name: "الهنوف الوهيبي", linkedin: li("alhanouf-alwehaibi-70907518b") },
      members: [
        { name: "بدر الشهري", linkedin: li("badr-alshehri-885352445") },
        { name: "ثريا العسكر", linkedin: li("thuraya-alaskar-483698369") },
        { name: "سارة البخيتان", linkedin: li("sarah-albukhaytan-a0869b423") },
        { name: "قرار العويسي", linkedin: li("qararalowisi") },
        { name: "مشاعل البخيتان" },
      ],
    },
  ],
};
