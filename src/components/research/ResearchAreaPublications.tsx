import { TextLink } from "@/components/ui/TextLink";
import { hoverEaseClass } from "@/lib/motion/transitions";
import {
  getPublicationExternalUrl,
  getPublicationHighlightTitle,
  getPublicationsPath,
} from "@/lib/publications";
import { cn } from "@/lib/utils";
import type { PublicationSummary } from "../../../sanity/types";

type ResearchAreaPublicationsProps = {
  publications: PublicationSummary[];
  totalCount: number;
  researchAreaSlug: string;
};

const linkClassName = cn(
  "transition-colors duration-300",
  hoverEaseClass,
  "hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

/** The work an area has produced, as a short bibliographic record. */
export function ResearchAreaPublications({
  publications,
  totalCount,
  researchAreaSlug,
}: ResearchAreaPublicationsProps) {
  if (publications.length === 0) return null;

  return (
    <div className="max-w-[34rem]">
      <div>
        {publications.map((publication) => {
          const externalUrl = getPublicationExternalUrl(publication);
          const highlightTitle = getPublicationHighlightTitle(publication);
          const showPublicationTitle = publication.title.trim() !== highlightTitle;

          return (
            <article
              key={publication._id}
              className="border-b border-border-default py-4"
            >
              <h3 className="text-heading-sm text-text-primary">
                {externalUrl ? (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {highlightTitle}
                  </a>
                ) : (
                  highlightTitle
                )}
              </h3>
              {showPublicationTitle ? (
                <p className="mt-1 text-body-sm text-text-secondary">{publication.title}</p>
              ) : null}
              <p className="mt-1.5 text-caption uppercase text-text-tertiary">
                {publication.journalOrConference}
              </p>
            </article>
          );
        })}
      </div>

      {totalCount > publications.length ? (
        <TextLink href={getPublicationsPath(researchAreaSlug)} className="mt-5">
          All publications
        </TextLink>
      ) : null}
    </div>
  );
}

export default ResearchAreaPublications;
