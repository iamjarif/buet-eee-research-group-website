import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  HeroGridMotion,
  HeroMotion,
  HeroMotionItem,
} from "@/components/motion/HeroMotion";
import { TextReveal } from "@/components/motion/TextReveal";
import type { Link } from "../../../sanity/types";

type HeroSectionProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  buttons?: Link[];
};

export function HeroSection({
  eyebrow,
  heading,
  description,
  buttons = [],
}: HeroSectionProps) {
  if (!heading) return null;

  const secondaryButton = buttons[0];
  const primaryButton = buttons[1];

  return (
    <section
      aria-labelledby="hero-heading"
      data-hero-section
      className="relative -mt-[var(--layout-header-height)] overflow-hidden bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]"
    >
      <HeroGridMotion
        className="pointer-events-none absolute inset-0 bg-[length:200px_200px] bg-top-left opacity-[0.03]"
        style={{ backgroundImage: "url('/images/hero-grid.png')" }}
      />

      <Container
        as="div"
        className="relative flex min-h-[min(640px,85vh)] flex-col justify-center py-16 sm:min-h-[min(760px,88vh)] sm:py-20 lg:min-h-[min(860px,90vh)] lg:py-[120px]"
      >
        <HeroMotion className="flex max-w-full flex-col gap-[var(--spacing-content-gap)]">
          {eyebrow ? (
            <HeroMotionItem>
              <Eyebrow>{eyebrow}</Eyebrow>
            </HeroMotionItem>
          ) : null}

          <TextReveal
            id="hero-heading"
            text={heading}
            as="h1"
            className="text-display-xl text-text-primary"
            immediate
          />

          {description ? (
            <HeroMotionItem>
              <p className="max-w-[620px] text-body-xs text-text-secondary sm:text-body-lg">
                {description}
              </p>
            </HeroMotionItem>
          ) : null}

          {buttons.length > 0 ? (
            <HeroMotionItem>
              <div className="flex flex-wrap items-center gap-[var(--spacing-button-gap)]">
                {secondaryButton ? (
                  <LinkButton
                    href={secondaryButton.href}
                    variant="secondary"
                    external={secondaryButton.openInNewTab}
                  >
                    {secondaryButton.label}
                  </LinkButton>
                ) : null}
                {primaryButton ? (
                  <LinkButton
                    href={primaryButton.href}
                    external={primaryButton.openInNewTab}
                  >
                    {primaryButton.label}
                    {!primaryButton.label.includes("→") ? " →" : ""}
                  </LinkButton>
                ) : null}
              </div>
            </HeroMotionItem>
          ) : null}
        </HeroMotion>
      </Container>
    </section>
  );
}

export default HeroSection;
