import * as cheerio from "cheerio";

export interface EQData {
  type: string;
  properties: RawEQData;
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export interface RawEQData {
  dateTime: string;
  location: string;
  depth: string;
  magnitude: string;
  isLatest?: boolean;
  url?: string;
}

export interface EQDetail extends RawEQData {
  origin: string;
  expectingDamage: string;
  expectingAftershocks: string;
  issuedOn: string;
  preparedBy: string;
}

export const parseEQList = (html: string): EQData[] => {
  const $ = cheerio.load(html);
  const list = [] as EQData[];

  const targetTable = $("table").eq(2);
  if (!targetTable || targetTable.length === 0) {
    console.warn("No third table found in the HTML.");
    return list;
  }

  targetTable.find("tbody tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length >= 6) {
      list.push({
        type: "Feature",
        properties: {
          dateTime: $(cols[0]).text().trim(),
          depth: $(cols[3]).text().trim(),
          magnitude: $(cols[4]).text().trim(),
          location: $(cols[5]).text().replace(/\s+/g, " ").trim(),
          url: $(cols[0]).find("a").attr("href")?.replace(/\\/g, "/") || "",
          isLatest: list.length === 0,
        },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat($(cols[2]).text().trim()), // longitude
            parseFloat($(cols[1]).text().trim()), // latitude
          ],
        },
      });
    }
  });

  return list;
};

export const parseEQDetail = (html: string): EQDetail => {
  const $ = cheerio.load(html);
  const detail = {} as EQDetail;

  const table1 = $("table table").first();
  const table2 = $("table table").eq(3);

  table1.find("tbody tr").each((_, row) => {
    const cols = $(row).find("td");

    if (cols.length < 2) return;

    const label = cols.eq(0).text().toLowerCase();
    const value = cols.eq(1).text().trim();

    if (label.includes("date")) detail.dateTime = value;
    if (label.includes("location")) detail.location = value.replace(/�/g, "°");
    if (label.includes("depth")) detail.depth = value;
    if (label.includes("magnitude")) detail.magnitude = value;
    if (label.includes("origin")) detail.origin = value;
  });

  table2.find("tbody tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length < 2) return;

    const label = cols.eq(0).text().toLowerCase();
    const value = cols.eq(1).text().trim();

    if (label.includes("damage")) detail.expectingDamage = value;
    if (label.includes("aftershocks")) detail.expectingAftershocks = value;
    if (label.includes("issued")) detail.issuedOn = value;
    if (label.includes("prepared")) detail.preparedBy = value;
  });

  return detail;
};
