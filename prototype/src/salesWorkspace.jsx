/* salesWorkspace.jsx — Sales workspace for Abhishek (redesign, Phase 5).
 *
 * Built on the S5 model (window.PPC.S5) which derives most of the funnel from
 * REAL captured data (window.PPC.LIVE). Screens here:
 *   SalesLeadsLiveScreen   — multi-source lead inbox (Instant Form / WhatsApp / Referral)
 *                            + weekday SLA + quality/status + Convert to Deal
 *   SalesPipelineLiveScreen — per-service deal kanban, fee-gate, drag-to-stage, win→onboarding
 *   SalesTrialsScreen      — 30-day deferred-payment trials in flight
 *   SalesCallsLiveScreen   — Zoom Phone: connected vs not + duration + synced transcript
 *   SalesDashboardScreen   — role-aware Rep (Abhishek) vs Owner (Jaydeep) view
 *
 * Lead flow (per the real process): ALL leads come from Meta ads via Instant Form
 * (→ Zoho) or WhatsApp (→ manual connect); Referral is the only non-Meta source.
 * The Google Form is NOT a source — it's the trial-intake form sent once a lead
 * agrees to the trial; filling it spins up the onboarding kanban card.
 *
 * Additive: does not touch the legacy Phase-4 Zoho screens. Reuses existing
 * classes (page-head, pill, card, s4-table, gap/mb/mt utils) + tokens — no new colors.
 */

/* ── shared pills/helpers ── */
function S5SourcePill({ source }) {
  const def = (window.PPC.S5.SOURCE_DEFS || {})[source] || { label: source, kind: "outline" };
  return <span className={"pill " + def.kind} style={{ fontSize: 11.5 }} title={def.short}>{def.label}</span>;
}
function S5QualityPill({ q }) {
  const map = { new: ["new", "outline"], attempting: ["attempting", "warn"], good: ["good", "ok"], scrap: ["scrap", "danger"] };
  const [label, kind] = map[q] || [q, "outline"];
  return <span className={"pill " + kind} style={{ fontSize: 11.5 }}>{label}</span>;
}
function S5StatusPill({ s }) {
  const map = {
    "Not Contacted": "outline", "Attempted": "warn", "Contacted": "accent",
    "Not Qualified": "danger", "Converted": "ok",
  };
  return <span className={"pill " + (map[s] || "outline")} style={{ fontSize: 11.5 }}>{s}</span>;
}
function s5SlaInfo(lead) {
  if (lead.status === "Converted") return { label: "converted", kind: "ok" };
  if (lead.quality === "scrap") return { label: "—", kind: "outline" };
  if (lead.weekendArrival && lead.status === "Not Contacted") return { label: "SLA → Mon", kind: "outline" };
  if (lead.status === "Not Contacted") return { label: "< 4h clock", kind: "warn" };
  return { label: "responded", kind: "ok" };
}
const S5_SVC_LABEL = { meta: "Meta", google: "Google", smm: "SMM", influencer: "Influencer" };
function S5ServicePill({ svc }) {
  return <span className="pill outline" style={{ fontSize: 11.5 }}>{S5_SVC_LABEL[svc] || svc}</span>;
}

/* ── Leads: multi-source intake + weekday SLA + Convert to Deal ── */
function SalesLeadsLiveScreen({ role }) {
  window.useStore && window.useStore();
  const S5 = window.PPC.S5;
  const money = window.PPC.ROLE_ACCESS[role.id] && window.PPC.ROLE_ACCESS[role.id].money;
  const [filter, setFilter] = React.useState("workable");
  const [showTests, setShowTests] = React.useState(false);

  const all = S5.state.leads;
  const isToday = (d) => d === S5.SALES_TODAY;
  const visible = all.filter((l) => (showTests ? true : l.quality !== "scrap" || l.status !== "Not Qualified" || filter === "scrap"));

  const counts = {
    workable: all.filter((l) => !l.dupOf && l.quality !== "scrap" && l.status !== "Converted").length,
    "instant-form": all.filter((l) => l.source === "instant-form").length,
    whatsapp: all.filter((l) => l.source === "whatsapp").length,
    referral: all.filter((l) => l.source === "referral").length,
    needContact: all.filter((l) => l.status === "Not Contacted" && l.quality !== "scrap").length,
    converted: all.filter((l) => l.status === "Converted").length,
    scrap: all.filter((l) => l.quality === "scrap").length,
    all: all.length,
  };
  const newToday = all.filter((l) => isToday(l.created)).length;
  const followUps = all.filter((l) => !l.dupOf && l.quality !== "scrap" && l.status !== "Converted" && l.nextActionDate && l.nextActionDate <= S5.SALES_TODAY).length;
  const slaRisk = all.filter((l) => l.status === "Not Contacted" && l.quality !== "scrap" && !l.weekendArrival).length;

  const rows = all.filter((l) => {
    if (filter === "workable") return !l.dupOf && l.quality !== "scrap" && l.status !== "Converted";
    if (filter === "needContact") return l.status === "Not Contacted" && l.quality !== "scrap";
    if (filter === "converted") return l.status === "Converted";
    if (filter === "scrap") return l.quality === "scrap";
    if (["instant-form", "whatsapp", "referral"].includes(filter)) return l.source === filter;
    return true;
  }).filter((l) => showTests || !(l.quality === "scrap" && /test/i.test(l.company)));

  const fmtDate = (iso) => iso ? new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";
  const FILTERS = [
    ["workable", "Workable"], ["needContact", "Need contact"],
    ["instant-form", "Instant Form"], ["whatsapp", "WhatsApp"], ["referral", "Referral"],
    ["converted", "Converted"], ["scrap", "Scrap"], ["all", "All"],
  ];

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Abhishek</div>
        <h1 className="page-title">Lead <em>Inbox</em></h1>
        <div className="page-sub">
          Every Meta lead in one queue — <strong>Instant Form</strong> (auto-synced to Zoho) and
          <strong> WhatsApp</strong> (manual connect), plus <strong>Referrals</strong>. First-response
          target is <strong>under 4h on weekdays</strong>; weekend arrivals start their clock Monday.
          The Google Form isn't a source — it's sent once a lead agrees to the trial.
        </div>
      </div>

      {/* KPI tiles */}
      <div className="row gap-3 mb-3" style={{ flexWrap: "wrap" }}>
        <S5Tile label="Workable leads" value={counts.workable} />
        <S5Tile label="New today" value={newToday} />
        <S5Tile label="Follow-ups due" value={followUps} kind={followUps ? "warn" : null} />
        <S5Tile label="On SLA clock" value={slaRisk} sub="weekday < 4h" kind={slaRisk ? "warn" : "ok"} />
        <S5Tile label="Converted" value={counts.converted} kind="ok" />
      </div>

      {/* Filters */}
      <div className="row gap-2 mb-2" style={{ flexWrap: "wrap" }}>
        {FILTERS.map(([id, label]) => (
          <button key={id} className={"pill " + (filter === id ? "accent" : "outline")}
                  onClick={() => setFilter(id)} style={{ cursor: "pointer", fontSize: 12.5, padding: "4px 11px" }}>
            {label} <span className="muted mono" style={{ fontSize: 12.5 }}>· {counts[id] != null ? counts[id] : 0}</span>
          </button>
        ))}
        <label className="row gap-2" style={{ marginLeft: "auto", fontSize: 12.5, cursor: "pointer", alignItems: "center" }}>
          <input type="checkbox" checked={showTests} onChange={(e) => setShowTests(e.target.checked)} /> show test rows
        </label>
      </div>

      <div className="card">
        <table className="s4-table">
          <thead>
            <tr>
              <th>Source</th><th>Business · Contact</th><th>Quality</th><th>Status</th>
              <th>SLA</th><th>Budget</th><th>Services</th><th>Next action</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => {
              const sla = s5SlaInfo(l);
              const canConvert = l.status !== "Converted" && l.quality !== "scrap" && !l.dupOf;
              const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
              return (
                <tr key={l.id} style={{ opacity: l.dupOf ? 0.55 : 1, cursor: "pointer" }}
                    onClick={() => window.openLeadPanel && window.openLeadPanel(l.id)}>
                  <td><S5SourcePill source={l.source} />{l.manualEntry && <span className="muted" style={{ fontSize: 11, marginLeft: 4 }}>manual</span>}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{l.company}
                      {l.gformSubmitted && <span className="pill ok" style={{ marginLeft: 6, fontSize: 10.5 }} title="Trial Google Form submitted">G-form ✓</span>}
                      {l.sample && <span className="pill outline" style={{ marginLeft: 6, fontSize: 10.5 }}>sample</span>}
                    </div>
                    <div className="muted" style={{ fontSize: 12.5 }}>{l.name}{l.niche ? " · " + l.niche : ""}</div>
                  </td>
                  <td><S5QualityPill q={l.quality} /></td>
                  <td><S5StatusPill s={l.status} /></td>
                  <td><span className={"pill " + sla.kind} style={{ fontSize: 11.5 }}>{sla.label}</span></td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {l.budget ? <span className="mono" style={{ fontSize: 12.5 }}>{money ? "$" + l.budget.toLocaleString() : "—"}</span>
                              : <span className="pill warn" style={{ fontSize: 11 }}>fee not set</span>}
                  </td>
                  <td style={{ fontSize: 12.5 }}>{(l.services || []).map((s) => S5_SVC_LABEL[s] || s).join(", ") || "—"}</td>
                  <td className="mono" style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>{fmtDate(l.nextActionDate)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {l.dupOf
                      ? <button className="pill outline" style={{ cursor: "pointer", fontSize: 11 }} onClick={stop(() => S5.mergeDuplicate(l.id))}>Merge dup</button>
                      : canConvert
                        ? <button className="pill accent" style={{ cursor: "pointer", fontSize: 11, padding: "4px 10px" }} onClick={stop(() => S5.convertLead(l.id))}>Convert →</button>
                        : l.status === "Converted"
                          ? <span className="muted" style={{ fontSize: 11.5 }}>{(l.convertedDealIds || []).length} deal(s)</span>
                          : <span className="muted-2">—</span>}
                  </td>
                </tr>
              );
            })}
            {!rows.length && <tr><td colSpan={9} className="muted" style={{ padding: 16 }}>No leads in this view.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="mt-3 muted" style={{ fontSize: 12.5 }}>
        <strong>Convert →</strong> creates a per-service deal at <em>Proposal / Pricing Sent</em>, currency from the
        client's country (CAD/USD). The deal then moves through the pipeline; on win, the Google Form goes out and an
        onboarding card is created.
      </div>
    </div>
  );
}

/* Shared tile */
function S5Tile({ label, value, sub, kind }) {
  return (
    <div className="card" style={{ flex: 1, padding: "12px 14px", minWidth: 120 }}>
      <div className="label" style={{ marginBottom: 4 }}>{label}</div>
      <div className="mono" style={{ fontSize: 22, color: kind === "warn" ? "var(--warn)" : kind === "ok" ? "var(--ok)" : "var(--ink)" }}>{value}</div>
      {sub && <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* ── Pipeline: per-service deal kanban with fee-gate + drag-to-stage + win→onboarding ── */
function SalesPipelineLiveScreen({ role }) {
  window.useStore && window.useStore();
  const S5 = window.PPC.S5;
  const access = window.PPC.ROLE_ACCESS[role.id] || {};
  const money = access.money;
  const canSeeFee = access.money || access.scope === "sales"; // rep quotes per-deal fees
  const [svc, setSvc] = React.useState("all");
  const [dragId, setDragId] = React.useState(null);

  // pipeline columns (exclude terminal trial/lost/later — those live on Trials / are parked)
  const COLS = S5.STAGE5.filter((s) => !["s5-trial", "s5-lost", "s5-later"].includes(s.id));
  const deals = S5.state.deals.filter((d) => !d.payingClient && (svc === "all" || d.service === svc));
  const byStage = (id) => deals.filter((d) => d.stage === id);

  const colTint = (flag) => flag === "danger" ? "rgba(197,85,45,0.06)" : flag === "warn" ? "rgba(214,158,46,0.07)" : flag === "ok" ? "rgba(74,124,89,0.07)" : "var(--card-2)";
  const flagDot = (flag) => flag === "danger" ? "var(--danger)" : flag === "warn" ? "var(--warn)" : flag === "ok" ? "var(--ok)" : "var(--line-strong)";

  const onDrop = (stageId) => { if (dragId) S5.setDealStage(dragId, stageId); setDragId(null); };
  const setFee = (deal) => {
    const v = window.prompt(`Set monthly fee for ${deal.company} (${deal.currency}). Range $${S5.FEE_RANGE.min}–$${S5.FEE_RANGE.max}/mo:`, deal.monthlyFee || "");
    if (v != null) S5.setDealFee(deal.id, v);
  };

  const SVC_FILTERS = [["all", "All services"], ["meta", "Meta"], ["google", "Google"], ["smm", "SMM"], ["influencer", "Influencer"]];
  const weighted = deals.reduce((s, d) => s + (d.monthlyFee || 0) * (d.prob / 100), 0);

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Abhishek</div>
        <h1 className="page-title">Deal <em>Pipeline</em></h1>
        <div className="page-sub">
          One deal per service. Drag a card to move stages. A deal <strong>can't pass Meeting Completed
          until the real fee is set</strong> ($375–$2,400/mo — no fake $8,000 placeholder). Dragging to
          <strong> Won</strong> sends the Google Form, creates the onboarding card and starts the 30-day trial.
        </div>
      </div>

      <div className="row gap-2 mb-3" style={{ flexWrap: "wrap", alignItems: "center" }}>
        {SVC_FILTERS.map(([id, label]) => (
          <button key={id} className={"pill " + (svc === id ? "accent" : "outline")}
                  onClick={() => setSvc(id)} style={{ cursor: "pointer", fontSize: 12.5, padding: "4px 11px" }}>{label}</button>
        ))}
        <span className="muted" style={{ marginLeft: "auto", fontSize: 12.5 }}>
          {deals.length} open deals · weighted pipeline <span className="mono">{money ? "$" + Math.round(weighted).toLocaleString() : "—"}</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {COLS.map((col) => {
          const cards = byStage(col.id);
          return (
            <div key={col.id}
                 onDragOver={(e) => e.preventDefault()}
                 onDrop={() => onDrop(col.id)}
                 style={{ minWidth: 220, width: 220, flexShrink: 0, background: colTint(col.flag), borderRadius: "var(--r-2)", border: "1px solid var(--line)", padding: 8 }}>
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", padding: "2px 4px 8px" }}>
                <div className="row gap-2" style={{ alignItems: "center" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 4, background: flagDot(col.flag) }} />
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{col.name}</span>
                </div>
                <span className="muted mono" style={{ fontSize: 11.5 }}>{col.prob}%</span>
              </div>
              {cards.map((d) => (
                <div key={d.id} draggable
                     onDragStart={() => setDragId(d.id)} onDragEnd={() => setDragId(null)}
                     onClick={() => window.openDealPanel && window.openDealPanel(d.id)}
                     className="card" style={{ padding: 10, marginBottom: 8, cursor: "pointer", borderColor: dragId === d.id ? "var(--accent)" : "var(--line)" }}>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{d.company}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginBottom: 6 }}>{d.contact || "—"}</div>
                  <div className="row gap-2" style={{ flexWrap: "wrap", marginBottom: 6 }}>
                    <S5ServicePill svc={d.service} />
                    <S5SourcePill source={d.source} />
                  </div>
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    {d.feeNeedsSet
                      ? <button className="pill warn" style={{ cursor: "pointer", fontSize: 11, borderStyle: "dashed" }} onClick={(e) => { e.stopPropagation(); setFee(d); }}>set fee</button>
                      : <span className="mono" style={{ fontSize: 12 }}>{canSeeFee ? fmtMoney(d.monthlyFee, d.currency) + "/mo" : d.currency}</span>}
                    {d.nextActionDate && <span className="muted mono" style={{ fontSize: 11 }}>↻ {d.nextActionDate.slice(5)}</span>}
                  </div>
                </div>
              ))}
              {!cards.length && <div className="muted-2" style={{ fontSize: 11.5, padding: "8px 4px", textAlign: "center" }}>—</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Trials: 30-day deferred-payment trials in flight ── */
function SalesTrialsScreen({ role }) {
  window.useStore && window.useStore();
  const S5 = window.PPC.S5;
  const money = window.PPC.ROLE_ACCESS[role.id] && window.PPC.ROLE_ACCESS[role.id].money;
  const trials = S5.trialsInFlight();
  const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d.trialEndsAt + "T12:00:00") - new Date(S5.SALES_TODAY + "T12:00:00")) / 86400000));

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Abhishek</div>
        <h1 className="page-title">30-day <em>Trials</em></h1>
        <div className="page-sub">
          Deferred-payment trials in flight — the client pays the agency <strong>$0</strong> until the
          end-of-trial conversion meeting, then <strong>setup fee + first month</strong>. (Ad spend on
          Google/Meta is always the client's, even if they don't convert.) {trials.length} active.
        </div>
      </div>
      <div className="card">
        <table className="s4-table">
          <thead><tr>
            <th>Client</th><th>Service</th><th>Trial ends</th><th>Days left</th>
            <th>Conversion meeting</th><th>Setup + 1st month</th><th></th>
          </tr></thead>
          <tbody>
            {trials.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 500 }}>{d.company}{d.real && <span className="pill ok" style={{ marginLeft: 6, fontSize: 11.5 }}>live</span>}</td>
                <td><S5ServicePill svc={d.service} /></td>
                <td className="mono" style={{ fontSize: 12.5 }}>{d.trialEndsAt}</td>
                <td><span className={"pill " + (daysLeft(d) <= 3 ? "warn" : "outline")} style={{ fontSize: 11.5 }}>{daysLeft(d)}d</span></td>
                <td className="mono" style={{ fontSize: 12.5 }}>{d.conversionMeetingAt || "—"}</td>
                <td className="mono" style={{ fontSize: 12.5 }}>{money ? fmtMoney((d.setupFee || 0) + (d.monthlyFee || 0), d.currency) : "—"}</td>
                <td><button className="pill accent" style={{ cursor: "pointer", fontSize: 11.5, padding: "4px 10px" }} onClick={() => S5.markPaying(d.id)}>Mark converted →</button></td>
              </tr>
            ))}
            {!trials.length && <tr><td colSpan={7} className="muted" style={{ padding: 16 }}>No active trials right now.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Calls: Zoom Phone — connected vs not + duration + synced transcript ── */
function SalesCallsLiveScreen({ role }) {
  window.useStore && window.useStore();
  const S5 = window.PPC.S5;
  const calls = S5.ZOOM_CALLS;
  const stats = S5.callStats();
  const [open, setOpen] = React.useState(null);
  const fmtTime = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const dur = (s) => s ? Math.floor(s / 60) + "m " + (s % 60) + "s" : "—";

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Abhishek</div>
        <h1 className="page-title">Zoom <em>Calls</em></h1>
        <div className="page-sub">
          The two things Zoho can't do: track <strong>which calls actually connected</strong> (with duration)
          and <strong>auto-sync the transcript</strong> into the ERP — summary, key moments, and action items
          you can turn into tasks.
        </div>
      </div>

      <div className="card" style={{ padding: "10px 14px", marginBottom: 14, borderStyle: "dashed", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon k="phone" className="ic sm" />
        <span style={{ fontSize: 12.5 }}>Pending Zoom Phone integration — rows below are <strong>sample data</strong> showing the target experience.</span>
      </div>

      <div className="row gap-3 mb-3" style={{ flexWrap: "wrap" }}>
        <S5Tile label="Calls today" value={stats.today} />
        <S5Tile label="Connected" value={stats.connected + " / " + stats.total} kind="ok" />
        <S5Tile label="Connect rate" value={stats.connectRate + "%"} kind={stats.connectRate >= 50 ? "ok" : "warn"} />
        <S5Tile label="Avg connected" value={stats.avgMin + "m"} />
      </div>

      <div className="card">
        <table className="s4-table">
          <thead><tr>
            <th>When</th><th>Direction</th><th>Company · Contact</th><th>Connected</th><th>Duration</th><th>Outcome</th><th>Transcript</th>
          </tr></thead>
          <tbody>
            {calls.map((c) => (
              <React.Fragment key={c.id}>
                <tr>
                  <td className="mono" style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>{fmtTime(c.when)}</td>
                  <td><span className="pill outline" style={{ fontSize: 11 }}>{c.direction}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{c.company}</div><div className="muted" style={{ fontSize: 12 }}>{c.contact}</div></td>
                  <td><span className={"pill " + (c.connected ? "ok" : "danger")} style={{ fontSize: 11 }}>{c.connected ? "connected" : "no answer"}</span></td>
                  <td className="mono" style={{ fontSize: 12.5 }}>{dur(c.durationSec)}</td>
                  <td style={{ fontSize: 12.5 }}>{c.outcome}</td>
                  <td>
                    {c.transcript
                      ? <button className="pill accent" style={{ cursor: "pointer", fontSize: 11 }} onClick={() => setOpen(open === c.id ? null : c.id)}>{open === c.id ? "Hide" : "View"}</button>
                      : <span className="muted-2" style={{ fontSize: 11.5 }}>none</span>}
                  </td>
                </tr>
                {open === c.id && c.transcript && (
                  <tr>
                    <td colSpan={7} style={{ background: "var(--card-2)" }}>
                      <div style={{ padding: "10px 6px" }}>
                        <div className="label" style={{ marginBottom: 4 }}>Summary <span className="pill outline" style={{ fontSize: 10.5, marginLeft: 6 }}>auto-synced · sample</span></div>
                        <div style={{ fontSize: 13, marginBottom: 10 }}>{c.transcript.summary}</div>
                        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <div className="label" style={{ marginBottom: 6 }}>Action items</div>
                            {c.transcript.actionItems.map((a, i) => (
                              <div key={i} className="row" style={{ justifyContent: "space-between", alignItems: "center", padding: "3px 0", fontSize: 12.5 }}>
                                <span>• {a}</span>
                                <button className="pill outline" style={{ cursor: "pointer", fontSize: 10.5 }}
                                        onClick={() => window.openNewTask && window.openNewTask({ client: c.company, title: a })}>→ Task</button>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="label" style={{ marginBottom: 6 }}>Key moments</div>
                            {c.transcript.keyMoments.map((m, i) => (
                              <div key={i} className="muted" style={{ fontSize: 12.5, padding: "3px 0" }}>{m}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Sales Dashboard: role-aware (Rep vs Owner) ── */
function SalesDashboardScreen({ role, setScreen }) {
  window.useStore && window.useStore();
  const S5 = window.PPC.S5;
  const money = window.PPC.ROLE_ACCESS[role.id] && window.PPC.ROLE_ACCESS[role.id].money;
  const isOwner = ["jaydeep", "dhaval"].includes(role.id);
  const f = S5.funnel();
  const rep = S5.repToday();
  const t2p = S5.trialToPaidRate();
  const wp = S5.weightedPipeline();
  const sources = S5.sourceBreakdown();

  const FunnelBar = ({ label, n, max }) => (
    <div style={{ marginBottom: 8 }}>
      <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5 }}>
        <span>{label}</span><span className="mono">{n}</span>
      </div>
      <div style={{ height: 8, background: "var(--line-2)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: (max ? Math.round((n / max) * 100) : 0) + "%", height: "100%", background: "var(--accent)" }} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · {isOwner ? "Owner overview" : "Abhishek"}</div>
        <h1 className="page-title">Sales <em>Dashboard</em></h1>
        <div className="page-sub">
          {isOwner
            ? "Funnel health, trial→paid conversion, pipeline value and source performance."
            : "Your day: leads to work, follow-ups, the daily Google-form KPI, and trials in flight."}
        </div>
      </div>

      {!isOwner ? (
        <>
          <div className="row gap-3 mb-3" style={{ flexWrap: "wrap" }}>
            <S5Tile label="New leads today" value={rep.newLeads} />
            <S5Tile label="Follow-ups due" value={rep.followUps} kind={rep.followUps ? "warn" : null} />
            <S5Tile label="Trial forms today" value={rep.gformsToday + " / 1"} sub="KPI ≥ 1/day" kind={rep.gformsToday >= 1 ? "ok" : "warn"} />
            <S5Tile label="Open deals" value={rep.openDeals} />
            <S5Tile label="Trials in flight" value={rep.trials} kind="ok" />
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div className="label" style={{ marginBottom: 8 }}>SLA — first response under 4h (weekdays; weekends off)</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{rep.slaAtRisk} uncontacted weekday lead(s) on the clock. Weekend arrivals start Monday.</div>
            <div className="row gap-2 mt-3">
              <button className="btn" onClick={() => setScreen && setScreen("leads")}>Work the lead inbox →</button>
              <button className="btn ghost" onClick={() => setScreen && setScreen("pipeline")}>Open pipeline</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="row gap-3 mb-3" style={{ flexWrap: "wrap" }}>
            <S5Tile label="Leads" value={f.leads} />
            <S5Tile label="Contacted" value={f.contacted} />
            <S5Tile label="Trials" value={f.trials} kind="ok" />
            <S5Tile label="Paying" value={f.paying} kind="ok" />
            <S5Tile label="Trial → paid" value={t2p + "%"} sub="goal 60–70%" kind={t2p >= 60 ? "ok" : "warn"} />
            <S5Tile label="Weighted pipeline" value={money ? "$" + Math.round(wp).toLocaleString() : "—"} sub="prob-weighted" />
          </div>
          <div className="grid-2 gap-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card" style={{ padding: 14 }}>
              <div className="label" style={{ marginBottom: 10 }}>Funnel</div>
              <FunnelBar label="Leads" n={f.leads} max={f.leads} />
              <FunnelBar label="Contacted" n={f.contacted} max={f.leads} />
              <FunnelBar label="Trials" n={f.trials} max={f.leads} />
              <FunnelBar label="Paying" n={f.paying} max={f.leads} />
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div className="label" style={{ marginBottom: 10 }}>By source → conversion</div>
              {sources.map((s) => (
                <div key={s.source} className="row" style={{ justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", borderBottom: "1px solid var(--line-2)" }}>
                  <span>{(S5.SOURCE_DEFS[s.source] || {}).label || s.source}</span>
                  <span className="mono muted">{s.leads} leads · {s.rate}% conv</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── timeline item (mirrors .s4-tl-* CSS; self-contained, no cross-file dep) ── */
function S5TimelineItem({ item }) {
  const map = {
    "call-out":  { cls: "call",  ic: "phoneOut",  label: "Outbound call" },
    "call-in":   { cls: "call",  ic: "phoneIn",   label: "Inbound call" },
    "call-miss": { cls: "miss",  ic: "phoneMiss", label: "Missed call" },
    "wa-thread": { cls: "wa",    ic: "whatsapp",  label: "WhatsApp" },
    "stage":     { cls: "stage", ic: "arrow",     label: "Update" },
    "note":      { cls: "stage", ic: "pencil",    label: "Note" },
    "meet":      { cls: "meet",  ic: "users",     label: "Meeting" },
  };
  const m = map[item.kind] || { cls: "stage", ic: "clock", label: "Event" };
  const fmt = (iso) => { try { return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); } catch (e) { return iso; } };
  return (
    <div className="s4-tl-item">
      <div className={"s4-tl-icon " + m.cls}><Icon k={m.ic} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="s4-tl-kind">{item.title || m.label}</span>
          <span className="s4-tl-time">{fmt(item.when)}</span>
          {item.sample && <span className="pill s4-sample" style={{ fontSize: 11, padding: "1px 7px" }}><span className="dot" />sample</span>}
        </div>
        {item.body && <div className="s4-tl-body">{item.body}</div>}
        {item.bubbles && (
          <div className="s4-wa-thread">
            {item.bubbles.map((b, i) => (
              <div key={i} className={"s4-wa-bubble" + (b.dir === "out" ? " out" : "")}>
                <div>{b.text}</div><div className="s4-wa-time">{b.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Lead detail slide-over ── */
function LeadDetailPanel({ leadId, role, onClose }) {
  window.useStore && window.useStore();
  if (!leadId) return null;
  const S5 = window.PPC.S5;
  const l = S5.leadById(leadId);
  if (!l) return null;
  const access = window.PPC.ROLE_ACCESS[role.id] || {};
  const canSeeFee = access.money || access.scope === "sales";
  const sla = s5SlaInfo(l);
  const tl = S5.leadTimeline(l);
  const deals = (l.convertedDealIds || []).map((id) => S5.dealById(id)).filter(Boolean);
  const Fact = ({ k, children }) => (
    <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, padding: "3px 0" }}><span className="muted">{k}</span><span style={{ textAlign: "right" }}>{children}</span></div>
  );
  return (
    <React.Fragment>
      <div className="panel-scrim open" onClick={onClose} />
      <aside className="side-panel open" role="dialog" aria-label="Lead detail" style={{ width: 560 }}>
        <div className="side-panel-head" style={{ padding: "18px 20px 16px", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="page-eyebrow">Lead · detail</div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: "4px 0 0", color: "var(--ink)" }}>{l.name || l.company}</h2>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{l.company}{l.niche ? " · " + l.niche : ""}</div>
            <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              <S5SourcePill source={l.source} />
              <S5QualityPill q={l.quality} />
              <S5StatusPill s={l.status} />
              <span className={"pill " + sla.kind} style={{ fontSize: 11.5 }}>{sla.label}</span>
              {l.gformSubmitted && <span className="pill ok" style={{ fontSize: 11 }}>G-form ✓</span>}
              {l.dupOf && <span className="pill outline" style={{ fontSize: 11 }}>dup of {l.dupOf}</span>}
            </div>
          </div>
          <button className="pill outline" onClick={onClose} aria-label="Close" style={{ cursor: "pointer", marginLeft: 12, padding: "4px 10px" }}><Icon k="close" style={{ width: 12, height: 12 }} /></button>
        </div>
        <div className="side-panel-body" style={{ padding: "18px 20px 40px" }}>
          {l.weekendArrival && l.status === "Not Contacted" && (
            <div className="s4-banner info mb-3"><Icon k="calendar" /><div><strong>Weekend arrival.</strong> SLA clock starts Monday — the rep isn't on the hook over the weekend.</div></div>
          )}
          <div className="card" style={{ padding: 12, marginBottom: 14 }}>
            <Fact k="Email">{l.email || "—"}</Fact>
            <Fact k="Services">{(l.services || []).map((s) => S5.SVC_NAME[s] || s).join(", ") || "—"}</Fact>
            <Fact k="Budget">{l.budget ? (canSeeFee ? "$" + l.budget.toLocaleString() : "set") : <span className="pill warn" style={{ fontSize: 11 }}>fee not set</span>}</Fact>
            <Fact k="Call attempts"><span className="mono">{l.callAttempts || 0}</span></Fact>
            <Fact k="Next action"><span className="mono">{l.nextActionDate || "—"}</span></Fact>
            <Fact k="Created"><span className="mono">{l.created || "—"}</span></Fact>
          </div>

          <div className="row" style={{ gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => S5.logCall(l.id, true)}><Icon k="phone" style={{ width: 11, height: 11 }} /> Call · connected</button>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => S5.logCall(l.id, false)}>No answer</button>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => { const t = window.prompt("WhatsApp message to " + l.company + ":"); if (t != null) S5.logWhatsApp(l.id, t); }}><Icon k="whatsapp" style={{ width: 11, height: 11 }} /> WhatsApp</button>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => window.openEmailCompose && window.openEmailCompose({ client: l.company, who: role })}><Icon k="mail" style={{ width: 11, height: 11 }} /> Email</button>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => { const dt = window.prompt("Next action date (YYYY-MM-DD):", l.nextActionDate || S5.SALES_TODAY); if (dt != null) S5.setLeadNextAction(l.id, dt); }}><Icon k="calendar" style={{ width: 11, height: 11 }} /> Next action</button>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => { const t = window.prompt("Add note:"); if (t) S5.addLeadNote(l.id, t); }}><Icon k="pencil" style={{ width: 11, height: 11 }} /> Note</button>
          </div>

          <div className="row" style={{ gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {l.status !== "Converted" && l.quality !== "scrap" && !l.dupOf && <button className="btn" onClick={() => S5.convertLead(l.id)}>Convert to deal →</button>}
            {l.dupOf && <button className="btn ghost" onClick={() => S5.mergeDuplicate(l.id)}>Merge duplicate</button>}
            {l.quality !== "scrap" && l.status !== "Converted" && <button className="btn ghost" onClick={() => S5.markScrap(l.id)}>Mark scrap</button>}
          </div>

          {deals.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div className="s4-eyebrow mb-2">Deals from this lead</div>
              {deals.map((d) => (
                <div key={d.id} className="card" style={{ padding: 10, marginBottom: 6, cursor: "pointer" }} onClick={() => window.openDealPanel && window.openDealPanel(d.id)}>
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 500 }}>{S5.SVC_NAME[d.service] || d.service}</span>
                    <span className="pill outline" style={{ fontSize: 11 }}>{(S5.stageById(d.stage) || {}).name} →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="s4-eyebrow mb-2">Activity · newest first</div>
          {tl.length ? tl.map((it, i) => <S5TimelineItem key={i} item={it} />) : <div className="muted" style={{ fontStyle: "italic", fontSize: 13 }}>No activity yet.</div>}
        </div>
      </aside>
    </React.Fragment>
  );
}

/* ── Deal detail slide-over ── */
function DealDetailPanel({ dealId, role, onClose }) {
  window.useStore && window.useStore();
  if (!dealId) return null;
  const S5 = window.PPC.S5;
  const d = S5.dealById(dealId);
  if (!d) return null;
  const access = window.PPC.ROLE_ACCESS[role.id] || {};
  const canSeeFee = access.money || access.scope === "sales";
  const st = S5.stageById(d.stage) || {};
  const tl = S5.dealTimeline(d);
  const lead = d.fromLeadId ? S5.leadById(d.fromLeadId) : null;
  const isTrial = d.stage === "s5-trial";
  const pipeStages = S5.STAGE5.filter((s) => !["s5-trial", "s5-lost", "s5-later"].includes(s.id));
  const sideStages = S5.STAGE5.filter((s) => ["s5-later", "s5-lost", "s5-ghosting"].includes(s.id));
  const setFee = () => { const v = window.prompt(`Set monthly fee for ${d.company} (${d.currency}). Range $${S5.FEE_RANGE.min}–$${S5.FEE_RANGE.max}/mo:`, d.monthlyFee || ""); if (v != null) S5.setDealFee(d.id, v); };
  const Fact = ({ k, children }) => (
    <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, padding: "3px 0" }}><span className="muted">{k}</span><span style={{ textAlign: "right" }}>{children}</span></div>
  );
  return (
    <React.Fragment>
      <div className="panel-scrim open" onClick={onClose} />
      <aside className="side-panel open" role="dialog" aria-label="Deal detail" style={{ width: 560 }}>
        <div className="side-panel-head" style={{ padding: "18px 20px 16px", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="page-eyebrow">Deal · {S5.SVC_NAME[d.service] || d.service}</div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 500, margin: "4px 0 0", color: "var(--ink)" }}>{d.company}</h2>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{d.contact || "—"}</div>
            <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              <S5ServicePill svc={d.service} />
              <S5SourcePill source={d.source} />
              <span className="pill outline" style={{ fontSize: 11.5 }}>{st.name} · {d.prob}%</span>
              {d.feeNeedsSet
                ? <button className="pill warn" style={{ fontSize: 11, cursor: "pointer", borderStyle: "dashed" }} onClick={setFee}>fee not set</button>
                : <span className="pill accent mono" style={{ fontSize: 11.5 }}>{canSeeFee ? fmtMoney(d.monthlyFee, d.currency) + "/mo" : d.currency}</span>}
              {d.payingClient && <span className="pill ok" style={{ fontSize: 11 }}>paying</span>}
            </div>
          </div>
          <button className="pill outline" onClick={onClose} aria-label="Close" style={{ cursor: "pointer", marginLeft: 12, padding: "4px 10px" }}><Icon k="close" style={{ width: 12, height: 12 }} /></button>
        </div>
        <div className="side-panel-body" style={{ padding: "18px 20px 40px" }}>
          {d.feeNeedsSet && (
            <div className="s4-banner warn mb-3"><Icon k="alert" /><div><strong>Set the real monthly fee.</strong> Range ${S5.FEE_RANGE.min}–${S5.FEE_RANGE.max}/mo. The deal can't advance past <em>Meeting Completed</em> until this is set.</div></div>
          )}
          {isTrial && !d.payingClient && (
            <div className="s4-banner info mb-3"><Icon k="cycle" /><div><strong>30-day trial running.</strong> Ends {d.trialEndsAt} · conversion meeting {d.conversionMeetingAt}. $0 agency fee billed until then; client still owes their own ad spend.</div></div>
          )}

          <div className="card" style={{ padding: 12, marginBottom: 14 }}>
            <Fact k="Currency">{d.currency}</Fact>
            {canSeeFee && <Fact k="Monthly fee">{d.monthlyFee ? fmtMoney(d.monthlyFee, d.currency) : "—"}</Fact>}
            {canSeeFee && <Fact k="Setup fee">{d.setupFee ? fmtMoney(d.setupFee, d.currency) : "—"}</Fact>}
            <Fact k="Win probability"><span className="mono">{d.prob}%</span></Fact>
            <Fact k="Next action"><span className="mono">{d.nextActionDate || "—"}</span></Fact>
            {d.trialStart && <Fact k="Trial">{d.trialStart} → {d.trialEndsAt}</Fact>}
            {d.onboardingCardId && <Fact k="Onboarding"><span className="pill ok" style={{ fontSize: 11, cursor: "pointer" }} onClick={() => window.openClientPanel && window.openClientPanel(d.company)}>open card →</span></Fact>}
          </div>

          {/* stage selector */}
          <div className="s4-eyebrow mb-2">Move stage</div>
          <div className="row" style={{ gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
            {pipeStages.map((s) => (
              <button key={s.id} className={"pill " + (s.id === d.stage ? "accent" : "outline")} style={{ cursor: "pointer", fontSize: 11, padding: "3px 9px" }} onClick={() => S5.setDealStage(d.id, s.id)}>{s.name}</button>
            ))}
          </div>
          <div className="row" style={{ gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
            {sideStages.map((s) => (
              <button key={s.id} className={"pill " + (s.id === d.stage ? "danger" : "outline")} style={{ cursor: "pointer", fontSize: 11, padding: "3px 9px" }} onClick={() => S5.setDealStage(d.id, s.id)}>{s.name}</button>
            ))}
          </div>

          {/* actions */}
          <div className="row" style={{ gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={setFee}><Icon k="pencil" style={{ width: 11, height: 11 }} /> {d.feeNeedsSet ? "Set fee" : "Update fee"}</button>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => { const dt = window.prompt("Next action date (YYYY-MM-DD):", d.nextActionDate || S5.SALES_TODAY); if (dt != null) S5.setDealNextAction(d.id, dt); }}><Icon k="calendar" style={{ width: 11, height: 11 }} /> Next action</button>
            <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => { const t = window.prompt("Add note:"); if (t) S5.addDealNote(d.id, t); }}><Icon k="pencil" style={{ width: 11, height: 11 }} /> Note</button>
            {lead && <button className="pill outline" style={{ cursor: "pointer", padding: "4px 10px" }} onClick={() => window.openLeadPanel && window.openLeadPanel(lead.id)}>↑ Source lead</button>}
          </div>
          <div className="row" style={{ gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {!d.wonAt && !isTrial && <button className="btn" onClick={() => S5.setDealStage(d.id, "s5-won")}>Win → Onboarding + Trial</button>}
            {isTrial && !d.payingClient && <button className="btn" onClick={() => S5.markPaying(d.id)}>Mark converted → Paying</button>}
          </div>

          <div className="s4-eyebrow mb-2">Activity · newest first</div>
          {tl.length ? tl.map((it, i) => <S5TimelineItem key={i} item={it} />) : <div className="muted" style={{ fontStyle: "italic", fontSize: 13 }}>No activity yet.</div>}
        </div>
      </aside>
    </React.Fragment>
  );
}

Object.assign(window, {
  SalesLeadsLiveScreen, SalesPipelineLiveScreen, SalesTrialsScreen,
  SalesCallsLiveScreen, SalesDashboardScreen,
  LeadDetailPanel, DealDetailPanel, S5TimelineItem,
  S5SourcePill, S5QualityPill, S5StatusPill, S5ServicePill, S5Tile,
});
