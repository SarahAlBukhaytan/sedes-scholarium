import Link from "next/link";
import { Hash } from "lucide-react";
import type { Topic } from "@/content/types";
import { routes } from "@/lib/routes";

/** A topic as a navigable discovery object (not a decorative tag). */
export function TopicChip({
  topic,
  conferenceSlug,
  count,
  size = "md",
  tone = "light",
}: {
  topic: Topic;
  conferenceSlug: string;
  count?: number;
  size?: "sm" | "md";
  tone?: "light" | "dark";
}) {
  const styles =
    tone === "dark"
      ? "border-ivory/20 bg-ivory/5 text-ivory hover:border-sand hover:bg-ivory/10"
      : "border-line-strong bg-surface text-deep hover:border-teal hover:bg-teal-soft";
  return (
    <Link
      href={routes.topic(conferenceSlug, topic.slug)}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${styles} ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
      }`}
    >
      <Hash
        className={`${size === "sm" ? "size-3" : "size-3.5"} ${tone === "dark" ? "text-sand" : "text-sand-ink"}`}
        aria-hidden="true"
      />
      <span className="font-medium">{topic.name}</span>
      {count !== undefined && (
        <span
          className={`rounded-full px-1.5 text-[0.7rem] tabular-nums ${
            tone === "dark" ? "bg-ivory/10" : "bg-surface-muted text-muted"
          }`}
        >
          <span className="sr-only">عدد الفعاليات: </span>
          {count}
        </span>
      )}
    </Link>
  );
}
