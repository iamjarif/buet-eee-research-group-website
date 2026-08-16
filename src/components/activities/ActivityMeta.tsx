import { formatActivityCategoryLabel, formatActivityFullDate } from "@/lib/activities";
import { cn } from "@/lib/utils";
import type { ActivitySummary } from "../../../sanity/types";

type ActivityMetaProps = {
  activity: ActivitySummary;
  className?: string;
};

/** Full date and category above the headline. */
export function ActivityMeta({ activity, className }: ActivityMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-3.5 gap-y-1", className)}>
      <time dateTime={activity.date} className="text-label-xs text-text-tertiary">
        {formatActivityFullDate(activity.date)}
      </time>
      <p className="type-overline text-brand-primary">
        {formatActivityCategoryLabel(activity.category)}
      </p>
    </div>
  );
}

export default ActivityMeta;
