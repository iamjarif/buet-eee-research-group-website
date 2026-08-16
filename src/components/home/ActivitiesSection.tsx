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
        <h3 className="text-display-sm text-text-primary">{activity.title}</h3>
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
  return (
    <article className="flex gap-6 border-b border-border-subtle py-5">
      <p className="w-24 shrink-0 text-label-xs uppercase text-text-muted">
        {formatActivityDate(activity.date)}
      </p>
      <div className="min-w-0 space-y-1">
        <p className="text-label-xs uppercase text-brand-primary">
          {formatActivityCategory(activity.category)}
        </p>
        <h3 className="text-heading-sm text-text-primary">{activity.title}</h3>
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
