# Deploying the PPC Guru prototype

The prototype is **static** (in-browser React + Babel-standalone from CDN, local files in
`prototype/`). There is **no build step**. Memory is **localStorage** (per browser/device) — it
works the same locally and when deployed. `netlify.toml` is set to publish the `prototype/` folder.

## Option A — Netlify drag-and-drop (fastest, no Git, no account wiring)
1. Go to https://app.netlify.com/drop
2. Drag the **`prototype/`** folder onto the page.
3. Netlify gives you a live URL (e.g. `random-name.netlify.app`). Done.
- To update later: drag the folder again (or use a named site → "Deploys" → drag).

## Option B — Netlify + GitHub (auto-deploy on every push — "feels like a real project")
1. Create a GitHub repo and push this project:
   ```bash
   cd "/Users/jaydeeppatel/PPC ERP"
   git init && git add -A && git commit -m "PPC Guru prototype"
   git branch -M main
   git remote add origin https://github.com/<you>/ppc-guru-prototype.git
   git push -u origin main
   ```
2. In Netlify: **Add new site → Import from Git → pick the repo.**
3. Build settings are read from `netlify.toml` automatically (publish = `prototype`, no build command).
4. Every `git push` now redeploys. Use a branch + PR for review if you like.

## Option C — Netlify CLI (one command, named site)
```bash
npm i -g netlify-cli
netlify login
netlify deploy --dir=prototype --prod
```

## Memory model (important)
- **Now:** localStorage = per-browser memory. Your tasks/projects/notes/sales moves persist on
  the device you used. Clearing site data or using another device/browser starts fresh.
- **Reset:** Admin → Users & Roles → **Local memory → Reset demo data** (or `window.PPC.resetDemoData()`).
- **Cross-device shared memory (future):** needs a backend — **Netlify Blobs** (simplest, same platform),
  Supabase, or Firebase. That belongs in the live Next.js app, not this sandbox. The persistence layer
  (`src/persist.js`) is the seam to swap: replace the localStorage read/write with API calls and the rest
  of the app is unchanged.

## Notes
- Babel-standalone transforms on page load, so first paint is a touch slower than a compiled build —
  fine for a demo/spec sandbox. The production app (Next.js, built by Shrikaanth) compiles ahead of time.
- The single-file `PPC Guru — Prototype (….).html` also works if you ever need a no-server copy to email,
  but the deployed multi-file `prototype/` is the real thing.
