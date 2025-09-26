import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Pay() {
  const [sp] = useSearchParams();
  const plan = (sp.get("plan") || "basic").toLowerCase();     // 'basic' | 'plus'
  const billing = (sp.get("billing") || "monthly").toLowerCase(); // 'monthly' | 'annual'
  const amountParam = sp.get("amount");

  const amount = useMemo(() => {
    if (amountParam) return Number(amountParam);
    if (plan === "basic" && billing === "monthly") return 99;
    if (plan === "plus"  && billing === "monthly") return 149;
    if (plan === "basic" && billing === "annual")  return 1099;
    if (plan === "plus"  && billing === "annual")  return 1299;
    return 99;
  }, [plan, billing, amountParam]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [diag, setDiag] = useState(null);

  async function onPay() {
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
          recurring: billing === "monthly",
        }),
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch {
        throw new Error(`Server returned non-JSON (${res.status})`);
      }

      if (!res.ok || !data?.ok || !data?.redirect) {
        setError(data?.error || `HTTP ${res.status}`);
        setDiag(data || null);
        setBusy(false);
        return;
      }

      if (data.debug) setDiag(data.debug);
      window.location.href = data.redirect; // to PayFast
    } catch (e) {
      setError(e.message || "Failed to start payment");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
      <p className="mt-1 text-slate-600">
        You’re subscribing to <span className="font-semibold uppercase">{plan}</span>{" "}
        ({billing}) — <span className="font-semibold">R{amount}</span>.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <span className="font-semibold">Subscription:</span>{" "}
          {billing === "monthly" ? "billed monthly until you cancel." : "12 months once-off."}
        </div>

        <ul className="mt-3 list-disc pl-5 text-slate-700">
          <li>Plan: {plan}</li>
          <li>Billing: {billing}</li>
          <li>Amount: R{amount}</li>
        </ul>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
            <div className="font-semibold">Server error</div>
            <div className="text-xs">{error}</div>
            {diag ? (
              <pre className="mt-2 max-h-72 overflow-auto rounded bg-white p-2 text-xs ring-1 ring-slate-200">
                {JSON.stringify(diag, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPay}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {busy ? "Connecting…" : "Pay with PayFast"}
          </button>
          <Link
            to="/street"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Back to Street page
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
        </p>
      </div>
    </main>
  );
}
