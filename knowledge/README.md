# Knowledge Base — the voice agent's "brain" (layered, tagged, swappable)

*This is the structured corpus that grounds the AI receptionist. It is built so the **backbone never changes**, the **regional layer** swaps per province, and the **per-clinic layer** is uploaded per tenant — and so any data can be **isolated, refreshed, or retired by metadata alone, never by deletion.** See `_schema/SCHEMA.md` for the exact tags every file carries.*

## The three layers (this is the architecture)

| Layer | What's in it | Changes? | Folder |
|---|---|---|---|
| **0 · Universal backbone** | Receptionist skills, care-first booking/conversion, call hygiene, escalation, tone. The *job*, location-agnostic. | Rarely (evergreen) | `universal/` |
| **1 · Regional overlay** | Province-specific: insurance/direct-billing, regulatory (PHIPA + colleges), pricing, local culture/communication norms, conditions/seasonality. | Often (insurance = yearly) | `regional/<REGION>/` |
| **2 · Per-clinic (tenant)** | Business info (services, hours, clinicians, fees, insurers billed) + **de-identified real call recordings** + brand voice. Uploaded clinic-side. | Per clinic | `clinic/<clinic-id>/` |

**At query time** the agent for a clinic loads: `universal` (always) + its **own region** (`regional/CA-ON`, never other provinces) + its **own** `clinic/<id>`. That's how the same backbone gets a local accent and a clinic's business knowledge without forking the model.

## Governance — swap / isolate / retire without deleting (your rule)

- **Never delete. Flip status.** Every file carries `status: active | superseded | archived`. Retrieval reads **only `active`**. To refresh volatile data (e.g. 2026 insurance → 2027), add the new file as `active`, set the old to `superseded`, link them (`supersedes:`). The old data stays for audit but never reaches the model.
- **Freshness class drives rotation.** `freshness: evergreen | annual | volatile`. `volatile`/`annual` files carry a `review_by` date (insurance, pricing). A stale-data check flags anything past `review_by`.
- **Region filter is hard.** A file's `region` tag (`GLOBAL | CA | CA-ON | CA-BC | …`) decides who ever sees it. Ontario clinics never get BC insurance rules.
- **Recency rule (LOCKED):** nothing older than **2 years** enters as `active` knowledge. Older material may be kept `archived` for reference only.

## Folder map

```
knowledge/
  _schema/            # the tag spec + copy-paste front-matter template + the manifest
  universal/
    receptionist-skills/
    booking-skills/        (care-first — NOT pushy; see VOICE_OF_CUSTOMER)
    hygiene-compliance/    (recording disclosure, PHI-min, escalation)
  regional/
    CA-ON/                 # ← beachhead first
      insurance/           (volatile — refresh yearly)
      regulatory/          (PHIPA, College of Physio/CMTO/chiro advertising+consent)
      pricing/             (volatile)
      culture/             (how ON patients search/talk/believe)
      conditions/          (common presentations, seasonality)
    CA-BC/  CA-AB/  …       # added as we expand
  clinic/
    _template/             # what each clinic uploads
      business-info/
      calls-deidentified/
```

*Raw scrapes land in `/research/` (untouched source); distilled, **tagged** knowledge lands here. Every file here MUST have the front-matter from `_schema/SCHEMA.md`.*
