import { getBackend, type Op } from "./store";

/**
 * تعريفات القياس — what is counted:
 *  - زيارة (visit): one entry to the platform in a browser tab. Refreshing or
 *    moving between pages in the same tab stays in the same visit; opening
 *    the site in a new tab or after closing it is a new visit (no time window).
 *  - مشاهدة صفحة (page view): every page opened, so one visit usually makes
 *    several page views.
 *  - مدة التصفح: active (visible-tab) seconds per visit, averaged over visits.
 * Counting starts the moment a store is connected; earlier visits cannot be
 * recovered because nothing was recorded before.
 */

export type TrackPayload =
  | { t: "pv"; path: string; newVisit?: boolean; newConfVisit?: boolean }
  | { t: "ev"; name: "keyword" | "map-topic" | "report-pdf-open" | "report-pdf-download"; value?: string }
  | { t: "dur"; seconds: number };

const day = () => new Date().toISOString().slice(0, 10);
const clean = (s: string, max = 120) => s.replace(/[\u0000-\u001f]/g, "").slice(0, max);

/** Validates untrusted input from the browser; returns null when invalid. */
export function parsePayload(input: unknown): TrackPayload | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;
  if (o.t === "pv" && typeof o.path === "string" && o.path.startsWith("/") && o.path.length < 200) {
    return { t: "pv", path: clean(o.path, 200).split("?")[0].split("#")[0], newVisit: o.newVisit === true, newConfVisit: o.newConfVisit === true };
  }
  if (o.t === "ev" && ["keyword", "map-topic", "report-pdf-open", "report-pdf-download"].includes(String(o.name))) {
    return { t: "ev", name: o.name as "keyword", value: typeof o.value === "string" ? clean(o.value) : undefined };
  }
  if (o.t === "dur" && typeof o.seconds === "number" && o.seconds > 0 && o.seconds <= 3600) {
    return { t: "dur", seconds: Math.round(o.seconds) };
  }
  return null;
}

export async function record(p: TrackPayload): Promise<boolean> {
  const store = getBackend();
  if (!store) return false;
  const ops: Op[] = [{ kind: "setnx", key: "since", value: new Date().toISOString() }];
  if (p.t === "pv") {
    if (p.path.startsWith("/admin") || p.path.startsWith("/api")) return true;
    ops.push({ kind: "incr", key: "pageviews", by: 1 }, { kind: "hincr", key: "pages", field: p.path, by: 1 });
    if (p.newVisit) ops.push({ kind: "incr", key: "visits", by: 1 }, { kind: "hincr", key: "visits-by-day", field: day(), by: 1 });
    const conf = /^\/conferences\/([^/]+)/.exec(p.path)?.[1];
    if (conf) {
      ops.push({ kind: "hincr", key: "conference-views", field: conf, by: 1 });
      if (p.newConfVisit) ops.push({ kind: "hincr", key: "conference-visits", field: conf, by: 1 });
      const act = /^\/conferences\/[^/]+\/activities\/([^/]+)/.exec(p.path)?.[1];
      if (act) ops.push({ kind: "hincr", key: "activity-views", field: `${conf}/${act}`, by: 1 });
      const topic = /^\/conferences\/[^/]+\/topics\/([^/]+)/.exec(p.path)?.[1];
      if (topic) ops.push({ kind: "hincr", key: "topic-views", field: `${conf}/${topic}`, by: 1 });
      if (/^\/conferences\/[^/]+\/knowledge-map/.test(p.path)) ops.push({ kind: "incr", key: "map-views", by: 1 });
    }
  } else if (p.t === "ev") {
    ops.push({ kind: "hincr", key: "events", field: p.name, by: 1 });
    if (p.name === "keyword" && p.value) ops.push({ kind: "hincr", key: "keywords", field: p.value, by: 1 });
    if (p.name === "map-topic" && p.value) ops.push({ kind: "hincr", key: "map-topics", field: p.value, by: 1 });
  } else {
    ops.push({ kind: "incr", key: "duration-seconds", by: p.seconds });
  }
  await store.write(ops);
  return true;
}

export interface PublicStats {
  connected: boolean;
  visits: number | null;
  since: string | null;
}

export async function readPublicStats(): Promise<PublicStats> {
  const store = getBackend();
  if (!store) return { connected: false, visits: null, since: null };
  const [visits, since] = await Promise.all([store.get("visits"), store.get("since")]);
  return { connected: true, visits: Number(visits) || 0, since };
}

const top = (h: Record<string, number>, n = 10) =>
  Object.entries(h)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, value]) => ({ key, value }));

export async function readAdminStats() {
  const store = getBackend();
  if (!store) return null;
  const [visits, pageviews, since, durationSeconds, mapViews] = await Promise.all(
    ["visits", "pageviews", "since", "duration-seconds", "map-views"].map((k) => store.get(k)),
  );
  const [pages, confVisits, confViews, activities, topics, mapTopics, keywords, events, byDay] = await Promise.all(
    ["pages", "conference-visits", "conference-views", "activity-views", "topic-views", "map-topics", "keywords", "events", "visits-by-day"].map((k) =>
      store.hgetall(k),
    ),
  );
  const v = Number(visits) || 0;
  return {
    backend: store.name,
    since,
    visits: v,
    pageviews: Number(pageviews) || 0,
    // active time is sent when a tab is hidden/closed — no data yet means "—", not 0
    avgDurationSeconds: v && Number(durationSeconds) > 0 ? Math.round(Number(durationSeconds) / v) : null,
    mapViews: Number(mapViews) || 0,
    mapInteractions: events["map-topic"] ?? 0,
    pdfOpens: (events["report-pdf-open"] ?? 0) + (events["report-pdf-download"] ?? 0),
    topPages: top(pages),
    conferenceVisits: top(confVisits),
    conferenceViews: top(confViews),
    topActivities: top(activities),
    topTopics: top(topics),
    topMapTopics: top(mapTopics),
    topKeywords: top(keywords),
    visitsByDay: Object.entries(byDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([key, value]) => ({ key, value })),
  };
}
