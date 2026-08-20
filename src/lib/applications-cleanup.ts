import { del } from "@vercel/blob";

import { getWriteClient } from "../../sanity/lib/write-client";
import { writeToken } from "../../sanity/env";
import { extractCvPathname } from "@/lib/cv-access";

export const APPLICATION_RETENTION_MONTHS = 12;

export type ApplicationCleanupRecord = {
  _id: string;
  submittedAt?: string;
  cvPathname?: string | null;
  cvUrl?: string | null;
  name?: string;
};

export type ApplicationCleanupFailure = {
  id: string;
  reason: string;
};

export type ApplicationCleanupSummary = {
  auth: "cron" | "manual";
  cutoffBefore: string;
  retentionMonths: number;
  eligible: number;
  cleanedUp: number;
  failed: ApplicationCleanupFailure[];
  skippedUnderRetention: number;
};

const APPLICATIONS_QUERY = /* groq */ `
  *[_type == "application"]{
    _id,
    name,
    submittedAt,
    cvPathname,
    cvUrl
  }
`;

export function getApplicationRetentionCutoff(reference = new Date()): Date {
  const cutoff = new Date(reference);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - APPLICATION_RETENTION_MONTHS);
  return cutoff;
}

export function resolveCvPathname(record: ApplicationCleanupRecord): string | null {
  const pathname = record.cvPathname?.trim();
  if (pathname) return pathname;

  const legacyUrl = record.cvUrl?.trim();
  if (legacyUrl) {
    return extractCvPathname(legacyUrl);
  }

  return null;
}

function partitionApplications(
  records: ApplicationCleanupRecord[],
  cutoff: Date,
): { eligible: ApplicationCleanupRecord[]; skippedUnderRetention: number } {
  let skippedUnderRetention = 0;
  const eligible: ApplicationCleanupRecord[] = [];

  for (const record of records) {
    if (!record.submittedAt) {
      skippedUnderRetention += 1;
      continue;
    }

    const submittedAt = new Date(record.submittedAt);
    if (Number.isNaN(submittedAt.getTime())) {
      skippedUnderRetention += 1;
      continue;
    }

    if (submittedAt < cutoff) {
      eligible.push(record);
    } else {
      skippedUnderRetention += 1;
    }
  }

  return { eligible, skippedUnderRetention };
}

async function deleteApplicationBlob(pathname: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN.");
  }

  await del(pathname, { token });
}

export async function runApplicationCleanup(
  auth: ApplicationCleanupSummary["auth"],
): Promise<ApplicationCleanupSummary> {
  if (!writeToken) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN.");
  }

  const client = getWriteClient();
  const cutoff = getApplicationRetentionCutoff();
  const records = await client.fetch<ApplicationCleanupRecord[]>(APPLICATIONS_QUERY);
  const { eligible, skippedUnderRetention } = partitionApplications(records, cutoff);

  const failed: ApplicationCleanupFailure[] = [];
  let cleanedUp = 0;

  for (const record of eligible) {
    const pathname = resolveCvPathname(record);

    if (!pathname) {
      failed.push({
        id: record._id,
        reason: "Missing cvPathname (and no legacy cvUrl to derive one).",
      });
      continue;
    }

    try {
      await deleteApplicationBlob(pathname);
      await client.delete(record._id);
      cleanedUp += 1;
    } catch (error) {
      failed.push({
        id: record._id,
        reason: error instanceof Error ? error.message : "Cleanup failed.",
      });
    }
  }

  const summary: ApplicationCleanupSummary = {
    auth,
    cutoffBefore: cutoff.toISOString(),
    retentionMonths: APPLICATION_RETENTION_MONTHS,
    eligible: eligible.length,
    cleanedUp,
    failed,
    skippedUnderRetention,
  };

  console.info("[applications/cleanup]", summary);

  return summary;
}
