/* My Tasks · Notifications · Client Reviews */

function TasksScreen({ role }) {
  const store = useStore();
  const { TASKS_EXTRA, userMap, ONB_CARDS, ACT_CARDS, ONBOARD_STAGES, ACTIVE_STAGES } = window.PPC;
  const [filter, setFilter] = React.useState("today");
  const [group, setGroup] = React.useState("priority");

  // Rich store tasks visible to this role
  const richTasks = store.tasks.filter(t => t.assignee === role.id || t.watchers?.includes(role.id) || ["jaydeep","dhaval","vihar"].includes(role.id));

  // Auto-generated from pipeline (where stage owner == role) — kept as before but mapped to detail-shape lookalike
  const auto = [];
  const all = [
    ...ONB_CARDS.map(c => ({ ...c, kind: "onb" })),
    ...ACT_CARDS.map(c => ({ ...c, kind: "act" }))
  ];
  all.forEach(c => {
    const stages = c.kind === "onb" ? ONBOARD_STAGES[c.service] : ACTIVE_STAGES[c.service];
    const st = stages.find(s => s.id === c.stage);
    if (!st) return;
    let assignedTo = null;
    if (st.type === "designer") assignedTo = c.designer;
    else if (st.type === "client") return;
    else if (Array.isArray(st.owner)) assignedTo = st.owner.filter(o => o !== "client")[0];
    else assignedTo = c.override || st.owner;

    if (assignedTo === role.id || ["jaydeep","dhaval","vihar"].includes(role.id)) {
      auto.push({
        id: `auto-${c.id}`,
        assignee: assignedTo,
        title: `${st.name} — ${c.name}`,
        client: c.name, service: c.service,
        due: c.days >= 4 ? "Overdue" : "Today",
        priority: c.days >= 5 ? "high" : c.days >= 3 ? "med" : "low",
        status: "open",
        kind: "auto",
        stage: st.name,
        autoCardId: c.id
      });
    }
  });

  const tasks = [...richTasks, ...auto];

  const filtered = tasks.filter(t => {
    if (filter === "today") return t.status !== "done" && (t.due === "Today" || t.due === "Overdue");
    if (filter === "open")  return t.status !== "done";
    if (filter === "done")  return t.status === "done";
    return true;
  });

  const openRich = (t) => {
    if (t.kind === "auto") {
      // auto tasks open the related CLIENT, not a task panel
      window.openClientPanel?.(t.autoCardId);
    } else {
      window.openTaskPanel?.(t.id);
    }
  };
  const toggle = (t) => {
    if (t.kind === "auto") return;
    store.toggleTaskDone(t.id);
  };

  // group
  const groups = {};
  filtered.forEach(t => {
    let k;
    if (group === "priority") k = t.priority === "high" ? "High priority" : t.priority === "med" ? "Today" : "Later";
    else if (group === "client") k = t.client || "Other";
    else if (group === "service") k = t.service === "sales" ? "Sales" : (t.service || "Other").toUpperCase();
    else if (group === "duration") { const b = t.timeEstimateMin != null ? window.PPC.bucketFor(t.timeEstimateMin) : null; k = b ? b.label : "No estimate"; }
    groups[k] = groups[k] || [];
    groups[k].push(t);
  });
  const durOrder = [...window.PPC.DURATION_BUCKETS.map(b => b.label), "No estimate"];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">For {role.name.split(" ")[0]}</div>
          <h1 className="page-title"><em>Today,</em> in focus.</h1>
          <div className="page-sub">
            Tasks are auto-created when a card lands in your stage. You can also create manual tasks with description, links, subtasks, watchers — click any row to open the full task view.
          </div>
        </div>
        <div className="row gap-2">
          <div className="seg">
            <button className={filter === "today" ? "on" : ""} onClick={() => setFilter("today")}>Today · {tasks.filter(t=>t.status!=="done" && (t.due==="Today"||t.due==="Overdue")).length}</button>
            <button className={filter === "open"  ? "on" : ""} onClick={() => setFilter("open")}>Open · {tasks.filter(t=>t.status!=="done").length}</button>
            <button className={filter === "done"  ? "on" : ""} onClick={() => setFilter("done")}>Done · {tasks.filter(t=>t.status==="done").length}</button>
          </div>
        </div>
      </div>

      <TenMinBanner role={role} />
      <QuickAddBar role={role} />

      <div className="toolbar">
        <span className="muted" style={{ fontSize: 12.5 }}>Group by</span>
        <div className="seg">
          <button className={group === "priority" ? "on" : ""} onClick={() => setGroup("priority")}>Priority</button>
          <button className={group === "duration" ? "on" : ""} onClick={() => setGroup("duration")}>Duration</button>
          <button className={group === "client"   ? "on" : ""} onClick={() => setGroup("client")}>Client</button>
          <button className={group === "service"  ? "on" : ""} onClick={() => setGroup("service")}>Service</button>
        </div>
        <div className="sp" />
        <button className="btn" onClick={() => window.openNewTask?.()}><Icon k="plus" />New task</button>
      </div>

      {group === "duration" ? (
        /* Todoist-style board — one column per duration bucket */
        <div className="t6-board">
          {durOrder.filter(k => groups[k]?.length).map(k => (
            <div key={k} className="t6-col">
              <div className="t6-col-head">
                <span className="section-title">{k}</span>
                <span className="muted mono" style={{ fontSize: 12.5 }}>{groups[k].length}</span>
              </div>
              <div className="t6-col-body">
                {groups[k].map(t => (
                  <TaskCard key={t.id} task={t} onToggle={() => toggle(t)} onOpen={() => openRich(t)} userMap={userMap} />
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groups).length === 0 && <div className="empty">Inbox zero — nothing on your plate.</div>}
        </div>
      ) : (
      <div className="col gap-4">
        {Object.entries(groups).map(([g, items]) => (
          <div key={g} className="widget" style={{ padding: 0 }}>
            <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
              <span className="section-title" style={{ flex: 1 }}>{g}</span>
              <span className="muted mono" style={{ fontSize: 12.5 }}>{items.length}</span>
            </div>
            <div>
              {items.map(t => (
                <TaskRow key={t.id} task={t} onToggle={() => toggle(t)} onOpen={() => openRich(t)} userMap={userMap} />
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groups).length === 0 && (
          <div className="empty">Inbox zero — nothing on your plate.</div>
        )}

        {/* Pull-ahead — bandwidth available, can start next month early */}
        <PullAheadSection role={role} />
      </div>
      )}
    </div>
  );
}

/* Pull-ahead — shows next-month / month-+2 work the user can start early if they have bandwidth */
function PullAheadSection({ role }) {
  const { CONTENT_PLANS, userMap, CAPACITY, monthLabel } = window.PPC;
  if (!["rayu","aadil","vanshika","jaydeep","dhaval","vihar"].includes(role.id)) return null;
  const cap = CAPACITY[role.id];
  const hasBandwidth = cap && cap.hours < cap.max;

  // For editors: list briefed/in-production deliverables in NEXT and PLUS_TWO months assigned to them
  // For Vanshika: list clients with no plan yet for PLUS_TWO month
  let items = [];
  if (role.id === "rayu" || role.id === "aadil") {
    CONTENT_PLANS.forEach(p => {
      if (p.month <= "2026-05") return;
      p.deliverables.forEach(d => {
        if (d.assignee === role.id && d.status === "briefed") {
          items.push({
            kind: "deliv", planId: p.id, delivId: d.id,
            client: p.client, month: p.month,
            label: `${d.type === "reel" ? "🎬" : "🖼"} ${d.title}`,
            sub: `${monthLabel(p.month)} · ${d.timeBudget}h budget`
          });
        }
      });
    });
  } else if (role.id === "vanshika" || ["jaydeep","dhaval","vihar"].includes(role.id)) {
    // suggest Jul plans where calendar isn't started
    const julPlans = CONTENT_PLANS.filter(p => p.month === "2026-07");
    const julClients = julPlans.map(p => p.client);
    const allSMM = Object.keys(window.PPC.SMM_QUOTAS);
    allSMM.forEach(c => {
      const has = julPlans.find(p => p.client === c);
      if (!has) {
        items.push({ kind: "no-plan", client: c, month: "2026-07",
          label: `Start ${c} — July plan`, sub: "Calendar not drafted yet · pull ahead" });
      } else if (has.status === "calendar-draft" || has.status === "calendar-pending") {
        items.push({ kind: "advance", client: c, planId: has.id, month: "2026-07",
          label: `${c} — finish July calendar`, sub: window.PPC.planLabel(has.status) });
      }
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="widget" style={{ padding: 0, borderColor: hasBandwidth ? "var(--ok)" : "var(--line)" }}>
      <div className="row" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", background: hasBandwidth ? "var(--ok-tint)" : "var(--card-2)" }}>
        <div className="col" style={{ flex: 1 }}>
          <span className="section-title" style={{ color: hasBandwidth ? "var(--ok)" : "var(--ink)" }}>
            Pull ahead {hasBandwidth ? "— you have bandwidth" : ""}
          </span>
          <span className="muted" style={{ fontSize: 12.5 }}>
            {role.id === "rayu" || role.id === "aadil"
              ? `Next-month pieces you can start early. Editors should aim to finish ${monthLabel("2026-06")} early and pull ${monthLabel("2026-07")}.`
              : `Clients without a July plan yet — calendars should be drafted by mid-month.`}
          </span>
        </div>
        {cap && <Pill kind={hasBandwidth ? "ok" : "warn"}>{cap.hours}/{cap.max}h this week</Pill>}
      </div>
      <div>
        {items.slice(0, 6).map((it, i) => (
          <div key={i} className="task-row" onClick={() => window.openClientPanel?.(it.client)}>
            <span style={{
              width: 24, height: 24, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent-2)",
              display: "grid", placeItems: "center", fontSize: 12.5
            }}>↗</span>
            <div className="col" style={{ flex: 1 }}>
              <span style={{ fontSize: 13.5 }}>{it.label}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>{it.client} · {it.sub}</span>
            </div>
            <Pill kind="outline">{monthLabel(it.month)}</Pill>
            <button className="btn sm">Pull</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Inline timer button (start/stop) — shared by row + card. Hidden for auto tasks. */
function TaskTimerBtn({ task }) {
  if (task.kind === "auto") return null;
  const store = window.PPC.store;
  const running = !!task.timerStartedAt;
  return running
    ? <button className="btn sm" title="Stop timer" onClick={(e) => { e.stopPropagation(); store.stopTaskTimer(task.id); window.toast?.("Timer stopped", { icon: "■" }); }}>■</button>
    : <button className="btn sm ghost" title="Start timer" onClick={(e) => { e.stopPropagation(); store.startTaskTimer(task.id); window.toast?.("Timer started", { icon: "▶" }); }}>▶</button>;
}

/* shared bits for enriched cards/rows */
function taskSvcBadge(task) {
  if (!task.service) return null;
  return <span className={`t6-svc svc-${task.service}`}>{task.service.toUpperCase()}</span>;
}
function taskDeadlineLabel(task) {
  return task.deadlineISO && window.PPC.isoToDueLabel ? window.PPC.isoToDueLabel(task.deadlineISO) : null;
}
function taskDueText(task) {
  if (!task.due) return null;
  return task.due + (task.dueTime && window.PPC.fmtTime12 ? " · " + window.PPC.fmtTime12(task.dueTime) : "");
}

function TaskRow({ task, onToggle, onOpen, userMap, onMenu }) {
  const tones = { high: "danger", med: "warn", low: "outline" };
  const u = userMap[task.assignee];
  const isDone = task.status === "done";
  const subN = task.checklist?.length || 0, subD = task.checklist?.filter(c => c.done).length || 0;
  const bucket = task.timeEstimateMin != null && window.PPC.bucketFor ? window.PPC.bucketFor(task.timeEstimateMin) : null;
  const running = !!task.timerStartedAt;
  const dl = taskDeadlineLabel(task);
  const overdue = task.due === "Overdue";
  return (
    <div className={`task-row prio-${task.priority || "low"} ${isDone ? "is-done" : ""}`} onClick={onOpen}
      onContextMenu={onMenu && task.kind !== "auto" ? (e) => onMenu(e) : undefined}>
      <span className={`check ${isDone ? "done" : ""}`} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
        {isDone && <Icon k="check" className="ic sm" />}
      </span>
      <div className="col" style={{ flex: 1, minWidth: 0 }}>
        <span className="t6-row-title" style={{ textDecoration: isDone ? "line-through" : "none", color: isDone ? "var(--ink-3)" : "var(--ink)" }}>{task.title}</span>
        <span className="t6-row-meta">
          {task.client && <span className="t6-card-client"><Icon k="user" className="ic sm" />{task.client}</span>}
          {taskSvcBadge(task)}
          {(task.labels || []).slice(0, 3).map(l => <span key={l} className="t6-row-lbl">#{l}</span>)}
          {subN > 0 && <span>☑ {subD}/{subN}</span>}
          {(task.comments?.length || 0) > 0 && <span>💬 {task.comments.length}</span>}
        </span>
      </div>
      {running && <Pill kind="accent" dot>rec</Pill>}
      {dl && <Pill kind="danger"><Icon k="flag" className="ic sm" />{dl}</Pill>}
      {bucket && <Pill kind="outline"><Icon k="clock" className="ic sm" />{bucket.label}</Pill>}
      <TaskTimerBtn task={task} />
      {overdue && <Pill kind="danger" dot>Overdue</Pill>}
      {task.due && !overdue && <Pill kind="outline">{taskDueText(task)}</Pill>}
      <Pill kind={tones[task.priority] || "outline"}>{task.priority}</Pill>
      <Avatar user={u} size="sm" />
      {onMenu && task.kind !== "auto" && <button className="t6-card-menu" title="Task actions" onClick={(e) => { e.stopPropagation(); onMenu(e); }}>⋯</button>}
    </div>
  );
}

/* Card form of a task — used by the board (Todoist-style columns) */
function TaskCard({ task, onToggle, onOpen, userMap, onMenu }) {
  const u = userMap[task.assignee];
  const isDone = task.status === "done";
  const running = !!task.timerStartedAt;
  const spent = task.timeSpentMin || 0;
  const bucket = task.timeEstimateMin != null && window.PPC.bucketFor ? window.PPC.bucketFor(task.timeEstimateMin) : null;
  const subN = task.checklist?.length || 0, subD = task.checklist?.filter(c => c.done).length || 0;
  const dl = taskDeadlineLabel(task);
  const overdue = task.due === "Overdue";
  return (
    <div className={`t6-card prio-${task.priority || "low"} ${isDone ? "is-done" : ""}`} onClick={onOpen}
      onContextMenu={onMenu && task.kind !== "auto" ? (e) => onMenu(e) : undefined}>
      <div className="t6-card-top">
        <span className={`check ${isDone ? "done" : ""}`} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          {isDone && <Icon k="check" className="ic sm" />}
        </span>
        <span className="t6-card-title">{task.title}</span>
        {onMenu && task.kind !== "auto" && <button className="t6-card-menu" title="Task actions" onClick={(e) => { e.stopPropagation(); onMenu(e); }}>⋯</button>}
        <Avatar user={u} size="sm" />
      </div>
      <div className="t6-card-pills">
        {task.due && <Pill kind={overdue ? "danger" : "outline"} dot={overdue}><Icon k="clock" className="ic sm" />{taskDueText(task)}</Pill>}
        {dl && <Pill kind="danger"><Icon k="flag" className="ic sm" />{dl}</Pill>}
        {bucket && <Pill kind="ok"><Icon k="clock" className="ic sm" />{bucket.label}</Pill>}
        {(task.labels || []).slice(0, 3).map(l => <Pill key={l} kind="outline">#{l}</Pill>)}
        {running && <Pill kind="accent" dot>rec</Pill>}
      </div>
      {subN > 0 && (
        <div className="t6-card-prog">
          <div className="t6-card-prog-bar"><span style={{ width: Math.round((subD / subN) * 100) + "%" }} /></div>
          <span className="t6-card-prog-txt">{subD}/{subN}</span>
        </div>
      )}
      <div className="t6-card-foot">
        {task.client && <span className="t6-card-client"><Icon k="user" className="ic sm" />{task.client}</span>}
        {taskSvcBadge(task)}
        <span style={{ flex: 1 }} />
        {spent > 0 && <span className="muted mono" style={{ fontSize: 11.5 }}>{fmtDur(spent)}</span>}
        <TaskTimerBtn task={task} />
      </div>
    </div>
  );
}

/* Notifications — upgraded in Phase 3:
   - Grouped by client (then FYI / system)
   - Mark-read persists across reloads via localStorage
   - Daily 8am digest toggle (mock email preview)
   - Smart digest summary at the top */
function NotificationsScreen({ role }) {
  const { NOTIFS, PROFILES_RICH } = window.PPC;

  /* Persistent read-set lives in localStorage so a mark-read survives reload. */
  const [readSet, setReadSet] = React.useState(() => window.PPC.loadReadSet());
  const [digest, setDigest]   = React.useState(() => window.PPC.loadDigestPrefs());
  const [digestPreview, setDigestPreview] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState({});

  /* Merge persistent reads into the live list */
  const visible = NOTIFS
    .filter(n => n.to === role.id || ["jaydeep","dhaval","vihar"].includes(role.id))
    .map(n => ({ ...n, read: n.read || readSet.has(n.id) }));

  const unread = visible.filter(n => !n.read);

  const persistRead = (idsToAdd) => {
    const next = new Set(readSet);
    idsToAdd.forEach(id => next.add(id));
    window.PPC.saveReadSet(next);
    setReadSet(next);
  };

  const markAll  = () => persistRead(visible.map(n => n.id));
  const markGroup = (notifs) => persistRead(notifs.map(n => n.id));
  const markOne  = (id) => persistRead([id]);

  const iconFor = (t) => ({
    assign: "user", designer: "user", stuck: "clock",
    flag: "flag", review: "star", system: "bolt", lead: "funnel"
  })[t] || "bell";

  /* Group by client (or FYI / System) */
  const { groups, order } = window.PPC.groupNotifsByClient(visible);

  /* Smart digest summary */
  const summary = React.useMemo(() => {
    const u = unread.length;
    if (u === 0) return null;
    const clientGroups = order.filter(k => k !== "FYI" && groups[k].some(n => !n.read));
    const fyiUnread = (groups["FYI"] || []).filter(n => !n.read).length;
    const top3 = clientGroups.slice(0, 3);
    return { u, clientGroups, fyiUnread, top3 };
  }, [unread.length, order, groups]);

  const toggleDigest = (enabled) => {
    const next = { ...digest, enabled };
    window.PPC.saveDigestPrefs(next);
    setDigest(next);
    window.toast?.(enabled ? `Daily digest on · ${digest.time}` : "Daily digest off", { icon: enabled ? "✉" : "×" });
  };
  const setDigestTime = (time) => {
    const next = { ...digest, time };
    window.PPC.saveDigestPrefs(next);
    setDigest(next);
  };

  const focusClient = (name) => {
    if (PROFILES_RICH[name]) window.openClientPanel?.(name);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Activity feed · Phase 3 upgrade</div>
          <h1 className="page-title"><em>Notifications</em></h1>
          <div className="page-sub">Grouped by client. Mark-read persists. Flip on the daily digest to get a 8am roll-up email.</div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={() => setDigestPreview(true)}><Icon k="doc" />Preview digest</button>
          <button className="btn ghost" onClick={markAll}><Icon k="check" />Mark all read</button>
        </div>
      </div>

      {/* Smart digest summary */}
      {summary && (
        <div className="card" style={{ padding: "14px 18px", marginBottom: 14, background: "var(--card-2)", borderColor: "var(--line-strong)" }}>
          <div className="row gap-3" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--ink)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
              <Icon k="sparkle" />
            </div>
            <div className="col" style={{ flex: 1, minWidth: 220 }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 500, letterSpacing: "-.01em" }}>
                You have <em style={{ color: "var(--accent)" }}>{summary.u} unread</em> across {summary.clientGroups.length} client{summary.clientGroups.length === 1 ? "" : "s"}{summary.fyiUnread > 0 ? ` and ${summary.fyiUnread} FYI` : ""}.
              </span>
              <span className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                Top to look at: {summary.top3.map((c, i) => (
                  <React.Fragment key={c}>
                    {i > 0 && " · "}
                    <span
                      style={{ color: "var(--accent)", cursor: PROFILES_RICH[c] ? "pointer" : "default" }}
                      onClick={() => focusClient(c)}
                    >{c}</span>{" "}({groups[c].filter(n => !n.read).length})
                  </React.Fragment>
                ))}
              </span>
            </div>
            <div className="row gap-2">
              <label className="row gap-2" style={{ cursor: "pointer", fontSize: 12.5 }}>
                <input type="checkbox" checked={digest.enabled} onChange={e => toggleDigest(e.target.checked)} />
                <span>Daily digest at</span>
                <select
                  value={digest.time}
                  onChange={e => setDigestTime(e.target.value)}
                  className="select-input"
                  style={{ padding: "3px 6px", fontSize: 12.5, width: "auto" }}
                >
                  {["07:00","08:00","09:00","17:00"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="col gap-3">
        {order.map(key => {
          const list = groups[key];
          if (!list || list.length === 0) return null;
          const groupUnread = list.filter(n => !n.read).length;
          const isClient = !!PROFILES_RICH[key];
          const isCollapsed = collapsed[key];
          return (
            <div key={key} className="widget" style={{ padding: 0 }}>
              <div
                className="row"
                style={{ padding: "12px 16px", borderBottom: isCollapsed ? "0" : "1px solid var(--line)", cursor: "pointer" }}
                onClick={() => setCollapsed(c => ({ ...c, [key]: !c[key] }))}
              >
                <span style={{ fontSize: 12.5, color: "var(--ink-4)", marginRight: 8 }}>{isCollapsed ? "▸" : "▾"}</span>
                <span className="section-title" style={{ flex: 1 }}>
                  {isClient
                    ? <span style={{ color: "var(--accent)" }} onClick={(e) => { e.stopPropagation(); focusClient(key); }}>{key}</span>
                    : key}
                </span>
                {groupUnread > 0 && (
                  <span className="pill accent" style={{ marginRight: 8 }}>
                    <span className="dot" />{groupUnread} new
                  </span>
                )}
                <span className="muted mono" style={{ fontSize: 12.5, marginRight: 8 }}>{list.length}</span>
                {groupUnread > 0 && (
                  <button
                    className="btn ghost sm"
                    onClick={(e) => { e.stopPropagation(); markGroup(list); }}
                    title="Mark group read"
                  >
                    <Icon k="check" className="ic sm" />
                  </button>
                )}
              </div>
              {!isCollapsed && list.map(n => (
                <div key={n.id}
                  onClick={() => {
                    markOne(n.id);
                    if (n.ref && (n.ref.startsWith("c-") || n.ref.startsWith("a-"))) window.openClientPanel(n.ref);
                  }}
                  className="row gap-3"
                  style={{
                    padding: "11px 16px",
                    borderBottom: "1px dashed var(--line-2)",
                    background: n.read ? "transparent" : "var(--card-2)",
                    cursor: "pointer"
                  }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: n.read ? "transparent" : "var(--accent-tint)",
                    color: n.read ? "var(--ink-4)" : "var(--accent-2)",
                    display: "grid", placeItems: "center",
                    border: n.read ? "1px solid var(--line)" : "none"
                  }}>
                    <Icon k={iconFor(n.type)} />
                  </div>
                  <div className="col" style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: n.read ? 400 : 500 }}>{n.text}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>{n.time}</span>
                  </div>
                  {!n.read && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)" }} />}
                </div>
              ))}
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="empty">Inbox zero — nothing new.</div>
        )}
      </div>

      {digestPreview && (
        <DigestPreviewModal
          notifs={visible}
          groups={groups}
          order={order}
          digest={digest}
          role={role}
          onClose={() => setDigestPreview(false)}
        />
      )}
    </div>
  );
}

/* Mock email preview of "what would arrive in your inbox at 8am" */
function DigestPreviewModal({ notifs, groups, order, digest, role, onClose }) {
  const unread = notifs.filter(n => !n.read);
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const clientGroups = order.filter(k => k !== "FYI" && k !== "System").slice(0, 5);
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="modal-head">
          <div className="col" style={{ flex: 1 }}>
            <span className="page-eyebrow" style={{ marginBottom: 0 }}>Daily digest preview</span>
            <div style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 500, letterSpacing: "-.015em" }}>
              {digest.enabled
                ? <>Sent every day at <em>{digest.time}</em></>
                : <>Off — turn on in the banner to enable</>}
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>
        <div className="modal-body">
          {/* Mock email body */}
          <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 16, background: "var(--card-2)" }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginBottom: 8 }}>
              <div>From: PPC Guru &lt;digest@ppcguru.com&gt;</div>
              <div>To: {role.name} &lt;{role.id}@ppcguru.com&gt;</div>
              <div>Subject: Your morning at PPC Guru · {todayLabel}</div>
            </div>
            <hr className="hr" />
            <div style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", marginBottom: 4 }}>
              Good morning, {role.name.split(" ")[0]}.
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "8px 0 14px" }}>
              You have <strong>{unread.length} unread</strong> notification{unread.length === 1 ? "" : "s"} across {clientGroups.length} client{clientGroups.length === 1 ? "" : "s"}. Here's what needs you today.
            </p>
            <div className="col gap-2">
              {clientGroups.map(c => {
                const items = groups[c].filter(n => !n.read);
                if (items.length === 0) return null;
                return (
                  <div key={c} style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--card)" }}>
                    <div style={{ fontWeight: 500, fontSize: 13.5, color: "var(--accent)" }}>{c}</div>
                    <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
                      {items.slice(0, 3).map(n => <li key={n.id}>{n.text}</li>)}
                    </ul>
                  </div>
                );
              })}
              {(groups["FYI"] || []).filter(n => !n.read).length > 0 && (
                <div style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--card)" }}>
                  <div style={{ fontWeight: 500, fontSize: 13.5, color: "var(--ink-3)" }}>FYI</div>
                  <ul style={{ margin: "4px 0 0 14px", padding: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
                    {(groups["FYI"] || []).filter(n => !n.read).slice(0, 3).map(n => <li key={n.id}>{n.text}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <p style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 14 }}>
              Open the app to triage, or mark all read here.
            </p>
          </div>
        </div>
        <div className="modal-foot">
          <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>Mocked — no email is actually sent.</span>
          <button className="btn primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}

/* Client Reviews */
function ReviewsScreen({ role }) {
  const { REVIEWS } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];
  const [sort, setSort] = React.useState("due");

  const sorted = [...REVIEWS].sort((a, b) => {
    if (sort === "risk") {
      const order = { danger: 0, warn: 1, ok: 2 };
      return order[a.health] - order[b.health];
    }
    if (sort === "value" && access.money) return b.mrr - a.mrr;
    // by due
    return a.due.localeCompare(b.due);
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Once-monthly cadence · non-blocking</div>
          <h1 className="page-title">Client <em>Reviews</em></h1>
          <div className="page-sub">
            Every live client gets a monthly review. Health flags help prioritize — green is on-track, amber needs attention, red is overdue or at risk.
          </div>
        </div>
        <button className="btn"><Icon k="plus" />Schedule review</button>
      </div>

      <div className="toolbar">
        <span className="muted" style={{ fontSize: 12.5 }}>Sort by</span>
        <div className="seg">
          <button className={sort === "due"   ? "on" : ""} onClick={() => setSort("due")}>Due</button>
          <button className={sort === "risk"  ? "on" : ""} onClick={() => setSort("risk")}>Risk</button>
          {access.money && <button className={sort === "value" ? "on" : ""} onClick={() => setSort("value")}>Value</button>}
        </div>
        <div className="sp" />
        <div className="row gap-3" style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
          <span className="row gap-2"><span className="dot-ok" /> {REVIEWS.filter(r=>r.health==="ok").length} healthy</span>
          <span className="row gap-2"><span className="dot-warn" /> {REVIEWS.filter(r=>r.health==="warn").length} watch</span>
          <span className="row gap-2"><span className="dot-danger" /> {REVIEWS.filter(r=>r.health==="danger").length} overdue</span>
        </div>
      </div>

      <div className="widget" style={{ padding: 0 }}>
        <table className="t">
          <thead>
            <tr>
              <th>Health</th>
              <th>Client</th>
              <th>Service</th>
              {access.money && <th>MRR</th>}
              <th>Last review</th>
              <th>Next due</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => (
              <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => window.openClientPanel(r.client)}>
                <td><span className={`dot-${r.health}`} title={r.health} /></td>
                <td>
                  <div className="row gap-2">
                    <span style={{ fontWeight: 500, color: "var(--accent)" }}>{r.client}</span>
                    {r.concentration && <Pill kind="warn">anchor</Pill>}
                  </div>
                </td>
                <td><Pill kind="outline">{r.service.toUpperCase()}</Pill></td>
                {access.money && <td className="mono">{fmtMoney(r.mrr, r.currency)}</td>}
                <td className="muted" style={{ fontSize: 12.5 }}>{r.last}</td>
                <td>
                  {r.health === "danger"
                    ? <Pill kind="danger" dot>{r.due} (overdue)</Pill>
                    : r.health === "warn"
                      ? <Pill kind="warn">{r.due}</Pill>
                      : <Pill kind="outline">{r.due}</Pill>}
                </td>
                <td className="muted" style={{ fontSize: 12.5 }}>{r.note || "—"}</td>
                <td><button className="btn sm" onClick={(e) => { e.stopPropagation(); window.openClientPanel(r.client); }}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { TasksScreen, NotificationsScreen, ReviewsScreen, TaskCard, TaskRow, TaskTimerBtn, PullAheadSection });
