/* Phase 4 — Sales screens (Abhishek's daily workspace)
 *
 *   SalesHomeScreen      → "sales-home"  (Sales · Home)
 *   SalesLeadsScreen     → "leads"       (REPLACES Phase 1 LeadsScreen)
 *   SalesPipelineScreen  → "pipeline"    (REPLACES Phase 1 PipelineScreen)
 *   SalesCallsScreen     → "sales-calls"
 *   SalesEmailsScreen    → "sales-emails"
 *   SalesHistoryPanel    → mounted in app.jsx as a slide-over, opened by
 *                          window.openSalesHistory({ kind, record })
 *
 * Reads ZOHO_* data from window.PPC (see phase4Data.js). Phase 1/2/3
 * locked behaviors are untouched — the OLD `LEADS` array still exists
 * on window.PPC and Phase 3's Forecast continues to consume it.
 */

// ============================================================
// Shared pill helpers (Phase 4 only — namespaced)
// ============================================================

function S4ProvincePill({ province, outOfArea }) {
  if (!province) return <span className="pill warn"><span className="dot"/>no phone</span>;
  if (outOfArea) return <span className="pill danger"><span className="dot"/>{province} · out of area</span>;
  return <span className="pill ok"><span className="dot"/>{province}</span>;
}

function S4StatusPill({ status }) {
  const map = {
    "Not Contacted":         "warn",
    "Attempted to Contact":  "outline",
    "Contacted":             "client",
    "Not Qualified":         "danger",
    "Converted":             "ok",
  };
  const k = map[status] || "outline";
  return <span className={"pill " + k}><span className="dot"/>{status}</span>;
}

function S4SourceCell({ source, missing }) {
  if (missing) return <span className="pill warn"><span className="dot"/>no source</span>;
  return <span className="pill outline">{source}</span>;
}

function S4In24hMark({ ok }) {
  if (ok) return <span className="pill ok" title="Contacted within 24h"><span className="dot"/>≤24h</span>;
  return <span className="pill danger" title=">24h to first contact"><span className="dot"/>{">"}24h</span>;
}

function S4CallTypeBadge({ type }) {
  const map = {
    out:   { label: "Outbound",  cls: "s4-call-out",  ic: "phoneOut"  },
    in:    { label: "Inbound",   cls: "s4-call-in",   ic: "phoneIn"   },
    miss:  { label: "Missed",    cls: "s4-call-miss", ic: "phoneMiss" },
    sched: { label: "Scheduled", cls: "s4-call-sched",ic: "calendar"  },
  };
  const m = map[type] || map.out;
  return (
    <span className="row gap-2" style={{display: "inline-flex", alignItems: "center"}}>
      <span className={"s4-call-type " + m.cls}><Icon k={m.ic}/></span>
      <span style={{fontSize: 12.5, fontWeight: 500}}>{m.label}</span>
    </span>
  );
}

function S4CallNote({ note }) {
  if (!note) return <span className="muted-2">—</span>;
  const parts = note.split("•").map(p => p.trim()).filter(Boolean);
  if (parts.length <= 1) return <span style={{fontSize: 13.5}}>{note}</span>;
  return (
    <ul style={{margin: 0, paddingLeft: 16, fontSize: 13.5}}>
      {parts.map((p, i) => <li key={i}>{p}</li>)}
    </ul>
  );
}

// ============================================================
// SALES HOME (per-employee dashboard — currently scoped to Abhishek)
// ============================================================

function SalesHomeScreen({ role, setScreen }) {
  const P = window.PPC;
  const k24 = P.leadsContactedWithin24h();
  const ng = P.noShowGhostRate();
  const oop = P.outOfProvinceRate();

  const comms = P.commsTotals("today");
  const commsAll = P.commsTotals();

  const access = P.ROLE_ACCESS[role.id];
  const showMoney = access.money;

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Monday, May 26 · 2026</div>
        <h1 className="page-title">Good morning, <em>{role.id === "abhishek" ? "Abhishek" : role.name.split(" ")[0]}</em>.</h1>
        <div className="page-sub" style={{maxWidth: 760}}>
          10 new leads this week — but 8 are out of province. Two deals in Proposal
          need a real fee set. Five of 12 active deals are sitting in No-Show or
          Ghosting. Below: today's leaks, your communication tally across calls /
          WhatsApp / email, and the Zoho data hygiene that needs cleanup at source.
        </div>
      </div>

      {/* Communication tally — Calls / WhatsApp / Email / Total */}
      <div className="s4-eyebrow mb-2">Communication today · all channels</div>
      <div className="grid-4 mb-4">
        <S4CommTile
          icon="phone"
          label="Calls"
          value={comms.calls}
          sub={`${P.callsByType("out")} outbound · ${P.callsByType("miss")} missed · ${P.callsByType("sched")} scheduled`}
          onClick={() => setScreen("sales-calls")}
        />
        <S4CommTile
          icon="whatsapp"
          label="WhatsApp"
          value={comms.wa}
          sub="messages across active threads"
          tone="ok"
          tag="sample · pending pipe"
        />
        <S4CommTile
          icon="mail"
          label="Email"
          value={comms.email}
          sub={`${P.emailsSent("today")} sent · ${P.emailsReceived("today")} received today`}
          onClick={() => setScreen("sales-emails")}
        />
        <S4CommTile
          icon="trend"
          label="Total touches"
          value={comms.total}
          sub={`all-time: ${commsAll.total} across ${P.ZOHO_LEADS.length + P.ZOHO_DEALS.length} contacts`}
          tone="accent"
        />
      </div>

      {/* 5 KPI cards */}
      <div className="s4-eyebrow mb-2">Key performance indicators</div>
      <div className="grid-5 mb-4">
        <S4KPICard label="Contacted within 24h" value={k24.pct + "%"}
          sub={k24.hit + " of " + k24.total + " contacted"}
          target="Target: >90%"
          tone={k24.pct >= 90 ? "ok" : k24.pct >= 70 ? "warn" : "danger"}/>
        <S4KPICard label="Trial → Paid conversion" value="—"
          sub="No paying clients yet"
          target="Target: 60–70%" tone="warn" sampleNote="needs first cohort"/>
        <S4KPICard label="New paying / month" value="0"
          sub="May 2026"
          target="Baseline TBD" tone="warn" sampleNote="set baseline"/>
        <S4KPICard label="Avg monthly fee / new client" value="—"
          sub="Fee not set on any open deal"
          target="Target: ≥$600/mo" tone="warn" sampleNote="fix Zoho fee field"/>
        <S4KPICard label="No-show + ghost rate" value={ng.pct + "%"}
          sub={ng.flagged + " of " + ng.total + " deals"}
          target="Should be <20%"
          tone={ng.pct >= 30 ? "danger" : ng.pct >= 20 ? "warn" : "ok"}
          alarm={ng.pct >= 30}/>
      </div>

      <div className="grid-2 mb-4">
        {/* Today's leaks */}
        <div className="card">
          <div className="card-head" style={{padding: "14px 18px", borderBottom: "1px solid var(--line-2)"}}>
            <div>
              <div className="s4-eyebrow">Today's leaks</div>
              <div className="serif" style={{fontSize: 15, fontWeight: 500, marginTop: 2}}>What to clean up first</div>
            </div>
          </div>
          <div style={{padding: "4px 18px 14px"}}>
            <S4LeakRow tone="danger"
              title={oop.count + " out-of-province leads in inbox"}
              sub="Meta Ads geo-targeting needs to be re-scoped to Ontario only. Talk to Vanshika."
              action="Open Leads" onClick={() => setScreen("leads")}/>
            <S4LeakRow tone="danger"
              title="4 ghosting + 1 no-show"
              sub="Captured Notions, apex shine, a2zgaragedoor, New Precon, etc. — 42% of pipeline is non-responsive."
              action="Open Pipeline" onClick={() => setScreen("pipeline")}/>
            <S4LeakRow tone="warn"
              title="2 deals in Proposal with no real fee"
              sub="a2zgaragedoorrepair · New Precon Projects. Both still showing the $8,000 placeholder."
              action="Set fees" onClick={() => setScreen("pipeline")}/>
            <S4LeakRow tone="warn"
              title={P.emailsNeedingResponse() + " emails awaiting your reply"}
              sub="Sandeep · Jashan · Bharat. Sandeep's been waiting since 2:12pm today."
              action="Open Inbox" onClick={() => setScreen("sales-emails")}/>
            <S4LeakRow tone="info"
              title="1 scheduled call · tomorrow 5 PM"
              sub="Kshitij Anand — he asked for this slot during today's outbound."
              action="See call" onClick={() => setScreen("sales-calls")}/>
          </div>
        </div>

        {/* Pipeline distribution */}
        <div className="card">
          <div className="card-head" style={{padding: "14px 18px", borderBottom: "1px solid var(--line-2)"}}>
            <div>
              <div className="s4-eyebrow">Pipeline distribution</div>
              <div className="serif" style={{fontSize: 15, fontWeight: 500, marginTop: 2}}>12 deals · by stage</div>
            </div>
            <span className="pill outline right" style={{marginLeft: "auto", cursor: "pointer"}}
                  onClick={() => setScreen("pipeline")}>
              Open <Icon k="arrow" style={{width: 11, height: 11}}/>
            </span>
          </div>
          <div style={{padding: "16px 18px 18px"}}>
            <S4StageDistribution/>
          </div>
        </div>
      </div>

      {/* Data hygiene */}
      <div className="card">
        <div className="card-head" style={{padding: "14px 18px", borderBottom: "1px solid var(--line-2)"}}>
          <div>
            <div className="s4-eyebrow">Data hygiene · from Zoho import</div>
            <div className="serif" style={{fontSize: 15, fontWeight: 500, marginTop: 2}}>Things to fix at the source</div>
          </div>
          <span className="pill s4-sample right" style={{marginLeft: "auto"}}>
            <span className="dot"/>sample data · May 2026
          </span>
        </div>
        <div style={{padding: "18px"}}>
          <div className="grid-3">
            <S4HygieneCell count={P.ZOHO_LEADS.filter(l => l.sourceMissing).length}
              of={P.ZOHO_LEADS.length} label="leads with no source"
              note="Source field is blank — UTM / form-source mapping broken?"/>
            <S4HygieneCell count={P.ZOHO_DEALS.filter(d => d.sourceMissing).length}
              of={P.ZOHO_DEALS.length} label="deals with no source"
              note="Originating lead source never carried over to the deal record."/>
            <S4HygieneCell count={P.ZOHO_DEALS.filter(d => d.feeNeedsSet).length}
              of={P.ZOHO_DEALS.length} label="deals with $8,000 placeholder"
              note="Zoho's default Amount field is wrong. Real range: $375–$2,400/mo."/>
          </div>
        </div>
      </div>
    </div>
  );
}

function S4CommTile({ icon, label, value, sub, tone, tag, onClick }) {
  const color = tone === "accent" ? "var(--accent)" : tone === "ok" ? "var(--ok)" : "var(--ink)";
  return (
    <div className="stat-card" onClick={onClick} style={onClick ? {cursor: "pointer"} : null}>
      <div className="row gap-2" style={{alignItems: "center"}}>
        <span className="s4-comm-icon" style={{color}}>
          <Icon k={icon}/>
        </span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value mono" style={{color}}>{value}</div>
      <div className="muted" style={{fontSize: 12.5}}>{sub}</div>
      {tag ? <div className="mt-2"><span className="pill s4-sample"><span className="dot"/>{tag}</span></div> : null}
    </div>
  );
}

function S4KPICard({ label, value, sub, target, tone, sampleNote, alarm }) {
  const color = tone === "danger" ? "var(--danger)" : tone === "warn" ? "var(--warn)" : tone === "ok" ? "var(--ok)" : "var(--ink)";
  return (
    <div className="stat-card" style={alarm ? { borderColor: "var(--danger)", borderWidth: 1.5 } : null}>
      <div className="stat-label">{label}</div>
      <div className="stat-value mono" style={{color}}>{value}</div>
      <div style={{fontSize: 12.5, color: "var(--ink-3)"}}>{target}</div>
      <div className="muted" style={{fontSize: 12.5, marginTop: 6}}>{sub}</div>
      {sampleNote ? <div style={{marginTop: 6}}><span className="pill s4-sample"><span className="dot"/>{sampleNote}</span></div> : null}
    </div>
  );
}

function S4LeakRow({ tone, title, sub, action, onClick }) {
  const dot = tone === "danger" ? "var(--danger)" : tone === "warn" ? "var(--warn)" : "var(--client)";
  return (
    <div className="row" style={{ padding: "10px 0", borderTop: "1px solid var(--line-2)", gap: 10 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0, marginTop: 6 }}/>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontWeight: 500, fontSize: 13.5}}>{title}</div>
        <div className="muted" style={{fontSize: 12.5}}>{sub}</div>
      </div>
      <button className="pill outline" onClick={onClick} style={{cursor: "pointer", flexShrink: 0}}>
        {action} <Icon k="arrow" style={{width: 11, height: 11}}/>
      </button>
    </div>
  );
}

function S4StageDistribution() {
  const P = window.PPC;
  const byStage = {};
  P.ZOHO_DEALS.forEach(d => { byStage[d.stage] = (byStage[d.stage] || 0) + 1; });
  const total = P.ZOHO_DEALS.length;
  const rows = P.ZOHO_STAGES.filter(s => byStage[s.id]).map(s => ({
    ...s, count: byStage[s.id], pct: byStage[s.id] / total * 100,
  })).sort((a, b) => b.count - a.count);
  return (
    <div className="col" style={{gap: 9}}>
      {rows.map(r => {
        const finalColor = r.warn === 2 ? "var(--danger)" : r.warn ? "var(--warn)" : r.ok ? "var(--accent)" : "var(--ink-3)";
        return (
          <div key={r.id} className="row" style={{gap: 12}}>
            <div style={{width: 168, fontSize: 12.5}}>{r.name}</div>
            <div style={{flex: 1, height: 10, background: "var(--line-2)", borderRadius: 6, position: "relative", overflow: "hidden"}}>
              <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: r.pct + "%", background: finalColor, borderRadius: 6}}/>
            </div>
            <div className="mono" style={{width: 60, textAlign: "right", fontSize: 12.5, color: finalColor}}>
              {r.count} <span className="muted-2 small">· {Math.round(r.pct)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function S4HygieneCell({ count, of, label, note }) {
  return (
    <div style={{padding: "4px 0"}}>
      <div style={{display: "flex", alignItems: "baseline", gap: 6}}>
        <span className="mono" style={{fontSize: 26, fontWeight: 500, color: count > 0 ? "var(--warn)" : "var(--ink)"}}>{count}</span>
        <span className="muted" style={{fontSize: 12.5}}>/ {of}</span>
      </div>
      <div style={{fontSize: 13.5, fontWeight: 500, marginTop: 2}}>{label}</div>
      <div className="muted" style={{fontSize: 12.5, marginTop: 4}}>{note}</div>
    </div>
  );
}

// ============================================================
// SALES — LEADS (Zoho-style)
// ============================================================

function SalesLeadsScreen({ role }) {
  const P = window.PPC;
  const [filter, setFilter] = React.useState("all");

  const filtered = P.ZOHO_LEADS.filter(l => {
    if (filter === "all") return true;
    if (filter === "ontario") return !l.outOfArea;
    if (filter === "oop") return l.outOfArea;
    if (filter === "notcontacted") return l.status === "Not Contacted" || l.status === "Attempted to Contact";
    return true;
  });

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Inbox</div>
        <h1 className="page-title"><em>Leads</em> from Meta Ads</h1>
        <div className="page-sub">
          10 new leads this week from the Meta inbox. <strong>8 are out of province</strong>
          {" "}— the underlying issue is the campaign's geo-targeting, not outreach. Province
          is auto-derived from the phone area code; if the lead can't be served, flag it and
          don't waste a call.
        </div>
      </div>

      <div className="row gap-2 mb-3">
        {[
          ["all", "All", P.ZOHO_LEADS.length],
          ["ontario", "Ontario only", P.ZOHO_LEADS.filter(l => !l.outOfArea).length],
          ["oop", "Out of area", P.ZOHO_LEADS.filter(l => l.outOfArea).length],
          ["notcontacted", "Needs contact", P.ZOHO_LEADS.filter(l => l.status === "Not Contacted" || l.status === "Attempted to Contact").length],
        ].map(([id, label, count]) => (
          <button key={id}
                  className={"pill " + (filter === id ? "accent" : "outline")}
                  onClick={() => setFilter(id)}
                  style={{cursor: "pointer", fontSize: 12.5, padding: "4px 11px"}}>
            {label} <span className="muted mono" style={{fontSize: 12.5}}>· {count}</span>
          </button>
        ))}
      </div>

      <div className="card">
        <table className="s4-table">
          <thead>
            <tr>
              <th>Name · Company</th>
              <th>Phone</th>
              <th>Province</th>
              <th>Source</th>
              <th>Status</th>
              <th>24h?</th>
              <th>Created</th>
              <th>Last touch</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} onClick={() => window.openSalesHistory && window.openSalesHistory({ kind: "lead", record: l })}>
                <td>
                  <div style={{fontWeight: 500}}>{l.name}</div>
                  <div className="muted" style={{fontSize: 12.5}}>{l.company}</div>
                </td>
                <td className="mono" style={{fontSize: 12.5, whiteSpace: "nowrap"}}>{l.phone}</td>
                <td><S4ProvincePill province={l.province} outOfArea={l.outOfArea}/></td>
                <td><S4SourceCell source={l.source} missing={l.sourceMissing}/></td>
                <td><S4StatusPill status={l.status}/></td>
                <td>{l.status === "Not Contacted" ? <span className="pill outline muted">—</span> : <S4In24hMark ok={l.contactedIn24h}/>}</td>
                <td style={{fontSize: 12.5}}>{P.salesDayShort(l.created + "T12:00:00")}</td>
                <td className="muted" style={{fontSize: 12.5}}>{l.lastTouch ? P.salesAgeOf(l.lastTouch + "T12:00:00") : <span className="muted-2">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 muted" style={{fontSize: 12.5}}>
        Province auto-derived from area code · 236/604/778 = BC · 403/587/825 = AB ·
        416/647/437/905/289/226/519/613/343/705 = ON. The service area is Ontario;
        BC/AB leads are out of scope.
      </div>
    </div>
  );
}

// ============================================================
// SALES — PIPELINE (Zoho-style, 12 stages)
// ============================================================

function SalesPipelineScreen({ role }) {
  const P = window.PPC;
  const byStage = {};
  P.ZOHO_STAGES.forEach(s => { byStage[s.id] = []; });
  P.ZOHO_DEALS.forEach(d => { byStage[d.stage].push(d); });

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Pipeline</div>
        <h1 className="page-title"><em>Pipeline</em> · 12 active deals</h1>
        <div className="page-sub">
          Every deal carries a placeholder <strong className="mono">$8,000</strong> from
          Zoho's default Amount field — that's not the real fee. Set the real Monthly Fee
          (range $375–$2,400) before a deal can advance past Meeting Completed.
          {" "}<em>Trial Started</em> means a trial began — <em>not</em> a paying client.
          Revenue counts only when the Paying client flag is on.
        </div>
      </div>

      <div className="grid-2 mb-3">
        <div className="s4-banner warn">
          <Icon k="alert"/>
          <div>
            <strong>Fee not set on {P.ZOHO_DEALS.filter(d => d.feeNeedsSet).length} of {P.ZOHO_DEALS.length} deals.</strong>
            {" "}Click any amber chip to set the real monthly fee.
          </div>
        </div>
        <div className="s4-banner danger">
          <Icon k="alert"/>
          <div>
            <strong>4 ghosting + 1 no-show.</strong> 42% of the pipeline is non-responsive
            — biggest leak by far.
          </div>
        </div>
      </div>

      <div className="kanban s4-kanban">
        {P.ZOHO_STAGES.map(s => (
          <div key={s.id}
               className={"kanban-col" + (s.warn === 2 ? " s4-col-danger" : s.warn ? " s4-col-warn" : s.ok ? " s4-col-ok" : "")}>
            <div className="kanban-col-head">
              <div className="kanban-col-title" style={{flex: 1}}>{s.name}</div>
              <span className="kanban-col-count">{byStage[s.id].length}</span>
            </div>
            <div className="kanban-col-body">
              {byStage[s.id].length === 0 ? (
                <div style={{padding: "10px 8px", color: "var(--ink-4)", fontSize: 12.5, fontStyle: "italic", textAlign: "center"}}>empty</div>
              ) : byStage[s.id].map(d => (
                <S4DealCard key={d.id} deal={d} stage={s}
                            onClick={() => window.openSalesHistory && window.openSalesHistory({ kind: "deal", record: d })}/>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 muted" style={{fontSize: 12.5}}>
        Probability auto-maps from stage. No-Show 30% · Reach Out Later 10% ·
        Proposal 70% · Onboarding 95% · Trial Started 100% · Ghosting 5%.
        These are stage averages — adjust per deal in the slide-over.
      </div>
    </div>
  );
}

function S4DealCard({ deal, stage, onClick }) {
  return (
    <div className="kanban-card" onClick={onClick} style={{padding: "10px 11px 11px"}}>
      <div style={{fontFamily: "var(--serif)", fontSize: 15, fontWeight: 500, lineHeight: 1.2}}>{deal.company}</div>
      <div style={{fontSize: 12.5, color: "var(--ink-3)", marginTop: 2}}>{deal.contact}</div>
      <div className="row" style={{flexWrap: "wrap", gap: 5, marginTop: 9}}>
        <span className={"s4-fee" + (deal.monthlyFee ? " set" : "")}
              onClick={(e) => { e.stopPropagation(); /* fee editor would open here */ }}>
          {deal.monthlyFee
            ? "$" + deal.monthlyFee.toLocaleString() + "/mo"
            : "⚠ Set fee · $375–$2,400"}
        </span>
      </div>
      <div className="row" style={{flexWrap: "wrap", gap: 4, marginTop: 6}}>
        <span className="pill outline mono" style={{fontSize: 11.5, padding: "1px 7px"}}>{stage.prob}%</span>
        {deal.sourceMissing
          ? <span className="pill warn" style={{fontSize: 11.5, padding: "1px 7px"}}><span className="dot"/>no source</span>
          : <span className="pill outline" style={{fontSize: 11.5, padding: "1px 7px"}}>{deal.source}</span>}
        {deal.payingClient
          ? <span className="pill ok" style={{fontSize: 11.5, padding: "1px 7px"}}><span className="dot"/>paying</span>
          : (stage.id === "z-trial" || stage.id === "z-onboarding")
            ? <span className="pill warn" style={{fontSize: 11.5, padding: "1px 7px"}}><span className="dot"/>not paying</span>
            : null}
      </div>
    </div>
  );
}

Object.assign(window, {
  SalesHomeScreen, SalesLeadsScreen, SalesPipelineScreen,
  S4ProvincePill, S4StatusPill, S4SourceCell, S4CallTypeBadge, S4CallNote,
});
