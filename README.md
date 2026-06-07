# Handoff: PPC Guru — Agency ERP / CRM (Nets2tml)

## Overview
PPC Guru is an internal operations platform for a digital-marketing agency. It runs the
agency's whole delivery lifecycle: lead intake → sales pipeline → onboarding → active
client management across **Meta Ads, Google Ads, and SMM (social/content)**, plus the
business-critical owner dashboards (performance, concentration risk, commissions). The
latest addition (Phase 4) is the **salesperson workspace** for Abhishek — a Zoho
replacement grounded in real lead/deal/call/email data.

This bundle is the **design + behavior reference** for rebuilding it as a real,
multi-user production application with live integrations.

## About the design files
The files in `prototype/` are a **working HTML/React-via-Babel prototype** — a
high-fidelity reference showing the intended look, layout, copy, data model, and
interaction behavior. **They are not the production codebase and should not be shipped
as-is.** They use in-browser Babel, a single 2,500-line `index.html`, and all state in
memory (`window.PPC`) — fine for a design prototype, wrong for production.

The task is to **recreate these designs and behaviors in a proper production stack**
(see recommendation below) using real persistence, auth, and the third-party
integrations that are currently mocked. Treat the prototype as the source of truth for
*what to build and how it should look/behave*, and `CLAUDE.md` as the detailed spec for
*the rules that must hold*.

## Fidelity: HIGH
Colors, typography, spacing, copy, and interactions are final-intent. Rebuild the UI
faithfully. The design tokens are defined as CSS variables at the top of
`prototype/index.html` (`:root` block) — port them verbatim. **Do not invent new
colors.**

## ⭐ Read CLAUDE.md first
`CLAUDE.md` (included in this bundle) is the **complete, authoritative spec** — 447
lines covering every screen, the locked process rules, the data model, role-based
access, the lifecycle/status system, the pacing math, the SMM 25th-rule, and all four
build phases. This README is the orientation; CLAUDE.md is the contract. Anything marked
**LOCKED** there is a deliberate business rule — preserve its behavior even if you
restructure the code.

## Recommended production stack
The prototype is framework-agnostic in spirit but React-shaped in practice. A clean
target:

| Layer | Recommendation | Why |
|---|---|---|
| Frontend | **React + TypeScript + Vite** | Prototype is already React-component-shaped; port components 1:1. |
| Styling | **CSS variables + CSS Modules (or Tailwind w/ the tokens as theme)** | Tokens already exist as CSS vars — keep them. |
| Data fetching | **TanStack Query** | Replaces the `window.PPC` in-memory store + `ppc:update` event bus. |
| Routing | **React Router** | One route per current `screen` string. |
| Backend | **Node (NestJS) or similar** + **PostgreSQL** | Real persistence for clients, contracts, tasks, notes, pipeline. |
| Auth | **Google Workspace SSO (OAuth)** | The agency is already on Google Workspace — use it for login + per-employee scoping. |
| Background jobs | a queue (BullMQ / similar) | For the auto-task rules, the SMM 25th-rule alerts, digest emails, pacing recompute. |

The current `store` mutations in `data.js` (`addNote`, `addTask`, `setServiceStatus`,
`logOptimization`, `revealCredential`, etc.) are effectively your **API surface** —
each becomes a backend endpoint. The `ppc:update` event that triggers re-render becomes
query invalidation.

## The integration seams (what's mocked → what to build)
The prototype fakes every external system. These are the real engineering work:

1. **Google Workspace / Gmail** (Phase 4) — the Emails screen (`sales-emails`) and the
   "Connect Google Workspace" button. Build OAuth + Gmail API thread sync so
   `ZOHO_EMAILS` becomes a live inbox. Sent/received/reply-rate counters and the
   per-contact email timeline all derive from real threads. Also powers the
   "Draft with Guru" email composer (currently `window.claude.complete`).
2. **WhatsApp Business API** (Phase 4) — the `wa-thread` items in the history timeline
   ("Coexistence pending"). Two-way message sync into the unified contact timeline.
3. **Zoho CRM** (Phase 4) — `ZOHO_LEADS` / `ZOHO_DEALS` / `ZOHO_CALLS` are a one-way
   import today. Decide: keep syncing from Zoho, or migrate off it. The **data-hygiene
   panel is the argument** — it surfaces missing sources, the fake $8,000 fee field, and
   out-of-province leads that Zoho lets through. (See "Data-honesty rules" in CLAUDE.md
   Phase 4 — these flags are the whole point; don't auto-"fix" them, surface them.)
4. **Meta Marketing API + Google Ads API** (Phase 2/3) — the Platforms pacing dashboards
   (`platforms.jsx`) replace a daily spreadsheet. Real MTD spend, daily budget, and the
   pacing math (`paceFor()`) need live ad-account data.
5. **Looker** (Phase 3) — Performance Home mirrors Looker. Embed or pull the real
   roll-ups instead of `PERF_TREND_12M`.
6. **Claude** (Phase 2/3) — the AI Assistant and "Draft with Guru" call
   `window.claude.complete()`. In production this is a server-side Anthropic API call;
   the system-prompt builder (`buildSystemPrompt` in `aiAssistant.jsx`) shows exactly
   what context to assemble per turn.

## Multi-user note
The prototype is single-user with a **role switcher** (top-right) that fakes 11 people.
In production, the logged-in Google Workspace identity replaces the switcher, and
`ROLE_ACCESS` (in `data.js`) becomes real server-enforced authorization. The two access
layers in CLAUDE.md (Layer 1 `services[]`, Layer 2 `scope`, plus `money: true`
owner-gating) must be enforced **server-side**, not just hidden in the UI.

## Suggested build sequence
1. **Foundation** — tokens, layout shell, sidebar, role/auth, the design-system
   primitives (`primitives.jsx`: Pill, Stat, Avatar, etc.).
2. **Core data model + persistence** — clients, per-service contracts, the
   lifecycle/status system (CLAUDE.md "Lifecycle & Status System" — this is the spine).
3. **Boards** — Onboarding + Active kanban, the unified `ClientProfilePanel`, tasks.
4. **Salesperson workspace (Phase 4)** — Sales Home/Leads/Pipeline/Calls/Emails +
   the unified history timeline. Wire **Gmail first** (highest user value, clearest seam).
5. **Platforms pacing** — Meta/Google, with live ad APIs.
6. **Owner dashboards** — performance, concentration, commission, forecast.
7. **AI Assistant** — last; it depends on everything else being queryable for context.

## Files in this bundle
```
README.md                 ← you are here
CLAUDE.md                 ← THE SPEC. Read it. 447 lines, all phases, all locked rules.
prototype/
  index.html              ← shell + ALL design tokens (:root) + all CSS + script load order
  src/*.js, src/*.jsx     ← data model + every screen (see CLAUDE.md "File map")
  PPC Guru - ERP (offline).html  ← single-file bundle; open directly in a browser
                                    to click through the live prototype (no server needed)
```
To explore the prototype: open `prototype/PPC Guru - ERP (offline).html` in any browser
and use the **role switcher** (top-right) to see each person's scoped view. The AI
Assistant and "Draft with Guru" won't respond offline (no API key) — everything else is
fully interactive.

## Design tokens (quick reference — full set in index.html :root)
| Token | Value | Use |
|---|---|---|
| `--paper` / `--paper-2` | `#F7F4EE` / `#F1ECE3` | app bg / recessed sidebar |
| `--card` / `--card-2` | `#FFFFFF` / `#FBF8F2` | surfaces |
| `--ink` … `--ink-4` | `#1B1714` → `#A09689` | text ramp |
| `--accent` | `#C5552D` (burnt orange) | primary accent / highlight ring |
| `--ok` / `--warn` / `--danger` | green / amber / red | status only — never decoration |
| `--client` | `#4E6FAE` (blue) | "waiting on client" |
| Type | Newsreader (serif display) · Geist (sans UI) · Geist Mono (numbers) | |
| Radii | 6 / 10 / 14 / 20px (`--r-1..4`) | |
| Spacing | 4 / 8 / 12 / 16 / 24 | |

Phase 4 reuses these exact tokens with `.s4-*`-prefixed classes (under the
`/* Phase 4 — Sales */` banner in index.html) — no new colors were introduced.
