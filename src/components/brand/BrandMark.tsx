import Image from "next/image";
import { brand } from "@/config/brand";
import { initiative } from "@/content/site";

/**
 * The official Sedes Scholarium logo (exported from the identity artwork).
 *
 *  - variant "lockup": brand mark + the name set as real text — for the
 *    header, where the stacked word mark would be too small to read.
 *  - variant "full":   the complete official logo (mark + word mark).
 *  - variant "mark":   the brand mark alone (decorative / large visuals).
 *
 * `tone` picks the logo variation designed for the background
 * ("dark" ink for light backgrounds, "light" for navy backgrounds).
 */
export function BrandMark({
  tone = "dark",
  variant = "lockup",
  className = "",
  priority = false,
}: {
  tone?: "dark" | "light";
  variant?: "lockup" | "full" | "mark";
  className?: string;
  priority?: boolean;
}) {
  const light = tone === "light";
  if (variant === "full") {
    const l = light ? brand.logoOnDark : brand.logo;
    return (
      <Image src={l.src} width={l.width} height={l.height} alt={brand.name} priority={priority} className={className} />
    );
  }
  const m = light ? brand.markOnDark : brand.mark;
  if (variant === "mark") {
    return <Image src={m.src} width={m.width} height={m.height} alt="" aria-hidden="true" priority={priority} className={className} />;
  }
  return (
    <span className={`inline-flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-2.5 ${className}`}>
      <Image src={m.src} width={m.width} height={m.height} alt="" aria-hidden="true" priority className="h-7 w-auto min-[360px]:h-8 sm:h-9 md:h-10" />
      <span className="flex flex-col leading-none">
        <bdi dir="ltr" className={`font-latin text-[0.7rem] font-bold tracking-wide min-[360px]:text-[0.84rem] sm:text-[0.95rem] md:text-base ${light ? "text-ivory" : "text-deep"}`}>
          {initiative.publicName.toUpperCase()}
        </bdi>
        <span className={`mt-1 hidden text-[0.62rem] sm:block ${light ? "text-ivory/75" : "text-muted"}`}>{initiative.descriptor}</span>
      </span>
    </span>
  );
}
