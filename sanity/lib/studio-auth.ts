/**
 * Studio session token for same-origin API calls from custom Studio components.
 * Sanity stores this under __studio_auth_token_${projectId} when the editor is signed in.
 */
export function getStudioSessionToken(projectId: string): string | null {
  if (typeof window === "undefined" || !projectId) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`__studio_auth_token_${projectId}`);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { token?: unknown };
    return typeof parsed.token === "string" && parsed.token.trim() ? parsed.token.trim() : null;
  } catch {
    return null;
  }
}
