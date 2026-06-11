import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex Workshop QR Generator",
  description: "Generate printable QR handouts for Codex workshop credits."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
