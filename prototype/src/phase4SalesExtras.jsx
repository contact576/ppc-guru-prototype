/* Phase 4 — Sales Calls + Emails + History panel
 *
 * Companion file to phase4Sales.jsx. Split for size + so style/component
 * boundaries stay clean.
 */

// ============================================================
// SALES — CALLS
// ============================================================

function SalesCallsScreen({ role }) {
  const P = window.PPC;
  const [tab, setTab] = React.useState("all");

  const filtered = P.ZOHO_CALLS.filter(c => {
    if (tab === "all") return true;
    return c.type === tab;
  }).sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Activity</div>
        <h1 className="page-title"><em>Calls</em> logged today</h1>
        <div className="page-sub">
          8 calls touched today — 3 outbound, 4 missed inbound, 1 scheduled.
          Headline metric: <strong>calls made</strong>. Notes here came from Zoho's
          Description field using <span className="mono">||</span> as a separator;
          rendered here as bullets.
        </div>
      </div>

      {/* Counters */}
      <div className="s4-counter-strip mb-3">
        <S4Counter label="Calls today" value={P.callsToday()} sub="May 25"/>
        <S4Counter label="This week" value={P.ZOHO_CALLS.length} sub="rolling 7d"/>
        <S4Counter label="Outbound" value={P.callsByType("out")} sub="dialed by Abhishek"/>
        <S4Counter label="Missed" value={P.callsByType("miss")} sub="inbound" tone="danger"/>
        <S4Counter label="Avg duration" value={P.avgCallDuration()} sub="connected calls"/>
        <S4Counter label="Scheduled" value={P.callsByType("sched")} sub="upcoming"/>
      </div>

      {/* Tabs */}
      <div className="row gap-2 mb-3">
        {[
          ["all", "All", P.ZOHO_CALLS.length],
          ["out", "Outbound", P.callsByType("out")],
          ["miss", "Missed", P.callsByType("miss")],
          ["sched", "Scheduled", P.callsByType("sched")],
        ].map(([id, label, count]) => (
          <button key={id}
                  className={"pill " + (tab === id ? "accent" : "outline")}
                  onClick={() => setTab(id)}
                  style={{cursor: "pointer", fontSize: 12.5, padding: "4px 11px"}}>
            {label} <span className="muted mono" style={{fontSize: 12.5}}>· {count}</span>
          </button>
        ))}
      </div>

      <div className="card">
        <table className="s4-table">
          <thead>
            <tr>
              <th style={{width: 130}}>Type</th>
              <th>Contact</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} onClick={() => s4OpenCallContact(c)}>
                <td><S4CallTypeBadge type={c.type}/></td>
                <td style={{fontWeight: 500}}>{c.contact}</td>
                <td className="mono" style={{fontSize: 12.5}}>{P.salesDayLabel(c.when) + " " + P.salesTimeOnly(c.when)}</td>
                <td className="mono" style={{fontSize: 12.5}}>{c.duration || <span className="muted-2">—</span>}</td>
                <td><S4CallNote note={c.note}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function s4OpenCallContact(c) {
  const P = window.PPC;
  if (!c.contactRef) return;
  if (c.contactRef.startsWith("L") && c.contactRef !== "L-Jagvir") {
    const lead = P.ZOHO_LEADS.find(l => l.id === c.contactRef);
    if (lead) return window.openSalesHistory && window.openSalesHistory({ kind: "lead", record: lead });
  }
  if (c.contactRef.startsWith("D")) {
    const deal = P.ZOHO_DEALS.find(d => d.id === c.contactRef);
    if (deal) return window.openSalesHistory && window.openSalesHistory({ kind: "deal", record: deal });
  }
  if (c.contactRef === "L-Jagvir") {
    const deal = P.ZOHO_DEALS.find(d => d.id === "D03");
    if (deal) return window.openSalesHistory && window.openSalesHistory({ kind: "deal", record: deal });
  }
}

function S4Counter({ label, value, sub, tone }) {
  return (
    <div className="s4-counter-cell">
      <div className="s4-counter-label">{label}</div>
      <div className="s4-counter-value mono" style={{color: tone === "danger" ? "var(--danger)" : "var(--ink)"}}>{value}</div>
      <div className="s4-counter-sub">{sub}</div>
    </div>
  );
}

// ============================================================
// SALES — EMAILS (Gmail / Google Workspace)
// ============================================================

function SalesEmailsScreen({ role }) {
  const P = window.PPC;
  const [tab, setTab] = React.useState("all");

  const filtered = P.ZOHO_EMAILS.filter(e => {
    if (tab === "all") return true;
    if (tab === "sent") return e.direction === "out";
    if (tab === "received") return e.direction === "in";
    if (tab === "needs-response") return e.needsResponse;
    if (tab === "awaiting") return e.awaitingReply;
    return true;
  }).sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());

  return (
    <div>
      <div className="page-head">
        <div className="page-eyebrow">Sales · Inbox</div>
        <h1 className="page-title"><em>Emails</em> · Gmail touch-base</h1>
        <div className="page-sub">
          Real-time view of Abhishek's sales correspondence in Google Workspace.
          Reply rate, response speed, and threads needing attention — all rolled into
          the broader <strong>Communication</strong> tally with calls + WhatsApp on
          Sales Home.
        </div>
      </div>

      {/* Workspace banner */}
      <div className="s4-banner info mb-3">
        <Icon k="mail"/>
        <div style={{flex: 1}}>
          <strong>Google Workspace · pending integration.</strong> Once Gmail is wired up
          (OAuth + thread sync), this view auto-fills from {role.id === "abhishek" ? "Abhishek's" : "your"} inbox in real time.
          Threads below are sample data.
        </div>
        <button className="pill accent" style={{cursor: "pointer", padding: "4px 10px"}}>
          <Icon k="bolt" style={{width: 11, height: 11}}/> Connect Google Workspace
        </button>
      </div>

      {/* Counter strip */}
      <div className="s4-counter-strip mb-3">
        <S4Counter label="Touched today" value={P.emailsToday()} sub="threads"/>
        <S4Counter label="Sent today" value={P.emailsSent("today")} sub={`${P.emailsSent()} all-time`}/>
        <S4Counter label="Received today" value={P.emailsReceived("today")} sub={`${P.emailsReceived()} all-time`}/>
        <S4Counter label="Needs reply" value={P.emailsNeedingResponse()} sub="from client" tone="danger"/>
        <S4Counter label="Awaiting reply" value={P.emailsAwaitingClient()} sub="from client"/>
        <S4Counter label="Response rate" value={(P.responseRate() ?? 0) + "%"} sub={`${P.totalEmailMessages()} total msgs`}/>
      </div>

      {/* Tabs */}
      <div className="row gap-2 mb-3" style={{flexWrap: "wrap"}}>
        {[
          ["all",            "All",             P.ZOHO_EMAILS.length],
          ["sent",           "Sent",            P.ZOHO_EMAILS.filter(e => e.direction === "out").length],
          ["received",       "Received",        P.ZOHO_EMAILS.filter(e => e.direction === "in").length],
          ["needs-response", "Needs reply",     P.ZOHO_EMAILS.filter(e => e.needsResponse).length],
          ["awaiting",       "Awaiting reply",  P.ZOHO_EMAILS.filter(e => e.awaitingReply).length],
        ].map(([id, label, count]) => (
          <button key={id}
                  className={"pill " + (tab === id ? "accent" : "outline")}
                  onClick={() => setTab(id)}
                  style={{cursor: "pointer", fontSize: 12.5, padding: "4px 11px"}}>
            {label} <span className="muted mono" style={{fontSize: 12.5}}>· {count}</span>
          </button>
        ))}
        <button className="pill outline right" style={{marginLeft: "auto", cursor: "pointer", padding: "4px 11px"}}
                onClick={() => window.openEmailCompose && window.openEmailCompose({ who: role })}>
          <Icon k="plus" style={{width: 11, height: 11}}/> Compose
        </button>
      </div>

      {/* Email list */}
      <div className="card" style={{padding: 0}}>
        {filtered.map(e => (
          <S4EmailRow key={e.id} email={e}/>
        ))}
        {filtered.length === 0 && (
          <div style={{padding: "30px 16px", textAlign: "center", color: "var(--ink-3)", fontStyle: "italic", fontSize: 13.5}}>
            No emails match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function S4EmailRow({ email }) {
  const P = window.PPC;
  const unread = email.status === "unread";
  const dirIcon = email.direction === "out" ? "send" : "inbox";

  const openHistory = () => {
    if (!email.contactRef) return;
    if (email.contactRef.startsWith("D")) {
      const deal = P.ZOHO_DEALS.find(d => d.id === email.contactRef);
      if (deal) return window.openSalesHistory && window.openSalesHistory({ kind: "deal", record: deal });
    }
    if (email.contactRef === "L-Jagvir") {
      const deal = P.ZOHO_DEALS.find(d => d.id === "D03");
      if (deal) return window.openSalesHistory && window.openSalesHistory({ kind: "deal", record: deal });
    }
    if (email.contactRef.startsWith("L")) {
      const lead = P.ZOHO_LEADS.find(l => l.id === email.contactRef);
      if (lead) return window.openSalesHistory && window.openSalesHistory({ kind: "lead", record: lead });
    }
  };

  return (
    <div className={"s4-email-row" + (unread ? " unread" : "")} onClick={openHistory}>
      <div className="s4-email-side">
        <span className={"s4-email-dir " + (email.direction === "out" ? "out" : "in")}>
          <Icon k={dirIcon}/>
        </span>
      </div>
      <div className="s4-email-main">
        <div className="row" style={{gap: 8, alignItems: "baseline"}}>
          <span style={{fontWeight: unread ? 600 : 500, fontSize: 13.5}}>{email.contact}</span>
          <span className="muted" style={{fontSize: 12.5}}>·</span>
          <span className="muted" style={{fontSize: 12.5}}>
            {email.direction === "out" ? "to " : "from "}{email.direction === "out" ? email.to : email.from}
          </span>
        </div>
        <div className={"s4-email-subject" + (unread ? " unread" : "")}>{email.subject}</div>
        <div className="s4-email-snippet">{email.snippet}</div>
        <div className="row" style={{gap: 6, flexWrap: "wrap", marginTop: 6}}>
          {(email.labels || []).map(l => (
            <span key={l} className="pill outline" style={{fontSize: 11.5, padding: "1px 7px"}}>{l}</span>
          ))}
          {email.needsResponse && <span className="pill danger" style={{fontSize: 11.5, padding: "1px 7px"}}><span className="dot"/>needs reply</span>}
          {email.awaitingReply && !email.needsResponse && <span className="pill warn" style={{fontSize: 11.5, padding: "1px 7px"}}><span className="dot"/>awaiting client</span>}
          {email.replyCount > 1 && <span className="pill outline" style={{fontSize: 11.5, padding: "1px 7px"}}>{email.replyCount} msgs</span>}
        </div>
      </div>
      <div className="s4-email-time mono">
        {P.salesDayLabel(email.when)}<br/>
        <span className="muted" style={{fontSize: 12.5}}>{P.salesTimeOnly(email.when)}</span>
      </div>
    </div>
  );
}

// ============================================================
// SALES — HISTORY SLIDE-OVER (calls + WA + EMAILS + meetings + stages)
// ============================================================

function SalesHistoryPanel({ open, onClose }) {
  if (!open) return null;
  const P = window.PPC;
  const { kind, record } = open;

  // Resolve history bucket
  let items = [];
  if (kind === "lead") {
    if (record.id === "L02") items = [...P.ZOHO_HISTORIES["L02"]];
    else if (record.name === "Jagvir Baath") items = [...P.ZOHO_HISTORIES["L-Jagvir"]];
    else items = P.fallbackHistory(record, "lead");
  } else {
    if (record.id === "D03") items = [...P.ZOHO_HISTORIES["L-Jagvir"]];
    else if (record.id === "D04") items = [...P.ZOHO_HISTORIES["D04"]];
    else items = P.fallbackHistory(record, "deal");
  }

  // Splice in any emails matching this contact (not already in the history bucket)
  const contactRefs = kind === "lead"
    ? [record.id, record.name === "Jagvir Baath" ? "L-Jagvir" : null]
    : [record.id, record.id === "D03" ? "L-Jagvir" : null];
  P.ZOHO_EMAILS.forEach(e => {
    if (!contactRefs.includes(e.contactRef)) return;
    const already = items.some(it =>
      (it.kind === "email-out" || it.kind === "email-in") &&
      it.title === (e.direction === "in" ? e.subject : "Re: " + e.subject.replace(/^Re:\s*/i, ""))
    );
    if (!already) {
      items.push({
        kind: e.direction === "out" ? "email-out" : "email-in",
        when: e.when,
        title: (e.direction === "out" ? "" : "") + e.subject,
        body: e.snippet + (e.replyCount > 1 ? ` (${e.replyCount} messages in thread.)` : ""),
        needsResponse: e.needsResponse,
        awaitingReply: e.awaitingReply,
      });
    }
  });

  // Sort newest first
  items.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());

  const isLead = kind === "lead";
  const title = isLead ? record.name : record.company;
  const subtitle = isLead ? record.company : record.contact;
  const phone = isLead ? record.phone : null;
  const province = isLead ? record.province : null;
  const outOfArea = isLead ? record.outOfArea : false;
  const source = record.source;
  const sourceMissing = record.sourceMissing;
  const stageOrStatus = isLead ? record.status : P.zohoStageName(record.stage);

  return (
    <React.Fragment>
      <div className="panel-scrim" onClick={onClose}/>
      <aside className="side-panel open" role="dialog" aria-label="Sales history" style={{width: 560}}>
        <div className="side-panel-head" style={{padding: "18px 20px 16px", alignItems: "flex-start"}}>
          <div style={{flex: 1, minWidth: 0}}>
            <div className="page-eyebrow">{isLead ? "Lead · history" : "Deal · history"}</div>
            <h2 className="serif" style={{fontSize: 22, fontWeight: 500, margin: "4px 0 0", color: "var(--ink)"}}>{title}</h2>
            {subtitle ? <div className="muted" style={{fontSize: 12.5, marginTop: 4}}>{subtitle}</div> : null}
            <div className="row" style={{gap: 6, marginTop: 10, flexWrap: "wrap"}}>
              {phone ? <span className="pill outline mono" style={{fontSize: 12.5}}>{phone}</span> : null}
              {province ? <S4ProvincePill province={province} outOfArea={outOfArea}/> : null}
              {isLead
                ? <S4StatusPill status={stageOrStatus}/>
                : <span className="pill outline">{stageOrStatus}</span>}
              {sourceMissing
                ? <span className="pill warn"><span className="dot"/>no source</span>
                : source ? <span className="pill outline" style={{fontSize: 12.5}}>{source}</span> : null}
              {!isLead ? (
                record.monthlyFee
                  ? <span className="pill accent mono"><span className="dot"/>${record.monthlyFee.toLocaleString()}/mo</span>
                  : <span className="pill warn"><span className="dot"/>fee not set ($375–$2,400/mo)</span>
              ) : null}
            </div>
          </div>
          <button className="pill outline" onClick={onClose} aria-label="Close"
                  style={{cursor: "pointer", marginLeft: 12, padding: "4px 10px"}}>
            <Icon k="close" style={{width: 12, height: 12}}/>
          </button>
        </div>

        <div className="side-panel-body" style={{padding: "18px 20px 40px"}}>
          {/* Action row */}
          <div className="row" style={{gap: 6, marginBottom: 14, flexWrap: "wrap"}}>
            <button className="pill outline" style={{cursor: "pointer", padding: "4px 10px"}}>
              <Icon k="phone" style={{width: 11, height: 11}}/> Call now
            </button>
            <button className="pill outline" style={{cursor: "pointer", padding: "4px 10px"}}>
              <Icon k="whatsapp" style={{width: 11, height: 11}}/> WhatsApp
            </button>
            <button className="pill outline" style={{cursor: "pointer", padding: "4px 10px"}}
                    onClick={() => window.openEmailCompose && window.openEmailCompose({ client: title, who: window.PPC.USERS.find(u => u.id === "abhishek") })}>
              <Icon k="mail" style={{width: 11, height: 11}}/> Compose email
            </button>
            <button className="pill outline" style={{cursor: "pointer", padding: "4px 10px"}}>
              <Icon k="calendar" style={{width: 11, height: 11}}/> Schedule
            </button>
            <button className="pill outline" style={{cursor: "pointer", padding: "4px 10px"}}>
              <Icon k="pencil" style={{width: 11, height: 11}}/> Edit
            </button>
          </div>

          {outOfArea ? (
            <div className="s4-banner danger mb-3">
              <Icon k="alert"/>
              <div>
                <strong>Out of service area.</strong> Phone area code suggests {province}.
                We only operate in Ontario — flag as Not Qualified instead of dialing.
              </div>
            </div>
          ) : null}

          {!isLead && record.feeNeedsSet ? (
            <div className="s4-banner warn mb-3">
              <Icon k="alert"/>
              <div>
                <strong>Set the real monthly fee.</strong> Currently showing Zoho's
                $8,000 placeholder. Range $375–$2,400/mo. Cannot advance past
                Meeting Completed until this is fixed.
              </div>
            </div>
          ) : null}

          <div className="s4-eyebrow mb-2">Timeline · newest first</div>
          <div>
            {items.length === 0 ? (
              <div className="muted" style={{padding: "20px 0", fontStyle: "italic", fontSize: 13.5}}>
                No history yet. Anything that happens — calls, WhatsApp, emails,
                meetings, stage changes — will appear here in order.
              </div>
            ) : items.map((it, i) => <S4TimelineItem key={i} item={it}/>)}
          </div>

          <div className="s4-banner info mt-4">
            <Icon k="whatsapp"/>
            <div>
              <strong>WhatsApp · Coexistence pending.</strong> The threads above are sample.
              Once the WhatsApp pipe is connected, real messages auto-sync into this
              timeline alongside calls + emails.
            </div>
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
}

function S4TimelineItem({ item }) {
  const P = window.PPC;
  const map = {
    "call-out":   { cls: "call",  ic: "phoneOut",  kind: "Outbound call" },
    "call-in":    { cls: "call",  ic: "phoneIn",   kind: "Inbound call" },
    "call-miss":  { cls: "miss",  ic: "phoneMiss", kind: "Missed call" },
    "call-sched": { cls: "sched", ic: "calendar",  kind: "Scheduled call" },
    "wa-thread":  { cls: "wa",    ic: "whatsapp",  kind: "WhatsApp" },
    "stage":      { cls: "stage", ic: "arrow",     kind: "Stage" },
    "meet":       { cls: "meet",  ic: "users",     kind: "Meeting" },
    "email-out":  { cls: "email-out", ic: "send",  kind: "Email · sent" },
    "email-in":   { cls: "email-in",  ic: "inbox", kind: "Email · received" },
  };
  const m = map[item.kind] || { cls: "stage", ic: "clock", kind: "Event" };

  return (
    <div className="s4-tl-item">
      <div className={"s4-tl-icon " + m.cls}><Icon k={m.ic}/></div>
      <div style={{flex: 1, minWidth: 0}}>
        <div className="row" style={{gap: 8, alignItems: "center", flexWrap: "wrap"}}>
          <span className="s4-tl-kind">{item.title || m.kind}</span>
          <span className="s4-tl-time">{P.salesDayLabel(item.when)} · {P.salesTimeOnly(item.when)}</span>
          {item.kind === "wa-thread" || item.sample ? (
            <span className="pill s4-sample" style={{fontSize: 11.5, padding: "1px 7px"}}>
              <span className="dot"/>sample
            </span>
          ) : null}
          {item.needsResponse ? <span className="pill danger" style={{fontSize: 11.5, padding: "1px 7px"}}><span className="dot"/>needs reply</span> : null}
          {item.awaitingReply && !item.needsResponse ? <span className="pill warn" style={{fontSize: 11.5, padding: "1px 7px"}}><span className="dot"/>awaiting</span> : null}
        </div>
        {item.body ? <div className="s4-tl-body">{item.body}</div> : null}
        {item.kind === "wa-thread" && item.bubbles ? (
          <div className="s4-wa-thread">
            {item.bubbles.map((b, i) => (
              <div key={i} className={"s4-wa-bubble" + (b.dir === "out" ? " out" : "")}>
                <div>{b.text}</div>
                <div className="s4-wa-time">{b.time}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

Object.assign(window, {
  SalesCallsScreen, SalesEmailsScreen, SalesHistoryPanel,
  S4EmailRow, S4Counter,
});
