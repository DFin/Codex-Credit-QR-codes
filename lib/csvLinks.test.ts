import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parseWorkshopLinks } from "./csvLinks";

describe("parseWorkshopLinks", () => {
  it("extracts assigned_code_or_url values from the workshop CSV", () => {
    const csv = [
      "requester,event,credit_type,assigned_code_or_url,newly_allocated",
      "David,https://luma.com/event,CODEX_CREDITS,chatgpt.com/p/ABC123,Yes",
      "David,https://luma.com/event,CODEX_CREDITS,https://chatgpt.com/p/DEF456,Yes"
    ].join("\n");

    expect(parseWorkshopLinks(csv)).toEqual([
      {
        id: "1-chatgpt-com-p-abc123",
        label: "ABC123",
        url: "https://chatgpt.com/p/ABC123"
      },
      {
        id: "2-chatgpt-com-p-def456",
        label: "DEF456",
        url: "https://chatgpt.com/p/DEF456"
      }
    ]);
  });

  it("falls back to the first URL-like column and removes empty duplicates", () => {
    const csv = [
      "name,url",
      "first,example.com/a",
      "empty,",
      "duplicate,https://example.com/a",
      "second,https://example.com/b"
    ].join("\n");

    expect(parseWorkshopLinks(csv)).toEqual([
      {
        id: "1-example-com-a",
        label: "a",
        url: "https://example.com/a"
      },
      {
        id: "4-example-com-b",
        label: "b",
        url: "https://example.com/b"
      }
    ]);
  });

  it("keeps the bundled public sample synthetic", () => {
    const csv = readFileSync(
      new URL("../public/sample_codex_credits.csv", import.meta.url),
      "utf8"
    );

    const links = parseWorkshopLinks(csv);

    expect(links).toHaveLength(12);
    expect(links[0]).toMatchObject({
      label: "YOUR-CODE-1",
      url: "https://chatgpt.com/p/YOUR-CODE-1"
    });
    expect(csv).toContain("YOUR-CODE-12");
  });
});
