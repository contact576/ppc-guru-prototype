# Module A — Voice-Agent Design (evidence-grounded refinement)

**What this is.** The refined, customer-evidence-grounded design for OUR AI voice / missed-call front desk — the wedge. It takes the spec in `MODULE_A_voice.md` (architecture, COGS, telephony, compliance, locked rules) as given and sharpens the **job priorities, scripts, tone, and guardrails** using the verbatim research in `VOICE_OF_CUSTOMER.md`. Where that file is the evidence layer, this is the build target.

**Locked rules carried from `MODULE_A_voice.md` (do not relitigate here):** book into **OUR pipeline**, not Jane directly (stage `booked-pending-EMR`, source-tagged); recording-disclosure safe-block fires at pickup; **never quote coverage dollar amounts**; capture name + callback number on every call (never a dead end); Retell engine, Canada-first/PHIPA posture; connect via conditional call-forwarding (Day-1), not porting.

**Tags:** [V] verbatim customer quote (source in `VOICE_OF_CUSTOMER.md`) · [E] our synthesis/decision.

---

## 1. Validated job list (ranked by what the data PROVES clinics want)

Each job: what it is, in/outbound, the evidence, and a confidence read.

| # | Job | Dir | The proof (verbatim) | Strength |
|---|---|---|---|---|
| **1** | **Inbound missed / after-hours / overflow capture** | Inbound | "they can call on a Sunday at 2 o'clock and make an appointment" · "we aren't going to answer the phone at 1am" · "these patients are waiting 3 days sometimes for a response" · "clinics want us to answer their phone" | **Highest.** Named by owners in their own words across 5 sources; market literally asks for it. |
| **2** | **Instant missed-call text-back** | Outbound (auto) | "those callbacks where you can very easily miss an opening, especially after the clinic has closed" · after-hours callers "book with whoever answers first" | **High.** Zero integration needed; fires only when a human wasn't going to answer. |
| **3** | **Cancellation → waitlist fill** | Outbound | "if someone cancels they might be able to fit them in [off a cancellation list]" · "the schedule stays full without anyone having to manually call around" · owner's whole job "is ensuring all my therapists are busy" | **High** for at-capacity clinics. |
| **4** | **Reactivation / recall** | Outbound | "patient recalls... increase overall revenue by 30 to 40%" · "80% of your revenue comes from patients you already have" | **High value, but** brushes the "salesy" objection — needs care framing. |
| **5** | **Rebooking confirmation (next-visit)** | Inbound + outbound | "that person does not know the answer... they want you to say, here's when you should come back" · "part of feeling cared for is knowing what the next steps are" | **High** and uniquely objection-proof (it's care, not sales). |
| **6** | **Intake-form chase** | Outbound (low-touch) | "if the intake form isn't in, the practitioner sits there 15 minutes in a paid visit collecting it" · "low touch is automated... a reminder the intake form isn't completed" | **Medium.** Clear ROI, low risk, but a small money mover vs #1. |
| **7** | **No-show / late-cancel dunning** | Outbound | "we tried to run the card, it was unsuccessful, wondering how you might settle that" · card-on-file → phone → letter ladder | **Medium, defer.** Real pain but emotionally loaded + collections/compliance risk; owners want it "fair, not punitive." |

### 🚢 SHIP FIRST: Jobs 1 + 2 (inbound after-hours/overflow capture **with** instant missed-call text-back)
**[E] Rationale — highest pain + lowest risk + dodges the "not salesy" objection:**
- **Highest pain, in their words.** The missed/after-hours call is the only job owners describe as a literal, recurring revenue leak ("waiting 3 days," "call on a Sunday at 2," "clinics want us to answer their phone"). It needs no behavior change from them.
- **Lowest risk.** The text-back and after-hours pickup fire **only when a human wasn't going to answer anyway** — so there's no "robot embarrassing me in front of a patient the desk would have handled" downside. [V] "I've heard a few of these calls. It sounds a little robotic..." — the fear is real; restricting V1 to the unanswered call neutralizes it.
- **Dodges the not-salesy wall entirely.** Answering a call the patient *initiated* is pure service, never outreach. The objection-heavy jobs (reactivation #4, dunning #7) all involve the clinic *reaching out* — exactly the "feels desperate or thirsty" trigger. Ship the inbound job that no one can call salesy first; earn trust; layer outbound later.
- **It feeds the loop the point-solutions never close.** Every captured call → source-tagged lead + transcript → Module B (pipeline) + Module C (attribution). Jobs 3–7 then ride the same engine.

**[E] Fast-follow order:** #5 rebooking-confirmation (objection-proof, "it's care") → #3 cancellation-fill (at-capacity buyers) → #4 reactivation (care-framed) → #6 intake chase → #7 dunning (last, gated on compliance review).

---

## 2. Capacity segmentation → two inbound scripts (same engine)

**[E] The buyers split cleanly by capacity, and the research proves it.** Onboarding must ask one question — "are you trying to fill more new-patient slots, or keep a full book full?" — and select the script accordingly.

| | **(a) GROWING clinic** | **(b) FULL / at-capacity clinic** |
|---|---|---|
| Signal | [V] "she's been swamped, we'll need to bring someone on" · "my job is keeping everyone busy" | [V] "I'm at capacity... I pump the brakes on social media" · "bursting at the seams" |
| Caller goal | New patient wants in | Existing/new caller, but the book is tight |
| Agent's job | **New-patient capture** — qualify, offer a concrete slot, book, confirm | **Cancellation-fill + triage** — offer waitlist/short-notice openings, capture for callback, route urgent vs routine |
| Primary CTA | "I've got Thursday 2:15 or Friday 9:30 — which works?" | "We're quite full this week — want me to put you on our cancellation list and text you the moment something opens?" |
| Avoids | Over-promising slots that don't exist | Sounding like a brush-off — frame the wait as demand, offer the next real option |

Same Retell engine, same safe-blocks config, **two script variants** toggled by the clinic's capacity setting (changeable any time — a clinic that fills up flips from (a) to (b)).

---

## 3. Inbound new-patient script (the GROWING-clinic skeleton)

Woven with real phrasing. `[clinic config]` = safe-block fields. Bracketed `[V: ...]` tags mark where a line is lifted from verbatim research.

```
0. RECORDING DISCLOSURE  (locked safe-block, fires at pickup)
   "Thanks for calling — just so you know, this call may be recorded to help us
    book your appointment."

1. GREETING  (warm, local, human — never "press 1")
   "Thanks for calling [Clinic Name], this is the front desk — how can I help you today?"
   [V: model on "Good morning, [Clinic], this is [Name], how can I help you?" and the
    Gabrielle first-visit warmth — sound like a person, not an IVR.]

2. TRIAGE DISCIPLINE + NEW/RETURNING  (the two front-desk filters, in order)
   → "Are you looking to come in for [physio / chiro / massage / acupuncture]?"   [clinic config]
   → "Have you been in to see us before, or is this your first visit?"
   [V: "it starts at the front desk — a little triage to have a good match."]

3. REASON  (capture, do NOT clinically probe — minimize PHI)
   → "And what's bringing you in?"   (free-text context only; never diagnose)
   [If nervous / first-visit / chiro-safety question → SOOTHE, don't sell:
     "Totally normal to feel a bit unsure — here's what a first visit looks like, and you
      can pause, ask questions, or decline anytime."
    [V: patients arrive "in really vulnerable places during a really hard time";
        chiro callers fear "is it safe / does it hurt / the cracking sound."]]

4. INSURANCE — DIRECT-BILL Q&A  (name REAL Canadian insurers; honest hedge; NO $ amounts)
   → "Do you have extended health benefits you'd like us to direct-bill?"
   → "Great — which provider? We direct-bill most major plans —
      Sunlife, Manulife, Canada Life, Blue Cross [clinic config of which they bill].
      You'll want to confirm your own coverage, but we can submit the claim for you."
   [V: "who wants to read those 20-30 pages of insurance jargon?" → keep it simple.
    LOCKED: never quote a coverage dollar amount.]

5. OFFER A CONCRETE SLOT  (the whole point — offer a specific time, twice)
   → "Let me grab the next openings... I've got Thursday at 2:15 or Friday at 9:30 with
      [clinician / first available] — which works better?"
   [V: patients "want to talk to someone, answer a few questions, and walk away with an
        appointment" — win the booking in the first contact; never send to voicemail.]

6. CAPTURE  name + callback number + email   (ALWAYS — even if no booking)
   → "Perfect — can I grab your name, the best number, and an email for the confirmation?"
   [V: "can I take your number in case we get cut off?" — never a dead end.]

7. BOOK + CONFIRM
   → creates booking object in OUR pipeline @ 'booked-pending-EMR', source-tagged.
   → "You're booked for Thursday at 2:15. I'll text you a confirmation and an intake link
      so you can fill it out from home before you arrive."
   [V: intake-before-arrival saves a paid 15 min; SMS confirmation fires immediately.]
   → SMS confirmation sends now (single source of truth = OUR CRM).

8. FALLBACK LADDER  (never a dead end)
   → No slot fits → "Want me to text you a couple of options to pick from?" (message + SMS)
   → Complex / emotional / clinical → "Let me have one of our team call you right back."
      [V: "if it's medically specific we send it to the doctor" — escalate, don't answer.]
   → During hours + needs a human → warm-transfer to the desk
   → Anything captured → name + number ALWAYS taken → lead created, source-tagged
```

**[E] FULL-clinic variant (3b)** swaps step 5 for the cancellation-fill CTA and keeps steps 0–4, 6–8 intact:
```
5'. "We're quite full this week — that's actually how busy it's been. Want me to add you
     to our cancellation list and text you the moment a spot opens? And if anything's urgent,
     I can have the team call you back today."
   [V: "if someone cancels they might be able to fit them in"; frame fullness as demand,
        offer the next real option, capture for callback.]
```

---

## 4. Outbound rebooking / win-back script (fast-follow, care-framed)

**[E] The hardest objection in the vertical is that chasing patients "feels desperate or thirsty." The script must sound like care and continuity, never a sales chase. Lift the rebooking-as-care and dunning language verbatim.**

```
REBOOKING CONFIRMATION  (Job #5 — the objection-proof one; trigger: visit ended, no next booked)
   SMS or call:
   "Hi [Name], it's [Clinic]. [Clinician] recommended we see you again to keep your
    progress going — I've got [day/time] or [day/time]. Want me to lock one in?"
   [V: "they want you to say, here's when you should come back"; "we're booking these to
        ensure consistency and continuity in your care, and your preferred times."
        Frame = care/next-step, NOT "don't lose you."]

REACTIVATION / RECALL  (Job #4 — care-framed; trigger: lapsed 3/6/12 mo, or benefits-reset season)
   "Hi [Name], it's [Clinic] — it's been a while and we wanted to check in on how you're
    feeling. If you'd like to come back in, your extended benefits may reset soon, so now's
    a good time. Want me to find you a spot?"
   [V: "use your benefits before they reset," "let's finish what we started" — care, not pitch.
        Soothe the owner's guilt: this is the 30-40% revenue lift they under-work.]

NO-SHOW / LATE-CANCEL DUNNING  (Job #7 — DEFER; compliance-gated; "fair, not punitive")
   First touch (warm, after a single miss):
   "Hi [Name], we missed you at [time] today — totally understand things come up.
    Just a reminder of our cancellation policy so we can keep that time open for you and others."
   Payment touch (only if card-on-file config + owner opt-in):
   "We're so happy to have you as a client. We noticed the missed appointment — we tried the
    card on file and it didn't go through. Wondering how you might be able to settle that?"
   [V: the exact verbatim ladder — card → phone → letter; "there is a financial cost to
        missing a session, that's a spot that could have been filled." LOCKED: framing is
        "fair for everyone, not punitive"; human review before any collections escalation.]
```

**[E] Outbound guardrails:** all outbound is opt-in per clinic; reactivation honors do-not-contact; dunning never auto-escalates past the first warm reminder without a human; cap follow-up frequency (the "send it send it send it" instinct must be throttled so the agent never *becomes* the thirsty behavior owners dread).

---

## 5. Tone & guardrail rules (each justified by a quote)

| # | Rule | Why (verbatim) |
|---|---|---|
| 1 | **Sound human and local, never robotic.** Plain language, warm, by-name. No "press 1." | [V] "I've heard a few of these calls. It sounds a little robotic..." · "our voice is authentic... let's hear some authenticity" · model on the Gabrielle greeting. |
| 2 | **Care, not sales.** Every line frames the patient's benefit (their preferred times, continuity of care), never pressure. | [V] "I love the non-salesy aspect... my work should speak for itself" · "I'm not trying to sell" · reframe: "what's the positive for the client? their preferred times." |
| 3 | **Escalate clinical / emotional to a human — never diagnose.** Answer logistics; route anything medical. | [V] "if it's medically specific we send it to the doctor and reply on their behalf" · "AI is not my therapist" · capture reason but "do NOT probe clinical detail." |
| 4 | **Keep a human in the loop; the agent is an assistant, not a decision-maker.** | [V] "it's just a draft tool, not a decision tool... we still have liability" · "keep a human in the loop" · "human powered first, tech enabled second." |
| 5 | **Disclose AI if asked, and be data-safe.** Recording disclosure fires at pickup; honest about data handling. | [V] "I just say, hey I'm using this tool... I haven't had anyone decline" · callers ask "what do they do with my data... it's not used to train the model, deleted after x days." |
| 6 | **Protect the care moment / never a dead end.** Capture name + number every time; no awkward voicemail loop. | [V] "no awkward pause... no scrambling for a credit card" · patients "don't want to leave a voicemail and wait — they ghost" · "can I take your number in case we get cut off?" |
| 7 | **Never quote coverage dollars; name real insurers with an honest hedge.** | [V] "who wants to read 20-30 pages of insurance jargon?" + locked PHI rule (MODULE_A_voice.md §2.4). |
| 8 | **Throttle outbound so the agent never feels "thirsty."** Opt-in, frequency-capped, care-framed. | [V] "reaching out a hundred times can feel desperate or thirsty." |

---

## 6. Open questions / what still needs founder or real-call validation

1. **The robotic-voice bar.** [V] "it sounds a little robotic" is the single most dangerous failure. Needs a real founder/clinic listen-test on Retell's voice + latency before any clinic goes live — does it clear the authenticity guardrail for nervous/vulnerable callers?
2. **Reactivation framing without the "thirsty" trip.** The 30–40% revenue lift is real, but reactivation is outreach. Validate the care-framed wording on real lapsed patients (response rate AND complaint/opt-out rate) before scaling Job #4.
3. **Dunning (Job #7) compliance + tone.** Card-on-file collections via an AI carry consent/PHIPA/financial risk and the "fair not punitive" value constraint. Needs a compliance + legal review and explicit per-clinic opt-in; likely human-only escalation past the first reminder. Confirm it's even worth shipping vs leaving to the desk.
4. **Capacity self-segmentation accuracy.** Will owners correctly self-identify "growing" vs "full," and how often do they flip? Validate the onboarding question + a usage signal (e.g., booking-rate) that could auto-suggest the switch.
5. **Escalation threshold per clinic.** When does the agent transfer/take-a-message vs handle it? Needs a sane default + each owner's risk tolerance (the "robot embarrassing me" fear).
6. **Insurer config + honest hedge wording.** Confirm the canonical CA insurer list, per-clinic which-plans-billed, and legally-reviewed hedge phrasing (carried open from MODULE_A_voice.md §3).
7. **Real-call script refinement.** This skeleton is grounded in podcast/testimonial language, not live clinic calls. The highest-leverage upgrade is recording a handful of the clinic's own best front-desk calls (Job 2 / model-B telephony, gated on two-party-consent review) to tune cadence and objection-handling to that clinic's real voice.
8. **Rebooking trigger source.** Job #5 needs to know a visit ended with no next booked — which requires reading appointment state from Jane/Cliniko/Juvonno. Confirm the availability/state read path per EMR (carried from MODULE_A_voice.md open Qs).
