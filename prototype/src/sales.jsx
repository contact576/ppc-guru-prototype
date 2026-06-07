/* Sales — Pipeline (kanban) + Leads (table) */

function PipelineScreen({ role }) {
  const { SALES_STAGES, LEADS, SERVICE_INFO } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];
  const [leads, setLeads] = React.useState(LEADS);
  const [opened, setOpened] = React.useState(null);
  const [dragId, setDragId] = React.useState(null);
  const [dropStage, setDropStage] = React.useState(null);

  const onDropTo = (stageId) => {
    if (!dragId) return;
    setLeads(prev => prev.map(l => l.id === dragId ? { ...l, stage: stageId, days: 0 } : l));
    const stageName = SALES_STAGES.find(s => s.id === stageId).name;
    window.toast(`Moved to "${stageName}" · task + notification sent.`, { icon: "↗" });
    setDragId(null); setDropStage(null);
  };

  // Conversion math
  const newLeads = leads.filter(l => l.stage === "sn").length;
  const trial    = leads.filter(l => l.stage === "sa").length;
  const won      = leads.filter(l => l.stage === "sw").length;
  const lost     = leads.filter(l => l.stage === "sl").length;
  const trialPaid = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
  const totalMRRWon = access.money ? leads.filter(l => l.stage === "sw").reduce((a, l) => a + l.budget, 0) : 0;
  const pipelineValue = access.money ? leads.filter(l => !["sw","sl"].includes(l.stage)).reduce((a, l) => a + l.budget, 0) : 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Sales · Real bottleneck</div>
          <h1 className="page-title"><em>Pipeline</em></h1>
          <div className="page-sub">
            30-day free trial → paid. Target conversion is 60–70%. Each card shows budget, source, and where it's stuck.
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost"><Icon k="filter" />All sources</button>
          <button className="btn"><Icon k="plus" />New lead</button>
        </div>
      </div>

      {/* funnel summary */}
      <div className="grid-4" style={{ marginBottom: 14 }}>
        <Stat label="Leads (open)" value={leads.filter(l => !["sw","sl"].includes(l.stage)).length}
              sub={`${newLeads} new this week`} />
        <Stat label="Trials Active" value={trial} sub="convert in 5–30d" />
        <Stat label="Trial → Paid" value={`${trialPaid}%`} sub={`target 60–70%`} delta={trialPaid >= 60 ? "On target" : "Below target"} deltaDir={trialPaid >= 60 ? "up" : "down"} />
        <Stat label="Pipeline value (MRR)" value={access.money ? `$${(pipelineValue/1000).toFixed(1)}k` : "—"} sub={access.money ? `$${(totalMRRWon/1000).toFixed(1)}k won this month` : ""} />
      </div>

      {/* sub funnel chart + cost lines */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Conversion Funnel</span>
            <span className="widget-action">Last 90 days</span>
          </div>
          <Funnel access={access} />
        </div>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Acquisition cost</span>
            <span className="widget-action">{access.money ? "Lead spend ≈ $920/mo" : "Restricted"}</span>
          </div>
          <div className="col gap-3" style={{ marginTop: 4 }}>
            <CostRow label="Cost per Trial"  value={access.money ? "$33" : "—"} target="≤ $40" delta="−12%" deltaDir="up" />
            <CostRow label="Cost per Paid"   value={access.money ? "$52" : "—"} target="≤ $80" delta="−18%" deltaDir="up" />
            <CostRow label="Avg trial length" value="22 days" target="≤ 30" delta=""/>
            <CostRow label="Avg client value" value={access.money ? "$3.6k MRR" : "—"} target="" delta=""/>
          </div>
          <div className="hr" />
          <div className="muted" style={{ fontSize: 12.5 }}>
            To scale: lead spend → ~$2.4k/mo would yield ~28 trials → ~18 paid/mo at current rates.
          </div>
        </div>
      </div>

      {/* What to chase */}
      <div className="widget" style={{ marginBottom: 14 }}>
        <div className="widget-head">
          <span className="widget-title">What to chase today</span>
          <span className="widget-action">{leads.filter(l => l.days >= 3 && !["sw","sl"].includes(l.stage)).length} need attention</span>
        </div>
        <div className="grid-3">
          {leads.filter(l => l.days >= 3 && !["sw","sl"].includes(l.stage)).slice(0,3).map(l => (
            <div key={l.id} className="card" style={{ padding: 12 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span style={{ fontWeight: 500 }}>{l.company}</span>
                <Pill kind={l.days >= 7 ? "danger" : "warn"}>{l.days}d in stage</Pill>
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                {SALES_STAGES.find(s => s.id === l.stage).name} · {access.money ? `$${l.budget}/mo` : "—"}
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>{l.notes}</div>
              <div className="row gap-2" style={{ marginTop: 8 }}>
                <button className="btn sm">Email</button>
                <button className="btn sm">Call</button>
                <button className="btn sm primary">Advance</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* pipeline kanban */}
      <div className="kanban">
        {SALES_STAGES.map(st => {
          const colLeads = leads.filter(l => l.stage === st.id);
          const tint =
            st.intent === "trial" ? { background: "#EAF0FA", borderColor: "#C8D5EA" } :
            st.intent === "won"   ? { background: "var(--ok-tint)", borderColor: "#BFD8C8" } :
            st.intent === "lost"  ? { background: "#F2EAE7", borderColor: "#DCC9C3" } : {};
          return (
            <div key={st.id}
              className={`kanban-col ${dropStage === st.id ? "drop" : ""}`}
              style={tint}
              onDragOver={e => { e.preventDefault(); setDropStage(st.id); }}
              onDragLeave={() => setDropStage(s => s === st.id ? null : s)}
              onDrop={() => onDropTo(st.id)}
            >
              <div className="kanban-col-head">
                <div style={{ flex: 1 }}>
                  <div className="kanban-col-title">{st.name}</div>
                  <div className="kanban-col-owner muted">
                    {st.intent === "trial" ? "30-day free trial" : st.intent === "won" ? "Paid" : st.intent === "lost" ? "Lost" : "Sales"}
                  </div>
                </div>
                <span className="kanban-col-count">{colLeads.length}</span>
              </div>
              <div className="kanban-col-body">
                {colLeads.map(l => (
                  <div key={l.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    onDragEnd={() => { setDragId(null); setDropStage(null); }}
                    onClick={() => setOpened(l)}
                  >
                    <div className="row" style={{ alignItems: "flex-start" }}>
                      <div className="col" style={{ flex: 1 }}>
                        <div className="kanban-card-name">{l.company}</div>
                        <div className="muted" style={{ fontSize: 12.5 }}>{l.contact}</div>
                      </div>
                      {access.money && (
                        <span className="mono" style={{ fontSize: 12.5 }}>${l.budget}</span>
                      )}
                    </div>
                    <div className="kanban-card-flags">
                      {l.service.map(s => (
                        <Pill key={s} kind="outline">
                          <span className="dot" style={{ background: SERVICE_INFO[s].color }} />
                          {SERVICE_INFO[s].short}
                        </Pill>
                      ))}
                    </div>
                    <div className="kanban-card-meta">
                      <span className="muted-2">{l.source}</span>
                      <span style={{ flex: 1 }} />
                      {l.stage === "sa" && l.cpa && <span className="mono" style={{ color: "var(--ok)" }}>CPA ${l.cpa}</span>}
                      <span className={`age ${ageClass(l.days, "team")}`}>{l.days === 0 ? "today" : `${l.days}d`}</span>
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && <div style={{ fontSize: 12.5, color: "var(--ink-4)", textAlign: "center", padding: "6px 0" }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>

      {opened && (
        <>
          <div className="panel-scrim open" onClick={() => setOpened(null)} />
          <div className="side-panel open">
            <div className="side-panel-head">
              <div className="col" style={{ flex: 1 }}>
                <div className="muted" style={{ fontSize: 12.5 }}>{opened.contact} · {opened.source}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>{opened.company}</div>
              </div>
              <button className="btn ghost" onClick={() => setOpened(null)}><Icon k="close" /></button>
            </div>
            <div className="side-panel-body">
              <div className="grid-2">
                <div className="stat">
                  <div className="stat-label">Budget</div>
                  <div className="stat-value" style={{ fontSize: 22 }}>
                    {access.money && opened.budget ? `$${opened.budget}` : "TBD"}
                  </div>
                  <div className="muted-2" style={{ fontSize: 12.5 }}>{opened.currency || "CAD"} / mo</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Services</div>
                  <div className="row gap-2" style={{ marginTop: 4 }}>
                    {opened.service.map(s => <Pill key={s} kind="accent">{window.PPC.SERVICE_INFO[s].short}</Pill>)}
                  </div>
                </div>
              </div>
              <div className="hr" />
              <div className="label">Notes</div>
              <div style={{ fontSize: 13.5, marginTop: 4 }}>{opened.notes}</div>
              <div className="hr" />
              <div className="label" style={{ marginBottom: 8 }}>Sales activity</div>
              <ActivityRow who="Abhishek" when="2 days ago" text="Sent proposal v2 with combined Google + Meta pricing." />
              <ActivityRow who="Abhishek" when="5 days ago" text="Discovery call — strong product-market fit." />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CostRow({ label, value, target, delta, deltaDir }) {
  return (
    <div className="row" style={{ justifyContent: "space-between" }}>
      <div className="col">
        <span style={{ fontSize: 13.5 }}>{label}</span>
        <span className="muted" style={{ fontSize: 12.5 }}>{target ? `target ${target}` : ""}</span>
      </div>
      <div className="row gap-2">
        <span className="mono" style={{ fontSize: 15, fontFamily: "var(--serif)" }}>{value}</span>
        {delta && <Pill kind={deltaDir === "up" ? "ok" : "warn"}>{delta}</Pill>}
      </div>
    </div>
  );
}

/* Leads table view */
function LeadsScreen({ role }) {
  const { LEADS, SALES_STAGES, SERVICE_INFO } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];
  const [search, setSearch] = React.useState("");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const sources = ["all", ...new Set(LEADS.map(l => l.source))];

  const filtered = LEADS.filter(l =>
    (sourceFilter === "all" || l.source === sourceFilter) &&
    (search === "" || l.company.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Sales</div>
          <h1 className="page-title">All <em>Leads</em></h1>
          <div className="page-sub">Every lead, qualified or not. Use this view for outreach lists and to spot conversion patterns by source.</div>
        </div>
        <button className="btn"><Icon k="plus" />New lead</button>
      </div>

      <div className="toolbar">
        <div className="topbar-search" style={{ flex: "none", width: 280, margin: 0 }}>
          <Icon k="search" className="ic sm" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company or contact..." />
        </div>
        <div className="seg">
          {sources.map(s => (
            <button key={s} className={sourceFilter === s ? "on" : ""} onClick={() => setSourceFilter(s)}>{s}</button>
          ))}
        </div>
        <div className="sp" />
        <span className="muted" style={{ fontSize: 12.5 }}>{filtered.length} leads</span>
      </div>

      <div className="widget" style={{ padding: 0 }}>
        <table className="t">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Service</th>
              {access.money && <th>Budget</th>}
              <th>Source</th>
              <th>Stage</th>
              <th>CPA</th>
              <th>Days</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td><span style={{ fontWeight: 500 }}>{l.company}</span></td>
                <td className="muted">{l.contact}</td>
                <td>
                  <div className="row gap-2">
                    {l.service.map(s => (
                      <Pill key={s} kind="outline">
                        <span className="dot" style={{ background: SERVICE_INFO[s].color }} />
                        {SERVICE_INFO[s].short}
                      </Pill>
                    ))}
                  </div>
                </td>
                {access.money && (
                  <td className="mono">{l.budget ? `$${l.budget}` : "TBD"}</td>
                )}
                <td className="muted">{l.source}</td>
                <td>
                  {l.stage === "sw" ? <Pill kind="ok">Won</Pill>
                    : l.stage === "sl" ? <Pill kind="danger">Lost</Pill>
                    : l.stage === "sa" ? <Pill kind="client">Trial</Pill>
                    : <Pill kind="outline">{SALES_STAGES.find(s => s.id === l.stage).name}</Pill>}
                </td>
                <td className="mono muted">{l.cpa ? `$${l.cpa}` : "—"}</td>
                <td className="mono muted">{l.days}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { PipelineScreen, LeadsScreen });
