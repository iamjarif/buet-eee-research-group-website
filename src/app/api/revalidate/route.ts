import { type NextRequest, NextResponse } from "next/server";

import { revalidateSecret } from "../../../../sanity/env";
import { revalidateCmsContent } from "@/lib/revalidate-cms";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!revalidateSecret || secret !== revalidateSecret) {
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
