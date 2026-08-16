import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind CSS classes with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Join class names without Tailwind merge (for non-Tailwind contexts). */
export function classNames(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Returns true when a slug string is non-empty. */
export function isValidSlug(slug: string | undefined | null): slug is string {
  return typeof slug === "string" && slug.length > 0;
}

/** Safely format an array of author names. */
export function formatAuthorNames(
  authors: Array<{ name: string }> | undefined,
): string {
  if (!authors?.length) return "";
  return authors.map((author) => author.name).join(", ");
}

/** Author display line for publications (CMS authorLine or linked people). */
export function formatPublicationAuthors(publication: {
  authorLine?: string;
  authors?: Array<{ name: string }>;
}): string {
  if (publication.authorLine?.trim()) return publication.authorLine.trim();
  return formatAuthorNames(publication.authors);
}

/** Build a DOI URL from a DOI string. */
export function getDoiUrl(doi: string | undefined): string | undefined {
  if (!doi) return undefined;
  const normalized = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  return `https://doi.org/${normalized}`;
}
