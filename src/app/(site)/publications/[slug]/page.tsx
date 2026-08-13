import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { getPublicationBySlug, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { formatAuthorNames, isValidSlug } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};

  const [settings, publication] = await Promise.all([
    getSiteSettings(),
    getPublicationBySlug(slug),
  ]);

  if (!publication) return {};

  return buildMetadata({
    title: publication.title,
    description: `${publication.journalOrConference} (${publication.year})`,
    seo: publication.seo,
    siteSettings: settings,
    path: `/publications/${slug}`,
    type: "article",
  });
}

export default async function PublicationPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const publication = await getPublicationBySlug(slug);
  if (!publication) notFound();

  return (
    <PageShell title={publication.title}>
      <p className="text-muted">
        {formatAuthorNames(publication.authors)} · {publication.journalOrConference} ·{" "}
        {publication.year}
      </p>
    </PageShell>
  );
}
