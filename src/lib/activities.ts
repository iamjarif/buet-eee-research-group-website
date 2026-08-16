import type { ActivitySummary } from "../../sanity/types";

export type ActivityCategoryFilter = string;

/** Filter order follows the category list on the activity schema. */
const CATEGORY_ORDER = [
  "news",
  "publication",
  "event",
  "award",
  "collaboration",
  "other",
] as const;

const CATEGORY_LABELS: Record<string, { singular: string; plural: string }> = {
  news: { singular: "News", plural: "News" },
  publication: { singular: "Publication", plural: "Publications" },
  event: { singular: "Event", plural: "Events" },
  award: { singular: "Award", plural: "Awards" },
  collaboration: { singular: "Collaboration", plural: "Collaborations" },
  other: { singular: "Other", plural: "Other" },
};

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

function parseDate(date: string): Date | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function getActivityYear(date: string): number | undefined {
  return parseDate(date)?.getUTCFullYear();
}

/** Day and month for the entry rail, e.g. "01 JUL". */
export function formatActivityDayMonth(date: string): string {
  const parsed = parseDate(date);
  if (!parsed) return date;

  const day = String(parsed.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[parsed.getUTCMonth()] ?? ""}`.trim();
}

/** Full entry date, e.g. "01 JUL 2024". */
export function formatActivityFullDate(date: string): string {
  const year = getActivityYear(date);
  if (!year) return date;
  return `${formatActivityDayMonth(date)} ${year}`;
}

export function formatActivityCategoryLabel(category: string): string {
  const label = CATEGORY_LABELS[category]?.singular;
  if (label) return label;
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/[-_]/g, " ");
}

/** Newest first, with displayOrder as a stable tiebreaker within a single date. */
export function sortActivities(activities: ActivitySummary[]): ActivitySummary[] {
  return [...activities].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
      a.title.localeCompare(b.title),
  );
}

/** Category filters present in the data, so empty categories never appear. */
export function getActivityCategoryFilters(
  activities: ActivitySummary[],
): Array<{ value: ActivityCategoryFilter; label: string }> {
  const present = new Set(activities.map((activity) => activity.category));

  const known = CATEGORY_ORDER.filter((category) => present.has(category)).map(
    (category) => ({
      value: category as ActivityCategoryFilter,
      label: CATEGORY_LABELS[category]?.plural ?? category,
    }),
  );

  const unknown = [...present]
    .filter((category) => !CATEGORY_ORDER.includes(category as never))
    .sort()
    .map((category) => ({
      value: category,
      label: formatActivityCategoryLabel(category),
    }));

  return [{ value: "all", label: "All" }, ...known, ...unknown];
}

export function filterActivitiesByCategory(
  activities: ActivitySummary[],
  category: ActivityCategoryFilter,
): ActivitySummary[] {
  if (category === "all") return activities;
  return activities.filter((activity) => activity.category === category);
}

/**
 * Filters only earn their space once the archive is large enough to need them.
 */
export function shouldShowActivityFilters(activities: ActivitySummary[]): boolean {
  const filters = getActivityCategoryFilters(activities);
  return activities.length >= 6 && filters.length > 2;
}

/** Header summary, e.g. "24 entries · 2023—2026". */
export function formatActivityArchiveStat(activities: ActivitySummary[]): string {
  if (activities.length === 0) return "";

  const count = `${activities.length} ${activities.length === 1 ? "entry" : "entries"}`;
  const years = activities
    .map((activity) => getActivityYear(activity.date))
    .filter((year): year is number => typeof year === "number");

  if (years.length === 0) return count;

  const earliest = Math.min(...years);
  const latest = Math.max(...years);
  const range = earliest === latest ? `${latest}` : `${earliest}—${latest}`;

  return `${count} · ${range}`;
}
