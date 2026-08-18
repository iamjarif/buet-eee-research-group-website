import { PublicationsIndex } from "@/components/publications/PublicationsIndex";
import { PublicationsPageHeader } from "@/components/publications/PublicationsPageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublications, getSiteSettings } from "@/lib/cms";
import { buildPublicationsJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Publications",
    description:
      "Peer-reviewed journal and conference papers from NC Group at BUET on GaN devices, including IEEE EDL, TED, IEDM, and VLSI Symposium.",
    siteSettings: settings,
    path: "/publications",
  });
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="-mt-[var(--layout-header-height)] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]">
      <JsonLd data={buildPublicationsJsonLd(publications)} />
      <PublicationsPageHeader />
      <PublicationsIndex publications={publications} />
    </div>
  );
}
