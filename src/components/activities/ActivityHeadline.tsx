import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import type { ActivitySummary } from "../../../sanity/types";

type ActivityHeadlineProps = {
  activity: ActivitySummary;
};

/**
 * The headline is the update itself, so it only becomes a link when the entry
 * points somewhere — no detail pages are generated for short updates.
 */
export function ActivityHeadline({ activity }: ActivityHeadlineProps) {
  if (!activity.externalUrl) return <>{activity.title}</>;

  return (
    <a
      href={activity.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/link transition-colors duration-300",
        hoverEaseClass,
        "hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
      )}
    >
      {activity.title}
      <span
        aria-hidden
        className={cn(
          "inline-block text-label-xs text-text-tertiary transition-[transform,color] duration-300",
          hoverEaseClass,
          "group-hover/link:translate-x-0.5 group-hover/link:text-brand-primary",
        )}
      >
        {"\u00A0\u00A0↗"}
      </span>
    </a>
  );
}

export default ActivityHeadline;
