import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

type PeoplePageHeaderProps = {
  eyebrow?: string;
  stats?: string;
  heading?: string;
  description?: string;
};

export function PeoplePageHeader({
  eyebrow = "People",
  stats,
  heading = "The people behind the work.",
  description = "NC Group brings together faculty, graduate, and undergraduate researchers working across semiconductor device physics, compact modeling, and simulation at BUET.",
}: PeoplePageHeaderProps) {
  return (
    <header className="bg-surface-base pt-[140px] pb-8">
      <Container as="div" className="flex flex-col gap-7">
        <Reveal immediate variant="fadeUpSubtle">
          <div className="flex items-center gap-4">
            <p className="type-overline shrink-0 text-text-secondary">{eyebrow}</p>
            <span aria-hidden className="h-px flex-1 bg-border-default" />
            {stats ? (
              <p className="type-overline shrink-0 text-text-tertiary">{stats}</p>
            ) : null}
          </div>
        </Reveal>

        <Reveal immediate variant="fadeUpSubtle" delay={0.08}>
          <h1 className="max-w-[760px] text-display-lg text-text-primary">{heading}</h1>
        </Reveal>

        {description ? (
          <Reveal immediate variant="fadeUpSubtle" delay={0.14}>
            <p className="max-w-[660px] text-body-md text-text-secondary">
              {description}
            </p>
          </Reveal>
        ) : null}
      </Container>
    </header>
  );
}

export default PeoplePageHeader;
