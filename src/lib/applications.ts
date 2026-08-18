import { get } from "@vercel/blob";
import { put } from "@vercel/blob";

import { getWriteClient } from "../../sanity/lib/client";
import { writeToken } from "../../sanity/env";
import {
  buildStudioCvDownloadUrl,
  extractCvPathname,
} from "@/lib/cv-access";
import { sanitizeCvFilename } from "@/lib/contact";

type CreateApplicationInput = {
  name: string;
  email: string;
  message: string;
  cvPathname: string;
  cvFilename: string;
  submittedAt: string;
};

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
  const id = `application-${Date.parse(input.submittedAt)}-${Math.random().toString(36).slice(2, 8)}`;
  const cvDownloadUrl = buildStudioCvDownloadUrl(id);

  const document = {
    _id: id,
    _type: "application",
    name: input.name,
    email: input.email,
    message: input.message,
    cvPathname: input.cvPathname,
    cvDownloadUrl,
    cvFilename: input.cvFilename,
    submittedAt: input.submittedAt,
    status: "new",
  };

  await client.createOrReplace(document);

  return document;
}

export async function getApplicationCv(applicationId: string) {
  if (!writeToken) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN.");
  }

  const client = getWriteClient();
  return client.fetch<{
    cvPathname?: string;
    cvFilename?: string;
  } | null>(
    `*[_type == "application" && _id == $id][0]{ cvPathname, cvFilename }`,
    { id: applicationId },
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
