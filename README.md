# Codex Credit QR Codes

Small Next.js app for Codex ambassadors to generate printable QR-code handout cards from a CSV of credit URLs.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## CSV format

The app looks for `assigned_code_or_url` first, then falls back to URL-like columns such as `url`, `link`, or `code`.

```csv
requester,event,credit_type,assigned_code_or_url,newly_allocated
Codex Ambassador,https://luma.com/example-workshop,CODEX_CREDITS,chatgpt.com/p/YOUR-CODE-1,No
```

The bundled sample file uses fake `YOUR-CODE-*` values only.

## Checks

```bash
npm test
npm run typecheck
npm run build
```
