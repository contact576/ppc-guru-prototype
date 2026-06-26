---
name: financial-model
description: Run investment-vs-outcome simulations for a candidate idea — build cost (effort + cash), per-customer COGS, gross margin, CAC, LTV, payback, break-even customer count, and time-to-recoup. Includes a price-vs-COGS sanity gate (catches the "AI-at-$50/mo bleeds money" trap) and models the free/cheap-wedge → data → upsell business model. Use when the user wants the money math on a bet, or to compare investment scenarios. Stage 6 of OPPORTUNITY_FRAMEWORK.md.
---

# Financial Model & Investment Simulation

Turn a candidate idea into honest money math and run scenarios of **investment in (time + cash) vs. outcome achievable.**

## Inputs
- Candidate idea + intended **price point(s)** (e.g., $50 / $100 / $300 per mo).
- COGS drivers (hosting, per-use AI/telephony/API cost — the big one for AI products).
- Distribution (owned → near-zero CAC; paid → market CAC).
- Investment budget (cash) and available effort (person-weeks).

## What to compute
1. **Build cost** — split into **effort (person-weeks)** and **cash**. With Claude Code + a tiny team, cash to build a v1 is usually low ($0–1k); the real cost is *weeks of focused effort* and ongoing infra. State both; don't pretend time is free.
2. **Per-customer COGS / month** — hosting + per-use AI/telephony/API. This is the make-or-break number for AI products.
3. **Gross margin %** = (price − COGS) / price.
4. **CAC** — owned distribution (clinics/realtor network/agency) ≈ near-zero for first 50–100; paid CAC = market rate. Model both.
5. **LTV** = price × gross-margin × avg lifetime (months). Use retention assumptions; flag them.
6. **Payback** (months to recoup CAC) and **break-even customer count** (to recoup the build investment).
7. **Time-to-recoup the cash investment** under base assumptions.

## The two hard gates
- **🚦 Price-vs-COGS sanity gate.** If the price can't comfortably cover per-use COGS at scale, the model is broken however big the market. *Worked example: AI voice on Retell-style infra runs ~$0.05–0.15/min; a clinic at ~500 min/mo ≈ $25–75 COGS → a $50–100/mo price has thin/negative margin. Per-minute AI products need $200–500+/mo pricing.* Low-inference software (booking/dashboard/reporting) has ~$2–8 COGS → $50–100 = 85–95% margin. **State which regime the idea is in.**
- **🚦 Free/cheap-wedge model.** If the plan is a free/loss-leader tool to win distribution + data, then model: (a) the free-tier COGS *drain* × number of free users, (b) the upsell **conversion rate** to paid, (c) the **LTV expansion** of converted users, (d) the value of the accumulated proprietary data. Free only works if free-tier COGS is near-zero (cheap-to-serve software, NOT per-minute AI) AND there's a real, sticky upsell. Say so explicitly.

## Scenarios (always run 3)
Pessimistic / Base / Optimistic — vary price, customer count (from owned distribution), COGS, and retention. Output a small table so the user sees the range, not a single false-precise number.

## Output
- Scenario table (Pess/Base/Opt): build cost, COGS, margin, CAC, LTV, payback, break-even #, recoup time.
- The two gate verdicts (price-vs-COGS regime; free-wedge viability if relevant).
- One-line honest verdict: is this a fat-margin cheap-to-serve bet, a thin-margin per-use bet, or a distribution-wedge play?
- Save as `finmodel_<idea-slug>.md`; run `/research-brain` to update nodes 3 (pricing) + 4 (model) + 8 (score).

## Honesty rules
- Time is a cost. Never present "cheap to build" without the person-weeks.
- Don't assume retention — flag it as the biggest swing variable and run it both ways.
- A huge market with broken price-vs-COGS unit economics is a NO, not a maybe.
