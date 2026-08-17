import { Container } from "@/components/ui/Container";
import {
  PageHeaderSurface,
  pageHeaderTitleClassName,
} from "@/components/ui/PageHeaderSurface";
import { PageHeaderMeta } from "@/components/ui/PageHeaderMeta";
import { Reveal } from "@/components/motion/Reveal";

type PeoplePageHeaderProps = {
  eyebrow?: string;
  stats?: string;
  heading?: string;
};

export function PeoplePageHeader({
  eyebrow = "People",
  stats,
  heading = "The people behind the work.",
}: PeoplePageHeaderProps) {
  return (
    <PageHeaderSurface>
      <Container as="div" className="flex flex-col gap-4 sm:gap-7">
        <Reveal immediate variant="fadeUpSubtle">
          <PageHeaderMeta eyebrow={eyebrow} stats={stats} />
        </Reveal>

        <Reveal immediate variant="fadeUpSubtle" delay={0.08}>
          <h1 className={pageHeaderTitleClassName}>{heading}</h1>
        </Reveal>
      </Container>
    </PageHeaderSurface>
  );
}

export default PeoplePageHeader;
