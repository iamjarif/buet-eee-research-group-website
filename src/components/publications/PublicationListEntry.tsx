import { getPublicationExternalUrl } from "@/lib/publications";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn, formatPublicationAuthors } from "@/lib/utils";
import type { PublicationSummary } from "../../../sanity/types";

type PublicationListEntryProps = {
  publication: PublicationSummary;
};

const linkClassName = cn(
  "transition-[color,opacity] duration-300",
  hoverEaseClass,
  "hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

export function PublicationListEntry({ publication }: PublicationListEntryProps) {
  const externalUrl = getPublicationExternalUrl(publication);
  const authors = formatPublicationAuthors(publication);

  return (
    <article className="flex flex-col gap-4 border-b border-border-default py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:py-7">
      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:gap-8 lg:gap-12">
        <p className="shrink-0 text-label-xs text-text-tertiary sm:py-3.5">
          {publication.categoryLabel}
        </p>

        <div className="min-w-0 space-y-2">
          <h3 className="text-heading-lg text-text-primary">
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                {publication.title}
              </a>
            ) : (
              publication.title
            )}
          </h3>

          {authors ? (
            <p className="text-body-sm text-text-secondary">{authors}</p>
          ) : null}

          <p className="text-caption uppercase text-text-tertiary">
            {publication.journalOrConference}
          </p>
        </div>
      </div>

      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${publication.title}`}
          className={cn(
            "shrink-0 self-start text-label-xs text-text-tertiary sm:self-auto sm:pt-3.5",
            linkClassName,
          )}
        >
          ↗
        </a>
      ) : null}
    </article>
  );
}

export default PublicationListEntry;
