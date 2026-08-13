import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { revalidateSecret } from "../../../../sanity/env";
import { CMS_TAGS } from "@/lib/cms";

const REVALIDATE_MAP: Record<string, string[]> = {
  siteSettings: [CMS_TAGS.siteSettings],
  homepage: [CMS_TAGS.homepage],
  researchArea: [CMS_TAGS.researchAreas],
  publication: [CMS_TAGS.publications],
  person: [CMS_TAGS.people],
  contribution: [CMS_TAGS.homepage],
  activity: [CMS_TAGS.activities],
};

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!revalidateSecret || secret !== revalidateSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      _type?: string;
      slug?: { current?: string };
    };

    const tags = body._type ? REVALIDATE_MAP[body._type] : undefined;

    if (tags) {
      for (const tag of tags) {
        revalidateTag(tag, "max");
      }

      if (body.slug?.current && body._type) {
        revalidateTag(`${body._type}:${body.slug.current}`, "max");
      }
    } else {
      Object.values(CMS_TAGS).forEach((tag) => revalidateTag(tag, "max"));
    }

    revalidatePath("/");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
