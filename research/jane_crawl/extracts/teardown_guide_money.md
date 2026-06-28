# Jane App Teardown — Billing, Insurance, Payments, Packages & Reporting/Analytics

**Source:** `buckets/guide_core.jsonl` (772 Jane help-guide pages). Selected ~55 money/reporting pages from the URL+title index; deep-read ~28. Honesty tags: **[V]** verifiable (url given) · **[M]** marketing claim · **[E]** inference.

**Bottom line up front:** Jane is a deep practice-management/EMR system covering scheduling, charting, billing, insurance, payments, packages and a large suite of operational/financial reports. **It has NO acquisition/marketing analytics whatsoever** — no source-level new-patient reporting tied to channels, no ad spend, no cost-per-patient, no lead/conversion funnel, no ROI/attribution. The single point of contact with "where patients come from" is a **manual free-text/dropdown Referral field** and a bring-your-own **Google Analytics** tag on the booking page. That is the gap our product fills.

---

## 1. Billing / Invoicing / Payments — what Jane does

### Core billing
- Full invoicing engine: create invoices (with or without an appointment), edit/override/delete invoices, partial pay, partial refund, credit memos, patient credit, invoice reversals, reconciliation dates, sales tax, multi-currency per location. [V] https://jane.app/guide/creating-an-invoice , https://jane.app/guide/setting-up-your-billing-settings
- Per-unit billing (mileage, Botox units, materials). [V] https://jane.app/guide/billing-for-per-unit-mileage-botox-materials-used-reporting-etc
- Family/related-client shared-card payments; supervising-therapist on receipts. [V] https://jane.app/guide/family-profiles-payments-with-shared-credit-cards
- Accrual (invoiced) vs cash (collected) accounting toggle runs through every financial report. [V] https://jane.app/guide/reporting-faqs
- **No native accounting-software integration** — explicitly "Is Jane integrated with QuickBooks/Xero?" is a top FAQ; answer is export-only (Excel/CSV). [V] https://jane.app/guide/reporting-faqs

### Jane Payments (their own integrated processor, built on Stripe)
- In-house payment processing: online checkout, card-on-file, terminal (in-person debit/credit), instant payouts, payouts to each practitioner's own bank account. [V] https://jane.app/guide/start-here-what-makes-jane-payments-so-special , https://jane.app/guide/setting-up-and-using-jane-payments
- **"Flat, predictable rates. No hidden fees."** [M] (no rate quoted in guide). [V] https://jane.app/guide/start-here-what-makes-jane-payments-so-special
- Terminal hardware sold: **CA $279 / US $239 / UK £179** + tax/shipping; one terminal per location, shared across practitioners. [V] https://jane.app/guide/jane-payments-terminal
- Available CA / US / UK only. Card-on-file used to "reduce no-shows." [V] https://jane.app/guide/jane-payments-terminal
- Stripe is the backend — Canadian identity-verification FAQs reference Stripe directly. [V] https://jane.app/guide/jane-payments-stripe-canadian-verification-faqs-2024

---

## 2. Insurance / Claims — including Canadian direct billing

Insurance is a **paid add-on** to the Practice or Thrive plan (not in base). Without it the "Insurers" tab is hidden. [V] https://jane.app/guide/missing-insurers-tab-upgrading-from-the-base-plan-to-the-insurance-plan

### Canada — TELUS eClaims integration (the key Canadian direct-billing rail) [V] https://jane.app/guide/telus-eclaims-setting-up-your-telus-eclaims-integration
- Submit claims + run eligibility checks to a large insurer list **directly inside Jane**: Canada Life, Canada Life-PSHCP, Beneva, Belairdirect (formerly Johnson), Alberta Blue Cross (out-of-AB practitioners), AGA, BPA, Chambers of Commerce Group, and more.
- Supports solo practitioner, independent provider, organization, and multi-licensed provider account structures.
- **Payment-preference behavior (important for our model):** by default Jane **auto-records a payment the moment a claim is approved/submitted — NOT when the deposit actually arrives** from the insurer. Optional "Record Payments Manually" checkbox defers recording until the insurer statement/direct-deposit lands. [V] (same url, Payment Preferences section)
- Manual claim path also exists: "Working with Claim Submissions and Online Insurer Portals," "Launching an Insurer Portal," handling insurer-issued reimbursement credit cards. [V] https://jane.app/guide/working-with-claim-submissions-and-online-insurer-portals

### USA — Claim.MD clearinghouse integration [V] https://jane.app/guide/jane-s-clearinghouse-integration , https://jane.app/guide/integrated-claims-with-claim-md
- Full revenue-cycle inside Jane via Claim.MD: eligibility checks, claim submission (837), acknowledgements/rejections (277), insurer remittances/ERA (835), secondary-claim workflow, CPT & diagnosis (ICD) codes on charts.
- Jane users get **10% off Claim.MD's monthly subscription**. [V] (Claim.MD is a separately-paid third party.)
- US-specific insurance reporting exists (claims/AR by payer). [V] https://jane.app/guide/insurance-specific-reporting-us

### UK
- Separate UK insurance-billing guide category. [V] https://jane.app/guide/category/uk-insurance-billing

**[E]** Insurance is operational (submit/track/get-paid) only. Nothing connects insured-visit volume to acquisition; "Insurance Policies Report" is a policy/coverage list, not analytics.

---

## 3. Packages, Memberships & Gift Cards — recurring revenue handling

All on the **Thrive plan** (or legacy Base/Insurance plans). [V] https://jane.app/guide/packages-memberships-hub

- **Packages** = one-time prepaid bundle of N sessions ("punches"), time-limited, discounted, redeemable for treatments/classes (not products). Sold admin or online ("Online Package Sales"). Variants: insurance-friendly (pay upfront, submit receipt), payment-plan/installments. [V] https://jane.app/guide/setting-up-a-package , https://jane.app/guide/selling-redeeming-and-refunding-a-package
- **Memberships** = recurring billing (weekly/monthly/yearly), e.g. "$99/month" med-aesthetics. This is Jane's true recurring-revenue primitive. [V] https://jane.app/guide/packages-memberships-hub
- **Wallet / bank-style** balances built on the **Gift Card** feature (e.g. "BotoxBank-Madison" loaded with $2,000, redeemed against products/units). Recurring top-ups must be charged manually. [V] https://jane.app/guide/how-to-manage-a-wallet-or-bank-style-package-and-membership
- **Gift cards**: sold admin or online from the booking page ($10 min, configurable load/purchase caps); framed as a way to "attract new patients." [V] https://jane.app/guide/working-with-online-gift-cards
- **Compensation**: package/membership commission decoupled from per-session price — pay practitioner either upfront on sale or per redemption; 100% commission value set per eligible item via income categories. [V] https://jane.app/guide/understanding-package-membership-compensation
- Package/Membership reports track sales & redemptions. [V] https://jane.app/guide/package-membership-reports (linked from hub)

---

## 4. REPORTS / ANALYTICS — full enumeration (the important part)

Reports tab is split: **Billing reports** (all staff), plus **Patients reports** and **Appointment reports** (clinic owners / Full Access only). "Jane has an impeccable memory… reports give insight about patients, appointments and billing." [V] https://jane.app/guide/reports-overview

### Complete report inventory (from the Reporting category index) [V] https://jane.app/guide/category/reporting
**Financial / billing:**
- Sales Report — every invoiced item; filter by location, staff, **income category**, date, payment status; accrual vs cash. [V] https://jane.app/guide/sales-report
- Billing Summary Report — invoiced vs applied vs transactions overview. [V] https://jane.app/guide/billing-summary-report
- Accounts Receivable (AR) Report — patients & insurers with money owing. [V] https://jane.app/guide/accounts-receivable-report
- Applied & Unapplied Payments Report. [V] https://jane.app/guide/applied-unapplied-payments-report
- Cash Reconciliation Report; Transaction/"Cash Out" Report; Day End Procedures. [V] https://jane.app/guide/cash-reconciliation-report , https://jane.app/guide/transaction-or-cash-out-report
- Compensation Report (practitioner pay / income categories). [V] https://jane.app/guide/compensation-report
- Inventory Report / product price lists / retail value. [V] https://jane.app/guide/the-inventory-report-product-price-lists-and-calculating-retail-value
- Product Performance Report — # sessions completed + # products sold + product **profit** (sale − cost), filter Products/Appointments/Packages&Memberships. [V] https://jane.app/guide/product-performance-report
- Employee/Contractor tax reporting; Reconciliation Date / AR-between-periods tooling. [V]
- Jane Payments report family: Transactions, Monthly Processing, Payments/Refunds/Fees, Payouts. [V] https://jane.app/guide/your-jane-payments-reports

**Patients / appointments / operational:**
- Patient List Report — full roster, contact info, **Created Date** filter, medical alerts (export adds columns). [V] https://jane.app/guide/patients-reports
- Patient Retention Report — New / Returning / Total patients, Total visits, **% Returning**, % repeat visits, **per staff member**. [V] https://jane.app/guide/patient-retention-report
- Appointments Report — bookings, states (Booked Online, Arrived, No Show, Cancelled, Rescheduled). [V] https://jane.app/guide/appointments-reports
- Hours Scheduled / Booked Report (schedule utilization). [V] https://jane.app/guide/hours-scheduled-booked-report
- Unscheduled Patient Report (lapsed patients who haven't rebooked). [V] https://jane.app/guide/unscheduled-patient-report
- Insurance Policies Report; US insurance-specific reporting (by payer). [V]
- **Referral Report** (closest thing to "source" — see §5). [V] https://jane.app/guide/referral-report
- **Ratings & Reviews Report** (patient-feedback summary, Thrive plan). [V] https://jane.app/guide/review-your-ratings-report-for-clinic-owners-practitioners
- **Dashboard** (Settings landing page): count of **arrived first visits** ("new patients") by date range / by practitioner. [V] https://jane.app/guide/reporting-on-new-patients

### Reporting FAQ — the 13 questions clinics actually ask [V] https://jane.app/guide/reporting-faqs
All 13 are reconciliation/accounting/cash-flow questions (invoiced vs applied, accrual vs cash, AR reconciliation, QuickBooks/Xero integration, no-show list, total-collected-to-date, patients-with-credit, lapsed-patient list). **Zero relate to marketing, channel, source, ad spend, or acquisition cost.** This confirms the audience and the product boundary.

---

## 5. THE ATTRIBUTION / MARKETING-ROI GAP — explicitly confirmed

**Jane offers NO new-patient-by-channel, marketing-ROI, cost-per-patient, ad-spend, lead-conversion, or attribution reporting. Confirmed across the entire reporting suite.** What exists instead:

1. **Referral Report — the only "source" surface, and it is manual & channel-blind.** [V] https://jane.app/guide/referral-report
   - Breaks revenue + unique-patient count **by referral source**, and by which staff member the patient was referred to ("Anyone / The Clinic / A Staff Member").
   - Source values come from a **manually-curated dropdown** (Settings > Language > Referral Sources) the patient picks at online booking, **or free-typed** by staff (default "Other" = open text box). No structured channel taxonomy; nothing for paid vs organic; **no ad cost, no spend, no ROI, no conversion rate** — purely "$ and # of patients per whatever label someone typed."
   - **[E]** This is self-reported, low-fidelity, inconsistently filled, and has no concept of cost — so it cannot produce ROI or cost-per-acquisition. It's a tally, not attribution.

2. **"Reporting on New Patients" — counts, never sources.** [V] https://jane.app/guide/reporting-on-new-patients
   - Three options offered: Patient List (Created-Date filter — and the guide *warns* created-date ≠ first appointment), the Settings **Dashboard** (count of arrived first visits, by clinic or practitioner), and Product Performance (# initial-visit treatments "sold"). **None attribute the new patient to any acquisition channel.**

3. **Patient Retention Report — internal rebooking behavior, not acquisition.** [V] https://jane.app/guide/patient-retention-report. Measures New/Returning/% Returning **per practitioner**. Answers "are patients rebooking?" — never "where did they come from / what did they cost?"

4. **Google Analytics — bring-your-own, and it's outside Jane.** [V] https://jane.app/guide/google-analytics
   - Jane only lets you paste a **GA4 Measurement ID** to track **online-booking-page** pageviews and fire an `appointment_booked` key event. This is the clinic's own GA property, on the booking site only; **Jane surfaces none of it inside Jane**, ties none of it to revenue, and there is no ad-platform/spend integration. Channel/ROI analysis (if any) happens entirely in the clinic's separate GA account.

5. **Patient-feedback / Ratings & Reviews** [V] https://jane.app/guide/setting-up-ratings-and-reviews , https://jane.app/guide/category/marketing-tools — Jane's "marketing tools" category is **reputation only** (collect ratings, push to Google Reviews). No acquisition analytics; reinforces that "marketing" to Jane = reviews, not measured growth.

### What reporting IS vs ISN'T (quote-level)
- **IS:** "Reports can be used to gain insight about your clinic's patients, appointments and billing… particularly useful for tracking cash flow, showing taxes invoiced or collected, reconciling your daily POS cash-out, and calculating your clinic's payroll." [V] reports-overview
- **IS (source-adjacent, manual):** "This report will break down the revenue **by source**, as well as provide the total number of unique patients… this list of referral options can be edited by a Full Access User under Settings > Language > Referral Sources." [V] referral-report
- **ISN'T:** No report references ad platforms, campaigns, spend, CAC/cost-per-patient, lead, conversion funnel, or channel attribution anywhere in the 772-page guide corpus. The retention report even disclaims: "Data is only as good as the lens through which you view it" — i.e., interpretation is left entirely to the human; Jane provides counts, not analysis.

---

## 6. Implications for our clinic-native acquisition CRM
- **Don't rebuild:** invoicing, payment processing (Jane Payments/Stripe), TELUS eClaims & Claim.MD direct billing, packages/memberships/gift cards, AR/cash reconciliation, compensation, charting. Jane owns this deeply. **[E]**
- **The wedge is wide open:** new-patient acquisition by *channel*, ad-spend ingestion (Meta/Google), cost-per-new-patient, lead→booking→first-visit→retained-patient funnel, and ROI/LTV by source. Jane's only inputs we can leverage: the manual Referral field, the booking-page GA event (`appointment_booked`), arrived-first-visit counts, and revenue per patient — all of which we'd ingest and *actually attribute* to spend. **[E]**
- Natural integration seam: read Jane's first-visit/revenue/referral data + the clinic's ad accounts; produce the cost-per-patient and channel-ROI report Jane structurally cannot. **[E]**
