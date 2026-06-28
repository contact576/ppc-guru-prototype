# Clinic Vertical — Two-Product Diligence Matrix

**Vertical:** Physiotherapy / allied-health clinics (Canada-first)
**Founder edge:** owns 7 physio + 1 psych clinic; 24 Meta + ~20 Google ad accounts; known demand ($6.72 CPA, "near me" local intent, journey ends in a phone call).
**Date:** 2026-06-26 · **Bar to build:** ≥70/100
**Analyst stance:** ruthless. No cheerleading. Estimates tagged `[EST]`.

---

## ⚠️ THE DECISIVE FINDING — Jane App is the System of Record, and its API is Tier 3 (partner-gated)

Everything in this vertical routes through **Jane App** (200k+ practitioners, the de-facto allied-health PM/EMR in Canada). Both products are *parasitic on Jane's data* — appointments, patient lists, visit history, discharge status. Whoever controls that pipe controls the product. So the API tier is not a detail; it is the whole investment thesis.

**Jane App API classification: TIER 3 — PARTNER-GATED (OAuth2 + intake + approval).**

Direct evidence (Jane's own developer + integrations material, 2026):
- *"Jane is **not** launching an **open, public API** where any product can connect to Jane. Instead, they are building a **vetted partnership pathway**."*
- Jane Developer Platform (JDP) issues **OAuth2** short-lived access tokens / refresh tokens; integrations are "Jane Extensions," practitioner-authorized.
- **"Jane Integrations is an official, approval-based, API partner program… partners go through an intake and approval process… we review how their product works, how data flows, how privacy is protected."**
- The public partner **marketplace is "coming soon"** — Jane decides who is listed, who can purchase, and who is "officially supported."

**What Tier 3 means for an outsider builder:**
- You **cannot** ship without Jane's blessing. Jane is judge, jury, gatekeeper, *and a future competitor* for any layer it decides to build itself.
- Retell "has a Jane integration" — but read the fine print: it connects **"through custom API integrations or with help from Retell's integration partners,"** and the Jane-native players (Rebookly, Clara/ClinicGlide, HealOS) are the ones inside the vetted program. The integration is **partner-mediated, not a self-serve open API.** This confirms Tier 3, not Tier 1/2.
- Tier-3 gates are a **moat for the incumbent against you**, not a moat for you. Jane can revoke, re-price, or first-party-clone any approved category. (Cf. Mindbody/MINDBODY squeezing its own marketplace; Shopify cloning top apps.)

**Verdict on the seam:** A partner-gated SoR with a "coming soon" curated marketplace and an explicit "no open API" stance is the worst-case integration tier for a thin layer-on-top SaaS. It is survivable for a **services-heavy, founder-distributed** play; it is fatal for a **pure horizontal SaaS land-grab.**

---

## PRODUCT A — Vertical CRM / Patient-Retention + Reactivation + Marketing SaaS (beside Jane)

**Thesis:** Jane deliberately does NOT do lifecycle marketing. It does appointment reminders + "return visit reminders (recalls)" + a waitlist, and **routes all real list email to Mailchimp** ("Jane doesn't send these emails, Mailchimp does… no built-in newsletter, segmented email automation, or lifecycle marketing"). So there is a genuine, *vacated* layer: lapsed-patient reactivation, review generation, segmented SMS/email lifecycle, win-back campaigns, attribution back to ad spend.

### 1) Demand — STRONG, and independently verified
- 2026 UK Private Practice Barometer: top-3 automation priorities are **review collection (194 mentions), marketing automation (187), reactivating lapsed patients (182).** This is hair-on-fire, not nice-to-have.
- Reactivation economics are textbook: past patients are **~10× cheaper to reactivate** than cold acquisition; basic automation yields a measured **~2.6% rebooking lift.** "Recall" (30-day inactive, not-discharged) is a named, sought feature.
- **Text >> email in 2026** — and Jane's marketing path is email-via-Mailchimp. Clear wedge.

### 2) Competition + kill-zone — CROWDED but not a platform kill-zone (Jane abstains here)
- **Breakthrough** — purpose-built PT reactivation/nurture, **$399/mo**, the category leader for this exact job.
- **Mindbody** — full marketing-automation suite (SMS/email/drip/referral), but it's a *rival PM*, ~$269/mo, not a Jane sidecar.
- **WellnessLiving, Pabau, Cliniko (~47% share in some markets)** — overlapping all-in-one suites.
- **Rebookly** — Jane-native, does reactivation + SMS + win-back *and* voice (overlaps Product B).
- **Mailchimp** — Jane's blessed default; the incumbent "good enough" answer clinics already pay for.

**Kill-zone read:** Jane is NOT in this layer (it points you to Mailchimp), so this is *not* a Jane first-party kill-zone today — **but** Breakthrough already owns the PT-reactivation narrative, and Mindbody/WellnessLiving own it as a bundled feature. You're entering a **commodity feature market** where the buyer often already has a "free enough" answer. Winnability comes only from (a) Jane-native depth Mailchimp can't match, and (b) closing the loop to ad spend — which is the founder's unique asset.

### 3) System-of-record + integration tier — **Tier 3 (partner-gated), READ-mostly is plausible, WRITE-back is the risk**
Reactivation needs **read** (patient list, last-visit, discharge flag, visit history) — feasible under OAuth2 once approved. The valuable version needs **write-back** (book/rebook from a campaign, update status) — which is exactly where Jane gates hardest and where Jane could first-party you. You are building on a leased foundation with an approval committee and a "coming soon" marketplace deciding your fate.

### 4) Distribution fit — REAL distribution, not just references (this is the product's saving grace)
- 7 physio + 1 psych clinic = a **paying pilot fleet** you control: deploy day one, no sales cycle, real retention/LTV data, real before/after ad-spend attribution.
- The PPC agency = **a live funnel of clinic owners** (24 Meta + 20 Google accounts) who already trust the founder and already buy marketing from him. Bundling "we run your ads AND reactivate your lapsed list" is a **warm, owned channel** — genuine distribution, not vanity references.
- This is the single strongest argument for Product A: the founder can sell it as a **service+software bundle to his existing ad clients**, sidestepping the cold-SaaS-on-a-gated-API problem.

### 5) Build-moat zone — THIN software moat, REAL data/closed-loop moat
- Frontend + CRUD reactivation campaigns = **commodity, cloneable in weeks** `[EST]`. No software moat.
- The defensible part: **closed-loop attribution from ad click → booking → reactivation → LTV**, fed by the founder's proprietary 44-account ad dataset + clinic-owned visit data. *That* is hard to copy and is the founder's unique input. The moat is in the **data + the bundled-service distribution**, not the code.

### 6) Price vs COGS — HEALTHY
- Target **$99–$299/mo** per clinic `[EST]` (vs Breakthrough $399, Mindbody $269).
- COGS: SMS/email pass-through (Twilio/SES, cents per message) + Jane API + light AI for copy. Gross margin **80%+** `[EST]` if SMS is metered/passed through. No per-call AI inference bleed (unlike voice). **Pricing fits the $50–400/mo mandate cleanly.**

### 7) SCORE — Product A

| Parameter | Max | Score | Rationale |
|---|---|---|---|
| Pain | 18 | **15** | Reactivation/reviews/marketing-automation = top-3 verified clinic pains; rebooking lift is measurable. |
| Demand | 12 | **10** | Strong, multi-source, durable; text-first trend tailwind. |
| Winnability | 14 | **7** | Commodity feature; Breakthrough + Mindbody + Mailchimp "good enough" already. Wins only via Jane-native + ad-loop. |
| Not-kill-zone | 12 | **7** | Jane abstains here today (→Mailchimp) = not a first-party kill-zone, BUT Tier-3 gate + crowded resellers cap the upside. |
| Distribution-fit | 16 | **14** | Owned clinic fleet + warm ad-client funnel = real distribution. The thesis-saver. |
| Moat | 12 | **7** | Software thin/cloneable; real moat = proprietary ad+visit data closed loop. |
| AI-outcome-fit | 8 | **5** | AI helps (copy, segmentation, send-time) but isn't the core deliverable; outcome is operational. |
| Pricing | 8 | **7** | 80%+ margin, fits $50–400 band, COGS controllable. |
| **TOTAL** | **100** | **72** | |

### VERDICT A — **BUILD (conditionally), score 72/100 — just clears the bar.**
Not as a venture-scale horizontal SaaS land-grab (Tier-3 gate + commodity layer + Breakthrough/Mindbody/Mailchimp make that a slog). **Build it as a wedge bundled into the PPC agency**: "we run your clinic's ads AND reactivate your lapsed patients, with one attribution dashboard." Distribution (16→14) and the proprietary closed-loop data are doing the heavy lifting; demand and pain are real. Billion-$ potential is **weak as standalone** but plausible as the **data-and-distribution core of a clinic-marketing platform** the founder is uniquely positioned to seed. Ship to his 7 clinics first; expand to ad clients; only then consider open-market SaaS.

---

## PRODUCT B — AI Voice Front Desk for Clinics (carry-forward 58/100, verify)

**Prior result:** 58/100 → DROP-as-standalone. **Verified and CONFIRMED — if anything, slightly weaker now.**

### 1) Demand — REAL (the journey ends in a phone call; Jane doesn't answer phones)
Confirmed: *"Jane App does not answer incoming phone calls… inbound calls still require a human front-desk or an AI voice receptionist layered on top."* Demand is genuine and matches the founder's own data (call-ending journeys). Not the problem.

### 2) Competition + kill-zone — SEVERE. This is a reseller flood + commoditized tech.
Jane-integrated voice front desks already shipping in 2026:
- **Rebookly** (Jane-native, Canada, voice + SMS + reactivation)
- **Clara Voice / ClinicGlide** ("world's first Healthcare AI Receptionist that connects with Jane")
- **HealOS** ("six AI agents," answers calls, books in Jane)
- **Kickcall** (voice reminders via Jane/Google Calendar)
- **Smith.ai** (human+AI, integrates with Jane)
- **Retell AI** directly + its integration partners

Six+ named competitors, several Jane-native, plus **Retell/Vapi/Bland make the underlying tech a weekend-cloneable commodity.** This is the textbook reseller flood the prior 58 flagged.

### 3) System-of-record + integration tier — same **Tier 3 partner-gate**, and it bites harder
Voice front desk MUST write to Jane (book/reschedule/cancel in real time). That's the most-gated, highest-risk write path. The Jane-native incumbents (Rebookly, Clara, HealOS) are **already inside the vetted program**; you'd be applying to a committee to compete with their own approved partners. Worse SoR position than Product A.

### 4) Distribution fit — same owned fleet, but the product is undifferentiated
The 7 clinics let you pilot, but a voice agent is a horizontal commodity — the founder's ad-data edge **doesn't transfer** to call-answering. Distribution helps land 8 clinics; it doesn't create defensibility against Rebookly/Clara.

### 5) Build-moat zone — NONE. Tech commoditized (Retell/Vapi wrappers), data edge irrelevant to voice.

### 6) Existential risk — Jane first-party + Retell's own Jane path
Jane has every incentive and the SoR control to ship a first-party AI receptionist (or bless one exclusive partner). No first-party launch confirmed *yet* (2026), but the gap is obvious and the gate is theirs. Carry-forward existential risk stands.

### 7) Price vs COGS — WORST of the two
AI voice = **per-minute LLM + STT/TTS + telephony inference**. At $50–400/mo with real call volume, margins compress fast; heavy-call clinics can run **near or below break-even** `[EST]`. The classic "AI-at-$X/mo bleeds money" trap. Margin << Product A.

### SCORE — Product B

| Parameter | Max | Score | Rationale |
|---|---|---|---|
| Pain | 18 | **13** | Real (phones unanswered, no-shows) — unchanged. |
| Demand | 12 | **9** | Genuine; journey ends in a call. |
| Winnability | 14 | **5** | 6+ Jane-native rivals + commodity tech = brutal. |
| Not-kill-zone | 12 | **4** | Jane SoR can first-party or bless an exclusive; Retell-direct + reseller flood. Squarely in kill-zone. |
| Distribution-fit | 16 | **9** | Pilot fleet helps land; no transferable edge for voice. |
| Moat | 12 | **3** | Commoditized; ad-data edge irrelevant here. |
| AI-outcome-fit | 8 | **7** | Voice IS the AI outcome — the one strong box. |
| Pricing | 8 | **4** | Per-minute inference erodes margin at target price. |
| **TOTAL** | **100** | **54** | |

### VERDICT B — **DROP as standalone. 54/100** (≈ confirms prior 58; marginally lower as the reseller flood thickened). 
Build only as a **non-core feature inside Product A** (missed-call → SMS reactivation text-back, not a full voice agent), where it rides Product A's distribution and avoids the per-minute margin trap. Do not invest in a standalone AI receptionist — it's a crowded, commoditized, gated, low-margin race against Jane-native incumbents and Jane itself.

---

## SUMMARY

| | Product A (Retention/Marketing CRM) | Product B (AI Voice Front Desk) |
|---|---|---|
| **Score** | **72 / 100** | **54 / 100** |
| **Bar (≥70)** | ✅ Clears (barely) | ❌ Misses |
| **Jane API tier** | **Tier 3 — partner-gated (OAuth2 + approval, "no open API")** | Same Tier 3, worse (write-heavy, rivals already inside program) |
| **Verdict** | **BUILD as an agency-bundled wedge** (distribution + proprietary ad/visit data carry it); not as standalone horizontal SaaS | **DROP standalone**; at most a text-back feature inside A |
| **Margin** | 80%+ `[EST]`, fits $50–400 | Thin — per-minute voice inference bleed |
| **Real moat** | Closed-loop ad→booking→LTV data + warm ad-client channel | None (commodity tech, irrelevant data edge) |

**Decisive cross-cutting fact:** Jane App is a **Tier-3 partner-gated system of record** ("not launching an open public API… vetted partnership pathway… approval-based"). Both products live or die by Jane's approval committee. That gate **caps both** — it's why neither is a clean venture-scale SaaS, and why the only winning move is to lean on the founder's *non-Jane* assets: owned clinic fleet + proprietary ad data + warm clinic-owner distribution. Product A can monetize those; Product B can't.

---

### Sources
- [Jane Developer Platform](https://developers.jane.app/) · [Jane Integrations program/marketplace blog](https://jane.app/blog/jane-integrations-our-program-our-partners-and-how-to-work-with-us) · [Jane Integrations Hub & FAQ](https://jane.app/guide/integrations-hub-faq)
- [Jane Return Visit Reminders (recalls)](https://jane.app/guide/return-visit-reminders) · [Jane email-to-all-patients / Mailchimp routing](https://jane.app/guide/notifications-reminders/send-email-to-all-patients) · [Patient messaging in Jane](https://jane.app/blog/patient-messaging-in-jane-which-communication-tool-to-use-and-when)
- [2026 UK Private Practice Barometer — AI tools (review/marketing/reactivation priorities)](https://hmdg.co.uk/private-practice-barometer/ai-software-tools-physiotherapy-clinics-uk-2026/) · [Breakthrough automated reactivation](https://getbreakthrough.com/automated-patient-reactivation/) · [Breakthrough pricing ($399/mo)](https://getbreakthrough.com/pricing/) · [Automated reactivation for physio](https://aibridgeclub.com/post/automated-patient-reactivation-physio)
- [Mindbody PT software platforms comparison](https://www.mindbodyonline.com/business/education/comparison/10-best-physical-therapy-software-platforms) · [PT marketing 2026](https://practicepromotions.net/physical-therapy-marketing/)
- [Rebookly (Jane-native AI for clinics, Canada)](https://rebookly.ai/) · [Clara Voice / ClinicGlide for Jane](https://www.clinicglide.com/clara-voice-jane-app) · [HealOS + Jane](https://www.healos.ai/integrations/jane-app) · [Kickcall + Jane](https://www.kickcall.ai/integrations/jane-app) · [Retell AI + Jane](https://www.retellai.com/integrations/jane-app) · [Smith.ai + Jane](https://smith.ai/integrates-with/jane) · [Jane App AI front-desk alternatives review 2026](https://ainora.lt/blog/jane-app-ai-review-alternatives-2026)
