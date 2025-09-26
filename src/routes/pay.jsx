// src/routes/pay.jsx
import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Pay() {
  const [params] = useSearchParams();
  const plan = (params.get("plan") || "basic").toLowerCase(); // basic | plus
  const billing = (params.get("billing") || "monthly").toLowerCase(); // monthly | annual
  const amount = useMemo(() => {
    if (billing === "annual") {
      return plan === "plus" ? 1299 : 1099;
    }
    return plan === "plus" ? 149 : 99;
  }, [plan, billing]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [diag, setDiag] = useState(null);

  async function requestPayfast(showDiagnostics = false) {
    setBusy(true);
    setError("");
    setDiag(null);
    try {
      const res = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          amount,
          diagnostics: showDiagnostics ? "true" : "false",
        }),
      });

      // Network ok?
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      // Parse JSON
      const data = await res.json();

      // Diagnostics view
      if (showDiagnostics) {
        setDiag(data);
      }

      if (data && data.ok && data.redirect) {
        // Redirect to PayFast
        window.location.href = data.redirect;
        return;
      }

      throw new Error(data?.error || "Unexpected response");
    } catch (e) {
      setError(e?.message || "Failed to fetch");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Payment
        </h1>
        <p className="mt-2 text-slate-600">
          You’re subscribing to{" "}
          <span className="font-semibold uppercase">{plan}</span> (
          {billing}) —{" "}
          <span className="font-semibold">R{amount}</span>.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <p className="font-semibold">Subscription: billed {billing} until you cancel.</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Plan: {plan}</li>
            <li>Billing: {billing}</li>
            <li>Amount: R{amount}</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
            <p className="font-semibold">Server error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {diag && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <p className="font-semibold">Diagnostics</p>
            <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-white p-3 text-xs text-slate-800 ring-1 ring-slate-200">
{JSON.stringify(diag, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={busy}
            onClick={() => requestPayfast(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? "Contacting PayFast…" : "Pay with PayFast"}
          </button>
          <button
            disabled={busy}
            onClick={() => requestPayfast(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Run diagnostics
          </button>
          <Link
            to="/street"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Back to Street page
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to
          activate your access automatically.
        </p>
      </div>
    </main>
  );
}
