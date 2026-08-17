import { Container } from "@/components/ui/Container";
import {
  PageHeaderSurface,
  pageHeaderTitleClassName,
} from "@/components/ui/PageHeaderSurface";
import { PageHeaderMeta } from "@/components/ui/PageHeaderMeta";
import { Reveal } from "@/components/motion/Reveal";

type PublicationsPageHeaderProps = {
  eyebrow?: string;
  heading?: string;
};

export function PublicationsPageHeader({
  eyebrow = "Publications",
  heading = "A publication index.",
}: PublicationsPageHeaderProps) {
  return (
    <PageHeaderSurface className="border-b border-white/10">
      <Container as="div" className="flex flex-col gap-6 sm:gap-7">
        <Reveal immediate variant="fadeUpSubtle">
          <PageHeaderMeta eyebrow={eyebrow} />
        </Reveal>

        <Reveal immediate variant="fadeUpSubtle" delay={0.08}>
          <h1 className={pageHeaderTitleClassName}>{heading}</h1>
        </Reveal>
      </Container>
    </PageHeaderSurface>
  );
}

export default PublicationsPageHeader;
