import { Container } from "@/components/ui/Container";
import { PageHeaderMeta } from "@/components/ui/PageHeaderMeta";
import { Reveal } from "@/components/motion/Reveal";

type ContactPageHeaderProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
};

export function ContactPageHeader({
  eyebrow = "Contact",
  heading = "Get in touch.",
  description,
}: ContactPageHeaderProps) {
  return (
    <header className="page-header-padding border-b border-border-default bg-surface-base pb-10 sm:pb-12">
      <Container as="div" className="flex flex-col gap-6 sm:gap-7">
        <Reveal immediate variant="fadeUpSubtle">
          <PageHeaderMeta eyebrow={eyebrow} />
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

export default ContactPageHeader;
