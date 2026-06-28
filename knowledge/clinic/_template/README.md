# Per-clinic layer — what each clinic uploads  (TENANT)

Copy this folder to `clinic/<clinic-id>/` per tenant. Two inputs (your model):

1. **`business-info/`** — services, hours, clinicians, fees, which insurers they direct-bill,
   escalation preferences. This is *configuration* (the "safe-blocks"), tagged
   `layer: clinic`, `topic: business-info`, `region:` the clinic's region.
2. **`calls-deidentified/`** — the clinic's **own** real reception calls, **de-identified**
   (names/PHI stripped) with recording consent. Tagged `topic: call-recording`. This is the
   tuning data that gives the agent the clinic's accent/style.

**Compliance (LOCKED):** real calls require recording disclosure + two-party-consent handling +
PII scrubbing BEFORE they enter here. Cleanest source = clinics the founder owns (first-party,
consented). PHI never leaves the BAA-covered pipeline and is never promoted into universal/
regional knowledge except as de-identified, aggregated patterns.
