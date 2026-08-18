import { type NextRequest, NextResponse } from "next/server";

import { runApplicationCleanup } from "@/lib/applications-cleanup";

function getSecretToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");

  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return authorization?.trim() || request.headers.get("x-sync-secret")?.trim() || null;
}

function isManualAuthorized(request: NextRequest) {
  const secret = process.env.SYNC_SECRET?.trim();
  const token = getSecretToken(request);
  return Boolean(secret && token && token === secret);
}

function isCronAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) return false;

  const authorization = request.headers.get("authorization");
  if (!authorization?.toLowerCase().startsWith("bearer ")) return false;

  return authorization.slice("Bearer ".length).trim() === cronSecret;
}

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

async function handleCleanup(auth: "cron" | "manual") {
  try {
    const summary = await runApplicationCleanup(auth);
    return NextResponse.json(summary);
  } catch (error) {
    console.error(`[applications/cleanup] Cleanup failed via ${auth} auth:`, error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Application cleanup failed.",
      },
      { status: 502 },
    );
  }
}

/** Vercel Cron sends GET (Authorization: Bearer CRON_SECRET when that env var is set). */
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return unauthorized();
  }

  return handleCleanup("cron");
}

/** Manual triggers use POST with SYNC_SECRET (Bearer or x-sync-secret). */
export async function POST(request: NextRequest) {
  if (!isManualAuthorized(request)) {
    return unauthorized();
  }

  return handleCleanup("manual");
}
