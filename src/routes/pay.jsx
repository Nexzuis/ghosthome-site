// src/routes/pay.jsx
import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Shield, AlertCircle, CreditCard, ChevronRight } from "lucide-react";

export default function Pay() {
  const [sp] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [diag, setDiag] = useState(null);

  const plan = sp.get("plan") || "basic";        // 'basic' | 'plus'
  const billing = sp.get("billing") || "monthly";// 'monthly' | 'annual'
  const amountParam = sp.get("amount");
  const recurring = sp.get("recurring") === "true" || billing === "monthly";

  const amount = useMemo(() => {
    if (amountParam) return Number(amountParam);
    // sensible defaults if not provided
    if (plan === "basic" && billing === "monthly") return 99;
    if (plan === "plus"  && billing === "monthly") return 149;
    if (plan === "basic" && billing === "annual") return 1099;
    if (plan === "plus"  && billing === "annual") return 1299;
    return 99;
  }, [plan, billing, amountParam]);

  const planName = plan === "basic" ? "BASIC" : "PLUS";

  async function onPay() {
    setSubmitting(true);
    setError("");
    setDiag(null);

    try {
      const res = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          amount,
          recurring,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!data?.ok) {
        setError(data?.error || "Server error");
        setDiag(data);
        setSubmitting(false);
        return;
      }

      // Optional diagnostics visible in sandbox
      if (data.debug) setDiag(data.debug);

      // Redirect to PayFast
      window.location.href = data.redirect;
    } catch (e) {
      setError(e?.message || "Failed to fetch");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <Shield className="h-4 w-4" />
          Ghosthome — Payment
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment</h1>
        <p className="mt-1 text-slate-600">
          You’re subscribing to <strong className="text-slate-900">{planName}</strong>{" "}
          ({billing}) — <strong className="text-slate-900">R{amount}</strong>.
        </p>

        <div className="mt-4 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
          <p className="text-sm font-semibold text-emerald-900">Subscription: billed monthly until you cancel.</p>
          <ul className="mt-2 list-disc pl-6 text-sm text-emerald-900/90">
            <li>Plan: {plan}</li>
            <li>Billing: {billing}</li>
            <li>Amount: R{amount}</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-semibold">Server error</span>
            </div>
            <p className="mt-1 text-sm text-rose-800">{error}</p>
            {diag && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-semibold text-rose-700">
                  Run diagnostics
                </summary>
                <pre className="mt-2 max-h-60 overflow-auto rounded bg-white p-3 text-xs text-slate-800 ring-1 ring-slate-200">
                  {JSON.stringify(diag, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPay}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            <CreditCard className="h-5 w-5" />
            {submitting ? "Redirecting…" : "Pay with PayFast"}
          </button>

          <Link
            to="/street"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
          >
            Back to Street page <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
        </p>
      </div>
    </main>
  );
}
