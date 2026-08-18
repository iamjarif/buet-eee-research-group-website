import { type NextRequest, NextResponse } from "next/server";

import { getApplicationCv, streamApplicationCv } from "@/lib/applications";
import { isAuthorizedCvRequest } from "@/lib/cv-access";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id?.startsWith("application-")) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }

  if (!isAuthorizedCvRequest(id, request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
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
        "Content-Disposition": `inline; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Application CV download error:", error);
    return NextResponse.json({ error: "Unable to download CV." }, { status: 500 });
  }
}
