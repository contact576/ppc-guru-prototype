/* persist.js — LOCAL MEMORY for the prototype.
   Saves the user-mutated slices of window.PPC to localStorage on every
   `ppc:update`, and re-hydrates them on boot — so tasks, projects, notes,
   sales moves, optimization logs and content-plan changes survive reloads
   (per browser/device). No backend. Version-gated: bump PERSIST_VERSION
   whenever seed schemas change so stale snapshots are discarded cleanly.
   Escape hatch: window.PPC.resetDemoData() wipes the snapshot + reloads.

   Loads AFTER all data modules (data.js … phase5Sales.js) and BEFORE the
   React app mounts, so components render hydrated data. */
(function () {
  const PPC = window.PPC;
  if (!PPC || !PPC.store) return;
  const store = PPC.store;
  const KEY = "ppc.demo.state";
  const PERSIST_VERSION = 1;   // bump on any seed/schema change to invalidate old saves

  /* helpers for in-place vs reassign so we don't break closures that hold a
     reference to the original object (e.g. getProfile closes over `profiles`). */
  const replaceArr = (target, v) => { if (Array.isArray(target) && Array.isArray(v)) { target.length = 0; target.push(...v); } };
  const mergeObj = (target, v) => { if (target && v && typeof v === "object") Object.keys(v).forEach(k => { target[k] = v[k]; }); };

  /* slice registry: { k, read, write }. Each write is defensive. */
  const slices = [
    { k: "tasks", read: () => store.tasks, write: v => { if (Array.isArray(v)) store.tasks = v; } },
    { k: "projects", read: () => store.projects, write: v => { if (Array.isArray(v)) store.projects = v; } },
    { k: "profiles", read: () => store.profiles, write: v => mergeObj(store.profiles, v) }
  ];
  if (Array.isArray(PPC.OPT_LOG)) slices.push({ k: "optlog", read: () => PPC.OPT_LOG, write: v => replaceArr(PPC.OPT_LOG, v) });
  if (Array.isArray(PPC.CONTENT_PLANS)) slices.push({ k: "plans", read: () => PPC.CONTENT_PLANS, write: v => replaceArr(PPC.CONTENT_PLANS, v) });
  if (Array.isArray(PPC.CRED_AUDIT)) slices.push({ k: "credaudit", read: () => PPC.CRED_AUDIT, write: v => replaceArr(PPC.CRED_AUDIT, v) });
  if (PPC.S5 && PPC.S5.state) slices.push({ k: "s5state", read: () => PPC.S5.state, write: v => mergeObj(PPC.S5.state, v) });

  /* ── hydrate (boot) ── */
  let restored = false;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const snap = JSON.parse(raw);
      if (snap && snap.v === PERSIST_VERSION && snap.data) {
        slices.forEach(s => { if (snap.data[s.k] != null) { try { s.write(snap.data[s.k]); } catch (e) { /* skip bad slice */ } } });
        restored = true;
      } else {
        localStorage.removeItem(KEY); // stale schema → start clean
      }
    }
  } catch (e) { try { localStorage.removeItem(KEY); } catch (_) {} }

  /* ── save (debounced) on any mutation ── */
  let timer = null;
  const save = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        const data = {};
        slices.forEach(s => { try { data[s.k] = s.read(); } catch (e) {} });
        localStorage.setItem(KEY, JSON.stringify({ v: PERSIST_VERSION, savedAt: Date.now(), data }));
      } catch (e) { /* quota or serialise error — ignore, demo keeps running */ }
    }, 400);
  };
  window.addEventListener("ppc:update", save);

  /* ── controls ── */
  PPC.resetDemoData = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };
  PPC.persistInfo = function () {
    let saved = null;
    try { const raw = localStorage.getItem(KEY); if (raw) saved = JSON.parse(raw).savedAt; } catch (e) {}
    return { key: KEY, version: PERSIST_VERSION, restoredOnBoot: restored, lastSaved: saved, slices: slices.map(s => s.k) };
  };

  if (restored) console.log("[PPC] local memory restored:", slices.map(s => s.k).join(", "));
})();
