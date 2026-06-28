/* PatientROI — MVP1 app shell + Module A (Call Inbox + call simulator).
   Dashboard + Leads are simple-but-real (built on PR helpers); Module A is the rich screen. */
const { useState, useEffect, useRef } = React;
const PR = window.PR;

// ── tiny helpers ───────────────────────────────────────────────────
const fmtTime = (iso) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
  const t = d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  return `${day} · ${t}`;
};
const outcomePill = (o) => {
  const map = {
    booked: ["ok", "Booked"], message: ["client", "Message taken"],
    "out-of-area": ["warn", "Out of area"], spam: ["", "Spam"],
  };
  const [kind, label] = map[o] || ["", o];
  return <span className={`pill ${kind}`}>{label}</span>;
};
const Money = ({ n }) => <span className="mono">{PR.fmtMoney(n)}</span>;

// ── top bar ────────────────────────────────────────────────────────
function TopBar({ screen, setScreen }) {
  const tabs = [["calls", "Call Inbox"], ["dashboard", "Dashboard"], ["leads", "Leads"]];
  return (
    <div className="topbar wrap" style={{ maxWidth: 1180 }}>
      <div className="brand">Patient<em>ROI</em><span className="dot">.</span></div>
      <span className="demo-tag">MVP1 · synthetic demo</span>
      <div className="tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={`tab ${screen === id ? "on" : ""}`} onClick={() => setScreen(id)}>{label}</button>
        ))}
      </div>
    </div>
  );
}

// ── Module A: Call Inbox ───────────────────────────────────────────
function RecoveredHero({ calls }) {
  const ah = calls.filter(c => c.after_hours && c.outcome === "booked");
  const revenue = ah.reduce((s, c) => { const l = PR.leadById(c.lead_id); return s + (l ? (l.first_visit_revenue || 0) : 0); }, 0);
  const ltv = ah.length * 480;
  return (
    <div className="card" style={{ padding: 20, background: "var(--card-2)", marginTop: 18, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 34, fontFamily: "var(--serif)" }} className="mono">{ah.length}</div>
        <div className="muted" style={{ fontSize: 12 }}>after-hours calls recovered</div>
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
      <div>
        <div style={{ fontSize: 34, fontFamily: "var(--serif)", color: "var(--accent)" }}><Money n={ltv} /></div>
        <div className="muted" style={{ fontSize: 12 }}>est. booked LTV you'd have lost</div>
      </div>
      <div style={{ flex: 1, minWidth: 220, color: "var(--ink-2)", fontSize: 13 }}>
        Every one of these came in <strong>after the front desk had gone home</strong> — the calls Jane never sees,
        because Jane's world starts at <em>“patient.”</em> Ours starts at the missed call.
      </div>
    </div>
  );
}

function CallRow({ call, onOpen }) {
  const ch = PR.channelById(call.channel_id);
  return (
    <div className="card" style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginBottom: 8 }} onClick={() => onOpen(call)}>
      <div style={{ width: 150, flexShrink: 0 }}>
        <div style={{ fontWeight: 600 }}>{call.caller}</div>
        <div className="muted" style={{ fontSize: 12 }}>{call.discipline}</div>
      </div>
      <div style={{ width: 150, flexShrink: 0 }} className="muted">
        <div style={{ fontSize: 12.5 }}>{fmtTime(call.datetime)}</div>
        {call.after_hours && <span className="pill warn" style={{ marginTop: 3 }}><span className="pdot" />after-hours</span>}
      </div>
      <div style={{ flex: 1 }}><span className="pill">{ch ? ch.label : "—"}</span></div>
      <div style={{ flexShrink: 0 }}>{outcomePill(call.outcome)}</div>
    </div>
  );
}

function AttribChain({ lead }) {
  if (!lead) return null;
  const ch = PR.channelById(lead.source_channel_id);
  const bk = lead.booking_id ? PR.bookingById(lead.booking_id) : null;
  const step = (label, val, sub) => (
    <div style={{ textAlign: "center", minWidth: 84 }}>
      <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{val}</div>
      {sub && <div className="muted" style={{ fontSize: 11 }}>{sub}</div>}
    </div>
  );
  const arrow = <div style={{ color: "var(--ink-4)", padding: "0 4px", alignSelf: "center" }}>→</div>;
  return (
    <div style={{ background: "var(--card-2)", border: "1px solid var(--line)", borderRadius: "var(--r-2)", padding: "12px 14px", marginTop: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>the attribution chain</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 6 }}>
        {step("Channel", ch ? ch.platform : "—", ch ? ch.label.split("·")[1] : "")}
        {arrow}
        {step("Lead", lead.name, lead.new_or_returning)}
        {arrow}
        {step("Booking", bk ? "Booked" : "—", bk ? bk.service : "")}
        {arrow}
        {step("Paying", lead.paying ? "Yes" : "—", lead.paying ? PR.fmtMoney(lead.first_visit_revenue) : "trial / pending")}
      </div>
    </div>
  );
}

function CallDetailModal({ call, onClose }) {
  if (!call) return null;
  const lead = PR.leadById(call.lead_id);
  const ch = PR.channelById(call.channel_id);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="modal" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="eyebrow">recovered call · {ch ? ch.label : ""}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginTop: 3 }}>{call.caller}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{fmtTime(call.datetime)} · {Math.round(call.duration_sec / 60)}m {call.duration_sec % 60}s · handled by AI</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{outcomePill(call.outcome)}<button className="btn" onClick={onClose}>✕</button></div>
        </div>
        <div style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
          {call.transcript.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
              <div style={{ flexShrink: 0, width: 52, fontSize: 11, fontWeight: 600, color: t.who === "agent" ? "var(--accent)" : "var(--ink-3)", textTransform: "uppercase", paddingTop: 2 }}>{t.who === "agent" ? "AI" : "Caller"}</div>
              <div style={{ background: t.who === "agent" ? "var(--accent-tint)" : "var(--card-2)", border: "1px solid var(--line)", borderRadius: "var(--r-2)", padding: "8px 11px", fontSize: 13 }}>{t.text}</div>
            </div>
          ))}
        </div>
        {call.outcome === "booked" && <AttribChain lead={lead} />}
      </div>
    </>
  );
}

// the scripted simulator (inbound new-patient, after-hours)
const SIM_SCRIPT = [
  ["sys", "📞 Incoming call · 9:48 PM · after-hours · Meta · Instant Form ad"],
  ["agent", "Thanks for calling Riverbend Health Collective — this call may be recorded to help us book your appointment. How can I help you today?"],
  ["caller", "Hi, I hurt my knee running and saw your ad. Are you guys open?"],
  ["agent", "Sorry to hear about the knee — you're in the right place. We're closed for the night, but I can book you right now. Physio, chiro, or massage?"],
  ["caller", "Physio. First time."],
  ["agent", "Easy. Any extended benefits to direct-bill? We bill Sun Life, Manulife, Canada Life, Blue Cross."],
  ["caller", "Manulife."],
  ["agent", "Perfect, we'll submit that for you. I've got Tuesday at 10:00 or Wednesday at 4:30 — which works?"],
  ["caller", "Wednesday afternoon."],
  ["agent", "Booked Wednesday 4:30. I'll text a confirmation and an intake link. Best name and number?"],
  ["caller", "Jordan, this number's fine."],
  ["agent", "Thanks Jordan — confirmation's on its way. See you Wednesday!"],
];

function SimulateModal({ onClose }) {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef(null);
  useEffect(() => {
    if (shown < SIM_SCRIPT.length) {
      timer.current = setTimeout(() => setShown(s => s + 1), shown === 0 ? 700 : 1100);
    } else { setDone(true); }
    return () => clearTimeout(timer.current);
  }, [shown]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="modal" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="eyebrow">live simulation · the AI front desk</div>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <div style={{ marginTop: 14, minHeight: 220 }}>
          {SIM_SCRIPT.slice(0, shown).map(([who, text], i) => (
            who === "sys"
              ? <div key={i} className="muted" style={{ fontSize: 12, textAlign: "center", margin: "4px 0 12px" }}>{text}</div>
              : <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9 }}>
                  <div style={{ flexShrink: 0, width: 52, fontSize: 11, fontWeight: 600, color: who === "agent" ? "var(--accent)" : "var(--ink-3)", textTransform: "uppercase", paddingTop: 2 }}>{who === "agent" ? "AI" : "Caller"}</div>
                  <div style={{ background: who === "agent" ? "var(--accent-tint)" : "var(--card-2)", border: "1px solid var(--line)", borderRadius: "var(--r-2)", padding: "8px 11px", fontSize: 13 }}>{text}</div>
                </div>
          ))}
          {!done && <div className="muted" style={{ fontSize: 12, paddingLeft: 62 }}>…</div>}
        </div>
        {done && (
          <div className="card" style={{ padding: 14, background: "var(--ok-tint)", border: "1px solid transparent", marginTop: 6 }}>
            <div style={{ fontWeight: 600, color: "var(--ok)" }}>✓ Lead created &amp; source-tagged</div>
            <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4 }}>
              <strong>Jordan</strong> · Physiotherapy · new patient · source <strong>Meta · Instant Form</strong> · booked Wed 4:30 ·
              recording + transcript saved · SMS confirmation sent. The booking is in <em>your</em> pipeline — handed to Jane at check-in.
            </div>
          </div>
        )}
        <div style={{ marginTop: 14, textAlign: "right" }}>
          {!done ? <button className="btn" onClick={() => setShown(SIM_SCRIPT.length)}>Skip to result</button>
                 : <button className="btn primary" onClick={onClose}>Done</button>}
        </div>
      </div>
    </>
  );
}

function CallInbox() {
  const [open, setOpen] = useState(null);
  const [sim, setSim] = useState(false);
  const calls = PR.calls;
  return (
    <div className="wrap" style={{ maxWidth: 1180, paddingTop: 24, paddingBottom: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="eyebrow">Module A · AI voice front desk</div>
          <div className="h1">Calls we <em>recovered</em></div>
          <div className="sub">The missed, after-hours, and overflow calls the AI answered — each one a source-tagged lead Jane would never have captured.</div>
        </div>
        <button className="btn primary" onClick={() => setSim(true)}>▶ Simulate an after-hours call</button>
      </div>
      <RecoveredHero calls={calls} />
      <div style={{ marginTop: 20 }}>
        {calls.map(c => <CallRow key={c.call_id} call={c} onOpen={setOpen} />)}
      </div>
      {open && <CallDetailModal call={open} onClose={() => setOpen(null)} />}
      {sim && <SimulateModal onClose={() => setSim(false)} />}
    </div>
  );
}

// ── Dashboard (simple-but-real, on PR helpers) ─────────────────────
function Dashboard() {
  const f = PR.funnel();
  const ah = PR.afterHoursRecovered();
  const stat = (label, val, sub) => (
    <div className="card" style={{ padding: 16, flex: 1, minWidth: 150 }}>
      <div className="muted" style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 28, fontFamily: "var(--serif)", marginTop: 2 }}>{val}</div>
      {sub && <div className="muted" style={{ fontSize: 11.5 }}>{sub}</div>}
    </div>
  );
  return (
    <div className="wrap" style={{ maxWidth: 1180, paddingTop: 24, paddingBottom: 60 }}>
      <div className="eyebrow">Module C · acquisition dashboard</div>
      <div className="h1">Ad spend → <em>booked patient</em> → revenue</div>
      <div className="sub">The report Jane structurally can't produce: every dollar of ad spend joined to a booked, paying patient — by channel.</div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
        {stat("Leads", f.leads, "this period")}
        {stat("Contacted", f.contacted, `${Math.round(f.contacted / f.leads * 100)}% of leads`)}
        {stat("Booked", f.booked, `${Math.round(f.booked / f.leads * 100)}% of leads`)}
        {stat("Paying", f.paying, "revenue-counted")}
        {stat("After-hours recovered", ah.count, `${PR.fmtMoney(ah.ltvAtRisk)} LTV saved`)}
      </div>

      <div className="card" style={{ marginTop: 18, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", fontWeight: 600 }}>Cost-per-booked-patient &amp; ROAS by channel</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--ink-3)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".05em" }}>
              {["Channel", "Spend", "Leads", "Booked", "Cost / booked", "Revenue", "ROAS"].map(h =>
                <th key={h} style={{ padding: "9px 16px", fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {PR.channels.map(ch => {
              const s = PR.channelStats(ch);
              return (
                <tr key={ch.channel_id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "9px 16px", fontWeight: 500 }}>{ch.label}</td>
                  <td style={{ padding: "9px 16px" }} className="mono">{ch.spend ? PR.fmtMoney(ch.spend) : "—"}</td>
                  <td style={{ padding: "9px 16px" }} className="mono">{s.leads}</td>
                  <td style={{ padding: "9px 16px" }} className="mono">{s.booked}</td>
                  <td style={{ padding: "9px 16px" }} className="mono">{s.cpa != null ? PR.fmtMoney(s.cpa) : "—"}</td>
                  <td style={{ padding: "9px 16px" }} className="mono">{s.revenue ? PR.fmtMoney(s.revenue) : "—"}</td>
                  <td style={{ padding: "9px 16px" }}>{s.roas != null ? <span className={`pill ${s.roas >= 1 ? "ok" : "warn"}`}>{s.roas}×</span> : <span className="muted">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
        Note: synthetic demo data. ROAS here counts first-visit revenue only; the real product adds the deferred-trial monthly fee once <em>paying = true</em>.
      </div>
    </div>
  );
}

// ── Leads (simple table) ───────────────────────────────────────────
function Leads() {
  const statusPill = (s) => {
    const m = { won: "ok", booked: "client", qualified: "accent", contacted: "", new: "", lost: "danger" };
    return <span className={`pill ${m[s] || ""}`}>{s}</span>;
  };
  return (
    <div className="wrap" style={{ maxWidth: 1180, paddingTop: 24, paddingBottom: 60 }}>
      <div className="eyebrow">Module B · pipeline</div>
      <div className="h1">Leads <em>by source</em></div>
      <div className="sub">Every lead carries the channel that produced it — the join Jane has no field for.</div>
      <div className="card" style={{ marginTop: 18, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--ink-3)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".05em" }}>
              {["Lead", "Discipline", "Source", "Status", "Paying"].map(h => <th key={h} style={{ padding: "9px 16px", fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {PR.leads.map(l => {
              const ch = PR.channelById(l.source_channel_id);
              return (
                <tr key={l.lead_id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "9px 16px", fontWeight: 500 }}>{l.name}</td>
                  <td style={{ padding: "9px 16px" }} className="muted">{l.discipline}</td>
                  <td style={{ padding: "9px 16px" }}><span className="pill">{ch ? ch.platform : "—"}</span></td>
                  <td style={{ padding: "9px 16px" }}>{statusPill(l.status)}</td>
                  <td style={{ padding: "9px 16px" }} className="mono">{l.paying ? PR.fmtMoney(l.first_visit_revenue) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("calls");
  return (
    <div>
      <TopBar screen={screen} setScreen={setScreen} />
      {screen === "calls" && <CallInbox />}
      {screen === "dashboard" && <Dashboard />}
      {screen === "leads" && <Leads />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
