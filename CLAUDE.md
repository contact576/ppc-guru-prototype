# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# PPC Guru — ERP / Operations Dashboard

Single-page React prototype living in **`prototype/`** (`prototype/index.html` + `prototype/src/*`). This repo is a **design + behavior reference**, not the production app — the agency's real product is a live Next.js app; the prototype is Jaydeep's fast design sandbox for speccing features before his developer (Shrikaanth) builds them. Read existing files before changing anything — the locked process logic and sample data are the source of truth, not your assumptions. See `README.md` for the production-stack handoff and the integration seams; `LIVE_STATE_INVENTORY.md` for what the live app already ships.

## Running & verifying

There is **no build, lint, or test step** — it's in-browser React 18 + Babel-standalone (pinned, integrity-checked in `index.html`). Edits are live on reload; there is no hot-reload.

```bash
# serve the prototype (config also in .claude/launch.json)
python3 -m http.server 8000 --directory prototype
# then open http://localhost:8000/index.html
```

- **No `node` on PATH** — you cannot syntax-check `.js`/`.jsx` from the CLI. Verify in the **browser console** instead (the real runtime). Babel surfaces parse errors there; `window.PPC` is the live data namespace to eval against.
- Cache-bust on reload with a throwaway query string (`?v=...`) — the static server sends no-cache-busting headers. **Every local `<script src="src/*">` tag in `index.html` now carries a `?v=YYYYMMDD…` cache-bust token** (bump it when a sub-resource like `data.js` is edited but the browser keeps serving a stale copy — browsers heuristic-cache un-changed files aggressively). The single-file inliner (`/tmp/inline_ppc.py`) **strips the `?v=` query** before reading each file, so the bundle still builds.
- **Team roster is the real employees** (`USERS` in `data.js`, ids unchanged): Jaydeep Patel · Dhaval Patel · Shrikaanth Shyamsundar (id `shrikant`) · Vihar Kalariya · Abhishek Tewari · Vanshika Raghuvanshi · Harsh Rathod · Rayu Naik · Aadil Tauro (id `aadil`). The parser resolves a spoken name by **id OR first name**, so both the id-spelling and the real first name work.
- `prototype/` contains backups (`index.html.bak-*`, `src.bak-*`) and a single-file offline bundle (`PPC Guru - ERP (offline).html`) — **don't edit those**; they're snapshots. Only `prototype/index.html` + `prototype/src/*` are live.
- This is **not a git repository** — there is no commit history to consult or push to.

## File map

```
prototype/index.html    # shell + design tokens (CSS variables) + script load order
src/
  data.js               # USERS, stages, cards, leads, role access, CLIENT PROFILES, TASKS_RICH,
                        # MEETINGS_TODAY, FOCUS_BLOCKS, CLIENT_VAULTS, CRED_AUDIT,
                        # DRIVE_FOLDERS, TRANSCRIPTS, PENDING_AUTOPULL, AUTOPULL_SYNTH,
                        # store mutations
  liveData.js           # window.PPC.LIVE — REAL captured production data (team, status
                        # taxonomy, stage pipelines, 51 clients, 55 briefs). Additive
                        # reconciliation layer; legacy data.js seed is NOT removed.
  phase5Sales.js        # window.PPC.S5 — Sales REDESIGN data model (leads/deals/trials,
                        # per-record activity log, Zoom calls, all mutations + KPIs)
  salesWorkspace.jsx    # Phase 5 Sales screens: SalesLeadsLiveScreen, SalesPipelineLiveScreen,
                        # SalesTrialsScreen, SalesCallsLiveScreen, SalesDashboardScreen
                        # + LeadDetailPanel / DealDetailPanel slide-overs + S5* pills
  icons.jsx             # Icon set (stroke SVG) — incl. sparkle, send, refresh
  primitives.jsx        # Avatar, Pill, Stat, Spark, Bars, ToastHost, fmtMoney, ageClass
                        # + useStore() hook, Field/TextInput/Textarea/SelectInput/UserSelect/PriorityPick/DuePick
  myDay.jsx             # MyDayScreen — per-role morning planner (DEFAULT LANDING SCREEN)
  aiAssistant.jsx       # AssistantProvider, AssistantBubble, AssistantPanel, AssistantScreen
                        # Claude-powered, context-aware (focus client / focus platform / role)
  scenarios.jsx         # ScenariosScreen + 8 lifecycle stories with timeline
  autoTasks.jsx         # 4 auto-rules + evaluator + AutoRulesScreen (Admin)
  clientProfile.jsx     # ClientProfilePanel — UNIFIED client view
                        # Tabs: Overview · Lifecycle · Brief · Notes · Accounts · Vault · Drive
                        #        · Transcripts · Findings · Files · Tasks · Performance
                        # + ChangeStatusModal (per-service status changes with reason)
  clientBible.jsx       # VaultTab, DriveTab, TranscriptsTab (mounted by clientProfile.jsx)
  taskDetail.jsx        # TaskDetailPanel + NewTaskModal (rich task system)
                        # + TaskTimeBlock (Phase 6: duration estimate + start/stop timer)
  taskQuickAdd.jsx      # window.parseQuickAdd (NL parser) + QuickAddBar + TenMinBanner (Phase 6)
  teamActivity.jsx      # TeamActivityScreen — owner/PM activity + tracked-hours report (Phase 6)
  newClient.jsx         # NewClientModal (4-step create flow)
  sidebar.jsx           # Sidebar + NAV (filters by role)
  dashboard.jsx         # Command Center (+ SMMReadinessWidget)
  boards.jsx            # Onboarding + Active Clients kanban + designer picker
                        # + monthly Calendar view + Atlas view  (cards open ClientProfilePanel)
                        # SMM Active cards show next-month production progress bar
  content.jsx           # Content Studio — SMM monthly plans, calendar views, plan panel, editor workload
  tasks.jsx             # Notifications, Client Reviews + reusable TaskCard/TaskRow/TaskTimerBtn/PullAhead
                        # (TasksScreen retired from routing — superseded by tasksWorkspace.jsx)
  tasksWorkspace.jsx    # Phase 7 — TasksWorkspace: Todoist two-pane (sub-sidebar + Today/Upcoming/
                        # Inbox/Filters/Calendar/Reporting/Team/projects); board|list + group/sort
  persist.js            # MEMORY — localStorage + Netlify Blobs cloud sync (per-user sync code)
                        # of mutated slices (tasks/projects/profiles/optlog/plans/credaudit/s5state)
                        # PPC.resetDemoData() / PPC.setSyncCode() / PPC.persistInfo()
netlify/functions/state.js  # serverless GET/POST → Netlify Blobs store (keyed by sync code)
package.json · netlify.toml # function deps (@netlify/blobs) + [functions] dir; publish=prototype/
  sales.jsx             # Pipeline (kanban) + Leads (table)
  forecast.jsx          # Pipeline Forecast / Win-rate (Phase 3) — weighted pipeline, by-source rates,
                        # days-in-stage vs benchmark, closing-soon list
  platforms.jsx         # Meta + Google daily-budget pacing dashboard
                        # (Pacing / Performance / Optimization Log tabs)
  insight.jsx           # Team Workload + Reports
  performance.jsx       # Performance Home (Phase 3, owners-only) — Looker mirror across
                        # all active accounts. KPI tiles + 12mo trends + per-service + drill
  concentration.jsx     # Concentration Risk (Phase 3, owners-only) — top-N MRR, Lorenz curve,
                        # by-service exposure, at-risk overlay, churn impact simulator
  commission.jsx        # Commission dashboard (Phase 3, owners-only) — MTD vs 3× target,
                        # trailing 12m, by-client first-month vs recurring, team roll-up, forecast
  emailCompose.jsx      # EmailComposer modal (Phase 3) — Guru-drafted client emails,
                        # opens via window.openEmailCompose({ client, template, who })
  phase3Data.js         # Phase 3 additive data + helpers on window.PPC (pipeline forecast,
                        # concentration, churn impact, perf trends, commission history,
                        # notif persistence + grouping)
  phase4Data.js         # Phase 4 additive Zoho data + helpers on window.PPC (ZOHO_LEADS,
                        # ZOHO_DEALS, ZOHO_STAGES, ZOHO_CALLS, ZOHO_EMAILS, ZOHO_HISTORIES,
                        # province-from-phone, comms tally, email + call KPIs)
  phase4Sales.jsx       # SalesHomeScreen + SalesLeadsScreen + SalesPipelineScreen (Zoho-style)
  phase4SalesExtras.jsx # SalesCallsScreen + SalesEmailsScreen + SalesHistoryPanel
                        # (unified cross-channel timeline: calls/WhatsApp/email/meeting/stage)
  admin.jsx             # Users & Roles + Service Catalog (visual stage editor)
  app.jsx               # router + topbar + role switcher + mounts global panels
```

Babel scripts share no scope — components are exposed via `Object.assign(window, { … })` at the bottom of each file. Style objects, if you add any, **must be uniquely named** (`dashStyles`, not `styles`).

## LOCKED — do not change without explicit user approval

### Sidebar structure
Operations → **My Day** · Dashboard · **Assistant** · **Scenarios** · Onboarding · Active Clients · **Content Studio** · Workflow (Tasks/Notifications/Reviews) · **Sales (Home/Leads/Pipeline/Calls/Emails/Forecast)** · Platforms (Meta/Google) · Insight (**Team Activity**/Workload/Reports) · Admin (Users/Catalog/**Auto-rules**). Onboarding and Active Clients are each ONE screen with service-selector chips on top — never a separate sidebar item per service. **Content Studio is SMM-only** and lives at the top level alongside Onboarding/Active. **My Day is the default landing screen for every role.** **Sales is the salesperson workspace (Phase 4) — 6 items, one sidebar, scoped per employee; see the Phase 4 section.**

### Stages, owners, owner-types
Defined in `src/data.js` as `ONBOARD_STAGES`, `ACTIVE_STAGES`. Order and default owners are locked. Owner-types drive UI and behavior:
- `team` — auto-assigns default owner on card entry; fires task + notification
- `client` — visually distinct column (warm-grey tint); never auto-assigns; "waiting on client"
- `designer` — manual only; designer cleared on stage entry; "Assign designer" prompt; assigning fires task + notification
- `multi` — multiple owners (e.g., Harsh + Vanshika for Discovery Call)

### Process rules
1. Manual override applies to current stage only; advancing clears it and re-triggers next stage's default owner.
2. Google "Onboarding & Access" (`g3`) is non-blocking — card can advance with `accessPending: true` flag that follows it until next stage.
3. At a stage marked `terminal: true` ("Live + Looker Access" etc.), the card graduates from onboarding to the matching Active board.
4. Google Ads has NO Active monthly board — its recurring work lives in the **Optimization Log** (platforms.jsx), not a kanban.

### Role-based access (`ROLE_ACCESS` in data.js)
Two layers:
- **Layer 1** — `services: []` controls which boards a role can even open. Vanshika has no Google; Harsh has no SMM; designers see Meta+SMM.
- **Layer 2** — `scope`: `all` (Owner/PM, nothing dimmed), `mine` (own cards highlighted orange, others dimmed, Mine-only toggle), `designer` (only production stages), `sales` (sales/onboarding intake only).
- `money: true` is **owner-only**. Hide MRR, budget dollars, CPA dollars, lead spend everywhere else.

### Other locked rules
- CAD and USD must never be mixed in a single number; show currency per card/row.
- Client Reviews is a **standalone list** of all live clients with last/next review date + health flag. NOT a stage on any board. Non-blocking.
- Role switcher (top right) must work — switching changes sidebar visibility and within-board highlighting.

## Design tokens

All in `index.html` `<style>` as CSS vars. Don't invent new colors.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F7F4EE` | warm off-white app background |
| `--paper-2` | `#F1ECE3` | recessed (sidebar) |
| `--card` | `#FFFFFF` | card surface |
| `--card-2` | `#FBF8F2` | tinted card / column body |
| `--ink` / `--ink-2/3/4` | `#1B1714` → `#A09689` | text ramp |
| `--line` / `--line-2` / `--line-strong` | borders | |
| `--accent` | `#C5552D` burnt orange | primary accent, highlight ring |
| `--ok` `--warn` `--danger` | green/amber/red | status only — never decoration |
| `--client` `#4E6FAE` | blue | "waiting on client" |
| Type | Newsreader (serif display), Geist (sans UI), Geist Mono (numbers) | |
| Radii | 6 / 10 / 14 / 20 px | `--r-1..4` |
| Spacing | 4 / 8 / 12 / 16 / 24 | gap utilities `.gap-2/3/4/6` |

## Style + behavior conventions

- Numbers and money: `<span className="mono">` (tabular). Use `fmtMoney(amt, currency)` from primitives.
- Status: prefer `<Pill kind="ok|warn|danger|client|accent|outline">`. Add `dot` prop for the leading dot.
- New screens follow the page-head pattern: eyebrow (small caps) → serif title with `<em>` accent → muted sub.
- Drag/drop in kanban: use `draggable` + `onDragStart`/`onDragOver`/`onDrop`. Fire `window.toast(msg, {icon})` whenever an automation would fire.
- Side panel for card detail uses `.side-panel` + `.panel-scrim` (already in CSS).

## Unified panels — single source of truth for client + task views

App-level state mounts these panels once; any screen opens them via globals:
- `window.openClientPanel(idOrName)` — opens **ClientProfilePanel** (tabs: Overview · Brief · Notes · Accounts · Findings · Files · Tasks · Performance). Accepts a card id (`c-meta-3`, `a-meta-1`) OR a client name (`"Maritime Realty"`). Falls back to a generated template profile if no rich one exists, so any card click anywhere shows something reasonable.
- `window.openTaskPanel(id)` — opens **TaskDetailPanel** (description, checklist, links, attachments, comments, watchers, status cycle).
- `window.openNewTask(defaults?)` — opens **NewTaskModal**. Pass `{ client, service }` to pre-fill.
- `window.openNewClient()` — opens **NewClientModal** (4-step: Basics → Contact → Brief → Squad). Creates an onboarding card in stage 2 + a full profile.

**Rule:** when adding any new card / list-row / link that represents a client, wire it to `openClientPanel`. Never build a one-off client detail view.

**Mutations live in `window.PPC.store`** (data.js). Mutations fire `ppc:update` events; subscribe with `useStore()` from primitives.jsx to re-render on changes. Available: `addNote`, `addFile`, `addTask`, `updateTask`, `toggleTaskDone`, `toggleChecklistItem`, `addChecklistItem`, `addComment`, `addLink`, `addClient`, `setPlanStatus`, `setDeliverableStatus`, `assignDeliverable`, `setDeliverableField`.

## Lifecycle & Status System (LOCKED behavior — Phase 1)

Every client has **per-service contracts** at `profile.serviceContracts[service]`. Each contract carries an independent **status** (`active` / `paused` / `cancelled` / `onboarding`), `statusSince`, `statusReason`, `monthlyFee`, `currency`, `contractStart`, `contractTerm`, and `salesperson`. Meta contracts also carry `creativeRefresh` (cadence 45d, alert at day 35).

### Derived top-level status
`profile.status` (the legacy single field) is now **derived** via `window.PPC.getDerivedStatus(profile)`:
- all services `cancelled` → `cancelled`
- all services `paused`/`cancelled` → `paused`
- any `active` → `active`
- else → first contract status

### What status changes trigger (handled in `store.setServiceStatus(client, service, next, reason)`)
1. **Activity log** entry on the profile
2. **Note** added under category `internal` capturing the transition
3. **Paused** → 7-day **churn-risk** notification to Vihar (`shiftDate(TODAY, 7)`)
4. **Cancelled** → auto-generated "Final report" PDF stub added to profile files
5. `bump()` to re-render

### MRR & KPI rules
- `profileMRR(profile)` only sums **active** contracts
- Paused / cancelled contracts are still visible on profile but **do not count toward MRR** or utilization KPIs
- The Overview header's "Active MRR" line uses `profileMRR()`, not the legacy `profile.mrr` field

### Status filter on boards
The board screens (`boards.jsx`) show **status chips**: All / Active / Paused / Cancelled. Default is `active` for Active Clients, `all` for Onboarding. Paused/cancelled cards are filtered out of the active view but stay queryable. Status is read from `PROFILES_RICH[card.name].serviceContracts[card.service].status` with fallback to "active"/"onboarding".

### Creative refresh
`window.PPC.creativeRefreshState(contract, today)` returns `{ daysSince, daysUntilDue, dueSoon, overdue, ... }`. The Lifecycle tab on Meta contracts shows a progress bar + freshness pill + "Mark refreshed" button (`store.markCreativeRefreshed(client)` resets the cycle). Cadence/alert defaults live in `CREATIVE_REFRESH = { cadenceDays: 45, alertAtDay: 35 }`.

### Reporting hierarchy
USERS now carry `reportsTo: [...]`. Tree (Phase 1):
- Jaydeep + Dhaval (Owners) — top
- Shrikant (Head of Delivery), Abhishek (Sales), Vanshika (Creative Mgr), Harsh (Ads Mgr) → report to owners
- Vihar (Sr. PM) → reports to Shrikant
- Rayu, Aadil → report to Vanshika

### Commissions
`COMMISSION_RULES[salesId] = { firstMonth, monthsTwoToSix, afterSix }`. Abhishek: 5% / 3% / 0%. `commissionEarned(salesId, monthISO)` walks every active contract and returns `{ total, byClient[] }`. Monthly target = 3× salary (`USERS.targetMultiplier`). The commission dashboard is Phase 3 — data is ready.

### Pricing reference
`PRICING_GUIDE[service]` exposes starter/growth/anchor tiers as defaults for the New Client modal.

## Platforms — Daily budget pacing (LOCKED behavior)

The Platforms screens (`src/platforms.jsx`, routes `meta` / `google`) are the daily-driver tool for Vanshika (Meta) and Harsh (Google). They replicate + replace the spreadsheet the user runs every day to check ad spend pacing per account.

### Tabs (per platform)
- **Budget pacing** (default) — one row per account with MTD vs pro-rata target bar, utilization %, normal/suggested/current daily, guidance pill (Fine/Increase/Decrease/Error).
- **Performance** — CPA / CTR / conversion view (legacy single-row layout).
- **Optimization log** — every change made this month, audit trail, with coverage bars (≥4 logs per account / month).

### Pacing math (pure functions in `paceFor()` inside `platforms.jsx`)
- `proRata = monthlyBudget × (activeDaysPassed ÷ activeDaysTotal)`
- `shortfall = proRata − mtdSpend` (positive = behind, negative = overpacing)
- `suggestedDaily = (monthlyBudget − mtdSpend) ÷ activeDaysRemaining`
- `normalDaily = monthlyBudget ÷ activeDaysTotal`
- **Guidance bands**: `suggestedDaily` within **±15%** of `currentDailyBudget` = Fine. Above → Increase. Below → Decrease. Status `error` or `currentDailyBudget = 0` → Error.

### Active-day math
`computeActiveDays(month, todayISO, excludedWeekdays, excludedDates)` returns `{ activeTotal, activePassed, activeRemaining, excludedTotal, dayMap }`. Default exclusion is **Sat + Sun** for most accounts (`excludedWeekdays: [0, 6]`); B2C accounts run 7 days.

### LOCKED rules
1. **Today is `TODAY` constant in `data.js`** (currently `"2026-05-25"`). All pacing math is computed against this. Update both the SMM 25th-rule logic and the platforms pacing date together if you shift the demo date.
2. **Logging an optimization auto-mirrors to the client profile.** `store.logOptimization()` writes the entry to `OPT_LOG` *and* prepends an `optimization` note + activity entry to that client's profile. Never bypass this — it's how the client portal stays in sync.
3. **Goal phrasing**: "100% utilization · every unspent $ is unbilled mgmt fee." Reinforced in copy across the KPI tiles and panel.
4. **Money visibility** — pacing dashboard exposes budget dollars. The `money: true` ROLE_ACCESS check still applies in principle but the screens are scoped to specialists (Harsh / Vanshika) and owners; designers / sales should not see them. If you add a role gate, do it in `sidebar.jsx`, not in `platforms.jsx`.
5. **Currency mixing** — Meta book mixes CAD + USD. KPI tiles show a per-currency breakdown in the sub-text. Don't sum across currencies into a single "true total" — always show the per-currency split.

## Content Studio — SMM monthly workflow (LOCKED behavior)

The Content Studio (`src/content.jsx`, route `content`) runs **one Plan per (client, month)** for every active SMM client. Each plan has a status from `PLAN_STAGES` and an array of `deliverables` (reels + statics) with their own mini-pipeline (`DELIV_STAGES`).

### Data model (all in `data.js`)
- `SMM_QUOTAS` — standing monthly quota per client, e.g. `"Wildflower Bakery": { reels: 2, statics: 4, postingDays: "Tue · Sun" }`. Owner can override per-month on a specific plan.
- `PLAN_STAGES` — 8 stages: `calendar-draft → calendar-pending (w/ client) → calendar-approved → in-production → creative-pending (w/ client) → approved → scheduled → live`. Two client-approval gates: calendar plan upfront, then batch creative review.
- `DELIV_STAGES` — 7 per-piece stages: `briefed → in-production → internal-review (Vanshika) → client-review → approved → scheduled → posted`.
- `CONTENT_PLANS` — auto-generated for May/Jun/Jul 2026 with realistic distribution: May is `live`, most of Jun is `scheduled` (two clients behind to trip the alert), Jul is mostly `calendar-draft`.
- Helpers on `window.PPC`: `getPlan(client, month)`, `planProgress(plan)`, `planLabel(stageId)`, `monthLabel`, `monthShort`, `nextMonth`, `prevMonth`, `monthDaysIn`.
- Time budgets per piece are `{ reel: 4.5h, static: 0.75h }` (in `TIME_BUDGET`) — drives the editor workload card. **Real cadence rule: video creation should never take longer than 4–5h, statics never longer than 30–60 min.**

### Hard rule — the 25th
By day 25 of month M, plans for month M+1 must be `scheduled` or `live`. Anything below that fires the red banner on Content Studio and the `SMMReadinessWidget` on the dashboard. **Today date is hard-coded as "2026-05-25"** for the demo; if you change the demo date, update both the widget and `content.jsx` so the alert stays consistent.

### Editor assignment
Vanshika assigns each deliverable individually to Rayu or Aadil from the plan panel. The editor workload card on Content Studio sums hours per editor across the focused months and warns if anyone exceeds ~38h/wk. Designers see SMM deliverables in their own "Pull ahead" list (see below).

### Pull-ahead surfaces (idle capacity)
- `PullAheadSection` in `tasks.jsx` — Rayu / Aadil see next-month deliverables they can start early; Vanshika / Owners / PM see clients with no calendar started for month +2.
- `SMMReadinessWidget` on dashboard.jsx — owner/PM view of which clients are behind for next month.

### Calendar views
Content Studio toggles between **Plans grid** (matrix of clients × 4 months with status pills + production %) and **Calendar** view (which itself toggles All-clients heatmap ↔ Per-client monthly grid). All calendar dates are based on `postingDays` in the quota.

### SMM Active board cross-link
The `boards.jsx` SMM Active card shows a small progress bar for next-month production (`window.PPC.CONTENT_PLANS.find(p => p.client === card.name && p.month === "2026-06")`). Don't duplicate plan editing UI here — clicking opens the unified ClientProfilePanel; deep edits happen in Content Studio.

## Phase 2 (Operations & AI) — LOCKED behaviors

### My Day — default landing screen
`src/myDay.jsx` renders `MyDayScreen`. Three-lane timeline (Morning / Afternoon / Wrap-up). Each lane mixes meetings (from `MEETINGS_TODAY[roleId]`) and prioritized tasks (auto-from-pipeline + rich tasks). Includes role-specific focus hints (`FOCUS_BLOCKS`), a "Start with" callout (auto-picks high-risk → high-prio task → first meeting), a per-role risk watchlist, and a capacity bar. **App boots into `myday` for every role.** Watchlists are role-specific (Harsh sees stale Google opts, Vanshika sees creative refresh + SMM 25th rule, Vihar sees stuck cards + overdue reviews, etc.).

### AI Assistant — Claude-powered, context-aware
`src/aiAssistant.jsx`. Three surfaces, one engine:
- **Floating bubble** (bottom-right, all screens except `assistant` full-page)
- **Slide-in panel** (460px right rail)
- **Full-page screen** at sidebar → Operations → Assistant

Wrapped in `<AssistantProvider role screen focusClient focusPlatform>` which mounts in `app.jsx` and tracks the in-focus client (from `clientPanelId`) and platform (from screen name). Calls `window.claude.complete({ messages })` per send. The system prompt is rebuilt each turn by `buildSystemPrompt(ctx)` and includes: team, org snapshot, MRR (money-gated), active risks (stale opts/creative refresh/paused/overdue reviews/stuck cards), full client roster, monthly review schedule, the user's own tasks/notifications, sales pipeline (if access), focus-client deep dump, focus-platform deep dump. **Globals**: `window.openAssistant(prefill?)`, `window.askAssistant(q)` — both open the panel and (optionally) send a prefilled prompt. Used liberally from My Day risk rows, Transcript "Ask Guru", Scenarios "Ask Guru".

### Client Bible — Vault, Drive, Transcripts
`src/clientBible.jsx` exports `VaultTab`, `DriveTab`, `TranscriptsTab`. Mounted by `clientProfile.jsx`.

**Vault** — `CLIENT_VAULTS[clientName]` is an array of credentials `{platform, label, kind, username, secret, owner, lastReveal, expiresInDays, status, note}`. Secrets are masked by default. **Reveal flow is locked**: `store.revealCredential(client, credId, who, reason)` is the only path to unmask — it appends to `CRED_AUDIT` (a global audit log, never deletable) and writes an activity entry on the client profile. UI requires a non-empty reason. Auto-hide after 30s.

**Drive** — `DRIVE_FOLDERS[clientName] = { root, folders: [{id, name, url, updated, items, owners, highlights}] }`. Card grid with green folder icon + highlights bullets + owner avatars. No file-level navigation in MVP (mock).

**Transcripts** — `TRANSCRIPTS[clientName]` is an array `{title, when, duration, source, attendees, summary, actionItems, keyMoments, excerpt}`. Two paths in:
1. **Manual upload** — `store.addTranscript(client, t)` — also creates a "meeting" note + activity entry.
2. **Auto-pull mock** — `store.pullNextTranscript(client, who)` pops the next entry from `PENDING_AUTOPULL[client]` and synthesizes content from `AUTOPULL_SYNTH[client]`. UI shows a 5-step progress with spinner over ~3s. Each action item gets a "→ Task" button that opens `NewTaskModal` pre-filled.

### Scenarios — 8 worked-example lifecycle stories
`src/scenarios.jsx`. Sidebar → Operations → Scenarios. Grid of 8 cards; click to open slide-in panel with summary + key takeaway + vertical timeline of beats (each beat: day, kind-tinted dot, kind pill, who, body). Story IDs `sc-1` through `sc-8`. The 8 stories: clean onboarding (Wildflower), stuck approval (Stonebridge), creative refresh save (Maritime), pause-and-win-back (Kawartha), churn (Northern Lights), trial that grew (FreshLeaf), mid-flight hand-off (Saffron), compliance scare (FreshLeaf). Demo/training material; doesn't mutate store. Beats can deep-link via "Open {client}".

### Auto-task triggers (4 rules) — LOCKED
`src/autoTasks.jsx`. `AUTO_RULES` defines 4 rules:
1. **`creative-refresh`** — Meta active contracts with `refresh.daysSince >= alertAtDay (35)` → Vanshika.
2. **`stale-opt`** — Meta/Google active accounts where `TODAY − lastOptISO >= 10d` → ads owner (Harsh for Google, Vanshika for Meta).
3. **`churn-risk`** — `contract.status === "paused" && TODAY − statusSince >= 7d` → Vihar.
4. **`monthly-review`** — `REVIEWS.due − TODAY <= 3d` → Vihar.

`evaluateAutoTasks(ctx)` is **pure** and deterministic: each `(rule, target, period)` produces a stable `taskId` (e.g. `auto-cr-maritime-realty-2026-05`) so reloads never duplicate. `mergeAutoTasks()` merges synthesized tasks into `store.tasks` and fires once on boot. **All other screens see auto-tasks as normal tasks** — they pick up via `store.tasks` without changes. `AutoRulesScreen` (sidebar → Admin → Auto-rules) shows each rule's definition + currently-firing matches with evidence; "Re-run now" re-evaluates.

**Seed-data anchors** for these rules (don't change without re-checking the verifier hits):
- Maritime Realty's Meta `creativeRefresh.daysSinceRefresh` is forced to 40 (post-loop override in `data.js`).
- A paused Google contract on Northern Lights / Cedarwood (statusSince 2026-04-28) trips the churn-risk rule.
- REVIEWS r1 (Maritime, due May 27) and r2 (FreshLeaf, due May 28) are within 3d of TODAY for monthly-review.

### Data added in Phase 2 (don't reorganize without thinking)
On `window.PPC`:
`MEETINGS_TODAY`, `FOCUS_BLOCKS`, `CLIENT_VAULTS`, `CRED_AUDIT`, `DRIVE_FOLDERS`, `TRANSCRIPTS`, `PENDING_AUTOPULL`, `AUTOPULL_SYNTH`, `AUTO_RULES`, `evaluateAutoTasks`, `mergeAutoTasks`, `SCENARIOS`.

New store mutations: `revealCredential`, `addCredential`, `rotateCredential`, `addTranscript`, `pullNextTranscript`.

## Common pitfalls

- Don't import components across files — they aren't shared. Use the `window.Xxx` global pattern already in place.
- Don't add unpinned React/Babel scripts. The integrity-checked versions in `index.html` are required.
- Don't bloat the dashboard with new KPI cards before asking — every widget must earn its place.
- Don't recreate the "info dump" feel of enterprise tools. Whitespace is part of the system.
- Don't recreate plan editing UI outside `content.jsx`. The SMM Active board, dashboard, and client profile **link** into the plan; they don't duplicate it.
- `useStore()` must be called inside components that mutate; without it, the page won't re-render on `ppc:update` events.
- The "today" date for SMM hard-rule logic is hard-coded `"2026-05"` — searchable. Update both `dashboard.jsx` and `content.jsx` together if you shift the demo date.

## Phase 3 (Polish + business-critical) — LOCKED behaviors

### Sidebar additions — LOCKED
One new top-level section + one new Sales item:
- **Sales → Forecast** (visible to Owners, Shrikant, Abhishek).
- **Owners → Performance · Concentration · Commission** (strict: Jaydeep / Dhaval only).
Non-owners on any owner-only route get bounced to `myday` in `app.jsx`'s role-effect.

### Owners-only dashboards — LOCKED gating
- `CommissionScreen`, `ConcentrationScreen`, `PerformanceScreen` all early-return a restricted notice when `role.id` is not `jaydeep` or `dhaval`. **Don't loosen this.**
- `ForecastScreen` is visible to sales-scope (`abhishek`) and PM/owners; it never shows money to non-money roles — every dollar passes through the `access.money` gate.

### Commission dashboard
- MTD card uses `commissionEarned(salesId, monthISO)` from Phase 1 (returns `{client, service, fee, currency, monthsLive, rate, earn}`).
- Tier split: `monthsLive === 0` is First-month, `1..5` is Recurring, `6+` is After-six (0%). Don't synthesize a `tier` field on the response.
- Target line = `commissionTarget(salesId)` = `user.salary × 3`.
- Trailing 12 months pulls from `COMMISSION_HISTORY` in `phase3Data.js` — synthetic but internally consistent with MRR_TREND.
- Forecast = `projectedCommission(salesId)` walks `pipelineForecast().open` and applies first-month rate.

### Concentration risk
- `concentrationData()` normalizes to CAD (USD × 1.35 — surface this caveat in copy).
- Health thresholds (don't change without re-checking the demo data): top-client ≥12% = warn, ≥20% = danger; top-3 ≥35% = warn, ≥45% = danger.
- At-risk overlay walks paused/cancelled contracts, creative-refresh overdue, and `REVIEWS.health === "danger"|"warn"`. Reasons are surfaced inline on each row.
- `churnImpact(clientName)` is the simulator engine. Hypothetical only; does NOT mutate.

### Performance Home (Looker mirror)
- Reads `PERF_TREND_12M[service]` (synthetic 12-month roll-up). Service tab toggles Meta / Google / SMM.
- For Meta/Google the "MTD live" card aggregates `META_ACCTS` / `GOOG_ACCTS` MTD spend; **shows currency split** (CAD vs USD) instead of summing across.
- Per-client table drills into `openClientPanel(client)`.

### Forecast / Win-rate
- `pipelineForecast()` uses `STAGE_WIN_PROB = { sn:.05, sq:.20, sp:.35, sa:.65, sw:1, sl:0 }`. Don't redefine inline — it's exported on `window.PPC`.
- Days-in-stage uses `STAGE_BENCHMARK_DAYS`; a lead trips "stuck" at ≥1.5× benchmark.
- Win-rate by source pulls from `WIN_RATE_BY_SOURCE_HIST` in `phase3Data.js`.

### Notifications upgrade (in `tasks.jsx`)
- Grouping by client uses `groupNotifsByClient(notifs)` from `phase3Data.js`. Client name is matched by:
  1. `n.ref` resolves to a card on `ONB_CARDS` / `ACT_CARDS`, then
  2. fallback: profile name substring in `n.text`, else
  3. `"FYI"` bucket.
- Mark-read **persists** via `localStorage` key `ppc.notifs.read` (helpers: `loadReadSet` / `saveReadSet`). Per-user persistence is intentionally **not** scoped — it's a single-user demo. The topbar bell count in `app.jsx` still reads `NOTIFS.filter(!read)` raw (server-side); the persistent set is UI-layer only.
- Daily digest pref lives at `ppc.notifs.digest` (`{enabled, time}`); preview modal mocks a 8am email.

### Email composer
- One mounted instance at app level (`<EmailComposer />` in `app.jsx`). Open from anywhere via:
  ```js
  window.openEmailCompose({ client, template, who })
  // template: "custom" | "monthly-review" | "refresh-ask" | "status-update"
  ```
- "Draft with Guru" calls `window.claude.complete(...)` with a template-specific brief. Failures show inline fallback copy — don't throw.
- "Send" is mocked. It calls `store.addNote(client, { category: "internal", title: "Email sent — ...", body, who })`. **Never bypass the store mutation** — that's what keeps the client profile activity log in sync.
- Hooked into `ClientProfilePanel` via a "Compose email" button next to New task / Add note. Receives `who={role}` so the From line is correct.

### Mobile responsive pass
- All work in `index.html` `<style>` under the `/* Phase 3 */` banner. Two breakpoints (`900px` collapses sidebar to top strip + stacks grids; `600px` further collapses 2-col to 1-col).
- Side panels (`.side-panel`, `.wide`, `.full`) all go 100vw on small screens — don't override per-screen.
- The topbar search hides; role switcher collapses to avatar-only.

### Data added in Phase 3 (on `window.PPC`)
`STAGE_WIN_PROB`, `STAGE_BENCHMARK_DAYS`, `PERF_TREND_12M`, `COMMISSION_HISTORY`,
`clientMRRBreakdown`, `concentrationData`, `churnImpact`, `pipelineForecast`,
`winRateBySource`, `projectedCommission`, `commissionTarget`,
`loadReadSet`, `saveReadSet`, `loadDigestPrefs`, `saveDigestPrefs`, `groupNotifsByClient`.

No new store mutations — Phase 3 features either read existing data or use existing mutations (`addNote`).

## Phase 4 (Salesperson workspace — Abhishek) — LOCKED behaviors

Phase 4 builds out the day-to-day workspace for the one salesperson (Abhishek). It
replaces Zoho as his daily driver and is grounded in **real Zoho records** (May 2026),
with the data-quality problems surfaced as visible flags rather than silently fixed.
Everything is **additive** — Phase 1/2/3 behaviors are untouched.

### Sidebar — Sales section expanded (LOCKED)
The `Sales` section now has **6 items** (was 3): **Home · Leads · Pipeline · Calls ·
Emails · Forecast**. One sidebar, no nested per-employee sidebar — each employee sees
their own scoped data. Visible to sales-scope (Abhishek), Owners, and Shrikant.
Routes: `sales-home`, `leads`, `pipeline`, `sales-calls`, `sales-emails`, `forecast`.
`leads` and `pipeline` now render the **Zoho-style** Phase 4 screens; the old Phase 1
`PipelineScreen`/`LeadsScreen` in `sales.jsx` still exist but are **no longer routed**.

### Files added in Phase 4
```
src/phase4Data.js        # Zoho data layer on window.PPC (additive — does NOT touch
                         # the legacy LEADS array that Phase 3 Forecast reads)
src/phase4Sales.jsx      # SalesHomeScreen · SalesLeadsScreen · SalesPipelineScreen
                         #   + shared S4* pills/helpers
src/phase4SalesExtras.jsx# SalesCallsScreen · SalesEmailsScreen · SalesHistoryPanel
                         #   + S4TimelineItem (cross-channel timeline)
```
Mounted in `app.jsx`: `<SalesHistoryPanel>` is an app-level slide-over opened via
`window.openSalesHistory({ kind, record })` (kind = `"lead"` | `"deal"`). Closed on
Esc (wired into the existing Esc handler) and scrim click.

### Data on `window.PPC` (all Phase 4, all additive)
`SALES_TODAY` (`"2026-05-25"` — a separate demo anchor from data.js `TODAY` so Phase 4
can drift without breaking Phase 2's 25th-rule logic), `ZOHO_LEADS`, `ZOHO_DEALS`,
`ZOHO_STAGES`, `ZOHO_CALLS`, `ZOHO_EMAILS`, `ZOHO_HISTORIES`.
Helpers: `provinceFromPhone`, `inServiceArea`, `zohoStageName`, `fallbackHistory`,
`leadsContactedWithin24h`, `noShowGhostRate`, `outOfProvinceRate`, `callsToday`,
`callsByType`, `avgCallDuration`, `emailsToday/Sent/Received`, `emailsNeedingResponse`,
`emailsAwaitingClient`, `totalEmailMessages`, `responseRate`, `commsTotals`,
`salesAgeOf`, `salesTimeOnly`, `salesDayLabel`, `salesDayShort`.

### Data-honesty rules (LOCKED — these are the point of Phase 4)
1. **Province auto-derived from phone area code.** `provinceFromPhone()` maps NANP area
   codes → province; service area is **Ontario only**. 8 of 10 seeded leads are BC/AB
   and get a loud "out of area" flag. The fix is the Meta campaign's geo-targeting, not
   Abhishek's outreach — copy must frame it that way.
2. **The fake $8,000.** Every Zoho deal carries a flat `fakeAmount: 8000` placeholder
   from Zoho's default Amount field. UI shows **"fee not set"** (amber dashed chip) until
   the real `monthlyFee` is entered. Real range: **$375–$2,400/mo**. A deal **cannot
   advance past Meeting Completed** until the fee is set (`canAdvancePastCompleted`).
3. **"Trial Started" ≠ paying client.** The stage formerly "Closed Won" is renamed
   **Trial Started** (a trial began). `payingClient` is a **separate boolean** — revenue
   counts only when `payingClient: true`. Trial/Onboarding cards with no paying flag show
   a "not paying" pill. Trial→Paid conversion KPI reads "—" until the first cohort exists.
4. **Missing source is shown, not hidden.** Leads/deals with no source render a "no
   source" warn pill; the dashboard's data-hygiene panel tallies them. Don't fabricate.

### Pipeline stages (`ZOHO_STAGES`, 12) with auto-mapped probability
Interested 15 · Meeting Booked 25 · **No Show 30 (warn)** · Meeting Completed 50 ·
Reach Out Later 10 · Negotiation 60 · Proposal/Pricing Sent 70 · Awaiting Approval 80 ·
**Onboarding 95 (ok)** · **Trial Started 100 (ok)** · Closed Lost 0 · **Ghosting 5 (warn:2)**.
`warn`/`warn:2`/`ok` flags drive the column-head tint (amber / red / green).

### Communication tally (LOCKED concept)
The whole point of the Sales Home top strip: **total communication across every
channel** — calls (in/out/missed/scheduled) + WhatsApp messages + email messages.
`commsTotals(period)` returns `{ calls, wa, email, total }`. "today" filters to
`SALES_TODAY`; omit for all-time. This is the headline metric for measuring Abhishek's
activity. WhatsApp + Email are currently **sample data pending real integration** —
always tag them so nobody mistakes mock counts for live ones.

### Emails screen (Gmail / Google Workspace)
`SalesEmailsScreen` is the Gmail touch-base view. Counters: touched today · sent ·
received · **needs reply** (inbound `needsResponse`) · **awaiting client** (outbound
`awaitingReply`) · **response rate** (% of inbound threads with an outbound reply).
A **"Connect Google Workspace"** banner marks the integration as pending — `ZOHO_EMAILS`
is mock. The Compose button reuses the existing Phase 3 `EmailComposer`
(`window.openEmailCompose`). `replyCount` per thread = number of messages exchanged and
feeds `totalEmailMessages()` / the comms tally.

### Unified history slide-over (LOCKED)
`SalesHistoryPanel` opens from any lead / deal / call-row / email-row click. It renders
**one chronological timeline** (newest first) merging: calls, WhatsApp bubble threads,
emails (in/out), meetings, and stage/status changes. Emails are spliced in from
`ZOHO_EMAILS` by matching `contactRef`. Cross-linked seed stories: **Kshitij Anand**
(`L02`), **Jagvir Baath** (`L-Jagvir`, shared by lead + deal `D03` for a2zgaragedoorrepair),
**Sandeep Sandu** (`D04`). Anyone without a rich story gets `fallbackHistory()`. WhatsApp
items always carry a "sample" tag until the WA pipe is wired.

### CSS (LOCKED location)
All Phase 4 styles live in `index.html` `<style>` under the `/* Phase 4 — Sales */`
banner, prefixed `.s4-*` to avoid collisions. Reuses existing tokens — **no new colors**.
Babel scripts share no scope: every Phase 4 component/helper is uniquely prefixed
(`S4*`, `s4*`) and exposed via `Object.assign(window, { … })`. **Never** declare a
top-level `const SI`/`styles`/etc. that could collide across babel files (this bit us
once — the icon-wrapper alias collided with `const SI = window.SalesIcons`).

### Known mock seams (where real integrations plug in)
- **Gmail** → `ZOHO_EMAILS` + "Connect Google Workspace" button (OAuth + thread sync).
- **WhatsApp** → `wa-thread` items in `ZOHO_HISTORIES` ("Coexistence pending").
- **Zoho** → `ZOHO_LEADS`/`ZOHO_DEALS`/`ZOHO_CALLS` (one-way import today; the data-
  hygiene panel is the argument for cleaning Zoho at source or migrating off it).
- **Fee editing** → the amber fee chip is visually editable but not yet persisted (no
  store mutation). First thing to wire if Phase 4 goes live.

## Live reconciliation — `window.PPC.LIVE` (read this before touching Sales/clients)

The prototype's original seed (`data.js`) is **fictional** (Maritime Realty, FreshLeaf…) and wired across ~30 files. We did **not** rip it out. Instead `src/liveData.js` exposes **real captured production data** under `window.PPC.LIVE.*` so new work reads the true roster without breaking Phases 1–4. This is the "what's actually shipped" layer.

- `LIVE.TEAM` (9 real people — note real names differ from legacy `USERS`: Shrikaanth, Abhishek Tewari, Harsh Rathod, etc.), `LIVE.STATUS` (real taxonomy: `onboarding` / `on_trial` / `paid_client` / `on_hold` / `cancelled` — only `paid_client` counts in MRR), `LIVE.STAGES` (real onboarding+monthly pipelines per service from the live SLA admin), `LIVE.CLIENTS` (51 real), `LIVE.BRIEFS` (55 real Google-Form intake rows).
- Helpers: `LIVE.serviceLabel`, `paidClients()`, `activeMRR()` (validated == live $15,124), `unmatchedBriefs()`, `teamById()`.
- **Rule:** when building new top-layer features, derive from `LIVE.*` (real) and only fall back to legacy `data.js` seed for things not yet captured. Never reconcile by deleting legacy seed — it's load-bearing for Phase 1–4 screens.

## Phase 5 (Sales redesign) — `window.PPC.S5` — LOCKED behaviors

Phase 5 rebuilds the **Sales segment** into one coherent funnel that mirrors how the agency actually sells, replacing the overlapping legacy/Phase-4 sales screens. Data model is `src/phase5Sales.js` (`window.PPC.S5`), screens + detail panels are `src/salesWorkspace.jsx`. All additive; mutations fire `ppc:update` via `S5.bump()` → subscribe with `useStore()`.

### Sales IA (supersedes the Phase-4 nav)
Sidebar **Sales** = `Dashboard · Leads · Pipeline · Trials · Calls · Emails · Forecast` (7 items). Routes `leads`, `pipeline`, `sales-calls` now render the **Phase-5** screens (`SalesLeadsLiveScreen` / `SalesPipelineLiveScreen` / `SalesCallsLiveScreen`); the Phase-4 `SalesPipelineScreen` / `SalesCallsScreen` and the `sales-home` / `leads-live` routes are **retired** (components harvested, no longer routed). The `access.scope === "sales"` allowlist is enforced in **both** `sidebar.jsx:visible()` and the `app.jsx` bounce-guard — keep them in sync.

### The real lead flow (drives the whole model — don't reintroduce "google-form" as a source)
**All leads come from Meta ads** via two routes: **Instant Form** (auto-synced to Zoho) and **WhatsApp** (manual connect). **Referral** is the only non-Meta source. `SOURCE_DEFS` has exactly these three. **The Google Form is NOT a lead source** — it's the **trial-intake form** sent once a lead agrees to the trial; filling it is what creates the onboarding kanban card. The north-star daily KPI ("≥1 Google form/day", `repToday().gformsToday`) counts those **trial commitments**, not raw leads.

### Lifecycle (the spine — deferred-payment trial)
`Lead → Convert (per-service deals at Proposal) → pipeline → Win → Google Form filled + onboarding card created + 30-day trial starts (payingClient=false, $0 agency fee billed) → conversion meeting → Paying (setup fee + first month, then monthly)`. Nothing is free — payment is **deferred**; the client **always** owes their own Google/Meta ad spend even if they don't convert. Revenue counts only when `payingClient === true`.

### Deal pipeline (`STAGE5`, 12 stages, per service)
Interested 15 · Meeting Booked 25 · No Show 30 (warn) · **Meeting Completed 50 (fee-gate)** · Negotiation 60 · Proposal/Pricing Sent 70 (convert entry) · Awaiting Approval 80 · **Won → Onboarding 95** · Trial Started 100 · Reach Out Later 10 · Closed Lost 0 · Ghosting 5 (danger). **Fee-gate (LOCKED):** a deal cannot advance past Meeting Completed until a real fee is set — range **$375–$2,400/mo** (`FEE_RANGE`), replacing Zoho's fake $8,000. Currency follows the client (CAD/USD); never mix in one number. `winDeal()` creates an `ONB_CARDS` entry at the service's first stage (`m1`/`g1`/`s1`) — the handoff into the existing onboarding board.

### SLA (LOCKED)
First-response target **< 4h on weekdays**; **weekends are off** — a lead arriving Fri/Sat/Sun starts its SLA clock **Monday** (`slaClockStart`, `weekendArrival`). One rep (Abhishek); all leads route to him, no assignment logic.

### Detail panels (the "depth" layer)
Every Leads row and Pipeline card is clickable → `window.openLeadPanel(id)` / `window.openDealPanel(id)` open `LeadDetailPanel` / `DealDetailPanel` (mounted once in `app.jsx`, close on Esc/scrim). Each record carries a real **activity log**; mutations (`logCall`, `logWhatsApp`, `markContacted`, `markScrap`, `setLeadNextAction`, `addLeadNote`, `setDealStage`, `setDealFee`, `setDealNextAction`, `addDealNote`, `winDeal`, `markPaying`) append to it. `leadTimeline()` / `dealTimeline()` merge the log with linked Zoom calls; the timeline reuses the `.s4-tl-*` CSS via a self-contained `S5TimelineItem` (don't import `S4TimelineItem` — it isn't exposed on `window`). Per-deal quoted fees are visible to sales-scope (the rep quotes them); aggregate MRR / weighted-pipeline totals stay `money`-gated to owners.

### Zoom Calls (the two Zoho gaps)
`SalesCallsLiveScreen` models Zoom Phone: **connected vs no-answer + duration** (`callStats()` → connect rate) and **auto-synced transcripts** (summary / key moments / action items → "→ Task"). `ZOOM_CALLS` is sample data tagged pending integration; calls link to deals by `dealId` and to leads by company.

### Dashboards (`SalesDashboardScreen`, role-aware)
Rep view (Abhishek, money hidden): new leads, follow-ups due, the ≥1 trial-form/day KPI, open deals, trials, weekday SLA. Owner view (Jaydeep, money on): funnel (Leads→Contacted→Trials→Paying), trial→paid % vs 60–70% goal, weighted pipeline, source→conversion. `funnel()` derives Trials from trial-stage deals and Paying from `LIVE.CLIENTS` paid_client — **don't double-count** (a fixed bug: trial deals already represent the on_trial clients).

### Still pending in Phase 5
`ForecastScreen` (`forecast.jsx`) still reads the **legacy** Phase-3 lead data, not the S5 deal model — the one remaining rewire. Real Zoom / WhatsApp / Gmail / Zoho integrations remain prod jobs (prototype stubs).

## Phase 6 (Task Management — Todoist-style) — LOCKED behaviors

Phase 6 makes the ERP's task layer feel like **Todoist** (Jaydeep's chosen model; we reviewed his live account and copied the patterns). Three pillars: one-line **quick-add with comprehensive NL parsing**, a **duration field + duration board + the >10-min house rule**, and an owner **Team Activity + tracked-hours** report. All additive; built in the existing design system (no UI-generator, `.t6-*` CSS under the `/* Phase 6 — Tasks */` banner, no new tokens). Files: `taskQuickAdd.jsx`, `teamActivity.jsx`; edits to `data.js`, `taskDetail.jsx`, `tasks.jsx`, `primitives.jsx`, `myDay.jsx`, `sidebar.jsx`, `app.jsx`.

### Task model extension (`data.js`)
Tasks gained: `timeEstimateMin`, `timeSpentMin`, `timerStartedAt` (ms epoch | null), `dueISO`, `deadlineISO`, `recur`, `reminders[]`, `createdISO`, `completedISO`. Legacy `due` **string** is kept for display and derived from `dueISO` via `dueLabelToISO()` (anchored to `TODAY = 2026-05-25`). `DURATION_BUCKETS` (1m·5m·5–10·10–30·30–60·60m+) + `bucketFor(min)` on `window.PPC`. `TASKS_RICH` is seeded (estimates, created/completed dates) and `TASK_HISTORY` (15 completed tasks across **weekdays** May 21/22/25 — Sat/Sun off) is pushed so the report has real multi-day, multi-person data.

### Quick-add parser (LOCKED — the parse target is the point)
`window.parseQuickAdd(text, {today, users, clients})` is **pure** (console-testable). It detects, strips from the title, and chips each field: **date** (today/tomorrow/tonight/weekday/`this/next <wkday>`/`next week`/`in N days`/`Jun 4`/`4/6`), **time** (`4pm`/`4:30pm`/`16:00`/`at 4`; **no am/pm → office-hours 9–5 EST** via `qaOfficeHour`: 1–5→PM, 6–11→AM, 12→noon; format via `window.PPC.fmtTime12`), **recurring** (`every monday`…), **priority** (`p1–p4`, `!high/med/low`), **duration** (`10m`/`1h`→**exact** minutes kept, `bucketFor` only for the chip; `DurationPick` highlights by bucket), **labels** (`@x`, multiple), **client/project** (`#Name`, multi-word matched against ONB+ACT card names), **assignee** (`+firstname`→user, **or** explicit `"Assignee: X"`/`"Assigned to X"`/`"Assign to X"`/`"Owner: X"` — resolves via `qaResolveUser` = match on **user id OR first name**, so just "Vihar"/"Adil"/"Shrikaanth" picks the right person), **deadline** (`{friday}` **or** "deadline friday"/"hard deadline Jun 12"), **reminder** (natural: "remind me at 9am", "reminders: one time at 9", or `!2h before`), **services** (`meta/google/smm/influencer/sales` + synonyms — voice-detected but **NON-stripping**, `services[]`; `service`=`services[0]`), **watchers** ("cc Dhaval, Vihar" / "watchers: Harsh"), **links** (any `http(s)://`/`www.` URL), **subtasks** ("subtasks: a; b; c" — consumes to end), **description** ("desc: …" / "// …" — consumes to end). Natural phrasings handled: priority ("priority is P1", "high priority"), date prefixes ("on Monday", "by Friday", "the 5th"), time ("at 9 in the morning", "9 o'clock", "noon"/"midnight"; no am/pm → office-hours 9–5 EST), duration ("takes 30 min", "for 2 hours"), assignee ("assign to Rayu"). **Dictation/explicit-declaration layer** (for Wispr-style full sentences): runs FIRST and takes precedence over loose tokens — `"the due date (for this task) is Monday at 5pm"`, `"hard deadline is Tuesday"`, `"priority is medium"`, `"estimated duration is 5-10 minutes"`, `"service Google"`, `"related clients: Aurora Wellness"`, `"watchers Dhaval and Shrikant"` (and/comma separated), `"subtasks: a and b"`, `"labels: urgent"`, standalone "urgent". Text is preprocessed (`"1 p.m."`→`"1pm"`, en-dash→hyphen) so sentence periods are clean boundaries; when an explicit due/deadline exists the loose date/time scans are skipped so the casual mention (e.g. "Call X tomorrow at 1pm") stays in the title as context. Helpers `qaWhen`/`qaExtractDurMin`. Title is cleaned of stripped tokens **and** orphan punctuation runs. No CDN dep (prod equivalent = chrono-node). `QuickAddBar` (My Tasks + My Day) is now a compact inline twin of the modal: typed/dictated tokens are **stripped from the title live** into removable chips, it mounts the **same `TaskFieldZone`** widget row underneath (all field pills visible while you type/speak), and has a **Ramble button beside Add** (inline dictation via the same **local** `rambleParse`). Enter→`store.addTask`, `⋯`→prefilled `NewTaskModal`. **`TaskFieldZone`** (defined in `taskDetail.jsx`, exposed on `window` alongside `tdBlankForm`/`tdMergeParse`/`tdApplyRamble`) is the single shared chips+widget-pill+inline-editor block reused by the modal's normal view, the modal's **Ramble view (widgets stay visible — no more blank box)**, and the QuickAddBar. **The full `NewTaskModal` title field also live-parses** (a `useMemo(parseQuickAdd)` + merge `useEffect`) — **`NewTaskModal` is a compact Todoist-style box** (`.t6-newtask`, ~600px): big "Task name" input + "Description" + a **widget-pill row** (`FIELD_PILLS`: Date · Priority · Duration · Reminders · Labels · Deadline · Services · Watchers · Assignee · Client · Subtasks) + a footer (assignee·due·priority summary, Cancel, Add task). Each pill is a button that opens its **inline editor** (`renderEditor(activeField)`); a single-value field's pill **becomes a removable value chip** once set (`fieldSet` hides the pill, the `chips` array renders the chip; clicking a chip re-opens its editor, the ✕ clears it). The ✨ **Ramble** button sits top-right. On input change (`applyParse`), recognized phrases are **STRIPPED from the Task name** (only the clean title remains) and pushed into the fields as chips — each chip has an ✕ to clear that field. No provenance ref anymore; correcting a field = clearing its chip or re-dictating. **Both the Task name AND the Description** are parsed and auto-fill assignee/due/time/priority/duration/deadline/recur/services/watchers/links/subtasks. **Dates use the REAL current clock** (`window.PPC.realToday()` via `new Date()`), NOT the demo `TODAY` — so "tomorrow" is the actual next day. Merge is **provenance-based** (a `pRef` of last parse-derived values; capture `prev` BEFORE `setForm` since `pRef.current=target` runs before the updater): a field follows the text *including when a token is removed → reset to default*, unless the user manually changed that control since the last parse. So any correction reflects. **Due is `<input type="datetime-local">`** (date + time, shows "Fri · 2:00 PM EST"); Deadline is `<input type="date">` — both replace the old fixed dropdown so any weekday/date works. **Services is a multi-select chip set** of all services that lights up from voice. Labels+services are kept as manual-only state and shown live via `effectiveLabels`/`effectiveServices` (= manual ∪ parsed), unioned **at submit only** (not per-keystroke — else "@design" accumulates `d,de,des…`); title is saved as `parsed.title` (tokens stripped). `window.PPC.isoToDueLabel`/`fmtTime12` provide the friendly labels.

### Duration + timer (LOCKED)
`DurationPick` primitive (chips from buckets) in `NewTaskModal` + `TaskDetailPanel`. **Timer** is the differentiator over Todoist (which has no time tracking): `store.startTaskTimer`/`stopTaskTimer`/`setTaskEstimate`; `stopTaskTimer` adds elapsed (`Date.now()`-based) to `timeSpentMin`. `toggleTaskDone`/`updateTask` stamp `completedISO`. `TaskTimeBlock` (panel) and a `▶/■` button on `TaskRow`/`TaskCard` drive it. **My Tasks** group-by gained a **Duration** option → Todoist-style `.t6-board` columns per bucket. The **>10-min rule** shows via `TenMinBanner` (count of tasks logged today over 10 min + how many open tasks still need an estimate) on My Day + My Tasks.

### Team Activity + Hours (LOCKED gating)
`TeamActivityScreen` (sidebar **Insight → Team Activity**, new item) mirrors Todoist Reporting: per-day **completed/added** log + filters (person · action · date · client) + **Export** stub, plus per-person **tracked vs estimated hours**, **planned→done %**, and week capacity — the layer Todoist can't do. **Gated to owners + Shrikant + Vihar** in *both* `sidebar.jsx:visible()` and the `app.jsx` bounce-guard (keep in sync). Money-free (hours, not $), so PM-safe. Component hooks run **before** the gating early-return (Rules of Hooks — a role switch while on this screen must not change hook count).

### Ramble — LOCAL structuring (no cloud / no LLM)
The compact New Task box (and the QuickAddBar) has a **Ramble** button (`✨`). It opens a textarea for a free dictation dump; **"Structure it"** calls `window.PPC.rambleParse(text)`, which **runs 100% in-browser** — it just delegates to the deterministic `parseQuickAdd` and tags `_source: "local"` (no `window.claude`, no network, nothing leaves the page). The smart language understanding is meant to happen **upstream in Wispr Flow "Polish"** (`⌥3` → "ERP task: adding"), which reformats speech into the canonical labeled-sentence shape the regex parser captures cleanly (see the **WisprFormatLink** popover — `window.WisprFormatLink` — surfaced in both the bar's hint line and the modal top). The old Claude-Haiku-via-`window.claude.complete` path and `qaNormalizeRamble` were **removed** (the prototype has no API key; `window.claude` is undefined). `rambleParse` is now **synchronous** but callers still `await` it (harmless). **If a server-side LLM is ever wired in production, swap only the `rambleParse` body** — the return shape (the `parseQuickAdd` object) is the contract `applyRamble`/`tdApplyRamble` depend on; key stays server-side, never in the browser.

### Still pending in Phase 6
Voice capture (mic→text) feeding Ramble is parked. (The Upcoming view shipped in Phase 7.)

## Phase 7 (Tasks workspace — Todoist two-pane) — LOCKED behaviors

The **My Tasks** route (`tasks`) now renders **`TasksWorkspace`** (`src/tasksWorkspace.jsx`), a
Todoist-style **two-pane** module — built after studying Jaydeep's real Todoist (Today = duration
board, Upcoming = week-strip + day list, his "PPC guru" project = board grouped by teammate). The
**main app sidebar stays LOCKED**; this is a screen-level **secondary sub-sidebar** inside `.content`.
North-star goal: answer *"what's my highest priority right now?"* at a glance.

- **`TasksWorkspace({role, setScreen})`** owns `view / viewMode (board|list) / groupBy / search`. Left
  **`TaskSubNav`** (`.t6-sub*`, mirrors `.nav-item`): Add task · Search · **Today · Upcoming · Inbox ·
  Filters & Labels · Calendar · Reporting** · **My Projects** (Team [admins] + user projects + **Add project**).
  Right pane = header toolbar (Board/List toggle + Priority/Due/Duration/Label group toggle + New task) + the view.
- **Views** reuse `TaskCard`/`TaskRow`/`QuickAddBar`/`TenMinBanner` (now also exported from `tasks.jsx`):
  **Today** (priority-sorted + a **"Start here" highlight** naming the top task — the north star),
  **Upcoming** (week strip + Overdue/Today/Tomorrow/day sections), **Inbox** (no project & no client),
  **Filters & Labels** (groupBy), **Calendar** (month grid + **"Connect Google Calendar/Workspace"** stub),
  **Reporting** (everyone sees own completed-today/week; admins also see per-teammate counts + "Full report →"
  to `team-activity`), **project:team** (board grouped by **assignee** = the PPC-guru replica), **project:`<id>`**.
- **Gating (LOCKED):** the **Team** board + admin team-report = **owners only** (`jaydeep`, `dhaval`), hidden in
  `TaskSubNav` and guarded in the view router (non-admins requesting `project:team` fall back to `today`).
  Everything else is for everyone; no money in this module.
- **Data (`data.js`, additive):** tasks gain **`projectId`** (default null); `store.projects` seeds a virtual
  **`team`** project; mutations **`addProject`**, **`setTaskProject`**; reporting helper **`store.tasksCompleted(roleId, sinceISO)`**.
  Date logic anchors to `window.PPC.TODAY` (so curated seed data lines up).
- **Wiring:** `app.jsx` route `tasks → <TasksWorkspace>`; `index.html` loads `src/tasksWorkspace.jsx` (CSS under
  `/* Phase 7 — Tasks workspace */`, prefixed `.t6-ws*`/`.t6-sub*`). **Script tags now carry a `?v=YYYYMMDD…`
  cache-bust token** — bump it (perl one-liner over `index.html`) when an edited sub-resource keeps serving stale.
- Still stubs: real Google Calendar/Workspace sync; task drag-and-drop between columns.

## Local memory (persistence) — `src/persist.js`

The prototype is otherwise in-memory (re-seeds every reload). `persist.js` adds **localStorage
persistence** so user changes survive reloads (per browser/device) — making it "feel real" and
deployable. Loads **after all data modules, before components** (so hydration precedes render).
- **Hydrates** a snapshot on boot, then **debounce-saves** (400ms) on every `ppc:update`.
- **Slices** (each defensive, try/caught): `tasks`, `projects`, `profiles` (merged in place so the
  `getProfile` closure ref stays valid), `optlog` (`OPT_LOG`), `plans` (`CONTENT_PLANS`), `credaudit`
  (`CRED_AUDIT`), `s5state` (`S5.state` = leads/deals). Arrays reassigned (tasks/projects) or replaced
  in place (`length=0;push`); objects merged via `Object.assign`.
- **Version-gated:** bump `PERSIST_VERSION` in `persist.js` whenever you change seed schemas — old
  snapshots are discarded on boot so stale data never overrides new seeds.
- **Controls:** `window.PPC.resetDemoData()` (clears + reloads) and `window.PPC.persistInfo()`. Surfaced
  as a **"Local memory" card** in Admin → Users & Roles (`LocalMemoryCard` in `admin.jsx`) with a Reset button.
- **Deploy:** static — `netlify.toml` publishes `prototype/`; see `DEPLOY.md`. Cross-device shared memory
  (future) = swap the localStorage read/write in `persist.js` for a backend (Netlify Blobs / Supabase);
  nothing else changes.
