import { PeopleGroupHeading } from "@/components/people/PeopleGroupHeading";
import { PersonListRow } from "@/components/people/PersonListRow";
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

/** Small cohorts read better as rows; larger ones as a portrait grid. */
const GROUP_LAYOUTS: Record<"phd" | "msc" | "undergrad" | "alumni", "rows" | "grid"> =
  {
    phd: "rows",
    msc: "grid",
    undergrad: "grid",
    alumni: "grid",
  };

function RosterSection({
  group,
  people,
  layout,
}: {
  group: PersonGroup;
  people: PersonRosterEntry[];
  layout: "rows" | "grid";
}) {
  const headingId = `people-${group}`;

  return (
    <section aria-labelledby={headingId} className="bg-surface-base py-14 lg:py-16">
      <Container as="div" className="space-y-10 lg:space-y-12">
        <PeopleGroupHeading
          id={headingId}
          title={PERSON_GROUPS[group].title}
          count={formatGroupCount(group, people.length)}
        />

        {layout === "rows" ? (
          <Stagger stagger={0.06}>
            {people.map((person) => (
              <StaggerItem key={person._id}>
                <PersonListRow person={person} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Stagger
            className="grid gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14"
            stagger={0.05}
          >
            {people.map((person) => (
              <StaggerItem key={person._id}>
                <PersonTile person={person} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Container>
    </section>
  );
}

export function PeopleRoster({ grouped }: PeopleRosterProps) {
  const isEmpty = PERSON_GROUP_ORDER.every((group) => grouped[group].length === 0);

  if (isEmpty) {
    return (
      <section className="bg-surface-base pb-[120px] pt-10">
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
    <>
      {grouped.pi.length > 0 ? (
        <section
          aria-label={PERSON_GROUPS.pi.title}
          className="bg-surface-base pt-14 pb-14 lg:pt-16 lg:pb-16"
        >
          <Container as="div" className="space-y-20 lg:space-y-24">
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
            layout={GROUP_LAYOUTS[group]}
          />
        ) : null,
      )}
    </>
  );
}

export default PeopleRoster;
