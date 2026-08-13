import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import {
  ResearchRowMotion,
  ResearchTitleMotion,
} from "@/components/motion/ResearchRowMotion";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { formatSectionIndex } from "@/lib/format";
import { portableTextToPlainText } from "@/lib/portable-text";
import type { ResearchAreaSummary } from "../../../sanity/types";

type ResearchRowProps = {
  area: ResearchAreaSummary;
  index: number;
  isLast?: boolean;
};

function ResearchRow({ area, index, isLast = false }: ResearchRowProps) {
  const description = portableTextToPlainText(area.description);
  const href = area.externalLink ?? `/research/${area.slug}`;

  return (
    <ResearchRowMotion isLast={isLast}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-14">
        <p className="text-label-sm text-text-tertiary">{formatSectionIndex(index)}</p>
        <div className="max-w-[700px] space-y-2">
          <h3 className="text-heading-lg text-text-primary">
            <Link
              href={href}
              className="group/link inline-flex transition-[color,opacity] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              {...(area.externalLink
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <ResearchTitleMotion>{area.title}</ResearchTitleMotion>
            </Link>
          </h3>
          {description ? (
            <p className="max-w-[620px] text-body-sm text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <TextLink href={href} external={Boolean(area.externalLink)} arrow>
        Explore
      </TextLink>
    </ResearchRowMotion>
  );
}

type ResearchSectionProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  areas?: ResearchAreaSummary[];
};

export function ResearchSection({
  eyebrow = "01 / RESEARCH",
  heading,
  description,
  areas = [],
}: ResearchSectionProps) {
  if (!heading && !areas.length) return null;

  return (
    <section
      aria-labelledby="research-heading"
      className="bg-surface-base py-20 lg:py-[120px]"
    >
      <Container as="div" className="flex flex-col gap-10 lg:gap-14">
        <Stagger className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[620px] space-y-6">
            <StaggerItem>
              <Eyebrow>{eyebrow}</Eyebrow>
            </StaggerItem>
            {heading ? (
              <StaggerItem>
                <h2
                  id="research-heading"
                  className="text-section-title text-text-primary"
                >
                  {heading}
                </h2>
              </StaggerItem>
            ) : null}
            {description ? (
              <StaggerItem>
                <p className="max-w-[460px] text-body-md text-text-secondary">
                  {description}
                </p>
              </StaggerItem>
            ) : null}
          </div>

          <StaggerItem>
            <TextLink href="/research" className="shrink-0">
              Explore all research
            </TextLink>
          </StaggerItem>
        </Stagger>

        {areas.length > 0 ? (
          <div>
            {areas.map((area, index) => (
              <ResearchRow
                key={area._id}
                area={area}
                index={index + 1}
                isLast={index === areas.length - 1}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default ResearchSection;
