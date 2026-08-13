import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { getResearchAreas, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Research Areas",
    description: "Research areas at S-DREAM, BUET.",
    siteSettings: settings,
    path: "/research",
  });
}

export default async function ResearchPage() {
  const areas = await getResearchAreas();

  return (
    <PageShell
      title="Research Areas"
      description="Wide-bandgap semiconductor device research at S-DREAM."
    >
      {areas.length > 0 ? (
        <ul className="space-y-2">
          {areas.map((area) => (
            <li key={area._id}>
              <Link href={`/research/${area.slug}`} className="underline">
                {area.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </PageShell>
  );
}
