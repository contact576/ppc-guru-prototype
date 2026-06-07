/* Dashboard — Command Center */

function Dashboard({ role, setScreen }) {
  const { MRR_TREND, ONB_CARDS, ACT_CARDS, LEADS, REVIEWS, META_ACCTS, GOOG_ACCTS, userMap } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];

  const totalMRR = 51420;
  const lastMRR  = MRR_TREND[MRR_TREND.length - 2].mrr;
  const deltaPct = (((totalMRR - lastMRR) / lastMRR) * 100).toFixed(1);

  const stuck = [...ONB_CARDS, ...ACT_CARDS].filter(c => c.days >= 5);
  const designerNeeded = [...ONB_CARDS, ...ACT_CARDS].filter(c =>
    !c.designer && /design|production/i.test(getStage(c)?.name || "") && getStage(c)?.type === "designer"
  );
  const waitingClient = [...ONB_CARDS, ...ACT_CARDS].filter(c => getStage(c)?.type === "client");
  const trialActive = LEADS.filter(l => l.stage === "sa");
  const overdueReviews = REVIEWS.filter(r => r.health === "danger");
  const concentration = REVIEWS.filter(r => r.concentration);

  function getStage(card) {
    const set = card.service === "meta"
      ? (window.PPC.ONBOARD_STAGES.meta.find(s => s.id === card.stage) || window.PPC.ACTIVE_STAGES.meta.find(s => s.id === card.stage))
      : card.service === "google"
        ? window.PPC.ONBOARD_STAGES.google.find(s => s.id === card.stage)
        : (window.PPC.ONBOARD_STAGES.smm.find(s => s.id === card.stage) || window.PPC.ACTIVE_STAGES.smm.find(s => s.id === card.stage));
    return set;
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div>
      {/* Greeting / page head */}
      <div className="page-head" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="page-eyebrow">{today}</div>
          <h1 className="page-title">Good morning, <em>{role.name.split(" ")[0]}.</em></h1>
          <div className="page-sub">
            {access.scope === "all"
              ? "Two cards have been sitting at client approval for over a week. Aadil is overloaded. Three trials end this week."
              : access.scope === "sales"
              ? "Five leads waiting on you. GlobalFinancials is the biggest open deal."
              : "Your queue is in the workflow panel. Maple Lawn & Snow still needs a designer."}
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn ghost"><Icon k="filter" />Last 30 days</button>
          <button className="btn" onClick={() => window.openNewClient?.()}><Icon k="plus" />New client</button>
        </div>
      </div>

      {/* Top KPI row */}
      <div className="grid-4">
        <KPI
          label="Monthly Run-Rate"
          value={access.money ? `$${(totalMRR/1000).toFixed(1)}k` : "Restricted"}
          delta={access.money ? `+${deltaPct}% MoM` : null}
          deltaDir="up"
          spark={MRR_TREND.map(m => m.mrr)}
          color="var(--accent)"
          hidden={!access.money}
        />
        <KPI
          label="Active Clients"
          value="14"
          delta="+2 this month"
          deltaDir="up"
          spark={[8,9,10,11,12,13,14]}
          color="var(--ok)"
        />
        <KPI
          label="In Onboarding"
          value="19"
          delta="6 waiting on client"
          deltaDir=""
          spark={[12,14,16,17,18,18,19]}
          color="var(--client)"
        />
        <KPI
          label="Trial → Paid"
          value="64%"
          delta="Target 60–70%"
          deltaDir="up"
          spark={[55,58,60,62,61,63,64]}
          color="var(--warn)"
        />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginTop: 14 }}>
        {/* Funnel + revenue trend */}
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Funnel — Last 30 days</span>
            <span className="widget-action" onClick={() => setScreen("pipeline")}>Open pipeline →</span>
          </div>
          <Funnel access={access} />
        </div>

        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Revenue Trend</span>
            <span className="widget-action">CAD primary</span>
          </div>
          {access.money ? (
            <>
              <Bars
                data={MRR_TREND.map(m => ({ label: m.m, v: m.mrr }))}
                w={360} h={110}
                color="var(--accent)"
              />
              <div className="row" style={{ marginTop: 8, justifyContent: "space-between" }}>
                <span className="muted" style={{ fontSize: 12.5 }}>Avg client value</span>
                <span className="mono" style={{ fontSize: 12.5 }}>$3,672</span>
              </div>
            </>
          ) : (
            <div className="empty">Revenue is restricted to Owner view</div>
          )}
        </div>
      </div>

      {/* Action lists */}
      <div className="grid-3" style={{ marginTop: 14 }}>
        <ActionList
          title="Stuck — 5+ days in stage"
          tone="danger"
          items={stuck.slice(0, 5).map(c => ({
            id: c.id,
            primary: c.name,
            secondary: `${getStage(c)?.name} · ${c.service.toUpperCase()}`,
            badge: <Pill kind="danger">{c.days}d</Pill>,
            onClick: () => window.openClientPanel?.(c.id)
          }))}
          cta="Open onboarding"
          onCta={() => setScreen("onboarding")}
        />
        <ActionList
          title="Designer needed"
          tone="accent"
          items={designerNeeded.slice(0, 5).map(c => ({
            id: c.id,
            primary: c.name,
            secondary: `${getStage(c)?.name} · ${c.service.toUpperCase()}`,
            badge: <Pill kind="accent">assign</Pill>,
            onClick: () => window.openClientPanel?.(c.id)
          }))}
          cta="Open onboarding"
          onCta={() => setScreen("onboarding")}
        />
        <ActionList
          title="Waiting on client"
          tone="client"
          items={waitingClient.slice(0, 5).map(c => ({
            id: c.id,
            primary: c.name,
            secondary: `${getStage(c)?.name} · ${c.service.toUpperCase()}`,
            badge: <Pill kind="client">{c.days}d</Pill>,
            onClick: () => window.openClientPanel?.(c.id)
          }))}
          cta="Nudge all"
          onCta={() => window.toast("Nudge sent to 5 clients", { icon: "↗" })}
        />
      </div>

      {/* Smart widgets row */}
      <div className="grid-3" style={{ marginTop: 14 }}>
        {/* Trials ending */}
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Trials ending ≤ 5 days</span>
            <span className="widget-action">{trialActive.length} active</span>
          </div>
          <div className="col">
            {trialActive.map(l => {
              const trialEnd = 30 - l.days;
              return (
                <div className="list-row" key={l.id}>
                  <Avatar user={{ name: l.contact, initials: l.contact.split(" ").map(s=>s[0]).join(""), color: "#4E6FAE" }} size="sm" />
                  <div className="col" style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{l.company}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>
                      {l.service.map(s=>s.toUpperCase()).join(" + ")} · day {l.days}/30
                    </span>
                  </div>
                  <Pill kind={trialEnd <= 5 ? "warn" : "outline"}>
                    {trialEnd}d left
                  </Pill>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue concentration risk */}
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Concentration risk</span>
            <span className="widget-action">{access.money ? "Owner only" : "Restricted"}</span>
          </div>
          {access.money ? (
            <div className="col">
              {concentration.map(c => (
                <div className="list-row" key={c.id} style={{ cursor: "pointer" }} onClick={() => window.openClientPanel?.(c.client)}>
                  <div className="col" style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{c.client}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>{c.service.toUpperCase()} · {c.note}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 13.5 }}>
                    {fmtMoney(c.mrr, c.currency, true)}
                  </span>
                </div>
              ))}
              <div className="list-row" style={{ borderTop: "1px solid var(--line-2)", marginTop: 4 }}>
                <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>Top 2 = 32% of MRR</span>
                <Pill kind="warn" dot>monitor</Pill>
              </div>
            </div>
          ) : (
            <div className="empty">Restricted</div>
          )}
        </div>

        {/* Optimization heat */}
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Accounts needing optimization</span>
            <span className="widget-action" onClick={() => setScreen("google-platform")}>Open log →</span>
          </div>
          <div className="col">
            {[...GOOG_ACCTS, ...META_ACCTS]
              .filter(a => a.status !== "ok")
              .slice(0, 4)
              .map(a => (
                <div className="list-row" key={a.id} style={{ cursor: "pointer" }} onClick={() => window.openClientPanel?.(a.client)}>
                  <div className="col" style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{a.client}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>
                      CPA <span className="mono">${a.cpa}</span> · {a.note || "review needed"}
                    </span>
                  </div>
                  <Spark data={a.trend} w={56} h={20} color={a.status === "danger" ? "var(--danger)" : "var(--warn)"} fill={false} />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Team load + 14-day no-activity smart widget */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14, marginTop: 14 }}>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Team capacity now</span>
            <span className="widget-action" onClick={() => setScreen("workload")}>Workload →</span>
          </div>
          <CapacityMini />
        </div>
        <div className="widget">
          <div className="widget-head">
            <span className="widget-title">Smart alerts</span>
            <span className="widget-action">3 new</span>
          </div>
          <div className="col">
            <SmartAlert
              icon="alert" tone="danger"
              text="Northern Lights Auto — no activity in 14 days, CPA up 34%."
              cta="Open account"
              onCta={() => setScreen("meta-platform")}
            />
            <SmartAlert
              icon="clock" tone="warn"
              text="Sundara Immigration sitting at client approval for 7 days — concept may need re-pitch."
              cta="Open card"
              onCta={() => window.openClientPanel?.("Sundara Immigration")}
            />
            <SmartAlert
              icon="bolt" tone="accent"
              text="Aadil at 41/40 hrs this week — reassign new SMM work to Rayu."
              cta="Rebalance"
              onCta={() => setScreen("workload")}
            />
            <SmartAlert
              icon="flag" tone="client"
              text="Krishna Events trial converts in 2 days — send conversion proposal."
              cta="Open lead"
              onCta={() => setScreen("pipeline")}
            />
          </div>
        </div>
      </div>

      {/* SMM content readiness — full-width strip */}
      <div style={{ marginTop: 14 }}>
        <SMMReadinessWidget setScreen={setScreen} />
      </div>
    </div>
  );
}

/* SMM next-month readiness — hard rule of 25th */
function SMMReadinessWidget({ setScreen }) {
  const { CONTENT_PLANS, SMM_QUOTAS, planProgress, planLabel, monthLabel, nextMonth } = window.PPC;
  const TODAY_MONTH = "2026-05";
  const NEXT = nextMonth(TODAY_MONTH);
  const clients = Object.keys(SMM_QUOTAS);
  const rows = clients.map(c => {
    const plan = CONTENT_PLANS.find(p => p.client === c && p.month === NEXT);
    return { client: c, plan, pct: plan ? planProgress(plan) : 0 };
  });
  const scheduledCount = rows.filter(r => r.plan && ["scheduled","live","approved"].includes(r.plan.status)).length;
  const tone = scheduledCount < clients.length ? "danger" : "ok";

  return (
    <div className="widget" style={{ borderColor: tone === "danger" ? "var(--danger)" : "var(--ok)" }}>
      <div className="widget-head">
        <span className="widget-title" style={{ color: tone === "danger" ? "var(--danger)" : "var(--ok)" }}>
          SMM Content — {monthLabel(NEXT)} readiness
        </span>
        <span className="widget-action" onClick={() => setScreen("content")}>Open Studio →</span>
      </div>
      <div className="row" style={{ marginBottom: 12, gap: 16, alignItems: "center" }}>
        <div className="stat" style={{ flex: "0 0 auto" }}>
          <div className="stat-label">Scheduled by day 25</div>
          <div className="stat-value" style={{ color: tone === "danger" ? "var(--danger)" : "var(--ok)" }}>
            {scheduledCount}<span style={{ color: "var(--ink-4)", fontSize: 17 }}>/{clients.length}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {rows.map(r => (
            <div key={r.client} className="row" style={{ gap: 10, padding: "5px 0", borderBottom: "1px dashed var(--line-2)", cursor: "pointer" }}
              onClick={() => setScreen("content")}>
              <span style={{ fontSize: 13.5, fontWeight: 500, width: 170 }}>{r.client}</span>
              <div style={{ flex: 1 }}>
                <div className={`bar ${r.pct === 100 ? "ok" : r.pct >= 50 ? "" : "danger"}`}>
                  <i style={{ width: `${r.pct}%` }} />
                </div>
              </div>
              <span className="mono" style={{ width: 40, fontSize: 12.5, textAlign: "right", color: "var(--ink-3)" }}>{r.pct}%</span>
              <span style={{ width: 140, fontSize: 12.5, color: "var(--ink-3)" }}>
                {r.plan ? planLabel(r.plan.status) : "No plan"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, delta, deltaDir, spark, color, hidden }) {
  return (
    <div className="widget">
      <div className="stat" style={{ position: "relative" }}>
        <div className="stat-label">{label}</div>
        <div className="row" style={{ alignItems: "flex-end", gap: 12 }}>
          <div className="stat-value" style={{ fontSize: 30 }}>{value}</div>
          <div style={{ flex: 1 }} />
          {!hidden && <Spark data={spark} color={color} w={90} h={32} />}
        </div>
        {delta && (
          <div className={`stat-delta ${deltaDir}`}>{deltaDir === "up" ? "▲" : ""} {delta}</div>
        )}
      </div>
    </div>
  );
}

function Funnel({ access }) {
  const stages = [
    { name: "Leads in",          v: 142, color: "#A09689" },
    { name: "Qualified",         v: 94,  color: "#6E665C" },
    { name: "Proposal sent",     v: 41,  color: "#3A332C" },
    { name: "Trial started",     v: 28,  color: "var(--client)" },
    { name: "Paid (converted)",  v: 18,  color: "var(--accent)" }
  ];
  const max = stages[0].v;
  return (
    <div>
      {stages.map((s, i) => {
        const pct = (s.v / max) * 100;
        return (
          <div className="funnel-row" key={i}>
            <div style={{ fontSize: 13.5 }}>{s.name}</div>
            <div className="funnel-bar"><i style={{ width: `${pct}%`, background: s.color }} /></div>
            <div className="mono" style={{ fontSize: 13.5, textAlign: "right" }}>{s.v}</div>
            <div className="muted-2 mono" style={{ fontSize: 12.5, textAlign: "right" }}>
              {i === 0 ? "—" : `${Math.round((s.v / stages[i-1].v) * 100)}%`}
            </div>
          </div>
        );
      })}
      <div className="hr" />
      <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-3)" }}>
        <span>Trial → Paid <span className="mono" style={{ color: "var(--ink)" }}>64%</span></span>
        <span>Cost / Trial <span className="mono" style={{ color: "var(--ink)" }}>$33</span></span>
        <span>Cost / Paid <span className="mono" style={{ color: "var(--ink)" }}>$52</span></span>
        <span>Lead spend <span className="mono" style={{ color: "var(--ink)" }}>{access.money ? "$920/mo" : "—"}</span></span>
      </div>
    </div>
  );
}

function ActionList({ title, tone, items, cta, onCta }) {
  return (
    <div className="widget">
      <div className="widget-head">
        <span className="widget-title">{title}</span>
        <span className="widget-action" onClick={onCta}>{cta} →</span>
      </div>
      <div className="col">
        {items.length === 0 && <div className="empty">All clear.</div>}
        {items.map(it => (
          <div className="list-row" key={it.id} style={{ cursor: it.onClick ? "pointer" : "default" }} onClick={it.onClick}>
            <div className="col" style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.primary}</span>
              <span className="muted" style={{ fontSize: 12.5 }}>{it.secondary}</span>
            </div>
            {it.badge}
          </div>
        ))}
      </div>
    </div>
  );
}

function CapacityMini() {
  const { CAPACITY, userMap } = window.PPC;
  const rows = Object.entries(CAPACITY)
    .filter(([id]) => !["jaydeep","dhaval"].includes(id))
    .map(([id, c]) => ({ user: userMap[id], ...c }));
  return (
    <div className="col gap-2">
      {rows.map(r => {
        const pct = Math.min(120, (r.hours / r.max) * 100);
        const tone = pct >= 100 ? "danger" : pct >= 85 ? "warn" : "ok";
        return (
          <div className="row" key={r.user.id} style={{ gap: 10 }}>
            <Avatar user={r.user} size="sm" />
            <span style={{ fontSize: 12.5, width: 80 }}>{r.user.name.split(" ")[0]}</span>
            <div className={`bar ${tone}`} style={{ flex: 1 }}>
              <i style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            <span className="mono muted" style={{ fontSize: 12.5, width: 50, textAlign: "right" }}>
              {r.hours}/{r.max}h
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SmartAlert({ icon, tone, text, cta, onCta }) {
  const bg = tone === "danger" ? "var(--danger-tint)"
           : tone === "warn"   ? "var(--warn-tint)"
           : tone === "client" ? "var(--client-tint)"
           : "var(--accent-tint)";
  const fg = tone === "danger" ? "var(--danger)"
           : tone === "warn"   ? "var(--warn)"
           : tone === "client" ? "var(--client)"
           : "var(--accent-2)";
  return (
    <div className="list-row">
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: bg, color: fg,
        display: "grid", placeItems: "center"
      }}>
        <Icon k={icon} />
      </div>
      <div style={{ flex: 1, fontSize: 13.5 }}>{text}</div>
      <button className="btn sm ghost" onClick={onCta}>{cta}</button>
    </div>
  );
}

window.Dashboard = Dashboard;
