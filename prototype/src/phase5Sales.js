/* phase5Sales.js — Sales segment data model (redesign), additive on window.PPC.S5
 *
 * Mirrors how PPC Guru actually sells (see approved plan):
 *   Lead → Deal pipeline (per service) → WIN (client agrees) → Onboarding card
 *   + 30-day DEFERRED-payment trial (not free; $0 billed until conversion) →
 *   conversion meeting → PAYING (setup fee + first month, then monthly).
 *
 * The funnel is mostly DERIVED from real window.PPC.LIVE data:
 *   Leads   = LIVE.BRIEFS (real Google-Form intake) + a few sample multi-source leads
 *   Trials  = LIVE.CLIENTS where status === "on_trial"  (real)
 *   Paying  = LIVE.CLIENTS where status === "paid_client" (real)
 *   Deals   = seeded in-flight pipeline (Zoho deals weren't captured) + Convert output
 *
 * One rep (Abhishek). Service area = all of Canada. Weekday SLA (<4h), weekends off.
 */
(function () {
  const LIVE = (window.PPC && window.PPC.LIVE) || { BRIEFS: [], CLIENTS: [] };
  const hash = (s) => { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const SALES_TODAY = "2026-06-05";

  // ---------- Source + stage definitions ----------
  // Every lead originates from Meta ads via two routes (Instant Form → Zoho, or
  // WhatsApp click-to-chat → manual connect). Referral is the only non-Meta source.
  // NOTE: the Google Form is NOT a lead source — it's the trial-intake form sent
  // AFTER a lead agrees to the trial (see gform* fields + winDeal). A filled form
  // is the north-star daily KPI: a real prospect committing to a trial.
  const SOURCE_DEFS = {
    "instant-form": { label: "Instant Form", short: "Meta lead form → Zoho", kind: "accent", meta: true },
    "whatsapp":     { label: "WhatsApp",     short: "Meta click-to-chat → manual", kind: "ok", meta: true },
    "referral":     { label: "Referral",     short: "word of mouth", kind: "outline", meta: false },
  };
  const SOURCE_IDS = ["instant-form", "whatsapp", "referral"];

  // Deal pipeline stages (per service). prob = win probability. flag tints column.
  const STAGE5 = [
    { id: "s5-interested",  name: "Interested",            prob: 15, flag: null },
    { id: "s5-booked",      name: "Meeting Booked",        prob: 25, flag: null },
    { id: "s5-noshow",      name: "No Show",               prob: 30, flag: "warn" },
    { id: "s5-met",         name: "Meeting Completed",     prob: 50, flag: null, feeGate: true },
    { id: "s5-negotiation", name: "Negotiation",           prob: 60, flag: null },
    { id: "s5-proposal",    name: "Proposal / Pricing Sent", prob: 70, flag: null, convertEntry: true },
    { id: "s5-awaiting",    name: "Awaiting Approval",     prob: 80, flag: null },
    { id: "s5-won",         name: "Won → Onboarding",      prob: 95, flag: "ok", win: true },
    { id: "s5-trial",       name: "Trial Started",         prob: 100, flag: "ok", trial: true },
    { id: "s5-later",       name: "Reach Out Later",       prob: 10, flag: null, parked: true },
    { id: "s5-lost",        name: "Closed Lost",           prob: 0,  flag: null, dead: true },
    { id: "s5-ghosting",    name: "Ghosting",              prob: 5,  flag: "danger" },
  ];
  const stageById = (id) => STAGE5.find((s) => s.id === id) || null;
  const FEE_RANGE = { min: 375, max: 2400 };
  const SVC_NAME = { meta: "Meta", google: "Google", smm: "SMM", influencer: "Influencer" };
  const stageIndex = (id) => STAGE5.findIndex((s) => s.id === id);

  // ---------- Weekday SLA helpers (weekends off; target <4h) ----------
  const isWeekend = (iso) => { const d = new Date(iso + "T12:00:00").getDay(); return d === 0 || d === 6; };
  const slaTargetHrs = 4;            // weekday target
  // SLA clock starts Monday for Fri/Sat/Sun arrivals
  function slaClockStart(iso) {
    const d = new Date(iso + "T09:00:00");
    let day = d.getDay();
    if (day === 6) d.setDate(d.getDate() + 2);     // Sat → Mon
    else if (day === 0) d.setDate(d.getDate() + 1); // Sun → Mon
    else if (day === 5) {} // Friday handled by arrival time; demo treats Fri pm → Mon
    return d.toISOString().slice(0, 10);
  }

  // ---------- Build Leads from real intake ----------
  const isTestRow = (b) => /test|testing|wiring test|acme/i.test(b.business + " " + b.contact + " " + b.email);
  function serviceCodesFromText(t) {
    const out = []; t = (t || "").toLowerCase();
    if (t.includes("meta")) out.push("meta");
    if (t.includes("google")) out.push("google");
    if (t.includes("social") || t.includes("smm")) out.push("smm");
    if (t.includes("influencer")) out.push("influencer");
    return out.length ? out : ["google"];
  }
  function buildLeads() {
    const seen = new Map(); // dedupe by business+email
    const leads = [];
    LIVE.BRIEFS.forEach((b, i) => {
      const key = (b.business + "|" + b.email).toLowerCase().replace(/\s+/g, "");
      const dupOf = seen.has(key) ? seen.get(key) : null;
      const id = "L5-" + (i + 1);
      if (!seen.has(key)) seen.set(key, id);
      const test = isTestRow(b);
      const h = hash(id);
      // Source: all Meta-originated. Mostly Instant Form + WhatsApp, a few Referral.
      const source = (h % 7 === 0) ? "referral" : (h % 2 === 0 ? "instant-form" : "whatsapp");
      // derive quality/status deterministically from real signals
      let quality, status;
      if (test) { quality = "scrap"; status = "Not Qualified"; }
      else if (b.linked) { quality = "good"; status = "Converted"; }      // already became a client
      else if (b.budget) { quality = (h % 3 === 0) ? "good" : "attempting"; status = (h % 2 ? "Attempted" : "Contacted"); }
      else { quality = (h % 4 === 0) ? "scrap" : "new"; status = "Not Contacted"; }
      // Google Form = trial-intake step. A linked/converted lead already filled it.
      const gformSubmitted = !!b.linked;
      leads.push({
        id, name: b.contact, company: b.business, email: b.email,
        phone: "", source, manualEntry: source === "whatsapp",
        quality, callAttempts: status === "Attempted" ? (h % 3) + 1 : 0, status,
        province: "—", inCanada: true,
        budget: (typeof b.budget === "number" && b.budget > 0) ? b.budget : null,
        niche: b.type || "", services: serviceCodesFromText(b.services),
        created: b.received, lastTouch: b.received,
        nextActionDate: status === "Converted" || quality === "scrap" ? null : SALES_TODAY,
        linkedClient: b.linked || null, dupOf, convertedDealIds: [],
        gformSubmitted, gformAt: gformSubmitted ? b.received : null,
        slaStart: slaClockStart(b.received),
        weekendArrival: isWeekend(b.received),
      });
    });
    // a few SAMPLE multi-source leads (instant-form / whatsapp / referral) to exercise
    // the source UI. The referral has already filled the Google Form today (trial KPI).
    const samples = [
      { name: "Daniel Okafor", company: "Northside HVAC", source: "instant-form", budget: 1500, niche: "HVAC", services: ["meta"] },
      { name: "Priya Nair", company: "Bloom Dental Studio", source: "instant-form", budget: 900, niche: "Dental", services: ["google"] },
      { name: "Marc Tremblay", company: "Tremblay Roofing", source: "whatsapp", budget: null, niche: "Roofing", services: ["meta", "google"] },
      { name: "Aisha Khan", company: "Cedar Lane Realty", source: "whatsapp", budget: 750, niche: "Real Estate", services: ["meta"] },
      { name: "Ravi Deshpande", company: "Spice Route Catering", source: "referral", budget: 600, niche: "Catering", services: ["smm"], gformToday: true },
    ];
    samples.forEach((s, i) => {
      const id = "L5-s" + (i + 1);
      leads.push({
        id, name: s.name, company: s.company, email: s.company.toLowerCase().replace(/[^a-z]/g, "") + "@example.ca",
        phone: "", source: s.source, manualEntry: s.source === "whatsapp" && i % 2 === 0,
        quality: s.gformToday ? "good" : (i % 2 ? "good" : "new"), callAttempts: 0,
        status: s.gformToday ? "Contacted" : (i % 2 ? "Contacted" : "Not Contacted"),
        province: "ON", inCanada: true, budget: s.budget, niche: s.niche, services: s.services,
        created: SALES_TODAY, lastTouch: SALES_TODAY, nextActionDate: SALES_TODAY,
        linkedClient: null, dupOf: null, convertedDealIds: [], sample: true,
        gformSubmitted: !!s.gformToday, gformAt: s.gformToday ? SALES_TODAY : null,
        slaStart: slaClockStart(SALES_TODAY), weekendArrival: isWeekend(SALES_TODAY),
      });
    });
    // seed an activity log on every lead (created → gform → converted)
    leads.forEach((l) => {
      const base = (l.created || SALES_TODAY);
      l.log = [{ kind: "stage", when: base + "T09:00:00", title: "Lead created", body: "Captured via " + ((SOURCE_DEFS[l.source] || {}).label || l.source) }];
      if (l.status === "Attempted") l.log.push({ kind: "call-miss", when: base + "T11:30:00", title: "Outbound call · no answer", body: "Attempt " + (l.callAttempts || 1) });
      if (l.status === "Contacted") l.log.push({ kind: "call-out", when: base + "T11:30:00", title: "Outbound call · connected", body: "Qualified — interested" });
      if (l.gformAt) l.log.push({ kind: "stage", when: l.gformAt + "T14:00:00", title: "Google Form submitted", body: "Agreed to trial — onboarding intake filled" });
      if (l.status === "Converted") l.log.push({ kind: "stage", when: base + "T15:00:00", title: "Converted", body: l.linkedClient ? "Now client: " + l.linkedClient : "Deal(s) created" });
    });
    return leads;
  }

  // ---------- Seed in-flight deals (Zoho deals weren't captured) ----------
  // Drawn from real unmatched recent briefs that are NOT yet clients.
  function seedDeals() {
    const D = (id, company, contact, service, stageId, fee, src, currency) => ({
      id, company, contact, email: "", phone: "", fromLeadId: null, service,
      stage: stageId, source: src || "instant-form", currency: currency || "CAD",
      monthlyFee: fee, setupFee: fee ? Math.round(fee * 0.5) : null, feeNeedsSet: !fee,
      prob: stageById(stageId)?.prob ?? 0, nextActionDate: SALES_TODAY,
      payingClient: false, wonAt: null, trialStart: null, trialEndsAt: null,
      conversionMeetingAt: null, paidAt: null, onboardingCardId: null, createdAt: SALES_TODAY,
    });
    return [
      D("D5-1", "Maplewood Coffee Roasters", "Jordan Mitchell", "google", "s5-negotiation", 5000, "instant-form"),
      D("D5-2", "N&N Brothers Moving", "Nazeer Ahmad", "google", "s5-booked", null, "whatsapp"),
      D("D5-3", "Gokaddal Inc", "Ravinder Singh", "google", "s5-ghosting", null, "instant-form"),
      D("D5-4", "Demetrius Bridges", "Zena Holland", "google", "s5-interested", null, "whatsapp"),
      D("D5-5", "Northside HVAC", "Daniel Okafor", "meta", "s5-proposal", 1500, "instant-form"),
      D("D5-6", "Bombay Chaat Saskatoon", "Ankita Dhameliya", "google", "s5-later", null, "referral"),
      D("D5-7", "Cedar Lane Realty", "Aisha Khan", "meta", "s5-met", null, "whatsapp"),
    ];
  }

  // ---------- Trials & paying derived from real LIVE.CLIENTS ----------
  function trialDeals() {
    // real on_trial clients become trial-stage deals
    return LIVE.CLIENTS.filter((c) => c.status === "on_trial").map((c) => {
      const svc = (c.services && c.services[0]) || "meta";
      const svcMap = { g: "google", m: "meta", s: "smm" };
      const start = "2026-05-20"; // demo trial start
      return {
        id: "DT-" + c.id, company: c.company, contact: c.contact, service: svcMap[svc] || "meta",
        stage: "s5-trial", source: "instant-form", currency: "CAD",
        gformAt: start,
        monthlyFee: c.mrr || 600, setupFee: Math.round((c.mrr || 600) * 0.5), feeNeedsSet: false,
        prob: 100, payingClient: false, wonAt: start, trialStart: start,
        trialEndsAt: "2026-06-19", conversionMeetingAt: "2026-06-18", paidAt: null,
        onboardingCardId: null, createdAt: start, real: true,
      };
    });
  }

  // ---------- Mutable store + mutations ----------
  const state = { leads: buildLeads(), deals: seedDeals().concat(trialDeals()) };
  // seed an activity log on every deal (created → trial, if applicable)
  state.deals.forEach((d) => {
    d.log = [{ kind: "stage", when: (d.createdAt || SALES_TODAY) + "T09:00:00", title: "Deal created", body: (SVC_NAME[d.service] || d.service) + " · " + ((stageById(d.stage) || {}).name || d.stage) }];
    if (d.trialStart) d.log.push({ kind: "stage", when: d.trialStart + "T10:00:00", title: "Trial started", body: "30-day deferred-payment trial — onboarding card created" });
  });
  function bump() {
    try { window.PPC.store && window.PPC.store.bump && window.PPC.store.bump(); } catch (e) {}
    window.dispatchEvent(new Event("ppc:update"));
  }
  function pushLog(entity, evt) { if (!entity) return; if (!entity.log) entity.log = []; entity.log.push(evt); }
  function nowStamp() { return SALES_TODAY + "T12:00:00"; }
  function leadById(id) { return state.leads.find((l) => l.id === id); }
  function dealById(id) { return state.deals.find((d) => d.id === id); }

  // Convert a lead → per-service deal(s) at Proposal/Pricing Sent
  function convertLead(leadId) {
    const lead = leadById(leadId); if (!lead) return;
    const currency = lead.inCanada ? "CAD" : "USD";
    const svcs = lead.services && lead.services.length ? lead.services : ["meta"];
    svcs.forEach((svc, i) => {
      const id = "D5-c" + hash(leadId + svc).toString(36).slice(0, 5);
      state.deals.unshift({
        id, company: lead.company, contact: lead.name, email: lead.email, phone: lead.phone,
        fromLeadId: leadId, service: svc, stage: "s5-proposal", source: lead.source, currency,
        monthlyFee: lead.budget || null, setupFee: lead.budget ? Math.round(lead.budget * 0.5) : null,
        feeNeedsSet: !lead.budget, prob: 70, nextActionDate: SALES_TODAY,
        payingClient: false, wonAt: null, trialStart: null, trialEndsAt: null,
        conversionMeetingAt: null, paidAt: null, onboardingCardId: null, createdAt: SALES_TODAY,
        log: [{ kind: "stage", when: nowStamp(), title: "Deal created from lead", body: (SVC_NAME[svc] || svc) + " · Proposal / Pricing Sent · " + currency }],
      });
      lead.convertedDealIds.push(id);
    });
    lead.status = "Converted"; lead.nextActionDate = null;
    pushLog(lead, { kind: "stage", when: nowStamp(), title: "Converted to deal", body: svcs.map((s) => SVC_NAME[s] || s).join(" + ") + " · " + svcs.length + " deal(s)" });
    window.toast && window.toast(`${lead.company} → ${svcs.length} deal(s) created`, { icon: "check" });
    bump();
  }

  // Advance a deal to a stage; firing win→onboarding when reaching the win stage
  function setDealStage(dealId, stageId) {
    const deal = dealById(dealId); if (!deal) return;
    const st = stageById(stageId); if (!st) return;
    // fee gate: cannot pass Meeting Completed without a fee
    const order = STAGE5.findIndex((s) => s.id === stageId);
    const metIdx = STAGE5.findIndex((s) => s.id === "s5-met");
    if (order > metIdx && deal.feeNeedsSet) {
      window.toast && window.toast("Set the monthly fee before advancing past Meeting Completed", { icon: "alert" });
      return;
    }
    const prevName = ((stageById(deal.stage) || {}).name) || deal.stage;
    deal.stage = stageId; deal.prob = st.prob;
    if (st.win && !deal.wonAt) { winDeal(dealId); return; }
    pushLog(deal, { kind: "stage", when: nowStamp(), title: "Stage → " + st.name, body: prevName + " → " + st.name + " · " + st.prob + "% win" });
    bump();
  }

  // WIN → client agrees → Google Form sent + filled → onboarding card + 30-day trial.
  // The Google Form is the trial-intake step: filling it is what creates the kanban card.
  function winDeal(dealId) {
    const deal = dealById(dealId); if (!deal) return;
    deal.wonAt = SALES_TODAY;
    deal.gformAt = SALES_TODAY;          // trial-intake form submitted (north-star event)
    deal.trialStart = SALES_TODAY;
    // mark the originating lead's Google Form as submitted today too
    if (deal.fromLeadId) { const lead = leadById(deal.fromLeadId); if (lead) { lead.gformSubmitted = true; lead.gformAt = SALES_TODAY; } }
    const end = new Date(SALES_TODAY + "T12:00:00"); end.setDate(end.getDate() + 30);
    deal.trialEndsAt = end.toISOString().slice(0, 10);
    const meet = new Date(end); meet.setDate(meet.getDate() - 1);
    deal.conversionMeetingAt = meet.toISOString().slice(0, 10);
    deal.stage = "s5-trial"; deal.prob = 100;
    // create onboarding card at first stage of the service pipeline
    const first = { meta: "m1", google: "g1", smm: "s1", influencer: "s1" }[deal.service] || "m1";
    const cardId = "c-" + deal.service + "-d" + hash(dealId).toString(36).slice(0, 4);
    deal.onboardingCardId = cardId;
    try {
      window.PPC.ONB_CARDS.push({
        id: cardId, name: deal.company, service: deal.service, stage: first, days: 0,
        niche: "", blocker: null, designer: null, override: null, fromDeal: dealId,
      });
    } catch (e) {}
    pushLog(deal, { kind: "stage", when: nowStamp(), title: "Won → Onboarding", body: "Client agreed — moved to Trial Started (100%)" });
    pushLog(deal, { kind: "stage", when: SALES_TODAY + "T12:05:00", title: "Google Form sent + filled", body: "Trial-intake form completed — onboarding card created" });
    pushLog(deal, { kind: "stage", when: SALES_TODAY + "T12:10:00", title: "30-day trial started", body: "Trial ends " + deal.trialEndsAt + " · conversion meeting " + deal.conversionMeetingAt });
    window.toast && window.toast(`${deal.company} → Google Form filled · Onboarding card created · 30-day trial started`, { icon: "check" });
    bump();
  }

  // Set the real monthly fee on a deal (clears the fee-gate). Setup = 50% of monthly.
  function setDealFee(dealId, monthlyFee) {
    const deal = dealById(dealId); if (!deal) return;
    const fee = Number(monthlyFee);
    if (!fee || fee <= 0) return;
    deal.monthlyFee = fee;
    deal.setupFee = Math.round(fee * 0.5);
    deal.feeNeedsSet = false;
    pushLog(deal, { kind: "stage", when: nowStamp(), title: "Fee set", body: deal.currency + " " + fee.toLocaleString() + "/mo + " + deal.currency + " " + deal.setupFee.toLocaleString() + " setup" });
    window.toast && window.toast(`${deal.company} fee set — ${deal.currency} ${fee.toLocaleString()}/mo`, { icon: "check" });
    bump();
  }

  // Trial → Paying (setup fee + first month, then monthly)
  function markPaying(dealId) {
    const deal = dealById(dealId); if (!deal) return;
    deal.payingClient = true; deal.paidAt = SALES_TODAY; deal.stage = "s5-trial";
    pushLog(deal, { kind: "stage", when: nowStamp(), title: "Converted to PAYING", body: "Setup " + (deal.currency) + " " + (deal.setupFee || 0).toLocaleString() + " + first month " + deal.currency + " " + (deal.monthlyFee || 0).toLocaleString() + " billed" });
    window.toast && window.toast(`${deal.company} converted to PAYING — setup + first month billed`, { icon: "check" });
    bump();
  }

  function mergeDuplicate(leadId) {
    const lead = leadById(leadId); if (!lead || !lead.dupOf) return;
    lead.status = "Not Qualified"; lead.quality = "scrap"; lead.merged = true;
    pushLog(lead, { kind: "stage", when: nowStamp(), title: "Merged duplicate", body: "Merged into " + lead.dupOf });
    window.toast && window.toast(`Merged ${lead.company} into ${lead.dupOf}`, { icon: "check" });
    bump();
  }

  // ---------- Lead actions (used by the lead detail panel) ----------
  function logCall(leadId, connected, note) {
    const l = leadById(leadId); if (!l) return;
    l.callAttempts = (l.callAttempts || 0) + 1; l.lastTouch = SALES_TODAY;
    if (connected) {
      if (l.status === "Not Contacted" || l.status === "Attempted") l.status = "Contacted";
      if ((l.callAttempts >= 2 || l.status === "Contacted") && l.quality !== "scrap") l.quality = "good";
      pushLog(l, { kind: "call-out", when: nowStamp(), title: "Outbound call · connected", body: note || ("Spoke with " + l.name) });
    } else {
      if (l.status === "Not Contacted") l.status = "Attempted";
      if (l.callAttempts >= 4 && l.quality !== "good") { l.quality = "scrap"; l.status = "Not Qualified"; l.nextActionDate = null; }
      pushLog(l, { kind: "call-miss", when: nowStamp(), title: "Outbound call · no answer", body: note || ("Attempt " + l.callAttempts + (l.quality === "scrap" ? " — marked scrap (no response)" : "")) });
    }
    window.toast && window.toast(connected ? `Call logged — ${l.company} contacted` : `No answer logged — attempt ${l.callAttempts}`, { icon: "phone" });
    bump();
  }
  function logWhatsApp(leadId, text) {
    const l = leadById(leadId); if (!l) return;
    l.lastTouch = SALES_TODAY;
    if (l.status === "Not Contacted" || l.status === "Attempted") l.status = "Contacted";
    if (l.quality === "new" || l.quality === "scrap") l.quality = "good";
    pushLog(l, { kind: "wa-thread", when: nowStamp(), title: "WhatsApp", body: text || "Message exchanged", sample: true,
      bubbles: [{ dir: "out", text: text || "Hi! Thanks for reaching out — when's a good time for a quick call?", time: "12:00" }] });
    window.toast && window.toast(`WhatsApp logged — ${l.company}`, { icon: "check" });
    bump();
  }
  function markContacted(leadId) {
    const l = leadById(leadId); if (!l) return;
    l.status = "Contacted"; l.lastTouch = SALES_TODAY; if (l.quality === "new") l.quality = "attempting";
    pushLog(l, { kind: "stage", when: nowStamp(), title: "Marked contacted", body: "" });
    bump();
  }
  function markScrap(leadId) {
    const l = leadById(leadId); if (!l) return;
    l.quality = "scrap"; l.status = "Not Qualified"; l.nextActionDate = null;
    pushLog(l, { kind: "stage", when: nowStamp(), title: "Marked scrap", body: "No response / not qualified" });
    window.toast && window.toast(`${l.company} marked scrap`, { icon: "check" });
    bump();
  }
  function setLeadNextAction(leadId, date) {
    const l = leadById(leadId); if (!l) return;
    l.nextActionDate = date || null;
    pushLog(l, { kind: "stage", when: nowStamp(), title: "Next action set", body: date || "cleared" });
    bump();
  }
  function addLeadNote(leadId, text) {
    const l = leadById(leadId); if (!l || !text) return;
    pushLog(l, { kind: "note", when: nowStamp(), title: "Note", body: text });
    bump();
  }
  function leadTimeline(lead) {
    if (!lead) return [];
    const items = (lead.log || []).slice();
    ZOOM_CALLS.filter((c) => c.company === lead.company).forEach((c) => {
      items.push({ kind: c.connected ? (c.direction === "inbound" ? "call-in" : "call-out") : "call-miss",
        when: c.when, title: c.connected ? "Zoom call · " + Math.round(c.durationSec / 60) + "m" : "Zoom call · no answer", body: c.outcome, sample: true });
    });
    return items.sort((a, b) => new Date(b.when) - new Date(a.when));
  }

  // ---------- Deal actions ----------
  function setDealNextAction(dealId, date) {
    const d = dealById(dealId); if (!d) return;
    d.nextActionDate = date || null;
    pushLog(d, { kind: "stage", when: nowStamp(), title: "Next action set", body: date || "cleared" });
    bump();
  }
  function addDealNote(dealId, text) {
    const d = dealById(dealId); if (!d || !text) return;
    pushLog(d, { kind: "note", when: nowStamp(), title: "Note", body: text });
    bump();
  }
  function dealTimeline(deal) {
    if (!deal) return [];
    const items = (deal.log || []).slice();
    ZOOM_CALLS.filter((c) => c.dealId === deal.id).forEach((c) => {
      items.push({ kind: c.connected ? (c.direction === "inbound" ? "call-in" : "call-out") : "call-miss",
        when: c.when, title: c.connected ? "Zoom call · " + Math.round(c.durationSec / 60) + "m" : "Zoom call · no answer", body: c.outcome, sample: true });
    });
    if (deal.fromLeadId) {
      const l = leadById(deal.fromLeadId);
      if (l && l.log) l.log.filter((e) => /created/i.test(e.title)).forEach((e) => items.push(Object.assign({}, e, { body: "(from lead) " + (e.body || "") })));
    }
    return items.sort((a, b) => new Date(b.when) - new Date(a.when));
  }

  // ---------- KPI / funnel helpers ----------
  const workableLeads = () => state.leads.filter((l) => !l.dupOf && l.quality !== "scrap" && l.status !== "Converted");
  function funnel() {
    const leads = state.leads.filter((l) => !l.dupOf);
    const contacted = leads.filter((l) => ["Attempted", "Contacted", "Converted"].includes(l.status)).length;
    // trial-stage deals already include the real on_trial clients — don't double-count
    const trials = state.deals.filter((d) => d.stage === "s5-trial" && !d.payingClient).length;
    const paying = LIVE.CLIENTS.filter((c) => c.status === "paid_client").length;
    return { leads: leads.length, contacted, trials, paying };
  }
  const trialsInFlight = () => state.deals.filter((d) => d.stage === "s5-trial" && !d.payingClient);
  function trialToPaidRate() {
    const paid = LIVE.CLIENTS.filter((c) => c.status === "paid_client").length;
    const trialed = paid + LIVE.CLIENTS.filter((c) => c.status === "on_trial").length;
    return trialed ? Math.round((paid / trialed) * 100) : 0;
  }
  const isToday = (iso) => iso === SALES_TODAY;
  function repToday() {
    // North-star KPI = trial-intake Google Forms submitted today (real prospects
    // committing to a trial). Counts leads that filled the form + deals that won today.
    const gforms = state.leads.filter((l) => isToday(l.gformAt)).length
                 + state.deals.filter((d) => isToday(d.gformAt) && !d.fromLeadId).length;
    return {
      newLeads: state.leads.filter((l) => isToday(l.created)).length,
      followUps: workableLeads().filter((l) => l.nextActionDate && l.nextActionDate <= SALES_TODAY).length,
      slaAtRisk: workableLeads().filter((l) => l.status === "Not Contacted" && !l.weekendArrival).length,
      gformsToday: gforms,
      openDeals: state.deals.filter((d) => !d.payingClient && !["s5-lost", "s5-trial"].includes(d.stage)).length,
      trials: trialsInFlight().length,
    };
  }
  function weightedPipeline() {
    return state.deals
      .filter((d) => !d.payingClient && !["s5-lost"].includes(d.stage))
      .reduce((sum, d) => sum + (d.monthlyFee || 0) * (d.prob / 100), 0);
  }
  function sourceBreakdown() {
    const out = {};
    state.leads.filter((l) => !l.dupOf).forEach((l) => {
      const s = l.source; out[s] = out[s] || { source: s, leads: 0, converted: 0 };
      out[s].leads++; if (l.status === "Converted") out[s].converted++;
    });
    return Object.values(out).map((r) => ({ ...r, rate: r.leads ? Math.round((r.converted / r.leads) * 100) : 0 }));
  }

  // ---------- Zoom Phone calls (the two Zoho gaps: connected+duration, transcript) ----------
  // MOCK / pending real Zoom integration — every row tagged `sample`. Models the two
  // things Zoho can't: (1) did the call actually CONNECT + for how long, (2) auto-synced
  // transcript with summary + action items that can spin off tasks.
  const ZOOM_CALLS = [
    {
      id: "ZC-1", company: "Maplewood Coffee Roasters", contact: "Jordan Mitchell", dealId: "D5-1",
      direction: "outbound", when: SALES_TODAY + "T10:12:00", connected: true, durationSec: 1140,
      outcome: "Discovery — pricing discussed", sample: true,
      transcript: {
        summary: "Jordan wants Google Ads for the new roastery location. Budget ~$5k/mo media; agency fee TBD. Wants a 30-day trial before committing.",
        actionItems: ["Send proposal with $5k media + mgmt fee", "Book conversion call for end of trial", "Confirm Google Ads access"],
        keyMoments: ["02:10 budget confirmed ~$5k", "08:40 asked about trial terms", "17:50 agreed to see a proposal"],
      },
    },
    {
      id: "ZC-2", company: "N&N Brothers Moving", contact: "Nazeer Ahmad", dealId: "D5-2",
      direction: "outbound", when: SALES_TODAY + "T11:30:00", connected: false, durationSec: 0,
      outcome: "No answer — voicemail left", sample: true, transcript: null,
    },
    {
      id: "ZC-3", company: "Cedar Lane Realty", contact: "Aisha Khan", dealId: "D5-7",
      direction: "inbound", when: SALES_TODAY + "T09:05:00", connected: true, durationSec: 420,
      outcome: "WhatsApp lead called back — qualified", sample: true,
      transcript: {
        summary: "Aisha runs a small realty team, wants Meta lead-gen. Asked for case studies. Ontario-based, good fit.",
        actionItems: ["Send 2 realty case studies", "Set the monthly fee (currently unset)"],
        keyMoments: ["01:30 confirmed Ontario", "05:10 asked for case studies"],
      },
    },
    {
      id: "ZC-4", company: "Gokaddal Inc", contact: "Ravinder Singh", dealId: "D5-3",
      direction: "outbound", when: "2026-06-04T15:40:00", connected: false, durationSec: 0,
      outcome: "Ghosting — 3rd unanswered attempt", sample: true, transcript: null,
    },
  ];
  function callStats() {
    const today = ZOOM_CALLS.filter((c) => c.when.slice(0, 10) === SALES_TODAY);
    const connected = ZOOM_CALLS.filter((c) => c.connected);
    const totalSec = connected.reduce((s, c) => s + c.durationSec, 0);
    return {
      today: today.length,
      connected: connected.length,
      total: ZOOM_CALLS.length,
      connectRate: ZOOM_CALLS.length ? Math.round((connected.length / ZOOM_CALLS.length) * 100) : 0,
      avgMin: connected.length ? Math.round(totalSec / connected.length / 60) : 0,
    };
  }

  // ---------- attach ----------
  window.PPC = window.PPC || {};
  window.PPC.S5 = {
    SALES_TODAY, SOURCE_DEFS, SOURCE_IDS, STAGE5, FEE_RANGE, SVC_NAME, stageById, stageIndex, slaTargetHrs,
    state, leadById, dealById, ZOOM_CALLS, callStats,
    convertLead, setDealStage, setDealFee, winDeal, markPaying, mergeDuplicate,
    logCall, logWhatsApp, markContacted, markScrap, setLeadNextAction, addLeadNote, leadTimeline,
    setDealNextAction, addDealNote, dealTimeline,
    workableLeads, funnel, trialsInFlight, trialToPaidRate, repToday,
    weightedPipeline, sourceBreakdown,
  };
})();
