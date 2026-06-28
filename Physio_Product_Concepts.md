# Physio Product Shortlist — Concepts, Scored & Ranked

**Founder:** Jaydeep — PPC agency + owns 7 physio clinics + 1 psych clinic. Team = him + 1 dev (Shrikaanth) + Claude Code. Canada-first. Price band $50–400/mo. Open to free-wedge→data→upsell.
**Decisive moat input:** proprietary **cross-clinic paid-ad → lead → booked-patient conversion data** across dozens of physio clinics (his agency runs their Google/Meta). A single clinic sees only its own funnel; he sees *which ads/keywords/lead-types convert to booked, paying patients across the whole market* — a data-network-effect no clinic or pure-software competitor can replicate. Plus 8 owned clinics = customer-zero + design partners.
**Date:** 2026-06-26 · **Analyst stance:** ruthless vertical-SaaS operator + YC partner. **Bar to build: ≥70/100.** Estimates tagged `[E]`; measured/sourced tagged `[M]`.

> **One-line verdict up front:** Build the **Patient-Acquisition ROI / Attribution layer** (cross-clinic conversion intelligence), score **76**. It is the *only* concept where Jaydeep's data is the product, not a garnish — everything else is a feature anyone can clone. Reactivation (**71**) is the fast-cash bolt-on beside it. Everything voice/intake/reviews is a commodity that scores below the bar.

---

## PART 1 — THE PHYSIO CRM-GRAVITY STACK (live research)

Everything in this vertical orbits the **system of record (SoR)** — the practice-management/EMR that owns appointments, patient lists, visit history, discharge status, and billing. You cannot build a serious physio product without a stance on which SoRs you read/write and at what integration tier. **Tier legend:** **1** = open/self-serve public API · **2** = OAuth + light review · **3** = partner-gated (intake + approval committee) · **4** = none/closed.

### 1.1 The stack, ranked by gravity

| SoR | Position in Canada | API openness (tier) | Notes |
|---|---|---|---|
| **Jane App** | **Dominant** allied-health SoR. North-Van-built (2012), **200k+ practitioners**, the default for Canadian physio/RMT/chiro on the strength of **TELUS eClaims / Teleplan / PROVIDERnet** insurance billing. `[M]` | **Tier 3 — partner-gated.** Jane's own developer material: *"not launching an open, public API… a vetted partnership pathway."* JDP issues OAuth2 tokens to **approved "Jane Extensions"** only; marketplace "coming soon." `[M]` | The judge, jury, gatekeeper **and future competitor** for any layer it chooses to build. Read is plausible once approved; **write-back is where it gates hardest**. |
| **Juvonno** | Strong Canadian multi-location player; **5,000+ providers**, advanced/group reporting. `[M]` | **Tier 1–2 — OPEN API.** Markets *"Juvonno's open API"* + a public `/developers` page. `[M]` | The **open-door alternative** to Jane. Fewer clinics, but write-access is realistic. |
| **Cliniko** | Popular simple/stable SoR; strong outside-Canada too. `[M]` | **Tier 1 — public REST API** at `docs.api.cliniko.com` + "Connected Apps." `[M]` | Truly self-serve. Best technical surface to build against. |
| **Noterro** | Grew from RMT charting → full PMS; AI scribe bundled. `[M]` | **Tier ~2 `[E]`** — integrations exist, no prominent public API docs surfaced. | Massage-leaning base. |
| **ClinicSense** | SOAP-notes + marketing-tool PMS, massage-leaning. `[M]` | **Tier ~2 `[E]`** — partner/integration model, no self-serve public docs surfaced. | Already ships some marketing → competes with reactivation. |
| **Telus Health / Health Quest, Practice Perfect** | Legacy/enterprise, EMR-heavy. `[M]` | **Tier 3–4 `[E]`** — enterprise, closed/partner-only. | Slow, gated, not a startup surface. |

### 1.2 The decisive structural fact

**The dominant SoR (Jane) is the *most closed* (Tier 3); the open SoRs (Juvonno, Cliniko, Tier 1–2) are the *minority* by clinic count.** This shapes every concept below:

- A product whose value **lives inside the SoR's write path** (book/reschedule/cancel — e.g. voice front desk, smart scheduling) is at Jane's mercy and competes with Jane-approved incumbents already inside the program. **Avoid the write-heavy path.**
- A product whose value **lives in data Jane doesn't own and a layer Jane abstains from** — i.e. *paid-ad attribution, marketing ROI, lead-conversion intelligence* — can run **read-mostly / SoR-light** and is **not in Jane's roadmap** (Jane routes marketing to Mailchimp; it has no ad data and no reason to ingest Google/Meta spend). **This is the safe lane, and it's exactly where Jaydeep's data is the moat.**

### 1.3 The gaps the stack leaves (where the white space is)

Ranked by how poorly the SoR stack serves them × how well Jaydeep's assets fit:

| Gap | How badly the stack serves it | Jaydeep-fit |
|---|---|---|
| **① Lead-conversion / paid-ad attribution (cost-per-booked-patient by channel)** | **Wide open.** Jane has no ad data; "ad performance lives in platforms, outcomes live in the EHR, nothing connects." **Only 25.8% of clinic owners know their CAC; 74% can't tell cost-per-new-patient by channel.** `[M]` | **★★★★★ — his data IS the answer.** |
| **② Patient reactivation / recall (lapsed-patient win-back)** | Half-served. Jane does basic recalls but **routes real list marketing to Mailchimp**; "no lifecycle marketing." But **crowded** (Breakthrough $399, DemandHub AI Recall, Birdeye). `[M]` | ★★★☆ — data helps target; tech is commodity. |
| **③ No-show reduction** | Served (reminders are table-stakes; every PMS has them; ~20% lift is the standard claim). `[M]` | ★★ — undifferentiated. |
| **④ Reviews / reputation** | Served by Birdeye ($299/mo) / Podium ($289/mo) — **too pricey for small clinics**, so a cheap wedge exists, but it's a horizontal commodity with no data moat. `[M]` | ★★ — no data edge. |
| **⑤ Patient intake / digital forms** | Mostly served inside the PMS; thin standalone market. | ★ |
| **⑥ Multi-location group reporting** | Served by Juvonno/Pabau/Zenoti natively for *operational* KPIs (utilization, revenue, staff). **But none merge ad spend + acquisition** — the *marketing* slice of multi-location reporting is unserved. | ★★★★ — overlaps ①; his data fills the missing slice. |

**Takeaway:** the gaps fall into two buckets — **commodity ops features** (③④⑤, anyone can build, no moat) and **the acquisition/attribution layer** (①②⑥, where proprietary cross-clinic conversion data is the only durable differentiator). Build in the second bucket.

---

## PART 2 — PHYSIO-RELEVANT SIGNAL FROM THE CONSOLIDATED REPORT (reuse)

The 550-keyword / SaaS-teardown report is horizontal (CRM/sales tools), but three of its findings transfer directly and reinforce the attribution thesis:

1. **Clean/honest data is the #1 corroborated moat in the whole dataset** — both AI engines independently flag ~16 tools on data quality; it's *"the hardest complaint to fix on legacy stacks; moat = verified data + transparency."* This is the *exact* shape of Jaydeep's edge: his cross-clinic conversion data is verified, first-party, and un-clonable. The report's own line: this *"directly mirrors the user's own PPC work (out-of-area leads, fake $8,000 deal values)."* `[M]`
2. **Attribution / ROI is unserved even in horizontal CRM** — the gap synthesis names *"closing the loop to ad spend"* as the founder's unique asset. Physio just makes it sharper: the loop is short (ad → call → booked visit) and the LTV is high.
3. **Demand is fleeing narrow point-tools toward consolidated, AI-native, outcome-priced products** (GHL +573%, Brevo, Close, Attio rising; Mailchimp/ActiveCampaign −33%). A physio "marketing-ROI + reactivation" product that **collapses the attribution-spreadsheet + Mailchimp + a recall tool into one** rides that current. Pricing should be **flat/outcome**, not credit-burn (the #1 complaint).

First-party demand (Clinic #1, 91 days): **3,012 real patient queries, $2,315 spend → 345 lead-actions at $6.72 CPA**, overwhelmingly local "near me" intent ending in a phone call. `[M]` That CPA number, *multiplied across his whole clinic book*, is the dataset no competitor has.

---

## PART 3 — THE PRODUCT CONCEPTS (4–6)

Each obeys CRM gravity (fills a gap / stays SoR-light, doesn't fight Jane's core), exploits the cross-clinic conversion data where it can, and states a real Jane tier.

### Concept A — **PatientROI: Cross-Clinic Acquisition Intelligence** (the flagship)
- **One-liner:** The "Triple Whale / Northbeam for physio" — connects Google/Meta ad spend → call/lead → **booked, paying patient** and tells a clinic its true **cost-per-booked-patient by channel/keyword/ad**, benchmarked against an anonymized cross-clinic dataset no single clinic can see.
- **Who it's for:** Clinic owners running paid ads (and the agencies serving them) — starting with the **74% who can't currently tell their CAC by channel**.
- **How it uses the data moat:** The benchmark *is* the moat. "Your physio-near-me CPA is $9; the network median is $6.72; clinics that shifted budget from X to Y cut booked-patient cost 28%." That cross-clinic conversion truth is **literally un-replicable** by anyone who doesn't run dozens of physio ad accounts at once. Every new clinic strengthens the benchmark (data-network effect).
- **CRM-gravity fit / Jane tier:** **SoR-light, read-mostly.** Needs only "did this lead become a booked visit?" — obtainable via call-tracking + booking webhook/CSV, or a **read-only** Jane Tier-3 connection (feasible, low-risk) / **open** Juvonno-Cliniko Tier-1. Jane has no ad data and abstains from this layer → **not a kill-zone.**
- **Build / COGS shape:** Ad-API pulls (Google/Meta — Jaydeep already has these via the agency) + call-tracking + a booking signal + a benchmark warehouse. Mostly ETL + dashboards + light AI for narrative insights. **No per-minute AI bleed.** COGS = data pipes + cheap LLM summaries → **85%+ margin** `[E]`. Price **$149–$399/mo** flat.

### Concept B — **ReactivatePro: Data-Targeted Lapsed-Patient Win-Back** (the fast-cash bolt-on)
- **One-liner:** Automated SMS/email reactivation of lapsed patients, but **prioritized by the conversion data** — chase the lapsed cohorts that historically rebook, with the message/offer that converts in *that* clinic type.
- **Who it's for:** Every clinic with a dormant list (1,500–3,000 lapsed patients is typical). `[M]`
- **How it uses the data moat:** Cross-clinic data tells it *which* lapsed segments and *which* offers actually rebook → smarter targeting than the generic "blast everyone" tools. (Moderate use — the core campaign tech is commodity; the targeting is the edge.)
- **CRM-gravity fit / Jane tier:** Jane abstains from lifecycle marketing (**routes to Mailchimp**) → not a kill-zone. Needs **read** (patient list, last-visit, discharge flag) — feasible on Jane Tier-3 read / Juvonno-Cliniko open. **Write-back** (rebook from campaign) is where Jane gates → keep it as "deep-link into Jane's booking," not a hard write.
- **Build / COGS shape:** Campaign engine + Twilio/SES pass-through + AI copy. **80%+ margin** if SMS metered. Price **$99–$199/mo**. *Caveat: crowded* — Breakthrough ($399), DemandHub "AI Recall Specialist for physiotherapy," Birdeye all here already. `[M]` Wins only via the data targeting + agency bundle.

### Concept C — **GroupView: Multi-Location Marketing Command Center**
- **One-liner:** Owner dashboard that merges **ad spend + new-patient acquisition + revenue** across all locations — the *marketing* slice the operational multi-location tools (Juvonno/Pabau/Zenoti) leave out.
- **Who it's for:** Multi-location clinic groups / DSO-style owners (Jaydeep himself is customer-zero with 8 sites).
- **How it uses the data moat:** Same cross-clinic benchmark, sliced per location; "Location 3's CAC is 2× Location 1 on the same ads — fix geo-targeting." Strong fit.
- **CRM-gravity fit / Jane tier:** Read-mostly, SoR-light (mostly ad + revenue data). Operational PMSes own utilization/staff KPIs; this **doesn't compete** — it adds the unowned marketing layer. Effectively a **multi-location skin of Concept A** → fold in, don't build separately.
- **Build / COGS shape:** Same pipeline as A with per-location rollups. 85%+ margin. Price tier-up **$399–$799/mo** for groups. *Best treated as A's enterprise tier, not a standalone product.*

### Concept D — **Smart-Reviews wedge** (commodity — shown for completeness)
- **One-liner:** Cheap automated Google-review requests post-visit for clinics priced out of Birdeye ($299) / Podium ($289).
- **Who it's for:** Solo / small clinics.
- **Data moat:** **None** — reviews don't touch ad-conversion data. Pure GPT-wrap + SMS.
- **Jane tier:** Read-only (visit-completed trigger). Low risk but no defensibility.
- **Build / COGS:** Trivial; commodity; race-to-bottom pricing. **Scores low by design — included to show what *not* to lead with.**

### Concept E — **AI Voice Front Desk** (carry-forward — DROP)
- Already diligenced twice (**58 → 54/100**). Reseller-flooded (Rebookly, Clara, Kickcall, HealOS, Smith.ai, Retell-direct), commodity tech, **write-heavy = worst Jane Tier-3 exposure**, per-minute COGS bleeds below $200/mo, and **the ad-data moat doesn't transfer to call-answering.** Listed only to keep the comparison honest. **Do not build standalone.**

---

## PART 4 — SCORING (/100)

Rubric weights: Pain 18 · Demand 12 · Winnability 14 · Not-kill-zone 12 · Distribution/data-fit 16 · Moat 12 · AI-outcome-fit 8 · Pricing/margin/scale 8. (Score 0–10 × weight ÷ 10.)

| Parameter (wt) | **A · PatientROI** | **B · Reactivate** | **C · GroupView** | **D · Reviews** | **E · Voice** |
|---|---|---|---|---|---|
| **Pain (18)** | 9 → 16.2 | 8 → 14.4 | 7 → 12.6 | 5 → 9.0 | 7 → 12.6 |
| **Demand (12)** | 8 → 9.6 | 9 → 10.8 | 6 → 7.2 | 6 → 7.2 | 8 → 9.6 |
| **Winnability (14)** | 8 → 11.2 | 5 → 7.0 | 7 → 9.8 | 4 → 5.6 | 4 → 5.6 |
| **Not-kill-zone (12)** | 8 → 9.6 | 7 → 8.4 | 8 → 9.6 | 6 → 7.2 | 3 → 3.6 |
| **Distribution/data-fit (16)** | 10 → 16.0 | 8 → 12.8 | 9 → 14.4 | 5 → 8.0 | 6 → 9.6 |
| **Moat (12)** | 9 → 10.8 | 6 → 7.2 | 8 → 9.6 | 2 → 2.4 | 3 → 3.6 |
| **AI-outcome-fit (8)** | 6 → 4.8 | 6 → 4.8 | 5 → 4.0 | 5 → 4.0 | 8 → 6.4 |
| **Pricing/margin/scale (8)** | 9 → 7.2 | 7 → 5.6 | 8 → 6.4 | 5 → 4.0 | 4 → 3.2 |
| **TOTAL** | **★ 76.4** | **71.0** | **73.6** | **47.4** | **54.2** |

### Ranked
1. **A · PatientROI — 76** ✅ clears the bar. The only concept where the data is the product.
2. **C · GroupView — 74** ✅ — but it's A's multi-location tier, **not a separate build**.
3. **B · ReactivatePro — 71** ✅ (barely) — the fast-cash bolt-on; weakest on winnability (crowded) but cash-flowing.
4. **E · Voice — 54** ❌ DROP (confirmed third time).
5. **D · Reviews — 47** ❌ commodity, no moat.

**Why A wins the parameters that decide outcomes:** it scores **10/16 on distribution/data-fit** and **9/12 on moat** — the two boxes every other concept fails. Its value is the cross-clinic benchmark, which is **un-clonable without owning dozens of physio ad accounts** (UI is trivially clonable; the *data* is not — the honest split the rubric demands). It dodges the Jane kill-zone by being read-mostly in a layer Jane abstains from.

---

## PART 5 — RECOMMENDATION + VALIDATION PLAN

### Top pick: **A · PatientROI** (build it as the core; B reactivation rides alongside as the upsell; C is A's group tier).

**The product story:** *"We run your ads AND prove which dollar booked which patient — benchmarked against every physio clinic we run."* No pure-software startup and no clinic can say this. It turns the agency's existing ad operation into a defensible data asset, prices cleanly in-band ($149–$399 flat), and sells warm into Jaydeep's existing ad clients (near-zero CAC). The **free wedge → data → upsell** model the founder wants fits perfectly: give the attribution dashboard free/cheap to get the conversion data → that data powers the benchmark → benchmark + reactivation are the paid upsell.

### Do-things-that-don't-scale validation using the 8 owned clinics

**Goal of the pilot:** prove (1) the cross-clinic benchmark produces a budget reallocation that measurably lowers cost-per-booked-patient, and (2) owners will pay for the number.

| Step | What to test | What to do (manually, no product yet) | What "yes" looks like |
|---|---|---|---|
| **1. Wire the loop (Weeks 1–2)** | Can we actually join ad-click → booked patient? | For 3 of his clinics, manually stitch Google/Meta spend + call-tracking + Jane/PMS booking export into a spreadsheet. (He already has the ad accounts.) | A real per-channel **cost-per-booked-patient** number for each — not Google-modeled conversions, *booked visits*. |
| **2. Build the benchmark (Week 2)** | Is cross-clinic signal real and actionable? | Compute the network median CPA across all 8 clinics; find ≥1 clinic clearly above median on a channel. | At least one clinic shows a **$2–4 CPA gap** vs the network that points to a fixable cause (geo, keyword, ad). |
| **3. Act on it (Weeks 3–6)** | Does the insight move money? | Reallocate that clinic's budget per the benchmark; hold others as control. | Booked-patient cost on the moved clinic **drops ≥15%** vs its own baseline and vs controls. |
| **4. Price test (Week 6)** | Will an owner pay? | Show the dashboard + the saved $ to an *external* ad client (not just owned clinics — owned clinics can't validate willingness-to-pay). Ask for $199/mo. | An **external clinic says yes** at $149–$399 — owned-clinic enthusiasm doesn't count as a sale. |
| **5. Reactivation tack-on (Weeks 4–8, parallel)** | Does B cash-flow? | Run one data-targeted lapsed-patient SMS campaign at 2 owned clinics. | **≥8–10% rebooking** on the targeted cohort (vs the 5–15% generic benchmark) — proves the targeting edge, and books revenue immediately. |

**Kill criteria (be honest):** if Step 1 can't reliably join click→booked-visit (Jane read-access too gated, call-tracking too noisy), or Step 4 gets no external "yes" at ≥$149, **the data moat doesn't convert to product** — fall back to running it purely as an internal agency capability, not a SaaS.

**What to show a YC partner / yourself after the pilot:** one slide — *"N clinics, network-median CPA $X, we moved $Y of budget and cut cost-per-booked-patient Z%, and an external clinic is paying $199/mo for the benchmark."* That's a proprietary-data SaaS with a working closed loop and a paying logo — the thing none of the voice/reviews/intake clones can produce.

---

## Sources
- Jane App position & "no open API" / Tier-3: [jane.app](https://jane.app/), [Jane App 2026 overview (NewFrame)](https://newframedigital.com/what-is-jane-app/), [Jane App review (Medesk)](https://www.medesk.net/en/blog/jane-app-review/) — prior diligence: Jane Developer Platform / Integrations program (Matrix_Clinics_CRMvsVoice.md sources).
- Open-API alternatives: [Juvonno developers/API](https://www.juvonno.com/developers), [Juvonno clinic-owner](https://www.juvonno.com/teams/clinic-owner), [Cliniko API docs](https://docs.api.cliniko.com/), [PT software with API (GetApp)](https://www.getapp.com/healthcare-pharmaceuticals-software/physical-therapy/f/api/), [Noterro Jane alternatives](https://www.noterro.com/blog/jane-app-alternatives).
- Attribution gap (74% can't tell CAC by channel / 25.8% know CAC): [Evokad healthcare marketing metrics 2026](https://evokad.com/healthcare-marketing-metrics-patient-growth-2026/), [Behind the Practice PT marketing 2026](https://behindthepractice.io/resources/physical-therapy-marketing-the-complete-2026-guide), [Freshpaint healthcare attribution](https://www.freshpaint.io/measure-marketing-impact), [HMDG private practice barometer / CAC](https://hmdg.co.uk/private-practice-barometer/physiotherapy-cac-cost-per-acquisition-uk-2026/).
- Reactivation economics & crowd (16:1 LTV, Breakthrough/DemandHub): [DemandHub AI Recall for physio](https://www.demandhub.co/products/ai-recall-specialist/physiotherapy/), [aibridgeclub physio reactivation](https://aibridgeclub.com/post/automated-patient-reactivation-physio), [HMDG scale-to-£1M](https://hmdg.co.uk/private-practice-barometer/how-to-scale-physio-clinic-1m-uk/).
- No-show & multi-location: [PlusPhysio no-shows](https://www.plusphysio.com/blog/minimizing-physical-therapy-no-shows-7-proven-methods), [Pabau multi-location](https://pabau.com/blog/best-clinic-management-software-for-multi-location-practices/), [PtEverywhere KPI builder](https://www.pteverywhere.com/practice-management-software).
- Reviews/reputation pricing (Birdeye $299 / Podium $289 too pricey for small clinics): [Birdeye healthcare](https://birdeye.com/healthcare/), [Podium pricing 2026](https://www.replifast.com/blog/podium-pricing-2026).
- Reused first-party / prior diligence: `Demand_Physio_RealData.md` ($6.72 CPA, phone-ending journey), `Score_Physio_AIVoice.md` (voice 58), `Matrix_Clinics_CRMvsVoice.md` (Jane Tier-3, Product A 72 / Product B 54), `SaaS_Gap_Research_Consolidated_Report.md` (clean-data = #1 corroborated moat).
