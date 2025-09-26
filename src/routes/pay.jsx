// /src/routes/pay.jsx
import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function Pay() {
  const [sp] = useSearchParams();
  const plan = (sp.get("plan") || "basic").toLowerCase();   // basic | plus
  const term = (sp.get("term") || "monthly").toLowerCase(); // monthly | yearly

  const price = useMemo(() => {
    if (plan === "basic" && term === "monthly") return 99;
    if (plan === "basic" && term === "yearly")  return 1099;
    if (plan === "plus"  && term === "monthly") return 149;
    if (plan === "plus"  && term === "yearly")  return 1299;
    return 99;
  }, [plan, term]);

  const go = () => {
    window.location.href =
      `/api/payfast-initiate?plan=${encodeURIComponent(plan)}&term=${encodeURIComponent(term)}`;
  };

  const debug = () => {
    window.open(
      `/api/payfast-initiate?plan=${encodeURIComponent(plan)}&term=${encodeURIComponent(term)}&debug=1`,
      "_blank",
      "noopener"
    );
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
      <p className="mt-2 text-slate-700">
        You’re subscribing to <span className="font-semibold uppercase">{plan}</span> ({term}) —{" "}
        <span className="font-semibold">R{price}</span>.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-900 text-sm">
          Subscription: billed {term === "yearly" ? "annually" : "monthly"} until you cancel.
        </div>

        <ul className="mt-3 list-disc pl-5 text-slate-700 text-sm">
          <li>Plan: {plan}</li>
          <li>Billing: {term}</li>
          <li>Amount: R{price}</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={go}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-800"
          >
            Pay with PayFast
          </button>
          <button
            onClick={debug}
            className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            title="Show signature base & exact fields (opens new tab)"
          >
            Run diagnostics
          </button>
          <Link
            to="/street"
            className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Back to Street page
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
        </p>
      </div>
    </main>
  );
}
