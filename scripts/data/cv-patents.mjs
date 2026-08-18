/**
 * Patents from Nadim Chowdhury CV (July 2026).
 * Granted section: 16 entries with Google Patents links.
 * Pending section: 3 application numbers (no external URLs in CV).
 */

function patentId(number) {
  return `patent-${number.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.slice(
    0,
    128,
  );
}

function slugFromNumber(number) {
  return number.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildPatent({
  patentNumber,
  title,
  inventorLine,
  year,
  status,
  externalUrl,
  displayOrder,
}) {
  return {
    _id: patentId(patentNumber),
    _type: "patent",
    title,
    slug: { _type: "slug", current: slugFromNumber(patentNumber) },
    patentNumber,
    inventorLine,
    status,
    year,
    displayOrder,
    ...(externalUrl ? { externalUrl } : {}),
  };
}

export const CV_GRANTED_PATENTS = [
  buildPatent({
    patentNumber: "US12520516B2",
    title: "Semiconductor device with a changeable polarization direction",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2026,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US12520516B2/en",
    displayOrder: 0,
  }),
  buildPatent({
    patentNumber: "US12501699B1",
    title: "Semiconductor device with vertically stacked GaN complementary FETs",
    inventorLine: "Nadim Chowdhury",
    year: 2025,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US12501699B1/en",
    displayOrder: 1,
  }),
  buildPatent({
    patentNumber: "US20250294864A1",
    title:
      "Compound semiconductor device for high power and high frequency operation",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2025,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US20250294864A1/en",
    displayOrder: 2,
  }),
  buildPatent({
    patentNumber: "US20250203907A1",
    title: "High electron mobility transistors with low specific on-resistance",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2025,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US20250203907A1/en",
    displayOrder: 3,
  }),
  buildPatent({
    patentNumber: "US20250307491A1",
    title:
      "Artificial intelligence assisted design and fabrication of semiconductor devices",
    inventorLine: "Koon Hoo Teo, Xiaofeng Xiang, Nadim Chowdhury, Eiji Yagyu",
    year: 2025,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US20250307491A1/en",
    displayOrder: 4,
  }),
  buildPatent({
    patentNumber: "US12113061",
    title: "Semiconductor device with linear capacitance",
    inventorLine: "Tomas Palacios, Nadim Chowdhury, Qingyun Xie",
    year: 2024,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US12113061/en",
    displayOrder: 5,
  }),
  buildPatent({
    patentNumber: "US11869946B2",
    title: "Etch-less AlGaN/GaN trigate transistor",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2024,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US11869946B2/en",
    displayOrder: 6,
  }),
  buildPatent({
    patentNumber: "US20240136121A1",
    title:
      "Passive negative inductor and a method for fabricating the passive negative inductor",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2024,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US20240136121A1/en",
    displayOrder: 7,
  }),
  buildPatent({
    patentNumber: "US11973134B2",
    title: "Super junction gated AlGaN/GaN HEMT",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2024,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US11973134B2/en",
    displayOrder: 8,
  }),
  buildPatent({
    patentNumber: "US11152471B1",
    title:
      "2-dimensional electron gas and 2-dimensional hole gas junction based semiconductor device",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2021,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US11152471B1/en",
    displayOrder: 9,
  }),
  buildPatent({
    patentNumber: "US10886393B2",
    title: "High electron mobility transistor with tunable threshold voltage",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2021,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US10886393B2/en",
    displayOrder: 10,
  }),
  buildPatent({
    patentNumber: "US10910480B2",
    title: "Transistor with multi-metal gate",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2021,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US10910480B2/en",
    displayOrder: 11,
  }),
  buildPatent({
    patentNumber: "US10622960B2",
    title: "Filters with virtual inductor implemented using negative capacitor",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2020,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US10622960B2/en",
    displayOrder: 12,
  }),
  buildPatent({
    patentNumber: "US10879368B2",
    title: "Transistor with multi-metal gate",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2020,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US10879368B2/en",
    displayOrder: 13,
  }),
  buildPatent({
    patentNumber: "US10658501B2",
    title: "Vertically stacked multichannel pyramid transistor",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2020,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US10658501B2/en",
    displayOrder: 14,
  }),
  buildPatent({
    patentNumber: "US10276704B1",
    title: "High electron mobility transistor with negative capacitor gate",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2019,
    status: "granted",
    externalUrl: "https://patents.google.com/patent/US10276704B1/en",
    displayOrder: 15,
  }),
];

export const CV_PENDING_PATENTS = [
  buildPatent({
    patentNumber: "US Patent App. 18/052,776",
    title: "Semiconductor Device with a Changeable Polarization Direction",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2025,
    status: "pending",
    displayOrder: 0,
  }),
  buildPatent({
    patentNumber: "US Patent App. 18/523,477",
    title:
      "Compound Semiconductor Device for High Power and High Frequency Operation",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2025,
    status: "pending",
    displayOrder: 1,
  }),
  buildPatent({
    patentNumber: "US Patent App. 18/537,865",
    title: "High Electron Mobility Transistors with Low Specific On-Resistance",
    inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
    year: 2025,
    status: "pending",
    displayOrder: 2,
  }),
];

export function buildCvPatents() {
  return [...CV_GRANTED_PATENTS, ...CV_PENDING_PATENTS];
}

export function cvPatentDocumentIds() {
  return buildCvPatents().map((patent) => patent._id);
}
