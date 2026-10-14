import type { ReactNode } from "react";

/**
 * Editorial section heading: the title, then a fine rule running to the
 * left edge of the column — "العنوان ─────────". Gives reading pages a
 * steady rhythm without boxing each section in a card.
 */
export function RuledHeading({
  id,
  children,
  as: Tag = "h2",
  size = "md",
}: {
  id?: string;
  children: ReactNode;
  as?: "h2" | "h3";
  size?: "md" | "lg";
}) {
  return (
    <Tag
      id={id}
      className={`flex items-center gap-4 font-display font-bold text-deep ${
        size === "lg" ? "text-2xl md:text-[1.7rem]" : "text-xl"
      }`}
    >
      <span className="min-w-0 break-words">{children}</span>
      <span aria-hidden="true" className="relative h-px flex-1 bg-line-strong">
        <span className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rounded-full bg-sand" />
      </span>
    </Tag>
  );
}
