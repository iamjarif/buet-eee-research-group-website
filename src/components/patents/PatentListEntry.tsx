import { getPatentExternalUrl } from "@/lib/patents";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import type { PatentSummary } from "../../../sanity/types";

type PatentListEntryProps = {
  patent: PatentSummary;
  listingNumber: string;
};

const linkClassName = cn(
  "transition-[color,opacity] duration-300",
  hoverEaseClass,
  "hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

export function PatentListEntry({ patent, listingNumber }: PatentListEntryProps) {
  const externalUrl = getPatentExternalUrl(patent);

  return (
    <article className="flex flex-col gap-4 border-b border-border-default py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-1 items-start gap-8 sm:items-center">
        <p className="w-6 shrink-0 text-label-xs text-text-tertiary">
          {listingNumber}
        </p>

        <h3 className="min-w-0 flex-1 text-heading-md text-text-primary">
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {patent.title}
            </a>
          ) : (
            patent.title
          )}
        </h3>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 sm:shrink-0 sm:pl-0">
        {patent.patentNumber ? (
          <p className="text-caption text-text-tertiary">{patent.patentNumber}</p>
        ) : null}
        <p className="text-label-xs text-text-secondary">{patent.year}</p>
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${patent.title}`}
            className={cn("text-label-xs text-text-tertiary", linkClassName)}
          >
            ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default PatentListEntry;
