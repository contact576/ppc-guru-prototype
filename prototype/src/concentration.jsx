/* Concentration Risk — owner-only.
   - Top-N clients by % of MRR (bar chart)
   - Cumulative concentration curve (Lorenz)
   - At-risk overlay (paused / creative refresh / overdue review)
   - Single-client churn impact simulator
   - By service breakdown (Meta / Google / SMM exposure) */

function ConcentrationScreen({ role }) {
  const PPC = window.PPC;
  const owners = ["jaydeep", "dhaval"];
  if (!owners.includes(role.id)) {
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Restricted</div>
            <h1 className="page-title"><em>Concentration</em></h1>
            <div className="page-sub">Owners only.</div>
          </div>
        </div>
        <div className="empty">This view is restricted to owners.</div>
      </div>
    );
  }

  const { rows, totalCAD } = PPC.concentrationData();
  const top10 = rows.slice(0, 10);
  const atRiskRows = rows.filter(r => r.atRisk);
  const atRiskShare = atRiskRows.reduce((a, b) => a + b.mrrCAD, 0) / (totalCAD || 1);

  /* By-service exposure */
  const byService = { meta: 0, google: 0, smm: 0 };
  rows.forEach(r => r.services.forEach(s => {
    const cad = s.currency === "USD" ? s.mrr * 1.35 : s.mrr;
    byService[s.service] = (byService[s.service] || 0) + cad;
  }));
  const serviceTotal = Object.values(byService).reduce((a, b) => a + b, 0) || 1;

  /* Concentration health flags */
  const top1 = rows[0]?.pct || 0;
  const top3 = rows.slice(0, 3).reduce((a, b) => a + b.pct, 0);
  const top5 = rows.slice(0, 5).reduce((a, b) => a + b.pct, 0);
  const top1Health = top1 >= 0.2 ? "danger" : top1 >= 0.12 ? "warn" : "ok";
  const top3Health = top3 >= 0.45 ? "danger" : top3 >= 0.35 ? "warn" : "ok";

  const [simClient, setSimClient] = React.useState(rows[0]?.client || null);
  const sim = simClient ? PPC.churnImpact(simClient) : null;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Owners only · Phase 3</div>
          <h1 className="page-title">Concentration <em>risk</em></h1>
          <div className="page-sub">
            How much of MRR depends on any one client. Healthy book: no single client &gt; 12% of MRR, top-3 &lt; 35%. Values normalized to CAD (USD × 1.35).
          </div>
        </div>
        <div className="row gap-2">
          <Pill kind={top1Health}>Top client {Math.round(top1 * 100)}%</Pill>
          <Pill kind={top3Health}>Top 3: {Math.round(top3 * 100)}%</Pill>
          <Pill kind="outline">Top 5: {Math.round(top5 * 100)}%</Pill>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid-4" style={{ marginBottom: 14 }}>
        <Stat label="Total active MRR" value={fmtMoney(Math.round(totalCAD), "CAD")} sub={`${rows.length} clients`} />
        <Stat label="Largest exposure" value={`${Math.round(top1 * 100)}%`} sub={rows[0]?.client} />
        <Stat label="At-risk MRR" value={`${Math.round(atRiskShare * 100)}%`} sub={`${atRiskRows.length} clients flagged`}
              delta={atRiskShare > 0.2 ? "concentration + risk overlap" : "manageable"} deltaDir={atRiskShare > 0.2 ? "down" : "up"} />
        <Stat label="Avg client MRR" value={fmtMoney(Math.round(totalCAD / (rows.length || 1)), "CAD")} sub="across active book" />
      </div>

      {/* Main split: top-N bar + Lorenz */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Top 10 clients by MRR</span>
            <span className="widget-action">at-risk flagged in amber/red</span>
          </div>
          <div className="col gap-2" style={{ marginTop: 4 }}>
            {top10.map(r => <ConcentrationBarRow key={r.client} row={r} max={top10[0].mrrCAD} totalCAD={totalCAD} />)}
          </div>
        </div>

        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Lorenz curve</span>
            <span className="widget-action">healthy book = closer to diagonal</span>
          </div>
          <LorenzCurve rows={rows} />
          <div className="muted-2" style={{ fontSize: 12.5, marginTop: 8, lineHeight: 1.5 }}>
            The bowed curve shows what % of MRR the top X% of clients contribute. A perfectly even book would hug the diagonal. Ours: top 20% of clients = <span className="mono">{Math.round((rows.slice(0, Math.ceil(rows.length * 0.2)).reduce((a, b) => a + b.mrrCAD, 0) / totalCAD) * 100)}%</span> of MRR.
          </div>
        </div>
      </div>

      {/* By-service + at-risk overlay */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Exposure by service</span>
            <span className="widget-action">Meta · Google · SMM</span>
          </div>
          <ServiceStackBar byService={byService} total={serviceTotal} />
          <div className="col" style={{ marginTop: 12 }}>
            {Object.entries(byService).map(([svc, cad]) => (
              <div key={svc} className="row" style={{ padding: "6px 0", borderBottom: "1px dashed var(--line-2)" }}>
                <span className="dot" style={{ width: 10, height: 10, background: PPC.SERVICE_INFO[svc].color, borderRadius: 999, marginRight: 8 }} />
                <span style={{ flex: 1, fontSize: 13.5 }}>{PPC.SERVICE_INFO[svc].label}</span>
                <span className="mono" style={{ fontSize: 13.5 }}>{fmtMoney(Math.round(cad), "CAD")}</span>
                <span className="muted-2 mono" style={{ width: 50, textAlign: "right", fontSize: 12.5 }}>{Math.round((cad / serviceTotal) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">At-risk clients</span>
            <span className="widget-action">{atRiskRows.length} flagged · {Math.round(atRiskShare * 100)}% of MRR</span>
          </div>
          {atRiskRows.length === 0 ? (
            <div className="empty" style={{ margin: 4 }}>No clients currently flagged at-risk. Lovely.</div>
          ) : (
            <div className="col">
              {atRiskRows.slice(0, 8).map(r => (
                <div key={r.client} className="row" style={{ padding: "8px 0", borderBottom: "1px dashed var(--line-2)", cursor: "pointer" }} onClick={() => window.openClientPanel(r.client)}>
                  <div className="col" style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--accent)" }}>{r.client}</span>
                    <span className="muted" style={{ fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.atRiskReasons.join(" · ")}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: 12.5 }}>{Math.round(r.pct * 100)}%</span>
                  <Pill kind={r.pct >= 0.12 ? "danger" : "warn"} dot>at-risk</Pill>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Churn simulator */}
      <div className="widget" style={{ marginBottom: 14 }}>
        <div className="widget-head">
          <span className="widget-title">What if this client cancels?</span>
          <span className="widget-action">single-client churn impact</span>
        </div>
        <div className="row gap-3" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="col gap-2" style={{ minWidth: 240 }}>
            <span className="field-label">Pick a client</span>
            <SelectInput value={simClient || ""} onChange={e => setSimClient(e.target.value)}>
              {rows.map(r => (
                <option key={r.client} value={r.client}>
                  {r.client} ({Math.round(r.pct * 100)}% · {fmtMoney(Math.round(r.mrrCAD), "CAD")})
                </option>
              ))}
            </SelectInput>
            <span className="muted-2" style={{ fontSize: 12.5, marginTop: 4 }}>Hypothetical — does not change any data.</span>
          </div>
          {sim && (
            <>
              <div className="v-divider" />
              <div className="col gap-2" style={{ minWidth: 200 }}>
                <div className="stat-label">MRR lost</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 500, color: "var(--danger)", lineHeight: 1 }}>
                  -{fmtMoney(Math.round(sim.lostCAD), "CAD")}
                </div>
                <div className="muted" style={{ fontSize: 12.5 }}>{Math.round(sim.pctOfMRR * 100)}% of book gone</div>
              </div>
              <div className="v-divider" />
              <div className="col gap-2" style={{ minWidth: 200 }}>
                <div className="stat-label">New total MRR</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 500, lineHeight: 1 }} className="mono">
                  {fmtMoney(Math.round(sim.newTotalCAD), "CAD")}
                </div>
                <div className="muted" style={{ fontSize: 12.5 }}>{sim.remainingClients} clients remain</div>
              </div>
              <div className="v-divider" />
              <div className="col gap-2" style={{ minWidth: 200 }}>
                <div className="stat-label">New top-client share</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 500, lineHeight: 1 }} className="mono">
                  {Math.round(sim.newTopClientShare * 100)}%
                </div>
                <div className="muted" style={{ fontSize: 12.5 }}>
                  {sim.newTopClientShare > 0.18 ? "new concentration risk emerges" : "book stays balanced"}
                </div>
              </div>
            </>
          )}
        </div>
        {sim && (
          <div style={{ marginTop: 14, padding: 12, background: "var(--card-2)", borderRadius: 8, fontSize: 12.5, lineHeight: 1.55 }}>
            <strong>Recovery time:</strong>{" "}
            At Abhishek's recent close rate (avg new deal {fmtMoney(2800, "CAD")}/mo, ~3 wins/mo), replacing this client would take roughly{" "}
            <span className="mono" style={{ fontWeight: 500 }}>{Math.max(1, Math.ceil(sim.lostCAD / (2800 * 3)))} months</span>{" "}
            of net-new bookings to break even — assuming churn elsewhere holds.
            <span className="row" style={{ marginTop: 8 }}>
              <button className="btn sm" onClick={() => window.askAssistant?.(`What's our exposure if ${simClient} churns? Walk me through the recovery plan.`)}>
                <Icon k="sparkle" />Ask Guru
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Full roster table */}
      <div className="widget" style={{ padding: 0 }}>
        <div className="row" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>Full active roster</span>
          <span className="muted" style={{ fontSize: 12.5 }}>{rows.length} clients · sorted by MRR</span>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Services</th>
              <th>MRR (CAD)</th>
              <th>% of book</th>
              <th>Cumulative</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const cum = rows.slice(0, i + 1).reduce((a, b) => a + b.pct, 0);
              return (
                <tr key={r.client} style={{ cursor: "pointer" }} onClick={() => window.openClientPanel(r.client)}>
                  <td className="mono muted" style={{ width: 36 }}>{i + 1}</td>
                  <td><span style={{ fontWeight: 500, color: "var(--accent)" }}>{r.client}</span></td>
                  <td>
                    <div className="row gap-2">
                      {r.services.map(s => (
                        <Pill key={s.service} kind="outline">
                          <span className="dot" style={{ background: PPC.SERVICE_INFO[s.service].color }} />
                          {PPC.SERVICE_INFO[s.service].short}
                        </Pill>
                      ))}
                    </div>
                  </td>
                  <td className="mono">{fmtMoney(Math.round(r.mrrCAD), "CAD")}</td>
                  <td>
                    <div className="row gap-2">
                      <div className="bar" style={{ width: 100, height: 6 }}>
                        <i style={{
                          width: `${Math.min(100, (r.pct / Math.max(0.2, top1)) * 100)}%`,
                          background: r.atRisk ? "var(--danger)" : r.pct >= 0.12 ? "var(--warn)" : "var(--accent)"
                        }} />
                      </div>
                      <span className="mono" style={{ fontSize: 12.5 }}>{(r.pct * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="mono muted">{(cum * 100).toFixed(0)}%</td>
                  <td>
                    {r.atRisk
                      ? <Pill kind="danger" dot>{r.atRiskReasons.length}</Pill>
                      : <span className="muted-2">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* One bar row in Top-10 list */
function ConcentrationBarRow({ row, max, totalCAD }) {
  const tone = row.atRisk ? "var(--danger)" : row.pct >= 0.12 ? "var(--warn)" : "var(--accent)";
  return (
    <div className="row gap-3" style={{ alignItems: "center", padding: "5px 0", cursor: "pointer" }} onClick={() => window.openClientPanel(row.client)}>
      <div className="col" style={{ width: 160, minWidth: 0 }}>
        <span style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.client}</span>
        <span className="muted-2" style={{ fontSize: 11.5 }}>{row.services.map(s => window.PPC.SERVICE_INFO[s.service].short).join(" · ")}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div className="bar" style={{ height: 12, borderRadius: 4 }}>
          <i style={{ width: `${(row.mrrCAD / max) * 100}%`, background: tone, borderRadius: 4 }} />
        </div>
      </div>
      <span className="mono" style={{ width: 78, textAlign: "right", fontSize: 12.5 }}>
        {fmtMoney(Math.round(row.mrrCAD), "CAD")}
      </span>
      <span className="mono muted" style={{ width: 42, textAlign: "right", fontSize: 12.5 }}>
        {(row.pct * 100).toFixed(1)}%
      </span>
    </div>
  );
}

/* Lorenz curve SVG */
function LorenzCurve({ rows }) {
  const W = 320, H = 220, PAD = 28;
  if (!rows.length) return <div className="empty">No data.</div>;
  const total = rows.reduce((a, b) => a + b.mrrCAD, 0);
  // Sort ascending for Lorenz (smallest first)
  const asc = [...rows].sort((a, b) => a.mrrCAD - b.mrrCAD);
  const n = asc.length;
  const points = [[PAD, H - PAD]];
  let acc = 0;
  asc.forEach((r, i) => {
    acc += r.mrrCAD;
    const x = PAD + ((i + 1) / n) * (W - PAD * 2);
    const y = H - PAD - (acc / total) * (H - PAD * 2);
    points.push([x, y]);
  });
  const path = points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const fill = `${path} L${W - PAD} ${H - PAD} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {/* axes */}
      <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke="var(--line-strong)" />
      <line x1={PAD} x2={PAD} y1={PAD} y2={H - PAD} stroke="var(--line-strong)" />
      {/* perfectly-even reference diagonal */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={PAD} stroke="var(--line-strong)" strokeDasharray="3 4" />
      {/* fill */}
      <path d={fill} fill="var(--accent)" opacity="0.14" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.8" />
      {/* axis labels */}
      <text x={PAD} y={H - 10} fontSize="9" fill="var(--ink-4)" fontFamily="var(--mono)">0%</text>
      <text x={W - PAD - 20} y={H - 10} fontSize="9" fill="var(--ink-4)" fontFamily="var(--mono)">100% clients</text>
      <text x={6} y={PAD + 6} fontSize="9" fill="var(--ink-4)" fontFamily="var(--mono)">100%</text>
      <text x={6} y={H - PAD} fontSize="9" fill="var(--ink-4)" fontFamily="var(--mono)">0%</text>
      <text x={PAD + 6} y={PAD + 6} fontSize="10" fill="var(--ink-3)">MRR</text>
    </svg>
  );
}

/* Stack bar for service split */
function ServiceStackBar({ byService, total }) {
  const PPC = window.PPC;
  return (
    <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)" }}>
      {["meta", "google", "smm"].map(s => {
        const cad = byService[s] || 0;
        if (!cad) return null;
        return (
          <div key={s}
            style={{ width: `${(cad / total) * 100}%`, background: PPC.SERVICE_INFO[s].color, opacity: 0.85 }}
            title={`${PPC.SERVICE_INFO[s].label}: ${fmtMoney(Math.round(cad), "CAD")} (${Math.round((cad / total) * 100)}%)`}
          />
        );
      })}
    </div>
  );
}

Object.assign(window, { ConcentrationScreen });
