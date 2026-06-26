# Clinic CRM Gap — adversarial teardown verdict

*Tested the founder's claim: "All physio/clinic platforms are EMR/clinical only — none is a real sales/marketing/automation CRM that captures and converts NEW leads." We tried hard to disprove it. Detail in `clinic_crm_teardown_A.md` (EMR-first) + `clinic_crm_teardown_B.md` (patient-engagement/growth). Live vendor-site research, June 2026; some pages 403'd → medium-high confidence on the decisive columns.*

## Verdict: he's ~90% right. The gap is real.

The decisive test was four columns — **(6) new-lead capture · (7) sales pipeline · (8) marketing automation for non-patients · (9) ad-source→booked-patient ROI attribution.** Almost nothing does them.

| Group | Platforms | New-lead / pipeline / automation / ad-ROI? |
|---|---|---|
| **EMR-first (clinical)** | Jane, Cliniko, Noterro, Practice Perfect, ClinicSense, Jituzu, Carepatron, Juvonno, Pabau, Power Diary | **No on all four.** EMR + scheduling + billing + *existing-patient* reminders/recall. Marketing = retention (Mailchimp to current patients, review asks). Several explicitly tell you to bolt on HubSpot/Zoho/Pipedrive for the CRM job. |
| **Patient-engagement / "growth"** | Tebra/PatientPop, Weave, RevenueWell, Solutionreach, NexHealth, Phorest, Curogram, Artera, Rocket Referrals | **No on ad-ROI; "growth" = reputation/recall/reactivation of people already in the chart.** Tebra is the tell: marketers bolt **Zoho** onto it because it "captured ad inquiries but lacked structured follow-up and no visibility into which campaigns convert." |
| **Generic local-biz CRM** | Podium, Birdeye | Partial 6+7+8, **No 9** — webchat lead capture + light pipeline, not clinic-tuned, no ad-spend→booking join. |
| **★ The one counterexample** | **GoHighLevel** (repackaged for physio as **PhysioFunnels** by Paul Gough) | **Yes on all four** — BUT three fatal caveats (below). |

## The only thing that fills the gap — and why it leaves the door open

**GoHighLevel / PhysioFunnels** is the *sole* product doing new-lead + pipeline + automation + ad-ROI for clinics. But:
1. **It's generic, not clinic-native** — base GHL is an any-SMB/agency CRM; "physio" is just a reseller snapshot (funnels, missed-call text-back, review automation). No clinical depth.
2. **It has NO EMR and no booking-system join** — it sits *beside* the clinic's system, blind to the actual confirmed visit.
3. **Its ad-ROI is MANUAL** — a human enters the deal value and marks the opportunity "won." "Booked" = a user clicking won, **not** an automatic, EMR-confirmed visit.

## The strategic opening (this is the whole point)

> **No native, clinic-specific platform with an EMR connection is a new-lead sales-marketing CRM with ad-ROI. The gap is filled only by a generic agency CRM (GHL) bolted alongside the EMR — with a manual attribution loop.**

That is a precise, defensible wedge, and it maps exactly onto Jaydeep's assets:
- **Clinic-native + physio-tuned** (vs GHL's generic costume).
- **Automatic ad→booked-CONFIRMED-patient attribution** via the **Jane → Google Calendar booking signal** — the *automatic* join GHL structurally cannot do (it has no EMR/booking connection; it relies on manual "won"). This is the single sharpest differentiator, and it's enabled by the GCal workaround.
- **Cross-account ad data** (his agency) = the benchmark moat GHL/PhysioFunnels can't build.
- **GHL/PhysioFunnels is the competitor to beat** — beat it on native-ness, automatic attribution, and EMR integration, not on generic features.

## Honest caveats
- GHL's ad-ROI mechanism is well-documented (imports Meta spend, links opportunity value to ad/adset) — the weakness is the *manual* close-signal, not the absence of ROI.
- Several vendor pages blocked the fetch bot; verdicts on the 6–9 columns lean on marketing copy + third-party reviews. Confidence: medium-high on the headline gap, lower on exact pricing.
- "Gap exists" ≠ "we win." The validation kill-criterion still holds: an EXTERNAL clinic must pay.

*Bottom line: the founder's instinct is correct and now evidence-backed — the clinic *sales/marketing* CRM (as opposed to EMR) essentially does not exist natively, and the one substitute (GHL) is generic + EMR-blind + manually attributed. That is the opening for PatientROI to grow into a clinic-native marketing/sales CRM with automatic ad-ROI.*
