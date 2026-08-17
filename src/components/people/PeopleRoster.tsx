import { PeopleGroupHeading } from "@/components/people/PeopleGroupHeading";
import { PersonTile } from "@/components/people/PersonTile";
import { PrincipalInvestigatorFeature } from "@/components/people/PrincipalInvestigatorFeature";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Container } from "@/components/ui/Container";
import {
  formatGroupCount,
  PERSON_GROUP_ORDER,
  PERSON_GROUPS,
  type GroupedPeople,
} from "@/lib/people";
import type { PersonGroup, PersonRosterEntry } from "../../../sanity/types";

type PeopleRosterProps = {
  grouped: GroupedPeople;
};

function RosterSection({
  group,
  people,
}: {
  group: PersonGroup;
  people: PersonRosterEntry[];
}) {
  const headingId = `people-${group}`;

  return (
    <section aria-labelledby={headingId} className="pt-10 sm:pt-14 lg:pt-16">
      <Container as="div" className="space-y-6 sm:space-y-10 lg:space-y-12">
        <PeopleGroupHeading
          id={headingId}
          title={PERSON_GROUPS[group].title}
          count={formatGroupCount(group, people.length)}
        />

        <Stagger
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14"
          stagger={0.05}
        >
          {people.map((person) => (
            <StaggerItem key={person._id} className="min-w-0">
              <PersonTile person={person} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function PeopleRoster({ grouped }: PeopleRosterProps) {
  const isEmpty = PERSON_GROUP_ORDER.every((group) => grouped[group].length === 0);

  if (isEmpty) {
    return (
      <section className="bg-surface-base page-content-padding">
        <Container as="div">
          <Reveal variant="fadeUpSubtle">
            <p className="text-body-sm text-text-secondary">
              No team members have been published yet.
            </p>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <div className="bg-surface-base page-content-padding">
      {grouped.pi.length > 0 ? (
        <section
          aria-label={PERSON_GROUPS.pi.title}
          className="pb-10 sm:pb-14 lg:pb-16"
        >
          <Container as="div" className="space-y-12 sm:space-y-20 lg:space-y-24">
            {grouped.pi.map((person, index) => (
              <PrincipalInvestigatorFeature
                key={person._id}
                person={person}
                priority={index === 0}
              />
            ))}
          </Container>
        </section>
      ) : null}

      {(["phd", "msc", "undergrad", "alumni"] as const).map((group) =>
        grouped[group].length > 0 ? (
          <RosterSection
            key={group}
            group={group}
            people={grouped[group]}
          />
        ) : null,
      )}
    </div>
  );
}

export default PeopleRoster;
