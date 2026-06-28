# Data Spine — the shared model every module reads & writes

*The single source of truth for the RUNTIME data layer (the SaaS app DB). This is the contract that lets Modules A (voice), B (pipeline), C (attribution), and later D/E plug in without breaking each other — the "change one module, don't break the rest" rule, learned from the ERP. `DATA_ARCHITECTURE.md` says **where** data lives (our CRM vs Jane); this says **what the objects are, who owns each field, and how they join.** Grounded in `DECISION_MEMO.md` (ad→lead→booked→revenue), `PROJECT_BRIEF_v2.md` (own-the-funnel, single-source-of-truth, PHIPA), `JANE_TEARDOWN.md` (Jane owns patient/billing; pre-patient + attribution is ours), `MODULE_A_voice.md` / `MODULE_A_script.md`.*

**Status:** v1 design, for founder sign-off. Tags: `[LOCK]` = decided/load-bearing · `[E]` = proposed, open to change.

---

## 0. Three principles (these are the whole point)

1. **`[LOCK]` One writer per field.** Every field has exactly ONE system/module that may write it; everyone else reads. No field is written by two modules. This is what stops a change in Module A from corrupting Module C's numbers. The "Owner" column in §3 is the contract.
2. **`[LOCK]` Modules talk through EVENTS, not by reaching into each other.** A module emits a domain event (`lead.created`, `call.completed`, `booking.created`, `patient.confirmed`, `payment.recorded`) onto a shared bus; other modules subscribe. No module calls another module's internals or writes another's tables. Swap/upgrade a module → as long as it emits/consumes the same events, nothing else changes.
3. **`[LOCK]` Stable IDs are the join.** Every entity has an immutable id, and the **attribution chain** (§5) is just those ids linked end-to-end: `ad_click → lead → activities → booking → patient → payments`. Module C is "follow the ids." If the ids don't link, attribution dies — so capturing the join at each hop is non-negotiable.

---

## 1. The lifecycle spine (what a record IS at each stage)

```
ad/organic source → LEAD ──(worked by voice + pipeline)──► BOOKING (first visit / trial)
                                                              │
                                            confirmed? ──no──►(stays a LEAD, nurtured)
                                                              │ yes
                                                              ▼
                                          PATIENT (handed to Jane; Jane owns the chart)
                                                              │
                                            conversion meeting / deferred-payment trial ends
                                                              ▼
                                          PAYING PATIENT (setup fee + monthly; revenue counts)
                                                              │
                                          retained / lapsed ──► reactivation (Module E)
```

- **Pre-patient (LEAD → BOOKING) = OURS.** Our CRM is system-of-record. This is the moat (`DATA_ARCHITECTURE.md`).
- **PATIENT + chart + billing = Jane's.** We hold only a reference + read-back of revenue/visit signals (`JANE_TEARDOWN.md`: don't rebuild billing).
- **Revenue counts only when `paying = true`** (the deferred-trial rule from the prototype's Phase 5; the patient always owes their own ad spend regardless).

---

## 2. Entities (one line each — fields in §3)

| Entity | What it is | System of record |
|---|---|---|
| **Clinic** | the tenant (one per clinic/account); carries config + capacity setting + residency region | Our CRM |
| **Channel** | an ad/organic source + its **spend** (Meta campaign, Google campaign, GBP, referral, direct) | Our CRM (spend ingested from ad platforms) |
| **Lead** | a person who showed interest but isn't a confirmed patient yet | **Our CRM** `[LOCK]` |
| **Activity** | any touch on a lead: call, SMS, email, WhatsApp, meeting, stage-change (append-only log) | Our CRM |
| **Call** | a phone interaction (recording + transcript + structured outcome) — a specialized Activity | Our CRM (via Retell) |
| **Booking** | an appointment our flow created, at stage `booked-pending-EMR` then handed off | **Our CRM** `[LOCK]` |
| **Patient** | a confirmed patient — our side holds a thin reference + a `jane_patient_ref` | Jane (we hold reference only) |
| **Payment/Revenue** | money events used for ROI (first-visit revenue, monthly fee) | Jane (we **read** it back) |

---

## 3. Single-source-of-truth field map (the contract)

Only the **Owner** writes; the **Readers** read. (Abbrev: A=voice, B=pipeline, C=attribution, EMR=Jane, AD=ad-platform sync, U=user/UI.)

### Clinic (tenant)
| Field | Owner | Readers | Notes |
|---|---|---|---|
| `clinic_id` | system | all | immutable |
| `name`, `disciplines[]`, `locations[]`, `hours`, `clinicians[]` | U | A,B,C | safe-blocks config for the voice agent |
| `insurers_direct_billed[]` | U | A | drives the insurance Q&A; never quote $ amounts |
| `capacity_mode` (`growing`\|`full`) | U | A,B | selects the inbound script variant (`MODULE_A_script.md` §2) |
| `data_region` (`ca-central`) | system | all | `[LOCK]` residency moat — SMS/AI stay Canadian (`JANE_TEARDOWN.md`) |
| `emr_type` (`jane`\|`cliniko`\|`juvonno`\|…), `emr_handoff_mode` (`manual`\|`rpa`\|`api`) | U | B | how confirmed patients reach the EMR |

### Channel (the cost side — this is what Jane structurally lacks)
| Field | Owner | Readers | Notes |
|---|---|---|---|
| `channel_id`, `platform`, `campaign_id/name`, `adset/ad` | AD | C | synced from Meta/Google ad accounts |
| `spend`, `impressions`, `clicks`, `currency`, `date` | AD | C | the cost side of CPA/ROAS; never mix currencies in one number `[LOCK]` |
| `tracking_number` / `utm_template` | system | A,C | the join handle: which number/UTM = which channel |

### Lead `[LOCK]` (ours)
| Field | Owner | Readers | Notes |
|---|---|---|---|
| `lead_id` | system | all | immutable; the spine's anchor |
| `clinic_id` | system | all | tenant scope |
| `name`, `phone`, `email` | A or U | B,C | **PHI-lite** (contact only); captured on first touch |
| `discipline`, `new_or_returning`, `reason_text` | A | B | reason = free-text context, NOT clinical probing (`MODULE_A` rule) |
| `source_channel_id` | A/system | C | **the attribution join** — set from tracking number / UTM at capture |
| `status` (`new→contacted→qualified→booked→won→lost→nurturing`) | B | A,C | pipeline stage; B is the only writer |
| `consent_flags` (recording, marketing, contact) | A/U | A,B | recording-disclosure + opt-in for any outbound |
| `created_at`, `sla_clock_start` | system | B,C | weekday-SLA: weekend arrivals start Monday (Phase-5 rule) |

### Activity / Call (append-only)
| Field | Owner | Readers | Notes |
|---|---|---|---|
| `activity_id`, `lead_id`, `type`, `direction`, `timestamp` | originating module | B,C | append-only — never mutated |
| `call.recording_url`, `call.transcript`, `call.outcome` (`booked`\|`message`\|`out-of-area`\|`spam`) | A | B,C | stored in our CRM, source-tagged; PHI-sensitive → BAA pipeline, never into the RAG corpus `[LOCK]` |
| `call.handled_by` (`ai`\|`human`) | A | C | for the de-identified fleet-learning loop |

### Booking `[LOCK]` (ours, then handed off)
| Field | Owner | Readers | Notes |
|---|---|---|---|
| `booking_id`, `lead_id`, `clinic_id` | B | C,EMR-handoff | links the booking back to the lead → the chain holds |
| `slot_time`, `clinician`, `service` | A (creates) / B | EMR-handoff | created at stage `booked-pending-EMR` |
| `handoff_state` (`pending`\|`in-emr`\|`failed`) | B | U,C | manual/RPA/API push to Jane |
| `is_trial`, `trial_started_at` | B | C | deferred-payment trial begins here |

### Patient & Revenue (Jane owns; we hold references / read back)
| Field | Owner | Readers | Notes |
|---|---|---|---|
| `jane_patient_ref` | EMR-handoff | C | the thin link from our Booking → Jane's patient |
| `paying` (bool), `became_paying_at` | EMR/U read-back | C | revenue counts ONLY when true `[LOCK]` |
| `first_visit_revenue`, `monthly_fee`, `currency` | EMR read-back | C | read from Jane (Referral/Sales reports / API when available); we never write Jane's billing |

---

## 4. Module read/write map (who depends on what)

| Module | WRITES | READS | Emits | Consumes |
|---|---|---|---|---|
| **A — Voice / missed-call** | Lead (create+contact fields), Call, Booking (create) | Clinic config, Channel (tracking#) | `lead.created`, `call.completed`, `booking.created` | — |
| **B — Pipeline / speed-to-lead** | Lead.status, Booking.handoff_state | Lead, Activity, Call | `lead.status_changed`, `patient.confirmed` | `lead.created`, `call.completed` |
| **C — Attribution** | (nothing in others' tables) — only its own derived rollups | EVERYTHING + Channel.spend + Revenue read-back | `attribution.updated` | all events |
| **AD sync** | Channel (+ spend) | — | `channel.synced` | — |
| **EMR handoff** | Booking.handoff_state, jane_patient_ref | Booking, Lead | `patient.confirmed` | `booking.created` |
| **Jane (external)** | its own chart/billing | — (we read revenue back) | — | — |

**Key reads of the design:** C **never writes** another module's data — it only consumes events + reads, and derives ROI. So C can be rebuilt or re-run anytime without risk. A only *creates* leads/bookings; B owns their *status* afterward → no write-collision on the lead.

---

## 5. The attribution chain (Module C's whole job = follow the ids)

```
Channel(spend)  ──tracking#/utm──►  Lead.source_channel_id
Lead ──lead_id──► Activity/Call ──► Booking ──booking_id──► jane_patient_ref ──► paying + revenue
```

Cost-per-booked-patient & ROAS by channel =
`Channel.spend  ÷  count(Bookings where lead.source_channel_id = channel, is_trial→paying)`
and `revenue ÷ spend` using the read-back `first_visit_revenue + monthly_fee`.

**This join is the product.** Jane can't do it (no lead object, no channel/spend, no tracking on its booking URL — `JANE_TEARDOWN.md`). Each hop MUST persist the upstream id or the chain breaks:
- capture `source_channel_id` at the **first touch** (tracking number → channel; or UTM if the lead came via web form);
- keep `lead_id` on every Activity/Call/Booking;
- write `jane_patient_ref` at handoff so revenue read-back rejoins the chain.

> ⚠️ The weakest link is **organic/phone calls with no UTM** — solved by **per-channel tracking numbers** (Module A): the number dialed = the channel. The 3 founder Jane-tests (`JANE_TEARDOWN.md §8`) determine whether the web-booking hop can also carry UTMs.

---

## 6. PHI & residency tags (the compliance moat, in the schema)

- **PHI-sensitive:** `call.recording_url`, `call.transcript`, `reason_text`, anything clinical. → stay in the BAA-covered pipeline + **Canadian region**; **never** promoted into the RAG knowledge corpus or fleet-learning except as de-identified aggregates `[LOCK]`.
- **PHI-lite:** name/phone/email — minimum necessary, Canadian region.
- **Non-PHI:** Channel/spend/campaign, clinic config, derived ROI rollups.
- `data_region = ca-central` on every tenant; SMS (Notifyre) + AI processing kept Canadian → the residency claim Jane can't make (`JANE_TEARDOWN.md §5`).

---

## 7. What this locks vs leaves open

**Locked by this doc:** one-writer-per-field; event-driven module decoupling; stable-id attribution chain; Lead/Booking are ours, Patient/billing are Jane's; revenue counts only when `paying`; PHI stays in-region & out of the KB.

**Open (founder / next specs):**
1. **Event bus mechanism** — in-process emitter for MVP vs a real queue (defer to build; the *contract* is what matters now). `[E]`
2. **Web-booking UTM capture** — depends on the Jane booking-URL test (`JANE_TEARDOWN.md §8 Q1`).
3. **Revenue read-back path** — manual entry vs Jane Referral/Sales export vs JDP API (`§8 Q2`); until then `paying`/`revenue` may be hand-entered at the conversion meeting.
4. **Multi-EMR field mapping** — Cliniko/Juvonno have open APIs (easier read-back) vs Jane; per-EMR adapter defined when we build Module C.
5. **Identity resolution** — dedupe the same person arriving via call + web form (match on phone/email) before they become a Lead, so the chain doesn't fork. `[E]`

---

*Next: with the spine locked, Module C (attribution) is "implement §5 over §3." Evidence base: `DECISION_MEMO.md`, `JANE_TEARDOWN.md`, `MODULE_A_voice.md`/`MODULE_A_script.md`, `DATA_ARCHITECTURE.md`.*
