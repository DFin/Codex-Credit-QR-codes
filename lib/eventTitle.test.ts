import { describe, expect, it } from "vitest";
import { DEFAULT_EVENT_TITLE, normalizeEventTitle } from "./eventTitle";

describe("event title", () => {
  it("uses the Göppingen community workshop title by default", () => {
    expect(DEFAULT_EVENT_TITLE).toBe("Codex Community Workshop Göppingen");
  });

  it("falls back to the default event title when the entered title is blank", () => {
    expect(normalizeEventTitle("   ")).toBe(DEFAULT_EVENT_TITLE);
  });
});
