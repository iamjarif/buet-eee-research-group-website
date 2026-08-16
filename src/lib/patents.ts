import type { PatentSummary } from "../../sanity/types";
import { formatAuthorNames } from "@/lib/utils";

export function getPatentExternalUrl(patent: PatentSummary): string | undefined {
  return patent.externalUrl;
}

export function formatPatentInventors(patent: {
  inventorLine?: string;
  inventors?: Array<{ name: string }>;
}): string {
  if (patent.inventorLine?.trim()) return patent.inventorLine.trim();
  return formatAuthorNames(patent.inventors);
}

export function partitionPatents(patents: PatentSummary[]): {
  granted: PatentSummary[];
  pending: PatentSummary[];
} {
  const granted: PatentSummary[] = [];
  const pending: PatentSummary[] = [];

  for (const patent of patents) {
    if (patent.status === "granted") {
      granted.push(patent);
    } else {
      pending.push(patent);
    }
  }

  granted.sort(
    (a, b) =>
      (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || b.year - a.year,
  );
  pending.sort(
    (a, b) => b.year - a.year || (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );

  return { granted, pending };
}

export function formatPatentStats(grantedCount: number, pendingCount: number): string {
  return `${grantedCount} GRANTED · ${pendingCount} PENDING`;
}

export function formatPatentListingNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
