# Decision Memo — what we're building, and exactly how we got here

*The consolidated reasoning trail: the product, the derivation, the parameters we scored, why every other lane lost, and the competitive picture. Built from the 7-gate funnel (`OPPORTUNITY_FRAMEWORK.md`) + the lens skills + live research. Honest, not a pitch.*

---

## 1. What we're building (one sentence)

**An "acquisition intelligence" layer for service businesses** that joins **ad spend → lead → *booked, paying* customer → revenue**, and shows the owner their true cost-per-booked-customer by channel — something their CRM/EMR does NOT do.

- **Physio = "PatientROI"** — ad spend → lead → **booked patient** → revenue, per channel, per clinic.
- **Construction = "JobROI"** — ad spend → lead → **booked job** → revenue. Same engine, bigger ticket.
- **MVP = the attribution engine** (one business's *own* truth — needs only its own data; geography-independent; valuable day one).
- **Benchmark = the moat that *accrues*** as clinics/contractors join — **segmented by region** (Toronto ≠ Vancouver CPCs), not a "global model," and not credible until there's per-region density. It's the long-game defensibility, NOT the day-1 pitch. (See §6 caveat.)

## 2. How we came up with it (the path)

We started at the broadest point and let a disciplined funnel kill weak ideas until only the defensible one survived — twice, independently.

```
~550 keywords + SaaS-tool spectrum (Data Bible, all industries)
   → AI voice front desk            → commoditized, crowded, Jane/Jobber ship their own → DROP
   → agency-replacement software    → platform kill-zone (Meta/Google automate it free) → DROP
   → CRM vs AI-voice × 4 verticals  → CRMs are kill-zones; voice wins only on distribution
   → CORRECTED premise: no realtor distribution; real moat = cross-account paid
     conversion DATA, concentrated in PHYSIO + CONSTRUCTION (where we run lead-gen)
   → generate product concepts per vertical, score them
   → BOTH verticals independently converged on the SAME shape: ad→booked-outcome
     attribution + benchmark — the one place our data IS the product.
```

## 3. The parameters we scored (the rubric) — and how we measured each

Every candidate was scored 0–10 on 8 weighted parameters (sum /100, bar = 70):

| # | Parameter | Wt | How we measured it |
|---|---|---|---|
| 1 | **Pain intensity** | 18 | Review mining + owner surveys (74% of clinics can't see cost-per-new-patient by channel; only 25.8% know CAC) |
| 2 | **Demand (real, growing)** | 12 | Real first-party search data ($6.72 CPA physio, near-me→call) + the Data Bible spectrum |
| 3 | **Winnability** | 14 | Player census + Builder/Reseller/Platform tagging (most "competitors" are resellers) |
| 4 | **NOT a platform kill-zone** | 12 | Does the system-of-record give it free? (Jane routes marketing out + has no ad data; Jobber attribution is email-only, no paid-ad ROI → gap is outside their roadmap) |
| 5 | **Distribution / data fit** | 16 | Owned proprietary data + real clients (cross-account ad data; 7 owned clinics; ~4 GC clients) |
| 6 | **Moat that compounds** | 12 | Build-moat lens: UI-clonability vs data-replicability; integration tier; is our data the un-clonable input? |
| 7 | **AI-outcome fit** | 8 | Can AI reliably do the work, not just assist? |
| 8 | **Pricing / margin / scale** | 8 | Financial model: price-vs-COGS gate (low-inference software = 85%+ margin at $149–399; per-minute voice bleeds < $200) |

**Plus three hard gates** layered on top:
- **Integration tier (1–4):** can we connect to the system-of-record? (Jane = Tier 3 partner-gated; Juvonno/Cliniko = Tier 1–2 open; Jobber = Tier 2.)
- **CRM gravity:** the product must fill a gap in / integrate with the CRM the industry runs on, or target a no-CRM segment.
- **Public data ≠ moat:** only owned, proprietary data counts (this is what demoted realtor — realtor.ca is public).

## 4. Why we land here (the elimination logic)

| Lane | Why it lost |
|---|---|
| **CRM (any vertical)** | Kill-zone or commodity — Jane owns physio, Jobber owns trades, Zillow/eXp own realtor (bundle CRM free). Cloning a CRM = race to the bottom. |
| **AI voice front desk** | Core tech commoditized ("anyone resells Retell"); Jane/Jobber ship their own; per-minute COGS bleeds < $200/mo. Wins only as a thin distribution play, no durable moat. |
| **Realtor / immigration** | Demoted — no domain expertise, and the "10k realtor" asset is just public data, not distribution. |
| **Agency-replacement software** | Platform kill-zone — Meta Advantage+/Google PMax automate media-buying for free. |
| **★ Ad→booked-outcome attribution** | **Survived.** The ONLY lane where our cross-account paid-conversion data IS the product (un-clonable without owning dozens of accounts), it's NOT a kill-zone (the SoRs don't track ad ROI), high margin, and both verticals reached it independently. |

## 5. The competition we found

- **AI voice:** Avoca ($1B, home services), Smith.ai, Rebookly + Kickcall (physio+Jane), Jobber's own receptionist, + a white-label reseller flood. Crowded.
- **CRM / system-of-record:** Jane App (physio, 200k+ practitioners), Jobber (trades, 100k+), ServiceTitan ($6B), Zillow/Follow Up Boss, kvCORE/BoldTrail. Entrenched.
- **Attribution (our lane):** **Triple Whale / Northbeam** exist — but for **e-commerce**, not service businesses. **No physio- or construction-specific ad→booked-outcome attribution exists.** Jane routes marketing to Mailchimp and holds **no ad data**; Jobber's attribution is email-campaign-only with **no paid-ad ROI**. The specific lane — joining *paid ad spend* to *booked, paying* outcomes in these verticals — is **open**.

## 6. The honest caveats (what's NOT solved)

1. **Benchmark cold-start.** 7 Toronto clinics is not a benchmark, and CPCs are geo-specific — so the benchmark is an *accruing, region-segmented* moat, not a day-1 asset. **Day-1 value = attribution (each business's own data) + our domain expertise; the data moat hardens only as we scale per-geo.** Lead with attribution, never claim a "global benchmark."
2. **Booking-signal capture.** Physio has a clean signal (PMS holds the appointment). Construction is messier (~89% have no CRM) — joining "did this lead book?" needs call-tracking + a manual close-signal. This is why **physio goes first.**
3. **It's a hypothesis until an EXTERNAL customer pays.** Locked kill-criterion: a clinic we do NOT own pays ≥$149/mo. Owned-clinic enthusiasm doesn't count. If click→booked can't be reliably joined, or no external clinic pays, it's an internal agency capability — not a SaaS.

## 7. The decision

**Build PatientROI (physio) first** — attribution-first MVP, on the open systems-of-record (Juvonno/Cliniko Tier 1–2, Jane read-only), validated on the 7 owned clinics, then sold to one external clinic. **Construction (JobROI) is the proven expansion** — same engine, once the physio attribution stitch works.

*Evidence base: `physio_concepts.md`, `construction_concepts.md`, `matrix_*.md`, `score_*.md`, `demand_physio_rehabclinic.md`, `SaaS_Gap_Research_DATA_BIBLE.xlsx`. Method: `OPPORTUNITY_FRAMEWORK.md`. Living memory: `RESEARCH_BRAIN.md`.*
