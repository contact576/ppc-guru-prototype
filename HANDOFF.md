# HANDOFF — pending tasks & next-session continuation

*Read this first in any new session (esp. the fresh session scoped to the migrated repo `allied-health-saas`). It captures live state + the approved plan so work continues without re-deriving context. Companion: `RESEARCH_BRAIN.md` (full memory), `HOME.md` (Obsidian map), `DATA_SPINE.md`, `JANE_TEARDOWN.md`, `knowledge/README.md`.*

## ★ LATEST — continue here (end of session 1)

**New working rules the founder set (HONOR THESE):**
1. **Spec-each-module-first.** Before writing ANY CRM/demo code for a module, design it WITH the founder first — he tells you exactly how he wants it, you build only then. No autonomous CRM building.
2. **Pre-screen before paid scraping.** Before any scrape that costs money, first pull only the titles/sources, judge relevance yourself, DROP ads/promos/off-topic, then scrape only the keepers. (The first YouTube run wasted ~13 of 30 on junk — don't repeat.)

**Demo state (`patientroi/`, all on `main`):** 5 screens — **Onboard** (paste GBP+website → animated auto-discovery → editable clinic profile → upload step → "receptionist live"; default tab) · **Today** (while-you-were-closed recap + Start-here + callbacks + upcoming) · **Call Inbox** (recovered calls + transcript + sim) · **Dashboard** (CPA/ROAS by channel) · **Leads** (+ lead-detail drill-in = full ad→call→booking→revenue chain). In-browser React/Babel, no build step.

**Knowledge scraped & tagged (live Apify, ~$0.35 of a $10 budget):**
- `knowledge/universal/receptionist-skills/call-handling-playbook.md` + `booking-skills/care-first-booking.md` (from `supreme_coder/youtube-transcript-scraper`, $0.0005/transcript).
- `knowledge/regional/CA-ON/regulatory/advertising-consent-records.md` (CMTO solid; **PT + chiro thin, WSIB 404 — RE-FETCH**) + `insurance/provincial-rails.md` (OHIP) — via `apify/website-content-crawler` (free actor + compute).
- `knowledge/regional/CA-ON/insurance/direct-billing.md` (Telus eClaims net, Sun Life own-portal since 2022, ProviderConnect, Medavie/Pacific BC; no-coverage-$ rule encoded) — via `apify/rag-web-browser`.
Raw in `research/{frontdesk_training,regulatory_ca,insurance_ca}/`. **Apify is connected to session 1 via MCP — verify the new session has it (+ Vercel, GitHub) connected.**

**ONBOARDING — spec CAPTURED, ready to build → `product/ONBOARDING_SPEC.md`.** Founder's vision is locked: paste GBP+website → auto-pull **EVERYTHING** (website, Google Maps/GBP **reviews**, Instagram, Facebook, reviews everywhere) → **click-to-accept, every-field-editable, near-zero typing** ("smooth as butter") → upload ANY files/docs/database → a **continuous/periodic training flow** (per-clinic data sharpens that clinic's agent; de-identified aggregates strengthen the central brain — PHI stays Canadian). Build the demo to this spec (spec-first: show him before/at each step). Rebuilds the quick onboarding already in `patientroi/src/app.jsx`.

**Connections the new session needs (verify on start):** Apify MCP (actors used: `supreme_coder/youtube-transcript-scraper`, `apify/website-content-crawler`, `apify/rag-web-browser`; onboarding will add `compass/crawler-google-places` + Instagram + Facebook scrapers), Vercel MCP (team "JP's projects"), GitHub MCP. If any is missing in the new chat, ask the founder to connect it.

**Merge / repo state:** `main` of `ppc-guru-prototype` is FULLY CURRENT — nothing pending to merge. New repo `allied-health-saas` = a one-time **import** of this repo (captures everything). After import, **work ONLY in `allied-health-saas`** (treat `ppc-guru-prototype` as archived) to avoid two-repo confusion.

**Migration (the reason for this new session):** new repo `allied-health-saas` = imported from `ppc-guru-prototype` (main is current). REORG TASK: agency ERP (`prototype/ src/ netlify/` + agency CLAUDE.md) → `legacy/`; AlliedHealth at root; clean README; `.obsidian` ignore for `legacy/`+raw `research/`. Vercel: new project on `allied-health-saas`, **Root Directory = `patientroi`**, team "JP's projects" → the single clean production URL.

**Data wave remaining (with pre-screen rule):** re-fetch PT+chiro college standards + WSIB; Ontario clinic pricing → `CA-ON/pricing`; Instagram/GMB later (propose cost first).

## Where we are (June 2026)
Research phase essentially complete: Jane fully torn down (+ confirmed NOT entering our space), vertical voice captured (`vertical/VOICE_OF_CUSTOMER.md`), **data spine locked** (`DATA_SPINE.md`), **Module A spec'd + scripted** (`product/MODULE_A_voice.md` + `MODULE_A_script.md`), and the **synthetic PatientROI demo built** (`patientroi/`, live on Vercel). Knowledge-base architecture locked (`knowledge/`). Now: **build the knowledge base via Apify MCP + extend the demo.**

## A) Repo migration (IN PROGRESS)
- Decision: **fresh repo `allied-health-saas`** for the venture; agency ERP (`prototype/`, `src/`, `netlify/`, agency `CLAUDE.md`, etc.) → **`/legacy`** (non-destructive).
- This session is scope-locked to `contact576/ppc-guru-prototype` (can't create/push a new repo). User imports it via Chrome extension (`github.com/new/import` ← public clone URL → `allied-health-saas`, private), then opens a **new Claude session scoped to the new repo**.
- **REORG TASK (do in the new repo's session):** move agency ERP → `legacy/`; keep AlliedHealth docs at root; write a clean `README.md` branded **AlliedHealth SaaS**; add `.obsidian` ignore-config hiding `legacy/` + raw `research/` dumps; optionally restructure to `01-strategy/ 02-product/ 03-vertical/ 04-research/ knowledge/ patientroi/`. Keep `HOME.md` as the front door.
- Vercel: new project on `allied-health-saas`, **Root Directory = `patientroi`**, team "JP's projects" → clean production URL (auto-deploys on push to main).

## B) Knowledge base — the approved scrape plan (Apify via MCP)
**Working protocol (user-approved standing practice):** before running any actor, state **actor · why · est. cost · data volume**; confirm exact cost via `fetch-actor-details`; then execute without per-item approval. User gives feedback/allowance on the plan, not each call. All data **< 2 years old**; distill + tag into `knowledge/` per `_schema/SCHEMA.md` (region + freshness + status); raw → `/research/`.

| # | Target → bucket | Apify actor (proposed) | Why | Volume | Est. cost |
|---|---|---|---|---|---|
| 1 | **Receptionist + care-first booking skills** → `universal/` | YouTube **search** actor (e.g. `streamers/youtube-scraper`) → filter 2024–26 → **transcript** actor (the one used for Radio FD: `pintostudio/youtube-transcript-scraper`) | Tunes how the agent runs a call; backbone | ~40–60 videos | low (~$1–3) |
| 2 | **CA insurance / direct-billing** → `regional/CA-ON/insurance/` (+ `region: CA` for national insurers) | `apify/rag-web-browser` (targeted URLs → clean markdown) | Most volatile/time-sensitive; grounds the insurance Q&A | ~15–25 pages | low (~$1–2) |
| 3 | **Ontario regulatory** → `regional/CA-ON/regulatory/` | `apify/rag-web-browser` | College of Physio ON / CMTO / chiro college advertising+consent+records | ~10–15 pages | low |
| 4 | **Ontario clinic pricing** → `regional/CA-ON/pricing/` | `apify/website-content-crawler` or `rag-web-browser` | Current fee ranges (annual) | ~10–15 clinic fee pages | low |
| 5 (later) | **Instagram / FB / GMB** — recent patient-facing language + competitor ad creative | `apify/instagram-scraper`, `apify/facebook-pages-scraper`, `compass/crawler-google-places` | How clinics talk to patients NOW; ad creative | a few handles, recent posts | moderate — propose separately |

**Insurance source URLs (target):** Telus eClaims provider/insurer pages; Sun Life · Manulife · Canada Life · (Ontario) Blue Cross paramedical (physio/chiro/massage) coverage; provincial rails (OHIP physio limits, WSIB, auto/MVA-FSRA) = `region: CA-ON`.
**Regulatory:** College of Physiotherapists of Ontario, CMTO (massage), College of Chiropractors of Ontario — advertising standards, consent, record-keeping.

## C) YouTube search strategy (skills #1) — queries, then filter to 2024–26
Run a YouTube search actor on these, keep only `2024–2026`, relevance-rank, then transcript-scrape the selected set (don't hand-pick channels — let recency + relevance decide):
- "medical front desk phone training" · "clinic receptionist new patient call role play" · "physiotherapy clinic reception call handling" · "how to handle patient phone inquiries clinic" · "convert phone inquiry to booking physiotherapy" · "allied health front desk customer service" · "dental/physio receptionist phone skills".
(Care-first filter: drop hard-sell/"closing" bro content; keep service/empathy-led.)

## D) PatientROI demo — next build
**Lead-detail drill-in:** click any lead → full `ad-click → call → booking → first-visit → paying → revenue` chain on one screen (the "it connects the dollar to the patient" wow). Then optional: "what Jane shows vs what we show" side-by-side; after-hours-recovery trend. Demo is synthetic — runs parallel to KB work.

## E) User-side / pending
- **Clinic reception calls** — collected AFTER onboarding clinics (consented + de-identified) → `clinic/<id>/calls-deidentified/`. Deferred.
- **3 Jane tests** (run on an existing clinic's Jane login, free): booking URL keeps `?utm_`? JDP exposes appointment read/write? GA4 `appointment_booked` carries source? → `JANE_TEARDOWN.md §8`.
- **Retell voice listen-test** — clear the "robotic" bar before any live clinic (`MODULE_A_script.md §6 Q1`).
- Paste the **new Vercel production URL** once created → verify build via connector.

## Locked rules to honor
Own-the-funnel (lead/call/booking are OURS, patient→Jane later) · one-writer-per-field + event decoupling (`DATA_SPINE`) · PHI stays Canadian + out of the KB (de-identified aggregates only) · care-first never salesy · <2yr data only · never quote insurance coverage $.
