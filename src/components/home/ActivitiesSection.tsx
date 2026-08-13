import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { formatActivityCategory, formatActivityDate } from "@/lib/format";
import { portableTextToPlainText } from "@/lib/portable-text";
import type { ActivitySummary } from "../../../sanity/types";

type ActivityFeaturedProps = {
  activity: ActivitySummary;
};

function ActivityFeatured({ activity }: ActivityFeaturedProps) {
  const description = portableTextToPlainText(activity.description);
  const href = activity.externalUrl ?? `/activities/${activity.slug}`;

  return (
    <Stagger className="max-w-[500px] space-y-4">
      <StaggerItem>
        <div className="flex flex-wrap gap-4">
          <p className="text-label-xs uppercase text-text-muted">
            {formatActivityDate(activity.date)}
          </p>
          <p className="text-label-xs uppercase text-brand-primary">
            {formatActivityCategory(activity.category)}
          </p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <h3 className="text-display-sm text-text-primary">
          <Link
            href={href}
            className="group/link inline-flex transition-[color,opacity] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            {...(activity.externalUrl
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {activity.title}
          </Link>
        </h3>
      </StaggerItem>

      {description ? (
        <StaggerItem>
          <p className="max-w-[470px] text-body-md text-text-secondary">
            {description}
          </p>
        </StaggerItem>
      ) : null}
    </Stagger>
  );
}

type ActivityListItemProps = {
  activity: ActivitySummary;
};

function ActivityListItem({ activity }: ActivityListItemProps) {
  const href = activity.externalUrl ?? `/activities/${activity.slug}`;

  return (
    <article className="group flex gap-6 border-b border-border-subtle py-5">
      <p className="w-24 shrink-0 text-label-xs uppercase text-text-muted">
        {formatActivityDate(activity.date)}
      </p>
      <div className="min-w-0 space-y-1">
        <p className="text-label-xs uppercase text-brand-primary">
          {formatActivityCategory(activity.category)}
        </p>
        <h3 className="text-heading-sm text-text-primary">
          <Link
            href={href}
            className="group/link inline-flex items-center gap-1.5 transition-[color,opacity] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            {...(activity.externalUrl
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {activity.title}
            <span
              aria-hidden
              className="inline-block translate-x-0 opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/link:translate-x-1 group-hover/link:opacity-100"
            >
              →
            </span>
          </Link>
        </h3>
      </div>
    </article>
  );
}

type ActivitiesSectionProps = {
  eyebrow?: string;
  heading?: string;
  activities?: ActivitySummary[];
};

export function ActivitiesSection({
  eyebrow = "04 / NEWS",
  heading,
  activities = [],
}: ActivitiesSectionProps) {
  if (!heading && !activities.length) return null;

  const [featured, ...rest] = activities;

  return (
    <section
      aria-labelledby="activities-heading"
      className="bg-surface-base py-20 lg:py-[120px]"
    >
      <Container as="div" className="space-y-10">
        <Stagger className="space-y-10">
          <StaggerItem>
            <Eyebrow>{eyebrow}</Eyebrow>
          </StaggerItem>
          {heading ? (
            <StaggerItem>
              <h2
                id="activities-heading"
                className="text-section-title text-text-primary"
              >
                {heading}
              </h2>
            </StaggerItem>
          ) : null}
        </Stagger>

        {activities.length > 0 ? (
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {featured ? <ActivityFeatured activity={featured} /> : null}

            {rest.length > 0 ? (
              <Stagger stagger={0.08} className="border-t border-border-subtle">
                {rest.map((activity) => (
                  <StaggerItem key={activity._id}>
                    <ActivityListItem activity={activity} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default ActivitiesSection;
