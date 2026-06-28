# MVP Plan — Stack Costs, Compliance Timing, and the Central Brain

*"Understand before building." Costs are planning estimates (🟡) — verify on the vendor sites before committing. Pairs with [[PROJECT_BRIEF_v2]] and [[DATA_ARCHITECTURE]].*

## 1. Stack cost — MVP vs. live

### Phase 0 — Validate (synthetic data, NO real PHI, NO compliance spend)
| Item | Cost |
|---|---|
| Build (Claude Code + your dev) | **time, ~$0 cash** |
| Domain | ~$15–100/yr |
| Dev infra (Supabase free/Pro, Vercel/Render) | ~$0–45/mo |
| Retell test minutes | ~$50–100 one-time |
| **Phase 0 total** | **~$100–500 one-time + ~$50/mo** |

### Phase 1 — First real pilot clinics (compliant, Canada/Ontario)
| Item | Cost (a few clinics) | Notes |
|---|---|---|
| HIPAA-eligible DB (Supabase Team / AWS, Canadian region) | $25–600/mo | Team tier (~$599) if you need their HIPAA add-on; or self-host cheaper |
| **Retell voice** (the big variable) | ~$100–500/mo | usage; ~$0.11–0.15/min all-in |
| SMS (Notifyre) | ~$20–100/mo | $0.015/SMS |
| Email (AWS SES) | ~$10–50/mo | |
| Auth (Clerk) | $0–25/mo | |
| Hosting (Vercel/Render, CA region) | ~$20–100/mo | |
| Health-privacy lawyer review | **~$2,000–5,000 one-time** | do NOT skip |
| Compliance automation (Vanta/Drata) | **deferrable** (~$10–15k/yr) | only when a customer requires SOC-2 |
| **Phase 1 ongoing** | **~$1,000–2,000/mo + $2–5k one-time legal** | |
| **Total to compliant launch** | **~$30–70k** | incl. a few months runway (vs $150–600k agency route) |

### At scale
- Infra is **multi-tenant → flattens** per clinic.
- The real per-customer cost is **voice COGS $30–260/mo/clinic** (Retell minutes). Healthy margin at the **$249–399/mo** price (see [[MODULE_A_voice]]).
- **Swing variables:** Retell minutes · Supabase HIPAA tier (needed day 1?) · Vanta deferral.

## 2. HIPAA / PHIPA timing — the honest sequence
1. **Validate with SYNTHETIC data → zero compliance spend.** All of Phase 0 (demos, LOIs) uses fake data, no obligations.
2. **Real patient data — even at your OWN clinics — requires the compliant baseline FIRST:** BAAs (both directions), Canadian data residency, encryption, minimized PHI, lawyer sign-off. **You cannot "run pilots first, comply later" with real PHI** — that's a PHIPA violation.
3. **Deferrable:** the *formal audit / SOC-2 attestation* (Vanta/Drata) — wait until a customer demands it.
4. **Lever:** minimize PHI (name + email + service only; clinical detail stays in the voice convo, handled compliantly) → lighter, cheaper baseline.
→ **Synthetic → compliant baseline before any real patient → defer formal cert.**

## 3. The central brain + fleet learning — what's compliant
The vision: one central brain → deploy voice agents to many clinics → collect feedback → keep enriching. Correct, with one hard line (PHI never pools).

| Layer | Compliant? | Why |
|---|---|---|
| **Central knowledge base** ("the map": industry research, the Bible, scripts, FAQs — **no PHI**) | ✅ centralize + enrich freely | It's market data; it grounds every clinic's agent (RAG) |
| **Per-clinic patient data** (calls, transcripts, names) | ⛔ must stay **siloed per tenant** | PHI; multi-tenant isolation is mandatory |
| **Fleet learning** from **de-identified, aggregated signals** (which scripts convert, common questions, perf metrics) | ✅ yes — the compliant "gather what we can" | No identities; improves prompts + KB |
| **Raw transcripts pooled into one model / fine-tuning on PHI** | ⛔ no | Privacy violation (also why v2 chose RAG, not fine-tune) |

**So:** the brain learns from *patterns* ("what works"), not raw patient data. Each clinic's agent uses the shared brain; its patient data stays walled in its tenant. ~90% of the self-improving-fleet dream, fully compliant. *(The "central brain" = the RAG knowledge base in [[PROJECT_BRIEF_v2]], made operational; seeded by the [[VERTICAL_BIBLE]].)*

## 4. So, day-1 build posture
- Build **multi-tenant + PHI-siloed + minimal-PHI** from line one (architecture, not afterthought).
- Validate on **synthetic data** (no compliance spend) → demo → LOIs.
- Stand up the **compliant baseline** before the first real clinic; defer the formal audit.
- Keep the **central KB PHI-free**; learn from **de-identified aggregates**.
