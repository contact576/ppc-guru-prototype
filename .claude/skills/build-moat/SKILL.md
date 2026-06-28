---
name: build-moat
description: Assess how cloneable/buildable a product is AND whether its real moat is data- or algorithm-locked — cutting both ways (can incumbents be copied, and can WE build a defensible version). Scores frontend clonability, backend complexity, proprietary-data dependence, AI/algorithm opacity, and whether WE uniquely hold the moat input. Use to decide if an idea is too-easy (commodity), too-hard (locked, we lack the data), or the sweet spot. Hard-scope defensibility gate of OPPORTUNITY_FRAMEWORK.md (Stage 5b).
---

# Build-Moat & Replicability

The lens that answers: **"Even if demand is real and we can reach customers — CAN we build a version that wins and STAYS won?"** It cuts both directions:
- **Inward** — can WE realistically build it (frontend is always clonable; backend / data / tuned-model often is not)?
- **Outward** — once we build it, can the next person clone US? (If the moat is just frontend + CRUD, everyone clones everyone → race to the bottom.)

## The five axes (score each, with evidence)

1. **Frontend clonability** — trivial / moderate / hard. (Almost always *trivial-to-moderate* now — UI is never the moat. Note it, don't over-weight it.)
2. **Backend logic complexity** — CRUD wrapper / moderate systems / deep distributed-or-real-time systems. Can we infer and rebuild the logic, or is it genuinely hard engineering?
3. **Proprietary-data dependence** — none / helpful / **essential**. Does the product's quality come from a dataset the incumbent owns and we'd have to accumulate? (e.g., a fraud model, a ranking, a benchmark set.)
4. **Algorithm / model opacity** — deterministic & knowable / tunable / **black-box tuned on data we lack**. If the value is a finely-tuned model/ranking whose "weightage" we can't see, cloning the UI gets us *none* of the quality. We'd have to re-derive the fundamentals from data we may not have.
5. **OUR moat-input access** — do WE uniquely hold the required input (proprietary data, domain knowledge, distribution, labeled outcomes)? This is the decisive axis — Jaydeep's 24 Meta + ~20 Google ad accounts, clinic conversion data, realtor-network behavior, and agency domain knowledge are real proprietary inputs most competitors lack.

6. **Integration access to the industry's system-of-record (the 4-tier gate).** Whatever we build MUST connect smoothly to the CRM/EMR/tools the vertical already runs on. Identify the dominant tool(s) and rank API access:
   - **Tier 1 — Open public API:** docs public, instant key (Stripe/Twilio/OpenAI). Easy (hours–days), just accept terms.
   - **Tier 2 — OAuth + app review:** users connect their own account, platform reviews your app (Google/Meta/QuickBooks/HubSpot). Medium (days–weeks), app approval, no business deal.
   - **Tier 3 — Partner-gated API:** application/approval, sometimes fee or rev-share, formal agreement (many EMRs, Salesforce ISV, some banking). Hard (weeks–months).
   - **Tier 4 — No API:** closed system; only scraping/browser automation. Very hard + fragile, often against ToS. ⚠️
   **Cuts both ways:** a Tier 3–4 system-of-record is a feasibility BARRIER for us — but if we secure partner access it becomes a real moat (switching cost + rivals locked out). If the dominant tool is Tier 4 / partner-gated AND we have no path in, the product can't connect → score DOWN hard (and prefer building where MCPs/connectors already reach the stack — e.g., we already pull Google via Adzviser and Meta via the Meta connector).

## The hard scope (the gate)

Map the idea to one of three zones:

- **🟥 Too easy (commodity):** frontend + CRUD, no data/algorithm moat (classic CRM clone). We *can* build it, but so can anyone — no defensibility. **DROP unless** we have an overwhelming distribution/brand moat to compensate (distribution becomes the ONLY moat).
- **🟥 Too hard / locked (and we lack the input):** value is data- or algorithm-locked, incumbent owns the dataset, and **we have no path to the proprietary input or the labeled outcomes.** We'd clone the shell and lose on quality/ranking forever. **DROP.**
- **🟩 Sweet spot:** hard enough that clones can't trivially copy it (real backend/data/algorithm complexity) **AND we uniquely hold or can acquire the moat input** (data/domain/distribution). Here complexity protects us instead of blocking us. **PROCEED — this is where Jaydeep's proprietary data turns a barrier into an advantage.**

## Output
- The five-axis scorecard + the zone verdict (🟥/🟩) with the one-line reason.
- If 🟩: name exactly which proprietary input is the unlock and how we accumulate/defend it.
- If 🟥: say which zone and whether distribution alone could rescue it.
- Save as `buildmoat_<idea-slug>.md`; run `/research-brain` to update node 6 (Build) + node 9.

## Honesty rules
- "We can clone the frontend" is never sufficient — explicitly separate UI-clonability from quality-replicability (the model/data/ranking).
- Don't assume we can "just collect the data later." State concretely where the proprietary data or labeled outcomes come from, or admit we can't get them.
- A black-box AI product where we can't see or re-derive the weighting, and have no comparable training data, is a 🟥 even if the demand is huge.
- Always name the vertical's actual system-of-record and its integration tier (e.g., physio→Jane App; immigration→Officio; realtor→the brokerage CRM). "We'll integrate later" is not an answer — a Tier-4 dominant tool with no partner path is a structural blocker, not a detail.
