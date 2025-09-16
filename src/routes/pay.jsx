import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Pay() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const plan = params.get("plan") || "basic";
  const billing = params.get("billing") || "monthly";
  const amount = Number(params.get("amount") || 0);
  const signupId = params.get("signupId") || "";
  const recurring = params.get("recurring") === "true";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
      <p className="mt-2 text-slate-600">
        You’re subscribing to <span className="font-semibold uppercase">{plan}</span> ({billing}) —{" "}
        <span className="font-semibold">R{amount}</span>.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        {recurring ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-200">
            Subscription: billed {billing === "monthly" ? "monthly until you cancel" : "annually with automatic renewal"}.
          </p>
        ) : null}

        <ul className="mt-3 list-disc pl-6 text-sm text-slate-700">
          <li>Plan: {plan}</li>
          <li>Billing: {billing}</li>
          <li>Amount: R{amount}</li>
          {signupId ? <li>Signup ID: {signupId}</li> : null}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          {/* Placeholder button until PayFast live */}
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-slate-300 px-4 py-2 font-semibold text-white"
            title="PayFast integration coming next"
          >
            Pay with PayFast (coming soon)
          </button>

          <a
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            href={`mailto:ian@ghosthome.co.za?subject=Ghosthome%20Sign-up&body=Plan:%20${encodeURIComponent(plan)}%0ABilling:%20${encodeURIComponent(billing)}%0AAmount:%20R${amount}%0ASignupId:%20${encodeURIComponent(signupId || "N/A")}`}
          >
            Email confirmation to Ghosthome
          </a>
          <Link to="/street" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50">
            Back to Street page
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          We’ll enable secure PayFast checkout here (sandbox/live). You’ll be able to manage cancellations any time.
        </p>
      </div>
    </main>
  );
}
