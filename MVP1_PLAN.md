# MVP1 Plan — the synthetic PatientROI demo (for sign-off)

*Stage 0 of `Stages.canvas`: a clickable demo on **synthetic data**, **no PHI, no compliance, ~$0**. Its only job is to make a clinic owner say **"Jane can't show me this — I'd pay for that"** → an LOI (Stage 1). It is NOT the real product; it's the thing that proves the real product is worth building. Read with `DATA_SPINE.md` (it visualizes the spine), `JANE_TEARDOWN.md` (the gap it dramatizes), `MODULE_A_script.md` (the call flow it shows).*

**60-second sign-off doc.** Tell me to change anything; otherwise I build it.

---

## What it must prove (only two things)

1. **We capture the call Jane never sees.** The missed/after-hours/overflow call → AI answers → lead created, source-tagged, booked. Jane's world starts at "patient"; ours starts at the ad click. (`JANE_TEARDOWN.md`)
2. **We show ad-spend → lead → booked → paying → revenue, with cost-per-booked-patient & ROAS by channel.** The exact report Jane structurally cannot produce (no lead object, no spend, no attribution). This is the money shot.

If a clinic owner sees those two and gets the "aha," MVP1 did its job.

## Screens (3 + one drill-in)

1. **Owner Dashboard (hero)** — the funnel (Leads → Contacted → Booked → Paying) + **CPA & ROAS by channel** (Meta / Google / Google Business / Referral) + a headline tile: *"X after-hours calls recovered this month = $Y in booked revenue you'd have lost."* Money per-currency (CAD), owner-only framing.
2. **Call Inbox (Module A made visible)** — list of recovered calls: caller, time (lots after-hours), source channel, AI transcript, outcome (booked / message / out-of-area), → "booked" ones link to the lead.
3. **Leads / Pipeline (Module B lite)** — leads by stage, each showing its **source channel** + status; click → lead detail.
4. **Lead detail = the attribution chain visualized** — ad click → call (transcript) → booking → first visit → paying → revenue, the whole `DATA_SPINE §5` chain on one screen. This is the "wow, it connects the dollar to the patient" moment.

## Synthetic data (grounded in our research, not invented)

- One demo clinic: an Ontario multi-disciplinary allied-health clinic (physio + chiro + RMT).
- Channels with **real-ish economics**: Meta + Google + Google Business Profile + Referral; CPA anchored near the **$6.72** physio figure, monthly fees in the **$375–$2,400** range (`DECISION_MEMO`, `JANE_TEARDOWN`).
- ~40–60 leads across stages; ~15 recovered calls with **transcripts written from `MODULE_A_script.md`** (after-hours new-patient + cancellation-fill); realistic no-show/booked/paying mix.
- Built as the `DATA_SPINE` entities (Clinic, Channel, Lead, Call, Booking, Patient/Revenue) so the demo *is* the spine made visible.

## Tech (matches how this repo already works)

- **Same lightweight stack as the existing prototype:** in-browser React 18 + Babel-standalone, **no build step**, data + components in plain files. Cheap, fast, deployable on the Netlify/Vercel that's already wired to this repo.
- **New top-level folder `patientroi/`** — fully separate from the agency ERP in `prototype/` (different product; don't entangle).
- Deploys as its own static page; you click a link and demo it.

## Explicitly OUT of MVP1 (so we don't over-build)

Real Retell/telephony, real Meta/Google ad APIs, auth, multi-tenant, database, EMR write, any compliance/PHI. **All mocked.** Those arrive only at Stage 2 (real pilot, real money) — and only after a clinic says yes.

## Cost & success criterion

- **Cost: ~$0** (static prototype). Real spend waits for Stage 2.
- **Success: you can demo it to a clinic owner in 3 minutes and they get the "Jane can't show me this" aha** — and ideally say "I'd pay $X."

## Build order (once you sign off)

1. `patientroi/data.js` — synthetic clinic/channels/leads/calls/bookings/revenue over the spine.
2. Owner Dashboard (the hero).
3. Call Inbox + transcripts.
4. Leads + lead-detail attribution chain.
5. Polish + a one-screen "how it works" intro for demos.

## Runs parallel to this (your side, not blocking)

- **Retell voice listen-test** — the one tool check that matters now ("does it clear the robotic bar?"). Independent of the demo.

---

*On sign-off I start at build-order step 1. Say "go" or tell me what to change.*
