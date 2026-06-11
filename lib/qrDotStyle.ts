export const QR_DOT_STYLE_OPTIONS = [
  { id: "square", label: "Squares" },
  { id: "circle", label: "Circles" }
] as const;

export type QrDotStyle = (typeof QR_DOT_STYLE_OPTIONS)[number]["id"];

export function getQrDotRadius(style: QrDotStyle, moduleSize: number) {
  return style === "circle" ? moduleSize / 2 : 0;
}
