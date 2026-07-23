#!/usr/bin/env node
// Regenerates public/congress-oai-response/changelog/index.html from git history.
// Lists every commit that touched the tracker, newest first, grouped by day.
// Run: node scripts/build-changelog.mjs   (the auto-update routine runs this too)
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PATHS = [
  "public/congress-oai-response",
  "data/congress-tracker",
  "scripts/build-coverage.mjs",
  "scripts/build-changelog.mjs",
];

const US = "\x1f"; // field sep
let raw = "";
try {
  raw = execSync(
    `git log --no-merges --pretty=format:'%cI${US}%s' -n 200 -- ${PATHS.join(" ")}`,
    { cwd: root, encoding: "utf8" }
  );
} catch {
  raw = "";
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const entries = raw.split("\n").filter(Boolean).map((line) => {
  const [iso, ...rest] = line.split(US);
  let subject = rest.join(US);
  // Drop the repetitive "congress-oai-response:" prefix; keep the rest as-is.
  subject = subject.replace(/^congress-oai-response:\s*/i, "");
  // Capitalize first letter for readability.
  subject = subject.charAt(0).toUpperCase() + subject.slice(1);
  const d = iso.slice(0, 10);
  return { day: d, iso, subject };
});

// group by day, preserving newest-first order
const byDay = [];
for (const e of entries) {
  let g = byDay.find((x) => x.day === e.day);
  if (!g) { g = { day: e.day, items: [] }; byDay.push(g); }
  g.items.push(e.subject);
}

const prettyDay = (d) => {
  const [y, m, day] = d.split("-");
  return `${MONTHS[+m - 1]} ${+day}, ${y}`;
};

const sections = byDay
  .map(
    (g) => `  <div class="day">
    <h2>${prettyDay(g.day)}</h2>
    <ul>
${g.items.map((s) => `      <li>${esc(s)}</li>`).join("\n")}
    </ul>
  </div>`
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Changelog — Congress on the OpenAI–Hugging Face incident</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Lora', Georgia, serif; background-color: #f4efe0; color: #111; padding: 20px; line-height: 1.55; font-size: 16px; }
  .page { max-width: 760px; margin: 0 auto; padding: 40px 0 80px; }
  h1 { font-size: 26px; margin-bottom: 6px; }
  .stamp { font-size: 13px; color: #555; margin-bottom: 28px; }
  .back { font-size: 14px; margin-bottom: 24px; }
  a { color: #1a3b8f; }
  .day { border-top: 1px solid #c9c2ac; padding-top: 14px; margin-top: 22px; }
  .day:first-of-type { border-top: none; margin-top: 0; padding-top: 0; }
  h2 { font-size: 16px; margin-bottom: 8px; }
  ul { margin: 0 0 4px 20px; }
  li { margin-bottom: 7px; max-width: 66ch; }
  .empty { color: #555; }
</style>
</head>
<body>
<div class="page">
<p class="back"><a href="../">&larr; back to the tracker</a></p>
<h1>Changelog</h1>
<p class="stamp">Every change to the tracker, newest first, generated from the repository's commit history. Entries dated after Jul 23, 2026 are from the automated 4-hour sweep.</p>
${sections || '<p class="empty">No changes recorded yet.</p>'}
</div>
<script>
  for (const a of document.querySelectorAll('a[href]')) {
    try { if (new URL(a.href, location.href).host !== location.host) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } } catch (e) {}
  }
</script>
</body>
</html>
`;

const outDir = join(root, "public/congress-oai-response/changelog");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
console.log(`changelog written: ${entries.length} commits across ${byDay.length} days`);
