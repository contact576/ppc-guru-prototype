---
id: ca-on-regulatory-advertising-consent-records-2026
layer: regional
topic: regulatory
region: CA-ON
content_date: "2026"
captured_at: "2026-06-28"
freshness: annual
review_by: "2027-06"
source: "https://www.cmto.com/ (College of Massage Therapists of Ontario); https://www.collegept.org/ (College of Physiotherapists of Ontario); https://www.cco.on.ca/ (College of Chiropractors of Ontario)"
confidence: V
status: active
supersedes: null
superseded_by: null
---

# Ontario allied-health regulatory rules that affect OUR voice agent (consent, records, advertising)

**Scope of this crawl (be honest):** The captured dataset was **heavily weighted to CMTO (massage therapy)**. The College of Physiotherapists (collegept.org) and College of Chiropractors (cco.on.ca) only returned JS-rendered **landing pages** — no standards-of-practice detail. So the *verifiable* policy below is **CMTO-specific**; physiotherapy and chiropractic rules are flagged as **not yet captured** and must be re-fetched from the colleges' "Standards" sections before we rely on them. (`confidence: E` items are our reasonable inference from the shared Ontario `Regulated Health Professions Act, 1991` framework, not a scraped college rule.)

All three colleges operate under the same provincial umbrella: the **Regulated Health Professions Act, 1991 (RHPA)** and the **Personal Health Information Protection Act (PHIPA)**. That shared backbone lets us generalise the consent/records duties below to PT and chiro as a working assumption — but advertising/testimonial rules are college-specific and were NOT captured for PT/chiro. (`confidence: E`)

---

## 1. Consent — what the front desk / voice agent must respect

- **Informed consent is a process, not a form.** A CMTO RMT must obtain informed consent before any assessment or treatment; the client may give it **orally or in writing**, may ask questions, and may **withdraw consent at any time**. (CMTO, "What to Expect When You See an RMT". `confidence: V`)
- **Clients may decline recording / contact.** Consent governs how personal health information is collected and used; "this information is confidential and cannot be shared without your consent." For OUR product this means: **before recording a call or contacting a patient about their care, the agent must have/confirm consent**, and must honour a withdrawal. (Derived from CMTO consent + PHIPA. `confidence: E`)
- **Sensitive-area written consent (CMTO-specific):** treatment of breasts, front chest wall, upper inner thighs, or gluteal muscles requires **written consent each time** (gluteal: written at start of a treatment plan, then verbal within that plan). Not directly a voice-agent rule, but the agent must **not** book/confirm such treatment as if a generic verbal "yes" covers it. (CMTO. `confidence: V`)
- **Family/close-relationship treatment** is discouraged; **romantic/sexual relationship with a current client is sexual abuse** under the RHPA regardless of "consent," and is prohibited for ≥1 year after the therapeutic relationship ends. The agent should never frame the RMT–client relationship in personal terms. (CMTO, RHPA. `confidence: V`)

## 2. Record-keeping & privacy

- **Health records are confidential and patient-accessible.** Clients have the right to **see their health record or have it transferred** to another health professional at any time, for any reason. The voice agent must route such requests to the clinic, not refuse them. (CMTO "What to Expect". `confidence: V`)
- **PHIPA privacy-breach duty:** an RMT who is a health information custodian **must report a privacy breach to the Information and Privacy Commissioner of Ontario**. Implication for us: any call data / recordings the agent stores is PHI under PHIPA — treat a leak as a reportable breach. (CMTO "File a Mandatory Report". `confidence: V`)
- **"Comprehensive records" is an explicit Standard of Practice** and a QA-assessed competency (CMTO STRiVE 2026 selected the *Privacy and Confidentiality* and *Collecting Personal Health Information from Clients* standards). Records must be complete and contemporaneous. (CMTO STRiVE. `confidence: V`)
- Massage Therapy / RMT / Registered Massage Therapist are **legally protected titles** — only CMTO registrants may use them. The agent must not describe an unregistered provider as an "RMT." (CMTO "How We Can Help". `confidence: V`)

## 3. Advertising / marketing standards — the gap to close

- **NOT captured for any of the three colleges.** No advertising standard, testimonial rule, or claims-limit page was in this crawl. Do **not** assert "testimonials are allowed/banned" for our clients on this basis. (`confidence: E` — gap flagged.)
- **Working inference (verify before use):** Ontario health colleges generally prohibit **false, misleading, or unverifiable claims** and restrict or ban **patient testimonials** (because a vulnerable client cannot give true, undue-influence-free endorsement — the same logic CMTO applies to consent). For a marketing-agency product this is the single most important rule to confirm per college before running testimonial-based ad creative for PT/chiro/RMT clients. (`confidence: E`)
- **Action:** re-fetch the explicit advertising/marketing standard from each college:
  - CMTO → "Standards and Rules" / Code of Ethics (the standards index was captured but is just a link hub).
  - CPO (collegept.org) → Standards of Practice → Advertising.
  - CCO (cco.on.ca) → Standards of Practice / Policies → Advertising.

## 4. Mandatory reporting (context the agent should never trigger or obstruct)

RMTs/employers must report suspected sexual abuse, child/elder abuse, privacy breaches, and certain offences/findings to CMTO within set timelines. The agent should escalate, never gatekeep, anything touching these. (CMTO "File a Mandatory Report". `confidence: V`)
