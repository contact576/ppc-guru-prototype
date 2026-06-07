/* Phase 4 — Sales Console (Abhishek's daily workspace)
 *
 * Adds Zoho-realistic sales data to window.PPC, alongside the existing
 * synthetic LEADS / SALES_STAGES (which the Phase 3 Forecast still reads).
 *
 * Everything here is additive. Phase 1 / 2 / 3 locks are not touched.
 *
 * Exports on window.PPC:
 *   ZOHO_LEADS      — 10 real Zoho rows, province auto-derived from area code
 *   ZOHO_DEALS      — 12 deals carrying the fake $8,000 placeholder from Zoho
 *   ZOHO_STAGES     — 12 pipeline stages (Trial Started replaces Closed Won)
 *   ZOHO_CALLS      — 8 calls from today (3 outbound · 4 missed · 1 scheduled)
 *   ZOHO_EMAILS     — synthetic Gmail threads (Workspace integration coming)
 *   ZOHO_HISTORIES  — cross-linked stories for Kshitij · Jagvir · Sandeep
 *   SALES_TODAY     — "2026-05-25" demo anchor (separate from data.js TODAY
 *                     so Phase 4 can drift without breaking Phase 2 rules)
 *
 *   Helpers: provinceFromPhone, inServiceArea, commsTotals,
 *            zohoStageName, fallbackHistory, plus a few formatters.
 */

(function () {
  const SALES_TODAY = "2026-05-25";

  // ---------- Province lookup (auto-derived from phone area code) ----------
  const AREA_CODE_PROVINCE = {
    "236": "BC", "604": "BC", "778": "BC",
    "403": "AB", "587": "AB", "825": "AB",
    "416": "ON", "647": "ON", "437": "ON",
    "905": "ON", "289": "ON", "226": "ON",
    "519": "ON", "613": "ON", "343": "ON",
    "705": "ON",
  };
  function provinceFromPhone(phone) {
    if (!phone) return null;
    const m = phone.replace(/[^0-9]/g, "").match(/^1?(\d{3})/);
    if (!m) return null;
    return AREA_CODE_PROVINCE[m[1]] || null;
  }
  const inServiceArea = (prov) => prov === "ON";

  // ---------- LEADS ----------
  const ZOHO_LEADS = [
    { id: "L01", name: "Gilton Jose",            company: "Nexa Home Tech",              phone: "+1 236-239-4097", source: "Meta Ads", status: "Not Contacted",        created: "2026-05-25", lastTouch: null },
    { id: "L02", name: "Kshitij Anand",          company: "Realtor",                     phone: "+1 647-640-1457", source: null,       status: "Contacted",            created: "2026-05-25", lastTouch: "2026-05-25" },
    { id: "L03", name: "Honey Sharma",           company: "Honeys Painting Ltd",         phone: "+1 236-858-8809", source: "Meta Ads", status: "Contacted",            created: "2026-05-22", lastTouch: "2026-05-23" },
    { id: "L04", name: "Nelson Mahida",          company: "NM Floor Care",               phone: "+1 604-715-2586", source: "Meta Ads", status: "Contacted",            created: "2026-05-23", lastTouch: "2026-05-24" },
    { id: "L05", name: "Mani Badali",            company: "Boss & Friends Construction Ltd", phone: "+1 778-990-8619", source: "Meta Ads", status: "Attempted to Contact", created: "2026-05-24", lastTouch: "2026-05-24" },
    { id: "L06", name: "Lakhvir Brar",           company: "Athlon Painting",             phone: "+1 778-681-6630", source: "Meta Ads", status: "Attempted to Contact", created: "2026-05-24", lastTouch: "2026-05-24" },
    { id: "L07", name: "Niloofar",               company: "Niam Childcare",              phone: "+1 604-808-4547", source: "Meta Ads", status: "Not Qualified",        created: "2026-05-24", lastTouch: "2026-05-24" },
    { id: "L08", name: "Gursharan Singh Aulakh", company: "Realtor",                     phone: "+1 778-233-7866", source: "Meta Ads", status: "Attempted to Contact", created: "2026-05-25", lastTouch: "2026-05-25" },
    { id: "L09", name: "Surinder Clair",         company: "360 West Coast Auto Sales",   phone: "+1 604-657-1015", source: "Meta Ads", status: "Not Qualified",        created: "2026-05-25", lastTouch: "2026-05-25" },
    { id: "L10", name: "Manpreet Singh Gill",    company: "Inouttechnologies",           phone: "+1 226-600-2979", source: "Meta Ads", status: "Attempted to Contact", created: "2026-05-22", lastTouch: "2026-05-23" },
  ].map(l => ({
    ...l,
    province: provinceFromPhone(l.phone),
    outOfArea: !inServiceArea(provinceFromPhone(l.phone)),
    sourceMissing: !l.source,
  }));

  function within24h(lead) {
    if (lead.status === "Not Contacted") return false;
    if (!lead.lastTouch) return false;
    const a = new Date(lead.created).getTime();
    const b = new Date(lead.lastTouch).getTime();
    return (b - a) <= 24 * 60 * 60 * 1000;
  }
  ZOHO_LEADS.forEach(l => { l.contactedIn24h = within24h(l); });

  // ---------- PIPELINE STAGES ----------
  // Renamed "Closed Won" -> "Trial Started" (trial begun, NOT a paying client).
  // "Paying client" is a separate boolean flag — revenue only when payingClient=true.
  const ZOHO_STAGES = [
    { id: "z-interested",  name: "Interested in Meeting",   prob: 15 },
    { id: "z-booked",      name: "Meeting Booked",          prob: 25 },
    { id: "z-noshow",      name: "No Show",                 prob: 30, warn: true },
    { id: "z-completed",   name: "Meeting Completed",       prob: 50 },
    { id: "z-reachout",    name: "Reach Out Later",         prob: 10 },
    { id: "z-negotiation", name: "Negotiation",             prob: 60 },
    { id: "z-proposal",    name: "Proposal / Pricing Sent", prob: 70 },
    { id: "z-awaiting",    name: "Awaiting Approval",       prob: 80 },
    { id: "z-onboarding",  name: "Onboarding",              prob: 95, ok: true },
    { id: "z-trial",       name: "Trial Started",           prob: 100, ok: true },
    { id: "z-lost",        name: "Closed Lost",             prob: 0 },
    { id: "z-ghosting",    name: "Ghosting",                prob: 5, warn: 2 },
  ];

  // ---------- DEALS ----------
  // All currently carry the fake flat $8,000 from Zoho. UI shows "fee not set"
  // until Abhishek enters the real monthly fee (target range $375–$2,400/mo).
  const ZOHO_DEALS = [
    { id: "D01", company: "Captured Notions Entertainment Inc", contact: "Jashan",          stage: "z-onboarding", source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D02", company: "apex shine cleaning",                contact: "Saif Hyder",      stage: "z-onboarding", source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D03", company: "a2zgaragedoorrepair",                contact: "Jagvir Baath",    stage: "z-proposal",   source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D04", company: "New Precon Projects",                contact: "Sandeep Sandu",   stage: "z-proposal",   source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D05", company: "Apna Tiffin Service",                contact: "Harsh Tailor",    stage: "z-trial",      source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D06", company: "DefenceX Security",                  contact: "Bharat Kalra",    stage: "z-noshow",     source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D07", company: "Octfis Techno Ltd",                  contact: "Parth Gopani",    stage: "z-reachout",   source: "IBM Q4 '25 Attendee", fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D08", company: "Mortgage Agent",                     contact: "Sumit Shridhar",  stage: "z-reachout",   source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D09", company: "vikramjit.bhatt.mortgage.agent",     contact: "Vikramjit Bhatt", stage: "z-ghosting",   source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D10", company: "Pestguardpestcontrol",               contact: "Milankumar Patel",stage: "z-ghosting",   source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D11", company: "Buy with Chirag",                    contact: "Chirag Sharma",   stage: "z-ghosting",   source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
    { id: "D12", company: "Balaji Ghughra",                     contact: "Parth Patel",     stage: "z-ghosting",   source: null,                  fakeAmount: 8000, monthlyFee: null, payingClient: false },
  ].map(d => ({
    ...d,
    feeNeedsSet: !d.monthlyFee,
    sourceMissing: !d.source,
    canAdvancePastCompleted: !!d.monthlyFee,
  }));

  // ---------- CALLS ----------
  const ZOHO_CALLS = [
    { id: "C01", type: "out",   contact: "Jagvir Baath",                    contactRef: "L-Jagvir", when: "2026-05-25T15:26:00", duration: "9:05",  note: "gave all details about our offering • says will complete the form by EOD" },
    { id: "C02", type: "out",   contact: "Ram (existing client)",           contactRef: null,       when: "2026-05-25T15:07:00", duration: "16:04", note: "shared campaign performance • wants to reduce budget to $800, will confirm tomorrow" },
    { id: "C03", type: "out",   contact: "Kshitij Anand (+1 647-640-1457)", contactRef: "L02",      when: "2026-05-25T15:00:00", duration: "0:54",  note: "busy right now • asked to call back tomorrow 5 PM" },
    { id: "C04", type: "miss",  contact: "Kshitij Anand",                   contactRef: "L02",      when: "2026-05-25T15:02:00", duration: null,    note: "inbound missed" },
    { id: "C05", type: "miss",  contact: "Sandeep Sandu",                   contactRef: "D04",      when: "2026-05-25T14:53:00", duration: null,    note: "inbound missed" },
    { id: "C06", type: "miss",  contact: "Aashu Batra",                     contactRef: null,       when: "2026-05-25T15:49:00", duration: null,    note: "inbound missed" },
    { id: "C07", type: "miss",  contact: "+1 705-970-7654",                 contactRef: null,       when: "2026-05-25T15:02:00", duration: null,    note: "inbound missed — unknown caller" },
    { id: "C08", type: "sched", contact: "Kshitij Anand",                   contactRef: "L02",      when: "2026-05-26T17:00:00", duration: null,    note: "scheduled call — they asked for this slot" },
  ];

  // ---------- EMAILS (Google Workspace — Gmail) ----------
  // Mock data. Wiring to real Gmail API is sketched in the inbox screen
  // ("Connect Google Workspace" button). One row per thread, with replyCount
  // counting Abhishek's outbound messages within that thread.
  const ZOHO_EMAILS = [
    { id: "E01", threadId: "T01", direction: "out", subject: "Re: Pricing for a2zgaragedoorrepair", from: "Abhishek Tewari", to: "Jagvir Baath <jagvir@a2zgaragedoor.ca>", contact: "Jagvir Baath", contactRef: "L-Jagvir", when: "2026-05-25T15:40:00", snippet: "Hi Jagvir, attaching the intake form link as promised. Once you submit, our PM will be in touch within 24 hours…", labels: ["sales", "intake"], status: "sent", replyCount: 3, awaitingReply: true },
    { id: "E02", threadId: "T02", direction: "in",  subject: "Following up — pre-construction Mississauga", from: "Sandeep Sandu <sandeep@newpreconprojects.com>", to: "Abhishek Tewari", contact: "Sandeep Sandu", contactRef: "D04", when: "2026-05-25T14:12:00", snippet: "Hi Abhishek, missed your call. Sent over the budget breakdown attached. Looking forward to your thoughts…", labels: ["sales", "proposal"], status: "unread", replyCount: 2, awaitingReply: false, needsResponse: true },
    { id: "E03", threadId: "T03", direction: "out", subject: "Trial check-in — Apna Tiffin Service", from: "Abhishek Tewari", to: "Harsh Tailor <harsh@apnatiffin.ca>", contact: "Harsh Tailor", contactRef: "D05", when: "2026-05-25T11:05:00", snippet: "Hey Harsh — wanted to share a quick recap of the first week of the trial. Reach has been strong, especially the lunch-rush windows. Couple of tweaks I'd suggest…", labels: ["sales", "trial"], status: "sent", replyCount: 1, awaitingReply: true },
    { id: "E04", threadId: "T04", direction: "in",  subject: "Re: Quick question about onboarding", from: "Jashan <jashan@capturednotions.com>", to: "Abhishek Tewari", contact: "Jashan", contactRef: "D01", when: "2026-05-25T10:18:00", snippet: "Thanks Abhishek. Two follow-ups — (1) do we need to give creative access before or after the kickoff call, and (2) the contract date in the proposal says May 28…", labels: ["sales", "onboarding"], status: "read", replyCount: 4, awaitingReply: false, needsResponse: true },
    { id: "E05", threadId: "T05", direction: "out", subject: "Calendly + recap — discovery", from: "Abhishek Tewari", to: "Parth Gopani <parth@octfis.com>", contact: "Parth Gopani", contactRef: "D07", when: "2026-05-24T17:55:00", snippet: "Hi Parth — good chatting earlier. As discussed, here's the calendar link to schedule the follow-up. Also attaching the one-pager for Octfis specifically…", labels: ["sales", "discovery"], status: "sent", replyCount: 1, awaitingReply: true },
    { id: "E06", threadId: "T06", direction: "out", subject: "Welcome to PPC Guru — next steps", from: "Abhishek Tewari", to: "Saif Hyder <saif@apexshinecleaning.ca>", contact: "Saif Hyder", contactRef: "D02", when: "2026-05-24T14:30:00", snippet: "Hey Saif, congrats on starting onboarding! Here's what to expect this week — Mon: kickoff call w/ Vihar (PM)…", labels: ["sales", "onboarding"], status: "sent", replyCount: 1, awaitingReply: false },
    { id: "E07", threadId: "T07", direction: "in",  subject: "Quote request from your Meta ad", from: "Honey Sharma <honey@honeyspainting.ca>", to: "Abhishek Tewari", contact: "Honey Sharma", contactRef: "L03", when: "2026-05-23T09:12:00", snippet: "Hi, saw your ad on Facebook. Interested in learning more about your services for our painting company. Best to reach me at…", labels: ["lead", "meta-ads"], status: "read", replyCount: 2, awaitingReply: false },
    { id: "E08", threadId: "T08", direction: "in",  subject: "Re: Pricing options for cleaning service",  from: "Saif Hyder <saif@apexshinecleaning.ca>", to: "Abhishek Tewari", contact: "Saif Hyder", contactRef: "D02", when: "2026-05-23T16:40:00", snippet: "Sounds good. Let's go with the growth tier. When can we kick things off?", labels: ["sales"], status: "read", replyCount: 3, awaitingReply: false },
    { id: "E09", threadId: "T09", direction: "out", subject: "Mortgage Agent — proposal next week",       from: "Abhishek Tewari", to: "Sumit Shridhar <sumit.shridhar@mortgageagent.ca>", contact: "Sumit Shridhar", contactRef: "D08", when: "2026-05-22T18:00:00", snippet: "Hi Sumit, as discussed will share the proposal next Tuesday. Also confirming the call slot for Thursday…", labels: ["sales"], status: "sent", replyCount: 1, awaitingReply: true },
    { id: "E10", threadId: "T10", direction: "in",  subject: "Re: Trial extension request",              from: "Bharat Kalra <bharat@defencex.com>", to: "Abhishek Tewari", contact: "Bharat Kalra", contactRef: "D06", when: "2026-05-21T11:30:00", snippet: "Apologies for the no-show last week. Can we reschedule? Also, would it be possible to extend our review window…", labels: ["sales", "noshow"], status: "read", replyCount: 2, awaitingReply: false, needsResponse: true },
    { id: "E11", threadId: "T11", direction: "out", subject: "Welcome — Captured Notions Entertainment", from: "Abhishek Tewari", to: "Jashan <jashan@capturednotions.com>", contact: "Jashan", contactRef: "D01", when: "2026-05-20T10:00:00", snippet: "Hi Jashan, welcome aboard! Here's your onboarding checklist and the kickoff agenda…", labels: ["sales", "onboarding"], status: "sent", replyCount: 5, awaitingReply: false },
    { id: "E12", threadId: "T12", direction: "out", subject: "Re: Outreach to your team",                from: "Abhishek Tewari", to: "Manpreet Singh Gill <manpreet@inouttechnologies.com>", contact: "Manpreet Singh Gill", contactRef: "L10", when: "2026-05-23T12:00:00", snippet: "Hi Manpreet, following up on our brief chat. Sharing a one-pager + a 15-min slot if you'd like to dive deeper…", labels: ["lead"], status: "sent", replyCount: 1, awaitingReply: true },
  ];

  // ---------- HISTORIES ----------
  // Per-contact timeline that merges calls + WA + emails + meetings + stage.
  // Keys: lead.id OR deal.id OR "L-Jagvir" shared by both.
  const ZOHO_HISTORIES = {
    "L02": [
      { kind: "call-sched", when: "2026-05-26T17:00:00", title: "Scheduled call", body: "Tomorrow 5:00 PM — Kshitij asked for this slot during the call-back conversation." },
      { kind: "call-out",   when: "2026-05-25T15:00:00", title: "Outbound call · 0:54", body: "He picked up but said he was busy. Asked us to call back tomorrow at 5 PM." },
      { kind: "call-miss",  when: "2026-05-25T15:02:00", title: "Inbound missed", body: "He tried to call back two minutes after our outbound — we missed it." },
      { kind: "wa-thread",  when: "2026-05-25T14:30:00", title: "WhatsApp · Coexistence", sample: true,
        bubbles: [
          { dir: "out", text: "Hi Kshitij — Abhishek from PPC Guru. Saw your interest on Meta. Got 2 min for a quick chat?", time: "2:30 PM" },
          { dir: "in",  text: "Sure, but I'm running into a showing. Can you call later?", time: "2:42 PM" },
        ],
      },
      { kind: "stage",      when: "2026-05-25T13:00:00", title: "Status → Contacted", body: "Auto-set when first outbound logged." },
    ],

    "L-Jagvir": [
      { kind: "email-out",  when: "2026-05-25T15:40:00", title: "Re: Pricing for a2zgaragedoorrepair", body: "Sent intake form link + onboarding overview. (3 replies in thread.)" },
      { kind: "wa-thread",  when: "2026-05-25T15:35:00", title: "WhatsApp · Coexistence", sample: true,
        bubbles: [
          { dir: "out", text: "Hey Jagvir — sending the intake form here as we discussed. Takes ~5 min.", time: "3:35 PM" },
          { dir: "out", text: "https://ppcguru.example/intake/a2zgaragedoor", time: "3:35 PM" },
          { dir: "in",  text: "Got it, will do it tonight 👍", time: "3:48 PM" },
        ],
      },
      { kind: "call-out",   when: "2026-05-25T15:26:00", title: "Outbound call · 9:05", body: "Gave all details about our offering. He says he will complete the intake form by EOD." },
      { kind: "stage",      when: "2026-05-23T10:00:00", title: "Stage → Proposal / Pricing Sent", body: "Pricing sheet emailed after first call." },
      { kind: "meet",       when: "2026-05-22T16:00:00", title: "Discovery call (Zoom)", body: "30 min. Garage door repair, Brampton area. Currently no paid ads. Budget appetite: $1,500–$2,000/mo." },
    ],

    "D04": [
      { kind: "email-in",   when: "2026-05-25T14:12:00", title: "Following up — pre-construction Mississauga", body: "Sandeep sent budget breakdown after missing the call. Needs response." },
      { kind: "call-miss",  when: "2026-05-25T14:53:00", title: "Inbound missed", body: "He called back during our meeting block. Need to return today." },
      { kind: "stage",      when: "2026-05-22T11:00:00", title: "Stage → Proposal / Pricing Sent", body: "Pricing for pre-construction lead-gen campaign." },
      { kind: "meet",       when: "2026-05-20T14:00:00", title: "Discovery call", body: "Pre-construction condo projects in Mississauga. Wants Meta + Google combined. Estimated fee range: $2,000–$2,400/mo." },
      { kind: "wa-thread",  when: "2026-05-19T10:00:00", title: "WhatsApp · Coexistence", sample: true,
        bubbles: [
          { dir: "in",  text: "Hi, saw your ad. Interested in talking about lead gen for our condo project.", time: "10:04 AM" },
          { dir: "out", text: "Hi Sandeep — happy to. What time works tomorrow?", time: "10:11 AM" },
        ],
      },
    ],
  };

  function zohoStageName(id) {
    const s = ZOHO_STAGES.find(x => x.id === id);
    return s ? s.name : id;
  }

  function fallbackHistory(record, kind) {
    const items = [];
    if (kind === "lead") {
      if (record.status !== "Not Contacted") {
        items.push({
          kind: "stage",
          when: record.lastTouch + "T12:00:00",
          title: "Status → " + record.status,
          body: "Logged via Zoho.",
        });
      }
      items.push({
        kind: "stage",
        when: record.created + "T09:00:00",
        title: "Lead created",
        body: (record.source ? "Source: " + record.source + "." : "No source set — needs tagging.") +
              (record.province ? " Phone in " + record.province + "." : ""),
      });
    } else if (kind === "deal") {
      items.push({
        kind: "stage",
        when: "2026-05-15T10:00:00",
        title: "Deal opened — stage: " + zohoStageName(record.stage),
        body: "Carried over from Zoho. Monthly fee not yet set (placeholder $8,000).",
      });
    }
    return items;
  }

  // ---------- KPI helpers ----------
  function leadsContactedWithin24h() {
    const eligible = ZOHO_LEADS.filter(l => l.status !== "Not Contacted");
    if (!eligible.length) return { pct: 0, hit: 0, total: 0 };
    const hit = eligible.filter(l => l.contactedIn24h).length;
    return { pct: Math.round(hit / eligible.length * 100), hit, total: eligible.length };
  }
  function noShowGhostRate() {
    const flagged = ZOHO_DEALS.filter(d => d.stage === "z-ghosting" || d.stage === "z-noshow").length;
    return { pct: Math.round(flagged / ZOHO_DEALS.length * 100), flagged, total: ZOHO_DEALS.length };
  }
  function outOfProvinceRate() {
    const oop = ZOHO_LEADS.filter(l => l.outOfArea).length;
    return { count: oop, total: ZOHO_LEADS.length, pct: Math.round(oop / ZOHO_LEADS.length * 100) };
  }
  function callsToday() {
    return ZOHO_CALLS.filter(c => c.when.startsWith(SALES_TODAY)).length;
  }
  function callsByType(type) {
    return ZOHO_CALLS.filter(c => c.type === type).length;
  }
  function avgCallDuration() {
    const durs = ZOHO_CALLS.filter(c => c.duration).map(c => {
      const [m, s] = c.duration.split(":").map(Number);
      return m * 60 + (s || 0);
    });
    if (!durs.length) return "—";
    const avg = Math.round(durs.reduce((a, b) => a + b, 0) / durs.length);
    return Math.floor(avg / 60) + ":" + String(avg % 60).padStart(2, "0");
  }

  // ---------- Email helpers ----------
  function emailsToday() {
    return ZOHO_EMAILS.filter(e => e.when.startsWith(SALES_TODAY)).length;
  }
  function emailsSent(period) {
    if (period === "today") return ZOHO_EMAILS.filter(e => e.direction === "out" && e.when.startsWith(SALES_TODAY)).length;
    return ZOHO_EMAILS.filter(e => e.direction === "out").length;
  }
  function emailsReceived(period) {
    if (period === "today") return ZOHO_EMAILS.filter(e => e.direction === "in" && e.when.startsWith(SALES_TODAY)).length;
    return ZOHO_EMAILS.filter(e => e.direction === "in").length;
  }
  function emailsNeedingResponse() {
    return ZOHO_EMAILS.filter(e => e.needsResponse).length;
  }
  function emailsAwaitingClient() {
    return ZOHO_EMAILS.filter(e => e.awaitingReply).length;
  }
  function totalEmailMessages() {
    // sum of replyCount across all threads — proxy for total messages exchanged
    return ZOHO_EMAILS.reduce((a, e) => a + (e.replyCount || 1), 0);
  }
  function responseRate() {
    // % of inbound emails that have at least one outbound reply in the thread
    const inbound = ZOHO_EMAILS.filter(e => e.direction === "in");
    if (!inbound.length) return null;
    const responded = inbound.filter(e => !e.needsResponse).length;
    return Math.round(responded / inbound.length * 100);
  }

  // ---------- Total communication tally (for Sales Home) ----------
  // Counts every "touch" — call (in/out/missed/scheduled), WA thread message,
  // email message. Returns an object with breakdown + grand total.
  function commsTotals(period) {
    const isToday = period === "today";
    const calls = isToday
      ? ZOHO_CALLS.filter(c => c.when.startsWith(SALES_TODAY)).length
      : ZOHO_CALLS.length;

    // WhatsApp — count individual bubbles across all wa-thread items in
    // ZOHO_HISTORIES whose timestamp matches the period.
    let wa = 0;
    Object.values(ZOHO_HISTORIES).forEach(items => {
      items.forEach(it => {
        if (it.kind !== "wa-thread") return;
        if (isToday && !it.when.startsWith(SALES_TODAY)) return;
        wa += (it.bubbles || []).length;
      });
    });

    // Email — sum of individual messages (replyCount) for threads touched in period
    let email = 0;
    ZOHO_EMAILS.forEach(e => {
      if (isToday && !e.when.startsWith(SALES_TODAY)) return;
      email += (e.replyCount || 1);
    });

    return { calls, wa, email, total: calls + wa + email };
  }

  // ---------- Formatting helpers ----------
  function ageOf(iso) {
    if (!iso) return null;
    const ms = new Date(SALES_TODAY + "T23:59:59").getTime() - new Date(iso).getTime();
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    if (days <= 0) return "today";
    if (days === 1) return "1d ago";
    if (days < 7) return days + "d ago";
    return Math.floor(days / 7) + "w ago";
  }
  function timeOnly(iso) {
    const d = new Date(iso);
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    return h + ":" + m + " " + ampm;
  }
  function dayLabel(iso) {
    if (!iso) return "";
    const dateStr = iso.slice(0, 10);
    if (dateStr === SALES_TODAY) return "today";
    if (dateStr === "2026-05-26") return "tomorrow";
    if (dateStr === "2026-05-24") return "yesterday";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function dayShort(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // ---------- attach to window.PPC ----------
  Object.assign(window.PPC, {
    SALES_TODAY,
    ZOHO_LEADS, ZOHO_DEALS, ZOHO_CALLS, ZOHO_EMAILS, ZOHO_STAGES, ZOHO_HISTORIES,
    provinceFromPhone, inServiceArea,
    zohoStageName, fallbackHistory,
    leadsContactedWithin24h, noShowGhostRate, outOfProvinceRate,
    callsToday, callsByType, avgCallDuration,
    emailsToday, emailsSent, emailsReceived, emailsNeedingResponse,
    emailsAwaitingClient, totalEmailMessages, responseRate,
    commsTotals,
    salesAgeOf: ageOf, salesTimeOnly: timeOnly, salesDayLabel: dayLabel, salesDayShort: dayShort,
  });
})();
