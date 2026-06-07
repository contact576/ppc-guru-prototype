/* Pipeline Forecast / Win-rate — Sales screen extension.
   Lives at sidebar → Sales → Forecast (alongside Pipeline + Leads).
   - Weighted pipeline value (per-stage probability × MRR)
   - Win-rate by source (last 90 days)
   - Average days-in-stage (velocity)
   - Forecast projections + "what would close this month/next" */

function ForecastScreen({ role }) {
  const PPC = window.PPC;
  const access = PPC.ROLE_ACCESS[role.id];

  const fc      = PPC.pipelineForecast();
  const wins    = PPC.winRateBySource();
  const stages  = fc.byStage;
  const open    = fc.open;

  /* Velocity — overlay actuals from LEADS against benchmark */
  const velocity = PPC.SALES_STAGES.filter(s => ["sn","sq","sp","sa"].includes(s.id)).map(st => {
    const inStage = PPC.LEADS.filter(l => l.stage === st.id);
    const avg = inStage.length ? inStage.reduce((a, b) => a + b.days, 0) / inStage.length : 0;
    return { stage: st, avg, benchmark: PPC.STAGE_BENCHMARK_DAYS[st.id], count: inStage.length };
  });

  /* Most-likely-to-close-this-month: trial active + high prob */
  const closingSoon = open.filter(l => l.prob >= 0.4).slice(0, 6);

  /* Sum win-rate across sources */
  const totalWon = wins.reduce((a, b) => a + b.won, 0);
  const totalLost = wins.reduce((a, b) => a + b.lost, 0);
  const totalRate = totalWon + totalLost ? totalWon / (totalWon + totalLost) : 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Sales · Phase 3</div>
          <h1 className="page-title">Pipeline <em>Forecast</em></h1>
          <div className="page-sub">
            Every open deal weighted by stage probability. Win-rates by source. Days-in-stage vs benchmark — so we see which leads are stuck before they go cold.
          </div>
        </div>
        <div className="row gap-2">
          <Pill kind="outline">Last 90 days</Pill>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid-4" style={{ marginBottom: 14 }}>
        <Stat label="Open deals" value={open.length} sub={`${PPC.LEADS.filter(l => l.stage === "sa").length} in trial`} />
        <Stat
          label="Pipeline value"
          value={access.money ? fmtMoney(Math.round(fc.totalRaw), "CAD") : "—"}
          sub={access.money ? "if every deal closes" : "owner-only"} />
        <Stat
          label="Weighted forecast"
          value={access.money ? fmtMoney(Math.round(fc.totalWeighted), "CAD") : "—"}
          sub={access.money ? `~${Math.round((fc.totalWeighted / (fc.totalRaw || 1)) * 100)}% weighted average` : ""}
          delta="Probability-adjusted" deltaDir="up" />
        <Stat label="Win-rate (closed)" value={`${Math.round(totalRate * 100)}%`} sub={`${totalWon} won · ${totalLost} lost`}
              delta={totalRate >= 0.6 ? "On target" : "Below 60% target"} deltaDir={totalRate >= 0.6 ? "up" : "down"} />
      </div>

      {/* Stage probability + value */}
      <div className="widget" style={{ padding: 0, marginBottom: 14 }}>
        <div className="row" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>By stage · probability-weighted</span>
          <span className="muted" style={{ fontSize: 12.5 }}>Probabilities locked in <code>STAGE_WIN_PROB</code></span>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th>Stage</th>
              <th>Deals</th>
              <th>Win %</th>
              <th>Raw value</th>
              <th>Weighted</th>
              <th style={{ width: 220 }}>Distribution</th>
            </tr>
          </thead>
          <tbody>
            {stages.map(s => {
              if (s.stage.intent === "won" || s.stage.intent === "lost") return null;
              const prob = PPC.STAGE_WIN_PROB[s.stage.id];
              const pctOfTotal = fc.totalWeighted ? s.weighted / fc.totalWeighted : 0;
              return (
                <tr key={s.stage.id}>
                  <td><span style={{ fontWeight: 500 }}>{s.stage.name}</span></td>
                  <td className="mono">{s.count}</td>
                  <td className="mono">{Math.round(prob * 100)}%</td>
                  <td className="mono muted">{access.money ? fmtMoney(Math.round(s.raw), "CAD") : "—"}</td>
                  <td className="mono" style={{ fontWeight: 500 }}>{access.money ? fmtMoney(Math.round(s.weighted), "CAD") : "—"}</td>
                  <td>
                    <div className="bar" style={{ height: 8 }}>
                      <i style={{ width: `${pctOfTotal * 100}%`, background: "var(--accent)" }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Win-rate by source */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="widget" style={{ padding: 0 }}>
          <div className="row" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
            <span className="section-title" style={{ flex: 1 }}>Win-rate by source</span>
            <span className="muted" style={{ fontSize: 12.5 }}>last 90d</span>
          </div>
          <table className="t">
            <thead>
              <tr>
                <th>Source</th>
                <th>Won</th>
                <th>Lost</th>
                <th>In-flight</th>
                <th>Win rate</th>
                <th>Avg days</th>
              </tr>
            </thead>
            <tbody>
              {wins.map(w => (
                <tr key={w.source}>
                  <td><span style={{ fontWeight: 500 }}>{w.source}</span></td>
                  <td className="mono" style={{ color: "var(--ok)" }}>{w.won}</td>
                  <td className="mono" style={{ color: "var(--danger)" }}>{w.lost}</td>
                  <td className="mono muted">{w.inFlight}</td>
                  <td>
                    <div className="row gap-2">
                      <div className="bar" style={{ width: 80, height: 6 }}>
                        <i style={{
                          width: `${w.rate * 100}%`,
                          background: w.rate >= 0.6 ? "var(--ok)" : w.rate >= 0.4 ? "var(--warn)" : "var(--danger)"
                        }} />
                      </div>
                      <span className="mono" style={{ fontSize: 12.5 }}>{Math.round(w.rate * 100)}%</span>
                    </div>
                  </td>
                  <td className="mono muted">{w.avgDays}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Days-in-stage · benchmark</span>
            <span className="widget-action">red = stuck</span>
          </div>
          <div className="col gap-3" style={{ marginTop: 4 }}>
            {velocity.map(v => {
              const over = v.benchmark ? v.avg / v.benchmark : 0;
              const tone = over >= 1.5 ? "danger" : over >= 1.0 ? "warn" : "ok";
              return (
                <div key={v.stage.id} className="row gap-3" style={{ alignItems: "center" }}>
                  <div className="col" style={{ width: 130, minWidth: 0 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500 }}>{v.stage.name}</span>
                    <span className="muted-2" style={{ fontSize: 11.5 }}>benchmark {v.benchmark}d · {v.count} live</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="bar" style={{ height: 8 }}>
                      <i style={{
                        width: `${Math.min(100, (v.avg / Math.max(v.benchmark * 2, 1)) * 100)}%`,
                        background: tone === "danger" ? "var(--danger)" : tone === "warn" ? "var(--warn)" : "var(--ok)"
                      }} />
                    </div>
                  </div>
                  <span className="mono" style={{ width: 50, textAlign: "right", fontSize: 12.5 }}>{v.avg.toFixed(1)}d</span>
                  <Pill kind={tone}>{tone === "ok" ? "on pace" : tone === "warn" ? "watch" : "stuck"}</Pill>
                </div>
              );
            })}
          </div>
          <div className="muted-2" style={{ fontSize: 12.5, marginTop: 12, lineHeight: 1.5 }}>
            Each lead's "days in stage" comes from the live pipeline. Anything more than 1.5× benchmark trips a "stuck" pill — that's the Abhishek-poke list.
          </div>
        </div>
      </div>

      {/* Closing soon */}
      <div className="widget" style={{ padding: 0 }}>
        <div className="row" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>Most likely to close · this month</span>
          <span className="muted" style={{ fontSize: 12.5 }}>weighted ≥40%</span>
        </div>
        {closingSoon.length === 0 ? (
          <div className="empty" style={{ margin: 16 }}>No leads above 40% win probability right now.</div>
        ) : (
          <table className="t">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Source</th>
                <th>Stage</th>
                <th>MRR</th>
                <th>Win %</th>
                <th>Weighted</th>
                <th>Days in stage</th>
              </tr>
            </thead>
            <tbody>
              {closingSoon.map(l => (
                <tr key={l.id}>
                  <td><span style={{ fontWeight: 500 }}>{l.company}</span> <span className="muted" style={{ fontSize: 12.5 }}>· {l.contact}</span></td>
                  <td className="muted">{l.source}</td>
                  <td><Pill kind="outline">{PPC.SALES_STAGES.find(s => s.id === l.stage)?.name}</Pill></td>
                  <td className="mono">{access.money ? fmtMoney(l.budget, l.currency) : "—"}</td>
                  <td className="mono">{Math.round(l.prob * 100)}%</td>
                  <td className="mono" style={{ fontWeight: 500 }}>{access.money ? fmtMoney(Math.round(l.weightedCAD), "CAD") : "—"}</td>
                  <td className="mono muted">{l.days}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ForecastScreen });
