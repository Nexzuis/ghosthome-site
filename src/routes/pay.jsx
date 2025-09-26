// src/routes/pay.jsx
import { useMemo, useState } from "react";

export default function Pay() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // You can read plan/billing from querystring; here we fix "basic/monthly" for clarity.
  const plan = "basic";
  const billing = "monthly";

  async function startPayfast() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing })
      });
      const data = await r.json();

      if (!r.ok || !data?.ok) {
        throw new Error(data?.error || "Server error");
      }

      // Build a real POST form so the browser does NOT rewrite the querystring.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.engine;

      Object.entries(data.fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      setError(e.message || "Failed to start payment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold">Payment</h1>

      <div className="mt-6 rounded-2xl border bg-white shadow-sm">
        <div className="p-6 border-b bg-emerald-50 rounded-t-2xl">
          <p className="font-medium">Subscription: billed monthly until you cancel.</p>
        </div>

        <div className="p-6 space-y-2 text-slate-800">
          <div>Plan: <b>{plan}</b></div>
          <div>Billing: <b>{billing}</b></div>
          <div>Amount: <b>R99</b></div>

          {error && (
            <div className="mt-4 rounded-md bg-rose-50 text-rose-700 p-3 text-sm">
              <div className="font-semibold">Server error</div>
              <div>{error}</div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={startPayfast}
              disabled={busy}
              className="inline-flex items-center rounded-xl px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {busy ? "Working..." : "Pay with PayFast"}
            </button>
            <a href="/street" className="inline-flex items-center rounded-xl px-4 py-2 border">
              Back to Street page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
