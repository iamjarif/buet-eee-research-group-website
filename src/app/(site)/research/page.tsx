import { ResearchAreas } from "@/components/research/ResearchAreas";
import { ResearchPageHeader } from "@/components/research/ResearchPageHeader";
import { getResearchAreas, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { formatResearchStats } from "@/lib/research";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Research",
    description:
      "Wide-bandgap semiconductor research at NC Group, BUET: GaN RF and power devices, device physics, compact modeling, and TCAD simulation.",
    siteSettings: settings,
    path: "/research",
  });
}

export default async function ResearchPage() {
  const areas = await getResearchAreas();

  return (
    <div className="-mt-[var(--layout-header-height)] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]">
      <ResearchPageHeader stats={formatResearchStats(areas.length) || undefined} />
      <ResearchAreas areas={areas} />
    </div>
  );
}
