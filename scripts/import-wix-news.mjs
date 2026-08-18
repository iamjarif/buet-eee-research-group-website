/**
 * Replace all Sanity activity/news documents with items scraped from the legacy Wix site.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-wix-news.mjs          # preview
 *   node --env-file=.env.local scripts/import-wix-news.mjs --apply    # mutate
 */

import { createClient } from "@sanity/client";

const WIX_NEWS_URL =
  "https://sdreambuet2024.wixsite.com/s-dreambuet/s-projects-side-by-side-1";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const dryRun = !apply;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13";
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();
const readToken = process.env.SANITY_API_READ_TOKEN?.trim();

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}

function createReadClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: readToken,
    useCdn: false,
  });
}

function createWriteClient() {
  if (!writeToken) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN. Add an Editor token to .env.local.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function block(text, key) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

function inferCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes("published on") || lower.includes("accepted to be presented")) {
    return "publication";
  }
  if (lower.includes("congratulations") && lower.includes("attending")) {
    return "event";
  }
  if (lower.includes("congratulations")) {
    return "news";
  }
  if (lower.includes("attended") || lower.includes("attending")) {
    return "event";
  }
  return "news";
}

function inferTitle(text) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.startsWith('Our work on "')) {
    const match = normalized.match(/^Our work on "([^"]+)"/);
    if (match) {
      return `${match[1]} published in Applied Physics Letters`;
    }
  }

  if (normalized.includes("Optically gated GaN transistors")) {
    return "Optically gated GaN transistors accepted to IEEE EDM 2024";
  }

  if (normalized.includes("Hole transport mechanism")) {
    return "Hole transport in p-GaN/AlGaN/GaN heterostructure published in APL";
  }

  if (normalized.includes("Mitsubishi Electric Research Laboratories")) {
    return "Dr. Chowdhury attends MERL talk on AI and wide-bandgap devices";
  }

  if (normalized.includes("Congratulations Toiyob")) {
    return "Toiyob presents at IEEE EDTM 2024";
  }

  if (normalized.includes("Bejoy Sikder")) {
    return "Bejoy Sikder accepted to MIT EECS and DMSE";
  }

  if (normalized.includes("Abdullah Jubair Bin Iqbal")) {
    return "Abdullah Jubair Bin Iqbal admitted to UCSB Materials";
  }

  if (normalized.includes("Ayan Biswas")) {
    return "Ayan Biswas admitted to Purdue ECE";
  }

  const sentence = normalized.split(/(?<=[.!?])\s+/)[0] ?? normalized;
  return sentence.length > 120 ? `${sentence.slice(0, 117)}…` : sentence;
}

function inferDate(text) {
  const lower = text.toLowerCase();
  if (lower.includes("fall 2024")) return "2024-08-15";
  return "2024-10-21";
}

async function fetchWixNewsItems() {
  const response = await fetch(WIX_NEWS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Wix page (${response.status})`);
  }

  const html = await response.text();

  const markers = [];
  const paragraphPattern =
    /<p[^>]*class="[^"]*font_[^"]*"[^>]*>([\s\S]*?)<\/p>/g;
  const imagePattern =
    /https:\/\/static\.wixstatic\.com\/media\/(9ede38_[^"']+~mv2\.(?:png|jpe?g))/g;

  for (const match of html.matchAll(paragraphPattern)) {
    const text = match[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    if (
      text.length > 40 &&
      !text.includes("Powered and secured") &&
      !text.includes("Create yours today")
    ) {
      markers.push({ type: "text", index: match.index, text });
    }
  }

  for (const match of html.matchAll(imagePattern)) {
    const base = `https://static.wixstatic.com/media/${match[1]}`;
    markers.push({ type: "image", index: match.index, base });
  }

  markers.sort((a, b) => a.index - b.index);

  const seenImages = new Set();
  const orderedImages = [];
  for (const marker of markers) {
    if (marker.type === "image" && !seenImages.has(marker.base)) {
      seenImages.add(marker.base);
      orderedImages.push({ index: marker.index, base: marker.base });
    }
  }

  const paragraphs = markers.filter((marker) => marker.type === "text");

  if (paragraphs.length === 0) {
    throw new Error("No news paragraphs found on the Wix page.");
  }

  return paragraphs.map((paragraph, index) => {
    const text = paragraph.text;
    const imageBefore = [...orderedImages]
      .reverse()
      .find((image) => image.index < paragraph.index);

    return {
      text,
      title: inferTitle(text),
      category: inferCategory(text),
      date: inferDate(text),
      imageUrl: imageBefore ? imageBefore.base : null,
      slug: slugify(inferTitle(text)),
      displayOrder: index,
    };
  });
}

async function uploadImageFromUrl(client, url, filename) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return client.assets.upload("image", buffer, { filename });
}

async function main() {
  console.log(`Fetching news from ${WIX_NEWS_URL}…`);
  const items = await fetchWixNewsItems();

  const readClient = createReadClient();
  const existing = await readClient.fetch(`*[_type == "activity"]{ _id, title }`);

  console.log("");
  console.log(`Found ${items.length} news items on Wix page.`);
  console.log(`Found ${existing.length} existing activity documents in Sanity.`);
  console.log("");

  for (const [index, item] of items.entries()) {
    console.log(`${index + 1}. ${item.title}`);
    console.log(`   category: ${item.category}  date: ${item.date}`);
    console.log(`   slug: ${item.slug}`);
    if (item.imageUrl) {
      console.log(`   image: ${item.imageUrl.split("/v1/")[0]}`);
    }
  }

  if (dryRun) {
    console.log("");
    console.log("Dry run — no mutations. Re-run with --apply to replace Sanity news.");
    return;
  }

  const client = createWriteClient();

  const homepageExists = await client.fetch(`defined(*[_id == "homepage"][0]._id)`);

  if (homepageExists) {
    console.log("");
    console.log("Clearing homepage featuredActivities references…");
    await client.patch("homepage").set({ featuredActivities: [] }).commit();
    console.log("✓ homepage references cleared");
  }

  console.log("");
  console.log("Deleting existing activities…");
  for (const doc of existing) {
    await client.delete(doc._id);
    console.log(`  ✗ deleted ${doc._id} (${doc.title})`);
  }

  const created = [];

  for (const item of items) {
    const id = `activity-wix-${item.slug}`.slice(0, 128);
    let imageField;

    if (item.imageUrl) {
      const ext = item.imageUrl.includes(".png") ? "png" : "jpg";
      const asset = await uploadImageFromUrl(
        client,
        item.imageUrl,
        `${item.slug}.${ext}`,
      );
      imageField = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: item.title,
      };
      console.log(`  ↑ uploaded image for ${item.slug}`);
    }

    const document = {
      _id: id,
      _type: "activity",
      title: item.title,
      slug: { _type: "slug", current: item.slug },
      date: item.date,
      category: item.category,
      description: [block(item.text, "body")],
      displayOrder: item.displayOrder,
      isPublished: true,
      ...(imageField ? { image: imageField } : {}),
    };

    await client.createOrReplace(document);
    created.push(document);
    console.log(`  ✓ ${item.title}`);
  }

  const homepageExistsAfter = await client.fetch(`defined(*[_id == "homepage"][0]._id)`);
  if (homepageExistsAfter) {
    await client
      .patch("homepage")
      .set({
        featuredActivities: created.slice(0, 4).map((doc) => ({
          _key: doc.slug.current.replace(/[^a-zA-Z0-9-]/g, "-").slice(0, 64),
          _type: "reference",
          _ref: doc._id,
          _weak: false,
        })),
      })
      .commit();
    console.log("✓ homepage featuredActivities updated (first 4 items)");
  }

  console.log("");
  console.log(`Imported ${created.length} news items into Sanity.`);
}

main().catch((error) => {
  console.error("\nImport failed:", error.message);
  process.exit(1);
});
