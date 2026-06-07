/* Platforms — Meta + Google daily-budget pacing dashboard.
   ----------------------------------------------------------------
   The daily-driver tool for Vanshika (Meta) and Harsh (Google).

   Three tabs per platform:
     1. Pacing      — today's budget pacing across every account
                      (replicates + replaces the daily spend sheet)
     2. Performance — CPA / CTR / conversion-quality view
     3. Optimization Log — every change made this month, audit trail.

   All pacing math is computed live from the inputs in data.js
   (monthlyBudget, currentMonthBudget, mtdSpend, excludedWeekdays,
   excludedDates) against TODAY. No hard-coded "shortfall" values —
   if you change a budget or excluded weekday, the table re-derives.
*/

/* ─── Date / pacing math ─────────────────────────────────────────── */

function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function daysInMonth(yyyymm) {
  const [y, m] = yyyymm.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}
function fmtMonth(yyyymm) {
  const [y, m] = yyyymm.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}
function fmtToday(iso) {
  return parseISO(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
}

/* Compute active days passed/remaining for a given month + today,
   given excluded weekdays (0=Sun..6=Sat) and excluded ISO dates. */
function computeActiveDays(month /* "2026-05" */, todayISO, excludedWeekdays = [], excludedDates = []) {
  const dim = daysInMonth(month);
  const [y, m] = month.split("-").map(Number);
  const todayDate = parseISO(todayISO);
  const excludedSet = new Set(excludedDates);

  let activeTotal = 0;
  let activePassed = 0;
  let activeRemaining = 0;
  let excludedTotal = 0;
  let excludedPassed = 0;
  const dayMap = []; /* per-day { d, dow, excluded, passed } */

  for (let d = 1; d <= dim; d++) {
    const dt = new Date(Date.UTC(y, m - 1, d));
    const dow = dt.getUTCDay();
    const iso = `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const excluded = excludedWeekdays.includes(dow) || excludedSet.has(iso);
    const passed = dt <= todayDate;
    if (excluded) {
      excludedTotal++;
      if (passed) excludedPassed++;
    } else {
      activeTotal++;
      if (passed) activePassed++;
      else activeRemaining++;
    }
    dayMap.push({ d, dow, excluded, passed, isToday: iso === todayISO });
  }
  return { dim, activeTotal, activePassed, activeRemaining, excludedTotal, excludedPassed, dayMap };
}

/* Pace a single account against today. Returns derived values used
   throughout the UI. Pure function — call as needed. */
function paceFor(acct, todayISO) {
  const month = todayISO.slice(0, 7);
  const ad = computeActiveDays(month, todayISO, acct.excludedWeekdays, acct.excludedDates);
  const budget = acct.currentMonthBudget;
  const mtd = acct.mtdSpend;

  const proRata = ad.activeTotal === 0 ? 0 : budget * (ad.activePassed / ad.activeTotal);
  const shortfall = proRata - mtd; /* positive = behind, negative = overpacing */
  const utilization = budget === 0 ? 0 : mtd / budget;
  const projectedEom = ad.activePassed === 0 ? 0 : mtd * (ad.activeTotal / ad.activePassed);
  const remaining = Math.max(0, budget - mtd);
  const suggestedDaily = ad.activeRemaining === 0 ? 0 : remaining / ad.activeRemaining;
  const normalDaily = ad.activeTotal === 0 ? 0 : budget / ad.activeTotal;
  const currentDaily = acct.currentDailyBudget || 0;

  /* Guidance: compare suggested vs current. ±15% band = Fine. */
  let guidance = "fine";
  let guidanceReason = "Within ±15% of suggested";
  if (acct.status === "error" || acct.status === "paused") {
    guidance = "error";
    guidanceReason = acct.note || "Account needs attention";
  } else if (currentDaily === 0) {
    guidance = "error";
    guidanceReason = "Daily budget set to $0";
  } else if (suggestedDaily > currentDaily * 1.15) {
    guidance = "increase";
    guidanceReason = `Bump daily by ~${Math.round(((suggestedDaily / currentDaily) - 1) * 100)}% to spend on pace`;
  } else if (suggestedDaily < currentDaily * 0.85) {
    guidance = "decrease";
    guidanceReason = `Lower daily by ~${Math.round((1 - (suggestedDaily / currentDaily)) * 100)}% — overpacing`;
  }

  return {
    ...ad,
    budget, mtd, proRata, shortfall, utilization, projectedEom,
    suggestedDaily, normalDaily, currentDaily,
    guidance, guidanceReason
  };
}

/* Small format helpers */
const $m = (n, cur = "CAD") => {
  const sym = cur === "USD" ? "$" : "$";
  return sym + (n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
const $d = (n, cur = "CAD") => {
  const sym = cur === "USD" ? "$" : "$";
  return sym + (n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const pct = (n, d = 1) => (n * 100).toFixed(d) + "%";

/* ─── Days-since helper for last-opt freshness ────────────────────── */
function daysAgo(dateISO, todayISO) {
  if (!dateISO) return Infinity;
  const a = parseISO(todayISO).getTime();
  const b = parseISO(dateISO).getTime();
  return Math.round((a - b) / 86400000);
}
function daysAgoLabel(dateISO, todayISO) {
  const d = daysAgo(dateISO, todayISO);
  if (d === Infinity) return "Never";
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 14) return "1 wk ago";
  return `${Math.floor(d / 7)} wks ago`;
}

window.PPC.paceFor = paceFor;
window.PPC.computeActiveDays = computeActiveDays;
window.PPC.daysAgo = daysAgo;
window.PPC.daysAgoLabel = daysAgoLabel;

/* ════════════════════════════════════════════════════════════════════
   MAIN SCREEN
   ════════════════════════════════════════════════════════════════════ */

function PlatformScreen({ which, role, setScreen }) {
  useStore();
  const isGoogle = which === "google";
  const accts = isGoogle ? window.PPC.GOOG_ACCTS : window.PPC.META_ACCTS;
  const { OPT_LOG, userMap, TODAY } = window.PPC;
  const platformLogs = OPT_LOG.filter(l => l.platform === (isGoogle ? "google" : "meta"));
  const [tab, setTab] = React.useState("pacing");
  const [opened, setOpened] = React.useState(null);
  const [logOpen, setLogOpen] = React.useState(null); /* account for new-log modal */
  const specialistId = isGoogle ? "harsh" : "vanshika";

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">
            Daily budget pacing · via Adzviser sync · Last sync 09:42 EST
          </div>
          <h1 className="page-title">
            {isGoogle
              ? <span>Google <em>Accounts</em></span>
              : <span>Meta <em>Accounts</em></span>}
          </h1>
          <div className="page-sub">
            {isGoogle
              ? "Harsh's daily-driver. Every active Google account, paced against this month's budget. Goal: 100% utilization across the book — every unspent dollar is unbilled revenue."
              : "Vanshika's daily-driver. Every active Meta account, paced against this month's budget. Logged optimizations sync to each client's profile automatically."}
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={() => window.toast && window.toast("Synced from Adzviser", { icon: "✓" })}><Icon k="cycle" />Sync now</button>
          <button className="btn"><Icon k="plus" />Add account</button>
        </div>
      </div>

      {/* Today strip + tabs */}
      <div className="row" style={{ marginBottom: 14, alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <TodayStrip todayISO={TODAY} accts={accts} />
        <div style={{ flex: 1 }} />
        <div className="tabs">
          <div className={`tab ${tab === "pacing" ? "active" : ""}`} onClick={() => setTab("pacing")}>Budget pacing</div>
          <div className={`tab ${tab === "performance" ? "active" : ""}`} onClick={() => setTab("performance")}>Performance</div>
          <div className={`tab ${tab === "log" ? "active" : ""}`} onClick={() => setTab("log")}>Optimization log <span className="muted mono" style={{ fontSize: 12.5 }}>({platformLogs.length})</span></div>
        </div>
      </div>

      {tab === "pacing" && (
        <PacingTab accts={accts} isGoogle={isGoogle} todayISO={TODAY}
          onOpen={setOpened} onLog={(a) => setLogOpen(a)} />
      )}
      {tab === "performance" && (
        <PerformanceTab accts={accts} isGoogle={isGoogle} onOpen={setOpened} />
      )}
      {tab === "log" && (
        <OptimizationLog log={platformLogs} userMap={userMap} todayISO={TODAY}
          onNewLog={() => setLogOpen({})} platform={isGoogle ? "google" : "meta"} />
      )}

      {opened && (
        <AccountPanel
          account={opened} isGoogle={isGoogle}
          log={platformLogs} todayISO={TODAY}
          onClose={() => setOpened(null)}
          onLog={() => setLogOpen(opened)}
        />
      )}

      {logOpen && (
        <LogOptModal
          account={logOpen} accts={accts}
          isGoogle={isGoogle} who={specialistId}
          onClose={() => setLogOpen(null)}
        />
      )}
    </div>
  );
}

/* ─── Today strip — month + day context ───────────────────────────── */

function TodayStrip({ todayISO, accts }) {
  /* Use the first account's exclusion settings for the global strip
     (most are WEEKEND-excluded; this is informational anyway) */
  const sample = accts.find(a => a.excludedWeekdays && a.excludedWeekdays.length) || accts[0];
  const ad = computeActiveDays(todayISO.slice(0,7), todayISO, sample?.excludedWeekdays || [], []);
  return (
    <div className="token-strip" style={{ background: "var(--card)", borderColor: "var(--line)" }}>
      <span className="mono" style={{ color: "var(--ink)", fontWeight: 500 }}>{fmtToday(todayISO)}</span>
      <span style={{ color: "var(--ink-4)" }}>·</span>
      <span>Day <span className="mono" style={{ color: "var(--ink)" }}>{ad.activePassed + ad.excludedPassed}</span> of <span className="mono">{ad.dim}</span></span>
      <span style={{ color: "var(--ink-4)" }}>·</span>
      <span><span className="mono" style={{ color: "var(--accent)" }}>{ad.activeRemaining}</span> active days left</span>
      <span style={{ color: "var(--ink-4)" }}>·</span>
      <span><span className="mono">{ad.activePassed}</span> / <span className="mono">{ad.activeTotal}</span> active passed</span>
      <span style={{ color: "var(--ink-4)" }}>·</span>
      <span>Excludes <span className="mono">{ad.excludedTotal}</span> day{ad.excludedTotal === 1 ? "" : "s"} (Sat + Sun)</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PACING TAB
   ════════════════════════════════════════════════════════════════════ */

function PacingTab({ accts, isGoogle, todayISO, onOpen, onLog }) {
  const [showOnly, setShowOnly] = React.useState("all"); /* all | action | ok | error */
  const [sortKey, setSortKey] = React.useState("guidance");

  /* Compute pacing for every account once */
  const rows = accts.map(a => ({ acct: a, p: paceFor(a, todayISO) }));

  /* Aggregate KPIs (across all accts in current currency-agnostic count) */
  const totalBudget = rows.reduce((s, r) => s + r.p.budget, 0);
  const totalMtd    = rows.reduce((s, r) => s + r.p.mtd, 0);
  const totalShortfall = rows.reduce((s, r) => s + Math.max(0, r.p.shortfall), 0);
  const totalProjected = rows.reduce((s, r) => s + r.p.projectedEom, 0);
  const eomUtil = totalBudget ? totalProjected / totalBudget : 0;
  const countNeedAction = rows.filter(r => r.p.guidance !== "fine").length;

  /* Currency split — show breakdown for transparency since the book mixes CAD + USD */
  const byCur = rows.reduce((acc, r) => {
    const c = r.acct.currency;
    acc[c] = acc[c] || { budget: 0, mtd: 0, proRata: 0 };
    acc[c].budget += r.p.budget;
    acc[c].mtd += r.p.mtd;
    acc[c].proRata += r.p.proRata;
    return acc;
  }, {});

  /* Sort */
  const guidanceOrder = { error: 0, increase: 1, decrease: 2, fine: 3 };
  const sorted = [...rows].sort((a, b) => {
    if (sortKey === "guidance") {
      const d = guidanceOrder[a.p.guidance] - guidanceOrder[b.p.guidance];
      if (d) return d;
      return Math.abs(b.p.shortfall) - Math.abs(a.p.shortfall);
    }
    if (sortKey === "shortfall")  return b.p.shortfall - a.p.shortfall;
    if (sortKey === "util")       return a.p.utilization - b.p.utilization;
    if (sortKey === "budget")     return b.p.budget - a.p.budget;
    if (sortKey === "lastOpt") {
      const da = a.acct.lastOptISO ? daysAgo(a.acct.lastOptISO, todayISO) : 999;
      const db = b.acct.lastOptISO ? daysAgo(b.acct.lastOptISO, todayISO) : 999;
      return db - da;
    }
    return 0;
  });

  const filtered = sorted.filter(r => {
    if (showOnly === "all") return true;
    if (showOnly === "action") return r.p.guidance !== "fine";
    if (showOnly === "ok") return r.p.guidance === "fine";
    if (showOnly === "error") return r.p.guidance === "error";
    return true;
  });

  return (
    <div>
      {/* KPI tiles */}
      <div className="grid-4" style={{ marginBottom: 14 }}>
        <Stat
          label="Monthly budget · book"
          value={`${$m(totalBudget)}`}
          sub={Object.entries(byCur).map(([c,v]) => `${c} ${$m(v.budget)}`).join(" · ")}
        />
        <Stat
          label="MTD spend"
          value={`${$m(totalMtd)}`}
          sub={`${pct(totalMtd/totalBudget)} of book · pro-rata ${$m(rows.reduce((s,r)=>s+r.p.proRata,0))}`}
        />
        <Stat
          label="Under-pacing shortfall"
          value={`${$m(totalShortfall)}`}
          sub={`${countNeedAction} account${countNeedAction===1?"":"s"} need adjustment today`}
          delta={countNeedAction > 0 ? "needs action" : "all paced"}
          deltaDir={countNeedAction > 0 ? "down" : "up"}
        />
        <Stat
          label="Projected EOM utilization"
          value={pct(eomUtil)}
          sub={`If no adjustments — at the goal of 100%`}
          delta={eomUtil >= 0.97 ? "on target" : eomUtil >= 0.9 ? "slightly behind" : "well behind"}
          deltaDir={eomUtil >= 0.97 ? "up" : "down"}
        />
      </div>

      {/* Pacing alert */}
      {countNeedAction > 0 && (
        <div className="widget" style={{
          background: "var(--accent-tint)", borderColor: "var(--accent-tint-2)",
          padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12
        }}>
          <Icon k="alert" style={{ color: "var(--accent-2)" }} />
          <div className="col" style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, color: "var(--ink)" }}>
              {countNeedAction} account{countNeedAction === 1 ? "" : "s"} need budget adjustment today
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
              <span className="mono">{$m(totalShortfall)}</span> projected to go unspent if daily budgets aren't bumped before EOD. That's roughly <span className="mono">{$m(totalShortfall * 0.15)}</span> in unbilled management fees @ 15%.
            </div>
          </div>
          <button className="btn accent" onClick={() => setShowOnly("action")}>Show only flagged →</button>
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="chip-row">
          <span className={`chip ${showOnly === "all" ? "active" : ""}`} onClick={() => setShowOnly("all")}>All <span className="chip-count">{rows.length}</span></span>
          <span className={`chip ${showOnly === "action" ? "active" : ""}`} onClick={() => setShowOnly("action")}>Needs action <span className="chip-count">{countNeedAction}</span></span>
          <span className={`chip ${showOnly === "ok" ? "active" : ""}`} onClick={() => setShowOnly("ok")}>Fine <span className="chip-count">{rows.length - countNeedAction}</span></span>
          <span className={`chip ${showOnly === "error" ? "active" : ""}`} onClick={() => setShowOnly("error")}>Errors <span className="chip-count">{rows.filter(r => r.p.guidance === "error").length}</span></span>
        </div>
        <div className="sp" />
        <span className="muted" style={{ fontSize: 12.5 }}>Sort by</span>
        <div className="seg">
          <button className={sortKey === "guidance" ? "on" : ""} onClick={() => setSortKey("guidance")}>Action urgency</button>
          <button className={sortKey === "shortfall" ? "on" : ""} onClick={() => setSortKey("shortfall")}>Shortfall</button>
          <button className={sortKey === "util" ? "on" : ""} onClick={() => setSortKey("util")}>Utilization</button>
          <button className={sortKey === "budget" ? "on" : ""} onClick={() => setSortKey("budget")}>Budget</button>
          <button className={sortKey === "lastOpt" ? "on" : ""} onClick={() => setSortKey("lastOpt")}>Last opt</button>
        </div>
      </div>

      {/* The big table */}
      <div className="widget" style={{ padding: 0 }}>
        <table className="t pacing-t">
          <thead>
            <tr>
              <th style={{ width: 18 }}></th>
              <th>Client</th>
              <th style={{ width: 130 }}>Mo budget</th>
              <th>MTD vs pro-rata target</th>
              <th style={{ width: 70 }} className="num-h">Util</th>
              <th style={{ width: 195 }}>Daily budget (normal / suggested / current)</th>
              <th style={{ width: 130 }}>Guidance</th>
              <th style={{ width: 130 }}>Last opt</th>
              <th style={{ width: 28 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ acct, p }) => (
              <PacingRow key={acct.id} acct={acct} p={p}
                onOpen={() => onOpen(acct)} onLog={() => onLog(acct)} todayISO={todayISO} />
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="9"><div className="empty" style={{ margin: 14 }}>No accounts match this filter.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="muted" style={{ fontSize: 12.5, marginTop: 10, display: "flex", gap: 18, flexWrap: "wrap" }}>
        <span><b style={{ color: "var(--ink-2)" }}>Pro-rata target</b> = monthly budget × (active days passed ÷ active days total)</span>
        <span><b style={{ color: "var(--ink-2)" }}>Suggested daily</b> = (budget − MTD) ÷ active days remaining</span>
        <span><b style={{ color: "var(--ink-2)" }}>Guidance band</b> = suggested within ±15% of current daily = Fine</span>
      </div>

      {/* Extra CSS scoped to this table */}
      <style>{`
        table.pacing-t th.num-h { text-align: right; }
        table.pacing-t td { vertical-align: middle; }
        table.pacing-t tr { cursor: pointer; }
        .pace-bar {
          position: relative;
          height: 18px;
          background: var(--card-2);
          border: 1px solid var(--line-2);
          border-radius: 4px;
          overflow: hidden;
          min-width: 220px;
        }
        .pace-bar .pace-fill {
          height: 100%; background: var(--accent);
          border-radius: 0;
        }
        .pace-bar .pace-fill.ok    { background: var(--ok); }
        .pace-bar .pace-fill.warn  { background: var(--warn); }
        .pace-bar .pace-fill.over  { background: var(--danger); }
        .pace-bar .pace-target {
          position: absolute; top: -3px; bottom: -3px;
          width: 2px; background: var(--ink);
          z-index: 2;
        }
        .pace-bar .pace-target::before {
          content: "▼"; position: absolute;
          top: -10px; left: -6px;
          font-size: 11.5px; color: var(--ink);
        }
        .pace-bar .pace-num {
          position: absolute; inset: 0;
          display: flex; align-items: center; padding: 0 6px;
          font-family: var(--mono); font-size: 12.5px;
          color: var(--ink-2); justify-content: space-between;
          mix-blend-mode: difference; color: #fff;
          pointer-events: none;
        }
        .pace-bar .pace-num .l { font-weight: 500; }
        .pace-bar .pace-num .r { color: rgba(255,255,255,.78); }
        .daily-trio { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; align-items: center; }
        .daily-trio > div { padding: 0 6px; text-align: center; }
        .daily-trio > div + div { border-left: 1px dashed var(--line); }
        .daily-trio .lbl { font-size: 11.5px; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-4); }
        .daily-trio .val { font-family: var(--mono); font-size: 13.5px; color: var(--ink); }
        .daily-trio .sug   .val { color: var(--accent); font-weight: 500; }
        .daily-trio .cur   .val { color: var(--ink); }
        .guidance-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 3px 9px; border-radius: 999px;
          font-size: 12.5px; font-weight: 500; white-space: nowrap;
        }
        .guidance-pill.fine     { background: var(--ok-tint);     color: var(--ok); }
        .guidance-pill.increase { background: var(--warn-tint);   color: var(--warn); }
        .guidance-pill.decrease { background: var(--danger-tint); color: var(--danger); }
        .guidance-pill.error    { background: var(--danger-tint); color: var(--danger); border: 1px dashed var(--danger); }
        .guidance-pill .arr { font-family: var(--mono); }
        .last-opt-cell {
          display: flex; flex-direction: column; gap: 2px;
        }
        .last-opt-cell .stale-dot { color: var(--danger); font-weight: 600; }
        .row-track { background: var(--card); }
        .row-action {
          background: linear-gradient(90deg, var(--warn-tint) 0%, rgba(245,234,208,0.18) 100%);
        }
        .row-error {
          background: linear-gradient(90deg, var(--danger-tint) 0%, rgba(242,218,207,0.18) 100%);
        }
      `}</style>
    </div>
  );
}

/* ─── Pacing row ─────────────────────────────────────────────────── */

function PacingRow({ acct, p, onOpen, onLog, todayISO }) {
  const rowClass =
    p.guidance === "error" ? "row-error" :
    p.guidance === "fine"  ? "row-track" : "row-action";

  /* Bar visualization: mtd as fill, pro-rata as marker on a 0→budget axis */
  const mtdPct = Math.min(100, (p.mtd / p.budget) * 100);
  const targetPct = Math.min(100, (p.proRata / p.budget) * 100);
  const fillClass =
    p.guidance === "error" ? "warn" :
    p.shortfall > p.budget * 0.05 ? "warn" :         /* behind */
    p.shortfall < -p.budget * 0.05 ? "over" :        /* overpacing */
    "ok";

  const lastOptDays = acct.lastOptISO ? daysAgo(acct.lastOptISO, todayISO) : Infinity;
  const stale = lastOptDays > 10;
  const fresh = lastOptDays <= 3;

  return (
    <tr className={rowClass} onClick={onOpen}>
      <td>
        <span className={
          acct.status === "error" ? "dot-danger" :
          p.guidance === "fine"   ? "dot-ok"     :
          p.guidance === "increase" ? "dot-warn" :
          p.guidance === "decrease" ? "dot-danger" : "dot-warn"
        } />
      </td>
      <td>
        <div className="col" style={{ gap: 2 }}>
          <div style={{ fontWeight: 500, fontSize: 13.5 }}>{acct.client}</div>
          <div className="row gap-2" style={{ fontSize: 12.5, color: "var(--ink-4)" }}>
            <span>{acct.campaigns.length} campaign{acct.campaigns.length === 1 ? "" : "s"}</span>
            {!acct.conversionTracking && <span style={{ color: "var(--danger)" }}>· no conv. tracking</span>}
            {!acct.automatedRules && <span>· rules off</span>}
          </div>
        </div>
      </td>
      <td>
        <div className="mono" style={{ fontSize: 13.5, fontWeight: 500 }}>{$m(p.budget, acct.currency)}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{acct.currency} · {acct.excludedWeekdays.length ? "Mon-Fri" : "Daily"}</div>
      </td>
      <td>
        <div className="pace-bar" title={`MTD ${$d(p.mtd, acct.currency)} · target ${$d(p.proRata, acct.currency)}`}>
          <div className={`pace-fill ${fillClass}`} style={{ width: `${mtdPct}%` }} />
          <div className="pace-target" style={{ left: `calc(${targetPct}% - 1px)` }} />
          <div className="pace-num">
            <span className="l">{$d(p.mtd, acct.currency)}</span>
            <span className="r">/ {$m(p.budget, acct.currency)}</span>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 4 }}>
          {p.shortfall > 0
            ? <span>Behind <span className="mono" style={{ color: "var(--warn)" }}>{$d(p.shortfall, acct.currency)}</span> vs pro-rata</span>
            : p.shortfall < -1
            ? <span>Over by <span className="mono" style={{ color: "var(--danger)" }}>{$d(-p.shortfall, acct.currency)}</span></span>
            : <span style={{ color: "var(--ok)" }}>On pro-rata pace</span>}
        </div>
      </td>
      <td style={{ textAlign: "right" }}>
        <div className="mono" style={{ fontSize: 15, fontWeight: 500,
          color: p.utilization < 0.5 ? "var(--danger)" : p.utilization < 0.75 ? "var(--warn)" : "var(--ink)"
        }}>{pct(p.utilization)}</div>
      </td>
      <td>
        <div className="daily-trio">
          <div title="Monthly budget ÷ active days in month">
            <div className="lbl">Normal</div>
            <div className="val">{$d(p.normalDaily, acct.currency)}</div>
          </div>
          <div className="sug" title="(Budget − MTD) ÷ active days remaining">
            <div className="lbl">Suggest</div>
            <div className="val">{$d(p.suggestedDaily, acct.currency)}</div>
          </div>
          <div className="cur" title="Currently set in account">
            <div className="lbl">Current</div>
            <div className="val">{$d(p.currentDaily, acct.currency)}</div>
          </div>
        </div>
      </td>
      <td>
        <div className={`guidance-pill ${p.guidance}`} title={p.guidanceReason}>
          {p.guidance === "fine" && <><span>✓</span><span>Fine</span></>}
          {p.guidance === "increase" && <><span className="arr">↑</span><span>Increase</span></>}
          {p.guidance === "decrease" && <><span className="arr">↓</span><span>Decrease</span></>}
          {p.guidance === "error" && <><span>!</span><span>Error</span></>}
        </div>
      </td>
      <td>
        <div className="last-opt-cell">
          <div style={{ fontSize: 12.5 }} className={stale ? "stale-dot" : ""}>
            {acct.lastOptISO ? daysAgoLabel(acct.lastOptISO, todayISO) : "Never logged"}
            {stale && acct.lastOptISO && <span> ⚠</span>}
          </div>
          <div className="mono" style={{ fontSize: 11.5, color: fresh ? "var(--ok)" : "var(--ink-4)" }}>
            {acct.lastOptCount || 0}× this month · target ≥4
          </div>
        </div>
      </td>
      <td onClick={(e) => { e.stopPropagation(); onLog(); }} title="Log optimization">
        <button className="btn ghost sm" style={{ padding: 4 }}><Icon k="plus" /></button>
      </td>
    </tr>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PERFORMANCE TAB
   ════════════════════════════════════════════════════════════════════ */

function PerformanceTab({ accts, isGoogle, onOpen }) {
  const totalSpend = accts.reduce((a, x) => a + x.mtdSpend, 0);
  const totalConv  = accts.reduce((a, x) => a + x.conv, 0);
  const avgCPA = totalConv ? (totalSpend / totalConv).toFixed(1) : "—";

  return (
    <div>
      <div className="grid-4" style={{ marginBottom: 14 }}>
        <Stat label="Accounts"         value={accts.length} sub={`${accts.filter(a => a.status !== "active").length} need attention`} />
        <Stat label="MTD spend"        value={$m(totalSpend)} sub="this month, all accts" />
        <Stat label="Conversions"      value={totalConv} sub="this month, all accts" />
        <Stat label="Avg CPA (blended)" value={`$${avgCPA}`} delta={isGoogle ? "−4% MoM" : "+2% MoM"} deltaDir={isGoogle ? "up" : "down"} />
      </div>
      <div className="widget" style={{ padding: 0 }}>
        <table className="t">
          <thead>
            <tr>
              <th></th><th>Client</th>
              <th>MTD spend</th><th>Conversions</th><th>CPA</th><th>CTR</th>
              <th>9-day trend</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accts.map(a => (
              <tr key={a.id} onClick={() => onOpen(a)} style={{ cursor: "pointer" }}>
                <td><span className={a.status === "error" ? "dot-danger" : "dot-ok"} /></td>
                <td><span style={{ fontWeight: 500 }}>{a.client}</span></td>
                <td className="mono">{$m(a.mtdSpend, a.currency)}</td>
                <td className="mono">{a.conv}</td>
                <td className="mono">${a.cpa}</td>
                <td className="mono">{a.ctr}%</td>
                <td><Spark data={a.trend} w={90} h={22} color={a.status === "error" ? "var(--danger)" : "var(--accent)"} fill={false} /></td>
                <td>
                  {a.status === "error"
                    ? <Pill kind="danger">{a.note || "Review"}</Pill>
                    : a.note
                      ? <Pill kind="warn">{a.note}</Pill>
                      : <Pill kind="ok">Healthy</Pill>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   OPTIMIZATION LOG (tab)
   ════════════════════════════════════════════════════════════════════ */

function OptimizationLog({ log, userMap, todayISO, onNewLog, platform }) {
  const [filter, setFilter] = React.useState("all");
  const filtered = log.filter(l =>
    filter === "all" ? true :
    filter === "stale" ? l.stale :
    (l.tags || []).includes(filter)
  );

  /* Coverage stats */
  const accts = (platform === "google" ? window.PPC.GOOG_ACCTS : window.PPC.META_ACCTS);
  const meetsTarget = accts.filter(a => (a.lastOptCount || 0) >= 4).length;
  const total = accts.length;

  return (
    <div>
      <div className="row" style={{ marginBottom: 14, alignItems: "flex-end" }}>
        <div className="col">
          <h2 className="section-title" style={{ fontSize: 19 }}>Optimization Log</h2>
          <div className="muted" style={{ fontSize: 12.5 }}>
            Every change made this month — the audit trail. Goal: ≥ 4 optimizations / account / month. Each logged change auto-mirrors to the client's profile as an optimization note.
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="seg" style={{ marginRight: 8 }}>
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "keywords" ? "on" : ""} onClick={() => setFilter("keywords")}>Keywords</button>
          <button className={filter === "budget" ? "on" : ""} onClick={() => setFilter("budget")}>Budget</button>
          <button className={filter === "bidding" ? "on" : ""} onClick={() => setFilter("bidding")}>Bidding</button>
          <button className={filter === "creative" ? "on" : ""} onClick={() => setFilter("creative")}>Creative</button>
          <button className={filter === "audience" ? "on" : ""} onClick={() => setFilter("audience")}>Audience</button>
          <button className={filter === "stale" ? "on" : ""} onClick={() => setFilter("stale")}>Stale</button>
        </div>
        <button className="btn accent" onClick={onNewLog}><Icon k="plus" />Log change</button>
      </div>

      {/* Coverage bar */}
      <div className="widget" style={{ marginBottom: 14, padding: 14 }}>
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="label">Coverage this month</span>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 12.5, color: "var(--ink)" }}>{meetsTarget}/{total} accounts meeting target</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {accts.map(a => {
            const c = a.lastOptCount || 0;
            const tone = c >= 4 ? "var(--ok)" : c >= 2 ? "var(--warn)" : "var(--danger)";
            return (
              <div key={a.id} title={`${a.client} — ${c} this month`} style={{
                flex: 1, height: 24, background: "var(--card-2)",
                border: "1px solid var(--line)", borderRadius: 4, position: "relative", overflow: "hidden"
              }}>
                <div style={{ height: "100%", width: `${Math.min(100, c / 7 * 100)}%`, background: tone }} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--mono)", fontSize: 12.5, color: c >= 2 ? "#fff" : "var(--ink-3)",
                  mixBlendMode: c >= 2 ? "normal" : "normal"
                }}>{c}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          {accts.map(a => (
            <div key={a.id+"-l"} style={{ flex: 1, fontSize: 11.5, color: "var(--ink-4)", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.client.split(" ")[0]}</div>
          ))}
        </div>
      </div>

      <div className="widget" style={{ padding: 0 }}>
        <div style={{ padding: "10px 18px" }}>
          {filtered.map(item => (
            <div key={item.id} className="log-row" style={{ gridTemplateColumns: "12px 1fr 130px" }}>
              <div className="log-dot" style={{
                background: item.stale ? "var(--ink-4)" : "var(--accent)",
                marginLeft: 0
              }} />
              <div className="col">
                <div className="row gap-2" style={{ alignItems: "baseline" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.action}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>· {item.account}</span>
                  {item.stale && <Pill kind="warn">stale</Pill>}
                </div>
                {item.impact && (
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                    Impact: <span style={{ color: "var(--ink-2)" }}>{item.impact}</span>
                  </div>
                )}
                <div className="row gap-2" style={{ marginTop: 4 }}>
                  {(item.tags || []).map(t => <Pill key={t} kind="outline">#{t}</Pill>)}
                </div>
              </div>
              <div className="col" style={{ alignItems: "flex-end", gap: 4 }}>
                <span className="muted" style={{ fontSize: 12.5 }}>{item.when}</span>
                <Avatar user={userMap[item.who]} size="sm" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">No logs match this filter.</div>}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ACCOUNT PANEL — opened on row click
   ════════════════════════════════════════════════════════════════════ */

function AccountPanel({ account, isGoogle, log, todayISO, onClose, onLog }) {
  const { userMap, TODAY } = window.PPC;
  const p = paceFor(account, todayISO);
  const [tab, setTab] = React.useState("pacing");
  const acctLog = log.filter(l => l.account === account.client);

  /* Synthetic daily-spend bars across the month, for the chart.
     Distributes mtdSpend across active days passed, slightly back-loaded. */
  const dailyBars = (() => {
    const arr = [];
    let weights = [];
    for (let i = 0; i < p.dayMap.length; i++) {
      const m = p.dayMap[i];
      if (m.excluded || !m.passed) weights.push(0);
      else weights.push(0.7 + (i / p.dayMap.length) * 0.6); /* gentle ramp */
    }
    const wsum = weights.reduce((s, w) => s + w, 0) || 1;
    p.dayMap.forEach((m, i) => {
      let v = 0;
      if (m.excluded) v = 0;
      else if (m.passed) v = (account.mtdSpend * weights[i]) / wsum;
      arr.push({ ...m, spend: v });
    });
    return arr;
  })();
  const maxBar = Math.max(p.suggestedDaily, p.currentDaily, ...dailyBars.map(b => b.spend), 1);

  return (
    <>
      <div className="panel-scrim open" onClick={onClose} />
      <div className="side-panel wide open">
        <div className="side-panel-head">
          <div className="col" style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 12.5 }}>
              {isGoogle ? "Google Ads" : "Meta Ads"} · {account.acctNumber} · {account.currency}
              {!account.conversionTracking && <span style={{ color: "var(--danger)" }}> · no conv. tracking</span>}
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>{account.client}</div>
          </div>
          <button className="btn ghost sm" onClick={() => window.openClientPanel && window.openClientPanel(account.client)}>Open client →</button>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>

        <div className="panel-tabs">
          <div className={`panel-tab ${tab === "pacing" ? "active" : ""}`} onClick={() => setTab("pacing")}>Pacing</div>
          <div className={`panel-tab ${tab === "performance" ? "active" : ""}`} onClick={() => setTab("performance")}>Performance</div>
          <div className={`panel-tab ${tab === "opts" ? "active" : ""}`} onClick={() => setTab("opts")}>Optimizations <span className="count">{acctLog.length}</span></div>
          <div className={`panel-tab ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>Settings</div>
        </div>

        <div className="side-panel-body">
          {tab === "pacing" && (
            <PacingPanelTab account={account} p={p} dailyBars={dailyBars} maxBar={maxBar} todayISO={todayISO} onLog={onLog} />
          )}
          {tab === "performance" && (
            <PerformancePanelTab account={account} />
          )}
          {tab === "opts" && (
            <OptsPanelTab account={account} log={acctLog} userMap={userMap} onLog={onLog} todayISO={todayISO} />
          )}
          {tab === "settings" && (
            <SettingsPanelTab account={account} todayISO={todayISO} />
          )}
        </div>
      </div>
    </>
  );
}

function PacingPanelTab({ account, p, dailyBars, maxBar, todayISO, onLog }) {
  return (
    <div>
      {/* Big numbers grid */}
      <div className="grid-4">
        <Stat label="Mo budget"  value={$m(p.budget, account.currency)} sub={`${account.currency} · ${account.excludedWeekdays.length ? "Mon-Fri" : "7-day"}`} />
        <Stat label="MTD spend"  value={$m(p.mtd, account.currency)}    sub={`${pct(p.utilization)} utilization`} />
        <Stat label="Shortfall"  value={p.shortfall > 0 ? $d(p.shortfall, account.currency) : "On pace"}
                                 sub={p.shortfall > 0 ? "vs pro-rata target" : p.shortfall < -1 ? `Over by ${$d(-p.shortfall, account.currency)}` : "—"} />
        <Stat label="Projected EOM" value={$m(p.projectedEom, account.currency)} sub={`${pct(p.projectedEom / p.budget)} of budget`} />
      </div>

      <div className="hr" />

      {/* Guidance card */}
      <div className="widget tinted" style={{ marginBottom: 14 }}>
        <div className="row" style={{ alignItems: "center", gap: 16 }}>
          <div className={`guidance-pill ${p.guidance}`} style={{ fontSize: 13.5, padding: "5px 13px" }}>
            {p.guidance === "fine" && <><span>✓</span> Fine</>}
            {p.guidance === "increase" && <><span className="arr">↑</span> Increase daily</>}
            {p.guidance === "decrease" && <><span className="arr">↓</span> Decrease daily</>}
            {p.guidance === "error" && <><span>!</span> Error</>}
          </div>
          <div className="col" style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.guidanceReason}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
              Suggested <span className="mono" style={{ color: "var(--accent)" }}>{$d(p.suggestedDaily, account.currency)}/day</span> across {p.activeRemaining} remaining active days
            </div>
          </div>
          {p.guidance !== "fine" && p.guidance !== "error" && (
            <button className="btn primary" onClick={() => window.toast && window.toast(`Daily budget set to ${$d(p.suggestedDaily, account.currency)} for ${account.client}`, { icon: "↑" })}>
              Apply suggested
            </button>
          )}
        </div>
      </div>

      {/* Daily spend chart */}
      <div className="widget">
        <div className="widget-head">
          <span className="widget-title">Daily spend · {fmtMonth(todayISO.slice(0,7))}</span>
          <div style={{ flex: 1 }} />
          <span className="row gap-3" style={{ fontSize: 12.5, color: "var(--ink-4)" }}>
            <span className="row gap-2"><i style={{ width: 10, height: 10, background: "var(--accent)", borderRadius: 2 }} /> Actual</span>
            <span className="row gap-2"><i style={{ width: 10, height: 2, background: "var(--ink)", display: "block" }} /> Current daily</span>
            <span className="row gap-2"><i style={{ width: 10, height: 2, background: "var(--ok)", display: "block" }} /> Suggested</span>
          </span>
        </div>
        <DailySpendChart bars={dailyBars} maxBar={maxBar} p={p} account={account} />
      </div>

      <div className="hr" />

      {/* Budget math card */}
      <div className="grid-2">
        <div className="widget tinted">
          <div className="label" style={{ marginBottom: 10 }}>Budget math</div>
          <div className="col" style={{ gap: 6, fontSize: 13.5 }}>
            <Row k="Monthly budget"            v={$m(p.budget, account.currency)} />
            <Row k="Days in month"              v={p.dim} />
            <Row k="Excluded days"              v={`${p.excludedTotal} (${account.excludedWeekdays.length ? "Sat + Sun" : "none"})`} />
            <Row k="Active days total"          v={p.activeTotal} bold />
            <Row k="Active days passed"         v={p.activePassed} />
            <Row k="Active days remaining"      v={p.activeRemaining} bold accent />
            <div className="hr" />
            <Row k="Normal daily"               v={$d(p.normalDaily, account.currency)} sub="Mo budget ÷ active days total" />
            <Row k="Suggested daily"            v={$d(p.suggestedDaily, account.currency)} sub="(Budget − MTD) ÷ active days left" bold accent />
            <Row k="Currently set"              v={$d(p.currentDaily, account.currency)} />
          </div>
        </div>

        <div className="widget tinted">
          <div className="label" style={{ marginBottom: 10 }}>Today snapshot</div>
          <div className="col" style={{ gap: 6, fontSize: 13.5 }}>
            <Row k="Yesterday spend"           v={$d(account.yesterdaySpend, account.currency)} />
            <Row k="Today spend (so far)"      v={$d(account.todaySpend, account.currency)} />
            <Row k="MTD spend"                 v={$d(p.mtd, account.currency)} bold />
            <Row k="Pro-rata target"           v={$d(p.proRata, account.currency)} />
            <Row k="Shortfall"
                 v={<span style={{ color: p.shortfall > 0 ? "var(--warn)" : p.shortfall < -1 ? "var(--danger)" : "var(--ok)" }}>
                      {p.shortfall > 0 ? "+" + $d(p.shortfall, account.currency) : p.shortfall < -1 ? "−" + $d(-p.shortfall, account.currency) : "$0.00"}
                    </span>}
                 bold />
            <div className="hr" />
            <Row k="Previous month util"  v={pct(account.prevMonthUtil)} sub="Apr 2026" />
            <Row k="Last month util"      v={pct(account.lastMonthUtil)} sub="Mar 2026" />
            <Row k="Lifetime util goal"   v="100%" sub="Every unspent $ is unbilled mgmt fee" accent />
          </div>
        </div>
      </div>

      <div className="hr" />

      {/* Campaigns inside this account */}
      <div className="label" style={{ marginBottom: 8 }}>Enabled campaigns ({account.campaigns.length})</div>
      <div>
        {account.campaigns.map((c, i) => {
          const dailyAvg = c.monthly / p.activeTotal;
          return (
            <div key={i} className="row" style={{
              padding: "9px 12px", borderBottom: "1px dashed var(--line-2)",
              gap: 12
            }}>
              <div className="col" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div className="muted" style={{ fontSize: 12.5 }}>{$m(c.monthly, account.currency)} / mo · {$d(dailyAvg, account.currency)} / active day</div>
              </div>
              <Pill kind="outline">enabled</Pill>
            </div>
          );
        })}
      </div>

      <div className="hr" />

      <div className="row" style={{ justifyContent: "space-between" }}>
        <button className="btn ghost"><Icon k="report" />Generate report</button>
        <div className="row gap-2">
          <button className="btn" onClick={onLog}><Icon k="plus" />Log optimization</button>
          <button className="btn primary"><a href={account.accountUrl} target="_blank" rel="noopener" style={{ color: "inherit", textDecoration: "none" }}>Open in {account.platform === "meta" || !account.platform ? (account.accountUrl.includes("facebook") ? "Ads Manager" : "Google Ads") : "Platform"}</a></button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, sub, bold, accent }) {
  return (
    <div className="row" style={{ alignItems: "flex-start" }}>
      <div className="col" style={{ flex: 1 }}>
        <span style={{ color: "var(--ink-3)" }}>{k}</span>
        {sub && <span style={{ fontSize: 12.5, color: "var(--ink-4)" }}>{sub}</span>}
      </div>
      <span className="mono" style={{
        fontWeight: bold ? 600 : 400,
        color: accent ? "var(--accent)" : "var(--ink)",
        fontSize: bold ? 14 : 13
      }}>{v}</span>
    </div>
  );
}

/* Daily spend chart inside the panel — bars per day across the month */
function DailySpendChart({ bars, maxBar, p, account }) {
  const W = 660, H = 150, padL = 30, padR = 12, padT = 14, padB = 22;
  const cw = (W - padL - padR) / bars.length;
  const yScale = v => H - padB - (v / maxBar) * (H - padT - padB);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={padL} x2={W - padR}
          y1={yScale(maxBar * t)} y2={yScale(maxBar * t)}
          stroke="var(--line-2)" strokeWidth="1" strokeDasharray={t === 0 ? "0" : "2,3"} />
      ))}
      {/* y labels */}
      {[0, 0.5, 1].map(t => (
        <text key={t} x={padL - 6} y={yScale(maxBar * t) + 3}
          fontSize="9.5" fontFamily="var(--mono)" fill="var(--ink-4)" textAnchor="end">
          ${Math.round(maxBar * t)}
        </text>
      ))}
      {/* current daily band */}
      <line x1={padL} x2={W - padR}
        y1={yScale(p.currentDaily)} y2={yScale(p.currentDaily)}
        stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4,3" />
      {/* suggested daily line */}
      <line x1={padL} x2={W - padR}
        y1={yScale(p.suggestedDaily)} y2={yScale(p.suggestedDaily)}
        stroke="var(--ok)" strokeWidth="1.5" />
      {/* bars */}
      {bars.map((b, i) => {
        const x = padL + i * cw;
        if (b.excluded) {
          return <rect key={i} x={x + 0.5} y={padT} width={cw - 1} height={H - padT - padB}
            fill="var(--paper-2)" />;
        }
        const h = (b.spend / maxBar) * (H - padT - padB);
        return (
          <g key={i}>
            <rect x={x + 1} y={H - padB - h} width={cw - 2} height={Math.max(0, h)}
              fill={b.isToday ? "var(--accent-2)" : b.passed ? "var(--accent)" : "var(--line)"}
              opacity={b.passed ? 1 : 0.5} rx="1" />
            {(b.d === 1 || b.d % 5 === 0 || b.isToday) && (
              <text x={x + cw / 2} y={H - 6} fontSize="9" textAnchor="middle"
                fill={b.isToday ? "var(--accent)" : "var(--ink-4)"}
                fontFamily="var(--mono)" fontWeight={b.isToday ? 600 : 400}>
                {b.d}
              </text>
            )}
          </g>
        );
      })}
      {/* Today marker label */}
      {bars.filter(b => b.isToday).map((b, i) => {
        const x = padL + bars.indexOf(b) * cw + cw / 2;
        return (
          <text key={i} x={x} y={padT + 4} fontSize="9" fill="var(--accent)" textAnchor="middle">▼</text>
        );
      })}
    </svg>
  );
}

function PerformancePanelTab({ account }) {
  return (
    <div>
      <div className="grid-4">
        <Stat label="MTD spend" value={$m(account.mtdSpend, account.currency)} />
        <Stat label="Conversions" value={account.conv} />
        <Stat label="CPA"         value={`$${account.cpa}`} />
        <Stat label="CTR"         value={`${account.ctr}%`} />
      </div>
      <div className="hr" />
      <div className="widget tinted">
        <div className="widget-head">
          <span className="widget-title">9-day spend trend</span>
        </div>
        <Spark data={account.trend} w={660} h={90} color="var(--accent)" />
      </div>
      <div className="hr" />
      <div className="label" style={{ marginBottom: 8 }}>Per-campaign performance</div>
      <table className="t">
        <thead>
          <tr><th>Campaign</th><th>Budget</th><th>Status</th></tr>
        </thead>
        <tbody>
          {account.campaigns.map((c, i) => (
            <tr key={i}>
              <td style={{ fontSize: 13.5 }}>{c.name}</td>
              <td className="mono">{$m(c.monthly, account.currency)}</td>
              <td><Pill kind="ok" dot>enabled</Pill></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OptsPanelTab({ account, log, userMap, onLog, todayISO }) {
  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <div className="col">
          <div className="label">Optimizations · this month</div>
          <div className="muted" style={{ fontSize: 12.5 }}>
            <span className="mono" style={{ color: (account.lastOptCount || 0) >= 4 ? "var(--ok)" : "var(--warn)" }}>
              {account.lastOptCount || 0}
            </span> logged · target ≥ 4 / month · last {daysAgoLabel(account.lastOptISO, todayISO).toLowerCase()}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn accent" onClick={onLog}><Icon k="plus" />Log change</button>
      </div>

      <div>
        {log.length === 0 && <div className="empty">No optimizations logged this month — log one now.</div>}
        {log.map(item => (
          <div className="log-row" key={item.id}>
            <div className="log-dot" style={{ background: item.stale ? "var(--ink-4)" : "var(--accent)" }} />
            <div className="col">
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.action}</div>
              {item.impact && <span className="muted" style={{ fontSize: 12.5 }}>Impact: {item.impact}</span>}
              <div className="row gap-2" style={{ marginTop: 4 }}>
                {(item.tags || []).map(t => <Pill key={t} kind="outline">#{t}</Pill>)}
                {item.stale && <Pill kind="warn">stale</Pill>}
              </div>
            </div>
            <div className="col" style={{ alignItems: "flex-end" }}>
              <span className="muted" style={{ fontSize: 12.5 }}>{item.when}</span>
              <Avatar user={userMap[item.who]} size="sm" />
            </div>
          </div>
        ))}
      </div>

      <div className="muted" style={{ fontSize: 12.5, marginTop: 14, padding: 10, background: "var(--card-2)", borderRadius: 8, border: "1px dashed var(--line-strong)" }}>
        Each optimization you log here is mirrored to <b style={{ color: "var(--ink-2)" }}>{account.client}'s</b> client profile under <em>Notes → Optimization</em>, so the client portal stays in sync without re-entry.
      </div>
    </div>
  );
}

function SettingsPanelTab({ account, todayISO }) {
  const { store } = window.PPC;
  const [excludeWE, setExcludeWE] = React.useState(account.excludedWeekdays.length > 0);
  const [convT, setConvT] = React.useState(account.conversionTracking);
  const [autoR, setAutoR] = React.useState(account.automatedRules);
  const [budget, setBudget] = React.useState(account.currentMonthBudget);
  const [regular, setRegular] = React.useState(account.monthlyBudget);

  const save = () => {
    store.setBudgetSettings(account.id, {
      currentMonthBudget: Number(budget),
      monthlyBudget: Number(regular),
      excludedWeekdays: excludeWE ? [0, 6] : [],
      conversionTracking: convT,
      automatedRules: autoR
    });
    window.toast && window.toast(`Settings saved · ${account.client}`, { icon: "✓" });
  };

  return (
    <div>
      <div className="grid-2">
        <div className="field">
          <span className="field-label">Regular monthly budget</span>
          <input className="input mono" value={regular} onChange={e => setRegular(e.target.value)} />
          <span className="field-hint">Standing monthly budget. Used as the baseline.</span>
        </div>
        <div className="field">
          <span className="field-label">Current month budget</span>
          <input className="input mono" value={budget} onChange={e => setBudget(e.target.value)} />
          <span className="field-hint">Override if mid-cycle changes (upsell, pause, etc.)</span>
        </div>
      </div>

      <div className="hr" />

      <div className="label" style={{ marginBottom: 8 }}>Spending schedule</div>
      <div className="widget tinted" style={{ padding: 12, marginBottom: 14 }}>
        <label className="row" style={{ gap: 10, cursor: "pointer" }}>
          <span className={`check ${excludeWE ? "done" : ""}`} onClick={() => setExcludeWE(!excludeWE)}>
            {excludeWE && <Icon k="check" style={{ width: 12, height: 12 }} />}
          </span>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>Exclude weekends (Sat + Sun)</span>
            <span className="muted" style={{ fontSize: 12.5 }}>Most B2B accounts pause weekends. Pacing math will compute against {excludeWE ? "Mon-Fri only" : "all 7 days"}.</span>
          </div>
        </label>
      </div>

      <div className="label" style={{ marginBottom: 8 }}>Account features</div>
      <div className="grid-2" style={{ marginBottom: 14 }}>
        <label className="row" style={{ gap: 10, cursor: "pointer", padding: 12, border: "1px solid var(--line)", borderRadius: 8 }}>
          <span className={`check ${convT ? "done" : ""}`} onClick={() => setConvT(!convT)}>
            {convT && <Icon k="check" style={{ width: 12, height: 12 }} />}
          </span>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 13.5 }}>Conversion tracking</span>
            <span className="muted" style={{ fontSize: 12.5 }}>Required for accurate CPA.</span>
          </div>
        </label>
        <label className="row" style={{ gap: 10, cursor: "pointer", padding: 12, border: "1px solid var(--line)", borderRadius: 8 }}>
          <span className={`check ${autoR ? "done" : ""}`} onClick={() => setAutoR(!autoR)}>
            {autoR && <Icon k="check" style={{ width: 12, height: 12 }} />}
          </span>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 13.5 }}>Automated rules</span>
            <span className="muted" style={{ fontSize: 12.5 }}>Auto-pause underperforming ad sets.</span>
          </div>
        </label>
      </div>

      <div className="hr" />
      <div className="label" style={{ marginBottom: 8 }}>Account info</div>
      <div className="sub-card">
        <div className="row" style={{ gap: 14, flexWrap: "wrap" }}>
          <div className="col">
            <span className="field-label">Account ID</span>
            <span className="mono" style={{ fontSize: 13.5 }}>{account.acctNumber}</span>
          </div>
          <div className="col">
            <span className="field-label">Currency</span>
            <span className="mono" style={{ fontSize: 13.5 }}>{account.currency}</span>
          </div>
          <div className="col">
            <span className="field-label">Status</span>
            <span style={{ fontSize: 13.5 }}>{account.status}</span>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <a href={account.accountUrl} target="_blank" rel="noopener" style={{ color: "var(--accent)", fontSize: 12.5 }}>{account.accountUrl} →</a>
        </div>
      </div>

      <div className="row" style={{ justifyContent: "flex-end", marginTop: 14 }}>
        <button className="btn primary" onClick={save}>Save settings</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LOG OPTIMIZATION MODAL
   ════════════════════════════════════════════════════════════════════ */

function LogOptModal({ account, accts, isGoogle, who, onClose }) {
  const { store } = window.PPC;
  const [clientName, setClientName] = React.useState(account?.client || "");
  const [action, setAction] = React.useState("");
  const [impact, setImpact] = React.useState("");
  const [tags, setTags] = React.useState([]);

  const TAGS = isGoogle
    ? ["keywords", "negatives", "bidding", "ad-copy", "budget", "geo", "assets"]
    : ["audience", "creative", "budget", "landing-page", "objective", "placement"];

  const toggleTag = (t) => setTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);

  const submit = () => {
    if (!clientName || !action) return;
    store.logOptimization({
      platform: isGoogle ? "google" : "meta",
      account: clientName, who, action, impact, tags
    });
    window.toast && window.toast(`Optimization logged · also synced to ${clientName} profile`, { icon: "✓" });
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div className="col" style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 12.5 }}>{isGoogle ? "Google Ads" : "Meta Ads"} · Optimization log</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>
              Log a change
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>
        <div className="modal-body">
          <div className="field">
            <span className="field-label">Account</span>
            <select className="select-input" value={clientName} onChange={e => setClientName(e.target.value)}>
              <option value="">Select an account…</option>
              {accts.map(a => <option key={a.id} value={a.client}>{a.client}</option>)}
            </select>
          </div>
          <div className="field">
            <span className="field-label">What did you change?</span>
            <input className="input" value={action}
              onChange={e => setAction(e.target.value)}
              placeholder={isGoogle ? "Paused 4 underperforming keywords" : "Killed 2 fatigued creatives, launched 4 new"} />
          </div>
          <div className="field">
            <span className="field-label">Expected impact (optional)</span>
            <input className="input" value={impact}
              onChange={e => setImpact(e.target.value)}
              placeholder="CPA -8% projected · Conv. volume +18%" />
          </div>
          <div className="field">
            <span className="field-label">Tags</span>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {TAGS.map(t => (
                <span key={t}
                  className={`chip-pick ${tags.includes(t) ? "on accent" : ""}`}
                  onClick={() => toggleTag(t)}>#{t}</span>
              ))}
            </div>
          </div>

          <div className="sub-card" style={{ marginTop: 8 }}>
            <div className="sub-card-title">What happens when you log</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
              <li>Added to the {isGoogle ? "Google" : "Meta"} optimization log (audit trail)</li>
              <li>Counts toward this account's ≥4-per-month target</li>
              <li>Mirrors to <b>{clientName || "the client's"}</b> profile under <em>Notes → Optimization</em></li>
              <li>"Last optimized" date resets — clears the stale warning</li>
            </ul>
          </div>
        </div>
        <div className="modal-foot">
          <div style={{ flex: 1 }} />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!clientName || !action} onClick={submit}>
            Log optimization
          </button>
        </div>
      </div>
    </div>
  );
}

window.PlatformScreen = PlatformScreen;
