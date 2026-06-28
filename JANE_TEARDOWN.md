# Jane App — Teardown (the system we orbit)

*Synthesis of a 1,972-page crawl of jane.app + its help guide, mined by six subagents. This is the decision doc; the evidence sits in `research/jane_crawl/extracts/*.md` (product · compliance · guide-booking · guide-money · stories · blog) over the raw crawl in `research/jane_crawl/`. Jane is the dominant practice-management/EMR for physio/chiro/massage/allied-health, esp. Canada — we build BESIDE it, never replacing it (`PROJECT_BRIEF_v2.md`, `DECISION_MEMO.md`).*

**Honesty tags:** `[V]` verifiable from a Jane page · `[M]` Jane's own marketing claim · `[E]` our inference. June 2026.

---

## TL;DR — the wedge, confirmed from Jane's own docs

1. **Jane's data model starts at "patient."** Every entity (profile, intake, portal, waitlist, report) requires an existing patient/booker. **There is no lead, inquiry, prospect, or pipeline object anywhere.** A person who clicked an ad but didn't book does not exist in Jane. `[V/E]`
2. **Jane has no concept of marketing *cost*.** Across the entire 772-page guide, **no report references ad spend, channel, campaign, CPA, ROAS, or lead→booking conversion.** The only "source" surface is a **manual, self-reported "How did you hear about us?" dropdown** → a revenue-weighted **Referral Report** that has no cost side, so it *structurally cannot* compute ROI. It's a tally, not attribution. `[V]`
3. **The booking funnel carries no tracking.** Booking URL is a fixed `clinic.janeapp.com` iframe; **no UTM / gclid / fbclid / query-param capture** documented. Jane's GA4 hook stops at "booked online" and never links a booking back to the ad that drove it. `[V/E]`
4. **Jane is a closed box: "we don't currently have an open API."** `[V]` No CRM integration (no Salesforce/HubSpot/Zoho), no ad-platform integration (no Meta/Google Ads). Its "marketing" integrations are retention email to *existing* patients (Mailchimp/Cyberimpact).
5. **Jane actively argues clinics don't need paid acquisition** ("ranked #1 without running a single Google ad"; its tools are "the foundation before any paid spend makes sense"). `[V]` So the category leader has *chosen* not to enter ad-attribution — we're not racing it into the space, we're filling one it disowns.
6. **Compliance seam:** Jane offers Canadian-region data centres (default for CA clinics) **but SMS reminders, telehealth, and AI Scribe explicitly process in the U.S.** `[V]` So Jane cannot honestly promise "patient data never leaves Canada" for the messaging surface — a Canada-resident-by-design CRM can. This is a structural, copy-resistant moat.

> **The opening (one line):** Jane perfectly owns everything *from the moment a person becomes a patient* (book → chart → bill → retain → review). It is blind *before* that line — no lead capture, no ad-source, no spend/ROI, no CRM, no open API to bolt one on. **That pre-patient, ad-attribution layer is our product, and it sits cleanly beside Jane.**

---

## 1. What Jane ships — the "DO NOT REBUILD" list

Jane is a complete clinical + operational + billing + retention suite. Competing with any of this is a losing game; we read from it, we don't duplicate it. `[V — research/jane_crawl/extracts/teardown_product.md, teardown_guide_money.md]`

- **Scheduling & calendar** — multi-location, group/class, rooms/equipment, shifts, waitlist auto-fill.
- **Online booking** — branded `*.janeapp.com` page, real-time availability, deposits/pre-pay, **Reserve with Google** (3.6M bookings / ~500k first-timers since Dec 2024 `[M]`).
- **Clinical charting / AI Scribe** — 10,000+ templates, SOAP, outcome surveys; AI Scribe (5 free notes/mo, unlimited = $15/mo add-on).
- **Billing & insurance** — invoicing, superbills; **Canadian direct billing via TELUS eClaims** (Canada Life, Beneva, Belair, Blue Cross…), **US via Claim.MD clearinghouse**. Insurance is a $20/mo add-on.
- **Jane Payments** — Stripe-backed processing (CA 2.75% online / 2.5% in-person; US 2.85%+$0.25 / 2.6%+$0.10), card-on-file, terminal (CA$279/US$239/UK£179).
- **Packages & Memberships & Gift cards** — Jane's recurring-revenue primitives (Thrive plan).
- **Patient comms** — unlimited email reminders (all plans) + SMS (Practice+), secure messaging, secure patient portal, patient mobile app.
- **Retention/reputation** — Return-visit reminders, **Ratings & Reviews** (push to Google) — Jane's *entire* "Marketing Tools" surface.
- **Reporting** — deep operational/financial (sales, AR, retention %, no-show, utilization, compensation). **All post-patient. No acquisition dimension.**
- **Jane Websites** — AI site builder, $59/mo add-on (Jane is *not* a website builder otherwise; clinics embed Jane's booking iframe in their own Wix/Squarespace).

## 2. Pricing (the anchor we sell against)

| Plan | Price (CAD=USD headline) | Notable |
|---|---|---|
| **Balance** | **$54/mo** | 1 practitioner, ≤20 appts/mo, no SMS, no branded booking |
| **Practice** | **$79/mo** | unlimited appts + staff, online booking, Reserve w/ Google, unlimited SMS |
| **Thrive** | **$99/mo** | + waitlist, packages/memberships, return-visit reminders, **"Marketing Tools" = Reviews + a GA4 tag** |

Add-ons: AI Scribe $15 · Insurance $20 · Group Telehealth $15 · Websites $59. No contracts, month-to-month, free import from 500+ systems. `[V]`

**Read `[E]`:** Jane is cheap and broad. We are **not** a $99 EMR competitor — we're an additive acquisition/attribution layer on *top* of the clinic's ad spend, justified by ROI (one recovered new patient ≈ $400–1,000 LTV), not by undercutting Jane.

## 3. Integrations + the closed API (why the gap is defensible)

`[V — teardown_product.md §3]` Jane's marketplace: Jane Payments, Claim.MD, TELUS eClaims, Pacific Blue Cross, Teleplan, Documo (fax), Fullscript/VitaminLab (supplements), Wibbi/Physitrack (exercise), Mailchimp + Cyberimpact (**retention email**), **GA4** (booking-page only), external calendars.

- **No Meta/Google/TikTok Ads. No CRM. No conversion API. No open API** ("No, we don't currently have an open API" `[V]`).
- **Why this *helps* us:** the closed API cuts both ways — clinics can't pipe Jane into a CRM themselves, *and* Jane can't trivially open the door to a competitor either. Our integration value (booking-page capture, GA-event bridge, manual/RPA handoff, JDP-partner when approved) is hard for a third party to replicate. `[E]`

## 4. The attribution / lead gap — our opening (the core finding)

Confirmed five independent ways `[V across teardown_guide_booking.md, teardown_guide_money.md, teardown_product.md, bible_blog.md]`:

1. **No pre-patient/lead object** — the model begins at "patient."
2. **No ad-source/channel/campaign field** — only a hand-typed "How did you hear about us?" picklist, self-reported, can't be merged, only appears in reporting *after* an arrived/paid visit.
3. **Booking URL carries no tracking params** — fixed subdomain iframe, deep-links by location/staff/treatment only.
4. **No marketing-cost concept in any report** — the Referral Report has revenue + patient counts but no spend → cannot produce CPA/ROAS. GA4 is bring-your-own, booking-page-only, surfaced nowhere inside Jane.
5. **Jane positions paid acquisition as out-of-scope** — "you don't need an agency / before any paid spend makes sense."

→ **Our wedge:** capture the lead *before* Jane exists (ad click → call/form/DM → lead record with real channel/UTM attribution), nurture it, then hand the booked patient to Jane. Then join ad spend → booked patient → revenue (read from Jane's first-visit + revenue + referral data) to produce the **cost-per-booked-patient / channel-ROI report Jane structurally cannot.** That's Module C (attribution); the lead capture is Modules A (voice) + B (pipeline).

## 5. Compliance — the data-residency moat

`[V — teardown_compliance.md]`

- **Residency seam:** core EMR record can sit in a Canadian DC, **but SMS reminders, telehealth, and AI Scribe explicitly process in the U.S.** A Canada-native CRM that keeps *messaging + AI* on Canadian infrastructure can claim end-to-end residency Jane can't. **This is our structural, copy-resistant moat — keep SMS/AI Canadian.**
- Jane never claims "HIPAA/PHIPA compliant" outright — it **role-maps** (clinic = custodian/controller, Jane = processor/agent) and certifies **SOC 2 Type 2 + PCI DSS + ISO-27001** instead. Match the certs; out-promise on residency + breach terms.
- Clinic **owns** all patient data; Jane owns only the cross-clinic Jane-ID login. Soft spots to beat: a **$100 / 3-months liability cap** and a **2019-vintage 99% SLA**.
- Cloud provider is never named publicly; sub-processor list is outsourced to a Drata trust portal.

## 6. Customer language — the front-desk/missed-call pain in owners' own words

The stories + blog extracts (`bible_stories.md` = 31-quote bank, `bible_blog.md` = 23-quote bank, all url-tagged) are ready to fold into `vertical/VERTICAL_BIBLE.md`. The highest-leverage patterns for our voice wedge `[V]`:

- **"We aren't going to answer the phone at 1 am, but they can absolutely visit our website to book!"** — owners *already name* the after-hours missed-call problem we solve.
- **"those callbacks where you can very easily miss an opening, especially after the clinic has closed"** — the missed-opportunity-after-hours pain, verbatim.
- **"I'm the admin, accountant, bookkeeper, HR, marketing — I'm everything!"** — the owner-wears-every-hat wedge.
- **"I'm not salesy… my work should speak for itself"** — the tonal gate: our outreach + the voice agent must read as *care, not pitch*.
- **Segment by capacity:** "at capacity, I pump the brakes on marketing" vs "she's swamped, need another practitioner" vs "my job is keeping everyone busy" → full clinics want cancellation-fill; growing clinics want new-patient capture. **Same product, two scripts.**
- **Discovery channel:** owners find software via **discipline-specific Facebook groups + forums + peer referral** — a distribution clue for us, not just Jane.
- **"Farm vs hunt"** (retention vs acquisition) — a reusable owner metaphor.

## 6b. Competitive-risk check — is Jane entering our space? (NO) `[V — research/jane_ai_videos/extract_ai_competitive.md]`

Mined Jane's "AI at Jane" playlist (7 videos) for the #1 strategic risk: Jane moving into lead-capture / marketing / attribution / AI voice. **Verdict: it isn't.**
- Jane's shipped/teased AI is **exclusively clinical charting** — **AI Scribe** (voice-to-chart) + smart-template prompts. Four of seven videos are AI Scribe. `[V]`
- **Zero** AI voice/phone/receptionist, **zero** lead capture, **zero** marketing automation, **zero** attribution, **zero** pre-patient CRM in any of it. `[V]`
- Jane's only marketing-adjacent AI content is a **self-help SEO webinar that explicitly disclaims being a Jane product** ("It's not that Jane is better than another platform for that"). `[V]`
- Posture: **opt-in, no-train-on-your-data, "support not replace"** — cautious, clinical-admin-only. `[E]` That posture suggests the acquisition/attribution lane stays vacant for the foreseeable future.

**So the wedge is not just open today — Jane's own AI direction signals it intends to stay in the chart, not the funnel.** (Still watch WebPT Reach — the EMR-side ad-ROI threat flagged in `CLINIC_CRM_GAP.md` — not Jane.)

## 7. Where Jane plugs into our modules (the seams)

| Our module | Jane seam | Mechanism |
|---|---|---|
| **A — Voice / missed-call** | availability read; booked patient handoff | read availability via GCal mirror / manual template; book into OUR pipeline, hand confirmed patient to Jane later (manual / RPA / JDP) — Jane has no write-bridge (`JANE_INTEGRATION.md`) |
| **C — Attribution** | first-visit count, revenue, Referral field, GA `appointment_booked` event | ingest Jane's post-patient data + the clinic's ad accounts → compute CPA/ROAS Jane can't |
| **B — Pipeline** | none (Jane has no pre-patient layer) | entirely ours — the lead lives in our CRM until it becomes a Jane patient |

## 8. The 2–3 tests only YOU can run (paid Jane login)

The crawl maps everything *public*. These build-blocking questions need a live Jane subscription — I can't test them, you can:

1. **Does the Jane booking URL silently accept & persist query params?** Try `clinic.janeapp.com/?utm_source=test&fbclid=test` → book a test appt → does anything (the referral field, booking history, any export) retain that string? (Docs say no — confirm in product.) **If yes, attribution gets dramatically easier.**
2. **Does JDP (Jane Developer Platform / partner API) expose appointment *read* and/or *write*?** The public site says "no open API," but partner-gated JDP may differ (`JANE_INTEGRATION.md` open Q). Worth a partner-program inquiry.
3. **Can the GA4 `appointment_booked` event carry the booking value + a source param?** If the clinic's own GA4 already sees the ad source on the booking-page session, we can read attribution from GA rather than from Jane — a cleaner path.

---

## Bottom line

Every load-bearing assumption behind PatientROI is now **evidence-backed from Jane's own documentation**: Jane has no lead layer, no ad-source, no marketing-cost/ROI, no CRM, no open API, and a Canadian-residency story that leaks at exactly the messaging surface our product would own. The category leader has publicly chosen not to enter this space. The wedge is real, sharp, and beside-not-against Jane.

*Evidence: `research/jane_crawl/extracts/{teardown_product,teardown_compliance,teardown_guide_booking,teardown_guide_money,bible_stories,bible_blog}.md` · raw: `research/jane_crawl/` · related: `JANE_INTEGRATION.md`, `CLINIC_CRM_GAP.md`, `DECISION_MEMO.md`, `product/MODULE_A_voice.md`.*
