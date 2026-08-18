import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { getResearchAreaBySlug, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { isValidSlug } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};

  const [settings, area] = await Promise.all([
    getSiteSettings(),
    getResearchAreaBySlug(slug),
  ]);

  if (!area) return {};

  return buildMetadata({
    title: area.title,
    seo: area.seo,
    siteSettings: settings,
    path: "/research",
    index: false,
  });
}

export default async function ResearchAreaPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const area = await getResearchAreaBySlug(slug);
  if (!area) notFound();

  return (
    <PageShell title={area.title} />
  );
}
