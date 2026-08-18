import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_STUDIO_LINK_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const DEFAULT_EMAIL_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCvSigningSecret(): string | undefined {
  return (
    process.env.APPLICATIONS_CV_SIGNING_SECRET?.trim() ||
    process.env.SANITY_REVALIDATE_SECRET?.trim()
  );
}

export function getSiteBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  return "http://localhost:3000";
}

export function extractCvPathname(blobUrl: string): string | null {
  try {
    const { pathname } = new URL(blobUrl);
    return pathname.replace(/^\/+/, "") || null;
  } catch {
    return null;
  }
}

export function signCvAccess(applicationId: string, expiresAtMs: number): string {
  const secret = getCvSigningSecret();
  if (!secret) {
    throw new Error(
      "Missing APPLICATIONS_CV_SIGNING_SECRET (or SANITY_REVALIDATE_SECRET fallback).",
    );
  }

  return createHmac("sha256", secret)
    .update(`${applicationId}:${expiresAtMs}`)
    .digest("hex");
}

export function verifyCvAccess(
  applicationId: string,
  expiresAtMs: number,
  token: string,
): boolean {
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
    return false;
  }

  const secret = getCvSigningSecret();
  if (!secret || !token) {
    return false;
  }

  const expected = signCvAccess(applicationId, expiresAtMs);

  try {
    const left = Buffer.from(expected, "utf8");
    const right = Buffer.from(token, "utf8");
    return left.length === right.length && timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export function buildCvDownloadUrl(
  applicationId: string,
  expiresInMs = DEFAULT_EMAIL_LINK_TTL_MS,
): string {
  const expiresAtMs = Date.now() + expiresInMs;
  const token = signCvAccess(applicationId, expiresAtMs);
  const baseUrl = getSiteBaseUrl();

  return `${baseUrl}/api/applications/${encodeURIComponent(applicationId)}/cv?expires=${expiresAtMs}&token=${token}`;
}

export function buildStudioCvDownloadUrl(applicationId: string): string {
  return buildCvDownloadUrl(applicationId, DEFAULT_STUDIO_LINK_TTL_MS);
}

export function isAuthorizedCvRequest(
  applicationId: string,
  request: Request,
): boolean {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const expires = Number(url.searchParams.get("expires"));

  if (token && verifyCvAccess(applicationId, expires, token)) {
    return true;
  }

  const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const adminSecret = process.env.APPLICATIONS_CV_ADMIN_SECRET?.trim();

  return Boolean(adminSecret && bearer && bearer === adminSecret);
}
