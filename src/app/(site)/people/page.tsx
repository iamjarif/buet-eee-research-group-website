import { PeoplePageHeader } from "@/components/people/PeoplePageHeader";
import { PeopleRoster } from "@/components/people/PeopleRoster";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPeople, getSiteSettings } from "@/lib/cms";
import { buildPersonJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/metadata";
import { countCurrentMembers, formatPeopleStats, groupPeople } from "@/lib/people";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "People",
    description:
      "Meet Prof. Nadim Chowdhury and the NC Group researchers at BUET working on Gallium Nitride devices, power electronics, and RF systems.",
    siteSettings: settings,
    path: "/people",
  });
}

export default async function PeoplePage() {
  const people = await getPeople();
  const grouped = groupPeople(people);
  const hasMembers = countCurrentMembers(grouped) + grouped.alumni.length > 0;

  const pi = grouped.pi[0];

  return (
    <div className="-mt-[var(--layout-header-height)] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]">
      {pi ? <JsonLd data={buildPersonJsonLd(pi)} /> : null}
      <PeoplePageHeader stats={hasMembers ? formatPeopleStats(grouped) : undefined} />
      <PeopleRoster grouped={grouped} />
    </div>
  );
}
