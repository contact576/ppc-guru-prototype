# Clinic CRM Adversarial Teardown — GROUP B (patient-engagement / practice-growth / marketing platforms)

**Claim under test:** *"All physio/clinic platforms are EMR/clinical only — none is a real SALES/MARKETING/automation CRM that captures and converts NEW leads."*

**Method:** Live WebSearch + attempted WebFetch (June 2026). Many vendor pages returned HTTP 403 to the fetch bot; where so, claims are sourced from the vendor's own marketing copy as surfaced in search, plus third-party reviews. Uncertainty is tagged inline.

**The four columns that test the claim (the "NEW-lead sales-marketing" test):**
- **(6)** NEW-LEAD capture — paid-ad / web-form leads who are NOT yet patients
- **(7)** Sales / lead PIPELINE — prospect → contacted → consult → booked, with stages
- **(8)** Marketing AUTOMATION — speed-to-lead auto-text/email, nurture sequences, triggered workflows
- **(9)** Ad-source / marketing ROI ATTRIBUTION — joining **ad spend** to **booked patients** (which campaign produced revenue)

The critical distinction throughout: **existing-patient marketing** (reviews, recall, reactivation, reminders) is NOT the same as **NEW-patient acquisition + sales pipeline + ad-ROI**. Most of Group B does the former and markets it as "practice growth."

---

## THE MATRIX

Legend: **Y** = Yes / **P** = Partial / **N** = No.
Columns: 1 EMR · 2 Scheduling · 3 Payments · 4 Reminders/recall/**reactivation** · 5 Reviews · **6 NEW-lead capture** · **7 Sales pipeline** · **8 Mktg automation** · **9 Ad-ROI attribution** · 10 Two-way SMS · 11 Pricing

| Platform | 1 | 2 | 3 | 4 | 5 | **6** | **7** | **8** | **9** | 10 | 11 Pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Tebra** (PatientPop+Kareo) | **Y** (Kareo EHR) | Y | Y | Y | Y | **P** | **N** | **P** | **N** | Y | ~$150–$300+/provider/mo (custom) |
| **Weave** | N | Y | Y | Y | Y | **N** | **N** | **P** | **N** | Y | ~$279+/mo + setup |
| **RevenueWell** | N | Y | N | Y | Y | **P** | **N** | **P** | **N** | Y | from $189/mo |
| **Solutionreach** | N | Y | N | Y | Y | **N** | **N** | **P** | **N** | Y | custom quote (per provider) |
| **NexHealth** | N | Y | Y | Y | Y | **P** | **N** | **P** | **N** | Y | custom (not public) |
| **Birdeye** | N | P | Y | P | Y | **P** | **P** | **P** | **N** | Y | custom (~$300+/mo) |
| **Podium** | N | P (AI) | Y | P | Y | **P** | **P** | **P** | **N** | Y | $399 / $599 / custom |
| **Phorest** (salon/medspa) | N | Y | Y | Y | Y | **P** | **N** | **P** | **P** | Y | ~$99–$299/mo |
| **GoHighLevel** (generic) | N | Y | Y | Y | Y | **Y** | **Y** | **Y** | **Y** | Y | $97 / $297 / $497/mo |
| **GHL deployed for clinics** (e.g. **PhysioFunnels**) | N | Y | Y | Y | Y | **Y** | **Y** | **Y** | **Y** | Y | agency/custom (GHL + svc fee) |
| **Curogram** | N | Y | Y (text-to-pay) | Y | P | **N** | **N** | **P** | **N** | Y | ~$125–$400/mo per provider |
| **Artera** | N | N | N | Y | N | **N** | **N** | **P** | **N** | Y | enterprise custom |
| **Rocket Referrals** (ClientCircle) | N | N | N | Y | Y | **P** | **P** | **P** | **N** | Y | custom (insurance-vertical) |
| **Practice Promotions** (PT agency) | N | N | N | P (email) | Y | **P** (done-for-you) | **N** | **P** | **P** (dashboards) | N | agency retainer |

---

## PER-PLATFORM EVIDENCE & VERDICT

### Tebra (PatientPop + Kareo)
- (1) Y — Kareo is a full EHR/billing system; this is the EMR half. (2/3/4/5) Y — online booking, payments, reminders, review automation. Src: https://www.tebra.com/why-tebra
- (6) **P** — "web form lead capture… website lead-to-consult pipeline" exists, but it is website-inquiry capture, not structured paid-ad lead intake. Src (vendor copy via search): https://www.tebra.com/why-tebra
- (7) **N** / (9) **N** — Decisive third-party evidence: a marketing team found "Tebra alone could not support… lead tracking, workflow automation, and cross-channel visibility… inquiries from the website and digital ad campaigns were captured in Tebra but lacked a structured follow-up process, with no visibility into where leads originated or which campaigns were converting" — so they bolted on **Zoho CRM**. Src: https://boostedcrm.com/tebra-integration-with-zoho-crm/
- **Verdict: existing-patient engagement + practice marketing (website/SEO/reviews/booking). NOT a new-lead sales pipeline; no ad-ROI. Agencies add an external CRM for that.**

### Weave
- (2/3/4/5/10) Y — booking, text-to-pay, reminders/confirmations, auto review requests, two-way texting. Src: https://www.getweave.com/industry/dentistry/
- (6/7/9) **N** — Weave is a patient-communication/phone platform for *existing* patients; no paid-ad lead capture, no prospect pipeline stages, no ad-spend ROI. (8) P — basic automated campaigns only.
- **Verdict: existing-patient engagement only.** Pricing ~$279+/mo. Src: https://www.capterra.com/p/141842/Weave/

### RevenueWell
- (2/4/5/10) Y — booking, recall + 9-month **reactivation** campaigns, reviews, two-way texting. Src: https://www.revenuewell.com/dental-marketing-software
- (6) **P** — "attracts the right new patients with digital marketing services" but this is a bolt-on done-for-you marketing service + social content, not in-product paid-ad lead capture. (7/9) **N** — no sales pipeline, no ad-ROI attribution.
- **Verdict: existing-patient engagement (recall/reactivation/reviews) + light DFY marketing. Not a new-lead sales CRM.** from $189/mo. Src: https://www.softwareadvice.com/dental/revenuewell-profile/

### Solutionreach
- (2/4/5/10) Y — reminders, **auto-recall/reactivation**, surveys, review/referral requests, two-way texting; integrates 400+ PM/EHR. Src: https://www.solutionreach.com/
- (6/7/9) **N** — Explicitly existing-patient: "reactivate them," "request reviews and referrals from **existing patients**." No paid-ad lead capture, no pipeline, no ad-ROI.
- **Verdict: existing-patient engagement only.** Custom per-provider pricing. Src: https://www.capterra.com/p/160916/Solutionreach/

### NexHealth
- (2/3/4/5/10) Y — strong online booking (incl. "Book" button in Google results), reminders/recall, payments, reviews, unified inbox. Src: https://www.nexhealth.com/
- (6) **P** — "acquire 15–45 new patients/month" via **real-time online booking through Google, Yelp, Facebook** — this is self-serve booking from organic listings, NOT paid-ad lead capture into a pipeline. Src: https://www.nexhealth.com/solutions/acquire-new-patients
- (7/9) **N** — no prospect sales pipeline with stages; no ad-spend→booking ROI attribution. (8) P — messaging/recall automation only.
- **Verdict: front-office automation + booking-driven acquisition. NOT a sales pipeline / ad-ROI CRM** (the "acquisition" is online-booking conversion, not lead-gen + sales).

### Birdeye
- (5) Y (core) — reputation/reviews is the flagship; (10) Y two-way + webchat; (6) **P** — "captures leads automatically… qualify visitor intent and gather contact info" via webchat. Src: https://birdeye.com/messaging/
- (7) **P** — generic lead/contact management; (8) P — review/automation triggers, often paired with external CRM (Salesforce/HubSpot). (9) **N** — no ad-spend→booked-patient ROI in-product; not physio-tuned (multi-location local-business reputation platform).
- **Verdict: reputation-first engagement platform with webchat lead capture; generic, not clinic-tuned; no ad-ROI. Existing-patient + reputation, light new-lead.**

### Podium
- (3/5/10) Y — payments (text-to-pay), reviews, webchat/two-way; (6) **P** — "consolidated lead conversion," webchat lead capture, AI agent "Jerry" (GPT-5.1) handles lead capture/scheduling/follow-up. (7) **P** — "tag customers at different parts of the customer journey… manage the sales pipeline." Src: https://www.podium.com/ ; https://emitrr.com/blog/podium-pricing/
- (8) **P** — automations + AI follow-up; (9) **N** — no ad-spend→booking ROI attribution. **Generic local-business SMB CRM, not physio-tuned.**
- **Verdict: generic sales-marketing CRM (lead capture + light pipeline + AI follow-up), NOT clinic-specific, NO ad-ROI.** $399 Core / $599 Pro / custom Signature.

### Phorest (salon / med-spa — adjacent vertical)
- (2/3/4/5/10) Y — booking, payments, **Client Reconnect reactivation** ("haven't visited in 90 days"), auto review requests, SMS/email marketing. Src: https://www.phorest.com/us/features/
- (6) **P** — marketing suite targets client segments (mostly existing); (9) **P** — "measure the revenue generated from every marketing campaign" (campaign revenue, but **existing-client** SMS/email campaigns, not paid-ad→new-client attribution). (7) **N** — no prospect sales pipeline.
- **Verdict: existing-client engagement + reactivation + campaign revenue tracking. Salon/med-spa vertical, not physio; not a new-lead sales pipeline.** ~$99–$299/mo.

### GoHighLevel (generic) — **THE COUNTEREXAMPLE engine**
- (6) **Y** — "automatically captures lead information from multiple sources, including landing pages, forms, **Facebook ads, Google ads**, phone calls, and website chat." Src: https://www.deaninfotech.com/blog/gohighlevel-crm-automation-strategies
- (7) **Y** — "unlimited custom pipelines… visual drag-and-drop boards to move deals through stages, track revenue forecasts." Src: https://help.gohighlevel.com/support/solutions/articles/155000001982-understanding-pipelines
- (8) **Y** — sophisticated triggered workflows, speed-to-lead auto-text/email, nurture sequences. Src: https://www.gohighlevel.com/post/automated-sales-pipeline
- (9) **Y** — **imports Facebook ad spend**, computes ROI = (Gross Revenue − Ad Cost)/Ad Cost and CPA; "If you are entering an opportunity value on the lead opportunity card when you close a sale, GHL can **link these values to the exact Facebook ad that generated the sale**, allowing you to easily see your closing ratio/ROI per each adset." Src: https://help.gohighlevel.com/support/solutions/articles/48001220949-understanding-facebook-ad-reporting-terminology
- **Verdict: a real new-lead sales-marketing CRM with ad→revenue ROI — BUT generic (built for any agency/SMB), NOT physio-tuned out of the box. No EMR; sits beside the clinic's EMR.**

### GoHighLevel deployed for clinics — e.g. **PhysioFunnels** (Paul Gough) — **PROVES HIM WRONG (with caveats)**
- Built **on GoHighLevel** (appears on HighLevel LevelUp Awards), packaged **specifically for "Physical Therapy, Physiotherapy, Sports Injury, Chiro, and all other Pain/Rehab practices."** Src: https://physiofunnels.com/ ; HighLevel awards listing.
- Inherits GHL's (6) lead capture, (7) pipelines, (8) automation ("send and automate text backs for patients who call and you miss," follow-up funnels, back-pain workshop funnels), and (9) GHL ad-ROI — **plus** a physio website, membership/ecommerce, review automation, and lead-gen funnels. Marketed on clinic outcomes ("8–10 new patients/day," "$1M→$2M in 2 years").
- **Verdict: an actually clinic-specific new-lead sales-marketing CRM with ad-ROI capability — physio-vertical, built on GHL. This is the counterexample to the founder's claim.** Caveat: it's a **reseller/snapshot vertical wrapper on a generic engine** (GHL), not purpose-built physio software, and has **no EMR** — it sits beside the clinic's EMR/booking system. Whether each deployment actually closes the ad→booked-patient ROI loop depends on the clinic entering opportunity values (manual step), same GHL limitation.

### Curogram
- (2/3/4/10) Y — booking, text-to-pay, reminders/recall, two-way texting + telehealth. Src: https://curogram.com/
- (6/7/9) **N** — patient-communication/telemedicine platform for existing patients; "recall campaigns, referral management" but no paid-ad lead capture, no prospect pipeline, no ad-ROI.
- **Verdict: existing-patient engagement / telehealth comms only.** ~$125–$400/mo per provider. Src: https://www.capterra.com/p/232966/Curogram/

### Artera
- (10) Y — enterprise multilingual two-way messaging (SMS/email/IVR/webchat), AI (ChatAssist), no-show prediction. Src: https://artera.io/
- (1/2/3/5/6/7/9) **N** — pure **patient communication orchestration** for health systems (600+ systems, 68M patients). No scheduling/payments/reviews of its own, no lead capture, no sales pipeline, no ad-ROI.
- **Verdict: enterprise existing-patient communication layer only. Furthest from the claim's counterexample.**

### Rocket Referrals (now ClientCircle)
- (4/5) Y — feedback automation, reviews, referral generation, renewal reminders, retention. (6) **P** / (7) **P** — "attract leads, capture quote requests… forms, landing pages, web chat… manage the complete customer journey from **prospecting to sales to retention**." Src: https://rocketreferrals.com/insurancea
- (9) **N** — no ad-spend→booking ROI. **Insurance-agency vertical, NOT clinic/physio.**
- **Verdict: a sales+retention CRM with light lead capture — but for INSURANCE AGENCIES, not clinics. Wrong vertical; no ad-ROI.**

### Practice Promotions (physio marketing — agency, not software)
- A **done-for-you PT marketing agency** (websites, SEO, Google Ads, email nurture). (6) **P** generates leads *for* clinics; (8) **P** "automated email campaigns that nurture leads, bring back past patients"; (9) **P** performance dashboards. Src: https://practicepromotions.net/physical-therapy-marketing-services/
- (7) **N** — it's a service, not a self-serve pipeline CRM; no in-product prospect→booked stages owned by the clinic.
- **Verdict: physio-specific marketing AGENCY/service (like PatientSites, Venator), not a sales-pipeline CRM product. Adjacent to, not an instance of, the counterexample.** (Note: PatientSites and PhysioFunnels surfaced as the closest physio-specific lead-gen *products*; PhysioFunnels = the GHL-based one above.)

---

## HONEST BOTTOM LINE — GROUP B

**Which platforms do columns 6–9 (the real test)?**
- **Full 6+7+8+9 (new-lead capture + pipeline + automation + ad-ROI):** only **GoHighLevel** and its clinic deployments (**PhysioFunnels**, agency snapshots). No one else in Group B does all four.
- **Partial 6+7+8 but NO 9 (ad-ROI):** **Podium** and **Birdeye** (generic local-business CRMs with webchat lead capture + light pipeline/automation) — neither joins ad spend to bookings, neither is clinic-tuned.
- **Everyone else (Tebra, Weave, RevenueWell, Solutionreach, NexHealth, Phorest, Curogram, Artera, Rocket Referrals):** existing-patient engagement / recall / reactivation / reviews / booking — **NOT** new-lead acquisition + sales pipeline + ad-ROI. The "practice growth" marketing they advertise is reputation, SEO, online booking, and existing-patient reactivation, not paid-ad lead-to-sale.

**Does ANY Group B platform do clinic-specific NEW-lead acquisition + sales pipeline + automation + ad-ROI attribution?**
- **Yes — narrowly — via GoHighLevel deployed for clinics (PhysioFunnels / agency snapshots).** This is the one honest counterexample. It captures paid-ad leads, runs prospect pipelines with stages, fires speed-to-lead automation/nurture, and can attribute ad spend → booked-patient ROI (FB ad spend import + opportunity-value-to-adset linking), packaged for the physio/rehab/chiro vertical.

**GoHighLevel verdict — ruled IN or OUT?**
- **Ruled IN on capability, with two material caveats:**
  1. **Ad-ROI (column 9): YES.** GHL imports Facebook ad spend, computes ROI/CPA, and links closed-deal opportunity value to the exact ad/adset — that is genuine ad→booked-patient ROI. *Caveat: the loop depends on a human entering opportunity value at close (manual), and "booked patient" = the user marking the opportunity won; it's not an automatic EMR-confirmed-visit join.*
  2. **Physio-vertical: only via wrappers, not natively.** Base GHL is **generic** (any SMB/agency). It becomes "physio" only through third-party snapshots/resellers like **PhysioFunnels** (built by physio-marketer Paul Gough). It has **no EMR** and sits *beside* the clinic's clinical system.

**Net:** The founder's claim is **mostly true but not absolute.** Of the dedicated clinic engagement/growth platforms (Tebra, Weave, RevenueWell, Solutionreach, NexHealth, Curogram, Artera, etc.), **none** is a real new-lead sales-marketing CRM with ad-ROI — they are existing-patient engagement or booking/reputation tools. The **only** thing that does the full new-lead + pipeline + automation + ad-ROI job for clinics is **GoHighLevel (generic) repackaged for physio by agencies (PhysioFunnels)** — i.e., a *generic* sales-marketing CRM wearing a physio costume, EMR-less, with a manual-entry ROI loop. So the defensible refined claim is: *"No purpose-built physio platform with an EMR is a new-lead sales-marketing CRM with ad-ROI; the only thing filling that gap is a generic agency CRM (GHL) bolted alongside the EMR — leaving a clear opening for a native, clinic-specific, ad-ROI-closing sales CRM."*

---

### Confidence / uncertainty notes
- Several vendor pages (Tebra, Henry Schein, GHL help, ghlautomations, PhysioFunnels deep pages) returned **HTTP 403** to the fetch tool; their feature claims here come from vendor marketing copy surfaced via search + third-party reviews/guides. **Medium-high confidence** on the headline 6–9 verdicts; **lower confidence** on exact pricing (several are quote-only) and on the precise depth of each "Partial."
- GHL's ad-ROI mechanism is well-documented across multiple independent guides + HighLevel's own help portal — **high confidence** it imports ad spend and links opportunity value to ad/adset. The **manual opportunity-value entry** dependency is the key real-world caveat.
- PhysioFunnels being GHL-based is **inferred** from its HighLevel LevelUp Awards listing + feature pattern (missed-call text-back, funnels, review automation) — **medium-high confidence**, not vendor-confirmed verbatim.
