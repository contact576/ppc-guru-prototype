# Jane App — Booking / Scheduling / Intake / Profiles / Telehealth Teardown

Source: `buckets/guide_core.jsonl` (772 help-guide pages). Deep-read ~30 of the booking/scheduling/intake/profile/portal/telehealth pages. Honesty tags: **[V]** verifiable (url given), **[M]** marketing claim, **[E]** inference.

> **Bottom line for our CRM-beside-Jane bet:** Jane is a *practice-management* tool that begins at the **patient/appointment** boundary. It has ONE structured marketing-adjacent field — **"How did you hear about us?" / Referral Source** — a clinic-editable free-text-ish dropdown captured *at account creation / first booking*, surfaced in a revenue-weighted **Referral Report**. There is **NO ad-source / UTM / campaign / lead-source field, NO tracking-parameter capture on the booking URL, and NO concept of a pre-patient lead** (someone who hasn't booked/created an account). That gap is exactly the seam a clinic CRM fills. See "GAPS" at bottom.

---

## 1. ONLINE BOOKING

### What it is / how patients book [V]
- Online booking is a clinic-level toggle: **Settings > Online Booking > "Online booking allowed" / "disabled"**. When on, the clinic's Jane booking page is immediately live. [V https://jane.app/guide/how-to-turn-on-online-booking]
- Patient flow: open booking site → (pick Location if multi-location) → pick **Discipline / Book by Treatment / Book by Practitioner** → calendar of real-time availability → pick slot → confirm (offered multi-appointment booking). Patients book against their **patient profile** (they log in or create an account). [V https://jane.app/guide/booking-an-appointment-online-for-patients]
- Display/policy knobs (clinic-wide, not per-practitioner): same-day booking, min booking notice, late-cancellation window, allow cancel/reschedule from My Account, upcoming-appointments limit, Book-by-Treatment / Book-by-Staff toggles, browse-by-month, practitioner order, **Meta description** (for Google/social share snippet), Marketing-Email opt-in text, Self check-in (Thrive). [V https://jane.app/guide/how-to-set-up-clinic-wide-online-booking-settings]
- **"Prompt patients for additional info after booking online"** — a single custom prompt question shown *after* booking completes. [V same url] — this is the only free custom post-booking question; it's a single prompt, not a field library. [E]

### The booking page / URL [V — critical for us]
- URL format is a **fixed Jane subdomain**: `businessname.janeapp.com`. [V https://jane.app/guide/how-to-change-your-jane-account-website-address-url] [V https://jane.app/guide/link-online-booking-to-instagram]
- The URL can only be changed by **emailing Jane Support** (Account Owner only); the old URL stays as a permanent redirect. No self-serve custom domain. [V https://jane.app/guide/how-to-change-your-jane-account-website-address-url]
- You can generate **scoped deep-links** to a specific **location, staff member, treatment, class, or group** — by selecting in the Branding dropdown OR just copying the browser URL after clicking that item on the booking site. [V https://jane.app/guide/how-to-find-your-online-booking-link] [V https://jane.app/guide/how-to-simplify-online-booking-for-new-patients]
- **Private booking link** = a hidden Location (toggled off from online booking) with its own treatments/staff; share the link directly. Not in the public booking site. [V https://jane.app/guide/how-to-create-a-private-booking-link-in-jane]

### Embedding / "Book Online" buttons [V]
- Jane provides **iframe embed codes** ("Book Online" buttons) per main page / per practitioner / per location, found under **Settings > Branding > Online Booking Buttons & URLs**. Paste into any HTML page (website, blog, LinkedIn). [V https://jane.app/guide/adding-book-online-buttons-to-your-website] [V https://jane.app/guide/how-to-find-your-online-booking-link]
- For Wix/Squarespace (no raw HTML), use the **plain URL** in the platform's own button widget. [V https://jane.app/guide/adding-book-online-buttons-to-your-website]
- Instagram: just put the `clinic.janeapp.com` URL in the IG "Website" field. [V https://jane.app/guide/link-online-booking-to-instagram]

### Source / referral / UTM / tracking on the booking URL [V — this is the headline]
- **NO mention anywhere of UTM parameters, query-string capture, click IDs (gclid/fbclid), campaign tags, "source" pass-through, or any tracking-param persistence on the booking link.** The booking URL is treated purely as a destination; the only customization is which location/staff/treatment it deep-links to. [E from absence across all booking-link pages: how-to-find-your-online-booking-link, adding-book-online-buttons, how-to-create-a-private-booking-link, link-online-booking-to-instagram, how-to-change-your-jane-account-website-address-url]
  - (Note: a separate *marketing* guide page in the crawl carries UTMs on its OWN url — `whats-new-in-jane-webinar?utm_...` — that's Jane tagging Jane's site, NOT a clinic-facing feature. [E])
- The **only** in-product "where did this booking come from" data is the **Referral Source field** (§3) and the appointment's **booking history** = who created the booking (patient self-book vs staff). [V https://jane.app/guide/how-to-view-the-booking-history-of-an-appointment-96cb58c6-2a84-4d0f-ae01-4712e7d952ae] — that history is *who clicked book*, not *what channel/ad sent them*.

### Booking access control [V]
- "Verify New Users" (mobile code / email link before booking) — must be turned on by Jane Support, anti-spam. [V https://jane.app/guide/how-to-turn-on-online-booking]
- Restrict to existing/approved clients: set default policy to **Disabled**, then opt-in profiles individually or "Set All to Allowed". New profiles can't book; they see no mention of booking at all. Cannot restrict new clients to only *some* appointment types — it's all-or-nothing. [V https://jane.app/guide/only-allow-approved-online-booking]
- **Contact to Book** — show availability but force a call/email instead of self-booking, per-treatment or per-shift; phone/email pulled from Location settings. [V https://jane.app/guide/contact-to-book]

---

## 2. SCHEDULING / CALENDAR / APPOINTMENTS / WAITLIST

- Schedule is the staff calendar; availability is driven by Location, Discipline, Treatment, **Shifts**, and Staff profile. Online availability = intersection of those. [V https://jane.app/guide/how-to-turn-on-online-booking]
- Appointment **History & Status** panel logs who booked, status changes, reminders, notifications, surveys; "View Detailed History" for full audit. [V https://jane.app/guide/how-to-view-the-booking-history-of-an-appointment-...]
- **Wait List** [V https://jane.app/guide/schedule/using-the-wait-list]:
  - Per-practitioner; add client + preferred appointment type + availability window (with "Anytime for a Week/Month" shortcuts) + note.
  - **Clients can add themselves to the Wait List** (Settings > Wait List toggle). Ordered longest-waiting first.
  - Wait List Notifications (automatic) when a slot opens — separate page (`managing-your-wait-list-with-jane-...`). There's a **Wait List Report**.
  - [E] Notable: the wait list is the closest Jane gets to a "queue of people who want in but aren't booked" — but it's still keyed to **existing client profiles**, not anonymous leads.

---

## 3. INTAKE FORMS / NEW-CLIENT CAPTURE [V]

### Two distinct capture surfaces — important distinction for us
1. **Customizable Patient Sign-Up Form** (the account-creation form on the booking site) — **Settings > Patient Form Fields**. [V https://jane.app/guide/customizable-patient-sign-up-form]
2. **Intake Forms** (clinical/admin forms triggered by *appointment booking*) — **Settings > Forms & Surveys**. [V https://jane.app/guide/intake-forms]

### Sign-up form fields (this is where source capture lives) [V — quote]
Always required: **First Name, Last Name, Email, Mobile Phone.** Optional/configurable fields you can include + mark required:
- Date of Birth
- Personal Health Number
- Marketing Email Opt In
- **"How did you hear about us?"**  ← the source-capture field
- **"Who were you referred to?"**
- Preferred Name
- Pronouns
[V https://jane.app/guide/customizable-patient-sign-up-form]

So **YES, Jane can capture "how did you hear about us" / referral source — but as a generic, clinic-defined picklist, captured at signup.** It is NOT an ad-channel/campaign field and is not auto-populated from the click source. [V]

### Intake Forms — what they are / limits [V https://jane.app/guide/intake-forms]
- Online forms scoped to clinic / discipline / practitioner / specific treatments. Tabs: General, Appointment Type, **Profile Fields**, Credit Cards (Jane Payments), Insurance Information (add-on), **Questionnaires**, Consents.
- **Profile Fields tab** can re-collect the same profile fields (so the referral field can also appear in intake). Data lands in the Client Profile **Profile tab**.
- **Questionnaires tab** = custom questions (Notes, Check Boxes, Drop Downs, Ranges, Signatures, Body Chart, etc.) BUT this data is saved as a **chart entry (clinical record)**, NOT structured profile data — so a "how did you hear" dropdown built as a questionnaire item is buried in charts, not reportable as a marketing dimension. [V] [E]
- **Key timing limit:** an Intake Form is **NOT** sent when a client creates an account or with the Welcome Email — it's only sent when an **eligible appointment is booked** (or manually). [V quote: "An Intake Form is not automatically sent out when a client creates an account through your Online Booking Site nor is it sent out with the Welcome Email."] → intake never reaches a not-yet-booked lead. [V]
- Can collect credit card (Jane Payments) and insurance (add-on), up to 3 policies. [V]
- No PDF/Word import of external templates. [V]

---

## 4. PATIENT PROFILE FIELDS — is there a lead/ad source field? [V — confirmed NO]

- Profile fields = name, email, mobile, DOB, PHN, preferred name, pronouns, marketing opt-in, and the **Referral Source** ("How did you hear about us?") + **Referred To** (clinic vs specific practitioner). [V customizable-patient-sign-up-form; V referral-report]
- **The ONLY source-ish field is "Referral Source," a free-form-ish dropdown, NOT an ad/marketing/campaign/lead-source field.** Confirming the prompt's expectation:
  - Patients self-select from a **scoped list** at booking ("choose from a scoped list while confirming their account information"). [V quote https://jane.app/guide/referral-report]
  - The list is editable by Full-Access staff at **Settings > Language > Referral Sources**. [V]
  - Jane's default **"Other"** option opens a **free-text box** patients type into. [V quote]
  - Staff can type **anything** into the referral field on the profile (not limited to the list); Jane auto-completes previously used values. [V]
- There is **no field that distinguishes Google vs Meta vs organic vs paid**, no campaign attribution, no first-touch/last-touch, nothing auto-derived from where the click came from. A clinic could *manually* create referral-source values like "Facebook Ad," but it's hand-typed/self-reported, can't be merged ("Can I merge referral types together? No"), and only appears in reporting once the patient has an **arrived/paid appointment**. [V referral-report FAQ: "An appointment will not show up... until it has been invoiced (arrived) or paid."]

### Referral Report [V https://jane.app/guide/referral-report]
- **Reports > Referrals** (Admin/All-Billing+). Breaks down **revenue by referral source** + unique patient count, split by Anyone / The Clinic / specific Staff Member. Date-range, Cash vs Accrual toggle, **export to Excel/CSV** with per-patient detail.
- [E] This is the de-facto "marketing ROI" report clinics have — but it's self-reported source × *post-arrival revenue*, with no spend side, no channel taxonomy, no pre-booking funnel.

---

## 5. PATIENT PORTAL — "My Account" [V https://jane.app/guide/my-account-your-patient-client-portal]
- Secure per-clinic portal. Set up during online booking OR via Welcome Email. Sections: Upcoming Appointments (cancel/reschedule within policy; join online appts), Appointment History, Messages (practitioner-initiated only), Intake Forms (banner prompt), Documents (shared chart entries/files), contact-info + **marketing-email opt-in** self-edit, Credit Cards on File, Pay Balance, Receipts.
- [E] Entirely post-account; nothing here for a lead who hasn't created an account.

---

## 6. TELEHEALTH / VIDEO ("Online Appointments") [V]
- "Jane Online Appointments" = built-in 1:1 and **group/class** video visits (telehealth). Add-on/setup via Settings. [V https://jane.app/guide/getting-started-with-online-appointments] [V https://jane.app/guide/add-telehealth-to-your-practice-with-jane-online-appointments]
- Booked like any treatment (it's a treatment flagged as online); availability can be limited to specific days/times; patients join from My Account "Begin" button (appears ~1hr before) or Jane mobile app; "Knock Knock" waiting area; AI Scribe transcription beta; virtual backgrounds; group/breakout rooms; group telehealth is +$15/practitioner/mo. [V across getting-started-with-online-appointments, my-account portal, group-telehealth-hub-beta, ai-scribe-for-telehealth pages — titles only for the latter]
- [E] Telehealth is purely a *delivery* channel; no bearing on lead source/attribution.

---

## 7. CLINIC WEBSITE / WIDGET
- Jane is NOT a website builder. It provides the hosted booking page (`*.janeapp.com`), iframe **Book Online** buttons, branding (logo, background image, notice/announcement banner), and a **Meta description** for search/social snippets. Clinics bring their own website (Wix/Squarespace/etc.) and embed Jane. [V adding-book-online-buttons-to-your-website; V how-to-set-up-clinic-wide-online-booking-settings; V branding-your-online-booking-page; V notice-message-on-online-booking-pages]
- Marketing/"get more bookings from your website" content exists but is webinar/advice, not product (e.g., `on-demand-webinar-how-to-get-more-bookings-from-your-website`, `the-five-essentials-of-clinic-websites`). [M]

---

## GAPS — directly relevant to lead capture, source tracking, pre-patient leads

1. **No pre-patient / lead object.** Every Jane entity (profile, intake, portal, wait list) requires an existing **patient profile**. A person who clicked an ad but didn't book/create an account does not exist in Jane. There is no inbox of inquiries, no "new lead," no CRM pipeline stage. [E, strong — absent across all profile/booking/portal pages]
2. **No ad-source / channel / campaign attribution.** The single source field is self-reported "How did you hear about us?" — a hand-maintained picklist + free-text, not derived from the click. No UTM/gclid/fbclid capture, no first/last-touch, no spend side. [V customizable-patient-sign-up-form, V referral-report]
3. **Booking URL carries no tracking.** Fixed `*.janeapp.com` subdomain, iframe embed, deep-links only by location/staff/treatment. No query-param persistence into the booking/profile record documented. [E from how-to-find-your-online-booking-link + embed pages]
4. **Referral data is post-arrival + revenue-weighted only.** A source row doesn't appear in the Referral Report until a patient has an arrived/paid appointment — useless for measuring top-of-funnel / no-show / inquiry-stage leads. [V referral-report FAQ]
5. **Intake never touches a lead.** Intake forms fire on *appointment booking*, explicitly not on account creation or welcome email — so no structured capture before a booking exists. [V intake-forms quote]
6. **"How did you hear" via a questionnaire is unreportable.** If a clinic builds the question as an Intake questionnaire item (vs the profile field), it's stored as a clinical chart entry, not a reportable marketing dimension. [V intake-forms Questionnaires section] [E]

→ **Our wedge:** capture the lead *before* Jane exists (ad click → form/call/DM → lead record with real channel/campaign/UTM attribution), then hand the booked patient to Jane. Jane's "How did you hear about us?" is the manual, lossy, post-hoc version of what we'd automate.
