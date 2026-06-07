/* Main App — wires sidebar + topbar + role switcher + screen router */

function App() {
  const [screen, setScreen]   = React.useState("myday");
  const [roleId, setRoleId]   = React.useState("jaydeep");
  const [roleOpen, setRoleOpen] = React.useState(false);
  const role = window.PPC.userMap[roleId];

  // Global panel state — opened from anywhere in the app
  const [clientPanelId, setClientPanelId] = React.useState(null);
  const [taskPanelId, setTaskPanelId]     = React.useState(null);
  const [newTaskState, setNewTaskState]   = React.useState({ open: false, defaults: null });
  const [newClientOpen, setNewClientOpen] = React.useState(false);
  const [salesHistory, setSalesHistory]   = React.useState(null);
  const [leadPanelId, setLeadPanelId]     = React.useState(null);
  const [dealPanelId, setDealPanelId]     = React.useState(null);

  // Resolve the in-focus client name for the AI assistant
  const focusClientName = React.useMemo(() => {
    if (!clientPanelId) return null;
    const card = [...window.PPC.ONB_CARDS, ...window.PPC.ACT_CARDS].find(c => c.id === clientPanelId);
    if (card) return card.name;
    if (typeof clientPanelId === "string" && window.PPC.store.profiles[clientPanelId]) return clientPanelId;
    return clientPanelId;
  }, [clientPanelId]);

  // Platform focus (Meta / Google)
  const focusPlatform = screen === "meta-platform" ? "meta" : screen === "google-platform" ? "google" : null;

  // Expose openers globally so any card/list anywhere can trigger them
  React.useEffect(() => {
    window.openClientPanel = (idOrName) => setClientPanelId(idOrName);
    window.__closeClientPanel = () => setClientPanelId(null);
    window.openTaskPanel = (id) => setTaskPanelId(id);
    window.openNewTask = (defaults) => setNewTaskState({ open: true, defaults: defaults || {} });
    window.openNewClient = () => setNewClientOpen(true);
    window.openSalesHistory = (h) => setSalesHistory(h);
    window.__closeSalesHistory = () => setSalesHistory(null);
    window.openLeadPanel = (id) => setLeadPanelId(id);
    window.openDealPanel = (id) => setDealPanelId(id);
    // Esc closes any open panel/modal
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (newClientOpen) setNewClientOpen(false);
      else if (newTaskState.open) setNewTaskState({ open: false, defaults: null });
      else if (taskPanelId) setTaskPanelId(null);
      else if (dealPanelId) setDealPanelId(null);
      else if (leadPanelId) setLeadPanelId(null);
      else if (salesHistory) setSalesHistory(null);
      else if (clientPanelId) setClientPanelId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [clientPanelId, taskPanelId, newTaskState.open, newClientOpen, leadPanelId, dealPanelId, salesHistory]);

  // close role popover on outside click
  React.useEffect(() => {
    const onDown = (e) => {
      if (!e.target.closest(".role-switcher")) setRoleOpen(false);
    };
    if (roleOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [roleOpen]);

  // when a designer is selected, force to a board they can see
  React.useEffect(() => {
    const access = window.PPC.ROLE_ACCESS[roleId];
    if (access.scope === "designer" && !["tasks","notifications","active","onboarding","assistant","myday"].includes(screen)) setScreen("myday");
    if (access.scope === "sales" && !["sales-dashboard","pipeline","leads","sales-trials","forecast","tasks","notifications","onboarding","assistant","myday","sales-calls","sales-emails"].includes(screen)) setScreen("myday");
    /* Owner-only screens — if a non-owner is on one, bounce to My Day */
    if (!["jaydeep","dhaval"].includes(roleId) && ["commission","concentration","performance"].includes(screen)) setScreen("myday");
    /* Team Activity — owners + head of delivery + PM only */
    if (!["jaydeep","dhaval","shrikant","vihar"].includes(roleId) && screen === "team-activity") setScreen("myday");
    if (roleId === "vanshika" && screen === "google-platform") setScreen("meta-platform");
  }, [roleId]);

  const breadcrumb = () => {
    const item = window.NAV.flatMap(s => s.items).find(i => i.id === screen);
    return item?.label || "";
  };

  // route
  const renderScreen = () => {
    switch (screen) {
      case "dashboard":        return <Dashboard role={role} setScreen={setScreen} />;
      case "myday":            return <MyDayScreen role={role} setScreen={setScreen} />;
      case "scenarios":        return <ScenariosScreen role={role} />;
      case "autorules":        return <AutoRulesScreen role={role} />;
      case "assistant":        return <AssistantScreen />;
      case "onboarding":       return <BoardScreen mode="onboarding" role={role} setScreen={setScreen} />;
      case "active":           return <BoardScreen mode="active"     role={role} setScreen={setScreen} />;
      case "content":          return <ContentStudioScreen role={role} />;
      case "tasks":            return <TasksWorkspace role={role} setScreen={setScreen} />;
      case "notifications":    return <NotificationsScreen role={role} />;
      case "reviews":          return <ReviewsScreen role={role} />;
      case "pipeline":         return <SalesPipelineLiveScreen role={role} />;
      case "leads":            return <SalesLeadsLiveScreen role={role} />;
      case "sales-dashboard":  return <SalesDashboardScreen role={role} setScreen={setScreen} />;
      case "sales-trials":     return <SalesTrialsScreen role={role} />;
      case "leads-live":       return <SalesLeadsLiveScreen role={role} />;
      case "sales-home":       return <SalesHomeScreen role={role} setScreen={setScreen} />;
      case "sales-calls":      return <SalesCallsLiveScreen role={role} />;
      case "sales-emails":     return <SalesEmailsScreen role={role} />;
      case "meta-platform":    return <PlatformScreen which="meta"   role={role} setScreen={setScreen} />;
      case "google-platform":  return <PlatformScreen which="google" role={role} setScreen={setScreen} />;
      case "team-activity":    return <TeamActivityScreen role={role} />;
      case "workload":         return <WorkloadScreen role={role} />;
      case "reports":          return <ReportsScreen />;
      case "forecast":         return <ForecastScreen role={role} />;
      case "performance":      return <PerformanceScreen role={role} />;
      case "concentration":    return <ConcentrationScreen role={role} />;
      case "commission":       return <CommissionScreen role={role} />;
      case "users":            return <UsersScreen />;
      case "catalog":          return <CatalogScreen />;
      default:                 return <Dashboard role={role} setScreen={setScreen} />;
    }
  };

  return (
    <AssistantProvider role={role} screen={screen} focusClient={focusClientName} focusPlatform={focusPlatform}>
    <div className="app">
      <Sidebar screen={screen} setScreen={setScreen} role={role} />
      <div className="main">
        <div className="topbar">
          <div className="breadcrumb">
            <span className="muted">PPC Guru</span>
            <span className="muted">›</span>
            <span className="crumb-main">{breadcrumb()}</span>
          </div>
          <div className="topbar-search">
            <Icon k="search" className="ic sm" />
            <input placeholder="Search clients, leads, tasks, stages..." />
            <span className="kbd">⌘ K</span>
          </div>
          <div className="topbar-right">
            <button className="btn ghost" onClick={() => setScreen("notifications")} title="Notifications">
              <Icon k="bell" />
              <span className="pill accent" style={{ padding: "0 5px", fontSize: 11.5 }}>
                {window.PPC.NOTIFS.filter(n => !n.read && (n.to === roleId || ["jaydeep","dhaval","vihar"].includes(roleId))).length}
              </span>
            </button>
            <div className="role-switcher">
              <button className="role-btn" onClick={() => setRoleOpen(o => !o)}>
                <Avatar user={role} />
                <div className="col" style={{ alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12.5, lineHeight: 1.1 }}>{role.name.split(" ")[0]}</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-4)", lineHeight: 1 }}>{role.role}</span>
                </div>
                <Icon k="chevDown" className="ic sm" />
              </button>
              {roleOpen && (
                <div className="role-pop">
                  <div className="label" style={{ padding: "6px 8px" }}>Preview as</div>
                  {window.PPC.USERS.filter(u => u.id !== "client").map(u => (
                    <div key={u.id} className="role-opt"
                      onClick={() => { setRoleId(u.id); setRoleOpen(false); }}>
                      <Avatar user={u} />
                      <div className="col" style={{ flex: 1 }}>
                        <span className="role-name">{u.name}</span>
                        <span style={{ fontSize: 12.5, color: "var(--ink-4)" }}>{u.role}</span>
                      </div>
                      {u.id === roleId && <Icon k="check" className="ic sm" style={{ color: "var(--accent)" }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="content">
          {renderScreen()}
        </div>
      </div>
      <ToastHost />

      {/* Global panels — mounted at app level so any screen can open them */}
      <ClientProfilePanel
        idOrName={clientPanelId}
        role={role}
        onClose={() => setClientPanelId(null)}
      />
      <TaskDetailPanel
        taskId={taskPanelId}
        role={role}
        onClose={() => setTaskPanelId(null)}
      />
      <NewTaskModal
        open={newTaskState.open}
        defaults={newTaskState.defaults}
        role={role}
        onClose={() => setNewTaskState({ open: false, defaults: null })}
      />
      <NewClientModal
        open={newClientOpen}
        role={role}
        onClose={() => setNewClientOpen(false)}
      />
      <AssistantBubble />
      <AssistantPanel />
      <EmailComposer />
      <SalesHistoryPanel open={salesHistory} onClose={() => setSalesHistory(null)} />
      <LeadDetailPanel leadId={leadPanelId} role={role} onClose={() => setLeadPanelId(null)} />
      <DealDetailPanel dealId={dealPanelId} role={role} onClose={() => setDealPanelId(null)} />
    </div>
    </AssistantProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
