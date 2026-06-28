# Adversarial Competitive Teardown — Physio/Clinic Platforms as New-Lead Sales/Marketing CRMs

**Founder claim under test:** *"All physio/clinic platforms are EMR/clinical only — none is a real SALES/MARKETING/automation CRM that captures and converts NEW leads."*

**Method:** Live WebSearch + attempted WebFetch (June 2026). Vendor sites, support docs, and recent (2026) third-party reviews. No reliance on result-count heuristics. Uncertainty tagged inline. Pabau/Power Diary direct vendor pages returned HTTP 403 to the fetch tool, so those are corroborated via vendor support docs + multiple 2026 reviews and tagged accordingly.

**The core distinction being tested (cols 6–9):**
- **EXISTING-patient engagement** = recall, reactivation/win-back, review requests, bulk SMS to your patient list. *Most platforms do this.*
- **NEW-LEAD acquisition CRM** = capture prospects who are NOT yet patients (web form / paid-ad leads) → put them in a **sales pipeline with stages** → **automate nurture** (speed-to-lead auto-text/email, sequences for non-patients) → **attribute** the booked patient back to the ad/channel that produced them. *Almost none do this.*

---

## THE MATRIX

Legend: ✅ Yes · 🟡 Partial · ❌ No. Columns **6–9 are the whole point** (bolded).

| # | Capability | Jane App | Juvonno | Cliniko | Noterro | Practice Perfect | ClinicSense | Carepatron | **Pabau** | Power Diary (Zanda) | Physitrack |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Clinical EMR / charting | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 (telehealth/HEP, not full EMR) |
| 2 | Scheduling + online booking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 (telehealth booking) |
| 3 | Payments / billing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| 4 | Existing-patient reminders / recall / reactivation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 (in-app adherence reminders) |
| 5 | Reviews / reputation | 🟡 (ratings/reviews) | 🟡 | 🟡 (via integ.) | ✅ (referral/reviews) | 🟡 | ✅ (review requests) | 🟡 | ✅ | 🟡 | ❌ |
| **6** | **NEW-LEAD capture (non-patient ad/web-form leads)** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 (CRM, but intake = patients) | **✅** | ❌ | ❌ |
| **7** | **Sales / lead PIPELINE (stages prospect→booked)** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** | ❌ | ❌ |
| **8** | **Marketing AUTOMATION (speed-to-lead + nurture for NON-patients)** | ❌ (existing-pt only, often via integ.) | 🟡 (existing-pt only) | ❌ (existing-pt only) | ❌ (existing-pt only) | ❌ (existing-pt only) | ❌ (existing-pt only) | 🟡 (existing-pt only) | **✅** (stage-triggered email/SMS) | ❌ (existing-pt only) | ❌ |
| **9** | **Ad-source / marketing ROI attribution (which ad → booked patient)** | ❌ (no acquisition-channel field) | ❌ | 🟡 (new-patient counts, no ad ROI) | 🟡 (analytics, no ad ROI) | 🟡 (referral-source tracking) | ❌ | ❌ | **🟡→✅** (leads-by-source, converted-lead reports; native ad-platform/Meta attribution via integration) | ❌ (no acquisition-channel field) | ❌ |
| 10 | Two-way SMS / unified inbox | 🟡 | ✅ (2-way text) | 🟡 (bulk SMS) | 🟡 | 🟡 | 🟡 | ✅ (chat) | ✅ | ✅ (2-way chat) | 🟡 (in-app messaging) |
| 11 | Pricing (range) | CAD ~$54–99/mo + per-license | $55–99/mo/location (+Enterprise) | $45–395/mo by practitioner count | ~$28+/mo | Quote/custom (enterprise) | $39+/mo | Free–$34/user/mo | ~$59/mo Startup → custom | $19 (Starter) / $49 (Growth) + per-seat | ~£18 (~$22)/user/mo |

---

## PER-PLATFORM VERDICTS

### 1. Jane App — **EMR + existing-patient engagement**
Strong PM/EMR + booking + payments. Marketing = ratings/reviews, Google Analytics, and **patient-list sync to Mailchimp/Cyberimpact** for newsletters/reactivation. Reviews explicitly note **"Jane doesn't have an option to specify the acquisition channel when booking"** → no lead-source reporting, **no ad ROI**. No lead pipeline, no non-patient nurture. **Cols 6–9: NO.**

### 2. Juvonno — **EMR + existing-patient engagement (strongest retention marketing)**
Automated email/text marketing, two-way texting, patient segmentation (no-shows, birthdays, missed payments), automated welcomes, "Patient Insights" re-engagement. All of this targets **patients/drop-offs**, not non-patient prospects. No evidence of a non-patient lead-capture form, a prospect sales pipeline, or ad-source ROI. **Cols 6, 7, 9: NO. Col 8: Partial (existing-patient only).**

### 3. Cliniko — **EMR + existing-patient engagement**
Bulk SMS/email, automated follow-up reminders, "which patients joined this month / haven't rebooked" reporting; Mailchimp + **GoHighLevel** integration for true marketing automation. Reviews state plainly it **won't show "how marketing spend translates to new patient acquisition."** New-lead pipeline/automation is **outsourced to GoHighLevel**, not native. **Cols 6–9: NO (native).**

### 4. Noterro — **EMR + existing-patient engagement**
Automated email/SMS/voice reminders, tagging/segmentation, **referral program**, practice analytics, Mailchimp sync. All existing-patient/referral. Intake forms capture **patients**, not cold prospects. No sales pipeline, no ad attribution. **Cols 6–9: NO.**

### 5. Practice Perfect — **EMR + existing-patient engagement (referral-source flavored)**
Rehab-focused EMR with automated recall, **physician/referral-source tracking**, geographic revenue analysis, campaigns. Referral-source tracking is the closest thing to attribution here — but it's **referral-source, not paid-ad ROI**, and there's no non-patient lead pipeline or speed-to-lead automation. **Cols 6–8: NO. Col 9: Partial (referral, not ad).**

### 6. ClinicSense — **EMR + existing-patient engagement (reactivation specialist)**
Built around **win-back/reactivation campaigns, automated check-in emails, availability campaigns, review requests, No-Show Guard**. Excellent existing-patient marketing for solo massage/wellness. Forms are patient intake. No prospect pipeline, no non-patient nurture, no ad attribution. **Cols 6–9: NO.**

### 7. Carepatron — **EMR + existing-patient engagement (calls itself "CRM")**
Markets a "CRM" + automation (intake forms, reminders, payment nudges auto-send). But the **CRM/intake is patient-oriented**: intake forms fire on **profile creation** (already a client). No evidence of cold-lead capture, a stages pipeline, or ad-source ROI; a 2026 review even flags it **can't bulk-message clients**. The "CRM" label is generous. **Col 6: Partial (CRM exists, but for patients). Cols 7, 9: NO. Col 8: Partial (existing-patient).**

### 8. **Pabau — ACTUALLY HAS A NEW-LEAD SALES/MARKETING CRM** ⭐ (the counterexample)
This is the one that breaks the founder's absolute claim. Vendor + support docs + 2026 reviews confirm a genuine acquisition stack:
- **Col 6 ✅** — embeddable **Lead Capture Form widget** for website/non-patient prospects; Create-Lead API; customizable lead forms.
- **Col 7 ✅** — **Lead Pipelines** = "structured series of stages that guide how you interact with each lead"; custom pipelines per treatment/location/group; how-to-create-a-pipeline docs exist.
- **Col 8 ✅** — **stage-triggered automation**: "customize email or SMS templates for each stage… these templates automatically go out as leads move from one stage to the next."
- **Col 9 🟡→✅** — **leads-by-source, open-leads, converted-leads, likely-to-convert** prebuilt reports + custom pipeline-performance reports. *Native lead-source reporting = yes; direct ad-platform (Meta/Google) cost-ROI attribution appears to rely on Pixel/CAPI/LeadsBridge-style integration rather than a built-in ad-spend dashboard — tagged Partial pending confirmation.*

Pabau explicitly positions itself as **"CRM + marketing automation + clinical workflows in one platform"** and runs a med-spa/aesthetics-heavy book where paid-lead acquisition is the norm. **Verdict: genuine new-lead sales-marketing CRM (cols 6–8 solid; col 9 partial-to-yes).** *(Vendor pages 403'd the fetch tool; corroborated via support.pabau.com docs + multiple 2026 reviews — high confidence on 6–8, medium on native ad-ROI in col 9.)*

### 9. Power Diary (now Zanda) — **EMR + existing-patient engagement**
Bulk send/marketing campaigns, Mailchimp integration, two-way chat, **waitlist**, "Custom Lists" with a marketing-source classification field. But reviews state **"there is no option to specify the client's referral source / acquisition channel when creating an appointment"** (only a manual Comments hack, not reportable). No prospect pipeline, no non-patient nurture automation, no ad ROI. **Cols 6–9: NO.**

### 10. Physitrack — **NOT a CRM at all (clinical engagement / telehealth / HEP)**
18,000+ exercise library, home-exercise programs, telehealth video, outcome measures, RTM, adherence reminders, in-app messaging. Zero sales/marketing/lead functionality. Pure clinical patient-engagement tool. **Cols 6–10: NO** (only in-app messaging on col 10).

---

## BOTTOM LINE

**Does ANY of these genuinely do new-lead acquisition + sales pipeline + automation + ad-ROI (cols 6–9)?**

**Yes — ONE: Pabau.** It is a real counterexample to the founder's absolute statement. Pabau natively does:
- ✅ **Col 6** new-lead capture (embeddable lead forms for non-patients),
- ✅ **Col 7** a true stage-based **lead/sales pipeline**,
- ✅ **Col 8** **stage-triggered email/SMS automation** for those leads,
- 🟡 **Col 9** lead-**source** reporting + converted-lead ROI reports — though **native paid-ad-platform attribution (Meta/Google spend → booked patient)** still looks integration-dependent, not a built-in ad-ROI dashboard. *(Medium confidence; vendor page fetch was blocked.)*

**So the claim is FALSE as an absolute** — but **true as a strong generalization.** Of the 10:
- **8 of 10** (Jane, Juvonno, Cliniko, Noterro, Practice Perfect, ClinicSense, Carepatron, Power Diary) are **EMR + existing-patient engagement**. They market to people who are **already patients** (recall, reactivation, reviews, bulk SMS) and several **outsource even that** to Mailchimp/GoHighLevel. They have **no non-patient lead pipeline and no ad-ROI attribution.** Multiple (Jane, Power Diary) literally **lack an acquisition-channel field**, and Cliniko's own positioning admits it can't tie marketing spend to new-patient acquisition.
- **1 of 10** (Physitrack) isn't a CRM/PM at all — it's clinical telehealth/HEP.
- **1 of 10** (Pabau) is the exception that genuinely does new-lead sales-marketing CRM.

**Strategic read for the founder:** the gap he describes is **real for the clinical-EMR-first incumbents** (the Jane/Cliniko/Juvonno/Noterro/Power Diary cohort that physios actually run on). Their weakness is precisely cols 6–9: they assume the lead is **already a patient**. The honest caveat is that **Pabau already occupies the "clinic + new-lead CRM" position** — but skewed toward **med-spa/aesthetics**, often criticized for **opaque/surprise pricing**, and with **ad-platform ROI attribution that's still integration-shaped, not native**. And the broader market answer to the gap is bolting on a **horizontal CRM (GoHighLevel)** rather than a physio-native one. So the defensible wedge isn't "no one does lead CRM" — it's "**no physio-native PM/EMR does speed-to-lead + pipeline + true paid-ad ROI attribution well**, so clinics duct-tape GoHighLevel onto Jane/Cliniko."

### Confidence / uncertainty tags
- **High confidence:** cols 1–5 across all; the cols-6–9 NO verdicts for Jane, Cliniko, Power Diary, Physitrack, ClinicSense, Noterro (corroborated by review-stated limitations).
- **Medium confidence:** Juvonno/Carepatron col-8 "partial" (marketing is real but patient-scoped; no public evidence of cold-lead nurture); Practice Perfect col-9 (referral-source ≠ ad ROI).
- **Medium confidence (fetch-blocked):** Pabau cols 6–8 corroborated by support docs + multiple 2026 reviews; **col-9 native paid-ad ROI is the weakest claim** — leads-by-source is confirmed, but built-in Meta/Google ad-spend attribution is unverified and likely integration-based.

### Sources
- Jane App: medesk.net Jane review; jane.app pricing/integrations guides; pabau.com Jane pricing guide.
- Juvonno: juvonno.com (features, pricing, clinic-communication, clinic-owner); G2/SoftwareAdvice.
- Cliniko: pabau.com Cliniko review + pricing; medesk.net; cliniko.com retention blog; appypieautomate (GoHighLevel).
- Noterro: noterro.com features/marketing/analytics; ehrinpractice.
- Practice Perfect: practiceperfectemr.com (home, features, features-breakdown); softwareadvice.
- ClinicSense: clinicsense.com (features, online-booking); GetApp/Capterra/SoftwareFinder.
- Carepatron: carepatron.com; medesk.net review; softwarefinder; pabau.com Carepatron pricing.
- Pabau: pabau.com/features/lead-management + /software/marketing-a-clinic; support.pabau.com (leads, how-to-create-a-lead-pipeline, create-lead-API); softwareadvice; G2.
- Power Diary/Zanda: medesk.net Power Diary review; zandahealth.com pricing; G2/Capterra/SoftwareFinder.
- Physitrack: physitrack.com (home, features, telehealth); support.physitrack.com; Capterra.
