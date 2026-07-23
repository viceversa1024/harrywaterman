# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start local dev server
- `npm run build` — Build static export (outputs to `out/`)
- `npm run lint` — Run ESLint
- No test framework is configured

## Architecture

This is a **Next.js 16** personal website using the App Router with **static export** (`output: 'export'` in next.config.ts). It uses Tailwind CSS v4 via PostCSS.

### Route Groups

Two route groups provide different layouts:

- **`(main)`** — Primary site pages (home, about, blog list, friends, reading, riting, rithmetic, zine). Uses `Navigation` sidebar + `Footer` in a two-column layout.
- **`(reader)`** — Blog post reader at `/blog/[slug]`. Minimal layout with just a `DarkModeToggle`, no navigation sidebar.

### Blog System

Blog posts are Markdown files in `posts/` with gray-matter frontmatter (title, date, excerpt). Rendered to HTML via remark + remark-html. The library code is in `lib/posts.ts`.

- `lib/posts.ts` — Reads/parses/sorts posts from `posts/*.md`
- `lib/alts.ts` — Parses multi-document frontmatter from `data/alts.md` for alternate bio entries on the home page

### Styling

All styles are in `app/globals.css` using plain CSS classes (not CSS modules or Tailwind utilities). Key layout classes: `.container`, `.two-column`, `.right-column`, `.footer`, `.reader-container`.

### Static Assets

`public/` contains images, PDFs, favicons, and zine assets. Since this is a static export, all images use `unoptimized: true`.

## Standalone pages (outside the Next.js app)

Some routes are plain hand-authored HTML dropped in `public/<name>/index.html` rather than App Router pages (e.g. `public/lateraldemo/`, `public/congress-oai-response/`). They deploy as-is with the static export.

### Congress OpenAI–Hugging Face tracker (`public/congress-oai-response/`)

A live, auto-updating tracker of congressional reactions to the July 2026 OpenAI/Hugging Face incident. It has moving parts beyond the HTML — rosters in `data/congress-tracker/`, a generated coverage map (`scripts/build-coverage.mjs`), and a **cloud routine that pushes to `main` every 4 hours**. Before touching any of it, read **`data/congress-tracker/README.md`** — it documents the routine, the roster handle-collision risk (do not publish unverified member accounts), the Apify setup and costs, and the frozen amplification snapshot.
