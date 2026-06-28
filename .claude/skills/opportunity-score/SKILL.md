---
name: opportunity-score
description: Score a candidate idea against the 8-parameter rubric (pain, demand, winnability, kill-zone, distribution fit, moat, AI-outcome fit, pricing/margin), give a go/no-go, and if it passes write the build spec. Use after the earlier funnel stages have data, or when the user wants a final ranked decision on an idea. Stages 5–7 of OPPORTUNITY_FRAMEWORK.md.
---

# Opportunity Score

Turn the funnel's findings into a number, a decision, and (if it passes) a build spec.

## Inputs
- A candidate idea that has been through (ideally) /pain-mine, /demand-scan, /market-census. If some stages are missing, score on best evidence and flag the gaps as risk.

## Procedure

1. **Pull the evidence** from the candidate's prior reports + RESEARCH_BRAIN node states. Don't re-research what's already done.

2. **Score each parameter 0–10, justify in one line, multiply by weight** (rubric from OPPORTUNITY_FRAMEWORK.md):

   | # | Parameter | Weight |
   |---|---|---|
   | 1 | Pain intensity | 18 |
   | 2 | Demand (real, growing) | 12 |
   | 3 | Winnability (real-builder density / open tier) | 14 |
   | 4 | NOT a platform kill-zone | 12 |
   | 5 | Distribution fit (our assets) | 16 |
   | 6 | Moat that compounds | 12 |
   | 7 | AI-outcome fit | 8 |
   | 8 | Pricing power / margin / scale | 8 |

   Sum to /100.

3. **Decision:**
   - ≥70 → PROCEED. Write the build spec.
   - 55–69 → PROMISING. Name the single biggest fix needed and the test that would raise the weak score.
   - <55 → DROP or reframe. State why.

4. **Distribution & moat detail (Stage 5):** which assets give near-zero CAC for the first 50–100 customers; which moat compounds (distribution/data/integration/trust).

5. **Business model & pricing detail (Stage 6):** outcome-based price, unit economics, gross margin after AI/infra, expansion path, venture-scale vs. lifestyle — state honestly which.

6. **If PROCEED — the build spec:**
   - The one-line bet · vertical · what AI does vs. what humans do · stack (reuse build bibles where they exist) · first pilot (which of our own businesses) · pricing · the 90-day smallest-real-money test (5–10 paying customers) · top 3 risks.

## Output
- Scored table + composite + decision + (if passing) build spec.
- Save as `score_<slug>.md`; run `/research-brain` to update nodes 8 + the candidate register verdict.

## Honesty rules
- A high score is a HYPOTHESIS, not a fact — the only validation is customers paying. Always end with the smallest real-money test.
- If distribution fit (#5) or kill-zone (#4) scores low, weight that heavily in the narrative even if the total clears 70 — those two are the most common silent killers.
