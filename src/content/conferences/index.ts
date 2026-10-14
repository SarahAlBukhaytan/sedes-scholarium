/**
 * سجل المؤتمرات — Registry of all conferences.
 *
 * To add a conference: create a folder next to `translation-conference-1`
 * with the same files, then register it below. Every page, the search index
 * and the knowledge map pick it up automatically.
 */
import type { Activity, Conference, ConferenceOutcome, MapTopic, Speaker, Topic } from "../types";

import { conference as tc1 } from "./translation-conference-1/conference";
import { activities as tc1Activities } from "./translation-conference-1/activities";
import { topics as tc1Topics } from "./translation-conference-1/topics";
import { speakers as tc1Speakers } from "./translation-conference-1/speakers";
import { outcome as tc1Outcome } from "./translation-conference-1/outcome";
import { mapTopics as tc1MapTopics } from "./translation-conference-1/map-topics";

export interface ConferenceBundle {
  conference: Conference;
  activities: Activity[];
  topics: Topic[];
  /** Knowledge-map topics — a separate list from `topics`. */
  mapTopics: MapTopic[];
  speakers: Speaker[];
  outcome?: ConferenceOutcome;
}

export const conferenceBundles: ConferenceBundle[] = [
  {
    conference: tc1,
    activities: tc1Activities,
    topics: tc1Topics,
    mapTopics: tc1MapTopics,
    speakers: tc1Speakers,
    outcome: tc1Outcome,
  },
];
