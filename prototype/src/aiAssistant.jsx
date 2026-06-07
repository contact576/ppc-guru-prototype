/* PPC Guru — AI Assistant
   ─────────────────────────────────────────────────────────────
   Claude-powered. Three surfaces, one engine:
     • Floating bubble (bottom-right) — opens slide-in panel
     • Slide-in panel (right rail)    — quick chat with context
     • Full-page screen               — chat + "what I know" sidebar

   Context-aware: when a client profile is in focus, the model knows
   which one. When on a Platforms screen, it knows which platform.
   Always knows: today's date, the current user/role, and a compact
   serialization of clients/tasks/risks/pipeline scoped to relevance.
*/

/* ─── Suggested prompts ─────────────────────────────────────── */
const AI_SUGGESTIONS = {
  morning: [
    { ic: "spark",    label: "Brief me for today — what should I tackle first?" },
    { ic: "alert",    label: "What are the biggest risks across the book right now?" },
    { ic: "trend",    label: "Where are we behind pace this month?" },
    { ic: "report",   label: "Summarize my open tasks and stuck cards" }
  ],
  client: [
    { ic: "report",   label: "Summarize this client's last 30 days" },
    { ic: "doc",      label: "Draft a status email to the client" },
    { ic: "arrow",    label: "What should the next action be?" },
    { ic: "alert",    label: "Flag any risks I should know about" }
  ],
  meta: [
    { ic: "alert",    label: "Which Meta accounts are over/under pacing today?" },
    { ic: "refresh",  label: "Who needs a creative refresh in the next 10 days?" },
    { ic: "doc",      label: "Draft this week's optimization plan" },
    { ic: "trend",    label: "Compare CPA across active accounts" }
  ],
  google: [
    { ic: "clock",    label: "Which Google accounts haven't been touched in 10+ days?" },
    { ic: "spark",    label: "Suggest next 3 optimizations across the book" },
    { ic: "alert",    label: "Find accounts with broken conversion tracking" },
    { ic: "report",   label: "Summarize this month's optimization log" }
  ],
  sales: [
    { ic: "funnel",   label: "What's stuck in the pipeline this week?" },
    { ic: "doc",      label: "Draft a follow-up email to GlobalFinancials" },
    { ic: "trend",    label: "Forecast: which trials are likely to convert?" },
    { ic: "arrow",    label: "Where should I focus first today?" }
  ],
  designer: [
    { ic: "report",   label: "What's queued for me this week?" },
    { ic: "spark",    label: "Anything I can pull ahead from next month?" },
    { ic: "arrow",    label: "Which deliverable should I start next?" }
  ]
};

/* ─── Context serializer ────────────────────────────────────── */

function pad(s) { return (s || "").trim(); }

function describeUser(u) {
  if (!u) return "—";
  return `${u.name.split(" ")[0]} (${u.role})`;
}

function compactClientLine(name, p) {
  const { userMap, profileMRR, getDerivedStatus, SERVICE_INFO } = window.PPC;
  if (!p) return `- ${name}`;
  const services = Object.keys(p.serviceContracts || {});
  const parts = services.map(s => {
    const c = p.serviceContracts[s];
    const fee = c.monthlyFee ? `${c.currency || "CAD"}$${c.monthlyFee}` : "?";
    return `${SERVICE_INFO[s]?.short || s}:${c.status}@${fee}`;
  });
  const owners = p.owners || {};
  const own = `AM:${userMap[owners.am]?.name.split(" ")[0] || "?"} Ads:${userMap[owners.ads]?.name.split(" ")[0] || "—"} Cr:${userMap[owners.creative]?.name.split(" ")[0] || "—"}`;
  return `- ${name} | ${p.niche} | ${parts.join(" + ")} | ${own}`;
}

function risksSummary() {
  const { TODAY, OPT_LOG, REVIEWS, NOTIFS, store, daysBetween, creativeRefreshState, PROFILES_RICH, ACT_CARDS } = window.PPC;
  const risks = [];

  /* Stale optimizations (>10 days) — per account */
  const lastByAcct = {};
  OPT_LOG.forEach(o => {
    if (!lastByAcct[o.account] || o.dateISO > lastByAcct[o.account].dateISO) lastByAcct[o.account] = o;
  });
  Object.values(lastByAcct).forEach(o => {
    const dist = daysBetween ? daysBetween(o.dateISO, TODAY) : 0;
    if (dist >= 10) risks.push(`stale-optimization: ${o.account} (${o.platform}) — ${dist}d since "${o.action}"`);
  });

  /* Creative refresh due */
  Object.entries(store.profiles).forEach(([name, p]) => {
    const c = p.serviceContracts?.meta;
    if (!c) return;
    const st = creativeRefreshState ? creativeRefreshState(c, TODAY) : null;
    if (st && (st.dueSoon || st.overdue)) {
      risks.push(`creative-refresh: ${name} — day ${st.daysSince} of 45 (${st.overdue ? "OVERDUE" : "due soon"})`);
    }
  });

  /* Overdue / due-soon reviews */
  REVIEWS.forEach(r => {
    if (r.health === "danger") risks.push(`overdue-review: ${r.client} (${r.service}) — last ${r.last}, ${r.note || ""}`);
    else if (r.health === "warn") risks.push(`watch: ${r.client} (${r.service}) — ${r.note || "needs attention"}`);
  });

  /* Paused contracts */
  Object.entries(store.profiles).forEach(([name, p]) => {
    Object.entries(p.serviceContracts || {}).forEach(([svc, c]) => {
      if (c.status === "paused") risks.push(`paused: ${name} (${svc}) — since ${c.statusSince || "?"} (${c.statusReason || "no reason logged"})`);
    });
  });

  /* Cards stuck on client > 5d */
  ACT_CARDS.concat(window.PPC.ONB_CARDS).forEach(c => {
    if (c.days >= 5 && c.blocker) risks.push(`stuck: ${c.name} — ${c.days}d at "${c.stage}" — ${c.blocker}`);
  });

  return risks;
}

function focusClientDump(name) {
  const { store, userMap, SERVICE_INFO, profileMRR } = window.PPC;
  const p = store.getProfile(name);
  if (!p) return `No profile found for "${name}".`;
  const lines = [];
  lines.push(`### ${name} — FULL CONTEXT`);
  lines.push(`Niche: ${p.niche || "?"}. Status: ${p.status}. Started: ${p.startDate || "?"}. Lifetime: ${p.lifetimeMos || 0}mo.`);
  if (p.contact) {
    lines.push(`Contact: ${p.contact.name} (${p.contact.role}) · ${p.contact.email} · ${p.contact.phone} · ${p.contact.timezone} · prefers ${p.contact.pref}`);
  }
  /* Contracts */
  if (p.serviceContracts) {
    Object.entries(p.serviceContracts).forEach(([svc, c]) => {
      lines.push(`Contract ${svc}: ${c.status} | ${c.currency || "CAD"}$${c.monthlyFee}/mo | sales:${c.salesperson || "?"} | started ${c.contractStart || "?"}${c.statusReason ? ` | reason: ${c.statusReason}` : ""}`);
    });
  }
  /* MRR */
  if (profileMRR) lines.push(`Active MRR: ${profileMRR(p)}`);
  /* Owners */
  if (p.owners) {
    const o = p.owners;
    lines.push(`Owners — AM: ${userMap[o.am]?.name || "?"}, Ads: ${userMap[o.ads]?.name || "—"}, Creative: ${userMap[o.creative]?.name || "—"}`);
  }
  /* Brief */
  if (p.brief) {
    lines.push(`\nBrief: ${p.brief.overview}`);
    if (p.brief.audience?.length) lines.push(`Audience: ${p.brief.audience.join(", ")}`);
    if (p.brief.goals?.length)    lines.push(`Goals: ${p.brief.goals.join(", ")}`);
    if (p.brief.usps?.length)     lines.push(`USPs: ${p.brief.usps.join(", ")}`);
    if (p.brief.avoid?.length)    lines.push(`Avoid: ${p.brief.avoid.join(", ")}`);
    if (p.brief.geo)              lines.push(`Geo: ${p.brief.geo}`);
  }
  /* Performance */
  if (p.performance) {
    lines.push(`\nPerformance (last month): spend ${p.performance.spend}, conv ${p.performance.conv}, CPA ${p.performance.cpa}, CTR ${p.performance.ctr}%`);
  }
  /* Recent notes (last 5) */
  if (p.notes?.length) {
    lines.push(`\nRecent notes (${p.notes.length} total, showing 5):`);
    p.notes.slice(0, 5).forEach(n => {
      lines.push(`  • [${n.category}] ${n.title} (${n.when}): ${pad(n.body).slice(0, 220).replace(/\n+/g, " ")}`);
    });
  }
  /* Recent activity */
  if (p.activity?.length) {
    lines.push(`\nActivity log (last 6):`);
    p.activity.slice(0, 6).forEach(a => lines.push(`  • ${a.when} — ${a.who}: ${a.text}`));
  }
  /* Files */
  if (p.files?.length) {
    lines.push(`\nFiles: ${p.files.slice(0, 6).map(f => `${f.name} (${f.kind})`).join(", ")}`);
  }
  /* Accounts */
  if (p.accounts?.length) {
    lines.push(`\nAccount access: ${p.accounts.map(a => `${a.platform}:${a.access}`).join(", ")}`);
  }
  return lines.join("\n");
}

function platformDump(which) {
  const { META_ACCTS, GOOG_ACCTS, OPT_LOG, TODAY } = window.PPC;
  const list = which === "meta" ? META_ACCTS : GOOG_ACCTS;
  const lines = [];
  lines.push(`### Platform: ${which.toUpperCase()} accounts (today=${TODAY})`);
  list.forEach(a => {
    const util = ((a.mtdSpend / a.monthlyBudget) * 100).toFixed(0);
    lines.push(`- ${a.client} (${a.currency}) | status:${a.status} | budget ${a.monthlyBudget}/mo, MTD ${a.mtdSpend.toFixed(0)} (${util}%) | daily ${a.currentDailyBudget} | CPA ${a.cpa} | conv ${a.conv}${a.note ? ` | note: ${a.note}` : ""}${a.lastOptISO ? ` | last opt: ${a.lastOptISO}` : ""}`);
  });
  /* Recent log entries for this platform */
  const log = OPT_LOG.filter(o => o.platform === which).slice(0, 10);
  if (log.length) {
    lines.push(`\nRecent optimization log:`);
    log.forEach(o => lines.push(`  • ${o.dateISO} — ${o.account}: ${o.action} → ${o.impact}`));
  }
  return lines.join("\n");
}

function myDayDump(roleId) {
  const { TASKS_EXTRA, NOTIFS, REVIEWS, ONB_CARDS, ACT_CARDS, CAPACITY, userMap } = window.PPC;
  const lines = [];
  const myTasks = TASKS_EXTRA.filter(t => t.to === roleId && !t.done);
  if (myTasks.length) {
    lines.push(`Open tasks for ${userMap[roleId]?.name}:`);
    myTasks.forEach(t => lines.push(`  • [${t.priority}] ${t.text} — due ${t.due} — client ${t.client}`));
  }
  const myNotifs = NOTIFS.filter(n => n.to === roleId && !n.read);
  if (myNotifs.length) {
    lines.push(`\nUnread notifications:`);
    myNotifs.forEach(n => lines.push(`  • ${n.text} (${n.time})`));
  }
  const cap = CAPACITY[roleId];
  if (cap) lines.push(`\nWorkload: ${cap.hours}/${cap.max}h this week.`);
  /* Cards where this user is the owner / default for current stage */
  const allCards = ONB_CARDS.concat(ACT_CARDS);
  const myCards = allCards.filter(c => {
    if (c.designer === roleId) return true;
    if (c.override === roleId) return true;
    return false;
  });
  if (myCards.length) {
    lines.push(`\nCards directly assigned to you (${myCards.length}):`);
    myCards.slice(0, 8).forEach(c => lines.push(`  • ${c.name} — stage ${c.stage}, ${c.days}d`));
  }
  return lines.join("\n");
}

function buildSystemPrompt({ role, screen, focusClient, focusPlatform }) {
  const { TODAY, store, userMap, CAPACITY, LEADS, MRR_TREND, ROLE_ACCESS, REVIEWS } = window.PPC;
  const access = ROLE_ACCESS[role.id] || {};
  const out = [];

  out.push(`You are the in-app AI assistant for PPC Guru, a small digital marketing agency that runs Meta Ads, Google Ads, and SMM for ~33 SMB clients across Canada and the US.`);
  out.push(``);
  out.push(`You are talking to: **${role.name}** (${role.role}). Today is **${TODAY}**.`);
  out.push(`You have read access to the agency's CRM and operations data, summarized below. Use specific names and numbers — never vague generalities.`);
  out.push(``);
  out.push(`# Voice & format`);
  out.push(`- Tight, calm, professional. No throat-clearing. Don't repeat the question.`);
  out.push(`- Short bullets when listing. **Bold** key names/numbers. No emojis.`);
  out.push(`- Use the correct currency every time (CAD or USD per the data — never mix them in one number).`);
  out.push(`- If asked to draft an email, agenda, or note: produce ready-to-send copy. No "[insert here]" placeholders — use the data you have.`);
  out.push(`- If the data doesn't support an answer, say "I don't see that in the system" rather than guessing.`);
  out.push(`- 1024-token output cap — be ruthlessly concise.`);
  out.push(``);

  /* Team */
  out.push(`# Team`);
  Object.values(userMap).filter(u => u.id !== "client").forEach(u => {
    const cap = CAPACITY[u.id];
    out.push(`- ${u.id}: ${u.name} — ${u.role}${cap ? ` (workload ${cap.hours}/${cap.max}h)` : ""}`);
  });
  out.push(``);

  /* Org snapshot */
  const totalClients = Object.keys(store.profiles).length;
  const activeCount = Object.values(store.profiles).filter(p => p.status === "active").length;
  const onbCount    = Object.values(store.profiles).filter(p => p.status === "onboarding").length;
  out.push(`# Org snapshot`);
  out.push(`- ${totalClients} client profiles total: ${activeCount} active, ${onbCount} onboarding.`);
  if (access.money) {
    const last = MRR_TREND[MRR_TREND.length - 1];
    out.push(`- MRR (last month): $${last.mrr.toLocaleString()} CAD-equivalent. Trend: ${MRR_TREND.map(m => `${m.m} ${(m.mrr/1000).toFixed(1)}k`).join(", ")}.`);
  }
  out.push(``);

  /* Risks */
  const risks = risksSummary();
  if (risks.length) {
    out.push(`# Active risks (you flagged these from data; don't fabricate any not listed)`);
    risks.forEach(r => out.push(`- ${r}`));
    out.push(``);
  }

  /* Client roster — compact */
  out.push(`# Client roster (one line each)`);
  Object.entries(store.profiles).forEach(([name, p]) => {
    out.push(compactClientLine(name, p));
  });
  out.push(``);

  /* Reviews schedule */
  out.push(`# Monthly review schedule`);
  REVIEWS.forEach(r => out.push(`- ${r.client} (${r.service}) — last ${r.last}, due ${r.due}, health ${r.health}${r.note ? ` (${r.note})` : ""}`));
  out.push(``);

  /* Personalized — my day */
  out.push(`# What's on YOUR plate (${role.name})`);
  out.push(myDayDump(role.id));
  out.push(``);

  /* Sales — only if user has sales access */
  if (access.sales || role.id === "abhishek") {
    out.push(`# Sales pipeline`);
    LEADS.forEach(l => {
      out.push(`- ${l.company} (${l.contact}) | ${l.service.join("+")} | ${l.budget ? `${l.currency}$${l.budget}/mo` : "budget TBD"} | stage ${l.stage} (${l.days}d) | ${l.notes}`);
    });
    out.push(``);
  }

  /* Focus client deep-dive */
  if (focusClient) {
    out.push(`# IN-FOCUS CLIENT — questions probably refer to this unless stated otherwise`);
    out.push(focusClientDump(focusClient));
    out.push(``);
  }

  /* Focus platform deep-dive */
  if (focusPlatform) {
    out.push(`# IN-FOCUS PLATFORM`);
    out.push(platformDump(focusPlatform));
    out.push(``);
  }

  out.push(`# Current screen`);
  out.push(`User is viewing: **${screen}**${focusClient ? ` · client panel open on ${focusClient}` : ""}${focusPlatform ? ` · platform ${focusPlatform}` : ""}.`);

  return out.join("\n");
}

/* ─── Markdown-lite renderer ────────────────────────────────── */
function renderMd(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const out = [];
  let listBuf = [];
  const flushList = () => {
    if (listBuf.length) {
      out.push(<ul key={"ul" + out.length}>{listBuf.map((l, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(l) }} />)}</ul>);
      listBuf = [];
    }
  };
  const inline = (s) => s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  lines.forEach((raw, idx) => {
    const line = raw.replace(/\r$/, "");
    if (/^\s*[-*]\s+/.test(line)) {
      listBuf.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    flushList();
    if (/^###\s+/.test(line)) {
      out.push(<h3 key={idx} dangerouslySetInnerHTML={{ __html: inline(line.replace(/^###\s+/, "")) }} />);
    } else if (/^##\s+/.test(line)) {
      out.push(<h2 key={idx} dangerouslySetInnerHTML={{ __html: inline(line.replace(/^##\s+/, "")) }} />);
    } else if (line.trim() === "") {
      out.push(<div key={idx} style={{ height: 6 }} />);
    } else {
      out.push(<p key={idx} style={{ margin: "2px 0" }} dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  });
  flushList();
  return out;
}

/* ─── Singleton state — shared across bubble / panel / screen ── */
const AssistantContext = React.createContext(null);

function AssistantProvider({ role, screen, focusClient, focusPlatform, children }) {
  const [messages, setMessages] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(false);

  /* Refs for current values so async callbacks see latest */
  const ctxRef = React.useRef({ role, screen, focusClient, focusPlatform });
  React.useEffect(() => { ctxRef.current = { role, screen, focusClient, focusPlatform }; }, [role, screen, focusClient, focusPlatform]);

  const send = React.useCallback(async (text) => {
    if (!text || busy) return;
    const userMsg = { role: "user", content: text };
    setMessages(m => [...m, userMsg]);
    setBusy(true);
    const localHistory = [...messages, userMsg];
    try {
      const sys = buildSystemPrompt(ctxRef.current);
      const apiMessages = [
        { role: "user", content: sys + "\n\n---\n\nThe user will now ask you questions in subsequent turns. Acknowledge and wait." },
        { role: "assistant", content: "Ready." },
        ...localHistory.map(m => ({ role: m.role, content: m.content }))
      ];
      const resp = await window.claude.complete({ messages: apiMessages });
      setMessages(m => [...m, { role: "assistant", content: resp || "(no response)" }]);
      /* Mark unread if panel not currently open */
      if (!panelOpen && screen !== "assistant") setUnread(true);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "I hit a snag reaching the model. Try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  }, [busy, messages, panelOpen, screen]);

  const reset = React.useCallback(() => setMessages([]), []);

  React.useEffect(() => {
    window.openAssistant = (prefill) => {
      setPanelOpen(true);
      setUnread(false);
      if (prefill) send(prefill);
    };
    window.askAssistant = (q) => {
      setPanelOpen(true);
      setUnread(false);
      send(q);
    };
  }, [send]);

  /* Clear unread when panel opens or screen switches to assistant */
  React.useEffect(() => {
    if (panelOpen || screen === "assistant") setUnread(false);
  }, [panelOpen, screen]);

  const value = { messages, busy, send, reset, panelOpen, setPanelOpen, unread, role, screen, focusClient, focusPlatform };
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

function useAssistant() { return React.useContext(AssistantContext); }

/* ─── Suggestion picker ─────────────────────────────────────── */
function pickSuggestions(role, screen, focusClient, focusPlatform) {
  if (focusClient)                 return AI_SUGGESTIONS.client;
  if (focusPlatform === "meta")    return AI_SUGGESTIONS.meta;
  if (focusPlatform === "google")  return AI_SUGGESTIONS.google;
  if (["pipeline", "leads"].includes(screen)) return AI_SUGGESTIONS.sales;
  if (["rayu", "aadil"].includes(role.id)) return AI_SUGGESTIONS.designer;
  return AI_SUGGESTIONS.morning;
}

/* ─── Empty state ───────────────────────────────────────────── */
function AssistantEmpty({ role, focusClient, focusPlatform, screen, onPick }) {
  const suggestions = pickSuggestions(role, screen, focusClient, focusPlatform);
  const first = role.name.split(" ")[0];
  let line = `What can I dig into for you?`;
  if (focusClient)        line = `Looking at ${focusClient}. What do you need?`;
  else if (focusPlatform) line = `On the ${focusPlatform === "meta" ? "Meta" : "Google"} pacing dashboard. Ask me about pacing, CPAs, or what to optimize.`;
  return (
    <div className="ai-empty">
      <div className="ai-empty-mark"><Icon k="sparkle" /></div>
      <h3>Good to see you, {first}.</h3>
      <p>{line}</p>
      <div className="ai-suggest-grid">
        {suggestions.map((s, i) => (
          <button key={i} className="ai-suggest" onClick={() => onPick(s.label)}>
            <Icon k={s.ic} />
            <span className="lbl">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Messages list ─────────────────────────────────────────── */
function AssistantMessages({ messages, busy, role }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages.length, busy]);
  return (
    <div className="ai-msgs" ref={ref}>
      {messages.map((m, i) => (
        <div key={i} className={`ai-msg ${m.role}`}>
          <div className="who-mark">
            {m.role === "user"
              ? (role.initials || "?")
              : <Icon k="sparkle" />}
          </div>
          <div className="ai-bubble-text">
            {m.role === "assistant" ? renderMd(m.content) : m.content}
          </div>
        </div>
      ))}
      {busy && (
        <div className="ai-msg assistant">
          <div className="who-mark"><Icon k="sparkle" /></div>
          <div className="ai-bubble-text" style={{ padding: 0 }}>
            <div className="ai-typing"><span /><span /><span /></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Composer ──────────────────────────────────────────────── */
function AssistantComposer({ busy, onSend, focusClient, focusPlatform, onResetChat, showResetChip }) {
  const [text, setText] = React.useState("");
  const taRef = React.useRef(null);

  const submit = () => {
    const t = text.trim();
    if (!t || busy) return;
    onSend(t);
    setText("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };
  const onChange = (e) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };
  return (
    <div className="ai-composer">
      <div className="ai-composer-row">
        <textarea
          ref={taRef}
          rows={1}
          placeholder={focusClient
            ? `Ask about ${focusClient}…`
            : focusPlatform
              ? `Ask about ${focusPlatform === "meta" ? "Meta" : "Google"} pacing…`
              : "Ask me anything about your clients, tasks, pipeline…"}
          value={text}
          onChange={onChange}
          onKeyDown={onKey}
          disabled={busy}
        />
        <button className="ai-send" disabled={busy || !text.trim()} onClick={submit}>
          <Icon k="send" />
        </button>
      </div>
      <div className="ai-composer-hint">
        <span>Press <span className="kbd">Enter</span> to send · <span className="kbd">Shift+Enter</span> for newline</span>
        {showResetChip && (
          <button className="ai-quick-chip" onClick={onResetChat}>New chat</button>
        )}
      </div>
    </div>
  );
}

/* ─── Floating bubble ───────────────────────────────────────── */
function AssistantBubble() {
  const a = useAssistant();
  if (!a) return null;
  if (a.screen === "assistant") return null;        // hide on full-page screen
  return (
    <button
      className={`ai-bubble ${a.panelOpen ? "open" : ""}`}
      onClick={() => a.setPanelOpen(!a.panelOpen)}
      title={a.panelOpen ? "Close assistant" : "Open assistant"}
    >
      <Icon k={a.panelOpen ? "close" : "sparkle"} />
      {a.unread && !a.panelOpen && <span className="dot" />}
    </button>
  );
}

/* ─── Slide-in panel ───────────────────────────────────────── */
function AssistantPanel() {
  const a = useAssistant();
  if (!a) return null;
  const close = () => a.setPanelOpen(false);
  /* context chip text */
  let chip = "Org overview";
  if (a.focusClient)        chip = a.focusClient;
  else if (a.focusPlatform) chip = `${a.focusPlatform === "meta" ? "Meta" : "Google"} pacing`;
  else if (a.screen === "dashboard") chip = "Your day";

  return (
    <React.Fragment>
      <div className={`panel-scrim ${a.panelOpen ? "open" : ""}`} onClick={close} />
      <aside className={`side-panel ${a.panelOpen ? "open" : ""}`} style={{ width: 460 }}>
        <div className="ai-panel-head">
          <div className="ai-mark"><Icon k="sparkle" /></div>
          <div className="ai-title-block">
            <span className="ai-title"><em>Guru</em> Assistant</span>
            <span className="ai-sub">Claude · context-aware</span>
          </div>
          <div className="ai-context-chip" title="Current context">
            <span className="d" />
            <span>{chip}</span>
          </div>
          <button className="btn ghost" onClick={close} style={{ padding: 4 }}>
            <Icon k="close" />
          </button>
        </div>
        {a.messages.length === 0
          ? (
            <div className="ai-msgs" style={{ background: "var(--card)" }}>
              <AssistantEmpty
                role={a.role}
                focusClient={a.focusClient}
                focusPlatform={a.focusPlatform}
                screen={a.screen}
                onPick={(text) => a.send(text)}
              />
            </div>
          )
          : <AssistantMessages messages={a.messages} busy={a.busy} role={a.role} />
        }
        <AssistantComposer
          busy={a.busy}
          onSend={a.send}
          focusClient={a.focusClient}
          focusPlatform={a.focusPlatform}
          onResetChat={a.reset}
          showResetChip={a.messages.length > 0}
        />
      </aside>
    </React.Fragment>
  );
}

/* ─── Full-page screen ──────────────────────────────────────── */
function AssistantScreen() {
  const a = useAssistant();
  if (!a) return null;
  const { TODAY, store, NOTIFS, TASKS_EXTRA, REVIEWS } = window.PPC;

  const totalClients = Object.keys(store.profiles).length;
  const myTasks      = TASKS_EXTRA.filter(t => t.to === a.role.id && !t.done).length;
  const myNotifs     = NOTIFS.filter(n => n.to === a.role.id && !n.read).length;
  const overdue      = REVIEWS.filter(r => r.health === "danger").length;
  const risks        = risksSummary().length;

  return (
    <React.Fragment>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">AI Assistant</div>
          <h1 className="page-title"><em>Guru</em> — your data, your team, in one chat.</h1>
          <p className="page-sub">
            Powered by Claude. I can read every client, task, lead, and ad account in PPC Guru — draft emails, find risks, summarize months, and tell you what to do next.
          </p>
        </div>
        <div className="row gap-2">
          {a.messages.length > 0 && (
            <button className="btn" onClick={a.reset}>
              <Icon k="refresh" /> New chat
            </button>
          )}
        </div>
      </div>

      <div className="ai-screen">
        <div className="ai-screen-main">
          {a.messages.length === 0
            ? (
              <div className="ai-msgs" style={{ background: "var(--card)", padding: "28px 28px 8px" }}>
                <AssistantEmpty
                  role={a.role}
                  focusClient={a.focusClient}
                  focusPlatform={a.focusPlatform}
                  screen={a.screen}
                  onPick={(text) => a.send(text)}
                />
              </div>
            )
            : <AssistantMessages messages={a.messages} busy={a.busy} role={a.role} />
          }
          <AssistantComposer
            busy={a.busy}
            onSend={a.send}
            focusClient={a.focusClient}
            focusPlatform={a.focusPlatform}
            onResetChat={a.reset}
            showResetChip={a.messages.length > 0}
          />
        </div>

        <div className="col">
          <div className="ai-context-card">
            <div className="ai-context-card-title"><Icon k="clock" />Today</div>
            <div className="ai-context-row"><span className="k">Date</span><span className="mono">{TODAY}</span></div>
            <div className="ai-context-row"><span className="k">You</span><span>{a.role.name.split(" ")[0]}</span></div>
            <div className="ai-context-row"><span className="k">Role</span><span style={{ fontSize: 12.5 }}>{a.role.role}</span></div>
          </div>

          <div className="ai-context-card">
            <div className="ai-context-card-title"><Icon k="report" />What I know</div>
            <div className="ai-context-row"><span className="k">Client profiles</span><span className="mono">{totalClients}</span></div>
            <div className="ai-context-row"><span className="k">Active risks</span><span className="mono" style={{ color: risks ? "var(--danger)" : "var(--ink-3)" }}>{risks}</span></div>
            <div className="ai-context-row"><span className="k">Overdue reviews</span><span className="mono">{overdue}</span></div>
            <div className="ai-context-row"><span className="k">Your tasks</span><span className="mono">{myTasks}</span></div>
            <div className="ai-context-row"><span className="k">Your alerts</span><span className="mono">{myNotifs}</span></div>
          </div>

          {a.focusClient && (
            <div className="ai-context-card">
              <div className="ai-context-card-title"><Icon k="user" />In focus</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 15, fontWeight: 500 }}>{a.focusClient}</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Open client panel</div>
            </div>
          )}

          <div className="ai-context-card" style={{ background: "var(--ink)", color: "var(--paper)", border: "1px solid var(--ink)" }}>
            <div className="ai-context-card-title" style={{ color: "var(--ink-4)" }}>
              <Icon k="sparkle" />Try asking
            </div>
            <ul style={{ paddingLeft: 16, margin: "6px 0", fontSize: 12.5, lineHeight: 1.55, color: "rgba(247,244,238,.85)" }}>
              <li onClick={() => a.send("Brief me for today")} style={{ cursor: "pointer" }}>"Brief me for today"</li>
              <li onClick={() => a.send("Which clients are at churn risk?")} style={{ cursor: "pointer" }}>"Which clients are at churn risk?"</li>
              <li onClick={() => a.send("Draft an email to Jess at Maritime Realty with this month's results")} style={{ cursor: "pointer" }}>"Draft an email to Maritime Realty"</li>
              <li onClick={() => a.send("Find optimizations that are 10+ days stale")} style={{ cursor: "pointer" }}>"Find stale optimizations"</li>
              <li onClick={() => a.send("Summarize last month for FreshLeaf Cannabis Co.")} style={{ cursor: "pointer" }}>"Summarize FreshLeaf's last month"</li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, {
  AssistantProvider, AssistantBubble, AssistantPanel, AssistantScreen,
  useAssistant
});
