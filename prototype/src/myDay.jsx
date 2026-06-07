/* PPC Guru — My Day
   ─────────────────────────────────────────────────────────────
   A focused, per-role morning planner. Distinct from the
   owner-centric Dashboard "Command Center":
     • Dashboard = the agency at a glance
     • My Day    = what YOU should do TODAY, in order

   Composition:
     1. Personal header (greeting + role + AI brief CTA)
     2. Three-column timeline (Morning / Afternoon / Wrap-up)
        — each lane shows meetings + prioritized tasks for that block
     3. Risk lane — role-specific watchlist
     4. End-of-day checklist (3 closing rituals per role)
*/

function MyDayScreen({ role, setScreen }) {
  const store = useStore();
  const { TODAY, MEETINGS_TODAY, FOCUS_BLOCKS, TASKS_EXTRA, NOTIFS, REVIEWS,
          ONB_CARDS, ACT_CARDS, ONBOARD_STAGES, ACTIVE_STAGES,
          OPT_LOG, META_ACCTS, GOOG_ACCTS, LEADS, CAPACITY,
          CONTENT_PLANS, SMM_QUOTAS, planProgress, planLabel,
          creativeRefreshState, daysBetween, userMap, ROLE_ACCESS } = window.PPC;

  const access = ROLE_ACCESS[role.id] || {};
  const meetings = MEETINGS_TODAY[role.id] || [];
  const focusList = FOCUS_BLOCKS[role.id] || [];
  const cap = CAPACITY[role.id];

  /* ─── Collect tasks for this user (rich + auto-from-pipeline) ─── */
  const richTasks = store.tasks.filter(t =>
    (t.assignee === role.id) && t.status !== "done"
  );

  const autoTasks = [];
  [...ONB_CARDS.map(c => ({ ...c, kind: "onb" })),
   ...ACT_CARDS.map(c => ({ ...c, kind: "act" }))].forEach(c => {
    const stages = c.kind === "onb" ? ONBOARD_STAGES[c.service] : ACTIVE_STAGES[c.service];
    if (!stages) return;
    const st = stages.find(s => s.id === c.stage);
    if (!st) return;
    let owner = null;
    if (st.type === "designer") owner = c.designer;
    else if (st.type === "client") return;
    else if (Array.isArray(st.owner)) owner = st.owner.filter(o => o !== "client")[0];
    else owner = c.override || st.owner;
    if (owner !== role.id) return;
    autoTasks.push({
      id: `auto-${c.id}`,
      title: `${st.name} — ${c.name}`,
      client: c.name,
      service: c.service,
      kind: "auto",
      days: c.days,
      priority: c.days >= 5 ? "high" : c.days >= 3 ? "med" : "low",
      autoCardId: c.id
    });
  });

  const allTasks = [...richTasks.map(t => ({ ...t, kind: t.kind || "rich" })), ...autoTasks];

  /* Stable hash for distribution into morning/afternoon/anytime */
  const lane = (t, idx) => {
    if (t.priority === "high")  return "morning";
    if (t.due === "Overdue")    return "morning";
    if (t.priority === "med")   return idx % 2 === 0 ? "morning" : "afternoon";
    return "afternoon";
  };

  const lanes = { morning: [], afternoon: [], wrap: [] };
  allTasks.slice(0, 12).forEach((t, i) => lanes[lane(t, i)].push(t));

  /* Add explicit wrap-up items per role */
  const wrapItems = wrapUpRituals(role.id, { allTasks, OPT_LOG, TODAY, CONTENT_PLANS });
  wrapItems.forEach(w => lanes.wrap.push(w));

  /* ─── Risks specific to this role ─────────────────────────────── */
  const risks = computeRoleRisks(role, {
    OPT_LOG, TODAY, daysBetween, store, creativeRefreshState,
    REVIEWS, ACT_CARDS, ONB_CARDS, CAPACITY, LEADS, CONTENT_PLANS, SMM_QUOTAS
  });

  /* ─── Header line (data-driven, no generic copy) ─────────────── */
  const counts = {
    meetings: meetings.length,
    tasks: allTasks.length,
    risks: risks.length,
    notifs: NOTIFS.filter(n => n.to === role.id && !n.read).length
  };
  const greeting = buildGreeting(role, counts);

  /* ─── Format helpers ─────────────────────────────────────────── */
  const todayLabel = formatToday(TODAY);

  /* Top-priority single line — what to do first */
  const topNext = pickFirstAction(role, lanes, risks, meetings);

  return (
    <div>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="page-head" style={{ alignItems: "flex-start" }}>
        <div style={{ maxWidth: 760 }}>
          <div className="page-eyebrow">{todayLabel} · Your day</div>
          <h1 className="page-title">Good morning, <em>{role.name.split(" ")[0]}.</em></h1>
          <div className="page-sub">{greeting}</div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={() => window.askAssistant?.(`Brief me for today as ${role.name.split(" ")[0]} — what's the single most important thing I should do first?`)}>
            <Icon k="sparkle" /> Brief me with Guru
          </button>
        </div>
      </div>

      {/* ── Quick capture + the >10-min rule (Phase 6) ─────────────── */}
      <TenMinBanner role={role} />
      <QuickAddBar role={role} />

      {/* ── TOP STRIP — 4 micro-stats + the "do this first" callout ── */}
      <div className="myday-strip">
        <DayStat ic="clock"   label="Meetings" v={counts.meetings} sub={meetings[0] ? `Next: ${meetings[0].t} ${meetings[0].title.slice(0, 24)}${meetings[0].title.length > 24 ? "…" : ""}` : "Clear schedule"} />
        <DayStat ic="check"   label="Open tasks" v={counts.tasks} sub={lanes.morning.length + " before lunch"} tone={counts.tasks > 8 ? "warn" : "default"} />
        <DayStat ic="alert"   label="Risks for you" v={counts.risks} sub={counts.risks ? "see watchlist below" : "all clear"} tone={counts.risks > 3 ? "danger" : counts.risks ? "warn" : "ok"} />
        <DayStat ic="bell"    label="Unread alerts" v={counts.notifs} sub="from team + system" />
        <div className="myday-firstup">
          <div className="myday-firstup-label">
            <Icon k="arrow" /> Start with
          </div>
          <div className="myday-firstup-text">{topNext.text}</div>
          {topNext.cta && (
            <button className="btn sm" onClick={topNext.cta}>{topNext.ctaLabel || "Open"}</button>
          )}
        </div>
      </div>

      {/* ── TIMELINE — three lanes ─────────────────────────────── */}
      <div className="myday-grid">
        <DayLane
          title="Morning"
          eyebrow="9 — 12"
          tone="accent"
          meetings={meetings.filter(m => parseInt(m.t) < 12)}
          focusHint={focusList[0]}
          tasks={lanes.morning}
          userMap={userMap}
        />
        <DayLane
          title="Afternoon"
          eyebrow="12 — 17"
          tone="default"
          meetings={meetings.filter(m => parseInt(m.t) >= 12 && parseInt(m.t) < 17)}
          focusHint={focusList[1]}
          tasks={lanes.afternoon}
          userMap={userMap}
        />
        <DayLane
          title="Wrap up"
          eyebrow="End of day"
          tone="muted"
          meetings={meetings.filter(m => parseInt(m.t) >= 17)}
          focusHint={null}
          tasks={lanes.wrap}
          isWrap
          userMap={userMap}
        />
      </div>

      {/* ── RISK WATCHLIST + capacity ─────────────────────────── */}
      <div className="myday-bottom">
        <div className="widget" style={{ padding: 0 }}>
          <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
            <span className="section-title" style={{ flex: 1 }}>Your watchlist today</span>
            <span className="muted mono" style={{ fontSize: 12.5 }}>{risks.length}</span>
          </div>
          {risks.length === 0 ? (
            <div className="empty" style={{ border: "none", margin: 0, padding: "28px 16px" }}>
              Nothing on the watchlist for {role.name.split(" ")[0]} today. Use this air time to pull ahead.
            </div>
          ) : (
            <div>
              {risks.map((r, i) => (
                <div key={i} className="myday-risk" onClick={r.onClick}>
                  <span className={`myday-risk-dot ${r.tone}`} />
                  <div className="col" style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.title}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>{r.detail}</span>
                  </div>
                  <Pill kind={r.tone}>{r.badge}</Pill>
                  <button className="btn sm ghost" onClick={(e) => { e.stopPropagation(); window.askAssistant?.(r.askPrompt); }} title="Ask Guru about this">
                    <Icon k="sparkle" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="widget" style={{ padding: 0 }}>
          <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
            <span className="section-title" style={{ flex: 1 }}>Capacity & rituals</span>
          </div>
          <div className="col gap-3" style={{ padding: "14px 16px" }}>
            {cap && (
              <div>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>This week</span>
                  <span className="mono" style={{ fontSize: 12.5 }}>{cap.hours}/{cap.max}h</span>
                </div>
                <div className={`bar ${cap.hours >= cap.max ? "danger" : cap.hours >= cap.max * 0.9 ? "warn" : "ok"}`}>
                  <i style={{ width: Math.min(100, (cap.hours / cap.max) * 100) + "%" }} />
                </div>
                {cap.hours >= cap.max && (
                  <div style={{ fontSize: 12.5, color: "var(--danger)", marginTop: 6 }}>
                    Over capacity — hand off, push back, or escalate.
                  </div>
                )}
                {cap.hours <= cap.max * 0.7 && (
                  <div style={{ fontSize: 12.5, color: "var(--ok)", marginTop: 6 }}>
                    Light week — good time to pull ahead.
                  </div>
                )}
              </div>
            )}
            <div className="hr" style={{ margin: "4px 0" }} />
            <div>
              <span className="section-title" style={{ fontSize: 12.5, color: "var(--ink-4)" }}>Daily rituals</span>
              <div className="col gap-2" style={{ marginTop: 6 }}>
                {dailyRituals(role.id).map((r, i) => (
                  <div key={i} className="row gap-2" style={{ fontSize: 13.5 }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: "1.5px solid var(--line-strong)", flex: "none"
                    }} />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Subcomponents ─────────────────────────────────────────── */

function DayStat({ ic, label, v, sub, tone }) {
  const toneFg = tone === "warn"   ? "var(--warn)"
              : tone === "danger" ? "var(--danger)"
              : tone === "ok"     ? "var(--ok)"
              : "var(--ink)";
  return (
    <div className="myday-stat">
      <div className="row gap-2" style={{ alignItems: "center" }}>
        <span className="myday-stat-ic"><Icon k={ic} /></span>
        <span className="muted" style={{ fontSize: 12.5, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
      </div>
      <div className="myday-stat-v" style={{ color: toneFg }}>{v}</div>
      <div className="muted" style={{ fontSize: 12.5 }}>{sub}</div>
    </div>
  );
}

function DayLane({ title, eyebrow, tone, meetings, focusHint, tasks, isWrap, userMap }) {
  const accent = tone === "accent" ? "var(--accent)" : tone === "muted" ? "var(--ink-3)" : "var(--ink-2)";
  return (
    <div className="myday-lane">
      <div className="myday-lane-head">
        <div className="col">
          <span className="myday-lane-eyebrow">{eyebrow}</span>
          <span className="myday-lane-title" style={{ color: accent }}>{title}</span>
        </div>
        <div style={{ flex: 1 }} />
        <Pill kind="outline">{meetings.length + tasks.length}</Pill>
      </div>

      <div className="col gap-2" style={{ marginTop: 10 }}>
        {meetings.map(m => (
          <div key={m.id} className="myday-mtg" onClick={() => m.client && window.openClientPanel?.(m.client)}>
            <div className="myday-mtg-time mono">{m.t}</div>
            <div className={`myday-mtg-bar ${m.kind}`} />
            <div className="col" style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>
                {m.dur}m · {m.kind}{m.attendees?.length ? ` · with ${m.attendees.map(a => userMap[a]?.name.split(" ")[0]).filter(Boolean).join(", ")}` : ""}
              </span>
            </div>
          </div>
        ))}

        {focusHint && (
          <div className="myday-focus">
            <Icon k="spark" /> {focusHint}
          </div>
        )}

        {tasks.map(t => (
          <div key={t.id} className="myday-task" onClick={() => {
            if (t.kind === "auto" || t.autoCardId)        window.openClientPanel?.(t.autoCardId || t.client);
            else if (t.kind === "ritual" && t.onClick)    t.onClick();
            else                                          window.openTaskPanel?.(t.id);
          }}>
            <span className={`myday-task-pri pri-${t.priority || "low"}`} />
            <div className="col" style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>
                {t.client && <>{t.client}</>}
                {t.service && <> · {t.service.toUpperCase()}</>}
                {t.kind === "auto" && <> · auto from pipeline</>}
                {t.days && t.kind === "auto" && <> · {t.days}d in stage</>}
              </span>
            </div>
            {t.priority === "high" && <Pill kind="danger">high</Pill>}
            {t.priority === "med" && <Pill kind="warn">med</Pill>}
          </div>
        ))}

        {meetings.length + tasks.length === 0 && (
          <div style={{ fontSize: 12.5, color: "var(--ink-4)", padding: "10px 0", fontStyle: "italic" }}>
            {isWrap ? "Nothing to wrap up — clean exit." : "Nothing scheduled."}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Greeting / "do first" / risk computation ─────────────── */

function buildGreeting(role, c) {
  const first = role.name.split(" ")[0];
  const bits = [];
  if (c.meetings > 0) bits.push(`${c.meetings} meeting${c.meetings === 1 ? "" : "s"}`);
  if (c.tasks > 0)    bits.push(`${c.tasks} open task${c.tasks === 1 ? "" : "s"}`);
  if (c.risks > 0)    bits.push(`${c.risks} on the watchlist`);
  if (bits.length === 0) {
    return `Clear day. Use this air time to pull ahead.`;
  }
  return `Today: ${bits.join(" · ")}. Tap any item to open it.`;
}

function pickFirstAction(role, lanes, risks, meetings) {
  const highRisk = risks.find(r => r.tone === "danger");
  if (highRisk) {
    return {
      text: highRisk.title,
      ctaLabel: "Open",
      cta: highRisk.onClick
    };
  }
  const highTask = lanes.morning.find(t => t.priority === "high");
  if (highTask) {
    return {
      text: highTask.title,
      ctaLabel: "Open",
      cta: () => {
        if (highTask.kind === "auto" || highTask.autoCardId) window.openClientPanel?.(highTask.autoCardId || highTask.client);
        else window.openTaskPanel?.(highTask.id);
      }
    };
  }
  const firstMtg = meetings[0];
  if (firstMtg) {
    return {
      text: `${firstMtg.t} — ${firstMtg.title}`,
      ctaLabel: firstMtg.client ? "Open client" : null,
      cta: firstMtg.client ? () => window.openClientPanel?.(firstMtg.client) : null
    };
  }
  return { text: "Nothing urgent. Open the assistant to plan ahead.", ctaLabel: "Ask Guru", cta: () => window.openAssistant?.() };
}

function computeRoleRisks(role, ctx) {
  const { OPT_LOG, TODAY, daysBetween, store, creativeRefreshState,
          REVIEWS, ACT_CARDS, ONB_CARDS, CAPACITY, LEADS, CONTENT_PLANS } = ctx;
  const list = [];

  /* ── Harsh: stale Google opts, accounts behind pace ── */
  if (role.id === "harsh") {
    const lastByAcct = {};
    OPT_LOG.filter(o => o.platform === "google").forEach(o => {
      if (!lastByAcct[o.account] || o.dateISO > lastByAcct[o.account].dateISO) lastByAcct[o.account] = o;
    });
    Object.values(lastByAcct).forEach(o => {
      const d = daysBetween(o.dateISO, TODAY);
      if (d >= 10) list.push({
        title: `${o.account} — ${d} days since last optimization`,
        detail: `Last: "${o.action}" · target ≥1 opt every 10 days`,
        tone: d >= 14 ? "danger" : "warn",
        badge: `${d}d`,
        onClick: () => window.openClientPanel?.(o.account),
        askPrompt: `What should I optimize next on ${o.account}? Last opt was "${o.action}" on ${o.dateISO}.`
      });
    });
  }

  /* ── Vanshika: creative refresh due + Meta accts ── */
  if (role.id === "vanshika") {
    Object.entries(store.profiles).forEach(([name, p]) => {
      const c = p.serviceContracts?.meta;
      if (!c) return;
      const st = creativeRefreshState ? creativeRefreshState(c, TODAY) : null;
      if (st && (st.dueSoon || st.overdue)) {
        list.push({
          title: `${name} — creative refresh ${st.overdue ? "overdue" : "due"}`,
          detail: `Day ${st.daysSince} of 45 · last batch ${st.lastRefresh || "?"}`,
          tone: st.overdue ? "danger" : "warn",
          badge: `day ${st.daysSince}`,
          onClick: () => window.openClientPanel?.(name),
          askPrompt: `Suggest 3 fresh creative concepts for ${name}. Brief: ${p.brief?.overview || "(no brief)"}.`
        });
      }
    });
    /* SMM plans not ready for next month */
    CONTENT_PLANS.filter(p => p.month === "2026-06" && ["calendar-draft","calendar-pending"].includes(p.status)).forEach(p => {
      list.push({
        title: `${p.client} — June plan not approved`,
        detail: `Status: ${window.PPC.planLabel(p.status)} · 25th-rule trips today`,
        tone: "danger", badge: "25th rule",
        onClick: () => window.openClientPanel?.(p.client),
        askPrompt: `What's the fastest path to get ${p.client}'s June calendar approved this week?`
      });
    });
  }

  /* ── Vihar: stuck cards + overdue reviews ── */
  if (role.id === "vihar") {
    [...ONB_CARDS, ...ACT_CARDS].filter(c => c.days >= 5).slice(0, 6).forEach(c => {
      list.push({
        title: `${c.name} — ${c.days}d at "${c.stage}"`,
        detail: c.blocker || `Service: ${c.service.toUpperCase()}`,
        tone: c.days >= 8 ? "danger" : "warn",
        badge: `${c.days}d`,
        onClick: () => window.openClientPanel?.(c.id),
        askPrompt: `${c.name} has been stuck at "${c.stage}" for ${c.days} days. What's the unblock?`
      });
    });
    REVIEWS.filter(r => r.health === "danger").slice(0, 3).forEach(r => {
      list.push({
        title: `${r.client} — monthly review overdue`,
        detail: `Last: ${r.last} · ${r.note || "schedule with client"}`,
        tone: "danger", badge: "overdue",
        onClick: () => window.openClientPanel?.(r.client),
        askPrompt: `Summarize ${r.client}'s last month so I can prep a monthly review.`
      });
    });
  }

  /* ── Abhishek: trials ending + stuck deals ── */
  if (role.id === "abhishek") {
    LEADS.forEach(l => {
      if (l.stage === "sa" && l.days >= 25) {
        list.push({
          title: `${l.company} — trial ends in ${30 - l.days}d`,
          detail: `${l.service.join("+")} · ${l.contact} · CPA ${l.cpa || "—"}`,
          tone: 30 - l.days <= 3 ? "danger" : "warn",
          badge: `${30 - l.days}d left`,
          onClick: () => window.setScreen?.("pipeline"),
          askPrompt: `Draft a conversion email to ${l.contact} at ${l.company}. They've been on trial for ${l.days} days, CPA ${l.cpa}.`
        });
      }
      if (l.stage === "sp" && l.days >= 7) {
        list.push({
          title: `${l.company} — proposal silent ${l.days}d`,
          detail: `${l.notes}`,
          tone: "warn", badge: `${l.days}d`,
          onClick: () => window.setScreen?.("pipeline"),
          askPrompt: `Draft a polite follow-up to ${l.contact} at ${l.company} — proposal has been silent for ${l.days} days.`
        });
      }
    });
  }

  /* ── Rayu / Aadil: over-capacity warning + pull-ahead ── */
  if (role.id === "rayu" || role.id === "aadil") {
    const myCap = CAPACITY[role.id];
    if (myCap && myCap.hours >= myCap.max) {
      list.push({
        title: `You're over capacity — ${myCap.hours}/${myCap.max}h`,
        detail: "Hand off 1 piece to your editing partner, or push back on scope.",
        tone: "danger", badge: "overload",
        onClick: () => window.setScreen?.("workload"),
        askPrompt: `I'm at ${myCap.hours}h of ${myCap.max} this week. Which of my deliverables can be deferred or handed off?`
      });
    }
    /* Pieces in your queue at "briefed" for current month */
    CONTENT_PLANS.filter(p => p.month === "2026-05" || p.month === "2026-06").forEach(p => {
      p.deliverables.forEach(d => {
        if (d.assignee === role.id && d.status === "briefed" && p.month === "2026-05") {
          list.push({
            title: `${d.title} — still at "briefed"`,
            detail: `${p.client} · ${d.type === "reel" ? "Reel" : "Static"} · ${d.timeBudget}h budget`,
            tone: "warn", badge: "start today",
            onClick: () => window.openClientPanel?.(p.client),
            askPrompt: `What references and shotlist should I use for "${d.title}" for ${p.client}?`
          });
        }
      });
    });
  }

  /* ── Owners (Jaydeep / Dhaval / Shrikant): churn risk + concentration + over-capacity team ── */
  if (["jaydeep","dhaval","shrikant"].includes(role.id)) {
    Object.entries(store.profiles).forEach(([name, p]) => {
      Object.entries(p.serviceContracts || {}).forEach(([svc, c]) => {
        if (c.status === "paused") list.push({
          title: `${name} — ${svc.toUpperCase()} paused`,
          detail: `Since ${c.statusSince || "?"} · ${c.statusReason || "no reason logged"}`,
          tone: "warn", badge: "churn risk",
          onClick: () => window.openClientPanel?.(name),
          askPrompt: `What should we do to win back ${name} on ${svc.toUpperCase()}? They paused: "${c.statusReason || "no reason"}".`
        });
      });
    });
    /* Over-capacity teammates */
    Object.entries(CAPACITY).forEach(([uid, c]) => {
      if (c.hours >= c.max) {
        const name = window.PPC.userMap[uid]?.name;
        list.push({
          title: `${name} is over capacity (${c.hours}/${c.max}h)`,
          detail: "Rebalance work or escalate hiring.",
          tone: "warn", badge: "rebalance",
          onClick: () => window.setScreen?.("workload"),
          askPrompt: `${name} is at ${c.hours}h of ${c.max} this week. Which of their deliverables can be reassigned, and to whom?`
        });
      }
    });
  }

  /* Trim to a sane max */
  return list.slice(0, 8);
}

function dailyRituals(roleId) {
  const map = {
    jaydeep:  ["09:00 owners sync", "Review churn-risk list", "Sign off any commission/payouts", "EOD: skim revenue + cash"],
    dhaval:   ["09:00 owners sync", "Look at paused contracts", "Check MRR delta vs. last week"],
    shrikant: ["10:00 delivery standup", "Walk each team's load", "Push 1 stuck card per service"],
    vihar:    ["10:00 delivery standup", "Clear stuck cards before noon", "Confirm monthly reviews are scheduled"],
    abhishek: ["Update pipeline stages", "Follow up on every >5d silent deal", "Forecast EOD"],
    vanshika: ["10:00 delivery standup", "Approve internal-review queue", "25th rule: confirm June status"],
    harsh:    ["10:00 standup", "Pace check on every account before noon", "Log ≥1 optimization today"],
    rayu:     ["13:30 internal review", "Mark 1 deliverable to internal-review", "Pull ahead if you finish early"],
    aadil:    ["Hand off 1 in-flight piece", "Mark 1 to internal-review", "Push back on new scope today"]
  };
  return map[roleId] || ["Check in with your manager", "Clear your task list", "Log progress before EOD"];
}

function wrapUpRituals(roleId, ctx) {
  const items = [];
  if (roleId === "harsh") {
    items.push({
      id: "wr-harsh-1", kind: "ritual", title: "Log today's optimizations",
      service: "google", priority: "med",
      onClick: () => window.setScreen?.("google-platform")
    });
  }
  if (roleId === "vanshika") {
    items.push({
      id: "wr-van-1", kind: "ritual", title: "Mark any approved pieces → scheduled",
      service: "smm", priority: "med",
      onClick: () => window.setScreen?.("content")
    });
  }
  if (roleId === "abhishek") {
    items.push({
      id: "wr-ab-1", kind: "ritual", title: "Update pipeline stages",
      service: "sales", priority: "med",
      onClick: () => window.setScreen?.("pipeline")
    });
  }
  if (roleId === "vihar") {
    items.push({
      id: "wr-vh-1", kind: "ritual", title: "Verify tomorrow's reviews are confirmed",
      service: "ops", priority: "low",
      onClick: () => window.setScreen?.("reviews")
    });
  }
  if (["rayu","aadil"].includes(roleId)) {
    items.push({
      id: "wr-ed-1", kind: "ritual", title: "Time-log the day's pieces",
      service: "smm", priority: "low",
      onClick: () => window.setScreen?.("content")
    });
  }
  return items;
}

function formatToday(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

window.MyDayScreen = MyDayScreen;
