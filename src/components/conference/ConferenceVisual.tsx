import Image from "next/image";
import type { Conference } from "@/content/types";
import { BrandMark } from "@/components/brand/BrandMark";
import { StarPattern } from "@/components/motif/StarPattern";

/**
 * Conference visual. Uses `coverImage` when provided (e.g. an official
 * conference logo/cover). The project has no official conference logo yet,
 * so the official Sedes Scholarium logo (variation for navy backgrounds) sits
 * in the centre, with the identity's star pattern — name and date kept.
 */
export function ConferenceVisual({ conference, className = "" }: { conference: Conference; className?: string }) {
  if (conference.coverImage) {
    return (
      <div className={`relative overflow-hidden bg-deep ${className}`}>
        <Image src={conference.coverImage} alt="" fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
      </div>
    );
  }
  return (
    <div className={`on-dark relative flex flex-col overflow-hidden bg-deep ${className}`} aria-hidden="true">
      <StarPattern tone="dark" className="absolute inset-0 h-full w-full" />
      <span className="relative px-6 pt-6 text-xs font-semibold tracking-wide text-sand">{conference.organizer}</span>
      <div className="relative flex flex-1 items-center justify-center px-8 py-6">
        <BrandMark tone="light" variant="full" className="h-auto w-36 sm:w-40 md:w-44" />
      </div>
      <div className="relative px-6 pb-6">
        <p className="font-display text-xl leading-snug font-bold text-ivory md:text-2xl">{conference.shortTitle}</p>
        <p className="mt-1 text-sm text-ivory/75">{conference.dateLabel}</p>
      </div>
    </div>
  );
}
