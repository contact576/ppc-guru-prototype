# Clinic Software Adoption Funnel + Market Shape

*Founder-led research (done in a separate cloud tab), captured here with its honest accuracy flags intact — the discipline of separating rock-solid data from estimates is the point. Pairs with `CLINIC_CRM_GAP.md` (competition) and the market-sizing dossier (in progress).*

## The adoption funnel — practitioners → what they actually run

| Layer | Adoption | Confidence | Source quality |
|---|---|---|---|
| **EMR / EHR / clinical** | US 95% office physicians (83.6% certified); Canada ~86% primary care; allied health (physio/chiro/dental) ~70–85% | 🟢 High | Government (CDC/NEHRS, ONC, CIHI) |
| **Marketing / lead CRM** | ~20–35% of small clinics | 🟡 Medium | Triangulated CRM-industry + SMB stats |
| **AI front desk / voice** | Broad claim: 38% of practices "deployed AI for phone/scheduling/triage" (MGMA 2025, up from 12% in 2023). **Dedicated AI voice receptionist in small clinics: realistically ~5–15%** | 🟠 Low–Med | Vendor/association surveys, definition-inflated |
| **NOTHING for lead/marketing/front-desk automation** | ~50–65% | 🟡 Medium (inferred residual) | Derived |

## What the funnel says
1. **EMR is solved/saturated** (~95% US / ~86% CA) → don't build an EMR. (Confirms the "don't replace Jane" call.)
2. **The marketing/lead layer is wide open** — only ~1 in 3 small clinics has a real lead CRM, despite most running Google/Meta ads. EMR ≠ marketing tool; the gap is structural.
3. **AI front desk is rising fast but the 38% is misleading** — it lumps any AI for "phone OR scheduling OR triage" and skews to large US/EU groups. For small independent physio/chiro/dental, true AI-voice-receptionist penetration is **low single-to-double digits — early, not saturated.** Trend (12%→38% in 2 yrs on the broad metric) = heating up → **window is now, not in 3 years.**
4. **Headline:** roughly **half to two-thirds of small clinics run ads but have no system** to capture/follow-up/automate the leads. That's the market.

## Competition map (who provides what)
| Category | Players | Coverage |
|---|---|---|
| Marketing/lead CRM | **GoHighLevel** (dominant, agency-deployed), HubSpot, Keap, Zoho | CRM + automation, generic |
| Engagement/front-desk | Weave, NexHealth, Solutionreach, Podium, RevenueWell, Phreesia | Messaging/reminders/reviews, EHR-bolt-on |
| AI voice receptionist | Kickcall 🇨🇦, Attainment, DeepCura, Sully, Assort, Hello Patient + infra (Retell, Vapi) | Newest, fragmented, voice-only |
| AI-native all-in-one | Omnipractice, DeepCura | Early, trying to do everything |

**Critical finding:** almost nobody does the FULL stack well — *ad-lead capture → CRM → automated multi-channel follow-up → AI voice booking → recall/reviews → reporting* — tuned for a clinic vertical and sold by someone who runs the ads. GHL is generic+agency-deployed; voice startups are voice-only; engagement platforms don't do lead-gen. **That seam between "the ads" and "the booked patient" is the unoccupied ground.**

## Accuracy honesty (don't overclaim the soft rows)
- **EMR ~95%/86%:** trust it (government-collected). 🟢
- **Marketing-CRM ~20–35% / "nothing" ~50–65%:** directional ±10–15 pts — no registry tracks "uses a marketing CRM." Defensible range, not a hard number.
- **AI-voice adoption:** noisiest number; vendor-inflated + large-practice skew. For small physio/chiro/dental, assume **low-but-rising**; trust no single headline %.
- **Vertical/country split is under-measured** — most stats US + physician-centric; Canadian allied-health data is thin.
- **Bottom line:** the *shape* (EMR saturated → marketing CRM scarce → AI voice nascent → big "nothing" middle) is highly reliable. The exact %s in the bottom three rows are estimates.

## Estimates → ground truth (the real move)
1. **Apify scrape** (pending approval) — every physio/chiro/dental clinic in a region + website + booking status → measure real local % with website / online booking / running ads.
2. **Survey our own ad clients** — we run their ads; ask what they use. Clean sample of the exact target.

## Strategic takeaway
Don't build an EMR (95% saturated). Build the **lead/marketing/front-desk automation layer** (~2 in 3 clinics have nothing), with **AI voice as the wedge** (nascent, rising fast) — noting the wedge (Retell-packaged voice) is a commodity; the **moat is the ad→booked-patient data the voice layer captures** + cross-account benchmark.

*Sources: CDC/NEHRS (95% EHR, 2024); ONC HealthIT; Aptarro 2026; MGMA AI-receptionist (38%↑ from 12%); Resonate / Ainora AI-receptionist stats 2026. Soft rows triangulated — see accuracy flags.*
