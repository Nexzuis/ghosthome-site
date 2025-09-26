import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";

// This page DOES NOT fetch JSON. It just opens the API which returns an auto-POST form.
export default function Pay() {
  const [sp] = useSearchParams();
  const plan = (sp.get("plan") || "basic").toLowerCase();     // basic | plus
  const term = (sp.get("term") || "monthly").toLowerCase();   // monthly | yearly

  const info = useMemo(() => {
    if (plan === "basic" && term === "monthly") return { label: "BASIC (monthly)", amount: 99 };
    if (plan === "basic" && term === "yearly")  return { label: "BASIC (12 months)", amount: 1099 };
    if (plan === "plus"  && term === "monthly") return { label: "PLUS (monthly)",  amount: 149 };
    if (plan === "plus"  && term === "yearly")  return { label: "PLUS (12 months)", amount: 1299 };
    return { label: "BASIC (monthly)", amount: 99 };
  }, [plan, term]);

  const gotoPayfast = () => {
    // the API returns HTML that auto-POSTs to PayFast
    window.location.href = `/api/payfast-initiate?plan=${encodeURIComponent(plan)}&term=${encodeURIComponent(term)}`;
  };

  const showDebug = () => {
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
        You’re subscribing to <span className="font-semibold">{info.label}</span> —{" "}
        <span className="font-semibold">R{info.amount}</span>.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-900 text-sm">
          Subscription: billed {term === "yearly" ? "annually" : "monthly"} until you cancel.
        </div>

        <ul className="mt-3 list-disc pl-5 text-slate-700 text-sm">
          <li>Plan: {plan}</li>
          <li>Billing: {term}</li>
          <li>Amount: R{info.amount}</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={gotoPayfast}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-800"
          >
            Pay with PayFast
          </button>
          <button
            onClick={showDebug}
            className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            title="See exact signature base & fields (opens a new tab)"
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
