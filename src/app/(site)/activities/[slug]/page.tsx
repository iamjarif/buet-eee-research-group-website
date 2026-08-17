import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { getActivityBySlug, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { isValidSlug } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};

  const [settings, activity] = await Promise.all([
    getSiteSettings(),
    getActivityBySlug(slug),
  ]);

  if (!activity) return {};

  return buildMetadata({
    title: activity.title,
    seo: activity.seo,
    siteSettings: settings,
    path: `/activities/${slug}`,
    type: "article",
  });
}

export default async function ActivityPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const activity = await getActivityBySlug(slug);
  if (!activity) notFound();

  return (
    <PageShell title={activity.title} />
  );
}
