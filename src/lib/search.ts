/**
 * بحث ثابت — Static search over local structured data.
 * The index is built at build time and filtered in the browser.
 * It can later be swapped for a hosted search service without changing the UI contract.
 */
import { conferenceBundles } from "@/content/conferences";
import { initiative } from "@/content/site";
import { activityVariant, formatTimeRange, variantLabel } from "./labels";
import { getActivitiesForTopic, getDay, getTopicsOf, speakerDisplayName } from "./content";
import { routes } from "./routes";
import { features } from "@/config/features";

export type SearchType = "conference" | "session" | "workshop" | "speaker" | "topic";

export interface SearchItem {
  id: string;
  type: SearchType;
  title: string;
  subtitle: string;
  href: string;
  /** Pre-normalized searchable text. */
  haystack: string;
}

export const searchTypeLabel: Record<SearchType, string> = {
  conference: "مؤتمر",
  session: "جلسة",
  workshop: "ورشة",
  speaker: "متحدث",
  topic: "موضوع",
};

/** Normalize Arabic for forgiving matching (diacritics, alef/ya/ta-marbuta forms, tatweel). */
export function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ً-ٰٟۖ-ۭ]/g, "") // tashkeel
    .replace(/ـ/g, "") // tatweel
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  const push = (item: Omit<SearchItem, "haystack">, extra = "") =>
    items.push({ ...item, haystack: normalizeArabic(`${item.title} ${item.subtitle} ${extra}`) });

  for (const bundle of conferenceBundles) {
    const c = bundle.conference;
    push(
      {
        id: `conference:${c.id}`,
        type: "conference",
        title: c.title,
        subtitle: `${c.dateLabel} · ${c.city}، ${c.venue}`,
        href: routes.conference(c.slug),
      },
      `${c.summary} ${c.partner} ${c.organizer} ${c.theme ?? ""} ${initiative.name}`,
    );

    for (const a of bundle.activities) {
      const day = getDay(c, a.dayId);
      const speakers = bundle.speakers.filter((s) => a.speakerIds.includes(s.id));
      const topicNames = getTopicsOf(bundle, a).map((t) => t.name);
      const v = activityVariant(a);
      push(
        {
          id: `activity:${a.id}`,
          type: a.kind === "workshop" ? "workshop" : "session",
          title: a.title,
          subtitle: [
            a.programLabel ?? variantLabel[v],
            day ? `${day.label} (${day.weekday})` : "",
            formatTimeRange(a.start, a.end),
            a.location,
          ]
            .filter(Boolean)
            .join(" · "),
          href: routes.activity(c.slug, a.slug),
        },
        [
          variantLabel[v],
          speakers.map((s) => s.name).join(" "),
          topicNames.join(" "),
          a.description,
          a.summary,
          a.report?.title,
          a.report?.people.map((p) => p.name).join(" "),
          a.report?.moderator,
          a.report?.keywords.join(" "),
          a.report?.summary.join(" "),
        ]
          .filter(Boolean)
          .join(" "),
      );
    }

    for (const s of bundle.speakers) {
      const acts = bundle.activities.filter(
        (a) => a.speakerIds.includes(s.id) || a.moderatorIds?.includes(s.id),
      );
      push(
        {
          id: `speaker:${s.id}`,
          type: "speaker",
          title: speakerDisplayName(s),
          subtitle: acts.map((a) => a.shortTitle).join("، ") || c.shortTitle,
          href: acts[0] ? routes.activity(c.slug, acts[0].slug) : routes.conference(c.slug),
        },
        `${s.affiliation ?? ""} ${acts.map((a) => a.title).join(" ")}`,
      );
    }

    // People named in the activity reports who are not in speakers.ts.
    const known = new Set(bundle.speakers.map((s) => normalizeArabic(s.name)));
    for (const a of bundle.activities) {
      for (const p of a.report?.people ?? []) {
        if ([...known].some((k) => normalizeArabic(p.name).includes(k))) continue;
        known.add(normalizeArabic(p.name));
        push(
          {
            id: `person:${a.id}:${p.name}`,
            type: "speaker",
            title: p.name,
            subtitle: a.shortTitle,
            href: routes.activity(c.slug, a.slug),
          },
          `${p.bio ?? ""} ${a.title}`,
        );
      }
      if (a.report?.moderator && !known.has(normalizeArabic(a.report.moderator))) {
        known.add(normalizeArabic(a.report.moderator));
        push(
          {
            id: `person:${a.id}:moderator`,
            type: "speaker",
            title: a.report.moderator,
            subtitle: `إدارة الجلسة · ${a.shortTitle}`,
            href: routes.activity(c.slug, a.slug),
          },
          a.title,
        );
      }
    }

    // Topics are indexed only while the knowledge-topics section is on.
    for (const t of features.knowledgeTopics ? bundle.topics : []) {
      const n = getActivitiesForTopic(bundle, t.id).length;
      // Counts appear only once topic links are approved.
      const presence =
        c.topicLinksStatus !== "proposed" ? `${n} ${n === 1 ? "فعالية" : n === 2 ? "فعاليتان" : "فعاليات"} · ` : "موضوع معرفي · ";
      push(
        {
          id: `topic:${t.id}`,
          type: "topic",
          title: t.name,
          subtitle: `${presence}${c.shortTitle}`,
          href: routes.topic(c.slug, t.slug),
        },
        t.draftNote ?? "",
      );
    }
  }
  return items;
}

const typeRank: Record<SearchType, number> = {
  topic: 0,
  conference: 1,
  session: 2,
  workshop: 3,
  speaker: 4,
};

/** Every query word must appear; title matches rank first. */
export function runSearch(index: SearchItem[], query: string): SearchItem[] {
  const q = normalizeArabic(query);
  if (!q) return [];
  const words = q.split(" ");
  return index
    .filter((item) => words.every((w) => item.haystack.includes(w)))
    .map((item) => {
      const title = normalizeArabic(item.title);
      const score =
        (title === q ? 100 : 0) +
        (title.startsWith(q) ? 40 : 0) +
        (title.includes(q) ? 30 : 0) +
        words.filter((w) => title.includes(w)).length * 5 -
        typeRank[item.type];
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
