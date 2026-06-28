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
  const tabs = [["onboard", "Onboard"], ["today", "Today"], ["calls", "Call Inbox"], ["dashboard", "Dashboard"], ["leads", "Leads"]];
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

// ── Lead detail — the full attribution chain on one screen ─────────
function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;
  const ch = PR.channelById(lead.source_channel_id);
  const call = PR.callForLead(lead.lead_id);
  const bk = lead.booking_id ? PR.bookingById(lead.booking_id) : null;
  const Step = ({ n, title, done, children }) => (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: done ? "var(--accent)" : "var(--card-2)", color: done ? "#fff" : "var(--ink-3)", border: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>{done ? "✓" : n}</div>
        {n < 5 && <div style={{ flex: 1, width: 2, background: "var(--line)" }} />}
      </div>
      <div style={{ paddingBottom: 16, flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
        <div style={{ color: "var(--ink-2)", fontSize: 12.5, marginTop: 2 }}>{children}</div>
      </div>
    </div>
  );
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="modal" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="eyebrow">lead · full attribution chain</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginTop: 3 }}>{lead.name}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{lead.discipline} · {lead.new_or_returning}</div>
          </div>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <div style={{ marginTop: 18 }}>
          <Step n={1} title={`Ad source — ${ch ? ch.label : "—"}`} done>
            {ch && ch.spend ? "Paid channel — this lead's revenue is attributed here." : "Organic / referral — no ad cost."}
          </Step>
          <Step n={2} title={call ? `Call — ${fmtTime(call.datetime)}` : "Web-form lead (no call)"} done={!!call}>
            {call ? `${call.after_hours ? "After-hours — " : ""}AI answered · ${Math.round(call.duration_sec / 60)}m ${call.duration_sec % 60}s · outcome: ${call.outcome}.` : "Captured via web form, source-tagged on arrival."}
          </Step>
          <Step n={3} title="Lead created — in OUR CRM" done>
            Source-tagged the moment it arrived · {fmtTime(lead.created_at)} · status: {lead.status}.
          </Step>
          <Step n={4} title={bk ? `Booking — ${fmtTime(bk.slot_time)}` : "Not booked yet"} done={!!bk}>
            {bk ? `${bk.service} with ${bk.clinician} · handoff to Jane: ${bk.handoff_state}.` : "Still being worked in the pipeline."}
          </Step>
          <Step n={5} title={lead.paying ? "Paying patient ✦" : "Not paying yet"} done={lead.paying}>
            {lead.paying ? `First-visit revenue ${PR.fmtMoney(lead.first_visit_revenue)} — counts toward ${ch ? ch.platform : "this channel"}'s ROAS.` : lead.lost_reason ? `Lost — ${lead.lost_reason}.` : "Revenue counts only once the trial converts to paying."}
          </Step>
        </div>
        <div className="card" style={{ padding: 12, background: "var(--card-2)", marginTop: 4, fontSize: 12.5, color: "var(--ink-2)" }}>
          <strong>What Jane shows:</strong> a patient appeared — no idea which ad, no cost, no ROI. <strong>What we show:</strong> the whole line above, ad dollar → booked, paying patient.
        </div>
      </div>
    </>
  );
}

// ── Leads (table → drill into the chain) ───────────────────────────
function Leads() {
  const [open, setOpen] = useState(null);
  const statusPill = (s) => {
    const m = { won: "ok", booked: "client", qualified: "accent", contacted: "", new: "", lost: "danger" };
    return <span className={`pill ${m[s] || ""}`}>{s}</span>;
  };
  return (
    <div className="wrap" style={{ maxWidth: 1180, paddingTop: 24, paddingBottom: 60 }}>
      <div className="eyebrow">Module B · pipeline</div>
      <div className="h1">Leads <em>by source</em></div>
      <div className="sub">Every lead carries the channel that produced it — the join Jane has no field for. <strong>Click any lead</strong> to see its full ad→revenue chain.</div>
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
                <tr key={l.lead_id} onClick={() => setOpen(l)} style={{ borderTop: "1px solid var(--line)", cursor: "pointer" }}>
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
      {open && <LeadDetailModal lead={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

// ── Onboarding — paste 2 URLs, we build the clinic + its AI front desk ─
const OB_FIELD = { width: "100%", padding: "10px 12px", border: "1px solid var(--line-2)", borderRadius: "var(--r-2)", fontFamily: "var(--sans)", fontSize: 14, background: "var(--card)", color: "var(--ink)" };
function Onboarding({ goTo }) {
  const [phase, setPhase] = useState("input");      // input | scanning | review | data | done
  const [gbp, setGbp] = useState("g.page/riverbend-health");
  const [site, setSite] = useState("riverbendhealth.ca");
  const [step, setStep] = useState(0);
  // the auto-discovered profile (synthetic; real version = Apify GMB/IG/site crawl + LLM)
  const [p, setP] = useState({
    name: "Riverbend Health Collective", city: "Hamilton, ON",
    disciplines: "Physiotherapy · Chiropractic · Massage / RMT",
    hours: "Mon–Fri 8:00–7:00 · Sat 9:00–2:00",
    team: "Dana W. (PT) · Dr. Singh (DC) · Jordan (RMT) +2",
    phone: "(905) 555-0100", insurers: "Sun Life · Manulife · Canada Life · Blue Cross",
    voice: "Warm, unhurried, community-first — patients call you “the calm clinic.”",
  });
  const SCAN = [
    ["Reading your website", site],
    ["Pulling your Google Business Profile", "4.8★ · 142 reviews"],
    ["Scanning Instagram", "@riverbendhealth · 1.2k followers"],
    ["Detecting services, hours & team", "3 disciplines · 5 practitioners"],
    ["Learning your brand voice from reviews", "“warm, never rushed”"],
    ["Configuring your AI receptionist", "insurers, scripts, escalation"],
  ];
  useEffect(() => {
    if (phase !== "scanning") return;
    if (step < SCAN.length) { const t = setTimeout(() => setStep(s => s + 1), 850); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase("review"), 650); return () => clearTimeout(t);
  }, [phase, step]);

  const Field = ({ label, k }) => (
    <div style={{ marginBottom: 12 }}>
      <div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>{label}</div>
      <input style={OB_FIELD} value={p[k]} onChange={e => setP({ ...p, [k]: e.target.value })} />
    </div>
  );

  return (
    <div className="wrap" style={{ maxWidth: 740, paddingTop: 30, paddingBottom: 60 }}>
      <div className="eyebrow">Onboarding · 90 seconds</div>
      <div className="h1">Your front desk, <em>built for you</em></div>
      <div className="sub">Paste two links. We read your website, Google Business Profile, Instagram and reviews — and stand up your AI receptionist, pre-loaded with your services, hours, team and the insurers you bill. Edit anything.</div>

      {phase === "input" && (
        <div className="card" style={{ padding: 22, marginTop: 22 }}>
          <div style={{ marginBottom: 14 }}>
            <div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>Google Business Profile URL</div>
            <input style={OB_FIELD} value={gbp} onChange={e => setGbp(e.target.value)} placeholder="g.page/your-clinic" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>Website URL</div>
            <input style={OB_FIELD} value={site} onChange={e => setSite(e.target.value)} placeholder="yourclinic.ca" />
          </div>
          <button className="btn primary" style={{ width: "100%", padding: 12 }} onClick={() => { setStep(0); setPhase("scanning"); }}>✨ Build my front desk</button>
          <div className="muted" style={{ fontSize: 11.5, textAlign: "center", marginTop: 10 }}>No forms. We pull it all from your public profiles.</div>
        </div>
      )}

      {phase === "scanning" && (
        <div className="card" style={{ padding: 22, marginTop: 22 }}>
          {SCAN.map(([label, detail], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", opacity: i <= step ? 1 : 0.35, borderBottom: i < SCAN.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div style={{ width: 22, height: 22, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, background: i < step ? "var(--accent)" : "var(--card-2)", color: i < step ? "#fff" : "var(--ink-3)", border: "1px solid var(--line-2)" }}>{i < step ? "✓" : i === step ? "◌" : ""}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
                {i <= step && <div className="muted" style={{ fontSize: 12 }}>{detail}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {phase === "review" && (
        <div style={{ marginTop: 22 }}>
          <div className="card" style={{ padding: 14, background: "var(--ok-tint)", border: "1px solid transparent", marginBottom: 14 }}>
            <strong style={{ color: "var(--ok)" }}>✓ Built from your public profiles.</strong> <span style={{ color: "var(--ink-2)", fontSize: 13 }}>Everything below is editable — fix anything we got wrong.</span>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <Field label="Clinic name" k="name" />
            <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 1 }}><Field label="Location" k="city" /></div><div style={{ flex: 1 }}><Field label="Phone" k="phone" /></div></div>
            <Field label="Services / disciplines" k="disciplines" />
            <Field label="Hours" k="hours" />
            <Field label="Team" k="team" />
            <Field label="Insurers we direct-bill (detected)" k="insurers" />
            <Field label="Your brand voice (learned from reviews)" k="voice" />
            <button className="btn primary" style={{ width: "100%", padding: 12, marginTop: 6 }} onClick={() => setPhase("data")}>Looks right →</button>
          </div>
        </div>
      )}

      {phase === "data" && (
        <div style={{ marginTop: 22 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Add your own data <span className="muted" style={{ fontWeight: 400 }}>(optional)</span></div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Upload your patient list and a few past reception calls — your agent learns <em>your</em> clinic's voice and never sounds generic. (PHI stays in your private, Canadian, BAA-covered space.)</div>
            {[["Patient list", "CSV / export from Jane", "📇"], ["Past reception calls", "audio — we de-identify them", "🎧"]].map(([t, s, ic]) => (
              <div key={t} className="card" style={{ padding: 16, marginBottom: 10, background: "var(--card-2)", borderStyle: "dashed", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 22 }}>{ic}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div><div className="muted" style={{ fontSize: 12 }}>{s}</div></div>
                <button className="btn">Upload</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => setPhase("done")}>Skip for now</button>
              <button className="btn primary" style={{ flex: 1 }} onClick={() => setPhase("done")}>Finish setup →</button>
            </div>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="card" style={{ padding: 26, marginTop: 22, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>✅</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, marginTop: 6 }}>Your AI receptionist is live</div>
          <div className="muted" style={{ fontSize: 13, maxWidth: 46 + "ch", margin: "8px auto 0" }}>{p.name} · answering every missed and after-hours call, booking into your pipeline, and tagging each one to the ad that drove it.</div>
          <button className="btn primary" style={{ marginTop: 18, padding: "11px 20px" }} onClick={() => goTo("calls")}>See it answer calls →</button>
        </div>
      )}
    </div>
  );
}

// ── Today — the daily driver ("while you were closed" recap) ───────
function Today({ goTo }) {
  const ah = PR.calls.filter(c => c.after_hours);
  const booked = ah.filter(c => c.outcome === "booked");
  const ahRev = booked.reduce((s, c) => { const l = PR.leadById(c.lead_id); return s + (l ? (l.first_visit_revenue || 0) : 0); }, 0);
  const needs = PR.leads.filter(l => ["qualified", "contacted"].includes(l.status));
  const upcoming = PR.bookings.slice(0, 6);
  const start = needs[0];
  const Big = ({ n, l, accent }) => (
    <div><div style={{ fontSize: 30, fontFamily: "var(--serif)", color: accent ? "var(--accent)" : "var(--ink)" }} className="mono">{n}</div><div className="muted" style={{ fontSize: 12 }}>{l}</div></div>
  );
  return (
    <div className="wrap" style={{ maxWidth: 1180, paddingTop: 24, paddingBottom: 60 }}>
      <div className="eyebrow">good morning · Tuesday, June 28</div>
      <div className="h1">Here's your <em>day</em></div>

      <div className="card" style={{ padding: 20, background: "var(--card-2)", marginTop: 18 }}>
        <div className="eyebrow">while you were closed</div>
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginTop: 8, alignItems: "baseline" }}>
          <Big n={ah.length} l="after-hours calls answered" />
          <Big n={booked.length} l="booked overnight" accent />
          <Big n={PR.fmtMoney(ahRev)} l="first-visit revenue secured" accent />
        </div>
        <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>Every one of these would have gone to voicemail — and to whoever answered first.</div>
      </div>

      {start && (
        <div className="card" style={{ padding: 16, marginTop: 14, borderLeft: "3px solid var(--accent)" }}>
          <div className="eyebrow">start here</div>
          <div style={{ fontWeight: 600, marginTop: 3, fontSize: 15 }}>Call {start.name} back</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{start.discipline} · {start.status === "qualified" ? "on the cancellation list — text them the moment a spot opens" : "warm lead — follow up today"} · came in via {PR.channelById(start.source_channel_id).platform}</div>
          <button className="btn primary" style={{ marginTop: 10 }} onClick={() => goTo("calls")}>Open the call →</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>needs your callback ({needs.length})</div>
          {needs.map(l => {
            const ch = PR.channelById(l.source_channel_id);
            return (
              <div key={l.lead_id} className="card" style={{ padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{l.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{l.discipline} · {ch ? ch.platform : "—"}</div>
                </div>
                <span className={`pill ${l.status === "qualified" ? "accent" : ""}`}>{l.status}</span>
              </div>
            );
          })}
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>upcoming appointments</div>
          {upcoming.map(b => {
            const l = PR.leadById(b.lead_id);
            const d = new Date(b.slot_time);
            return (
              <div key={b.booking_id} className="card" style={{ padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{l ? l.name : "—"} <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>· {b.service}</span></div>
                  <div className="muted" style={{ fontSize: 12 }}>{d.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })} · {d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })} · {b.clinician}</div>
                </div>
                <span className={`pill ${b.handoff_state === "in-emr" ? "ok" : "warn"}`}>{b.handoff_state === "in-emr" ? "in Jane" : "to confirm"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("onboard");
  return (
    <div>
      <TopBar screen={screen} setScreen={setScreen} />
      {screen === "onboard" && <Onboarding goTo={setScreen} />}
      {screen === "today" && <Today goTo={setScreen} />}
      {screen === "calls" && <CallInbox />}
      {screen === "dashboard" && <Dashboard />}
      {screen === "leads" && <Leads />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
