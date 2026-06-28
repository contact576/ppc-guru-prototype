# SaaS Market-Gap Research — Consolidated Master Report

*Compiled analyst dossier across all 6 source tabs. Built to be self-contained: paste or attach this single file into any future brainstorming chat and it carries the full picture — no other files needed.*

**Prepared as:** demand-side (Google Ads Keyword Planner) × supply-side (competitive SaaS teardown) gap analysis.
**Demo/data window:** June 1, 2022 → May 31, 2026 (48 months of monthly search data).
**Currency:** All bids/volumes reported in **CAD** (as exported).

---

## 0. TL;DR — the one-paragraph thesis

The SaaS CRM/sales/ops market this data covers is a **power-law demand market** (top ~12 keywords = ~68% of US volume) being served by a supply base that is **~70% legacy architecture with AI bolted on afterward**. Across **164 competitor records (two AI engines)**, the loudest, most repeated customer complaints are **(1) pricing that punishes growth, (2) bad/unverified data, (3) narrow tools that force "tool sprawl," and (4) enterprise complexity**. Demand momentum is sprinting toward **AI-native, consolidated "all-in-one," and clean-data** plays (GoHighLevel, Clay, Apollo, Close, Attio all rising fast) while **legacy point-tools decline** (ConvertKit, ActiveCampaign, Mailchimp, Freshdesk, Salesloft all falling double digits). **The gap = an AI-native, honestly-priced, clean-data tool that collapses 3–4 point-tools into one** — and, distinctively, the *research method itself* (joining demand momentum to competitor weakness) is a productizable SaaS none of the 85 competitors sell.

---

## 1. Source data inventory (what this report is built on)

| # | Dataset | Tab | Scope | Rows | Key columns |
|---|---|---|---|---|---|
| 1 | Keyword Search Volume | **USA-wide** | United States | 289 keywords | vol, 3mo Δ, YoY Δ, competition, comp index, CPC low/high, 48 monthly cols |
| 2 | Keyword Search Volume | **Canada-wide** | Canada | 161 keywords | (same schema) |
| 3 | Keyword Search Volume | **Worldwide** | Entire world | 329 keywords | (same schema) |
| 4 | CRM Competitive Teardown | **Google engine** | 14 categories | 79 tools × 28 cols | valuation, GTM, moat, AI-vs-legacy, pricing, vulnerability, tech stack, socials |
| 5 | CRM Competitive Teardown | **OpenAI engine** | 11 categories | 85 tools × 23 cols | (similar schema, different reliability profile — see §5) |
| 6 | CRM Teardown — Legend | OpenAI workbook | methodology key | 9 rows | how to read valuations/team size/ethnicity (treat as directional, not investment-grade) |

**Not present:** the OpenAI workbook's "Sources & Audit" tab (URL citations). Everything else is in hand and analyzed.

---

## 2. DEMAND SIDE — the keyword market

### 2.1 Market size by geography

| Geography | Keywords | Total avg searches/mo | Avg top-of-page CPC (high) | Competition mix |
|---|---|---|---|---|
| **Worldwide** | 329 | **25,135,650** | $55.31 | 174 Low / 151 Med / 4 High |
| **USA** | 289 | **6,013,630** | $95.21 | 135 Low / 145 Med / 9 High |
| **Canada** | 161 | **910,840** | $75.78 | 64 Low / 90 Med / 6 High |

**Reads:**
- **World is ~4× the US; Canada is ~15% of the US.** Use these as rough TAM multipliers.
- **US clicks are the most expensive** ($95 avg high bid) — highest commercial intent / willingness to pay. World CPC is lower because it includes cheap-traffic geographies.
- **Competition is "Low/Medium" almost everywhere** — but that is a *trap*: most volume is **branded navigational search** (people typing a brand name to log in), which is cheap precisely because you can't profitably win a competitor's brand term.

### 2.2 Demand is a power law (concentration risk + opportunity)

- **USA:** top 12 keywords ≈ 5.3M of 6.0M (**~68%**). QuickBooks (software + login) alone ≈ **1.45M**.
- The "head" is dominated by **navigational/branded** terms (notion, calendly, quickbooks login). The **"body" and "tail"** (category and problem terms) are where a newcomer can actually compete.

### 2.3 The leaderboard *changes by geography* (a real segmentation axis)

| Rank | USA | Worldwide | Canada |
|---|---|---|---|
| 1 | quickbooks software (1.0M) | **notion (6.12M)** | quickbooks software (165K) |
| 2 | notion (673K) | mailchimp (1.83M) | notion (135K) |
| 3 | mailchimp (550K) | quickbooks software (1.83M) | mailchimp (110K) |
| 4 | quickbooks login (450K) | **clay (1.5M)** | quickbooks login (60.5K) |
| 5 | calendly (368K) | clickup (1.22M) | calendly (49.5K) |

**Key flip:** **Clay** is a *global* phenomenon (1.5M worldwide) but only 135K in the US — international-led growth. **Close** hits 1.0M worldwide at **+50% YoY**. Geography is not noise; it's a positioning decision.

### 2.4 Momentum — what's rising and falling (the most decision-useful cut)

**WORLDWIDE GROWERS (YoY, vol ≥ 20k):**

| YoY | Volume | Keyword | Signal |
|---|---|---|---|
| +83% | 90.5K | salesforce crm | brand resurgence |
| +83% | 22.2K | **attio** | AI-native CRM rising |
| +82% | 135K | **apollo io** | AI data + outbound |
| +50% | 1.0M | **close** | calling-CRM consolidation |
| +50% | 450K | **folk** | modern/pretty CRM |
| +50% | 301K | brevo | all-in-one marketing |
| +50% | 60.5K | ahrefs / +50% 22K semrush | SEO tooling demand |
| +22% | 823K | xero login | accounting steady-grow |

**USA-specific extreme growers** (4-yr momentum, last-6mo vs first-6mo): **brevo +6,320%**, salesforce crm +710%, **gohighlevel +573%**, apollo +346%, close +116%, clay +44%.

**WORLDWIDE DECLINERS (YoY):**

| YoY | Volume | Keyword | Signal |
|---|---|---|---|
| −70% | 74K | **convertkit / kit** | creator-email collapsing |
| −55% | 27K | clearbit | absorbed into HubSpot |
| −45% | 110K | freshdesk | legacy support fading |
| −45% | 27K | monday crm | — |
| −33% | 1.83M | **mailchimp** | post-Intuit decline |
| −33% | 135K | **activecampaign** | legacy marketing automation |
| −33% | 74K | oracle netsuite | legacy ERP |

**Pattern:** money/attention is **leaving** standalone legacy email-marketing + old support suites, and **flowing into** AI-native CRM (Attio), GTM-data (Clay, Apollo), all-in-one (GHL, Brevo, Close), and SEO tooling.

### 2.5 CPC economics — where buyers burn the most money (highest intent)

**Worldwide highest CPC (vol ≥ 10k):**

| CPC (high) | Volume | Keyword |
|---|---|---|
| **$1,415.25** | 246K | gohighlevel |
| $148.13 | 135K | activecampaign |
| $117.01 | 74K | oracle netsuite |
| $88.63 | 18K | chili piper |
| $74.10 | 12K | leadfeeder |
| $71.21 | 165K | nutshell |
| $67.14 | 33K | seamless ai |
| $66.32 | 49.5K | salesloft |

**Reads:** The most expensive clicks cluster around **agency/all-in-one (GHL — the runaway #1), marketing automation, lead routing, and B2B data**. High CPC = high commercial intent = where competitors are already willing to pay dearly to acquire = both the most lucrative and most contested ground. GoHighLevel's CPC is an order of magnitude above everything else — the agency/all-in-one category is the hottest money in the dataset.

---

## 3. SUPPLY SIDE — the competitor landscape

Two independent AI-engine teardowns (Google: 79 tools; OpenAI: 85 tools), **77 tools overlap** → built-in cross-validation set.

### 3.1 Category coverage

| Google engine (14 cats) | n | OpenAI engine (11 cats) | n |
|---|---|---|---|
| CRM & Sales Automation | 12 | B2B Contact Databases & Revenue Intelligence | 13 |
| Productivity & Workspace DBs | 11 | Core Workspace, PM & No-Code | 12 |
| B2B Intelligence & Prospecting | 9 | Sales Pipelines & Lightweight CRMs | 10 |
| Sales Engagement & Outbound | 8 | Outbound Outreach & Multi-Channel | 10 |
| Customer Support & Success | 8 | Marketing Automation & Lead Nurturing | 7 |
| Marketing Automation | 7 | Customer Support & Shared Inbox | 7 |
| Fintech & Financial Operations | 7 | All-in-One Enterprise CRM & Agency | 7 |
| Conversation Intelligence | 4 | Corporate Finance/Accounting/Capital | 7 |
| Enterprise CRM & ERP | 4 | HR, Payroll & ATS | 7 |
| Sales Tools & Lead Routing | 4 | Inbound Routing/Scheduling/Intent | 4 |
| Comms & Telephony / HR / All-in-One / AI Sales | 1–2 each | Cloud Ops / Cybersecurity / Web | 1 |

**OpenAI adds HR/payroll/ATS depth** (Deel, Rippling, Greenhouse, Lever, Lattice, BambooHR) + Vercel — broader adjacent coverage.

### 3.2 The structural finding: ~70% LEGACY, AI bolted on

| AI posture | Google engine | OpenAI engine |
|---|---|---|
| **Legacy (AI retrofitted)** | 55 / 79 (70%) | 39 / 85 (46%) |
| **AI-native** | 20 / 79 (25%) | 37 / 85 (44%) |
| Hybrid / Other | 4 | 9 |

*(The two engines disagree on how generously to label "AI-native" — Google is stricter, OpenAI looser. Consensus truth: a **large legacy majority** with AI added as a feature, not a foundation. An architected-AI-from-the-data-model-up product has clear white space either way.)*

### 3.3 The complaint map — coded across all records (THE attack surface)

| Complaint theme | Google (of 79) | OpenAI (of 85) | Interpretation |
|---|---|---|---|
| **Pricing / cost scaling** | 18 | **37** | #1 pain — credit-burn & per-contact pricing punish growth (Clay, Klaviyo, HubSpot, Intercom, Lusha) |
| **Narrow / missing features** | **24** | 9 | Tools deliberately narrow → users hit a wall → **tool sprawl** (Folk, Calendly, Woodpecker) |
| **Complexity / UX** | 15 | 26 | Enterprise tools need admins (Salesforce, SAP, Outreach, Jira) |
| **Data quality** | 16 | 16 | **Both engines agree** — prospecting tools ship unverified/catch-all/outdated data (Seamless, Hunter, Lusha, Apollo) |
| **Reporting / analytics** | 8 | 6 | Custom reporting weak across the board |
| **Integration / stability** | 8 | 3 | Sync latency, extension instability |

**Highest-confidence signal = data quality** (both engines independently flag ~16 tools). This is the single most corroborated weakness and directly mirrors the user's own PPC work (out-of-area leads, fake $8,000 deal values).

### 3.4 GTM concentration (everyone fishes in the same pond)

Google-engine distribution: **PLG (21) + Inbound/Content (22)** dominate; Outbound/founder-led (12); ABM/direct (1). Distribution is **undifferentiated** → rising CAC → a **research/data-led wedge is itself a differentiator.**

### 3.5 Valuation landscape

~40 of 79 (Google) / 43 of 85 (OpenAI) tools reference **$1B+ valuations** — this is a market of well-funded incumbents. Per the Legend, treat specific figures as **directional, not investment-grade** (public rows use parent market cap; private rows use last disclosed transaction or "undisclosed").

---

## 4. DEMAND × SUPPLY — the gap synthesis

Overlaying the two sides, four gaps survive scrutiny:

| # | Gap | Demand evidence | Supply evidence | Why it's open |
|---|---|---|---|---|
| **1** | **AI-native consolidation** ("all-in-one, done right") | GHL +573% & $1,415 CPC; Brevo, Close, Attio rising; narrow-feature complaints | 70% legacy; 24 "missing features" complaints; tool-sprawl | Incumbents can't re-platform; buyers want fewer tools |
| **2** | **Honest / clean data** | Apollo, Clay, ZoomInfo high demand | **Both engines flag ~16 tools** on data quality (the #1 corroborated weakness) | Hardest complaint to fix on legacy stacks; moat = verified data + transparency |
| **3** | **Pricing that doesn't punish scale** | Demand fleeing tools as they get expensive (Mailchimp −33%) | 37 OpenAI / 18 Google pricing-pain complaints | Credit-burn model is industry default → flat/outcome pricing is a wedge |
| **4** | **"Research-as-product" / market-gap radar** | This very dataset (demand momentum) | None of 85 competitors sell gap-finding | The methodology in *this report* is itself a product |

---

## 5. DATA QUALITY & METHOD NOTES (read before trusting any single number)

**The two CRM engines have opposite reliability personalities** — verified numerically:

| Dimension | Google engine | OpenAI engine |
|---|---|---|
| Character | **Confident & granular** | **Conservative & honest** |
| Valuations | Specific ("$1.5B") | Often "not publicly disclosed" |
| Tech stack | Per-tool specifics ("Node, PHP, React, MySQL") | **Boilerplate** (only 11–14 unique values across 85 rows = category templates) |
| Founders' education/roles | Specific per tool | **1 unique value** = pure template ("verify before use") |
| Coverage | CRM/sales-centric | Broader (adds HR/payroll/ATS) |
| Risk | Some specifics likely **fabricated/estimated** | Trustworthy but **thin** on technical columns |

**Practical rule for future chats:**
- Use the **OpenAI sheet** for the **honest qualitative read** (vulnerability, ICP, north-star, valuation caveats).
- Use the **Google sheet** for **granular hypotheses** (specific tech/pricing/GTM/social) — but treat specifics as *leads to verify*, not facts.
- Where **both engines flag the same weakness on the same tool → high-confidence** (weight these highest).
- Keyword data: numbers are **bucketed** (Keyword Planner rounds to 9,900 / 12,100 / 18,100 etc.), so treat as **ranges/relative**, not exact. Branded-navigational head terms ≠ winnable demand.
- All money in **CAD**; do not mix currencies in a single total.

---

## 6. OPEN QUESTIONS FOR NEXT BRAINSTORM (carry-forward)

1. **Geography focus:** Lead with Worldwide (25.1M TAM, Clay/Close-led) or US-first (highest CPC/intent)?
2. **Which gap to build:** all-in-one consolidation (#1), clean-data moat (#2), pricing wedge (#3), or research-as-product (#4)?
3. **ICP:** SMB agencies (where GHL wins) vs. solo/founders (Folk, Streak, Notion) vs. mid-market sales teams?
4. **Wedge vs. suite:** enter narrow (one painful job, done AI-native) then expand, or launch consolidated?
5. **Moat:** is the defensible asset the **data** (verified/clean), the **AI workflow**, or the **research/insight layer**?

---

## Appendix A — Fastest movers cheat-sheet

**Rising (build *with* the current):** salesforce crm, attio, apollo, close, folk, brevo, gohighlevel, clay, ahrefs, semrush, xero, front, crisp, klaviyo, fathom, clickup.

**Declining (avoid / disrupt):** convertkit/kit, clearbit, freshdesk, monday crm, mailchimp, activecampaign, oracle netsuite, salesloft, zendesk, seamless ai, microsoft dynamics 365.

**Highest commercial intent (most expensive clicks):** gohighlevel ($1,415), activecampaign ($148), oracle netsuite ($117), chili piper ($89), leadfeeder ($74), nutshell ($71), seamless ai ($67), salesloft ($66).

## Appendix B — The 4 repeatable complaint archetypes (verbatim themes)

1. *"Pricing scales rapidly / credits disappear fast"* — Clay, Klaviyo, HubSpot, Intercom, Lusha, Mailchimp.
2. *"Lacks X / missing by design / cannot do Y"* — Folk (no pipeline automation), Calendly (no conditional routing), Woodpecker (no call/SMS), Attio (no calling).
3. *"Unverified / catch-all / outdated data"* — Seamless.AI, Hunter, Lusha, Apollo (deliverability), Cognism (density outside EU).
4. *"Too complex / needs admins / rigid"* — Salesforce, SAP, NetSuite, Outreach, Jira.

---

*End of consolidated report. Single-file, self-contained — reusable as the canonical input for all downstream SaaS-gap brainstorming.*
