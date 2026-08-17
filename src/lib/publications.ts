import type { PublicationSummary } from "../../sanity/types";
import { getDoiUrl } from "@/lib/utils";

export type PublicationTypeFilter = "all" | "journal" | "conference";

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

export function getPublicationExternalUrl(
  publication: PublicationSummary,
): string | undefined {
  if (publication.externalUrl) return publication.externalUrl;
  return getDoiUrl(publication.doi);
}

export function filterPublications(
  publications: PublicationSummary[],
  {
    query,
    type,
  }: {
    query: string;
    type: PublicationTypeFilter;
  },
): PublicationSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  return publications.filter((publication) => {
    if (type !== "all" && inferPublicationType(publication) !== type) {
      return false;
    }

    if (!normalizedQuery) return true;

    const haystack = [
      publication.title,
      publication.categoryLabel,
      publication.journalOrConference,
      publication.authorLine ?? "",
      String(publication.year),
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
