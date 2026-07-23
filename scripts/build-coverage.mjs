#!/usr/bin/env node
// Regenerates public/congress-oai-response/coverage/index.html from the
// account rosters in data/congress-tracker/. Run after any roster change:
//   node scripts/build-coverage.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const members = JSON.parse(readFileSync(join(root, "data/congress-tracker/members.json")));
const official = JSON.parse(readFileSync(join(root, "data/congress-tracker/official_handles.json")));
const personal = JSON.parse(readFileSync(join(root, "data/congress-tracker/personal_handles.json")));

const officialBy = new Map(official.map((r) => [r.bioguide, r.handle]));
const personalBy = new Map();
for (const e of personal.verified || []) {
  if (!e.bioguide) continue;
  if (!personalBy.has(e.bioguide)) personalBy.set(e.bioguide, []);
  personalBy.get(e.bioguide).push(e.handle);
}
const reviewCount = (personal.needs_review || []).length;

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const acct = (h) => `<a href="https://x.com/${esc(h)}">@${esc(h)}</a>`;

let both = 0, offOnly = 0, persOnly = 0, none = 0;
const rows = members
  .slice()
  .sort((a, b) => a.state.localeCompare(b.state) || a.last.localeCompare(b.last))
  .map((m) => {
    const off = officialBy.get(m.bioguide);
    const pers = personalBy.get(m.bioguide) || [];
    let cov;
    if (off && pers.length) { cov = "both"; both++; }
    else if (off) { cov = "official only"; offOnly++; }
    else if (pers.length) { cov = "personal only"; persOnly++; }
    else { cov = "NONE"; none++; }
    const covCell = cov === "NONE" ? `<b class="none">NONE</b>` : cov;
    return `<tr><td>${esc(m.name)}</td><td class="c">${esc(m.party)}&#8209;${esc(m.state)}</td><td class="c">${esc(m.chamber)}</td><td>${off ? acct(off) : "<span class=\"none\">none found</span>"}</td><td>${pers.length ? pers.map(acct).join(", ") : "<span class=\"muted\">none known</span>"}</td><td class="c">${covCell}</td></tr>`;
  })
  .join("\n");

const uncovered = members.filter((m) => !officialBy.get(m.bioguide) && !(personalBy.get(m.bioguide) || []).length);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Coverage map — Congress on the OpenAI–Hugging Face incident</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Lora', Georgia, serif; background-color: #f4efe0; color: #111; padding: 20px; line-height: 1.55; font-size: 16px; }
  .page { max-width: 980px; margin: 0 auto; padding: 40px 0 80px; }
  h1 { font-size: 26px; margin-bottom: 6px; }
  h2 { font-size: 19px; margin: 40px 0 10px; border-bottom: 1px solid #111; padding-bottom: 4px; }
  p { margin-bottom: 12px; max-width: 76ch; }
  a { color: #1a3b8f; }
  ul { margin: 0 0 14px 22px; }
  li { margin-bottom: 6px; max-width: 72ch; }
  .stamp { font-size: 13px; color: #555; margin-bottom: 24px; }
  .tablewrap { overflow-x: auto; margin: 14px 0; }
  table { border-collapse: collapse; width: 100%; min-width: 720px; font-size: 13.5px; }
  th { text-align: left; border-bottom: 2px solid #111; padding: 5px 10px 5px 0; font-size: 11.5px; text-transform: uppercase; letter-spacing: .06em; position: sticky; top: 0; background: #f4efe0; }
  td { border-bottom: 1px solid #d5cfb9; padding: 5px 10px 5px 0; vertical-align: top; }
  td.c { white-space: nowrap; }
  .none { color: #a33; }
  .muted { color: #888; }
  code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; background: #ece5d2; padding: 0 3px; }
  .back { font-size: 14px; }
</style>
</head>
<body>
<div class="page">
<p class="back"><a href="../">&larr; back to the tracker</a></p>
<h1>Coverage map: every account being searched</h1>
<p class="stamp">Generated ${new Date().toISOString().slice(0, 10)} from the rosters in <code>data/congress-tracker/</code>. This page exists so the tracker's coverage is checkable, member by member, rather than asserted.</p>

<h2>Summary</h2>
<ul>
  <li><b>${members.length}</b> current members of Congress tracked.</li>
  <li><b>${both}</b> covered on both an official and a personal/campaign account; <b>${offOnly}</b> official account only; <b>${persOnly}</b> personal only; <b class="none">${none}</b> with no X account found at all.</li>
  <li><b>${(personal.verified || []).length}</b> personal/campaign accounts verified; <b>${reviewCount}</b> more flagged plausible but unconfirmed (searched anyway, not shown here until confirmed).</li>
</ul>

<h2>What actually gets searched, and when</h2>
<ul>
  <li><b>Every 6 hours</b> (automated): news sweep for congressional reactions; senate.gov / house.gov / congress.gov checks; X scrape of incident keywords (<code>"Hugging Face" / "GPT-5.6" / "Kill Switch Act"</code>) and of all quote-tweets of Altman's disclosure post, with authors matched against every account on this page.</li>
  <li><b>Per-account timelines</b>: the accounts listed below are swept for incident references from Jul 20, 2026 onward.</li>
  <li><b>Reader tips</b>: verified against a primary source, then added; Signal <b>harry.01</b>.</li>
</ul>

<h2>Known gaps, stated plainly</h2>
<ul>
  <li>Members marked <b class="none">NONE</b> below (${none}) have no X presence in the rosters; they are only covered by the news/press sweep.</li>
  <li>Personal-account verification is conservative: an account needs a matching name plus a role-signaling bio, meaningful followers, or a verification badge. Real accounts can fail this bar; ${reviewCount} are in the unconfirmed bucket.</li>
  <li>Non-X channels (TV, local press, newsletters, Facebook/Instagram/Bluesky/Truth Social, floor speeches) are covered only insofar as news coverage reports them.</li>
  <li>The roster is a living file; accounts are added as they are discovered. A missing account on this page is exactly the kind of tip to send.</li>
</ul>

<h2>Members with no X coverage at all (${uncovered.length})</h2>
<p>${uncovered.length ? uncovered.map((m) => `${esc(m.name)} (${esc(m.party)}&#8209;${esc(m.state)})`).join("; ") : "None — every member has at least one account being searched."}</p>

<h2>The full map (${members.length} members)</h2>
<div class="tablewrap">
<table>
<tr><th>Member</th><th>Party&#8209;State</th><th>Chamber</th><th>Official account</th><th>Personal / campaign</th><th>Coverage</th></tr>
${rows}
</table>
</div>

</div>
</body>
</html>
`;

const outDir = join(root, "public/congress-oai-response/coverage");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
console.log(`coverage page written: ${members.length} members, ${both} both, ${offOnly} official-only, ${persOnly} personal-only, ${none} none`);
