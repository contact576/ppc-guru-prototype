# CA-ON · Insurance / direct-billing  (VOLATILE — refresh yearly)

The most freshness-sensitive bucket. Distilled knowledge the agent uses to answer "do you
direct-bill [insurer]?" — **never quoting coverage dollar amounts** (locked rule).

**Default tags for files here:** `layer: regional`, `topic: insurance`, `freshness: volatile`,
`review_by` ≤ 12 months. Use `region: CA` for national private insurers (Sun Life, Manulife,
Canada Life, Blue Cross extended-health), `region: CA-ON` for Ontario-specific rails
(OHIP boundaries, WSIB, auto/MVA, Telus eClaims provider behaviour in ON).

**Feed sources (live pages, 2025–2026):** Telus eClaims supported-insurer list + provider flow;
the four insurers' paramedical (physio/chiro/massage) coverage pages. Raw → `/research/insurance_ca/`,
distilled + tagged → here.

**Refresh policy:** when a new plan year lands, add the new file `status: active`, set the prior
year `status: superseded` + `superseded_by:`. Never delete — keeps an audit trail.
