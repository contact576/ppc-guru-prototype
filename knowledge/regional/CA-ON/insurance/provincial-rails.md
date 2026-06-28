---
id: ca-on-insurance-provincial-rails-2026
layer: regional
topic: insurance
region: CA-ON
content_date: "2026"
captured_at: "2026-06-28"
freshness: volatile
review_by: "2027-01"
source: "https://www.ontario.ca/page/get-physiotherapy (OHIP-funded physiotherapy); https://www.wsib.ca/en/health-professionals (WSIB — page returned 404 at capture)"
confidence: V
status: active
supersedes: null
superseded_by: null
---

# Ontario provincial rails — OHIP-funded physiotherapy & WSIB (front-desk basics)

**Honesty flag:** **OHIP physiotherapy is well-captured** (ontario.ca "Get physiotherapy"). **WSIB is a gap** — the crawled `wsib.ca/en/health-professionals` URL returned a **404 / "page not found"**, so the WSIB section below is **our framework knowledge, not scraped detail** and must be re-fetched from a live WSIB health-professional page before the agent quotes specifics. (`confidence` marked per line.)

---

## OHIP-funded (government-paid) physiotherapy — who qualifies

A patient with a **valid Ontario health card** qualifies for government-funded physiotherapy **only if** they fall into one of these buckets (ontario.ca. `confidence: V`):

- **Long-term care residents** aged 18+.
- Patients **discharged after an overnight hospital inpatient stay, or who had outpatient/day surgery — within the last 12 months** — and who need physio **for that same condition/injury**.
- People receiving income from **Ontario Works** or the **Ontario Disability Support Program (ODSP)** — *no OHIP card required* for this route.
- Anyone **65 or older**.
- Anyone **19 or under**.

**If the patient is not in one of those buckets, the government will NOT cover physiotherapy** — it's private-pay or private insurance. This is the key thing a front desk / voice agent must get right before implying "free" physio. (`confidence: V`)

### Referral / access rules the front desk should know
- **In-home physio (65+):** patients (own home or retirement home) contact **Ontario Health atHome** — phone **1-833-515-1234**; they assess eligibility. (`confidence: V`)
- **Long-term-care-home residents:** referral comes from the **on-staff doctor or nurse practitioner** as part of the care plan — the PT then decides if physio is needed. (`confidence: V`)
- **Everyone else (eligible):** must go to a **government-funded physiotherapy clinic** (Ontario maintains a clinic-locations directory) and **be assessed there** to confirm they qualify. Not every clinic is in the funded program. (`confidence: V`)
- Community **exercise & falls-prevention classes** are signposted via **Health811** / INFOline **1-888-910-1999**. (`confidence: V`)

**Front-desk takeaway:** eligibility is the gate, the clinic must be in the funded program, and most working-age adults (20–64, no recent hospital stay, not on OW/ODSP) are **private-pay**. Don't promise OHIP coverage without checking the bucket. (`confidence: V`)

## WSIB (Workplace Safety and Insurance Board) — work-injury rail

**GAP — re-fetch needed.** The targeted WSIB health-professionals page 404'd in this crawl; treat the following as orientation only, to be replaced with scraped WSIB detail. (`confidence: E`)

- WSIB covers treatment (incl. physiotherapy, chiropractic, massage where authorized) for a **work-related injury/illness** with an **accepted claim** — a separate payer from OHIP and from private insurance. (`confidence: E`)
- A WSIB patient is **not OHIP-funded for the same injury**; the claim number and employer/incident details drive billing, and treatment is often delivered through WSIB **Programs of Care** with provider reporting obligations. (`confidence: E`)
- **Front-desk takeaway:** for a work-injury caller, capture **"is this a WSIB claim?"** early — it changes the payer, the intake, and the paperwork — but **do not quote WSIB coverage amounts or program rules from this file** until the live WSIB pages are re-scraped. (`confidence: E`)

## Massage therapy / chiropractic coverage note
RMT and chiropractic services are **generally not OHIP-covered** for the public — they're private-pay or via **extended health (private) insurance**, MVA/auto, or WSIB where applicable. None of the captured CMTO pages described a public-funding rail for massage. (`confidence: E` — absence of evidence, flagged for a dedicated private-insurance file.)
