/* PPC Guru — Scenarios screen
   ─────────────────────────────────────────────────────────────
   8 worked-example client lifecycle scenarios. Each tells a
   chronological arc through the CRM: lead → onboarding → active →
   reviews → status changes → outcome. Useful for demoing the
   system end-to-end and for training new team members.

   Pattern: scenarios are demo "stories" — they reference real
   clients in PROFILES_RICH when possible and surface a curated
   timeline of activity. Clicking a beat with `openClient` jumps
   to that client's live profile.
*/

const SCENARIOS = [
  /* ── 1. Smooth onboarding ─────────────────────────────────── */
  {
    id: "sc-1",
    title: "The clean onboarding",
    subtitle: "Lead → Live in 18 days, every gate green",
    client: "Wildflower Bakery",
    service: "smm",
    outcome: "active",
    outcomeNote: "Live since Aug 24 · still healthy",
    durationDays: 18,
    summary: "A textbook SMM onboarding. Sales handed off clean, the kickoff happened the same week, and both client approval gates landed inside SLA. The kind of timeline you want to show every new account manager.",
    keyTakeaway: "When sales captures the brief cleanly, the entire pipeline accelerates. Wildflower's 18-day onboarding ran 9 days faster than the team median.",
    timeline: [
      { day: 0,  kind: "lead",      who: "abhishek", title: "Inbound — referral from Saffron & Spice",
        body: "Lina Holm reached out via Instagram DM. Wholesale + retail bakery, single location, no current agency. Referred by Saffron's owner." },
      { day: 1,  kind: "meeting",   who: "abhishek", title: "Discovery call (45m)",
        body: "Goal: 6 posts/mo, grow IG to 8k. Budget: $1,200/mo. Hot button: 'don't make me look like every other bakery'." },
      { day: 2,  kind: "note",      who: "abhishek", title: "Proposal sent",
        body: "Sent the SMM Starter ($1,200) with optional reel add-on. Mentioned Saffron's results without naming numbers." },
      { day: 4,  kind: "status",    who: "abhishek", title: "Closed-won — signed digitally",
        body: "Lina returned signed MSA same day. No price negotiation. Salesperson commission: 5% first month." },
      { day: 5,  kind: "task",      who: "vanshika", title: "Auto-task → assigned: Initial Meeting & Access",
        body: "Onboarding card created. Vanshika auto-assigned. Brand kit + IG access requested via the access checklist." },
      { day: 6,  kind: "transcript",who: "vanshika", title: "Kickoff call transcript captured",
        body: "Auto-pulled from Meet. 3 action items extracted: theme system, posting cadence, wholesale-vs-retail content split." },
      { day: 9,  kind: "note",      who: "vanshika", title: "Content strategy + October calendar drafted",
        body: "Theme: 'Hearth — winter sourdough'. 6 posts: 2 reels + 4 statics. Submitted for client approval." },
      { day: 11, kind: "client",    who: "client",   title: "Client approval received",
        body: "Lina approved in 38 hours with 2 small edits (capitalize 'sourdough', swap one Sunday post for a wholesale tease)." },
      { day: 12, kind: "task",      who: "rayu",     title: "Production handoff — Rayu assigned",
        body: "Vanshika handed the calendar to Rayu. 6 deliverables briefed in Content Studio." },
      { day: 16, kind: "client",    who: "client",   title: "Final creatives approved",
        body: "Lina approved all 6 pieces in one round. No edits." },
      { day: 17, kind: "note",      who: "vanshika", title: "Scheduled for October",
            body: "All 6 posts queued in Meta Business Suite. First post live Oct 4." },
      { day: 18, kind: "live",      who: "vanshika", title: "Live — graduated to Active SMM",
        body: "Card moved to Active board. First post drove +127 profile visits in 24 hours." }
    ]
  },

  /* ── 2. The stuck-on-client-approval rescue ──────────────── */
  {
    id: "sc-2",
    title: "The stuck approval",
    subtitle: "8 days on client approval — three concept rounds, finally a yes",
    client: "Stonebridge Homes",
    service: "smm",
    outcome: "active",
    outcomeNote: "Live since Sep 12 · scope adjusted",
    durationDays: 31,
    summary: "Stonebridge sat at Client Approval for 8 days. The concept wasn't wrong — the brief was. Two creative rounds were rejected before the team paused and re-ran the discovery questions. The third round landed in 36 hours.",
    keyTakeaway: "When a card stalls at Client Approval for >5 days, escalate the BRIEF, not the creative. Concept rejection is usually a brief problem in disguise.",
    timeline: [
      { day: 0,  kind: "lead",      who: "abhishek", title: "Inbound — Google search 'GTA custom home marketing'",
        body: "Mike Brennan, owner. Custom home builder, $1.2M-$2.5M projects. Says he's tried 2 agencies before, both 'too generic'." },
      { day: 5,  kind: "status",    who: "abhishek", title: "Closed-won — SMM lite + Google split",
        body: "Mike signed $1,800/mo SMM + Google. Sales captured a thin brief: 'high-end portfolio reel + steady consultation bookings'." },
      { day: 6,  kind: "task",      who: "vanshika", title: "Onboarding — Initial Meeting & Access",
        body: "Standard kickoff. Brand kit ok, IG access ok, GA4 access pending." },
      { day: 10, kind: "note",      who: "vanshika", title: "Concept v1 — 'Craftsman Stories' submitted",
        body: "8-post calendar built around builder-as-craftsman narrative. Sent for approval." },
      { day: 14, kind: "client",    who: "client",   title: "Concept v1 rejected",
        body: "Mike: 'This makes me sound like a one-man operation. We have 14 trades on staff. Feels too small.' Push back received." },
      { day: 17, kind: "note",      who: "vanshika", title: "Concept v2 — 'Trade Craft' submitted",
        body: "Repositioned around team + craftsmanship. Featured 4 trades by name in the first 3 posts." },
      { day: 21, kind: "client",    who: "client",   title: "Concept v2 rejected",
        body: "Mike: 'Closer, but now it feels HR-y. We're not hiring, we're selling.' Vihar flagged the card." },
      { day: 22, kind: "task",      who: "vihar",    title: "🚨 Stuck card — 8d at Client Approval",
        body: "Auto-flag triggered. Vihar calls Mike directly instead of routing through email." },
      { day: 22, kind: "meeting",   who: "vihar",    title: "Re-discovery call (30m)",
        body: "Pulled the original brief. Real goal: differentiate on 'precision' not 'craft'. Mike's customers buy because Stonebridge delivers on spec; they don't romanticize the build." },
      { day: 25, kind: "note",      who: "vanshika", title: "Concept v3 — 'Built to Spec' submitted",
        body: "Posts highlight measurements, tolerances, post-occupancy photos vs. plans. No more romance." },
      { day: 26, kind: "client",    who: "client",   title: "Concept v3 approved in 36 hours",
        body: "Mike: 'This is who we are.' One round of small edits." },
      { day: 31, kind: "live",      who: "vanshika", title: "Live — graduated to Active",
        body: "Posting started. Mike has not flagged a creative since." }
    ]
  },

  /* ── 3. The creative refresh save ────────────────────────── */
  {
    id: "sc-3",
    title: "The creative refresh save",
    subtitle: "Day-44 ad fatigue caught + reversed before the client noticed",
    client: "Maritime Realty",
    service: "meta",
    outcome: "active",
    outcomeNote: "CPA back to $34 (was creeping toward $48)",
    durationDays: 10,
    summary: "The system fired a day-35 alert on Maritime's creative refresh cadence. Vanshika acted in 48 hours. By the time CPA would have visibly drifted, the new pack was already live. Client never raised a concern.",
    keyTakeaway: "The 45-day creative refresh cadence with a day-35 alert gives you a 10-day runway. That's enough — barely. Don't let it slip past day 38.",
    timeline: [
      { day: 0,  kind: "alert",     who: "system",   title: "🔔 Auto-task fired — creative refresh due (day 35)",
        body: "Maritime Realty Meta contract hit day 35 of 45 on the refresh cycle. Auto-task assigned to Vanshika." },
      { day: 0,  kind: "task",      who: "vanshika", title: "Brief: Maritime — November creative pack",
        body: "Vanshika opened the task within 2 hours. Pulled Maritime's brief + last pack for reference." },
      { day: 1,  kind: "meeting",   who: "vanshika", title: "30m strategy sync with Jess",
        body: "Confirmed direction: lean into 'Just Sold' format approved in Q4 call. Three Sable Island variants + two Lunenburg." },
      { day: 3,  kind: "note",      who: "rayu",     title: "5 reels + 3 statics drafted",
        body: "Rayu turned the pack around in 2 days. Internal review queued." },
      { day: 4,  kind: "note",      who: "vanshika", title: "Internal review — 1 reel kicked back",
        body: "Reel 3 (drone over Lunenburg) too dark in second half. Sent back to Rayu for color regrade." },
      { day: 5,  kind: "client",    who: "client",   title: "Pack sent to Jess for approval",
        body: "All 8 pieces approved in one round. No edits." },
      { day: 7,  kind: "optimization", who: "harsh", title: "New pack launched — old pack paused (not killed)",
        body: "70/30 split for 5 days to confirm. Logged in optimization log." },
      { day: 10, kind: "live",      who: "harsh",    title: "Full rollover — CPA $34 (down from $42)",
        body: "Old pack archived. CPA back below target. Refresh cycle reset — next due day 45 from launch." },
      { day: 10, kind: "system",    who: "system",   title: "Creative refresh marked complete · cycle reset",
        body: "store.markCreativeRefreshed() fired. Day-35 alert will fire again in ~35 days from this date." }
    ]
  },

  /* ── 4. The pause-and-win-back ───────────────────────────── */
  {
    id: "sc-4",
    title: "The pause and win-back",
    subtitle: "Paused 6 weeks, reactivated at adjusted scope",
    client: "Kawartha Physio",
    service: "meta",
    outcome: "active",
    outcomeNote: "Reactivated at $1,200/mo (was $1,800)",
    durationDays: 47,
    summary: "Kawartha hit a budget squeeze and paused Meta for 'a couple weeks'. The team didn't lose the relationship — they kept the SMM contract running, scheduled a 7-day check-in (auto-fired by status change), and re-pitched at a smaller scope when the moment was right.",
    keyTakeaway: "Status:paused is not status:cancelled. Keep the channel warm — the 7-day churn-risk auto-task is your seat at the table for re-engagement.",
    timeline: [
      { day: 0,  kind: "client",    who: "client",   title: "Client request: pause Meta",
        body: "Sarah (owner) emailed Vihar: 'We're in a tight quarter. Need to pause Meta for a few weeks. SMM can stay.'" },
      { day: 0,  kind: "status",    who: "vihar",    title: "Status → paused (Meta) — reason logged",
        body: "Reason: 'Q2 budget squeeze, client requested pause.' MRR dropped by $1,800. SMM contract untouched." },
      { day: 0,  kind: "system",    who: "system",   title: "🔔 Auto: 7-day churn-risk task scheduled for Vihar",
        body: "Triggered by status:paused. Will fire automatically." },
      { day: 7,  kind: "task",      who: "vihar",    title: "🔔 Churn-risk check-in — Kawartha",
        body: "Auto-task fired. Vihar called Sarah. No agenda — just 'how's the quarter shaping up?'." },
      { day: 14, kind: "note",      who: "vihar",    title: "Check-in: 'Budget loosens in 4 weeks'",
        body: "Sarah expects more breathing room mid-quarter. Asked if there's a smaller way to keep Meta warm." },
      { day: 21, kind: "note",      who: "vanshika", title: "SMM still going strong",
        body: "Kawartha's SMM month delivered as usual — 6 posts, no impact from Meta pause. Maintains relationship." },
      { day: 35, kind: "meeting",   who: "vihar",    title: "Re-pitch call (30m)",
        body: "Vihar pitched a 'Meta lite' at $1,200/mo — single retargeting campaign + creative refresh on existing assets. Sarah agreed in principle." },
      { day: 40, kind: "status",    who: "vihar",    title: "Status → active (Meta) at $1,200/mo",
        body: "Service contract updated. New contract start date, but lifetime tenure preserved." },
      { day: 47, kind: "live",      who: "harsh",    title: "Meta back live · retargeting only",
        body: "Reduced scope but profitable. Sarah is happy." }
    ]
  },

  /* ── 5. The churn ────────────────────────────────────────── */
  {
    id: "sc-5",
    title: "The churn",
    subtitle: "Cancelled cleanly, with reason logged + final report generated",
    client: "Northern Lights Auto",
    service: "meta",
    outcome: "cancelled",
    outcomeNote: "Cancelled Oct 18 · client moved in-house",
    durationDays: 28,
    summary: "Northern Lights brought the work in-house. Not a failure of service — a structural change. The team didn't fight it; they exited cleanly with a final report, an access handover document, and an open door.",
    keyTakeaway: "How you handle a cancel matters as much as how you handle an onboarding. Northern Lights referred us 2 prospects in the 90 days following their exit.",
    timeline: [
      { day: 0,  kind: "alert",     who: "system",   title: "🔔 Smart alert — Northern Lights no activity 14d, CPA up 34%",
        body: "Auto-detected. Surfaced to Vihar via dashboard." },
      { day: 1,  kind: "meeting",   who: "vihar",    title: "30m unscheduled call with client",
        body: "Client (Dave) was apologetic. 'We hired an in-house marketing lead last month. He's taking over Meta in October.' Decision already made." },
      { day: 3,  kind: "note",      who: "vihar",    title: "Discussed retention — declined",
        body: "Offered to stay on as a strategy advisor at reduced fee. Dave passed — wants the new hire to own it fully." },
      { day: 7,  kind: "meeting",   who: "vihar",    title: "Handover call with Dave's new hire (45m)",
        body: "Walked through campaign structure, audience setups, creative archive. Friendly, professional." },
      { day: 14, kind: "note",      who: "harsh",    title: "Access transfer + handover doc delivered",
        body: "Removed PPC Guru users from BM, transferred admin to new hire. Sent 12-page handover PDF (account history, what worked, what to avoid)." },
      { day: 21, kind: "status",    who: "vihar",    title: "Status → cancelled (Meta) — reason logged",
        body: "Reason: 'Client moved Meta management in-house. Clean exit, mutual respect.' Triggered final-report auto-generation." },
      { day: 21, kind: "system",    who: "system",   title: "🔔 Auto: Final report PDF stub generated",
        body: "Added to Northern Lights / Files / Final Report. Includes lifetime spend, conversions, key wins." },
      { day: 28, kind: "live",      who: "system",   title: "Card archived · profile retained",
        body: "Status:cancelled. Card off all boards. Profile + history searchable forever. Auto-tasks ceased." }
    ]
  },

  /* ── 6. The trial that converted big ─────────────────────── */
  {
    id: "sc-6",
    title: "The trial that grew",
    subtitle: "Small $500 lead → anchor account in 8 months",
    client: "FreshLeaf Cannabis Co.",
    service: "meta",
    outcome: "active",
    outcomeNote: "Anchor — 18% of MRR ($6,800/mo)",
    durationDays: 240,
    summary: "FreshLeaf came in as a $500/mo trial via a LinkedIn referral. Compliance was the unlock — once the team proved we understood cannabis-on-Meta rules, the budget expanded six times in 8 months.",
    keyTakeaway: "Small budgets aren't small clients. The trial fee is just the audition. FreshLeaf's lifetime value passed $50k in 12 months.",
    timeline: [
      { day: 0,   kind: "lead",      who: "abhishek", title: "Inbound — LinkedIn referral",
        body: "Dana Whitfield, Director of Growth. Multi-state dispensary chain. Asked: 'Can you actually run Meta for cannabis?'" },
      { day: 4,   kind: "meeting",   who: "abhishek", title: "Discovery + compliance pre-screen (60m)",
        body: "We walked Dana through Meta's cannabis-adjacent rules. Lifestyle/wellness angles, no product imagery, no health claims. She was impressed." },
      { day: 8,   kind: "status",    who: "abhishek", title: "Closed-won — $500/mo trial (1 store, Denver)",
        body: "Small trial to prove we understood the rules. 90-day commitment." },
      { day: 30,  kind: "note",      who: "harsh",    title: "Month 1 — under target, no restrictions",
        body: "Spend $480. 14 conversions. CPA $34 (target $40). Importantly: zero policy flags." },
      { day: 60,  kind: "meeting",   who: "harsh",    title: "Month-2 review with Dana",
            body: "Dana brought Mark (CEO) to the call. They want to expand to Boulder + Detroit." },
      { day: 65,  kind: "status",    who: "abhishek", title: "Expansion: 3 stores, $1,500/mo",
        body: "Contract expanded. Sales commission re-set on the upsell." },
      { day: 120, kind: "note",      who: "harsh",    title: "Loyalty app campaign added — $3,200/mo",
        body: "Separate creative direction for loyalty app installs. Strong response, low CPA." },
      { day: 180, kind: "status",    who: "abhishek", title: "Expanded to NM — $5,500/mo total",
        body: "Albuquerque store added. FreshLeaf became our 2nd-largest account." },
      { day: 240, kind: "note",      who: "jaydeep",  title: "Anchor account flag raised",
        body: "FreshLeaf crossed 18% of MRR. Concentration risk. Jaydeep takes monthly QBR personally." }
    ]
  },

  /* ── 7. The mid-flight hand-off ──────────────────────────── */
  {
    id: "sc-7",
    title: "The mid-flight hand-off",
    subtitle: "Aadil overloaded mid-October — Rayu picked up Saffron's reels without a beat",
    client: "Saffron & Spice",
    service: "smm",
    outcome: "active",
    outcomeNote: "October pack delivered on time · Rayu owns it now",
    durationDays: 5,
    summary: "Aadil hit 41/40 hours on a Tuesday. The system flagged it on the dashboard. Vanshika rebalanced — Rayu took 3 of Aadil's in-flight pieces, and a designer-swap auto-task fired to bring everyone in sync.",
    keyTakeaway: "Capacity bars aren't decoration. When they go red, the system surfaces it within minutes — but the rebalance is still a human call. Time matters; act inside 24 hours.",
    timeline: [
      { day: 0,  kind: "alert",     who: "system",   title: "🔔 Aadil at 41/40h — capacity exceeded",
        body: "Dashboard surfaced the over-capacity flag at 10:14am." },
      { day: 0,  kind: "task",      who: "vanshika", title: "Rebalance — review Aadil's in-flight queue",
        body: "Auto-task assigned to Vanshika. Pull-ahead section in My Day surfaced the same info to Rayu." },
      { day: 1,  kind: "meeting",   who: "vanshika", title: "15m sync with Aadil",
        body: "Walked through his 8 in-flight pieces. 3 could move (Saffron's reels), 5 had to stay (Maritime + Wildflower were too far along)." },
      { day: 1,  kind: "task",      who: "rayu",     title: "Designer reassigned — Saffron 3 reels",
        body: "store.assignDeliverable() fired 3 times. Notifications sent to Aadil + Rayu + Vanshika." },
      { day: 2,  kind: "note",      who: "rayu",     title: "Picked up — references from Aadil",
        body: "Rayu picked up Aadil's WIP files in Drive. 15m walkthrough. No client-facing change." },
      { day: 5,  kind: "live",      who: "rayu",     title: "All 3 reels delivered on time",
        body: "October pack landed for Saffron. Client never knew there was a swap." }
    ]
  },

  /* ── 8. The compliance scare ─────────────────────────────── */
  {
    id: "sc-8",
    title: "The compliance scare",
    subtitle: "Meta restriction warning → audit → resolved in 5 days",
    client: "FreshLeaf Cannabis Co.",
    service: "meta",
    outcome: "active",
    outcomeNote: "Restriction lifted · zero downtime",
    durationDays: 5,
    summary: "Meta flagged FreshLeaf's ad account with a 'restricted advertiser' tier change on a Friday afternoon. The team had it audited, escalated, and resolved by Wednesday — without pausing a single ad.",
    keyTakeaway: "Compliance vaults pay for themselves the first time you need them. Having the BM admin login, the 2FA backup, and the policy checklist already in the vault saved us 3 hours on Friday night.",
    timeline: [
      { day: 0,  kind: "alert",     who: "system",   title: "🚨 Meta notification — restriction tier change",
        body: "Friday 16:42. Auto-pulled into the dashboard. Harsh on it within 8 minutes." },
      { day: 0,  kind: "meeting",   who: "harsh",    title: "Emergency call — Harsh + Jaydeep (20m)",
        body: "Jaydeep was on a personal call but joined. Confirmed no ads to pause — restriction tier doesn't auto-pause." },
      { day: 0,  kind: "note",      who: "harsh",    title: "Vault: BM admin + 2FA backup retrieved",
        body: "Revealed FreshLeaf BM credential. Reason logged: 'compliance recheck after Meta restriction warning'. Audit row written." },
      { day: 1,  kind: "note",      who: "harsh",    title: "Audit: 24 active ads → 2 borderline",
        body: "Found 2 ads using 'lifestyle adjacency' wording that Meta's Nov update tightened. Pulled them voluntarily." },
      { day: 1,  kind: "meeting",   who: "jaydeep",  title: "Client call — Dana briefed (30m)",
        body: "Jaydeep called Dana directly. Walked through what happened, what we changed, and our appeal plan. She was calm." },
      { day: 2,  kind: "note",      who: "harsh",    title: "Appeal submitted to Meta",
        body: "Filed via Business Help. Included the 2 ads we pulled as a goodwill gesture." },
      { day: 5,  kind: "live",      who: "harsh",    title: "Restriction lifted · 2 replacement ads approved",
        body: "Meta restored standard advertiser status. New compliant variants of the 2 pulled ads also approved." },
      { day: 5,  kind: "note",      who: "jaydeep",  title: "Post-mortem: compliance briefing scheduled",
        body: "Added 'January state-level compliance briefing' to FreshLeaf's plan. New auto-task: monthly compliance audit." }
    ]
  }
];

/* ─── helpers ─── */
const SCENARIO_KIND = {
  lead:         { color: "var(--ink-3)",      label: "Lead" },
  meeting:      { color: "var(--client)",     label: "Meeting" },
  note:         { color: "var(--ok)",         label: "Note" },
  task:         { color: "var(--accent)",     label: "Task" },
  status:       { color: "var(--warn)",       label: "Status change" },
  client:       { color: "var(--client)",     label: "Client" },
  transcript:   { color: "var(--accent-2)",   label: "Transcript" },
  optimization: { color: "var(--warn)",       label: "Optimization" },
  alert:        { color: "var(--danger)",     label: "Alert" },
  system:       { color: "var(--ink-3)",      label: "System" },
  live:         { color: "var(--ok)",         label: "Live" }
};

const OUTCOME_PILL = {
  active:    { kind: "ok",     label: "Active" },
  cancelled: { kind: "danger", label: "Churned" },
  paused:    { kind: "warn",   label: "Paused" }
};

/* ════════════════════════════════════════════════════════════════════
   ScenariosScreen — index of 8 scenarios + detail view
   ════════════════════════════════════════════════════════════════════ */
function ScenariosScreen({ role }) {
  const [openId, setOpenId] = React.useState(null);
  const open = openId ? SCENARIOS.find(s => s.id === openId) : null;

  return (
    <div>
      <div className="page-head">
        <div style={{ maxWidth: 760 }}>
          <div className="page-eyebrow">Worked examples · {SCENARIOS.length} scenarios</div>
          <h1 className="page-title">Lifecycle <em>stories</em>.</h1>
          <div className="page-sub">
            How real client arcs look from inside the CRM. Use these as training material for new team members, as demo flows for prospects, or as a sanity check that your own playbook holds together end-to-end.
          </div>
        </div>
      </div>

      <div className="scenario-grid">
        {SCENARIOS.map(s => {
          const outcome = OUTCOME_PILL[s.outcome] || OUTCOME_PILL.active;
          return (
            <div key={s.id} className="scenario-card" onClick={() => setOpenId(s.id)}>
              <div className="scenario-card-top">
                <span className="scenario-card-num mono">{s.id.replace("sc-", "0")}</span>
                <Pill kind={outcome.kind}>{outcome.label}</Pill>
              </div>
              <div className="scenario-card-title">{s.title}</div>
              <div className="scenario-card-sub">{s.subtitle}</div>
              <div className="scenario-card-foot">
                <span className="muted" style={{ fontSize: 12.5 }}>
                  <strong style={{ color: "var(--accent)" }}>{s.client}</strong> · {s.service.toUpperCase()} · {s.durationDays}d · {s.timeline.length} beats
                </span>
                <span className="mono muted-2" style={{ fontSize: 12.5 }}>open →</span>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <ScenarioDetail
          scenario={open}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}

function ScenarioDetail({ scenario, onClose }) {
  const outcome = OUTCOME_PILL[scenario.outcome] || OUTCOME_PILL.active;

  React.useEffect(() => {
    const f = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [onClose]);

  return (
    <>
      <div className="panel-scrim open" onClick={onClose} />
      <div className="side-panel wide open" style={{ transform: "translateX(0)" }}>
        <div className="profile-head">
          <div className="row gap-3" style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div className="row gap-2" style={{ marginBottom: 6 }}>
                <Pill kind={outcome.kind}>{outcome.label}</Pill>
                <Pill kind="outline">{scenario.service.toUpperCase()}</Pill>
                <span className="muted-2" style={{ fontSize: 12.5 }}>· {scenario.durationDays} days · {scenario.timeline.length} beats</span>
              </div>
              <div className="profile-name">{scenario.title}</div>
              <div className="profile-meta">
                <span><span className="k">Client</span> {scenario.client}</span>
                <span><span className="k">Outcome</span> {scenario.outcomeNote}</span>
              </div>
            </div>
            <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
          </div>

          <div className="profile-actions">
            <button className="btn sm" onClick={() => window.openClientPanel?.(scenario.client)}>
              <Icon k="user" /> Open {scenario.client}
            </button>
            <button className="btn sm ghost" onClick={() =>
              window.askAssistant?.(`What can I learn from this scenario? "${scenario.title}" — ${scenario.subtitle}. Summary: ${scenario.summary}`)
            }>
              <Icon k="sparkle" /> Ask Guru about this scenario
            </button>
          </div>
        </div>

        <div className="side-panel-body">
          <div className="sub-card">
            <div className="sub-card-title">Summary</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{scenario.summary}</div>
          </div>

          <div className="sub-card" style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
            <div className="sub-card-title" style={{ color: "var(--accent)" }}>Key takeaway</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{scenario.keyTakeaway}</div>
          </div>

          <div className="label" style={{ marginTop: 12, marginBottom: 8 }}>Timeline ({scenario.timeline.length} beats)</div>
          <div className="scenario-timeline">
            {scenario.timeline.map((beat, i) => {
              const kind = SCENARIO_KIND[beat.kind] || SCENARIO_KIND.note;
              return (
                <div key={i} className="scenario-beat">
                  <div className="scenario-beat-rail">
                    <span className="scenario-beat-day mono">d{beat.day}</span>
                    <span className="scenario-beat-dot" style={{ background: kind.color }} />
                    {i < scenario.timeline.length - 1 && <span className="scenario-beat-line" />}
                  </div>
                  <div className="scenario-beat-card">
                    <div className="row gap-2" style={{ marginBottom: 4, alignItems: "center" }}>
                      <span className="scenario-beat-kind" style={{ color: kind.color, borderColor: kind.color }}>
                        {kind.label}
                      </span>
                      <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{beat.title}</span>
                      <span className="muted-2 mono" style={{ fontSize: 12.5 }}>{beat.who}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>{beat.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ScenariosScreen, SCENARIOS });
