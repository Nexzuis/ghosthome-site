import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CreditCard, Shield, Loader2 } from "lucide-react";

export default function Pay() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const plan = params.get("plan") || "basic";
  const billing = params.get("billing") || "monthly";
  const amount = Number(params.get("amount") || 0);
  const signupId = params.get("signupId") || "";
  const recurring = params.get("recurring") === "true";

  const [pf, setPf] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createCheckout() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          amount,
          signupId,
        }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Failed to init PayFast");
      setPf(data);
    } catch (e) {
      setError(e.message || "Failed to start PayFast");
    } finally {
      setBusy(false);
    }
  }

  // Auto-initiate on mount for convenience
  useEffect(() => {
    createCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Error */}
        {error ? (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/* Live PayFast form (rendered after /api/payfast-initiate) */}
          {pf ? (
            <form action={pf.action} method="post">
              {Object.entries(pf.fields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={String(v)} />
              ))}
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <CreditCard className="h-4 w-4" />
                Pay with PayFast
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={createCheckout}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {busy ? "Preparing checkout…" : "Retry PayFast"}
            </button>
          )}

          <Link
            to="/street"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
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
