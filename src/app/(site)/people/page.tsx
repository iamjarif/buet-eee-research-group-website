import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { getPeople, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "People",
    description: "Faculty, researchers, and students at S-DREAM, BUET.",
    siteSettings: settings,
    path: "/people",
  });
}

export default async function PeoplePage() {
  const people = await getPeople();

  return (
    <PageShell title="People" description="Meet the S-DREAM research team.">
      {people.length > 0 ? (
        <ul className="space-y-2">
          {people.map((person) => (
            <li key={person._id}>
              <Link href={`/people/${person.slug}`} className="underline">
                {person.name}
              </Link>
              <span className="text-sm text-muted"> — {person.position}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </PageShell>
  );
}
