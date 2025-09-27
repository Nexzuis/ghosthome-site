// /src/routes/pay.jsx
import { useState } from "react";

export default function Pay() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [dbg, setDbg] = useState(null);

  async function start() {
    setBusy(true);
    setErr("");
    setDbg(null);
    try {
      const r = await fetch("/api/pf-link", { method: "GET" });
      const j = await r.json().catch(() => null);

      if (j && j.ok && j.redirect) {
        setDbg({ redirect: j.redirect, sig: j.debug_signature_md5, base: j.debug_signature_base });
        window.location.href = j.redirect;   // simple redirect
        return;
      }

      setErr(j?.error || `Server error${!r.ok ? ` (HTTP ${r.status})` : ""}`);
    } catch (e) {
      setErr(e?.message || "Failed to contact server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold">Payment</h1>
      <p className="mt-2">R99/month (via PayFast)</p>

      {err && (
        <div className="mt-6 rounded-xl border p-5 bg-red-50 border-red-200 text-red-800">
          <p className="font-medium">Error</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap break-all">{err}</pre>
        </div>
      )}

      {dbg && (
        <div className="mt-6 rounded-xl border p-5 bg-slate-50 border-slate-200 text-slate-800">
          <p className="font-medium">Debug</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap break-all">
            {JSON.stringify(dbg, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={start}
          disabled={busy}
          className="inline-flex items-center rounded-xl px-5 py-3 bg-black text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {busy ? "Contacting PayFast…" : "Pay with PayFast"}
        </button>
      </div>
    </div>
  );
}
