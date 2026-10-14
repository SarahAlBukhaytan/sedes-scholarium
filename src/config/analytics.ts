/**
 * إعدادات الإحصاءات — Analytics wording.
 *
 * The data itself is recorded by the site's own tracker
 * (src/components/analytics/Tracker.tsx → /api/track) into the store chosen
 * in src/lib/analytics/store.ts:
 *   - production (Vercel): Upstash Redis — env KV_REST_API_URL / KV_REST_API_TOKEN
 *   - local development: .data/analytics.json
 * Without a store the public counter shows a pending state, never a number.
 */

/** What the public number means. Shown to visitors next to the number. */
export type VisitMetric = "visits" | "pageviews";

export const metricLabel: Record<VisitMetric, { title: string; unit: string; explain: string }> = {
  visits: {
    title: "إجمالي زيارات المنصة",
    unit: "زيارة",
    explain:
      "الزيارة جلسة تصفّح واحدة للمنصة كاملة، مهما تعددت الصفحات التي فُتحت خلالها، وتنتهي بعد 30 دقيقة بلا نشاط. أما مشاهدة الصفحة فتُحتسب لكل صفحة تُفتح.",
  },
  pageviews: {
    title: "إجمالي مشاهدات صفحات المنصة",
    unit: "مشاهدة",
    explain: "تُحتسب كل صفحة تُفتح مشاهدةً مستقلة.",
  },
};
