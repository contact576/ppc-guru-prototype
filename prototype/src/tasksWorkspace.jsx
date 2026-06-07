/* Phase 7 — Todoist-style two-pane Tasks workspace.
   Left: secondary sub-sidebar (Today / Upcoming / Inbox / Filters / Calendar /
   Reporting / My Projects). Right: the selected view (board or list, sortable).
   Reuses TaskCard / TaskRow / QuickAddBar / TenMinBanner / TeamActivityScreen
   (all window globals) — nothing rebuilt. Dates anchor to window.PPC.TODAY so the
   curated seed data lines up. */

const TWS_ADMINS = ["jaydeep", "dhaval"];
const TWS_GROUPS = [
  { id: "priority", label: "Priority" },
  { id: "due", label: "Due" },
  { id: "duration", label: "Duration" },
  { id: "label", label: "Label" }
];

function twsPrioRank(p) { return p === "high" ? 0 : p === "med" ? 1 : 2; }
function twsSort(a, b) {
  const pr = twsPrioRank(a.priority) - twsPrioRank(b.priority);
  if (pr) return pr;
  const ad = a.dueISO || "9999-99-99", bd = b.dueISO || "9999-99-99";
  return ad < bd ? -1 : ad > bd ? 1 : 0;
}
function twsIsOverdue(t, today) {
  if (t.status === "done") return false;
  if (t.dueISO) return t.dueISO < today;
  return t.due === "Overdue";
}
function twsIsToday(t, today) {
  if (t.dueISO) return t.dueISO === today;
  return t.due === "Today";
}
function twsIsTodayOrOverdue(t, today) {
  if (t.status === "done") return false;
  // due today/overdue OR a hard deadline that is today/past — either should surface in Today
  const deadlineHit = t.deadlineISO && t.deadlineISO <= today;
  return twsIsOverdue(t, today) || twsIsToday(t, today) || deadlineHit;
}

/* auto-from-pipeline tasks (mirrors TasksScreen). onlyRoleId=null → every owner. */
function twsAutoTasks(onlyRoleId) {
  const { ONB_CARDS, ACT_CARDS, ONBOARD_STAGES, ACTIVE_STAGES } = window.PPC;
  const out = [];
  const all = [...ONB_CARDS.map(c => ({ ...c, kind: "onb" })), ...ACT_CARDS.map(c => ({ ...c, kind: "act" }))];
  all.forEach(c => {
    const stages = c.kind === "onb" ? ONBOARD_STAGES[c.service] : ACTIVE_STAGES[c.service];
    const st = stages && stages.find(s => s.id === c.stage);
    if (!st) return;
    let assignedTo = null;
    if (st.type === "designer") assignedTo = c.designer;
    else if (st.type === "client") return;
    else if (Array.isArray(st.owner)) assignedTo = st.owner.filter(o => o !== "client")[0];
    else assignedTo = c.override || st.owner;
    if (!assignedTo) return;
    if (onlyRoleId == null || assignedTo === onlyRoleId) {
      out.push({
        id: `auto-${c.id}`, assignee: assignedTo, title: `${st.name} — ${c.name}`,
        client: c.name, service: c.service, due: c.days >= 4 ? "Overdue" : "Today",
        priority: c.days >= 5 ? "high" : c.days >= 3 ? "med" : "low",
        status: "open", kind: "auto", stage: st.name, autoCardId: c.id
      });
    }
  });
  return out;
}

/* group a task list by the chosen key → ordered [{key,label,items}] */
function twsGroup(tasks, groupBy, today) {
  const { bucketFor, DURATION_BUCKETS, userMap, USERS, shiftDate } = window.PPC;
  const map = new Map();
  const push = (key, label, t) => { if (!map.has(key)) map.set(key, { key, label, items: [] }); map.get(key).items.push(t); };
  tasks.forEach(t => {
    if (groupBy === "priority") { const k = t.priority || "low"; push(k, k === "high" ? "High priority" : k === "med" ? "Medium" : "Low", t); }
    else if (groupBy === "assignee") { const u = userMap[t.assignee]; push(t.assignee || "none", u ? u.name : "Unassigned", t); }
    else if (groupBy === "duration") { const b = t.timeEstimateMin != null ? bucketFor(t.timeEstimateMin) : null; push(b ? b.label : "~none", b ? b.label : "No estimate", t); }
    else if (groupBy === "label") { const ls = (t.labels && t.labels.length) ? t.labels : ["~none"]; ls.forEach(l => push(l, l === "~none" ? "No label" : "@" + l, t)); }
    else if (groupBy === "due") {
      let k, l;
      if (twsIsOverdue(t, today)) { k = "0"; l = "Overdue"; }
      else if (twsIsToday(t, today)) { k = "1"; l = "Today"; }
      else if (t.dueISO === shiftDate(today, 1)) { k = "2"; l = "Tomorrow"; }
      else if (t.dueISO && t.dueISO > today && t.dueISO <= shiftDate(today, 7)) { k = "3"; l = "This week"; }
      else if (t.dueISO && t.dueISO > shiftDate(today, 7)) { k = "4"; l = "Later"; }
      else { k = "5"; l = "No date"; }
      push(k, l, t);
    }
  });
  let arr = [...map.values()];
  if (groupBy === "priority") { const o = ["high", "med", "low"]; arr.sort((a, b) => o.indexOf(a.key) - o.indexOf(b.key)); }
  else if (groupBy === "due") arr.sort((a, b) => a.key.localeCompare(b.key));
  else if (groupBy === "duration") { const o = [...DURATION_BUCKETS.map(b => b.label), "No estimate"]; arr.sort((a, b) => o.indexOf(a.label) - o.indexOf(b.label)); }
  else if (groupBy === "assignee") { const o = USERS.map(u => u.id); arr.sort((a, b) => o.indexOf(a.key) - o.indexOf(b.key)); }
  else arr.sort((a, b) => a.label.localeCompare(b.label));
  arr.forEach(g => g.items.sort(twsSort));
  // attach a drop handler per column so drag-and-drop re-files the card into that section
  arr.forEach(g => { g.groupBy = groupBy; g.apply = twsMakeApply(groupBy, g.key); });
  return arr;
}

/* Given a board grouping + a column key, return apply(store, taskId) -> bool.
   Dropping a card into a column performs the matching mutation (reassign, set
   priority, set estimate bucket, reschedule, add label). Returns false if the
   column isn't a meaningful drop target (e.g. "Overdue"). */
function twsMakeApply(groupBy, key) {
  const PPC = window.PPC;
  if (groupBy === "priority") return (s, id) => { s.updateTask(id, { priority: key }); return true; };
  if (groupBy === "assignee") return (s, id) => { s.updateTask(id, { assignee: key === "none" ? null : key }); return true; };
  if (groupBy === "duration") {
    const b = (PPC.DURATION_BUCKETS || []).find(x => x.label === key);
    return (s, id) => { s.setTaskEstimate(id, b ? (b.maxMin && b.maxMin !== Infinity ? b.maxMin : 90) : null); return true; };
  }
  if (groupBy === "due") {
    const lbl = { "1": "Today", "2": "Tomorrow", "5": "No date" }[key];
    return (s, id) => { if (!lbl) return false; if (lbl === "No date") s.updateTask(id, { due: "No date", dueISO: null }); else s.updateTask(id, { due: lbl }); return true; };
  }
  if (groupBy === "label") {
    return (s, id) => { if (key === "~none") return false; const t = s.tasks.find(x => x.id === id); const labels = Array.from(new Set([...((t && t.labels) || []), key])); s.updateTask(id, { labels }); return true; };
  }
  return () => false;
}

/* The full, ordered set of sections (columns) for a board grouping — so the
   kanban always shows every section (even empty ones) and you can drop into them. */
function twsCanonicalCols(groupBy) {
  const PPC = window.PPC;
  if (groupBy === "priority") return [["high", "High priority"], ["med", "Medium"], ["low", "Low"]];
  if (groupBy === "assignee") return PPC.USERS.filter(u => u.id !== "client").map(u => [u.id, u.name]);
  if (groupBy === "duration") return [...PPC.DURATION_BUCKETS.map(b => [b.label, b.label]), ["~none", "No estimate"]];
  if (groupBy === "due") return [["0", "Overdue"], ["1", "Today"], ["2", "Tomorrow"], ["3", "This week"], ["4", "Later"], ["5", "No date"]];
  return null;  // label / other: dynamic domain — show only existing sections
}
function twsPadColumns(groups, groupBy) {
  const canon = twsCanonicalCols(groupBy);
  if (!canon) return groups;
  const byKey = new Map(groups.map(g => [g.key, g]));
  const used = new Set();
  const out = canon.map(([key, label]) => { used.add(key); return byKey.get(key) || { key, label, items: [], groupBy, apply: twsMakeApply(groupBy, key) }; });
  groups.forEach(g => { if (!used.has(g.key)) out.push(g); });   // keep extras (Unassigned, etc.)
  return out;
}

/* board (kanban) OR list rendering of grouped tasks. Board columns are drop
   targets; cards (real tasks, not auto pipeline rows) are draggable. */
function TwsGroups({ groups, viewMode, store, emptyMsg, groupBy }) {
  const { userMap } = window.PPC;
  const [dragId, setDragId] = React.useState(null);
  const [overKey, setOverKey] = React.useState(null);
  const open = (t) => t.kind === "auto" ? window.openClientPanel?.(t.autoCardId) : window.openTaskPanel?.(t.id);
  const toggle = (t) => { if (t.kind !== "auto") store.toggleTaskDone(t.id); };

  const onDrop = (e, g) => {
    e.preventDefault(); setOverKey(null);
    const id = (e.dataTransfer && e.dataTransfer.getData("text/plain")) || dragId;
    setDragId(null);
    if (!id) return;
    const task = store.tasks.find(t => t.id === id);
    if (!task) return;
    if (g.items.some(it => it.id === id)) return;        // dropped in same column → no-op
    const ok = g.apply ? g.apply(store, id) : false;
    window.toast?.(ok ? `Moved “${(task.title || "Task").slice(0, 28)}” → ${g.label}` : `Can’t move into “${g.label}”`, { icon: ok ? "✓" : "!" });
  };

  if (viewMode === "board") {
    const cols = twsPadColumns(groups, groupBy || (groups[0] && groups[0].groupBy));
    if (!cols.length) return <div className="empty">{emptyMsg || "Nothing here — inbox zero."}</div>;
    return (
      <div className="t6-board">
        {cols.map(g => (
          <div key={g.key}
            className={`t6-col ${overKey === g.key ? "t6-col-drop" : ""}`}
            onDragOver={(e) => { e.preventDefault(); if (overKey !== g.key) setOverKey(g.key); }}
            onDragLeave={(e) => { if (e.currentTarget === e.target) setOverKey(null); }}
            onDrop={(e) => onDrop(e, g)}>
            <div className="t6-col-head"><span className="section-title">{g.label}</span><span className="muted mono" style={{ fontSize: 12.5 }}>{g.items.length}</span></div>
            <div className="t6-col-body">
              {g.items.map(t => (
                <div key={t.id}
                  className={`t6-drag ${t.kind === "auto" ? "nodrag" : ""} ${dragId === t.id ? "dragging" : ""}`}
                  draggable={t.kind !== "auto"}
                  onDragStart={(e) => { if (t.kind === "auto") { e.preventDefault(); return; } e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", t.id); setDragId(t.id); }}
                  onDragEnd={() => { setDragId(null); setOverKey(null); }}>
                  <TaskCard task={t} onToggle={() => toggle(t)} onOpen={() => open(t)} userMap={userMap} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (!groups.length) return <div className="empty">{emptyMsg || "Nothing here — inbox zero."}</div>;
  return (
    <div className="col gap-4">
      {groups.map(g => (
        <div key={g.key} className="widget" style={{ padding: 0 }}>
          <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
            <span className="section-title" style={{ flex: 1 }}>{g.label}</span>
            <span className="muted mono" style={{ fontSize: 12.5 }}>{g.items.length}</span>
          </div>
          <div>{g.items.map(t => <TaskRow key={t.id} task={t} onToggle={() => toggle(t)} onOpen={() => open(t)} userMap={userMap} />)}</div>
        </div>
      ))}
    </div>
  );
}

/* sub-sidebar */
function TaskSubNav({ role, view, setView, counts, store, search, setSearch }) {
  const isAdmin = TWS_ADMINS.includes(role.id);
  const [adding, setAdding] = React.useState(false);
  const [pname, setPname] = React.useState("");
  const projects = store.projects.filter(p => !p.system && (isAdmin || p.owner === role.id));
  const Item = ({ id, icon, label, count, on }) => (
    <div className={`t6-sub-item ${view === id ? "active" : ""}`} onClick={() => setView(id)}>
      <Icon k={icon} className="icon" />
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && count > 0 && <span className="count">{count}</span>}
    </div>
  );
  const addProj = () => { const n = pname.trim(); if (!n) { setAdding(false); return; } const p = store.addProject({ name: n, owner: role.id }); setPname(""); setAdding(false); setView("project:" + p.id); };
  return (
    <div className="t6-sub">
      <button className="t6-sub-add" onClick={() => window.openNewTask?.()}><span className="t6-sub-addic">+</span> Add task</button>
      <div className="t6-sub-search">
        <Icon k="search" className="icon" />
        <input placeholder="Search tasks" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Item id="today" icon="calendar" label="Today" count={counts.today} />
      <Item id="upcoming" icon="board" label="Upcoming" count={counts.upcoming} />
      <Item id="inbox" icon="inbox" label="Inbox" count={counts.inbox} />
      <Item id="filters" icon="filter" label="Filters & Labels" />
      <Item id="calendar" icon="calendar" label="Calendar" />
      <Item id="reporting" icon="report" label="Reporting" />
      <div className="t6-sub-title">My Projects</div>
      {isAdmin && <Item id="project:team" icon="users" label="Team" count={counts.team} />}
      {projects.map(p => (
        <div key={p.id} className={`t6-sub-item ${view === "project:" + p.id ? "active" : ""}`} onClick={() => setView("project:" + p.id)}>
          <span className="t6-sub-dot" style={{ background: p.color }} />
          <span style={{ flex: 1 }}>{p.name}</span>
          <span className="count">{counts.projects[p.id] || 0}</span>
        </div>
      ))}
      {adding ? (
        <div className="t6-sub-addrow">
          <input autoFocus placeholder="Project name" value={pname} onChange={e => setPname(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addProj(); if (e.key === "Escape") { setAdding(false); setPname(""); } }} onBlur={addProj} />
        </div>
      ) : (
        <div className="t6-sub-item t6-sub-muted" onClick={() => setAdding(true)}>
          <Icon k="plus" className="icon" /><span style={{ flex: 1 }}>Add project</span>
        </div>
      )}
    </div>
  );
}

/* ── individual views ───────────────────────────────────────────── */
/* priority score from the widget signals → drives the "Start here" suggestions */
function twsScore(t, today) {
  const PPC = window.PPC;
  let s = t.priority === "high" ? 100 : t.priority === "med" ? 45 : 15;
  if (twsIsOverdue(t, today)) s += 80;
  else if (twsIsToday(t, today)) s += 45;
  if (t.deadlineISO) { if (t.deadlineISO <= today) s += 70; else if (t.deadlineISO <= PPC.shiftDate(today, 2)) s += 35; }
  if (t.dueTime) s += Math.max(0, 18 - parseInt(t.dueTime.slice(0, 2), 10));   // earlier in the day → nudge up
  if (t.timeEstimateMin != null && t.timeEstimateMin <= 10) s += 12;            // quick win
  return s;
}
function twsReasons(t, today) {
  const PPC = window.PPC, r = [];
  if (t.priority === "high") r.push("High priority"); else if (t.priority === "med") r.push("Medium priority");
  if (twsIsOverdue(t, today)) r.push("Overdue");
  else if (twsIsToday(t, today)) r.push("Due today" + (t.dueTime ? " · " + PPC.fmtTime12(t.dueTime) : ""));
  if (t.deadlineISO && t.deadlineISO <= today) r.push("Deadline today");
  else if (t.deadlineISO) r.push("Deadline " + PPC.isoToDueLabel(t.deadlineISO));
  if (t.timeEstimateMin != null && t.timeEstimateMin <= 10) r.push("Quick win");
  if (t.client) r.push(t.client);
  return r;
}

function TwsToday({ tasks, viewMode, groupBy, today, store }) {
  const { userMap } = window.PPC;
  const list = tasks.filter(t => twsIsTodayOrOverdue(t, today)).sort(twsSort);
  const ranked = [...list].sort((a, b) => twsScore(b, today) - twsScore(a, today)).slice(0, 3);
  return (
    <div className="col gap-4">
      {ranked.length > 0 && (
        <div className="t6-suggest">
          <div className="t6-suggest-head">
            <span className="t6-suggest-eyebrow">✦ Start here · suggested order</span>
            <span className="muted" style={{ fontSize: 12 }}>ranked from priority, due time, deadline &amp; effort</span>
          </div>
          {ranked.map((t, i) => (
            <div key={t.id} className="t6-suggest-row" onClick={() => t.kind !== "auto" ? window.openTaskPanel?.(t.id) : window.openClientPanel?.(t.autoCardId)}>
              <div className={`t6-suggest-rank r${i + 1}`}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t6-suggest-title">{t.title}</div>
                <div className="t6-suggest-reasons">{twsReasons(t, today).map((rsn, j) => <span key={j} className="t6-suggest-reason">{rsn}</span>)}</div>
              </div>
              <Avatar user={userMap[t.assignee]} size="sm" />
            </div>
          ))}
        </div>
      )}
      <TwsGroups groups={twsGroup(list, groupBy, today)} viewMode={viewMode} store={store} groupBy={groupBy} emptyMsg="All clear for today — inbox zero." />
    </div>
  );
}

function TwsUpcoming({ tasks, today, store }) {
  const { shiftDate, isoToDueLabel, userMap } = window.PPC;
  const open = (t) => t.kind === "auto" ? window.openClientPanel?.(t.autoCardId) : window.openTaskPanel?.(t.id);
  const toggle = (t) => { if (t.kind !== "auto") store.toggleTaskDone(t.id); };
  const days = Array.from({ length: 7 }, (_, i) => shiftDate(today, i));
  const overdue = tasks.filter(t => twsIsOverdue(t, today)).sort(twsSort);
  const dow = (iso) => { const d = new Date(iso + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short" }); };
  const dnum = (iso) => parseInt(iso.slice(8, 10), 10);
  const dayLabel = (iso, i) => i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const Section = ({ title, items, kind }) => (
    <div className="widget" style={{ padding: 0 }}>
      <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
        <span className="section-title" style={{ flex: 1, color: kind === "over" ? "var(--danger)" : undefined }}>{title}</span>
        <span className="muted mono" style={{ fontSize: 12.5 }}>{items.length}</span>
      </div>
      <div>{items.length ? items.map(t => <TaskRow key={t.id} task={t} onToggle={() => toggle(t)} onOpen={() => open(t)} userMap={userMap} />) : <div className="empty" style={{ padding: "14px 16px" }}>—</div>}</div>
    </div>
  );
  return (
    <div className="col gap-4">
      <div className="t6-weekstrip">
        {days.map((iso, i) => {
          const n = tasks.filter(t => t.dueISO === iso && t.status !== "done").length;
          return (
            <div key={iso} className={`t6-weekday ${i === 0 ? "on" : ""}`}>
              <span className="t6-weekday-dow">{dow(iso)}</span>
              <span className="t6-weekday-num">{dnum(iso)}</span>
              {n > 0 && <span className="t6-weekday-dot" />}
            </div>
          );
        })}
      </div>
      {overdue.length > 0 && <Section title="Overdue" items={overdue} kind="over" />}
      {days.map((iso, i) => {
        const items = tasks.filter(t => t.dueISO === iso && t.status !== "done").sort(twsSort);
        if (i > 0 && !items.length) return null;
        return <Section key={iso} title={dayLabel(iso, i)} items={items} />;
      })}
    </div>
  );
}

function TwsCalendar({ tasks, today }) {
  const { monthDaysIn, userMap } = window.PPC;
  const ym = today.slice(0, 7);
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const startDow = first.getDay();
  const total = monthDaysIn(ym);
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(`${ym}-${String(d).padStart(2, "0")}`);
  const byDay = {};
  tasks.forEach(t => { if (t.dueISO && t.dueISO.slice(0, 7) === ym) (byDay[t.dueISO] = byDay[t.dueISO] || []).push(t); });
  const monthName = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <div className="col gap-4">
      <div className="t6-connect">
        <Icon k="google" className="ic" />
        <span style={{ flex: 1 }}>Connect <strong>Google Calendar / Workspace</strong> to two-way sync tasks &amp; events. <span className="muted">— integration pending</span></span>
        <button className="btn sm" onClick={() => window.toast?.("Google Workspace connect — coming soon", { icon: "🔗" })}>Connect</button>
      </div>
      <div className="widget" style={{ padding: 16 }}>
        <div className="section-title" style={{ marginBottom: 10 }}>{monthName}</div>
        <div className="t6-cal-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="t6-cal-dow">{d}</div>)}
          {cells.map((iso, i) => (
            <div key={i} className={`t6-cal-cell ${iso === today ? "today" : ""} ${!iso ? "blank" : ""}`}>
              {iso && <>
                <span className="t6-cal-num">{parseInt(iso.slice(8, 10), 10)}</span>
                <div className="t6-cal-tasks">
                  {(byDay[iso] || []).slice(0, 3).map(t => (
                    <div key={t.id} className="t6-cal-task" title={t.title} onClick={() => t.kind !== "auto" && window.openTaskPanel?.(t.id)}>{t.title}</div>
                  ))}
                  {(byDay[iso] || []).length > 3 && <div className="muted" style={{ fontSize: 10.5 }}>+{byDay[iso].length - 3} more</div>}
                </div>
              </>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TwsReporting({ role, today, store, setScreen }) {
  const { shiftDate, userMap, USERS } = window.PPC;
  const isAdmin = TWS_ADMINS.includes(role.id);
  const weekStart = shiftDate(today, -6);
  const doneToday = store.tasksCompleted(role.id, today);
  const doneWeek = store.tasksCompleted(role.id, weekStart);
  const Stat = ({ n, label }) => <div className="t6-rep-stat"><div className="t6-rep-num mono">{n}</div><div className="muted" style={{ fontSize: 12.5 }}>{label}</div></div>;
  return (
    <div className="col gap-4">
      <div className="t6-rep-row">
        <Stat n={doneToday.length} label="completed today" />
        <Stat n={doneWeek.length} label="completed this week" />
        <Stat n={store.tasks.filter(t => t.assignee === role.id && t.status !== "done").length} label="open now" />
      </div>
      {isAdmin && (
        <div className="widget" style={{ padding: 0 }}>
          <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
            <span className="section-title" style={{ flex: 1 }}>Team — completed today</span>
            <button className="btn sm ghost" onClick={() => setScreen?.("team-activity")}>Full report →</button>
          </div>
          <div>
            {USERS.filter(u => u.id !== "client").map(u => {
              const n = store.tasksCompleted(u.id, today).length;
              return (
                <div key={u.id} className="task-row" style={{ cursor: "default" }}>
                  <Avatar user={u} size="sm" />
                  <span style={{ flex: 1, fontSize: 13.5 }}>{u.name}</span>
                  <span className="muted mono" style={{ fontSize: 12.5 }}>{n} done</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="widget" style={{ padding: 0 }}>
        <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>What you finished today</span>
          <span className="muted mono" style={{ fontSize: 12.5 }}>{doneToday.length}</span>
        </div>
        <div>{doneToday.length ? doneToday.map(t => <TaskRow key={t.id} task={t} onToggle={() => store.toggleTaskDone(t.id)} onOpen={() => window.openTaskPanel?.(t.id)} userMap={userMap} />) : <div className="empty" style={{ padding: "14px 16px" }}>Nothing logged yet today.</div>}</div>
      </div>
    </div>
  );
}

/* ── workspace shell ────────────────────────────────────────────── */
function TasksWorkspace({ role, setScreen }) {
  const store = useStore();
  const { userMap } = window.PPC;
  // anchor date logic to the REAL current date (tasks are created with the real clock),
  // so a task you add for today shows up in Today. Falls back to demo TODAY if unavailable.
  const today = window.PPC.realToday ? window.PPC.realToday() : window.PPC.TODAY;
  const isAdmin = TWS_ADMINS.includes(role.id);
  const [view, setView] = React.useState("today");
  const [viewMode, setViewMode] = React.useState("list");
  const [groupBy, setGroupBy] = React.useState("priority");
  const [search, setSearch] = React.useState("");

  // pools
  const mineRich = store.tasks.filter(t => t.assignee === role.id || (t.watchers || []).includes(role.id));
  const mine = [...mineRich, ...twsAutoTasks(role.id)];
  const everyone = [...store.tasks, ...twsAutoTasks(null)];

  const applySearch = (list) => {
    const q = search.trim().toLowerCase();
    return q ? list.filter(t => (t.title || "").toLowerCase().includes(q)) : list;
  };

  // counts for sub-nav
  const counts = {
    today: mine.filter(t => twsIsTodayOrOverdue(t, today)).length,
    upcoming: mine.filter(t => t.status !== "done" && t.dueISO && t.dueISO >= today).length,
    inbox: mineRich.filter(t => t.status !== "done" && !t.projectId && !t.client).length,
    team: store.tasks.filter(t => t.status !== "done").length,
    projects: {}
  };
  store.projects.filter(p => !p.system).forEach(p => { counts.projects[p.id] = store.tasks.filter(t => t.projectId === p.id && t.status !== "done").length; });

  // guard: non-admin can't open team
  React.useEffect(() => { if (view === "project:team" && !isAdmin) setView("today"); }, [view, isAdmin]);

  const titleFor = () => {
    if (view === "today") return "Today";
    if (view === "upcoming") return "Upcoming";
    if (view === "inbox") return "Inbox";
    if (view === "filters") return "Filters & Labels";
    if (view === "calendar") return "Calendar";
    if (view === "reporting") return "Reporting";
    if (view === "project:team") return "Team";
    if (view.startsWith("project:")) { const p = store.projects.find(x => "project:" + x.id === view); return p ? p.name : "Project"; }
    return "Tasks";
  };

  const showToolbar = ["today", "inbox", "filters", "project:team"].includes(view) || view.startsWith("project:");
  const effGroup = view === "project:team" ? "assignee" : groupBy;
  // when inside a user project, new tasks default into it
  const curProject = (view.startsWith("project:") && view !== "project:team") ? view.slice(8) : null;

  const renderBody = () => {
    if (view === "today") return <TwsToday tasks={applySearch(mine)} viewMode={viewMode} groupBy={groupBy} today={today} store={store} />;
    if (view === "upcoming") return <TwsUpcoming tasks={applySearch(mine)} today={today} store={store} />;
    if (view === "calendar") return <TwsCalendar tasks={applySearch(mine)} today={today} />;
    if (view === "reporting") return <TwsReporting role={role} today={today} store={store} setScreen={setScreen} />;
    if (view === "inbox") {
      const list = applySearch(mineRich.filter(t => t.status !== "done" && !t.projectId && !t.client));
      return <TwsGroups groups={twsGroup(list, groupBy, today)} viewMode={viewMode} store={store} groupBy={groupBy} emptyMsg="Inbox zero — no loose personal tasks." />;
    }
    if (view === "filters") {
      const list = applySearch(mine.filter(t => t.status !== "done"));
      return <TwsGroups groups={twsGroup(list, groupBy, today)} viewMode={viewMode} store={store} groupBy={groupBy} />;
    }
    if (view === "project:team") {
      const list = applySearch(everyone.filter(t => t.status !== "done"));
      return <TwsGroups groups={twsGroup(list, "assignee", today)} viewMode={viewMode} store={store} groupBy="assignee" emptyMsg="No open tasks across the team." />;
    }
    if (view.startsWith("project:")) {
      const pid = view.slice(8);
      const list = applySearch(store.tasks.filter(t => t.projectId === pid && (isAdmin || t.assignee === role.id || (t.watchers || []).includes(role.id))));
      return <TwsGroups groups={twsGroup(list, groupBy, today)} viewMode={viewMode} store={store} groupBy={groupBy} emptyMsg="No tasks in this project yet — add one with “Add task”." />;
    }
    return null;
  };

  return (
    <div className="t6-ws">
      <TaskSubNav role={role} view={view} setView={setView} counts={counts} store={store} search={search} setSearch={setSearch} />
      <div className="t6-ws-main">
        <div className="t6-ws-head">
          <h1 className="t6-ws-title">{titleFor()}</h1>
          <div className="sp" style={{ flex: 1 }} />
          {showToolbar && view !== "project:team" && (
            <div className="seg sm">
              {TWS_GROUPS.map(g => <button key={g.id} className={effGroup === g.id ? "on" : ""} onClick={() => setGroupBy(g.id)}>{g.label}</button>)}
            </div>
          )}
          {(showToolbar || view === "upcoming") && (
            <div className="seg sm">
              <button className={viewMode === "list" ? "on" : ""} onClick={() => setViewMode("list")} title="List"><Icon k="board" className="ic sm" /></button>
              <button className={viewMode === "board" ? "on" : ""} onClick={() => setViewMode("board")} title="Board"><Icon k="catalog" className="ic sm" /></button>
            </div>
          )}
          <button className="btn sm" onClick={() => window.openNewTask?.(curProject ? { projectId: curProject } : undefined)}><Icon k="plus" className="ic sm" />New task</button>
        </div>
        <div className="t6-ws-tools">
          <TenMinBanner role={role} />
          <QuickAddBar role={role} defaultProject={curProject} />
        </div>
        <div className="t6-ws-body">{renderBody()}</div>
      </div>
    </div>
  );
}

Object.assign(window, { TasksWorkspace, TaskSubNav, TwsGroups });
