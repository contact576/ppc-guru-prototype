/* persist.js — MEMORY for the prototype: localStorage (instant, offline) +
   optional Netlify Blobs cloud sync so YOUR data follows you across devices.

   Model (single-user "my data across devices"):
   - A per-user **sync code** (unguessable random string) identifies your data.
     Saved in localStorage; copy it to another device to pull the same data.
   - On boot: hydrate localStorage instantly, then fetch your cloud blob; if the
     cloud copy is NEWER (timestamp) apply it and re-render. If local is newer,
     push it up.
   - On change: write localStorage immediately + push to the cloud (debounced).
   - Cloud sync only works on the deployed Netlify site (the function exists there);
     on localhost / the offline bundle it silently falls back to localStorage only.
   Version-gated (bump PERSIST_VERSION on seed/schema changes).
   Controls: PPC.resetDemoData(), PPC.setSyncCode(code), PPC.persistInfo().

   Loads AFTER all data modules and BEFORE the React app mounts. */
(function () {
  const PPC = window.PPC;
  if (!PPC || !PPC.store) return;
  const store = PPC.store;
  const KEY = "ppc.demo.state";
  const SYNC_LS = "ppc.sync.code";
  const REMOTE = "/.netlify/functions/state";
  const PERSIST_VERSION = 2;   // bump on any seed/schema change to invalidate old saves (v2 = fresh task DB)

  const replaceArr = (target, v) => { if (Array.isArray(target) && Array.isArray(v)) { target.length = 0; target.push(...v); } };
  const mergeObj = (target, v) => { if (target && v && typeof v === "object") Object.keys(v).forEach(k => { target[k] = v[k]; }); };

  const slices = [
    { k: "tasks", read: () => store.tasks, write: v => { if (Array.isArray(v)) store.tasks = v; } },
    { k: "projects", read: () => store.projects, write: v => { if (Array.isArray(v)) store.projects = v; } },
    { k: "profiles", read: () => store.profiles, write: v => mergeObj(store.profiles, v) }
  ];
  if (Array.isArray(PPC.OPT_LOG)) slices.push({ k: "optlog", read: () => PPC.OPT_LOG, write: v => replaceArr(PPC.OPT_LOG, v) });
  if (Array.isArray(PPC.CONTENT_PLANS)) slices.push({ k: "plans", read: () => PPC.CONTENT_PLANS, write: v => replaceArr(PPC.CONTENT_PLANS, v) });
  if (Array.isArray(PPC.CRED_AUDIT)) slices.push({ k: "credaudit", read: () => PPC.CRED_AUDIT, write: v => replaceArr(PPC.CRED_AUDIT, v) });
  if (PPC.S5 && PPC.S5.state) slices.push({ k: "s5state", read: () => PPC.S5.state, write: v => mergeObj(PPC.S5.state, v) });

  const snapshot = () => { const data = {}; slices.forEach(s => { try { data[s.k] = s.read(); } catch (e) {} }); return { v: PERSIST_VERSION, savedAt: Date.now(), data }; };
  const applySnapshot = (snap) => {
    if (!snap || snap.v !== PERSIST_VERSION || !snap.data) return false;
    slices.forEach(s => { if (snap.data[s.k] != null) { try { s.write(snap.data[s.k]); } catch (e) {} } });
    return true;
  };

  /* sync code — generate once, persist; copy to another device to share your data */
  function genCode() {
    try { const a = new Uint8Array(16); crypto.getRandomValues(a); return [...a].map(b => b.toString(16).padStart(2, "0")).join(""); }
    catch (e) { return ("u" + Date.now().toString(36) + Math.abs(Math.floor((1 + (typeof performance !== "undefined" ? performance.now() : 1)) * 1e6)).toString(36)).padEnd(20, "0"); }
  }
  function getSyncCode() {
    let c = null;
    try { c = localStorage.getItem(SYNC_LS); } catch (e) {}
    if (!c) { c = genCode(); try { localStorage.setItem(SYNC_LS, c); } catch (e) {} }
    return c;
  }

  /* ── boot: hydrate localStorage (instant) ── */
  let restored = false;
  let localRev = 0;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const snap = JSON.parse(raw);
      if (applySnapshot(snap)) { restored = true; localRev = snap.savedAt || 0; }
      else localStorage.removeItem(KEY);
    }
  } catch (e) { try { localStorage.removeItem(KEY); } catch (_) {} }

  /* ── save (debounced) → localStorage + cloud ── */
  let saveTimer = null, pushTimer = null;
  let remoteUp = null, lastRemotePush = null;

  async function remotePush(snap) {
    const code = getSyncCode();
    try {
      const r = await fetch(`${REMOTE}?key=${encodeURIComponent(code)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(snap) });
      remoteUp = r.ok; if (r.ok) lastRemotePush = snap.savedAt;
    } catch (e) { remoteUp = false; }
  }
  const schedulePush = (snap) => { clearTimeout(pushTimer); pushTimer = setTimeout(() => remotePush(snap), 1500); };

  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const snap = snapshot();
      localRev = snap.savedAt;
      try { localStorage.setItem(KEY, JSON.stringify(snap)); } catch (e) {}
      schedulePush(snap);
    }, 400);
  };
  window.addEventListener("ppc:update", save);

  /* ── boot: cloud sync (newer wins) ── */
  (async function cloudSync() {
    const code = getSyncCode();
    let remote = null;
    try {
      const r = await fetch(`${REMOTE}?key=${encodeURIComponent(code)}`);
      remoteUp = r.ok;
      if (r.ok) { const t = await r.text(); if (t && t.trim()) remote = JSON.parse(t); }
    } catch (e) { remoteUp = false; return; }   // offline / localhost / no function → localStorage only

    if (remote && remote.v === PERSIST_VERSION && remote.data && (remote.savedAt || 0) > localRev) {
      if (applySnapshot(remote)) {
        localRev = remote.savedAt;
        try { localStorage.setItem(KEY, JSON.stringify(remote)); } catch (e) {}
        (PPC.bump ? PPC.bump() : window.dispatchEvent(new Event("ppc:update")));
        console.log("[PPC] synced from cloud (newer)");
      }
    } else if (remoteUp && restored && (!remote || (remote.savedAt || 0) < localRev)) {
      const snap = snapshot(); snap.savedAt = localRev || Date.now(); remotePush(snap);   // local newer → push up
    }
  })();

  /* ── controls ── */
  PPC.resetDemoData = function () {
    const code = getSyncCode();
    try { localStorage.removeItem(KEY); } catch (e) {}
    // tombstone (empty data) — Netlify Blobs rejects empty-string values, and an
    // empty `data` object means boot applies nothing → seed shows.
    fetch(`${REMOTE}?key=${encodeURIComponent(code)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ v: PERSIST_VERSION, savedAt: Date.now(), data: {} }) })
      .catch(() => {}).finally(() => location.reload());
  };
  PPC.setSyncCode = function (code) {
    code = String(code || "").trim();
    if (code.length < 12) { window.toast?.("That sync code looks too short.", { icon: "!" }); return false; }
    try { localStorage.setItem(SYNC_LS, code); localStorage.removeItem(KEY); } catch (e) {}
    location.reload(); return true;
  };
  PPC.persistInfo = function () {
    return {
      key: KEY, version: PERSIST_VERSION, restoredOnBoot: restored,
      lastSaved: localRev || null, slices: slices.map(s => s.k),
      syncCode: getSyncCode(), cloud: remoteUp === true ? "connected" : remoteUp === false ? "offline (local only)" : "checking…",
      lastCloudPush: lastRemotePush
    };
  };

  if (restored) console.log("[PPC] local memory restored:", slices.map(s => s.k).join(", "));
})();
