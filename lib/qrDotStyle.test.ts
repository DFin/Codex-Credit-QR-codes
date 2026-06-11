import { describe, expect, it } from "vitest";
import { getQrDotRadius, QR_DOT_STYLE_OPTIONS } from "./qrDotStyle";

describe("QR dot styles", () => {
  it("exposes only square and circle styles", () => {
    expect(QR_DOT_STYLE_OPTIONS.map((option) => option.id)).toEqual([
      "square",
      "circle"
    ]);
  });

  it("maps square modules to sharp corners and circles to full radius", () => {
    expect(getQrDotRadius("square", 12)).toBe(0);
    expect(getQrDotRadius("circle", 12)).toBe(6);
  });
});
