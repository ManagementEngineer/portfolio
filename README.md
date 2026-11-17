# ramuel.ca — Ramuel Batuigas

Personal site. A short first-person letter, then a dated log of what I shipped, measured, held, killed and reversed, drawn as a flow process chart. Three case studies sit one click down.

## Stack

Vite · React 19 · TypeScript. No backend, no animation library. Fonts are self-hosted (Besley, Commissioner, DM Mono).

## Editing content

All copy, work entries, log entries and case studies live in `src/data/site.ts`. Every number carries its time window and its source; keep that true when you change one.

Routes: `/`, `/log`, `/work/ai-credits`, `/work/what-sells`, `/work/fixed-was-false`.

## Commands

```sh
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```
