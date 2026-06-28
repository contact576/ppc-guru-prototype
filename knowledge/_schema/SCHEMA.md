# Knowledge tagging schema — every file carries this front-matter

*This is the contract that makes the corpus filterable by **location + freshness + layer** and retire-able by status. It maps 1:1 onto the future RAG store: each tag becomes chunk metadata, so retrieval can filter `region`, `status`, and `review_by` at query time. Tag at distill time — don't backfill later.*

## Front-matter (YAML) — required on every `.md` in `knowledge/`

```yaml
---
id: ca-on-insurance-telus-eclaims-2026        # stable, unique, human-readable
layer: regional            # universal | regional | clinic
topic: insurance           # receptionist-skill | booking-skill | hygiene | insurance |
                           # pricing | regulatory | culture | conditions | business-info |
                           # call-recording | objection
region: CA-ON              # GLOBAL | CA | CA-ON | CA-BC | CA-AB | CA-QC | CA-ON/Hamilton …
content_date: "2026"       # the period the INFO is valid for (year or YYYY-MM)
captured_at: "2026-06-28"  # when we scraped/wrote it
freshness: volatile        # evergreen | annual | volatile
review_by: "2027-01"       # when to re-verify (required if annual|volatile; omit if evergreen)
source: "https://…"        # url / YouTube channel+video / clinic name
confidence: V              # V verifiable | M marketing-claim | E our-inference
status: active             # active | superseded | archived
supersedes: null           # id of the file this replaces (or null)
superseded_by: null        # set when this file is retired
---
```

## Field rules

- **`layer` + `region`** decide *who* sees it. `universal` ⇒ `region: GLOBAL`. National-but-Canadian (e.g. private insurers like Sun Life) ⇒ `region: CA`. Province-specific (OHIP, WSIB, auto/MVA, colleges) ⇒ `region: CA-ON` etc.
- **`freshness`** decides *rotation*:
  - `evergreen` — receptionist/booking skills, hygiene. No `review_by`.
  - `annual` — pricing, college rules. `review_by` ~12mo out.
  - `volatile` — **insurance/direct-billing**. `review_by` ≤12mo; refresh aggressively.
- **`status`** decides *visibility*. Retrieval = `status: active` only. Retire by setting `status: superseded` + `superseded_by:` (never delete the file).
- **`confidence`** carries the honesty tag through to the model's grounding.

## Retrieval logic (how the brain assembles, later)

```
agent(clinic X in Ontario) loads:
   universal/*                         where status=active
 + regional/CA-ON/* and regional/CA/*  where status=active and now < review_by
 + clinic/<X>/*
exclude: any other province; any status≠active; anything past review_by (flag to refresh)
```

## Manifest

`_schema/manifest.csv` (generated) lists every file's id·layer·topic·region·content_date·freshness·review_by·status — the one-glance "database" view for auditing what's fresh, what's stale, and what's superseded. Regenerate it whenever data is added (a small script will do this once we have volume).

## Copy-paste template

See `_schema/TEMPLATE.md` — duplicate it for each new knowledge file.
