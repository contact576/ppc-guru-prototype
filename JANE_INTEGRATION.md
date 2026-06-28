# Jane App — Integration & Data Capabilities (research for the marketing-CRM bridge)

**Purpose:** We're building a marketing/lead CRM that sits *beside* Jane (the practice-management / EHR system our clinic clients run). We need to (a) read bookings/appointments out of Jane, (b) push new bookings into Jane, and (c) avoid double data entry. This doc captures what Jane *actually* supports per its own docs, ranks the technical paths, and flags what needs a hands-on subscription test.

**Researched:** June 2026, primarily from Jane's own help guides (`jane.app/guide/*`), the Jane Developer Platform (`developers.jane.app`), and one independent integrator write-up. Confidence is tagged per row. Jane's docs sites partly block automated fetching, so several "exact endpoint" details are **search-snippet-derived, not page-verified** — tagged `[VERIFY]`.

---

## TL;DR — the crux

- **Jane now HAS a real REST API** — the **Jane Developer Platform (JDP)**, REST/JSON, OAuth2 PKCE + RS256 JWTs, resources for **patients, appointments, practitioners, invoices, products**, with **webhooks**. BUT it is **partner-gated** (approval-based "Jane Integrations" program), **not** open/self-serve. This is the single biggest update to the "Jane has no API" assumption — it's no longer true, it's *gated*.
- **Google Calendar is NOT a viable write-bridge.** Jane's GCal integration is **two separate ONE-WAY syncs**, and the Jane-bound direction only ever shows **"Busy - Google Calendar Event"** blocks (no title/patient/guests). **You cannot create a real Jane appointment by writing to Google Calendar.** It only blocks off time.
- **Best path** to both read and write bookings with fidelity = **become a vetted JDP partner** and use the REST API. Everything else (CSV export, iCal feed, calendar sync) is read-only, lossy, or busy-block-only.

---

## 1. Capabilities table

| Capability | Supported? | Direction / fidelity | Notes | Confidence |
|---|---|---|---|---|
| **Google Calendar sync — Jane → GCal** | Yes | One-way OUT | Sends Jane appts/shifts to GCal/Outlook/Apple. Configurable: how client name appears + whether to include appointment **notes**. | High |
| **Google Calendar sync — GCal → Jane** | Yes | One-way IN | Personal GCal events appear in Jane **only as opaque "Busy - Google Calendar Event"** blocks — **no title, description, or guest info** (privacy). Brings events from −30 days to +12 months. | High |
| **Create a Jane booking by writing to the synced GCal** | **No** | — | The inbound sync makes a *busy block*, not a Jane appointment. No patient, type, or practitioner mapping. **Not a booking-injection path.** | High |
| **iCal calendar subscription (staff/patient)** | Yes | One-way OUT (read-only feed) | Private iCal URL → any iCal app. **View-only**, "cannot be edited to manage your availability." Can include client name + (optionally) notes. | High |
| **Online booking page** | Yes | — | Hosted by Jane. Per-clinic, per-practitioner, per-location, per-treatment URLs. | High |
| **Embeddable "Book Online" button** | Yes | — | Jane provides copy-paste **embed codes** (HTML) for clinic site / blog / etc. Buttons for main page, per-practitioner, per-location. | High |
| **Deep-link to a specific practitioner/treatment** | Yes | — | Get URL by navigating the booking site and copying the address bar (per-staff, per-treatment URLs exist). | High |
| **Prefill patient name/email or pass tracking params into booking flow** | **Unclear / likely No** | — | Docs describe deep-links to staff/treatment but **say nothing about query-string prefill of patient identity**. GA/GA4 tracking ID *can* be attached to the booking site for analytics. `[VERIFY — hands-on test]` | Low |
| **Public/open API** | **No** | — | No self-serve API. | High |
| **Partner REST API (Jane Developer Platform)** | Yes (gated) | Read **and** write `[VERIFY write scope]` | REST/JSON; resources: patients, appointments, practitioners, invoices, products. OAuth2 PKCE, RS256 JWT bearer, date-versioned URLs (`/YYYY-MM-DD/`), 100 req/min/endpoint/clinic. Practitioner authorizes scopes. | High (existence); Med (write) |
| **Webhooks** | Yes (on JDP) | Push | "Webhooks management API" exists; independent integrator notes **limited webhook coverage → expect polling** for many sync use cases. | Med |
| **Get an Appointment (GET)** | Yes | Read | Confirmed endpoint: retrieve appointment by id. | High |
| **Create an Appointment (POST)** | **Unconfirmed** | Write | A POST/create-appointment endpoint was **not** confirmable from public snippets. Appointment statuses are clinic-centric (booked/arrived/completed/cancelled). `[VERIFY — needs partner docs / sandbox]` | Low |
| **Export patient list** | Yes | Out | Reports → Patient List → ⋯ → **Export to Excel/CSV**. Full access / Account Owner only. Includes name, contact, birthday, medical alerts. | High |
| **Export appointments** | Yes | Out | Reports → Appointments → date/practitioner filter → Export to Excel. | High |
| **Import patients + appointments** | Yes | In (bulk/migration) | Bulk import supported; **appointments import requires the Patient List report uploaded alongside** the Appointments report. Migration-grade, not live sync. | High |
| **Batch chart export** | Yes | Out | For practitioners. | Med |
| **Email reminders** | Yes (all plans) | — | Automatic pre-appointment email reminders. | High |
| **SMS reminders** | Yes (paid tiers) | — | Legacy/Practice/Thrive plans. One reminder per type/day, bundles all that day's appts. Patient opts in during booking. | High |
| **Return Visit Reminders (recall)** | Yes | — | "Recalls"; Email (Auto) sends at 7am on chosen date. | High |
| **Wait List + notifications** | Yes | — | On cancel/no-show/move, Jane scans wait list and notifies eligible clients (Email/SMS). | High |
| **Email-marketing sync** | Yes | Out | **Mailchimp** (opted-in patients auto-added) and **Cyberimpact** (consenting patient list syncs out). | High |
| **Google Analytics / GA4 on booking site** | Yes | — | Attach GA/GA4 tracking ID to booking site → booked-online conversions. | High |
| **Payments** | Yes | — | Jane Payments (Stripe-backed processing); insurance/claims (e.g. Telus eClaims in CA). | Med |
| **Pre-patient lead / prospect capture** | **No** | — | Jane is patient/PM-centric. No lead object before someone is a patient/booking. | High |
| **Ad-source / campaign attribution on a patient** | **No** | — | No "lead source" / UTM-on-patient field. GA only measures booking-site traffic, not per-patient attribution into the record. | High (this is our gap) |
| **Marketing ROI / spend reporting** | **No** | — | Not a function of Jane. | High |

---

## 2. Answers to the specific questions

**1. Google Calendar sync.**
Two **separate one-way** syncs, never a true two-way:
- **Jane → GCal (out):** appointments/shifts pushed out; you can set how the client name appears and whether notes are included. So the *outbound* event *can* carry patient name + (optionally) notes — useful for *reading* the schedule, but it's a one-way mirror.
- **GCal → Jane (in):** personal events come in as **opaque "Busy - Google Calendar Event"** blocks — **no title, no description, no guests**. Window: −30d to +12m.
- **Can an external system create a Jane booking by writing to that GCal?** **No.** The inbound direction only produces a *busy block* in Jane (to protect availability), with none of the appointment structure (patient, type, practitioner). Writing an event to the synced Google Calendar will **block off** that time in Jane but will **not** create a real, billable Jane appointment. *This kills the "GCal as the bridge" idea for booking injection.* (The separate iCal subscription is explicitly **view-only** too.)

**2. Online booking / embeddable widget.**
Yes — Jane gives copy-paste **embed codes** for "Book Online" buttons (main page, per-practitioner, per-location) usable on any HTML page. Deep-links to a specific staff member or treatment exist (copy the booking-site URL). You **can** attach a **GA/GA4** tracking ID to the booking site for online-booking conversion analytics. What's **not documented**: passing a patient's **name/email as prefill** or arbitrary tracking/UTM params *into* the booking flow itself. Treat prefill/param-passing as **unproven — `[VERIFY]` with a live test.**

**3. API / developer access / partner program.**
- **No open public API.** Confirmed — not self-serve.
- **There IS a partner API: the Jane Developer Platform (JDP).** Approval-based "Jane Integrations" program: intake + review of how the product works, data flow, privacy, support, before credentials are issued. Approved integrations build "Jane Extensions," are listed on Jane's site, and are supported by Jane.
  - **Tech:** REST/JSON; OAuth2 **PKCE**; **RS256 JWT** bearer tokens from Jane's IAM; **date-versioned** URLs (`/YYYY-MM-DD/`); **100 req/min** per endpoint per clinic (429 + Retry-After). Practitioner logs in and approves requested **scopes**; more scopes later = re-auth.
  - **Resources:** patients, appointments, practitioners, invoices, products. **Webhooks** management exists but coverage is reportedly **limited → polling** likely needed.
- **Official non-API integrations Jane supports:** Mailchimp + Cyberimpact (email marketing), Google Analytics/GA4, Jane Payments (Stripe-backed), insurance/claims incl. Telus eClaims (CA). **No evidence of native Zapier or QuickBooks** in the docs reviewed — `[VERIFY]` if needed (QuickBooks/Zapier were asked but not confirmed in Jane's own guides).

**4. Data export / import.**
- **Export:** Patient List (→ Excel/CSV, incl. contact info, birthdays, medical alerts; Full-access/Owner only), Appointments report (→ Excel, filterable by date/practitioner), batch chart export. All **manual, on-demand** — not a live feed.
- **Import:** bulk patient + appointment import (migration tooling, incl. from Cliniko/ChiroTouch/etc.). **Appointments import requires the Patient List report uploaded alongside** the Appointments report. This is a **one-time migration** mechanism, not an ongoing booking-push API.

**5. Reminders / patient comms (so we don't duplicate).**
Jane already does: automatic **email reminders** (all plans), **SMS reminders** (paid tiers, opt-in at booking, de-duped to one/type/day), **Return Visit Reminders / recall** (auto-email at 7am), **Wait List** auto-notifications on cancel/no-show/move. → **Our CRM should not rebuild appointment reminders or recall.** Our lane is *pre-booking* lead nurture + attribution, not appointment-day comms.

**6. Marketing / lead / ad data.**
Confirmed **gap**: Jane has **no pre-patient lead/prospect object**, **no ad-source/UTM attribution on a patient record**, and **no marketing-spend/ROI reporting**. GA on the booking site measures *site traffic/conversions*, not per-patient attribution. **This is exactly the space our CRM fills** — capture the lead and its ad source *before* Jane, then attribute the eventual booking back to spend.

---

## 3. Ranked integration paths (get data OUT and push bookings IN)

### Path A — **Become a vetted Jane Developer Platform partner (REST API).** ⭐ Recommended
- **OUT:** Read appointments/patients/practitioners directly. High fidelity (real fields, statuses). Use webhooks where available, **poll** the rest (rate limit 100/min/endpoint/clinic).
- **IN:** *If* an appointment-create (POST) scope exists, this is the **only** clean way to push a real booking into Jane. **`[VERIFY]` — appointment *write* is unconfirmed from public docs; "Get an Appointment" (read) is confirmed.**
- **Fidelity:** Highest available. Native objects, OAuth-scoped, per-clinic.
- **Cost:** Approval process (business case + privacy/security review), per-practitioner authorization, ongoing partner relationship. Slowest to start, strongest end state.

### Path B — **Drive bookings via Jane's hosted online-booking page (deep-link), read back via API/export.**
- **IN (pseudo):** Don't *inject* a booking — **send the lead to Jane's booking page** (embed button or deep-link to the right practitioner/treatment). The patient completes the booking in Jane. Avoids needing write access entirely. **Attribution carried via GA/UTM on the booking site** (and `[VERIFY]` whether any param survives into the record).
- **OUT:** Reconcile the resulting appointment via Path A (read) or CSV export.
- **Fidelity:** Booking is 100% native (patient does it in Jane); **attribution linkage is the weak point** — matching "lead X" to "booking Y" relies on email match + timing, not a passed key (unless prefill/param test passes).
- **Cost:** Low. Works **today** with no partner approval. Best **interim** path.

### Path C — **CSV export / report-based sync (manual or scripted-upload).**
- **OUT:** Scheduled Patient List + Appointments exports → import into our CRM. Batchy, manual unless a human/automation runs the export.
- **IN:** Only via Jane's **bulk import** (migration tool), which is not designed for ongoing single-booking pushes.
- **Fidelity:** Decent for read/backfill; **not real-time**; no clean write path.
- **Cost:** Low tech, high operational friction. Fine as a **backfill/reconciliation** layer, poor as the primary sync.

### Path D — **Calendar bridge (iCal feed out / GCal sync).** ❌ Not for bookings
- **OUT (read-only):** Subscribe to Jane's iCal feed → see the schedule (client name, optional notes) in our system. View-only.
- **IN:** **Does not work** — writing to the synced GCal makes a *busy block*, not a Jane appointment.
- **Fidelity:** Lossy (iCal text fields only); **zero write capability.** Useful at most as a lightweight read-only availability mirror. **Do not design the booking-injection bridge on this.**

**Recommendation:** Pursue **Path A (JDP partnership)** for the durable, high-fidelity two-way integration, while shipping **Path B (deep-link booking + UTM/GA attribution)** immediately as the no-approval interim that already avoids double-entry of the *booking* (patient books in Jane; we read it back). Use **Path C** only for backfill. **Avoid Path D** for anything write-related.

---

## 4. Open questions — need a hands-on Jane subscription/sandbox to resolve

1. **Does the JDP API expose appointment *creation* (POST) and rescheduling, or only reads?** Confirmed: `GET appointment`. Unconfirmed: create/update. This decides whether Path A is truly two-way. **Highest-priority verify.**
2. **Exact JDP scopes** (e.g. `appointment:read` vs `appointment:write`, patient create) and whether a partner can be approved for write. 
3. **Does Jane's booking URL accept prefill (name/email) or pass-through tracking params** (UTM/click-id) that land *on the patient/appointment record*, or is GA the only attribution surface? (Path B's fidelity hinges on this.)
4. **Webhook event coverage** — which events fire (appointment.created/updated/cancelled?) vs. what must be polled. Independent source says coverage is limited.
5. **Native Zapier and QuickBooks** — asked but **not confirmed** in Jane's own guides; verify on the live Integrations Hub.
6. **Partner approval bar/timeline** for a *marketing-CRM* use case (vs. clinical) — does Jane approve adjacent-tooling partners, and how long.
7. **Outbound GCal event field detail** — exactly which fields land in the Jane→GCal event (we know name + optional notes are configurable; confirm practitioner/location/type granularity) if we ever use it as a lightweight read mirror.

---

## Sources (Jane official unless noted)
- Google Calendar Sync — https://jane.app/guide/google-calendar-sync
- Subscribing to Your Calendar (Staff) — https://jane.app/guide/subscribing-to-your-calendar-for-staff
- Subscribing to your Calendar (Patients) — https://jane.app/guide/subscribing-to-your-calendar-for-patients
- Importing from Google Calendar/Contacts — https://jane.app/guide/importing-to-jane/importing-from-google-calendar-contacts
- Integrations Hub & FAQ — https://jane.app/guide/integrations-hub-faq
- Jane's Integrations — https://jane.app/guide/jane-s-integrations
- Jane Integrations program (blog) — https://jane.app/blog/jane-integrations-our-program-our-partners-and-how-to-work-with-us
- Adding "Book Online" Buttons to Your Website — https://jane.app/guide/adding-book-online-buttons-to-your-website
- How to Find Your Online Booking Link — https://jane.app/guide/how-to-find-your-online-booking-link
- Booking an Appointment Online (Patients) — https://jane.app/guide/booking-an-appointment-online-for-patients
- Google Analytics — https://jane.app/guide/google-analytics
- Patient Reports — https://jane.app/guide/patients-reports
- Appointments Reports — https://jane.app/guide/appointments-reports
- Importing from Jane / Basics of Importing — https://jane.app/guide/importing-from-jane · https://jane.app/guide/basics-of-importing-to-jane
- Email & SMS Reminders — https://jane.app/guide/email-sms-reminders
- Return Visit Reminders — https://jane.app/guide/return-visit-reminders
- Wait List Notifications — https://jane.app/guide/setting-up-your-wait-list-notifications
- Jane Developer Platform — https://developers.jane.app/ · getting started: https://developers.jane.app/docs/getting-started · Get an Appointment: https://developers.jane.app/reference/getanappointment-1
- Independent integrator analysis (Of Ash and Fire) — https://www.ofashandfire.com/blog/ehr-api-integration-practice-management-platforms

*Note: `developers.jane.app` and several `jane.app/guide` pages returned 403 to automated fetching; the JDP technical details (scopes, webhooks, create-appointment) are derived from search snippets of those pages and the independent integrator write-up, hence the `[VERIFY]` tags above.*
