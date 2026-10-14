import type { Quote } from "@/content/types";
import { RuledHeading } from "./RuledHeading";

/**
 * "اقتباس بارز" — an editorial moment, not a card: a sand accent rule,
 * the quote set in the display face between Arabic guillemets, and the
 * attribution beneath.
 *
 * Renders for a documented quote, or for a clearly-labelled prototype
 * placeholder (design review only). With no quote, the caller renders nothing.
 */
export function QuoteBlock({
  quote,
  attribution,
  heading = "اقتباس بارز",
}: {
  quote: Quote;
  attribution?: string;
  heading?: string;
}) {
  const text = quote.text.trim();
  if (!text) return null;
  const isPlaceholder = quote.kind === "prototype-placeholder";

  return (
    <section aria-labelledby="quote-h">
      <RuledHeading id="quote-h">{heading}</RuledHeading>
      <figure className="relative mt-8 ps-8 md:ps-12">
        {/* gold rule along the quote */}
        <span aria-hidden="true" className="absolute top-1 bottom-1 right-0 w-0.5 rounded-full bg-sand" />
        <blockquote className="font-display text-xl leading-[2.4rem] text-deep md:text-[1.6rem] md:leading-[3rem]">
          <p>«{text}»</p>
        </blockquote>
        {attribution && (
          <figcaption className="mt-5 flex items-center gap-3 text-sm text-muted">
            <span aria-hidden="true" className="h-px w-6 bg-teal/40" />
            {attribution}
          </figcaption>
        )}
        {isPlaceholder && (
          <p className="mt-4 inline-flex rounded-full border border-dashed border-sand-ink/40 px-3 py-1 text-xs text-sand-ink">
            نموذج للعرض فقط — ليس اقتباسًا موثّقًا
          </p>
        )}
      </figure>
    </section>
  );
}
