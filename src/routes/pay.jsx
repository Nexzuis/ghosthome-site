import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Pay() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const plan = params.get("plan") || "basic";
  const billing = params.get("billing") || "monthly";
  const amount = Number(params.get("amount") || 0);
  const signupId = params.get("signupId") || "";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
      <p className="mt-2 text-slate-600">
        You’re subscribing to <span className="font-semibold uppercase">{plan}</span> ({billing}) — <span className="font-semibold">R{amount}</span>.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-700">
          PayFast isn’t live on this environment yet. For now, this page confirms your sign-up details so we can activate access.
        </p>
        <ul className="mt-3 list-disc pl-6 text-sm text-slate-700">
          <li>Plan: {plan}</li>
          <li>Billing: {billing}</li>
          <li>Amount: R{amount}</li>
          {signupId ? <li>Signup ID: {signupId}</li> : null}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
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

        <p className="mt-3 text-xs text-slate-600">
          We’ll add PayFast (sandbox/live) here next. Once enabled, clicking “Pay with PayFast” will open the secure checkout and we’ll receive instant payment notifications to activate your account.
        </p>
      </div>
    </main>
  );
}
