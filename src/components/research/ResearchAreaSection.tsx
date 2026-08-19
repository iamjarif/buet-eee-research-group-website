import { ResearchAreaPublications } from "@/components/research/ResearchAreaPublications";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { TextLink } from "@/components/ui/TextLink";
import { formatSectionIndex } from "@/lib/format";
import { formatExternalHost, formatResearchOutput } from "@/lib/research";
import type { ResearchAreaEntry } from "../../../sanity/types";

type ResearchAreaSectionProps = {
  area: ResearchAreaEntry;
  index: number;
  priority?: boolean;
};

/**
 * Each area reads as a chapter: a numbered rule carrying its published output,
 * then the title paired with its own account of the work.
 */
export function ResearchAreaSection({
  area,
  index,
  priority = false,
}: ResearchAreaSectionProps) {
  const headingId = `research-area-${area.slug}`;
  const output = formatResearchOutput(area);

  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="type-overline shrink-0 text-text-tertiary">
          {formatSectionIndex(index)}
        </p>
        <span aria-hidden className="h-px min-w-[1.5rem] flex-1 basis-12 bg-border-default" />
        {output ? (
          <p className="type-overline shrink-0 text-text-tertiary">{output}</p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-8 sm:mt-8 sm:gap-10 lg:mt-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-x-16">
        <div className="flex flex-col items-start gap-5">
          <h2 id={headingId} className="text-display-sm text-text-primary">
            {area.title}
          </h2>

          <PortableTextContent value={area.description} className="max-w-[28rem]" />

          {area.externalLink ? (
            <TextLink href={area.externalLink} external arrow>
              {formatExternalHost(area.externalLink)}
            </TextLink>
          ) : null}
        </div>

        <div className="flex flex-col gap-8">
          <MediaFrame
            image={area.image}
            width={1000}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 34rem"
            priority={priority}
            className="w-full max-w-[34rem] lg:max-w-none"
          />

          <ResearchAreaPublications
            publications={area.selectedPublications ?? []}
            totalCount={area.publicationCount ?? 0}
            researchAreaSlug={area.slug}
          />
        </div>
      </div>
    </section>
  );
}

export default ResearchAreaSection;
