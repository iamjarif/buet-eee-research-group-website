import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { CountUpValue } from "@/components/motion/CountUpValue";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";
import type { Contribution } from "../../../sanity/types";

type StatCardProps = {
  contribution: Contribution;
};

function StatCard({ contribution }: StatCardProps) {
  const isLongValue = contribution.value.length > 8;
  const linkHref = contribution.link?.href;
  const linkLabel = contribution.link?.label;

  return (
    <article className="flex min-h-[251px] flex-1 flex-col justify-between border border-border-strong bg-surface-subtle p-8 [-mr-px] first:ml-0">
      <div className="space-y-5">
        <Reveal variant="fadeUpSubtle">
          <p className="type-overline text-text-secondary">
            {contribution.label.toUpperCase()}
          </p>
        </Reveal>
        <div className="space-y-2">
          <CountUpValue
            value={contribution.value}
            className={cn(
              "text-text-primary",
              isLongValue ? "text-heading-md" : "text-stat-xl",
            )}
          />
          {contribution.description ? (
            <Reveal variant="fade" delay={0.15}>
              <p className="text-body-xs text-text-secondary">
                {contribution.description}
              </p>
            </Reveal>
          ) : null}
        </div>
      </div>

      {linkHref && linkLabel ? (
        <Reveal variant="fadeUpSubtle" delay={0.2}>
          <TextLink href={linkHref} external={contribution.link?.openInNewTab}>
            {linkLabel.replace(/ →$/, "")}
          </TextLink>
        </Reveal>
      ) : null}
    </article>
  );
}

type ContributionsSectionProps = {
  eyebrow?: string;
  heading?: string;
  contributions?: Contribution[];
};

export function ContributionsSection({
  eyebrow = "03 / SELECTED CONTRIBUTIONS",
  heading,
  contributions = [],
}: ContributionsSectionProps) {
  if (!heading && !contributions.length) return null;

  return (
    <section
      aria-labelledby="contributions-heading"
      className="bg-surface-base py-20 lg:py-[120px]"
    >
      <Container as="div" className="space-y-10">
        <Stagger className="space-y-10">
          <StaggerItem>
            <Eyebrow>{eyebrow}</Eyebrow>
          </StaggerItem>
          {heading ? (
            <StaggerItem>
              <h2
                id="contributions-heading"
                className="text-section-title text-text-primary"
              >
                {heading}
              </h2>
            </StaggerItem>
          ) : null}
        </Stagger>

        {contributions.length > 0 ? (
          <Stagger stagger={0.1} className="flex flex-col lg:flex-row">
            {contributions.map((contribution) => (
              <StaggerItem key={contribution._id} className="flex flex-1">
                <StatCard contribution={contribution} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
      </Container>
    </section>
  );
}

export default ContributionsSection;
