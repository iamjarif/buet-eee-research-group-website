import { ActivityHeadline } from "@/components/activities/ActivityHeadline";
import { ActivityMeta } from "@/components/activities/ActivityMeta";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { cn } from "@/lib/utils";
import type { ActivitySummary } from "../../../sanity/types";

type ActivityEntryProps = {
  activity: ActivitySummary;
  /**
   * Reserves the image column for the whole list so figures align on a single
   * edge. Omitted when no entry in view has an image.
   */
  withFigureColumn?: boolean;
  priority?: boolean;
};

export function ActivityEntry({
  activity,
  withFigureColumn = false,
  priority = false,
}: ActivityEntryProps) {
  return (
    <article
      className={cn(
        "grid items-start gap-5 border-b border-border-default py-7 sm:gap-8 sm:py-10 lg:gap-x-12 lg:py-14 xl:gap-x-16",
        withFigureColumn && "lg:grid-cols-[minmax(0,1fr)_22rem]",
      )}
    >
      <div className="flex flex-col gap-3 sm:gap-5">
        <ActivityMeta activity={activity} />

        <h3 className="max-w-[45rem] text-heading-md text-text-primary">
          <ActivityHeadline activity={activity} />
        </h3>

        <PortableTextContent value={activity.description} className="max-w-[38rem]" />
      </div>

      <MediaFrame
        image={activity.image}
        width={800}
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 26rem, 22rem"
        priority={priority}
        className="max-w-[26rem] lg:col-start-2 lg:max-w-none"
      />
    </article>
  );
}

export default ActivityEntry;
