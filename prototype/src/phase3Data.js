/* Phase 3 data + helpers.
   Additive only — must NOT mutate any Phase 1/2 locked behavior.
   Exposes new keys/helpers onto window.PPC at script load. */

(function (root) {
  const PPC = root.PPC;
  if (!PPC) return;

  /* ─── Pipeline forecast ───────────────────────────────────────────
     Per-stage win probability used for weighted-pipeline math.
     Tuned to Jaydeep's stated "60-70% trial-to-paid" expectation. */
  const STAGE_WIN_PROB = {
    sn: 0.05,    // New lead
    sq: 0.20,    // Qualifying
    sp: 0.35,    // Proposal sent
    sa: 0.65,    // Trial active
    sw: 1.00,    // Won
    sl: 0.00     // Lost
  };

  /* Avg-days-in-stage benchmarks for the "stage velocity" widget. */
  const STAGE_BENCHMARK_DAYS = {
    sn: 2, sq: 4, sp: 5, sa: 22, sw: 0, sl: 0
  };

  /* Cross-client trailing 12 months performance (cross-account roll-up).
     Used by the Looker mirror / Performance home. Synthetic, internally
     consistent: spend ramps with MRR growth; CPA improves slowly; conv
     scales with spend; CTR drifts. Real Looker would replace this. */
  const PERF_TREND_12M = {
    meta: {
      months: ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
      spend:  [ 28200, 30100, 32400, 34800, 36500, 38900, 40100, 39400, 41800, 44200, 46500, 48700 ],
      conv:   [   612,   685,   742,   824,   888,   948,   978,   942,  1018,  1086,  1158,  1224 ],
      cpa:    [  46.1,  43.9,  43.7,  42.2,  41.1,  41.0,  41.0,  41.8,  41.1,  40.7,  40.2,  39.8 ],
      ctr:    [  1.62,  1.71,  1.74,  1.78,  1.81,  1.84,  1.83,  1.79,  1.85,  1.88,  1.92,  1.94 ]
    },
    google: {
      months: ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
      spend:  [ 18400, 19200, 20100, 21800, 22900, 24100, 24800, 24200, 25600, 26800, 28100, 29400 ],
      conv:   [   289,   312,   335,   368,   402,   428,   436,   422,   458,   478,   512,   542 ],
      cpa:    [  63.7,  61.5,  60.0,  59.2,  56.9,  56.3,  56.9,  57.4,  55.9,  56.1,  54.9,  54.2 ],
      ctr:    [  4.21,  4.34,  4.48,  4.62,  4.71,  4.78,  4.74,  4.69,  4.82,  4.91,  4.98,  5.06 ]
    },
    smm: {
      months: ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
      // SMM doesn't run ad spend — track engagement & reach instead
      reach:        [ 384, 412, 448, 478, 521, 562, 581, 558, 612, 658, 712, 758 ],   // ×1k
      engagement:   [ 5.2, 5.4, 5.6, 5.8, 5.9, 6.1, 6.0, 5.7, 6.0, 6.2, 6.4, 6.5 ],   // %
      posts:        [ 78,  82,  88,  92,  98, 102, 104,  98, 108, 114, 122, 128 ],
      followerGain: [ 142, 168, 178, 198, 224, 248, 256, 232, 264, 286, 318, 342 ]
    }
  };

  /* Trailing 12-month commission earnings — Abhishek's historical line.
     Synthetic but consistent with the 5% / 3% rule and MRR_TREND. */
  const COMMISSION_HISTORY = {
    abhishek: [
      { month: "2025-06", earned:  1820, target: 10500 },
      { month: "2025-07", earned:  2140, target: 10500 },
      { month: "2025-08", earned:  2380, target: 10500 },
      { month: "2025-09", earned:  2410, target: 10500 },
      { month: "2025-10", earned:  2680, target: 10500 },
      { month: "2025-11", earned:  2920, target: 10500 },
      { month: "2025-12", earned:  3140, target: 10500 },
      { month: "2026-01", earned:  2880, target: 10500 },
      { month: "2026-02", earned:  3260, target: 10500 },
      { month: "2026-03", earned:  3540, target: 10500 },
      { month: "2026-04", earned:  3820, target: 10500 },
      { month: "2026-05", earned:  3680, target: 10500 }  // current month-to-date
    ]
  };

  /* Stage-velocity historicals (avg days-in-stage by source, last 90d).
     Used by the Forecast screen. Synthetic. */
  const WIN_RATE_BY_SOURCE_HIST = {
    Referral:     { won: 9,  lost: 2,  inFlight: 3, avgDays: 18 },
    "Meta":       { won: 6,  lost: 4,  inFlight: 5, avgDays: 24 },
    "Google Ads": { won: 5,  lost: 5,  inFlight: 4, avgDays: 26 },
    LinkedIn:     { won: 3,  lost: 2,  inFlight: 1, avgDays: 21 },
    Cold:         { won: 1,  lost: 4,  inFlight: 2, avgDays: 29 }
  };

  /* ─── Helpers ───────────────────────────────────────────────────── */

  /* Walk every contract → return [{client, service, mrrCAD, status,
     concentration%, atRisk, atRiskReasons[]}]. mrrCAD is normalized
     (USD treated 1.35 → CAD for the concentration view; documented in UI). */
  function clientMRRBreakdown() {
    const FX_USD_TO_CAD = 1.35;
    const rows = [];
    Object.entries(PPC.PROFILES_RICH).forEach(([name, prof]) => {
      const contracts = prof.serviceContracts || {};
      Object.entries(contracts).forEach(([service, c]) => {
        if (!c) return;
        const mrrCAD = c.currency === "USD" ? (c.monthlyFee || 0) * FX_USD_TO_CAD : (c.monthlyFee || 0);
        rows.push({
          client: name,
          service,
          mrr: c.monthlyFee || 0,
          currency: c.currency || "CAD",
          mrrCAD,
          status: c.status,
          contractStart: c.contractStart,
          salesperson: c.salesperson
        });
      });
    });
    return rows.filter(r => r.status === "active");
  }

  /* By-client roll-up with at-risk overlay (paused contract or overdue review). */
  function concentrationData() {
    const rows = clientMRRBreakdown();
    const byClient = {};
    rows.forEach(r => {
      const k = r.client;
      if (!byClient[k]) byClient[k] = { client: k, services: [], mrrCAD: 0, currencies: new Set() };
      byClient[k].services.push({ service: r.service, mrr: r.mrr, currency: r.currency });
      byClient[k].mrrCAD += r.mrrCAD;
      byClient[k].currencies.add(r.currency);
    });
    const list = Object.values(byClient);
    const total = list.reduce((a, b) => a + b.mrrCAD, 0) || 1;
    list.forEach(r => {
      r.pct = r.mrrCAD / total;
      r.currencies = [...r.currencies];

      // at-risk overlay
      const reasons = [];
      const prof = PPC.PROFILES_RICH[r.client] || {};
      const contracts = prof.serviceContracts || {};
      Object.values(contracts).forEach(c => {
        if (c.status === "paused")    reasons.push("Service paused");
        if (c.status === "cancelled") reasons.push("Service cancelled");
        if (c.creativeRefresh) {
          const cr = PPC.creativeRefreshState(c, PPC.TODAY);
          if (cr.overdue) reasons.push("Creative refresh overdue");
        }
      });
      const review = (PPC.REVIEWS || []).find(rv => rv.client === r.client);
      if (review && review.health === "danger") reasons.push("Monthly review overdue");
      if (review && review.health === "warn")   reasons.push("Review flagged: " + (review.note || "watch"));
      r.atRisk = reasons.length > 0;
      r.atRiskReasons = reasons;
    });
    list.sort((a, b) => b.mrrCAD - a.mrrCAD);
    return { rows: list, totalCAD: total };
  }

  /* "What if X cancels" — single-client impact simulator. */
  function churnImpact(clientName) {
    const { rows, totalCAD } = concentrationData();
    const target = rows.find(r => r.client === clientName);
    if (!target) return null;
    const newTotal = totalCAD - target.mrrCAD;
    const newTopShare = rows.filter(r => r.client !== clientName).slice(0, 1).map(r => r.mrrCAD / (newTotal || 1))[0] || 0;
    return {
      client: clientName,
      lostCAD: target.mrrCAD,
      pctOfMRR: target.pct,
      newTotalCAD: newTotal,
      newTopClientShare: newTopShare,
      remainingClients: rows.length - 1
    };
  }

  /* Pipeline forecast — walks LEADS and weights by stage probability. */
  function pipelineForecast() {
    const FX_USD_TO_CAD = 1.35;
    const { SALES_STAGES, LEADS } = PPC;
    const byStage = {};
    SALES_STAGES.forEach(s => byStage[s.id] = { stage: s, count: 0, raw: 0, weighted: 0 });
    let totalRaw = 0, totalWeighted = 0;
    const open = [];
    LEADS.forEach(l => {
      if (l.stage === "sw" || l.stage === "sl") return; // closed
      const fee = l.budget || 0;
      const fc  = (l.currency === "USD" ? fee * FX_USD_TO_CAD : fee);
      const prob = STAGE_WIN_PROB[l.stage] || 0;
      byStage[l.stage].count++;
      byStage[l.stage].raw      += fc;
      byStage[l.stage].weighted += fc * prob;
      totalRaw      += fc;
      totalWeighted += fc * prob;
      open.push({ ...l, mrrCAD: fc, prob, weightedCAD: fc * prob });
    });
    open.sort((a, b) => b.weightedCAD - a.weightedCAD);
    return { byStage: SALES_STAGES.map(s => byStage[s.id]), totalRaw, totalWeighted, open };
  }

  /* Win-rate by source, last 90 days (uses synthetic history + live deals). */
  function winRateBySource() {
    const rows = [];
    Object.entries(WIN_RATE_BY_SOURCE_HIST).forEach(([source, h]) => {
      const closed = h.won + h.lost;
      const rate = closed ? h.won / closed : 0;
      rows.push({ source, won: h.won, lost: h.lost, inFlight: h.inFlight, rate, avgDays: h.avgDays });
    });
    rows.sort((a, b) => b.rate - a.rate);
    return rows;
  }

  /* Forecast next-30-days commission for a salesperson based on
     expected close-rate × proposed contract value.
     "If trials at 65% and proposals at 35% close, what does commission
     look like next month?" */
  function projectedCommission(salesId) {
    const rules = PPC.COMMISSION_RULES[salesId];
    if (!rules) return { total: 0, byLead: [] };
    const fc = pipelineForecast();
    let total = 0;
    const byLead = [];
    fc.open.forEach(l => {
      // first-month commission only
      const c = l.weightedCAD * rules.firstMonth;
      total += c;
      byLead.push({ company: l.company, stage: l.stage, mrrCAD: l.mrrCAD, prob: l.prob, commission: c });
    });
    return { total, byLead, fc };
  }

  /* Trailing salary-target line for commission dashboard. */
  function commissionTarget(salesId) {
    const user = PPC.userMap[salesId];
    if (!user) return 0;
    return (user.salary || 0) * 3; // 3× salary, per Jaydeep
  }

  /* ─── Notifications upgrade — persistence + grouping ───────────── */
  /* localStorage key */
  const NOTIF_KEY = "ppc.notifs.read";
  const DIGEST_KEY = "ppc.notifs.digest";

  function loadReadSet() {
    try { return new Set(JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]")); }
    catch { return new Set(); }
  }
  function saveReadSet(set) {
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify([...set])); } catch {}
  }
  function loadDigestPrefs() {
    try { return JSON.parse(localStorage.getItem(DIGEST_KEY) || '{"enabled": false, "time": "08:00"}'); }
    catch { return { enabled: false, time: "08:00" }; }
  }
  function saveDigestPrefs(p) {
    try { localStorage.setItem(DIGEST_KEY, JSON.stringify(p)); } catch {}
  }

  /* Group notifications by client (or "FYI" / "System" if none).
     Returns { groups: { clientName: [n,n,...] }, order: [name,name,...] }
     order is by most-recent-unread first. */
  function groupNotifsByClient(notifs) {
    const groups = {};
    const earliestUnreadIdx = {};
    notifs.forEach((n, idx) => {
      let key = "FYI";
      if (n.ref && PPC.PROFILES_RICH) {
        // ref might be card id (c-meta-3 / a-meta-1) — resolve to client name
        const card = [...(PPC.ONB_CARDS||[]), ...(PPC.ACT_CARDS||[])].find(c => c.id === n.ref);
        if (card) key = card.name;
      }
      if (key === "FYI" && n.text) {
        // try matching client name from any active profile
        const match = Object.keys(PPC.PROFILES_RICH || {}).find(name => n.text.includes(name));
        if (match) key = match;
      }
      groups[key] = groups[key] || [];
      groups[key].push(n);
      if (!n.read && earliestUnreadIdx[key] == null) earliestUnreadIdx[key] = idx;
    });
    const order = Object.keys(groups).sort((a, b) => {
      const ua = earliestUnreadIdx[a], ub = earliestUnreadIdx[b];
      if (ua != null && ub != null) return ua - ub;
      if (ua != null) return -1;
      if (ub != null) return  1;
      return a.localeCompare(b);
    });
    return { groups, order };
  }

  /* ─── Mount onto PPC ───────────────────────────────────────────── */
  Object.assign(PPC, {
    STAGE_WIN_PROB, STAGE_BENCHMARK_DAYS,
    PERF_TREND_12M, COMMISSION_HISTORY,
    clientMRRBreakdown, concentrationData, churnImpact,
    pipelineForecast, winRateBySource, projectedCommission, commissionTarget,
    /* notif helpers */
    loadReadSet, saveReadSet, loadDigestPrefs, saveDigestPrefs, groupNotifsByClient,
    NOTIF_KEY, DIGEST_KEY
  });
})(window);
