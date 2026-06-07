/* Netlify Function: personal state store backed by Netlify Blobs.
   GET  /.netlify/functions/state?key=<syncCode>  → returns the saved JSON (or "")
   POST /.netlify/functions/state?key=<syncCode>  → body is the JSON snapshot; saved.
   The <syncCode> is an unguessable per-user key (see src/persist.js). No auth beyond
   the secrecy of the key — single-user "my data across devices", per the plan. */
import { getStore } from "@netlify/blobs";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};

export default async (req) => {
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: CORS });

  const url = new URL(req.url);
  const key = (url.searchParams.get("key") || "").trim();
  if (key.length < 12) {
    return new Response(JSON.stringify({ error: "missing or too-short key" }), { status: 400, headers: { ...CORS, "content-type": "application/json" } });
  }

  const store = getStore("ppc-user-state");

  try {
    if (req.method === "GET") {
      const data = await store.get(key, { type: "text" });
      return new Response(data || "", { status: 200, headers: { ...CORS, "content-type": "application/json" } });
    }
    if (req.method === "POST") {
      const body = await req.text();
      if (body.length > 4_500_000) {
        return new Response(JSON.stringify({ error: "payload too large" }), { status: 413, headers: { ...CORS, "content-type": "application/json" } });
      }
      await store.set(key, body);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...CORS, "content-type": "application/json" } });
    }
    return new Response("method not allowed", { status: 405, headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e && e.message || e) }), { status: 500, headers: { ...CORS, "content-type": "application/json" } });
  }
};
