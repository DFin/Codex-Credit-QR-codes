import { describe, expect, it } from "vitest";
import { SAMPLE_CSV_FILE_NAME, SAMPLE_CSV_PATH } from "./sampleCsv";

describe("sample CSV", () => {
  it("points to the bundled synthetic sample file", () => {
    expect(SAMPLE_CSV_FILE_NAME).toBe("sample_codex_credits.csv");
    expect(SAMPLE_CSV_PATH).toBe("/sample_codex_credits.csv");
  });
});
