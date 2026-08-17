import { PersonPortrait } from "@/components/people/PersonPortrait";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { TextLink } from "@/components/ui/TextLink";
import {
  formatResearchInterests,
  getPersonContactLinks,
  PERSON_GROUPS,
} from "@/lib/people";
import type { PersonRosterEntry } from "../../../sanity/types";

type PrincipalInvestigatorFeatureProps = {
  person: PersonRosterEntry;
  priority?: boolean;
};

export function PrincipalInvestigatorFeature({
  person,
  priority = false,
}: PrincipalInvestigatorFeatureProps) {
  const interests = formatResearchInterests(person.researchInterests);
  const links = getPersonContactLinks(person, { max: 4 });

  return (
    <article className="group grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-x-20 xl:gap-x-24">
      <Reveal
        variant="fade"
        className="w-full max-w-[13.5rem] sm:max-w-[19rem] lg:max-w-none"
      >
        <PersonPortrait
          name={person.name}
          image={person.photograph}
          width={760}
          priority={priority}
          sizes="(max-width: 640px) 54vw, (max-width: 1024px) 19rem, 22rem"
        />
      </Reveal>

      <Stagger className="min-w-0 space-y-5 sm:space-y-7" stagger={0.07}>
        <StaggerItem>
          <p className="type-overline text-text-secondary">{PERSON_GROUPS.pi.title}</p>
          <h2 className="mt-3 text-display-sm text-text-primary sm:mt-4 sm:text-display-md">
            {person.name}
          </h2>
          <p className="mt-2 text-body-sm text-text-secondary sm:mt-3 sm:text-body-md">
            {person.position}
          </p>
        </StaggerItem>

        {person.biography?.length ? (
          <StaggerItem>
            <PortableTextContent value={person.biography} className="max-w-[36rem]" />
          </StaggerItem>
        ) : null}

        {interests ? (
          <StaggerItem>
            <div className="max-w-[36rem] border-t border-border-default pt-5">
              <p className="type-overline text-text-tertiary">Research interests</p>
              <p className="mt-2.5 text-body-sm text-text-secondary">{interests}</p>
            </div>
          </StaggerItem>
        ) : null}

        {links.length > 0 ? (
          <StaggerItem>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-8 sm:gap-y-3">
              {links.map((link) => (
                <TextLink
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  arrow={false}
                  external={link.openInNewTab}
                >
                  {link.label}
                </TextLink>
              ))}
            </div>
          </StaggerItem>
        ) : null}
      </Stagger>
    </article>
  );
}

export default PrincipalInvestigatorFeature;
