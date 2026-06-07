/* ─────────────────────────────────────────────────────────────────
   ClientProfilePanel — the SINGLE client view.
   Opened from anywhere via window.openClientPanel(idOrName).
   Tabs: Overview · Brief · Notes · Accounts · Findings · Files · Tasks · Performance
   ───────────────────────────────────────────────────────────────── */

function ClientProfilePanel({ idOrName, role, onClose }) {
  const store = useStore();
  const { ONB_CARDS, ACT_CARDS, ONBOARD_STAGES, ACTIVE_STAGES, userMap, SERVICE_INFO, NOTE_CATEGORIES } = window.PPC;
  const [tab, setTab] = React.useState("overview");
  React.useEffect(() => { setTab("overview"); }, [idOrName]);

  if (!idOrName) return <ProfileShell open={false} onClose={onClose} />;

  // resolve by id or by name
  const card =
    [...ONB_CARDS, ...ACT_CARDS].find(c => c.id === idOrName || c.name === idOrName) || null;
  const name = card?.name || idOrName;
  const profile = store.getProfile(name);
  if (!profile) return null;

  // is this an onboarding/active card or just a "free" profile?
  const isOnboard = !!ONB_CARDS.find(c => c.id === card?.id);
  const stages = card ? (isOnboard ? ONBOARD_STAGES[card.service] : ACTIVE_STAGES[card.service]) : null;
  const stage = card && stages ? stages.find(s => s.id === card.stage) : null;

  // collect related tasks (auto + manual)
  const relatedTasks = store.tasks.filter(t => t.client === name);

  const tabs = [
    { id: "overview",     label: "Overview" },
    { id: "lifecycle",    label: "Lifecycle" },
    { id: "brief",        label: "Brief" },
    { id: "notes",        label: "Notes",       count: profile.notes?.length || 0 },
    { id: "accounts",     label: "Accounts",    count: profile.accounts?.length || 0 },
    { id: "vault",        label: "Vault",       count: (window.PPC.CLIENT_VAULTS[name] || []).length },
    { id: "drive",        label: "Drive",       count: (window.PPC.DRIVE_FOLDERS[name]?.folders || []).length },
    { id: "transcripts",  label: "Transcripts", count: (window.PPC.TRANSCRIPTS[name] || []).length },
    ...(profile.services?.includes("google") || (profile.findings?.keywords?.length || profile.findings?.audit?.length)
      ? [{ id: "findings", label: "Findings" }] : []),
    { id: "files",        label: "Files",       count: profile.files?.length || 0 },
    { id: "tasks",        label: "Tasks",       count: relatedTasks.length },
    ...(profile.performance ? [{ id: "performance", label: "Performance" }] : [])
  ];

  return (
    <ProfileShell open={true} onClose={onClose}>
      <ProfileHeader name={name} profile={profile} card={card} stage={stage} userMap={userMap} role={role} />
      <div className="panel-tabs">
        {tabs.map(t => (
          <span key={t.id} className={`panel-tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count != null && <span className="count">{t.count}</span>}
          </span>
        ))}
      </div>
      <div className="side-panel-body">
        {tab === "overview"    && <OverviewTab profile={profile} name={name} card={card} stage={stage} stages={stages} relatedTasks={relatedTasks} role={role} setTab={setTab} />}
        {tab === "lifecycle"   && <LifecycleTab profile={profile} name={name} role={role} />}
        {tab === "brief"       && <BriefTab profile={profile} />}
        {tab === "notes"       && <NotesTab profile={profile} name={name} role={role} categories={NOTE_CATEGORIES} />}
        {tab === "accounts"    && <AccountsTab profile={profile} />}
        {tab === "vault"       && <VaultTab profile={profile} name={name} role={role} />}
        {tab === "drive"       && <DriveTab profile={profile} name={name} role={role} />}
        {tab === "transcripts" && <TranscriptsTab profile={profile} name={name} role={role} />}
        {tab === "findings"    && <FindingsTab profile={profile} />}
        {tab === "files"       && <FilesTab profile={profile} name={name} role={role} />}
        {tab === "tasks"       && <TasksTab tasks={relatedTasks} clientName={name} role={role} />}
        {tab === "performance" && <PerformanceTab profile={profile} />}
      </div>
    </ProfileShell>
  );
}

function ProfileShell({ open, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <div className="panel-scrim open" onClick={onClose} />
      <div className="side-panel wide open" style={{ transform: "translateX(0)" }}>{children}</div>
    </>
  );
}

function ProfileHeader({ name, profile, card, stage, userMap, role }) {
  const access = window.PPC.ROLE_ACCESS[role.id];
  const { STATUS_DEFS, getDerivedStatus, profileMRR } = window.PPC;
  const services = profile.services || [];
  const derived = getDerivedStatus(profile);
  const def = STATUS_DEFS[derived] || STATUS_DEFS.active;
  const contracts = profile.serviceContracts || {};
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);
  const [statusEdit, setStatusEdit] = React.useState(null); /* { service, nextStatus } */

  /* derived "since" — earliest contract.statusSince for the dominant status */
  const sinceISO = (() => {
    const matching = Object.values(contracts).filter(c => c.status === derived);
    if (!matching.length) return profile.startDate;
    return matching.map(c => c.statusSince).sort()[0];
  })();

  return (
    <div className="profile-head">
      <div className="row gap-3" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div className="row gap-2" style={{ marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
            {/* Dynamic status pill — clickable menu */}
            <span style={{ position: "relative" }}>
              <span className="status-pill" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "3px 10px 3px 8px", borderRadius: 999, fontSize: 12.5, fontWeight: 500,
                background: def.tint, color: def.color, cursor: "pointer", border: `1px solid ${def.color}22`
              }} onClick={() => setShowStatusMenu(s => !s)}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: def.color }} />
                {def.label}
                {sinceISO && derived !== "active" && derived !== "onboarding" && (
                  <span style={{ fontWeight: 400, opacity: 0.7 }}>· since {sinceISO}</span>
                )}
                <Icon k="chevDown" style={{ width: 11, height: 11 }} />
              </span>
              {showStatusMenu && (
                <StatusMenu services={services} contracts={contracts}
                  onPick={(svc, next) => { setStatusEdit({ service: svc, nextStatus: next }); setShowStatusMenu(false); }}
                  onClose={() => setShowStatusMenu(false)} />
              )}
            </span>

            {/* Per-service mini-pills */}
            {services.map(s => {
              const c = contracts[s];
              const sdef = STATUS_DEFS[c?.status] || STATUS_DEFS.active;
              return (
                <span key={s} className="pill" style={{
                  background: sdef.tint, color: sdef.color, borderColor: "transparent"
                }} title={c?.statusReason || ""}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: window.PPC.SERVICE_INFO[s].color }} />
                  {window.PPC.SERVICE_INFO[s].label}
                  {c?.status && c.status !== "active" && c.status !== "onboarding" && (
                    <span style={{ marginLeft: 4, fontWeight: 600 }}>· {c.status}</span>
                  )}
                </span>
              );
            })}
            <span className="muted-2" style={{ fontSize: 12.5 }}>· {profile.niche}</span>
          </div>
          <div className="profile-name">{name}</div>
          <div className="profile-meta">
            <span><span className="k">Started</span> {profile.startDate}</span>
            {profile.lifetimeMos > 0 && <span><span className="k">·</span> {profile.lifetimeMos} mo lifetime</span>}
            {access.money && (
              <span><span className="k">Active MRR</span> <span className="mono" style={{ color: "var(--ink)" }}>{fmtMoney(profileMRR(profile), profile.currency)}</span></span>
            )}
            <span><span className="k">Contact</span> {profile.contact.name}</span>
          </div>
        </div>
        <button className="btn ghost" onClick={() => window.__closeClientPanel?.()}><Icon k="close" /></button>
      </div>

      {stage && (
        <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 8 }}>
          <div className="row gap-2" style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
            <span className="label">Current stage</span>
            <span style={{ flex: 1 }} />
            {card?.blocker && <Pill kind="danger" dot>{card.blocker}</Pill>}
            {card?.accessPending && <Pill kind="warn" dot>access pending</Pill>}
          </div>
          <div className="row gap-2" style={{ marginTop: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{stage.name}</span>
            <span className={`mono age ${ageClass(card.days, stage.type)}`} style={{ fontSize: 12.5 }}>
              {card.days === 0 ? "new today" : `${card.days}d in stage`}
            </span>
          </div>
        </div>
      )}

      <div className="profile-actions">
        <button className="btn sm" onClick={() => window.openNewTask?.({ client: name })}><Icon k="plus" className="ic sm" />New task</button>
        <button className="btn sm" onClick={() => window.openNewNote?.(name)}><Icon k="doc" className="ic sm" />Add note</button>
        <button className="btn sm" onClick={() => window.openEmailCompose?.({ client: name, who: role })}><Icon k="sparkle" className="ic sm" />Compose email</button>
        <button className="btn sm ghost"><Icon k="link" className="ic sm" />Copy link</button>
        <span style={{ flex: 1 }} />
        {card && <button className="btn sm primary">Advance stage →</button>}
      </div>

      {statusEdit && (
        <ChangeStatusModal client={name} service={statusEdit.service} nextStatus={statusEdit.nextStatus}
          onClose={() => setStatusEdit(null)} />
      )}
    </div>
  );
}

/* Dropdown menu for changing per-service status */
function StatusMenu({ services, contracts, onPick, onClose }) {
  React.useEffect(() => {
    const f = (e) => { if (!e.target.closest(".status-menu") && !e.target.closest(".status-pill")) onClose(); };
    setTimeout(() => document.addEventListener("click", f), 0);
    return () => document.removeEventListener("click", f);
  }, [onClose]);

  const ALL_STATES = ["active", "paused", "cancelled"];
  return (
    <div className="status-menu" style={{
      position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
      background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10,
      boxShadow: "var(--sh-pop)", padding: 6, minWidth: 240
    }}>
      <div style={{ fontSize: 11.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: ".12em", padding: "4px 8px" }}>Change status per service</div>
      {services.map(svc => {
        const cur = contracts[svc]?.status;
        return (
          <div key={svc} style={{ padding: "6px 8px 4px", borderTop: "1px dashed var(--line-2)", marginTop: 4 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 4 }}>{window.PPC.SERVICE_INFO[svc].label} <span className="mono" style={{ fontSize: 11.5 }}>· now {cur}</span></div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {ALL_STATES.filter(s => s !== cur).map(next => {
                const d = window.PPC.STATUS_DEFS[next];
                return (
                  <button key={next} className="chip-pick"
                    style={{ borderColor: d.color, color: d.color }}
                    onClick={() => onPick(svc, next)}>
                    → {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Modal: confirm status change with reason input */
function ChangeStatusModal({ client, service, nextStatus, onClose }) {
  const { store, STATUS_DEFS, SERVICE_INFO } = window.PPC;
  const [reason, setReason] = React.useState("");
  const def = STATUS_DEFS[nextStatus];

  const submit = () => {
    store.setServiceStatus(client, service, nextStatus, reason);
    const verb = nextStatus === "active" ? "reactivated" : nextStatus === "paused" ? "paused" : "cancelled";
    window.toast && window.toast(`${SERVICE_INFO[service].label} ${verb} for ${client}`, { icon: nextStatus === "active" ? "✓" : nextStatus === "paused" ? "❚❚" : "✕" });
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 540 }}>
        <div className="modal-head">
          <div className="col" style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 12.5 }}>{SERVICE_INFO[service].label} · {client}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>
              Change status → <em style={{ color: def.color, fontStyle: "italic" }}>{def.label}</em>
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>
        <div className="modal-body">
          <div className="sub-card" style={{ background: def.tint, borderColor: def.color, color: def.color }}>
            <div className="sub-card-title" style={{ color: def.color }}>What this triggers</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
              {nextStatus === "paused" && (
                <>
                  <li>Card removed from Active boards (still searchable in Paused filter)</li>
                  <li>MRR + utilization KPIs stop counting this contract</li>
                  <li>Auto-tasks and recurring optimizations pause</li>
                  <li>Vihar receives a churn-risk flag in 7 days</li>
                </>
              )}
              {nextStatus === "cancelled" && (
                <>
                  <li>Card removed from all boards (visible in Cancelled filter)</li>
                  <li>MRR + utilization stop counting this contract permanently</li>
                  <li>Auto-task: generate Final Report PDF snapshot</li>
                  <li>Profile + history stay accessible forever</li>
                </>
              )}
              {nextStatus === "active" && (
                <>
                  <li>Card returns to Active boards</li>
                  <li>MRR resumes counting</li>
                  <li>Auto-tasks and creative refresh cycle resume</li>
                </>
              )}
            </ul>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <span className="field-label">Reason (required for paused / cancelled)</span>
            <textarea className="textarea" value={reason} onChange={e => setReason(e.target.value)}
              placeholder={nextStatus === "paused" ? "Why is this service pausing? e.g. budget pause Q2, payment issue, client request…" : nextStatus === "cancelled" ? "Why is this service cancelled? Captured forever on the profile." : "Reactivation note (optional)…"} />
          </div>
        </div>
        <div className="modal-foot">
          <div style={{ flex: 1 }} />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary"
            disabled={(nextStatus === "paused" || nextStatus === "cancelled") && !reason.trim()}
            onClick={submit}>
            Confirm change
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── tabs ─── */

function OverviewTab({ profile, name, card, stage, stages, relatedTasks, role, setTab }) {
  const { userMap } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];
  const openTasks = relatedTasks.filter(t => t.status !== "done");
  const recentNote = profile.notes?.[0];

  return (
    <div>
      <div className="grid-2">
        {/* Squad */}
        <div className="sub-card">
          <div className="sub-card-title">Squad</div>
          {["am","ads","creative"].map(role => {
            const id = profile.owners?.[role];
            const u = id ? userMap[id] : null;
            const labels = { am: "Account Mgr", ads: "Ads Mgr", creative: "Creative" };
            return (
              <div className="row gap-2" key={role} style={{ padding: "5px 0" }}>
                {u ? <Avatar user={u} size="sm" /> : <span className="avatar empty sm">—</span>}
                <span style={{ fontSize: 12.5, flex: 1 }}>{u?.name || "—"}</span>
                <span className="muted-2" style={{ fontSize: 12.5 }}>{labels[role]}</span>
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div className="sub-card">
          <div className="sub-card-title">Primary contact</div>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{profile.contact.name}</div>
          <div className="muted" style={{ fontSize: 12.5 }}>{profile.contact.role}</div>
          <div style={{ marginTop: 8, fontSize: 12.5, lineHeight: 1.7 }}>
            <div>{profile.contact.email}</div>
            <div className="mono">{profile.contact.phone}</div>
            <div className="muted-2" style={{ fontSize: 12.5 }}>{profile.contact.timezone} · prefers {profile.contact.pref}</div>
          </div>
        </div>
      </div>

      {/* Stage progress (only for onboarding/active cards) */}
      {card && stages && (
        <div className="sub-card">
          <div className="sub-card-title">Pipeline progress</div>
          <StageProgress stages={stages} currentId={card.stage} userMap={userMap} />
        </div>
      )}

      {/* Stats strip */}
      <div className="grid-3">
        <StatBlock label="Open tasks"  value={openTasks.length} sub={`${relatedTasks.length} total`} onClick={() => setTab("tasks")} />
        <StatBlock label="Notes"       value={profile.notes?.length || 0} sub={recentNote ? `Latest ${recentNote.when}` : "—"} onClick={() => setTab("notes")} />
        <StatBlock label="Files"       value={profile.files?.length || 0} sub="Brief, briefs, exports" onClick={() => setTab("files")} />
      </div>

      {/* Recent activity */}
      <div className="sub-card">
        <div className="sub-card-title">Recent activity</div>
        {(profile.activity || []).slice(0, 6).map((a, i) => (
          <div className="log-row" key={i}>
            <div className="log-dot muted" />
            <div className="col">
              <span style={{ fontSize: 13.5 }}>{a.text}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>{a.who} · {a.when}</span>
            </div>
            <span />
          </div>
        ))}
        {(profile.activity || []).length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>No activity yet.</div>}
      </div>

      {/* Recent note preview */}
      {recentNote && (
        <div className="sub-card">
          <div className="row gap-2" style={{ marginBottom: 6 }}>
            <span className="sub-card-title" style={{ margin: 0, flex: 1 }}>Latest note</span>
            <span className="muted-2" style={{ fontSize: 12.5 }}>{recentNote.category}</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{recentNote.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
            {recentNote.body.slice(0, 220)}{recentNote.body.length > 220 ? "…" : ""}
          </div>
          <div className="muted-2" style={{ fontSize: 12.5, marginTop: 6 }}>{userMap[recentNote.who]?.name || recentNote.who} · {recentNote.when}</div>
        </div>
      )}
    </div>
  );
}

function StageProgress({ stages, currentId, userMap }) {
  const stIdx = stages.findIndex(s => s.id === currentId);
  return (
    <div className="col gap-2">
      {stages.map((s, i) => {
        const passed = i < stIdx, cur = i === stIdx;
        return (
          <div className="row" key={s.id} style={{ gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 999,
              border: `1.5px solid ${cur ? "var(--accent)" : passed ? "var(--ok)" : "var(--line-strong)"}`,
              background: passed ? "var(--ok)" : cur ? "var(--accent)" : "var(--card)",
              display: "grid", placeItems: "center", color: "#fff", fontSize: 11.5
            }}>
              {passed ? "✓" : cur ? i+1 : ""}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: cur ? 500 : 400, color: cur ? "var(--ink)" : passed ? "var(--ink-3)" : "var(--ink-4)", flex: 1 }}>
              {s.name}
            </span>
            <span className="muted-2" style={{ fontSize: 11.5 }}>
              {s.type === "client" ? "Client" : s.type === "designer" ? "Designer" : Array.isArray(s.owner) ? "Multi" : userMap[s.owner]?.name.split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StatBlock({ label, value, sub, onClick }) {
  return (
    <div className="sub-card" style={{ cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <div className="sub-card-title">{label}</div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div className="muted-2" style={{ fontSize: 12.5 }}>{sub}</div>
    </div>
  );
}

function BriefTab({ profile }) {
  const b = profile.brief || {};
  return (
    <div>
      <div className="sub-card">
        <div className="sub-card-title">Business overview</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{b.overview || "—"}</div>
        <div className="row gap-3" style={{ marginTop: 10, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span><span className="muted-2">Geo · </span>{b.geo || "—"}</span>
          {b.brandKit && b.brandKit !== "—" && <span><span className="muted-2">Brand kit · </span><a href="#" style={{ color: "var(--accent)" }}>{b.brandKit}</a></span>}
        </div>
      </div>

      <div className="grid-2">
        <div className="sub-card">
          <div className="sub-card-title">Target audience</div>
          <div>
            {(b.audience || []).map((a, i) => <span key={i} className="tag">{a}</span>)}
            {!(b.audience || []).length && <span className="muted" style={{ fontSize: 12.5 }}>—</span>}
          </div>
        </div>
        <div className="sub-card">
          <div className="sub-card-title">Goals</div>
          {(b.goals || []).length === 0 && <span className="muted" style={{ fontSize: 12.5 }}>—</span>}
          {(b.goals || []).map((g, i) => (
            <div className="row gap-2" key={i} style={{ padding: "3px 0" }}>
              <span className="dot-ok" style={{ marginTop: 6 }} />
              <span style={{ fontSize: 12.5 }}>{g}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="sub-card">
          <div className="sub-card-title">USPs / what to lean on</div>
          {(b.usps || []).map((u, i) => (
            <div className="row gap-2" key={i} style={{ padding: "3px 0" }}>
              <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: 999, marginTop: 7 }} />
              <span style={{ fontSize: 12.5 }}>{u}</span>
            </div>
          ))}
          {!(b.usps || []).length && <span className="muted" style={{ fontSize: 12.5 }}>—</span>}
        </div>
        <div className="sub-card">
          <div className="sub-card-title">Avoid</div>
          <div>
            {(b.avoid || []).map((a, i) => <span key={i} className="tag avoid">{a}</span>)}
            {!(b.avoid || []).length && <span className="muted" style={{ fontSize: 12.5 }}>—</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesTab({ profile, name, role, categories }) {
  const [filterCat, setFilterCat] = React.useState("all");
  const [composer, setComposer] = React.useState(false);
  const [draft, setDraft] = React.useState({ category: "weekly", title: "", body: "" });
  const { userMap, store } = window.PPC;

  const notes = (profile.notes || []).filter(n => filterCat === "all" || n.category === filterCat);

  const submit = () => {
    if (!draft.title && !draft.body) return;
    store.addNote(name, { ...draft, who: role.id });
    window.toast?.("Note saved · timeline updated", { icon: "✓" });
    setDraft({ category: "weekly", title: "", body: "" });
    setComposer(false);
  };

  return (
    <div>
      <div className="row gap-2" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <span className={`chip-pick ${filterCat==="all"?"on":""}`} onClick={() => setFilterCat("all")}>All · {(profile.notes||[]).length}</span>
        {categories.map(c => {
          const n = (profile.notes||[]).filter(x => x.category === c.id).length;
          return (
            <span key={c.id} className={`chip-pick ${filterCat===c.id?"on":""}`} onClick={() => setFilterCat(c.id)}>
              <span style={{ width: 7, height: 7, background: c.color, borderRadius: 999, display: "inline-block" }} />
              {c.label} · {n}
            </span>
          );
        })}
        <span style={{ flex: 1 }} />
        {!composer && <button className="btn sm" onClick={() => setComposer(true)}><Icon k="plus" className="ic sm" />Add note</button>}
      </div>

      {composer && (
        <div className="sub-card" style={{ background: "var(--card)", border: "1px solid var(--accent)", padding: 14 }}>
          <div className="row gap-2" style={{ marginBottom: 8, flexWrap: "wrap" }}>
            {categories.map(c => (
              <span key={c.id} className={`chip-pick ${draft.category===c.id?"on":""}`}
                onClick={() => setDraft(d => ({ ...d, category: c.id }))}>
                <span style={{ width: 7, height: 7, background: c.color, borderRadius: 999, display: "inline-block" }} />
                {c.label}
              </span>
            ))}
          </div>
          <input className="input serif" placeholder="Note title…" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} style={{ marginBottom: 6 }} />
          <Textarea placeholder="What happened, what was decided, what comes next?" value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} />
          <div className="row gap-2" style={{ marginTop: 10, justifyContent: "flex-end" }}>
            <button className="btn ghost" onClick={() => setComposer(false)}>Cancel</button>
            <button className="btn primary" onClick={submit}>Save note</button>
          </div>
        </div>
      )}

      {notes.length === 0 && <div className="empty">No notes in this category yet.</div>}
      {notes.map(n => {
        const cat = categories.find(c => c.id === n.category);
        return (
          <div key={n.id} className={`note-card cat-${n.category}`}>
            <div className="note-card-head">
              <span style={{ fontSize: 11.5, color: cat?.color || "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>{cat?.label || n.category}</span>
              <span style={{ flex: 1 }} />
              <span className="muted-2" style={{ fontSize: 12.5 }}>{n.when}</span>
            </div>
            <div className="note-card-title">{n.title}</div>
            <div className="note-card-body">{n.body}</div>
            <div className="note-card-foot">By {userMap[n.who]?.name || n.who}</div>
          </div>
        );
      })}
    </div>
  );
}

function AccountsTab({ profile }) {
  const accs = profile.accounts || [];
  const statusLabel = { ok: <Pill kind="ok" dot>Access OK</Pill>, pending: <Pill kind="warn" dot>Pending</Pill>, "not-yet": <Pill kind="outline">Not set up</Pill> };
  return (
    <div>
      <div className="muted" style={{ fontSize: 12.5, marginBottom: 10 }}>Platform access and key URLs. Click to open the corresponding console.</div>
      {accs.length === 0 && <div className="empty">No platform accounts captured yet.</div>}
      {accs.map((a, i) => (
        <div key={i} className="file-row">
          <div className="file-kind">{a.platform.split(" ")[0].slice(0,4)}</div>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>{a.platform}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>{a.name}{a.note ? ` · ${a.note}` : ""}</span>
          </div>
          {statusLabel[a.access] || <Pill kind="outline">{a.access}</Pill>}
          <button className="btn sm ghost"><Icon k="link" className="ic sm" /></button>
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <button className="btn sm"><Icon k="plus" className="ic sm" />Add platform</button>
      </div>
    </div>
  );
}

function FindingsTab({ profile }) {
  const f = profile.findings || {};
  return (
    <div>
      {f.summary && (
        <div className="sub-card">
          <div className="sub-card-title">Research summary</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{f.summary}</div>
        </div>
      )}

      {(f.keywords || []).length > 0 && (
        <div className="sub-card" style={{ padding: 0 }}>
          <div className="sub-card-title" style={{ padding: "12px 14px 0" }}>Keyword research</div>
          <table className="t" style={{ marginTop: 6 }}>
            <thead><tr><th>Term</th><th>Volume</th><th>CPC</th><th>Intent</th></tr></thead>
            <tbody>
              {f.keywords.map((k,i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{k.term}</td>
                  <td className="mono">{k.vol}</td>
                  <td className="mono">{k.cpc}</td>
                  <td><Pill kind={k.intent === "very high" || k.intent === "high" ? "accent" : "outline"}>{k.intent}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(f.competitors || []).length > 0 && (
        <div className="sub-card">
          <div className="sub-card-title">Competitor scan</div>
          {f.competitors.map((c,i) => (
            <div key={i} className="row gap-2" style={{ padding: "6px 0", borderBottom: "1px dashed var(--line-2)" }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, minWidth: 180 }}>{c.name}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>{c.note}</span>
            </div>
          ))}
        </div>
      )}

      {(f.audit || []).length > 0 && (
        <div className="sub-card">
          <div className="sub-card-title">Account audit</div>
          {f.audit.map((a,i) => (
            <div key={i} className="row gap-2" style={{ padding: "6px 0", borderBottom: "1px dashed var(--line-2)" }}>
              <span className={`dot-${a.status}`} style={{ marginTop: 4 }} />
              <span style={{ fontSize: 13.5, fontWeight: 500, minWidth: 160 }}>{a.label}</span>
              <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>{a.note}</span>
            </div>
          ))}
        </div>
      )}

      {(!f.keywords?.length && !f.competitors?.length && !f.audit?.length && !f.summary) && (
        <div className="empty">No findings captured yet. Add research notes from the Notes tab.</div>
      )}
    </div>
  );
}

function FilesTab({ profile, name, role }) {
  const files = profile.files || [];
  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>Briefs, contracts, creative exports, reports — everything for {name}.</span>
        <button className="btn sm"><Icon k="plus" className="ic sm" />Upload</button>
      </div>
      {files.length === 0 && <div className="empty">No files yet.</div>}
      {files.map((f,i) => (
        <div key={i} className="file-row">
          <div className={`file-kind ${f.kind}`}>{f.kind}</div>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>{f.name}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>{f.size} · {f.when} · {f.who}</span>
          </div>
          <button className="btn sm ghost"><Icon k="more" className="ic sm" /></button>
        </div>
      ))}
    </div>
  );
}

function TasksTab({ tasks, clientName, role }) {
  const { userMap } = window.PPC;
  const open = tasks.filter(t => t.status !== "done");
  const done = tasks.filter(t => t.status === "done");
  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>
          <span className="mono" style={{ color: "var(--ink)" }}>{open.length}</span> open · <span className="mono" style={{ color: "var(--ink-3)" }}>{done.length}</span> done
        </span>
        <button className="btn sm" onClick={() => window.openNewTask?.({ client: clientName })}>
          <Icon k="plus" className="ic sm" />New task for {clientName}
        </button>
      </div>
      {tasks.length === 0 && <div className="empty">No tasks linked to this client yet.</div>}
      {tasks.map(t => (
        <TaskMiniRow key={t.id} task={t} userMap={userMap} />
      ))}
    </div>
  );
}

function TaskMiniRow({ task, userMap }) {
  const u = userMap[task.assignee];
  return (
    <div className="task-row" onClick={() => window.openTaskPanel?.(task.id)} style={{ border: "1px solid var(--line)", borderRadius: 10, marginBottom: 6, padding: "10px 12px" }}>
      <span className={`check ${task.status === "done" ? "done" : ""}`} onClick={(e) => { e.stopPropagation(); window.PPC.store.toggleTaskDone(task.id); }}>
        {task.status === "done" && <Icon k="check" className="ic sm" />}
      </span>
      <div className="col" style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13.5, textDecoration: task.status === "done" ? "line-through" : "none", color: task.status === "done" ? "var(--ink-3)" : "var(--ink)" }}>
          {task.title}
        </span>
        <span className="muted" style={{ fontSize: 12.5 }}>
          {task.checklist?.length ? `${task.checklist.filter(c=>c.done).length}/${task.checklist.length} subtasks · ` : ""}
          {task.comments?.length ? `${task.comments.length} comment${task.comments.length>1?"s":""}` : "no comments"}
        </span>
      </div>
      {task.due && <Pill kind={task.due === "Overdue" ? "danger" : "outline"}>{task.due}</Pill>}
      <Pill kind={task.priority === "high" ? "danger" : task.priority === "med" ? "warn" : "outline"}>{task.priority}</Pill>
      {u && <Avatar user={u} size="sm" />}
    </div>
  );
}

function PerformanceTab({ profile }) {
  const p = profile.performance;
  if (!p) return <div className="empty">No live performance data yet.</div>;
  return (
    <div>
      <div className="grid-4">
        <div className="sub-card"><div className="sub-card-title">Spend (mo)</div><div className="mono" style={{ fontSize: 19 }}>${p.spend.toLocaleString()}</div></div>
        <div className="sub-card"><div className="sub-card-title">Conversions</div><div className="mono" style={{ fontSize: 19 }}>{p.conv}</div></div>
        <div className="sub-card"><div className="sub-card-title">CPA</div><div className="mono" style={{ fontSize: 19 }}>${p.cpa}</div></div>
        <div className="sub-card"><div className="sub-card-title">CTR</div><div className="mono" style={{ fontSize: 19 }}>{p.ctr}%</div></div>
      </div>
      <div className="sub-card">
        <div className="sub-card-title">7-day CPA trend</div>
        <Spark data={p.trend} w={620} h={60} color="var(--accent)" />
      </div>
    </div>
  );
}

window.ClientProfilePanel = ClientProfilePanel;

/* ════════════════════════════════════════════════════════════════════
   LIFECYCLE TAB — status, contracts, financials, creative refresh.
   ════════════════════════════════════════════════════════════════════ */
function LifecycleTab({ profile, name, role }) {
  const { STATUS_DEFS, SERVICE_INFO, creativeRefreshState, profileMRR, TODAY, store } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];
  const contracts = profile.serviceContracts || {};
  const services = profile.services || [];
  const payments = profile.payments || [];

  /* Financial summary */
  const received   = payments.filter(p => p.status === "received").reduce((s,p) => s + p.amount, 0);
  const outstanding= payments.filter(p => p.status === "outstanding").reduce((s,p) => s + p.amount, 0);
  const currency   = profile.currency || "CAD";
  const activeMRR  = profileMRR(profile);
  /* LTV = sum of all received payments (the realized lifetime value) */
  const ltv = received;
  /* Simple commission summary for the salesperson on this client */
  const salesperson = Object.values(contracts)[0]?.salesperson;

  return (
    <div>
      {/* Per-service contracts */}
      <div className="label" style={{ marginBottom: 8 }}>Service contracts</div>
      <div className="col" style={{ gap: 10, marginBottom: 16 }}>
        {services.map(svc => {
          const c = contracts[svc];
          if (!c) return null;
          const def = STATUS_DEFS[c.status] || STATUS_DEFS.active;
          const cr = svc === "meta" ? creativeRefreshState(c, TODAY) : null;
          return (
            <div key={svc} className="sub-card" style={{
              borderLeft: `4px solid ${def.color}`,
              background: c.status === "active" ? "var(--card)" : def.tint
            }}>
              <div className="row gap-2" style={{ alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: SERVICE_INFO[svc].color, marginTop: 6 }} />
                <div className="col" style={{ flex: 1 }}>
                  <div className="row gap-2">
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{SERVICE_INFO[svc].label}</span>
                    <span className="pill" style={{ background: def.color, color: "#fff", borderColor: "transparent" }}>{def.label}</span>
                    {c.statusSince && <span className="muted" style={{ fontSize: 12.5 }}>since {c.statusSince}</span>}
                  </div>
                  {c.statusReason && (
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{c.statusReason}</div>
                  )}
                </div>
              </div>
              <div className="row gap-3" style={{ flexWrap: "wrap", fontSize: 12.5, color: "var(--ink-2)" }}>
                {access.money && (
                  <span><span className="muted-2">Fee</span> <span className="mono" style={{ color: "var(--ink)" }}>{fmtMoney(c.monthlyFee, c.currency)}/mo</span></span>
                )}
                <span><span className="muted-2">Start</span> {c.contractStart}</span>
                <span><span className="muted-2">Term</span> {c.contractTerm}</span>
                <span><span className="muted-2">Sales</span> {window.PPC.userMap[c.salesperson]?.name.split(" ")[0] || "—"}</span>
                <span><span className="muted-2">Billing</span> {c.billingSchedule}</span>
              </div>

              {/* Creative refresh widget (Meta only) */}
              {cr && c.status === "active" && (
                <div style={{ marginTop: 10, padding: 10, background: "var(--card-2)", border: "1px solid var(--line)", borderRadius: 8 }}>
                  <div className="row gap-2" style={{ marginBottom: 6 }}>
                    <span className="label">Creative refresh</span>
                    <span style={{ flex: 1 }} />
                    {cr.overdue && <Pill kind="danger" dot>Overdue ({cr.daysSince}d)</Pill>}
                    {!cr.overdue && cr.dueSoon && <Pill kind="warn" dot>Due in {cr.daysUntilDue}d</Pill>}
                    {!cr.overdue && !cr.dueSoon && <Pill kind="ok" dot>Fresh ({cr.daysSince}d)</Pill>}
                  </div>
                  <div className="row gap-3" style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 6 }}>
                    <span>Last refresh <span className="mono">{cr.lastRefreshDate}</span></span>
                    <span>Next due <span className="mono">{cr.nextDueDate}</span></span>
                    <span>Cadence <span className="mono">{cr.cadenceDays}d</span></span>
                  </div>
                  <div className="bar" style={{ height: 6 }}>
                    <i style={{
                      width: `${Math.min(100, (cr.daysSince / cr.cadenceDays) * 100)}%`,
                      background: cr.overdue ? "var(--danger)" : cr.dueSoon ? "var(--warn)" : "var(--ok)"
                    }} />
                  </div>
                  <div className="row" style={{ marginTop: 8 }}>
                    <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>
                      Auto-task fires to Vanshika at day {cr.alertAtDay} (10-day runway before next refresh).
                    </span>
                    <button className="btn sm ghost" onClick={() => {
                      store.markCreativeRefreshed(name);
                      window.toast && window.toast(`Creative pack marked refreshed for ${name}`, { icon: "↻" });
                    }}>Mark refreshed</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {services.length === 0 && <div className="empty">No active service contracts.</div>}
      </div>

      {/* Financial summary — owner / money-access only */}
      {access.money && (
        <>
          <div className="label" style={{ marginBottom: 8 }}>Financial summary</div>
          <div className="grid-3" style={{ marginBottom: 14 }}>
            <Stat label={`Active MRR`}        value={fmtMoney(activeMRR, currency)} sub={`${Object.values(contracts).filter(c=>c.status==="active").length} active contract(s)`} />
            <Stat label="Lifetime value"      value={fmtMoney(ltv, currency)}        sub={`${payments.filter(p => p.status === "received").length} payments received`} />
            <Stat label="Outstanding"          value={fmtMoney(outstanding, currency)} sub={outstanding > 0 ? "due this cycle" : "all settled"} delta={outstanding > 0 ? "needs collection" : "all settled"} deltaDir={outstanding > 0 ? "down" : "up"} />
          </div>

          {/* Payments table */}
          <div className="widget" style={{ padding: 0, marginBottom: 14 }}>
            <table className="t">
              <thead>
                <tr>
                  <th>Invoice</th><th>Date</th><th style={{ textAlign: "right" }}>Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr><td colSpan="4"><div className="empty" style={{ margin: 12 }}>No invoices yet.</div></td></tr>
                )}
                {payments.slice(0, 8).map((p, i) => (
                  <tr key={i}>
                    <td className="mono" style={{ fontSize: 12.5 }}>{p.invoice}</td>
                    <td className="mono" style={{ fontSize: 12.5 }}>{p.date}</td>
                    <td className="mono" style={{ textAlign: "right" }}>{fmtMoney(p.amount, p.currency || currency)}</td>
                    <td>
                      {p.status === "received"
                        ? <Pill kind="ok" dot>received</Pill>
                        : <Pill kind="warn" dot>outstanding</Pill>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Salesperson commission inline summary */}
          {salesperson && window.PPC.COMMISSION_RULES[salesperson] && (
            <div className="sub-card">
              <div className="sub-card-title">Sales commission · {window.PPC.userMap[salesperson]?.name.split(" ")[0]}</div>
              <div className="muted" style={{ fontSize: 12.5, marginBottom: 6 }}>
                Rules: {Math.round(window.PPC.COMMISSION_RULES[salesperson].firstMonth * 100)}% month 1 ·
                {" "}{Math.round(window.PPC.COMMISSION_RULES[salesperson].monthsTwoToSix * 100)}% months 2-6 ·
                {" "}{Math.round(window.PPC.COMMISSION_RULES[salesperson].afterSix * 100)}% after month 6
              </div>
              <div className="row gap-3" style={{ fontSize: 12.5 }}>
                <span>Lifetime tenure <span className="mono">{profile.lifetimeMos} mo</span></span>
                <span>Currently earning <span className="mono" style={{ color: "var(--accent)" }}>
                  {profile.lifetimeMos === 0 ? Math.round(window.PPC.COMMISSION_RULES[salesperson].firstMonth*100) + "%"
                    : profile.lifetimeMos < 6 ? Math.round(window.PPC.COMMISSION_RULES[salesperson].monthsTwoToSix*100) + "%"
                    : "0% (out of window)"}
                </span></span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Status history (from activity) */}
      <div className="label" style={{ marginBottom: 8, marginTop: 6 }}>Status history</div>
      <div className="sub-card">
        {(profile.activity || []).filter(a => a.text.includes("status") || a.text.includes("Status")).slice(0, 6).map((a, i) => (
          <div key={i} className="log-row" style={{ gridTemplateColumns: "10px 1fr auto", padding: "8px 0" }}>
            <div className="log-dot" style={{ background: "var(--ink-3)", marginLeft: 0 }} />
            <div style={{ fontSize: 13.5 }}>{a.text}</div>
            <span className="muted" style={{ fontSize: 12.5 }}>{a.when}</span>
          </div>
        ))}
        {(profile.activity || []).filter(a => a.text.includes("status") || a.text.includes("Status")).length === 0 && (
          <div className="muted" style={{ fontSize: 12.5 }}>No status changes yet — services have been steady since onboarding.</div>
        )}
      </div>
    </div>
  );
}

window.LifecycleTab = LifecycleTab;
