# Clinic CRM Gap — adversarial teardown verdict

*Tested the founder's claim: "All physio/clinic platforms are EMR/clinical only — none is a real sales/marketing/automation CRM that captures and converts NEW leads." We tried hard to disprove it. Detail in `clinic_crm_teardown_A.md` (EMR-first) + `clinic_crm_teardown_B.md` (patient-engagement/growth). Live vendor-site research, June 2026; some pages 403'd → medium-high confidence on the decisive columns.*

## Verdict: not 100% absolute (Pabau breaks it), but the *true* gap is real and sharper than first thought.

Refinement after the full EMR teardown: **two** things already touch lead-CRM — **Pabau** (clinic-native: lead forms + pipeline + automation, but med-spa-skewed and NO native paid-ad ROI) and **GoHighLevel/PhysioFunnels** (full ad-ROI but generic + EMR-blind + manual). So the defensible wedge is NOT "nobody does lead CRM." It is the narrower, still-empty claim:

> **No physio-native EMR/PM does speed-to-lead + pipeline + *automatic, native* paid-ad→booked-CONFIRMED-patient ROI.** Pabau has the pipeline but not native ad-ROI; GHL has ad-ROI but it's manual and EMR-blind. The automatic ad→confirmed-visit join (via Jane→Google Calendar) is the seam neither occupies.

The decisive test was four columns — **(6) new-lead capture · (7) sales pipeline · (8) marketing automation for non-patients · (9) ad-source→booked-patient ROI attribution.** Almost nothing does them.

| Group | Platforms | New-lead / pipeline / automation / ad-ROI? |
|---|---|---|
| **EMR-first (clinical)** | Jane, Cliniko, Noterro, Practice Perfect, ClinicSense, Jituzu, Carepatron, Juvonno, Power Diary | **No on all four.** EMR + scheduling + billing + *existing-patient* reminders/recall. Marketing = retention (Mailchimp to current patients, review asks). Several explicitly tell you to bolt on HubSpot/Zoho/Pipedrive for the CRM job. Jane and Power Diary literally lack an acquisition-channel field; Cliniko's own copy admits it can't tie spend to new-patient acquisition. |
| **Patient-engagement / "growth"** | Tebra/PatientPop, Weave, RevenueWell, Solutionreach, NexHealth, Phorest, Curogram, Artera, Rocket Referrals | **No on ad-ROI; "growth" = reputation/recall/reactivation of people already in the chart.** Tebra is the tell: marketers bolt **Zoho** onto it because it "captured ad inquiries but lacked structured follow-up and no visibility into which campaigns convert." |
| **Generic local-biz CRM** | Podium, Birdeye | Partial 6+7+8, **No 9** — webchat lead capture + light pipeline, not clinic-tuned, no ad-spend→booking join. |
| **★ Counterexample #1 (clinic-native)** | **Pabau** | **Yes on 6+7+8** — embeddable lead forms, real stage-based sales pipelines, stage-triggered email/SMS automation. **🟡 col 9 (ad-ROI): integration-shaped, NOT a native paid-ad→booked-patient dashboard** (leads-by-source only). Skewed to **med-spa/aesthetics**, opaque pricing. *Medium confidence — vendor pages blocked the fetch bot.* |
| **★ Counterexample #2 (bolt-on)** | **GoHighLevel** (repackaged for physio as **PhysioFunnels** by Paul Gough) | **Yes on all four** — BUT three fatal caveats (below). |

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

## Round 2 — PT-specific platforms + aesthetics CRMs (17 more checked)

Checked the clusters we'd missed: big US PT platforms (WebPT, Prompt, Raintree, Clinicient/Net Health, PtEverywhere, TheraOffice, HENO…) and aesthetics/med-spa growth CRMs (Zenoti, Boulevard, Mangomint, PatientNow, Aesthetic Record, Mindbody, Symplast…). Detail in `clinic_crm_teardown_C.md`.

**No new true counterexample.** The same diagonal gap holds across all 17: a platform is either **PT-native *without* ad-ROI**, or does **real ad-ROI but in aesthetics/salon**, or gets ad-ROI **only via integration**. Nobody does *PT-native × native-automatic-ad-spend→confirmed-booking ROI.* The wedge is still unoccupied.

**But two findings sharpen the risk:**
1. **WebPT Reach = the #1 threat (watch closely).** It's already **PT-native, owns the EMR, and has the lead pipeline + nurture + lead-source reporting** — it is *one feature* (ad-spend ingestion → CPA/ROAS vs confirmed bookings) away from collapsing the wedge. Our defense can't be "we have ad-ROI" alone (WebPT could add it); it must also be **(a) EMR-independent** (we work across Jane/Cliniko/Juvonno; WebPT Reach only serves WebPT clinics), **(b) the cross-account benchmark** (WebPT sees only its own clinics' data per-tenant; we see across accounts), and **(c) speed.**
2. **Aesthetics already ships the full wedge — proof it works + a warning.** Symplast, Aesthetic Record/LeadAR, Zenoti do EMR-connected ad-spend→booked-consultation ROI *in aesthetics.* It's buildable and the model sells; the risk is one of them porting down into PT/physio. *(Several claims ⚠ from third-party reviews — vendor sites 403'd.)*

**Net:** the wedge is real and unoccupied, but it's a **speed race vs WebPT Reach**, and our moat must rest on EMR-independence + cross-account benchmark, not on "having ad-ROI" alone.

## Honest caveats
- GHL's ad-ROI mechanism is well-documented (imports Meta spend, links opportunity value to ad/adset) — the weakness is the *manual* close-signal, not the absence of ROI.
- Several vendor pages blocked the fetch bot; verdicts on the 6–9 columns lean on marketing copy + third-party reviews. Confidence: medium-high on the headline gap, lower on exact pricing.
- "Gap exists" ≠ "we win." The validation kill-criterion still holds: an EXTERNAL clinic must pay.

*Bottom line: the founder's instinct is correct and now evidence-backed — the clinic *sales/marketing* CRM (as opposed to EMR) essentially does not exist natively, and the one substitute (GHL) is generic + EMR-blind + manually attributed. That is the opening for PatientROI to grow into a clinic-native marketing/sales CRM with automatic ad-ROI.*
