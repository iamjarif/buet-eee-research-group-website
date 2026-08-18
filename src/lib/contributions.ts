import type { Contribution } from "../../sanity/types";

export type ContributionCounts = {
  publications: number;
  patents: number;
};

function normalizeContributionLinkPath(href?: string): string {
  if (!href) return "";

  try {
    const path = href.startsWith("http") ? new URL(href).pathname : href;
    return path.replace(/\/$/, "") || "/";
  } catch {
    return href.replace(/\/$/, "") || "/";
  }
}

/** Overrides stat values for publication/patent cards using live CMS counts. */
export function enrichContributionsWithLiveCounts(
  contributions: Contribution[],
  counts: ContributionCounts,
): Contribution[] {
  return contributions.map((contribution) => {
    const path = normalizeContributionLinkPath(contribution.link?.href);

    if (path === "/publications") {
      return { ...contribution, value: String(counts.publications) };
    }

    if (path === "/patents") {
      return { ...contribution, value: String(counts.patents) };
    }

    return contribution;
  });
}
