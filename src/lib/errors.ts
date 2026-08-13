/**
 * Application-level error types and helpers.
 */

export class CmsError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CmsError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Wraps a CMS fetch function with consistent error handling.
 * Returns null for missing optional content; re-throws configuration errors.
 */
export async function safeCmsFetch<T>(
  fetcher: () => Promise<T>,
  options: { fallback?: T; label?: string } = {},
): Promise<T | null> {
  const { fallback = null as T, label = "CMS fetch" } = options;

  try {
    return await fetcher();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[${label}]`, error);
    }
    return fallback;
  }
}

/** Returns the value or a fallback without throwing on null/undefined. */
export function withFallback<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}
