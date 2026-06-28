# PROJECT BRIEF — AI-Native CRM for Healthcare Practitioners (US + Canada)

*The consolidated build brief: strategy + verified HIPAA/PHIPA-compliant tech stack + cost reality + the compliance gotchas. Developed across research sessions; this is the handoff doc. Pairs with the evidence base: `CLINIC_CRM_GAP.md` (the gap), `PRACTITIONER_AD_SCRAPE.md` (44.5% run ads — measured), `MARKET_SIZE.md`, `ADOPTION_FUNNEL.md`, `DECISION_MEMO.md`, `RESEARCH_BRAIN.md`.*

## What we're building
A **HIPAA/PHIPA-compliant, AI-native CRM + front-office automation platform** for small healthcare practitioners (physio, chiro, dental, med-spa) — a **vertical, clinic-tuned GoHighLevel competitor**. It sits **between a clinic's ad spend and their calendar/EMR**: captures leads from Google/Meta ads → responds instantly via **AI voice + SMS + email** → books appointments → reduces no-shows — **WITHOUT replacing the EMR**. Edge = founder runs a marketing agency → distribution (existing clinic clients) + patient-acquisition domain knowledge.

## The opportunity (confidence-flagged)
- **EMR adoption SATURATED:** US ~95% / Canada ~86–96% 🟢 → do NOT build/replace an EMR.
- **Marketing/lead CRM among small clinics: ~20–35%** 🟡 (estimate).
- **% running paid ads: 44.5% — MEASURED** (primary scrape, n=281, `PRACTITIONER_AD_SCRAPE.md`) 🟢; physio 52%, dental 50%, CA 58.8% vs US 32.0%. (Beats the old 25% estimate ~1.8×; a floor.)
- **~50–65% of ad-running clinics have NO system** to manage the leads → the market.
- **TAM:** ~290,000 practitioner practices in North America (physio/chiro/dental/med-spa); ~28–31k in Canada. Physio SAM (CA+US ad-runners) ~$38–40M at the measured rate; broad multi-vertical SAM ~$150M+.
- **KEY:** a clinic's EMR (Jane etc.) is NOT a marketing CRM and structurally can't be — the "pre-patient" lead data can't live in an EMR. That's why a separate layer is needed.

## Strategic positioning (the wedge — don't fight GHL head-on)
GHL is generic, cheap, 5-yr lead, reseller army. Win by **VERTICAL + AI-native + Canadian-compliant**:
1. **"Zero HIPAA tax"** — bake compliance into a flat subscription. (GHL charges ~$297/mo extra for its HIPAA add-on, and even then its native Zapier/webhook integrations aren't BAA-covered → GHL clinics are often technically non-compliant.)
2. **★ Canadian data sovereignty = THE STRONGEST MOAT.** GHL is US-hosted only → Canadian clinics legally **can't** use it for PHI. Host in Canadian region (AWS `ca-central-1`; top tier = Canadian-owned cloud vs US CLOUD Act) → **structurally shuts GHL out of the Canadian market.** This converts a compliance *burden* into a competitive *weapon*.
3. **Clinic-native workflows** (no-show recall, reactivation, reviews) vs GHL generic templates.
4. **Distribution** — founder already runs these clinics' ads → sell the lead engine off the back of the ads.

## Competitive landscape
- **Clinical EMR/PMS (don't compete):** Jane, Cliniko, Dentrix, SimplePractice, WebPT.
- **Marketing CRM:** GoHighLevel (dominant, agency-deployed, generic).
- **Engagement:** Weave, NexHealth, Solutionreach, Podium.
- **AI voice startups (the real competitors):** **Kickcall** (Canadian, Jane-via-Google-Calendar bridge, ~$59/mo, agency reseller), Attainment, DeepCura, Omnipractice (AI-native EHR). + **WebPT Reach** (PT-native, owns EMR, has pipeline+nurture — "one feature from" ad-ROI; see `CLINIC_CRM_GAP.md`).
- **Implication:** Kickcall already does "Canadian AI voice receptionist." Our edge must be the **broader AI growth platform** (attribution + multi-channel + reporting from ad expertise), not just voice booking.

## Product scope
CRM + pipeline + AI voice agent (inbound/outbound, after-hours booking, **speed-to-lead callback <60s**) + compliant email + SMS sequences + compliant ad attribution + EMR sync. **Multi-tenant** (one backend, unlimited clinic sub-accounts → flat infra, linear revenue).

## Verified compliant tech stack (all sign BAAs)
| Layer | Tool | Cost | Compliance note |
|---|---|---|---|
| Frontend (no PHI) | WeWeb (~$399/mo, BAA, Vue export = no lock-in) **OR** AI-built custom code | — | custom better for voice/scale |
| Backend/DB (PHI) | Xano Pro + HIPAA (~$724/mo) **OR** Supabase Team + HIPAA (~$950/mo) | — | host in Canadian region for CA clinics |
| **AI Voice** | **Retell AI** — self-serve BAA, **$0.07/min**, ~600–750ms, PII redaction | usage | Vapi = HIPAA via $1,000/mo add-on + zero-retention; Telnyx ~$0.05/min carrier-direct |
| Email | SendGrid **Pro** ($89.95/mo, BAA) **OR** AWS SES + Wraps (cheapest, AWS BAA all tiers) | — | ⚠️ NOT Postmark (no BAA); not Mailchimp/free SendGrid |
| SMS | **Notifyre** (BAA, no minimum, $0.015/SMS, inbound free) | usage | ⚠️ avoid Twilio (BAA gated behind ~$2,000/mo min) |
| **Ad attribution** | Server-side, PII-stripped (Improvado / server-side GTM / hashed enhanced conversions) | — | ⚠️ standard Meta Pixel/GA on intake/booking pages = **HIPAA VIOLATION** (HHS/OCR 2022) |
| EMR sync | Keragon (HIPAA "Zapier", ~$99/mo) — API-having EMRs (Tebra/ModMed/Charm) | — | Jane = **no open API** → Google Calendar bridge only |
| Infra fixed burn | ~$1,300/mo + voice usage | | INFRASTRUCTURE only, not total compliance cost |

## CRITICAL corrections / gotchas (do NOT repeat)
1. **JANE HAS NO OPEN API.** The dominant Canadian EMR can't do native chart sync. For Jane clinics use the **Google Calendar bridge** (read schedule + create bookings, NOT write charts) — how Kickcall does it. Promise "native EMR chart sync" ONLY for API-having EMRs (Tebra/ModMed), not Jane. *(Matches our own finding — `RESEARCH_BRAIN` node 6.)*
2. **"Compliant tools ≠ compliant product."** Shared-responsibility: BAA-tools cover ~70–80%; you still own configuration, your own policies/risk assessment, BAAs with each clinic, breach plan, lawyer review. There is NO "HIPAA certification" you buy once — it's an ongoing program.
3. **Canada ≠ HIPAA.** Need PIPEDA + PHIPA (Ontario) + Law 25 (Quebec). Data residency mandatory in some provinces. US CLOUD Act → even CA-hosted data on a US-parent cloud can be compelled → top tier hosts on Canadian-owned cloud. If clinics share records through us → Ontario **HINP** status (extra audit/breach duties). Bilingual (EN/FR) for Quebec/federal.
4. **No-code (WeWeb/Xano) launches/validates fast but ceilings on AI voice/scale** → plan to migrate to custom code (Vue export). With AI + a developer, custom-from-start is also viable.

## Architectural flow
Ad → lead form (WeWeb portal) → secure store (Xano/Supabase HIPAA, TLS1.2+, CA/US region, BAA) → **Retell AI speed-to-lead call <60s** → if no answer, SendGrid email drip + Notifyre SMS → on booking, webhook → Keragon → creates chart in EMR (Tebra; Jane via GCal bridge). Kills the double-data-entry that makes generic GHL unusable for clinics.

## Costs (lean, AI-assisted)
- **Phase 0** (validate, synthetic data, no compliance spend): ~$5K–20K
- **Phase 1** (first paying clinics, full compliance program): ~$25K–50K
- **Total to compliant launch:** ~$30K–70K (vs $150K–600K agency route)
- **Ongoing:** ~$30K–60K/yr (Vanta/Drata $10–15K/yr + audit deferred until a customer requires it + infra + maintenance)
- Don't cheap out on: BAAs (both directions), a few hours of health-privacy lawyer, correct configuration.

## Phased plan
- **Phase 0 — Validate:** AI-build MVP, synthetic data, demo to existing clinic clients, collect **LOIs**. No compliance spend, no real PHI.
- **Phase 1 — First paying clinics:** BAA infra + Canadian residency, sign BAAs, lawyer review, launch ONE regime first (Ontario/PHIPA). Defer formal audit.
- **Phase 2 — Scale:** formal HIPAA attestation + US expansion when a deal requires it; build the agency-reseller distribution motion (GHL's real lesson).
- **Minimize PHI always** (contact + appointment only, never clinical notes) = lightest compliance + lowest cost.

## Open questions (for the build phase)
1. No-code (WeWeb/Xano) vs AI-built custom code — given founder has AI + a developer.
2. Exact data-flow diagram labeling every field PHI vs non-PHI + which vendors need BAAs.
3. Which vertical to launch first (physio vs dental vs chiro) + which province.
4. Detailed 90-day build plan with dollar checkpoints.

---
*Reconciliation: this brief is consistent with the repo's independent research — the gap (no clinic-native ad→booked sales CRM), the measured 44.5% ad-adoption, the Jane-no-API reality, Kickcall + WebPT Reach as the real threats, and the Canada-first beachhead (CA 58.8% ad adoption). The NEW load-bearing strategic addition is **Canadian data sovereignty as the structural moat** — the strongest defensibility argument we have.*
