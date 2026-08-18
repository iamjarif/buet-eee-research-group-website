import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind CSS classes with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Returns true when a slug string is non-empty. */
export function isValidSlug(slug: string | undefined | null): slug is string {
  return typeof slug === "string" && slug.length > 0;
}

/** URL-safe slug from a title. Matches Sanity publication slug maxLength of 120. */
export function slugify(value: string, maxLength = 120): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
}

/** Safely format an array of author names. */
export function formatAuthorNames(
  authors: Array<{ name: string }> | undefined,
): string {
  if (!authors?.length) return "";
  return authors.map((author) => author.name).join(", ");
}

/** Author display line for publications. */
export function formatPublicationAuthors(publication: {
  authorLine?: string;
}): string {
  return publication.authorLine?.trim() ?? "";
}

/** Build a DOI URL from a DOI string. */
export function getDoiUrl(doi: string | undefined): string | undefined {
  if (!doi) return undefined;
  const normalized = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  return `https://doi.org/${normalized}`;
}
