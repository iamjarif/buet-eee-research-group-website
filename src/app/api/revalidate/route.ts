import { timingSafeEqual } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";

import { revalidateSecret } from "../../../../sanity/env";
import { revalidateCmsContent } from "@/lib/revalidate-cms";

function getRevalidateSecretFromRequest(request: NextRequest): string | null {
  const headerSecret = request.headers.get("x-revalidate-secret")?.trim();
  if (headerSecret) {
    return headerSecret;
  }

  const authorization = request.headers.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return null;
}

function isAuthorizedRevalidateRequest(request: NextRequest): boolean {
  const provided = getRevalidateSecretFromRequest(request);
  const expected = revalidateSecret;

  if (!expected || !provided) {
    return false;
  }

  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(provided, "utf8");

  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedRevalidateRequest(request)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      _type?: string;
      slug?: string | { current?: string };
    };

    const result = revalidateCmsContent({
      _type: body._type,
      slug: body.slug,
    });

    console.info("[revalidate]", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
