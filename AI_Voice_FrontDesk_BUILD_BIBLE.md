# AI Voice Front Desk — BUILD BIBLE

*Single source of truth for the product, strategy, architecture, build journey, and compliance. Consolidates all strategy + build decisions from the research/brainstorm sessions. Companion to `SaaS_Gap_Research_DATA_BIBLE.xlsx` (the evidence). Not legal advice — confirm regulatory items with counsel per jurisdiction.*

---

## 0. Executive summary — the locked decisions

- **Product:** an AI voice "front desk" for appointment-driven local businesses — answers calls, qualifies, and books. Two modes, one engine:
  - **Model 1 — Inbound Receptionist:** answers calls *to* the business.
  - **Model 2 — Speed-to-Lead Caller:** instantly calls *inbound leads* (consented) and books them.
- **First vertical:** **Physiotherapy** (you own 7 clinics = design partners; Retell provides HIPAA/BAA free), entering **after-hours first**. **Pilot #0 = PPC Guru** (Model 2 on your own paid-ad leads). Then **Construction** (no compliance), then **Realtor/Mortgage**.
- **Build (Phase 1):** **Retell** orchestration + best-of-breed STT/LLM/TTS behind a **provider-abstraction layer**.
- **Build (Phase 2):** migrate core to **LiveKit/Pipecat** to own barge-in + a multi-vendor router + a fine-tuned accent model.
- **Architecture rule:** **real-time path is lean; heavy LLM work runs offline** in executor agents. Capture data from **call #1**. **Eval-gate** every change. **Compliant by design.**
- **Team:** **Shrikaanth + ~8 AI executor agents**; hire first human at ~30–40 clients.
- **North Star:** **Qualified appointments booked per month.**

---

## 1. The product — Models 1 & 2

**Model 1 — Inbound Receptionist** (physio, construction)
```
Caller dials business → Telephony → Retell (STT → Claude → TTS)
  → Claude reads client KNOWLEDGE BASE (RAG) → answer / qualify / book
  → Books to Google Calendar / Jane / Jobber → SMS confirm
  → If unsure → human handoff / callback → transcript + outcome logged
```

**Model 2 — Speed-to-Lead Caller** (PPC Guru, mortgage, realtors)
```
Lead submits ad form (WITH consent) → webhook → outbound call <60s
  → AI discloses it's AI → qualify → book to SALES calendar → SMS
  → Hot lead → live-transfer to human closer → data → CRM
```
Both share the same brain + KB + booking adapter. Model 2 = Model 1 + a lead-webhook trigger. **The 5-minute rule:** calling a fresh lead within ~1 min vs 30 min lifts conversion ~390%.

**"AI replaces the salesperson?"** AI owns the top of funnel (instant callback, qualify, FAQ, book, follow-up, nurture). Human closes high-value consultative deals. AI fully closes simple/transactional ones.

---

## 2. Market & opportunity

- **The grey space (from the Data Bible):** big category terms are unwinnable walls (SEO 76–93: crm, notion, booking, leads). The winnable demand is the **qualified / consolidation / client-ops long-tail at SEO 8–35** with $60–130 CPCs.
- **Why voice (YC reframe):** the highest-CPC, most-hated-incumbent, AI-disruptable zone. Voice AI crossed the realtime quality threshold in 2025. The single most open keyword in the dataset: `cloud based business phone system` — **SEO difficulty 9, $76 CPC**.
- **Sizing (estimates):** physio beachhead ~$190–220M SAM; adjacent healthcare ~$2B+; all appointment/phone-driven local businesses **$10–15B+ TAM** (US+Canada). $100M ARR ≈ ~20,000 locations — a tiny slice of millions of businesses.
- **Billion-$ verdict:** physio-only = ~$20–40M ARR niche. **Multi-vertical local AI front desk = plausible billion-$** (comparables: Podium ~$3B, Weave, ServiceTitan ~$9B). Physio proves it; construction (your GCs) proves repeatability.

---

## 3. Vertical strategy & sequencing

Top-10 ranked on burning-problem × willingness-to-pay × compliance-ease × your distribution × low-competition:

1. Home services / contractors — **22/25** (highest fit, you have clients)
2. Legal (immigration/PI) — 21 · 3. Specialty trades — 21 · 4. Towing/locksmith — 20
5. Mortgage brokers — 19 · 6. Auto — 19 · 7. Real estate — 19 (best distribution for you)
8. Insurance — 18 · 9. Med-spa — 17 · 10. Property management — 16

**Sequence:** PPC Guru (Pilot #0) → **Physio** (own clinics, after-hours, HIPAA handled) → **Construction** (scale, no compliance) → **Realtor/Mortgage** (your network, owner-direct). Realtors = fast proof + distribution; mortgage/home-services = durable money.

**Owner-direct insight:** for owner-operators the buyer *is* the person missing calls — no gatekeeper, shortest sales cycle, emotional pitch ("never miss a lead while you sleep").

---

## 4. Stress test (red-team summary)

| Pressure | Status / mitigation |
|---|---|
| Problem not burning | Sell *recovered revenue*; kill-signal <2 missed calls/day |
| **Reliability on live calls** (biggest risk) | Start **after-hours/overflow**, guardrails, human handoff, QA on 100% of calls |
| Churn (esp. realtors) | Anchor on higher-LTV verticals; integrations = lock-in |
| Competition / commoditization | Moat = vertical depth + integrations + proprietary call data (not the AI) |
| Platform risk (Vapi/Google move up) | Own vertical + data; stay nimble; be acquirable |
| Distribution after your network | Prove a repeatable channel (SEO diff 9, referrals, partnerships) |
| Agent-run ops at scale | Build agent org + runbooks; hire ops human at ~30–40 clients |
| Legal/compliance | Inbound + consented speed-to-lead only; never cold outbound |

**Verdict:** survives — conditionally. Failure modes are controllable via **after-hours-first** (de-risks reliability) and **higher-LTV verticals** (de-risks churn).

---

## 5. Architecture — 5 locked principles

1. **Provider-abstraction layer** — every tool (STT/LLM/TTS/telephony/calendar/CRM) behind an internal interface → Phase-2 migration = swap, not rewrite.
2. **Real-time lean, heavy work async:**
   ```
   LIVE (<800ms): entity-STT → Claude Haiku → fast TTS
                  + repeat-back confirm + DTMF for phone digits + tentative booking
   OFFLINE (post-call, executor agents): LLM polish+validation, CRM write,
                  SMS confirm if low-confidence, QA/eval scoring, improvement loop
   ```
   → The caller gets a snappy call; the heavy LLM validation never slows it.
3. **Capture everything from call #1** — transcript, audio, outcome, confidences, interruption events (the data moat).
4. **Compliant by design** — consent, disclosure, BAA chain, redaction, residency baked in.
5. **Eval-gated changes** — nothing ships to the live agent without passing the saved regression test-set.

---

## 6. Tool matrix (rented, scored for our segment; 5 = best)

**Orchestration:** Retell ⭐ (ship in days, native integrations, **free HIPAA/BAA**) → Phase 2: **LiveKit/Pipecat** (own barge-in + router). Vapi only if deep control needed (+$1k/mo HIPAA).

**STT (ears):** **AssemblyAI Universal-3** — best entity capture (~94%, names/phones/emails) + native code-switch (accents). **Deepgram Nova-3/Flux** — lowest latency + built-in turn detection. → *Test both on real accented callers; entity accuracy likely wins for booking.*

**LLM (brain):** **Claude Haiku** (most turns, fast/cheap) → escalate to **Sonnet** for complex qualification (cascade router).

**TTS (mouth):** **Cartesia Sonic 3.5** (~82ms, snappy, least barge-in buffer) for English; **ElevenLabs Flash/v3** for realism + French/multilingual.

**Telephony:** Twilio via Retell to start; Telnyx/own-SIP later. *Watch STIR/SHAKEN spam-labeling on outbound.*

**Eval/self-improve:** **Coval** ⭐ (simulation + production monitoring) or Cekura (easiest QA pipeline).

**App/brain:** Next.js + Supabase + pgvector on Vercel (built in Claude Code).

**The router vision:** design the abstraction now; multiplex per segment (STT by language/accent, LLM cascade by complexity, TTS by language); even **dual-STT in parallel** on critical fields. Full router = Phase 2 on LiveKit. *Tools evolve → you point at the best one → product improves for free.*

---

## 7. Booking-data accuracy (WER on names/emails/phones)

Belt-and-suspenders (don't trust STT alone):
1. **Repeat-back confirmation** ("I have 416-555-1234, correct?") — most reliable, STT-agnostic.
2. **DTMF keypad** for critical digits — 100% accurate.
3. **Best entity-capture STT** (AssemblyAI).
4. **Dual-STT consensus** on phone/email moments.
5. **LLM polish + validation** (the Wispr pattern) — runs **offline**: normalize names, validate phone format/email regex.

---

## 8. Accent adaptation (the game-changer)

- **Understand:** STT keyword/phrase boosting per vertical; locale/accent models; the **proprietary loop** — log low-confidence accented calls → corrections → eventually **fine-tune Whisper on your own accented-call data** (a model nobody else has). *Accent adaptation gives the single biggest quality jump.*
- **Match (rapport):** detect caller language/accent → select matching TTS voice (e.g., Indian-English) → switch language if needed.
- **Moat:** built from proprietary data; improves with scale; can't be copied. Critical for your realtor/Indian-Canadian market.

---

## 9. Onboarding auto-discovery (<1 day, really <1 hour)

```
Client enters domain + Google Business Profile + uploads docs
  → Scraper pulls site (services, hours, FAQs)        [Firecrawl / headless]
  → Google Places/Business Profile API (hours, phone, category, reviews)
  → Docs → RAG (pgvector + doc parser)
  → Onboarding Agent drafts config + KB (80% from vertical Brain template)
  → CLIENT CONFIRMS/EDITS → 3 automated test calls (Coval) → Shrikaanth approves
  → GO LIVE (after-hours first)
```
Always keep the confirm step (extraction is ~80–90% accurate).

---

## 10. North Star + business models

**North Star = Qualified appointments booked per month** (the value customers pay for; correlates with retention + expansion). Supporting: speed-to-lead time (<60s), % calls fully AI-handled, booking conversion, revenue retention.

**Business models (recommended primary in bold):**
- **Tiered subscription + included minutes + overage** (Starter $199 · Growth $399 · Pro $799/mo; overage $0.20–0.30/min)
- **Setup/onboarding fee $300–500** (instant cash)
- **Per-booked-appointment $15–40** (killer for speed-to-lead — pay-for-results)
- White-label/agency license ($1,000–2,000/mo + per-min) — second revenue stream
- Vertical "Brain" premium packs (+$100–300/mo); analytics upsell; platform/API (late)

**Unit economics:** price $300–400/mo vs COGS ~$0.10–0.18/min (~$75–225 typical) → **~70–80% gross margin**. Setup fee ≈ pure margin. Per-appointment ≈ 85% margin + value-aligned.

---

## 11. The build journey — Phase 0–5 (Build · Monitor · Compliance)

**PHASE 0 — Foundation & Compliance-by-Design (Wk 0–1)**
- Build: accounts + abstraction layer + capture/eval data schema.
- Monitor: logging verified on a test call.
- Compliance: **sign every vendor BAA in writing** (covers config + Canadian residency); draft consent + AI-disclosure + ToS **data-rights clause** + recording-consent. *Gate before any real customer.*

**PHASE 1 — PPC Guru, Model 2 (Wk 1–2)**
- Build: lean real-time path + Meta Lead Ads webhook → outbound callback <60s → book → SMS, on your agency leads.
- Monitor: Coval scores; conversion-lift dashboard; barge-in + entity spot-checks.
- Compliance: consent on form; AI discloses; opt-out; recording consent. (No PHI.)

**PHASE 2 — Physio inbound, after-hours, Model 1 (Wk 2–4)**
- Build: "Physio Brain" RAG + **guardrails (no clinical advice; emergency → 911/escalate)** + Jane integration; one clinic, after-hours.
- Monitor: QA agent + Shrikaanth review **100% of calls**; booking accuracy, handoff rate, emergency handling.
- Compliance: PHI handling — Retell BAA, redaction, RBAC, residency, encryption.

**PHASE 3 — Self-improving loop + executor agents + auto-onboarding (Wk 3–6)**
- Build: offline pipeline (LLM polish/validation, CRM write, SMS confirm); executor agents; auto-discovery onboarding.
- Monitor: eval scores trend up; **regression gate** before any change; onboarding time-to-live.
- Compliance: anonymization verified (only abstracted patterns feed shared Brain; raw PHI siloed); improvements **human-approved**.

**PHASE 4 — Full receptionist + outbound-for-inbound + first external customer (Mo 2)**
- Build: after-hours → overflow/daytime; consented outbound recalls/no-shows; Stripe billing; clinics #2–3.
- Monitor: uptime/failover alerts; revenue/churn/NRR; per-vertical margin.
- Compliance: **E&O + cyber insurance**; failover-to-voicemail; first **external paying** customer (real PMF).

**PHASE 5 — Scale + prep self-build (Mo 3+)**
- Build: construction (Jobber); white-label; begin LiveKit/Pipecat migration behind the abstraction layer.
- Monitor: A/B LiveKit vs Retell on the same eval set before switching.
- Compliance: own HIPAA posture + SOC 2 when self-hosting.

---

## 12. Compliance — Regulatory Register (US + Canada)

**A. Cross-cutting (every vertical — handle once, centrally):**
- **Calling/texting:** TCPA, FTC TSR, National/state DNC (US); CASL, CRTC + National DNCL (Canada). Inbound + consented speed-to-lead only; AI/prerecorded voice needs express consent.
- **Caller ID:** STIR/SHAKEN — register/brand numbers (avoid "Spam Likely").
- **Call recording:** one-party vs **two-party** (~12 US states); Canada one-party + PIPEDA notice. Always announce.
- **Privacy:** CCPA/CPRA + ~20 state laws (US); PIPEDA, Quebec Law 25, BC/AB PIPA (Canada).
- **⚠️ Biometric/voiceprints:** **BIPA (Illinois)**, TX, WA; Quebec Law 25. A voice can be biometric data → explicit consent or major liability.
- **AI disclosure:** CA B.O.T. Act, Colorado AI Act, others; Canada AIDA (pending).
- **Accessibility:** ADA (US), AODA (Ontario). **Payments:** PCI-DSS — don't take card over AI voice early.

**B. Two recurring principles:**
1. **Advice/licensing line:** in insurance/finance/mortgage/real estate/legal the AI must NEVER quote/bind/originate/advise/represent — only qualify, schedule, route, inform (public info), and hand off.
2. **Anti-bias:** finance/mortgage/real estate/insurance/employment AI faces fair-lending/fair-housing/human-rights scrutiny (ECOA, Fair Housing, human rights codes). Don't use protected classes in qualification.

**C. Per-industry (key regs · burden):**
- Healthcare (physio/dental/mental health/vet) — HIPAA/HITECH/42 CFR Part 2 (US); PHIPA/provincial (Canada). **High** (but Retell handles it).
- Insurance — state licensing + GLBA + NAIC AI bulletin (US); provincial + OSFI (Canada). **High**.
- Finance/Banking/Lending — GLBA, UDAAP/CFPB, AML/BSA, FCRA (US); FCAC, OSFI, FINTRAC (Canada). **High**.
- Mortgage — RESPA, TILA/TRID, ECOA, Fair Housing, NMLS (US); FSRA + broker licensing, AML (Canada). **High**.
- Real estate — Fair Housing (anti-steering), licensing, TCPA (US); RECO + provincial, human rights (Canada). **Medium-High**.
- Legal — no unauthorized practice of law, confidentiality, bar ad rules. **Medium**.
- Debt collection — FDCPA, Reg F. **Very High — avoid early**.
- Home services / Auto / Restaurants — cross-cutting only. **Low (your clean lane)**.
- Childcare/education — FERPA, COPPA. **Medium**.
- Employment/recruiting — EEOC, NYC LL144, IL AI video act. **High — avoid early**.

**D. Burden ranking (sequence entry):** Home services/Auto/Restaurants (low) → Legal/Childcare → Real estate → Healthcare → Insurance/Mortgage/Finance → Debt collection/Employment (hardest).

---

## 13. The AI executor agent org (lean: Shrikaanth + agents)

Two kinds of "agent": **Voice Agents** = the product; **Executor Agents** = internal Claude workflows that run the company.

| # | Executor Agent | Skill | Source | Build/Rent |
|---|---|---|---|---|
| 1 | Dev Agent | Full-stack | Claude Code | Have |
| 2 | Voice-Config/Prompt Agent | Prompt + flow design | Claude Code | Build |
| 3 | Onboarding Agent | Extract → config/KB | RAG pattern (pgvector) | Build |
| 4 | QA/Eval Agent | LLM-as-judge | Coval/Cekura + Claude | Rent+build |
| 5 | Improvement Agent | Propose KB/prompt/vocab fixes | Claude workflow | Build |
| 6 | Follow-up Agent | Post-call SMS/email | Claude workflow | Build |
| 7 | Sales-Research/Outbound Agent | Research + outreach | Claude workflow | Build |
| 8 | Monitoring/On-call Agent | Watch errors/outages | Observability + alerts | Rent+wire |
| — | **Shrikaanth (human)** | Orchestrate, **review/approve**, escalations | — | The one human |
| — | **You** | Founder: sales, strategy | — | — |

**Reference repos (Phase-2 self-host):** `livekit/agents`, `pipecat-ai/pipecat` (MIT). Rent the voice pipeline (Retell) now; build the app + agents in Claude Code (Claude Agent SDK). **Hire first human at ~30–40 clients.**

---

## 14. Pre-build checklist + investment

**Before writing code (the 3 most-missed):**
1. **Data-rights clause in ToS** (or you legally can't build the Brain moat).
2. **Consent + AI disclosure + recording consent** day one (+ voiceprint/biometric consent).
3. **Instrument logging + eval from call #1** (the data is the moat).

**Plus:** charge from day one (even own businesses); one external LOI; reliability/handoff + kill-switch plan; abstract vendors (no lock-in); unit-economics discipline (cap free trials); security/tenant isolation + vendor BAAs; onboarding-agent; bootstrap-to-PMF then raise; written kill/scale criteria; one-sentence "why we win"; founder focus.

**Pre-build test gate:** concierge-answer 10 after-hours calls; barge-in + phone-capture test on accented speakers; Jane API read/write check; missed-call $ baseline; vendor BAA chain confirmed; one external physio commits to pay.

**Investment to first external paying customer (estimate):** infra/tools $300–800/mo; running 7 own businesses $500–1,600/mo; legal (consent/ToS/data-rights/BAA) $1,500–5,000 one-time; ~4–6 weeks of Shrikaanth + Claude Code. **Total ≈ $5–15k.**

---

## 15. Glossary (quick reference)

**Pipeline:** STT/ASR (ears), TTS (mouth), LLM (brain), orchestration, latency, TTFA, VAD, **barge-in** (stop on interrupt), endpointing/end-of-turn, turn-taking, backchannel, full/half-duplex, WER (accuracy), MOS (voice realism), prosody, diarization, **entity extraction** (name/phone/email), echo cancellation.
**Telephony:** SIP/SIP trunk, DID (number), inbound/outbound, DTMF (keypad), IVR, AMD/voicemail detection, warm/cold transfer, concurrency, A2P 10DLC, codec.
**AI:** agent/agentic, prompt/system prompt, tool/function calling, RAG, embeddings/vector DB, context window/tokens, fine-tuning, distillation, hallucination, guardrails, HITL, MCP, prompt injection.
**Eval:** eval harness, LLM-as-judge, golden/test set, regression testing/simulation, observability, drift.
**Business:** TAM/SAM/SOM, ICP, MRR/ARR, ARPU/ACV, CAC, LTV, LTV:CAC, churn (logo/revenue), NRR/NDR, gross margin/COGS, payback, burn/runway, PMF, PLG, activation, expansion, design partner, wedge/moat/network effect/switching cost.
**Compliance:** PII/PHI, HIPAA/PHIPA/PIPEDA, TCPA/CASL, DNC, BAA, DPA, SOC 2, GDPR, AI disclosure, two-party consent, redaction, RBAC/SSO, BIPA (biometric), GLBA, ECOA/Fair Housing, STIR/SHAKEN.

---

## 16. Next steps (immediate)

1. Execute **Phase 0**: stand up accounts, sign vendor BAAs, draft consent/disclosure/ToS data-rights, build the capture/eval schema + abstraction layer.
2. Run the **pre-build test gate** on your own clinic.
3. Build **Phase 1** (PPC Guru speed-to-lead) and measure conversion lift.
4. *(Deferred, on request): finance/equity/resolution-by-design discussion.*

*End of Build Bible. Keep this file updated as decisions evolve.*
