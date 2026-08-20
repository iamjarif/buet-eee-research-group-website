import { type NextRequest, NextResponse } from "next/server";

import { getApplicationCv, streamApplicationCv } from "@/lib/applications";
import { isAuthorizedCvRequest } from "@/lib/cv-access";
import { enforceCvDownloadRateLimit } from "@/lib/rate-limit";
import { isSanityProjectMember } from "@/lib/sanity-membership";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id?.startsWith("application-")) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }

  try {
    const signedOrAdmin = isAuthorizedCvRequest(id, request);
    let studioMember = false;

    if (!signedOrAdmin) {
      const bearer = request.headers
        .get("authorization")
        ?.match(/^Bearer\s+(.+)$/i)?.[1]
        ?.trim();
      studioMember = Boolean(bearer && (await isSanityProjectMember(bearer)));
    }

    if (!signedOrAdmin && !studioMember) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (studioMember) {
      const rateLimited = await enforceCvDownloadRateLimit(request);
      if (rateLimited) {
        return rateLimited;
      }
    }

    const application = await getApplicationCv(id);

    if (!application?.cvPathname) {
      return NextResponse.json({ error: "CV not found." }, { status: 404 });
    }

    const result = await streamApplicationCv(application.cvPathname);

    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: "CV not found." }, { status: 404 });
    }

    const filename = application.cvFilename ?? "cv.pdf";
    const encodedFilename = encodeURIComponent(filename);

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Application CV download error:", error);
    return NextResponse.json({ error: "Unable to download CV." }, { status: 500 });
  }
}
