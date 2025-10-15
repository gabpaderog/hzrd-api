import * as cheerio from "cheerio";
import { EQData, EQDetail } from "../types/earthquake.type";

const extractId = (url?: string): string => {
  if (!url) return "";
  const normalized = url.replace(/\\/g, "/");
  const match = normalized.match(/\d{4}_\d{4}_\d{4,6}_[A-Z0-9]+/);
  return match ? match[0] : "";
};

interface ParseOptions {
  year?: string;
  isCurrent?: boolean;
}

export const parseEQList = (
  html: string,
  options: ParseOptions = {}
): EQData[] => {
  const { year, isCurrent = false } = options;
  const $ = cheerio.load(html);
  const list: EQData[] = [];
  const targetTable = $("table").eq(2);

  if (!targetTable.length) {
    console.warn("No third table found in the HTML.");
    return list;
  }

  const skipRules: Record<string, number> = { "2018": 2, "2019": 1 };
  const skipCount = skipRules[year ?? ""] ?? 0;

  targetTable
    .find("tbody tr")
    .slice(skipCount)
    .each((_, row) => {
      const cols = $(row).find("td");
      if (cols.length < 6) return;

      const [dateTime, lat, long, depth, magnitude, location] = cols
        .toArray()
        .map((col) => $(col).text().trim());

      list.push({
        id: extractId(
          $(cols[0]).find("a").attr("href")?.replace(/\\/g, "/") ?? ""
        ),
        type: "Feature",
        properties: {
          dateTime,
          depth: parseInt(depth).toString() + " km",
          magnitude,
          location: location.replace(/\s+/g, " "),
          isLatest: isCurrent && list.length === 0,
        },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(long), parseFloat(lat)],
        },
      });
    });

  return list;
};

export const parseEQDetail = (html: string): EQDetail => {
  const $ = cheerio.load(html);
  const detail = {} as EQDetail;

  const table1 = $("table table").first();
  const table2 = $("table table").eq(1);
  const table3 = $("table table").eq(3);

  table1.find("tbody tr").each((_, row) => {
    const cols = $(row).find("td");

    if (cols.length < 2) return;

    const label = cols.eq(0).text().toLowerCase();
    const value = cols.eq(1).text().trim();

    if (label.includes("date")) detail.dateTime = value;
    if (label.includes("location")) detail.location = value.replace(/�/g, "°");
    if (label.includes("depth")) detail.depth = parseInt(value).toString() + " km";
    if (label.includes("magnitude")) detail.magnitude = value;
    if (label.includes("origin")) detail.origin = value;
  });

  table3.find("tbody tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length < 2) return;

    const label = cols.eq(0).text().toLowerCase();
    const value = cols.eq(1).text().trim();

    if (label.includes("damage")) detail.expectingDamage = value;
    if (label.includes("aftershocks")) detail.expectingAftershocks = value;
    if (label.includes("issued")) detail.issuedOn = value;
    if (label.includes("prepared")) detail.preparedBy = value;
  });

  detail.reportedIntensities = [];
  detail.instrumentalIntensities = [];

  table2.find("tbody tr").each((_, row) => {
    let text = $(row).find("td").eq(2).text().trim();
    text = text.replace(/This is an after\s*shock.*/i, "").trim();

    const [reportedText, instrumentalText] = text.split(
      /Instrumental Intensit(?:y|ies)\s*:/i
    );

    console.log(reportedText);

    const parseIntensities = (text: string) => {
      const regex =
        /Intensity\s+([IVX0-9]+)\s*-\s*([\s\S]*?)(?=Intensity\s+[IVX0-9]+\s*-|$)/gi;
      const groups: { intensity: string; locations: string[] }[] = [];

      let match;
      while ((match = regex.exec(text)) !== null) {
        const intensity = match[1].trim();
        const rawBlock = match[2].trim();

        const locations = rawBlock.includes(";")
          ? rawBlock
              .split(";")
              .map((loc) => loc.trim().replace(/�/g, "ñ"))
              .filter(Boolean)
          : [rawBlock.replace(/�/g, "ñ")];

        groups.push({ intensity, locations });
      }

      return groups;
    };

    const reportedIntensities = parseIntensities(reportedText || "");
    const instrumentalIntensities = parseIntensities(instrumentalText || "");

    console.log({
      reportedIntensities,
      instrumentalIntensities,
    });

    detail.reportedIntensities?.push(...reportedIntensities);
    detail.instrumentalIntensities?.push(...instrumentalIntensities);
  });

  return detail;
};
