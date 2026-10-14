/**
 * Serializable view models — resolved once on the server, safe to pass to
 * client components (filters, graph, search).
 */
import type { Activity } from "@/content/types";
import type { ConferenceBundle } from "./content";
import { getDay, getSpeakersByIds, getTopicsOf, isDocumented, speakerDisplayName } from "./content";
import { activityVariant, type ActivityVariant } from "./labels";
import { routes } from "./routes";
import { features } from "@/config/features";

export interface ActivityCardData {
  id: string;
  href: string;
  variant: ActivityVariant;
  programLabel?: string;
  title: string;
  dayId: string;
  dayLabel: string;
  dayDetail: string;
  start?: string;
  end?: string;
  location?: string;
  speakers: string[];
  speakersPending: boolean;
  topics: { id: string; name: string; href: string }[];
  documented: boolean;
}

export function toActivityCardData(bundle: ConferenceBundle, a: Activity): ActivityCardData {
  const day = getDay(bundle.conference, a.dayId);
  return {
    id: a.id,
    href: routes.activity(bundle.conference.slug, a.slug),
    variant: activityVariant(a),
    programLabel: a.programLabel,
    title: a.title,
    dayId: a.dayId,
    dayLabel: day?.label ?? "",
    dayDetail: day ? `${day.weekday} ${day.dateLabel}` : "",
    start: a.start,
    end: a.end,
    location: a.location,
    // The report's speaker list wins; otherwise the names read from the program.
    speakers: a.report
      ? a.report.people.filter((p) => !p.participant).map((p) => p.name)
      : getSpeakersByIds(bundle, a.speakerIds).map(speakerDisplayName),
    speakersPending: !a.report && Boolean(a.speakersPending),
    topics: (features.knowledgeTopics ? getTopicsOf(bundle, a) : []).map((t) => ({
      id: t.id,
      name: t.name,
      href: routes.topic(bundle.conference.slug, t.slug),
    })),
    documented: isDocumented(a),
  };
}
