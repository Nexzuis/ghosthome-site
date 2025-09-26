// src/routes/pay.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const plans = {
  basic: { monthly: 99, annual: 1099 },
  plus:  { monthly: 149, annual: 1299 },
};

export default function Pay() {
  const [sp] = useSearchParams();
  const plan = sp.get("plan") || "basic";
  const billing = sp.get("billing") || "monthly";
  const amount = useMemo(() => {
    const p = plans[plan] || plans.basic;
    return p[billing] ?? p.monthly;
  }, [plan, billing]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [diag, setDiag] = useState(null);

  async function startPayfast() {
    setBusy(true);
    setError("");
    setDiag(null);
    try {
      const r = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing, amount }),
      });

      // If Vercel returned an HTML error page, guarding JSON parse:
      const text = await r.text();
      let json;
      try { json = JSON.parse(text); } catch { throw new Error("Server returned non-JSON"); }

      if (!r.ok || !json.ok) {
        setDiag(json);
        throw new Error(json?.error || `HTTP ${r.status}`);
      }

      window.location.href = json.redirect; // go to PayFast
    } catch (e) {
      setError(e.message || "Server error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Payment</h1>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <p className="text-slate-700">
              You’re subscribing to <span className="font-semibold uppercase">{plan}</span> ({billing}) — <span className="font-semibold">R{amount}</span>.
            </p>
          </div>

          <div className="px-6 py-4">
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900">
              <p className="font-medium">Subscription: billed monthly until you cancel.</p>
              <ul className="ml-5 list-disc text-sm">
                <li>Plan: {plan}</li>
                <li>Billing: {billing}</li>
                <li>Amount: R{amount}</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-rose-900">
                <p className="font-semibold">Server error</p>
                <p className="text-sm">{error}</p>
                {diag && (
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-white/70 p-3 text-xs text-slate-800">
{JSON.stringify(diag, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={startPayfast}
                disabled={busy}
                className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {busy ? "Connecting…" : "Pay with PayFast"}
              </button>
              <Link
                to="/street"
                className="rounded-xl border border-slate-300 px-4 py-3 text-slate-700 hover:bg-slate-50"
              >
                Back to Street page
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
