# 📖 VERTICAL BIBLE — Canadian Allied-Health Clinic (Physio · Chiro · Massage/RMT)

**Purpose.** Deep customer + industry immersion to sharpen our product, AI voice-agent scripts, and marketing copy — and to seed the RAG knowledge base ("the map") that grounds the voice agents. This is the *who/why/how-they-talk* layer that sits on top of [[PHYSIO_WORKFLOW]] (the *what-leaks-money* workflow spine). Scope: small owner-operated Canadian clinics (<10 staff). Date: June 2026.

**How to read the graph.** Concepts are linked Obsidian-style with `[[wikilinks]]` so Graph view forms a knowledge network. Personas link to the [[Patient Journey]] stage where they act, to the [[Pains & Money Leaks]] they feel, and to the product **Module** (A–H, defined in [[PHYSIO_WORKFLOW]]) that addresses each.

**Confidence tags.**
- `[HIGH]` — corroborated across multiple independent sources, or a peer-reviewed / first-party stat.
- `[MED]` — directional; single decent source, industry-typical, or vendor-marketing-flavoured.
- `[LOW]` — plausible inference / our synthesis, thinly sourced.
- `[INFER]` — explicitly OUR reasoning, not a sourced claim.

**Honesty note (read this).** WebFetch was blocked (HTTP 403) on Jane's *Front Desk Digital* site, Buzzsprout, and most consumer clinic/review sites — bot protection, not a proxy fault. So **direct verbatim podcast transcripts and full review pages could not be scraped.** Quotes below are either (a) phrases surfaced inside search-engine result summaries (paraphrase-risk: MED) or (b) clearly tagged `[INFER]`/`[PATTERN]` syntheses. **No quote here is invented — where I could not verify exact wording, it is marked.** The single highest-leverage upgrade to this Bible is a human pasting actual *Radio Front Desk* episode transcripts and 50–100 raw Google/RateMD reviews; see [[SOURCES]] for the exact list.

---

## 1. 👤 CLINIC OWNER persona  `#persona/owner`

### 1.1 Who they are
The prototypical owner is a **practicing physio / chiro / RMT who became an accidental businessperson**. They went to clinical school, got good at hands-on care, then opened (or bought into) a clinic — and discovered the job is now 50% operator, marketer, HR, and bookkeeper.

> "Clinicians are trained to assess, treat, and support recovery — **not to manage complex workflows, chase invoices, or troubleshoot software**. Yet in private practice, these tasks are unavoidable." `[HIGH]` — Physiotutors (paraphrase of source summary)
> "Therapists in private practice are especially vulnerable because they often **wear every hat: clinician, business owner, marketer, and admin**." `[HIGH]` — Physiotutors

- They commonly work **50–60 hrs/week**, and a recurring, bitter realization is that **owners sometimes earn *less* than they did as a treating clinician** once unpaid overtime is counted. `[MED]` — USAHS / CoreMedical burnout pieces.
- **Up to ~1/3 of working time** goes to non-clinical admin (documentation, coordination, software). `[MED]` — Physiotutors.
- This is the emotional core of the owner: **competent and respected clinically, insecure and resentful operationally.** → ties to [[Owner business-education gap]].

`[INFER]` Three owner archetypes we'll meet (use for segmentation + script tone):
1. **The Solo Builder** — 1–2 practitioners, often a physio or RMT who *is* the front desk between patients. Maximum pain on [[Missed & after-hours calls]]; zero spare hands. Most receptive to "answers the phone so you don't have to."
2. **The Growth-Stage Owner** — 3–8 staff, one front desk person, starting to spend on ads. Feels [[Marketing blindness]] hardest; this is the buyer for Modules **B/C** (pipeline + attribution).
3. **The Multi-Disc Operator** — physio + chiro + RMT under one roof, the busiest book; cares about throughput, [[Rebooking & plan-of-care drop-off]], and not losing the lunch-hour caller.

### 1.2 Goals (what "success" means to them)
- A **full, predictable book** — fewer empty slots, fewer last-minute holes. `[HIGH]` (recurring across owner/marketing sources)
- **Time back** — to treat patients (their identity + their highest-paid hour) instead of doing admin. `[HIGH]`
- **Grow without feeling "salesy."** Owners want growth that feels like *good care*, not pushy selling — "maximising your clinical skills… **without feeling 'salesy'**." `[MED]` — The Go-To Physio. This is a *huge* tonal constraint on our copy and scripts → see [[Beliefs & Objections]].
- **Retain patients ethically** — finish plans of care rather than churn through new patients. A named owner frustration: "therapists **don't get patients back in enough and discharge too quickly**." `[MED]` — The Go-To Physio. Links [[Rebooking & plan-of-care drop-off]].
- **Be the trusted local expert / niche** — "When you specialise, you become **memorable, referable, and trusted**." `[MED]` — Culture of One / OwnerHealth.

### 1.3 How they think about marketing, growth & money
- **They run ads but can't read them.** Only ~**26%** of clinic owners know their cost-per-acquisition; ~74% can't tie ad spend to a paying patient. `[MED]` — PT Marketing Pros (carried from [[PHYSIO_WORKFLOW]]). This is the central owner blind spot → [[Marketing blindness]], Module **C**.
- **Their growth instinct is referral-and-relationship, not paid-funnel.** Default playbooks they trust: word-of-mouth, GP/specialist referrals, networking with gyms/sports teams/hairdressers, "open house" events, niching. `[MED]` — OwnerHealth, Culture of One, WebPT. Paid ads feel foreign and risky to them.
- **Money mindset is cautious and ROI-anxious.** Every dollar on ads or software is weighed against "could I just see one more patient." → drives the objections in [[Beliefs & Objections]].
- **They confuse activity with results.** Agencies "**brag about clicks and impressions while clinic front desks remain quiet**." `[MED]` — paraphrase, marketing-agency sources. Owners *feel* this gap but lack the dashboard to prove it.

### 1.4 Fears
- `[INFER, strong]` **"I'm spending on ads and I don't know if any of it works."** (The blindness fear — Module C's wedge.)
- **Empty schedule / cash-flow gaps** from cancellations and no-shows — "a once-busy schedule suddenly emptied by cancellations or no-shows." `[MED]`
- **Burnout / always catching up** — "the feeling that you're **always catching up**." `[HIGH]` Physiotutors.
- **Being taken advantage of by an agency again** — `[INFER]` distrust from a prior agency that charged retainer and delivered "leads" that never became patients.
- **Looking foolish / unsafe with patient data** — `[INFER]` health-data privacy and "is this thing HIPAA/PHIPA-safe."
- **The robot embarrassing them** — `[INFER, strong]` an AI on the phone mishandling a patient and damaging their hard-won local reputation. See [[Beliefs & Objections]].

### 1.5 What they trust
- **Peers and word-of-mouth.** Other clinic owners, mentorship groups (e.g. "Go-To Physio"), and association communities. `[MED]`
- **Jane App.** Deeply trusted as the system of record (Canadian-built, ~near-ubiquitous in this vertical). New tools are judged by "does it play nice with Jane?" `[HIGH]` — see [[Jane App]] node.
- **Concrete, clinic-side proof** — booked appointments and a fuller schedule, not vanity metrics. `[MED]`
- **Plain language, no jargon.** They are clinicians, not marketers; pitches drowning in "CAC/LTV/attribution" lose them unless translated to "patients and dollars."

### 1.6 Why they resist new tools
- **No time / no headspace to learn one more system** (the burnout loop). `[HIGH]`
- **"I'm not technical"** self-image. `[INFER]`
- **Switching cost & Jane-lock-in** — anything that *replaces* Jane is a non-starter; only things that *sit beside* Jane get considered. `[HIGH]` (Jane has no open API → [[PHYSIO_WORKFLOW]] structural constraint).
- **Burned before** by agencies/software that overpromised. `[INFER]`
- **Fear it'll feel salesy / off-brand** to patients. `[MED]`

### 1.7 Daily pressures (the felt texture of the day)
Phone ringing while treating · front desk drowning at lunch · a no-show just blew a $120 hour · three web-form leads from yesterday still un-replied · payroll Friday · a 1-star review to answer · ads invoice came in and "I have no idea if it did anything." `[INFER, synthesis]` of sourced pains. → links every node in [[Pains & Money Leaks]].

---

## 2. ☎️ FRONT-DESK / RECEPTIONIST persona  `#persona/frontdesk`

### 2.1 Daily reality
The front desk is the clinic's **switchboard, concierge, billing clerk, and air-traffic controller — simultaneously.** In a busy multi-provider practice, front desk may field **300–500 calls/day**; even a small clinic's one receptionist is doing five things at once.

> "You see the phones ringing while your receptionist is **checking in a patient, pulling insurance cards, and fielding a question from billing — simultaneously**. You hear the hold music playing for the third caller in the queue." `[MED]` — OhMD (paraphrase of summary)

- **42% of incoming calls go unanswered during business hours** across medical practices (study of 7,000 calls / 22 practices). `[HIGH]` — cited via OhMD; corroborates [[PHYSIO_WORKFLOW]]'s ~43% figure.
- **Peak call times are exactly when the desk is busiest**: early morning, lunch break, and after 5 PM — when working patients call. `[MED]` — getNextPhone / answering-service sources. The overlap of "patient wants to call" and "no one free to answer" is the structural trap.

### 2.2 What overwhelms them
- **Phone-vs-in-person collision** — can't greet the patient at the desk AND answer the ringing phone. `[HIGH]`
- **Insurance / direct-billing questions** mid-checkout ("does my plan cover this? do you direct-bill Sunlife?") that take time and create errors. `[MED]`
- **Voicemail backlog** that never gets returned because the next rush hits. `[INFER, strong]`
- **Web-form / DM leads** that aren't anybody's explicit job, so they sit. → [[Slow lead follow-up]].

### 2.3 Where they drop the ball (the money leaks they own)
- **Missed calls → no callback.** The unanswered call rarely calls back; they book with whoever answers first. → [[Missed & after-hours calls]], Module **A**.
- **No-show / cancellation backfill** — a hole opens and there's no time to work the waitlist by hand (Jane's auto-waitlist helps here → [[Jane App]]).
- **No rebooking nudge at checkout** — patient leaves without the next appointment booked. → [[Rebooking & plan-of-care drop-off]].
- **Lead follow-up cadence** — nobody texts the inquiry back within 5 minutes. → [[Speed-to-lead]].

### 2.4 Common phrases / scripts they use  `[PATTERN — composite of how front desks actually speak; verify against real call recordings]`
- Greeting: *"Good morning, [Clinic Name], this is [Name], how can I help you?"*
- Booking: *"Are you looking to come in for physio, chiro, or massage?"* · *"Have you been in to see us before, or is this your first visit?"* · *"What's bringing you in?"*
- Insurance: *"Do you have extended health benefits you'd like us to direct-bill?"* · *"Which provider is that — Sunlife, Manulife, Canada Life/Great-West, Blue Cross?"* · *"You'll want to check your coverage, but we can direct-bill most major plans."* `[MED]` — direct-bill provider list is sourced (Sunlife, Manulife, Great-West, Blue Cross).
- Triage / hold: *"Let me check the schedule for you."* · *"Can I put you on a brief hold?"* · *"Can I take your number in case we get cut off?"*
- First-visit prep: *"Please arrive 10–15 minutes early to fill out your intake forms — or we can email you a link to do it from home."* `[MED]` (digital-intake-before-arrival is sourced).
- Rebooking: *"Would you like to book your next session before you go?"*

→ These are the **canonical patterns the AI voice agent must reproduce** in [[Language Bank]].

### 2.5 The relief they want
A second set of hands on the phone — something that **answers when they can't, texts the missed caller back, and books the easy ones** without breaking their concierge flow. Tools "free up front desk to do other things" is exactly how Jane already pitches reminders. `[HIGH]` — Jane positioning. We extend that to the *call* itself.

---

## 3. 🧑‍🦽 PATIENT persona(s)  `#persona/patient`

### 3.1 Why people seek care
- **Physio:** pain or injury that's interfering with daily life — lower-back pain, post-surgery rehab, sports injury, bulging disc, neck/shoulder. Patient language: *"terrible lower back pain,"* *"can't do daily activities without soreness or stiffness,"* *"experienced the difference immediately."* `[MED]` — Google-review phrasing surfaced in search (Results PT / Complete Care).
- **Chiro:** back/neck pain + a population that is **nervous and skeptical** — the questions are literally *"is it safe?", "does it hurt?", "what's the cracking sound?"* `[HIGH]` — these are the actual searched questions (Cannon/Northcote/The Joint sources).
- **Massage/RMT (Canada):** splits **relaxation vs. rehabilitation** — "Registered Massage Therapy for **Relaxation or Rehabilitation**." Review language: *"so relaxing,"* *"found exactly where chronic stiffness… was coming from,"* *"checks in throughout the session,"* *"booked my next appointment."* `[MED]` — Toronto RMT review summaries. Note the **insurance angle**: RMT is a covered benefit, so "direct billing" matters as much as relaxation.

### 3.2 How they CHOOSE a clinic (the decision funnel)  → [[Patient Journey]] stage 1
1. **"[service] near me"** Google search — proximity is the #1 filter. `[HIGH]` — universal search behaviour; "ensure you're the answer to *'the best physio near me'*." `[MED]`
2. **Google reviews / star rating** — *"90% check reviews before picking a provider; >75% choose based on reviews."* `[MED]` (carried from [[PHYSIO_WORKFLOW]]). Volume + recency of reviews is a trust signal (clinics brag "passed 10,000 Google reviews, 4.9★"). `[MED]`
3. **Insurance / direct billing** — "do you direct-bill my plan?" is a make-or-break filter for covered services. `[MED]`
4. **Referral** — from GP, specialist, friend, gym, or another patient. Trusted heavily. `[MED]`
5. **Can I actually book?** — same-day availability, online booking 24/7, and *someone who answers the phone.* `[MED]` — painPRO/ATI "same-day," 24/7 online booking sources.

### 3.3 What makes them BOOK vs. GHOST  → [[Speed-to-lead]] / [[Missed & after-hours calls]]
**They book when:** someone answers, answers a couple of questions, and they "**walk away with an appointment**."
> "Patients recovering from surgery or dealing with chronic pain **don't want to leave a voicemail and wait — they want to talk to someone, answer a few questions, and walk away with an appointment**." `[MED]` — KevinMD / answering-service sources.

**They ghost when:**
> "Patients **dread** the process of calling the front desk during business hours, leaving a voicemail, or playing phone tag, so they **simply ghost**." `[MED]`
- After-hours callers "**rarely call back — they book with whoever answers first.**" `[MED]` — carried from [[PHYSIO_WORKFLOW]].
- This is the **single most important patient-behaviour fact** for the voice agent: the booking is won or lost in the *first contact*. → Module **A/B**.

### 3.4 What makes them NO-SHOW or DROP OFF  → [[No-shows]] / [[Rebooking & plan-of-care drop-off]]
Hard numbers (`[HIGH]`, from a qualitative PT study + aggregators):
- **73% of patients miss at least one appointment** in a course of care.
- **20% discontinue after just 3 visits.**
- **70% don't complete their full plan of care.**

The five drop-out reasons, in patient terms (`[HIGH]` — ScienceDirect qualitative study + amp-healthcare):
1. **"I felt better"** — pain dipped, so they assume they're done (root cause still there).
2. **Access issues** — cost / financial burden, work & family conflicts, transport, travel time.
3. **"I can rehab on my own"** — felt they didn't need the clinic anymore.
4. **Other medical priorities** took over.
5. **Weak therapeutic alliance** — poor relationship with the provider; lack of visible progress → loss of trust.
Plus **forgotten appointments** (no reminder, life got in the way). `[HIGH]`

### 3.5 Patient anxieties (what to soothe in copy + scripts)
- **First-visit nerves** — "It's common to feel **anxious or a little stressed**… the anxiety usually starts long before you enter the clinic." `[MED]` Antidote: tell them exactly what to expect + send intake ahead of time.
- **Chiro-specific fear** — safety, pain, the cracking sound, fear of being "pressured." Reassurance that works: "you can **pause, ask questions, or decline** without being judged." `[HIGH]`
- **Cost / coverage worry** — "is this covered? how much out of pocket?" `[MED]`
- **Vulnerability** — undressing, being touched, being judged about their body/fitness. `[INFER, strong]`

### 3.6 The language patients use when searching/calling  → feeds [[Language Bank]]
`[PATTERN]` "physio near me," "physiotherapy near me open now," "chiropractor near me," "RMT near me," "direct billing physio," "same-day physio appointment," "best massage [city]," "is chiropractic safe," "what to expect first physio appointment," "do you take [insurer]."

---

## 4. 🛤️ PATIENT JOURNEY (friction at each step)  `#journey`  → mirrors the stages in [[PHYSIO_WORKFLOW]] Part 1

| Stage | What happens | Patient state of mind | Friction / leak | Persona who owns it | Module |
|---|---|---|---|---|---|
| **1. Discovery** | Searches "[service] near me", scans reviews, checks if you direct-bill | "Who's close, trusted, and covered?" | [[Marketing blindness]] — owner can't tell which channel produced them | [[#persona/owner]] | **C** |
| **2. Inquiry** | Calls / web-forms / DMs / walks in | "Can I just talk to someone and get booked?" | **THE #1 LEAK** — [[Missed & after-hours calls]]; 42% of calls unanswered; voicemail = ghost | [[#persona/frontdesk]] | **A** |
| **3. Lead follow-up** | (If missed) does anyone call/text back fast? | Already shopping the next clinic | [[Speed-to-lead]] — first to respond wins ~80%; web/DM leads sit for hours | [[#persona/frontdesk]] | **B** |
| **4. Booking + intake** | Books, gets intake forms, asks about insurance | "Will this be covered? what do I bring?" | Insurance verification is manual; paper intake wastes time + raises [[First-visit anxiety]] | [[#persona/frontdesk]] | (Jane core / H) |
| **5. First visit** | Assessment, history, plan-of-care set | Nervous, vulnerable, hopeful | [[First-visit anxiety]]; weak rapport seeds future drop-off | [[#persona/patient]] | — |
| **6. Plan of care** | Returns for the course of visits | Motivation fades as pain eases | [[Rebooking & plan-of-care drop-off]] — 20% gone by visit 3; 70% never finish | [[#persona/frontdesk]] | **D** |
| **7. Retention / reactivation** | Lapses 6–12 mo; benefits reset Dec 31 | Out of mind unless prompted | [[No reactivation]] — high-intent, near-zero-cost revenue that never gets worked | [[#persona/owner]] | **E** |
| **(cross-cut) Reviews/referrals** | Happy patient could refer / review | Willing if asked at the right moment | Asking is sporadic, human-dependent | [[#persona/frontdesk]] | **F/G** |

**The spine (carry from [[PHYSIO_WORKFLOW]]):** the clinic *lives and dies between the inquiry (stage 2) and the second booking (stage 6).* Jane owns the middle (book→chart→bill); **the money leaks are before the patient is in Jane and after they stop showing up.**

---

## 5. 💸 PAINS & MONEY LEAKS  `#pain`  (validates + extends [[PHYSIO_WORKFLOW]])

Ranked by our V1 wedge. Each is a node other sections link to.

### [[Missed & after-hours calls]] `#pain` → Module **A** · [[#persona/frontdesk]] · Journey stage 2
The clearest dollar leak. **42% of calls unanswered in business hours** `[HIGH]`; peak call times = busiest desk times `[MED]`; voicemail-averse patients **ghost** rather than wait `[MED]`; after-hours callers don't call back. A missed new-patient call ≈ **$400+** and up to ~$1,000 LTV `[MED]`.

### [[Speed-to-lead]] `#pain` → Module **B** · Journey stage 3
Respond in 5 min vs 30 ≈ up to **21× more likely to convert** (HBR); first clinic to respond converts ~**80%**, second <20% `[MED]`. Web-form/DM leads sit untouched for hours; no instant alert, no auto-text, no cadence.

### [[Marketing blindness]] `#pain` → Module **C** · [[#persona/owner]] · Journey stage 1/reporting
Only ~**26%** of owners know CAC `[MED]`; Jane has **no native Meta Pixel / Google Tag Manager** → owner literally cannot tie spend → paying patient `[HIGH]`. Agencies sell "clicks/impressions" while the book stays empty `[MED]`. "If you can't tell cost-per-new-patient by channel, you have a **guessing program**." `[MED]`

### [[No-shows]] `#pain` → mostly Jane's turf (reminders/waitlist) · Journey stage 6
No-show ~10%, cancellations ~20% → "**up to 1 in 3 appointments might not happen**" `[MED]`. Largely *mitigated* by Jane reminders + auto-waitlist `[HIGH]` — **not a clean greenfield**, but the *backfill-the-hole* moment is still painful.

### [[Rebooking & plan-of-care drop-off]] `#pain` → Module **D** · Journey stage 6
**20% drop after 3 visits; 70% never finish the plan** `[HIGH]`. Same-day rebooking → 30–50% more visits/yr; completing the plan → +40% LTV `[MED]`. Jane shows an *Unscheduled Patient Report* but **doesn't automate the chase** `[HIGH]`.

### [[No reactivation]] `#pain` → Module **E** · Journey stage 7
Dormant patients (6–12 mo), **Dec 31 benefits reset** trigger `[MED]`. A 500-patient reactivation ≈ 5–15% response → 25–75 bookings `[MED]`. Jane has the list but **no campaign engine** → owners must export to Mailchimp/Cyberimpact and DIY, so they don't `[HIGH]`.

### [[Reviews & referrals]] `#pain` → Modules **F/G** · cross-cut
90% check reviews; >75% choose on reviews `[MED]`. Jane has a passive *Referral Report* but **no review-request automation, no negative-feedback gating, no referral asks** `[HIGH]`.

### [[Owner business-education gap]] `#pain` (the *meta*-pain) → [[#persona/owner]]
Clinically trained, operationally untrained; ~1/3 of time on admin; 50–60 hr weeks; sometimes earning less than as a clinician `[MED/HIGH]`. **This is the emotional wedge** — our pitch is "give the clinician their time and their book back."

---

## 6. 🗣️ LANGUAGE BANK  `#language`  (for voice-agent scripts + marketing copy)

> **Sourcing caveat:** Items tagged `[REVIEW-PHRASE, MED]` were surfaced inside search summaries of real Google/clinic-review pages (paraphrase risk). Items tagged `[PATTERN]` are composites of how these speakers demonstrably talk, for script-building — **not** presented as verbatim quotes. Replace both with verbatim pulls once a human pastes raw reviews/transcripts (see [[SOURCES]]).

### 6.1 PATIENT voice — discovery & choosing
- "physio / chiropractor / RMT **near me**" · "**open now**" · "**same-day** appointment" `[PATTERN]`
- "Do you **direct-bill** my insurance?" / "Do you take **Sunlife / Manulife / Canada Life / Blue Cross**?" `[MED]`
- "Is it **covered**?" / "How much **out of pocket**?" `[MED]`
- "Is **chiropractic safe**?" / "**Does it hurt**?" / "What's the **cracking** sound?" `[HIGH — actual searched questions]`
- "What should I **expect** at my first appointment?" `[MED]`

### 6.2 PATIENT voice — outcomes / reviews (use in testimonial-style marketing)
- *"experienced the difference immediately"* `[REVIEW-PHRASE, MED]`
- *"reduced my terrible lower-back pain in just 3–4 sessions"* `[REVIEW-PHRASE, MED]`
- *"can do daily activities with no soreness or stiffness"* `[REVIEW-PHRASE, MED]`
- *"friendly reception… always a nice welcome"* / *"everyone in this office is very friendly"* `[REVIEW-PHRASE, MED]`
- RMT: *"so relaxing"* · *"found exactly where the tension was"* · *"checks in throughout the session"* · *"booked my next appointment"* `[REVIEW-PHRASE, MED]`

### 6.3 PATIENT voice — friction / ghosting (the words behind the leak)
- *"don't want to leave a voicemail and wait"* `[MED]`
- *"playing phone tag, so they simply ghost"* `[MED]`
- *"couldn't get through / no one answered"* `[PATTERN — implied by sources]`
- Drop-off rationalizations: *"I felt better,"* *"I can do it myself,"* *"I didn't see progress,"* *"life got in the way / I forgot."* `[HIGH]`

### 6.4 FRONT-DESK voice — the canonical scripts (model the AI on these)
- *"Good morning, [Clinic], this is [Name] — how can I help you?"* `[PATTERN]`
- *"Have you been in to see us before, or is this your first visit?"* `[PATTERN]`
- *"What's bringing you in today?"* `[PATTERN]`
- *"Do you have extended health benefits you'd like us to direct-bill?"* `[PATTERN, insurer list MED]`
- *"Let me check the schedule for you."* / *"Can I take your number in case we get cut off?"* `[PATTERN]`
- *"Please arrive 10–15 min early for intake — or I can email you the forms to do at home."* `[MED]`
- *"Would you like to book your next session before you go?"* `[PATTERN]` → the rebooking ask the AI/SMS should fire.

### 6.5 OWNER voice — how they talk about their problem (use in our marketing to THEM)
- *"I never went to school to run a business."* `[PATTERN — strongly supported by the business-education-gap sources]`
- *"I'm always catching up."* `[HIGH — near-verbatim from Physiotutors]`
- *"I'm spending on ads and I have no idea what's working."* `[INFER — the 26%-know-CAC stat in plain words]`
- *"The agency talks about clicks; my front desk is quiet."* `[MED paraphrase]`
- *"I don't want to feel salesy."* `[MED]`
- *"My therapists discharge patients too quickly / don't get them back in enough."* `[MED]`
- *"Does it work with Jane?"* `[HIGH — the universal qualifying question]`

### 6.6 Voice-agent design rules drawn from the above `[INFER, actionable]`
1. **Win the booking in the first contact** — never send to voicemail; always offer a concrete slot. (Counters the ghost behaviour.)
2. **Lead with the two patient filters:** *first-visit-or-returning?* and *what's bringing you in?* then *direct-bill?* — that's the front-desk triage order.
3. **Name real insurers** (Sunlife/Manulife/Canada Life/Blue Cross) — generic "we take insurance" reads as a robot.
4. **Soothe, don't sell.** For nervous chiro/first-visit callers, mirror the human reassurance script: *"It's totally normal to be a bit nervous — here's what the first visit looks like…"*
5. **Always offer the rebooking / reminder** and capture a callback number. → feeds Modules **A/D**.
6. **Sound local and human**, plain language — the owner's #1 fear is the robot embarrassing them. → [[Beliefs & Objections]].

---

## 7. 🧠 BELIEFS & OBJECTIONS  `#objection`  (what owners believe + what we'll hear when selling)

### 7.1 Core beliefs about marketing & software
- **"Word-of-mouth and referrals are the *real* way to grow."** Paid ads feel secondary/risky. `[MED]` → reframe: ads *fill the gaps* word-of-mouth can't; attribution *proves* which referrals/ads actually pay.
- **"Marketing that feels salesy is off-brand for healthcare."** `[MED]` → our copy + scripts must feel like *care*, not *sales*.
- **"Jane runs my clinic."** Anything new must **complement Jane, not replace it.** `[HIGH]` → always lead with "sits beside Jane / syncs via Google Calendar."
- **"Clicks and impressions aren't patients."** They're (rightly) skeptical of vanity metrics. `[MED]` → speak only in *booked* and *paying* patients and *dollars*.
- **"I can't measure it, so I half-believe it doesn't work."** The blindness *causes* the skepticism. `[MED]` → Module **C** turns belief into proof.

### 7.2 Objections we'll hear (and the honest counter)
| Objection (their words, `[PATTERN]`/`[MED]`) | What's underneath | Honest counter |
|---|---|---|
| *"Patients want to talk to a **human**, not a robot."* `[MED]` | Fear the AI mishandles a vulnerable/nervous caller & hurts reputation | Hybrid: AI catches the **missed/after-hours** calls a human *wasn't going to answer anyway* (42% unanswered), and **hands off** complex/emotional calls. We're recovering the *zero*, not replacing the human. |
| *"Does it **work with Jane**?"* `[HIGH]` | Jane is the system of record; no rip-and-replace | Yes — bridges via **Jane↔Google Calendar two-way sync**; we never touch their charting/billing. |
| *"I got **burned by an agency** before."* `[INFER/MED]` | Paid retainer, got "leads," no patients, no proof | We show **cost-per-*paying*-patient by channel** — the proof the last agency couldn't. |
| *"I don't have **time** to learn another system."* `[HIGH]` | Burnout / admin overload | It *removes* work (answers the phone, chases rebookings) rather than adding a screen to babysit. |
| *"Is this **safe** with patient data (PHIPA)?"* `[INFER]` | Health-privacy liability | Lead with Canadian data handling / PHIPA posture; don't store more than needed. |
| *"It feels **salesy** to chase patients."* `[MED]` | Identity as a carer, not a closer | Frame reactivation/rebooking as *good care*: "use your benefits before they reset," "let's finish what we started." |
| *"Can I just **see one more patient** instead of paying for this?"* `[INFER]` | ROI-anxious money mindset | Quantify the recovered missed-call LTV ($400–$1,000 each) vs. the subscription — it pays for itself on the first saved call. |

### 7.3 The winning narrative `[INFER, synthesis]`
**"You're a great clinician who got handed a business you weren't trained to run. Jane runs the clinic; we make sure no patient slips through the cracks before they're in Jane — and after they stop showing up — and we finally show you which dollars actually bring patients. We sit *beside* Jane, sound human on the phone, and feel like care, not sales."** This threads [[Owner business-education gap]] → [[Jane App]] → Modules **A/B/C** → the [[Beliefs & Objections]] above.

---

## Related maps
[[PHYSIO_WORKFLOW]] (workflow + Jane gaps + Module A–H map) · [[SOURCES]] (what was mined / what needs human transcripts) · `Vertical_Map.canvas` (visual board).

## Master source list
See [[SOURCES]] for the annotated list. Key first-party / high-confidence anchors used above:
- Jane App positioning, no-API constraint, Front Desk Magazine/Radio Front Desk — jane.app, frontdesk.jane.app.
- Front-desk overwhelm + 42% unanswered calls — OhMD; getNextPhone; WellReceived.
- Patient ghosting / voicemail-aversion — KevinMD; answering-service vendors.
- Drop-off stats (73% miss ≥1, 20% by visit 3, 70% don't finish) + 5 reasons — ScienceDirect qualitative study; amp-healthcare; Physiotutors.
- Owner burnout / business-education gap — Physiotutors; USAHS; CoreMedical.
- Chiro first-visit fear language — Cannon/Northcote/The Joint/Baywest.
- Insurance / direct-billing patient concern — Physiomobility; provider lists.
- (Carried from [[PHYSIO_WORKFLOW]]): CAC ~26%, no Pixel/GTM, speed-to-lead 21×/80%, rebooking 30–50%, reactivation 5–15%, reviews 90%/75%, missed-call $400 LTV.
