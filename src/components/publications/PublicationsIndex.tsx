"use client";

import { useMemo, useState } from "react";

import { PublicationListEntry } from "@/components/publications/PublicationListEntry";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Container } from "@/components/ui/Container";
import {
  filterPublications,
  groupPublicationsByYear,
  type PublicationTypeFilter,
} from "@/lib/publications";
import { cn } from "@/lib/utils";
import type { PublicationSummary } from "../../../sanity/types";

type PublicationsIndexProps = {
  publications: PublicationSummary[];
};

const TYPE_FILTERS: Array<{ value: PublicationTypeFilter; label: string }> = [
  { value: "all", label: "All types" },
  { value: "journal", label: "Journal" },
  { value: "conference", label: "Conference" },
];

export function PublicationsIndex({ publications }: PublicationsIndexProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PublicationTypeFilter>("all");

  const visiblePublications = useMemo(
    () =>
      filterPublications(publications, {
        query,
        type: typeFilter,
      }),
    [publications, query, typeFilter],
  );

  const yearGroups = useMemo(
    () => groupPublicationsByYear(visiblePublications),
    [visiblePublications],
  );

  return (
    <>
      <Reveal immediate variant="fadeUpSubtle">
        <div className="border-b border-border-default bg-surface-subtle py-4">
          <Container as="div">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full max-w-[360px]">
                <span className="sr-only">Search publications</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, authors, venues…"
                  className="h-9 w-full border-b border-border-strong bg-surface-base px-[13px] py-2 text-label-xs text-text-primary placeholder:text-text-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                />
              </label>

              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Filter by publication type"
              >
                {TYPE_FILTERS.map((filter) => {
                  const isActive = typeFilter === filter.value;

                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setTypeFilter(filter.value)}
                      className={cn(
                        "type-overline px-3.5 py-1.5 transition-colors duration-300",
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
            </div>
          </Container>
        </div>
      </Reveal>

      <section
        aria-label="Publication results"
        className="bg-surface-base pb-[120px] pt-14"
      >
        <Container as="div" className="flex flex-col gap-14">
          {yearGroups.length > 0 ? (
            yearGroups.map(({ year, publications: groupedPublications }) => (
              <Stagger key={year} className="flex flex-col gap-6" stagger={0.06}>
                <StaggerItem>
                  <h2 className="font-serif text-heading-lg italic tracking-[-0.028125rem] text-text-secondary">
                    {year}
                  </h2>
                </StaggerItem>

                <div className="border-t border-border-default">
                  {groupedPublications.map((publication) => (
                    <StaggerItem key={publication._id}>
                      <PublicationListEntry publication={publication} />
                    </StaggerItem>
                  ))}
                </div>
              </Stagger>
            ))
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
