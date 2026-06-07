/* Sidebar nav. Receives current screen + setter + role for filtering. */

const NAV = [
  {
    section: "Operations",
    items: [
      { id: "myday",      label: "My Day",          icon: "spark" },
      { id: "dashboard",  label: "Dashboard",       icon: "home" },
      { id: "assistant",  label: "Assistant",       icon: "sparkle" },
      { id: "scenarios",  label: "Scenarios",       icon: "report" }
    ]
  },
  {
    section: null,
    items: [
      { id: "onboarding", label: "Onboarding",      icon: "bolt"  },
      { id: "active",     label: "Active Clients",  icon: "cycle" },
      { id: "content",    label: "Content Studio",  icon: "calendar" }
    ]
  },
  {
    section: "Workflow",
    items: [
      { id: "tasks",         label: "My Tasks",       icon: "check" },
      { id: "notifications", label: "Notifications",  icon: "bell"  },
      { id: "reviews",       label: "Client Reviews", icon: "star"  }
    ]
  },
  {
    section: "Sales",
    items: [
      { id: "sales-dashboard", label: "Dashboard", icon: "home"    },
      { id: "leads",           label: "Leads",     icon: "user"    },
      { id: "pipeline",        label: "Pipeline",  icon: "funnel"  },
      { id: "sales-trials",    label: "Trials",    icon: "cycle"   },
      { id: "sales-calls",     label: "Calls",     icon: "phone"   },
      { id: "sales-emails",    label: "Emails",    icon: "mail"    },
      { id: "forecast",        label: "Forecast",  icon: "insight" }
    ]
  },
  {
    section: "Platforms",
    items: [
      { id: "meta-platform",   label: "Meta Accounts",   icon: "meta"   },
      { id: "google-platform", label: "Google Accounts", icon: "google" }
    ]
  },
  {
    section: "Insight",
    items: [
      { id: "team-activity", label: "Team Activity", icon: "check"   },
      { id: "workload",      label: "Team Workload", icon: "insight" },
      { id: "reports",       label: "Reports",       icon: "report"  }
    ]
  },
  {
    section: "Owners",
    items: [
      { id: "performance",   label: "Performance",  icon: "spark"  },
      { id: "concentration", label: "Concentration", icon: "funnel" },
      { id: "commission",    label: "Commission",    icon: "star"   }
    ]
  },
  {
    section: "Admin",
    items: [
      { id: "users",    label: "Users & Roles",   icon: "users"   },
      { id: "catalog",  label: "Service Catalog", icon: "catalog" },
      { id: "autorules",label: "Auto-rules",      icon: "bolt"    }
    ]
  }
];

function navCounts() {
  const { ONB_CARDS, ACT_CARDS, NOTIFS, TASKS_EXTRA, REVIEWS, LEADS, CONTENT_PLANS } = window.PPC;
  // count plans not yet scheduled this month or next
  const today = "2026-05", next = "2026-06";
  const contentOpen = (CONTENT_PLANS || []).filter(p => (p.month === today || p.month === next) && !["scheduled","live"].includes(p.status)).length;
  return {
    onboarding: ONB_CARDS.length,
    active: ACT_CARDS.length,
    content: contentOpen,
    tasks: TASKS_EXTRA.filter(t => !t.done).length,
    notifications: NOTIFS.filter(n => !n.read).length,
    reviews: REVIEWS.filter(r => r.health !== "ok").length,
    pipeline: (window.PPC.S5 ? window.PPC.S5.state.deals.filter(d => !d.payingClient && !["s5-lost"].includes(d.stage)).length : 0),
    leads: (window.PPC.S5 ? window.PPC.S5.state.leads.filter(l => !l.dupOf).length : 0),
    "sales-trials": (window.PPC.S5 ? window.PPC.S5.trialsInFlight().length : 0)
  };
}

function Sidebar({ screen, setScreen, role }) {
  const counts = navCounts();
  const access = window.PPC.ROLE_ACCESS[role.id];

  /* Filter nav items based on role */
  const visible = (id) => {
    /* Owner-only screens — Commission / Concentration / Performance / Forecast.
       Strict gating: not visible anywhere except for owners. Sales-scope users
       (Abhishek) can see Forecast since it's their day-job tool. */
    if (id === "commission" || id === "concentration" || id === "performance") {
      return role.id === "jaydeep" || role.id === "dhaval";
    }
    if (id === "forecast") {
      return role.id === "jaydeep" || role.id === "dhaval" || role.id === "abhishek" || role.id === "shrikant";
    }
    /* Team Activity — owners + head of delivery + PM (kept in sync with app.jsx bounce-guard) */
    if (id === "team-activity") {
      return ["jaydeep", "dhaval", "shrikant", "vihar"].includes(role.id);
    }
    if (id === "assistant") return true;          // assistant visible to all roles
    if (id === "myday")     return true;          // My Day visible to all roles
    if (id === "scenarios") return true;          // Scenarios are demo/training—visible to all
    if (access.scope === "designer") {
      // designers see active/onboarding boards, content studio (their queue), tasks, notifications
      return ["onboarding","active","content","tasks","notifications"].includes(id);
    }
    if (access.scope === "sales") {
      return ["onboarding","tasks","notifications","sales-dashboard","leads","pipeline","sales-trials",
              "sales-calls","sales-emails","forecast"].includes(id);
    }
    if (role.id === "vanshika") {
      // Creative Manager — no Google platform; YES content studio (primary tool)
      return id !== "google-platform";
    }
    if (role.id === "harsh") {
      // Ads Manager — no Content Studio (Meta/Google focused)
      return id !== "content";
    }
    return true;
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">P</div>
        <div className="brand-name">PPC <em>Guru</em></div>
      </div>

      {NAV.map((sec, i) => {
        const items = sec.items.filter(it => visible(it.id));
        if (!items.length) return null;
        return (
          <div className="nav-section" key={i}>
            {sec.section && <div className="nav-section-title">{sec.section}</div>}
            {items.map(it => (
              <div
                key={it.id}
                className={`nav-item ${screen === it.id ? "active" : ""}`}
                onClick={() => setScreen(it.id)}
              >
                <Icon k={it.icon} />
                <span>{it.label}</span>
                {counts[it.id] != null && <span className="count">{counts[it.id]}</span>}
              </div>
            ))}
          </div>
        );
      })}

      <div style={{ marginTop: 22, padding: "12px 10px", borderTop: "1px solid var(--line)" }}>
        <div className="label" style={{ marginBottom: 6 }}>This month</div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className="muted" style={{ fontSize: 12.5 }}>MRR</span>
          <span className="mono" style={{ fontSize: 12.5 }}>
            {window.PPC.ROLE_ACCESS[role.id].money ? "$51.4k" : "—"}
          </span>
        </div>
        <div className="row" style={{ justifyContent: "space-between", marginTop: 4 }}>
          <span className="muted" style={{ fontSize: 12.5 }}>Active</span>
          <span className="mono" style={{ fontSize: 12.5 }}>14</span>
        </div>
        <div className="row" style={{ justifyContent: "space-between", marginTop: 4 }}>
          <span className="muted" style={{ fontSize: 12.5 }}>In onboarding</span>
          <span className="mono" style={{ fontSize: 12.5 }}>19</span>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
window.NAV = NAV;
