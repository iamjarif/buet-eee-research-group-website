import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { MediaFrame } from "@/components/ui/MediaFrame";
import {
  getPublicationExternalUrl,
  getPublicationHighlightTitle,
  inferPublicationType,
} from "@/lib/publications";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn, formatPublicationAuthors, getDoiUrl } from "@/lib/utils";
import type { PublicationSummary } from "../../../sanity/types";

type PublicationListEntryProps = {
  publication: PublicationSummary;
  priority?: boolean;
};

const linkClassName = cn(
  "transition-[color,opacity] duration-300",
  hoverEaseClass,
  "hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

export function PublicationListEntry({
  publication,
  priority = false,
}: PublicationListEntryProps) {
  const externalUrl = getPublicationExternalUrl(publication);
  const highlightTitle = getPublicationHighlightTitle(publication);
  const showPublicationTitle = publication.title.trim() !== highlightTitle;
  const publicationType = inferPublicationType(publication);
  const publicationTypeLabel =
    publicationType === "conference" ? "Conference" : "Journal";
  const authors = formatPublicationAuthors(publication);
  const hasImage = Boolean(publication.image?.asset);
  const imageUrl = publication.image?.asset?.url;
  const hasDescription = Boolean(publication.description?.length);
  const doiUrl = getDoiUrl(publication.doi);
  const doiLabel = publication.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");

  const figure = hasImage ? (
    imageUrl ? (
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View image for ${highlightTitle}`}
        className={cn(
          "block w-full max-w-[22rem] transition-opacity duration-300",
          hoverEaseClass,
          "hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
        )}
      >
        <MediaFrame
          image={publication.image}
          width={800}
          sizes="(max-width: 640px) 92vw, 22rem"
          priority={priority}
          className="w-full border-0"
        />
      </a>
    ) : (
      <MediaFrame
        image={publication.image}
        width={800}
        sizes="(max-width: 640px) 92vw, 22rem"
        priority={priority}
        className="w-full max-w-[22rem] border-0"
      />
    )
  ) : null;

  return (
    <article className="border-b border-border-default py-8 sm:py-9 lg:py-10">
      <div
        className={cn(
          "flex flex-col gap-6",
          hasImage && "lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-x-14",
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              <p className="text-label-xs tracking-[0.06em] text-text-tertiary uppercase">
                {publicationTypeLabel}
              </p>

              <h3 className="text-heading-lg max-w-[42rem] text-text-primary [overflow-wrap:break-word]">
                {highlightTitle}
              </h3>

              {showPublicationTitle ? (
                externalUrl ? (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-body-lg max-w-[42rem] font-medium text-balance text-brand-primary [overflow-wrap:break-word]",
                      linkClassName,
                    )}
                  >
                    {publication.title}
                  </a>
                ) : (
                  <p className="text-body-lg max-w-[42rem] font-medium text-balance text-brand-primary [overflow-wrap:break-word]">
                    {publication.title}
                  </p>
                )
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              {authors ? (
                <p className="text-body-sm max-w-[42rem] text-text-secondary">{authors}</p>
              ) : null}

              <p className="text-caption tracking-[0.04em] text-text-tertiary uppercase">
                <time dateTime={String(publication.year)}>{publication.year}</time>
                {publication.journalOrConference ? (
                  <>
                    {" · "}
                    <span className="normal-case">{publication.journalOrConference}</span>
                  </>
                ) : null}
                {doiUrl && doiLabel ? (
                  <>
                    {" · "}
                    <a
                      href={doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClassName}
                    >
                      {doiLabel}
                    </a>
                  </>
                ) : null}
              </p>
            </div>

            {hasDescription ? (
              <PortableTextContent
                value={publication.description}
                className="publication-entry-copy max-w-[38rem] space-y-2.5 [&_ol]:mt-0.5 [&_p]:text-body-sm [&_p]:leading-[1.46] [&_ul]:mt-0.5"
              />
            ) : null}
          </div>

          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${highlightTitle}`}
              className={cn(
                "mt-1 shrink-0 text-label-md leading-none text-text-tertiary",
                linkClassName,
              )}
            >
              ↗
            </a>
          ) : null}
        </div>

        {figure}
      </div>
    </article>
  );
}

export default PublicationListEntry;
