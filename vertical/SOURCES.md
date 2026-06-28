# 📚 SOURCES — Vertical Bible (Canadian Allied-Health Clinic)

Annotated log of what was mined for [[VERTICAL_BIBLE]], what each source yielded, confidence, and **what still needs deeper (human-pasted) mining.** Date: June 2026.

## ⚠️ Method & honesty note
- **WebFetch was blocked (HTTP 403) on the highest-value first-party sources** — Jane's *Front Desk Digital* site (`frontdesk.jane.app`), `radiofrontdesk.buzzsprout.com`, WebPT, and most consumer clinic/review pages. This is the sites' own bot-protection, **not** an agent-proxy failure (proxy status showed zero relay failures). I **cannot watch/listen to audio or video** regardless.
- Therefore most quotes in the Bible come from **search-engine result *summaries*** of those pages (paraphrase risk → tagged `[MED]`) or are explicitly tagged `[PATTERN]`/`[INFER]`. **No quote was fabricated.** Where exact wording mattered and couldn't be verified, it's flagged.
- **The single biggest upgrade** is a human pasting (a) full *Radio Front Desk* episode transcripts and (b) 50–100 raw Google/RateMD/Facebook reviews. See **"Still needs mining"** at the bottom.

---

## A. Jane App ecosystem (first-party — owner mindset, front-desk reality, Jane gaps)  `confidence HIGH for positioning`
| Source | URL | Yielded | Fetch? |
|---|---|---|---|
| Jane — Front Desk Digital (hub) | https://frontdesk.jane.app/ · https://jane.app/frontdesk | Confirms *Radio Front Desk* podcast + *Front Desk Magazine* exist; host Denzil Ford; mission "help practitioners open, run, and grow." **Episode bodies/show-notes NOT scraped (403).** | ❌ 403 |
| Radio Front Desk — Alison Taylor ep. | https://radiofrontdesk.buzzsprout.com/2405059/... | Co-founder grew up in clinic world (reception/treadmill homework); "confidence masterclass for practitioners." Title/desc only. | ❌ 403 |
| Jane — Front Desk Magazine intro | https://jane.app/blog/introducing-front-desk-magazine | "A Simple Guide to Hiring Your First Employee"; hiring/onboarding handbook for admin staff. | search-summary |
| Jane — hiring/onboarding front desk handbook | https://jane.app/blog/jane-s-handbook-for-hiring-onboarding-and-training-your-front-desk-staff | Confirms front-desk hiring/training is a recognized owner pain Jane addresses with content. | search-summary |
| Jane — physio / features / "solves your clinic pain" | https://jane.app/physio · https://jane.app/us/features · https://jane.app/blog/jane-solves-your-clinic-pain | Jane positioning: reminders "do the work of a full-time staff person," free up front desk; online booking visible instantly. | search-summary |
| NewFrame Digital — "What is Jane App? 2026" | https://newframedigital.com/what-is-jane-app/ | Independent confirmation of Jane's marketing limitations (no native GTM/Meta Pixel). | search-summary (carried from PHYSIO_WORKFLOW) |

**Yield:** owner business-education gap, front-desk-as-pain, Jane = trusted system of record + "does it work with Jane?" objection.

## B. Front-desk / call-handling reality  `HIGH on the 42% stat`
| Source | URL | Yielded |
|---|---|---|
| OhMD — virtual medical receptionist guide | https://www.ohmd.com/virtual-medical-receptionist/ | **300–500 calls/day** at a 10-provider practice; **42% of calls unanswered in business hours** (7,000-call / 22-practice study); vivid "phones ringing while checking in a patient" scene. |
| getNextPhone — PT answering service | https://www.getnextphone.com/answering-service-for-physical-therapy | Peak call times = treatment hours / lunch / after 5pm = when desk is overwhelmed. |
| WellReceived — PT answering service | https://www.wellreceived.com/specialties/physical-therapy-answering-service | "Missed calls mean missed appointments and unhappy patients." |
| KevinMD — telephone problem in primary care | https://kevinmd.com/2017/03/solving-telephone-problem-primary-care.html | Patients "don't want to leave a voicemail and wait — want to talk to someone and walk away with an appointment." |

## C. Patient ghosting / booking behaviour  `MED`
| Source | URL | Yielded |
|---|---|---|
| myaifrontdesk — physio AI phone guide | https://www.myaifrontdesk.com/blogs/...3355e | Patients "dread… leaving a voicemail, playing phone tag, so they simply ghost." |
| NextPhone / WellReceived (above) | — | After-hours callers don't call back; rescheduling friction → no-shows. |

## D. No-show / drop-off / retention  `HIGH (peer-reviewed + aggregators)`
| Source | URL | Yielded |
|---|---|---|
| ScienceDirect / MSK Sci & Practice — qualitative no-show/drop-off study | https://www.sciencedirect.com/science/article/abs/pii/S2468781225000748 | The **5 drop-out reasons** (felt better / access / "do it myself" / other priorities / weak alliance). |
| amp-healthcare — "Why patients miss physio: 5 reasons" | https://www.amp-healthcare.ca/blog/why-patients-miss-physio-5-reasons-behind-dropouts-and-no-shows | **73% miss ≥1 appt; 20% discontinue after 3 visits; 70% don't complete plan**; forgotten-appointment / financial drivers. |
| Physiotutors — adherence / hidden reasons | https://www.physiotutors.com/research/improving-physiotherapy-adherence... | Drop-off reasons corroborated; progress/trust dynamics. |
| plusphysio / SPRY — dropout warning signs | https://www.plusphysio.com/blog/signs-of-patient-dropout · https://www.sprypt.com/blog/6-signs... | Behavioural early-warning signs (supports Module D nudges). |
| Cancellation-policy pages (Dockside, Vaughan, Reload) | docksidephysio.com/... etc. | Real clinic policy language (24h notice, % fee) → front-desk scripts. |

## E. Owner psychology / burnout / business-education gap  `MED–HIGH`
| Source | URL | Yielded |
|---|---|---|
| Physiotutors — software reduces admin/burnout | https://www.physiotutors.com/how-physiotherapy-practice-management-software-reduces-admin-and-prevents-burnout/ | "Clinicians trained to treat, **not** manage workflows/invoices/software"; "wear every hat"; "always catching up"; **~1/3 of time on admin.** |
| USAHS — 14 steps to start a PT business | https://www.usa.edu/blog/14-steps-to-starting-your-own-physical-therapy-practice/ | Owners 50–60 hr weeks; sometimes earn less than as treating PT. |
| CoreMedical / Exer / Physio-Network — burnout | coremedicalgroup.com/... · exer.ai/posts/... · physio-network.com/blog/beating-burnout | Burnout = mental load + admin + systems that don't work. |
| The Go-To Physio (mentorship) | https://thegotophysio.com/... | Owner language: grow "without feeling 'salesy'"; "therapists discharge too quickly / don't get patients back in enough." |
| OwnerHealth / Culture of One / WebPT growth guides | owner.health/... · cultureofone.com.au/... · webpt.com/blog/5-creative-ways... | Owner growth instincts: referrals, networking (gyms/sports/hairdressers), open houses, niching, "be the answer to 'best physio near me'." |

## F. Patient choice / insurance / first-visit anxiety  `MED–HIGH`
| Source | URL | Yielded |
|---|---|---|
| Physiomobility / Core Restore — direct billing | physiomobility.com/physiotherapy-insurance-billing · corerestorephysio.com/billing | **Direct-bill insurer names** (Sunlife, Manulife, Canada Life/Great-West, Blue Cross); "check your coverage" front-desk line. |
| "What to expect first appointment" (multiple CA clinics) | physiovillage.ca · enhancedwellnessclinic.com · physioplantagenet.com | First-visit structure + **"anxiety starts before you enter the clinic"**; intake-before-arrival reduces nerves. |
| Chiro first-visit fear (Cannon, Northcote, The Joint, Baywest, walk-in-chiro, Quora) | cannonchiropractic.com/blog/... · thejoint.com/.../nervous... · baywesthealth.com/... | **The actual fear questions** (is it safe / does it hurt / the cracking sound); reassurance script ("pause, ask, decline without judgment"). |
| RMT review/clinic pages (Toronto: Osteo Tuina, Myocare, North Toronto RMT) | osteotuina.com · myocarermt.com · northtormt.com | RMT split **relaxation vs rehabilitation**; review phrases ("so relaxing," "found exactly where the tension was," "checks in," "booked my next"). |
| Same-day / online-booking clinics (painPRO, ATI, Booksy) | painproclinics.com · atipt.com · booksy.com | Patients value same-day + 24/7 online booking + "someone who answers." |

## G. AI-receptionist objections  `MED`
| Source | URL | Yielded |
|---|---|---|
| OhMD / Cabot / DoctorConnect / DezyIt | ohmd.com · cabotsolutions.com/blog/... · doctorconnect.net/ai-receptionist · dezyit.com/post/voice-ai-vs-human-reception | "Patients want a human for complex/emotional cases"; **hybrid (AI + human handoff)** is the accepted answer; early-AI "robot voice" trust barrier. → directly informs our objection-handling. |

## H. Marketing-attribution / agency distrust  `MED` (carried + extended from PHYSIO_WORKFLOW)
| Source | URL | Yielded |
|---|---|---|
| PT Marketing Pros / PatientPartners / Breakthrough / NewFrame | ptmarketingpros.com · patientpartners.co · getbreakthrough.com · newframedigital.com/physio-meta-ads-150-leads-month | **~26% know CAC**; agencies "brag about clicks/impressions while the front desk stays quiet"; Meta-ads lead-gen reality. |
| (Full attribution / Jane-gap bibliography) | see PHYSIO_WORKFLOW.md "Sources" | Speed-to-lead 21×/80%, no Pixel/GTM, rebooking 30–50%, reactivation 5–15%, reviews 90%/75%, missed-call $400 LTV, no open API. |

---

## 🔴 STILL NEEDS MINING (where a human materially deepens the Bible)
Ranked by payoff. These are the things WebFetch/WebSearch could NOT get and that would turn `[MED]`/`[PATTERN]` material into `[HIGH]` verbatim gold.

1. **Radio Front Desk podcast transcripts (TOP PRIORITY).** Paste full show-notes/transcripts — esp. owner-story episodes and the Alison Taylor "confidence" episode. *Why:* real owner emotion, front-desk war stories, and growth language in their own words. The whole `frontdesk.jane.app` library is 403-blocked to me.
2. **"How I Use Jane" / "Behind the Practice" written features.** Named owner workflows (e.g., Natasha Wilch / Symphony Rehab, Roni Glassman — surfaced but bodies not scraped). *Why:* concrete day-in-the-life + which Jane gaps they feel.
3. **50–100 raw Google / RateMDs / Facebook reviews** for physio, chiro, and RMT clinics (ideally Canadian, ideally the founder's own clinics + 3–4 competitors). *Why:* the [[VERTICAL_BIBLE#6 🗣️ LANGUAGE BANK]] currently leans on paraphrased review snippets; verbatim reviews give exact patient phrasing for ad copy + voice scripts, including the **negative** ones ("couldn't get an appointment," "no one called back").
4. **Real front-desk call recordings / transcripts** from a friendly clinic. *Why:* the front-desk scripts in §2.4/§6.4 are `[PATTERN]` composites — real calls would let us model the AI voice agent on *actual* greeting/triage/insurance/rebooking turns and objection moments.
5. **Reddit/Facebook-group threads** (r/physicaltherapy, r/physiotherapy, r/chiropractic, r/massage, clinic-owner FB groups). *Why:* WebSearch returned almost nothing from Reddit directly (likely indexing/robots). A human pasting 5–10 owner threads on "getting patients / agencies / no-shows / first front desk hire" would add unfiltered owner voice + objection language.
6. **The founder's own ad + booking data** (one clinic). *Why:* validates the vendor-sourced economics (missed-call LTV, speed-to-lead lift, CAC) before they anchor pricing/ROI claims — flagged in PHYSIO_WORKFLOW's honesty checks.

> When transcripts/reviews are pasted, fold them into the matching Bible node and **upgrade the tag** (e.g., a `[PATTERN]` front-desk script → `[HIGH]` once matched to a real call). Keep the source URL/episode beside each new quote.
