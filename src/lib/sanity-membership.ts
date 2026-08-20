import "server-only";

import { apiVersion, projectId, readToken, writeToken } from "../../sanity/env";

const MEMBERSHIP_TIMEOUT_MS = 5000;

function getProjectsApiToken(): string | null {
  return readToken ?? writeToken ?? null;
}

/**
 * Verify a Sanity user id belongs to the configured project.
 * Uses the global Projects API with a server-only token.
 */
export async function isSanityProjectMemberById(userId: string): Promise<boolean> {
  const token = getProjectsApiToken();

  if (!token || !userId || projectId === "placeholder") {
    return false;
  }

  try {
    const response = await fetch(
      `https://api.sanity.io/v${apiVersion}/projects/${encodeURIComponent(projectId)}/users/${encodeURIComponent(userId)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(MEMBERSHIP_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      return false;
    }

    const body = (await response.json()) as { id?: unknown };
    return typeof body.id === "string" && body.id === userId;
  } catch (error) {
    console.error("Sanity project membership lookup failed:", error);
    return false;
  }
}
