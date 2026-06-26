# Market Size Dossier — Clinic-Native Marketing/Sales CRM + AI Voice Front Desk + Ad→Booked-Patient ROI Attribution

**Product:** Vertical SaaS for clinics — marketing/sales CRM + AI voice front desk (receptionist) + paid-ad → booked-patient ROI attribution.
**Primary vertical:** Physiotherapy clinics. **Expansion:** Chiropractic, then Dental.
**Geo sequence:** Canada first → United States.
**Date compiled:** June 2026.

> **Confidence legend:** 🟢 high (official/audited source, recent) · 🟡 medium (industry report, vendor-published, or one good source) · 🟠 low (triangulated estimate, no clean primary data — reasoning stated).

---

## 1. Hard numbers — the addressable units

### 1a. Physiotherapy (primary)

| Metric | Figure | Confidence | Source / note |
|---|---|---|---|
| Registered physiotherapists, Canada (2024) | **30,776** licensed; **21,683** in direct patient care | 🟢 high | CIHI, *Physiotherapists in Canada 2024* |
| Physiotherapy **clinics / centers**, Canada | **~2,200** (2,172 listed, Jan 2025) | 🟠 low–med | Rentech Digital business directory scrape. No official clinic-count register exists in Canada — see uncertainty note. |
| Practicing physical therapists, US (2024) | **~602,000** licensed; **267,200** PT jobs (BLS) | 🟢 high | BLS Occupational Outlook; cross-river-therapy compilation |
| PT-providing **clinics/establishments**, US (2024) | **50,883** clinics providing PT/OT/speech/audiology | 🟡 medium | ResearchAndMarkets, *U.S. Physical Therapy Clinics 2024* ($53B industry) — note this is the broader NAICS 621340 bucket (PT+OT+speech), so a pure-physio subset is lower. |
| US PT industry size | **$53B** (2024, +6.4% YoY); top 6 chains = 4,949 clinics (9.7%) → **highly fragmented** | 🟢 high | ResearchAndMarkets 2024 |

**Working clinic counts used below:** Canada physio **~2,200**; US physio (pure-play, de-rated from the 50,883 PT/OT/speech bucket to ~60–70% that are physio-led) **~32,000–38,000**. I use **~35,000** as the US physio midpoint and flag it 🟠.

### 1b. Chiropractic (expansion 1)

| Metric | Figure | Confidence | Source |
|---|---|---|---|
| Chiropractors, Canada (Dec 2024) | **5,649** | 🟢 high | Canadian Chiropractic Association |
| Chiropractic **offices**, Canada (NAICS 62131) | **~3,500–4,500** est. (practitioner-to-office ratio ~1.3) | 🟠 low | Derived from CCA practitioner count + StatCan NAICS 62131 structure |
| Chiropractors, US | **~70,000** | 🟡 medium | ACA / industry compilations |
| Chiropractic **offices**, US | **~40,000** est. | 🟠 low | Derived (US chiro offices run ~1.7 DCs/office) |

### 1c. Dental (expansion 2)

| Metric | Figure | Confidence | Source |
|---|---|---|---|
| Dental **practice establishments**, US | **135,665** (Census CBP); some sources 178,000+ | 🟢 high | US Census County Business Patterns 2023 |
| Active dentists, US (2024) | **202,485** | 🟢 high | ADA Health Policy Institute |
| Offices of dentists, Canada (NAICS 6212) | **33,287** establishments (15,430 non-employer + 17,857 employer) | 🟢 high | StatCan / Canadian Industry Statistics 2025 |

---

## 2. % of small clinics running PAID digital ads — **the key SAM driver**

**There is no clean, physio-specific "% running paid ads" dataset.** This is the single softest input in the model and is flagged 🟠 throughout. Triangulated from SMB-advertising surveys:

| Signal | Figure | Confidence | Source |
|---|---|---|---|
| US SMBs running their own PPC campaigns | **~65%** (80%+ of those use Google Ads) | 🟡 medium | Mafost Marketing / SMB PPC compilation 2025 |
| US SMBs using Facebook for **paid** ads | **63.3%** (of those advertising online) | 🟡 medium | Statista SMB survey 2022 |
| SMBs running Facebook ads **monthly** (mature markets) | **30–45%** | 🟠 low | uproas / SMB advertising stats |
| SMBs planning to *increase* online ad investment | 41% increasing; 50% of non-users plan to start | 🟡 medium | SMB marketing surveys |

**Why the headline % is lower for physio than generic SMB:** Healthcare local-service clinics skew toward **referral + Google Business Profile + word-of-mouth**, and a large tail are solo/owner-operators who do little or no paid acquisition. Generic SMB "65% do PPC" overstates physio because it includes e-commerce and high-intent retail. But physio is a **high-CPC, high-LTV, locally-competitive** category where paid search works, so adoption is meaningfully above zero.

**Defensible estimate used in the model:**
> **20–35% of physio clinics run *meaningful, recurring* paid Google/Meta ads** (vs. one-off boosts). **Midpoint: ~25%.** Confidence 🟠 **low.** Reasoning: generic SMB paid-ad adoption is ~50–65%; physio is below that due to referral dependence and a solo-practitioner tail, but above a passive floor of ~10–15% because the unit economics of a booked physio patient ($1,000–3,000+ lifetime) justify paid acquisition for growth-minded owners.

---

## 3. Ad spend & cost-per-lead per clinic

| Metric | Figure | Confidence | Source |
|---|---|---|---|
| Typical physio clinic monthly **ad spend** | **$500–$1,500/mo** on Google Ads (starter $500–$1,000) | 🟡 medium | PracticePromotions, Direct Response PT, PatientPartners |
| Physio **cost-per-lead** | **$10–$25** (competitive local markets $20–$60) | 🟡 medium | PracticePromotions / Therapy Marketer benchmarks |
| Physio **cost-per-click** | **$2–$5** | 🟡 medium | Same |
| Marketing as % of gross revenue | **5–8%** (10% for aggressive growth) | 🟡 medium | Industry benchmark |
| Generic SMB monthly ad spend (all verticals) | $1,000–$10,000; Meta median $200–$1,200 | 🟡 medium | Statista / Mafost |

**Implication:** A physio clinic running ads spends ~**$6,000–$18,000/yr** on media alone. A $99–$299/mo software layer that proves and improves that ROI is a **small fraction (5–25%) of the ad budget it governs** — a healthy "tax on spend" position.

---

## 4. Software pricing benchmarks — what clinics already pay

| Product | Layer | Monthly price | Confidence | Source |
|---|---|---|---|---|
| **GoHighLevel** | CRM / marketing / automation (white-label) | **$97** (Starter) → $297 → $497 agency | 🟢 high | gohighlevel.com/pricing |
| **Weave** | Patient comms / phones (dental, PT) | **~$399** Essentials (+$750 setup) → ~$499 Pro | 🟡 medium | Weave not public; HIP Creative / SelectHub reports |
| **NexHealth** | Patient experience / scheduling / EHR sync | **$299–$350+/mo** | 🟡 medium | G2 / Capterra / NexHealth |
| **Pabau** | Practice management (clinics, med-spas) | **from $62/mo** per user | 🟡 medium | pabau.com/pricing |
| **WebPT** | PT EMR (+ Reach marketing add-on) | **from $99/mo**, Reach add-on custom | 🟡 medium | webpt.com/pricing |
| **AI voice receptionist** (Kickcall, MyAIFrontDesk, etc.) | AI front desk | **$65–$299/mo**; healthcare/HIPAA +20–40% | 🟡 medium | NextPhone, AgentZap, Ringly 2026 guides |

**Takeaway:** The combined "comms + CRM + AI front desk + attribution" wallet a clinic already spends is **$150–$700/mo across 2–3 tools.** A **$99–$299/mo** bundle that consolidates them is priced credibly inside the existing wallet — **ACV of $1,188–$3,588/yr is realistic**, and the AI-front-desk + attribution combo can justify the top of that range. Cross-check: **Weave's ARR/customer is ~$1,850** 🟢 — a useful real-world anchor for "what a clinic comms platform actually collects per account."

---

## 5. TAM / SAM / SOM — the funnel (ranges, not false precision)

**ACV tiers used:** $99/mo = **$1,188/yr** (entry) · $199/mo = **$2,388/yr** (mid) · $299/mo = **$3,588/yr** (full stack w/ AI front desk + attribution). Blended planning ACV: **~$2,400/yr**.

### TAM — all physiotherapy clinics (CA + US)

| | Clinics | × Blended ACV ($2,400) |
|---|---|---|
| Canada physio (~2,200) | 2,200 | **~$5.3M** |
| US physio (~35,000, 🟠) | 35,000 | **~$84M** |
| **Physio-only TAM (CA+US)** | **~37,000** | **~$89M/yr** (range **$44M–$133M** at $1,188–$3,588 ACV) |

**Confidence: 🟡 medium** (clinic counts are the weak link, esp. US physio subset 🟠).

### Broader TAM — incl. chiropractic + dental

| Vertical | Clinics (CA+US) | × $2,400 ACV |
|---|---|---|
| Physio | ~37,000 | ~$89M |
| Chiropractic (~44,000) | 44,000 | ~$106M |
| Dental (~169,000: 135,665 US + 33,287 CA) | 169,000 | ~$406M |
| **Total broad TAM** | **~250,000 clinics** | **~$600M/yr** (range $300M–$900M) |

**Confidence: 🟡 medium.** This is the "everything we could ever sell to" ceiling — dental dominates it by sheer count, and dental is where Weave/NexHealth already are (validation *and* competition).

### SAM — physio clinics that RUN PAID ADS (the founder's headline)

> *"How many physio clinics do paid Google/Meta ads and get inbound leads?"*

| | Clinics | × % running ads (25%, 🟠) | Ad-running clinics | × $2,400 ACV |
|---|---|---|---|---|
| Canada physio | 2,200 | 25% | **~550** | **~$1.3M** |
| US physio | 35,000 | 25% | **~8,750** | **~$21M** |
| **Physio SAM (CA+US)** | | | **~9,300 clinics** | **~$22M/yr** |

**SAM range (the honest spread):**
- Low (20% run ads, $1,188 ACV): **~7,400 clinics → ~$9M/yr**
- Mid (25% run ads, $2,400 ACV): **~9,300 clinics → ~$22M/yr**
- High (35% run ads, $3,588 ACV): **~13,000 clinics → ~$47M/yr**

> **Headline SAM ≈ $22M/yr (range $9M–$47M).** Confidence 🟠 **low–medium** — entirely hostage to the "% running ads" assumption (Section 2), which has no clean primary source.

**Broader SAM (physio+chiro+dental running ads, 25%):** ~62,000 ad-running clinics × $2,400 ≈ **~$150M/yr** (range ~$60M–$220M). Chiro and especially dental are heavier paid-ad spenders than physio, so the real % for those verticals is likely higher than 25% — this broad SAM is probably *conservative*.

### SOM — realistic 3-year capture

**Logic:** Canada-first, physio-first, founder-led GTM. Start where the founder can win: **Canadian physio clinics running ads (~550)** plus an early US toehold. Early-stage vertical SaaS with a founder selling realistically captures **low single-digit % of SAM in 3 years**.

| Scenario | Capture logic | Customers (yr 3) | ARR @ $2,400 ACV |
|---|---|---|---|
| **Conservative** | 30% of CA ad-running physio (165) + 200 US | **~365** | **~$0.9M** |
| **Base** | 50% of CA ad-running physio (275) + 600 US (~7% of US ad-running physio) | **~875** | **~$2.1M** |
| **Aggressive** | CA saturation + 1,200 US + early chiro spillover | **~1,800** | **~$4.3M** |

> **Realistic 3-yr SOM ≈ $1–2M ARR (base), upside to ~$4M** if US lands and chiro expansion starts. Confidence 🟡 for the *shape*, 🟠 for exact numbers (depends on funnel conversion + churn, unknown pre-launch).

---

## 6. Sanity check vs. comparable outcomes

| Comparable | What they reach | Read-through |
|---|---|---|
| **Weave** (NYSE: WEAV) | **$204M revenue** (2024, +20% YoY); ~$1,850 ARR/customer → **~110,000 customers** implied | Public, dental-comms-led. Proves a clinic-comms platform can be a **$200M+ revenue** company — *but it took the whole of dental + multi-vertical + 10+ yrs + public capital.* |
| **Pabau** | **3,500+ practices, 40+ countries**, 25,000 users | A focused practice-mgmt SaaS reaches low-thousands of clinics → ballpark **$8–20M revenue** range (est. 🟠). This is the most relevant comp for "what a focused clinic SaaS realistically becomes." |
| **NexHealth** | VC-backed, $300+/mo ACV, dental/medical scheduling | Venture-scale *because* it went horizontal (dental→medical→EHR integrations API), not because physio alone is big. |
| **GoHighLevel** | $97–$497/mo, horizontal agency CRM | Proves the *price point* and that the CRM+automation layer is a commodity wedge — competition risk for the CRM portion. |

**Ceiling read:** A **physio-only, CA+US** play tops out around the **Pabau zone — single-digit to low-double-digit $M revenue.** To touch Weave/NexHealth scale ($100M+) you *must* expand into dental (where the count and ad-spend are 5–7× physio) and/or go multi-country.

---

## 7. Honest verdict

### Headline numbers
- **Physio clinics:** Canada **~2,200** (🟠 low — no official register); US **~35,000** physio-led of 50,883 PT/OT/speech establishments (🟠 low–med).
- **% running paid ads:** **~25%** midpoint, defensible range **20–35%** (🟠 **low** — no clean source; biggest single uncertainty in this dossier).
- **SAM (physio running ads, CA+US):** **~$22M/yr** (range **$9M–$47M**).
- **SOM (3-yr, realistic):** **~$1–2M ARR**, upside ~$4M.

### The single biggest uncertainty
**The "% of physio clinics running paid ads."** No primary dataset exists; it's triangulated from generic SMB surveys and de-rated for healthcare referral dependence. The SAM swings **5×** ($9M ↔ $47M) on this one number. **Before betting on the SAM, validate it directly** — e.g., scrape Google Ads Transparency / Meta Ad Library for a sample of 200 Canadian physio clinics and count how many are actively running ads. That one experiment de-risks the entire model.

### Is this a $1–5M business or a venture-scale one?

> **As scoped — physio-only, Canada+US — this is a "nice $1–5M ARR business," NOT a venture-scale one.** The physio SAM (~$22M) is simply too small: even at an aggressive 20% lifetime market share you cap around **$4–5M ARR**. That's a strong, fundable-by-revenue, lifestyle-to-lower-mid-market software company — not a $100M outcome.

> **It becomes venture-scale ($10–50M+, with a path toward $100M) ONLY if the expansion thesis is real and executed:** chiro + **dental** multiply the clinic count ~7× (broad TAM ~$600M, broad SAM ~$150M+), and dental clinics both spend more on ads and already pay $300–500/mo for exactly this kind of tooling (Weave/NexHealth prove the wallet). **The AI voice front desk + ad-ROI attribution is the differentiator** that could justify premium ACV and pull the product *up-market across verticals* rather than being trapped in physio.

**Bottom line:** Physio is the right **beachhead** (focused, underserved, founder has domain access in Canada), but the **business case rests on the expansion** to chiro/dental and the US. Underwrite physio-CA as the wedge to prove product + GTM, and underwrite the *real* TAM as the multi-vertical clinic market. Verdict: **$1–5M ceiling as currently scoped; $10–50M+ achievable only with the dental expansion executed.**

---

## Sources
- CIHI — Physiotherapists in Canada 2024: https://www.cihi.ca/en/physiotherapists
- BLS — Physical Therapists OOH: https://www.bls.gov/ooh/healthcare/physical-therapists.htm
- ResearchAndMarkets / BusinessWire — U.S. Physical Therapy Clinics 2024 ($53B): https://www.businesswire.com/news/home/20250102302318/en/
- CrossRiverTherapy — PT statistics compilation: https://www.crossrivertherapy.com/research/physical-therapy-statistics
- Rentech Digital — Physiotherapy Centers in Canada: https://rentechdigital.com/smartscraper/business-report-details/canada/physiotherapy-centers
- Canadian Chiropractic Association — Quick Facts: https://chiropractic.ca/media-centre/quick-facts/
- ADA Health Policy Institute — Dentist Workforce: https://www.ada.org/resources/research/health-policy-institute/dentist-workforce
- US Census County Business Patterns — Offices of dentists (6212): https://data.census.gov/profile/6212_-_Offices_of_dentists
- Canadian Industry Statistics — Offices of dentists 6212: https://ised-isde.canada.ca/app/ixb/cis/businesses-entreprises/6212
- Canadian Industry Statistics — Offices of chiropractors 62131: https://ised-isde.canada.ca/app/ixb/cis/summary-sommaire/62131
- Statista — Digital ad platforms used by SMBs US 2024: https://www.statista.com/statistics/633268/ad-platforms-smbs-usa/
- Mafost Marketing — Money Spent by Small Businesses on Ads 2025: https://mafostmarketing.com/ppc-advertising/insights/money-spent-by-small-businesses-on-ads-2025/
- PracticePromotions — Physical Therapy Marketing Cost / Google Ads: https://practicepromotions.net/physical-therapy-marketing-cost/
- Direct Response PT — How much should PT clinics spend on Google Ads: https://www.directresponsept.com/how-much-should-physical-therapy-clinics-spend-on-google-ads/
- Therapy Marketer — Benchmarks for therapy practice Google Ads: https://www.therapymarketer.co/articles/benchmarks-for-therapy-practice-google-ads
- GoHighLevel pricing: https://www.gohighlevel.com/pricing
- Weave pricing (HIP Creative review): https://hip.agency/weave-dental-software-review/
- NexHealth pricing (G2): https://www.g2.com/products/nexhealth/pricing
- Pabau pricing: https://pabau.com/pricing/  · Pabau about (3,500+ practices): https://pabau.com/about/
- WebPT pricing: https://www.webpt.com/pricing
- Weave Q4/FY2024 financials ($204M rev): https://investors.getweave.com/news-events/press-releases/detail/211/
- AI receptionist pricing guides — NextPhone / AgentZap / Ringly: https://www.getnextphone.com/blog/ai-receptionist-cost · https://agentzap.ai/blog/ai-receptionist-pricing-complete-cost-guide-2025
- Kickcall (healthcare AI receptionist): https://www.kickcall.ai/healthcare
