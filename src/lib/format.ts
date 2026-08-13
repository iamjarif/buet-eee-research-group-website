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

/** Format an ISO date string as "JUL 2024" for activity metadata. */
export function formatActivityDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  const month = MONTHS[parsed.getUTCMonth()] ?? "";
  const year = parsed.getUTCFullYear();
  return `${month} ${year}`;
}

/** Format activity category for display (e.g. "publication" → "PUBLICATION"). */
export function formatActivityCategory(category: string): string {
  return category.replace(/[-_]/g, " ").toUpperCase();
}

/** Zero-pad a display order number for research rows (e.g. 1 → "01"). */
export function formatSectionIndex(index: number): string {
  return String(index).padStart(2, "0");
}
