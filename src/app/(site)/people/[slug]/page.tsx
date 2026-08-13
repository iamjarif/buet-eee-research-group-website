import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { getPersonBySlug, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { isValidSlug } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};

  const [settings, person] = await Promise.all([
    getSiteSettings(),
    getPersonBySlug(slug),
  ]);

  if (!person) return {};

  return buildMetadata({
    title: person.name,
    description: person.position,
    seo: person.seo,
    siteSettings: settings,
    path: `/people/${slug}`,
    type: "profile",
  });
}

export default async function PersonPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const person = await getPersonBySlug(slug);
  if (!person) notFound();

  return (
    <PageShell title={person.name} description={person.position}>
      <p className="text-sm text-muted">
        Person profile content will be implemented in the next development phase.
      </p>
    </PageShell>
  );
}
