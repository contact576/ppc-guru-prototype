# Physio Clinic Workflow + Jane-Gap Product Map

**Purpose:** Product-discovery research for a vertical CRM + growth platform built *for physiotherapy clinics*, filling the gaps Jane App (the dominant Canadian physio EMR, ~95% adoption per the brief) does **not** cover. Scope: small owner-operated clinics (<10 staff). Date: June 2026.

**Confidence tags:** `[HIGH]` = corroborated across multiple independent sources / Jane's own docs. `[MED]` = directional, single decent source or industry-typical. `[LOW]` = plausible but thinly sourced / our inference. Dollar/percent figures from vendor blogs are marketing-flavored — treated as `[MED]` at best.

---

## PART 1 — Day-in-the-life / full patient lifecycle (<10-staff clinic)

The spine: a clinic *lives and dies* between **the call/inquiry** and **the second booking**. Jane owns the middle (booking → chart → bill). The money leaks are almost all *before* the patient is in Jane and *after* they stop showing up.

| # | Stage | Task | Who | Time it eats | Pain / inefficiency / money-leak |
|---|-------|------|-----|--------------|----------------------------------|
| 1 | **Get discovered** | Run/maintain Google + Meta ads, GMB profile, ask for word-of-mouth referrals | Owner (or outsourced agency) | Ongoing; owner checks ad dashboards ad-hoc | Owner spends $ on ads but **can't tie spend → booked patients**. Only ~25.8% of clinic owners know their CAC `[MED]`. Local PT cost-per-lead $20–60, but mismanaged Google Ads can run >$100/lead `[MED]`. The ad platform reports "leads/clicks"; nobody reconciles that to who actually paid. |
| 2 | **Inquiry arrives** | Phone call, web form, IG/FB DM, walk-in | Front desk (or therapist if no FD) | Seconds to answer — *if* someone's free | **The #1 leak.** Clinics lose ~20–30% of potential bookings to voicemail `[MED]`. ~43% of healthcare calls go unanswered in business hours `[MED]`. Clinician is *in treatment* → phone rings out. **After-hours callers rarely call back — they book with whoever answers first** `[MED]`. A single missed new-patient call is worth ~$400+ in lifetime value `[MED]` (see LTV below). |
| 3 | **Lead follow-up / speed-to-lead** | Call/text the inquiry back, answer questions, push to a booking | Front desk / owner | 5–15 min per lead *when it happens* | **Speed-to-lead is brutal:** respond in 5 min vs 30 min ≈ up to 21× more likely to convert (HBR) `[MED]`; first clinic to respond converts ~80%, second <20% `[MED]`. Web-form and DM leads sit untouched for hours. No system pings the team, no automated text fires, no follow-up cadence. Manual = inconsistent = lost. |
| 4 | **Booking + intake + insurance verification** | Take booking, send intake forms, collect insurance, verify coverage/benefits | Front desk | 10–20 min/patient; insurance verify is the slow part | Jane handles booking + digital intake well. **Insurance/benefit *verification* is still largely manual** — call the insurer or have the patient confirm `[MED]`. 81% of patients prefer digital forms; 83% want to fill them *before* arriving `[MED]`. Paper/clipboard clinics burn front-desk time + create errors. |
| 5 | **Reminders / reduce no-shows** | Auto email/SMS reminders, confirmations, waitlist backfill | Jane (automated) | Near-zero once configured | **Mostly solved by Jane** — SMS/email reminders + waitlist that auto-fills cancellations + card-on-file for late-cancel policy `[HIGH, Jane docs]`. No-show rates still cited at 15–31% `[MED]`, so reminders help but don't eliminate. This is *not* a Jane-shaped hole. |
| 6 | **Treatment + charting** | SOAP notes, outcome measures, templates, dictation | Therapist | Core of the clinical day | **Jane's core competency** `[HIGH]`. Templates, dictation, outcome surveys, 1000s of templates. Do **not** compete here. |
| 7 | **Rebooking / plan-of-care adherence / first-visit drop-off** | Pre-book next visit, chase patients who didn't rebook | Front desk / therapist | Should be 30 sec at checkout; chasing is ad-hoc | **Massive leak.** Same-day rebooking → 30–50% more visits/year `[MED]`. Drop-off after the initial eval is a top revenue killer — attrition can drive revenue down ~50% `[MED]`; patients who complete plans have ~40% higher LTV `[MED]`. Drop-off reasons: felt better, access issues, "could do it myself," weak therapeutic alliance `[MED]`. Jane shows an "Unscheduled Patient Report" but **does not automate the chase** `[HIGH, Jane docs]`. |
| 8 | **Retention / reactivation of lapsed patients** | Re-engage patients dormant 6–12 mo; "use your benefits before they expire" outreach | Owner / front desk (rarely happens) | Hours of manual list-pulling — usually skipped | **High-intent, near-zero-cost revenue that mostly never happens.** Year-end insurance reset (Dec 31) is a natural trigger `[MED]`. A 500-lapsed-patient reactivation sequence ≈ 5–15% response → 25–75 bookings `[MED]`. Jane has the patient list but **no built-in segmented campaign engine** `[HIGH]` — owners must export to Mailchimp/Cyberimpact and manually build it, so they don't. |
| 9 | **Reviews / reputation / referrals** | Ask for Google reviews, route unhappy patients privately, track word-of-mouth | Front desk (inconsistently) | A few min/patient if done at all | 90% of people check reviews before picking a provider; >75% choose based on reviews `[MED]`. Jane has a **Referral Report** (tracks *sources*, manual entry + $ per source) but **no review-generation/request automation and no negative-feedback gating** `[HIGH, Jane docs]`. Asking is sporadic and human-dependent. |
| 10 | **Billing / insurance claims** | Process payments, submit claims (e.g., TELUS eClaims), reconcile | Front desk / billing | Significant, but inside Jane | **Jane core** (Jane Payments, TELUS eClaims, terminal) `[HIGH]`. Reviewers say advanced billing + some insurance integrations create manual work, and reporting is "too basic" for data-driven practices `[MED]` — but this is a Jane-improvement area, not a clean greenfield for us. |
| 11 | **Reporting** | Does the owner know cost-per-new-patient, which ads work, retention rate, revenue/therapist? | Owner | "Guessing program" | **Owner is flying blind on growth metrics.** Jane reports financials/utilization/no-shows *inside the clinic* `[HIGH]`, but has **no marketing attribution** — no native GTM, no native Meta Pixel, can't connect ad spend → booked/paying patient `[HIGH]`. "If you can't tell cost-per-new-patient by channel, you have a guessing program" `[MED]`. Retention rate, source ROI, revenue/therapist all live in spreadsheets if anywhere. |

### Economics that make stages 2–3 and 7–8 hair-on-fire `[MED]`
- Avg PT episode ≈ **10–12 visits**; revenue/visit ≈ **$100–150** → episode value ≈ **$1,000–1,260**, patient LTV ≈ **$1,000+** (often higher with repeat episodes).
- So a **missed new-patient call (Stage 2)** ≈ $400+ and up to a full ~$1,000 LTV lost.
- **Same-day rebooking** lifts visits/year 30–50%; **completing the plan** lifts LTV ~40%.
- **5% retention improvement → 25–95% profit increase** (classic retention math, cited in physio context) `[MED]`.
- A **lapsed-patient reactivation** costs a fraction of a net-new acquisition and converts off existing trust.

**Net:** the clinic's biggest controllable dollars are at **(2) the missed/after-hours call**, **(3) slow lead follow-up**, **(7) first-visit drop-off / no rebooking**, and **(8) dormant-patient reactivation** — and the owner **(11) can't see any of it**. Jane is excellent at running a clinic, weak at *growing* one.

---

## PART 2 — What Jane App DOES vs DOESN'T do

### Jane DOES (confirmed, mostly from Jane's own docs/site) `[HIGH]`
- **Scheduling & online booking** — self-serve booking, services/availability, multi-practitioner.
- **Charting / EMR** — SOAP, templates (1000s), dictation, outcome-measure surveys. *Its crown jewel.*
- **Billing / insurance / payments** — Jane Payments (PCI), terminal, TELUS eClaims, receipts.
- **Reminders & no-show tools** — email/SMS reminders + confirmations, **waitlist auto-backfill** of cancellations, card-on-file for late-cancel policy.
- **Patient portal** — appointments, self-reschedule/cancel, secure messaging, payments, shared docs/charts.
- **In-clinic reporting** — financials, utilization, no-show rates, **Referral Report** (referral *sources* + $/source, manual entry), Unscheduled Patient Report.
- **Telehealth** — compliant video.

### Jane does NOT do (the gaps) `[HIGH unless noted]`
1. **Pre-patient lead capture / CRM.** No inbox/pipeline for inquiries that aren't yet patients. A web form, DM, or missed call isn't a Jane object until it becomes a booking. *Third parties (StraussTech etc.) exist specifically to bolt CRM onto Jane — proof of the hole.*
2. **Ad / marketing tracking + ROI attribution.** **No native Google Tag Manager. No native Meta Pixel** on any plan → server-side conversion tracking and paid-ads measurement require custom scripts or a marketing partner `[HIGH]`. Cannot answer "which ad produced this paying patient."
3. **Sales pipeline / speed-to-lead workflow.** No lead stages, no SLA timers, no instant-alert-to-rep, no auto-text-on-inbound.
4. **AI voice / after-hours answering.** No phone-answering, no missed-call auto-text-back, no 24/7 capture. (Served today by CallHero, PainHero, Lyngo, Kickcall-type voice AIs.)
5. **Multi-channel follow-up automation.** No drip sequences across SMS/email/(WhatsApp/DM) for un-booked leads or no-rebook patients. Reminders ≠ nurture cadences.
6. **At-scale reactivation campaigns.** No segmented, triggered campaign engine (e.g., "lapsed 9–12 mo + benefits resetting Dec 31"). Owners must export to **Mailchimp / Cyberimpact** and DIY — Jane itself confirms **no native bulk email marketing** `[HIGH]`.
7. **Review generation / reputation.** No automated post-visit review request, no negative-feedback gating, no Google review routing. (Served by **ClinicSense Review Booster**, WeaveRev, etc.)
8. **Referral *tracking & generation*.** The Referral Report logs a *source* you typed in; there's **no referral program, no attribution to a campaign, no automated patient-referral asks.**
9. **Marketing/growth reporting for the owner.** No cost-per-new-patient by channel, no source→revenue, no retention-rate or revenue-per-therapist growth dashboard.
10. **Open API.** **Jane has NO open/public API and "no plans" to offer one** — only a *vetted-partner* approval program (developers.jane.app) `[HIGH]`. **This is the single most important structural fact for our build:** we cannot read/write Jane directly without becoming an approved partner. Any tool that needs Jane's calendar/patient data must use the **Jane → Google Calendar two-way sync** as the bridge (Jane *can* push/sync to Google Calendar), patient-entered data, or the front desk as the human API.

---

## PART 3 — The MODULE MAP (our product)

Design principle: **be the growth layer Jane refuses to be**, powered by the founder's ad/conversion data, and **bridge to Jane via Google Calendar** (since there's no API). Every module below is a Jane-shaped hole; the "real competition" column keeps us honest about where a point-solution already exists.

| Module | What it does | Pain it kills (stage #) | Value lever | Real competition today | Needs Jane↔GCal bridge? | Priority |
|--------|--------------|------------------------|-------------|------------------------|------------------------|----------|
| **A. Missed-Call & After-Hours Capture (AI voice + instant text-back)** | Answers/over-flows calls 24/7; missed-call → instant SMS; books into the Google-Calendar-synced slot; logs why caller didn't book | (2) missed/after-hours calls | **MONEY** — recovers $400–$1,000 LTV calls; "book with whoever answers first" | **CallHero (~$229/mo+), PainHero, Lyngo, Kickcall** — *crowded* | **Yes** (must read real availability + write the booking) | **V1 — TOP 3** |
| **B. Speed-to-Lead Inbox + Pipeline (CRM)** | Unifies form/DM/call/walk-in leads into one pipeline; instant rep alert + auto-first-text; SLA timers; cadence until booked | (2)(3) | **MONEY + TIME** — 5-min response ≈ up to 21× conversion | Generic CRMs (HubSpot/GoHighLevel) + StraussTech bolt-ons — *none physio-native + Jane-aware* | Partial (booking write-back via GCal) | **V1 — TOP 3** |
| **C. Ad-to-Patient Attribution & Owner Growth Dashboard** | Pixel/UTM/call-tracking → ties Meta/Google spend to booked & *paying* patients; cost-per-new-patient by channel, source→revenue, retention rate, revenue/therapist | (1)(11) | **MONEY + visibility** — fixes the "guessing program"; **only ~26% of owners know CAC** | CallHero call-tracking (calls only); agencies' spreadsheets — *no integrated paying-patient loop* | **Yes** (need the booked→paying outcome from Jane via GCal/front-desk confirm) | **V1 — TOP 3** |
| **D. Rebooking & Plan-of-Care Adherence Nudges** | Flags first-visit/no-rebook patients; auto + assisted "how are you doing?" outreach; prompts same-day rebooking | (7) | **MONEY** — same-day rebook = 30–50% more visits; +40% LTV | Jane's *passive* Unscheduled Report; Physitrack (adherence-adjacent) | Yes (read who has no future appt) | **V2 (fast-follow)** |
| **E. Lapsed-Patient Reactivation Engine** | Segments dormant patients (6–12 mo); triggered campaigns incl. **year-end benefits-reset**; tracks bookings generated | (8) | **MONEY** — cheapest revenue; 5–15% reactivation on existing trust | ClinicSense, Demandforce, Mailchimp/Cyberimpact (manual) | Yes (need last-visit dates + suppress active patients) | **V2** |
| **F. Review & Reputation Automation** | Post-visit review request, sentiment gating (happy→Google, unhappy→private), GMB monitoring | (9) | **MONEY (discovery) + pain** — 90% check reviews | **ClinicSense Review Booster (well-established)**, WeaveRev | Soft (trigger off visit-complete signal) | **V2** |
| **G. Referral Generation & Tracking** | Automated patient-referral asks; referral links/codes; ties referrals → revenue (vs Jane's manual source log) | (1)(9) | MONEY | Jane Referral Report (passive); generic referral SaaS | Soft | **V3 (nice-to-have)** |
| **H. Digital Intake + Insurance Pre-Verification assist** | Pre-arrival digital intake + benefit-check assist | (4) | TIME | **Jane already does intake**; verification partly manual everywhere | n/a (overlaps Jane) | **V3 — mostly Jane's turf, low differentiation** |

### TOP 3 — the V1 wedge (and why these three)
The strongest modules are (a) hair-on-fire painful, (b) a clean Jane-shaped hole, and **(c) powered by the founder's ad/conversion data** — that last criterion is the real moat and points squarely at A + B + C as one connected story:

1. **A — Missed-Call & After-Hours Capture.** The clearest dollar leak (every missed call ≈ $400+ LTV; after-hours callers don't call back). **Caveat: most crowded space** (CallHero, PainHero, Lyngo). We win not on "AI answers phones" but by *connecting the captured call to the attribution loop* (Module C) and the pipeline (Module B) — the point-solutions don't close that loop.

2. **B — Speed-to-Lead Inbox + Pipeline.** Turns the captured inquiry (form/DM/call) into a *worked* lead with instant alerts + auto-text + cadence. Up-to-21× conversion swing on response speed. Physio-native + Jane-aware CRM doesn't exist as a focused product — generic CRMs require heavy config and don't know Jane.

3. **C — Ad-to-Patient Attribution & Owner Dashboard.** The differentiator and the founder's superpower: clinics run ads but **~74% can't tell cost-per-new-patient**. Because Jane has no Pixel/GTM, the owner literally cannot close the loop. We tie ad spend → booked → *paying* patient and surface CAC, source-ROI, retention, revenue/therapist. **This is the wedge nobody else owns**, and it's the natural home for the founder's existing ad/conversion data.

**Why these three together:** A captures the lead, B converts it, C proves the ROI — one funnel, one dataset. Each alone is a feature; together they are *the growth operating system that sits beside Jane*. D–E (rebooking + reactivation) are the obvious, high-value fast-follow once the patient-outcome data is flowing.

### The structural constraint that shapes everything `[HIGH]`
**Jane has no open API.** Build the **Jane → Google Calendar two-way sync** as the canonical bridge: read real availability to book (A), confirm booked→show→paying outcomes for attribution (C) and rebooking/reactivation triggers (D/E). Where the calendar can't carry a signal (e.g., "did they become a paying patient"), use light front-desk confirmation or patient-entered data. **Do not** assume direct Jane data access — and treat becoming a *vetted Jane partner* as a separate, slower track.

### Honesty checks
- **Module H (intake/insurance)** overlaps Jane's own strengths — low differentiation, deprioritize.
- **Module F (reviews)** and **A (voice)** face *established* point-solutions (ClinicSense, CallHero). Our edge is *integration into the attribution loop*, not feature parity.
- **Reminders/no-shows (Stage 5) and charting/billing (6,10)** are **Jane's turf — do not rebuild them.**
- Vendor stats (conversion %, $/missed-call, reactivation response rates) are marketing-sourced `[MED]`; directionally consistent but should be re-validated with the founder's own clinic data before they anchor pricing or ROI claims.

---

## Sources
- CallHero — AI phone system / call tracking / pricing: https://mycallhero.com/ , https://mycallhero.com/physio-clinics/ , https://mycallhero.com/pricing/
- PainHero — "missed calls cost you $400 each": https://painhero.ca/resources/ai-phone-system-physical-therapists/
- Lyngo AI receptionist for physio: https://www.lyngo.ai/industry/allied-health/physiotherapy/
- Missed-call / after-hours conversion stats (Timotheos, X): https://x.com/IanTimotheos/status/2029569703740330486
- Jane App features / physio: https://jane.app/ , https://jane.app/physio , https://jane.app/features/online-booking
- Jane HIPAA & marketing emails (no native bulk email): https://jane.app/guide/hipaa-and-marketing-emails
- Jane integrations (Mailchimp/Cyberimpact): https://jane.app/us/integrations , https://jane.app/guide/jane-s-integrations
- Jane Referral Report: https://jane.app/guide/referral-report
- Jane waitlist / reminders / unscheduled patient report: https://jane.app/guide/using-the-wait-list , https://jane.app/guide/unscheduled-patient-report
- Jane has no open API (vetted partners only): https://jane.app/guide/integrations-hub-faq , https://developers.jane.app/
- Jane CRM gap (3rd-party bolt-on): https://strausstech.com/jane-app-crm-integration/
- NewFrame Digital — Jane marketing limitations (no GTM/Meta Pixel, thin marketing): https://newframedigital.com/what-is-jane-app/
- WebPT — PT marketing problems / KPIs: https://www.webpt.com/blog/march-founder-letter-problems-with-physical-therapy-marketing-according-to-reddit , https://www.webpt.com/blog/measuring-matters-key-metrics-marketing-and-sales-physical-therapy-practices
- Speed-to-lead (HBR 5-min, 21×; first-to-respond 80%): https://www.physicaltherapybiz.com/blog/speed-to-lead-pt-biz , https://aibridgeclub.com/post/physio-enquiry-to-booking-conversion
- Cost-per-new-patient / only ~26% know CAC: https://ptmarketingpros.com/how-to-measure-your-pt-clinics-marketing-roi-in-5-steps/ , https://patientpartners.co/blog/20-physical-therapy-marketing-ideas/
- Drop-off after initial eval (qualitative study): https://www.sciencedirect.com/science/article/abs/pii/S2468781225000748 , https://www.physiotutors.com/research/improving-physiotherapy-adherence-uncovering-the-hidden-reasons-behind-no-shows-drop-offs/
- Rebooking same-day 30–50% more visits / retention: https://www.physitrack.com/insights/5-proven-ways-for-patient-retention , https://physiocarepms.com/blogs/increase-patient-retention-physiotherapy-clinic/
- Reactivation / year-end benefits reset: https://www.rovinghealth.com/articles/patient-reactivation-campaigns-healthcare-lapsed-patients , https://www.therapeuticassociates.com/end-of-year-physical-therapy-insurance-benefits-reminder/ , https://aquariusphysiotherapyyaletown.com/extended-health-benefits-bc/
- Reviews / reputation (ClinicSense, 90% check reviews): https://clinicsense.com/features/google-reviews , https://clinicsense.com/blog/3-easy-ways-to-get-positive-physical-therapist-reviews
- Patient LTV / visits / revenue per visit: https://ac-health.com/increase-lifetime-patient-value/ , https://www.practiceedge.com.au/how-to-calculate-patient-lifetime-value/ , https://www.paulgough.com/why-customer-lifetime-value-so-important-in-pt/
- Digital intake / insurance verification preferences: https://www.digitalintakes.com/physical-therapy , https://www.patientstudio.com/physical-therapy-practice-management-software
