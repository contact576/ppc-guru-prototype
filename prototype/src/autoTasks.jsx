/* PPC Guru — Auto-task Triggers
   ─────────────────────────────────────────────────────────────
   Four rules generate tasks automatically from data state:

     1. CREATIVE-REFRESH (day 35)
        For every active Meta contract whose creativeRefresh.daysSince
        >= alertAtDay (35 of 45) AND no auto-task already exists,
        fire a task to Vanshika.

     2. STALE-OPTIMIZATION (>10d since last opt)
        For every active Meta/Google account whose lastOptISO is more
        than 10 days ago, fire a task to the ads owner of that
        platform (Harsh for Google, Vanshika for Meta).

     3. CHURN-RISK (7d after pause)
        For every contract whose status == "paused" AND statusSince
        is 7+ days ago, fire a check-in task to Vihar.

     4. MONTHLY-REVIEW (3d before due)
        For every review in REVIEWS where the due date is within
        3 days, fire a prep task to Vihar.

   The evaluator is deterministic: every (rule, target, period) maps to
   a single stable task id so repeated boots don't duplicate. We merge
   into store.tasks so the rest of the app sees them as normal tasks.
*/

const AUTO_RULES = [
  {
    id: "creative-refresh",
    label: "Creative refresh due (day 35)",
    description: "Fires a task to Vanshika when a Meta creative pack is 10 days from rotation.",
    condition: "contract.status === 'active' && refresh.daysSince >= 35",
    assigneeRole: "Creative manager",
    cadence: "On the 35th day of each 45-day cycle",
    icon: "refresh"
  },
  {
    id: "stale-opt",
    label: "Stale optimization (>10d)",
    description: "Fires a task to the ads owner when an account hasn't been touched in 10+ days.",
    condition: "TODAY − account.lastOptISO ≥ 10 days",
    assigneeRole: "Ads owner per platform",
    cadence: "Re-evaluated daily",
    icon: "clock"
  },
  {
    id: "churn-risk",
    label: "Churn-risk check-in (paused + 7d)",
    description: "Fires a check-in to Vihar 7 days after any contract was paused.",
    condition: "contract.status === 'paused' && TODAY − statusSince ≥ 7d",
    assigneeRole: "Sr. Project Manager",
    cadence: "Once per pause event, 7 days after",
    icon: "alert"
  },
  {
    id: "monthly-review",
    label: "Monthly review prep (due in 3d)",
    description: "Fires a prep task to Vihar 3 days before each client's monthly review is due.",
    condition: "review.dueISO − TODAY ≤ 3 days",
    assigneeRole: "Sr. Project Manager",
    cadence: "Once per upcoming review, 3 days before",
    icon: "report"
  }
];

/* ─── Pure evaluator ───────────────────────────────────────── */
function evaluateAutoTasks(ctx) {
  const { TODAY, store, META_ACCTS, GOOG_ACCTS, REVIEWS,
          creativeRefreshState, daysBetween } = ctx;
  const out = [];

  /* ── 1) Creative refresh — Meta active contracts ── */
  Object.entries(store.profiles).forEach(([name, p]) => {
    const c = p.serviceContracts?.meta;
    if (!c || c.status !== "active") return;
    const st = creativeRefreshState && creativeRefreshState(c, TODAY);
    if (!st || st.daysSince < 35) return;
    out.push({
      ruleId: "creative-refresh",
      taskId: `auto-cr-${slug(name)}-${monthKey(TODAY)}`,
      target: name,
      evidence: `Day ${st.daysSince} of ${st.cadenceDays}. Last refresh ${st.lastRefreshDate}. ${st.overdue ? "OVERDUE." : `Due in ${st.daysUntilDue}d.`}`,
      severity: st.overdue ? "danger" : "warn",
      task: {
        title: `Brief: ${name} — new Meta creative pack`,
        description: `Auto-fired by the day-35 rule. Maritime's pack is ${st.daysSince} days old; cycle target is ${st.cadenceDays}. Pull the brief, queue an internal review, then send to the client for approval before day 45.`,
        assignee: "vanshika",
        client: name, service: "meta",
        due: st.overdue ? "Overdue" : "This week",
        priority: st.overdue ? "high" : "med",
        labels: ["auto", "creative-refresh"],
        kind: "auto-rule"
      }
    });
  });

  /* ── 2) Stale optimization — Meta + Google active accts ── */
  [["meta", META_ACCTS, "vanshika"], ["google", GOOG_ACCTS, "harsh"]].forEach(([platform, list, owner]) => {
    list.forEach(a => {
      if (!a.lastOptISO || a.status === "paused") return;
      const days = daysBetween(a.lastOptISO, TODAY);
      if (days < 10) return;
      out.push({
        ruleId: "stale-opt",
        taskId: `auto-so-${platform}-${slug(a.client)}-${TODAY}`,
        target: a.client,
        evidence: `${days} days since last optimization on ${platform.toUpperCase()}. Last action ${a.lastOptISO}.`,
        severity: days >= 14 ? "danger" : "warn",
        task: {
          title: `${a.client} — log a ${platform === "google" ? "Google Ads" : "Meta"} optimization (${days}d stale)`,
          description: `Auto-fired by the >10d stale-optimization rule. Target ≥1 logged change per account every 10 days to keep the relationship live and the spend efficient.`,
          assignee: owner,
          client: a.client, service: platform,
          due: days >= 14 ? "Overdue" : "Today",
          priority: days >= 14 ? "high" : "med",
          labels: ["auto", "stale-opt"],
          kind: "auto-rule"
        }
      });
    });
  });

  /* ── 3) Churn-risk — paused contracts ≥ 7d ago ── */
  Object.entries(store.profiles).forEach(([name, p]) => {
    Object.entries(p.serviceContracts || {}).forEach(([svc, c]) => {
      if (c.status !== "paused" || !c.statusSince) return;
      const days = daysBetween(c.statusSince, TODAY);
      if (days < 7) return;
      out.push({
        ruleId: "churn-risk",
        taskId: `auto-ch-${slug(name)}-${svc}-${c.statusSince}`,
        target: `${name} (${svc.toUpperCase()})`,
        evidence: `Paused ${days} days ago. Reason: "${c.statusReason || "no reason given"}".`,
        severity: "warn",
        task: {
          title: `Churn-risk check-in — ${name} (${svc.toUpperCase()})`,
          description: `Auto-fired by the 7-day churn-risk rule. Call the client. No agenda — just stay in the relationship. Don't pitch; listen for the moment that re-opens the door.`,
          assignee: "vihar",
          client: name, service: svc,
          due: "This week",
          priority: "med",
          labels: ["auto", "churn-risk"],
          kind: "auto-rule"
        }
      });
    });
  });

  /* ── 4) Monthly review prep — within 3 days ── */
  REVIEWS.forEach(r => {
    const dueISO = parseRelativeDue(r.due, TODAY);
    if (!dueISO) return;
    const days = daysBetween(TODAY, dueISO);
    if (days < 0 || days > 3) return;
    out.push({
      ruleId: "monthly-review",
      taskId: `auto-rv-${slug(r.client)}-${dueISO}`,
      target: `${r.client} (${r.service.toUpperCase()})`,
      evidence: `Review due ${r.due} (${days}d). Last review ${r.last}. Health ${r.health}.${r.note ? ` ${r.note}` : ""}`,
      severity: r.health === "danger" ? "danger" : "warn",
      task: {
        title: `Prep monthly review — ${r.client}`,
        description: `Auto-fired 3 days before the scheduled review. Pull last month's spend/conv/CPA, the optimization log entries, and the activity feed. Build a 1-page snapshot. Use the AI Assistant for a fast first draft.`,
        assignee: "vihar",
        client: r.client, service: r.service,
        due: r.due,
        priority: r.health === "danger" ? "high" : "med",
        labels: ["auto", "monthly-review"],
        kind: "auto-rule"
      }
    });
  });

  return out;
}

/* ─── Helpers ──────────────────────────────────────────────── */
function slug(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);
}
function monthKey(iso) {
  return iso.slice(0, 7);
}
/* Reviews use friendly dates like "Nov 24" — map to ISO using TODAY's year. */
function parseRelativeDue(label, today) {
  if (!label) return null;
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const m = label.toLowerCase().match(/(\w{3})\s+(\d{1,2})/);
  if (!m) return null;
  const monthIdx = months.indexOf(m[1].slice(0, 3));
  if (monthIdx < 0) return null;
  const day = parseInt(m[2], 10);
  const year = parseInt(today.slice(0, 4), 10);
  const candidate = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return candidate;
}

/* ─── Merger — adds synthesized tasks into store.tasks ───── */
function mergeAutoTasks() {
  const ctx = window.PPC;
  if (!ctx?.store) return [];
  const list = evaluateAutoTasks(ctx);
  const existing = new Set(ctx.store.tasks.map(t => t.id));
  let added = 0;
  list.forEach(item => {
    if (existing.has(item.taskId)) return;
    ctx.store.tasks.unshift({
      id: item.taskId,
      ...item.task,
      ruleId: item.ruleId,
      evidence: item.evidence,
      status: "open",
      watchers: [], links: [], checklist: [], attachments: [], comments: [], labels: item.task.labels || [],
      reporter: "system",
      createdAt: "Just now (auto-fired)"
    });
    added++;
  });
  if (added > 0) ctx.bump?.();
  return list;
}

/* Fire on load — wait for PPC to be defined. */
(function bootAutoRules() {
  function tryOnce() {
    if (window.PPC?.store && window.PPC?.daysBetween) {
      try { mergeAutoTasks(); } catch (e) { /* keep silent — surfaced in UI */ }
    } else {
      setTimeout(tryOnce, 60);
    }
  }
  setTimeout(tryOnce, 30);
})();

/* ═══════════════════════════════════════════════════════════════
   AutoRulesScreen — admin view of the 4 trigger rules + current fires
   ═══════════════════════════════════════════════════════════════ */
function AutoRulesScreen({ role }) {
  useStore(); // re-render on changes
  const ctx = window.PPC;
  const fires = React.useMemo(() => evaluateAutoTasks(ctx), [ctx.store.tasks.length, ctx.TODAY]);
  const byRule = {};
  AUTO_RULES.forEach(r => byRule[r.id] = []);
  fires.forEach(f => { (byRule[f.ruleId] ||= []).push(f); });

  /* Quick stats */
  const total      = fires.length;
  const danger     = fires.filter(f => f.severity === "danger").length;
  const byAssignee = {};
  fires.forEach(f => { byAssignee[f.task.assignee] = (byAssignee[f.task.assignee] || 0) + 1; });

  return (
    <div>
      <div className="page-head" style={{ alignItems: "flex-start" }}>
        <div style={{ maxWidth: 760 }}>
          <div className="page-eyebrow">Admin · Automation</div>
          <h1 className="page-title">Auto-task <em>triggers</em>.</h1>
          <div className="page-sub">
            Four rules constantly evaluate the data and fire tasks the moment a condition is true. Every fire is deterministic — the same condition produces the same task id, so reloads never duplicate. Re-run the evaluator any time.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={() => { mergeAutoTasks(); window.toast?.("Auto-rules re-evaluated", { icon: "↻" }); }}>
            <Icon k="refresh" /> Re-run now
          </button>
        </div>
      </div>

      <div className="autorules-strip">
        <DayStat ic="bolt"   label="Rules active"    v={AUTO_RULES.length} sub="all enabled" />
        <DayStat ic="alert"  label="Tasks firing"    v={total}             sub={`${danger} red, ${total - danger} amber`} tone={danger > 0 ? "danger" : total > 0 ? "warn" : "ok"} />
        <DayStat ic="users"  label="Assignees"       v={Object.keys(byAssignee).length} sub={Object.entries(byAssignee).map(([k,v]) => `${ctx.userMap[k]?.name.split(" ")[0]} ${v}`).join(" · ") || "—"} />
        <DayStat ic="clock"  label="Last eval"       v="now" sub={`Today is ${ctx.TODAY}`} />
      </div>

      <div className="autorules-grid">
        {AUTO_RULES.map(rule => {
          const matches = byRule[rule.id] || [];
          return (
            <div key={rule.id} className="autorule-card">
              <div className="autorule-head">
                <div className="autorule-ic"><Icon k={rule.icon} /></div>
                <div className="col" style={{ flex: 1 }}>
                  <span className="autorule-name">{rule.label}</span>
                  <span className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{rule.description}</span>
                </div>
                <Pill kind={matches.length === 0 ? "outline" : matches.some(m => m.severity === "danger") ? "danger" : "warn"}>
                  {matches.length} firing
                </Pill>
              </div>

              <div className="autorule-body">
                <div className="autorule-field"><span className="k">Condition</span><span className="mono v">{rule.condition}</span></div>
                <div className="autorule-field"><span className="k">Assignee</span><span className="v">{rule.assigneeRole}</span></div>
                <div className="autorule-field"><span className="k">Cadence</span><span className="v">{rule.cadence}</span></div>
              </div>

              {matches.length > 0 && (
                <>
                  <div className="autorule-divider" />
                  <div className="autorule-list-title">Currently firing for · {matches.length}</div>
                  <div className="autorule-list">
                    {matches.map(m => (
                      <div key={m.taskId} className={`autorule-row sev-${m.severity}`}
                           onClick={() => window.openTaskPanel?.(m.taskId)}>
                        <span className={`autorule-dot sev-${m.severity}`} />
                        <div className="col" style={{ flex: 1, minWidth: 0 }}>
                          <span className="autorule-target">{m.target}</span>
                          <span className="autorule-evidence">{m.evidence}</span>
                        </div>
                        <button className="btn sm ghost"
                                onClick={(e) => { e.stopPropagation(); window.openClientPanel?.(m.task.client); }}>
                          Open
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {matches.length === 0 && (
                <div className="autorule-empty">
                  Nothing matches this rule right now.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { AutoRulesScreen, AUTO_RULES, evaluateAutoTasks, mergeAutoTasks });
