import { ActivitiesIndex } from "@/components/activities/ActivitiesIndex";
import { ActivitiesPageHeader } from "@/components/activities/ActivitiesPageHeader";
import { formatActivityArchiveStat } from "@/lib/activities";
import { getActivities, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "News",
    description:
      "Publications, conference participation, talks, and student achievements from NC Group, BUET.",
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
