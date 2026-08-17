import { getPatentExternalUrl, formatPatentInventors } from "@/lib/patents";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import type { PatentSummary } from "../../../sanity/types";

type PatentApplicationCardProps = {
  patent: PatentSummary;
};

export function PatentApplicationCard({ patent }: PatentApplicationCardProps) {
  const externalUrl = getPatentExternalUrl(patent);
  const inventors = formatPatentInventors(patent);

  return (
    <article className="flex flex-col justify-between gap-5 border border-border-strong bg-surface-base p-4 sm:min-h-[217px] sm:gap-6 sm:p-7">
      <h3 className="text-heading-md text-text-primary">{patent.title}</h3>

      <div className="space-y-2">
        {inventors ? (
          <p className="text-body-xs text-text-secondary">{inventors}</p>
        ) : null}

        {patent.patentNumber ? (
          externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-block text-caption uppercase text-brand-primary transition-opacity duration-300",
                hoverEaseClass,
                "hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
              )}
            >
              {patent.patentNumber}
            </a>
          ) : (
            <p className="text-caption uppercase text-brand-primary">
              {patent.patentNumber}
            </p>
          )
        ) : null}
      </div>
    </article>
  );
}

export default PatentApplicationCard;
