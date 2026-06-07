/* Email composer modal — opens from any client panel.
   - Pick template (monthly review / refresh ask / status update / custom)
   - Guru drafts via window.claude.complete; user edits
   - "Send" is mocked — logs as activity + note on the profile + toast */

function EmailComposer() {
  const [state, setState] = React.useState({ open: false, client: null, template: "custom", who: null });
  const [to, setTo]           = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody]       = React.useState("");
  const [drafting, setDrafting] = React.useState(false);
  const [sending, setSending]   = React.useState(false);

  /* Expose opener */
  React.useEffect(() => {
    window.openEmailCompose = ({ client, template, who } = {}) => {
      setState({ open: true, client: client || null, template: template || "custom", who });
      setTo(""); setSubject(""); setBody("");
    };
  }, []);

  /* Pre-fill on open */
  React.useEffect(() => {
    if (!state.open || !state.client) return;
    const prof = window.PPC.PROFILES_RICH[state.client];
    const contact = prof?.contact;
    setTo(contact?.email && contact.email !== "—" ? contact.email : "");
    /* Default subject from template */
    const todayLabel = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
    const subjects = {
      "monthly-review":  `Monthly review · ${state.client} · ${todayLabel}`,
      "refresh-ask":     `Creative refresh — quick check-in`,
      "status-update":   `Quick update on your account`,
      "custom":          ""
    };
    setSubject(subjects[state.template] || "");
    /* Body starts empty; user clicks Draft with Guru */
    setBody("");
  }, [state.open, state.client, state.template]);

  if (!state.open) return null;

  const prof = state.client ? window.PPC.PROFILES_RICH[state.client] : null;
  const contact = prof?.contact;

  const draftWithGuru = async () => {
    if (!state.client) return;
    setDrafting(true);
    setBody("(Guru is drafting…)");
    const PPC = window.PPC;
    const services = Object.entries(prof?.serviceContracts || {})
      .filter(([, c]) => c.status === "active")
      .map(([s]) => PPC.SERVICE_INFO[s]?.label || s)
      .join(", ");
    const perf = prof?.performance ? `Last 30 days: ${prof.performance.conv} conv at $${prof.performance.cpa} CPA, CTR ${prof.performance.ctr}%.` : "";
    const templateBriefs = {
      "monthly-review":
        `Draft a friendly, concise client email from ${state.who?.name || "Vihar"} (PM at PPC Guru) to ${contact?.name || "the client"} at ${state.client}, sharing this month's results and inviting them to a monthly review call. ${perf} Active services: ${services || "—"}. Keep it warm, under 180 words, sign off with first name. No subject line in the body. Plain text only.`,
      "refresh-ask":
        `Draft a short email from ${state.who?.name || "Vanshika"} to ${contact?.name || "the client"} at ${state.client} letting them know the current Meta creative is fatiguing and we'd like to refresh. Suggest a 20-minute call to align on direction. Confident but not pushy. Under 140 words. Plain text only.`,
      "status-update":
        `Draft a quick, no-news-is-good-news status update to ${contact?.name || "the client"} at ${state.client}. Cover this month's progress and the next two things we'll work on. Under 140 words. Plain text only.`,
      "custom":
        `Draft a professional client email from ${state.who?.name || "PPC Guru"} to ${contact?.name || "the client"} at ${state.client}. Keep it concise (under 160 words) and plain text. Active services: ${services || "—"}.`
    };
    try {
      const resp = await window.claude.complete({
        messages: [
          { role: "user", content: templateBriefs[state.template] || templateBriefs.custom }
        ]
      });
      setBody((resp || "").trim() || "(Guru didn't return anything — try again or write it yourself.)");
    } catch (e) {
      setBody("(Drafting failed — please write it yourself or try again.)");
    } finally {
      setDrafting(false);
    }
  };

  const send = () => {
    if (!state.client) return;
    setSending(true);
    setTimeout(() => {
      const store = window.PPC.store;
      const summary = subject || "(no subject)";
      const preview = body.slice(0, 240) + (body.length > 240 ? "…" : "");
      store.addNote(state.client, {
        category: "internal",
        title: `Email sent — ${summary}`,
        body: `To: ${to || contact?.email || "(unknown)"}\nFrom: ${state.who?.name || "Me"}\n\n${preview}`,
        who: state.who?.id || "vihar"
      });
      window.toast?.(`Email sent to ${to || "client"} · logged as note + activity`, { icon: "→" });
      setSending(false);
      setState({ open: false, client: null, template: "custom", who: null });
    }, 700);
  };

  const close = () => setState({ open: false, client: null, template: "custom", who: null });

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <div className="modal-scrim" onClick={close}>
      <div className="modal wide" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="col" style={{ flex: 1 }}>
            <span className="page-eyebrow" style={{ marginBottom: 0 }}>Compose email</span>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, letterSpacing: "-.015em" }}>
              To <em style={{ color: "var(--accent)", fontStyle: "italic" }}>{state.client || "—"}</em>
            </div>
            {contact && (
              <span className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                {contact.name} · {contact.role} · prefers {contact.pref?.toLowerCase() || "email"}
              </span>
            )}
          </div>
          <button className="btn ghost" onClick={close}><Icon k="close" /></button>
        </div>

        <div className="modal-body">
          {/* Template chips */}
          <div className="field">
            <span className="field-label">Template</span>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {[
                { id: "custom", label: "Custom" },
                { id: "monthly-review", label: "Monthly review invite" },
                { id: "refresh-ask", label: "Creative refresh ask" },
                { id: "status-update", label: "Quick status update" }
              ].map(t => (
                <span
                  key={t.id}
                  className={`chip-pick ${state.template === t.id ? "on" : ""}`}
                  onClick={() => setState(s => ({ ...s, template: t.id }))}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <span className="field-label">To</span>
              <TextInput value={to} onChange={e => setTo(e.target.value)} placeholder="client@example.com" />
            </div>
            <div className="field">
              <span className="field-label">From</span>
              <TextInput value={state.who?.name ? `${state.who.name} <${state.who.id}@ppcguru.com>` : ""} readOnly />
            </div>
          </div>

          <div className="field">
            <span className="field-label">Subject</span>
            <TextInput value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line" />
          </div>

          <div className="field">
            <div className="row" style={{ marginBottom: 4 }}>
              <span className="field-label" style={{ flex: 1 }}>Message</span>
              <button
                className="btn sm"
                onClick={draftWithGuru}
                disabled={drafting || !state.client}
                style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}
              >
                {drafting
                  ? <><span className="spinner" /> Drafting</>
                  : <><Icon k="sparkle" /> Draft with Guru</>}
              </button>
            </div>
            <Textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={drafting ? "Guru is composing a draft…" : "Write your message, or click Draft with Guru to start."}
              style={{ minHeight: 240, fontSize: 13.5, lineHeight: 1.55 }}
            />
            <div className="row" style={{ marginTop: 4 }}>
              <span className="muted-2" style={{ fontSize: 12.5, flex: 1 }}>
                {wordCount} word{wordCount === 1 ? "" : "s"} · drafts are logged as an internal note on this client.
              </span>
              <button className="btn ghost sm" onClick={() => setBody("")}>Clear</button>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>
            Send is mocked in this demo · we log every send as activity + a note.
          </span>
          <button className="btn ghost" onClick={close}>Cancel</button>
          <button
            className="btn primary"
            onClick={send}
            disabled={sending || !body.trim() || !subject.trim() || !to.trim()}
          >
            {sending ? <><span className="spinner" /> Sending</> : <><Icon k="check" /> Send</>}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EmailComposer });
