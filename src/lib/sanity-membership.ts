import "server-only";

import { apiVersion, projectId } from "../../sanity/env";

const MANAGEMENT_API_VERSION = "2021-06-07";

/**
 * Confirms the bearer token belongs to a member of this Sanity project.
 * Requires both /users/me and a project membership match — a valid
 * users/me response alone is not enough.
 */
export async function isSanityProjectMember(token: string): Promise<boolean> {
  if (!token || projectId === "placeholder") {
    return false;
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [meResponse, projectResponse] = await Promise.all([
      fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/users/me`, {
        headers,
        cache: "no-store",
      }),
      fetch(`https://api.sanity.io/v${MANAGEMENT_API_VERSION}/projects/${projectId}`, {
        headers,
        cache: "no-store",
      }),
    ]);

    if (!meResponse.ok || !projectResponse.ok) {
      return false;
    }

    const me = (await meResponse.json()) as { id?: unknown };
    const project = (await projectResponse.json()) as { members?: unknown };

    if (typeof me.id !== "string" || me.id.length === 0) {
      return false;
    }

    if (!Array.isArray(project.members)) {
      return false;
    }

    return project.members.some((member) => {
      if (typeof member !== "object" || member === null) {
        return false;
      }

      const record = member as { id?: unknown; userId?: unknown };
      return record.id === me.id || record.userId === me.id;
    });
  } catch {
    return false;
  }
}
