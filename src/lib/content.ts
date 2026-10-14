/**
 * طبقة الاستعلام — Content query layer.
 *
 * Pages read content ONLY through these functions. If content moves to a CMS
 * or an API later, re-implement these functions (they can become async)
 * and the pages stay the same.
 *
 * Topic ↔ activity relationships are derived from `activity.topicIds`.
 */
import { conferenceBundles, type ConferenceBundle } from "@/content/conferences";
import type { Activity, Conference, ConferenceDay, MapTopic, Speaker, Topic } from "@/content/types";

export type { ConferenceBundle };

export function getConferences(): Conference[] {
  return conferenceBundles
    .map((b) => b.conference)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function getBundle(conferenceSlug: string): ConferenceBundle | undefined {
  return conferenceBundles.find((b) => b.conference.slug === conferenceSlug);
}

export function getDay(conference: Conference, dayId: string): ConferenceDay | undefined {
  return conference.days.find((d) => d.id === dayId);
}

/** Chronological order: day, then start time, then keynote → scientific → workshop. */
export function sortActivities(conference: Conference, list: Activity[]): Activity[] {
  const dayIndex = (id: string) => conference.days.findIndex((d) => d.id === id);
  const kindRank = (a: Activity) =>
    a.kind === "workshop" ? 2 : a.sessionType === "keynote" ? 0 : 1;
  return [...list].sort(
    (a, b) =>
      dayIndex(a.dayId) - dayIndex(b.dayId) ||
      (a.start ?? "").localeCompare(b.start ?? "") ||
      kindRank(a) - kindRank(b) ||
      (a.location ?? "").localeCompare(b.location ?? ""),
  );
}

export function getActivities(bundle: ConferenceBundle): Activity[] {
  return sortActivities(bundle.conference, bundle.activities);
}

export function getSessions(bundle: ConferenceBundle): Activity[] {
  return getActivities(bundle).filter((a) => a.kind === "session");
}

export function getWorkshops(bundle: ConferenceBundle): Activity[] {
  return getActivities(bundle).filter((a) => a.kind === "workshop");
}

export function getActivity(bundle: ConferenceBundle, slug: string): Activity | undefined {
  return bundle.activities.find((a) => a.slug === slug);
}

export function getTopic(bundle: ConferenceBundle, slug: string): Topic | undefined {
  return bundle.topics.find((t) => t.slug === slug);
}

export function getTopicsByIds(bundle: ConferenceBundle, ids: string[]): Topic[] {
  return ids
    .map((id) => bundle.topics.find((t) => t.id === id))
    .filter((t): t is Topic => Boolean(t));
}

export function getSpeakersByIds(bundle: ConferenceBundle, ids: string[] = []): Speaker[] {
  return ids
    .map((id) => bundle.speakers.find((s) => s.id === id))
    .filter((s): s is Speaker => Boolean(s));
}

export function speakerDisplayName(s: Speaker): string {
  return s.honorific ? `${s.honorific} ${s.name}` : s.name;
}

/* ───────────────────────────────────────────────────────────────
 * Knowledge model — the SINGLE source of truth for topic ↔ activity.
 *
 * The only stored relationship is `activity.topicIds`. Everything below
 * (topic counts, topic pages, co-occurring topics, related activities,
 * activity topic chips, knowledge-map edges) is derived through
 * `topicIdsOf`, which de-duplicates ids and ignores unknown ones.
 * ─────────────────────────────────────────────────────────────── */

/** An activity's topic ids: unique, existing topics only, in authored order. */
export function topicIdsOf(bundle: ConferenceBundle, activity: Activity): string[] {
  const known = new Set(bundle.topics.map((t) => t.id));
  return [...new Set(activity.topicIds)].filter((id) => known.has(id));
}

/** An activity's topics (for chips, related content, the map). */
export function getTopicsOf(bundle: ConferenceBundle, activity: Activity): Topic[] {
  return getTopicsByIds(bundle, topicIdsOf(bundle, activity));
}

/** All unique activities that discuss a topic, in program order. */
export function getActivitiesForTopic(bundle: ConferenceBundle, topicId: string): Activity[] {
  return getActivities(bundle).filter((a) => topicIdsOf(bundle, a).includes(topicId));
}

export interface RelatedTopic {
  topic: Topic;
  /** Number of activities in which both topics appear together (relationship strength). */
  shared: number;
  /** Those activities, in program order — the stated reason for the crossing. */
  activities: Activity[];
}

/**
 * Co-occurring topics: two topics are related when they appear together in at
 * least one activity. Stronger (more shared activities) first.
 */
export function getRelatedTopics(bundle: ConferenceBundle, topicId: string, limit = Infinity): RelatedTopic[] {
  const shared = new Map<string, Activity[]>();
  for (const a of getActivities(bundle)) {
    const ids = topicIdsOf(bundle, a);
    if (!ids.includes(topicId)) continue;
    for (const other of ids) {
      if (other !== topicId) shared.set(other, [...(shared.get(other) ?? []), a]);
    }
  }
  return [...shared.entries()]
    .map(([id, activities]) => ({ topic: bundle.topics.find((t) => t.id === id)!, shared: activities.length, activities }))
    .sort((a, b) => b.shared - a.shared || a.topic.name.localeCompare(b.topic.name, "ar"))
    .slice(0, limit);
}

export interface TopicWithStats {
  topic: Topic;
  sessions: number;
  workshops: number;
  /** Unique activities connected to the topic. */
  total: number;
}

/** Topics with their occurrence counts, most present first. */
export function getTopicsWithStats(bundle: ConferenceBundle): TopicWithStats[] {
  return bundle.topics
    .map((topic) => {
      const acts = getActivitiesForTopic(bundle, topic.id);
      const sessions = acts.filter((a) => a.kind === "session").length;
      return { topic, sessions, workshops: acts.length - sessions, total: acts.length };
    })
    .sort((a, b) => b.total - a.total || a.topic.name.localeCompare(b.topic.name, "ar"));
}

/**
 * Topics for the topics index, in the APPROVED editorial order (`topic.order`).
 * The numbering is editorial only — never a ranking; frequency never changes
 * size, colour or position.
 */
export function getTopicIndex(bundle: ConferenceBundle): TopicWithStats[] {
  return getTopicsWithStats(bundle).sort((a, b) => a.topic.order - b.topic.order);
}

export interface RelatedActivity {
  activity: Activity;
  sharedTopics: Topic[];
}

/** Activities sharing the most topics with the given activity. */
export function getRelatedActivities(
  bundle: ConferenceBundle,
  activity: Activity,
  limit = 4,
): RelatedActivity[] {
  const own = topicIdsOf(bundle, activity);
  return bundle.activities
    .filter((a) => a.id !== activity.id)
    .map((a) => ({
      activity: a,
      sharedTopics: getTopicsByIds(
        bundle,
        topicIdsOf(bundle, a).filter((id) => own.includes(id)),
      ),
    }))
    .filter((r) => r.sharedTopics.length > 0)
    .sort(
      (x, y) =>
        y.sharedTopics.length - x.sharedTopics.length ||
        Number(y.activity.dayId === activity.dayId) - Number(x.activity.dayId === activity.dayId),
    )
    .slice(0, limit);
}

/** Summary numbers — all derived from the structured data. */
export function getConferenceStats(bundle: ConferenceBundle) {
  const sessions = bundle.activities.filter((a) => a.kind === "session");
  return {
    days: bundle.conference.days.length,
    keynotes: sessions.filter((s) => s.sessionType === "keynote").length,
    scientific: sessions.filter((s) => s.sessionType === "scientific").length,
    sessions: sessions.length,
    workshops: bundle.activities.length - sessions.length,
    topics: bundle.topics.length,
    activities: bundle.activities.length,
  };
}

export interface TopicPair {
  a: Topic;
  b: Topic;
  activities: Activity[];
}

/** Topic pairs that meet in the same activities — the conference's crossing points. */
export function getTopicPairs(bundle: ConferenceBundle, limit = 5): TopicPair[] {
  const pairs = new Map<string, Activity[]>();
  for (const act of bundle.activities) {
    const ids = topicIdsOf(bundle, act).sort();
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++) {
        const key = `${ids[i]}|${ids[j]}`;
        pairs.set(key, [...(pairs.get(key) ?? []), act]);
      }
  }
  return [...pairs.entries()]
    .map(([key, activities]) => {
      const [x, y] = key.split("|");
      return {
        a: bundle.topics.find((t) => t.id === x)!,
        b: bundle.topics.find((t) => t.id === y)!,
        activities: sortActivities(bundle.conference, activities),
      };
    })
    .filter((p) => p.a && p.b)
    .sort((p, q) => q.activities.length - p.activities.length)
    .slice(0, limit);
}

export function isDocumented(a: Activity): boolean {
  // A prototype placeholder quote never counts as documentation.
  return Boolean(
    a.report?.summary.length || a.summary || a.keyIdeas?.length || a.outputs?.length || a.quote?.kind === "documented",
  );
}

/* ── Knowledge map (separate list of topics) ──────────────────────────── */

export function getMapTopics(bundle: ConferenceBundle): MapTopic[] {
  return [...bundle.mapTopics].sort((a, b) => a.order - b.order);
}

export function getMapTopic(bundle: ConferenceBundle, id: string): MapTopic | undefined {
  return bundle.mapTopics.find((m) => m.id === id);
}
