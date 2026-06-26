---
name: demand-scan
description: Validate real, non-branded demand for a problem or solution — search volume, multi-year trend, seasonality, commercial intent, and willingness-to-pay (CPC proxy). Use when the user wants to know if people actually search for / want a solution, before building. Stage 2 of OPPORTUNITY_FRAMEWORK.md.
---

# Demand Scan

Decide whether a candidate has real, growing, commercial demand — or is a flat/branded mirage.

## Inputs
- The problem/solution and target vertical + geography (default US + Canada).

## Procedure

1. **Separate branded from real demand.** Search for the *problem phrases and generic category terms* customers would type ("AI receptionist for dental", "missed call text back"), NOT company brand names. Branded volume ≠ market demand — this was a real prior mistake; do not repeat it.

2. **Pull demand signals** (live web + any keyword data the user supplies from Keyword Planner / Ubersuggest / Ahrefs):
   - Search volume (generic terms), per geography.
   - Multi-year trend (rising / flat / declining) — 4-yr YoY if available.
   - Seasonality (month-of-year index) if relevant.
   - Commercial intent (are terms transactional "buy/hire/software/pricing" vs. informational?).
   - CPC as a willingness-to-pay proxy (high CPC = advertisers paying to win this customer = real money).

3. **Cross-check with the Data Bible** (`SaaS_Gap_Research_DATA_BIBLE.xlsx`) if the term family is already analyzed — reuse, don't recompute.

4. **Offline-demand thesis check.** If search volume is thin but the pain is real (common in nascent AI categories), state the explicit thesis for why demand exists but isn't searched yet (e.g., buyers don't know the solution exists). Don't auto-fail a real pain for low search.

## Output
- A short **demand verdict**: volume tier · trend · seasonality · intent · CPC/willingness-to-pay · branded-vs-real note.
- Gate call: PASS (real & growing) / CONDITIONAL (offline-demand thesis) / FAIL (flat/branded-only).
- Save as `demand_<slug>.md`; run `/research-brain` to update node 1.

## Honesty rules
- Flag estimated vs. measured volume. Without a paid tool, web-derived volumes are approximate — say so.
- Never fabricate search volumes. If unknown, say unknown and state what tool would close the gap.
