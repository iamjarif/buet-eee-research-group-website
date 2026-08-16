import { Container } from "@/components/ui/Container";
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
    <header className="border-b border-border-default bg-surface-base pt-[140px] pb-12">
      <Container as="div" className="flex flex-col gap-7">
        <Reveal immediate variant="fadeUpSubtle">
          <div className="flex items-center gap-4">
            <p className="type-overline shrink-0 text-text-secondary">{eyebrow}</p>
            <span aria-hidden className="h-px flex-1 bg-border-default" />
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

export default ContactPageHeader;
