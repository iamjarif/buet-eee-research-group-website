import type { PublicationSummary } from "../../sanity/types";
import { getDoiUrl } from "@/lib/utils";

export type PublicationTypeFilter = "all" | "journal" | "conference";
export type ResearchAreaFilter = "all" | string;

const PUBLICATIONS_PATH = "/publications";

/** Publications index URL, optionally pre-filtered by research area slug. */
export function getPublicationsPath(researchArea?: string | null) {
  const slug = researchArea?.trim();
  if (!slug || slug === "all") return PUBLICATIONS_PATH;
  return `${PUBLICATIONS_PATH}?area=${encodeURIComponent(slug)}`;
}

export function parseResearchAreaFilter(
  value: string | null | undefined,
  catalog: Array<{ slug: string }>,
): ResearchAreaFilter {
  const slug = value?.trim();
  if (!slug || slug === "all") return "all";
  return catalog.some((area) => area.slug === slug) ? slug : "all";
}

const CONFERENCE_PATTERN =
  /conference|symposium|workshop|iedm|irps|proceedings|proc\./i;

export function inferPublicationType(
  publication: PublicationSummary,
): "journal" | "conference" {
  if (publication.publicationType) return publication.publicationType;
  return CONFERENCE_PATTERN.test(publication.journalOrConference)
    ? "conference"
    : "journal";
}

export function getPublicationHighlightTitle(
  publication: Pick<PublicationSummary, "highlightTitle" | "title">,
) {
  const highlight = publication.highlightTitle?.trim();
  return highlight || publication.title;
}

export function getPublicationExternalUrl(
  publication: PublicationSummary,
): string | undefined {
  if (publication.externalUrl) return publication.externalUrl;
  return getDoiUrl(publication.doi);
}

type ResearchAreaCatalogEntry = {
  slug: string;
  title: string;
  displayOrder?: number;
};

function getPublicationResearchAreas(
  publication: PublicationSummary,
): Array<{ slug: string; title: string }> {
  const seen = new Set<string>();
  const areas: Array<{ slug: string; title: string }> = [];

  for (const area of [
    ...(publication.researchAreas ?? []),
    ...(publication.suggestedResearchAreas ?? []),
  ]) {
    if (!area.slug || seen.has(area.slug)) continue;
    seen.add(area.slug);
    areas.push({ slug: area.slug, title: area.title });
  }

  return areas;
}

/** Published research areas from Sanity, ordered for the filter bar. */
export function getResearchAreaFilters(
  catalog: ResearchAreaCatalogEntry[],
): Array<{ value: ResearchAreaFilter; label: string }> {
  if (catalog.length === 0) {
    return [{ value: "all", label: "All areas" }];
  }

  const options = [...catalog]
    .sort(
      (a, b) =>
        (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
        a.title.localeCompare(b.title),
    )
    .map((area) => ({ value: area.slug, label: area.title }));

  return [{ value: "all", label: "All areas" }, ...options];
}

/** Filters appear when at least one published research area exists. */
export function shouldShowResearchAreaFilters(
  catalog: ResearchAreaCatalogEntry[],
): boolean {
  return catalog.length > 0;
}

export function filterPublications(
  publications: PublicationSummary[],
  {
    query,
    type,
    researchArea = "all",
  }: {
    query: string;
    type: PublicationTypeFilter;
    researchArea?: ResearchAreaFilter;
  },
): PublicationSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  return publications.filter((publication) => {
    if (type !== "all" && inferPublicationType(publication) !== type) {
      return false;
    }

    if (
      researchArea !== "all" &&
      !getPublicationResearchAreas(publication).some(
        (area) => area.slug === researchArea,
      )
    ) {
      return false;
    }

    if (!normalizedQuery) return true;

    const haystack = [
      publication.highlightTitle ?? "",
      publication.title,
      publication.journalOrConference,
      publication.authorLine ?? "",
      String(publication.year),
      ...getPublicationResearchAreas(publication).map((area) => area.title),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function groupPublicationsByYear(
  publications: PublicationSummary[],
): Array<{ year: number; publications: PublicationSummary[] }> {
  const groups = new Map<number, PublicationSummary[]>();
  const orderedYears: number[] = [];

  for (const publication of publications) {
    if (!groups.has(publication.year)) {
      orderedYears.push(publication.year);
      groups.set(publication.year, []);
    }

    groups.get(publication.year)?.push(publication);
  }

  return orderedYears.map((year) => ({
    year,
    publications: groups.get(year) ?? [],
  }));
}
