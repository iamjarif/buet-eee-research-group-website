import { ActivitiesIndex } from "@/components/activities/ActivitiesIndex";
import { ActivitiesPageHeader } from "@/components/activities/ActivitiesPageHeader";
import { formatActivityArchiveStat } from "@/lib/activities";
import { getActivities, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "News & Activities",
    description:
      "News from NC Group at BUET: publications, conference talks, awards, and student achievements in semiconductor device research.",
    siteSettings: settings,
    path: "/activities",
  });
}

export default async function ActivitiesPage() {
  const activities = await getActivities();
  const stats = formatActivityArchiveStat(activities);

  return (
    <div className="-mt-[var(--layout-header-height)] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]">
      <ActivitiesPageHeader stats={stats || undefined} />
      <ActivitiesIndex activities={activities} />
    </div>
  );
}
