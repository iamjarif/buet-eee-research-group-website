import { Container } from "@/components/ui/Container";
import { PageHeaderMeta } from "@/components/ui/PageHeaderMeta";
import { Reveal } from "@/components/motion/Reveal";

type ActivitiesPageHeaderProps = {
  eyebrow?: string;
  stats?: string;
  heading?: string;
  description?: string;
};

export function ActivitiesPageHeader({
  eyebrow = "News",
  stats,
  heading = "A record of the work.",
  description = "Publications, conference participation, talks, and student achievements — the group's activity as it happens, newest first.",
}: ActivitiesPageHeaderProps) {
  return (
    <header className="page-header-padding bg-surface-base pb-8">
      <Container as="div" className="flex flex-col gap-4 sm:gap-7">
        <Reveal immediate variant="fadeUpSubtle">
          <PageHeaderMeta eyebrow={eyebrow} stats={stats} />
        </Reveal>

        <Reveal immediate variant="fadeUpSubtle" delay={0.08}>
          <h1 className="max-w-[760px] text-display-lg text-text-primary">{heading}</h1>
        </Reveal>

        {description ? (
          <Reveal immediate variant="fadeUpSubtle" delay={0.14}>
            <p className="max-w-[620px] text-body-md text-text-secondary">
              {description}
            </p>
          </Reveal>
        ) : null}
      </Container>
    </header>
  );
}

export default ActivitiesPageHeader;
