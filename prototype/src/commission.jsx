/* Commission dashboard — owner-only.
   Per-salesperson MTD vs 3× salary target, trailing 12 months,
   breakdown by client (first-month vs recurring), team roll-up,
   forecast based on expected pipeline close rates. */

function CommissionScreen({ role }) {
  const PPC = window.PPC;
  const owners = ["jaydeep", "dhaval"];
  if (!owners.includes(role.id)) {
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Restricted</div>
            <h1 className="page-title"><em>Commission</em></h1>
            <div className="page-sub">Owners only. Switch to Jaydeep or Dhaval to view.</div>
          </div>
        </div>
        <div className="empty">This view is restricted to owners.</div>
      </div>
    );
  }

  /* All commissionable salespeople (any user with a rule defined). */
  const salesIds = Object.keys(PPC.COMMISSION_RULES);
  const [focusId, setFocusId] = React.useState(salesIds[0] || "abhishek");

  const focus = PPC.userMap[focusId];
  const focusMonth = PPC.TODAY.slice(0, 7) + "-01";
  const earnedThisMonth = PPC.commissionEarned(focusId, focusMonth);
  const target = PPC.commissionTarget(focusId);
  const pct = target ? earnedThisMonth.total / target : 0;
  const history = PPC.COMMISSION_HISTORY[focusId] || [];
  const projected = PPC.projectedCommission(focusId);
  const rules = PPC.COMMISSION_RULES[focusId];

  /* Team roll-up totals */
  const team = salesIds.map(id => {
    const e = PPC.commissionEarned(id, focusMonth);
    const t = PPC.commissionTarget(id);
    return { id, user: PPC.userMap[id], earned: e.total, target: t, pct: t ? e.total / t : 0, byClient: e.byClient };
  });
  const teamEarned = team.reduce((a, b) => a + b.earned, 0);
  const teamTarget = team.reduce((a, b) => a + b.target, 0);

  /* Split focus's byClient into first-month vs recurring.
     commissionEarned returns rows shaped { client, service, fee, currency, monthsLive, rate, earn } */
  const firstMonthRows = (earnedThisMonth.byClient || []).filter(b => b.monthsLive === 0);
  const recurringRows  = (earnedThisMonth.byClient || []).filter(b => b.monthsLive >= 1);
  const firstSum       = firstMonthRows.reduce((a, b) => a + b.earn, 0);
  const recurSum       = recurringRows.reduce((a, b) => a + b.earn, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Owners only · Phase 3</div>
          <h1 className="page-title"><em>Commission</em> dashboard</h1>
          <div className="page-sub">
            Sales target is 3× monthly salary, paid from a 5% / 3% / 0% schedule on month 1 → 2-6 → 7+ of any signed contract. CAD-normalized.
          </div>
        </div>
        <div className="seg">
          {salesIds.map(id => (
            <button key={id} className={focusId === id ? "on" : ""} onClick={() => setFocusId(id)}>
              {PPC.userMap[id]?.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* MTD vs target — big serif headline */}
      <div className="card" style={{ padding: "22px 24px", marginBottom: 16, display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 22 }}>
        <div className="col gap-2">
          <div className="page-eyebrow" style={{ marginBottom: 0 }}>{focus.name} · {PPC.monthLabel ? PPC.monthLabel(PPC.TODAY.slice(0,7)) : PPC.TODAY.slice(0,7)}</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1 }}>
            <span className="mono">{fmtMoney(Math.round(earnedThisMonth.total), "CAD")}</span>
          </div>
          <div className="muted" style={{ fontSize: 13.5 }}>
            of <span className="mono">{fmtMoney(target, "CAD")}</span> target ({Math.round(pct * 100)}%)
          </div>
          <div className="bar" style={{ marginTop: 10, height: 10 }}>
            <i style={{ width: `${Math.min(100, pct * 100)}%`, background: pct >= 1 ? "var(--ok)" : pct >= 0.66 ? "var(--accent)" : pct >= 0.33 ? "var(--warn)" : "var(--danger)" }} />
          </div>
          <div className="muted-2" style={{ fontSize: 12.5, marginTop: 4 }}>
            Salary {fmtMoney(focus.salary || 0, "CAD")}/mo · target = 3× salary
          </div>
        </div>

        <div className="col gap-2">
          <div className="page-eyebrow" style={{ marginBottom: 0 }}>This month split</div>
          <CommissionSplitBar firstMonth={firstSum} recurring={recurSum} />
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, marginTop: 4 }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--accent)", borderRadius: 2, marginRight: 6 }} />First-month</span>
            <span className="mono">{fmtMoney(Math.round(firstSum), "CAD")}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5 }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--ink-3)", borderRadius: 2, marginRight: 6 }} />Recurring (mo 2-6)</span>
            <span className="mono">{fmtMoney(Math.round(recurSum), "CAD")}</span>
          </div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
            Rate card: {Math.round(rules.firstMonth * 100)}% / {Math.round(rules.monthsTwoToSix * 100)}% / {Math.round(rules.afterSix * 100)}%
          </div>
        </div>

        <div className="col gap-2">
          <div className="page-eyebrow" style={{ marginBottom: 0 }}>If pipeline closes at expected</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1 }}>
            <span className="mono">+{fmtMoney(Math.round(projected.total), "CAD")}</span>
          </div>
          <div className="muted" style={{ fontSize: 12.5 }}>weighted first-month commission across {projected.byLead.length} open deals</div>
          <div className="muted-2" style={{ fontSize: 12.5 }}>
            uses stage win-prob: New 5% · Qual 20% · Prop 35% · Trial 65%
          </div>
        </div>
      </div>

      {/* Trailing 12 months */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Trailing 12 months</span>
            <span className="widget-action">{focus.name.split(" ")[0]} · earned vs target</span>
          </div>
          <CommissionTrailingChart history={history} target={target} />
          <div className="muted-2" style={{ fontSize: 12.5, marginTop: 8 }}>
            Target line at {fmtMoney(target, "CAD")}/mo. Earnings ramp with portfolio size — first-month commissions are lumpy; recurring smooths.
          </div>
        </div>

        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Team roll-up · {PPC.monthLabel ? PPC.monthLabel(PPC.TODAY.slice(0,7)) : "this month"}</span>
            <span className="widget-action mono">{fmtMoney(Math.round(teamEarned), "CAD")} / {fmtMoney(teamTarget, "CAD")}</span>
          </div>
          <div className="col gap-3">
            {team.map(t => (
              <div key={t.id} className="row gap-3" style={{ alignItems: "center", padding: "6px 0", borderBottom: "1px dashed var(--line-2)" }}>
                <Avatar user={t.user} />
                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{t.user.name}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>{t.user.role} · {t.byClient.length} deals contributing</span>
                </div>
                <div style={{ width: 140 }}>
                  <div className="bar" style={{ height: 6 }}>
                    <i style={{ width: `${Math.min(100, t.pct * 100)}%`, background: t.pct >= 1 ? "var(--ok)" : "var(--accent)" }} />
                  </div>
                </div>
                <span className="mono" style={{ width: 80, textAlign: "right", fontSize: 12.5 }}>
                  {fmtMoney(Math.round(t.earned), "CAD")}
                </span>
                <span className="muted-2 mono" style={{ width: 40, textAlign: "right", fontSize: 12.5 }}>{Math.round(t.pct * 100)}%</span>
              </div>
            ))}
            {team.length === 1 && (
              <div className="muted-2" style={{ fontSize: 12.5 }}>
                Only one commissionable role active. As you onboard more salespeople, this rolls up to a team line.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* By client */}
      <div className="widget" style={{ padding: 0, marginBottom: 14 }}>
        <div className="row" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>By client · this month</span>
          <span className="muted" style={{ fontSize: 12.5 }}>{earnedThisMonth.byClient.length} contributing contracts</span>
        </div>
        {earnedThisMonth.byClient.length === 0 ? (
          <div className="empty" style={{ margin: 16 }}>No commissionable contracts hit this month yet.</div>
        ) : (
          <table className="t">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Contract start</th>
                <th>Month #</th>
                <th>Tier</th>
                <th>Contract MRR</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {earnedThisMonth.byClient.map((b, i) => {
                const tier = b.monthsLive === 0 ? "firstMonth" : b.monthsLive < 6 ? "monthsTwoToSix" : "afterSix";
                const prof = PPC.PROFILES_RICH[b.client];
                const start = prof?.serviceContracts?.[b.service]?.contractStart || "—";
                return (
                  <tr key={i} style={{ cursor: "pointer" }} onClick={() => window.openClientPanel(b.client)}>
                    <td><span style={{ fontWeight: 500, color: "var(--accent)" }}>{b.client}</span></td>
                    <td><Pill kind="outline">{(PPC.SERVICE_INFO[b.service]?.short) || b.service}</Pill></td>
                    <td className="muted" style={{ fontSize: 12.5 }}>{start}</td>
                    <td className="mono">{b.monthsLive + 1}</td>
                    <td>
                      {tier === "firstMonth" ? <Pill kind="accent">First month · {Math.round(b.rate * 100)}%</Pill>
                        : tier === "monthsTwoToSix" ? <Pill kind="outline">Recurring · {Math.round(b.rate * 100)}%</Pill>
                        : <Pill kind="outline">After 6 · {Math.round(b.rate * 100)}%</Pill>}
                    </td>
                    <td className="mono">{fmtMoney(b.fee || 0, b.currency || "CAD")}</td>
                    <td className="mono" style={{ fontWeight: 500 }}>{fmtMoney(Math.round(b.earn), "CAD")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Forecast detail */}
      <div className="widget" style={{ padding: 0 }}>
        <div className="row" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>Forecast · next month if pipeline closes</span>
          <span className="muted mono" style={{ fontSize: 12.5 }}>+{fmtMoney(Math.round(projected.total), "CAD")} weighted</span>
        </div>
        {projected.byLead.length === 0 ? (
          <div className="empty" style={{ margin: 16 }}>Pipeline is empty.</div>
        ) : (
          <table className="t">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Stage</th>
                <th>Contract MRR</th>
                <th>Win %</th>
                <th>Expected first-month commission</th>
              </tr>
            </thead>
            <tbody>
              {projected.byLead.slice(0, 8).map((l, i) => (
                <tr key={i}>
                  <td><span style={{ fontWeight: 500 }}>{l.company}</span></td>
                  <td><Pill kind="outline">{PPC.SALES_STAGES.find(s => s.id === l.stage)?.name || l.stage}</Pill></td>
                  <td className="mono">{fmtMoney(Math.round(l.mrrCAD), "CAD")}</td>
                  <td className="mono">{Math.round(l.prob * 100)}%</td>
                  <td className="mono" style={{ fontWeight: 500 }}>{fmtMoney(Math.round(l.commission), "CAD")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* Small horizontal stack bar */
function CommissionSplitBar({ firstMonth, recurring }) {
  const total = firstMonth + recurring || 1;
  return (
    <div style={{ display: "flex", height: 24, borderRadius: 8, overflow: "hidden", border: "1px solid var(--line)" }}>
      <div style={{ width: `${(firstMonth / total) * 100}%`, background: "var(--accent)" }} title={`First-month: $${Math.round(firstMonth)}`} />
      <div style={{ width: `${(recurring / total) * 100}%`, background: "var(--ink-3)" }} title={`Recurring: $${Math.round(recurring)}`} />
    </div>
  );
}

/* Trailing-12 chart — bar for earned, line for target */
function CommissionTrailingChart({ history, target }) {
  if (!history?.length) return <div className="empty">No history yet.</div>;
  const W = 520, H = 160, PAD_L = 36, PAD_R = 12, PAD_T = 12, PAD_B = 22;
  const maxV = Math.max(target, ...history.map(h => h.earned)) * 1.1;
  const bw = (W - PAD_L - PAD_R) / history.length - 4;
  const xFor = i => PAD_L + i * ((W - PAD_L - PAD_R) / history.length) + 2;
  const yFor = v => PAD_T + (1 - v / maxV) * (H - PAD_T - PAD_B);
  const targetY = yFor(target);

  /* y-axis ticks: 0, half, max */
  const ticks = [0, maxV / 2, maxV];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {/* gridlines + y labels */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PAD_L} x2={W - PAD_R} y1={yFor(t)} y2={yFor(t)} stroke="var(--line)" strokeDasharray="2 4" />
          <text x={4} y={yFor(t) + 3} fontSize="9" fill="var(--ink-4)" fontFamily="var(--mono)">
            ${Math.round(t / 1000)}k
          </text>
        </g>
      ))}
      {/* bars */}
      {history.map((h, i) => {
        const x = xFor(i);
        const y = yFor(h.earned);
        const hgt = (H - PAD_T - PAD_B) - (y - PAD_T);
        const isCurrent = i === history.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={hgt}
              fill={h.earned >= target ? "var(--ok)" : "var(--accent)"}
              opacity={isCurrent ? 1 : 0.55}
              rx="2" />
            <text x={x + bw / 2} y={H - 6} fontSize="9" fill="var(--ink-4)" textAnchor="middle" fontFamily="var(--mono)">
              {h.month.slice(5)}
            </text>
          </g>
        );
      })}
      {/* target line */}
      <line x1={PAD_L} x2={W - PAD_R} y1={targetY} y2={targetY} stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={W - PAD_R - 4} y={targetY - 4} fontSize="9.5" fill="var(--ink)" textAnchor="end" fontFamily="var(--mono)">
        target ${Math.round(target / 1000)}k
      </text>
    </svg>
  );
}

Object.assign(window, { CommissionScreen });
