# Vertical Diligence Matrix — CONSTRUCTION / GENERAL CONTRACTORS / TRADES

**Founder:** Jaydeep — PPC agency + owner-operator. Team = him + 1 dev (Shrikaanth) + Claude Code agents. Canada-first.
**This vertical's proprietary coverage:** Google Ads — GCAD Construction, RJ CAD Solutions, Vin Engineering. Meta — GCAD Construction (×2), Projects Pioneer, RJ CAD, Dave Financial. ~4 GC clients owned, strong ad-account coverage.
**Date:** June 2026. Live data tagged below; modeled numbers tagged `[est]`.

---

## Market backdrop (shared context)

- **FSM software market ≈ USD $6.2–6.3B in 2026**, growing ~12.5–16% CAGR to ~$23B by 2035. Real, large, growing. ([Grand View](https://www.grandviewresearch.com/industry-analysis/field-service-management-market), [GM Insights](https://www.gminsights.com/industry-analysis/field-service-management-market))
- **System-of-record landscape for SMB contractors/trades:**
  - **Jobber** — 1–15 trucks, $49–$249/mo, Canadian-HQ (Edmonton), 100k+ businesses. The default for small residential GCs/trades. **Builder + Platform.**
  - **Housecall Pro** — 5–50 techs, $65–$229/mo, mid-market, ~16% of digitized HVAC. **Builder + Platform.**
  - **ServiceTitan** — enterprise, $30k–$48k/yr, public ($6B+), ~31% of digitized HVAC. **Platform.**
  - **Buildertrend / Procore** — project-centric GC/remodel & commercial. **Platform.**
- **Adoption reality:** average construction business now runs **6.2 tech products** (up from 5.3 in 2023); 68% of *large* firms use a PM platform — but small GCs/trades still live in spreadsheets, texts, and scattered folders. The switch happens when software *removes* a task, not on novelty. ([On-Site Mag](https://www.on-sitemag.com/features/why-canadian-constructions-tech-bet-still-matters/))

> **Tier legend:** (1) open API · (2) OAuth + app review · (3) partner-gated (fee/agreement) · (4) no API / scrape-only.

---

# PRODUCT A — Vertical CRM / Job-Management SaaS for contractors

### 1. DEMAND — real, growing?
**Yes, but the demand is already *captured*, not latent.** The "contractor CRM / job management" category is the single most-searched, most-compared SMB-software category in trades (endless "Jobber vs Housecall Pro vs ServiceTitan" content dominates 2026 SERPs). FSM market growing 12.5–16% CAGR. The pain (quoting, scheduling, invoicing, follow-up living in spreadsheets/texts) is real and universal among small GCs. **Score: high demand, but it's demand for an existing solved category — not an unmet need.** `[Demand 8/10]`

### 2. COMPETITION + KILL-ZONE
This is a **textbook platform kill-zone.**
- **Jobber** (Builder+Platform) — Canadian, owns the exact SMB GC/trade segment Jaydeep would target, weekend-setup simplicity, $49–$249.
- **Housecall Pro** (Builder+Platform) — mid-market.
- **ServiceTitan** (Platform) — enterprise, public.
- **Buildertrend / Procore** (Platform) — GC/remodel + commercial.

A 1-dev + AI-agents team building a *horizontal* contractor CRM walks directly into three well-funded incumbents who have spent a decade on scheduling edge-cases, payments, payroll, QuickBooks sync, mobile apps, and dispatch. The UI is clonable in a weekend; the *operational depth, payments rails, and trust* are not. **This is the canonical "don't build another Jobber" trap.** `[Not-kill-zone 2/10]`

### 3. SYSTEM-OF-RECORD + INTEGRATION TIER
- **System of record:** Product A *wants to BE* the system of record. That's the problem — you're asking a contractor to rip out Jobber/HCP, the highest-switching-cost software they own (it holds their customers, invoices, payment history).
- **Integration tier (if you instead build *on* the SoR):** **Jobber = Tier 2** (GraphQL, OAuth 2.0, open Developer Center + App Marketplace, app-review; custom integrations capped at 5 paying accounts until published). **Housecall Pro = Tier 2.** **ServiceTitan = Tier 3** (partner-gated: annual program dues across Silver/Gold/Titanium tiers + per-active-tenant connection fee *or* rev-share). ([Jobber Dev](https://developer.getjobber.com/docs/custom_integrations/), [ServiceTitan Program Guide](https://www.servicetitan.com/legal/app-marketplace-program-guide))
- Tier 2 on Jobber/HCP is *crackable* — but a thin app *on* Jobber is not a CRM, it's a feature, and Jobber can absorb it.

### 4. DISTRIBUTION FIT
Jaydeep's ad coverage (4 GC clients, strong Meta+Google accounts) gives a **warm beachhead of ~4 design partners and a credible "we run your leads, now run your jobs" pitch** — genuinely near-zero-CAC for the first handful. **But:** these same 4 clients very likely already run Jobber/HCP or a spreadsheet they're emotionally attached to. Getting them to switch their *system of record* is a knife-fight even with trust. Distribution helps *land*, not *expand* — beyond his 4 accounts, you're in open-market combat with Jobber's brand and marketing machine. `[Distribution-fit 7/10]`

### 5. BUILD-MOAT
🟥 **Too-easy commodity on the surface, too-hard where it matters.** The CRM/scheduling/invoicing UI is highly clonable (that's why there are 50 of them). The moat lives in payments, payroll, QBO/Xero sync, mobile reliability, dispatch logic, and a decade of trust — **none of which Jaydeep's ad data unlocks.** His proprietary data (ad performance) is *orthogonal* to job-management; it doesn't make the CRM better at scheduling. **No data-moat transfer.** UI-clonability HIGH, quality-bar HIGH, and Jaydeep holds none of the moat input. `[Moat 3/10]`

### 6. PRICE-vs-COGS
**Excellent.** Low-inference SaaS, COGS is hosting + minimal AI. $50–$400/mo is viable with 85%+ gross margin. The economics are the *one* thing that works here. `[Pricing/margin 8/10]`

### 7. SCORE

| Param | Weight | Raw /10 | Weighted |
|---|---|---|---|
| Pain | 18 | 7 | 12.6 |
| Demand | 12 | 8 | 9.6 |
| Winnability | 14 | 3 | 4.2 |
| Not-kill-zone | 12 | 2 | 2.4 |
| Distribution-fit | 16 | 7 | 11.2 |
| Moat | 12 | 3 | 3.6 |
| AI-outcome-fit | 8 | 4 | 3.2 |
| Pricing/margin/scale | 8 | 8 | 6.4 |
| **TOTAL** | **100** | | **≈ 53.2 / 100** |

### VERDICT — Product A: ❌ **NO-GO (53/100, well below the 70 bar).**
Real market, great margins, warm beachhead — but it's a frontal assault on Jobber (Canadian, owns the exact segment) and Housecall Pro/ServiceTitan, with **no data-moat transfer from Jaydeep's ad assets** and the highest switching cost in the stack. You'd win 4 design partners on trust and then stall. The only defensible version is *narrowing* drastically (a GC-specific workflow Jobber refuses to build) **or** going *thin-on-top* of Jobber via its Tier-2 API — but that's a feature, not a billion-$ company.

---

# PRODUCT B — AI Voice Front Desk / Receptionist for contractors

### 1. DEMAND — real, growing?
**Demand is real and acute — this is hair-on-fire.** Contractors missing 5–10 calls/week lose ~$45k–$120k/yr; each missed call ≈ $1,200; 85% of voicemail callers never call back. The buyer feels this *weekly*. AI-receptionist-for-contractors is one of the fastest-growing 2026 SMB AI categories with a crowded, well-reviewed vendor set. **Pain is sharper and more visceral than Product A's.** ([LeadTruffle](https://www.leadtruffle.co/blog/best-ai-answering-services-contractors-2026/), [PipelineOn](https://pipelineon.com/blog/ai-receptionist-contractor/)) `[Demand 9/10]`

### 2. COMPETITION + KILL-ZONE
**Newly a kill-zone — and the platform just walked in.**
- **🔴 Jobber AI Receptionist** (Builder+**Platform**) — launched **GA Aug 2025**, **200,000+ conversations handled by 2026**, **$99/mo add-on (bundled free in Plus plan)**. This is the decisive fact: the *Canadian system-of-record that Jaydeep's GC clients already use* now ships the exact product, pre-integrated, at the marginal cost of an upsell, with native access to scheduling/CRM/calendar. ([PR Newswire](https://www.prnewswire.com/news-releases/jobber-launches-ai-powered-receptionist-to-answer-calls-and-texts-for-busy-home-service-businesses-302531125.html))
- **Standalone competitors** (Builders/Resellers): Goodcall ($66–$208), Numa ($49), Smith.ai (hybrid $95–$300), Thoughtly, Retell-built agents, LeadTruffle, dozens of Vapi/Retell-wrapper shops. The category is **already saturated with thin wrappers.**
- ServiceTitan & Housecall Pro are following with native voice AI.

A standalone AI receptionist competes on two fronts at once: a swarm of commodity wrappers *below* and the SoR platforms *above* who win on integration + bundling + zero CAC. **Kill-zone, and the bundling makes it worse than Product A's.** `[Not-kill-zone 2/10]`

### 3. SYSTEM-OF-RECORD + INTEGRATION TIER
- **System of record is still Jobber/HCP/ServiceTitan** — the receptionist's value is *booking into their calendar*. So Product B is fundamentally **dependent on the SoR's API**, and the SoR is now also the competitor.
- **Integration tier:** **Jobber Tier 2** (can build a booking integration via GraphQL/OAuth + marketplace review) — *but Jobber will preference its own native Receptionist and can change/limit calendar-write scopes.* **ServiceTitan Tier 3** (pay-to-play + connection/rev-share). **HCP Tier 2.**
- **The trap:** the one integration you most need (write-to-calendar booking) is controlled by the company shipping the competing product. Tier-2 access exists today, but you're building on a competitor's rails with no contractual protection. ([Jobber Dev](https://developer.getjobber.com/docs/building_your_app/app_authorization/))

### 4. DISTRIBUTION FIT
Jaydeep's distribution is **genuinely strong here** — he runs the lead-gen ads for these GCs, so he sees *exactly* which leads get missed, and "you're paying me for leads that ring out — let me answer them" is a phenomenal, data-backed pitch with near-zero CAC to his ~4 GC clients. **This is the best distribution-fit story in the deck.** The problem isn't landing — it's that whatever he lands, Jobber re-bundles at $99 (or free) the moment the client's on Jobber. `[Distribution-fit 8/10]`

### 5. BUILD-MOAT
🟥 **Too-easy commodity.** A working AI receptionist is a Vapi/Retell + Twilio + a system prompt — buildable in days, which is *why the market is flooded*. The UI and the agent are trivially clonable. The only durable moat would be **(a) booking-integration depth into the SoR** (controlled by the competitor) or **(b) Jaydeep's ad-call data** — and this is the one place his data *partially* helps: he could close the loop between ad spend → call → booking → revenue in a way pure-voice vendors can't. But that's an *attribution* moat, not a *voice* moat, and it's thin. UI-clonability VERY HIGH; quality differentiation LOW; Jaydeep holds a *minor* data edge. `[Moat 3/10]`

### 6. PRICE-vs-COGS
**⚠️ The per-minute trap is real here.** All-in voice COGS in 2026 = **~$0.13–$0.31/min** (Vapi/Retell/Bland: STT + LLM + TTS + telephony). A contractor taking ~100–200 calls/mo × ~3 min ≈ 300–600 min/mo = **~$40–$185/mo of pure COGS** `[est]`. At a $99 price point (matching Jobber), a high-call-volume contractor can have **negative or single-digit gross margin**. You *need $200+/mo* to be safe, but Jobber sits at $99/bundled — so you're **margin-squeezed AND price-capped by the platform simultaneously.** ([Retell pricing](https://www.retellai.com/blog/ai-voice-agent-pricing-full-cost-breakdown-platform-comparison-roi-analysis)) `[Pricing/margin 4/10]`

### 7. SCORE

| Param | Weight | Raw /10 | Weighted |
|---|---|---|---|
| Pain | 18 | 9 | 16.2 |
| Demand | 12 | 9 | 10.8 |
| Winnability | 14 | 3 | 4.2 |
| Not-kill-zone | 12 | 2 | 2.4 |
| Distribution-fit | 16 | 8 | 12.8 |
| Moat | 12 | 3 | 3.6 |
| AI-outcome-fit | 8 | 8 | 6.4 |
| Pricing/margin/scale | 8 | 4 | 3.2 |
| **TOTAL** | **100** | | **≈ 59.6 / 100** |

### VERDICT — Product B: ❌ **NO-GO as a standalone bet (60/100, below the 70 bar).**
Sharpest pain, best distribution-fit, strong AI-outcome-fit — but it's a **commodity wrapper in a saturated market** where **the Canadian system-of-record (Jobber) shipped the identical product in Aug 2025, bundled at $99/free, with 200k+ conversations already and native calendar access.** You're price-capped by the platform *and* COGS-squeezed by per-minute voice economics — a vise. Standalone, you'd win Jaydeep's 4 clients and then get re-bundled away.

---

## Cross-cutting verdict for the vertical

| | Product A (Vertical CRM) | Product B (AI Receptionist) |
|---|---|---|
| **Score** | **53 / 100** | **60 / 100** |
| **System of record** | *Is* the SoR (worst place to compete) | Jobber / HCP / ServiceTitan |
| **Integration tier** | N/A (it's the SoR) — or Tier 2 if thin-on-top | Jobber **Tier 2**, ST **Tier 3** |
| **Kill-zone?** | Yes — Jobber/HCP/ServiceTitan | Yes — *worse*, Jobber bundles it native |
| **Distribution-fit** | Good (4 warm GCs) | Excellent (he owns the missed-call data) |
| **Margin** | Excellent (software) | Poor (per-minute voice trap) |
| **Verdict** | ❌ NO-GO | ❌ NO-GO standalone |

### The single biggest finding for this vertical
**Jobber — a Canadian company — owns the small-GC/trades system of record AND, since Aug 2025, ships its own bundled AI Receptionist ($99 add-on / free on Plus, 200k+ conversations).** That single fact craters *both* products: Product A asks contractors to rip out their highest-switching-cost tool to fight Jobber head-on, and Product B is the exact feature Jobber now gives away inside that tool. Jaydeep's real edge in construction is **his ad data and lead-gen distribution, not job-management or voice** — neither product converts that edge into a moat (no data-transfer for A; only a thin attribution edge for B).

**Where the actual opportunity hides (re-frame, not in scope but flagged):** a *thin attribution / lead-intelligence layer on top of Jobber's Tier-2 API* that closes the ad-spend → call → booked-job → revenue loop — the one thing Jaydeep's 24 Meta + 20 Google accounts uniquely power and that neither Jobber nor the voice wrappers can see. That's a feature-wedge, not yet a billion-$ company, but it's the only direction here where his proprietary asset *is* the moat.

---
*Sources: Grand View Research, GM Insights (FSM market); Jobber Developer Center & ServiceTitan App Marketplace Program Guide (integration tiers); PR Newswire / Jobber (AI Receptionist GA, 200k conversations); LeadTruffle, PipelineOn (missed-call economics); Retell AI / Vapi / Bland (voice COGS). Modeled call-volume/COGS figures tagged `[est]`.*
