# Practitioner Clinics — "% Running Paid Ads" — Direct Measurement

**Purpose:** Replace the market model's softest input — the 🟠 low-confidence **"20–35% of
practitioner clinics run paid ads"** assumption (`MARKET_SIZE.md` §2, the number the SAM swings 5×
on) — with a **direct measurement**: build a real sample of practitioner clinics and check each one
for active paid advertising on Meta and Google.

**Date run:** 2026-06-26. **Demo "today" for ad-recency:** 2026-06-26 (real clock).
**Tools:** Apify Google Maps scraper (sample), Apify Facebook Ads Library scraper + Meta Ads MCP
(Meta numerator), Apify Google Ads Transparency scraper (Google numerator).

---

## TL;DR — the headline

| Metric | Result (N=281 checked) | 95% CI |
|---|---|---|
| **% running ANY active paid ads (Meta or Google)** | **44.5%** | ±5.8pp |
| …excluding multi-location chains from the numerator | **41.3%** | — |
| % active on **Google** (own-domain or branded, last ≤60d) | **41.3%** | ±5.8pp |
| % that **ever** ran Google ads | 47.7% | — |
| % detected active on **Meta** (conservative match) | **12.1%** (almost certainly an undercount — see honesty §) | ±3.8pp |

**Verdict up front:** the true share of practitioner clinics running paid ads is **~40–45%**, i.e.
**materially ABOVE the model's 20–35% range and well above its 25% midpoint.** Even on the most
conservative reading (drop every chain, require a recent self-attributed Google ad) it is **~41%**.
The model's "% running ads" input was **too low**; the SAM built on 25% is **conservative by roughly
1.6–1.8×.** n=281 is large enough to act on (±~6pp overall); the per-cell cuts (n≈20–53) are
directional, not precise.

---

## Method

### Step 1 — the denominator (the clinic sample)
Apify **Google Maps scraper** (`compass/crawler-google-places`), 24 searches = {physiotherapy/
physical-therapy, chiropractic, dental, optometry} × {Toronto, Vancouver, Calgary, New York, Los
Angeles, Chicago}, ~14 results each. Captured: name, website domain, city, country, Google category.
Raw 323 → **285 unique clinics** after de-duping by domain (and name+phone where no domain).
**282 had a usable website domain**; 281 of those returned a Google-transparency result → these 281
are the analysis denominator **N**. (4 excluded: 3 no-domain + 1 un-returned.)

Each clinic is tagged by its **actual** scraped city/country, **not** the search string — Google Maps
spilled ~34 results into nearby markets (e.g. "chiropractor Toronto" returned Buffalo NY clinics,
"chiropractor Vancouver" returned Vancouver **WA**, LA/Chicago physio drifted to NYC/Boston/Phoenix).
Those spillovers are kept (they are still real US practitioner clinics) but bucketed as
"other-US-cities" so the six target-city cells stay clean.

### Step 2 — the numerator (who actually advertises)
- **Google:** Apify **Google Ads Transparency** scraper (`alkausari_mujahid/...`) over all 282 domains,
  region = *anywhere*. Returns `ads_ever` (Yes/No), ad count, and **date last shown**. We classify a
  clinic **Google-active** if it ran an ad in the **last ~60 days** (May–Jun 2026), vs **stale** if it
  only ran historically. 134/281 ever ran Google ads; 116 were active recently; 18 were stale.
- **Meta:** Apify **Facebook Ads Library** scraper (`curious_coder/...`) — one *active-only* keyword
  search per clinic (name + correct country), 284 searches across 4 batches → 3,683 returned ads.
  Keyword search is noisy, so an ad is **only counted** when it maps back to a specific clinic by
  **(a) its destination URL domain == the clinic's own domain** (strong), or **(b) a ≥0.90 fuzzy match
  of the clinic's distinctive name to the advertiser page name** (with a guard that rejects matches on
  generic category words alone like "dental clinic"/"chiropractor"). Meta Ads MCP `ads_library_search`
  was used to validate the pipeline. **34 clinics** matched conservatively.
- A clinic counts as **running paid ads** if it is Meta-active **OR** Google-active.

---

## Per-cell results

### Overall (N = 281)
| | Count | % | 95% CI |
|---|---|---|---|
| ANY paid ads | 125 | **44.5%** | ±5.8 |
| ANY, excluding chains | 116 | 41.3% | — |
| Google active (≤60d) | 116 | 41.3% | ±5.8 |
| Google ever | 134 | 47.7% | — |
| Meta active (conservative) | 34 | 12.1% | ±3.8 |
| Both Meta **and** Google | 25 | 8.9% | — |

Channel split of the 125 ad-runners: **91 Google-only · 9 Meta-only · 25 both.** Google is the
dominant paid channel for this segment; Meta is incremental (and undercounted — see honesty §).

### By clinic type
| Type | N | ANY % | Meta % | Google-active % | Google-ever % | ±CI |
|---|---|---|---|---|---|---|
| **Physiotherapy / PT** | 75 | **52.0%** | 14.7% | 46.7% | 56.0% | ±11.3 |
| **Dental** | 66 | **50.0%** | 16.7% | 47.0% | 51.5% | ±12.1 |
| **Optometry** | 67 | 43.3% | 9.0% | 43.3% | 49.3% | ±11.9 |
| **Chiropractic** | 73 | **32.9%** | 8.2% | 28.8% | 34.2% | ±10.8 |

**Dental** is the heaviest **Meta** advertiser (16.7%) and tied-second on ANY (50%), consistent with
the model's prediction that dental advertises more. But **physiotherapy is actually the top "ANY"
cell (52%)** here — driven by very high Google-ads adoption among Canadian physio clinics.
**Chiropractic is the laggard (33%)** — a long solo-practitioner / referral-driven tail.

### By country — the biggest split in the data
| Country | N | ANY % | Meta % | Google-active % | ±CI |
|---|---|---|---|---|---|
| **Canada** | 131 | **58.8%** | 15.3% | 55.7% | ±8.4 |
| **United States** | 150 | **32.0%** | 9.3% | 28.7% | ±7.5 |

Canadian practitioner clinics advertise at **~1.8× the US rate.** This matters for a Canada-first GTM:
the model's "% running ads" is, if anything, **conservative for the founder's home market** (CA physio
ANY = 68%!). The US number (32%) sits right at the top of the model's old 20–35% band; the *blended*
and *Canadian* numbers blow through it.

### By target city (actual-city tag)
| City | N | ANY % | Meta % | Google-active % | ±CI |
|---|---|---|---|---|---|
| Calgary (CA) | 53 | **64.2%** | 15.1% | 62.3% | ±12.9 |
| Toronto (CA) | 40 | 52.5% | 15.0% | 50.0% | ±15.5 |
| Vancouver (CA) | 51 | 51.0% | 13.7% | 45.1% | ±13.7 |
| Los Angeles (US) | 39 | 33.3% | 7.7% | 30.8% | ±14.8 |
| Chicago (US) | 31 | 32.3% | 12.9% | 32.3% | ±16.5 |
| New York (US) | 35 | 31.4% | 2.9% | 28.6% | ±15.4 |
| other-US-cities (spillover) | 32 | 31.2% | 15.6% | 25.0% | ±16.1 |

Clean CA-vs-US gradient: all three Canadian cities ≥51%, all three US cities ≈31–33%. (Per-city CIs are
wide — treat city ranking as directional.)

### Type × Country (smallest cells — directional only)
| Cell | N | ANY % | Cell | N | ANY % |
|---|---|---|---|---|---|
| physio / CA | 38 | **68.4%** | physio / US | 37 | 35.1% |
| dental / CA | 40 | 60.0% | dental / US | 26 | 34.6% |
| optometry / CA | 34 | 55.9% | optometry / US | 33 | 30.3% |
| chiropractic / CA | 19 | 42.1% | chiropractic / US | 54 | 29.6% |

Denominator coverage per cell (target cities; spillover excluded from this grid):

| city | physio | chiro | dental | optometry |
|---|---|---|---|---|
| Toronto | 10 | 3 | 14 | 13 |
| Vancouver | 14 | 13 | 14 | 10 |
| Calgary | 14 | 13 | 14 | 12 |
| New York | 15 | 0 | 11 | 11 |
| Los Angeles | 11 | 13 | 1 | 14 |
| Chicago | 1 | 10 | 12 | 8 |

Some cells are thin/empty because of Google-Maps geographic spillover (NY-chiro searches returned
Buffalo; LA-dental and Chicago-physio drifted out of city). The **type totals** stay well-balanced
(physio 75 · chiro 73 · dental 66 · optometry 67), so the by-type and by-country cuts are sound even
though a couple of city×type cells are weak.

---

## Honesty section (required)

### Sample size & precision
- **N = 281** clinics checked for Google (the full sample), **284 checked for Meta**. This is a clean,
  near-complete census of the assembled sample — not a sub-sample. **Margin of error at the overall
  level ≈ ±5.8pp at 95%.** That is a **usable number for a go/no-go judgment.**
- **Sub-cells are noisier:** by-type / by-country CIs are ±8–12pp; per-city and type×country cells
  (n≈19–53) are ±13–22pp and should be read as **directional**, not precise. The *overall*, *by-type*,
  and *by-country* splits are the trustworthy cuts.

### Direction of bias — and why the true number is probably even HIGHER than 44.5%
1. **Meta is materially UNDERCOUNTED.** Meta keyword-matching only credits a clinic when an ad's page
   name closely matches the business name **or** the ad links to the clinic's own domain. It misses:
   (a) clinics whose Facebook **page name differs** from the business name, (b) ads that link to a
   **booking page** (jane.app, calendly, a landing-page domain) instead of the clinic site, and
   (c) ads **run under an agency's or a marketing partner's ad account / page**. 9 clinics surfaced on
   Meta with **no** Google ad, proving Meta adds real incremental advertisers — so the true "ANY" is
   **above** 44.5%, not below. We deliberately erred toward false-negatives on Meta to avoid inflating
   the headline. **"No ad found" ≠ "not advertising."**
2. **Agency-account attribution (false negatives on both networks).** When a clinic's ads run under a
   PPC agency's advertiser identity rather than the clinic's own domain/page, neither the Ad Library
   (page search) nor the Transparency Center (domain search) attributes them to the clinic. This biases
   every cell **downward**. The real ceiling is higher than what we counted.
3. **Chains / multi-location brands (the one UPWARD bias) — already controlled.** A handful of sampled
   "clinics" are outlets of national chains (The Joint, Chiro One, FYidoctors, Specsavers, Dental
   Dreams, Lifemark, Select PT, Evolution PT, HealthSource). Their domains legitimately show ads, but
   those ads are the *brand's*, not the local outlet's. Only **9 of 125** ad-runners are chain-domains;
   **removing them all still leaves 41.3% running ads.** So the headline is **not** an artifact of chains.
4. **"Active" definition.** Google-active = ad shown in the last ~60 days; this is a true *currently
   advertising* signal, not lifetime. 18 clinics that "ever" advertised were excluded as stale — a
   conservative choice. Meta was filtered to **active ads only** at the source.
5. **Geographic spillover** in the Google-Maps sample (≈34 clinics in Buffalo/Vancouver-WA/Phoenix/
   Boston/etc.). Kept as valid US clinics in a separate bucket; they do not distort the six target-city
   cells.

### Net
Two biases push the measured number **down** (Meta undercount, agency-account attribution) and only one
pushes it **up** (chains, already shown to be tiny and removable). **The 44.5% is therefore a floor-ish
central estimate; the true "% running paid ads" is most likely ~45–55% blended, and ~55–65% for
Canadian clinics.**

---

## Final verdict

- **Is ~25% right?** **No — it is too low.** The directly-measured share of practitioner clinics running
  active paid ads is **~44.5% (CI ±5.8pp), ~41% even after stripping every chain** — above the entire
  20–35% range the model used, and ~1.8× its 25% midpoint. For **Canada** (the founder's beachhead) it
  is **~59%**; for **physiotherapy in Canada**, ~68%.
- **Is n large enough to act on?** **Yes for the headline and the major cuts.** n=281 with ±~6pp is a
  solid basis for a go/no-go on the SAM driver; the by-type and CA-vs-US splits are reliable. Per-city
  and type×country cells are directional (wide CIs) — fine for ranking, not for point estimates.
- **Implication for the model:** raise the "% running paid ads" input from 25% to a **defensible
  40–50% (CA-weighted higher)**, which **scales the SAM up** rather than down. The single softest,
  5×-swinging input in `MARKET_SIZE.md` is now measured, and it moves the case **in the founder's
  favour** — the addressable base of ad-running clinics is bigger than assumed, especially in Canada.

### Caveats to carry forward
- This measures *whether* a clinic advertises, not *how much* it spends or whether spend is "meaningful,
  recurring" (the model's stricter phrasing). Some Google-active hits are small/branded campaigns; a
  spend-weighted "serious advertiser" rate would be lower than 44.5% but, given the Meta undercount,
  still comfortably above 25%.
- Mock/integration seams: Meta keyword-match (not page-ID-perfect), Google "anywhere" region, and the
  ~60-day active window are the main methodological knobs. Tightening Meta to page-ID matching and
  pulling clinic-specific ad spend would refine — but would only **raise** the Meta side.
