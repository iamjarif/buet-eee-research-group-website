import { type NextRequest, NextResponse } from "next/server";

import { getWriteClient } from "../../../../../sanity/lib/write-client";
import { writeToken } from "../../../../../sanity/env";
import { revalidateCmsContent } from "@/lib/revalidate-cms";
import { cleanOpenAlexText, normalizeTitle } from "@/lib/openalex-text";
import {
  collectOpenAlexTopicNames,
  suggestResearchAreaIds,
  toSuggestedResearchAreaRefs,
  type ResearchAreaRecord,
} from "@/lib/research-area-suggest";
import { slugify } from "@/lib/utils";

/** OpenAlex author ID for Nadim Chowdhury (verified). */
const AUTHOR_ID = "A5017235448";

/** Drop OpenAlex works older than this year (other Nadim Chowdhury / Calcutta merge). */
const MIN_PUBLICATION_YEAR = 2010;

const VALID_TYPES = new Set(["article", "conference-paper"]);
const JUNK_RAW_TYPES = new Set(["Collection", "Figure", "Image"]);
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const OPENALEX_CURSOR_OVERLAP_DAYS = 5;
const PUBLICATION_SYNC_STATE_ID = "sync-state-publications";
const EXISTING_PUBLICATIONS_QUERY = /* groq */ `
  *[_type == "publication"]{ doi, title, year }
`;
const RESEARCH_AREAS_QUERY = /* groq */ `
  *[_type == "researchArea"]{ _id, title }
`;
const PUBLICATION_SYNC_STATE_QUERY = /* groq */ `
  *[_id == $id][0]{ lastSyncDate }
`;

type OpenAlexWork = {
  id: string;
  title?: string | null;
  type?: string | null;
  doi?: string | null;
  publication_year?: number | null;
  indexed_in?: string[] | null;
  primary_topic?: { display_name?: string | null } | null;
  topics?: Array<{ display_name?: string | null } | null> | null;
  primary_location?: {
    raw_type?: string | null;
    landing_page_url?: string | null;
    source?: {
      type?: string | null;
      display_name?: string | null;
    } | null;
  } | null;
  authorships?: Array<{
    author?: { display_name?: string | null } | null;
  } | null> | null;
};

type OpenAlexWorksResponse = {
  results?: OpenAlexWork[];
  meta?: { next_cursor?: string | null };
  error?: string;
  message?: string;
};

type ExistingPublication = {
  doi?: string | null;
  title?: string | null;
  year?: number | null;
};

type PublicationDraft = {
  _id: string;
  _type: "publication";
  title: string;
  slug: { _type: "slug"; current: string };
  year: number;
  doi?: string;
  journalOrConference: string;
  externalUrl?: string;
  authorLine?: string;
  publicationType: "journal" | "conference";
  researchAreas: [];
  openAlexTopics?: string[];
  suggestedResearchAreas?: Array<{
    _key: string;
    _type: "reference";
    _ref: string;
  }>;
  isFeatured: true;
  displayOrder: number;
};

type WriteClient = ReturnType<typeof getWriteClient>;

type SyncStateDocument = {
  lastSyncDate?: string | null;
};

function parseIsoDate(value: string | null | undefined) {
  if (!value || !ISO_DATE_PATTERN.test(value)) return null;
  return value;
}

function utcDateMinusDays(days: number) {
  const now = new Date();
  const utc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - days,
  );
  return new Date(utc).toISOString().slice(0, 10);
}

async function getStoredLastSyncDate(sanityClient: WriteClient) {
  const state = await sanityClient.fetch<SyncStateDocument | null>(
    PUBLICATION_SYNC_STATE_QUERY,
    { id: PUBLICATION_SYNC_STATE_ID },
  );

  return parseIsoDate(state?.lastSyncDate);
}

async function persistLastSyncDate(sanityClient: WriteClient, lastSyncDate: string) {
  await sanityClient
    .transaction()
    .createIfNotExists({
      _id: PUBLICATION_SYNC_STATE_ID,
      _type: "syncState",
    })
    .patch(PUBLICATION_SYNC_STATE_ID, (patch) => patch.set({ lastSyncDate }))
    .commit();
}

function getSecretToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return authorization?.trim() || request.headers.get("x-sync-secret")?.trim() || null;
}

function isManualAuthorized(request: NextRequest) {
  const secret = process.env.SYNC_SECRET;
  const token = getSecretToken(request);
  return Boolean(secret && token && token === secret);
}

function isCronAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret) return false;

  const authorization = request.headers.get("authorization");
  if (!authorization?.toLowerCase().startsWith("bearer ")) return false;

  return authorization.slice("Bearer ".length).trim() === cronSecret;
}

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

function openAlexUserAgent() {
  const mailto =
    process.env.OPENALEX_MAILTO?.trim() ||
    process.env.CONTACT_FORM_TO_EMAIL?.trim() ||
    "contact@buet.ac.bd";

  return `s-dream-sync (mailto:${mailto})`;
}

function normalizeDoi(doi?: string | null) {
  if (!doi) return null;
  return doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").toLowerCase().trim() || null;
}

function isJournalSource(work: OpenAlexWork) {
  return work.primary_location?.source?.type === "journal";
}

function titleYearKey(work: { title?: string | null; publication_year?: number | null }) {
  return `title:${normalizeTitle(work.title)}:${work.publication_year ?? ""}`;
}

function preferWork(existing: OpenAlexWork, candidate: OpenAlexWork) {
  if (isJournalSource(candidate) && !isJournalSource(existing)) return candidate;
  return existing;
}

function isRealPublication(work: OpenAlexWork) {
  if (!work.type || !VALID_TYPES.has(work.type)) return false;
  if (work.primary_location?.raw_type && JUNK_RAW_TYPES.has(work.primary_location.raw_type)) {
    return false;
  }
  if (work.primary_topic == null) return false;
  if (cleanOpenAlexText(work.title).toLowerCase().includes("supplementary material")) {
    return false;
  }
  if (!cleanOpenAlexText(work.title) || typeof work.publication_year !== "number") return false;

  return true;
}

function dedupeKey(work: OpenAlexWork) {
  const doi = normalizeDoi(work.doi);
  const isDatasetMirror = doi?.includes("figshare") || work.indexed_in?.includes("datacite");

  if (doi && !isDatasetMirror) return `doi:${doi}`;

  return `title:${normalizeTitle(work.title)}:${work.publication_year ?? ""}`;
}

function dedupeByKey(works: OpenAlexWork[], keyFor: (work: OpenAlexWork) => string) {
  const seen = new Map<string, OpenAlexWork>();

  for (const work of works) {
    const key = keyFor(work);
    const existing = seen.get(key);
    seen.set(key, existing ? preferWork(existing, work) : work);
  }

  return Array.from(seen.values());
}

function dedupeWorks(works: OpenAlexWork[]) {
  const byDoiOrTitle = dedupeByKey(works, dedupeKey);
  return dedupeByKey(byDoiOrTitle, titleYearKey);
}

async function fetchWorks(sinceDate: string | null) {
  const works: OpenAlexWork[] = [];
  let cursor: string | null = "*";

  while (cursor) {
    const filters = [`author.id:${AUTHOR_ID}`];
    if (sinceDate) filters.push(`from_publication_date:${sinceDate}`);

    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("filter", filters.join(","));
    url.searchParams.set("sort", "publication_date:desc");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("cursor", cursor);

    const res = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": openAlexUserAgent() },
    });

    const data = (await res.json()) as OpenAlexWorksResponse;

    if (!res.ok) {
      throw new Error(data.message || data.error || `OpenAlex request failed (${res.status})`);
    }

    works.push(...(data.results ?? []));
    cursor = data.meta?.next_cursor ?? null;
  }

  return works;
}

function isAlreadyInSanity(work: OpenAlexWork, existing: ExistingPublication[]) {
  const doi = normalizeDoi(work.doi);
  const title = normalizeTitle(work.title);
  const year = work.publication_year;

  return existing.some((doc) => {
    const existingDoi = normalizeDoi(doc.doi);
    if (doi && existingDoi && doi === existingDoi) return true;

    if (
      title &&
      year != null &&
      doc.year === year &&
      normalizeTitle(doc.title) === title
    ) {
      return true;
    }

    return false;
  });
}

function toExternalUrl(work: OpenAlexWork) {
  if (work.doi) {
    return work.doi.startsWith("http") ? work.doi : `https://doi.org/${work.doi}`;
  }

  const landing = work.primary_location?.landing_page_url;
  if (landing?.startsWith("http")) return landing;

  return undefined;
}

function inferPublicationType(work: OpenAlexWork): "journal" | "conference" {
  if (work.type === "conference-paper") return "conference";

  const sourceType = work.primary_location?.source?.type;
  if (sourceType === "conference") return "conference";
  if (sourceType === "journal") return "journal";

  return "journal";
}

function mapToSanityDraft(
  work: OpenAlexWork,
  researchAreaCatalog: ResearchAreaRecord[],
): PublicationDraft {
  const openAlexId = work.id.replace("https://openalex.org/", "");
  const doi = normalizeDoi(work.doi) ?? undefined;
  const externalUrl = toExternalUrl(work);
  const publicationType = inferPublicationType(work);
  const title = cleanOpenAlexText(work.title);
  const journalOrConference =
    cleanOpenAlexText(work.primary_location?.source?.display_name) || "Unknown venue";
  const authorLine = cleanOpenAlexText(
    (work.authorships ?? [])
      .map((authorship) => authorship?.author?.display_name?.trim())
      .filter((name): name is string => Boolean(name))
      .join(", "),
  );
  const openAlexTopics = collectOpenAlexTopicNames(work);
  const suggestedIds = suggestResearchAreaIds(openAlexTopics, title, researchAreaCatalog);

  return {
    _id: `drafts.publication-sync-${openAlexId}`,
    _type: "publication",
    title,
    slug: {
      _type: "slug",
      current: slugify(title) || slugify(openAlexId),
    },
    year: work.publication_year!,
    ...(doi ? { doi } : {}),
    journalOrConference,
    ...(externalUrl ? { externalUrl } : {}),
    ...(authorLine ? { authorLine } : {}),
    publicationType,
    researchAreas: [],
    ...(openAlexTopics.length ? { openAlexTopics } : {}),
    ...(suggestedIds.length ? { suggestedResearchAreas: toSuggestedResearchAreaRefs(suggestedIds) } : {}),
    isFeatured: true,
    displayOrder: 0,
  };
}

async function sendNotification(drafts: PublicationDraft[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL;
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail || apiKey.startsWith("re_your_")) {
    console.info(
      `[sync/publications] Created ${drafts.length} draft(s); email notification skipped (Resend not configured).`,
    );
    return;
  }

  const titles = drafts
    .map((draft) => `- ${draft.title}`)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `[NC Group] ${drafts.length} new publication draft(s) from OpenAlex`,
      text: `The publication sync created ${drafts.length} Sanity draft(s) for editor review (research areas may still need to be linked):\n\n${titles}`,
    }),
  });

  if (!response.ok) {
    console.error("Publication sync notification failed:", response.status, await response.text());
  }
}

async function syncPublications(sanityClient: WriteClient, lastSyncDate: string | null) {
  const raw = await fetchWorks(lastSyncDate);
  const droppedBefore2010 = raw.filter(
    (work) => typeof work.publication_year === "number" && work.publication_year < MIN_PUBLICATION_YEAR,
  ).length;
  if (droppedBefore2010 > 0) {
    console.info(
      `[sync/publications] Dropped ${droppedBefore2010} work(s) with publication_year < ${MIN_PUBLICATION_YEAR}`,
    );
  }

  const afterYearFloor = raw.filter(
    (work) => typeof work.publication_year !== "number" || work.publication_year >= MIN_PUBLICATION_YEAR,
  );
  const filtered = afterYearFloor.filter(isRealPublication);
  const deduped = dedupeWorks(filtered);
  const existing = await sanityClient.fetch<ExistingPublication[]>(EXISTING_PUBLICATIONS_QUERY);
  const researchAreaCatalog =
    await sanityClient.fetch<ResearchAreaRecord[]>(RESEARCH_AREAS_QUERY);

  const newDrafts = deduped
    .filter((work) => !isAlreadyInSanity(work, existing))
    .map((work) => mapToSanityDraft(work, researchAreaCatalog));

  for (const draft of newDrafts) {
    await sanityClient.createIfNotExists(draft);
  }

  await persistLastSyncDate(
    sanityClient,
    utcDateMinusDays(OPENALEX_CURSOR_OVERLAP_DAYS),
  );

  if (newDrafts.length > 0) {
    await sendNotification(newDrafts);
  }

  return {
    fetched: raw.length,
    droppedBefore2010,
    kept: deduped.length,
    created: newDrafts.length,
    since: lastSyncDate,
    drafts: newDrafts.map((draft) => ({
      _id: draft._id,
      title: draft.title,
    })),
  };
}

async function readSinceDate(request: NextRequest, allowBody: boolean) {
  const fromQuery = request.nextUrl.searchParams.get("since");
  let fromBody: string | undefined;

  if (allowBody) {
    try {
      const body = (await request.json()) as { since?: string };
      fromBody = body.since;
    } catch {
      fromBody = undefined;
    }
  }

  const since = fromBody ?? fromQuery;
  if (!since) return null;

  const parsed = parseIsoDate(since);
  if (!parsed) {
    throw new Error("Invalid since date. Use YYYY-MM-DD.");
  }

  return parsed;
}

async function handleSync(request: NextRequest, authPath: "cron" | "manual") {
  console.info(`[sync/publications] Starting sync via ${authPath} auth`);

  if (!writeToken) {
    return NextResponse.json(
      { message: "SANITY_API_WRITE_TOKEN is not configured." },
      { status: 503 },
    );
  }

  let sinceOverride: string | null;

  try {
    sinceOverride = await readSinceDate(request, authPath === "manual");
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid since date." },
      { status: 400 },
    );
  }

  try {
    const sanityClient = getWriteClient();
    const sinceDate = sinceOverride ?? (await getStoredLastSyncDate(sanityClient));
    const result = await syncPublications(sanityClient, sinceDate);

    if (result.created > 0) {
      revalidateCmsContent({ _type: "publication" });
    }

    console.info(
      `[sync/publications] Completed sync via ${authPath} auth`,
      { created: result.created, fetched: result.fetched, since: result.since },
    );
    return NextResponse.json({
      ok: true,
      authPath,
      ...result,
      sinceSource: sinceOverride ? "override" : sinceDate ? "stored" : "none",
    });
  } catch (error) {
    console.error(`[sync/publications] Sync failed via ${authPath} auth:`, error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Publication sync failed." },
      { status: 502 },
    );
  }
}

/** Vercel Cron sends GET (Authorization: Bearer CRON_SECRET when that env var is set). */
export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return unauthorized();
  }

  return handleSync(request, "cron");
}

/** Manual triggers use POST with SYNC_SECRET (Bearer or x-sync-secret). */
export async function POST(request: NextRequest) {
  if (!isManualAuthorized(request)) {
    return unauthorized();
  }

  return handleSync(request, "manual");
}
