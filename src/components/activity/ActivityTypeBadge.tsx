import { BookOpenText, Mic, PenTool, type LucideIcon } from "lucide-react";
import { variantLabel, type ActivityVariant } from "@/lib/labels";

export const variantIcon: Record<ActivityVariant, LucideIcon> = {
  keynote: Mic,
  scientific: BookOpenText,
  workshop: PenTool,
};

/**
 * Activity type is conveyed by icon + text label + shape (square vs pill),
 * never by colour alone.
 */
const styles: Record<ActivityVariant, string> = {
  keynote: "rounded-md bg-deep text-ivory",
  scientific: "rounded-md border border-teal/30 bg-teal-soft text-teal",
  workshop: "rounded-full border border-dashed border-lilac bg-sand-soft text-indigo",
};

export function ActivityTypeBadge({
  variant,
  label,
}: {
  variant: ActivityVariant;
  /** Optional program label, e.g. "الجلسة العلمية الأولى" */
  label?: string;
}) {
  const Icon = variantIcon[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${styles[variant]}`}>
      <Icon className="size-3.5" aria-hidden="true" />
      {label ?? variantLabel[variant]}
    </span>
  );
}
