import { PersonLinks } from "@/components/people/PersonLinks";
import { PersonPortrait } from "@/components/people/PersonPortrait";
import { formatResearchInterests, getPersonContactLinks } from "@/lib/people";
import type { PersonRosterEntry } from "../../../sanity/types";

type PersonListRowProps = {
  person: PersonRosterEntry;
};

/**
 * Row treatment used for the smallest cohorts, where a grid would read as a
 * handful of stranded tiles.
 */
export function PersonListRow({ person }: PersonListRowProps) {
  const interests = formatResearchInterests(person.researchInterests);
  const links = getPersonContactLinks(person);

  return (
    <article className="group flex items-start gap-6 border-b border-border-default py-8 sm:gap-10">
      <PersonPortrait
        name={person.name}
        image={person.photograph}
        width={320}
        className="w-[88px] shrink-0 sm:w-[128px]"
        sizes="(max-width: 640px) 88px, 128px"
      />

      <div className="min-w-0 flex-1 space-y-2.5 sm:pt-1">
        <h3 className="text-heading-lg text-text-primary">{person.name}</h3>
        <p className="text-body-sm text-text-secondary">{person.position}</p>

        {interests ? (
          <p className="text-caption uppercase text-text-tertiary">{interests}</p>
        ) : null}

        <PersonLinks links={links} personName={person.name} className="pt-1.5" />
      </div>
    </article>
  );
}

export default PersonListRow;
