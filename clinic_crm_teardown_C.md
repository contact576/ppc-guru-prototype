# Clinic-Native Sales/Marketing CRM — Competitive Teardown, Round 2 (Cluster C)

**Founder's wedge under test:** a CLINIC/PT-native CRM whose unique value is **AUTOMATIC paid-ad-spend → booked-CONFIRMED-patient ROI attribution**, plus lead pipeline + marketing automation, sitting natively on/beside the EMR.

**Decisive question:** does any platform do *clinic/PT-native* **AND** *native automatic ad-spend→confirmed-booking ROI*? "Lead-source tagging" and "leads-by-source report" are NOT the same as automatic ad-spend→confirmed-booking ROI.

**Method:** live WebSearch (June 2026). Vendor pages on `webpt.com`, `patientnow.com`, `aestheticrecord.com`, `symplast.com`, `zenoti.com`, `joinblvd.com` all returned HTTP 403 to direct fetch, so several rows lean on search-surfaced vendor copy + third-party reviews. **Uncertainty is tagged inline** (⚠ = leans on third-party/agency review, not confirmed on vendor's own current page).

Scoring key for columns 6–9: **Yes / Partial / No**.
Column 9 is the wedge column — only "Yes (NATIVE auto ad-spend→confirmed booking)" counts as a true counterexample. "Lead-source tagging / which-campaign-converts / integration-dependent / GTM-offline-conversion" = **Partial at best**.

---

## CLUSTER 1 — US PT / rehab-specific platforms

| Platform | Vertical | EMR? | 6. New-lead capture | 7. Lead pipeline (stages) | 8. Mktg automation (non-patient nurture) | 9. **Ad-spend→confirmed-booking ROI (NATIVE auto?)** | Pricing |
|---|---|---|---|---|---|---|---|
| **WebPT Reach** | PT/rehab ✅ native | Yes (WebPT EMR; Reach is the marketing add-on) | **Yes** — custom landing pages capture prospects; form-fills flow to lead mgmt + EMR | **Yes** — "the only contact-management system built for rehab therapy"; track→manage→convert to booked appt; lead dashboard with conversion rate | **Yes** — pre-loaded nurture/drip campaigns, segmented, loyalty surveys | **No (lead-SOURCE only).** Dashboard shows "where leads are coming from," form-fills, conversion rate. **No evidence of ad-spend ingestion or CPA/ROAS.** It's lead-source tagging, not ad-spend→confirmed-booking ROI. | Add-on to WebPT; WebPT base ~$99+/provider/mo (Reach priced separately) |
| **Prompt EMR** | PT/rehab ✅ native | Yes | **Partial** — "drives a consistent new-patient pipeline," review-driven; users explicitly *ask for* a native lead→eval Kanban CRM that doesn't exist yet | **Partial/No** — no native lead Kanban (user-requested gap; many use external tools) | **Partial** — AI patient-engagement pings for reviews/visibility; weaker on non-patient nurture | **No.** Engagement + reputation, not ad-spend ROI. | ~$100–$500 / user / mo ⚠ (third-party listing) |
| **Raintree Systems** | PT/rehab (enterprise) ✅ | Yes | **No/Partial** — patient portal, pre-registration, intake; enterprise RCM focus | **No** — engagement campaigns monitor dropout, not a sales lead pipeline | **Partial** — automated engagement campaigns (retention-leaning) | **No.** "Interactive ROI reporting" = **billing/RCM** ROI, not ad-spend→booking attribution. | Enterprise/quote |
| **Net Health / Clinicient** | PT/rehab + wound/hospice ✅ | Yes | **Partial** — Patient Engagement Suite (review capture, reputation, directory listings) | **No** — no sales lead pipeline surfaced | **Partial** — review/reputation automation; acquisition framed as reputation, not lead nurture | **No.** Reputation + outcomes (FOTO) marketing. No ad-spend ROI. (Note: Clinicient folded into Net Health; Keet acquired from WebPT.) | Enterprise/quote |
| **PtEverywhere** | PT/rehab ✅ native | Yes | **Partial** — referral tracker "automatically tracks sources"; intake/self-book | **Partial** — status-based automation; pipeline-lite | **Yes** — broadcasts + drip segmented by diagnosis/stage/last-visit; **native GoHighLevel integration** | **Partial — and only via GHL.** Native = referral-source tracking. The ad-ROI muscle is *borrowed* from the GoHighLevel integration (the generic, EMR-blind tool from round 1), not native. | Quote (no public flat price) |
| **Empower EMR** | PT/rehab ✅ native | Yes | **Partial** — "Engage" module: automated email marketing, NPS, fax-blaster; acquisition framed as PPC/Google Business *advice* | **No** — no native lead pipeline surfaced | **Partial** — automated email/engagement (retention-leaning) | **No.** Marketing blog talks PPC/ROI as *strategy*; product = engagement + reputation, not ad-spend attribution. | Quote |
| **HENO** | PT/rehab ✅ native | Yes | **Partial** — "CRM tools," referral management, marketing automation | **Partial** — "track practice KPIs, manage marketing campaigns, manage referrals" | **Yes** — marketing automation + two-way comms in-platform | **No (KPI/referral tracking).** Tracks campaign KPIs + referrals; **no evidence of ad-spend→confirmed-booking ROI.** | Quote |
| **TheraOffice** | PT/rehab ✅ native | Yes | **No** — intake/scheduling/docs/billing; highly customizable but ops-focused | **No** | **No/minimal** | **No.** Pure EMR/PM, dated UX; no marketing-ROI layer. | Quote |
| **BestPT** | PT/rehab ✅ | Yes (billing-led) | **No** (no product detail surfaced; billing-service-led) | **No** | **No** | **No.** | Quote |
| **Strive / Tebra** | — | — | *(Skipped per brief — Tebra covered in round 1.)* | | | | |

**Cluster 1 verdict:** **No PT-native platform does the wedge.** The best of the bunch, **WebPT Reach**, is genuinely strong on lead capture + lead pipeline + nurture (the "only contact mgmt built for rehab therapy") — but stops at **lead-source tagging / conversion-rate reporting**. None ingest ad-spend dollars to compute automatic CPA/ROAS against confirmed bookings. PtEverywhere only gets ad-ROI by **bolting on GoHighLevel** (i.e., it inherits round-1's generic tool, not a native PT solution).

---

## CLUSTER 2 — Aesthetics / med-spa / wellness "growth CRM" platforms

| Platform | Vertical | EMR? | 6. New-lead capture | 7. Lead pipeline (stages) | 8. Mktg automation (non-patient nurture) | 9. **Ad-spend→confirmed-booking ROI (NATIVE auto?)** | Pricing |
|---|---|---|---|---|---|---|---|
| **Aesthetic Record + LeadAR** | Aesthetics / med-spa ❌ not PT | Yes (AR EMR) + LeadAR CRM | **Yes** — captures leads from FB/IG/LinkedIn/TikTok via funnels/forms; auto-funneled to Leads tab | **Yes** — every inquiry auto-into sales pipeline | **Yes** — automations triggered by appt type/status | **Partial→Yes (closest in cluster).** "See the **direct ROI of your marketing spend**…measure true CLV…in a single integrated dashboard," ROI/conversion from *real-time transactions*. ⚠ Strength of automatic **ad-SPEND** ingestion (vs. transaction-side ROI + lead-source) unconfirmed on a non-aesthetics basis. **Wrong vertical** + LeadAR is a paid add-on ($399 onboarding / $199 setup). | LeadAR add-on; AR EMR base + LeadAR plan |
| **Symplast CRM** | Aesthetics / plastic-surgery ❌ not PT | Yes (Symplast EHR) | **Yes** | **Yes** — **multiple automated pipelines** (surgical/medspa/nurture); stages update automatically because CRM+EMR are connected | **Yes** — automated lead/contact nurture by journey stage | **Partial→Yes (closest in cluster).** "Integrates with Google Analytics, **Google Ads, Facebook Ads**…connecting **marketing spend to booked consultations and revenue, not just clicks**"; case: +29% conv, $122K booked. ⚠ Most of this detail is from a **third-party agency review (wisevu.com)**, not confirmed on Symplast's own live page; integration-driven. **Wrong vertical.** | Quote |
| **Zenoti** | Salon / spa / med-spa / wellness ❌ not PT | Light (med-spa charting) | **Yes** — captures+qualifies leads from referrals/IG/FB/TikTok/Google Ads/email/SMS/calls | **Yes** — "Lead-to-win" funnel, configurable stages New→Won/Lost, drop-off visibility | **Yes** — full marketing-automation suite, campaign-level tracking open→booking→payment | **Partial.** Tracks campaign→booking→payment revenue natively; **Google Ads ROI only via Google Tag Manager + offline-conversion import** (not native ad-spend ingestion). Strong, but the paid-ad-spend link is GTM/integration-dependent, not auto-native. **Wrong vertical.** | Enterprise/quote |
| **Nextech (+ Aesthetix CRM)** | Aesthetics / derm / plastic-surgery ❌ not PT | Yes (Nextech EHR) | **Yes** — FB/IG/TikTok leads unified; form→pipeline workflow | **Yes** — "opportunity" objects move through sales pipeline; new-lead workflow auto-routes | **Yes** — built-in automation + nurture | **Partial.** "Clear visibility into which **channels/campaigns generate conversions**…maximize ROI." Aesthetix CRM attribution is **"optimized for native web forms,"** explicitly *not yet* across flexible ad integrations. Channel-conversion visibility, not auto ad-spend→booking. **Wrong vertical.** | Quote |
| **PatientNow (+Growth99 / Aesthetix)** | Aesthetics / med-spa ❌ not PT | Yes | **Yes** — full marketing suite: web lead capture, auto-assign to campaigns by treatment interest | **Yes** — inquiry→first-appointment funnel | **Yes** — email/SMS drip, recall, reputation, social, AI content | **Partial.** "Track exactly where leads come from, **which campaigns deliver highest ROI**, drop-off points." Growth99 "connects with Google, Facebook, Instagram." = campaign-ROI + channel attribution; **ad-spend→confirmed-booking auto** not explicitly confirmed (integration-flavored). **Wrong vertical.** | Quote |
| **Boulevard** | Salon / spa / med-spa ❌ not PT | Light | **Partial** — booking-led; weaker lead capture (only 5 campaign types, "no lead nurturing") | **No/Partial** | **Partial** — automated marketing, 2-way text, memberships; reviewers flag weak reporting | **No.** "Best for marketing" reputation is about polish/engagement; **no native ad-spend attribution** (reviewers flag missing custom dashboards/KPIs). | From ~$176/mo |
| **Mangomint** | Salon / spa / med-spa ❌ not PT | Light | **Partial** — campaigns/automations, but front-of-house-led | **No** | **Yes** — flows, re-engagement, memberships | **No (explicit gap).** Reviews state plainly: "**Connecting marketing spend to actual bookings and revenue is NOT built into the platform.**" | From ~$165/mo |
| **Mindbody** | Fitness / wellness / spa ❌ not PT | Light | **Yes** — customizable web forms, leads auto-sync; FB lead-ads via LeadsBridge | **Partial** — pipeline mostly via integrations (ActiveCampaign/HubSpot) | **Yes** — marketing tools, automation | **No (native).** Known attribution gap: "Meta tells you clicks, Mindbody tells you sales, **nothing connects them at the patient level**" — requires 3rd-party (LeadsBridge/ActiveCampaign). Ad-ROI is **integration-dependent**, not native. **Wrong vertical.** | From ~$159/mo+ |
| **Vagaro** | Salon / spa / fitness ❌ not PT | Light | **Partial** — campaign + booking link tracking | **No** | **Yes** — email/SMS campaigns | **No.** Campaign dashboard shows bookings from **Vagaro links/email/SMS only** — "**will not track clicks to external websites**." No external paid-ad-spend attribution. | From ~$30/mo+ |

**Cluster 2 verdict:** The aesthetics neighborhood is **far more mature at marketing-ROI** than PT — several platforms genuinely try to connect spend→booking. The leaders (**Aesthetic Record/LeadAR, Symplast, Zenoti, Nextech/Aesthetix, PatientNow**) range from real campaign→booking-revenue attribution to integration-driven Google/Facebook ad linkage. **But every one is aesthetics/salon/wellness — none is PT-native**, and the truly automatic ad-SPEND→confirmed-booking piece is usually integration- or GTM-flavored rather than a clean native ingest.

---

## BOTTOM LINE

### Did we find a NEW true counterexample to the founder's exact wedge (PT-native **+** native auto ad-spend→confirmed-booking ROI)?

**No.** Same pattern as round 1, now confirmed across 17 more platforms:

- **PT-native cluster:** strong lead capture/pipeline/nurture exists (WebPT Reach, PtEverywhere, HENO) but **all stop at lead-source tagging / conversion-rate reporting** — none ingest ad-spend to compute automatic CPA/ROAS→confirmed booking. PtEverywhere only reaches ad-ROI by bolting on **GoHighLevel** (the generic round-1 tool), not natively.
- **Aesthetics cluster:** **does** do real ad→booking ROI (Aesthetic Record/LeadAR, Symplast, Zenoti, Nextech, PatientNow) — but it's the **wrong vertical** (aesthetics/med-spa/salon), and the paid-ad-spend link is frequently **integration/GTM-dependent**, not a clean native auto-ingest.

So the wedge still has **no head-on competitor**: the gap is exactly the diagonal — *(PT-native) × (native automatic ad-spend→confirmed-booking ROI)*. Everyone is either PT-native-without-ad-ROI, or ad-ROI-but-aesthetics, or ad-ROI-but-via-integration.

### Most threatening competitors (3)

1. **WebPT Reach** — *the* threat in PT. Already PT-native, owns the EMR, has lead capture + the "only rehab-therapy contact-management/pipeline" + nurture. They are **one feature release** (ad-spend ingestion + CPA/ROAS on confirmed bookings) away from collapsing the wedge. Closest fast-follow risk; biggest installed base.
2. **Symplast** — proves the full wedge is *technically real and shippable* (Google Ads + Facebook Ads + EMR-connected auto pipelines → "spend to booked consultations, not just clicks"). Wrong vertical today, but it's the clearest blueprint a PT entrant must beat, and a vertical-expansion risk. *(⚠ key claims from a third-party review — verify on live product.)*
3. **Aesthetic Record / LeadAR** (with **Zenoti** as co-threat) — the most mature "EMR + native ROI dashboard + sales pipeline + multi-channel lead capture" package; "direct ROI of marketing spend in a single integrated dashboard." Again aesthetics, but it's the productized template (and Zenoti's lead-to-win funnel + offline-conversion ROI is the salon/wellness equivalent) the founder's PT product will be benchmarked against.

### Specifically: does WebPT Reach do native ad-ROI?

**No.** WebPT Reach captures leads (landing pages, form-fills), runs a rehab-specific lead-management **pipeline** to booked appointments, and reports **conversion rate + lead source** ("where your leads are coming from"). It does **not** ingest paid-ad spend or compute cost-per-acquisition / ROAS / ad-spend→confirmed-booking ROI. It is **lead-source tagging, not ad-spend attribution** — i.e., it does NOT do the founder's wedge.

---

### Sources
- WebPT Reach: https://www.webpt.com/products/reach · https://www.webpt.com/patient-acquisition-retention · https://www.webpt.com/marketing-solutions
- Prompt EMR: https://promptemr.com/ · https://softwarefinder.com/emr-software/prompt
- Raintree: https://www.raintreeinc.com/ · https://www.raintreeinc.com/connect/
- Net Health / Clinicient: https://www.nethealth.com/patient-engagement-suite/ · https://www.nethealth.com/blog/net-health-advances-rehab-therapy-care-with-acquisition-of-keet-health-from-webpt/
- PtEverywhere: https://www.pteverywhere.com/practice-management-software · https://www.pteverywhere.com/media/simplify-pt-marketing-with-broadcasts-and-drip-campaigns
- Empower EMR: https://www.empoweremr.com/products/marketing
- HENO: https://www.heno.io/marketing/ · https://www.heno.io/
- TheraOffice: https://www.softwareadvice.com/medical/theraoffice-profile/
- PatientNow / Growth99 / Aesthetix: https://www.patientnow.com/marketing/ · https://www.patientnow.com/resources/news/the-ultimate-med-spa-growth-engine-patientnow-and-aesthetix-crm-announce-strategic-integration/
- Aesthetic Record / LeadAR: https://www.aestheticrecord.com/leadar/ · https://learn.aestheticrecord.com/en/articles/11978424-faqs-for-leadar-s-start-plan-integration
- Symplast: https://symplast.com/crm/ · https://www.wisevu.com/blog/symplast-ehr-crm-review-for-medspas-and-plastic-surgery-practices/ (⚠ third-party)
- Zenoti: https://www.zenoti.com/platform/marketing · https://help.zenoti.com/en/marketing/lead-management.html · https://help.zenoti.com/en/consumer-experience/webstore/conversion-tracking-in-google-platform.html
- Boulevard: https://www.joinblvd.com/ · https://thesalonbusiness.com/best-medical-spa-software/
- Mangomint: https://www.mangomint.com/features/marketing-and-automation/ · https://www.portraitcare.com/post/boulevard-vs-mangomint
- Mindbody: https://www.mindbodyonline.com/business/marketing · https://leadsbridge.com/blog/mindbody-facebook-ads/
- Vagaro: https://support.vagaro.com/hc/en-us/articles/360036414133-View-Campaign-Success-and-Performance
- Nextech: https://www.nextech.com/solutions/crm · Aesthetix CRM: https://aesthetixcrm.com/
