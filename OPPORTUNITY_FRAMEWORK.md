# The Opportunity Framework — how we decide what to build

*A repeatable funnel for finding ONE billion-dollar, AI-native, vertical bet that fits Jaydeep's unfair assets. Any idea — AI voice, agency-replacement, anything — is run through the same seven gates. Weak ideas die early and cheaply. We go DEEP in one direction, never wide. This is the system; the skills (`/market-census`, `/demand-scan`, `/pain-mine`, `/opportunity-score`, `/research-brain`) execute each stage.*

---

## The operating beliefs (locked — these shape every gate)

1. **Outcome, not tool.** We sell results (booked patients, signed listings), priced per outcome. Software is the margin engine, not the product. ("Service-as-a-software," not seat-licensed SaaS.)
2. **Vertical beats horizontal.** Go deep in ONE industry we understand and can reach. Horizontal tools get crushed between foundation models above and commoditization below.
3. **The moat is never the software.** Anyone can build the software now (we're proof). Defensibility = **distribution we own · proprietary workflow/data · integration into the system of record · trust in a high-stakes vertical.**
4. **Radically few humans + AI leverage.** Win lean. Headcount is not the weapon; it's the incumbent's overhead. Team = Jaydeep + Shrikaanth + AI executors + a couple advisor/rev-share helpers. (See RESEARCH_BRAIN node 7.)
5. **Painkillers, not vitamins.** Only "hair-on-fire" pain renews. If 10 people won't beg for it, drop it.
6. **Unfair advantage first.** Jaydeep's assets — 7 physio clinics, a psychology clinic, ~4 general-contractor clients, a ~10,000-realtor network, a running PPC agency throwing off cash — are the entry. A bet that doesn't use them is a bet we have no special right to win.

---

## The funnel — 7 stages, each with a hard gate

> Rule: an idea must PASS a gate to spend money/time on the next. A FAIL kills it or sends it back to reframe. Record every verdict in RESEARCH_BRAIN.

### Stage 0 — FRAME  *(skill: /research-brain)*
- Restate the candidate as a one-line bet: *"[AI does X outcome] for [vertical], reaching them via [our distribution], priced per [outcome]."*
- List which of Jaydeep's assets it uses. **Gate:** if it uses none of our unfair assets → reframe or drop.

### Stage 1 — INDUSTRY PAIN SCAN  *(skill: /pain-mine, vertical mode)*
- For the target vertical: what is the most acute, expensive, frequent problem the owner has *today*? Quantify it ($ lost per missed call, per empty slot, per churned client).
- Score **Pain Intensity (0–10)**: acute × expensive × frequent × they-already-pay-to-fix-it.
- **Gate:** Pain ≥ 7 ("hair on fire") or drop. Vitamins die here.

### Stage 2 — DEMAND VALIDATION  *(skill: /demand-scan)*
- Real, **non-branded** search demand for the problem/solution (not brand names). Volume, 4-yr trend, seasonality, commercial intent, CPC (proxy for willingness-to-pay).
- **Gate:** demonstrable and growing demand, or a clear "demand exists offline but not yet searched" thesis. Flat/declining/branded-only → drop.

### Stage 3 — PLAYER CENSUS  *(skill: /market-census)*
- **Saturation sampling:** 8–12 search angles until new queries stop surfacing new names. Real population, NOT Google's "About N results" (that number is garbage — never use it).
- **Tag every player: Builder / Reseller / Platform.** (In AI markets, most "competitors" are white-label resellers — tagging usually collapses a "crowded" market to a handful of real builders.)
- Enrich: funding, LinkedIn followers + headcount (IG is noise), traffic if available.
- **Gate:** market is *winnable* — fragmented, reseller-heavy, or has an open bottom tier — and NOT a platform-owned kill-zone (e.g., ad-buying owned by Meta Advantage+/Google PMax). Kill-zone → drop.

### Stage 3b — GROWTH & BRAND TEARDOWN  *(skill: /growth-teardown)*
- For the real players: reverse-engineer **how they actually acquire customers** — paid (Meta/YouTube/TikTok ad library), organic social (IG/YouTube/TikTok/**X**/LinkedIn scale + cadence + engagement), influencer/affiliate ties, partnerships/integrations, content/SEO engine, PR/funding-driven.
- Category verdict: is this market won by **product / paid spend / brand-influencer / partnerships**? Where is the GTM white space?
- **Gate (the asset-fit check):** does the winning channel match Jaydeep's assets (owned businesses, ~10k-realtor network, agency, content ability)? Won by a channel we own → huge edge. Won by a channel we can't access → warning. This feeds Stage 5.

### Stage 4 — WEAKNESS MINING  *(skill: /pain-mine, incumbent mode)*
- Mine 50+ reviews (G2/Capterra/Trustpilot) + Reddit for the **repeated, ownable incumbent weakness** (e.g., Weave: "support vanishes after onboarding"; billing surprises).
- **Gate:** a specific, repeated weakness we can build the positioning around. No clear opening → weak idea.

### Stage 5 — DISTRIBUTION & MOAT FIT  *(skill: /opportunity-score, moat section)*
- Do our owned assets give an unfair, near-zero-CAC entry to the first 50–100 customers? Which moat compounds (distribution / data / integration / trust)?
- **Gate:** we have an *unfair right to win* AND a moat that compounds. If our first customers cost the same as anyone's, and there's no compounding moat → it's a fair fight we'll likely lose. Drop.

### Stage 5b — BUILD-MOAT & REPLICABILITY  *(skill: /build-moat)*
- The hard-scope defensibility gate. Score five axes: frontend clonability · backend complexity · proprietary-data dependence · algorithm/model opacity · **OUR moat-input access**.
- Map to a zone: 🟥 **too easy** (commodity CRUD — no moat unless distribution saves it) · 🟥 **too hard/locked** (data/algorithm-locked and we lack the input → we'd clone the shell and lose on quality forever) · 🟩 **sweet spot** (hard enough to deter clones AND we uniquely hold/can-acquire the moat input — where Jaydeep's proprietary data turns complexity into advantage).
- **Integration access (the 4-tier gate):** can we connect to the vertical's system-of-record (CRM/EMR/tools they run on)? Tier 1 open API / Tier 2 OAuth+review = feasible · Tier 3 partner-gated (fee/agreement) · Tier 4 no API (scrape only ⚠️). A Tier 3–4 dominant tool with no partner path = feasibility blocker (score down); if we crack it = a moat. Name the actual tool + tier — "integrate later" is not an answer.
- **CRM gravity (where the data lives):** every business keeps its data in one place — usually its CRM. So a viable product must either **(a) fill a real GAP inside the CRM** that industry uses, **(b) cleanly INTEGRATE** with it, or **(c) target an industry/segment with NO industry-specific CRM** (greenfield — actively hunt for these). Corollary: **public data is NOT a moat** (realtor.ca/MLS, scraped lists — anyone has it); only **owned, proprietary data** (our paid lead-gen + conversion records) is. Score distribution/moat on owned data + real domain expertise, never on access to public data.
- **Gate (hard scope):** DROP if 🟥 too-easy with no distribution moat, 🟥 locked with no path to the proprietary input, or the industry's system-of-record is Tier 4/partner-gated with no integration path. PROCEED only if 🟩 — separate UI-clonability from quality-replicability; "we can copy the frontend" is never sufficient.

### Stage 6 — BUSINESS MODEL & PRICING  *(skill: /opportunity-score, model section)*
- Outcome-based pricing? Gross margin after AI/infra cost? Expansion path? Can it reach venture scale (path to $100M+ rev), or is it a nice $1–5M lifestyle business? (Both are valid — but name which.)
- Run `/financial-model` for investment-vs-outcome simulations: build cost (effort + cash), per-customer COGS, margin, CAC, LTV, payback, break-even count. Two hard gates: **price-vs-COGS** (catches the "AI-at-$50/mo bleeds money" trap — per-minute AI needs $200–500+; low-inference software supports $50–100) and **free/cheap-wedge viability** (loss-leader → data → upsell only works if free-tier COGS ≈ 0 and the upsell is real).
- **Business-model patterns to weigh:** (a) straight paid SaaS; (b) **free/cheap distribution-wedge → accumulate proprietary data → upsell** (fits Jaydeep's owned distribution; only viable for cheap-to-serve software, NOT per-minute AI); (c) outcome-priced service-as-software.
- **Gate:** high-margin, expandable, defensible, with a credible path to the scale Jaydeep wants.

### Stage 7 — OPPORTUNITY SCORE + BUILD SPEC  *(skill: /opportunity-score)*
- Composite score across the rubric below. If it clears the bar, write the build spec (what AI does vs. what we do, stack, first pilot, pricing, 90-day test).

---

## The scoring rubric (Stage 7)

Score each 0–10, multiply by weight, sum to /100. Run via `/opportunity-score`.

| # | Parameter | Weight | What a 10 looks like |
|---|---|---|---|
| 1 | **Pain intensity** | 18 | Owner loses real money daily; already paying to fix it |
| 2 | **Demand (real, growing)** | 12 | Strong non-branded search, rising, high commercial intent |
| 3 | **Winnability** (low real-builder density / open tier) | 14 | Fragmented or reseller-heavy; no entrenched giant |
| 4 | **NOT a platform kill-zone** | 12 | Core value isn't something Google/Meta/OpenAI gives free |
| 5 | **Distribution fit** (our assets) | 16 | First 50–100 customers cost us ~nothing |
| 6 | **Moat that compounds** | 12 | Data/integration/trust deepens with every customer |
| 7 | **AI-outcome fit** (AI can truly do the work) | 8 | AI reliably delivers the outcome, not just assists |
| 8 | **Pricing power / margin / scale** | 8 | Outcome-priced, 70%+ margin, path to $100M |

**Bar:** ≥ 70/100 to proceed to build spec. 55–69 = promising, needs a specific fix. < 55 = drop or radically reframe.

---

## How the skills map to the funnel

| Stage | Skill | Output (saved to repo) |
|---|---|---|
| 0, sync | `/research-brain` | Updates RESEARCH_BRAIN.md memory + candidate register |
| 1, 4 | `/pain-mine` | Pain/weakness report for a vertical or incumbent |
| 2 | `/demand-scan` | Demand verdict (volume/trend/seasonality/intent) |
| 3 | `/market-census` | Player census table (Builder/Reseller/Platform + scale) |
| 3b | `/growth-teardown` | How players acquire customers + category winning-channel + asset fit |
| 5b | `/build-moat` | Cloneability/defensibility scorecard + hard-scope zone verdict |
| 6 | `/financial-model` | Investment-vs-outcome simulations + price-vs-COGS & free-wedge gates |
| 5–7 | `/opportunity-score` | Scored rubric + go/no-go + build spec if passing |

---

## Honest limits of the system (so we don't fool ourselves)

- **Tooling gap:** no native Ahrefs/SEMrush/SimilarWeb. Demand/SEO depth is best with one paid tool (~$100–200/mo); skills use live web search + Apify and will flag estimated vs. measured numbers.
- **A high score is a hypothesis, not a fact.** The only real validation is customers paying. The funnel decides *what to test first*, then we do things that don't scale — hand-deliver the outcome to 5–10 real customers before automating.
- **Garbage framing in → confident garbage out.** The framework optimizes *within* the question asked. `/research-brain` exists partly to keep challenging whether the question itself is right.

---

*Version 1. Built as the decision system behind the PPC-Guru founder's search for a billion-dollar AI-native vertical bet. Update this file when a gate or weight proves wrong in practice — the framework is itself a hypothesis under test.*
