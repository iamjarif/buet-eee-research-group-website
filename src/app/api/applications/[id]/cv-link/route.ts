import { type NextRequest, NextResponse } from "next/server";

import { apiVersion, projectId } from "../../../../../../sanity/env";
import { toApplicationDocumentIds } from "@/lib/applications";
import { buildCvDownloadUrl } from "@/lib/cv-access";

const STUDIO_LINK_TTL_MS = 60 * 60 * 1000; // 1 hour

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function isSanityProjectMember(token: string): Promise<boolean> {
  if (!token || projectId === "placeholder") {
    return false;
  }

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v${apiVersion}/users/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  return response.ok;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id: rawId } = await context.params;
  const { id } = toApplicationDocumentIds(rawId);

  if (!id.startsWith("application-")) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }

  const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();

  if (!token || !(await isSanityProjectMember(token))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const url = buildCvDownloadUrl(id, STUDIO_LINK_TTL_MS);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Studio CV link error:", error);
    return NextResponse.json({ error: "Unable to create CV link." }, { status: 500 });
  }
}
