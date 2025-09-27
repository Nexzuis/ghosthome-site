// src/routes/pay.jsx
import { useEffect, useState } from "react";

export default function Pay() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function start() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/payfast-initiate", { method: "POST" });
      // Try to parse JSON even if r.ok is false
      let j = null;
      try {
        j = await r.json();
      } catch (_) {
        // ignore
      }

      // Hard success path: ok + redirect present
      if (j && j.ok && j.redirect) {
        window.location.assign(j.redirect);
        return;
      }

      // If backend sent useful debug, show it; otherwise generic
      if (j && (j.error || j.message || j.redirect)) {
        setErr(
          j.error ||
            j.message ||
            // show the body so we can see what came back
            JSON.stringify(j, null, 2)
        );
        return;
      }

      setErr(`Server error${!r.ok ? ` (HTTP ${r.status})` : ""}`);
    } catch (e) {
      setErr(e?.message || "Failed to contact server");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    // no auto-submit
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold">Payment</h1>
      <p className="mt-2">
        You’re subscribing to <b>BASIC</b> (monthly) — <b>R99</b>.
      </p>

      <div className="mt-6 rounded-xl border p-5 bg-green-50 border-green-200 text-green-800">
        <p className="font-medium">Subscription: billed monthly until you cancel.</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Plan: basic</li>
          <li>Billing: monthly</li>
          <li>Amount: R99</li>
        </ul>
      </div>

      {err ? (
        <div className="mt-6 rounded-xl border p-5 bg-red-50 border-red-200 text-red-800">
          <p className="font-medium">Server error</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap">{err}</pre>
        </div>
      ) : null}

      <div className="mt-6">
        <button
          onClick={start}
          disabled={busy}
          className="inline-flex items-center rounded-xl px-5 py-3 bg-black text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {busy ? "Contacting PayFast…" : "Pay with PayFast"}
        </button>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
      </p>
    </div>
  );
}
