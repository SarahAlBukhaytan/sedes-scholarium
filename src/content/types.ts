/**
 * نموذج المحتوى — Content model for the Sofraa platform.
 *
 * All site content lives in plain TypeScript data files under `src/content`.
 * Pages never hardcode content; they read it through `src/lib/content.ts`.
 * This separation keeps a later migration to a CMS (or JSON/API source) cheap:
 * only the data files and the query layer need to change.
 */

/** Where a piece of information comes from. */
export type ContentSource =
  /** Read directly from the officially published conference program. */
  | "official-program"
  /** Written for the prototype — must be replaced/validated before launch. */
  | "prototype";

export type ConferenceStatus = "upcoming" | "in-progress" | "documented";

export interface ConferenceDay {
  id: string; // stable id, e.g. "day-1"
  label: string; // "اليوم الأول"
  weekday: string; // "الأربعاء"
  date: string; // ISO date "2026-09-30"
  dateLabel: string; // "30 سبتمبر 2026"
}

/** Non-knowledge program items (registration, ceremonies, breaks…). */
export interface ProgramItem {
  id: string;
  dayId: string;
  title: string;
  start?: string; // "09:30"
  end?: string;
  note?: string;
}

export interface ConferenceAxis {
  id: string;
  order: number;
  title: string;
  description?: string;
}

export type ConferenceMedia =
  | { kind: "image"; src: string; width: number; height: number; thumb: string }
  | { kind: "video"; src: string; type: string };

export interface Conference {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  organizer: string;
  partner: string;
  /** Short introduction (cards and conference hero). */
  summary: string;
  city: string;
  venue: string;
  startDate: string; // ISO
  endDate: string; // ISO
  dateLabel: string;
  /** Compact date without the year, for card headers. */
  dateLabelShort?: string;
  dailyHours?: string;
  /** Official conference theme, e.g. "الترجمة في عالم يتحول". */
  theme?: string;
  /** Official conference axes (محاور المؤتمر). Empty until supplied. */
  axes: ConferenceAxis[];
  /**
   * Whether topic ↔ activity links are approved. While "proposed", no
   * occurrence counts are shown and topic lists are labelled as proposed.
   */
  topicLinksStatus: "approved" | "report-derived" | "proposed";
  /** Photo / video coverage of the conference (originals, no invented captions). */
  media?: ConferenceMedia[];
  days: ConferenceDay[];
  status: ConferenceStatus;
  /** Optional cover image path (public/…). A generated visual is used if absent. */
  coverImage?: string;
  programItems: ProgramItem[];
  source: ContentSource;
  isPrototype?: boolean;
}

export type ActivityKind = "session" | "workshop";

/**
 * An official visual template produced by the Graphic Designers team.
 * Put the file in /public/templates/<conference>/ and give its real pixel
 * size so it is never distorted, e.g.
 *   { src: "/templates/translation-conference-1/keynote-1-ar.png", width: 1080, height: 1350, alt: "…" }
 */
export interface DesignTemplate {
  src: string;
  width: number;
  height: number;
  alt: string;
}
export type SessionType = "keynote" | "scientific";

/**
 * A documented highlight quote ("اقتباس بارز موثّق").
 * Add it to an activity only when it was recorded at the event and approved.
 * Attribution comes from `speakerId` (preferred) or, if the speaker is not in
 * speakers.ts, from `attribution`. Never invent either.
 *
 *   quote: { kind: "documented", text: "…", speakerId: "hind-alkhalifa" }
 */
export type Quote =
  | {
      /** A real, documented and approved quote. */
      kind: "documented";
      text: string;
      speakerId?: string;
      /** Free-text attribution when the speaker has no entry in speakers.ts. */
      attribution?: string;
    }
  | {
      /**
       * PROTOTYPE ONLY — lets reviewers see the quote design before approved
       * material exists. Never attributed to a real speaker; the UI marks it
       * as a non-official sample. Delete or replace with a documented quote.
       */
      kind: "prototype-placeholder";
      text: string;
      attribution: string;
    };

/** A person named in an activity report, exactly as the report gives it. */
export interface ReportPerson {
  name: string;
  /** Role or bio line from the report — omitted when the report text is corrupt. */
  bio?: string;
  /** Listed by the report but not a speaker/presenter (e.g. supervisor, note-taker). */
  participant?: boolean;
}

/**
 * التقرير المعرفي — one page of the official Arabic reports PDF
 * ("التقارير.pdf"). Texts are copied from the report, not rewritten.
 * Only obvious extraction artefacts are repaired; every other doubt goes
 * to `Activity.reviewNotes` instead of being "fixed" silently.
 */
export interface ActivityReport {
  /** Page number in التقارير.pdf. */
  page: number;
  /** Title as printed on the report (may differ from the program title). */
  title: string;
  /** "نوع الحدث" as printed on the report. */
  eventType: string;
  /** Heading the report uses for its people block (المتحدث / المتحدثين …). */
  peopleHeading: string;
  people: ReportPerson[];
  moderator?: string;
  /** Date / time / place — only when the report prints them. */
  date?: string;
  time?: string;
  place?: string;
  /** «الملخص التعريفي» paragraphs, in the order they appear on the page. */
  summary: string[];
  /** Set when the summary must NOT be shown (e.g. it duplicates another report). */
  summaryWithheld?: string;
  /** The highlighted statement printed in the report's dark box. */
  highlight?: string;
  highlightAttribution?: string;
  /** The highlight may belong to another activity — not reused elsewhere. */
  highlightNeedsReview?: boolean;
  keywords: string[];
  /** «الراصدون» — only when the report names them. */
  observers?: string[];
  /** The label the report uses for them (e.g. «الراصدتان»). */
  observersLabel?: string;
  /** Reserved for the English edition (not machine-translated). */
  en?: { title?: string; summary?: string[]; keywords?: string[] };
}

/**
 * A session or a workshop. Both share one shape so that topics, related
 * content, search and the knowledge map can treat them uniformly.
 */
export interface Activity {
  id: string;
  slug: string;
  conferenceId: string;
  kind: ActivityKind;
  /** Only for sessions. */
  sessionType?: SessionType;
  /** Program label, e.g. "الجلسة العلمية الأولى". */
  programLabel?: string;
  title: string;
  /** Few words, used for compact labels (graph, chips). */
  shortTitle: string;
  dayId: string;
  start?: string;
  end?: string;
  location?: string;
  speakerIds: string[];
  moderatorIds?: string[];
  /** When the program lists people we could not read reliably. */
  speakersPending?: boolean;
  /** Topic ids — the ONLY place relationships are defined. */
  topicIds: string[];
  /** Introductory description (prototype, derived from title). */
  description?: string;
  /** Documented editorial summary — filled after the activity is documented. */
  summary?: string;
  keyIdeas?: string[];
  /** Official outputs / recommendations — never invented. */
  outputs?: string[];
  quote?: Quote;
  /** Official Arabic / English templates — added only when supplied. */
  templates?: { ar?: DesignTemplate; en?: DesignTemplate };
  /** Official activity report (التقارير.pdf). */
  report?: ActivityReport;
  /**
   * Evidence for each topic link, keyed by topic id: the report keyword or
   * phrase that supports it. A link without evidence is not made.
   */
  topicEvidence?: Record<string, string>;
  /** «معلومات تحتاج مراجعة» — conflicts between sources, shown on the page. */
  reviewNotes?: string[];
  source: ContentSource;
  isPrototype?: boolean;
}

export interface Speaker {
  id: string;
  name: string;
  honorific?: string; // "د." / "أ.د."
  affiliation?: string;
  bio?: string;
  image?: string;
  /** Name transcribed from a low-resolution program image — confirm before launch. */
  needsVerification?: boolean;
}

export interface Topic {
  id: string;
  /** Approved display order (editorial numbering 01, 02… — not a ranking). */
  order: number;
  slug: string;
  conferenceId: string;
  name: string;
  /** Approved short note on how the topic appeared in the conference. */
  intro?: string;
  /** Approved ideas associated with the topic. */
  keyIdeas?: string[];
  /** Internal prototype draft — never rendered to visitors. */
  draftNote?: string;
  /** Approved links to knowledge-map topics (map-topics.ts), if any. */
  mapTopicIds?: string[];
}

/** Icon keys available for knowledge-map circles (mapped to icons in the UI). */
export type MapIcon =
  | "ai"
  | "literary"
  | "interpreting"
  | "culture"
  | "education"
  | "corpus"
  | "quality"
  | "skills"
  | "prompt"
  | "hajj"
  | "post-editing"
  | "labour"
  | "technologies"
  | "machine-translation";

/**
 * A topic of the knowledge map (خريطة الترابط المعرفي) — a list DISTINCT from
 * the 12 knowledge topics. Every relationship field starts empty and is filled
 * only from approved content; the map shows a pending state until then.
 */
export interface MapTopic {
  id: string;
  slug: string;
  order: number;
  nameAr: string;
  nameEn: string;
  icon: MapIcon;
  /** Approved short description (optional). */
  description?: string;
  /** Approved activities that discussed the topic. */
  activityIds: string[];
  /** Approved keywords / ideas. */
  keywords: string[];
  /** Approved, documented relations to other map topics (draws a link line). */
  relatedMapTopicIds: string[];
  /** Approved correspondence with the 12 knowledge topics (topics.ts ids). */
  knowledgeTopicIds: string[];
}

/** A named role in the initiative (no photos by design). */
export interface TeamRole {
  id?: string;
  role: string;
  name: string;
  /** Personal LinkedIn profile — only when supplied in «Team LinkedIn.xlsx». */
  linkedin?: string;
}

export interface TeamMember {
  name: string;
  /** Personal LinkedIn profile — only when supplied in «Team LinkedIn.xlsx». */
  linkedin?: string;
}

export interface TeamTrack {
  id: string;
  name: string;
  /** Omit when the leader has not been confirmed. */
  leader?: TeamRole;
  /** Members, listed only once publishing them is confirmed. */
  members: TeamMember[];
}

export interface TeamStructure {
  /** Founder / head — top of the organisational chart. */
  head: TeamRole[];
  /** Academic supervision (shown at the foot of the official chart). */
  supervision?: TeamRole;
  tracks: TeamTrack[];
  /**
   * Official org-chart artwork by the Graphic Designer. When set, it is shown
   * on the team page instead of the drawn structure. Provide a mobile version
   * (portrait) when the desktop artwork is too wide to read on phones.
   */
  chart?: {
    alt: string;
    desktop: { src: string; width: number; height: number };
    mobile?: { src: string; width: number; height: number };
  };
}

export interface OutcomeSection {
  /** Editorial text; when absent the section renders a "pending" state. */
  items?: { text: string; topicIds?: string[]; activityIds?: string[] }[];
  note?: string;
}

export interface ConferenceOutcome {
  conferenceId: string;
  status: "pending" | "draft" | "published";
  intro: string;
  keyMessages: OutcomeSection;
  crossCuttingIdeas: OutcomeSection;
  recommendations: OutcomeSection;
  /** Closing editorial reading of the conference's overall knowledge picture. */
  overallReading?: string;
}
