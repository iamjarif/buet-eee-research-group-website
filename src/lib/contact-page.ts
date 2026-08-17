import type { SiteSettings } from "../../sanity/types";

const DEFAULT_MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Bangladesh+University+of+Engineering+and+Technology+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed";

export function splitContactLines(value?: string | null): string[] {
  if (!value?.trim()) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getContactMapEmbedUrl(settings?: SiteSettings | null): string {
  return settings?.contactMapEmbedUrl?.trim() || DEFAULT_MAP_EMBED_URL;
}

export function getContactLocationLabel(settings?: SiteSettings | null): string {
  return settings?.contactLocationLabel?.trim() ?? "BUET · Dhaka, Bangladesh";
}

export function areContactAddressesEqual(
  officeLines: string[],
  mailingLines: string[],
): boolean {
  if (officeLines.length === 0 || mailingLines.length === 0) return false;
  const normalize = (lines: string[]) =>
    lines.map((line) => line.toLowerCase().replace(/\s+/g, " ").trim()).join("\n");
  return normalize(officeLines) === normalize(mailingLines);
}

export function getMailingAddressLines(settings?: SiteSettings | null): string[] {
  const officeLines = splitContactLines(settings?.contactOfficeAddress);
  const mailingLines = splitContactLines(settings?.contactMailingAddress);
  if (mailingLines.length === 0 || areContactAddressesEqual(officeLines, mailingLines)) {
    return [];
  }
  return mailingLines;
}
