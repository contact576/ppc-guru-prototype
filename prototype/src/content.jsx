/* ─────────────────────────────────────────────────────────────────
   Content Studio — primary home for SMM monthly workflow.
   - Plans grid: clients × months (status + production %)
   - Calendar: per-client month grid + all-clients heatmap (toggle)
   - Plan panel: deliverables list with per-piece status + editor pick
   ───────────────────────────────────────────────────────────────── */

function ContentStudioScreen({ role }) {
  const store = useStore();
  const { CONTENT_PLANS, SMM_QUOTAS, PLAN_STAGES, monthLabel, planProgress, prevMonth, nextMonth } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];

  const TODAY_MONTH = "2026-05";
  const NEXT_MONTH  = nextMonth(TODAY_MONTH);
  const PLUS_TWO    = nextMonth(NEXT_MONTH);

  const [view, setView]   = React.useState("plans"); // plans | calendar
  const [focusMonth, setFocusMonth] = React.useState(NEXT_MONTH);
  const [openedPlanId, setOpenedPlanId] = React.useState(null);
  const [calMode, setCalMode] = React.useState("all");      // all | single
  const [calClient, setCalClient] = React.useState(Object.keys(SMM_QUOTAS)[0]);

  const months = [prevMonth(TODAY_MONTH), TODAY_MONTH, NEXT_MONTH, PLUS_TWO];

  // hard-rule readiness for next month
  const nextMonthPlans = CONTENT_PLANS.filter(p => p.month === NEXT_MONTH);
  const nextMonthReady = nextMonthPlans.filter(p =>
    p.status === "scheduled" || p.status === "approved" || p.status === "live"
  ).length;
  const nextMonthTotal = Object.keys(SMM_QUOTAS).length;
  const nextMonthBehind = nextMonthTotal - nextMonthReady;
  const nextMonthPct = Math.round((nextMonthReady / nextMonthTotal) * 100);

  // pick the openedPlan now (used by panel)
  const openedPlan = openedPlanId ? CONTENT_PLANS.find(p => p.id === openedPlanId) : null;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Social Media Management · always one month ahead</div>
          <h1 className="page-title">Content <em>Studio</em></h1>
          <div className="page-sub">
            Plan each client's month, get it client-approved, hand pieces to editors, ship — and keep next month locked before the 25th.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost"><Icon k="filter" />All clients</button>
          <button className="btn" onClick={() => window.toast?.("New plan flow — wire later", { icon: "+" })}>
            <Icon k="plus" />New plan
          </button>
        </div>
      </div>

      {/* Hard-rule readiness strip */}
      <HardRuleStrip
        nextMonth={NEXT_MONTH}
        ready={nextMonthReady} total={nextMonthTotal} pct={nextMonthPct} behind={nextMonthBehind}
        onFocus={() => { setView("plans"); setFocusMonth(NEXT_MONTH); }}
      />

      {/* Toolbar: view toggle + month focus */}
      <div className="toolbar" style={{ marginTop: 14 }}>
        <div className="seg">
          <button className={view==="plans"   ? "on" : ""} onClick={() => setView("plans")}>Plans grid</button>
          <button className={view==="calendar"? "on" : ""} onClick={() => setView("calendar")}>Calendar</button>
        </div>
        <div className="sp" />
        {view === "calendar" && (
          <>
            <div className="seg">
              <button className={calMode==="all"    ? "on" : ""} onClick={() => setCalMode("all")}>All clients · heatmap</button>
              <button className={calMode==="single" ? "on" : ""} onClick={() => setCalMode("single")}>Per client</button>
            </div>
            {calMode === "single" && (
              <SelectInput value={calClient} onChange={e => setCalClient(e.target.value)} style={{ minWidth: 220 }}>
                {Object.keys(SMM_QUOTAS).map(c => <option key={c}>{c}</option>)}
              </SelectInput>
            )}
          </>
        )}
        <div className="row gap-2" style={{ marginLeft: 14 }}>
          <span className="muted-2" style={{ fontSize: 12.5 }}>Focus</span>
          <div className="chip-row">
            {months.map(m => (
              <span key={m}
                className={`chip ${focusMonth === m ? "active" : ""}`}
                onClick={() => setFocusMonth(m)}>
                {monthLabel(m)}
                {m === NEXT_MONTH && <span className="chip-count">next</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {view === "plans" && (
        <PlansGrid
          months={months} todayMonth={TODAY_MONTH} nextMonthId={NEXT_MONTH}
          plans={CONTENT_PLANS}
          quotas={SMM_QUOTAS}
          focusMonth={focusMonth}
          onOpen={(id) => setOpenedPlanId(id)}
        />
      )}

      {view === "calendar" && calMode === "all" && (
        <AllClientsHeatmap plans={CONTENT_PLANS} month={focusMonth} clients={Object.keys(SMM_QUOTAS)} onOpenDeliv={(planId, delivId) => setOpenedPlanId(planId)} />
      )}

      {view === "calendar" && calMode === "single" && (
        <PerClientCalendar plans={CONTENT_PLANS} client={calClient} month={focusMonth} onOpen={(id) => setOpenedPlanId(id)} />
      )}

      {/* below-the-grid: workload + month-by-month summary */}
      {view === "plans" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginTop: 14 }}>
          <ProductionSummary month={focusMonth} plans={CONTENT_PLANS.filter(p => p.month === focusMonth)} />
          <EditorWorkloadCard plans={CONTENT_PLANS.filter(p => p.month === focusMonth || p.month === NEXT_MONTH)} />
        </div>
      )}

      <PlanPanel plan={openedPlan} role={role} onClose={() => setOpenedPlanId(null)} />
    </div>
  );
}

/* ─── Hard-rule strip (the May-25 alert) ─── */
function HardRuleStrip({ nextMonth, ready, total, pct, behind, onFocus }) {
  const { monthLabel } = window.PPC;
  const today = new Date().getDate(); // pretend today is 25th since system info says May 25
  const ruleDay = 25;
  const daysToRule = ruleDay - today;
  const tone = behind > 0 ? "danger" : "ok";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16,
      padding: "14px 18px",
      background: tone === "danger" ? "var(--danger-tint)" : "var(--ok-tint)",
      border: `1px solid ${tone === "danger" ? "var(--danger)" : "var(--ok)"}`,
      borderRadius: var_("--r-3"),
      alignItems: "center",
      marginBottom: 4
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 999,
        background: tone === "danger" ? "var(--danger)" : "var(--ok)",
        color: "#fff",
        display: "grid", placeItems: "center"
      }}>
        <Icon k={tone === "danger" ? "alert" : "check"} className="ic lg" />
      </div>
      <div>
        <div style={{ fontSize: 12.5, color: tone === "danger" ? "var(--danger)" : "var(--ok)", textTransform: "uppercase", letterSpacing: ".14em", fontWeight: 600 }}>
          Hard rule · {monthLabel(nextMonth)} must be 100% scheduled by the 25th
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 19, color: "var(--ink)", marginTop: 2 }}>
          {behind > 0
            ? <><em style={{ color: "var(--danger)" }}>{behind} client{behind>1?"s":""} behind.</em> {ready}/{total} ready. We are on day {today}.</>
            : <>All {total} clients scheduled. Next month is locked in.</>}
        </div>
        <div style={{ height: 4, background: "rgba(0,0,0,.08)", borderRadius: 999, marginTop: 8, maxWidth: 480 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: tone === "danger" ? "var(--danger)" : "var(--ok)", borderRadius: 999, transition: "width .3s" }} />
        </div>
      </div>
      <div className="row gap-2">
        <button className="btn" onClick={onFocus}>Show me</button>
      </div>
    </div>
  );
}
function var_(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

/* ─── Plans grid: clients × months ─── */
function PlansGrid({ months, todayMonth, nextMonthId, plans, quotas, focusMonth, onOpen }) {
  const { PLAN_STAGES, planProgress, monthLabel, monthShort } = window.PPC;
  const clients = Object.keys(quotas);

  return (
    <div className="studio-grid" style={{ "--studio-cols": months.length }}>
      <div className="h">Client</div>
      {months.map(m => (
        <div className="h" key={m}>
          {monthShort(m)} <span className="muted-2" style={{ fontSize: 11.5, fontWeight: 400 }}>
            {m === todayMonth ? "· current" : m === nextMonthId ? "· next" : ""}
          </span>
        </div>
      ))}
      {clients.map(client => (
        <React.Fragment key={client}>
          <div className="r">
            <span style={{ fontWeight: 500, fontSize: 13.5, cursor: "pointer", color: "var(--ink)" }}
              onClick={() => window.openClientPanel?.(client)}>
              {client}
            </span>
            <span className="muted-2" style={{ fontSize: 12.5 }}>
              {quotas[client].reels} reels · {quotas[client].statics} statics · {quotas[client].postingDays}
            </span>
          </div>
          {months.map(m => {
            const plan = plans.find(p => p.client === client && p.month === m);
            if (!plan) {
              return <div className="c empty" key={m} title="No plan yet" />;
            }
            const stage = PLAN_STAGES.find(s => s.id === plan.status);
            const pct = planProgress(plan);
            const highlight = m === focusMonth;
            return (
              <div className="c" key={m} onClick={() => onOpen(plan.id)}
                style={highlight ? { boxShadow: "inset 0 0 0 2px var(--accent)" } : null}>
                <div className="plan-cell">
                  <div className="row gap-2">
                    <span className="plan-pill" style={{ background: hexA(stage.color, .14), color: stage.color }}>
                      <span className="d" style={{ background: stage.color }} />
                      {stage.label}
                    </span>
                  </div>
                  <div className="muted-2" style={{ fontSize: 12.5 }}>
                    {plan.deliverables.length} pieces · {plan.deliverables.filter(d=>d.type==="reel").length}R / {plan.deliverables.filter(d=>d.type==="static").length}S
                  </div>
                  <div className="progress-row">
                    <div className={`bar ${pct === 100 ? "ok" : pct >= 70 ? "" : "warn"}`}><i style={{ width: `${pct}%` }} /></div>
                    <span className="pct">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── All-clients heatmap (rows = clients, cols = 1..30/31 days) ─── */
function AllClientsHeatmap({ plans, month, clients, onOpenDeliv }) {
  const days = window.PPC.monthDaysIn(month);
  const dayArr = Array.from({ length: days }, (_, i) => i + 1);
  return (
    <div className="heatmap" style={{ gridTemplateColumns: `170px repeat(${days}, 1fr)` }}>
      <div className="hh" style={{ background: "transparent", border: 0 }} />
      {dayArr.map(d => <div key={d} className="hh">{d}</div>)}
      {clients.map(c => {
        const plan = plans.find(p => p.client === c && p.month === month);
        return (
          <React.Fragment key={c}>
            <div className="hr">
              <span style={{ fontWeight: 500, flex: 1 }}>{c}</span>
              {plan && <span className="muted-2" style={{ fontSize: 11.5 }}>{plan.deliverables.length}</span>}
            </div>
            {dayArr.map(d => {
              const items = plan?.deliverables.filter(x => x.scheduledDate === d) || [];
              return (
                <div className="hd" key={d} title={items.map(i => `${i.type} · ${i.title}`).join("\n")}
                  onClick={() => items.length && onOpenDeliv(plan.id, items[0].id)}>
                  <div className="row" style={{ gap: 3 }}>
                    {items.slice(0, 3).map(it => (
                      <span key={it.id} className={`dot-${it.type === "reel" ? "r" : "s"} ${it.status}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Single-client calendar (traditional month grid) ─── */
function PerClientCalendar({ plans, client, month, onOpen }) {
  const { monthLabel, monthDaysIn } = window.PPC;
  const plan = plans.find(p => p.client === client && p.month === month);
  const days = monthDaysIn(month);
  const [y, m] = month.split("-").map(Number);
  const firstDow = new Date(y, m - 1, 1).getDay(); // 0=Sun

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ muted: true });
  for (let d = 1; d <= days; d++) cells.push({ day: d });

  const todayD = (month === "2026-05") ? 25 : null;

  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="section-title" style={{ flex: 1 }}>{client} · <em style={{ color: "var(--accent)" }}>{monthLabel(month)}</em></span>
        {plan ? (
          <span className="muted" style={{ fontSize: 12.5 }}>
            {plan.deliverables.length} pieces · {window.PPC.planLabel(plan.status)}
          </span>
        ) : (
          <Pill kind="outline">No plan yet</Pill>
        )}
        {plan && <button className="btn sm" onClick={() => onOpen(plan.id)}>Open plan →</button>}
      </div>

      <div className="cal-grid">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="dow">{d}</div>)}
        {cells.map((c, i) => {
          if (c.muted) return <div key={i} className="cal-day muted" />;
          const items = plan?.deliverables.filter(x => x.scheduledDate === c.day) || [];
          return (
            <div key={i} className={`cal-day ${todayD === c.day ? "today" : ""}`}>
              <span className="num">{c.day}</span>
              {items.map(it => (
                <span key={it.id} className={`cal-pill ${it.type} ${it.status}`}
                  onClick={() => onOpen(plan.id)}>
                  <span style={{ fontWeight: 500 }}>{it.type === "reel" ? "🎬" : "🖼"} {it.title}</span>
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Production summary (focus-month breakdown) ─── */
function ProductionSummary({ month, plans }) {
  const { PLAN_STAGES, planProgress, monthLabel } = window.PPC;
  // tally by stage
  const tally = {};
  plans.forEach(p => { tally[p.status] = (tally[p.status] || 0) + 1; });
  const totalDeliv = plans.reduce((acc, p) => acc + p.deliverables.length, 0);
  const doneDeliv = plans.reduce((acc, p) => acc + p.deliverables.filter(d => ["approved","scheduled","posted"].includes(d.status)).length, 0);
  const overallPct = totalDeliv === 0 ? 0 : Math.round((doneDeliv / totalDeliv) * 100);

  return (
    <div className="widget">
      <div className="widget-head">
        <span className="widget-title">{monthLabel(month)} — production breakdown</span>
        <span className="widget-action mono">{doneDeliv}/{totalDeliv} pieces</span>
      </div>
      <div className="row" style={{ marginBottom: 14, gap: 14 }}>
        <div className="stat" style={{ flex: 1 }}>
          <div className="stat-label">Overall production</div>
          <div className="stat-value">{overallPct}%</div>
          <div className="bar"><i style={{ width: `${overallPct}%` }} /></div>
        </div>
        <div style={{ width: 1, background: "var(--line)", alignSelf: "stretch" }} />
        <div className="col gap-2" style={{ flex: 1.4 }}>
          {PLAN_STAGES.map(s => (
            <div className="row gap-2" key={s.id}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color }} />
              <span style={{ fontSize: 12.5, flex: 1, color: "var(--ink-2)" }}>{s.label}</span>
              <span className="mono" style={{ fontSize: 12.5, color: tally[s.id] ? "var(--ink)" : "var(--ink-4)" }}>
                {tally[s.id] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Editor workload card (Rayu vs Aadil) ─── */
function EditorWorkloadCard({ plans }) {
  const { userMap, TIME_BUDGET } = window.PPC;
  const editors = ["rayu","aadil"];

  // count assigned, in-progress, queue
  const stats = {};
  editors.forEach(id => stats[id] = { assigned: 0, doneHrs: 0, queueHrs: 0 });
  plans.forEach(p => {
    p.deliverables.forEach(d => {
      if (!d.assignee || !stats[d.assignee]) return;
      stats[d.assignee].assigned += 1;
      if (["approved","scheduled","posted"].includes(d.status)) stats[d.assignee].doneHrs += d.timeBudget;
      else stats[d.assignee].queueHrs += d.timeBudget;
    });
  });

  return (
    <div className="widget">
      <div className="widget-head">
        <span className="widget-title">Editor workload — this & next month</span>
        <span className="widget-action">budget · 4-5h reel / ≤1h static</span>
      </div>
      <div className="col gap-3" style={{ marginTop: 4 }}>
        {editors.map(id => {
          const u = userMap[id];
          const s = stats[id];
          const totalHrs = s.doneHrs + s.queueHrs;
          const max = 80; // 2-month budget
          const pct = Math.min(100, (totalHrs / max) * 100);
          const tone = totalHrs >= max ? "danger" : totalHrs >= max * 0.85 ? "warn" : "ok";
          return (
            <div key={id}>
              <div className="row gap-2" style={{ marginBottom: 6 }}>
                <Avatar user={u} />
                <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{u.name}</span>
                <span className="mono" style={{ fontSize: 12.5 }}>{s.assigned} pieces · {totalHrs.toFixed(1)}h</span>
              </div>
              <div className={`bar ${tone}`}><i style={{ width: `${pct}%` }} /></div>
              <div className="row" style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
                <span>{s.doneHrs.toFixed(1)}h done</span>
                <span style={{ flex: 1 }} />
                <span>{s.queueHrs.toFixed(1)}h queue</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Plan panel — open a single plan, see deliverables, advance, assign ─── */
function PlanPanel({ plan, role, onClose }) {
  if (!plan) return null;
  const { userMap, PLAN_STAGES, DELIV_STAGES, store, planLabel, planProgress, monthLabel } = window.PPC;
  const pct = planProgress(plan);
  const stage = PLAN_STAGES.find(s => s.id === plan.status);
  const stageIdx = window.PPC.PLAN_STAGE_INDEX[plan.status];
  const nextStage = PLAN_STAGES[stageIdx + 1];

  return (
    <>
      <div className="panel-scrim open" onClick={onClose} />
      <div className="side-panel wide open" style={{ transform: "translateX(0)", width: 820 }}>
        {/* head */}
        <div className="profile-head">
          <div className="row gap-2" style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div className="row gap-2" style={{ marginBottom: 4 }}>
                <span className="plan-pill" style={{ background: hexA(stage.color, .14), color: stage.color }}>
                  <span className="d" style={{ background: stage.color }} />
                  {stage.label}
                </span>
                <span className="pill outline">{plan.deliverables.length} pieces</span>
                <span className="muted-2" style={{ fontSize: 12.5 }}>· {plan.deliverables.filter(d=>d.type==="reel").length} reels · {plan.deliverables.filter(d=>d.type==="static").length} statics</span>
              </div>
              <div className="profile-name">
                {plan.client} · <em style={{ color: "var(--accent)" }}>{monthLabel(plan.month)}</em>
              </div>
              <div className="profile-meta">
                <span><span className="k">Strategist</span> {userMap[plan.strategist]?.name}</span>
                {plan.calendarApprovedAt && <span><span className="k">Calendar approved</span> {plan.calendarApprovedAt}</span>}
                {plan.creativesApprovedAt && <span><span className="k">Creatives approved</span> {plan.creativesApprovedAt}</span>}
              </div>
            </div>
            <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
          </div>

          {/* plan-stage progress bar */}
          <div style={{ marginTop: 14 }}>
            <div className="row" style={{ gap: 6 }}>
              {PLAN_STAGES.map((s, i) => (
                <div key={s.id} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: i <= stageIdx ? s.color : "var(--line)",
                  opacity: i <= stageIdx ? 1 : 0.7
                }} title={s.label} />
              ))}
            </div>
            <div className="row" style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6, justifyContent: "space-between" }}>
              <span><strong style={{ color: "var(--ink)" }}>{pct}%</strong> of pieces are approved+</span>
              {nextStage && <span>Next: {nextStage.label}</span>}
            </div>
          </div>

          <div className="profile-actions">
            {plan.status === "calendar-draft" && (
              <button className="btn primary" onClick={() => { store.setPlanStatus(plan.id, "calendar-pending"); window.toast?.("Calendar sent to client", { icon: "✉" }); }}>
                Send calendar to client →
              </button>
            )}
            {plan.status === "calendar-pending" && (
              <button className="btn primary" onClick={() => { store.setPlanStatus(plan.id, "calendar-approved"); window.toast?.("Calendar approved — production begins", { icon: "✓" }); }}>
                Mark calendar approved
              </button>
            )}
            {plan.status === "calendar-approved" && (
              <button className="btn primary" onClick={() => store.setPlanStatus(plan.id, "in-production")}>
                Start production
              </button>
            )}
            {plan.status === "creative-pending" && (
              <button className="btn primary" onClick={() => { store.setPlanStatus(plan.id, "approved"); window.toast?.("Creatives approved", { icon: "✓" }); }}>
                Mark creatives approved
              </button>
            )}
            {plan.status === "approved" && (
              <button className="btn primary" onClick={() => { store.setPlanStatus(plan.id, "scheduled"); window.toast?.("Scheduled — all set", { icon: "✓" }); }}>
                Schedule all
              </button>
            )}
            <button className="btn sm" onClick={() => window.openClientPanel?.(plan.client)}>
              <Icon k="user" className="ic sm" />Open client
            </button>
          </div>
        </div>

        <div className="side-panel-body">
          {/* deliverables list head */}
          <div className="row" style={{ marginBottom: 10 }}>
            <span className="section-title" style={{ flex: 1 }}>Deliverables</span>
            <span className="muted" style={{ fontSize: 12.5 }}>
              Click status to advance · click avatar to reassign
            </span>
          </div>

          <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "var(--card)" }}>
            <div className="deliv-row" style={{ background: "var(--card-2)", padding: "8px 12px", color: "var(--ink-4)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".08em" }}>
              <span></span>
              <span>Piece</span>
              <span>Status</span>
              <span>Editor</span>
              <span>Scheduled</span>
              <span></span>
            </div>
            {plan.deliverables.map(d => (
              <DeliverableRow key={d.id} plan={plan} d={d} userMap={userMap} store={store} stages={DELIV_STAGES} />
            ))}
          </div>

          {/* Reviews / notes mini-section */}
          <div className="sub-card" style={{ marginTop: 14 }}>
            <div className="sub-card-title">Client feedback on this month</div>
            <div className="muted" style={{ fontSize: 12.5 }}>
              {plan.creativesApprovedAt
                ? `All creatives approved on ${plan.creativesApprovedAt}.`
                : plan.calendarApprovedAt
                  ? `Calendar approved ${plan.calendarApprovedAt}. Awaiting creative-batch review.`
                  : "Calendar still with client. No batch feedback yet."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Single deliverable row */
function DeliverableRow({ plan, d, userMap, store, stages }) {
  const editors = ["rayu","aadil"];
  const u = d.assignee ? userMap[d.assignee] : null;
  const idx = stages.findIndex(s => s.id === d.status);
  const cur = stages[idx];
  const statusTone = ["approved","scheduled","posted"].includes(d.status) ? "ok"
    : ["client-review","internal-review"].includes(d.status) ? "warn"
    : d.status === "briefed" ? "outline" : "accent";
  const advance = () => {
    const next = stages[(idx + 1) % stages.length];
    store.setDeliverableStatus(plan.id, d.id, next.id);
  };
  const cycleEditor = () => {
    const cur = d.assignee;
    const next = cur === "rayu" ? "aadil" : cur === "aadil" ? null : "rayu";
    store.assignDeliverable(plan.id, d.id, next);
  };

  return (
    <div className="deliv-row">
      <div className={`deliv-icon ${d.type}`}>{d.type === "reel" ? "REEL" : "ST"}</div>
      <div className="col" style={{ minWidth: 0 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{d.title}</span>
        <span className="muted-2" style={{ fontSize: 12.5 }}>
          {d.platform.join(" · ")} · {d.timeBudget}h budget{d.timeSpent ? ` · ${d.timeSpent}h logged` : ""}
        </span>
      </div>
      <span
        className={`pill ${statusTone}`}
        style={{ cursor: "pointer", padding: "3px 10px", justifySelf: "start" }}
        title="Click to advance"
        onClick={advance}
      >
        <span className="dot" />{cur?.label || d.status}
      </span>
      <span
        className="row gap-2"
        style={{ cursor: "pointer" }}
        title={u ? `${u.name} — click to reassign` : "Click to assign"}
        onClick={cycleEditor}
      >
        {u ? <Avatar user={u} size="sm" /> : <span className="avatar empty sm">?</span>}
        <span style={{ fontSize: 12.5 }}>{u ? u.name.split(" ")[0] : "Assign"}</span>
      </span>
      <span className="muted" style={{ fontSize: 12.5 }}>
        {d.scheduledDate ? `${window.PPC.monthShort(plan.month)} ${d.scheduledDate}` : "—"}
      </span>
      <button className="btn sm ghost" title="More"><Icon k="more" className="ic sm" /></button>
    </div>
  );
}

window.ContentStudioScreen = ContentStudioScreen;
