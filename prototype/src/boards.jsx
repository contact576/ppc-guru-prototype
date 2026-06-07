/* Onboarding + Active Clients kanban boards with full ownership/trigger engine */

function BoardScreen({ mode, role, setScreen }) {
  /* mode: "onboarding" | "active" */
  const store = useStore();
  const { userMap, SERVICE_INFO } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];
  const isOnboard = mode === "onboarding";

  const servicesAll = isOnboard ? ["meta","google","smm"] : ["meta","smm"];
  const visibleServices = servicesAll.filter(s => access.services.includes(s));
  const [service, setService] = React.useState(visibleServices[0] || "meta");

  React.useEffect(() => {
    if (!visibleServices.includes(service)) setService(visibleServices[0]);
  }, [role.id]);

  /* stages + cards source */
  const stages = isOnboard ? window.PPC.ONBOARD_STAGES[service] : window.PPC.ACTIVE_STAGES[service];
  const sourceCards = isOnboard ? window.PPC.ONB_CARDS : window.PPC.ACT_CARDS;

  /* maintain local state so drag updates apply */
  const [cards, setCards] = React.useState(() => sourceCards.filter(c => c.service === service));
  React.useEffect(() => {
    setCards(sourceCards.filter(c => c.service === service));
  }, [service, mode]);

  /* Status filter — active by default. Reads each card's contract status from
     the profile, falling back to "onboarding" for cards not yet promoted. */
  const [statusFilter, setStatusFilter] = React.useState(isOnboard ? "all" : "active");
  const getCardStatus = React.useCallback((card) => {
    const prof = window.PPC.PROFILES_RICH[card.name];
    const cs = prof?.serviceContracts?.[card.service]?.status;
    if (cs) return cs;
    return isOnboard ? "onboarding" : "active";
  }, [isOnboard]);

  /* Counts for each status bucket — based on all service cards */
  const statusCounts = React.useMemo(() => {
    const all = sourceCards.filter(c => c.service === service);
    return {
      all: all.length,
      active: all.filter(c => getCardStatus(c) === "active" || getCardStatus(c) === "onboarding").length,
      paused: all.filter(c => getCardStatus(c) === "paused").length,
      cancelled: all.filter(c => getCardStatus(c) === "cancelled").length
    };
  }, [sourceCards, service, getCardStatus]);

  const visibleCards = React.useMemo(() => {
    if (statusFilter === "all") return cards;
    if (statusFilter === "active") return cards.filter(c => {
      const s = getCardStatus(c);
      return s === "active" || s === "onboarding";
    });
    return cards.filter(c => getCardStatus(c) === statusFilter);
  }, [cards, statusFilter, getCardStatus]);

  const [mineOnly, setMineOnly] = React.useState(false);
  const [view, setView] = React.useState(isOnboard ? "board" : "board");  // active also supports "calendar"
  const [dragId, setDragId] = React.useState(null);
  const [dropStage, setDropStage] = React.useState(null);
  const [showDesignerPicker, setShowDesignerPicker] = React.useState(null);

  const stageById = Object.fromEntries(stages.map(s => [s.id, s]));

  /* helpers */
  const isMine = (card) => {
    const st = stageById[card.stage];
    if (!st) return false;
    if (card.override === role.id) return true;
    if (st.type === "designer" && card.designer === role.id) return true;
    if (Array.isArray(st.owner)) return st.owner.includes(role.id);
    return st.owner === role.id;
  };
  const isDimmed = (card) => {
    if (access.scope === "all") return false;
    if (access.scope === "designer") return !(stageById[card.stage]?.type === "designer");
    return !isMine(card) && mineOnly;
  };

  const onDragStart = (id) => setDragId(id);
  const onDragEnd   = () => { setDragId(null); setDropStage(null); };
  const onDropTo    = (stageId) => {
    if (!dragId) return;
    const card = cards.find(c => c.id === dragId);
    const from = stageById[card.stage];
    const to   = stageById[stageId];
    if (!to || from.id === to.id) return;

    setCards(prev => prev.map(c => {
      if (c.id !== dragId) return c;
      const next = { ...c, stage: stageId, days: 0, override: null };
      // designer stages clear designer assignment when entering — Creative Manager must assign
      if (to.type === "designer") next.designer = null;
      // entering Google "Onboarding & Access" doesn't block; flag clears at next stage
      if (to.id === "g4") next.accessPending = false;
      return next;
    }));

    // fire toast based on owner type
    let msg = "";
    if (to.type === "designer") {
      msg = `${card.name} → ${to.name}. Designer needed.`;
      window.toast(msg, { icon: "👤" });
      setShowDesignerPicker(dragId);
    } else if (to.type === "client") {
      msg = `${card.name} → ${to.name}. Waiting on client.`;
      window.toast(msg, { icon: "⏳" });
    } else if (to.type === "multi") {
      const owners = to.owner.map(o => o === "client" ? "Client" : userMap[o]?.name.split(" ")[0]).join(" + ");
      msg = `Assigned ${owners} · task + notification sent.`;
      window.toast(msg, { icon: "✓" });
    } else if (to.terminal) {
      msg = `${card.name} → Live. Graduates to Active Clients.`;
      window.toast(msg, { icon: "✦" });
    } else {
      const ownerUser = userMap[to.owner];
      msg = `Assigned ${ownerUser?.name.split(" ")[0]} · task + notification sent.`;
      window.toast(msg, { icon: "✓" });
    }
    onDragEnd();
  };

  const counts = stages.map(s => visibleCards.filter(c => c.stage === s.id).length);
  const totalMine = visibleCards.filter(isMine).length;
  const totalStuck = visibleCards.filter(c => c.days >= 5).length;
  const totalUnassigned = visibleCards.filter(c => stageById[c.stage]?.type === "designer" && !c.designer).length;

  return (
    <div>
      {/* page head */}
      <div className="page-head">
        <div>
          <div className="page-eyebrow">{isOnboard ? "New Client Pipeline" : "Recurring Monthly Loop"}</div>
          <h1 className="page-title">
            {isOnboard ? <span><em>Onboarding</em></span> : <span>Active <em>Clients</em></span>}
          </h1>
          <div className="page-sub">
            {isOnboard
              ? "Each card auto-assigns the stage's default owner when it lands. Drag to advance. Designer stages must be assigned manually."
              : "Monthly production loop. Cards cycle back to the top after Live each month."}
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost"><Icon k="filter" />Niche</button>
          <button className="btn" onClick={() => window.openNewClient?.()}><Icon k="plus" />New {isOnboard ? "onboarding" : "client"}</button>
        </div>
      </div>

      {/* Service chips + view toggle */}
      <div className="toolbar">
        <div className="chip-row">
          {visibleServices.map(s => {
            const c = sourceCards.filter(x => x.service === s).length;
            return (
              <span key={s}
                className={`chip ${service === s ? "active" : ""}`}
                onClick={() => setService(s)}>
                <span className="dot" style={{
                  width: 6, height: 6, borderRadius: 999,
                  background: SERVICE_INFO[s].color
                }} />
                {SERVICE_INFO[s].label}
                <span className="chip-count">{c}</span>
              </span>
            );
          })}
        </div>

        {!isOnboard && (
          <div className="seg">
            <button className={view === "board"    ? "on" : ""} onClick={() => setView("board")}>Board</button>
            <button className={view === "calendar" ? "on" : ""} onClick={() => setView("calendar")}>Calendar</button>
            <button className={view === "atlas"    ? "on" : ""} onClick={() => setView("atlas")}>Atlas</button>
          </div>
        )}

        <div className="sp" />

        {access.scope !== "all" && access.scope !== "designer" && (
          <label className="row gap-2" style={{ fontSize: 12.5, color: "var(--ink-3)", cursor: "pointer" }}>
            <input type="checkbox" checked={mineOnly} onChange={e => setMineOnly(e.target.checked)} />
            Mine only
          </label>
        )}

        <div className="row gap-3" style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
          <span><span className="mono" style={{ color: "var(--ink)" }}>{visibleCards.length}</span> cards</span>
          {totalStuck > 0 && <span style={{ color: "var(--danger)" }}><span className="mono">{totalStuck}</span> stuck</span>}
          {totalUnassigned > 0 && <span style={{ color: "var(--accent-2)" }}><span className="mono">{totalUnassigned}</span> need designer</span>}
        </div>
      </div>

      {/* Status filter row */}
      <div className="row" style={{ marginTop: -4, marginBottom: 14, gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span className="label" style={{ fontSize: 11.5 }}>Status</span>
        {[
          { id: "all", label: "All", count: statusCounts.all },
          { id: "active", label: "Active", count: statusCounts.active },
          { id: "paused", label: "Paused", count: statusCounts.paused },
          { id: "cancelled", label: "Cancelled", count: statusCounts.cancelled }
        ].map(f => {
          const def = f.id === "all" ? null : window.PPC.STATUS_DEFS[f.id];
          return (
            <span key={f.id}
              className={`chip-pick ${statusFilter === f.id ? "on" : ""}`}
              style={statusFilter === f.id && def ? { background: def.color, borderColor: def.color, color: "#fff" } : {}}
              onClick={() => setStatusFilter(f.id)}>
              {def && <span style={{ width: 6, height: 6, borderRadius: 999, background: statusFilter === f.id ? "#fff" : def.color }} />}
              {f.label}
              <span className="mono" style={{ fontSize: 11.5, opacity: 0.7 }}>{f.count}</span>
            </span>
          );
        })}
        {(statusFilter === "paused" || statusFilter === "cancelled") && (
          <span className="muted" style={{ fontSize: 12.5, marginLeft: 6 }}>
            ↳ Read-only view. Cards stay searchable here; profile + history still accessible.
          </span>
        )}
      </div>

      {/* Board */}
      {view === "board" && (
        <div className="kanban">
          {stages.map((st, i) => {
            const colCards = visibleCards.filter(c => c.stage === st.id);
            const colClass = `kanban-col ${st.type === "client" ? "col-client" : ""} ${st.type === "designer" ? "col-designer" : ""} ${dropStage === st.id ? "drop" : ""}`;
            const ownerEl = renderOwnerBadge(st, userMap);
            return (
              <div
                key={st.id}
                className={colClass}
                onDragOver={e => { e.preventDefault(); setDropStage(st.id); }}
                onDragLeave={() => setDropStage(s => s === st.id ? null : s)}
                onDrop={() => onDropTo(st.id)}
              >
                <div className="kanban-col-head">
                  <span className="stage-num">{String(i+1).padStart(2,"0")}</span>
                  <div style={{ flex: 1 }}>
                    <div className="kanban-col-title">{st.name}</div>
                    <div className="kanban-col-owner">{ownerEl}</div>
                  </div>
                  <span className="kanban-col-count">{counts[i]}</span>
                </div>
                <div className="kanban-col-body">
                  {colCards.map(card => (
                    <BoardCard
                      key={card.id}
                      card={card}
                      stage={st}
                      mine={isMine(card)}
                      dim={isDimmed(card)}
                      isDragging={dragId === card.id}
                      onDragStart={() => onDragStart(card.id)}
                      onDragEnd={onDragEnd}
                      onOpen={() => window.openClientPanel?.(card.id)}
                      onAssignDesigner={() => setShowDesignerPicker(card.id)}
                      access={access}
                      role={role}
                    />
                  ))}
                  {colCards.length === 0 && (
                    <div style={{ fontSize: 12.5, color: "var(--ink-4)", textAlign: "center", padding: "6px 0" }}>—</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "calendar" && <MonthlyCalendar service={service} cards={cards} stages={stages} />}
      {view === "atlas"    && <Atlas service={service} cards={cards} stages={stages} userMap={userMap} />}

      {/* designer picker modal */}
      {showDesignerPicker && (
        <DesignerPicker
          cardId={showDesignerPicker}
          card={cards.find(c => c.id === showDesignerPicker)}
          onPick={(designerId) => {
            setCards(prev => prev.map(c => c.id === showDesignerPicker ? { ...c, designer: designerId } : c));
            window.toast(`Assigned ${userMap[designerId].name.split(" ")[0]} · task + notification sent.`, { icon: "✓" });
            setShowDesignerPicker(null);
          }}
          onClose={() => setShowDesignerPicker(null)}
        />
      )}

    </div>
  );
}

function renderOwnerBadge(st, userMap) {
  if (st.type === "client") {
    return (
      <>
        <span className="stage-pill-client">CLIENT</span>
        <span>waiting on approval</span>
      </>
    );
  }
  if (st.type === "designer") {
    return (
      <>
        <span style={{
          background: "var(--accent-tint)", color: "var(--accent-2)",
          fontSize: 11.5, padding: "1px 6px", borderRadius: 4, fontWeight: 500
        }}>DESIGNER</span>
        <span>manual assign</span>
      </>
    );
  }
  if (st.type === "multi") {
    return (
      <>
        <div className="avatar-stack">
          {st.owner.map(o => {
            if (o === "client") return <span key="client" className="avatar sm" style={{ background: "var(--client-tint)", color: "var(--client)" }}>•</span>;
            const u = userMap[o];
            return <Avatar key={o} user={u} size="sm" />;
          })}
        </div>
        <span>{st.owner.map(o => o === "client" ? "Client" : userMap[o]?.name.split(" ")[0]).join(" + ")}</span>
      </>
    );
  }
  const u = userMap[st.owner];
  return (
    <>
      <Avatar user={u} size="sm" />
      <span>{u?.name.split(" ")[0]}</span>
      {st.nonBlocking && <span className="pill outline" style={{ marginLeft: 4, fontSize: 11.5, padding: "1px 5px" }}>non-blocking</span>}
    </>
  );
}

function BoardCard({ card, stage, mine, dim, isDragging, onDragStart, onDragEnd, onOpen, onAssignDesigner, access, role }) {
  const { userMap } = window.PPC;
  const ageCls = ageClass(card.days, stage.type);
  const showMoney = access.money && card.mrr;

  // current effective owner
  let ownerEl = null;
  if (stage.type === "designer") {
    if (card.designer) {
      const u = userMap[card.designer];
      ownerEl = <Avatar user={u} size="sm" title={`Designer · ${u.name}`} />;
    }
  } else if (stage.type === "client") {
    ownerEl = <span className="avatar sm" style={{ background: "var(--client-tint)", color: "var(--client)" }} title="Client">•</span>;
  } else if (Array.isArray(stage.owner)) {
    ownerEl = (
      <div className="avatar-stack">
        {stage.owner.map(o => {
          if (o === "client") return <span key="c" className="avatar sm" style={{ background: "var(--client-tint)", color: "var(--client)" }}>•</span>;
          return <Avatar key={o} user={userMap[o]} size="sm" />;
        })}
      </div>
    );
  } else {
    const ovId = card.override;
    const u = userMap[ovId || stage.owner];
    ownerEl = u ? <Avatar user={u} size="sm" title={u.name + (ovId ? " (manual override)" : "")} /> : null;
  }

  return (
    <div
      className={`kanban-card ${isDragging ? "dragging" : ""} ${mine ? "mine" : ""} ${dim ? "dim" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
    >
      <div className="row gap-2" style={{ alignItems: "flex-start" }}>
        <div className="kanban-card-name" style={{ flex: 1 }}>{card.name}</div>
        {ownerEl}
      </div>

      <div className="kanban-card-meta">
        <span className="muted-2">{card.niche}</span>
        <span style={{ flex: 1 }} />
        <span className={`age ${ageCls}`}>
          {card.days === 0 ? "new" : `${card.days}d`}
        </span>
      </div>

      {/* flags */}
      <div className="kanban-card-flags">
        {card.override && stage.type === "team" && (
          <Pill kind="outline">↪ manual: {userMap[card.override]?.name.split(" ")[0]}</Pill>
        )}
        {card.accessPending && (
          <Pill kind="warn" dot>access pending</Pill>
        )}
        {card.blocker && (
          <Pill kind="danger" dot>{card.blocker}</Pill>
        )}
        {stage.type === "designer" && !card.designer && (
          <button
            className="assign-prompt"
            onClick={(e) => { e.stopPropagation(); onAssignDesigner(); }}
            style={{ width: "100%", border: "1px dashed var(--accent)", background: "var(--accent-tint)", color: "var(--accent-2)", borderRadius: 6, padding: "4px 6px", fontSize: 12.5, cursor: "pointer" }}
          >
            + Assign designer
          </button>
        )}
        {showMoney && (
          <Pill kind="outline" >{fmtMoney(card.mrr, card.currency)} <span style={{ opacity: .6 }}>·{card.currency}</span></Pill>
        )}
        {card.service === "smm" && (() => {
          const plan = window.PPC.CONTENT_PLANS?.find(p => p.client === card.name && p.month === "2026-06");
          if (!plan) return null;
          const pct = window.PPC.planProgress(plan);
          const tone = pct === 100 ? "ok" : pct >= 50 ? "warn" : "danger";
          return (
            <Pill kind={tone} dot title={`Jun plan · ${window.PPC.planLabel(plan.status)}`}>
              Jun · {pct}%
            </Pill>
          );
        })()}
      </div>
    </div>
  );
}

function DesignerPicker({ card, onPick, onClose }) {
  const { userMap } = window.PPC;
  return (
    <>
      <div className="panel-scrim open" onClick={onClose} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: "var(--card)", border: "1px solid var(--line)",
        borderRadius: 14, padding: 22, minWidth: 360,
        boxShadow: "var(--sh-pop)", zIndex: 90
      }}>
        <div className="label" style={{ marginBottom: 6 }}>Assign designer</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 19, marginBottom: 2 }}>{card?.name}</div>
        <div className="muted" style={{ fontSize: 12.5, marginBottom: 16 }}>
          Designer stages are manual. Picking now fires a notification + task.
        </div>
        <div className="col gap-2">
          {["rayu","aadil"].map(id => {
            const u = userMap[id];
            const cap = window.PPC.CAPACITY[id];
            const pct = Math.min(100, (cap.hours / cap.max) * 100);
            const tone = cap.hours >= cap.max ? "danger" : cap.hours >= cap.max * 0.85 ? "warn" : "ok";
            return (
              <button
                key={id}
                onClick={() => onPick(id)}
                className="btn"
                style={{ justifyContent: "flex-start", padding: 10, gap: 10 }}
              >
                <Avatar user={u} size="lg" />
                <div className="col" style={{ alignItems: "flex-start", flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{u.name}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>{u.role}</span>
                </div>
                <div className="col" style={{ alignItems: "flex-end", minWidth: 110 }}>
                  <span className="mono" style={{ fontSize: 12.5 }}>{cap.hours}/{cap.max} h</span>
                  <div className={`bar ${tone}`} style={{ width: 80, marginTop: 4 }}>
                    <i style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
}

/* Monthly content calendar — Active only */
function MonthlyCalendar({ service, cards, stages }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const dotColor = (st) => st?.type === "client" ? "var(--client)" : st?.type === "designer" ? "var(--accent)" : "var(--ok)";
  const stageById = Object.fromEntries(stages.map(s => [s.id, s]));

  return (
    <div className="widget" style={{ padding: 0 }}>
      <div className="row" style={{ padding: 14, borderBottom: "1px solid var(--line)" }}>
        <span className="section-title" style={{ flex: 1 }}>November 2025 · Production cadence</span>
        <span className="muted" style={{ fontSize: 12.5 }}>One row per client · each dot = a scheduled deliverable</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `200px repeat(30, 1fr)`, fontSize: 12.5, color: "var(--ink-4)" }}>
        <div style={{ padding: "8px 10px" }}>Client</div>
        {days.map(d => (
          <div key={d} style={{ textAlign: "center", padding: "8px 0", borderLeft: "1px solid var(--line-2)" }}>
            {d}
          </div>
        ))}
        {cards.map((c, i) => {
          const st = stageById[c.stage];
          // create some "scheduled" dots
          const scheduled = c.service === "smm"
            ? [3, 7, 12, 17, 22, 27]
            : [5, 14, 24];
          return (
            <React.Fragment key={c.id}>
              <div style={{ padding: "10px", borderTop: "1px solid var(--line-2)", color: "var(--ink-2)", fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}>
                {c.name}
                <span className="muted-2" style={{ fontSize: 11.5, marginLeft: "auto" }}>{c.service === "smm" ? "6/mo" : "3/mo"}</span>
              </div>
              {days.map(d => (
                <div key={d} style={{ borderTop: "1px solid var(--line-2)", borderLeft: "1px solid var(--line-2)", height: 36, position: "relative" }}>
                  {scheduled.includes(d) && (
                    <div style={{
                      position: "absolute", inset: 0, margin: "auto",
                      width: 10, height: 10, borderRadius: 3,
                      background: dotColor(st),
                      top: "50%", left: "50%", transform: "translate(-50%,-50%)"
                    }} title={`Day ${d} · ${st?.name}`} />
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
      <div className="row gap-3" style={{ padding: 12, borderTop: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-3)" }}>
        <span className="row gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--ok)" }} />In production</span>
        <span className="row gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--accent)" }} />Designer</span>
        <span className="row gap-2"><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--client)" }} />Client approval</span>
      </div>
    </div>
  );
}

/* "Atlas" — single glance: every active client's where-are-they-this-month */
function Atlas({ service, cards, stages, userMap }) {
  return (
    <div className="widget">
      <div className="widget-head">
        <span className="widget-title">All Live Clients — where are they this month</span>
        <span className="widget-action">{cards.length} clients</span>
      </div>
      <table className="t">
        <thead>
          <tr>
            <th>Client</th><th>Stage</th><th>Owner</th><th>Days</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(c => {
            const st = stages.find(s => s.id === c.stage);
            return (
              <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => window.openClientPanel?.(c.id)}>
                <td><span style={{ fontWeight: 500, color: "var(--accent)" }}>{c.name}</span> <span className="muted" style={{ fontSize: 12.5 }}>· {c.niche}</span></td>
                <td>{st?.name}</td>
                <td>
                  {st?.type === "designer" && c.designer
                    ? <Avatar user={userMap[c.designer]} size="sm" />
                    : st?.type === "client"
                      ? <Pill kind="client">Client</Pill>
                      : Array.isArray(st?.owner)
                        ? <div className="avatar-stack">{st.owner.map(o => o === "client" ? <span key="c" className="avatar sm" style={{ background: "var(--client-tint)", color: "var(--client)" }}>•</span> : <Avatar key={o} user={userMap[o]} size="sm" />)}</div>
                        : <Avatar user={userMap[st?.owner]} size="sm" />
                  }
                </td>
                <td><span className={`mono age ${ageClass(c.days, st?.type)}`}>{c.days}d</span></td>
                <td className="muted" style={{ fontSize: 12.5 }}>{c.blocker || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

window.BoardScreen = BoardScreen;
