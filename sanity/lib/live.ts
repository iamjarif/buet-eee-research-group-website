/**
 * Live preview / Visual Editing foundation.
 *
 * Full draft preview requires SANITY_API_READ_TOKEN and Next.js draft mode.
 * This module prepares the architecture without implementing a full preview UI.
 */

import { defineLive } from "next-sanity/live";

import { client, serverClient } from "./client";
import { readToken } from "../env";

export const isLivePreviewEnabled = Boolean(readToken);

/**
 * Live fetch utilities for Sanity Visual Editing.
 * Only active when SANITY_API_READ_TOKEN is configured.
 */
export const { sanityFetch: liveSanityFetch, SanityLive } = defineLive({
  client: serverClient,
  serverToken: readToken,
  browserToken: readToken,
});

export { client as liveClient };
