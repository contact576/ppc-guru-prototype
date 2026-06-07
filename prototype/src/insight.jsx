/* Workload + Reports */

function WorkloadScreen({ role }) {
  const { CAPACITY, userMap, ONB_CARDS, ACT_CARDS, ONBOARD_STAGES, ACTIVE_STAGES } = window.PPC;

  // count "open work" per person
  function workFor(id) {
    const all = [
      ...ONB_CARDS.map(c => ({ ...c, kind: "onb" })),
      ...ACT_CARDS.map(c => ({ ...c, kind: "act" }))
    ];
    let n = 0;
    all.forEach(c => {
      const stages = c.kind === "onb" ? ONBOARD_STAGES[c.service] : ACTIVE_STAGES[c.service];
      const st = stages.find(s => s.id === c.stage);
      if (!st) return;
      if (st.type === "designer" && c.designer === id) n++;
      else if (st.type === "team" && (c.override === id || st.owner === id)) n++;
      else if (st.type === "multi" && st.owner.includes(id)) n++;
    });
    return n;
  }

  const team = ["vihar","abhishek","vanshika","harsh","rayu","aadil"];
  const rows = team.map(id => {
    const u = userMap[id];
    const c = CAPACITY[id];
    const cards = workFor(id);
    const pct = (c.hours / c.max) * 100;
    const tone = pct >= 100 ? "danger" : pct >= 85 ? "warn" : "ok";
    return { id, user: u, hours: c.hours, max: c.max, cards, pct, tone };
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Capacity</div>
          <h1 className="page-title">Team <em>Workload</em></h1>
          <div className="page-sub">
            Google clients average ≈8 hrs / month, Meta ≈20 hrs / month. Capacity is ~20–28 new accounts / month for the whole team.
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 14 }}>
        <Stat label="Total team capacity" value="320 hrs/wk" sub="8 people × ~40 hrs" />
        <Stat label="Booked this week" value="233 hrs" delta="73% utilization" deltaDir="up" />
        <Stat label="Headroom" value="87 hrs" sub="≈ 4 new Meta accts" />
      </div>

      <div className="widget" style={{ padding: 0, marginBottom: 14 }}>
        <div className="row" style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
          <span className="section-title" style={{ flex: 1 }}>This week</span>
          <span className="muted" style={{ fontSize: 12.5 }}>Hover a bar for breakdown</span>
        </div>
        <table className="t">
          <thead>
            <tr>
              <th>Person</th>
              <th>Role</th>
              <th>Open work</th>
              <th>Capacity</th>
              <th>Hours</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>
                  <div className="row gap-2">
                    <Avatar user={r.user} />
                    <span style={{ fontWeight: 500 }}>{r.user.name}</span>
                  </div>
                </td>
                <td className="muted">{r.user.role}</td>
                <td className="mono">{r.cards} cards</td>
                <td style={{ width: 280 }}>
                  <div className={`bar ${r.tone}`} style={{ width: 240 }}>
                    <i style={{ width: `${Math.min(100, r.pct)}%` }} />
                  </div>
                </td>
                <td className="mono">{r.hours}/{r.max}h</td>
                <td>
                  {r.tone === "danger" ? <Pill kind="danger" dot>overloaded</Pill>
                    : r.tone === "warn" ? <Pill kind="warn">near cap</Pill>
                    : <Pill kind="ok">has room</Pill>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-2">
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Who can take more</span>
            <span className="widget-action">balance opportunity</span>
          </div>
          <div className="col">
            {rows.filter(r => r.tone === "ok").map(r => (
              <div key={r.id} className="list-row">
                <Avatar user={r.user} />
                <div className="col" style={{ flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.user.name}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>{r.user.role} · {r.max - r.hours} hrs available</span>
                </div>
                <button className="btn sm">Assign work</button>
              </div>
            ))}
          </div>
        </div>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Overloaded</span>
            <span className="widget-action">redistribute</span>
          </div>
          <div className="col">
            {rows.filter(r => r.tone === "danger").map(r => (
              <div key={r.id} className="list-row">
                <Avatar user={r.user} />
                <div className="col" style={{ flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.user.name}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>{r.user.role} · {r.hours - r.max} hrs over</span>
                </div>
                <button className="btn sm accent">Reassign</button>
              </div>
            ))}
            {rows.filter(r => r.tone === "warn").map(r => (
              <div key={r.id} className="list-row">
                <Avatar user={r.user} />
                <div className="col" style={{ flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{r.user.name}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>{r.user.role} · approaching cap</span>
                </div>
                <button className="btn sm">Watch</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsScreen() {
  const reports = [
    { id: "r1", client: "Maritime Realty",        service: "Meta",   period: "Oct 2025", status: "Delivered", date: "Nov 02" },
    { id: "r2", client: "FreshLeaf Cannabis Co.", service: "Meta",   period: "Oct 2025", status: "Delivered", date: "Nov 03" },
    { id: "r3", client: "Mosaic Dental",          service: "Google", period: "Oct 2025", status: "Delivered", date: "Nov 04" },
    { id: "r4", client: "Halcyon Hotels",         service: "Meta",   period: "Oct 2025", status: "Draft",     date: "—" },
    { id: "r5", client: "Solstice Yoga",          service: "SMM",    period: "Oct 2025", status: "Scheduled", date: "Nov 15" }
  ];
  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Branded client reports</div>
          <h1 className="page-title"><em>Reports</em></h1>
          <div className="page-sub">Monthly performance reports — branded, exportable PDF, auto-populated from connected ad accounts.</div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost"><Icon k="doc" />Template</button>
          <button className="btn"><Icon k="plus" />New report</button>
        </div>
      </div>
      <div className="widget" style={{ padding: 0 }}>
        <table className="t">
          <thead>
            <tr><th>Client</th><th>Service</th><th>Period</th><th>Status</th><th>Delivered</th><th></th></tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td><span style={{ fontWeight: 500 }}>{r.client}</span></td>
                <td><Pill kind="outline">{r.service}</Pill></td>
                <td className="muted">{r.period}</td>
                <td>
                  {r.status === "Delivered" ? <Pill kind="ok">{r.status}</Pill>
                    : r.status === "Draft"  ? <Pill kind="warn">{r.status}</Pill>
                    : <Pill kind="client">{r.status}</Pill>}
                </td>
                <td className="muted">{r.date}</td>
                <td><button className="btn sm">Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { WorkloadScreen, ReportsScreen });
