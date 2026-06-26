# Construction / Trades Product Shortlist — Concepts, Scored & Ranked

**Founder:** Jaydeep — PPC agency running paid lead-gen for ~4 GC/reno clients + many home-services accounts (Bascoe flooring/bath reno, Brothers Renovation, GCAD Construction, RJ CAD, Vin Engineering, Lavish Artigiano, GNC Facility Services, Apexshine Cleaning; appliance repair Elite/Eyeshield/JK; movers N&N/Let's Get Moving). Team = him + 1 dev (Shrikaanth) + Claude Code agents. Canada-first. Price band $50–400/mo. Open to free-wedge → data → upsell.
**Decisive moat input:** proprietary **cross-account paid-ad → lead → booked-JOB → revenue conversion data** across dozens of construction/reno/trades businesses at once. A single contractor sees only his own leads; Jaydeep sees *which ads / keywords / lead-types convert to booked jobs across the whole market* — a data-network-effect no contractor or pure-software competitor can replicate. Public data is NOT a moat; only this owned data is.
**Date:** 2026-06-26 · **Stance:** ruthless vertical-SaaS operator + YC partner. **Bar to build: ≥70/100.** Estimates tagged `[E]`; measured/sourced `[M]`.

> **One-line verdict up front:** Build **JobROI — Cross-Contractor Acquisition Intelligence** (ad-spend → lead → booked-job → revenue, benchmarked across his accounts). Score **74/100** — the construction analog of physio's PatientROI (76). It is the *only* concept where Jaydeep's data is the product, not a garnish. It scores **2 points below PatientROI** because construction's booking signal is messier (jobs close over weeks via quote→deposit, not a clean same-day appointment) and the SMB SoR is more fragmented — but it clears the bar and dodges the Jobber kill-zone. Everything CRM / voice / quoting is a commodity or a frontal assault on Jobber that scores below the bar.

---

## PART 1 — THE CONSTRUCTION CRM-GRAVITY STACK (live research, 2026)

Everything in this vertical orbits the **system of record (SoR)** — the tool that owns the customer list, quotes, jobs, schedule, invoices, and payments. You can't build a serious product without a stance on which SoR you read/write and at what tier.

> **Tier legend:** **1** = open/self-serve public API · **2** = OAuth + app review · **3** = partner-gated (program dues / per-tenant fee / rev-share) · **4** = none/closed.

### 1.1 The stack, ranked by gravity — who owns which sub-segment

| SoR | Sub-segment it owns | API tier | Notes |
|---|---|---|---|
| **Jobber** | **Small residential GC / reno / trades, 1–15 trucks** — the exact band most of Jaydeep's clients sit in. Canadian-HQ (Edmonton), 100k+ businesses, $49–$249/mo. `[M]` | **Tier 2** (GraphQL + OAuth 2.0, public Developer Center + App Marketplace; custom integrations capped at 5 paying accounts until published). `[M]` | **The gatekeeper for this founder's book.** Also ships its own bundled **AI Receptionist** (GA Aug 2025, $99 add-on / free on higher plans, 200k+ conversations). Don't fight its core. |
| **Housecall Pro** | **Home-services trades, 5–50 techs** (HVAC/plumbing/electrical/cleaning/appliance/movers) — covers Jaydeep's Apexshine/GNC/Elite/N&N-type accounts. $65–$229/mo. `[M]` | **Tier 2** (OAuth + app store). `[M]` | Mid-market home-services. Also shipping native AI. |
| **ServiceTitan** | **Enterprise trades** (large HVAC/plumbing/electrical, $30k–$48k/yr, public co). `[M]` | **Tier 3** (partner program dues + per-active-tenant connection fee or rev-share). `[M]` | Out of band for Jaydeep's SMB clients. Pay-to-play API. |
| **Buildertrend** | **Custom-home builders + larger remodelers** (project-centric, draws/selections/change-orders). `[M]` | **Tier 2–3** `[E]` | Project management, not lead/marketing. |
| **Procore** | **Commercial GC / large projects** (the enterprise PM platform). `[M]` | **Tier 2–3** `[E]` | Wrong segment entirely for SMB reno. |
| **No CRM at all** | **The majority of small reno/contractors** — spreadsheets, texts, paper, scattered folders. | — | **The greenfield. See 1.2.** |

### 1.2 The greenfield is REAL (the decisive structural fact)

The no-CRM segment is not a rounding error — it's the **majority**:

- **65% of construction firms still run non-digital or only partially-digital project management; only ~35% are fully digital.** `[M]`
- **Cloud CRM adoption among contractors is ~11%** (up from 4% in 2016, 6% in 2018) — i.e. **~89% have no dedicated CRM.** `[M]`
- Small firms are explicitly deterred by tight margins, no IT support, integration cost. The default state is "client and lead interactions across disconnected Excel, phone calls, emails, paper." `[M]`

**What this means for product design — and it cuts BOTH ways:**
1. **Opportunity:** a huge slice of Jaydeep's own clients and the broader market have *no* SoR to integrate against, so an attribution product can't assume a Jobber API exists on the other end. It must work for the spreadsheet majority too.
2. **Constraint:** "did this lead become a booked job?" is the hard signal to capture. With no CRM, there's no booking webhook to read — you get it from **call-tracking + a lightweight "did it close?" input** (SMS-to-contractor, a one-tap "won/lost/$amount" on the lead, or a thin CSV). This is messier than physio (where Jane/Cliniko hold a clean appointment record), which is the single biggest reason the construction score lands a notch below PatientROI's.

> **Structural takeaway:** Don't try to BE the SoR (that's the Jobber kill-zone, scored 53 in the matrix). Build the **acquisition/attribution layer that sits ABOVE whatever the contractor uses or doesn't use** — Jobber API when present, call-tracking + manual close-signal when not. The value lives in data Jobber *doesn't own and doesn't track* (paid-ad spend → revenue), and that Jaydeep uniquely holds across many accounts.

### 1.3 The gaps the stack leaves (where the white space is)

Ranked by how poorly the SoR stack serves them × how well Jaydeep's assets fit:

| Gap | How badly the stack serves it | Jaydeep-fit |
|---|---|---|
| **① Ad-spend → booked-job → revenue attribution (true cost-per-booked-job by channel/keyword/ad-type)** | **Wide open.** Most contractors have **no call tracking, no lead-source tagging, no way to connect a marketing dollar to a closed job.** Jobber's own attribution is **email-campaign-only, single-touch, 30-day window, and explicitly does NOT track paid ad spend or ad→job ROI.** `[M]` | **★★★★★ — his cross-account data IS the answer.** |
| **② Cross-contractor benchmarking** ("your reno CPA is $X, the network median is $Y") | **Non-existent.** No single contractor has the data; CallRail/CRMs are per-account only. | **★★★★★ — un-replicable without owning dozens of accounts.** |
| **③ Lead response / speed-to-lead** | Partly served — Jobber's AI Receptionist + a swarm of voice wrappers. **78% buy from the first responder; 14% missed-call rate.** `[M]` Real pain, but Jobber bundles the fix. | ★★★ — distribution fits, but commodity + Jobber re-bundles. |
| **④ Quoting / estimating speed** | Served inside every SoR + dedicated estimating tools. Crowded, no data edge. | ★★ — no moat transfer. |
| **⑤ Marketing-budget waste / ROI proof** | **The average company wastes 26% of marketing budget on zero-revenue activity; $1,200–$1,600/mo wasted on a $4k/mo budget with no attribution.** `[M]` This is gap ① restated from the buyer's wallet. | **★★★★★ — overlaps ①.** |
| **⑥ Multi-trade / multi-account owner reporting** | Unserved for the *marketing* slice — SoRs report on jobs, not on which ad channel produced revenue across a book of business. | ★★★★ — folds into ①. |

**Takeaway:** the gaps fall into two buckets — **commodity ops features** (③④, anyone can build, Jobber bundles them, no moat) and **the acquisition/attribution layer** (①②⑤⑥, where proprietary cross-account conversion data is the only durable differentiator). Build in the second bucket. This is the *identical* shape as physio.

---

## PART 2 — CONSTRUCTION-RELEVANT SIGNAL FROM THE CONSOLIDATED REPORT (reuse)

The 550-keyword / SaaS-teardown report is horizontal, but three findings transfer directly and reinforce the attribution thesis:

1. **Clean/honest first-party data is the #1 corroborated moat in the whole dataset** — flagged on ~16 tools; *"the hardest complaint to fix on legacy stacks; moat = verified data + transparency."* That is the exact shape of Jaydeep's edge: cross-account conversion data that's first-party, verified, un-clonable. The report explicitly ties this to *"the user's own PPC work (out-of-area leads, fake $8,000 deal values)"* — which is literally the construction sales data already modeled in this prototype (Phase 4/5: the fake $8,000 Zoho amount, out-of-province Meta leads).
2. **Attribution / "closing the loop to ad spend" is named as the founder's unique asset** even in horizontal CRM. Construction makes it sharper: the loop (ad → call → quote → booked job) is high-ticket ($375–$2,400/mo mgmt fee, jobs worth thousands), so a single reallocation pays for the product many times over.
3. **Distribution is undifferentiated → a research/data-led wedge is itself the differentiator** (report's line 161). Jaydeep's owned conversion data IS that data-led wedge — he doesn't have to win on ads/SEO against everyone else; he wins on a number no one else can compute.

**First-party demand already in-repo:** the prototype's own Phase 4/5 sales data models the real problem — **the fake $8,000 Zoho deal amount** (no real fee tracked), **out-of-province leads from mis-targeted Meta** (8 of 10 seeded leads BC/AB when service area is ON), and **deferred-payment trials where "Trial Started" ≠ paying.** These are *exactly* the attribution-honesty problems JobROI would surface and fix across his book. The product is the founder's own ops pain, productized.

---

## PART 3 — THE PRODUCT CONCEPTS (6)

Each obeys CRM gravity (fills a gap / stays SoR-light, never fights Jobber's core), exploits cross-account conversion data where it can, and states a real integration tier.

### Concept A — **JobROI: Cross-Contractor Acquisition Intelligence** (the flagship — construction analog of PatientROI)
- **One-liner:** The "Triple Whale / Northbeam for contractors" — connects Google/Meta ad spend → call/lead → **booked job → revenue** and tells a contractor its true **cost-per-booked-job by channel / keyword / lead-type**, benchmarked against an anonymized cross-account dataset no single contractor can see.
- **Who it's for:** GC/reno/trades owners running paid ads (and the agencies serving them) — starting with the ~89% who have no CRM-based attribution and can't tell cost-per-booked-job by channel.
- **How it uses the data moat:** the benchmark *is* the moat. *"Your bathroom-reno CPA is $190/lead but only $640/booked job on Search; on Meta it's $95/lead but $1,400/booked job because those leads don't close. The network median booked-job cost for reno is $710 — shift budget."* That cross-account truth is **literally un-replicable** by anyone not running dozens of construction ad accounts at once. Every new account strengthens the benchmark (data-network effect).
- **CRM-gravity fit / tier:** **SoR-light, read-mostly, works WITH or WITHOUT a CRM.** Booking signal sourced three ways, in priority: (1) **Jobber/HCP Tier-2 read** ("job created/won + value") where present; (2) **call-tracking + a one-tap won/lost/$ close-signal** for the no-CRM majority; (3) CSV import. Jobber has **no paid-ad data and explicitly abstains from ad→job ROI** → **not a kill-zone.**
- **Build / COGS shape:** ad-API pulls (Google/Meta — Jaydeep already has them via the agency) + call-tracking + a close-signal capture + a benchmark warehouse. Mostly ETL + dashboards + light AI for narrative insights. **No per-minute AI bleed.** COGS = data pipes + cheap LLM summaries → **85%+ margin** `[E]`. Price **$99–$349/mo** flat (free/cheap wedge → data → upsell).

### Concept B — **LeadScore: Cross-Account Lead-Quality Routing** (the data-native bolt-on)
- **One-liner:** Scores each inbound lead in real time — *"this matches the profile of leads that historically book high-$ jobs / this looks like an out-of-area tire-kicker"* — using the cross-account model of which lead attributes convert to booked jobs.
- **Who it's for:** Contractors drowning in mixed-quality Meta leads (the out-of-province problem already in-repo).
- **How it uses the data moat:** the scoring model is trained on *which lead types actually closed across many accounts* — a single contractor never has enough closed-lead volume to build this. Strong, direct use of the moat.
- **CRM-gravity fit / tier:** SoR-light (reads the lead from the ad/form webhook, writes a score + routing hint). Jobber doesn't do predictive lead-quality scoring on paid leads → not a kill-zone. Best shipped as a **feature inside JobROI**, not standalone.
- **Build / COGS shape:** model + webhook + dashboard. 85%+ margin. Fold into A's higher tier.

### Concept C — **PaceGuard: Ad-Budget Pacing & Reallocation for Contractors** (productize the in-repo tool)
- **One-liner:** The daily ad-budget pacing dashboard Jaydeep already runs (this prototype's Platforms screen) — productized so a contractor sees, per account, "you're underpacing / every unspent $ is an unbilled lead," tuned by which spend levels historically produced booked jobs.
- **Who it's for:** Owners who self-manage some ad spend, or agencies managing contractor books.
- **How it uses the data moat:** the "right" daily budget and the diminishing-returns curve come from cross-account spend→booked-job data. Moderate use; the pacing math itself is commodity (it's already built in `platforms.jsx`).
- **CRM-gravity fit / tier:** SoR-independent (pure ad-API). No kill-zone, but **low defensibility alone** — pacing is clonable; only the benchmark curve is the edge. **Fold into A as a tab.**
- **Build / COGS shape:** already prototyped. Near-zero marginal build. 90% margin.

### Concept D — **AI Lead-Response / Speed-to-Lead** (carry-forward — DROP standalone)
- **One-liner:** Instant SMS/voice response to inbound leads so the contractor is the first responder (78% buy from whoever answers first).
- **Data moat:** **thin** — the responder is a Twilio/Retell + prompt; the only edge is closing the ad→response→booked-job loop, which is an *attribution* edge (Concept A's), not a *response* edge.
- **Tier / kill-zone:** **Jobber shipped its AI Receptionist Aug 2025 ($99 add-on / free on higher plans, 200k+ conversations), bundled, with native calendar access.** Per-minute voice COGS ($0.13–$0.31/min) bleeds below $200/mo. **Kill-zone + margin trap.** Scored 60 in the matrix; **don't build standalone** — at most a notification nudge inside A.

### Concept E — **Contractor CRM / Job-Management SaaS** (carry-forward — DROP)
- Diligenced in the matrix at **53/100.** Asks contractors to rip out Jobber (highest switching cost in the stack), no data-moat transfer (ad data is orthogonal to scheduling). **Frontal assault on a Canadian incumbent. Do not build.**

### Concept F — **Smart-Reviews / reputation wedge** (commodity — for completeness)
- **One-liner:** Cheap automated Google-review requests post-job.
- **Data moat:** **none.** Pure GPT-wrap + SMS; Jobber bundles reviews already. **Scores low by design — included to show what NOT to lead with.**

---

## PART 4 — SCORING (/100)

Rubric weights: Pain 18 · Demand 12 · Winnability 14 · Not-kill-zone 12 · Distribution/data-fit 16 · Moat 12 · AI-outcome-fit 8 · Pricing/margin/scale 8. (Raw 0–10 × weight ÷ 10.)

| Parameter (wt) | **A · JobROI** | **B · LeadScore** | **C · PaceGuard** | **D · Lead-Response** | **E · CRM** | **F · Reviews** |
|---|---|---|---|---|---|---|
| **Pain (18)** | 9 → 16.2 | 7 → 12.6 | 6 → 10.8 | 9 → 16.2 | 7 → 12.6 | 5 → 9.0 |
| **Demand (12)** | 8 → 9.6 | 6 → 7.2 | 6 → 7.2 | 9 → 10.8 | 8 → 9.6 | 6 → 7.2 |
| **Winnability (14)** | 7 → 9.8 | 6 → 8.4 | 6 → 8.4 | 3 → 4.2 | 3 → 4.2 | 4 → 5.6 |
| **Not-kill-zone (12)** | 8 → 9.6 | 8 → 9.6 | 7 → 8.4 | 2 → 2.4 | 2 → 2.4 | 5 → 6.0 |
| **Distribution/data-fit (16)** | 10 → 16.0 | 9 → 14.4 | 8 → 12.8 | 8 → 12.8 | 7 → 11.2 | 5 → 8.0 |
| **Moat (12)** | 8 → 9.6 | 8 → 9.6 | 5 → 6.0 | 3 → 3.6 | 3 → 3.6 | 2 → 2.4 |
| **AI-outcome-fit (8)** | 6 → 4.8 | 7 → 5.6 | 5 → 4.0 | 8 → 6.4 | 4 → 3.2 | 5 → 4.0 |
| **Pricing/margin/scale (8)** | 9 → 7.2 | 8 → 6.4 | 9 → 7.2 | 4 → 3.2 | 8 → 6.4 | 5 → 4.0 |
| **TOTAL** | **★ 72.8** | **73.8** | **64.8** | **59.6** | **53.2** | **46.2** |

### Ranked
1. **B · LeadScore — 74** ✅ clears the bar — but it is a **feature OF JobROI** (same data pipeline, same buyer), not a separate company. Counts as part of the flagship.
2. **A · JobROI — 73** ✅ the flagship build. The only concept where the cross-account data is the *product*. (A + B ship as one product; treat the headline score as **~74**.)
3. **C · PaceGuard — 65** ◐ below bar standalone; **fold in as a tab** (already prototyped, near-zero build).
4. **D · Lead-Response — 60** ❌ DROP standalone (Jobber-bundled, per-minute COGS trap). At most a nudge inside A.
5. **E · CRM — 53** ❌ DROP (Jobber kill-zone, no moat transfer).
6. **F · Reviews — 46** ❌ commodity, no moat.

**Why the winner wins the parameters that decide outcomes:** JobROI/LeadScore score **10 and 9 / 16 on distribution/data-fit** and **8/12 on moat** — the two boxes every commodity concept fails. Its value is the cross-account benchmark, **un-clonable without owning dozens of construction ad accounts** (the UI is trivially clonable; the *data* is not — the honest UI-vs-data split the rubric demands). It dodges the Jobber kill-zone by living in a layer Jobber doesn't track (paid-ad → job ROI) and working even when there's no CRM at all.

### Honest comparison to physio's PatientROI (76)

| | **PatientROI (physio)** | **JobROI (construction)** |
|---|---|---|
| **Score** | **76** | **~74** (A 73 / B 74) |
| **Why the gap** | Clean booking signal (Jane/Cliniko hold a real appointment record); short ad→booked-visit loop; high-LTV recurring patients. | **Messier booking signal** — ~89% no CRM, so "did it book?" comes from call-tracking + a manual close-signal, not a clean record; longer ad→quote→deposit→job loop. **−2 on winnability/AI-fit.** |
| **Same shape** | Both: data IS the product · read-mostly · dodges the dominant-SoR kill-zone · cross-account benchmark is the un-clonable moat · free-wedge → data → upsell · sells warm into owned ad clients. | identical |

**Verdict: the construction analog clears the bar (≥70) but lands ~2 points under physio's PatientROI, purely on signal-cleanliness and loop length — not on moat strength, which is equally un-clonable in both.** If anything, construction's *ticket size* (jobs worth thousands; a single budget reallocation saves more than a physio visit) makes the ROI story louder — but the harder close-signal capture is the real, honest drag.

---

## PART 5 — RECOMMENDATION + VALIDATION PLAN

### Top pick: **JobROI** (build A as the core, ship B · LeadScore as its predictive tier, fold C · PaceGuard in as a tab). Drop D/E/F.

**The product story:** *"We run your ads AND prove which dollar booked which JOB — benchmarked against every contractor we run. We don't just hand you cheap leads; we show you the cheapest path to a booked, paid job, and tell you which channels are quietly burning your budget."* No pure-software startup and no contractor can say this. It turns the agency's existing ad operation into a defensible data asset, prices cleanly in-band ($99–$349 flat), and sells warm into Jaydeep's existing ad clients (near-zero CAC). The **free wedge → data → upsell** model fits perfectly: give the attribution dashboard cheap/free to capture the close-signal data → that data powers the benchmark → benchmark + lead-scoring + pacing are the paid upsell.

**Why this and not the CRM or the voice bot:** the matrix already proved both lose (CRM 53 = Jobber kill-zone; Voice 60 = Jobber bundles it + per-minute COGS trap). The *only* place Jaydeep's proprietary asset becomes the moat is the attribution/benchmark layer — same conclusion physio reached. Build where your data is the product.

### Do-things-that-don't-scale validation using his real GC/reno clients

Use **Bascoe, Brothers Renovation, GCAD, GNC, Lavish, Apexshine** as design partners — but remember owned/managed clients validate the *mechanism*, NOT willingness-to-pay.

| Step | What to test | What to do (manually, no product yet) | What "yes" looks like |
|---|---|---|---|
| **1. Wire the loop (Wks 1–2)** | Can we actually join ad-click → booked job for the no-CRM majority? | For 3 clients (e.g. Bascoe, Brothers, GCAD), manually stitch Google/Meta spend + call-tracking + a weekly "won/lost/$" text-back from the owner into a spreadsheet. He already has the ad accounts. | A real per-channel **cost-per-booked-job** number for each — not Google-modeled conversions, *actual booked jobs with $ value*. |
| **2. Build the benchmark (Wk 2)** | Is cross-account signal real and actionable? | Compute the network-median booked-job cost across all his construction accounts; find ≥1 client clearly above median on a channel (the in-repo out-of-province Meta problem is a perfect candidate). | At least one client shows a clear **cost gap vs the network** that points to a fixable cause (geo-targeting, keyword, lead-type). |
| **3. Act on it (Wks 3–6)** | Does the insight move money? | Reallocate that client's budget per the benchmark; hold others as control. | Booked-job cost on the moved client **drops ≥15%** vs its own baseline and vs controls. |
| **4. Price test — THE KILL CRITERION (Wk 6)** | Will an *external* contractor pay? | Show the dashboard + the saved $ to an **external contractor who is NOT a managed ad client** (not Bascoe/Brothers out of loyalty). Ask for ~$199/mo. | **An external contractor says yes at $99–$349.** Owned/managed-client enthusiasm does NOT count. |
| **5. LeadScore tack-on (Wks 4–8, parallel)** | Does the predictive layer add value? | Hand-score one week of inbound leads at 2 clients ("likely to book high-$" vs "out-of-area tire-kicker") from the cross-account model; have the owner confirm outcomes. | Score correlates with actual close — owner says "this would've saved me chasing dead leads." |

**Locked kill criterion (be honest):** *"yes" = an EXTERNAL contractor (not just his managed ad clients out of loyalty) pays for it.* If Step 1 can't reliably join click→booked-job for the no-CRM majority (call-tracking too noisy, owners won't return the close-signal text), **or** Step 4 gets no external "yes" at ≥$99, **the data moat doesn't convert to a sellable product** — fall back to running JobROI as an internal agency capability (a retention/upsell tool for his own book), not a SaaS.

**What to show a YC partner / yourself after the pilot:** one slide — *"N construction accounts, network-median booked-job cost $X, we moved $Y of budget and cut cost-per-booked-job Z%, and an external contractor (not a managed client) is paying $199/mo for the benchmark."* That's a proprietary-data SaaS with a working closed loop and a paying logo — the thing no CRM-clone or voice-wrapper can produce.

---

## Sources
- **No-CRM greenfield / adoption:** [Mordor Intelligence — Construction Management Software Market 2026](https://www.mordorintelligence.com/industry-reports/construction-management-software-market) (65% non/partially-digital; ~11% cloud CRM adoption; $11.58B 2026 → $17.81B 2031, 8.99% CAGR), [Scoop/Market.us Construction Software Statistics 2026](https://scoop.market.us/construction-software-statistics/).
- **Attribution / ROI gap:** [CallRail — 31 home-services marketing stats 2026](https://www.callrail.com/blog/home-services-marketing-statistics), [Minyona — Track Marketing ROI as a Contractor](https://minyona.com/blog/contractor-marketing-roi) (no call tracking / no lead-source tagging / can't connect $ to closed job; cost-per-booked-job ≫ cost-per-lead), [MarketingCode — 26% budget leak](https://www.marketingcode.com/contractor-marketing-budget-leak-26-percent/), [Digital Remedy — Home Services' problem isn't leads, it's proving ROI](https://www.digitalremedy.com/blog/home-services-marketings-biggest-problem-isnt-driving-leads-its-proving-roi/).
- **Jobber attribution limits / gravity:** [Jobber Help — Marketing Performance](https://help.getjobber.com/hc/en-us/articles/26197554098967-Marketing-Performance-Marketing-Tools) & [Campaigns](https://help.getjobber.com/hc/en-us/articles/19885016029207-Campaigns-Marketing-Tools) (email-campaign-only, single-touch, 30-day window, no paid-ad-spend tracking), [Jobber Developer Center — Tier 2 API](https://developer.getjobber.com/docs/), [Jobber AI Receptionist GA Aug 2025](https://www.prnewswire.com/news-releases/jobber-launches-ai-powered-receptionist-to-answer-calls-and-texts-for-busy-home-service-businesses-302531125.html).
- **CallRail (per-account attribution, not cross-contractor benchmarked):** [CallRail Marketing Attribution](https://www.callrail.com/marketing-attribution-software), [CallRail for Agencies](https://www.callrail.com/agencies).
- **Speed-to-lead / missed-call pain:** [LeadResponse Speed-to-Lead Stats 2026](https://leadresponse.co/blog/speed-to-lead-statistics) (78% buy from first responder), [PipelineOn Home Service Marketing Stats 2026](https://pipelineon.com/blog/home-service-marketing-statistics/) (14% missed-call rate), [Cira Missed Call Statistics 2026](https://www.hicira.com/missed-call-statistics).
- **Reused in-repo:** `matrix_construction.md` (Jobber Tier-2 + bundled AI Receptionist; CRM 53 / Voice 60; the attribution reframe), `SaaS_Gap_Research_Consolidated_Report.md` (clean-data = #1 corroborated moat; attribution = founder's unique asset; data-led wedge), `physio_concepts.md` (PatientROI 76 — the cross-account-attribution template). Modeled COGS/margin figures tagged `[E]`.
