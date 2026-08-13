import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { getActivities, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Activities",
    description: "News, events, and recent activities from S-DREAM.",
    siteSettings: settings,
    path: "/activities",
  });
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <PageShell title="Activities" description="Recent news and events from S-DREAM.">
      {activities.length > 0 ? (
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li key={activity._id}>
              <Link href={`/activities/${activity.slug}`} className="underline">
                {activity.title}
              </Link>
              <span className="text-sm text-muted"> — {activity.date}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </PageShell>
  );
}
