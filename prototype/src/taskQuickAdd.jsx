/* ─────────────────────────────────────────────────────────────────
   Phase 6 — Quick Add with comprehensive natural-language parsing.
   Todoist-style: type one line, the parser detects date · time · recurring
   · priority · duration · @labels · #client · +assignee · {deadline} · !reminder,
   greys the matched phrases inline, and shows a removable chip per field.

   parseQuickAdd() is a PURE function (exposed on window.PPC for console tests).
   In production the equivalent is chrono-node + a token tokenizer — here it's
   dependency-free because the prototype has no build step.
   ───────────────────────────────────────────────────────────────── */

const QA_WEEKDAYS = {
  sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2,
  wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5, sat: 6, saturday: 6
};
const QA_MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const QA_DOW_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function qaIsoToDate(iso) { return new Date(iso + "T00:00:00Z"); }
function qaDateToIso(d) { return d.toISOString().slice(0, 10); }
function qaAddDays(iso, n) { const d = qaIsoToDate(iso); d.setUTCDate(d.getUTCDate() + n); return qaDateToIso(d); }
/* REAL current date (the user's local clock) — task scheduling must use this,
   not the demo TODAY constant. "tomorrow" = the actual next calendar day. */
function qaRealTodayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/* Resolve a bare date phrase ("tomorrow", "this saturday", "jun 4", "4/6") → ISO */
function qaParseDatePhrase(s, today) {
  s = String(s).trim().toLowerCase().replace(/\s+/g, " ");
  const dow0 = qaIsoToDate(today).getUTCDay();
  if (s === "today") return today;
  if (s === "tonight") return today;
  if (s === "tomorrow" || s === "tmrw" || s === "tmr") return qaAddDays(today, 1);
  if (s === "next week") return qaAddDays(today, 7);
  let m;
  if ((m = s.match(/^in (\d+) (day|days|week|weeks)$/))) {
    const n = +m[1]; return qaAddDays(today, m[2].startsWith("week") ? n * 7 : n);
  }
  if ((m = s.match(/^(this |next )?([a-z]+)$/))) {
    const dow = QA_WEEKDAYS[m[2]];
    if (dow != null) {
      const delta = (dow - dow0 + 7) % 7;
      return qaAddDays(today, (m[1] && m[1].trim() === "next") ? delta + 7 : delta);
    }
  }
  if ((m = s.match(/^([a-z]{3,9}) (\d{1,2})$/))) {
    const mo = QA_MONTHS[m[1].slice(0, 3)];
    if (mo != null) return qaDateToIso(new Date(Date.UTC(qaIsoToDate(today).getUTCFullYear(), mo, +m[2])));
  }
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})$/))) {
    return qaDateToIso(new Date(Date.UTC(qaIsoToDate(today).getUTCFullYear(), +m[1] - 1, +m[2])));
  }
  if ((m = s.match(/^the (\d{1,2})(?:st|nd|rd|th)$/))) {
    const day = +m[1]; const d0 = qaIsoToDate(today); let mo = d0.getUTCMonth(), yr = d0.getUTCFullYear();
    if (day < d0.getUTCDate()) { mo++; if (mo > 11) { mo = 0; yr++; } } // already passed → next month
    return qaDateToIso(new Date(Date.UTC(yr, mo, day)));
  }
  return null;
}

/* Resolve an hour to 24h. With am/pm → standard. Without → assume office
   hours (9–5 EST): 1–5 → PM, 6–11 → AM, 12 → noon. */
function qaOfficeHour(h, ampm) {
  h = +h;
  if (ampm) { const a = ampm.toLowerCase(); const h12 = h % 12; return a === "pm" ? h12 + 12 : h12; }
  if (h === 12) return 12;
  if (h >= 1 && h <= 5) return h + 12;
  return h;
}
/* "16:00" → "4:00 PM" */
function qaFmtTime12(hhmm) {
  if (!hhmm) return "";
  const [H, M] = hhmm.split(":").map(Number);
  const ap = H >= 12 ? "PM" : "AM";
  const h12 = ((H + 11) % 12) + 1;
  return h12 + ":" + String(M || 0).padStart(2, "0") + " " + ap;
}

/* ISO → friendly due label used by the rest of the app */
function qaIsoToDueLabel(iso, today) {
  if (!iso) return null;
  if (iso === today) return "Today";
  if (iso === qaAddDays(today, 1)) return "Tomorrow";
  const diff = Math.round((qaIsoToDate(iso) - qaIsoToDate(today)) / 86400000);
  if (diff < 0) return "Overdue";
  if (diff > 1 && diff <= 6) return QA_DOW_LABEL[qaIsoToDate(iso).getUTCDay()];
  // beyond a week → "Jun 4"
  const d = qaIsoToDate(iso);
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()] + " " + d.getUTCDate();
}

/* Extract {dueISO, dueTime} from a value phrase like "Monday at 5pm", "tomorrow", "Tuesday". */
function qaWhen(s, today) {
  s = " " + String(s).trim().toLowerCase() + " ";
  let time = null;
  let tm = s.match(/\b(noon|midday|midnight)\b/) || s.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/) || s.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (tm) {
    if (tm[1] === "noon" || tm[1] === "midday") time = "12:00";
    else if (tm[1] === "midnight") time = "00:00";
    else time = String(qaOfficeHour(+tm[1], tm[3])).padStart(2, "0") + ":" + (tm[2] || "00");
  }
  let dateISO = null;
  const dp = s.match(/\b(today|tonight|tomorrow|next week|in \d+ (?:days?|weeks?)|(?:this |next )?(?:mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}|the \d{1,2}(?:st|nd|rd|th)|\d{1,2}\/\d{1,2})\b/);
  if (dp) dateISO = qaParseDatePhrase(dp[1].trim(), today);
  return { dueISO: dateISO, dueTime: time };
}
/* "5-10 minutes" → 10 · "30 minutes" → 30 · "1 hour" → 60 (upper bound of any range). */
function qaExtractDurMin(s) {
  const m = String(s).toLowerCase().match(/(\d+)(?:\s*(?:-|–|to)\s*(\d+))?\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)\b/);
  if (!m) return null;
  const n = m[2] ? +m[2] : +m[1];
  return /^h/.test(m[3]) ? n * 60 : n;
}

function parseQuickAdd(text, opts) {
  opts = opts || {};
  const PPC = window.PPC || {};
  const today = opts.today || qaRealTodayISO();
  const users = opts.users || PPC.USERS || [];
  let clients = opts.clients;
  if (!clients && PPC.ONB_CARDS) {
    clients = Array.from(new Set([...(PPC.ONB_CARDS || []), ...(PPC.ACT_CARDS || [])].map(c => c.name)));
  }
  clients = clients || [];

  /* Preprocess dictation: "1 p.m." → "1pm" (so the only remaining periods are
     sentence boundaries), normalize en/em dashes. */
  text = String(text || "")
    .replace(/(\d)\s*([ap])\.?\s*m\.?/gi, (mm, d, ap) => d + ap.toLowerCase() + "m")
    .replace(/[–—]/g, "-");

  const qaResolveUser = (q) => { q = String(q).toLowerCase().trim(); const u = users.find(u => u.id === q || u.name.split(" ")[0].toLowerCase() === q); return u ? u.id : null; };

  const ranges = [];
  const overlaps = (s, e) => ranges.some(r => s < r.end && e > r.start);
  const push = (start, end, field, raw, value, label) => {
    if (start < 0 || end <= start || overlaps(start, end)) return;
    ranges.push({ start, end, field, raw, value, label });
  };

  /* generic scanner — regex whose group 1 is the leading boundary (^|\s) */
  function scan(re, field, makeValue, makeLabel) {
    re.lastIndex = 0; let m;
    while ((m = re.exec(text)) !== null) {
      const lead = (m[1] != null) ? m[1].length : 0;
      const start = m.index + lead;
      const raw = m[0].slice(lead);
      const end = start + raw.length;
      if (!overlaps(start, end)) {
        const value = makeValue(m);
        if (value != null && value !== false) {
          // a field that should be single-valued only takes the first match
          push(start, end, field, raw, value, makeLabel ? makeLabel(value, m) : String(value));
        }
      }
      if (!re.global) break;
    }
  }

  /* 1 — recurring (before plain weekday so "every monday" wins) */
  scan(/(^|\s)(every (?:day|week|month|year|weekday|\d+ (?:days?|weeks?|months?)|mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?))\b/gi,
    "recur", m => m[2].toLowerCase(), v => "🔁 " + v.replace(/^every /, "every "));

  /* 2 — deadline {…} (curly braces) */
  (function () {
    const re = /\{([^}]+)\}/g; let m;
    while ((m = re.exec(text)) !== null) {
      const iso = qaParseDatePhrase(m[1], today);
      if (iso) push(m.index, m.index + m[0].length, "deadline", m[0], iso, "⚑ Deadline " + qaIsoToDueLabel(iso, today));
    }
  })();

  /* ── EXPLICIT field declarations (dictation): "X is Y" / "X: Y". Run FIRST and
     take precedence over loose tokens, so "the due date is Monday at 5pm" wins. */
  let exDue = null, exDueTime = null, exDeadline = null, exPrio = null, exDur = null, exClient = null, exAssignee = null;
  const exServices = [], exWatchers = [], exSubtasks = [], exLabels = [];
  const BND = "(?=[.]|$|\\s+(?:priority|hard\\s+deadline|deadline|estimated\\s+duration|duration|services?\\b|related\\b|clients?\\b|watchers?\\b|cc\\b|loop\\b|assign(?:ee|ed)?\\b|owner\\b|sub-?tasks?\\b|steps?\\b|labels?\\b|those\\b|service\\b))";
  const decl = (re, handler) => {
    re.lastIndex = 0; let m;
    while ((m = re.exec(text)) !== null) {
      const lead = m[1] ? m[1].length : 0;
      const start = m.index + lead, raw = m[0].slice(lead), end = start + raw.length;
      if (!overlaps(start, end)) { const r = handler(m); if (r) ranges.push({ start, end, raw, ex: true, ...r }); }
      if (!re.global) break;
    }
  };

  decl(new RegExp("(^|[.\\s])(?:the\\s+)?due(?:\\s+date)?(?:\\s+for\\s+this\\s+task)?\\s*(?:is\\s+(?:on\\s+)?|on\\s+|:\\s*)(.+?)" + BND, "i"), (m) => {
    const w = qaWhen(m[2], today); if (w.dueISO == null && w.dueTime == null) return null;
    exDue = w.dueISO; exDueTime = w.dueTime;
    return { field: "date", value: w.dueISO || today, label: "📅 " + ((w.dueISO ? qaIsoToDueLabel(w.dueISO, today) : "") + (w.dueTime ? " · " + qaFmtTime12(w.dueTime) : "")).trim() };
  });
  decl(new RegExp("(^|[.\\s])(?:hard\\s+)?deadline\\s*(?:is\\s+(?:on\\s+)?|on\\s+|:\\s*)(.+?)" + BND, "i"), (m) => {
    const w = qaWhen(m[2], today); if (w.dueISO == null) return null; exDeadline = w.dueISO;
    return { field: "deadline", value: w.dueISO, label: "⚑ Deadline " + qaIsoToDueLabel(w.dueISO, today) };
  });
  decl(/(^|[.\s])priority\s*(?:is\s+|:\s*)(high|urgent|medium|med|low|p\s*[1-4])\b/i, (m) => {
    const v = m[2].toLowerCase().replace(/\s/g, "");
    const val = /^p[1-4]$/.test(v) ? ({ p1: "high", p2: "high", p3: "med", p4: "low" })[v] : ({ high: "high", urgent: "high", medium: "med", med: "med", low: "low" })[v];
    if (!val) return null; exPrio = val;
    return { field: "priority", value: val, label: "🚩 " + (val === "high" ? "High" : val === "med" ? "Medium" : "Low") };
  });
  decl(new RegExp("(^|[.\\s])(?:estimated\\s+)?duration\\s*(?:is\\s+|:\\s*)(.+?)" + BND, "i"), (m) => {
    const d = qaExtractDurMin(m[2]); if (d == null) return null; exDur = d;
    const b = PPC.bucketFor ? PPC.bucketFor(d) : null;
    return { field: "duration", value: d, label: "⏱ " + (b ? b.label : d + "m") };
  });
  decl(/(^|[.\s])services?\s*(?:is\s+|are\s+|:\s*)?((?:meta|google|smm|influencer|sales)(?:\s*(?:,|and|&|\s)\s*(?:meta|google|smm|influencer|sales))*)/i, (m) => {
    (m[2].toLowerCase().match(/meta|google|smm|influencer|sales/g) || []).forEach(s => { if (!exServices.includes(s)) exServices.push(s); });
    if (!exServices.length) return null;
    return { field: "service", value: exServices[0], label: "▸ " + exServices.map(s => QA_SVC_LABEL[s] || s).join(", ") };
  });
  decl(new RegExp("(^|[.\\s])(?:related\\s+)?clients?\\s*(?:is\\s+|are\\s+|:\\s*)(.+?)" + BND, "i"), (m) => {
    const val = m[2].trim(); if (!val) return null;
    let matched = null; clients.forEach(c => { if (val.toLowerCase().startsWith(c.toLowerCase()) && (!matched || c.length > matched.length)) matched = c; });
    exClient = matched || val.split(/\s+/).slice(0, 3).join(" ");
    return { field: "client", value: exClient, label: "# " + exClient };
  });
  decl(new RegExp("(^|[.\\s])(?:assignee|assigned\\s+to|assign\\s+to|owner)\\s*(?:is\\s+|:\\s*)?([a-z]+)", "i"), (m) => {
    const id = qaResolveUser(m[2]); if (!id) return null; exAssignee = id;
    const u = users.find(u => u.id === id);
    return { field: "assignee", value: id, label: "+ " + (u ? u.name.split(" ")[0] : id) };
  });
  decl(new RegExp("(^|[.\\s])(?:watchers?|cc)\\s*(?:are\\s+|is\\s+|:\\s*)?([a-z][a-z,&\\s]*?)" + BND, "i"), (m) => {
    m[2].split(/[,&]|\sand\s|\s+/).map(s => qaResolveUser(s)).filter(Boolean).forEach(id => { if (!exWatchers.includes(id)) exWatchers.push(id); });
    if (!exWatchers.length) return null;
    return { field: "watcher", value: exWatchers.slice(), label: "👁 " + exWatchers.map(id => { const u = users.find(u => u.id === id); return u ? u.name.split(" ")[0] : id; }).join(", ") };
  });
  decl(new RegExp("(^|[.\\s])(?:sub-?tasks?|steps?)\\s*(?:is\\s+|are\\s+|:\\s*)(.+?)" + BND, "i"), (m) => {
    const items = m[2].split(/\s*[;,]\s*|\sand\s/).map(s => s.trim().replace(/^add\s+/i, "").replace(/^["']|["']$/g, "")).filter(Boolean);
    if (!items.length) return null; items.forEach(t => exSubtasks.push(t));
    return { field: "subtask", value: items, label: "☑ " + items.length + " subtask" + (items.length > 1 ? "s" : "") };
  });
  decl(new RegExp("(^|[.\\s])labels?\\s*(?:is\\s+|are\\s+|:\\s*)(.+?)" + BND, "i"), (m) => {
    const items = m[2].split(/\s*[;,]\s*|\sand\s|\s+/).map(s => s.trim().toLowerCase()).filter(s => /^[a-z][a-z0-9_-]*$/.test(s));
    if (!items.length) return null; items.forEach(l => { if (!exLabels.includes(l)) exLabels.push(l); });
    return { field: "label", value: items[0], label: "@" + items.join(", @") };
  });
  decl(/(^|[.\s])(urgent)\b(?!\s+priority)/i, () => { if (!exLabels.includes("urgent")) exLabels.push("urgent"); return { field: "label", value: "urgent", label: "@urgent" }; });

  /* 2b — deadline (natural): "deadline friday", "hard deadline Jun 12" (before date) */
  scan(/(^|\s)(?:hard\s+)?deadline\s*:?\s+((?:this |next )?(?:mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)|today|tomorrow|next week|in \d+ (?:days?|weeks?)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}|the \d{1,2}(?:st|nd|rd|th)|\d{1,2}\/\d{1,2})\b/gi,
    "deadline", m => qaParseDatePhrase(m[2], today), v => "⚑ Deadline " + qaIsoToDueLabel(v, today));

  /* 3 — date phrases (optional "on/by/due" prefix; weekdays; "the 5th"; Mon D; M/D).
     Skipped when an explicit "due date is …" was declared (that wins). */
  if (exDue == null) scan(/(^|\s)(?:on |by |due (?:on |by )?)?(today|tonight|tomorrow|tmrw|tmr|next week|in \d+ (?:days?|weeks?)|(?:this |next )?(?:mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}|the \d{1,2}(?:st|nd|rd|th)|\d{1,2}\/\d{1,2})\b/gi,
    "date", m => qaParseDatePhrase(m[2], today), (v) => "📅 " + qaIsoToDueLabel(v, today));

  /* 4 — REMINDERS (natural) — BEFORE time so the reminder's own time isn't
     also grabbed as the due time. "remind me at 9am", "reminders: one time at 9". */
  scan(/(^|\s)(?:remind(?:\s+me)?|reminders?)\b[:\s]+((?:[^.,;@#+]*?)\d(?:[^.,;@#+]*?))(?=$|[.,;]|\s[@#+])/gi,
    "reminder", m => m[2].trim().replace(/\s+/g, " "), v => "🔔 " + v);
  scan(/(^|\s)!(\d+\s?(?:m|min|mins|h|hr|hrs|hour|hours|d|day|days)(?:\s?before)?)\b/gi, "reminder", m => m[2].trim(), v => "🔔 " + v);

  /* 5 — time. noon/midnight · "N in the morning" · "N o'clock" · am/pm · 24h · "at N".
     No am/pm → office hours 9–5 EST. Skipped when an explicit due-time was declared. */
  if (exDueTime == null) {
  scan(/(^|\s)(?:at\s+)?(noon|midday)\b/gi, "time", () => "12:00", () => "🕑 12:00 PM EST");
  scan(/(^|\s)(?:at\s+)?midnight\b/gi, "time", () => "00:00", () => "🕑 12:00 AM EST");
  scan(/(^|\s)(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s+in\s+the\s+(morning|afternoon|evening|night)\b/gi, "time",
    m => { const ap = m[4].toLowerCase() === "morning" ? "am" : "pm"; return String(qaOfficeHour(+m[2], ap)).padStart(2, "0") + ":" + (m[3] || "00"); },
    v => "🕑 " + qaFmtTime12(v) + " EST");
  scan(/(^|\s)(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s?(am|pm)\b/gi, "time",
    m => String(qaOfficeHour(+m[2], m[4])).padStart(2, "0") + ":" + (m[3] || "00"),
    v => "🕑 " + qaFmtTime12(v) + " EST");
  scan(/(^|\s)([01]?\d|2[0-3]):([0-5]\d)\b/g, "time", m => m[2].padStart(2, "0") + ":" + m[3], v => "🕑 " + qaFmtTime12(v) + " EST");
  scan(/(^|\s)(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*o['’]?clock\b/gi, "time", m => String(qaOfficeHour(+m[2], null)).padStart(2, "0") + ":" + (m[3] || "00"), v => "🕑 " + qaFmtTime12(v) + " EST");
  scan(/(^|\s)at\s+(\d{1,2})(?::(\d{2}))?\b/gi, "time", m => String(qaOfficeHour(+m[2], null)).padStart(2, "0") + ":" + (m[3] || "00"), v => "🕑 " + qaFmtTime12(v) + " EST");
  }

  /* 6 — priority (natural). "priority is P1" · "high priority" · "!high" · "p1". */
  const PNUM = { "1": "high", "2": "high", "3": "med", "4": "low" };
  const PWORD = { high: "high", urgent: "high", medium: "med", med: "med", low: "low", normal: "med" };
  const plbl = v => "🚩 " + (v === "high" ? "High" : v === "med" ? "Medium" : "Low");
  scan(/(^|\s)priority(?:\s+is|\s*[:=])?\s*(?:p\s*([1-4])|(high|urgent|medium|med|low|normal))\b/gi,
    "priority", m => m[2] ? PNUM[m[2]] : PWORD[m[3].toLowerCase()], plbl);
  scan(/(^|\s)(high|urgent|medium|med|low)\s+priority\b/gi, "priority", m => PWORD[m[2].toLowerCase()], plbl);
  scan(/(^|\s)!(high|urgent|medium|med|low)\b/gi, "priority", m => PWORD[m[2].toLowerCase()], plbl);
  scan(/(^|\s)p\s?([1-4])\b/gi, "priority", m => PNUM[m[2]], plbl);

  /* 7 — duration estimate (natural). "takes 30 min" · "for 2 hours" · "30m" · "1h". */
  scan(/(^|\s)(?:should\s+take\s+|takes?\s+|for\s+|about\s+|~\s*)?(\d+)\s?(m|min|mins|minute|minutes|h|hr|hrs|hour|hours)\b/gi, "duration",
    m => { const n = +m[2]; return /^h/.test(m[3]) ? n * 60 : n; },
    v => { const b = (PPC.bucketFor ? PPC.bucketFor(v) : null); return "⏱ " + (b ? b.label : v + "m"); });

  /* 8 — labels @foo (multiple) */
  scan(/(^|\s)@([a-z0-9_\-]+)/gi, "label", m => m[2].toLowerCase(), v => "@" + v);

  /* 9 — assignee: "+name" or "assign(ed) to <name>" (resolve to a user) */
  const asgLabel = (v) => { const u = users.find(u => u.id === v); return "+ " + (u ? u.name.split(" ")[0] : v); };
  scan(/(^|\s)assign(?:ed)?\s+to\s+([a-z]+)/gi, "assignee", m => qaResolveUser(m[2]), asgLabel);
  scan(/(^|\s)\+([a-z]+)/gi, "assignee", m => qaResolveUser(m[2]), asgLabel);

  /* 10 — client / project #Name (supports multi-word names) */
  (function () {
    const re = /(^|\s)#/g; let hm;
    while ((hm = re.exec(text)) !== null) {
      const start = hm.index + hm[1].length;
      const after = text.slice(start + 1);
      let matched = null;
      clients.forEach(c => { if (after.toLowerCase().startsWith(c.toLowerCase()) && (!matched || c.length > matched.length)) matched = c; });
      let raw, value;
      if (matched) { raw = "#" + after.slice(0, matched.length); value = matched; }
      else { const tok = (after.match(/^[a-z0-9&_\-]+/i) || [""])[0]; if (!tok) continue; raw = "#" + tok; value = tok; }
      push(start, start + raw.length, "client", raw, value, "# " + value);
    }
  })();

  /* 11 — links (URLs anywhere in the text) */
  scan(/(^|\s)(https?:\/\/[^\s]+|www\.[^\s]+)/gi, "link", m => m[2], v => "🔗 " + (v.replace(/^https?:\/\//, "").length > 22 ? v.replace(/^https?:\/\//, "").slice(0, 22) + "…" : v.replace(/^https?:\/\//, "")));

  /* 12 — watchers: "cc Dhaval, Vihar" / "watchers: Harsh Rayu" / "loop in Vihar and Harsh" */
  (function () {
    const re = /(^|\s)(?:cc|watchers?|loop(?:ing)?\s+in)\b\s*:?\s+([a-z][a-z,&\s]*?)(?=$|[.;]|\s[@#+]|\s+(?:priority|every|remind|reminders?|subtasks?|steps?|checklist|deadline|desc)\b)/gi;
    let m;
    while ((m = re.exec(text)) !== null) {
      const start = m.index + m[1].length;
      const raw = m[0].slice(m[1].length);
      const end = start + raw.length;
      if (overlaps(start, end)) continue;
      const ids = m[2].split(/[,&\s]+/).map(qaResolveUser).filter(Boolean);
      if (!ids.length) continue;
      ranges.push({ start, end, field: "watcher", raw, value: ids, label: "👁 " + ids.map(id => { const u = users.find(u => u.id === id); return u ? u.name.split(" ")[0] : id; }).join(", ") });
    }
  })();

  /* 13 — subtasks: "subtasks: a; b; c" (consumes to end of string) */
  (function () {
    const m = text.match(/(^|\s)(?:subtasks?|steps?|checklist)\s*:\s*([\s\S]+)$/i);
    if (!m) return;
    const start = m.index + m[1].length;
    const raw = m[0].slice(m[1].length);
    if (overlaps(start, start + raw.length)) return;
    const items = m[2].split(/\s*[;,]\s*/).map(s => s.trim()).filter(Boolean);
    if (items.length) ranges.push({ start, end: start + raw.length, field: "subtask", raw, value: items, label: "☑ " + items.length + " subtask" + (items.length > 1 ? "s" : "") });
  })();

  /* 14 — description: "desc: …" / "// …" (consumes to end) */
  (function () {
    const m = text.match(/(^|\s)(?:desc(?:ription)?\s*:|\/\/)\s*([\s\S]+)$/i);
    if (!m) return;
    const start = m.index + m[1].length;
    const raw = m[0].slice(m[1].length);
    if (overlaps(start, start + raw.length)) return;
    ranges.push({ start, end: start + raw.length, field: "description", raw, value: m[2].trim(), label: "≡ note" });
  })();

  /* ── assemble ──────────────────────────────────────────────── */
  ranges.sort((a, b) => a.start - b.start);

  // title = text minus matched ranges
  let title = "", cursor = 0;
  const segments = [];
  ranges.forEach(r => {
    if (r.start > cursor) { const seg = text.slice(cursor, r.start); title += seg; segments.push({ text: seg, matched: false }); }
    segments.push({ text: text.slice(r.start, r.end), matched: true, field: r.field });
    cursor = r.end;
  });
  if (cursor < text.length) { const seg = text.slice(cursor); title += seg; segments.push({ text: seg, matched: false }); }
  title = title
    .replace(/\s+/g, " ")
    .replace(/(\s*[,;:]\s*){2,}/g, ", ")   // collapse runs of punctuation left by stripped phrases
    .replace(/(\.\s*){2,}/g, ". ")          // collapse runs of periods (sentence gaps)
    .replace(/\s+([,;:.])/g, "$1")          // no space before punctuation
    .replace(/^[\s,;:.\-]+|[\s,;:.\-]+$/g, "") // trim stray leading/trailing punctuation
    .trim();

  const qaUniq = (a) => Array.from(new Set(a));
  const first = (f) => { const r = ranges.find(r => r.field === f); return r ? r.value : null; };
  const dueISO = exDue != null ? exDue : first("date");
  const labels = qaUniq([...exLabels, ...ranges.filter(r => r.field === "label" && !r.ex).map(r => r.value)]);
  const reminders = ranges.filter(r => r.field === "reminder").map(r => r.value);
  const links = ranges.filter(r => r.field === "link").map(r => ({ label: r.value.replace(/^https?:\/\//, "").slice(0, 40), url: r.value }));
  const watchers = qaUniq([...exWatchers, ...ranges.filter(r => r.field === "watcher" && !r.ex).flatMap(r => r.value)]);
  const subtaskStrings = [...exSubtasks, ...ranges.filter(r => r.field === "subtask" && !r.ex).flatMap(r => r.value)];
  const checklist = subtaskStrings.map(t => ({ id: "c" + Math.abs((t.length * 7 + (t.charCodeAt(0) || 0)) % 99999).toString(36), text: t, done: false }));
  const description = (ranges.find(r => r.field === "description") || {}).value || null;

  /* services — explicit declaration ∪ loose voice keywords (NON-stripping for the
     loose ones, so "Run meta campaign" keeps its words). */
  const casualServices = [];
  QA_SERVICE_WORDS.forEach(([word, code]) => {
    const re = new RegExp("(^|\\s)" + word.replace(/ /g, "\\s+") + "(\\s|$)", "i");
    if (re.test(text) && !casualServices.includes(code)) casualServices.push(code);
  });
  const services = qaUniq([...exServices, ...casualServices]);
  const serviceTokens = casualServices.filter(c => !exServices.includes(c)).map(c => ({ field: "service", label: "▸ " + (QA_SVC_LABEL[c] || c), raw: c }));

  return {
    title,
    dueISO,
    due: dueISO ? qaIsoToDueLabel(dueISO, today) : null,
    dueTime: exDueTime != null ? exDueTime : first("time"),
    deadlineISO: exDeadline != null ? exDeadline : first("deadline"),
    recur: first("recur"),
    timeEstimateMin: exDur != null ? exDur : first("duration"),
    priority: exPrio != null ? exPrio : first("priority"),
    assigneeId: exAssignee != null ? exAssignee : first("assignee"),
    client: exClient != null ? exClient : first("client"),
    service: services[0] || null,
    services,
    labels,
    reminders,
    links,
    watchers,
    checklist,
    description,
    tokens: ranges.map(r => ({ field: r.field, label: r.label, raw: r.raw })).concat(serviceTokens),
    segments
  };
}

/* service voice keywords (non-stripping) → canonical service code */
const QA_SERVICE_WORDS = [
  ["meta", "meta"], ["facebook", "meta"], ["instagram", "meta"], ["fb", "meta"], ["ig", "meta"],
  ["google", "google"], ["google ads", "google"], ["ppc", "google"],
  ["smm", "smm"], ["social media", "smm"], ["social", "smm"],
  ["influencer", "influencer"], ["influencers", "influencer"], ["ugc", "influencer"],
  ["sales", "sales"]
];
const QA_SVC_LABEL = { meta: "Meta", google: "Google", smm: "SMM", influencer: "Influencer", sales: "Sales" };

/* chip tone per parsed field */
const QA_FIELD_KIND = {
  date: "accent", time: "accent", deadline: "danger", recur: "accent",
  priority: "warn", duration: "ok", label: "outline", assignee: "accent", client: "outline", reminder: "warn", service: "ok",
  link: "outline", watcher: "accent", subtask: "ok", description: "outline"
};

/* ── Text Scan — paste a paragraph, get one task per sentence/line ──────
   Splits on newlines + sentence boundaries (punctuation followed by a capital/
   digit, so "4 p.m." doesn't split), parses each chunk with parseQuickAdd, and
   creates a task per chunk. 100% local. */
function textScanSplit(text) {
  const raw = String(text || "");
  const parts = raw.split(/\r?\n+/).flatMap(line => line.split(/(?<=[.!?;])\s+(?=[A-Z0-9“"'])/));
  return parts.map(s => s.trim().replace(/[.;]+$/, "").trim()).filter(s => s.length > 1);
}
/* parseQuickAdd result → a store.addTask payload (used by Text Scan) */
function tdParsedToPayload(p, role, defaults) {
  const PPC = window.PPC;
  return {
    title: (p.title || "").trim() || "(untitled)",
    reporter: role.id, assignee: p.assigneeId || role.id,
    due: p.dueISO ? (p.due || PPC.isoToDueLabel(p.dueISO)) : "No date",
    dueISO: p.dueISO || null, dueTime: p.dueTime || (p.dueISO ? "09:00" : null),
    deadlineISO: p.deadlineISO || null, deadlineTime: p.deadlineTime || null,
    recur: p.recur || null, priority: p.priority || "med",
    client: p.client || (defaults && defaults.client) || null,
    projectId: (defaults && defaults.projectId) || null,
    sectionId: (defaults && defaults.sectionId) || null,
    services: p.services || [], service: (p.services || [])[0] || null,
    labels: p.labels || [], watchers: p.watchers || [], reminders: p.reminders || [],
    links: p.links || [], checklist: p.checklist || [],
    timeEstimateMin: p.timeEstimateMin != null ? p.timeEstimateMin : null, status: "open"
  };
}

/* Reusable Text Scan panel — textarea → preview list → create N tasks. */
function TextScanPanel({ role, defaults, onDone, onBack }) {
  const store = useStore();
  const [text, setText] = React.useState("");
  const [results, setResults] = React.useState(null);   // null | [{raw, parsed}]
  const process = () => {
    const parts = textScanSplit(text);
    if (!parts.length) { window.toast?.("No tasks found in that text", { icon: "!" }); return; }
    setResults(parts.map(raw => ({ raw, parsed: window.parseQuickAdd(raw, {}) })));
  };
  const create = () => {
    const made = results.map(r => store.addTask(tdParsedToPayload(r.parsed, role, defaults)));
    window.toast?.(`Created ${made.length} task${made.length > 1 ? "s" : ""} ✨`, { icon: "✨" });
    onDone && onDone(made);
  };
  return (
    <div className="t6-scan">
      {!results ? (
        <>
          <div className="t6-scan-eyebrow">✦ Text Scan — paste a paragraph, each sentence becomes a task</div>
          <textarea className="t6-ramble-ta" autoFocus value={text} onChange={e => setText(e.target.value)}
            placeholder={"Paste a paragraph — each line/sentence becomes its own task.\ne.g. “Call Ravi tomorrow at 4pm. Email the deck Friday, p1. Grocery on Wednesday.”"} />
          <div className="row gap-2" style={{ justifyContent: "flex-end", marginTop: 8 }}>
            {onBack && <button className="btn ghost sm" onClick={onBack}>Back</button>}
            <button className="btn primary sm" disabled={!text.trim()} onClick={process}>Scan text</button>
          </div>
        </>
      ) : (
        <>
          <div className="t6-scan-eyebrow">Found {results.length} task{results.length > 1 ? "s" : ""} — review, then create</div>
          <div className="t6-scan-list">
            {results.map((r, i) => (
              <div key={i} className="t6-scan-item">
                <span className="check" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t6-scan-title">{r.parsed.title || r.raw}</div>
                  <div className="t6-scan-chips">
                    {r.parsed.dueISO && <span className="pill accent">📅 {window.PPC.isoToDueLabel(r.parsed.dueISO)}{r.parsed.dueTime ? " " + window.PPC.fmtTime12(r.parsed.dueTime) : ""}</span>}
                    {r.parsed.priority && r.parsed.priority !== "med" && <span className="pill warn">🚩 {r.parsed.priority}</span>}
                    {r.parsed.timeEstimateMin != null && <span className="pill ok">⏱ {(window.PPC.bucketFor(r.parsed.timeEstimateMin) || {}).label || r.parsed.timeEstimateMin + "m"}</span>}
                    {r.parsed.assigneeId && <span className="pill outline">+{((window.PPC.userMap[r.parsed.assigneeId] || {}).name || r.parsed.assigneeId).split(" ")[0]}</span>}
                  </div>
                </div>
                <button className="t6-nt-x" title="Drop this one" onClick={() => setResults(results.filter((_, x) => x !== i))}>✕</button>
              </div>
            ))}
          </div>
          <div className="row gap-2" style={{ justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn ghost sm" onClick={() => setResults(null)}>Back</button>
            <button className="btn primary sm" disabled={!results.length} onClick={create}>Create {results.length} task{results.length > 1 ? "s" : ""}</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── QuickAddBar — one-line capture, now with the SAME widget zone as
   the New Task modal (chips + pills + inline editors) + a Ramble button
   beside Add. Typed/dictated tokens are stripped from the title live and
   pushed into the fields, so every widget is visible while you speak. ──── */
function QuickAddBar({ role, defaultClient, defaultProject, defaultSection, onAdded, placeholder, compact, autoFocus }) {
  const store = useStore();
  const blank = () => (window.tdBlankForm ? window.tdBlankForm({ client: defaultClient, projectId: defaultProject }, role) : { title: "" });
  const [form, setForm] = React.useState(blank);
  const [activeField, setActiveField] = React.useState(null);
  const [focus, setFocus] = React.useState(false);
  const [mode, setMode] = React.useState("none");   // none | ramble | scan
  const [rambleText, setRambleText] = React.useState("");
  const [rambleBusy, setRambleBusy] = React.useState(false);
  const inputRef = React.useRef(null);

  // reset when the acting user, default client, or default project changes
  React.useEffect(() => { setForm(blank()); setActiveField(null); setMode("none"); }, [role.id, defaultClient, defaultProject, defaultSection]);
  React.useEffect(() => { if (autoFocus && inputRef.current) inputRef.current.focus(); }, []);

  const ready = (form.title || "").trim().length > 0;
  const hasField = !!(form.dueISO || (form.priority && form.priority !== "med") || form.timeEstimateMin != null
    || form.deadlineISO || form.recur || (form.assignee && form.assignee !== role.id) || form.client
    || (form.services || []).length || (form.labels || []).length || (form.watchers || []).length
    || (form.reminders || []).length || (form.checklist || []).length);
  const showZone = compact || focus || ready || hasField || !!activeField || mode !== "none";

  const applyType = (raw) => setForm(f => (window.tdMergeParse ? window.tdMergeParse(f, raw, "title", role) : { ...f, title: raw }));

  const buildPayload = () => ({
    title: (form.title || "").trim(),
    reporter: role.id,
    assignee: form.assignee || role.id,
    due: form.due || "Today",
    dueISO: form.dueISO || null,
    dueTime: form.dueISO ? (form.dueTime || "09:00") : null,
    deadlineISO: form.deadlineISO || null,
    recur: form.recur || null,
    reminders: form.reminders || [],
    priority: form.priority || "med",
    client: form.client || defaultClient || null,
    projectId: form.projectId || defaultProject || null,
    sectionId: form.sectionId || defaultSection || null,
    service: (form.services || [])[0] || null,
    services: form.services || [],
    labels: form.labels || [],
    watchers: form.watchers || [],
    links: form.links || [],
    checklist: form.checklist || [],
    description: form.description || "",
    timeEstimateMin: form.timeEstimateMin != null ? form.timeEstimateMin : null,
    status: "open"
  });

  const commit = () => {
    if (!ready) return;
    const p = buildPayload();
    const created = store.addTask(p);
    const who = window.PPC.userMap[p.assignee];
    window.toast?.(`Task added${who ? " · " + who.name.split(" ")[0] : ""}`, { icon: "✓" });
    onAdded && onAdded(created);
    setForm(blank());
    setActiveField(null);
    inputRef.current && inputRef.current.focus();
  };

  const expand = () => {
    const p = buildPayload();
    window.openNewTask?.(p);
    setForm(blank());
    setActiveField(null);
  };

  const runRamble = async () => {
    const txt = rambleText.trim();
    if (!txt) return;
    setRambleBusy(true);
    try {
      const p = await window.PPC.rambleParse(txt);
      setForm(f => (window.tdApplyRamble ? window.tdApplyRamble(f, p, role) : f));
      setMode("none"); setRambleText("");
      window.toast?.("Structured into a task ✨", { icon: "✨" });
    } catch (e) { window.toast?.("Couldn’t structure that — try again", { icon: "!" }); }
    finally { setRambleBusy(false); }
  };

  const onKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    else if (e.key === "Escape") { setForm(blank()); setActiveField(null); e.currentTarget.blur(); }
  };

  return (
    <div className={`t6-qa ${focus || showZone ? "focus" : ""} ${compact ? "compact" : ""}`}>
      {mode === "scan" ? (
        <div className="t6-qa-ramble">
          <TextScanPanel role={role} defaults={{ projectId: defaultProject || null, sectionId: defaultSection || null, client: defaultClient || null }}
            onBack={() => setMode("none")}
            onDone={() => { setMode("none"); setRambleText(""); }} />
        </div>
      ) : mode === "ramble" ? (
        <div className="t6-qa-ramble">
          <textarea className="t6-ramble-ta" autoFocus value={rambleText} onChange={e => setRambleText(e.target.value)}
            placeholder={"Dump everything about ONE task — what, when, who, priority, steps."} />
          <div className="row gap-2" style={{ justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn ghost sm" onClick={() => setMode("none")}>Back</button>
            <button className="btn primary sm" disabled={rambleBusy || !rambleText.trim()} onClick={runRamble}>{rambleBusy ? "Structuring…" : "✨ Structure it"}</button>
          </div>
        </div>
      ) : (
        <div className="t6-qa-input-row">
          <span className="t6-qa-plus">+</span>
          <div className="t6-qa-field">
            <input
              ref={inputRef}
              className="t6-qa-input"
              value={form.title}
              placeholder={placeholder || "Add a task — try “Call Ravi tomorrow 4pm p1 30m @design #client +Harsh”"}
              onChange={e => applyType(e.target.value)}
              onKeyDown={onKey}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>
          <button className={`t6-qa-ramblebtn ${compact ? "icon" : ""}`} onMouseDown={e => e.preventDefault()} onClick={() => setMode("scan")} title="Text Scan — paste a paragraph, get one task per sentence">
            <Icon k="lines" className="ic sm" />{compact ? null : " Text Scan"}
          </button>
          <button className={`t6-qa-ramblebtn ${compact ? "icon" : ""}`} onMouseDown={e => e.preventDefault()} onClick={() => setMode("ramble")} title="Ramble — structure ONE task from a brain-dump">
            <Icon k="wave" className="ic sm" />{compact ? null : " Ramble"}
          </button>
          {!compact && <button className="btn sm ghost" onMouseDown={e => e.preventDefault()} onClick={expand} title="Open full task form">⋯</button>}
          {!compact && <button className="btn sm primary" disabled={!ready} onMouseDown={e => e.preventDefault()} onClick={commit}>Add</button>}
        </div>
      )}
      {/* the SAME widgets as the New Task box — visible while you type. Section
         composer (compact) shows ICON-ONLY widgets with hover tooltips. */}
      {showZone && mode === "none" && window.TaskFieldZone && (
        <div className="t6-qa-zone">
          <TaskFieldZone form={form} setForm={setForm} role={role} activeField={activeField} setActiveField={setActiveField} iconOnly={compact} />
          <div className="t6-qa-hint">↵ to add · click a widget to set it · Ramble for one task · Text Scan for many</div>
        </div>
      )}
    </div>
  );
}

/* ── TenMinBanner — the "start your day" >10-min-rule nudge ─────── */
function TenMinBanner({ role }) {
  const store = useStore();
  const today = window.PPC.realToday ? window.PPC.realToday() : window.PPC.TODAY;
  const [hidden, setHidden] = React.useState(false);
  if (hidden) return null;
  const mine = store.tasks.filter(t => t.assignee === role.id);
  const loggedToday = mine.filter(t => t.createdISO === today && (t.timeEstimateMin || 0) > 10).length;
  const missing = mine.filter(t => t.status !== "done" && t.timeEstimateMin == null).length;
  return (
    <div className="t6-rule-banner">
      <div className="t6-rule-ic">☀</div>
      <div className="col" style={{ flex: 1 }}>
        <span className="t6-rule-title">Start your day — log every task that takes more than 10 minutes</span>
        <span className="t6-rule-sub">
          <strong className="mono">{loggedToday}</strong> logged today
          {missing > 0
            ? <> · <strong className="mono">{missing}</strong> open task{missing === 1 ? "" : "s"} still need a duration estimate</>
            : <> · everything has an estimate</>}
        </span>
      </div>
      <button className="btn ghost sm" onClick={() => setHidden(true)}>Dismiss</button>
    </div>
  );
}

/* ── Ramble — LOCAL structuring (no cloud / no LLM).
   Turns a dictated brain-dump into the same structured shape parseQuickAdd
   returns, using the in-house deterministic parser only. Pairs with Wispr
   Flow "Polish" upstream for the smart understanding — nothing leaves the
   browser. (If a server-side LLM is ever wired in production, swap this body
   to call it; the return shape is the contract.) ──── */
function rambleParse(text) {
  return { ...parseQuickAdd(text, {}), _source: "local" };
}

if (window.PPC) {
  window.PPC.parseQuickAdd = parseQuickAdd;
  window.PPC.rambleParse = rambleParse;
  window.PPC.textScanSplit = textScanSplit;
  window.PPC.tdParsedToPayload = tdParsedToPayload;
  window.PPC.realToday = qaRealTodayISO;
  window.PPC.isoToDueLabel = (iso) => qaIsoToDueLabel(iso, qaRealTodayISO());
  window.PPC.fmtTime12 = qaFmtTime12;
  window.PPC.SERVICE_LABELS = QA_SVC_LABEL;
}
Object.assign(window, { parseQuickAdd, rambleParse, QuickAddBar, TenMinBanner, TextScanPanel, tdParsedToPayload });
