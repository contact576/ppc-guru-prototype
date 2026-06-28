# Module A — AI Voice / Missed-Call Capture (the wedge)

**What this is.** Teardown of best-in-class AI voice receptionists (clinic + adjacent) → extracted patterns → the full spec for **OUR Module A**: a clinic-native, Canada-first AI voice + missed-call-text-back front desk that **captures the call into OUR CRM and books into OUR pipeline** (not into Jane directly). This is **the wedge** — per `PHYSIO_WORKFLOW.md`, the missed / after-hours call is the #1 controllable money leak (a missed new-patient call ≈ $400–$1,000 LTV; after-hours callers "book with whoever answers first").

**Builds on (do not duplicate):** `PROJECT_BRIEF_v2.md` (Retell decided, own-the-funnel, single-source-of-truth, PHIPA), `PHYSIO_WORKFLOW.md` (Module A = TOP-3 V1 wedge), `VERTICAL_BIBLE.md` (script rules), `CLINIC_CRM_GAP.md` + `JANE_INTEGRATION.md` (Kickcall = direct comp; Jane has no write-bridge via GCal — booking lives in OUR flow).

**Date:** June 2026. **Honesty:** `[V]` = verifiable from vendor/independent source; `[M]` = marketing claim (vendor's own, unverified); `[E]` = our estimate/inference. Many vendor sites (Kickcall, Attainment) returned **HTTP 403** to automated fetch — those facts come from search-result snippets and are tagged accordingly.

---

## PART 1 — TEARDOWN

### 1.1 Summary table

| Product | Category | What it does | How it books | Pricing | Latency / voice | Languages | Gaps / complaints |
|---|---|---|---|---|---|---|---|
| **Kickcall** (Canadian; **direct comp**) | Clinic AI receptionist | Inbound answer, after-hours, booking, reschedule/cancel by voice; healthcare-tuned (physio, family practice, mental health) `[M]` | **Jane via Google Calendar bridge** — *explicitly an unofficial connector* `[V, snippet]` | **From $59/mo** `[V, snippet]` | Not published `[—]` | Bilingual EN/FR positioning (CA market) `[M]` | **The GCal bridge can't write a real Jane appointment** — only opaque "Busy" blocks (confirmed in our `JANE_INTEGRATION.md`); integration is unofficial/disclaimed `[V]`. No native ad-attribution / pipeline / paying-patient loop `[E]`. Voice-only point solution. |
| **Avoca** (YC W23) | Home-services AI workforce | Sub-2s pickup 24/7, qualify urgency, check tech availability, book; **CSR call QA/coaching** `[M]` | Deep **ServiceTitan** integration `[V]` | Custom/enterprise only (no public price); aimed at 20+ CSRs, $10M+ rev `[V]` | "<2s pickup," "no IVR" `[M]` | Multi (unspecified) | Enterprise-only; **not built for small clinics**; no healthcare/EMR fit `[V]`. |
| **Smith.ai** | Virtual receptionist (hybrid) | AI receptionist **or** human receptionists; lead qualify, intake, recording + searchable transcripts `[V]` | **Calendly**; CRM/Zapier; live-agent handoff `[V]` | **AI:** from **$95/mo**, ~$2.10–$2.40/call overage. **Human:** $292.50 (30 calls) → $975 (120 calls) `[V]` | Not published | Multi | Generic (not clinic-native); no EMR; booking via Calendly only; human tier expensive `[V]`. |
| **Goodcall** | SMB AI receptionist | 24/7 answer, FAQ, capture leads, appointment **requests**, SMS follow-up w/ booking link `[V]` | CRM/calendar sync, often **via Zapier**; Google Voice `[V]` | **$79 / $129 / $249/mo**; ~$0.50 per unique caller overage `[V]` | Not published | Multilingual `[V]` | Books via "request" + SMS link, not always a hard booking; Zapier-glue integrations; not clinic/EMR-native `[V]`. **Per-unique-caller pricing** (not per-min). |
| **Rosie** | SMB AI receptionist | 24/7 answer, FAQ from your data, **texts you details of every call** (missed-call summary), booking on higher tiers `[V]` | Calendar booking (Scale/Growth tiers) `[V]` | **$49 / $149 / $299/mo**; booking only on $149+ `[V]` | Not published | Multi | Cheapest tier = no booking; not clinic-native; no EMR/attribution `[V]`. Good missed-call-text-back model to copy. |
| **Numa** | Auto-dealership AI | Service scheduling, recall, parts inquiries `[V]` | **CDK / Reynolds** DMS `[V]` | Custom (multi-$k/mo) `[V]` | Not published | — | **Automotive only — not a clinic option** `[V]`. (Included to show how vertical-native + DMS-native is the winning shape; we replicate that shape for EMR.) |
| **Jobber AI Receptionist** | Home-services SaaS add-on | 24/7 call+text answer, take messages, transfer, FAQ, book into Jobber, **text back callers who hang up** `[V]` | Native into **Jobber** (their own SaaS) `[V]` | **$99/mo** add-on (Core/Connect/Grow); included on Plus ($599/mo) `[V]` | Concurrent-call handling `[M]` | — | Locked to Jobber's own DB. **This is the model to copy**: voice receptionist as a *native module of the platform that owns the data*, not a standalone. |
| **Retell** (infra — our engine) | Voice infra / agent platform | STT+LLM+TTS orchestration, turn-taking, telephony, transcripts, function-calling | We orchestrate (books into OUR pipeline via function calls) | **$0.07/min** voice infra; **all-in ~$0.11–$0.15/min** w/ LLM+TTS+telephony `[V]`; **self-serve BAA on paid plans** `[V]` | **~600ms** turn-taking `[V/M]` | **30+ languages** `[V]` | $0.07 is *infra only* — real cost stacks (see COGS). BAA self-serve is the standout. |
| **Vapi** (infra — alt) | Voice infra | Same shape as Retell | We orchestrate | **$0.05/min** base; all-in **$0.30–0.33/min**; **HIPAA = +$2,000/mo**, ZDR +$1,000/mo `[V]` | low-latency `[M]` | Multi | **HIPAA gated behind a $2k/mo fee** → much worse unit economics than Retell for a compliant clinic product. Confirms Retell choice. |

### 1.2 The three patterns worth stealing

1. **Missed-call → instant text-back is the highest-ROI, lowest-risk primitive** (Rosie, Jobber, GHL all lead with it). It needs no booking integration to deliver value, sidesteps the "robot embarrassing me" objection (it fires only when a human *wasn't going to answer anyway*), and produces a structured lead record on every ring. Ship it first.
2. **Vertical-native + owns-the-system-of-record beats generic + Zapier-glue** (Numa→DMS, Jobber→Jobber, Avoca→ServiceTitan). The winners book *into the platform that owns the data*. For us that platform is **OUR CRM** — which is exactly the own-the-funnel strategy. Goodcall/Smith.ai lose because they bolt onto Calendly/Zapier and don't own the downstream record.
3. **Transcript + recording as a first-class asset** (Smith.ai's searchable transcripts; Retell auto-transcripts). Every call should yield a stored, source-tagged transcript + structured outcome — this is what feeds Module C (attribution) and Module B (pipeline), the loop the point-solutions never close.

### 1.3 How we beat Kickcall (the direct comp)

Kickcall is voice-only and **books through the GCal bridge that — per our own Jane research — cannot create a real Jane appointment** (it only writes "Busy" blocks; the integration is unofficial and disclaimed). So Kickcall's core promise is structurally leaky. We win by **not depending on a Jane write-path at all**: the AI books into **OUR pipeline** (own-the-funnel), the confirmed patient is handed to the EMR later (front desk, RPA interim, or JDP partner API when approved), and — critically — **the captured call is tied to its ad source** and flows into the pipeline (Module B) and attribution dashboard (Module C). Kickcall answers phones; **we run the growth loop the phone call is the start of.** Same $59-ish entry buys a feature; we sell the operating system.

---

## PART 2 — SPEC: OUR Module A

### 2.1 Capabilities (V1)

| # | Capability | Notes |
|---|---|---|
| 1 | **Inbound answer — after-hours + overflow** | Forward-on-no-answer (clinic's line rings the desk first; AI picks up after N rings or outside business hours) AND a dedicated AI number for ad campaigns. Overflow = front desk busy/in-treatment. Sub-1s pickup, no IVR. |
| 2 | **Instant missed-call text-back** | The moment a call is missed/abandoned, fire an SMS within seconds ("Hi, this is [Clinic] — sorry we missed you. Want me to grab you a spot? Reply here."). Works with **zero** booking integration — ship first. Creates a lead record on every ring. |
| 3 | **Qualify** | Discipline (physio / chiro / RMT / acupuncture), new-vs-returning, what's bringing them in, which clinician (named preference or "first available"). |
| 4 | **Insurance direct-bill Q&A** | Name **real CA insurers** (Sunlife, Manulife, Canada Life/Great-West, Blue Cross). Per-clinic config of *which* plans they direct-bill. Honest hedge: "we direct-bill most major plans — you'll want to confirm your specific coverage." **Never** quote dollar coverage amounts (that's PHI-adjacent + wrong-info risk). |
| 5 | **Offer a concrete slot + book into OUR pipeline** | Read **real availability** (from the clinic's GCal mirror of Jane / Cliniko-Juvonno API / a manually-set availability template), offer a *specific* time ("I've got Thursday 2:15 or Friday 9:30 — which works?"), and create a **booking object in OUR pipeline** at stage `booked-pending-EMR`. **Not written to Jane directly.** |
| 6 | **Take a message / capture callback** | Always capture name + callback number even if no booking — never a dead end. |
| 7 | **Escalate / transfer to human** | Warm-transfer to the desk during hours for clinical/emotional/complex calls; flag for human callback after hours. Configurable per clinic. |
| 8 | **Bilingual EN/FR** | Auto-detect or per-clinic default (Quebec). Retell supports 30+ languages `[V]`. |
| 9 | **Recording + transcript → OUR CRM, tied to ad source** | Every call stored with transcript, structured outcome (booked / message / out-of-area / spam), and **source attribution** (which tracking number = which campaign). Feeds Module B + C. Consent handled (see 2.5). |

**Explicitly NOT in V1:** writing to Jane/EMR (handed off later), appointment-day reminders/recall (Jane's turf — see `JANE_INTEGRATION.md` §5), clinical triage/advice.

### 2.2 Conversation flow + sample script skeleton

Grounded in `VERTICAL_BIBLE.md` §6.4/§6.6: win the booking in the first contact · lead with the two front-desk filters · name real insurers · sound caring not salesy · always offer a concrete slot + capture a number · the universal qualifying gate is **"does it work with Jane?"** (for the *owner* sell, not the patient call).

```
GREETING (warm, local, human — never "press 1"):
  "Thanks for calling [Clinic Name], this is the front desk — how can I help you today?"

TRIAGE (the two front-desk filters first):
  → "Are you looking to come in for physio, chiro, massage, or acupuncture?"
  → "Have you been in to see us before, or is this your first visit?"
  → "And what's bringing you in?"  (capture; do NOT probe clinical detail — minimize PHI)
  [If nervous / first-visit / chiro-safety question → SOOTHE, don't sell:
   "Totally normal to feel a bit unsure — here's what a first visit looks like… and you can
    pause or ask questions any time."]

INSURANCE (name real insurers; honest hedge):
  → "Do you have extended health benefits you'd like us to direct-bill?"
  → "Great — which provider? We direct-bill most major plans — Sunlife, Manulife,
     Canada Life, Blue Cross. You'll want to confirm your own coverage, but we can submit
     the claim for you."
  [Never quote a coverage dollar amount.]

BOOKING / CONCRETE SLOT (the whole point — offer a specific time, twice):
  → "Let me grab the next openings… I've got Thursday at 2:15 or Friday at 9:30 with
     [clinician / first available] — which works better?"
  → confirm name + callback number + email.
  → "Perfect, you're booked for Thursday 2:15. We'll text you a confirmation and an
     intake link so you can fill it out from home before you arrive."
  [Creates booking in OUR pipeline @ stage 'booked-pending-EMR', source-tagged.]

CONFIRM + REBOOK HOOK:
  → SMS confirmation fires immediately (single source of truth = our CRM).

FALLBACK ladder (never a dead end):
  → No slot fits → "Want me to text you a couple of options to pick from?" (message + SMS)
  → Complex / emotional / clinical → "Let me get one of our team to call you right back" (escalate)
  → During hours + needs human → warm transfer to desk
  → Anything captured → name + number ALWAYS taken → lead created
```

> Script copy is a skeleton. **The Bible's real review/transcript pulls would refine wording** (the `[REVIEW-PHRASE]` and `[PATTERN]` items in `VERTICAL_BIBLE.md` §6 are still paraphrase-risk; a human pasting raw Radio Front Desk transcripts + 50–100 Google reviews is the highest-leverage upgrade — flagged in the Bible's honesty note).

### 2.3 Architecture

```
  Patient phone call
        │
        ▼
  [Telephony number]  ── per-campaign tracking numbers (= ad-source attribution)
        │  (forward-on-no-answer + after-hours + dedicated ad lines)
        ▼
  ┌──────────────────────────────────────────────┐
  │  RETELL (rented voice engine, BAA-signed)     │  $0.07/min infra; ~$0.11–0.15 all-in [V]
  │  STT → LLM (Haiku/Sonnet) → TTS, ~600ms turn  │  EN/FR, 30+ langs
  │  - System prompt built from clinic's          │
  │    SAFE-BLOCKS config (insurers, disciplines, │
  │    clinicians, hours, escalation rules)        │
  │  - Function calls OUT to our orchestrator      │
  └──────────────────────────────────────────────┘
        │ function calls (check_availability, create_booking,
        │ send_sms, capture_lead, escalate)
        ▼
  ┌──────────────────────────────────────────────┐
  │  OUR ORCHESTRATION LAYER (we build)           │
  │  - availability source: GCal mirror of Jane / │
  │    Cliniko+Juvonno API / manual template      │
  │  - writes booking → OUR PIPELINE (stage        │
  │    'booked-pending-EMR')  ← single source of   │
  │    truth, NOT Jane                             │
  │  - SMS via Notifyre; missed-call text-back     │
  │  - call recording + transcript → OUR CRM,      │
  │    source-tagged to the campaign/number        │
  └──────────────────────────────────────────────┘
        │
        ├──► Module B (pipeline / speed-to-lead)  — the lead is now a worked record
        ├──► Module C (attribution)               — call tied to ad spend
        └──► EMR HANDOFF (later, separate step):
               Jane: front desk confirms manually / RPA interim / JDP partner API when approved
               Cliniko / Juvonno: native API write (easy path)
```

**Key architectural decisions (consistent with the brief):**
- **Booking writes to OUR pipeline, never to Jane directly.** Per `JANE_INTEGRATION.md`, the GCal bridge can't create a real Jane appointment, and JDP is partner-gated. So we **own the funnel**: the confirmed patient is handed to the EMR as a *later* step (front-desk manual / RPA / JDP). This is also why we beat Kickcall (which leans on the leaky GCal write).
- **Availability read** is decoupled: GCal mirror (Jane outbound sync carries name + optional notes — usable as a read-only availability mirror), Cliniko/Juvonno native API (clean), or a manual availability template per clinician as the zero-integration fallback.
- **Single source of truth:** our CRM owns the lead, the call, the transcript, the source. The EMR owns the booked patient + chart. Write to EMR **once** at handoff; read changes back. (Matches `PROJECT_BRIEF_v2.md`.)
- **Voice = rented, orchestration = built.** Retell over Vapi because Retell's **self-serve BAA is on all paid plans** vs Vapi's **+$2,000/mo HIPAA gate** `[V]` — decisive for per-clinic unit economics.

### 2.4 PHI minimization

- **Capture only contact + appointment logistics** in structured CRM fields: name, phone, email, discipline, new/returning, preferred clinician, chosen slot, insurer name (not coverage detail), ad source.
- **Sensitive detail stays in the voice conversation / transcript**, handled inside the BAA-covered Retell pipeline — *not* promoted into searchable CRM fields or, ever, into the RAG knowledge corpus (the brief: "keep PHI OUT of this corpus").
- "What's bringing you in" is captured as free-text context but the agent is instructed **not to probe** clinical detail — enough to route, not to diagnose.
- The same KB that grounds the agent is **market data only**; clinic-specific config (insurers/clinicians/hours) is the safe-blocks layer, not PHI.

### 2.5 Compliance notes (PHIPA / Canada)

- **Data residency:** Canadian region for our infra (brief). Kickcall's stated edge is "data never leaves Canada" `[M]` — we must match it. **Confirm Retell can pin Canadian processing region** → open question (Retell is US-origin; this needs verification before a PHIPA promise is made). `[E/VERIFY]`
- **Recording consent:** Canada is one-party-consent federally, but **clinic best practice + PHIPA posture = disclose recording** at call start ("This call may be recorded to help us book your appointment"). Make the disclosure a non-removable safe-block.
- **BAA chain:** BAA/DPA with **Retell (self-serve, paid plans)** `[V]`, **Notifyre** (SMS), **AWS** (Canadian region, infra) — all signed before any real-patient call. We own config, breach plan, risk assessment (brief: "compliant tools ≠ compliant product").
- **Bilingual EN/FR** is also a Quebec **Law 25** alignment point (French-language service).
- Validate first with **synthetic data** (zero compliance spend) before any live PHI (brief's cost lever).

### 2.6 Build vs rent

| Rent (BAA-signed) | Build (custom, Claude Code + dev) |
|---|---|
| **Retell** — voice engine (STT/LLM/TTS/turn-taking/telephony) `[V]` | **Orchestration layer** — function-call handlers, availability resolver, booking→pipeline writer |
| **Notifyre** — SMS (missed-call text-back, confirmations) | **Safe-blocks config engine** — per-clinic insurers/disciplines/clinicians/hours/escalation within guardrails |
| **AWS** (Canadian region) — infra/DB | **CRM pipeline + lead/call/transcript model**, source-tagging, Module B/C wiring |
| Telephony numbers (per-campaign tracking) | **EMR adapter layer** — Cliniko/Juvonno native write; Jane handoff (manual/RPA/JDP) |

### 2.7 COGS + pricing shape

**Per-minute math** (`[V]` rates, `[E]` assembly):
- Retell all-in ≈ **$0.11–$0.15/min** (infra $0.07 + LLM Haiku/Sonnet + TTS + telephony) `[V]`. Use **~$0.13/min** as planning midpoint.
- + SMS: ~$0.01–0.02 per text (Notifyre) `[E]`.
- **Avg booking call ≈ 3–4 min** `[E]` → ~$0.40–0.55 voice + a couple texts ≈ **~$0.50–0.65 per handled call**.
- A small clinic's after-hours/overflow volume `[E]` ≈ **150–400 calls/mo** → **~$75–$260/mo raw COGS** at the high end; most clinics land **~$30–$120/mo**.

**Why price ≥ a ~$200/mo tier (or meter):**
- At ~$0.13/min, a flat low price (Kickcall's $59, Rosie's $49) **bleeds margin on any high-call clinic** — exactly the trap the brief's financial-model lever warns about ("AI-at-$50/mo bleeds money").
- **Recommended shape:** a **base subscription ($249–$399/mo)** that bundles a generous-but-capped minute allowance + **per-minute (or per-handled-call) metered overage** above the cap. This protects margin on heavy clinics and is justified by ROI: **one recovered new-patient call ≈ $400–$1,000 LTV** `[M, PHYSIO_WORKFLOW]` — the module pays for itself on the first saved call.
- **Module A is the wedge, not the whole price.** It lands cheap-and-painful; the real revenue is the bundle with B (pipeline) + C (attribution). Don't let A be a $59 race-to-the-bottom voice commodity (Kickcall's box).

**Safe-blocks config angle:** the clinic customizes *within guardrails* — which insurers they direct-bill, discipline list, clinician roster, hours, escalation rules, FR/EN default, recording-disclosure (locked on). A **compliance red-flag linter** blocks non-PHIPA-safe configs (brief Phase-1/3). This is the adoption magic *and* the moat vs a generic voice bot: the clinic feels it's "their" receptionist without being able to break compliance.

### 2.8 Telephony connection — how OUR system gets onto the clinic's phone line

The founder's question: *"Whatever phone system they have, do we need to connect it to our ERP to get the voice recordings / what the receptionist says, to train our model?"* Two separate jobs, and conflating them is the trap:

- **Job 1 — let the AI answer the calls the clinic is losing** (after-hours + overflow + ad lines). This is Module A's whole reason to exist, and it is **lightweight**.
- **Job 2 — record the *human receptionist's* live calls to mine/train on** (capture how the best front desk actually talks). This is a **separate, heavier, optional** ambition — do not let it gate the wedge.

| | **(A) Call-forwarding — Day-1 default** | **(B) PBX / number-porting — later, optional** |
|---|---|---|
| **How** | Clinic sets *conditional call forwarding* on their existing line: forward-on-no-answer + forward-after-hours → our tracking number → Retell. Plus dedicated tracking numbers on each ad. **No change to their phone system.** | We become (or sit inside) the clinic's phone system — port the main number to a SIP/PBX we control (or insert as a trunk), so **every** call (incl. the human receptionist's) flows through us. |
| **Works with** | **Any** phone setup (POTS, VoIP, cell, RingCentral, Ooma, whatever) — they keep their telco. `[E]` | Only after migrating/porting; telco-dependent; per-clinic engineering. |
| **Captures** | Calls the AI handles (missed/after-hours/overflow/ad) — recording + transcript + source tag, all in OUR CRM. **Does NOT capture the human receptionist's in-hours calls.** | **Every** call including the human front desk → full recording corpus. |
| **Setup effort** | Minutes — a forwarding code (\*61/\*21) or a VoIP toggle the clinic (or we, screen-share) flip. Zero hardware. `[E]` | Heavy — porting paperwork, number migration risk, PBX config, support burden. Real switching cost & liability. |
| **Compliance load** | Lower — we only record AI-handled calls; recording-disclosure safe-block fires at pickup. | Higher — recording **all** human calls = two-party-consent exposure, staff-consent, a much bigger PHI surface (PHIPA). `[E/VERIFY]` |
| **Cost** | Just the tracking numbers + per-min Retell (see §2.7). | PBX/SIP seats + porting + ongoing telecom support. |
| **Verdict** | **★ This is Day 1.** Delivers the entire wedge (capture the lost call, tie it to ad source, book into our pipeline) with no phone-system change and minimal compliance load. | **Defer.** A premium "front-desk intelligence / QA-coaching" upsell (cf. Avoca's CSR coaching, Smith.ai transcripts) — only worth the weight once clinics are paying and ask for it. |

**Do we need to connect to their phone system to train the model? — No, not at the start.** Training/grounding the agent does **not** require the receptionist's calls:
1. The **RAG central brain** is grounded on *market/industry data* (the Bible), **PHI-free** — that's what gives the agent its clinic-savvy tone, and it needs zero clinic call data (`PROJECT_BRIEF_v2.md`, §2.4 here).
2. The agent then **learns from its own AI-handled calls** (de-identified) — the forwarding model already captures those. We improve the script from *our* transcripts, not theirs.
3. Capturing the **human receptionist** is a *nice-to-have data asset* (mine the best desk's phrasing), not a *prerequisite* — and it carries the heaviest consent/PHI cost. Treat it as Job 2, gated behind real demand + a consent/PHIPA review, via model (B).

**Net:** Module A connects via **conditional call-forwarding to tracking numbers** (model A) on Day 1 — any phone system, minutes to set up, captures exactly the calls that leak money, feeds Module B/C. Number-porting/PBX (model B) is a deferred premium path, justified only when a paying clinic wants full human-call QA/recording and we've cleared the added two-party-consent/PHIPA load.

---

## PART 3 — Open questions (founder input / Jane-subscription test)

1. **Retell Canadian data residency** — can processing be pinned to a Canadian region for a PHIPA promise that matches Kickcall's "never leaves Canada"? **Verify before any residency claim.** `[VERIFY]`
2. **Availability source per clinic** — for Jane clinics, do we read availability via (a) the GCal mirror, (b) front-desk-maintained template, or (c) wait for JDP read access? Needs a **live Jane subscription test** (carried from `JANE_INTEGRATION.md` open Qs — does JDP expose appointment *write*, and does the booking URL accept prefill/UTM?).
3. **EMR handoff mechanics at launch** — manual front-desk confirm vs RPA bot filling Jane's form vs JDP partner API. Which is the V1 default, and at what volume does RPA/JDP become worth it? Founder + first-clinic call.
4. **Forward-on-no-answer vs dedicated AI number** — **resolved to a default in §2.8**: conditional call-forwarding to tracking numbers (model A), any phone system, no porting. Remaining: who flips the forwarding code at onboarding (we screen-share vs clinic vs their telco), and the exact per-telco forwarding sequence to document. Number-porting/PBX (model B, full human-call capture) is deferred to a premium tier pending a two-party-consent/PHIPA review.
5. **Escalation policy** — when does the AI transfer to a human vs take a message? Per-clinic, but needs a sane default + the owner's risk tolerance (the "robot embarrassing me" fear, `VERTICAL_BIBLE.md` §7).
6. **Insurer direct-bill config** — confirm the canonical CA insurer list + per-clinic which-plans-we-bill, and the exact honest hedge wording (legal/compliance review of the insurance script).
7. **Script refinement from real data** — the Bible flags that verbatim transcripts/reviews weren't scrapeable (403s). **A human pasting real Radio Front Desk transcripts + 50–100 Google/RateMD reviews** would replace the `[PATTERN]`/`[REVIEW-PHRASE]` paraphrases with verbatim language and materially sharpen the agent's tone.
8. **Pricing validation** — is the $249–$399 base + metered overage shape acceptable to a real clinic owner, or does the market anchor (Kickcall $59) force a cheaper entry + harder upsell? Test on the founder's existing clinic clients.

---

## Sources

- Kickcall (Canadian comp): https://www.kickcall.ai/integrations/jane-app · https://www.kickcall.ai/healthcare/canada/ai-receptionist-for-physiotherapy-clinics · pricing/from-$59 + "unofficial GCal connector" disclaimer via search snippets *(site 403'd to fetch)*
- Avoca: https://www.avoca.ai/ · https://marketplace.servicetitan.com/partner/Avoca-AI
- Smith.ai: https://smith.ai/pricing/ai-receptionist · https://smith.ai/pricing/receptionists
- Goodcall: https://www.goodcall.com/ · https://www.cloudtalk.io/blog/goodcall-pricing/
- Rosie: https://heyrosie.com/pricing
- Numa: https://serviceagent.ai/blogs/numa-pricing/ (auto-only)
- Jobber AI Receptionist: https://www.getjobber.com/features/ai-receptionist/ · https://www.prnewswire.com/news-releases/jobber-launches-ai-powered-receptionist-to-answer-calls-and-texts-for-busy-home-service-businesses-302531125.html
- Retell (engine): https://www.retellai.com/pricing · all-in cost: https://www.cekura.ai/blogs/retell-ai-pricing-per-minute · https://www.cloudtalk.io/retell-ai-pricing/
- Vapi (alt, HIPAA +$2k/mo): https://vapi.ai/pricing · https://www.cloudtalk.io/blog/vapi-ai-pricing/
- Internal: `PROJECT_BRIEF_v2.md`, `PHYSIO_WORKFLOW.md`, `vertical/VERTICAL_BIBLE.md`, `CLINIC_CRM_GAP.md`, `JANE_INTEGRATION.md`
