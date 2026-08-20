import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId, readToken } from "../env";

const DEFAULT_REVALIDATE = 3600; // 1 hour
const isDevelopment = process.env.NODE_ENV === "development";

/** Public Sanity client — published CMS content only. No token. Never query applications. */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});

/** Server client with read token for draft/preview fetches. Never use on the client. */
export const serverClient = readToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: readToken,
      perspective: "previewDrafts",
      stega: {
        enabled: true,
        studioUrl: "/studio",
      },
    })
  : client;

export type FetchOptions = {
  /** Next.js revalidation interval in seconds. Set to 0 for no cache. */
  revalidate?: number | false;
  /** Use draft/preview perspective (requires SANITY_API_READ_TOKEN). */
  preview?: boolean;
  /** Next.js cache tags for on-demand revalidation. */
  tags?: string[];
};

/**
 * Typed Sanity fetch wrapper with Next.js caching support.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = DEFAULT_REVALIDATE,
  preview = false,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
} & FetchOptions): Promise<T> {
  const activeClient = preview && readToken ? serverClient : client;
  const useNoStore = isDevelopment || revalidate === false;

  return activeClient.fetch<T>(query, params, {
    cache: useNoStore ? "no-store" : "force-cache",
    next: {
      revalidate: useNoStore ? 0 : revalidate,
      tags,
    },
  });
}

export { DEFAULT_REVALIDATE };
