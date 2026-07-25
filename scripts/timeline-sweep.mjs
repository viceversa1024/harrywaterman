#!/usr/bin/env node
// Daily deep sweep: pull every rostered member's recent tweets via Apify, filter to
// incident-signal tweets from members NOT already on the tracker, and write
// data/congress-tracker/timeline-candidates.json for the Claude judge step to evaluate.
//
// This is the method that catches keyword-less link-shares (e.g. a member posting a
// bare incident-article link) that the every-4h keyword/quote-mine sweep misses.
//
// Env:
//   APIFY_TOKEN            required (unless TIMELINE_CORPUS_FILE is set)
//   TIMELINE_CORPUS_FILE   optional: path to a saved corpus JSON, for local testing
//   GITHUB_OUTPUT          optional: CI writes `count=<n>` here to gate the judge step
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = join(root, "data/congress-tracker");
const PAGE = join(root, "public/congress-oai-response/index.html");
const OUT = join(D, "timeline-candidates.json");
const SINCE = "2026-07-20";
const MAX_ITEMS = 15000;
const SEEDS = new Set([
  "2079661132302995790", "2079754070965854541", "2079944311852945553",
  "2079658951264920020", "2080292134930792535", "2080283173238284423",
]);

const members = JSON.parse(readFileSync(join(D, "members.json")));
const official = JSON.parse(readFileSync(join(D, "official_handles.json")));
const personal = JSON.parse(readFileSync(join(D, "personal_handles.json")));
const byBio = new Map(members.map((m) => [m.bioguide, m]));

// handle(lower) -> member; and the ordered original-case handle list for from: queries
const h2m = new Map();
const origHandles = [];
const seen = new Set();
const addHandle = (handle, m) => {
  if (!handle) return;
  const k = handle.toLowerCase();
  if (!h2m.has(k)) h2m.set(k, m);
  if (!seen.has(k)) { seen.add(k); origHandles.push(handle); }
};
for (const r of official) addHandle(r.handle, byBio.get(r.bioguide));
for (const r of personal.verified || []) addHandle(r.handle, byBio.get(r.bioguide) || r);

// Incident signal: strict text, incident-linked URL, or a quote of a seed incident post.
// Deliberately narrow to limit false positives; the Claude judge step rejects the rest.
const STRICT = /(hugging\s?face|huggingface|gpt-?5\.?6|kill switch act|ai kill switch|went rogue|broke containment|escaped?.{0,20}(sandbox|containment)|out.?of.?control\s+ai|openai.{0,45}(hugging|went rogue|escap|sandbox|contain|hack|breach|incident|broke)|(model|models|ai system).{0,25}(escap|broke contain|hacked|went rogue))/i;
const URLR = /(openai.{0,15}hugging|hugging-?face|huggingface|ai-kill-switch|\/kill-switch|openai.{0,15}(hack|rogue|escap|sandbox|breach)|gpt-?5-?6|sol-model|openai-models)/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const g = (o, ...k) => { for (const x of k) if (o && o[x]) return o[x]; return null; };

async function pullCorpus() {
  const local = process.env.TIMELINE_CORPUS_FILE;
  if (local) { console.error(`[local] corpus from ${local}`); return JSON.parse(readFileSync(local)); }
  const TOKEN = process.env.APIFY_TOKEN;
  if (!TOKEN) throw new Error("APIFY_TOKEN not set");
  const auth = { Authorization: `Bearer ${TOKEN}` };
  const B = 20, queries = [];
  for (let i = 0; i < origHandles.length; i += B)
    queries.push("(" + origHandles.slice(i, i + B).map((h) => "from:" + h).join(" OR ") + `) since:${SINCE} -filter:retweets`);
  const start = await fetch("https://api.apify.com/v2/acts/apidojo~tweet-scraper/runs", {
    method: "POST", headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ searchTerms: queries, maxItems: MAX_ITEMS, sort: "Latest" }),
  });
  const runId = (await start.json())?.data?.id;
  if (!runId) throw new Error("apify run did not start");
  console.error(`[apify] run ${runId}: ${queries.length} batched queries, ${origHandles.length} handles`);
  for (let i = 0; i < 90; i++) {
    await sleep(10000);
    const s = (await (await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, { headers: auth })).json())?.data?.status;
    if (i % 3 === 0) console.error(`[apify] poll ${i + 1}: ${s}`);
    if (["SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"].includes(s)) break;
  }
  const items = await (await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?format=json&clean=true`, { headers: auth })).json();
  return Array.isArray(items) ? items : [];
}

function trackedFromPage() {
  const page = readFileSync(PAGE, "utf8");
  const ids = new Set([...page.matchAll(/status\/(\d+)/g)].map((m) => m[1]));
  const bios = new Set();
  for (const m of page.matchAll(/x\.com\/([A-Za-z0-9_]+)\/status/g)) {
    const mem = h2m.get(m[1].toLowerCase());
    if (mem && mem.bioguide) bios.add(mem.bioguide);
  }
  const names = new Set([...page.matchAll(/<td><b>([^<]+)<\/b><br>/g)].map((m) => m[1].trim()));
  for (const mem of members) if (names.has(mem.name) && mem.bioguide) bios.add(mem.bioguide);
  return { ids, bios };
}

function setOutput(n) {
  const f = process.env.GITHUB_OUTPUT;
  if (f) { try { writeFileSync(f, `count=${n}\n`, { flag: "a" }); } catch {} }
}

let corpus;
try { corpus = await pullCorpus(); }
catch (e) { console.error("[error] corpus pull failed:", e.message); writeFileSync(OUT, "[]"); setOutput(0); process.exit(0); }

const { ids: trackedIds, bios: trackedBios } = trackedFromPage();
const cand = new Map();
for (const o of corpus) {
  const au = g(o, "author", "user") || {};
  const h = au.userName;
  if (!h) continue;
  const m = h2m.get(String(h).toLowerCase());
  if (!m) continue;                                   // author must be a rostered member
  if (m.bioguide && trackedBios.has(m.bioguide)) continue; // member already on the page
  const id = String(g(o, "id", "tweetId") || "");
  if (trackedIds.has(id)) continue;
  const text = g(o, "text", "full_text", "fullText") || "";
  const q = g(o, "quoted_tweet", "quote", "quotedTweet", "quoted_status") || {};
  const qtext = (q && (q.text || q.full_text)) || "";
  const qid = String((q && (q.id || q.tweetId)) || "");
  const ents = g(o, "entities") || {};
  const urls = (ents.urls || []).map((u) => u.expanded_url || u.url || "");
  if (!(STRICT.test(text) || STRICT.test(qtext) || URLR.test(urls.join(" ")) || SEEDS.has(qid))) continue;
  const key = m.bioguide || m.name || h;
  if (!cand.has(key)) cand.set(key, {
    name: m.name, party: m.party, state: m.state, chamber: m.chamber, handle: h,
    id, url: g(o, "url", "twitterUrl"), when: g(o, "createdAt", "created_at", "date"),
    views: g(o, "viewCount", "views"), text: text.slice(0, 400),
    quotedAuthor: (q && q.author && q.author.userName) || null,
    quotedText: qtext.slice(0, 240), links: urls.slice(0, 3),
  });
}

const out = [...cand.values()];
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error(`[done] corpus ${corpus.length} tweets -> ${out.length} new-member candidate(s)`);
for (const c of out) console.error(`  @${c.handle} — ${c.name} (${c.party}-${c.state}, ${c.chamber}) id=${c.id}`);
setOutput(out.length);
