# PROJECT BRIEF v2 — AI-Native CRM for Clinics (Canada-first → US)

*Locked decisions (founder synthesis). Supersedes the integration assumptions in v1 (`PROJECT_BRIEF.md`) where they conflict. **One correction flagged at top from our `JANE_INTEGRATION.md` research.***

## ⚠️ RECONCILIATION — one item in v2 is now outdated (Jane)
v2 says *"JANE: NO open API → Google Calendar bridge only (read schedule + create bookings); Kickcall does exactly this."* Our Jane-docs research (`JANE_INTEGRATION.md`) found **two corrections**:
1. **Jane DOES have an API now** — the **Jane Developer Platform (JDP)** (REST/OAuth2/webhooks, partner-gated/approval, not self-serve). So it's "no *self-serve* API," not "no API."
2. **The Google Calendar bridge CANNOT create bookings** — GCal→Jane only writes opaque "Busy" blocks (no patient/title); iCal is read-only. So "create bookings via calendar" is **not possible.**
**Fix to the plan (keeps the adapter-layer strategy):** Jane adapter = **own-the-funnel** (capture leads + book in OUR flow; hand the confirmed patient to Jane via **JDP partnership** when approved, **RPA bot** filling Jane's form as low-volume interim, or front-desk manual). **Do NOT rely on the calendar bridge for writes.** Everything else in v2 stands.

---

## What we're building
AI-native CRM + front-office automation for CLINICS — a vertical, compliant **GoHighLevel competitor**. Sits between a clinic's ad spend and their calendar/EMR: captures Meta/Google ad leads → instant **AI voice + SMS + email** follow-up → books appointments → recall/reactivation/reviews. **Does NOT replace the EMR.** Owner runs a marketing agency (distribution + domain edge; existing clinic clients = first customers).

## Vertical & sequence (DECIDED)
- **Product 1 = ALLIED HEALTH COMBINED:** physio + chiro + massage/RMT + acupuncture (one clinic, one front desk, one EMR → build ONE product, **configurable per discipline**). **Canada first.**
- **Product 2 = DENTAL, later** (separate ecosystem: Dentrix/ABELDent, charting, CDT codes).
- **Geography:** Canada (PHIPA/PIPEDA/Quebec Law 25) first → US (HIPAA) later.

## Build philosophy (DECIDED)
- **BUILD with Claude Code (custom):** the CRM app, automation/workflow engine, multi-tenancy, dashboards, attribution logic, **EMR adapter layer**, AI orchestration. (Custom-on-rented-rails beats no-code WeWeb/Xano — we have Claude + a dev.)
- **RENT (BAA-signed):** AI voice = **Retell** ($0.07/min, self-serve BAA); SMS = **Notifyre**; email = **AWS SES**; DB/infra = AWS/GCP HIPAA-eligible + **Canadian region**; auth = Clerk/Auth0; compliance = Vanta/Drata.
- AI voice is a **separate integrated service** (Retell via API, configured in our UI) — not built in-app.

## The AI "brain" (DECIDED — RAG, not fine-tune)
- **Don't train our own LLM.** Best = **RAG**: Claude (frontier reasoning) + a proprietary niche knowledge base ("the map") retrieved at query time.
- **Build the map:** ingest YouTube/community/competitor content via **Apify** → clean → chunk → embed (Voyage/OpenAI) → vector DB (**Supabase pgvector**/Pinecone). Store every fact with **source + confidence + date** (provenance). Build incrementally, interlinked.
- **Models:** Opus 4.8 ($5/$25) for hard reasoning; Haiku 4.5 ($1/$5) / Sonnet 4.6 ($3/$15) for high-volume (voice turns). **Prompt-cache the knowledge prefix** (~90% cheaper).
- Same KB powers (a) our build/market decisions and (b) grounding the voice agents (+ guardrails). **Keep PHI OUT of this corpus** (market data only).

## EMR connectivity (Canada — verified, w/ the Jane correction above)
- **Cliniko:** official **open API** → native sync (easy).
- **Juvonno:** robust API, explicitly **voice-AI-ready** → native sync (easy).
- **OSCAR:** open-source + APIs (medium).
- **JANE:** **JDP partner-gated API** (apply) + **own-the-funnel** interim; calendar bridge is **read-only mirror**, NOT a write path *(corrected)*.
- NexHealth/Sikka aggregators: US/dental-centric, don't cover Jane/Cliniko/Juvonno — only for later US dental.
- **STRATEGY: build our own EMR ADAPTER LAYER (one plugin per EMR).** Launch with **Cliniko + Juvonno (native API)** + **Jane (own-the-funnel + JDP later)**. Don't chase "all EMRs." *(Note: Cliniko/Juvonno are the easy clean-API wins; Jane is the biggest share but gated — own-the-funnel makes us less dependent on it.)*

## Single-source-of-truth rule (kills double data entry)
- Each field has ONE system of record; the other only **READS** it (auto, never manual).
- **Our CRM owns:** leads, marketing, pre-patient funnel, calls/transcripts. **EMR owns:** booked patients, charts.
- Write into EMR **once at booking**; read subsequent changes back. *(Matches `DATA_ARCHITECTURE.md`.)*

## AI onboarding + "vibe" customization (SEQUENCED)
- **Phase 1:** AI-driven **onboarding** — clinic talks to AI, AI configures their pipelines/workflows within guardrails (the adoption magic).
- **Compliance red-flag linter:** warns/blocks non-compliant workflows.
- **Phase 3:** constrained AI workflow-builder — users tweak via prompt but only compose **pre-vetted, BAA-covered SAFE BLOCKS**; never arbitrary code touching PHI.
- **Enabler:** build the automation engine as **composable safe blocks** from day one.

## Compliance reality + cost
- "Compliant tools" ≠ compliant product (shared responsibility): we own config, policies, risk assessment, BAAs (both ways), breach plan, lawyer review, possible Ontario **HINP** status. No buy-once cert — ongoing program.
- **Cost to compliant launch ~$30–70K** (vs $150–600K agency); ongoing ~$30–60K/yr.
- Levers: validate with **synthetic data** first (zero compliance spend) → **minimize PHI** (contact+appointment only) → rent compliant infra → defer audit until a customer requires it → **one regime (Ontario/PHIPA) first.**

## Method (AGREED) — research each module, then build it
Don't build a generic CRM. For each module (Pipeline, Leads, Automation, Calendar, AI Voice, Comms, Reviews, Reporting, AI Onboarding, Patient Profile): **tear down best-in-class** (GHL, HubSpot, Monday, Salesforce + Jane/Juvonno/Cliniko + Kickcall) via web + YouTube (Apify transcripts) → extract best patterns → spec OUR version → build. **Time-box; interleave research→build.** Big multi-agent sweep available on request.

## Competitors
GoHighLevel (generic, US-hosted), **Kickcall** (Canadian AI voice receptionist, Jane via Google Calendar, agency reseller — direct; our edge = broader AI growth platform + ad/attribution), NexHealth/Weave/Solutionreach (engagement), DeepCura/Omnipractice (AI-native EHR).

## Status / next (owner to pick)
1. First module to teardown+build [AI-Onboarding/Automation · Pipeline · AI Voice]
2. Scaffold Phase-0 validation MVP (synthetic data)
3. Start the RAG knowledge-base ingestion pipeline (= the Vertical Bible engine)
