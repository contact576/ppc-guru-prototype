/* Performance Home — Looker mirror.
   Owner-only top-level performance screen.
   - KPI tiles (cross-client spend, conv, CPA, CTR) per service
   - 12-month MoM trends
   - Per-service breakdown
   - Drill-into-client */

function PerformanceScreen({ role }) {
  const PPC = window.PPC;
  const owners = ["jaydeep", "dhaval"];
  if (!owners.includes(role.id)) {
    return (
      <div>
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Restricted</div>
            <h1 className="page-title"><em>Performance</em></h1>
            <div className="page-sub">Owners only.</div>
          </div>
        </div>
        <div className="empty">This view is restricted to owners.</div>
      </div>
    );
  }

  const [service, setService] = React.useState("meta"); // meta | google | smm
  const data = PPC.PERF_TREND_12M[service];
  const months = data.months;

  /* Latest vs previous comparisons */
  function delta(arr) {
    const a = arr[arr.length - 1], b = arr[arr.length - 2];
    if (b == null) return { val: a, pct: 0, dir: "flat" };
    const pct = ((a - b) / Math.abs(b)) * 100;
    return { val: a, pct, dir: pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat" };
  }
  function deltaInverse(arr) {
    // for metrics where down is good (CPA)
    const d = delta(arr);
    return { ...d, goodDir: d.dir === "down" ? "good" : d.dir === "up" ? "bad" : "flat" };
  }

  /* Aggregate live account stats from META_ACCTS / GOOG_ACCTS — for the
     "current month from real accounts" callout. */
  const currentMonthAggregate = React.useMemo(() => {
    if (service === "smm") return null;
    const list = service === "google" ? PPC.GOOG_ACCTS : PPC.META_ACCTS;
    let spend = 0, conv = 0, byCurrency = { CAD: 0, USD: 0 };
    list.forEach(a => {
      if (a.status !== "active") return;
      spend += a.mtdSpend || 0;
      conv  += a.conv     || 0;
      byCurrency[a.currency] = (byCurrency[a.currency] || 0) + (a.mtdSpend || 0);
    });
    return { spend, conv, cpa: conv ? spend / conv : 0, byCurrency, count: list.filter(a => a.status === "active").length };
  }, [service]);

  /* Per-client breakdown for the focused service */
  const clientPerf = React.useMemo(() => {
    const rows = [];
    if (service === "smm") {
      Object.entries(PPC.SMM_QUOTAS || {}).forEach(([client, q]) => {
        const prof = PPC.PROFILES_RICH[client];
        if (!prof?.serviceContracts?.smm || prof.serviceContracts.smm.status !== "active") return;
        rows.push({
          client,
          metric1Label: "Reach", metric1: 28 + Math.round(Math.random() * 22),
          metric2Label: "Engagement %", metric2: (5.4 + Math.random() * 1.4).toFixed(1),
          metric3Label: "Posts", metric3: q.reels + q.statics,
          mom: -2 + Math.random() * 8
        });
      });
    } else {
      const list = service === "google" ? PPC.GOOG_ACCTS : PPC.META_ACCTS;
      list.filter(a => a.status === "active").forEach(a => {
        rows.push({
          client: a.client,
          metric1Label: "Spend", metric1: a.mtdSpend, metric1Currency: a.currency,
          metric2Label: "Conv", metric2: a.conv,
          metric3Label: "CPA", metric3: a.cpa,
          ctr: a.ctr,
          mom: -8 + Math.random() * 18
        });
      });
    }
    return rows;
  }, [service]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Owners only · Cross-client mirror</div>
          <h1 className="page-title"><em>Performance</em> home</h1>
          <div className="page-sub">
            Looker-style roll-up across every active account. Switch service tabs to see Meta vs Google vs SMM. Click any client to drill into their profile.
          </div>
        </div>
        <div className="chip-row">
          {["meta", "google", "smm"].map(s => (
            <span key={s} className={`chip ${service === s ? "active" : ""}`} onClick={() => setService(s)}>
              {PPC.SERVICE_INFO[s].short}
              <span className="chip-count">{
                s === "smm"
                  ? Object.keys(PPC.SMM_QUOTAS || {}).length
                  : (s === "google" ? PPC.GOOG_ACCTS : PPC.META_ACCTS).filter(a => a.status === "active").length
              }</span>
            </span>
          ))}
        </div>
      </div>

      {/* KPI tiles */}
      {service !== "smm" ? (
        <div className="grid-4" style={{ marginBottom: 14 }}>
          <PerfStat label="MTD spend" arr={data.spend} fmt={v => `$${(v/1000).toFixed(1)}k`} sub={`${currentMonthAggregate?.count || 0} accounts`} />
          <PerfStat label="Conversions" arr={data.conv} fmt={v => v.toLocaleString()} good="up" />
          <PerfStat label="CPA" arr={data.cpa} fmt={v => `$${v.toFixed(0)}`} good="down" />
          <PerfStat label="CTR" arr={data.ctr} fmt={v => `${v.toFixed(2)}%`} good="up" />
        </div>
      ) : (
        <div className="grid-4" style={{ marginBottom: 14 }}>
          <PerfStat label="Reach (× 1k)" arr={data.reach} fmt={v => v.toLocaleString()} good="up" />
          <PerfStat label="Engagement" arr={data.engagement} fmt={v => `${v.toFixed(1)}%`} good="up" />
          <PerfStat label="Posts shipped" arr={data.posts} fmt={v => v} good="up" />
          <PerfStat label="Follower gain" arr={data.followerGain} fmt={v => `+${v}`} good="up" />
        </div>
      )}

      {/* Trend chart split */}
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">
              {service === "smm" ? "Reach · 12 months" : "Spend · 12 months"}
            </span>
            <span className="widget-action mono">{months[0]} → {months[months.length - 1]}</span>
          </div>
          <BigTrendChart
            months={months}
            values={service === "smm" ? data.reach : data.spend}
            color="var(--accent)"
            fmt={v => service === "smm" ? `${Math.round(v)}k` : `$${Math.round(v / 1000)}k`}
          />
        </div>

        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">
              {service === "smm" ? "Engagement %" : "CPA · 12 months"}
            </span>
            <span className="widget-action mono">{service === "smm" ? "higher = better" : "lower = better"}</span>
          </div>
          <BigTrendChart
            months={months}
            values={service === "smm" ? data.engagement : data.cpa}
            color={service === "smm" ? "var(--ok)" : "var(--client)"}
            fmt={v => service === "smm" ? `${v.toFixed(1)}%` : `$${Math.round(v)}`}
          />
        </div>
      </div>

      {/* Current month aggregate (Meta/Google only) */}
      {currentMonthAggregate && (
        <div className="widget tinted" style={{ marginBottom: 14 }}>
          <div className="row gap-4" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
            <div className="col">
              <span className="page-eyebrow">Month-to-date · live</span>
              <div style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 500, lineHeight: 1.1 }} className="mono">
                ${Math.round(currentMonthAggregate.spend / 1000)}k spend
              </div>
              <span className="muted" style={{ fontSize: 12.5 }}>{currentMonthAggregate.count} accounts · CAD ${Math.round(currentMonthAggregate.byCurrency.CAD || 0)} · USD ${Math.round(currentMonthAggregate.byCurrency.USD || 0)}</span>
            </div>
            <div className="v-divider" />
            <div className="col">
              <span className="page-eyebrow">Conversions</span>
              <div style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 500, lineHeight: 1.1 }} className="mono">
                {currentMonthAggregate.conv.toLocaleString()}
              </div>
              <span className="muted" style={{ fontSize: 12.5 }}>across active accounts</span>
            </div>
            <div className="v-divider" />
            <div className="col">
              <span className="page-eyebrow">Blended CPA</span>
              <div style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 500, lineHeight: 1.1 }} className="mono">
                ${currentMonthAggregate.cpa.toFixed(0)}
              </div>
              <span className="muted" style={{ fontSize: 12.5 }}>spend ÷ conv (mixed currency caveat)</span>
            </div>
            <div className="sp" style={{ flex: 1 }} />
            <button className="btn" onClick={() => window.askAssistant?.(`Summarize how ${PPC.SERVICE_INFO[service].label} is performing this month vs last. Any accounts I should worry about?`)}>
              <Icon k="sparkle" />Ask Guru
            </button>
          </div>
        </div>
      )}

      {/* Per-client table */}
      <div className="widget" style={{ padding: 0 }}>
        <div className="row" style={{ padding: "12px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>By client · {PPC.SERVICE_INFO[service].label}</span>
          <span className="muted" style={{ fontSize: 12.5 }}>{clientPerf.length} active</span>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th>Client</th>
              <th>{clientPerf[0]?.metric1Label || "—"}</th>
              <th>{clientPerf[0]?.metric2Label || "—"}</th>
              <th>{clientPerf[0]?.metric3Label || "—"}</th>
              {service !== "smm" && <th>CTR</th>}
              <th>MoM</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientPerf.map(r => (
              <tr key={r.client} style={{ cursor: "pointer" }} onClick={() => window.openClientPanel(r.client)}>
                <td><span style={{ fontWeight: 500, color: "var(--accent)" }}>{r.client}</span></td>
                <td className="mono">{
                  r.metric1Currency
                    ? fmtMoney(Math.round(r.metric1), r.metric1Currency)
                    : (typeof r.metric1 === "number" ? r.metric1.toLocaleString() : r.metric1)
                }</td>
                <td className="mono">{typeof r.metric2 === "number" ? r.metric2 : r.metric2}</td>
                <td className="mono">{
                  r.metric3Label === "CPA"
                    ? `$${Math.round(r.metric3)}`
                    : typeof r.metric3 === "number" ? r.metric3 : r.metric3
                }</td>
                {service !== "smm" && <td className="mono muted">{r.ctr?.toFixed(2)}%</td>}
                <td>
                  <Pill kind={r.mom > 1 ? "ok" : r.mom < -1 ? "danger" : "outline"}>
                    {r.mom > 0 ? "▲" : r.mom < 0 ? "▼" : "—"} {Math.abs(r.mom).toFixed(1)}%
                  </Pill>
                </td>
                <td><button className="btn sm" onClick={(e) => { e.stopPropagation(); window.openClientPanel(r.client); }}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Stat tile that compares last vs prev */
function PerfStat({ label, arr, fmt, good = "up", sub }) {
  const a = arr[arr.length - 1], b = arr[arr.length - 2];
  const pct = b ? ((a - b) / Math.abs(b)) * 100 : 0;
  const dir = pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat";
  const isGood = (good === "up" && dir === "up") || (good === "down" && dir === "down") || dir === "flat";
  return (
    <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6, boxShadow: "var(--sh-1)" }}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{fmt(a)}</span>
      <div className="row gap-2" style={{ alignItems: "center" }}>
        <Pill kind={isGood ? "ok" : "danger"}>
          {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"} {Math.abs(pct).toFixed(1)}%
        </Pill>
        <span className="muted-2" style={{ fontSize: 12.5 }}>{sub || "vs prev month"}</span>
      </div>
      <Spark data={arr.slice(-6)} w={140} h={26} color={isGood ? "var(--ok)" : "var(--accent)"} />
    </div>
  );
}

/* Wide trend chart */
function BigTrendChart({ months, values, color = "var(--accent)", fmt = v => v }) {
  const W = 500, H = 180, PAD_L = 38, PAD_R = 12, PAD_T = 12, PAD_B = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xFor = i => PAD_L + (i / (values.length - 1)) * (W - PAD_L - PAD_R);
  const yFor = v => PAD_T + (1 - (v - min) / range) * (H - PAD_T - PAD_B);
  const pts = values.map((v, i) => [xFor(i), yFor(v)]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const fillPath = `${path} L${pts[pts.length - 1][0].toFixed(1)} ${H - PAD_B} L${pts[0][0].toFixed(1)} ${H - PAD_B} Z`;
  /* y ticks */
  const ticks = [min, (min + max) / 2, max];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PAD_L} x2={W - PAD_R} y1={yFor(t)} y2={yFor(t)} stroke="var(--line)" strokeDasharray="2 4" />
          <text x={4} y={yFor(t) + 3} fontSize="9" fill="var(--ink-4)" fontFamily="var(--mono)">{fmt(t)}</text>
        </g>
      ))}
      <path d={fillPath} fill={color} opacity="0.12" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 3.5 : 2.2} fill={color} />
      ))}
      {months.map((m, i) => (
        <text key={i} x={xFor(i)} y={H - 6} fontSize="9" fill="var(--ink-4)" textAnchor="middle" fontFamily="var(--mono)">
          {m}
        </text>
      ))}
    </svg>
  );
}

Object.assign(window, { PerformanceScreen });
