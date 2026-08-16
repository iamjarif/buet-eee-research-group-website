import type { ResearchAreaEntry } from "../../sanity/types";

/** Header summary, e.g. "4 areas". */
export function formatResearchStats(count: number): string {
  if (count === 0) return "";
  return `${count} ${count === 1 ? "area" : "areas"}`;
}

/** Published output tied to an area, e.g. "3 publications". Empty when none. */
export function formatResearchOutput(area: ResearchAreaEntry): string {
  const count = area.publicationCount ?? 0;
  if (count === 0) return "";
  return `${count} ${count === 1 ? "publication" : "publications"}`;
}

/** Host of an external resource, so a link states where it leads. */
export function formatExternalHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
