---
id: ca-on-insurance-direct-billing-2026
layer: regional
topic: insurance
region: CA
content_date: "2026"
captured_at: "2026-06-28"
freshness: volatile
review_by: "2027-01"
source: "https://plus.telushealth.co/page/eclaims/discover/ (TELUS Health eClaims); https://jane.app/guide/working-with-claim-submissions-and-online-insurer-portals (Jane App insurer-portal guide); https://companyonapp.com/direct-billing-for-massage-therapists-in-canada-what-to-know/ (CompanyOn, marketing blog); https://www.canadalife.com/insurance/workplace-benefits/eclaims-provider-listing.html (Canada Life provider list)"
confidence: V
status: active
supersedes: null
superseded_by: null
---

# Private-insurer direct billing — rails & what "we direct-bill" means

These are **national private extended-health insurers** (region `CA`), not the provincial/government rails — see the sibling `provincial-rails.md` for OHIP / WSIB. Most Ontario allied-health clinics direct-bill through one or more of the portals below. Confidence is per-line.

---

## 🔒 LOCKED AGENT RULE — never quote a patient's coverage amount

The voice agent **NEVER tells a patient how much their plan covers** (no percentages, no dollar maximums, no "you have $500 left"). The clinic does **not** see, and cannot promise, the patient's own benefit limits — only the patient (or their insurer) knows those, and the real figure is only returned by the portal **at the moment of claim submission**.

The agent's job is to confirm the **service**, not the coverage:

> "Yes, we can submit the claim directly to your insurer for you — you'll just want to confirm your own coverage and any remaining balance with your benefits plan."

- ✅ Allowed: "We direct-bill to [insurer] through TELUS eClaims." / "We can submit on your behalf." / "Anything not covered, you'd pay as a co-pay."
- ❌ Forbidden: "Your plan covers 80%." / "You have coverage left." / "It'll be free for you." (Even TELUS markets eClaims as "you may not have to pay out of pocket" — *may*; the agent must not upgrade that to a promise.)

---

## What "we direct-bill" means for the patient (confidence: V)

Direct billing = the **clinic submits the insurance claim on the patient's behalf** through an insurer portal, so the patient doesn't pay the full fee up front and then chase a reimbursement. Same idea as the pharmacy or dentist. Mechanically (Jane App, CompanyOn):

1. **Intake** — clinic collects insurer, policy/group number, member ID, and the patient's **explicit consent to bill on their behalf**.
2. **Treatment** delivered.
3. **Submission** — clinic logs into the portal (e.g. TELUS eClaims) and submits service codes, duration, cost.
4. **Adjudication** — the portal returns, *in real time*, how much the insurer pays vs. the patient's **co-pay** (the uncovered remainder). **This number is per-patient and only appears here — which is exactly why the agent can't quote it in advance.**
5. **Collection** — patient pays only the co-pay (often $0); insurer deposits the covered portion to the clinic a few days later. A fully/partly covered visit splits into **two invoices** (patient + insurer); a $0 patient invoice is normal.

TELUS markets eClaims as **free** to both patient and provider — no fee, no need to be a TELUS customer. (`confidence: M` — insurer marketing.)

---

## Direct-billing rails (which insurers, via which portal)

### TELUS Health eClaims — the dominant rail (confidence: V)
One registration reaches **30+ insurers / the majority of privately insured Canadians**. Insurers confirmed routing through eClaims include:

- **Canada Life** (now amalgamated with Great-West Life & London Life), **Manulife**, **Desjardins**, **ClaimSecure**, **Beneva**, **Equitable Life**, **Industrial Alliance (iA)**, **Alberta Blue Cross**, plus many group/TPA plans (Johnston Group, Cowan, Coughlin, Maximum Benefit, Simply Benefits, GMS, PSHCP, etc.).
- Eligible allied-health professions span chiropractic, physiotherapy, optometry/opticians, psychology, podiatry **Canada-wide**, and massage therapy (RMT), acupuncture, naturopathic, chiropody, physical-rehab therapists **in select regions**.
- ⚠️ **Feature/insurer support varies** — not every participating insurer supports every profession on eClaims.

### Sun Life — its OWN portal (Lumino / Sun Life Connect) (confidence: V)
**Sun Life left TELUS eClaims as of Jan 30, 2022** and now accepts provider claims **only through its own portal** (connect.sunlife.ca). So "we direct-bill Sun Life" = a separate Sun Life registration, **not** via eClaims. (Common front-desk trap — keep it on the rail list mentally but flag the separate login.)

### ProviderConnect (providerconnect.ca) (confidence: V)
The rail for **Green Shield Canada (GSC)**, **Empire Life**, **SSQ Insurance**, and **MÉDIC Construction**. Note: **Green Shield is on ProviderConnect, not TELUS eClaims** — another common mix-up.

### Medavie Blue Cross (secure.medavie.bluecross.ca) (confidence: V)
Medavie's own portal. Important for **Veterans Affairs Canada (VAC)** and **RCMP/DVA** provider claims (government provider services run through Medavie). Distinct from other "Blue Cross" brands.

### Blue Cross is NOT one company (confidence: V)
"Blue Cross" is a family of **regionally separate** organizations with **separate portals**:
- **Medavie Blue Cross** (Atlantic/Ontario/Quebec + VAC/RCMP) — Medavie portal.
- **Pacific Blue Cross** (BC) — its own ProviderNet portal (BC-specific; not relevant to most ON clinics).
- **Alberta Blue Cross** — reachable via TELUS eClaims.
The agent should say "Blue Cross" only after confirming **which** Blue Cross.

### Canada Life — Provider/eClaims listing (confidence: V)
Canada Life maintains a provider list for eClaims and routes through TELUS eClaims. Provider-side claims-options line: **1-866-240-7492**. Canada Life's own note mirrors our locked rule: being listed "does **not guarantee** claims — still subject to the plan's specific coverage and eligibility." (i.e. coverage is never guaranteed in advance — reinforce: agent doesn't promise amounts.)

---

## Coordination of Benefits (COB) — the basics (confidence: V)

When a patient is covered by **more than one plan** (e.g. their own + a spouse's), claims are coordinated so the combined payout doesn't exceed the cost:

- **Primary plan** is billed first; the **remaining balance** is then submitted to the **secondary plan**.
- The secondary claim needs the **primary's explanation/receipt** — get the documentation exact or the secondary claim is **rejected**.
- A child's claims typically go to the parent whose **birthday falls earlier in the calendar year** first (standard COB "birthday rule" — `confidence: E`, common industry practice; verify per insurer).
- For the agent: it's fine to say **"we can coordinate billing across both your plans"** — but still **never quote what either plan covers**.

---

## Front-desk gotchas (confidence: V unless noted)

- **Sun Life ≠ eClaims** (own portal since 2022). **Green Shield ≠ eClaims** (ProviderConnect). **VAC/RCMP** = Medavie.
- **Registration is required per insurer/portal** before a clinic can direct-bill; many allow online registration. A clinic offering direct billing has done this for *specific* insurers — the agent should confirm the clinic's actual roster rather than assume "we bill everyone."
- **Provider numbers** come from the practitioner's provincial college (e.g. CMTO for Ontario RMTs) before portal registration. (`confidence: V`)
- **Pending claims** — insurers sometimes hold a claim for manual review; coverage isn't always instant. One more reason the agent can't promise an amount on the phone.
- **WSIB / motor-vehicle (HCAI) / ICBC** are separate third-party rails (see provincial-rails.md); in Ontario, **WSIB submits through TELUS — but that is *not* TELUS eClaims**. Don't conflate.

---

## Source honesty

- TELUS eClaims, Jane App, and Canada Life pages are **substantive and verifiable** (`V`) for rail mapping.
- CompanyOn is a **practice-management vendor marketing blog** (`M`) — used only for the workflow/COB framing it states plainly; its product pitch is ignored.
- The Canada Life provider-listing page was **thin** (mostly a "find a provider" map shell, ~1.5KB) — it confirmed the provider line + the "claims not guaranteed" note but little else; re-target a richer Canada Life Provider Connect page if deeper detail is needed.
