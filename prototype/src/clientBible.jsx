/* PPC Guru — Client Bible
   ─────────────────────────────────────────────────────────────
   Three new tabs on the ClientProfilePanel:
     • Vault       — credentials with reveal-and-log
     • Drive       — Drive folder cards
     • Transcripts — manual upload + auto-pull mock

   All three live as global components and are mounted by
   clientProfile.jsx via window.VaultTab / window.DriveTab /
   window.TranscriptsTab.
*/

/* ═══════════════════════════════════════════════════════════════
   VAULT TAB — Credentials with reveal-and-log
   ═══════════════════════════════════════════════════════════════ */
function VaultTab({ profile, name, role }) {
  const store = useStore();   // re-render on changes
  const { CLIENT_VAULTS, CRED_AUDIT, userMap } = window.PPC;
  const creds = CLIENT_VAULTS[name] || [];
  const audit = CRED_AUDIT.filter(a => a.client === name);

  const [pendingReveal, setPendingReveal] = React.useState(null); // { credId }
  const [revealed, setRevealed]           = React.useState({});   // { credId: secret }
  const [showAudit, setShowAudit]         = React.useState(false);
  const [addOpen, setAddOpen]             = React.useState(false);

  /* Auto-hide a revealed secret after 30s of being shown */
  React.useEffect(() => {
    const ids = Object.keys(revealed);
    if (ids.length === 0) return;
    const t = setTimeout(() => setRevealed({}), 30000);
    return () => clearTimeout(t);
  }, [revealed]);

  const askReveal  = (credId) => setPendingReveal({ credId });
  const doReveal   = (reason) => {
    const secret = window.PPC.store.revealCredential(name, pendingReveal.credId, role.id, reason);
    setRevealed(r => ({ ...r, [pendingReveal.credId]: secret }));
    setPendingReveal(null);
    window.toast?.("Reveal logged · audit row created", { icon: "👁" });
  };
  const hideOne    = (credId) => setRevealed(r => { const n = { ...r }; delete n[credId]; return n; });
  const copySecret = async (credId) => {
    const s = revealed[credId];
    if (!s) return;
    try { await navigator.clipboard.writeText(s); window.toast?.("Copied to clipboard", { icon: "📋" }); } catch { /* noop */ }
  };

  if (creds.length === 0 && !addOpen) {
    return (
      <div>
        <VaultIntro />
        <div className="empty" style={{ marginTop: 12 }}>
          No credentials in the vault for {name}. <br />
          Add the first one to start tracking access.
        </div>
        <div className="row" style={{ marginTop: 12, justifyContent: "center" }}>
          <button className="btn primary" onClick={() => setAddOpen(true)}>
            <Icon k="plus" /> Add credential
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <VaultIntro />

      <div className="row gap-2" style={{ margin: "10px 0 12px", flexWrap: "wrap" }}>
        <Pill kind="outline">{creds.length} credential{creds.length === 1 ? "" : "s"}</Pill>
        <Pill kind="warn">{creds.filter(c => c.status === "expiring").length} expiring</Pill>
        <Pill kind="ok">{audit.length} audit entr{audit.length === 1 ? "y" : "ies"}</Pill>
        <span style={{ flex: 1 }} />
        <button className="btn sm ghost" onClick={() => setShowAudit(s => !s)}>
          <Icon k="report" /> {showAudit ? "Hide" : "Show"} audit log
        </button>
        <button className="btn sm" onClick={() => setAddOpen(true)}>
          <Icon k="plus" /> Add credential
        </button>
      </div>

      <div className="col gap-2">
        {creds.map(c => {
          const isRevealed = !!revealed[c.id];
          const owner = userMap[c.owner];
          return (
            <div key={c.id} className={`vault-row vault-${c.status}`}>
              <div className="vault-platform">
                <span className={`vault-kind k-${c.kind}`}>{kindShort(c.kind)}</span>
                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                  <span className="vault-label">{c.platform}</span>
                  <span className="vault-sublabel">{c.label}</span>
                </div>
              </div>

              <div className="vault-fields">
                {c.username && (
                  <div className="vault-field">
                    <span className="k">User</span>
                    <span className="mono">{c.username}</span>
                  </div>
                )}
                <div className="vault-field">
                  <span className="k">{c.kind === "token" ? "Token" : c.kind === "service-key" ? "Key file" : c.kind === "mcc" ? "Link" : "Password"}</span>
                  <span className={`vault-secret ${isRevealed ? "shown" : "hidden"}`}>
                    {isRevealed ? c.secret : maskString(c.secret)}
                  </span>
                  {isRevealed
                    ? <>
                        <button className="vault-icon-btn" title="Copy" onClick={() => copySecret(c.id)}>
                          <Icon k="link" />
                        </button>
                        <button className="vault-icon-btn" title="Hide" onClick={() => hideOne(c.id)}>
                          <Icon k="close" />
                        </button>
                      </>
                    : <button className="vault-reveal" onClick={() => askReveal(c.id)}>
                        <Icon k="user" /> Reveal
                      </button>
                  }
                </div>
                {c.note && <div className="vault-note">{c.note}</div>}
              </div>

              <div className="vault-meta">
                <div className="row gap-2" style={{ alignItems: "center", fontSize: 12.5, color: "var(--ink-3)" }}>
                  {owner && <Avatar user={owner} size="sm" />}
                  <span>{owner?.name.split(" ")[0] || "—"}</span>
                </div>
                <div className="muted-2" style={{ fontSize: 12.5 }}>
                  Last revealed <span className="mono">{c.lastReveal || "never"}</span>
                </div>
                {c.expiresInDays != null && (
                  <Pill kind={c.expiresInDays <= 14 ? "warn" : "outline"}>
                    {c.expiresInDays}d to renewal
                  </Pill>
                )}
                {c.status === "expiring" && <Pill kind="warn" dot>expiring</Pill>}
                {c.status === "revoked"  && <Pill kind="danger" dot>revoked</Pill>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit log */}
      {showAudit && (
        <div className="sub-card" style={{ marginTop: 16, padding: 0 }}>
          <div className="row" style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
            <span className="section-title" style={{ flex: 1 }}>Audit log — every reveal, rotate, and create</span>
            <span className="muted mono" style={{ fontSize: 12.5 }}>{audit.length}</span>
          </div>
          {audit.length === 0 && <div className="empty" style={{ border: "none", padding: "16px" }}>No audit entries yet.</div>}
          {audit.map(a => {
            const cred = creds.find(c => c.id === a.credId);
            return (
              <div key={a.id} className="audit-row">
                <span className={`audit-dot a-${a.action}`} />
                <div className="col" style={{ flex: 1 }}>
                  <span style={{ fontSize: 13.5 }}>
                    <strong>{userMap[a.who]?.name.split(" ")[0] || a.who}</strong>{" "}
                    {a.action === "reveal" ? "revealed" : a.action === "rotate" ? "rotated" : a.action}
                    {" · "}
                    <span style={{ color: "var(--ink-2)" }}>{cred?.platform || "—"}</span>
                    {cred?.label && <span className="muted"> · {cred.label}</span>}
                  </span>
                  <span className="muted" style={{ fontSize: 12.5 }}>
                    {a.reason}
                  </span>
                </div>
                <span className="mono muted" style={{ fontSize: 12.5 }}>{a.when}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Reveal-reason modal */}
      {pendingReveal && (
        <RevealReasonModal
          cred={creds.find(c => c.id === pendingReveal.credId)}
          onClose={() => setPendingReveal(null)}
          onConfirm={doReveal}
        />
      )}

      {/* Add credential modal */}
      {addOpen && (
        <AddCredentialModal client={name} role={role} onClose={() => setAddOpen(false)} />
      )}
    </div>
  );
}

function VaultIntro() {
  return (
    <div className="vault-intro">
      <div className="vault-intro-mark">
        <Icon k="user" />
      </div>
      <div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 500, letterSpacing: "-.01em" }}>
          Credentials are gated
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
          Every reveal is logged with the reason. Use only when running an actual task — for routine access, use the platform-level integration (BM, MCC, GA4 service account) instead.
        </div>
      </div>
    </div>
  );
}

function kindShort(k) {
  return { login: "PWD", token: "TKN", "service-key": "KEY", mcc: "MCC" }[k] || "—";
}
function maskString(s) {
  if (!s) return "";
  const len = Math.min(20, Math.max(8, s.length));
  return "•".repeat(len);
}

function RevealReasonModal({ cred, onClose, onConfirm }) {
  const [reason, setReason] = React.useState("");
  const presets = [
    "Pulling monthly report",
    "Logging into platform to make a change",
    "Onboarding a new team member",
    "Compliance / audit recheck",
    "Client requested an export"
  ];
  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-head">
          <div className="col" style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 12.5 }}>{cred.platform} · {cred.label}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>
              Reveal <em style={{ color: "var(--accent)", fontStyle: "italic" }}>{cred.kind === "token" ? "token" : cred.kind === "service-key" ? "key file" : "password"}</em>
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>
        <div className="modal-body">
          <div className="sub-card" style={{ background: "var(--warn-tint)", borderColor: "var(--warn)" }}>
            <div className="row gap-2" style={{ alignItems: "flex-start" }}>
              <Icon k="alert" />
              <div className="col" style={{ flex: 1 }}>
                <strong style={{ color: "var(--warn)", fontSize: 13.5 }}>This reveal is logged forever</strong>
                <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 2, lineHeight: 1.5 }}>
                  Your name, the timestamp, and the reason will be appended to the audit log. Owners can review at any time.
                </div>
              </div>
            </div>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <span className="field-label">Why are you revealing this?</span>
            <textarea className="textarea" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Re-linking Meta pixel after restriction reset" autoFocus />
          </div>
          <div className="row gap-2" style={{ marginTop: 8, flexWrap: "wrap" }}>
            {presets.map(p => (
              <button key={p} className="chip-pick" onClick={() => setReason(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div className="modal-foot">
          <div style={{ flex: 1 }} />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!reason.trim()} onClick={() => onConfirm(reason.trim())}>
            <Icon k="user" /> Reveal & log
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCredentialModal({ client, role, onClose }) {
  const { SERVICE_INFO } = window.PPC;
  const [form, setForm] = React.useState({
    platform: "", label: "", username: "", secret: "",
    kind: "login", note: "", owner: role.id
  });
  const submit = () => {
    if (!form.platform || !form.secret) return;
    window.PPC.store.addCredential(client, { ...form, who: role.id });
    window.toast?.(`Added ${form.platform} credential to vault`, { icon: "🔐" });
    onClose();
  };
  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal-head">
          <div className="col" style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 12.5 }}>Vault · {client}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>Add <em style={{ color: "var(--accent)", fontStyle: "italic" }}>credential</em></div>
          </div>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>
        <div className="modal-body">
          <div className="row gap-2" style={{ marginBottom: 12, flexWrap: "wrap" }}>
            {[["login","Password"],["token","API Token"],["service-key","Service Key"],["mcc","MCC link"]].map(([k, lbl]) => (
              <span key={k} className={`chip-pick ${form.kind === k ? "on" : ""}`} onClick={() => setForm(f => ({ ...f, kind: k }))}>
                {lbl}
              </span>
            ))}
          </div>
          <Field label="Platform"><input className="input" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} placeholder="e.g. Meta Business Manager, Looker Studio, Shopify…" /></Field>
          <Field label="Label / what it's for"><input className="input" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Admin login, Multi-store dashboard token" /></Field>
          {form.kind === "login" && (
            <Field label="Username / email"><input className="input mono" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} /></Field>
          )}
          <Field label={form.kind === "login" ? "Password" : form.kind === "service-key" ? "Key file name / path" : "Token / value"}>
            <input className="input mono" type={form.kind === "login" ? "password" : "text"} value={form.secret} onChange={e => setForm(f => ({ ...f, secret: e.target.value }))} />
          </Field>
          <Field label="Note (optional)"><textarea className="textarea" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Anything the next person needs to know — rotation cadence, 2FA, scopes, etc." /></Field>
        </div>
        <div className="modal-foot">
          <div style={{ flex: 1 }} />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!form.platform || !form.secret} onClick={submit}>Save to vault</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DRIVE TAB — Drive folder cards
   ═══════════════════════════════════════════════════════════════ */
function DriveTab({ profile, name, role }) {
  useStore();
  const { DRIVE_FOLDERS, userMap } = window.PPC;
  const drive = DRIVE_FOLDERS[name];
  if (!drive) {
    return (
      <div>
        <div className="empty">
          No Drive folder linked for {name} yet.
        </div>
        <div className="row" style={{ marginTop: 12, justifyContent: "center" }}>
          <button className="btn primary"><Icon k="link" /> Link Drive folder</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="drive-root">
        <div className="row gap-2" style={{ alignItems: "center" }}>
          <span className="drive-root-ic"><Icon k="link" /></span>
          <div className="col" style={{ flex: 1 }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 500 }}>Drive root</span>
            <a href="#" className="mono" style={{ color: "var(--accent)", fontSize: 13.5, textDecoration: "none" }}
              onClick={(e) => { e.preventDefault(); window.toast?.("Drive opens in new tab (mock)", { icon: "↗" }); }}>
              {drive.root}
            </a>
          </div>
          <button className="btn sm ghost" onClick={() => window.toast?.("Drive opens in new tab (mock)", { icon: "↗" })}><Icon k="link" /> Open in Drive</button>
        </div>
      </div>

      <div className="drive-grid">
        {drive.folders.map(f => {
          const owners = (f.owners || []).map(id => userMap[id]).filter(Boolean);
          return (
            <div key={f.id} className="drive-card" onClick={() => window.toast?.(`Drive: ${f.name} opens in new tab (mock)`, { icon: "↗" })}>
              <div className="drive-card-head">
                <span className="drive-card-ic">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                  </svg>
                </span>
                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                  <span className="drive-card-name">{f.name}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>{f.items} files · updated {f.updated}</span>
                </div>
              </div>
              {f.highlights && (
                <ul className="drive-highlights">
                  {f.highlights.slice(0, 3).map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              <div className="drive-card-foot">
                <div className="row gap-1" style={{ alignItems: "center" }}>
                  {owners.slice(0, 3).map(u => <Avatar key={u.id} user={u} size="sm" />)}
                </div>
                <span className="mono muted-2" style={{ fontSize: 11.5 }}>↗ open</span>
              </div>
            </div>
          );
        })}
        <div className="drive-card add" onClick={() => window.toast?.("New folder mock — would create on Drive", { icon: "+" })}>
          <span className="drive-card-ic"><Icon k="plus" /></span>
          <span style={{ fontSize: 13.5, color: "var(--ink-3)" }}>New folder</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRANSCRIPTS TAB
   ═══════════════════════════════════════════════════════════════ */
function TranscriptsTab({ profile, name, role }) {
  useStore();
  const { TRANSCRIPTS, PENDING_AUTOPULL, userMap } = window.PPC;
  const transcripts = TRANSCRIPTS[name] || [];
  const queue       = PENDING_AUTOPULL[name] || [];

  const [pulling, setPulling]   = React.useState(false);
  const [pullStep, setPullStep] = React.useState(null);
  const [openId, setOpenId]     = React.useState(transcripts[0]?.id || null);
  const [uploadOpen, setUploadOpen] = React.useState(false);

  /* keep selection in sync if a new transcript is dropped */
  React.useEffect(() => {
    if (!openId && transcripts[0]) setOpenId(transcripts[0].id);
  }, [transcripts.length, openId]);

  const runAutoPull = () => {
    if (pulling || queue.length === 0) return;
    setPulling(true);
    const steps = [
      "Connecting to Google Meet…",
      `Found ${queue.length} recording${queue.length === 1 ? "" : "s"}. Pulling oldest…`,
      "Transcribing…",
      "Extracting action items…",
      "Done."
    ];
    let i = 0;
    setPullStep(steps[0]);
    const advance = () => {
      i++;
      if (i < steps.length) {
        setPullStep(steps[i]);
        setTimeout(advance, 600 + Math.random() * 400);
      } else {
        const newT = window.PPC.store.pullNextTranscript(name, role.id);
        if (newT) {
          window.toast?.(`Pulled transcript: ${newT.title}`, { icon: "↓" });
          setOpenId(newT.id);
        }
        setPulling(false);
        setPullStep(null);
      }
    };
    setTimeout(advance, 700);
  };

  const open = transcripts.find(t => t.id === openId) || transcripts[0];

  return (
    <div>
      {/* Header strip — auto-pull + upload */}
      <div className="transcript-strip">
        <div className="col" style={{ flex: 1 }}>
          <span style={{ fontSize: 12.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 500 }}>Meeting transcripts</span>
          <div style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 500, letterSpacing: "-.01em" }}>
            {transcripts.length} on file
            {queue.length > 0 && <span style={{ color: "var(--accent)", marginLeft: 8 }}>· {queue.length} ready to pull from Meet</span>}
          </div>
        </div>
        <button
          className={`btn ${queue.length > 0 ? "primary" : "ghost"}`}
          onClick={runAutoPull}
          disabled={pulling || queue.length === 0}
        >
          {pulling
            ? <><span className="spinner" /> Pulling…</>
            : queue.length > 0
              ? <><Icon k="refresh" /> Auto-pull from Meet ({queue.length})</>
              : <><Icon k="refresh" /> No new recordings</>
          }
        </button>
        <button className="btn ghost" onClick={() => setUploadOpen(true)}>
          <Icon k="plus" /> Upload manually
        </button>
      </div>

      {pulling && pullStep && (
        <div className="pull-progress">
          <span className="spinner big" />
          <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{pullStep}</span>
        </div>
      )}

      {/* Split layout — list on left, detail on right */}
      {transcripts.length === 0 ? (
        <div className="empty" style={{ marginTop: 16 }}>
          No transcripts yet for {name}. {queue.length > 0 ? "Pull from Meet above, or upload manually." : "Upload manually to get started."}
        </div>
      ) : (
        <div className="transcript-split">
          {/* List */}
          <div className="transcript-list">
            {transcripts.map(t => (
              <div key={t.id}
                   className={`transcript-item ${openId === t.id ? "active" : ""}`}
                   onClick={() => setOpenId(t.id)}>
                <div className="col" style={{ flex: 1, minWidth: 0 }}>
                  <span className="transcript-title">{t.title}</span>
                  <span className="transcript-meta">{t.when} · {t.duration}m</span>
                </div>
                <Pill kind={t.source.includes("Meet") ? "accent" : "outline"}>
                  {t.source.includes("Meet") ? "Meet" : "Manual"}
                </Pill>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="transcript-detail">
            {open && <TranscriptDetail t={open} userMap={userMap} clientName={name} role={role} />}
          </div>
        </div>
      )}

      {uploadOpen && (
        <UploadTranscriptModal client={name} role={role} onClose={() => setUploadOpen(false)}
          onUploaded={(t) => { setOpenId(t.id); setUploadOpen(false); }} />
      )}
    </div>
  );
}

function TranscriptDetail({ t, userMap, clientName, role }) {
  const [showFull, setShowFull] = React.useState(false);
  return (
    <div>
      <div className="transcript-detail-head">
        <div className="col" style={{ flex: 1 }}>
          <span className="muted" style={{ fontSize: 12.5 }}>{t.when} · {t.duration}m · {t.source}</span>
          <div style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 500, letterSpacing: "-.01em", marginTop: 2 }}>
            {t.title}
          </div>
          {t.attendees?.length > 0 && (
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
              With {t.attendees.join(", ")}
            </div>
          )}
        </div>
        <button className="btn sm ghost" onClick={() =>
          window.askAssistant?.(`Summarize this transcript and suggest 3 follow-up actions for ${clientName}:\n\nTitle: ${t.title}\nDate: ${t.when}\n\nSummary already on file: ${t.summary}\n\nExcerpt:\n${t.excerpt || "(no excerpt)"}`)
        }>
          <Icon k="sparkle" /> Ask Guru
        </button>
      </div>

      <div className="sub-card">
        <div className="sub-card-title">Summary</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{t.summary}</div>
      </div>

      {t.actionItems?.length > 0 && (
        <div className="sub-card">
          <div className="row" style={{ marginBottom: 6 }}>
            <span className="sub-card-title" style={{ margin: 0, flex: 1 }}>Action items extracted</span>
            <Pill kind="accent">{t.actionItems.length}</Pill>
          </div>
          {t.actionItems.map((a, i) => {
            const u = userMap[a.who];
            return (
              <div key={i} className="action-item">
                <span style={{
                  width: 16, height: 16, borderRadius: 4,
                  border: "1.5px solid var(--line-strong)", flex: "none", marginTop: 2
                }} />
                <div className="col" style={{ flex: 1 }}>
                  <span style={{ fontSize: 13.5 }}>{a.text}</span>
                  {u && <span className="muted" style={{ fontSize: 12.5 }}>→ {u.name.split(" ")[0]}</span>}
                </div>
                <button className="btn sm ghost"
                  onClick={() => window.openNewTask?.({ client: clientName, defaults: { title: a.text, assignee: a.who } })}
                  title="Create task from this action item">
                  <Icon k="plus" /> Task
                </button>
              </div>
            );
          })}
        </div>
      )}

      {t.keyMoments?.length > 0 && (
        <div className="sub-card">
          <div className="sub-card-title">Key moments</div>
          {t.keyMoments.map((k, i) => (
            <div key={i} className="key-moment">
              <span className="mono" style={{ fontSize: 12.5, color: "var(--accent)", minWidth: 44 }}>{k.t}</span>
              <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{k.text}</span>
            </div>
          ))}
        </div>
      )}

      {t.excerpt && (
        <div className="sub-card">
          <div className="row" style={{ marginBottom: 6 }}>
            <span className="sub-card-title" style={{ margin: 0, flex: 1 }}>Transcript excerpt</span>
            <button className="btn sm ghost" onClick={() => setShowFull(s => !s)}>
              {showFull ? "Collapse" : "Expand"}
            </button>
          </div>
          <pre className={`transcript-excerpt ${showFull ? "full" : ""}`}>{t.excerpt}</pre>
        </div>
      )}
    </div>
  );
}

function UploadTranscriptModal({ client, role, onClose, onUploaded }) {
  const [draft, setDraft] = React.useState({
    title: "", when: new Date().toISOString().slice(0, 16).replace("T", " · "),
    duration: 30, attendees: "", summary: "", excerpt: ""
  });
  const submit = () => {
    if (!draft.title || (!draft.summary && !draft.excerpt)) return;
    const t = window.PPC.store.addTranscript(client, {
      title: draft.title, when: draft.when, duration: parseInt(draft.duration) || 30,
      attendees: draft.attendees.split(",").map(s => s.trim()).filter(Boolean),
      summary: draft.summary, excerpt: draft.excerpt,
      actionItems: [], keyMoments: [],
      source: "Manual upload", uploadedBy: role.id
    });
    window.toast?.(`Transcript saved: ${t.title}`, { icon: "📄" });
    onUploaded?.(t);
  };
  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal-head">
          <div className="col" style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 12.5 }}>{client}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>
              Upload <em style={{ color: "var(--accent)", fontStyle: "italic" }}>transcript</em>
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>
        <div className="modal-body">
          <div className="sub-card" style={{ background: "var(--card-2)", border: "1px dashed var(--line-strong)" }}>
            <div className="row gap-2">
              <Icon k="doc" />
              <div className="col" style={{ flex: 1 }}>
                <strong style={{ fontSize: 13.5 }}>Paste your transcript</strong>
                <span className="muted" style={{ fontSize: 12.5 }}>
                  We don't process audio yet — paste the text from your meeting tool (Otter, Fathom, Meet caption export).
                </span>
              </div>
            </div>
          </div>
          <Field label="Title"><input className="input" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="e.g. Weekly sync — Sable Island listing" /></Field>
          <div className="row gap-2">
            <Field label="When"><input className="input mono" value={draft.when} onChange={e => setDraft(d => ({ ...d, when: e.target.value }))} /></Field>
            <Field label="Duration (min)"><input className="input mono" value={draft.duration} onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))} /></Field>
          </div>
          <Field label="Attendees (comma-separated)"><input className="input" value={draft.attendees} onChange={e => setDraft(d => ({ ...d, attendees: e.target.value }))} placeholder="e.g. Jess Cormier, Vihar Patel, Harsh Mehta" /></Field>
          <Field label="One-line summary"><input className="input" value={draft.summary} onChange={e => setDraft(d => ({ ...d, summary: e.target.value }))} placeholder="What was the meeting about?" /></Field>
          <Field label="Transcript text"><textarea className="textarea" rows={8} value={draft.excerpt} onChange={e => setDraft(d => ({ ...d, excerpt: e.target.value }))} placeholder="Paste the full transcript or an excerpt…" /></Field>
        </div>
        <div className="modal-foot">
          <div style={{ flex: 1 }} />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!draft.title || (!draft.summary && !draft.excerpt)} onClick={submit}>
            Save transcript
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VaultTab, DriveTab, TranscriptsTab });
