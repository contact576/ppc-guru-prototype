# Onboarding module — spec (founder vision)

*The way Jaydeep wants onboarding. Build to THIS. Guiding principle: **zero typing, everything automatic, "smooth as butter."** The owner should mostly *click to accept* pre-written suggestions; they CAN edit anything, but they should rarely need to.*

## Principle
- **Avoid making them write anything.** Every field arrives **pre-filled** from a crawl as a suggestion → they click to accept, or edit inline. **Every field editable, always** (even auto-filled ones).
- The feeling: it sets itself up; the owner just confirms.

## Step 1 — Connect (the only input)
Owner pastes **Google Business Profile URL + Website URL.** That's it.

## Step 2 — Auto-pull EVERYTHING available
Crawl every public source we can, then an LLM structures it:
- **Website** — services, hours, team, about, contact, pricing if shown.
- **Google Business Profile / Google Maps** — hours, phone, category, photos, **reviews**.
- **Instagram** — bio, posts/reels, tone/brand voice.
- **Facebook** — page info, reviews, posts.
- **Reviews everywhere** — Google, RateMD, etc. (mine for brand voice + common patient language).

Apify actors (pre-screen sources first, per the cost rule): `compass/crawler-google-places` (Google Maps/GMB + reviews), an Instagram scraper, a Facebook pages scraper, `apify/website-content-crawler`. Propose cost before running (per the working protocol).

## Step 3 — Auto-built, editable profile (click-to-accept)
Every field pre-filled as a suggestion; click ✓ to accept or edit inline. Fields: name · location · phone · disciplines/services · hours · team/clinicians · **insurers direct-billed** · **brand voice** (learned from reviews). All editable.

## Step 4 — Add your data (optional, but ONGOING)
Upload **ANY files / documents / their database** — patient export, price list, policies, FAQs, past (consented) call recordings. Not a one-time step — see the continuous flow below.

## Step 5 — Done
"Your AI receptionist is live" → land on **Today** (or a "test your agent" call).

---

## The continuous training flow (DESIGN THIS — founder's key ask)
The per-clinic database is **not a one-time import** — it **periodically keeps feeding** the knowledge base so the agent gets **better and better for that location**, and each location makes the **central brain** smarter about the industry.

```
Per clinic (tenant):
  uploads (DB, docs, price lists, FAQs) + the agent's OWN de-identified calls
     │  (periodic re-index)
     ▼
  clinic/<id>/ knowledge  ──► that clinic's agent gets sharper to ITS location/style
     │  (de-identified, aggregated patterns only — NO PHI)
     ▼
  central brain (universal + regional)  ──► every clinic's agent benefits (fleet learning)
```

- **PHI stays in the clinic's private, Canadian, BAA-covered space.** Only **de-identified, aggregated** patterns flow to the central brain (`PROJECT_BRIEF_v2.md`, `DATA_SPINE.md` PHI rules).
- **Periodic cadence** (e.g. nightly/weekly re-index) keeps each clinic's knowledge fresh as they add data.
- Maps onto `knowledge/` layers: clinic layer feeds per-tenant; de-identified aggregates enrich universal/regional.
- *(How much of this drives true model fine-tuning vs RAG retrieval is TBD — but the data WILL feed the agent. Start with RAG retrieval per the central-brain design; fine-tuning later if warranted.)*

## Build notes
- Demo version: simulate the crawl + show the click-to-accept editable profile + the upload + a line about "your agent keeps learning from this."
- Real backend: the Apify scrapers above + an LLM to structure → writes the `clinic/<id>/business-info` + feeds the training flow.
- This supersedes the first quick onboarding screen already in `patientroi/src/app.jsx` — rebuild it to this spec (spec-first, with founder review).
