---
name: market-census
description: Run a saturation-sampled census of every real player in a market or for a candidate idea, tag each Builder/Reseller/Platform, enrich with funding + LinkedIn scale, and decide if the market is winnable or a platform kill-zone. Use when the user wants to know "how many players are really in this market", who the genuine competitors are vs. resellers, or whether a space is too crowded. Stage 3 of OPPORTUNITY_FRAMEWORK.md.
---

# Market Census

Produce the TRUE competitive population of a market — not Google's inflated result count — and judge winnability.

## Inputs
- The market / candidate idea (e.g., "AI voice receptionist for clinics", "ad-management automation").
- Optional: target vertical and geography (default: note both US + Canada).

## Procedure

1. **Saturation sampling (the core technique).** Run 8–12 *different-angle* WebSearch queries for the same market: by function, by vertical, by integration ("…for Jane App"), by geography ("…Canada"), by buyer phrase ("AI receptionist white label / reseller"), by "alternatives to <known player>", by "best <category> 2026". Keep collecting DISTINCT company names. **Stop when 3 consecutive fresh queries surface no new names** — that's the real population. Record how many queries it took (saturation depth is itself a signal).
   - NEVER use Google's "About N results" number. It is an inflated estimate of pages, not companies. Ignore it entirely.

2. **Classify every player — the highest-value cut:**
   - **Builder** — owns real product/IP/models.
   - **Reseller** — white-labels someone else's platform (Vapi/Retell/Bland/Synthflow/GHL etc.); a landing page + integrations, not a product.
   - **Platform** — the infra others build/resell on, or a big-tech feature that gives the value away (Meta Advantage+, Google PMax, OpenAI).
   - When unsure, WebFetch the company site and look for: "powered by", pricing that's just usage markup, agency language, no engineering team on LinkedIn → Reseller.

3. **Enrich each real Builder** (skip deep enrichment for resellers — just count them):
   - Funding / valuation (web).
   - LinkedIn followers + employee count (Apify `harvestapi/linkedin-company` via exact company URL; verify via returned website/tagline to avoid decoys). IG is noise — skip unless trades/CRM.
   - Traffic if obtainable (SimilarWeb free page via WebFetch; flag as estimate).

4. **Compute the winnability read:**
   - Real Builders : Resellers : Platforms ratio.
   - Scale distribution (is there an entrenched giant, or an open bottom tier?).
   - **Kill-zone check:** is the core value something a Platform gives away free? If yes → flag as kill-zone.

## Output
- A markdown table: Company | Builder/Reseller/Platform | Niche | LinkedIn (followers/emp) | Funding | Notes.
- A 4–6 bullet **winnability verdict**: real player count, the ratio, entrenched-giant?, kill-zone?, where the opening is.
- Save as `census_<market-slug>.md` in repo root. Then run `/research-brain` to update node 2 + the candidate register.

## Honesty rules
- Tag estimated vs. measured numbers. Verify Apify hits aren't decoys (common-word brand names resolve to wrong accounts — cross-check website/bio).
- If you couldn't reach saturation, say so and report it as a floor, not a true count.
