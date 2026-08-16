import { PersonLinks } from "@/components/people/PersonLinks";
import { PersonPortrait } from "@/components/people/PersonPortrait";
import { getAlumniDetail, getPersonContactLinks } from "@/lib/people";
import type { PersonRosterEntry } from "../../../sanity/types";

type PersonTileProps = {
  person: PersonRosterEntry;
};

export function PersonTile({ person }: PersonTileProps) {
  const links = getPersonContactLinks(person, { max: 2 });
  const subtitle =
    person.group === "alumni" ? getAlumniDetail(person) : person.position;

  return (
    <article className="group">
      <PersonPortrait
        name={person.name}
        image={person.photograph}
        width={520}
        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 16rem"
      />

      <div className="mt-5 space-y-1.5">
        <h3 className="font-serif text-[1.125rem] leading-[1.6rem] text-text-primary">
          {person.name}
        </h3>
        <p className="text-body-sm text-text-secondary">{subtitle}</p>
        <PersonLinks links={links} personName={person.name} className="pt-0.5" />
      </div>
    </article>
  );
}

export default PersonTile;
