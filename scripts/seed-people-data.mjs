/**
 * NC Group people seed data.
 *
 * Source: the group's live team page, https://sdreambuet2024.wixsite.com/s-dreambuet/team
 * Names, positions, emails, alumni placements, profile links, and portraits are
 * transcribed from that page. Nothing here is invented — fields the live page
 * does not provide (research interests, biographies for students) are omitted so
 * they can be filled in Sanity Studio.
 */

const PORTRAIT_BASE_URL = "https://static.wixstatic.com/media/";

/** Portrait originals on the live site, keyed by person slug. */
const PORTRAITS = {
  "nadim-chowdhury": {
    mediaId: "9ede38_7f43b2d21fa44cbd95c69bc89e454283~mv2.png",
    filename: "Nadim-Chowdhury.png",
  },
  "md-rubel-raihan": {
    mediaId: "9ede38_8f93bdc9f8094549926a0b34c73b54a5~mv2.jpg",
    filename: "md-rubel-raihan.jpg",
  },
  "toiyob-hossain": {
    mediaId: "9ede38_f2428e8bc0f048ce89b3f9c937714cb0~mv2.png",
    filename: "toiyob-hossain.png",
  },
  "aurick-das": {
    mediaId: "9ede38_f72bcc67ab0a41eb906f0ae44495ed45~mv2.jpg",
    filename: "aurick-das.jpg",
  },
  "saimur-rahman-arnab": {
    mediaId: "9ede38_b0e23fcfcffc4bd4955c53920b66bf41~mv2.jpg",
    filename: "saimur-rahman-arnab.jpg",
  },
  "kaniz-fatema-supti": {
    mediaId: "9ede38_ba3846dd276e4258b21f6e000ee62322~mv2.jpg",
    filename: "kaniz-fatema-supti.jpg",
  },
  "prithu-mahmud": {
    mediaId: "9ede38_bf7a365d9039427885e2df0847968ae2~mv2.png",
    filename: "prithu-mahmud.png",
  },
  "md-tasnim-azad": {
    mediaId: "9ede38_519654abe49f4fc08b7d85b31ed44708~mv2.jpg",
    filename: "md-tasnim-azad.jpg",
  },
  "rafid-hassan-palash": {
    mediaId: "9ede38_23b0e2dcb61341a4a6669239ab946eb9~mv2.jpg",
    filename: "rafid-hassan-palash.jpg",
  },
  "tanushri-medha-kundu": {
    mediaId: "9ede38_279078944040489a854f61702a0dc905~mv2.jpg",
    filename: "tanushri-medha-kundu.jpg",
  },
  "khairul-islam": {
    mediaId: "9ede38_e8edbefea64041d48c9a156bee2ca099~mv2.jpg",
    filename: "khairul-islam.jpg",
  },
  "saif-ahmed-sunny": {
    mediaId: "9ede38_1cdc14696c794660a000fa6e72b8b860~mv2.jpg",
    filename: "saif-ahmed-sunny.jpg",
  },
  "akm-anindya-alam": {
    mediaId: "9ede38_f16c4da9433b499188761f1b6ba52aa1~mv2.jpg",
    filename: "akm-anindya-alam.jpg",
  },
  "tanvir-hossain": {
    mediaId: "9ede38_6f258609cd5d4bd69ac6ebcca88e76ee~mv2.jpg",
    filename: "tanvir-hossain.jpg",
  },
  "archishman-sarkar": {
    mediaId: "9ede38_3b2e4e8262b14dc9b646c63ffae821ad~mv2.jpg",
    filename: "archishman-sarkar.jpg",
  },
  "anudwaipaon-antu": {
    mediaId: "9ede38_e315539cd3c946278aa8b148978ffdd0~mv2.jpg",
    filename: "anudwaipaon-antu.jpg",
  },
  "bejoy-sikder": {
    mediaId: "9ede38_b5ed4daa98dc40e18077311fe39731c3~mv2.jpg",
    filename: "bejoy-sikder.jpg",
  },
  "abdullah-jubair-bin-iqbal": {
    mediaId: "9ede38_6ccc8f201fd14bb4b1a3bfd5ff5ac2b9~mv2.jpeg",
    filename: "abdullah-jubair-bin-iqbal.jpeg",
  },
  "ayan-biswas-pranta": {
    mediaId: "9ede38_47bca7a1f792441ea2742ffbcf980616~mv2.jpg",
    filename: "ayan-biswas-pranta.jpg",
  },
};

/**
 * displayOrder is spaced per group so editors can insert people later without
 * renumbering the whole roster.
 */
export const PEOPLE_SEED = [
  {
    slug: "nadim-chowdhury",
    name: "Dr. Nadim Chowdhury",
    position: "Assistant Professor, Department of EEE",
    group: "pi",
    displayOrder: 0,
    email: "nadim@eee.buet.ac.bd",
    biography:
      "Dr. Nadim Chowdhury is an Assistant Professor at BUET, specializing in semiconductor devices, particularly Gallium Nitride (GaN) technology. He earned his Ph.D. from MIT in 2022, focusing on GaN CMOS technology for high-performance electronics. His work has garnered multiple awards, and he holds several U.S. patents in the field.",
    externalProfileLinks: [
      {
        label: "Google Scholar",
        href: "https://scholar.google.com/citations?user=td7uFU4AAAAJ&hl=en&oi=ao",
      },
      {
        label: "CV",
        href: "https://drive.google.com/file/d/1ECmtygsBBuoR3QfJ1E1uZY7iabNsVIq9/view?usp=sharing",
      },
    ],
  },
  {
    slug: "md-rubel-raihan",
    name: "Md. Rubel Raihan",
    position: "PhD Student",
    group: "phd",
    displayOrder: 10,
    email: "0423064007@eee.buet.ac.bd",
  },
  {
    slug: "toiyob-hossain",
    name: "Toiyob Hossain",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 20,
    email: "toiyob.eee.buet@gmail.com",
    externalProfileLinks: [
      {
        label: "Website",
        href: "https://sites.google.com/view/thossain/home?authuser=0",
      },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/toiyobhossain/" },
    ],
  },
  {
    slug: "aurick-das",
    name: "Aurick Das",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 21,
    email: "0423062315@eee.buet.ac.bd",
  },
  {
    slug: "saimur-rahman-arnab",
    name: "Saimur Rahman Arnab",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 22,
    email: "0423062326@eee.buet.ac.bd",
  },
  {
    slug: "kaniz-fatema-supti",
    name: "Kaniz Fatema Supti",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 23,
    email: "0423062335@eee.buet.ac.bd",
  },
  {
    slug: "prithu-mahmud",
    name: "Prithu Mahmud",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 24,
    email: "0423062357@eee.buet.ac.bd",
  },
  {
    slug: "md-tasnim-azad",
    name: "Md. Tasnim Azad",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 25,
    email: "0423062328@eee.buet.ac.bd",
  },
  {
    slug: "rafid-hassan-palash",
    name: "Rafid Hassan Palash",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 26,
    email: "0424062332@eee.buet.ac.bd",
  },
  {
    slug: "tanushri-medha-kundu",
    name: "Tanushri Medha Kundu",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 27,
    email: "0424062320@eee.buet.ac.bd",
  },
  {
    slug: "khairul-islam",
    name: "Khairul Islam",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 28,
    email: "0424062305@eee.buet.ac.bd",
  },
  {
    slug: "saif-ahmed-sunny",
    name: "Saif Ahmed Sunny",
    position: "M.Sc. Student",
    group: "msc",
    displayOrder: 29,
    email: "0424062391@eee.buet.ac.bd",
  },
  {
    slug: "akm-anindya-alam",
    name: "A.K.M Anindya Alam",
    position: "Undergraduate Student",
    group: "undergrad",
    displayOrder: 40,
    email: "1906065@eee.buet.ac.bd",
  },
  {
    slug: "tanvir-hossain",
    name: "Tanvir Hossain",
    position: "Undergraduate Student",
    group: "undergrad",
    displayOrder: 41,
    email: "1906040@eee.buet.ac.bd",
  },
  {
    slug: "archishman-sarkar",
    name: "Archishman Sarkar",
    position: "Undergraduate Student",
    group: "undergrad",
    displayOrder: 42,
    email: "1906051@eee.buet.ac.bd",
  },
  {
    slug: "anudwaipaon-antu",
    name: "Anudwaipaon Antu",
    position: "Undergraduate Student",
    group: "undergrad",
    displayOrder: 43,
    email: "1906001@eee.buet.ac.bd",
  },
  {
    slug: "bejoy-sikder",
    name: "Bejoy Sikder",
    position: "Ph.D. Student",
    group: "alumni",
    displayOrder: 60,
    currentAffiliation: "Ph.D. Student, MIT EECS",
  },
  {
    slug: "abdullah-jubair-bin-iqbal",
    name: "Abdullah Jubair Bin Iqbal",
    position: "Ph.D. Student",
    group: "alumni",
    displayOrder: 61,
    currentAffiliation: "Ph.D. Student, UCSB Materials",
  },
  {
    slug: "ayan-biswas-pranta",
    name: "Ayan Biswas Pranta",
    position: "Ph.D. Student",
    group: "alumni",
    displayOrder: 62,
    currentAffiliation: "Ph.D. Student, Purdue ECE",
  },
];

export const PEOPLE_SEED_DOCUMENT_IDS = PEOPLE_SEED.map(
  (person) => `person-${person.slug}`,
);

export function getPortraitSource(slug) {
  const portrait = PORTRAITS[slug];
  if (!portrait) return undefined;

  return {
    url: `${PORTRAIT_BASE_URL}${portrait.mediaId}`,
    filename: portrait.filename,
  };
}

function buildBiographyBlocks(person) {
  if (!person.biography) return undefined;

  return [
    {
      _type: "block",
      _key: `${person.slug}-bio`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${person.slug}-bio-span`,
          text: person.biography,
          marks: [],
        },
      ],
    },
  ];
}

/** Builds the person document, attaching an uploaded portrait asset when available. */
export function buildPersonDocument(person, portraitAssetId) {
  const document = {
    _id: `person-${person.slug}`,
    _type: "person",
    name: person.name,
    slug: { _type: "slug", current: person.slug },
    position: person.position,
    group: person.group,
    displayOrder: person.displayOrder,
    isActive: true,
  };

  if (person.email) document.email = person.email;
  if (person.currentAffiliation) {
    document.currentAffiliation = person.currentAffiliation;
  }

  const biography = buildBiographyBlocks(person);
  if (biography) document.biography = biography;

  if (person.externalProfileLinks?.length) {
    document.externalProfileLinks = person.externalProfileLinks.map((link, index) => ({
      _type: "link",
      _key: `${person.slug}-link-${index}`,
      label: link.label,
      href: link.href,
      openInNewTab: true,
    }));
  }

  if (portraitAssetId) {
    document.photograph = {
      _type: "imageWithAlt",
      asset: { _type: "reference", _ref: portraitAssetId },
      alt: `Portrait of ${person.name}`,
    };
  }

  return document;
}
