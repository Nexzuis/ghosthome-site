import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";

const PLAN_META = {
  basic: {
    monthly: { amount: 99, label: "BASIC (monthly) — R99", recurring: true },
    yearly:  { amount: 1099, label: "BASIC (12 months) — R1099", recurring: true },
  },
  plus: {
    monthly: { amount: 149, label: "PLUS (monthly) — R149", recurring: true },
    yearly:  { amount: 1299, label: "PLUS (12 months) — R1299", recurring: true },
  },
};

export default function Pay() {
  const [params] = useSearchParams();
  const plan = (params.get("plan") || "basic").toLowerCase();
  const term = (params.get("term") || "monthly").toLowerCase();

  const info = useMemo(() => {
    const p = PLAN_META[plan] || PLAN_META.basic;
    return p[term] || p.monthly;
  }, [plan, term]);

  const onPay = () => {
    // Open our serverless route which will build signature and auto-POST to PayFast
    const url = `/api/payfast-initiate?plan=${encodeURIComponent(plan)}&term=${encodeURIComponent(term)}&recurring=${info.recurring ? "true" : "false"}`;
    window.location.href = url;
  };

  const onDebug = () => {
    const url = `/api/payfast-initiate?plan=${encodeURIComponent(plan)}&term=${encodeURIComponent(term)}&recurring=${info.recurring ? "true" : "false"}&debug=1`;
    window.open(url, "_blank", "noopener");
  };

  const bullets = [];
  bullets.push(`Plan: ${plan}`);
  bullets.push(`Billing: ${term}`);
  bullets.push(`Amount: R${info.amount}`);

  return (
    <div className="min-h-[60vh] w-full bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
        <p className="mt-2 text-slate-700">
          You’re subscribing to <span className="font-semibold">{info.label.replace("—", "— ")}</span>.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b bg-emerald-50/60 px-5 py-3 text-emerald-800 rounded-t-xl">
            <div className="text-sm font-medium">Subscription: billed {term === "monthly" ? "monthly" : "every 12 months"} until you cancel.</div>
          </div>

          <div className="px-5 py-5">
            <ul className="list-disc pl-5 text-slate-700 space-y-1">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onPay}
                className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-300 bg-slate-900 text-white hover:bg-slate-800"
              >
                Pay with PayFast
              </button>

              <button
                onClick={onDebug}
                className="inline-flex items-center rounded-xl px-3 py-2 text-xs font-medium ring-1 ring-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                title="Show the exact signature base & fields (opens new tab)"
              >
                Run diagnostics
              </button>

              <Link
                to="/street"
                className="inline-flex items-center rounded-xl px-3 py-2 text-xs font-medium ring-1 ring-slate-300 text-slate-700 bg-white hover:bg-slate-50"
              >
                Back to Street page
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
            </p>
          </div>
        </div>

        <footer className="mt-10 text-xs text-slate-500">
          © 2025 Ghosthome • Security & Automation that acts, not just records • A brand of Alpha Research CC • WhatsApp:{" "}
          <a className="underline" href="tel:+27794950855">+27 79 495 0855</a> • Email:{" "}
          <a className="underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> •{" "}
          <Link className="underline" to="/privacy">Privacy (POPIA)</Link> •{" "}
          <Link className="underline" to="/terms">Terms</Link>
        </footer>
      </div>
    </div>
  );
}
