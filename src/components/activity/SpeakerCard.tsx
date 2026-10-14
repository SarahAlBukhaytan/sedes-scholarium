import Image from "next/image";
import { UserRound } from "lucide-react";
import type { Speaker } from "@/content/types";
import { speakerDisplayName } from "@/lib/content";

/** Speaker / presenter. The biography renders only when approved content exists. */
export function SpeakerCard({ speaker, role }: { speaker: Speaker; role?: string }) {
  return (
    <div className="flex gap-4">
      {speaker.image ? (
        <Image src={speaker.image} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal" aria-hidden="true">
          <UserRound className="size-5" />
        </span>
      )}
      <div className="min-w-0 pt-0.5">
        <p className="font-semibold text-deep">{speakerDisplayName(speaker)}</p>
        {(role || speaker.affiliation) && (
          <p className="text-sm text-muted">{[role, speaker.affiliation].filter(Boolean).join(" · ")}</p>
        )}
        {speaker.needsVerification && (
          <p className="mt-0.5 text-xs text-muted">الاسم منقول من البرنامج المنشور، ويخضع للتحقق.</p>
        )}
        {speaker.bio && <p className="mt-2 text-sm leading-7 text-ink/80">{speaker.bio}</p>}
      </div>
    </div>
  );
}
