"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { PublicationListEntry } from "@/components/publications/PublicationListEntry";
import { ResearchAreaFilterControl } from "@/components/publications/ResearchAreaFilterControl";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Container } from "@/components/ui/Container";
import {
  filterPublications,
  getPublicationsPath,
  parseResearchAreaFilter,
  shouldShowResearchAreaFilters,
  type PublicationTypeFilter,
  type ResearchAreaFilter,
} from "@/lib/publications";
import { cn } from "@/lib/utils";
import type { PublicationSummary, ResearchAreaEntry } from "../../../sanity/types";

type PublicationsIndexProps = {
  publications: PublicationSummary[];
  researchAreas: ResearchAreaEntry[];
  initialResearchArea?: string;
};

const TYPE_FILTERS: Array<{ value: PublicationTypeFilter; label: string }> = [
  { value: "all", label: "All types" },
  { value: "journal", label: "Journal" },
  { value: "conference", label: "Conference" },
];

export function PublicationsIndex({
  publications,
  researchAreas,
  initialResearchArea,
}: PublicationsIndexProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PublicationTypeFilter>("all");
  const [researchAreaFilter, setResearchAreaFilter] = useState<ResearchAreaFilter>(
    () => parseResearchAreaFilter(initialResearchArea, researchAreas),
  );

  const showResearchAreaFilters = useMemo(
    () => shouldShowResearchAreaFilters(researchAreas),
    [researchAreas],
  );
  const activeResearchArea = parseResearchAreaFilter(
    researchAreaFilter,
    researchAreas,
  );

  function handleResearchAreaChange(next: ResearchAreaFilter) {
    setResearchAreaFilter(next);
    router.replace(getPublicationsPath(next), { scroll: false });
  }

  const visiblePublications = useMemo(
    () =>
      filterPublications(publications, {
        query,
        type: typeFilter,
        researchArea: activeResearchArea,
      }),
    [publications, query, typeFilter, activeResearchArea],
  );

  const firstEntryId = visiblePublications[0]?._id;

  return (
    <>
      <Reveal immediate variant="fadeUpSubtle">
        <div className="border-b border-border-default bg-surface-subtle py-4">
          <Container as="div">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full sm:max-w-[360px]">
                <span className="sr-only">Search publications</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, authors, venues…"
                  className="h-9 w-full border-b border-border-strong bg-surface-base px-[13px] py-2 text-label-xs text-text-primary placeholder:text-text-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                <div
                  className="flex flex-wrap items-center gap-1 sm:gap-2"
                  role="group"
                  aria-label="Filter by publication type"
                >
                  {TYPE_FILTERS.map((filter) => {
                    const isActive = typeFilter === filter.value;

                    return (
                      <button
                        key={filter.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setTypeFilter(filter.value)}
                        className={cn(
                          "type-overline px-3 py-1.5 transition-colors duration-300 sm:px-3.5",
                          isActive
                            ? "bg-text-primary text-text-inverse"
                            : "text-text-secondary hover:text-text-primary",
                        )}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>

                {showResearchAreaFilters ? (
                  <>
                    <span
                      aria-hidden
                      className="hidden h-5 w-px shrink-0 bg-border-strong sm:block"
                    />
                    <ResearchAreaFilterControl
                      researchAreas={researchAreas}
                      value={activeResearchArea}
                      onChange={handleResearchAreaChange}
                      className="w-full sm:w-auto"
                    />
                  </>
                ) : null}
              </div>
            </div>
          </Container>
        </div>
      </Reveal>

      <section
        aria-label="Publication results"
        className="bg-surface-base page-content-padding"
      >
        <Container as="div" className="flex flex-col">
          {visiblePublications.length > 0 ? (
            <Stagger
              key={`${typeFilter}-${activeResearchArea}-${query}`}
              immediate
              stagger={0.06}
            >
              {visiblePublications.map((publication, index) => (
                <StaggerItem
                  key={publication._id}
                  className={index === 0 ? "border-t border-border-default" : undefined}
                >
                  <PublicationListEntry
                    publication={publication}
                    priority={publication._id === firstEntryId}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Reveal variant="fadeUpSubtle">
              <p className="text-body-sm text-text-secondary">
                No publications match your search. Try adjusting the filters or search
                terms.
              </p>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}

export default PublicationsIndex;
