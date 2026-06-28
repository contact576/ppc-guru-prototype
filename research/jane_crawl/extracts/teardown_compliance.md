# Jane App — Compliance & Trust Teardown

**Source:** `buckets/compliance.jsonl` (10 pages: `/legal/*` + `/security-and-trust`)
**Method:** Deep-read all 10 pages.
**Why it matters:** We are building a clinic-native CRM handling Canadian patient contact data. Jane is the dominant incumbent EMR/PM in this space (physio/chiro/massage, esp. Canada). Their stated compliance posture is our benchmark.

Honesty tags: **[V]** = verifiable from a Jane page (url given) · **[M]** = marketing claim · **[E]** = our inference.

---

## 1. Data residency / hosting — THE MOAT QUESTION

**Headline answer: Jane does NOT guarantee "data stays in Canada." It offers regional data centres (subscriber picks one at sign-up), defaults Canadian-region clinics to a Canadian DC, BUT several features deliberately ship data to the U.S.** This is the crack in their residency story.

- **[V]** Regional data centres in **Canada, US, UK, Australia** ("though this may change from time to time"). Data is stored "in the regional data centre for the location chosen by the Subscriber during the sign-up process." If no DC exists for a region, data defaults to the **Canadian** data centre. — `/legal/privacy-notice` (Storage Location)
- **[V] U.S. processing carve-outs (the honest fine print most clinics miss):**
  - **SMS & Secure Message communications** — "We use US-based service providers… Patient Data contained in appointment reminders will be processed and may be stored temporarily in the United States."
  - **Telehealth** — provider uses "a central data centre; therefore, we cannot guarantee that the processing of your data… may remain within your chosen region" (limited: IP address only, no media/chat stored).
  - **AI Scribe** — "We use a US-based service provider… which requires temporary data processing in the U.S." (e.g. converting conversation text → structured clinical notes).
  — `/legal/privacy-notice` (Storage Location)
- **[V]** International Transfers section: "Personal information may be transferred to and processed in **Canada and the United States.**" Safeguards listed: EU adequacy decision, EU-US/Swiss-US/UK Data Privacy Framework, Standard Contractual Clauses, IDTA, binding corporate rules. — `/legal/privacy-notice`
- **[V]** Cloud provider is **NOT named** anywhere in the legal/trust pages. They say "state-of-the-art data centres with appropriate security and compliance certifications, such as ISO-27001, SOC 2." No AWS/Azure/GCP region named. (A separate "Cloud security white paper" is linked from `/security-and-trust` but is outside this bucket.) — `/legal/privacy-notice` (Security)
- **[V]** Company is Canadian: **Jane Software Inc., 500-138 13th St E, North Vancouver, BC**; governing law = **British Columbia**; services provided "from its offices in Vancouver, Canada." — `/legal/privacy-notice`, `/legal/terms-of-use`

> **[E] Strategic read for us:** Jane's "Canadian residency" is real for the *core EMR record* but **leaks at the edges — SMS reminders, telehealth, and AI all touch the U.S.** A CRM that does patient contact + messaging (exactly the SMS-reminder surface Jane sends to the U.S.) can credibly claim **end-to-end Canadian residency including notifications** as a differentiator. That is a structural, copy-resistant moat *if* we keep SMS/AI on Canadian infrastructure — the one thing Jane explicitly cannot promise today.

---

## 2. Compliance frameworks, certifications, encryption, breach

- **[V][M]** **SOC 2 Type 2** and **PCI DSS** compliant. SOC 2 = five Trust Services Categories (security, availability, processing integrity, confidentiality, privacy). AICPA SOC badge displayed. — `/security-and-trust`
- **[V]** **PCI DSS** via Jane Payments: "we don't actually store, transmit, or process any cardholder data" — handled by a PCI-compliant payment processor (Stripe; tokenized). Jane only receives a token. — `/security-and-trust`, `/legal/privacy-notice` (Billing Information)
- **[V]** Data centres carry **ISO-27001, SOC 2** certifications. — `/legal/privacy-notice` (Security)
- **PHIPA / HIPAA / PIPEDA:** **[E] Notably, NONE of these acronyms appear by name on any of the 10 legal/trust pages.** Jane instead uses framework-neutral role language: subscribers are the "**health information custodian / covered entity / trustee / controller**," Jane is the "**agent / business associate / service provider / processor.**" The only named statutes are **PIPEDA, GDPR, UK GDPR, ePrivacy** (cookie page) and **GDPR** (DPA + privacy legal-basis). — `/legal/cookie-policy`, `/legal/privacy-notice`, `/legal/data-processing-addendum`
  - **[E]** "Covered entity / business associate" is HIPAA vocabulary and "health information custodian" is PHIPA vocabulary — so Jane signals HIPAA/PHIPA readiness *by role-mapping* but stops short of a flat "we are HIPAA/PHIPA compliant" claim. The compliance burden is explicitly pushed onto the clinic (the custodian/controller).
- **[V] Encryption:** "SSL/TLS encryption," "industry standard security controls such as encryption and an SSL certificate… transmitted over a secured connection." No explicit at-rest encryption spec or key-management detail on these pages. — `/legal/privacy-notice` (Security)
- **[V] Breach handling:**
  - Terms: Jane notifies affected Subscribers "without undue delay" on a Subscriber-Data breach, reports corrective action, cooperates on mitigation. Jane notifies **Patients directly** only for Patient Authentication Data breaches. — `/legal/terms-of-use` (Security)
  - DPA (GDPR): notify Subscriber "without undue delay after becoming aware of a breach… and take all steps reasonably within Jane's control to mitigate and remediate." — `/legal/data-processing-addendum`
- **[V] Contacts:** privacy@jane.app / security@jane.app; **Privacy Officer / DPO = Catharine Martin.** Public Ethics & Compliance reporting form. — `/security-and-trust`, `/legal/privacy-notice`

---

## 3. Privacy / Terms — data ownership, obligations, what Jane does with data

- **[V] Data ownership = the CLINIC, unambiguously.** "Each Subscriber retains ownership and control of its Patient Data and all information collected, entered, created or otherwise provided by the Subscriber" (= "Subscriber Data"). The clinic decides what to collect, who accesses it, how long to keep it, deletion basis, and transfer of custody. — `/legal/terms-of-use` (Subscriber Data)
- **[V] Jane = processor only.** "Jane will only access Subscriber Data if authorized… at the request of a Subscriber… to prevent or address technical problems… to investigate or prevent fraud; or if required by law." DPA confirms Subscriber = **Controller**, Jane = **Processor**. — `/legal/terms-of-use`, `/legal/data-processing-addendum`
- **[V] Important nuance — Patient Authentication Data is the ONE thing Jane controls.** When a patient creates a single Jane ID to book across multiple clinics, **Jane is the "controller / personal information custodian" of those login credentials** (not the clinic). Jane will NOT disclose Patient Auth Data to any subscriber without the patient's consent. Jane explicitly notes it is NOT a "covered entity" for this data (it's not PHI). — `/legal/privacy-notice` (Patient Data), `/legal/terms-of-use`
- **[V] Patient-facing model:** "**your clinic or practitioner controls your patient information**" — patients are directed to their clinic for record questions; Jane only owns the Jane ID auth layer. — `/legal/privacy-notice` (Notice to Patients)
- **[V] What Jane does with data:** does NOT sell or trade personal information; collects "only the minimum… needed." Uses contact info for service + marketing (opt-out available). May build **anonymized/aggregated** analytics from Subscriber Data for product improvement, and may share *aggregated* analysis. — `/legal/privacy-notice`
- **[V] Sub-processors:** NOT enumerated on the page — pointer to an external **Drata trust portal** (`app.drata.com/trust/2539fba9-…`) for the Subscriber-Data sub-processor list. Named partners in-text: **Stripe** (payments), **Google** (Calendar / social sign-in), plus US-based SMS, telehealth, and AI-Scribe providers (unnamed). DPA: Jane stays liable for sub-processor failures and "will inform the Subscriber of any intended changes to its sub-processors." — `/legal/privacy-notice`, `/legal/data-processing-addendum`
- **[V] Google data:** Google Calendar = metadata only (no titles/attendees); "Google Workspace APIs are not used to develop, improve, or train generalized AI and/or Machine Learning models." — `/legal/privacy-notice`
- **[V] Retention / export:** Subscriber Data not deleted while subscription active (to support clinic record-keeping law). Subscribers can export anytime; **one complimentary batch chart export per practitioner** (extras may cost). After termination, account deactivated, data isolated + retained at Jane's discretion for possible reactivation. Patients can self-delete account + saved cards via patient portal. — `/legal/terms-of-use` (Data Retention), `/legal/privacy-notice` (Storage Period)
- **[V] Liability cap (aggressive):** total liability capped at **fees paid in the trailing 3 months, or $100** if no payment. No indirect/consequential damages. Services "AS IS," no warranty. Binding arbitration in Vancouver (ICDR Canada), class-action waiver, 30-day opt-out. — `/legal/terms-of-use` (Legal Limits; Disputes)

> **[E] For us:** A clinic-grade liability cap of "3 months of fees or $100" on a system holding PHI is a thin promise — worth noting as a trust gap an upstart could beat with stronger breach/SLA commitments.

---

## 4. Security features (2FA, access control, audit, backups)

- **[V] Account access controls** per user; **screen blurring** (privacy from bystanders); **sign-and-lock charts** (prevent accidental chart overwrite). — `/legal/terms-of-use` (Security Features)
- **[V] Password model:** subscriber-set passwords; **Jane cannot access or identify your password**; reset only via verified email/phone. — `/legal/privacy-notice` (Security)
- **[V]** Personnel sign confidentiality agreements + periodic training; access limited to business-need-to-know. — `/legal/privacy-notice`, `/legal/terms-of-use`
- **[E] NOT mentioned on these pages:** explicit **2FA/MFA**, **audit logs**, **backup/disaster-recovery** specifics, at-rest encryption detail. (Likely covered in the off-bucket Guide: "List of security features," "Security FAQ," "Cloud security white paper" — all linked from `/security-and-trust` but not in this crawl.) — *gap to verify in another bucket.*
- **[V] Availability SLA:** **99% uptime/calendar month**, measured by independent third party (status.janeapp.com); **25% next-month credit** if missed; credit is sole remedy; excludes <10min blips, scheduled maintenance, external factors. (SLA last updated **2019**.) — `/legal/service-level-agreement`

---

## 5. Integrations / API / third-party data sharing

- **[V] Risk-based partner gating:** "We take a risk-based approach to evaluating partners that may access, process, or store personal health information (PHI)." Partners wanting to integrate must read Jane's "ground rules." — `/legal/partner-security-at-jane` (very thin stub page, 389 chars)
- **[V] Integrations disclaim control:** Jane reviews third-party integrations "with the goal of helping them maintain a Jane standard" but "does not maintain control over these third-party environments." Users of integrations (e.g. Stripe) must accept the third party's own terms/privacy. — `/legal/privacy-notice` (Integrations)
- **[V] Cookies / ad-tech third parties:** Google Analytics, DataDog, Rudderstack (analytics); Facebook, Google, LinkedIn (marketing); Enzuzo + Stripe (essential). Marketing cookies opt-in in EEA/UK, opt-out-default elsewhere. Legal basis cites **PIPEDA, GDPR, UK GDPR, ePrivacy.** — `/legal/cookie-policy`
- **[E]** No public REST/API documentation in this bucket; the integration story is "approved partners + named SaaS integrations," not an open API. Sub-processor transparency is outsourced to Drata.

---

## Sharpest takeaways for our build

1. **Residency is Jane's exploitable seam.** Core EMR data can be Canadian, but **SMS appointment reminders, telehealth, and AI Scribe explicitly process in the U.S.** A Canadian-native CRM that keeps *messaging + AI* on Canadian soil can claim residency Jane can't. **[V]**+**[E]**
2. **Jane never says "HIPAA/PHIPA compliant" outright** — it role-maps (custodian/processor) and pushes compliance onto the clinic, while certifying SOC 2 Type 2 + PCI DSS + ISO-27001 (data centres). Match the certs; out-promise on residency + breach terms. **[E]**
3. **Clinic owns the data; Jane owns only the cross-clinic Jane-ID login.** Clean processor posture, but a weak **$100 / 3-months liability cap** and a 2019-vintage 99% SLA are soft spots to beat. **[V]**

*Verify-elsewhere gaps:* 2FA/MFA, audit logs, backups, at-rest encryption, named cloud provider — all live in the off-bucket Guide / white paper, not the legal pages.
