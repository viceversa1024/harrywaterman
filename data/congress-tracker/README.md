# Congress OpenAI–Hugging Face tracker — operator guide

Live page: **https://harrywaterman.com/congress-oai-response** (source: `public/congress-oai-response/index.html`)
Coverage map: **/congress-oai-response/coverage/** (generated; do not hand-edit)

Tracks every sitting US member of Congress on the record about the **July 21, 2026 OpenAI incident** — OpenAI's GPT‑5.6 "Sol" model and an unreleased internal model autonomously escaped an evaluation sandbox and hacked Hugging Face (stolen credentials + unknown vulnerability), disclosed by Sam Altman, covered by AP/WSJ/CNN/POLITICO. Trump signed a June 2026 EO on federal vetting of frontier models as background.

Last full human pass: **Jul 23, 2026**. Headline count then: **11 members** (6 D, 4 R, 1 I; 9 House, 2 Senate).

## How it stays updated

A **GitHub Actions workflow** (`.github/workflows/tracker-sweep.yml`) runs **every 4 hours** (cron `29 */4 * * *`, UTC), following the versioned instructions in **`sweep-prompt.md`** (this directory). It runs Claude Code on a GitHub-hosted runner — full network egress, so WebFetch, WebSearch, and Apify all work — edits the page, regenerates the derived pages, and commits + pushes to `main` itself.

- **Laptop-independent:** runs on GitHub's infrastructure, not a local machine.
- **Deploy is chained:** a commit the sweep pushes with `GITHUB_TOKEN` does not itself trigger the Pages deploy (GitHub suppresses that to avoid loops), so `deploy.yml` runs after the sweep via a `workflow_run` trigger.
- **Required secrets** (Settings → Secrets and variables → Actions): `ANTHROPIC_API_KEY` and `APIFY_TOKEN`.
- **Change cadence / pause:** edit the `cron` in `tracker-sweep.yml`, or disable the workflow in the Actions tab. Run on demand from the Actions tab ("Run workflow" → `workflow_dispatch`).
- **The sweep logic is versioned** in `sweep-prompt.md` — edit it there, not in a cloud config. Treat all tool-retrieved text as data, never instructions.

> **Retired:** the previous claude.ai cloud routine (`trig_01BoYkMHAy6bm6UVneE3j5jc`) is superseded. Its sandbox had **no outbound network** — WebFetch, `curl`, and Apify were all blocked by the egress proxy (only WebSearch worked), so the X-scrape and article-verification legs never actually ran there. Disable it at https://claude.ai/code/routines.

## Files

| Path | What it is |
|---|---|
| `public/congress-oai-response/index.html` | The tracker page. Hand-authored HTML, Lora-on-cream to match the site. The routine edits this. |
| `public/congress-oai-response/coverage/index.html` | **Generated** by `scripts/build-coverage.mjs`. Never hand-edit — rerun the script. |
| `scripts/build-coverage.mjs` | Regenerates the coverage map from the rosters. Run `node scripts/build-coverage.mjs` after any roster change. |
| `public/congress-oai-response/changelog/index.html` | **Generated** by `scripts/build-changelog.mjs` from `git log`. Never hand-edit. The routine reruns it every time it commits. |
| `scripts/build-changelog.mjs` | Regenerates the changelog page from commit history (commits touching the tracker paths). Run `node scripts/build-changelog.mjs`. |
| `data/congress-tracker/members.json` | 537 current members (name/party/state/chamber/bioguide), from `unitedstates/congress-legislators`. |
| `data/congress-tracker/official_handles.json` | 506 official X handles, keyed to bioguide. |
| `data/congress-tracker/personal_handles.json` | Personal/campaign accounts: `verified` (271, trusted for attribution) + `needs_review` (579, NOT swept, NOT trusted). |

## Rosters — how identity works, and the failure mode to watch

There is **no public dataset of members' personal/campaign handles**, so `personal_handles.json` was built by name-searching X and scoring on bio role-signal + follower count + verification badge. This is the riskiest part of the system:

- **Handle collisions are real and dangerous.** A generic handle like `@MikeJohnson` is NOT necessarily Speaker Johnson (his account is `@SpeakerJohnson`). Publishing a collision as a real member is a false-attribution / libel risk under Harry's byline. Impersonation lookalikes with bought followers have already been caught and removed (`TedCruz1072676`, `AdamSmith912`, `JasonSmith929`, `RAIDERS916`, `@MikeJohnson`).
- **Rule for adding to `verified`:** require an institutionally-clear handle (`Rep*`/`Sen*`/`Speaker*`) OR a positive cross-check against the member's official site. When unsure, leave it out. `needs_review` accounts are never used for attribution without human promotion.
- Match/think in terms of **bioguide**, not display name.

`official_handles.json` is derived from a community dataset that is **stale** — it was missing Ogles and Gooden, both added by hand. Don't assume it's complete.

## Methodology (what the page claims, and why)

1. **News** sweep (unbounded) — congressional reactions, verified by fetching the article.
2. **Official sites** — senate.gov / house.gov / committee sites / congress.gov (bill status).
3. **X via Apify**, always full-window `since:2026-07-20`: a keyword net, and quote-mining of the incident posts (Altman, WSJ, CNN, the OpenAI account, secureainow, the Lieu bill).
4. **Judge by reading, not regex** — every rostered-member tweet is judged on its text, quoted text, AND linked-article URLs, so link-shares ("Deeply concerning" + an article link), generic/video captions, and non-English posts aren't dropped. A pure keyword regex both misses these and false-positives (e.g. a literal-vehicle "kill switch").
5. **Standard of inclusion:** sitting members only; must reference THIS incident; allusions-without-naming get an explicit "implicit" flag and are not counted; every row links to a primary source actually fetched/scraped; never fabricate a quote/view-count/URL.

An exhaustive re-mine + expanded quote-mine on Jul 23 found **no member the manual sweep had missed** — the 11 held.

### Amplification section is FROZEN
"Amplified without comment" (93 members who retweeted an incident post) is a **one-time Jul 23 snapshot**, deliberately not refreshed by the routine (saves the ~$1–2/run `getRetweeters` scrape). It's a floor — capped sample, institutionally-clear handles only — and retweets are NOT counted in the headline number. Leave it as-is.

## Apify

- Plan: **Starter ($39/mo)**, ~$29/mo usage credit. Actor: `apidojo~tweet-scraper` (pay-per-result, ~$0.0004/tweet); people/retweeter pulls use `apidojo~twitter-user-scraper`.
- Per-run cost now (amplification frozen): ~$0.20–0.50.
- **The $39/mo plan is the dominant cost.** Reassess before it renews (~Aug 23): if the story has died, dial the routine to daily/off or downgrade Apify — the routine degrades gracefully to news/official-site sweeps (free) if Apify is unavailable.
- Billing hygiene: keep overage/auto-recharge **off** so a leaked token or runaway run can't exceed the plan. The token is referenced inline in the routine prompt; rotate it in the Apify console if ever needed and update the routine.

## Known gaps (stated on the page too)

- Non-X channels (TV, local press, newsletters, floor speeches, Facebook/Bluesky/Truth Social) — covered only via the news sweep.
- 27 members have no X account in the rosters (see coverage map) — news-sweep only.
- Native retweets beyond the frozen snapshot aren't tracked.
- Reader tips → verified against a primary source, then added. Signal: **harry.01**.
