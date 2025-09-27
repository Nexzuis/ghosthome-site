// src/routes/pay.jsx
import { useState } from "react";

export default function Pay() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function start() {
    setBusy(true);
    setErr("");
    try {
      // 🔁 NEW ROUTE HERE
      const r = await fetch("/api/pf-init", { method: "POST" });
      const j = await r.json().catch(() => null);

      if (j && j.ok && j.engine && j.fields) {
        // Build a real HTML form and POST to PayFast (x-www-form-urlencoded semantics)
        const form = document.createElement("form");
        form.method = "POST";
        form.action = j.engine;

        Object.entries(j.fields).forEach(([k, v]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = String(v);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      setErr(
        j?.error ||
          `Server error${!r.ok ? ` (HTTP ${r.status})` : ""}${j ? ` — ${JSON.stringify(j)}` : ""}`
      );
    } catch (e) {
      setErr(e?.message || "Failed to contact server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold">Payment</h1>
      <p className="mt-2">
        You’re subscribing to <b>BASIC</b> (monthly) — <b>R99</b>.
      </p>

      {err ? (
        <div className="mt-6 rounded-xl border p-5 bg-red-50 border-red-200 text-red-800">
          <p className="font-medium">Error</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap break-all">{err}</pre>
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
        Your card is processed by PayFast. We receive secure notifications (ITN) to activate your
        access automatically.
      </p>
    </div>
  );
}
