"use client";

import { useEffect, useRef } from "react";
import qrcode from "qrcode-generator";

type QrCanvasProps = {
  value: string;
  size?: number;
};

const CODEX_BLUE = "#2442ff";
const CODEX_PURPLE = "#9188ff";
const QUIET_ZONE_MODULES = 4;
const CENTER_BADGE_SCALE = 0.265;
const CENTER_BADGE_EXTRA_PX = 4;
const CENTER_LOGO_FILL = 0.78;
const LOGO_SOURCE_INSET = 0.12;

export function QrCanvas({ value, size = 360 }: QrCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let cancelled = false;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size, size);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);

    const qr = qrcode(0, "H");
    qr.addData(value);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const moduleSize = size / (moduleCount + QUIET_ZONE_MODULES * 2);
    const offset = QUIET_ZONE_MODULES * moduleSize;
    const gradient = context.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, CODEX_PURPLE);
    gradient.addColorStop(0.45, "#5871ff");
    gradient.addColorStop(1, CODEX_BLUE);

    context.fillStyle = gradient;
    const moduleRadius = Math.max(1.2, moduleSize * 0.26);
    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (qr.isDark(row, col)) {
          roundedRect(
            context,
            offset + col * moduleSize,
            offset + row * moduleSize,
            Math.ceil(moduleSize),
            Math.ceil(moduleSize),
            moduleRadius
          );
          context.fill();
        }
      }
    }

    const logo = new Image();
    logo.onload = () => {
      if (cancelled) {
        return;
      }

      const baseBadgeSize = size * CENTER_BADGE_SCALE;
      const badgeSize = baseBadgeSize + CENTER_BADGE_EXTRA_PX;
      const logoSize = baseBadgeSize * CENTER_LOGO_FILL;
      const badgeX = (size - badgeSize) / 2;
      const badgeY = (size - badgeSize) / 2;
      const logoX = (size - logoSize) / 2;
      const logoY = (size - logoSize) / 2;
      const sourceSize = Math.min(logo.naturalWidth, logo.naturalHeight);
      const sourceInset = sourceSize * LOGO_SOURCE_INSET;
      const croppedSourceSize = sourceSize - sourceInset * 2;
      const sourceX = (logo.naturalWidth - sourceSize) / 2 + sourceInset;
      const sourceY = (logo.naturalHeight - sourceSize) / 2 + sourceInset;

      context.fillStyle = "#ffffff";
      roundedRect(context, badgeX, badgeY, badgeSize, badgeSize, size * 0.012);
      context.fill();

      context.drawImage(
        logo,
        sourceX,
        sourceY,
        croppedSourceSize,
        croppedSourceSize,
        logoX,
        logoY,
        logoSize,
        logoSize
      );
    };
    logo.src = "/codex.webp";

    return () => {
      cancelled = true;
    };
  }, [size, value]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`QR code for ${value}`}
      className="qr-canvas"
    />
  );
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}
