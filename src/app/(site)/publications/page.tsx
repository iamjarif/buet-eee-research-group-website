import { PublicationsIndex } from "@/components/publications/PublicationsIndex";
import { PublicationsPageHeader } from "@/components/publications/PublicationsPageHeader";
import { getPublications, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Publications",
    description:
      "Peer-reviewed journal articles and conference proceedings from NC Group, BUET.",
    siteSettings: settings,
    path: "/publications",
  });
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="-mt-[var(--layout-header-height)] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]">
      <PublicationsPageHeader />
      <PublicationsIndex publications={publications} />
    </div>
  );
}
