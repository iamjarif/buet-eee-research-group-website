import {
  PublicationCardMotion,
  PublicationImageMotion,
} from "@/components/motion/PublicationCardMotion";
import { SanityImage } from "@/components/ui/SanityImage";
import { getPublicationExternalUrl } from "@/lib/publications";
import type { PublicationSummary } from "../../../sanity/types";

type PublicationCardProps = {
  publication: PublicationSummary;
};

export function PublicationCard({ publication }: PublicationCardProps) {
  const externalUrl = getPublicationExternalUrl(publication);

  return (
    <PublicationCardMotion className="flex w-[min(280px,calc(100vw-2.5rem))] shrink-0 flex-col border border-border-default bg-surface-base sm:w-[min(340px,calc(100vw-4rem))]">
      {publication.image ? (
        <PublicationImageMotion className="h-24 w-full">
          <SanityImage
            image={publication.image}
            alt={publication.image.alt ?? publication.title}
            width={340}
            height={96}
            className="h-24 w-full object-cover"
            sizes="340px"
          />
        </PublicationImageMotion>
      ) : (
        <div aria-hidden className="h-24 w-full bg-surface-subtle" />
      )}

      <div className="flex flex-col gap-3.5 px-[18px] pb-[17px] pt-[15px]">
        <h3 className="text-heading-sm text-text-primary">
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {publication.title}
            </a>
          ) : (
            publication.title
          )}
        </h3>

        <div className="flex items-start justify-between gap-3 text-caption">
          <p className="min-w-0 text-text-secondary">
            {publication.journalOrConference}
          </p>
          <p className="shrink-0 text-text-tertiary">{publication.year}</p>
        </div>
      </div>
    </PublicationCardMotion>
  );
}

export default PublicationCard;
