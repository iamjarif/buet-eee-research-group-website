import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, writeToken } from "../env";

/**
 * Server-only Sanity client with the write token. Used for application/CV
 * documents and other mutations. Never import this module from client components.
 */
export function getWriteClient() {
  if (!writeToken) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN. Create an Editor token at sanity.io/manage and add it to .env.local (never NEXT_PUBLIC_*).",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
    perspective: "raw",
  });
}
