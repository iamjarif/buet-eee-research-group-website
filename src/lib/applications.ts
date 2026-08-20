import "server-only";

import { get } from "@vercel/blob";
import { put } from "@vercel/blob";

import { getWriteClient } from "../../sanity/lib/write-client";
import { writeToken } from "../../sanity/env";
import { extractCvPathname } from "@/lib/cv-access";
import { sanitizeCvFilename } from "@/lib/contact";

type CreateApplicationInput = {
  name: string;
  email: string;
  message: string;
  cvPathname: string;
  cvFilename: string;
  submittedAt: string;
};

export function toApplicationDocumentIds(applicationId: string) {
  const id = applicationId.startsWith("drafts.")
    ? applicationId.slice("drafts.".length)
    : applicationId;

  return { id, draftId: `drafts.${id}` };
}

export async function uploadApplicationCv(file: File, submittedAt: Date) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "Missing BLOB_READ_WRITE_TOKEN. Add a Vercel Blob read/write token to .env.local.",
    );
  }

  const sanitizedFilename = sanitizeCvFilename(file.name);
  const pathname = `applications/${submittedAt.getTime()}-${sanitizedFilename}`;

  const blob = await put(pathname, file, {
    access: "private",
    token,
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });

  const cvPathname = extractCvPathname(blob.url) ?? pathname;

  return {
    cvPathname,
    cvFilename: sanitizedFilename,
  };
}

export async function createApplicationDocument(input: CreateApplicationInput) {
  if (!writeToken) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN. Create an Editor token and add it to .env.local.",
    );
  }

  const client = getWriteClient();
  const { id, draftId } = toApplicationDocumentIds(
    `application-${Date.parse(input.submittedAt)}-${Math.random().toString(36).slice(2, 8)}`,
  );

  const document = {
    _id: draftId,
    _type: "application" as const,
    name: input.name,
    email: input.email,
    message: input.message,
    cvPathname: input.cvPathname,
    cvFilename: input.cvFilename,
    submittedAt: input.submittedAt,
    status: "new",
  };

  await client.createOrReplace(document);

  return { ...document, _id: id };
}

export async function getApplicationCv(applicationId: string) {
  if (!writeToken) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN.");
  }

  const { id, draftId } = toApplicationDocumentIds(applicationId);
  const client = getWriteClient();

  return client.fetch<{
    cvPathname?: string;
    cvFilename?: string;
  } | null>(
    `*[_type == "application" && (_id == $id || _id == $draftId)][0]{ cvPathname, cvFilename }`,
    { id, draftId },
  );
}

export async function streamApplicationCv(pathname: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN.");
  }

  return get(pathname, {
    access: "private",
    token,
  });
}
