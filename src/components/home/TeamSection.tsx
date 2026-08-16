import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SanityImage } from "@/components/ui/SanityImage";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { Link, SanityImage as SanityImageType } from "../../../sanity/types";

type TeamSectionProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  image?: SanityImageType;
  link?: Link;
};

export function TeamSection({
  eyebrow = "02 / OUR TEAM",
  heading,
  description,
  image,
  link,
}: TeamSectionProps) {
  if (!heading && !description && !image) return null;

  const teamHref = link?.href ?? "/people";
  const teamLabel = link?.label ?? "Meet the whole team";

  return (
    <section
      aria-labelledby="team-heading"
      className="section-padding-y bg-surface-subtle"
    >
      <Container as="div">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="fade" className="w-full lg:max-w-[560px]">
            <div className="relative aspect-[4/3] w-full border border-border-default bg-white lg:aspect-auto lg:h-[420px]">
              {image ? (
                <SanityImage
                  image={image}
                  alt={image.alt ?? "NC Group research team"}
                  width={1120}
                  fit="max"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex h-full w-full items-center justify-center bg-white text-body-sm text-text-tertiary"
                >
                  Team photo
                </div>
              )}
            </div>
          </Reveal>

          <Stagger className="min-w-0 max-w-[440px] space-y-6">
            <StaggerItem>
              <Eyebrow>{eyebrow}</Eyebrow>
            </StaggerItem>
            {heading ? (
              <StaggerItem>
                <h2 id="team-heading" className="text-section-title text-text-primary">
                  {heading}
                </h2>
              </StaggerItem>
            ) : null}
            {description ? (
              <StaggerItem>
                <p className="text-body-base text-text-secondary">{description}</p>
              </StaggerItem>
            ) : null}
            <StaggerItem>
              <TextLink href={teamHref} external={link?.openInNewTab}>
                {teamLabel}
              </TextLink>
            </StaggerItem>
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

export default TeamSection;
