import {
  PublicationCardMotion,
  PublicationImageMotion,
} from "@/components/motion/PublicationCardMotion";
import { SanityImage } from "@/components/ui/SanityImage";
import { getPublicationExternalUrl, getPublicationHighlightTitle } from "@/lib/publications";
import { cn } from "@/lib/utils";
import type { PublicationSummary } from "../../../sanity/types";

type PublicationCardProps = {
  publication: PublicationSummary;
};

export function PublicationCard({ publication }: PublicationCardProps) {
  const externalUrl = getPublicationExternalUrl(publication);
  const highlightTitle = getPublicationHighlightTitle(publication);

  const body = (
    <>
      <PublicationImageMotion className="h-40 w-full bg-surface-subtle">
        {publication.image ? (
          <SanityImage
            image={publication.image}
            alt={publication.image.alt ?? highlightTitle}
            width={640}
            height={320}
            className="h-full w-full object-cover"
            sizes="320px"
          />
        ) : null}
      </PublicationImageMotion>

      <div className="flex min-h-[8.5rem] flex-1 flex-col justify-between gap-4 px-5 py-4">
        <h3 className="line-clamp-3 text-[1.125rem] leading-6 font-medium text-pretty text-text-primary [overflow-wrap:break-word]">
          {highlightTitle}
        </h3>

        <p className="text-caption text-text-tertiary">
          <span className="text-text-secondary">{publication.journalOrConference}</span>
          {publication.year ? ` · ${publication.year}` : null}
        </p>
      </div>
    </>
  );

  return (
    <PublicationCardMotion className="flex w-[min(300px,calc(100vw-2.5rem))] shrink-0 flex-col overflow-hidden border border-border-default bg-surface-base sm:w-[320px]">
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex h-full flex-col outline-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
          )}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </PublicationCardMotion>
  );
}

export default PublicationCard;
