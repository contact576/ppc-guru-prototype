/* Admin — Users & Roles + Service Catalog (visual stage editor) */

function UsersScreen() {
  const { USERS, ROLE_ACCESS, SERVICE_INFO } = window.PPC;
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Admin</div>
          <h1 className="page-title">Users <em>&amp; Roles</em></h1>
          <div className="page-sub">Manage accounts and what each role can see. Designers see only their production stages; sales sees the funnel.</div>
        </div>
        <button className="btn"><Icon k="plus" />Invite user</button>
      </div>

      <div className="widget" style={{ padding: 0, marginBottom: 14 }}>
        <table className="t">
          <thead><tr><th>Person</th><th>Role</th><th>Meta</th><th>Google</th><th>SMM</th><th>Sees money</th><th>Scope</th><th></th></tr></thead>
          <tbody>
            {USERS.filter(u => u.id !== "client").map(u => {
              const a = ROLE_ACCESS[u.id];
              return (
                <tr key={u.id}>
                  <td>
                    <div className="row gap-2">
                      <Avatar user={u} />
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="muted">{u.role}</td>
                  <td>{a?.services.includes("meta")   ? <Pill kind="ok">✓</Pill> : <Pill kind="outline">—</Pill>}</td>
                  <td>{a?.services.includes("google") ? <Pill kind="ok">✓</Pill> : <Pill kind="outline">—</Pill>}</td>
                  <td>{a?.services.includes("smm")    ? <Pill kind="ok">✓</Pill> : <Pill kind="outline">—</Pill>}</td>
                  <td>{a?.money ? <Pill kind="accent">owner-only</Pill> : <Pill kind="outline">no</Pill>}</td>
                  <td><Pill kind="outline">{a?.scope}</Pill></td>
                  <td><button className="btn sm ghost"><Icon k="more" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="widget">
        <div className="widget-head">
          <span className="widget-title">Access logic</span>
        </div>
        <div className="grid-3">
          <div className="col gap-2">
            <div className="label">Service visibility</div>
            <div className="muted" style={{ fontSize: 12.5 }}>Hides a service entirely from a user's sidebar and boards.</div>
          </div>
          <div className="col gap-2">
            <div className="label">Within-board scope</div>
            <div className="muted" style={{ fontSize: 12.5 }}>"All" = see everything. "Mine" = own cards highlighted, others dimmed. "Designer" = only production stages.</div>
          </div>
          <div className="col gap-2">
            <div className="label">Money</div>
            <div className="muted" style={{ fontSize: 12.5 }}>Owner-only. Revenue, MRR, budget and CPA dollars are hidden everywhere else.</div>
          </div>
        </div>
      </div>

      <LocalMemoryCard />
    </div>
  );
}

/* Memory status: local (localStorage) + cloud sync code (Netlify Blobs) — Admin */
function LocalMemoryCard() {
  useStore();
  const [code, setCode] = React.useState("");
  const [show, setShow] = React.useState(false);
  const info = window.PPC.persistInfo ? window.PPC.persistInfo() : null;
  if (!info) return null;
  const when = info.lastSaved ? new Date(info.lastSaved).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
  const sync = info.syncCode || "";
  const masked = sync ? sync.slice(0, 4) + "••••••••" + sync.slice(-4) : "—";
  const cloudTone = info.cloud === "connected" ? "ok" : info.cloud && info.cloud.indexOf("offline") === 0 ? "warn" : "outline";
  const copy = () => { try { navigator.clipboard.writeText(sync); window.toast?.("Sync code copied", { icon: "✓" }); } catch (e) {} };
  const load = () => {
    const c = code.trim();
    if (c.length < 12) { window.toast?.("Paste a full sync code (it's long).", { icon: "!" }); return; }
    if (window.confirm("Load the data saved under that sync code? This device will switch to that data set.")) window.PPC.setSyncCode(c);
  };
  const reset = () => {
    if (window.confirm("Reset all data back to the seeded state? Your saved changes (tasks, projects, notes, sales moves) will be cleared on this device and in the cloud for this sync code.")) {
      window.PPC.resetDemoData();
    }
  };
  return (
    <div className="widget" style={{ padding: "16px 18px" }}>
      <div className="row" style={{ alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
        <div className="col" style={{ flex: 1, gap: 4 }}>
          <span className="section-title">Memory &amp; sync</span>
          <span className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
            Your changes save to <strong>this browser</strong> instantly and to the <strong>cloud</strong> under your private
            sync code — so your data follows you across devices. Tasks, projects, notes, sales moves, optimization logs, content plans.
            {" "}Last saved: <span className="mono">{when}</span>{info.restoredOnBoot ? " · restored this session" : ""}.
          </span>
        </div>
        <Pill kind={cloudTone} dot>{info.cloud}</Pill>
      </div>

      <div className="sub-card" style={{ marginBottom: 12 }}>
        <div className="sub-card-title">Your sync code — keep it private</div>
        <div className="row gap-2" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 13, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, padding: "5px 9px" }}>{show ? sync : masked}</span>
          <button className="btn sm ghost" onClick={() => setShow(s => !s)}>{show ? "Hide" : "Reveal"}</button>
          <button className="btn sm" onClick={copy}><Icon k="link" className="ic sm" />Copy</button>
          <span className="muted" style={{ fontSize: 12 }}>Paste this on another device (below) to load the same data.</span>
        </div>
      </div>

      <div className="sub-card" style={{ marginBottom: 12 }}>
        <div className="sub-card-title">Use data from another device</div>
        <div className="row gap-2" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <TextInput placeholder="Paste a sync code…" value={code} onChange={e => setCode(e.target.value)} style={{ maxWidth: 320 }} />
          <button className="btn sm" onClick={load}>Load that data</button>
        </div>
      </div>

      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn ghost" onClick={reset}><Icon k="refresh" className="ic sm" />Reset data</button>
      </div>
    </div>
  );
}

function CatalogScreen() {
  const { SERVICE_INFO, userMap } = window.PPC;
  const [service, setService] = React.useState("meta");
  const [board, setBoard] = React.useState("onboarding"); // or active

  /* local copy so user can drag/edit */
  const initial = board === "onboarding"
    ? window.PPC.ONBOARD_STAGES[service] || []
    : window.PPC.ACTIVE_STAGES[service] || [];
  const [stages, setStages] = React.useState(initial);
  React.useEffect(() => {
    setStages(board === "onboarding"
      ? window.PPC.ONBOARD_STAGES[service]
      : (window.PPC.ACTIVE_STAGES[service] || []));
  }, [service, board]);

  const [dragIdx, setDragIdx] = React.useState(null);
  const move = (from, to) => {
    setStages(prev => {
      const arr = [...prev];
      const [it] = arr.splice(from, 1);
      arr.splice(to, 0, it);
      return arr;
    });
    window.toast("Stage reordered · all live cards will re-route.", { icon: "⇅" });
  };

  const updateOwner = (i, ownerId) => {
    setStages(prev => prev.map((s, j) => j === i ? { ...s, owner: ownerId, type: ownerId === "client" ? "client" : "team" } : s));
    window.toast("Default owner updated · new entries auto-assign.", { icon: "✓" });
  };

  const typeBadge = (t) =>
    t === "client"   ? <Pill kind="client">Client</Pill>
    : t === "designer" ? <Pill kind="accent">Designer</Pill>
    : t === "multi"  ? <Pill kind="outline">Multi</Pill>
    : <Pill kind="ok">Team</Pill>;

  const availableBoards = service === "google"
    ? [{ id: "onboarding", label: "Onboarding" }]
    : [{ id: "onboarding", label: "Onboarding" }, { id: "active", label: "Active Monthly" }];

  React.useEffect(() => {
    if (!availableBoards.find(b => b.id === board)) setBoard("onboarding");
  }, [service]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Engine room</div>
          <h1 className="page-title">Service <em>Catalog</em></h1>
          <div className="page-sub">
            Single source of truth: stages, default owners, owner-type per service. Reordering here re-routes every live card. Be careful.
          </div>
        </div>
        <button className="btn"><Icon k="plus" />Add service</button>
      </div>

      <div className="toolbar">
        <div className="chip-row">
          {["meta","google","smm"].map(s => (
            <span key={s}
              className={`chip ${service === s ? "active" : ""}`}
              onClick={() => setService(s)}>
              <span className="dot" style={{ width: 6, height: 6, borderRadius: 999, background: SERVICE_INFO[s].color }} />
              {SERVICE_INFO[s].label}
            </span>
          ))}
        </div>
        <div className="seg">
          {availableBoards.map(b => (
            <button key={b.id} className={board === b.id ? "on" : ""} onClick={() => setBoard(b.id)}>{b.label}</button>
          ))}
        </div>
        <div className="sp" />
        <span className="muted" style={{ fontSize: 12.5 }}>{stages.length} stages</span>
        <button className="btn ghost"><Icon k="plus" />Add stage</button>
      </div>

      <div className="widget" style={{ padding: 0 }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <div className="row" style={{ fontSize: 12.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: ".1em" }}>
            <span style={{ width: 28 }}></span>
            <span style={{ width: 30 }}>#</span>
            <span style={{ flex: 1 }}>Stage</span>
            <span style={{ width: 180 }}>Default owner</span>
            <span style={{ width: 100 }}>Type</span>
            <span style={{ width: 80, textAlign: "right" }}>Auto</span>
          </div>
        </div>
        <div>
          {stages.map((s, i) => (
            <div key={s.id}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragIdx !== null && dragIdx !== i) move(dragIdx, i); setDragIdx(null); }}
              className="row"
              style={{
                padding: "12px 18px",
                borderBottom: "1px dashed var(--line-2)",
                gap: 14,
                background: dragIdx === i ? "var(--accent-tint)" : "transparent"
              }}>
              <span style={{ width: 28, color: "var(--ink-4)", cursor: "grab" }}><Icon k="drag" /></span>
              <span style={{ width: 30 }} className="mono muted">{String(i+1).padStart(2,"0")}</span>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>
                {s.name}
                {s.nonBlocking && <span className="pill outline" style={{ marginLeft: 8 }}>non-blocking</span>}
                {s.terminal && <span className="pill ok" style={{ marginLeft: 8 }}>terminal</span>}
              </span>
              <div style={{ width: 180 }}>
                {s.type === "designer" ? (
                  <Pill kind="accent">Manual — designer pool</Pill>
                ) : s.type === "client" ? (
                  <Pill kind="client">Client</Pill>
                ) : Array.isArray(s.owner) ? (
                  <div className="avatar-stack">
                    {s.owner.map(o => o === "client"
                      ? <span key="c" className="avatar sm" style={{ background: "var(--client-tint)", color: "var(--client)" }}>•</span>
                      : <Avatar key={o} user={userMap[o]} size="sm" />
                    )}
                  </div>
                ) : (
                  <select
                    value={s.owner}
                    onChange={e => updateOwner(i, e.target.value)}
                    style={{
                      background: "var(--card-2)", border: "1px solid var(--line)",
                      borderRadius: 6, padding: "4px 8px", fontSize: 12.5, color: "var(--ink)"
                    }}>
                    {["abhishek","vihar","vanshika","harsh","client"].map(o => (
                      <option key={o} value={o}>{o === "client" ? "Client" : userMap[o]?.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <span style={{ width: 100 }}>{typeBadge(s.type)}</span>
              <span style={{ width: 80, textAlign: "right" }}>
                {s.type === "designer" || s.type === "client"
                  ? <Pill kind="outline">manual</Pill>
                  : <Pill kind="ok">auto</Pill>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>
        Drag rows to reorder. Changing a default owner auto-assigns the new person on the next card entering that stage.
      </div>
    </div>
  );
}

Object.assign(window, { UsersScreen, CatalogScreen });
