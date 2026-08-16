import { PatentsCatalog } from "@/components/patents/PatentsCatalog";
import { PatentsPageHeader } from "@/components/patents/PatentsPageHeader";
import { getPatents, getSiteSettings } from "@/lib/cms";
import { formatPatentStats, partitionPatents } from "@/lib/patents";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Patents",
    description:
      "Granted patents and pending applications from NC Group, BUET.",
    siteSettings: settings,
    path: "/patents",
  });
}

export default async function PatentsPage() {
  const patents = await getPatents();
  const { granted, pending } = partitionPatents(patents);

  return (
    <div className="-mt-[var(--layout-header-height)] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]">
      <PatentsPageHeader
        stats={formatPatentStats(granted.length, pending.length)}
      />
      <PatentsCatalog patents={patents} />
    </div>
  );
}
