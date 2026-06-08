/* ─────────────────────────────────────────────────────────────────
   TaskDetailPanel + NewTaskModal — the rich task system.
   Opened via window.openTaskPanel(id), window.openNewTask(defaults).
   ───────────────────────────────────────────────────────────────── */

/* Centered, minimal Todoist-style task modal (main column + right rail). */
function TaskDetailPanel({ taskId, role, onClose }) {
  const store = useStore();
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!taskId) return null;
  const task = store.tasks.find(t => t.id === taskId);
  if (!task) return null;
  const proj = (store.projects || []).find(p => p.id === task.projectId);
  const isDone = task.status === "done";

  return (
    <>
      <div className="t6-tm-scrim" onClick={onClose} />
      <div className="t6-tm" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="t6-tm-top">
          <span className="t6-tm-crumb">
            {proj ? <span style={{ color: proj.color, fontWeight: 700 }}>#</span> : <Icon k="inbox" className="ic sm" />}
            {proj ? proj.name : (task.client || "Inbox")}
          </span>
          <span style={{ flex: 1 }} />
          <button className="btn ghost sm" title="Copy link" onClick={() => { try { navigator.clipboard && navigator.clipboard.writeText(location.origin + location.pathname + "#task-" + task.id); } catch (e) {} window.toast?.("Link copied", { icon: "🔗" }); }}><Icon k="link" className="ic sm" /></button>
          <button className="btn ghost sm" title="Close" onClick={onClose}><Icon k="close" className="ic sm" /></button>
        </div>
        <div className="t6-tm-body">
          <div className="t6-tm-main">
            <div className="t6-tm-titlerow">
              <span className={`check ${isDone ? "done" : ""}`} onClick={() => store.toggleTaskDone(task.id)}>{isDone && <Icon k="check" className="ic sm" />}</span>
              <input className={`t6-tm-title ${isDone ? "done" : ""}`} value={task.title} placeholder="Task name"
                onChange={e => store.updateTask(task.id, { title: e.target.value })} />
            </div>
            <TaskBody task={task} role={role} />
          </div>
          <aside className="t6-tm-rail">
            <TaskModalRail task={task} role={role} />
          </aside>
        </div>
      </div>
    </>
  );
}

/* Right rail — Project · Assignee · Date · Deadline · Priority · Labels · Reminders */
function TaskModalRail({ task, role }) {
  const { store, userMap, USERS, isoToDueLabel, shiftDate, realToday } = window.PPC;
  const [labelDraft, setLabelDraft] = React.useState("");
  const addLabel = () => {
    const l = labelDraft.trim().replace(/^#/, "");
    if (!l) return;
    const labels = Array.from(new Set([...(task.labels || []), l]));
    store.updateTask(task.id, { labels }); setLabelDraft("");
  };
  const removeLabel = (l) => store.updateTask(task.id, { labels: (task.labels || []).filter(x => x !== l) });
  const setDue = (v) => {
    if (!v) { store.updateTask(task.id, { due: "No date", dueISO: null, dueTime: null }); return; }
    const [iso, time] = v.split("T");
    store.updateTask(task.id, { dueISO: iso, due: (isoToDueLabel && isoToDueLabel(iso)) || iso, dueTime: time || "09:00" });
  };
  const setDeadline = (v) => {
    if (!v) { store.updateTask(task.id, { deadlineISO: null, deadlineTime: null }); return; }
    const [iso, time] = v.split("T");
    store.updateTask(task.id, { deadlineISO: iso, deadlineTime: time || "17:00" });
  };
  const [newReminder, setNewReminder] = React.useState("");
  const addReminder = () => { const r = newReminder.trim(); if (!r) return; store.updateTask(task.id, { reminders: [...(task.reminders || []), r] }); setNewReminder(""); };
  const removeReminder = (i) => store.updateTask(task.id, { reminders: (task.reminders || []).filter((_, x) => x !== i) });
  const addWatcher = (id) => { if (!id) return; store.updateTask(task.id, { watchers: Array.from(new Set([...(task.watchers || []), id])) }); };
  const removeWatcher = (id) => store.updateTask(task.id, { watchers: (task.watchers || []).filter(x => x !== id) });

  return (
    <div className="t6-tm-railinner">
      <div className="field-label">Project</div>
      <SelectInput value={task.projectId || ""} onChange={(e) => store.setTaskProject(task.id, e.target.value || null)}>
        <option value="">Inbox (no project)</option>
        {(store.projects || []).filter(p => !p.system).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </SelectInput>

      <div className="field-label">Assignee</div>
      <UserSelect value={task.assignee} onChange={(id) => store.updateTask(task.id, { assignee: id })} />

      <div className="field-label">Date</div>
      <input type="datetime-local" className="t6-rail-date" value={task.dueISO ? `${task.dueISO}T${task.dueTime || "09:00"}` : ""} onChange={(e) => setDue(e.target.value)} />

      <div className="field-label">Deadline</div>
      <input type="datetime-local" className="t6-rail-date" value={task.deadlineISO ? `${task.deadlineISO}T${task.deadlineTime || "17:00"}` : ""} onChange={(e) => setDeadline(e.target.value)} />

      <div className="field-label">Priority</div>
      <SelectInput value={task.priority} onChange={(e) => store.updateTask(task.id, { priority: e.target.value })}>
        <option value="high">P1 · High</option>
        <option value="med">P2 · Medium</option>
        <option value="low">P3 · Low</option>
      </SelectInput>

      <div className="field-label">Labels</div>
      <div className="row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {(task.labels || []).map(l => <span key={l} className="pill outline">#{l} <span style={{ cursor: "pointer", marginLeft: 2 }} onClick={() => removeLabel(l)}>×</span></span>)}
        {(task.labels || []).length === 0 && <span className="muted" style={{ fontSize: 12 }}>None</span>}
      </div>
      <TextInput placeholder="Add label + Enter" value={labelDraft} onChange={e => setLabelDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && addLabel()} />

      <div className="field-label">Watchers</div>
      <div className="row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {(task.watchers || []).map(id => { const wu = userMap[id]; return wu ? <span key={id} className="pill outline"><Avatar user={wu} size="sm" /> {wu.name.split(" ")[0]} <span style={{ cursor: "pointer", marginLeft: 2 }} onClick={() => removeWatcher(id)}>×</span></span> : null; })}
        {(task.watchers || []).length === 0 && <span className="muted" style={{ fontSize: 12 }}>None</span>}
      </div>
      <SelectInput value="" onChange={e => addWatcher(e.target.value)}>
        <option value="">+ Add watcher</option>
        {USERS.filter(u => u.id !== "client" && u.id !== task.assignee && !(task.watchers || []).includes(u.id)).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
      </SelectInput>

      <div className="field-label">Reminders</div>
      <div className="row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {(task.reminders || []).map((r, i) => <span key={i} className="pill warn">🔔 {r} <span style={{ cursor: "pointer", marginLeft: 2 }} onClick={() => removeReminder(i)}>×</span></span>)}
        {(task.reminders || []).length === 0 && <span className="muted" style={{ fontSize: 12 }}>None</span>}
      </div>
      <TextInput placeholder="e.g. 1 day before + Enter" value={newReminder} onChange={e => setNewReminder(e.target.value)} onKeyDown={e => e.key === "Enter" && addReminder()} />

      <div className="t6-tm-railmeta">Created {task.createdAt} · by {userMap[task.reporter]?.name?.split(" ")[0] || task.reporter || "—"}</div>
    </div>
  );
}

function TaskBody({ task, role }) {
  const { userMap, store } = window.PPC;
  const [descEdit, setDescEdit] = React.useState(false);
  const [descDraft, setDescDraft] = React.useState(task.description || "");
  React.useEffect(() => setDescDraft(task.description || ""), [task.id]);

  const saveDesc = () => { store.updateTask(task.id, { description: descDraft }); setDescEdit(false); window.toast?.("Description updated", { icon: "✓" }); };

  const [newCheck, setNewCheck] = React.useState("");
  const addCheckItem = () => { if (!newCheck.trim()) return; store.addChecklistItem(task.id, newCheck.trim()); setNewCheck(""); };

  const [comment, setComment] = React.useState("");
  const submitComment = () => { if (!comment.trim()) return; store.addComment(task.id, role.id, comment.trim()); setComment(""); };

  const [newLinkLabel, setNewLinkLabel] = React.useState("");
  const [newLinkUrl, setNewLinkUrl] = React.useState("");
  const submitLink = () => {
    if (!newLinkUrl.trim()) return;
    store.addLink(task.id, { label: newLinkLabel.trim() || newLinkUrl.trim(), url: newLinkUrl.trim() });
    setNewLinkLabel(""); setNewLinkUrl("");
  };

  const checkDone = (task.checklist || []).filter(c => c.done).length;
  const checkPct = task.checklist?.length ? Math.round((checkDone / task.checklist.length) * 100) : 0;

  return (
    <div>
      {/* description */}
      <div className="sub-card">
        <div className="row" style={{ marginBottom: 6 }}>
          <span className="sub-card-title" style={{ margin: 0, flex: 1 }}>Description</span>
          {!descEdit && <button className="btn sm ghost" onClick={() => setDescEdit(true)}>Edit</button>}
        </div>
        {descEdit ? (
          <>
            <Textarea value={descDraft} onChange={e => setDescDraft(e.target.value)} style={{ minHeight: 140 }} />
            <div className="row gap-2" style={{ justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn ghost" onClick={() => { setDescDraft(task.description || ""); setDescEdit(false); }}>Cancel</button>
              <button className="btn primary" onClick={saveDesc}>Save</button>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)", whiteSpace: "pre-wrap" }}>
            {task.description || <span className="muted">No description yet — click Edit to add context.</span>}
          </div>
        )}
      </div>

      {/* checklist */}
      <div className="sub-card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="sub-card-title" style={{ margin: 0, flex: 1 }}>
            Subtasks {task.checklist?.length ? `· ${checkDone}/${task.checklist.length}` : ""}
          </span>
          {task.checklist?.length > 0 && (
            <div className="bar" style={{ width: 100 }}>
              <i style={{ width: `${checkPct}%` }} />
            </div>
          )}
        </div>
        {(task.checklist || []).map(c => (
          <div key={c.id} className="checkitem">
            <span className={`check ${c.done ? "done" : ""}`} onClick={() => store.toggleChecklistItem(task.id, c.id)}>
              {c.done && <Icon k="check" className="ic sm" />}
            </span>
            <span className={`txt ${c.done ? "done" : ""}`}>{c.text}</span>
          </div>
        ))}
        <div className="row gap-2" style={{ marginTop: 8 }}>
          <span className="check" style={{ opacity: .4 }} />
          <TextInput placeholder="Add a subtask…" value={newCheck} onChange={e => setNewCheck(e.target.value)} onKeyDown={e => e.key === "Enter" && addCheckItem()} />
          <button className="btn sm" onClick={addCheckItem}>Add</button>
        </div>
      </div>

      {/* time estimate + tracked timer (Phase 6) */}
      <TaskTimeBlock task={task} />

      {/* links */}
      <div className="sub-card">
        <div className="sub-card-title">Links</div>
        {(task.links || []).map((l, i) => (
          <div key={i} className="link-row">
            <Icon k="link" className="ic sm" />
            <a href={"https://" + l.url.replace(/^https?:\/\//, "")} target="_blank" rel="noopener">{l.label}</a>
            <span className="muted-2 mono" style={{ fontSize: 12.5 }}>{l.url}</span>
          </div>
        ))}
        <div className="row gap-2" style={{ marginTop: 6 }}>
          <TextInput placeholder="Label (optional)" value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} style={{ maxWidth: 180 }} />
          <TextInput placeholder="https://…" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && submitLink()} />
          <button className="btn sm" onClick={submitLink}>Add link</button>
        </div>
      </div>

      {/* attachments */}
      <div className="sub-card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="sub-card-title" style={{ margin: 0, flex: 1 }}>Attachments</span>
          <button className="btn sm" onClick={() => window.toast?.("File upload demo — not wired", { icon: "↑" })}>
            <Icon k="plus" className="ic sm" />Upload
          </button>
        </div>
        {(task.attachments || []).length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>None yet.</div>}
        {(task.attachments || []).map((a, i) => (
          <div key={i} className="file-row" style={{ marginBottom: 6 }}>
            <div className={`file-kind ${a.kind}`}>{a.kind}</div>
            <div className="col" style={{ flex: 1 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{a.name}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>{a.size}</span>
            </div>
          </div>
        ))}
      </div>

      {/* comments */}
      <div className="sub-card">
        <div className="sub-card-title">Comments {task.comments?.length ? `· ${task.comments.length}` : ""}</div>
        {(task.comments || []).map((c, i) => {
          const cu = userMap[c.who];
          return (
            <div key={i} className="comment-row">
              {cu ? <Avatar user={cu} size="sm" /> : <span className="avatar sm" style={{ background: "var(--card-2)", color: "var(--ink-4)" }}>{c.who?.slice(0,2).toUpperCase()}</span>}
              <div>
                <div className="comment-bubble">{c.text}</div>
                <span className="muted-2" style={{ fontSize: 12.5, marginTop: 4, display: "block" }}>
                  {cu?.name.split(" ")[0] || c.who} · {c.when}
                </span>
              </div>
            </div>
          );
        })}
        <div className="row gap-2" style={{ marginTop: 10, alignItems: "flex-start" }}>
          <Avatar user={userMap[role.id]} size="sm" />
          <Textarea placeholder={`Comment as ${role.name.split(" ")[0]}…`} value={comment} onChange={e => setComment(e.target.value)} style={{ minHeight: 60 }} />
          <button className="btn primary" onClick={submitComment}>Post</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TaskTimeBlock — duration estimate + start/stop timer (actual tracked).
   This is the differentiator over Todoist (which has no real time tracking).
   ───────────────────────────────────────────────────────────────── */
function TaskTimeBlock({ task }) {
  const { store, bucketFor } = window.PPC;
  const running = !!task.timerStartedAt;
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const h = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(h);
  }, [running]);

  const liveExtra = running ? Math.max(0, Math.round((Date.now() - task.timerStartedAt) / 60000)) : 0;
  const spent = (task.timeSpentMin || 0) + liveExtra;
  const est = task.timeEstimateMin;
  const over = est != null && spent > est;
  const pct = est ? Math.min(100, Math.round((spent / est) * 100)) : 0;
  const b = (est != null && bucketFor) ? bucketFor(est) : null;

  return (
    <div className="sub-card">
      <div className="row" style={{ marginBottom: 8 }}>
        <span className="sub-card-title" style={{ margin: 0, flex: 1 }}>Time</span>
        {b && <Pill kind="outline"><Icon k="clock" className="ic sm" />{b.label} est</Pill>}
      </div>
      <div className="field-label">Estimate</div>
      <DurationPick value={est} onChange={(min) => store.setTaskEstimate(task.id, min)} />
      <div className="t6-timer">
        <div className="col" style={{ flex: 1 }}>
          <div className="row gap-3" style={{ alignItems: "baseline" }}>
            <span className="mono" style={{ fontSize: 20, color: over ? "var(--danger)" : "var(--ink)" }}>{fmtDur(spent)}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>tracked{est != null ? ` of ${fmtDur(est)} est` : ""}</span>
            {running && <Pill kind="accent" dot>recording</Pill>}
            {over && <Pill kind="danger">over estimate</Pill>}
          </div>
          {est != null && <div className="bar" style={{ width: 240, marginTop: 6 }}><i style={{ width: pct + "%", background: over ? "var(--danger)" : undefined }} /></div>}
        </div>
        {running
          ? <button className="btn sm" onClick={() => { store.stopTaskTimer(task.id); window.toast?.("Timer stopped", { icon: "■" }); }}><Icon k="clock" className="ic sm" />Stop timer</button>
          : <button className="btn sm primary" onClick={() => { store.startTaskTimer(task.id); window.toast?.("Timer started", { icon: "▶" }); }}><Icon k="clock" className="ic sm" />Start timer</button>}
      </div>
    </div>
  );
}

/* Merge two parse results — a = Task name (primary), b = Description (fallback).
   Lets the user dictate field info into either field. Title/tokens/segments come
   from the Task name only (that's the field being greyed + cleaned). */
function mergeParsedTD(a, b) {
  b = b || {};
  const u = (x) => Array.from(new Set(x));
  const pref = (k) => (a[k] != null ? a[k] : b[k]);
  return {
    title: a.title, tokens: [...(a.tokens || []), ...(b.tokens || [])], segments: a.segments || [],
    dueISO: a.dueISO != null ? a.dueISO : b.dueISO,
    due: a.dueISO != null ? a.due : b.due,
    dueTime: a.dueTime != null ? a.dueTime : b.dueTime,
    deadlineISO: pref("deadlineISO"), recur: pref("recur"),
    timeEstimateMin: a.timeEstimateMin != null ? a.timeEstimateMin : b.timeEstimateMin,
    priority: pref("priority"), assigneeId: pref("assigneeId"), client: pref("client"),
    services: u([...(a.services || []), ...(b.services || [])]),
    labels: u([...(a.labels || []), ...(b.labels || [])]),
    watchers: u([...(a.watchers || []), ...(b.watchers || [])]),
    reminders: [...(a.reminders || []), ...(b.reminders || [])],
    links: [...(a.links || []), ...(b.links || [])],
    checklist: [...(a.checklist || []), ...(b.checklist || [])],
    description: a.description != null ? a.description : b.description
  };
}

/* token-chip tone per parsed field (matches the quick-add bar) */
const NT_TOKEN_KIND = { date: "accent", time: "accent", deadline: "danger", recur: "accent", priority: "warn", duration: "ok", label: "outline", assignee: "accent", client: "outline", reminder: "warn", service: "ok", link: "outline", watcher: "accent", subtask: "ok", description: "outline" };

/* ─────────────────────────────────────────────────────────────────
   NewTaskModal — create a task with all fields.
   The Title field parses natural language live (date · time · recurring ·
   priority · duration · @label · #client · +assignee · {deadline}) and
   auto-fills every control below; all fields stay manually editable.
   ───────────────────────────────────────────────────────────────── */
/* ── Shared task-composer helpers + TaskFieldZone ──────────────────
   One source of truth for the chip + widget-pill + inline-editor block,
   reused by NewTaskModal (normal AND ramble views) and the QuickAddBar
   so every capture surface shows the SAME widgets. */
const TD_SVC_LABEL = { meta: "Meta", google: "Google", smm: "SMM", influencer: "Influencer", sales: "Sales" };
const TD_SVC_OPTS = [["meta", "Meta"], ["google", "Google"], ["smm", "SMM"], ["influencer", "Influencer"], ["sales", "Sales"]];
const TD_LABEL_CHOICES = ["urgent", "design", "content", "optimization", "blocker", "sales", "work"];
const tdUniq = (a) => Array.from(new Set(a));
const tdRealToday = () => (window.PPC.realToday ? window.PPC.realToday() : window.PPC.TODAY);
const tdClientOptions = () => { const { ONB_CARDS, ACT_CARDS } = window.PPC; return Array.from(new Set([...ONB_CARDS, ...ACT_CARDS].map(c => c.name))).sort(); };

function tdBlankForm(d, role) {
  return {
    title: d?.title || "", description: "",
    assignee: d?.assignee || role.id, watchers: [],
    due: d?.due || "No date", dueISO: d?.dueISO || null, dueTime: d?.dueTime || null,
    priority: d?.priority || "med",
    client: d?.client || "", service: d?.service || "", services: d?.services || [],
    links: d?.links || [], checklist: [], labels: d?.labels || [], reminders: [],
    timeEstimateMin: d?.timeEstimateMin != null ? d.timeEstimateMin : null,
    deadlineISO: d?.deadlineISO || null, deadlineTime: d?.deadlineTime || null, recur: d?.recur || null,
    projectId: d?.projectId || null
  };
}

/* Pure: strip recognized phrases from raw text + merge parsed values into a form (additive). */
function tdMergeParse(f, raw, which, role) {
  const p = window.parseQuickAdd ? window.parseQuickAdd(raw, {}) : { title: raw };
  const n = { ...f };
  if (which === "title") n.title = (p.title != null ? p.title : raw);
  else n.description = raw;
  if (p.assigneeId) n.assignee = p.assigneeId;
  if (p.priority) n.priority = p.priority;
  if (p.timeEstimateMin != null) n.timeEstimateMin = p.timeEstimateMin;
  if (p.deadlineISO) n.deadlineISO = p.deadlineISO;
  if (p.recur) n.recur = p.recur;
  if (p.client) n.client = p.client;
  if (p.dueISO != null) { n.dueISO = p.dueISO; n.due = p.due; if (p.dueTime) n.dueTime = p.dueTime; }
  else if (p.dueTime) { if (!n.dueISO) { n.dueISO = tdRealToday(); n.due = "Today"; } n.dueTime = p.dueTime; }
  if (p.services && p.services.length) n.services = tdUniq([...(f.services || []), ...p.services]);
  if (p.labels && p.labels.length) n.labels = tdUniq([...(f.labels || []), ...p.labels]);
  if (p.watchers && p.watchers.length) n.watchers = tdUniq([...(f.watchers || []), ...p.watchers]);
  if (p.reminders && p.reminders.length) n.reminders = tdUniq([...(f.reminders || []), ...p.reminders]);
  if (p.checklist && p.checklist.length) n.checklist = [...(f.checklist || []), ...p.checklist];
  if (p.links && p.links.length) n.links = [...(f.links || []), ...p.links.filter(pl => !(f.links || []).some(fl => fl.url === pl.url))];
  if (which === "title" && p.description && !f.description) n.description = p.description;
  return n;
}

/* Apply a Ramble (LLM) result authoritatively onto a form. */
function tdApplyRamble(f, p, role) {
  return {
    ...f,
    title: p.title || f.title,
    description: p.description || f.description,
    assignee: p.assigneeId || role.id,
    priority: p.priority || "med",
    timeEstimateMin: p.timeEstimateMin != null ? p.timeEstimateMin : null,
    deadlineISO: p.deadlineISO || null,
    recur: p.recur || null,
    client: p.client || "",
    dueISO: p.dueISO || (p.dueTime ? tdRealToday() : null),
    due: p.dueISO ? (p.due || window.PPC.isoToDueLabel(p.dueISO)) : (p.dueTime ? "Today" : "No date"),
    dueTime: p.dueTime || null,
    services: p.services || [],
    labels: p.labels || [],
    watchers: p.watchers || [],
    reminders: p.reminders || [],
    checklist: p.checklist && p.checklist.length ? p.checklist : f.checklist
  };
}

/* Floating popover for a widget editor — anchored to the clicked pill, opens UP
   when there isn't room below, sized to its content (Todoist-style). */
function TaskFieldPopover({ anchor, onClose, children }) {
  const ref = React.useRef(null);
  const [style, setStyle] = React.useState({ left: anchor.left, top: anchor.bottom + 6, visibility: "hidden" });
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const h = el.offsetHeight, w = el.offsetWidth;
    const spaceBelow = window.innerHeight - anchor.bottom;
    const openUp = spaceBelow < h + 16 && anchor.top > h + 16;
    const left = Math.max(8, Math.min(anchor.left, window.innerWidth - w - 8));
    const top = openUp ? Math.max(8, anchor.top - h - 6) : anchor.bottom + 6;
    setStyle({ left, top, visibility: "visible" });
  }, []);
  React.useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown, true); document.removeEventListener("keydown", onKey); };
  }, []);
  return <div ref={ref} className="t6-fpop" style={{ position: "fixed", ...style }}>{children}</div>;
}

/* Todoist-style date popover: Today ☀️ Tomorrow 🛋️ Weekend ⊘ No-date quick chips +
   a date&time picker + a Repeat button that expands recurring options. */
function DateRepeatEditor({ form, setF }) {
  const PPC = window.PPC;
  const today = PPC.realToday ? PPC.realToday() : PPC.TODAY;
  const [repeatOpen, setRepeatOpen] = React.useState(false);
  const baseISO = form.dueISO || today;
  const d = new Date(baseISO + "T00:00:00");
  const ord = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  const wkday = d.toLocaleDateString("en-US", { weekday: "long" });
  const nth = ord(d.getDate());
  const monthDay = d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const dow = new Date(today + "T00:00:00").getDay();
  let toSat = (6 - dow + 7) % 7; if (toSat === 0) toSat = 7;
  const setQuick = (label, off) => { const iso = PPC.shiftDate(today, off); setF({ dueISO: iso, due: label, dueTime: form.dueTime || null }); };
  const REPEATS = ["Every day", "Every week on " + wkday, "Every weekday (Mon–Fri)", "Every month on the " + nth, "Every year on " + monthDay];
  return (
    <div className="t6-dateedit">
      <div className="t6-dq">
        <button onClick={() => setQuick("Today", 0)}><span className="t6-dq-ic" style={{ color: "var(--ok)" }}>📅</span>Today</button>
        <button onClick={() => setQuick("Tomorrow", 1)}><span className="t6-dq-ic">☀️</span>Tomorrow</button>
        <button onClick={() => setQuick("Weekend", toSat)}><span className="t6-dq-ic">🛋️</span>Weekend</button>
        <button onClick={() => setF({ dueISO: null, dueTime: null, due: "No date" })}><span className="t6-dq-ic">⊘</span>No date</button>
      </div>
      <input type="datetime-local" className="input" value={form.dueISO ? `${form.dueISO}T${form.dueTime || "09:00"}` : ""} onChange={e => { const v = e.target.value; if (!v) { setF({ dueISO: null, dueTime: null, due: "No date" }); return; } const [iso, time] = v.split("T"); setF({ dueISO: iso, dueTime: time || "09:00", due: PPC.isoToDueLabel(iso) || iso }); }} />
      <button className="t6-dr-repeat" onClick={() => setRepeatOpen(o => !o)}>
        <span style={{ flex: 1, textAlign: "left" }}>🔁 {form.recur || "Repeat"}</span>
        {form.recur ? <span className="t6-nt-x" onClick={(e) => { e.stopPropagation(); setF({ recur: null }); }}>✕</span> : <span className="muted">▾</span>}
      </button>
      {repeatOpen && (
        <div className="t6-dr-list">
          {REPEATS.map(lbl => <button key={lbl} className={form.recur === lbl ? "on" : ""} onClick={() => { setF({ recur: lbl }); setRepeatOpen(false); }}>{lbl}</button>)}
          <button onClick={() => { setF({ recur: null }); setRepeatOpen(false); }}>Doesn’t repeat</button>
        </div>
      )}
    </div>
  );
}

function TaskFieldZone({ form, setForm, role, activeField, setActiveField, iconOnly }) {
  const { userMap } = window.PPC;
  const [anchor, setAnchor] = React.useState(null);   // clicked pill rect → popover anchor
  const [newReminder, setNewReminder] = React.useState("");
  const [newCheck, setNewCheck] = React.useState("");
  const [newLinkLabel, setNewLinkLabel] = React.useState("");
  const [newLinkUrl, setNewLinkUrl] = React.useState("");
  const clientOptions = tdClientOptions();
  const setF = (patch) => setForm(f => ({ ...f, ...patch }));
  const toggleService = (code) => setForm(f => ({ ...f, services: f.services.includes(code) ? f.services.filter(x => x !== code) : [...f.services, code] }));
  const toggleLabel = (l) => setForm(f => ({ ...f, labels: f.labels.includes(l) ? f.labels.filter(x => x !== l) : [...f.labels, l] }));
  const toggleWatcher = (id) => setForm(f => ({ ...f, watchers: f.watchers.includes(id) ? f.watchers.filter(x => x !== id) : [...f.watchers, id] }));
  const addLink = () => { if (!newLinkUrl.trim()) return; setForm(f => ({ ...f, links: [...f.links, { label: newLinkLabel.trim() || newLinkUrl.trim(), url: newLinkUrl.trim() }] })); setNewLinkLabel(""); setNewLinkUrl(""); };
  const addCheck = () => { if (!newCheck.trim()) return; setForm(f => ({ ...f, checklist: [...f.checklist, { id: "c" + Math.random().toString(36).slice(2, 6), text: newCheck.trim(), done: false }] })); setNewCheck(""); };
  const addReminder = () => { if (!newReminder.trim()) return; setForm(f => ({ ...f, reminders: [...f.reminders, newReminder.trim()] })); setNewReminder(""); };

  /* removable value chips for every SET field — clicking a chip re-opens its editor */
  const chips = [];
  if (form.dueISO) chips.push({ k: "date", field: "date", kind: "accent", label: "📅 " + window.PPC.isoToDueLabel(form.dueISO) + (form.dueTime ? " " + window.PPC.fmtTime12(form.dueTime) : ""), clear: () => setF({ dueISO: null, dueTime: null, due: "No date" }) });
  if (form.priority && form.priority !== "med") chips.push({ k: "prio", field: "priority", kind: "warn", label: "🚩 " + (form.priority === "high" ? "High" : "Low"), clear: () => setF({ priority: "med" }) });
  if (form.timeEstimateMin != null) chips.push({ k: "dur", field: "duration", kind: "ok", label: "⏱ " + ((window.PPC.bucketFor(form.timeEstimateMin) || {}).label || form.timeEstimateMin + "m"), clear: () => setF({ timeEstimateMin: null }) });
  if (form.deadlineISO) chips.push({ k: "dl", field: "deadline", kind: "danger", label: "⚑ " + window.PPC.isoToDueLabel(form.deadlineISO) + (form.deadlineTime ? " " + window.PPC.fmtTime12(form.deadlineTime) : ""), clear: () => setF({ deadlineISO: null, deadlineTime: null }) });
  if (form.recur) chips.push({ k: "rec", field: null, kind: "accent", label: "🔁 " + form.recur, clear: () => setF({ recur: null }) });
  if (form.assignee && form.assignee !== role.id) chips.push({ k: "asg", field: "assignee", kind: "accent", label: "+ " + ((userMap[form.assignee] || {}).name || form.assignee).split(" ")[0], clear: () => setF({ assignee: role.id }) });
  if (form.client) chips.push({ k: "cli", field: "client", kind: "outline", label: "# " + form.client, clear: () => setF({ client: "" }) });
  if (form.projectId) { const pj = (window.PPC.store.projects || []).find(p => p.id === form.projectId); chips.push({ k: "pj", field: "project", kind: "accent", label: "# " + (pj ? pj.name : "Project"), clear: () => setF({ projectId: null }) }); }
  (form.services || []).forEach(s => chips.push({ k: "svc" + s, field: "services", kind: "ok", label: "▸ " + (TD_SVC_LABEL[s] || s), clear: () => setForm(f => ({ ...f, services: f.services.filter(x => x !== s) })) }));
  (form.labels || []).forEach(l => chips.push({ k: "lbl" + l, field: "labels", kind: "outline", label: "@" + l, clear: () => setForm(f => ({ ...f, labels: f.labels.filter(x => x !== l) })) }));
  (form.watchers || []).forEach(w => chips.push({ k: "w" + w, field: "watchers", kind: "accent", label: "👁 " + ((userMap[w] || {}).name || w).split(" ")[0], clear: () => setForm(f => ({ ...f, watchers: f.watchers.filter(x => x !== w) })) }));
  (form.reminders || []).forEach((r, i) => chips.push({ k: "rem" + i, field: "reminders", kind: "warn", label: "🔔 " + r, clear: () => setForm(f => ({ ...f, reminders: f.reminders.filter((_, x) => x !== i) })) }));
  if ((form.checklist || []).length) chips.push({ k: "sub", field: "subtasks", kind: "ok", label: "☑ " + form.checklist.length + " subtask" + (form.checklist.length > 1 ? "s" : ""), clear: () => setF({ checklist: [] }) });
  if ((form.links || []).length) chips.push({ k: "lnk", field: "links", kind: "outline", label: "🔗 " + form.links.length + " link" + (form.links.length > 1 ? "s" : ""), clear: () => setF({ links: [] }) });

  const fieldSet = { date: !!form.dueISO, priority: form.priority !== "med", duration: form.timeEstimateMin != null, deadline: !!form.deadlineISO, assignee: form.assignee !== role.id, client: !!form.client, project: !!form.projectId };
  const FIELD_PILLS = [
    { key: "date", emoji: "📅", name: "Date", single: true },
    { key: "priority", emoji: "🚩", name: "Priority", single: true },
    { key: "duration", emoji: "⏱", name: "Duration", single: true },
    { key: "reminders", emoji: "🔔", name: "Reminders" },
    { key: "labels", emoji: "🏷", name: "Labels" },
    { key: "deadline", emoji: "⚑", name: "Deadline", single: true },
    { key: "services", emoji: "▸", name: "Services" },
    { key: "watchers", emoji: "👁", name: "Watchers" },
    { key: "assignee", emoji: "👤", name: "Assignee", single: true },
    { key: "client", emoji: "#", name: "Client", single: true },
    { key: "project", emoji: "▦", name: "Project", single: true },
    { key: "subtasks", emoji: "☑", name: "Subtasks" }
  ];
  const renderEditor = () => {
    switch (activeField) {
      case "date": return <DateRepeatEditor form={form} setF={setF} />;
      case "priority": return <PriorityPick value={form.priority} onChange={(p) => setF({ priority: p })} />;
      case "duration": return <DurationPick value={form.timeEstimateMin} onChange={(min) => setF({ timeEstimateMin: min })} />;
      case "deadline": return <input type="datetime-local" className="input" autoFocus value={form.deadlineISO ? `${form.deadlineISO}T${form.deadlineTime || "17:00"}` : ""} onChange={e => { const v = e.target.value; if (!v) { setF({ deadlineISO: null, deadlineTime: null }); return; } const [iso, time] = v.split("T"); setF({ deadlineISO: iso, deadlineTime: time || "17:00" }); }} />;
      case "assignee": return <UserSelect value={form.assignee} onChange={(id) => setF({ assignee: id })} />;
      case "client": return <SelectInput value={form.client} onChange={e => setF({ client: e.target.value })}><option value="">— No client —</option>{clientOptions.map(c => <option key={c} value={c}>{c}</option>)}</SelectInput>;
      case "project": return <SelectInput value={form.projectId || ""} onChange={e => setF({ projectId: e.target.value || null })}><option value="">— No project —</option>{(window.PPC.store.projects || []).filter(p => !p.system).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</SelectInput>;
      case "services": return <div className="row gap-2" style={{ flexWrap: "wrap" }}>{TD_SVC_OPTS.map(([code, lbl]) => <span key={code} className={`chip-pick ${form.services.includes(code) ? "on" : ""}`} onClick={() => toggleService(code)}>{lbl}</span>)}</div>;
      case "watchers": return <div className="row gap-2" style={{ flexWrap: "wrap" }}>{window.PPC.USERS.filter(u => u.id !== "client" && u.id !== form.assignee).map(u => <span key={u.id} className={`chip-pick ${form.watchers.includes(u.id) ? "on" : ""}`} onClick={() => toggleWatcher(u.id)}><Avatar user={u} size="sm" /> {u.name.split(" ")[0]}</span>)}</div>;
      case "labels": return <div className="row gap-2" style={{ flexWrap: "wrap" }}>{TD_LABEL_CHOICES.map(l => <span key={l} className={`chip-pick ${form.labels.includes(l) ? "on" : ""}`} onClick={() => toggleLabel(l)}>#{l}</span>)}</div>;
      case "reminders": return <div className="row gap-2"><TextInput placeholder="e.g. 1 day before, at 9am" autoFocus value={newReminder} onChange={e => setNewReminder(e.target.value)} onKeyDown={e => e.key === "Enter" && addReminder()} /><button className="btn sm" onClick={addReminder}>Add</button></div>;
      case "subtasks": return <div className="row gap-2"><TextInput placeholder="A step…" autoFocus value={newCheck} onChange={e => setNewCheck(e.target.value)} onKeyDown={e => e.key === "Enter" && addCheck()} /><button className="btn sm" onClick={addCheck}>Add</button></div>;
      case "links": return <div className="row gap-2"><TextInput placeholder="Label" value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} style={{ maxWidth: 140 }} /><TextInput placeholder="https://…" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && addLink()} /><button className="btn sm" onClick={addLink}>Add</button></div>;
      default: return null;
    }
  };

  const openField = (e, key) => { const r = e.currentTarget.getBoundingClientRect(); const next = activeField === key ? null : key; setActiveField(next); setAnchor(next ? r : null); };
  return (
    <>
      <div className="t6-nt-fieldrow">
        {chips.map(c => (
          <span key={c.k} className={`pill ${c.kind} t6-nt-chip`} onMouseDown={(e) => e.preventDefault()} onClick={(e) => c.field && openField(e, c.field)}>
            {c.label}<span className="t6-nt-x" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); c.clear(); }}>✕</span>
          </span>
        ))}
        {FIELD_PILLS.filter(f => !(f.single && fieldSet[f.key])).map(f => (
          <button key={f.key} className={`t6-nt-pill ${iconOnly ? "icon" : ""} ${activeField === f.key ? "on" : ""}`} title={f.name} aria-label={f.name} onMouseDown={(e) => e.preventDefault()} onClick={(e) => openField(e, f.key)}>
            <span className="t6-nt-pemoji">{f.emoji}</span>{iconOnly ? null : f.name}
          </button>
        ))}
      </div>
      {activeField && anchor && (
        <TaskFieldPopover anchor={anchor} onClose={() => { setActiveField(null); setAnchor(null); }}>
          {renderEditor()}
        </TaskFieldPopover>
      )}
    </>
  );
}

function NewTaskModal({ open, defaults, role, onClose }) {
  const { userMap, store, ONB_CARDS, ACT_CARDS } = window.PPC;
  const [form, setForm] = React.useState(tdBlankForm(defaults, role));
  const [activeField, setActiveField] = React.useState(null);   // which widget editor is open
  const [mode, setMode] = React.useState("none");               // none | ramble | scan
  const [rambleText, setRambleText] = React.useState("");
  const [rambleBusy, setRambleBusy] = React.useState(false);

  React.useEffect(() => { if (!open) return; setForm(tdBlankForm(defaults, role)); setActiveField(null); setMode("none"); setRambleText(""); setRambleBusy(false); }, [open, defaults]);

  if (!open) return null;

  const RT = tdRealToday;

  /* Ingest input → STRIP recognized phrases from the text and push the values into
     the fields. The Task name keeps only the clean title; everything else becomes a
     removable chip. Works great with Wispr dictation (bulk text in one event). */
  const applyParse = (raw, which) => setForm(f => tdMergeParse(f, raw, which, role));

  /* Ramble — structure ONE task from a brain-dump (fills the current form fields). */
  const runRamble = async () => {
    const txt = rambleText.trim();
    if (!txt) return;
    setRambleBusy(true);
    try {
      const p = await window.PPC.rambleParse(txt);
      setForm(f => (window.tdApplyRamble ? window.tdApplyRamble(f, p, role) : f));
      setMode("none"); setRambleText("");
      window.toast?.("Structured into a task ✨", { icon: "✨" });
    } catch (e) { window.toast?.("Couldn’t structure that — try again", { icon: "!" }); }
    finally { setRambleBusy(false); }
  };

  const submit = () => {
    const cleanTitle = form.title.trim();
    if (!cleanTitle) { window.toast?.("Task name is required", { icon: "!" }); return; }
    const t = store.addTask({
      title: cleanTitle, description: form.description || "",
      assignee: form.assignee, watchers: form.watchers, reporter: role.id,
      due: form.due, dueISO: form.dueISO || null, dueTime: form.dueISO ? (form.dueTime || "09:00") : null,
      priority: form.priority, client: form.client || null,
      service: (form.services || [])[0] || null, services: form.services || [], projectId: form.projectId || null,
      links: form.links, checklist: form.checklist, labels: form.labels, reminders: form.reminders,
      timeEstimateMin: form.timeEstimateMin != null ? form.timeEstimateMin : null,
      deadlineISO: form.deadlineISO || null, deadlineTime: form.deadlineISO ? (form.deadlineTime || null) : null, recur: form.recur || null, status: "open"
    });
    window.toast?.(`Task added${userMap[form.assignee] ? " · " + userMap[form.assignee].name.split(" ")[0] : ""}`, { icon: "✓" });
    onClose();
    setTimeout(() => window.openTaskPanel?.(t.id), 200);
  };

  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target.classList.contains("modal-scrim")) onClose(); }}>
      <div className="t6-newtask">
        <div className="t6-nt-body">
          <div className="t6-nt-top">
            <span className="t6-nt-eyebrow">New task</span>
            <div className="row gap-2" style={{ alignItems: "center" }}>
              <button className={`t6-nt-ramble ${mode === "ramble" ? "on" : ""}`} onClick={() => setMode(m => m === "ramble" ? "none" : "ramble")} title="Ramble — structure ONE task from a brain-dump">
                <Icon k="sparkle" className="ic sm" /> Ramble
              </button>
              <button className={`t6-nt-ramble ${mode === "scan" ? "on" : ""}`} onClick={() => setMode(m => m === "scan" ? "none" : "scan")} title="Text Scan — paste a paragraph, get one task per sentence">
                <Icon k="board" className="ic sm" /> Text Scan
              </button>
            </div>
          </div>
          {mode === "scan" ? (
            <div className="t6-ramble">
              {window.TextScanPanel && React.createElement(window.TextScanPanel, {
                role, defaults: { projectId: form.projectId || null, client: form.client || null },
                onBack: () => setMode("none"),
                onDone: () => { setMode("none"); onClose(); }
              })}
            </div>
          ) : mode === "ramble" ? (
            <div className="t6-ramble">
              <textarea className="t6-ramble-ta" autoFocus value={rambleText} onChange={e => setRambleText(e.target.value)}
                placeholder={"Dump everything about ONE task — what, when, who, priority, steps.\ne.g. “Call Abhishek tomorrow at 5, high priority, 5 minutes, hard deadline Monday, watchers Dhaval and Shrikant, it's for Google.”"} />
              <div className="row gap-2" style={{ justifyContent: "flex-end", marginTop: 10 }}>
                <button className="btn ghost sm" onClick={() => setMode("none")}>Back</button>
                <button className="btn primary sm" disabled={rambleBusy || !rambleText.trim()} onClick={runRamble}>{rambleBusy ? "Structuring…" : "✨ Structure it"}</button>
              </div>
              <TaskFieldZone form={form} setForm={setForm} role={role} activeField={activeField} setActiveField={setActiveField} />
            </div>
          ) : (
          <>
          <input className="t6-nt-title" placeholder="Task name" autoFocus value={form.title}
            onChange={e => applyParse(e.target.value, "title")}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submit(); } }} />
          <input className="t6-nt-desc" placeholder="Description" value={form.description}
            onChange={e => applyParse(e.target.value, "desc")} />

          {/* Todoist-style widget row: set values become removable chips,
             unset fields are "add" pill buttons — clicking opens its editor. */}
          <TaskFieldZone form={form} setForm={setForm} role={role} activeField={activeField} setActiveField={setActiveField} />
          </>
          )}
        </div>
        <div className="t6-nt-foot">
          <span className="muted" style={{ fontSize: 12.5, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {((userMap[form.assignee] || {}).name || "").split(" ")[0]} · {form.dueISO ? window.PPC.isoToDueLabel(form.dueISO) + (form.dueTime ? " " + window.PPC.fmtTime12(form.dueTime) : "") : "no date"} · {form.priority}
          </span>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={submit}>Add task</button>
        </div>
      </div>
    </div>
  );
}

window.TaskDetailPanel = TaskDetailPanel;
window.NewTaskModal = NewTaskModal;
window.TaskFieldZone = TaskFieldZone;
window.tdBlankForm = tdBlankForm;
window.tdMergeParse = tdMergeParse;
window.tdApplyRamble = tdApplyRamble;
