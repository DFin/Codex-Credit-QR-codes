import Papa from "papaparse";

export type WorkshopLink = {
  id: string;
  label: string;
  url: string;
};

const PREFERRED_COLUMNS = [
  "assigned_code_or_url",
  "url",
  "link",
  "code",
  "assigned_code"
];

const URL_LIKE = /^[a-z0-9.-]+\.[a-z]{2,}([/:?#].*)?$/i;

export function parseWorkshopLinks(csvText: string): WorkshopLink[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim()
  });

  const rows = parsed.data.filter((row) =>
    Object.values(row).some((value) => String(value ?? "").trim())
  );

  const columnName = pickColumn(rows);
  if (!columnName) {
    return [];
  }

  const seen = new Set<string>();
  const links: WorkshopLink[] = [];

  rows.forEach((row, index) => {
    const rawValue = String(row[columnName] ?? "").trim();
    if (!rawValue) {
      return;
    }

    const url = normalizeCodeOrUrl(rawValue);
    if (seen.has(url)) {
      return;
    }

    seen.add(url);
    links.push({
      id: `${index + 1}-${slugFromUrl(url)}`,
      label: labelFromUrl(url),
      url
    });
  });

  return links;
}

function pickColumn(rows: Array<Record<string, string>>): string | undefined {
  const headers = Object.keys(rows[0] ?? {});
  const headerByLowerName = new Map(
    headers.map((header) => [header.toLowerCase(), header])
  );

  for (const preferred of PREFERRED_COLUMNS) {
    const header = headerByLowerName.get(preferred);
    if (header) {
      return header;
    }
  }

  return headers.find((header) =>
    rows.some((row) => isUrlLike(String(row[header] ?? "").trim()))
  );
}

function normalizeCodeOrUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (isUrlLike(value)) {
    return `https://${value}`;
  }

  return value;
}

function isUrlLike(value: string): boolean {
  return /^https?:\/\//i.test(value) || URL_LIKE.test(value);
}

function labelFromUrl(value: string): string {
  try {
    const parsedUrl = new URL(value);
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    return segments.at(-1) ?? parsedUrl.hostname;
  } catch {
    return value;
  }
}

function slugFromUrl(value: string): string {
  return value
    .replace(/^https?:\/\//i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
