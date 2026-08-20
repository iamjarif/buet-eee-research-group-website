import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_EMAIL_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCvSigningSecret(): string {
  const secret = process.env.APPLICATIONS_CV_SIGNING_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "Missing APPLICATIONS_CV_SIGNING_SECRET. Set a dedicated value in .env.local and the Vercel project environment. Do not reuse SANITY_REVALIDATE_SECRET or any other shared secret.",
    );
  }

  return secret;
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
  return createHmac("sha256", getCvSigningSecret())
    .update(`${applicationId}:${expiresAtMs}`)
    .digest("hex");
}

export function verifyCvAccess(
  applicationId: string,
  expiresAtMs: number,
  token: string,
): boolean {
  if (!token || !Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
    return false;
  }

  const expected = signCvAccess(applicationId, expiresAtMs);
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(token, "utf8");

  return left.length === right.length && timingSafeEqual(left, right);
}

export function buildCvDownloadPath(
  applicationId: string,
  expiresInMs = DEFAULT_EMAIL_LINK_TTL_MS,
): string {
  const expiresAtMs = Date.now() + expiresInMs;
  const token = signCvAccess(applicationId, expiresAtMs);

  return `/api/applications/${encodeURIComponent(applicationId)}/cv?expires=${expiresAtMs}&token=${token}`;
}

export function buildCvDownloadUrl(
  applicationId: string,
  expiresInMs = DEFAULT_EMAIL_LINK_TTL_MS,
): string {
  return `${getSiteBaseUrl()}${buildCvDownloadPath(applicationId, expiresInMs)}`;
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
