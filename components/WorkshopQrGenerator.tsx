"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { parseWorkshopLinks, type WorkshopLink } from "../lib/csvLinks";
import {
  QR_DOT_STYLE_OPTIONS,
  type QrDotStyle
} from "../lib/qrDotStyle";
import { QrCanvas } from "./QrCanvas";

const CARDS_PER_PAGE = 6;

export function WorkshopQrGenerator() {
  const [links, setLinks] = useState<WorkshopLink[]>([]);
  const [fileName, setFileName] = useState<string>("No CSV loaded");
  const [error, setError] = useState<string>("");
  const [dotStyle, setDotStyle] = useState<QrDotStyle>("square");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pages = useMemo(() => chunkLinks(links, CARDS_PER_PAGE), [links]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const csvText = await file.text();
    loadCsv(csvText, file.name);
  }

  async function loadSampleCsv() {
    const response = await fetch("/sample_codex_credits.csv");
    const csvText = await response.text();
    loadCsv(csvText, "sample_codex_credits.csv");
  }

  function loadCsv(csvText: string, sourceName: string) {
    const parsedLinks = parseWorkshopLinks(csvText);
    setLinks(parsedLinks);
    setFileName(sourceName);
    setError(
      parsedLinks.length === 0
        ? "No links found. Use a CSV with assigned_code_or_url, url, link, or code values."
        : ""
    );
  }

  function clearCsv() {
    setLinks([]);
    setFileName("No CSV loaded");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <main className="app-shell">
      <section className="control-panel">
        <div className="brand-row">
          <Image
            src="/codex.webp"
            alt="Codex"
            width={48}
            height={48}
            priority
          />
          <div>
            <h1>Codex Workshop QR Generator</h1>
            <p>Upload credit URLs and print Codex handout cards.</p>
          </div>
        </div>

        <label className="upload-zone">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
          />
          <span className="upload-title">Choose a CSV file</span>
          <span className="upload-subtitle">
            Reads `assigned_code_or_url` first, then URL-like columns.
          </span>
        </label>

        <div className="button-row">
          <button type="button" onClick={loadSampleCsv}>
            Load sample CSV
          </button>
          <button type="button" onClick={() => window.print()} disabled={!links.length}>
            Print pages
          </button>
          <button type="button" className="secondary-button" onClick={clearCsv}>
            Clear
          </button>
        </div>

        <div className="style-control">
          <span>Dot style</span>
          <div className="segmented-control" role="group" aria-label="QR dot style">
            {QR_DOT_STYLE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={dotStyle === option.id}
                className={dotStyle === option.id ? "is-active" : ""}
                onClick={() => setDotStyle(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="status-grid">
          <div>
            <span>Source</span>
            <strong>{fileName}</strong>
          </div>
          <div>
            <span>QR cards</span>
            <strong>{links.length}</strong>
          </div>
          <div>
            <span>Print sheets</span>
            <strong>{pages.length}</strong>
          </div>
        </div>

        {error ? <p className="error-message">{error}</p> : null}
      </section>

      <section className="preview-panel" aria-live="polite">
        {links.length ? (
          <PrintPreview dotStyle={dotStyle} pages={pages} />
        ) : (
          <div className="empty-state">
            <Image src="/codex.webp" alt="" width={96} height={96} />
            <h2>No cards yet</h2>
            <p>Load the sample CSV or upload a workshop CSV to generate print pages.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function PrintPreview({
  dotStyle,
  pages
}: {
  dotStyle: QrDotStyle;
  pages: WorkshopLink[][];
}) {
  return (
    <div className="print-area">
      {pages.map((pageLinks, pageIndex) => (
        <div className="print-sheet" key={`page-${pageIndex}`}>
          {pageLinks.map((link, index) => (
            <QrCard
              key={link.id}
              dotStyle={dotStyle}
              link={link}
              number={pageIndex * CARDS_PER_PAGE + index + 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function QrCard({
  dotStyle,
  link,
  number
}: {
  dotStyle: QrDotStyle;
  link: WorkshopLink;
  number: number;
}) {
  return (
    <article className="qr-card">
      <div className="qr-card-header">
        <Image src="/codex.webp" alt="" width={28} height={28} />
        <div>
          <span>Codex Workshop</span>
          <strong>Credit access #{number}</strong>
        </div>
      </div>

      <div className="qr-frame">
        <QrCanvas dotStyle={dotStyle} value={link.url} size={270} />
      </div>

      <div className="link-block">
        <strong>{link.label}</strong>
        <span>{link.url}</span>
      </div>
    </article>
  );
}

function chunkLinks<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}
