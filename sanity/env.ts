/**
 * Centralized Sanity environment configuration.
 * Public values are safe for client-side use; tokens remain server-only.
 */

const DEFAULT_API_VERSION = "2026-08-13";

function assertValue<T>(value: T | undefined, name: string): T {
  if (value === undefined || value === "") {
    throw new Error(
      `Missing environment variable: ${name}. See .env.example for setup instructions.`,
    );
  }
  return value;
}

/** Project ID — falls back to placeholder during local build without CMS credentials. */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "placeholder";

/** Dataset name. */
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

/** Sanity API version (date string). */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || DEFAULT_API_VERSION;

/** Server-only read token for draft/preview fetches. Never expose to the client. */
export const readToken = process.env.SANITY_API_READ_TOKEN?.trim();

/** Webhook secret for on-demand revalidation. */
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET?.trim();

/** Whether a real Sanity project is configured. */
export const isSanityConfigured =
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()) &&
  projectId !== "placeholder";

/**
 * Returns validated project ID for contexts that require a real CMS connection.
 */
export function getRequiredProjectId(): string {
  return assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim(),
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
  );
}

export function getRequiredDataset(): string {
  return assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim(),
    "NEXT_PUBLIC_SANITY_DATASET",
  );
}
