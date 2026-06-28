# Jane App — Product Teardown (Modules · Pricing · Integrations · Blind Spots)

**Source:** `/home/user/ppc-guru-prototype/research/jane_crawl/buckets/product.jsonl` (54 pages).
**Method:** Triaged all 54 URLs+titles; deep-read 18 pages full-markdown — all of `/features` index + the feature sub-pages (online-booking, reporting-and-analytics, intake-forms, ratings-and-reviews, websites), all 3 pricing variants (`/pricing` US, `/pricing/us`, `/pricing/new` CA), `/integrations` (full), `/frontdesk/subscribe`, `/switch`, discipline landings (`/physio`, `/chiro`, `/allied`), partnerships (`/telus`, `/fullscript`), `/about`.

**Honesty tags:** `[V]` verifiable from a Jane page (url cited) · `[M]` Jane's own marketing claim · `[E]` my inference.

---

## 1. Modules / Features Jane ships (what we must NOT rebuild)

All from `https://jane.app/features`, `/pricing`, and feature sub-pages `[V]` unless tagged.

- **Scheduling** `[V /pricing]` — calendar with in-person 1:1, group appointments & classes, treatment add-ons, rooms & equipment, availability tagging, shift/break management, tasks, profile/relationship management.
- **Online Booking** `[V /features/online-booking]` — custom-branded booking site, real-time availability, booking policies + deposits/pre-payment, auto confirmation, **Reserve with Google** (Practice+ plans). The booking site is Jane's only "new-patient front door."
- **Telehealth (Online Appointments)** `[V /features/telehealth]` — 1:1 video included all plans; **Group Telehealth is a paid add-on** ($15/mo/practitioner, up to 15 participants, blurred/virtual backgrounds, screen share, in-call chat).
- **Clinical Charting / Documentation** `[V /features/clinical-documentation]` — SOAP/narrative/hybrid templates, library of **10,000+ templates**, billing codes in charts, treatment plans, outcome-measure surveys, supervision support, side-by-side photos, chart permissions, unlimited file storage.
- **AI Scribe** `[V /features/charting-ai-scribe]` — record-live or dictate-after; **5 free notes/mo included, unlimited = $15/mo/practitioner add-on**. Built in-house ("no additional apps").
- **Intake Forms** `[V /features/intake-forms]` — library or custom; auto-sent on booking; auto-reminder if incomplete; collects consent, **insurance details + credit card** in the form; saved to chart.
- **Billing & Insurance** `[V /features/billing-and-insurance]` — superbills, CMS-1500s, receipts/statements. **Insurance Billing is a paid add-on** ($20/mo + $5/$2.50 per extra full/part-time practitioner): real-time eligibility, primary/secondary claims, ERAs, Claim.MD clearinghouse (US), TELUS eClaims/Teleplan/Pacific Blue Cross (CA).
- **Invoicing & Sales** `[V /features/invoicing-and-sales]` — invoices, adjustments/discounts, tips, **products & inventory management**, gift cards, credit memos.
- **Jane Payments** `[V /features/jane-payments]` — integrated card processing (rates below), store card on file, e-invoices, online-booking pre-payments, Clinic Financing by Stripe.
- **Packages & Memberships** `[V /features/packages-and-memberships]` — prepaid packages + recurring memberships (Thrive plan).
- **Patient Communication** `[V /pricing]` — unlimited **email** reminders (all plans), unlimited **SMS** reminders (Practice+), email confirmations, **Secure Messaging**, **Secure Patient Portal**.
- **Patient Mobile App** `[V /features/patient-mobile-app]` — patients manage appts/forms/payments; booking via Jane Mobile App (CA).
- **Ratings & Reviews** `[V /features/ratings-and-reviews]` — auto post-appointment feedback requests; **option to push reviews to Google** to "build your online presence." (Thrive plan / "Marketing Tools.")
- **Return Visit Reminders** `[V /pricing]` — retention nudges (Thrive).
- **Waitlist** `[V /physio]` — auto-scans waitlist, notifies patients on cancellations.
- **Reporting & Analytics** `[V /features/reporting-and-analytics]` — bookings, attendance, cancellations, unscheduled patients, revenue, outstanding balances, staff performance, **return visits & referrals**, filter by date/provider/service, export to Excel. **All metrics are internal-operational/financial — no acquisition or ad-source dimension** (see §6).
- **Jane Websites** `[V /features/websites]` — AI website builder, **$59/mo/clinic add-on**; auto-syncs services/staff/branding from Jane daily; built-in SEO, displays Google reviews; in-house SEO experts available.
- **Self Check-In, Outbound Fax (via Documo), Supervision** — minor modules `[V /pricing]`.
- **Security/Compliance** `[V /features/security-and-reliability]` — HIPAA, PIPEDA, GDPR; 99.99% uptime claim `[M /physio]`.

**Takeaway `[E]`:** Jane is a complete clinical + operational + billing + retention suite. The entire CRM-for-existing-patients job is owned. What is conspicuously thin: anything touching **pre-patient / lead / acquisition / attribution**.

---

## 2. Pricing (exact numbers)

3 plans, identical CAD and USD headline numbers. CA page is `/pricing/new`; US is `/pricing` & `/pricing/us`. `[V]`

| Plan | Price | Includes | Key gating |
|---|---|---|---|
| **Balance** | **$54/mo** | Single practitioner, **≤20 appointments/mo**, unlimited admin & locations, telehealth 1:1, email reminders, portal, secure msg, charting templates, **AI Scribe 5 free notes**, intake forms, outcome surveys, treatment plans, free data import, unlimited support | Capped at 20 appts; no SMS; no online-booking branding |
| **Practice** | **$79/mo** | 1 full-time practitioner; **unlimited appointments + unlimited staff profiles**; online booking (branding, availability, pre-pay policies, **Reserve with Google**); **unlimited free SMS reminders** | — |
| **Thrive** | **$99/mo** | Everything in Practice + rooms/equipment, availability tagging, self check-in, automated waitlist, **return-visit reminders, packages & memberships**, and **"Marketing Tools" = Ratings & Reviews + Google Analytics integration** | "Marketing Tools" gated to top tier |

**Add-ons (any plan unless noted):** `[V]`
- AI Scribe (unlimited): **$15/mo per opted-in practitioner**
- Group Telehealth: **$15/mo per opted-in practitioner** (Practice/Thrive only)
- Insurance Billing: **$20/mo + $5 (full-time) / $2.50 (part-time) per extra practitioner**
- Jane Websites: **$59/mo per clinic**

**Payment processing (Jane Payments):** `[V]`
- US: online **2.85% + $0.25**, in-person **2.6% + $0.10**
- CA: online **2.75%**, in-person **2.5%**

**Free trial / terms:** Free data import, free admin/support-staff accounts, unlimited file storage, **no contracts, no hidden fees** `[M /switch]`. (A trial exists via `/start` but no explicit trial length surfaced in product bucket `[E]`.)

---

## 3. Integrations marketplace (`/integrations`) `[V]`

Jane defines an "integration" as **product integration OR marketing partnership**. **Critical: "No, we don't currently have an open API."** `[V /integrations]`

| Integration | Category |
|---|---|
| **Jane Payments** | Payments (1st-party) |
| **Claim.MD** | Insurance clearinghouse (US) |
| **TELUS eClaims** | Insurance claim adjudication (CA) |
| **Pacific Blue Cross** | Insurance (BC) |
| **Teleplan** (MSP/ICBC/WSBC) | Govt insurance billing (BC) |
| **Documo** | Outbound fax |
| **Fullscript** | Supplement dispensary / lab ordering (charts) |
| **VitaminLab** | Personalized supplements |
| **Wibbi** | Home-exercise prescriptions + RTM billing |
| **Physitrack** | Home-exercise programs + telehealth/outcomes |
| **Jane Websites** | Website builder (1st-party) |
| **Cyberimpact** | **Email marketing** (newsletters/reactivation, CA/US/UK) — patient-list sync |
| **Mailchimp** | **Email marketing** — auto-adds Jane customers who opted into marketing emails; unsubscribe sync |
| **Google Analytics (GA4)** | Web analytics on the **online-booking site** — tracks "appointments booked online" as conversions |
| **External Calendar (Google/Outlook/Apple/iCal)** | Calendar push + Google Cal sync |

**Marketing/ad/CRM verdict `[E]`:** Every "marketing" integration is **retention email to EXISTING patients** (Mailchimp, Cyberimpact). GA4 tracks only the booking-site conversion, **with no ad-platform, ad-spend, or campaign-source linkage**. **There is NO ad-platform integration (no Meta/Google Ads), NO CRM (Salesforce/HubSpot/Pipedrive/Zoho), NO lead/attribution tool.** This is the seam our product fills.

---

## 4. Discipline positioning

- **Physio (`/physio`)** `[V]` — "See Jane Run Your Physical Therapy Practice." Leads on advanced scheduling/online booking, waitlists, "Get Paid: Cash or Direct Bill" (Jane Payments + TELUS), fast documentation, trust/uptime + 10,000-practitioner community. Heavy operational/efficiency framing. `[M]`
- **Chiro (`/chiro`)** `[V]` — "Jane isn't just an EHR, it's a radical replacement." Positioned as the beautiful, easy all-in-one EHR replacement. `[M]`
- **Allied (`/allied`)** `[V]` — landing now skews to community/event ("Jane Summer School," free, open to non-customers) — a **brand/community growth play, not a feature pitch** `[E]`.
- **Cross-discipline `[V /features]`** — "built for physiotherapy, chiropractic, massage therapy, mental health, acupuncture, naturopathy… solo to multi-location." Universal pitch: **replace separate systems with one platform** (booking + charting + billing + comms + reporting + payments).
- Also present: `/physicaltherapy`, `/chiro-ca`, `/mentalhealth-us`, `/acupuncture-us`, `/allied/sessions` — discipline/region-templated landings, same core message.

**Pattern `[E]`:** Jane sells **efficiency, "all-in-one," delight/support, and trust** — never "grow your patient volume / fill your funnel." Growth language is about retention (return visits, reviews→Google) not acquisition.

---

## 5. "Switch to Jane" (`/switch`) and Radio/Front Desk (`/frontdesk`)

- **Switch (`/switch`)** `[V]` — competitive-migration funnel. Sells: free data import from **500+ software providers (and pen & paper)**, dedicated Import Specialists, 1-on-1 Account Setup Consultation, **no contracts**, transparent pricing, unlimited support (avg 2-min phone wait, 6 days/wk), Jane University training, Capterra 4.8/5. A "Switch readiness" Typeform + webinar. The whole page is about **frictionless competitor displacement**, not lead gen `[E]`.
- **Front Desk (`/frontdesk`)** `[V]` — NOT a feature. **"Front Desk" is Jane's content/brand magazine** ("a magazine made for clinic life… tips, tools, and insights to help you run your practice"). A top-of-funnel **content marketing / brand asset** (subscribe flow). `[E]` It's how *Jane itself* markets to clinics — ironically demonstrating Jane has a growth engine it does not give its customers.

---

## 6. WHERE JANE IS BLIND (our opening) — the most important section

Evidence that Jane has **no lead-capture, ad-source, or new-patient-acquisition / attribution capability:**

1. **No ad-platform integration anywhere.** `[V /integrations]` The marketplace lists insurance, fax, supplements, exercise, two email tools, GA4, and calendars. **Zero Meta/Google/TikTok Ads, zero conversion-API, zero ad-spend ingestion.**
2. **No CRM and no open API.** `[V /integrations]` "No, we don't currently have an open API." So clinics cannot pipe Jane data to a CRM, nor pull ad/lead data in. Jane is a closed clinical box.
3. **Reporting has no acquisition dimension.** `[V /features/reporting-and-analytics]` Reports cover bookings, attendance, cancellations, revenue, outstanding balances, staff performance, return visits & referrals — **all post-patient, financial/operational. There is no "lead source," "channel," "campaign," "cost per acquisition," "ad spend," or "new vs returning patient by source" report.** "Referrals" = clinical referrals, not marketing attribution `[E]`.
4. **GA4 integration stops at the booking page.** `[V /integrations]` It counts "appointments booked online" as conversions but **does not connect a booking back to which ad/campaign/keyword drove it** — Jane explicitly frames it as on-booking-site stats only. No UTM-to-revenue, no ROAS.
5. **"Marketing" = retention email only.** `[V /integrations]` Mailchimp/Cyberimpact sync **existing patients who opted into marketing emails**. There is **no concept of a non-patient lead** anywhere in Jane — a record only exists once someone is a patient/booker.
6. **No ad-spend field, no lead/inquiry object, no pipeline/stage for prospects.** `[E, strongly supported]` Nothing in features, pricing, or integrations references prospects, leads, inquiries, deal stages, cost, or marketing budget. The data model begins at "patient."
7. **"Marketing Tools" tier is just Reviews + GA tag.** `[V /pricing Thrive]` Jane's own labeled marketing surface is review-collection (→ Google) + a GA tracking ID. That's the ceiling of Jane's marketing ambition.

**Opening thesis `[E]`:** Jane perfectly owns everything **from the moment a person becomes a patient** (book → chart → bill → retain → review). It is structurally blind **before** that line: it cannot capture a lead, cannot know which ad/channel produced a booking, has no spend/ROI/attribution, no CRM, and no open API to bolt one on. A clinic-native CRM that captures inquiries, ties Meta/Google ad spend + source to a Jane booking/revenue, and reports CAC/ROAS sits cleanly **beside** Jane in the exact gap Jane refuses (or is unable) to enter — and the closed API means our integration value (manual/booking-page/GA-bridge capture) is defensible because Jane can't trivially open the door for a competitor either.
