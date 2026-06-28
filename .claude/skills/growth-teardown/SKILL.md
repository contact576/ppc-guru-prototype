---
name: growth-teardown
description: Reverse-engineer HOW a company actually acquires customers and built its brand — across ALL channels, not just Google. Paid (Meta/YouTube/TikTok ad library), organic social (IG/YouTube/TikTok scale + cadence + engagement), influencer/affiliate ties, partnerships, content/SEO engine, PR/funding-driven. Use when the user wants to know how players grow, which channel wins the category, or how WE would acquire customers. Go-to-market lens of OPPORTUNITY_FRAMEWORK.md (Stage 3b / distribution).
---

# Growth & Brand Teardown

Answer one question per player and one for the category: **how do they actually get customers, and is this market won by product, paid spend, brand/influencer, or partnerships?**

## Inputs
- A target player (or a short list) and the market/vertical.

## Procedure — per player

1. **Paid presence (Meta Ad Library — live, free).** Search `ads_library_search` for the brand. Are they actively advertising? How many active ads, since when, what creative angles/hooks/offers? (Ad volume + run-duration is the spend proxy — exact $ isn't public; say so.) Repeat conceptually for YouTube/TikTok via web where the ad library is closed.

2. **Organic social (Apify scrapers).** Instagram + YouTube + TikTok + **X (Twitter)** + LinkedIn: follower count, posting cadence, engagement rate, content themes. What format actually drives them (reels, tutorials, founder-led, UGC, X/Twitter thought-leadership)? IG follower count alone is weak (proven noise for B2B) — weight cadence + engagement + which platform is their real engine. For B2B/dev-tool players, **X + LinkedIn** are often the real organic engine (founder-led building-in-public); for local/consumer, IG + YouTube.

3. **Influencer / affiliate / specialist ties.** Who promotes them — paid creators, affiliates, "as seen on", podcast circuit, agency/consultant resellers. Is there an affiliate/partner program?

4. **Partnerships & integrations.** Co-sell / integration tie-ins (e.g., Jane App, GoHighLevel, EHRs, marketplaces) that drive distribution.

5. **Content / SEO engine.** Blog, YouTube library, community, free tools — is there an organic content flywheel?

6. **PR / funding-driven.** Are they grown through press + capital (TechCrunch, funding announcements) or grassroots/word-of-mouth?

## Procedure — category synthesis
- Across the players, which **channel actually wins** this category? (product-led / paid-led / brand-influencer-led / partnership-led)
- Where is the **GTM white space** nobody is using well?
- **Fit check:** do Jaydeep's assets (owned businesses, ~10k-realtor network, agency, content ability) match the winning channel? If the category is won by a channel we own → huge. If won by a channel we can't access → a warning.

## Output
- Per-player growth-engine card (the 6 dimensions above, with real pulls + evidence).
- Category verdict: winning channel · GTM white space · our-asset fit.
- Save as `growth_<market-or-player-slug>.md`; run `/research-brain` to update node 5 (SEO/Distribution).

## Honesty rules
- Exact ad spend and follower-growth-over-time are not public — report ad volume/run-time and point-in-time scale + cadence as proxies, and label them as such.
- Distinguish "loud because well-funded PR" from "actually acquiring customers efficiently." Capital-driven noise ≠ a repeatable growth engine.
- Verify scraped social accounts are the real brand (common-word names hit decoys — cross-check bio/website).
