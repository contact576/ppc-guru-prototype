# PPC Guru — Live Production vs. Prototype Inventory

**Captured:** 2026-06-05 from the live app at `https://darkgoldenrod-reindeer-935702.hostingersite.com` (authenticated walkthrough).
**Purpose:** Know exactly what Shrikaanth has already shipped, so new work is a deliberate "top layer," not a rebuild.

## Big picture
- Stack: **Next.js (App Router) + React + Tailwind + NextAuth**, hosted on Hostinger. One `/dashboard` shell with ~26 real sub-routes (middleware hides them from anonymous probing).
- It is **not a skeleton** — it runs on **real data**: 51 clients, live ad performance via **Adzviser** (80 linked accounts), and live **Google Workspace** (Gmail, Calendar/Meet, Sheets, Drive) integrations.
- The prototype is **no longer ahead** of production. In ads reporting, intake, SLA/stages, and Google integration, **live is the more current source of truth.**

## What's BUILT and working (with real data)

| Live screen (route) | Status | Notes / real data seen |
|---|---|---|
| **Dashboard** `/dashboard` | ✅ live | KPIs: 17 active clients, MRR $15,124 CAD, at-risk, optimization-overdue. Live ad performance (Adzviser, 80 accts): $94,235 spend / 2,861 conv / blended CPA $33. Onboarding bottleneck map, optimization queue, workspace files, creative pipeline counts, tasks summary, recent activity. |
| **Onboarding** `/onboarding` | ✅ live | Kanban, real cards, service chips (Meta 12 / Google 5 / SMM 1 / Influencer 0). Owner auto-assign, Mine-only toggle, per-card budget warnings. |
| **Active Clients** `/active` | ✅ live | Monthly-loop kanban (Meta 5 / SMM 3 / Google 14). |
| **Clients** `/clients` | ✅ live | 51-client table; status filter (Onboarding / On Trial / Paid Client / On Hold / Cancelled); ID, Company, Contact, AM, Services, MRR, Health, Status; row→detail, Edit. |
| **Client Reviews** `/client-reviews` | ✅ live | Monthly review tracker, 20 due, per-service Due/Done + Mark reviewed. |
| **Briefs** `/briefs` | ✅ live | 55 client briefs from a **Google Form**, 44 linked / 11 unmatched; "Wire your Google Form", "Load missing leads → Onboarding". Real lead-intake data back to 2022. |
| **Optimization** `/optimization` | ✅ live | Queue by days-since-last-opt, monthly budget, Mark optimized, activity log. |
| **Meta accounts** `/meta-accounts` | ✅ live | **Adzviser live Meta**, 26 accounts, $56,964 spend; 7d/30d/MTD/Last-month/Custom toggles; Refresh live data; full metric table. |
| **Google accounts** `/google-accounts` | ✅ live | **Adzviser live Google**, 54 accounts, $37,272 spend; same toggles. |
| **Creative** `/creative` | ✅ live | Creative studio kanban (36 cards): Brief → In Production → In Review → Client Approval → Approved → Posted; reel/post types, Drive links. |
| **SMM board** `/smm-board` | ✅ live | 4 SMM clients with deliverable counts (reels/posts). |
| **Social Calendar** `/social-calendar` | ✅ live | Monthly content calendar; Reels/Statics/Carousels/Stories/Videos; attach asset; per-month list. |
| **Tasks** `/tasks` | ✅ live | 53 tasks; Table / Kanban / Calendar / Grouped views; filters (Mine/Unassigned/Due/Overdue/Critical); allocation board; schedules; save view; export; status cycle todo→in progress→review→done. Auto-generated stage tasks + manual. |
| **Team** `/team` | ✅ live | Workload by teammate (9 people w/ roles), daily log, monthly throughput, overdue counts. |
| **Reports** `/reports` | ✅ live | Reports library, 42 clients, **Generate branded report** (PDF), report IDs (RPT-2026-####), View. |
| **Workspace** `/workspace` | ✅ live | Google Workspace hub. **Master Ops Sheet (15 tabs)** opens as in-portal editable grid; edits **save back to Google Sheets on blur**. Client Drive folders. |
| **Mail** `/mail` | ✅ live | **Gmail inbox** as contact@ppcguru.ca; read/compose. |
| **Meetings** `/meetings` | ✅ live | **Google Meet/Calendar** scheduling; huddles (pre-fill attendees); auto-invites; recurrence. |
| **Chat** `/chat` | ✅ built | **Team messaging** (Direct / Spaces) — Slack-style, NOT an AI assistant. |
| **Finance** `/finance` | ✅ built | **PIN-protected** "Master Financial Register" (owner-only). Not opened. Likely holds commission/billing. |
| **Admin · SLA** `/admin/sla` | ✅ live | Configurable **stage engine**: 61 stages across 9 pipelines (Meta, Google, SMM, Influencer + monthly-production variants + Google monthly-optimization). Per-stage owner-type, default owner, SLA days; breaches create critical tasks + notify. |
| **Admin · Bootstrap** `/admin/bootstrap` | ✅ live | **Data pipeline** from the master Google Sheet: pull credentials + Drive URLs, one-click client mapping/sync, Google-Form briefs import. |
| **Admin · Users** `/admin/users` | ✅ exists | Not captured in detail. |
| **Notifications** `/notifications`, **Settings** `/settings/workspace`, **Profile** `/profile` | ✅ exist | Not captured in detail. |

## Real team (from `/team`)
Aadil Tauro (Designer), Abhishek Tewari (Admin/Sales), Dhaval Patel (Owner), Harsh Rathod (Ads Manager), Jaydeep Patel (Owner), Rayu Naik (Designer), Shrikaanth Shyamsunder (Admin/dev), Vanshika Raghuvanshi (Social Media Manager), Vihar Kalariya (Project Manager).

## Real onboarding stages (live, per `/admin/sla` — differs from prototype)
- **Meta Ads:** Form Sent · Form Received · Business & Industry Research · Discovery Call · Creative Strategy Development · Creative Concept Approval · Design Production · Creative Done · Final Creative Approval · Campaign Build & Tracking · Live + Looker Access
- **Google Ads:** Form Sent · Form Received · Onboarding & Access · Keyword Research & Ad Copy · Client Approval · Campaign Build & Tracking · Live + Looker Access
- **SMM:** Initial Meeting & Access · Content Strategy & Calendar · Client Approval · Production · Production Done · Internal Final Review · Scheduling · Live + Recurring
- **Influencer Services:** Form Sent · Form Received · Creator Research & Shortlist · Creator Outreach · Client Approval · Content Production · Live + Reporting
- Plus **monthly-production** variants for Meta/SMM/Influencer and a **Google monthly-optimization** pipeline.

## In the PROTOTYPE but NOT in live (candidate "top layer")
- **My Day** — per-role morning planner. Not in live.
- **AI Assistant (Claude-powered)** — context-aware assistant. Live `/chat` is *team messaging*, a different thing. The Claude assistant is not present.
- **Sales workspace (Phase 4 — Abhishek)** — dedicated Leads / Pipeline / Calls / Emails / Forecast with the cross-channel comms tally + WhatsApp. Live has `/briefs` (intake) but not the full salesperson workspace.
- **Forecast / Win-rate**, **Concentration Risk**, **Commission** — owner analytics. May partly live behind the Finance PIN; not confirmed.
- **Scenarios** — training stories (was demo-only; low priority).
- **Client Bible: Vault / Transcripts / Findings** — credentials vault + meeting transcripts. Live pulls some credentials via Bootstrap and has Drive folders, but the unified Vault/Transcripts panel isn't confirmed.

## In LIVE but NOT in the prototype (production has surpassed the design)
- Live **Adzviser** ad reporting (replaces the mocked Platforms + the Looker "Performance Home" idea).
- Real **Gmail / Calendar-Meetings / Sheets-Workspace / Drive** integration.
- **Reports** branded-PDF generation.
- **Admin · SLA** configurable stage engine (supersedes the prototype's "locked stages" + Auto-rules).
- **Admin · Bootstrap** master-sheet sync data pipeline.
- **Team messaging** (`/chat`).
- Per-service **review tracker**, **briefs** intake from Google Form.

## Suggested reconciliation
1. Treat **live as source of truth** for: stages/SLA, clients, ads reporting, Google integrations, reports.
2. Update the prototype's stage names + client/data shapes to match live (so the two stop drifting).
3. Scope the **top layer** from the "in prototype, not in live" list — most valuable first: **My Day**, **AI Assistant (Claude)**, **Sales workspace (Abhishek)**, **owner analytics (Forecast/Concentration/Commission)**.
