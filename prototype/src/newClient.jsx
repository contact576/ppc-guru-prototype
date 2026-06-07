/* ─────────────────────────────────────────────────────────────────
   NewClientModal — create an onboarding card + full profile in one go.
   Opened via window.openNewClient().
   ───────────────────────────────────────────────────────────────── */

function NewClientModal({ open, role, onClose }) {
  const { userMap, store, SERVICE_INFO } = window.PPC;
  const access = window.PPC.ROLE_ACCESS[role.id];
  const [step, setStep] = React.useState(0);
  const [f, setF] = React.useState(initial());

  function initial() {
    return {
      name: "",
      service: "meta",
      niche: "",
      currency: "CAD",
      mrr: "",
      contact: { name: "", role: "", email: "", phone: "", timezone: "Eastern (UTC-5)", pref: "Email" },
      brief: { overview: "", audience: "", goals: "", usps: "", avoid: "", geo: "", brandKit: "" },
      owners: { am: "vihar", ads: "harsh", creative: "vanshika" }
    };
  }

  React.useEffect(() => { if (open) { setStep(0); setF(initial()); } }, [open]);

  if (!open) return null;

  const setField = (path, v) => {
    setF(prev => {
      const next = { ...prev };
      const parts = path.split(".");
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...cur[parts[i]] };
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = v;
      return next;
    });
  };

  const submit = () => {
    if (!f.name.trim()) { window.toast?.("Client name required", { icon: "!" }); setStep(0); return; }
    const card = store.addClient({
      name: f.name.trim(),
      service: f.service,
      niche: f.niche || "—",
      currency: f.currency,
      mrr: access.money && f.mrr ? Number(f.mrr) : null,
      contact: f.contact,
      brief: {
        overview: f.brief.overview,
        audience: f.brief.audience.split("\n").map(s => s.trim()).filter(Boolean),
        goals: f.brief.goals.split("\n").map(s => s.trim()).filter(Boolean),
        usps: f.brief.usps.split("\n").map(s => s.trim()).filter(Boolean),
        avoid: f.brief.avoid.split("\n").map(s => s.trim()).filter(Boolean),
        geo: f.brief.geo || "—",
        brandKit: f.brief.brandKit || "—"
      },
      owners: {
        am: f.owners.am,
        ads: f.service === "smm" ? null : f.owners.ads,
        creative: f.service === "google" ? null : f.owners.creative
      }
    });
    window.toast?.(`${f.name} added · onboarding card created`, { icon: "✓" });
    onClose();
    setTimeout(() => window.openClientPanel?.(card.id), 200);
  };

  const steps = ["Basics", "Contact", "Brief", "Squad"];

  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target.classList.contains("modal-scrim")) onClose(); }}>
      <div className="modal wide">
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <div className="label">New client</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500, marginTop: 2 }}>
              Add a client to <em style={{ color: "var(--accent)" }}>onboarding</em>
            </div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
              Lands in stage 2 (Form Received). Default owner gets a task + notification automatically.
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}><Icon k="close" /></button>
        </div>

        {/* steppers */}
        <div className="row" style={{ padding: "10px 22px", borderBottom: "1px solid var(--line)", background: "var(--card-2)" }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="row gap-2" style={{ flex: "0 0 auto", cursor: "pointer", opacity: i > step ? .55 : 1 }} onClick={() => setStep(i)}>
                <span style={{
                  width: 22, height: 22, borderRadius: 999,
                  background: i < step ? "var(--ok)" : i === step ? "var(--accent)" : "var(--card)",
                  color: i <= step ? "#fff" : "var(--ink-4)",
                  border: i === step ? "none" : "1px solid var(--line-strong)",
                  display: "grid", placeItems: "center", fontSize: 12.5, fontWeight: 600
                }}>{i < step ? "✓" : i + 1}</span>
                <span style={{ fontSize: 13.5, fontWeight: i === step ? 500 : 400 }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: "var(--line)", margin: "0 12px" }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="modal-body">
          {step === 0 && (
            <>
              <Field label="Client name" full>
                <input className="input serif" placeholder="e.g. Stonebridge Roofing" value={f.name} onChange={e => setField("name", e.target.value)} autoFocus />
              </Field>
              <Field label="Service" full hint="Picks which onboarding pipeline this client enters.">
                <div className="row gap-2">
                  {Object.entries(SERVICE_INFO).map(([id, info]) => (
                    <span key={id} className={`chip-pick ${f.service === id ? "on" : ""}`} onClick={() => setField("service", id)}>
                      <span style={{ width: 7, height: 7, background: info.color, borderRadius: 999, display: "inline-block" }} />
                      {info.label}
                    </span>
                  ))}
                </div>
              </Field>
              <div className="field-row">
                <Field label="Niche / industry">
                  <TextInput placeholder="e.g. Construction" value={f.niche} onChange={e => setField("niche", e.target.value)} />
                </Field>
                <Field label="Currency">
                  <SelectInput value={f.currency} onChange={e => setField("currency", e.target.value)}>
                    <option>CAD</option><option>USD</option>
                  </SelectInput>
                </Field>
              </div>
              {access.money && (
                <Field label="Expected MRR" hint="Owner-only field. Leave blank if not yet committed.">
                  <TextInput placeholder="2500" value={f.mrr} onChange={e => setField("mrr", e.target.value.replace(/[^0-9]/g, ""))} />
                </Field>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <div className="field-row">
                <Field label="Primary contact — name">
                  <TextInput value={f.contact.name} onChange={e => setField("contact.name", e.target.value)} placeholder="Jess Cormier" />
                </Field>
                <Field label="Role">
                  <TextInput value={f.contact.role} onChange={e => setField("contact.role", e.target.value)} placeholder="Marketing Director" />
                </Field>
              </div>
              <div className="field-row">
                <Field label="Email">
                  <TextInput value={f.contact.email} onChange={e => setField("contact.email", e.target.value)} placeholder="jess@example.com" />
                </Field>
                <Field label="Phone">
                  <TextInput value={f.contact.phone} onChange={e => setField("contact.phone", e.target.value)} placeholder="+1 416 555 0000" />
                </Field>
              </div>
              <div className="field-row">
                <Field label="Timezone">
                  <SelectInput value={f.contact.timezone} onChange={e => setField("contact.timezone", e.target.value)}>
                    {["Pacific (UTC-8)","Mountain (UTC-7)","Central (UTC-6)","Eastern (UTC-5)","Atlantic (UTC-4)","UTC","Europe (UTC+1)","India (UTC+5:30)","UAE (UTC+4)"].map(t => <option key={t}>{t}</option>)}
                  </SelectInput>
                </Field>
                <Field label="Preferred channel">
                  <SelectInput value={f.contact.pref} onChange={e => setField("contact.pref", e.target.value)}>
                    {["Email","Phone","WhatsApp","Slack","DM / Instagram"].map(t => <option key={t}>{t}</option>)}
                  </SelectInput>
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Business overview" full hint="A paragraph an outsider could read and understand the business.">
                <Textarea value={f.brief.overview} onChange={e => setField("brief.overview", e.target.value)} placeholder="What do they sell, where, to whom, what's special?" style={{ minHeight: 100 }} />
              </Field>
              <div className="field-row">
                <Field label="Target audience" hint="One per line">
                  <Textarea value={f.brief.audience} onChange={e => setField("brief.audience", e.target.value)} placeholder={"Homeowners 40-65\nLot owners\n..."} />
                </Field>
                <Field label="Goals" hint="One per line">
                  <Textarea value={f.brief.goals} onChange={e => setField("brief.goals", e.target.value)} placeholder={"10 consults / mo\nCPA below $40\n..."} />
                </Field>
              </div>
              <div className="field-row">
                <Field label="USPs" hint="One per line">
                  <Textarea value={f.brief.usps} onChange={e => setField("brief.usps", e.target.value)} placeholder="What only they can claim" />
                </Field>
                <Field label="Avoid" hint="What NOT to do (one per line)">
                  <Textarea value={f.brief.avoid} onChange={e => setField("brief.avoid", e.target.value)} placeholder="Compliance, brand guardrails" />
                </Field>
              </div>
              <div className="field-row">
                <Field label="Geography">
                  <TextInput value={f.brief.geo} onChange={e => setField("brief.geo", e.target.value)} placeholder="e.g. GTA West" />
                </Field>
                <Field label="Brand kit URL">
                  <TextInput value={f.brief.brandKit} onChange={e => setField("brief.brandKit", e.target.value)} placeholder="drive.google.com/…" />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>
                Default squad based on service. You can override here. The Account Manager owns the relationship; Ads & Creative split production.
              </div>
              <Field label="Account Manager">
                <UserSelect value={f.owners.am} onChange={(id) => setField("owners.am", id)}
                  users={window.PPC.USERS.filter(u => ["jaydeep","dhaval","vihar","abhishek"].includes(u.id))} />
              </Field>
              {f.service !== "smm" && (
                <Field label="Ads Manager">
                  <UserSelect value={f.owners.ads} onChange={(id) => setField("owners.ads", id)}
                    users={window.PPC.USERS.filter(u => u.id === "harsh")} />
                </Field>
              )}
              {f.service !== "google" && (
                <Field label="Creative Manager">
                  <UserSelect value={f.owners.creative} onChange={(id) => setField("owners.creative", id)}
                    users={window.PPC.USERS.filter(u => u.id === "vanshika")} />
                </Field>
              )}
              <div className="sub-card" style={{ marginTop: 14 }}>
                <div className="sub-card-title">What happens next</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  <div>1. Card lands in <strong>{f.service === "meta" ? "Form Received" : f.service === "google" ? "Form Received" : "Initial Meeting & Access"}</strong>.</div>
                  <div>2. Default owner (<strong>{userMap[f.service === "smm" ? f.owners.creative : f.owners.ads]?.name.split(" ")[0]}</strong>) gets a task + notification.</div>
                  <div>3. You can open the client profile and add notes, files, and meeting outcomes right away.</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-foot">
          <span className="muted" style={{ fontSize: 12.5, flex: 1 }}>Step {step + 1} of {steps.length}</span>
          {step > 0 && <button className="btn ghost" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < steps.length - 1 && <button className="btn primary" onClick={() => setStep(s => s + 1)}>Continue</button>}
          {step === steps.length - 1 && <button className="btn primary" onClick={submit}>Create client</button>}
        </div>
      </div>
    </div>
  );
}

window.NewClientModal = NewClientModal;
