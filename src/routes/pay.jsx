// /src/routes/pay.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function Pay() {
  const [search] = useSearchParams();
  const plan   = search.get("plan") || "basic";
  const billing = search.get("billing") || "monthly";
  const amount = search.get("amount") || undefined; // allow override
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [diag, setDiag] = useState(null);

  const title =
    plan === "plus"
      ? "PLUS (monthly)"
      : "BASIC (monthly)";

  const onPay = async () => {
    try {
      setErr("");
      setLoading(true);
      const resp = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing, amount }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setErr(json?.error || `HTTP ${resp.status}`);
        setDiag(json);
        setLoading(false);
        return;
      }
      // optional diagnostics block if you want to see signature base:
      // setDiag(json.debug || null);
      window.location.href = json.redirect; // go to PayFast
    } catch (e) {
      setErr(e?.message || "Failed to fetch");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Payment</h1>
      <p className="mt-2">
        You’re subscribing to <span className="font-semibold">{title.replace("(monthly)", billing === "annual" ? "(annual)" : "(monthly)")}</span> —{" "}
        <span className="font-semibold">
          {plan === "plus"
            ? billing === "annual" ? "R1299" : "R149"
            : billing === "annual" ? "R1099" : "R99"}
        </span>.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="rounded-md bg-emerald-50 px-4 py-3 text-emerald-900 text-sm border border-emerald-200">
          <div className="font-semibold mb-1">Subscription: billed {billing === "annual" ? "annually" : "monthly"} until you cancel.</div>
          <ul className="list-disc ml-5">
            <li>Plan: {plan}</li>
            <li>Billing: {billing}</li>
            <li>
              Amount:{" "}
              {plan === "plus"
                ? billing === "annual" ? "R1299" : "R149"
                : billing === "annual" ? "R1099" : "R99"}
            </li>
          </ul>
        </div>

        {err && (
          <div className="mt-4 rounded-md bg-rose-50 px-4 py-3 text-rose-900 text-sm border border-rose-200">
            <div className="font-semibold mb-1">Server error</div>
            <div>{err}</div>
            {diag && (
              <details className="mt-2">
                <summary className="cursor-pointer">Diagnostics</summary>
                <pre className="text-xs overflow-auto bg-white/60 p-2 rounded border mt-2">
                  {JSON.stringify(diag, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            disabled={loading}
            onClick={onPay}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Contacting PayFast…" : "Pay with PayFast"}
          </button>
          <Link
            to="/street"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-slate-300 hover:bg-slate-50"
          >
            Back to Street page
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to activate your
          access automatically.
        </p>
      </div>
    </div>
  );
}
