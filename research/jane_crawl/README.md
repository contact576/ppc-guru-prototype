# Jane App site crawl — raw research input

**Purpose:** raw Apify crawl of the Jane App website + help docs (~1,800 pages), used as
source material for two distilled outputs:
1. `JANE_TEARDOWN.md` (root) — features/modules, what Jane owns, pricing, integration
   marketplace, API/JDP reality, where Jane is blind (ad-ROI / lead capture / marketing).
2. `vertical/VERTICAL_BIBLE.md` — real owner/patient/front-desk language, objections,
   pains, and the words Jane itself uses to sell to clinics.

## Drop the export here

- **File:** `jane_crawl.jsonl` (or `jane_crawl.jsonl.gz` if large)
- **Format:** JSONL (one record per line)
- **Fields kept:** `url`, `markdown`, `title` (omit `html`, `text`, `screenshotUrl`, `debug`)
- **Clean items:** on

## How it's processed (don't paste raw into chat)

The raw file is NOT read into the main conversation. Background subagents chunk-read slices
and return only structured cruxes; those are synthesized into the two distilled docs above.
The raw stays here in version control for re-mining later (e.g. new module specs).

*Honesty tags carried into the distilled docs: `[V]` verifiable from a Jane page,
`[M]` Jane's own marketing claim, `[E]` our inference.*
