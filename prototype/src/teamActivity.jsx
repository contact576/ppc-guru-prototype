/* ─────────────────────────────────────────────────────────────────
   Phase 6 — Team Activity + Hours (owner / delivery view).
   Mirrors Todoist's Reporting (per-day completed/added log, filter by
   person · action · date · client) and adds the layer Todoist can't:
   ACTUAL tracked hours from the start/stop timer, est-vs-actual, and
   planned-vs-done (added in the morning vs completed by EOD → measures
   the >10-minute house rule). Money-free, so safe for PM scope.
   ───────────────────────────────────────────────────────────────── */

function TeamActivityScreen({ role }) {
  const store = useStore();
  const { USERS, userMap, TODAY, shiftDate, CAPACITY } = window.PPC;

  /* hooks must run unconditionally before any early return (Rules of Hooks) */
  const [person, setPerson] = React.useState("all");
  const [action, setAction] = React.useState("completed");
  const [range, setRange]   = React.useState("7d");
  const [client, setClient] = React.useState("all");

  /* gating — owners + head of delivery + PM only (kept in sync with sidebar) */
  if (!["jaydeep", "dhaval", "shrikant", "vihar"].includes(role.id)) {
    return (
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Restricted</div>
          <h1 className="page-title">Team <em>Activity</em></h1>
          <div className="page-sub">This view is for owners and delivery leads. Switch role to Jaydeep, Dhaval, Shrikant, or Vihar to see it.</div>
        </div>
      </div>
    );
  }

  /* ── build the event stream from tasks ─────────────────────────── */
  const events = [];
  store.tasks.forEach(t => {
    if (t.createdISO)                          events.push({ type: "added",     task: t, day: t.createdISO });
    if (t.status === "done" && t.completedISO) events.push({ type: "completed", task: t, day: t.completedISO });
  });

  const from7 = shiftDate(TODAY, -6);
  const inRange = (day) => range === "all" ? true : range === "today" ? day === TODAY : day >= from7;
  const filtered = events.filter(e =>
    (person === "all" || e.task.assignee === person) &&
    (action === "all" || e.type === action) &&
    (client === "all" || e.task.client === client) &&
    inRange(e.day)
  );

  /* group by day, newest first */
  const byDay = {};
  filtered.forEach(e => { (byDay[e.day] = byDay[e.day] || []).push(e); });
  const days = Object.keys(byDay).sort().reverse();

  /* ── per-person hours roll-up (completed events in range) ──────── */
  const completedInRange = events.filter(e =>
    e.type === "completed" &&
    (person === "all" || e.task.assignee === person) &&
    (client === "all" || e.task.client === client) &&
    inRange(e.day)
  );
  const addedInRange = events.filter(e =>
    e.type === "added" &&
    (person === "all" || e.task.assignee === person) &&
    (client === "all" || e.task.client === client) &&
    inRange(e.day)
  );
  const per = {};
  const seed = (uid) => (per[uid] = per[uid] || { completed: 0, added: 0, estMin: 0, spentMin: 0 });
  completedInRange.forEach(e => { const p = seed(e.task.assignee); p.completed++; p.estMin += e.task.timeEstimateMin || 0; p.spentMin += e.task.timeSpentMin || 0; });
  addedInRange.forEach(e => { seed(e.task.assignee).added++; });
  const peopleRows = Object.keys(per).sort((a, b) => per[b].completed - per[a].completed);

  const totals = peopleRows.reduce((acc, uid) => {
    acc.completed += per[uid].completed; acc.added += per[uid].added;
    acc.estMin += per[uid].estMin; acc.spentMin += per[uid].spentMin; return acc;
  }, { completed: 0, added: 0, estMin: 0, spentMin: 0 });

  const clients = Array.from(new Set(store.tasks.map(t => t.client).filter(Boolean))).sort();
  const hrs = (min) => (min / 60).toFixed(1) + "h";

  const dayLabel = (iso) => {
    if (iso === TODAY) return "Today";
    if (iso === shiftDate(TODAY, -1)) return "Yesterday";
    const d = new Date(iso + "T00:00:00Z");
    const wk = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
    const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()];
    return `${wk}, ${mo} ${d.getUTCDate()}`;
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Owners + delivery · who did what, and how long it took</div>
          <h1 className="page-title">Team <em>Activity</em></h1>
          <div className="page-sub">
            Every task logged and completed, per person, per day — with <strong>actual tracked hours</strong> from the timer.
            Use it to see where the team's time goes and whether the start-of-day &gt;10-minute rule is being followed.
          </div>
        </div>
        <button className="btn ghost" onClick={() => window.toast?.("Export — CSV wires up in production", { icon: "↓" })}>
          <Icon k="report" /> Export
        </button>
      </div>

      {/* filters */}
      <div className="toolbar" style={{ flexWrap: "wrap", gap: 10 }}>
        <SelectInput value={person} onChange={e => setPerson(e.target.value)} style={{ width: "auto" }}>
          <option value="all">Everyone</option>
          {USERS.filter(u => u.id !== "client").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </SelectInput>
        <div className="seg">
          <button className={action === "completed" ? "on" : ""} onClick={() => setAction("completed")}>Completed</button>
          <button className={action === "added" ? "on" : ""} onClick={() => setAction("added")}>Added</button>
          <button className={action === "all" ? "on" : ""} onClick={() => setAction("all")}>All activity</button>
        </div>
        <div className="seg">
          <button className={range === "today" ? "on" : ""} onClick={() => setRange("today")}>Today</button>
          <button className={range === "7d" ? "on" : ""} onClick={() => setRange("7d")}>Last 7 days</button>
          <button className={range === "all" ? "on" : ""} onClick={() => setRange("all")}>All</button>
        </div>
        <SelectInput value={client} onChange={e => setClient(e.target.value)} style={{ width: "auto" }}>
          <option value="all">All clients</option>
          {clients.map(c => <option key={c} value={c}>{c}</option>)}
        </SelectInput>
      </div>

      {/* hours roll-up */}
      <div className="widget" style={{ padding: 0, marginBottom: 16 }}>
        <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>Hours &amp; completion {range === "today" ? "· today" : range === "7d" ? "· last 7 days" : "· all time"}</span>
          <span className="muted mono" style={{ fontSize: 12.5 }}>{totals.completed} done · {hrs(totals.spentMin)} tracked</span>
        </div>
        {peopleRows.length === 0 && <div className="empty" style={{ margin: 16 }}>No activity in this range.</div>}
        <div className="t6-people">
          {peopleRows.map(uid => {
            const p = per[uid];
            const u = userMap[uid];
            const cap = CAPACITY[uid];
            const overEst = p.estMin > 0 && p.spentMin > p.estMin;
            const estPct = p.estMin > 0 ? Math.min(100, Math.round((p.spentMin / p.estMin) * 100)) : 0;
            const doneRate = p.added > 0 ? Math.round((p.completed / p.added) * 100) : null;
            return (
              <div key={uid} className="t6-person">
                <div className="row gap-2" style={{ marginBottom: 8 }}>
                  <Avatar user={u} size="sm" />
                  <div className="col" style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{u.name.split(" ")[0]}</span>
                    <span className="muted" style={{ fontSize: 12 }}>{u.role}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 18 }}>{p.completed}</span>
                </div>
                <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5 }}>
                  <span className="muted">Tracked</span>
                  <span className="mono" style={{ color: overEst ? "var(--danger)" : "var(--ink)" }}>{hrs(p.spentMin)}{p.estMin > 0 && <span className="muted"> / {hrs(p.estMin)} est</span>}</span>
                </div>
                {p.estMin > 0 && <div className="bar" style={{ marginTop: 4 }}><i style={{ width: estPct + "%", background: overEst ? "var(--danger)" : undefined }} /></div>}
                <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, marginTop: 8 }}>
                  <span className="muted">Planned → done</span>
                  <span className="mono">{p.completed}/{p.added}{doneRate != null && <span className="muted"> · {doneRate}%</span>}</span>
                </div>
                {cap && (
                  <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, marginTop: 4 }}>
                    <span className="muted">Week capacity</span>
                    <span className="mono" style={{ color: cap.hours > cap.max ? "var(--danger)" : "var(--ink)" }}>{cap.hours}/{cap.max}h</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* per-day activity log */}
      <div className="col gap-4">
        {days.map(day => {
          const list = byDay[day];
          return (
            <div key={day} className="widget" style={{ padding: 0 }}>
              <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
                <span className="section-title" style={{ flex: 1 }}>{dayLabel(day)}</span>
                <span className="muted mono" style={{ fontSize: 12.5 }}>{list.length}</span>
              </div>
              <div>
                {list.map((e, i) => {
                  const u = userMap[e.task.assignee];
                  return (
                    <div key={i} className="t6-act-row" onClick={() => e.task.client && window.openClientPanel?.(e.task.client)}>
                      <Avatar user={u} size="sm" />
                      <span className="muted" style={{ fontSize: 12.5, width: 120, flexShrink: 0 }}>
                        {u?.name.split(" ")[0]} {e.type === "completed" ? "completed" : "added"}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, textDecoration: e.type === "completed" ? "line-through" : "none", color: e.type === "completed" ? "var(--ink-3)" : "var(--ink)" }}>
                        {e.task.title}
                      </span>
                      {e.task.timeEstimateMin != null && <Pill kind="outline"><Icon k="clock" className="ic sm" />{window.PPC.bucketFor(e.task.timeEstimateMin).label}</Pill>}
                      {e.type === "completed" && e.task.timeSpentMin > 0 && <span className="muted mono" style={{ fontSize: 12 }}>{fmtDur(e.task.timeSpentMin)}</span>}
                      {e.task.client && <span className="muted" style={{ fontSize: 12.5 }}>{e.task.client}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {days.length === 0 && <div className="empty">No activity matches these filters.</div>}
      </div>
    </div>
  );
}

window.TeamActivityScreen = TeamActivityScreen;
