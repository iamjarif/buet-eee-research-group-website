import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

const CONTACT_LIMIT = 3;
const CONTACT_WINDOW = "10 m";
const CV_DOWNLOAD_LIMIT = 30;
const CV_DOWNLOAD_WINDOW = "10 m";

let contactRatelimit: Ratelimit | null = null;
let cvDownloadRatelimit: Ratelimit | null = null;

function getRedisRestCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function getContactRatelimit(): Ratelimit {
  if (contactRatelimit) {
    return contactRatelimit;
  }

  if (!getRedisRestCredentials()) {
    throw new Error(
      "Missing Upstash Redis credentials. Set KV_REST_API_URL and KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN).",
    );
  }

  contactRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(CONTACT_LIMIT, CONTACT_WINDOW),
    prefix: "ratelimit:contact",
  });

  return contactRatelimit;
}

function getCvDownloadRatelimit(): Ratelimit | null {
  if (cvDownloadRatelimit) {
    return cvDownloadRatelimit;
  }

  if (!getRedisRestCredentials()) {
    return null;
  }

  cvDownloadRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(CV_DOWNLOAD_LIMIT, CV_DOWNLOAD_WINDOW),
    prefix: "ratelimit:cv-download",
  });

  return cvDownloadRatelimit;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim();

  return ip || "unknown";
}

export async function enforceContactRateLimit(
  request: NextRequest,
): Promise<NextResponse | null> {
  try {
    const result = await getContactRatelimit().limit(getClientIp(request));

    if (result.success) {
      return null;
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000),
    );

    return NextResponse.json(
      {
        error: "Too many submissions. Please wait 10 minutes and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(result.reset),
        },
      },
    );
  } catch (error) {
    console.error("Contact rate limit error:", error);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again later." },
      { status: 503 },
    );
  }
}

/** Fail-open so Studio and email CV downloads still work if Redis is unavailable. */
export async function enforceCvDownloadRateLimit(
  request: NextRequest,
): Promise<NextResponse | null> {
  try {
    const limiter = getCvDownloadRatelimit();
    if (!limiter) {
      return null;
    }

    const result = await limiter.limit(getClientIp(request));

    if (result.success) {
      return null;
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000),
    );

    return NextResponse.json(
      { error: "Too many CV download requests. Please wait and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(result.reset),
        },
      },
    );
  } catch (error) {
    console.error("CV download rate limit error:", error);
    return null;
  }
}
