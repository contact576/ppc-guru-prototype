/* PatientROI — MVP1 synthetic data (Stage 0 demo; NO real PHI).
   Modeled directly on DATA_SPINE.md entities so the demo IS the spine made visible.
   Namespace: window.PR.  All money CAD (Ontario clinic). Demo "today" = 2026-06-28. */
(function () {
  const TODAY = "2026-06-28";

  // ── Clinic (tenant) ────────────────────────────────────────────────
  const clinic = {
    clinic_id: "cl-riverbend",
    name: "Riverbend Health Collective",
    city: "Hamilton, ON",
    disciplines: ["Physiotherapy", "Chiropractic", "Massage / RMT"],
    capacity_mode: "growing",          // selects the inbound script variant
    data_region: "ca-central",
    emr_type: "jane",
    insurers_direct_billed: ["Sun Life", "Manulife", "Canada Life", "Blue Cross"],
  };

  // ── Channels (the COST side Jane has no concept of) ────────────────
  // spend + leads → CPA; bookings/paying/revenue come from the linked records.
  const channels = [
    { channel_id: "ch-meta-if",  platform: "Meta",            label: "Meta · Instant Form", spend: 1840, currency: "CAD" },
    { channel_id: "ch-meta-wa",  platform: "Meta",            label: "Meta · WhatsApp",     spend:  620, currency: "CAD" },
    { channel_id: "ch-google",   platform: "Google Ads",      label: "Google Ads · Search", spend: 2150, currency: "CAD" },
    { channel_id: "ch-gbp",      platform: "Google Business", label: "Google Business Profile", spend: 0, currency: "CAD" },
    { channel_id: "ch-referral", platform: "Referral",        label: "Referral / word-of-mouth", spend: 0, currency: "CAD" },
  ];

  // helper: build a transcript quickly
  const T = (...pairs) => pairs.map(([who, text]) => ({ who, text }));

  // ── Calls (Module A) — recovered missed / after-hours / overflow ───
  // handled_by:"ai"; each ties to a channel and (if booked) a lead.
  const calls = [
    {
      call_id: "call-1", lead_id: "ld-1", channel_id: "ch-meta-if",
      datetime: "2026-06-27T21:14:00", after_hours: true, duration_sec: 182,
      caller: "Priya N.", phone: "+1 905-555-0143", discipline: "Physiotherapy",
      new_or_returning: "new", outcome: "booked", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend Health Collective — just so you know, this call may be recorded to help us book your appointment. How can I help you today?"],
        ["caller", "Hi, um, I tweaked my lower back at the gym and I saw your ad. Are you open?"],
        ["agent", "Oh no, sorry to hear about your back — you're in the right place. We're closed for the evening, but I can get you booked right now. Were you looking for physio, chiro, or massage?"],
        ["caller", "Physio I think. I've never been in before."],
        ["agent", "No problem, first visit is easy. Do you have extended health benefits you'd like us to direct-bill? We bill most major plans — Sun Life, Manulife, Canada Life, Blue Cross."],
        ["caller", "Yeah, Sun Life."],
        ["agent", "Perfect, we can submit that for you — you'll just want to confirm your own coverage. Let me grab the next openings… I've got Thursday at 2:15 or Friday at 9:30 — which works better?"],
        ["caller", "Friday morning is good."],
        ["agent", "You're booked for Friday at 9:30. I'll text you a confirmation and an intake link so you can fill it out from home. Can I grab your name and the best number?"],
        ["caller", "Priya, this number's fine."],
        ["agent", "Got it Priya — confirmation's on its way. See you Friday!"],
      ),
    },
    {
      call_id: "call-2", lead_id: "ld-2", channel_id: "ch-google",
      datetime: "2026-06-27T19:42:00", after_hours: true, duration_sec: 151,
      caller: "Marcus D.", phone: "+1 289-555-0178", discipline: "Chiropractic",
      new_or_returning: "new", outcome: "booked", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend Health Collective — this call may be recorded to help book your appointment. How can I help?"],
        ["caller", "Is chiro safe for a pinched nerve? I've never done it. Bit nervous honestly."],
        ["agent", "Totally normal to feel unsure — our chiropractor will walk you through everything first and you can ask questions or stop anytime. Have you been in before, or first visit?"],
        ["caller", "First time."],
        ["agent", "Great. Any extended benefits to direct-bill? We bill Sun Life, Manulife, Canada Life, Blue Cross."],
        ["caller", "Manulife."],
        ["agent", "We'll submit that for you. I've got Monday at 4:00 or Tuesday at 11:30 — which suits you?"],
        ["caller", "Monday works."],
        ["agent", "Booked for Monday at 4:00. I'll text a confirmation and a quick intake form. Best name and number?"],
        ["caller", "Marcus, this number."],
        ["agent", "Thanks Marcus — see you Monday."],
      ),
    },
    {
      call_id: "call-3", lead_id: "ld-3", channel_id: "ch-meta-wa",
      datetime: "2026-06-26T22:03:00", after_hours: true, duration_sec: 96,
      caller: "Sandeep K.", phone: "+1 905-555-0190", discipline: "Massage / RMT",
      new_or_returning: "new", outcome: "message", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend — this call may be recorded to help book you in. How can I help?"],
        ["caller", "Do you have any RMT spots this week? I need a deep tissue."],
        ["agent", "Let me check… this week is quite full — that's how busy it's been. Want me to put you on our cancellation list and text you the moment something opens? And I can have the team call you back tomorrow with options."],
        ["caller", "Yeah add me to the list."],
        ["agent", "Done — you're on the cancellation list for RMT. Can I grab your name and number so we can text you?"],
        ["caller", "Sandeep, this number's good."],
        ["agent", "Perfect Sandeep, we'll be in touch the second a spot frees up."],
      ),
    },
    {
      call_id: "call-4", lead_id: "ld-4", channel_id: "ch-google",
      datetime: "2026-06-26T08:11:00", after_hours: false, duration_sec: 60,
      caller: "(out of area)", phone: "+1 604-555-0112", discipline: "Physiotherapy",
      new_or_returning: "new", outcome: "out-of-area", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend Health Collective — how can I help?"],
        ["caller", "Do you have a clinic in Vancouver? I'm in BC."],
        ["agent", "We're Hamilton, Ontario only, so we wouldn't be able to see you in person — but I can point you to a few BC options. Sorry we couldn't help this time!"],
      ),
    },
    {
      call_id: "call-5", lead_id: "ld-5", channel_id: "ch-meta-if",
      datetime: "2026-06-25T20:27:00", after_hours: true, duration_sec: 168,
      caller: "Elena V.", phone: "+1 365-555-0166", discipline: "Physiotherapy",
      new_or_returning: "new", outcome: "booked", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend Health Collective — this call may be recorded to help book your appointment. How can I help?"],
        ["caller", "I saw your post about pelvic floor physio — is that something you do?"],
        ["agent", "We do. It's a private, one-on-one first visit — totally at your pace. Have you been in before?"],
        ["caller", "No, first time."],
        ["agent", "Any extended benefits to direct-bill? Sun Life, Manulife, Canada Life, Blue Cross."],
        ["caller", "Canada Life."],
        ["agent", "We'll submit that for you. I've got Wednesday at 1:00 or Thursday at 5:15 — which works?"],
        ["caller", "Thursday after work, perfect."],
        ["agent", "Booked Thursday at 5:15. I'll text a confirmation and intake link. Best name and number?"],
        ["caller", "Elena, this number."],
        ["agent", "Thanks Elena — see you Thursday."],
      ),
    },
    {
      call_id: "call-6", lead_id: "ld-6", channel_id: "ch-referral",
      datetime: "2026-06-25T12:48:00", after_hours: false, duration_sec: 120,
      caller: "Tom B.", phone: "+1 905-555-0155", discipline: "Chiropractic",
      new_or_returning: "new", outcome: "booked", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend — how can I help today?"],
        ["caller", "My physiotherapist Dana said I should see your chiro. The front desk line was busy."],
        ["agent", "Happy to help while they're with patients! A referral from Dana — wonderful. First visit with us?"],
        ["caller", "Yes."],
        ["agent", "Benefits to direct-bill? Sun Life, Manulife, Canada Life, Blue Cross."],
        ["caller", "Blue Cross."],
        ["agent", "I've got Friday at 3:00 or Monday at 10:00 — which works?"],
        ["caller", "Friday."],
        ["agent", "Booked Friday at 3:00. Name and best number for the confirmation?"],
        ["caller", "Tom, this one."],
        ["agent", "Thanks Tom — see you Friday."],
      ),
    },
    {
      call_id: "call-7", lead_id: "ld-7", channel_id: "ch-meta-if",
      datetime: "2026-06-24T21:55:00", after_hours: true, duration_sec: 88,
      caller: "Rachel P.", phone: "+1 289-555-0133", discipline: "Massage / RMT",
      new_or_returning: "returning", outcome: "booked", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend — this call may be recorded to help book you in. How can I help?"],
        ["caller", "I've been in before, just want to rebook my RMT with Jordan."],
        ["agent", "Welcome back! Jordan has Tuesday at 6:00 or Saturday at 10:30 — which works?"],
        ["caller", "Saturday."],
        ["agent", "Booked Saturday 10:30 with Jordan. I'll text the confirmation — same number?"],
        ["caller", "Yep."],
        ["agent", "Great, see you Saturday Rachel!"],
      ),
    },
    {
      call_id: "call-8", lead_id: "ld-8", channel_id: "ch-google",
      datetime: "2026-06-24T07:38:00", after_hours: true, duration_sec: 142,
      caller: "Amir H.", phone: "+1 905-555-0121", discipline: "Physiotherapy",
      new_or_returning: "new", outcome: "booked", handled_by: "ai",
      transcript: T(
        ["agent", "Thanks for calling Riverbend Health Collective — this call may be recorded to help book your appointment. How can I help?"],
        ["caller", "I need physio for a shoulder, before work hours ideally."],
        ["agent", "We can do early mornings. First visit with us?"],
        ["caller", "Yes."],
        ["agent", "Benefits to direct-bill? Sun Life, Manulife, Canada Life, Blue Cross."],
        ["caller", "Sun Life."],
        ["agent", "I've got Wednesday at 7:30am or Friday at 8:00am — which works?"],
        ["caller", "Wednesday 7:30."],
        ["agent", "Booked. Texting a confirmation and intake link now. Name and number?"],
        ["caller", "Amir, this number."],
        ["agent", "Thanks Amir — see you Wednesday."],
      ),
    },
  ];

  // ── Leads (ours) — one per call + a few web-form leads ─────────────
  // status: new→contacted→qualified→booked→won(paying)→lost ; sourceChannelId = the attribution join
  const leads = [
    { lead_id: "ld-1", name: "Priya N.",   phone: "+1 905-555-0143", discipline: "Physiotherapy",  new_or_returning: "new",       source_channel_id: "ch-meta-if",  status: "won",      created_at: "2026-06-27T21:14:00", booking_id: "bk-1", paying: true,  first_visit_revenue: 95,  monthly_fee: 0 },
    { lead_id: "ld-2", name: "Marcus D.",  phone: "+1 289-555-0178", discipline: "Chiropractic",   new_or_returning: "new",       source_channel_id: "ch-google",   status: "booked",   created_at: "2026-06-27T19:42:00", booking_id: "bk-2", paying: false, first_visit_revenue: 0,   monthly_fee: 0 },
    { lead_id: "ld-3", name: "Sandeep K.", phone: "+1 905-555-0190", discipline: "Massage / RMT",  new_or_returning: "new",       source_channel_id: "ch-meta-wa",  status: "qualified",created_at: "2026-06-26T22:03:00", booking_id: null,   paying: false, first_visit_revenue: 0,   monthly_fee: 0 },
    { lead_id: "ld-4", name: "(out of area)", phone: "+1 604-555-0112", discipline: "Physiotherapy", new_or_returning: "new",     source_channel_id: "ch-google",   status: "lost",     created_at: "2026-06-26T08:11:00", booking_id: null,   paying: false, first_visit_revenue: 0,   monthly_fee: 0, lost_reason: "out of service area (BC)" },
    { lead_id: "ld-5", name: "Elena V.",   phone: "+1 365-555-0166", discipline: "Physiotherapy",  new_or_returning: "new",       source_channel_id: "ch-meta-if",  status: "won",      created_at: "2026-06-25T20:27:00", booking_id: "bk-5", paying: true,  first_visit_revenue: 110, monthly_fee: 0 },
    { lead_id: "ld-6", name: "Tom B.",     phone: "+1 905-555-0155", discipline: "Chiropractic",   new_or_returning: "new",       source_channel_id: "ch-referral", status: "won",      created_at: "2026-06-25T12:48:00", booking_id: "bk-6", paying: true,  first_visit_revenue: 90,  monthly_fee: 0 },
    { lead_id: "ld-7", name: "Rachel P.",  phone: "+1 289-555-0133", discipline: "Massage / RMT",  new_or_returning: "returning", source_channel_id: "ch-meta-if",  status: "won",      created_at: "2026-06-24T21:55:00", booking_id: "bk-7", paying: true,  first_visit_revenue: 105, monthly_fee: 0 },
    { lead_id: "ld-8", name: "Amir H.",    phone: "+1 905-555-0121", discipline: "Physiotherapy",  new_or_returning: "new",       source_channel_id: "ch-google",   status: "booked",   created_at: "2026-06-24T07:38:00", booking_id: "bk-8", paying: false, first_visit_revenue: 0,   monthly_fee: 0 },
    // web-form leads (no call) — show the channel mix isn't only phone
    { lead_id: "ld-9",  name: "Grace L.",  phone: "+1 905-555-0102", discipline: "Physiotherapy", new_or_returning: "new", source_channel_id: "ch-meta-if", status: "contacted", created_at: "2026-06-23T15:20:00", booking_id: null, paying: false, first_visit_revenue: 0, monthly_fee: 0 },
    { lead_id: "ld-10", name: "Owen R.",   phone: "+1 289-555-0119", discipline: "Chiropractic",  new_or_returning: "new", source_channel_id: "ch-google",  status: "new",       created_at: "2026-06-23T09:05:00", booking_id: null, paying: false, first_visit_revenue: 0, monthly_fee: 0 },
    { lead_id: "ld-11", name: "Nadia S.",  phone: "+1 365-555-0177", discipline: "Massage / RMT", new_or_returning: "new", source_channel_id: "ch-meta-wa", status: "booked",    created_at: "2026-06-22T18:40:00", booking_id: "bk-11", paying: false, first_visit_revenue: 0, monthly_fee: 0 },
    { lead_id: "ld-12", name: "Derek M.",  phone: "+1 905-555-0188", discipline: "Physiotherapy", new_or_returning: "new", source_channel_id: "ch-referral", status: "won",      created_at: "2026-06-22T11:10:00", booking_id: "bk-12", paying: true, first_visit_revenue: 100, monthly_fee: 0 },
  ];

  // ── Bookings (ours, then handed to Jane) ───────────────────────────
  const bookings = [
    { booking_id: "bk-1",  lead_id: "ld-1",  slot_time: "2026-07-03T09:30:00", clinician: "Dana W. (PT)",  service: "Physiotherapy", handoff_state: "in-emr" },
    { booking_id: "bk-2",  lead_id: "ld-2",  slot_time: "2026-06-29T16:00:00", clinician: "Dr. Singh (DC)", service: "Chiropractic", handoff_state: "pending" },
    { booking_id: "bk-5",  lead_id: "ld-5",  slot_time: "2026-07-02T17:15:00", clinician: "Dana W. (PT)",  service: "Physiotherapy", handoff_state: "in-emr" },
    { booking_id: "bk-6",  lead_id: "ld-6",  slot_time: "2026-07-03T15:00:00", clinician: "Dr. Singh (DC)", service: "Chiropractic", handoff_state: "in-emr" },
    { booking_id: "bk-7",  lead_id: "ld-7",  slot_time: "2026-07-04T10:30:00", clinician: "Jordan (RMT)",  service: "Massage / RMT", handoff_state: "in-emr" },
    { booking_id: "bk-8",  lead_id: "ld-8",  slot_time: "2026-07-01T07:30:00", clinician: "Dana W. (PT)",  service: "Physiotherapy", handoff_state: "pending" },
    { booking_id: "bk-11", lead_id: "ld-11", slot_time: "2026-06-30T18:00:00", clinician: "Jordan (RMT)",  service: "Massage / RMT", handoff_state: "pending" },
    { booking_id: "bk-12", lead_id: "ld-12", slot_time: "2026-06-26T11:00:00", clinician: "Dr. Singh (DC)", service: "Chiropractic", handoff_state: "in-emr" },
  ];

  // ── Derived helpers (Module C math; used by dashboard later) ───────
  function leadsForChannel(chId) { return leads.filter(l => l.source_channel_id === chId); }
  function channelStats(ch) {
    const ls = leadsForChannel(ch.channel_id);
    const booked = ls.filter(l => ["booked", "won"].includes(l.status)).length;
    const paying = ls.filter(l => l.paying).length;
    const revenue = ls.reduce((s, l) => s + (l.first_visit_revenue || 0) + (l.monthly_fee || 0), 0);
    const cpa = booked ? +(ch.spend / booked).toFixed(0) : null;   // cost per BOOKED patient
    const roas = ch.spend ? +(revenue / ch.spend).toFixed(2) : null;
    return { leads: ls.length, booked, paying, revenue, cpa, roas, spend: ch.spend };
  }
  function funnel() {
    const total = leads.length;
    const contacted = leads.filter(l => l.status !== "new").length;
    const booked = leads.filter(l => ["booked", "won"].includes(l.status)).length;
    const paying = leads.filter(l => l.paying).length;
    return { leads: total, contacted, booked, paying };
  }
  function afterHoursRecovered() {
    const ah = calls.filter(c => c.after_hours && c.outcome === "booked");
    const revenue = ah.reduce((s, c) => {
      const l = leads.find(x => x.lead_id === c.lead_id);
      return s + (l ? (l.first_visit_revenue || 0) : 0);
    }, 0);
    // estimated booked LTV at risk (first visit + a conservative course of care)
    const ltvAtRisk = ah.length * 480; // ~$480 conservative LTV per recovered new patient
    return { count: ah.length, revenue, ltvAtRisk };
  }
  const fmtMoney = (n, cur = "CAD") => (cur === "CAD" ? "$" : "$") + Math.round(n).toLocaleString("en-CA");

  window.PR = {
    TODAY, clinic, channels, calls, leads, bookings,
    leadsForChannel, channelStats, funnel, afterHoursRecovered, fmtMoney,
    leadById: id => leads.find(l => l.lead_id === id),
    callForLead: id => calls.find(c => c.lead_id === id),
    channelById: id => channels.find(c => c.channel_id === id),
    bookingById: id => bookings.find(b => b.booking_id === id),
  };
})();
