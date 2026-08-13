import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { getPublications, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { formatAuthorNames } from "@/lib/utils";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Publications",
    description: "Research publications from S-DREAM, BUET.",
    siteSettings: settings,
    path: "/publications",
  });
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <PageShell
      title="Publications"
      description="Peer-reviewed research output from S-DREAM."
    >
      {publications.length > 0 ? (
        <ul className="space-y-4">
          {publications.map((publication) => (
            <li key={publication._id}>
              <Link
                href={`/publications/${publication.slug}`}
                className="font-medium underline"
              >
                {publication.title}
              </Link>
              <p className="text-sm text-muted">
                {formatAuthorNames(publication.authors)} ·{" "}
                {publication.journalOrConference} · {publication.year}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </PageShell>
  );
}
