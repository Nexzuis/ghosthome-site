// src/routes/pay.jsx
import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const plans = {
  basic: { label: "BASIC", amount: 99, cams: 2, accounts: 1 },
  plus:  { label: "PLUS",  amount: 149, cams: 4, accounts: 2 },
};

export default function Pay() {
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [diag, setDiag] = useState(null);

  const planKey = (params.get("plan") || "basic").toLowerCase();
  const billing = (params.get("billing") || "monthly").toLowerCase();
  const recurring = params.get("recurring") !== "false"; // default true

  const plan = plans[planKey] || plans.basic;

  const headline = useMemo(
    () => `You’re subscribing to ${plan.label} (${billing}) — R${plan.amount}.`,
    [plan, billing]
  );

  async function startPayFast(debug = false) {
    setBusy(true);
    setError("");
    setDiag(null);
    try {
      const resp = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
          billing,
          amount: plan.amount,
          recurring,
          debug,
        }),
      });

      const json = await resp.json().catch(() => ({}));

      if (!resp.ok || !json.ok || !json.redirect) {
        setError(json?.error || "Server responded 500");
        if (json?.debug) setDiag(json.debug);
        setBusy(false);
        return;
        }

      // Optional: show debug block if present
      if (json.debug) setDiag(json.debug);

      // Go to PayFast
      window.location.href = json.redirect;
    } catch (e) {
      setError(e.message || "Failed to fetch");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Payment</h1>
      <p className="mt-2 text-slate-600">{headline}</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-green-50 p-4 text-sm">
        <p className="font-medium text-green-800">Subscription: billed monthly until you cancel.</p>
        <ul className="mt-2 list-disc pl-6 text-green-900">
          <li>Plan: {planKey}</li>
          <li>Billing: {billing}</li>
          <li>Amount: R{plan.amount}</li>
        </ul>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <p className="font-medium">Server error</p>
          <p className="mt-1">{error}</p>
          {diag && (
            <details className="mt-3">
              <summary className="cursor-pointer text-rose-900">Diagnostics</summary>
              <pre className="mt-2 overflow-auto rounded bg-white/70 p-3 text-xs text-slate-800">
                {JSON.stringify(diag, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => startPayFast(false)}
          disabled={busy}
          className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800 disabled:opacity-50"
        >
          {busy ? "Redirecting…" : "Pay with PayFast"}
        </button>
        <Link
          to="/street"
          className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
        >
          Back to Street page
        </Link>
        {/* toggle this if you want to see signature_base during sandbox testing */}
        {/* <button onClick={() => startPayFast(true)} className="text-xs underline">Run diagnostics</button> */}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
      </p>
    </div>
  );
}
