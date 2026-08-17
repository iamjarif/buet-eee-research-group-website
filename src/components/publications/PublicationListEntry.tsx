import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { getPublicationExternalUrl } from "@/lib/publications";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn, formatPublicationAuthors } from "@/lib/utils";
import type { PublicationSummary } from "../../../sanity/types";

type PublicationListEntryProps = {
  publication: PublicationSummary;
  priority?: boolean;
};

const linkClassName = cn(
  "transition-[color,opacity] duration-300",
  hoverEaseClass,
  "hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

export function PublicationListEntry({
  publication,
  priority = false,
}: PublicationListEntryProps) {
  const externalUrl = getPublicationExternalUrl(publication);
  const authors = formatPublicationAuthors(publication);
  const hasImage = Boolean(publication.image?.asset);
  const imageUrl = publication.image?.asset?.url;
  const hasDescription = Boolean(publication.description?.length);

  const figure = hasImage ? (
    imageUrl ? (
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View image for ${publication.title}`}
        className={cn(
          "block max-w-[26rem] transition-opacity duration-300 lg:col-start-2 lg:max-w-none",
          hoverEaseClass,
          "hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
        )}
      >
        <MediaFrame
          image={publication.image}
          width={800}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 26rem, 22rem"
          priority={priority}
          className="w-full"
        />
      </a>
    ) : (
      <MediaFrame
        image={publication.image}
        width={800}
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 26rem, 22rem"
        priority={priority}
        className="max-w-[26rem] lg:col-start-2 lg:max-w-none"
      />
    )
  ) : null;

  return (
    <article
      className={cn(
        "grid items-start gap-5 border-b border-border-default py-6 sm:gap-8 sm:py-7 lg:gap-x-12 lg:py-10 xl:gap-x-16",
        hasImage && "lg:grid-cols-[minmax(0,1fr)_22rem]",
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:gap-5">
        <p className="text-label-xs text-text-tertiary">{publication.categoryLabel}</p>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="text-heading-md text-text-primary">
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

          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${publication.title}`}
              className={cn("shrink-0 text-label-xs text-text-tertiary", linkClassName)}
            >
              ↗
            </a>
          ) : null}
        </div>

        {hasDescription ? (
          <PortableTextContent
            value={publication.description}
            className={cn(
              "space-y-3 [&_p]:text-body-sm",
              hasImage ? "max-w-[38rem]" : "max-w-none",
            )}
          />
        ) : null}
      </div>

      {figure}
    </article>
  );
}

export default PublicationListEntry;
