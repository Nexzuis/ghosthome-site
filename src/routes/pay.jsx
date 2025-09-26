import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CreditCard, Shield, Loader2, Bug, ChevronDown, ChevronUp } from "lucide-react";

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
  const [missing, setMissing] = useState(null);
  const [diag, setDiag] = useState(null);
  const [showDbg, setShowDbg] = useState(false);

  async function createCheckout() {
    setBusy(true); setError(""); setMissing(null);
    try {
      // NOTE: alias path that won’t be blocked by extensions
      const res = await fetch("/api/pf-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing, amount, signupId }),
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { /* keep raw text if needed */ }

      if (!res.ok || !data?.ok) {
        const msg = data?.error || `HTTP ${res.status}`;
        setError(msg);
        if (data?.missing) setMissing(data.missing);
        return;
      }
      setPf(data);
    } catch (e) {
      setError(e.message || "Failed to start PayFast");
    } finally {
      setBusy(false);
    }
  }

  async function runDiagnostics() {
    try {
      const r = await fetch("/api/payfast-diagnose");
      const j = await r.json();
      setDiag(j);
    } catch (e) {
      setDiag({ ok: false, error: e.message });
    }
  }

  useEffect(() => { createCheckout(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

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

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            <p className="font-semibold">Server error</p>
            <p className="mt-1">{error}</p>
            {Array.isArray(missing) && missing.length ? (
              <p className="mt-2">
                Missing: <span className="font-mono">{missing.join(", ")}</span>
              </p>
            ) : null}
            <div className="mt-3">
              <button
                type="button"
                onClick={runDiagnostics}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-white hover:bg-slate-900"
              >
                <Bug className="h-4 w-4" /> Run diagnostics
              </button>
            </div>
            {diag ? (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-3 text-xs ring-1 ring-slate-200">
                {JSON.stringify(diag, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}

        {pf?.debug_signature_base ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <button
              className="inline-flex items-center gap-1 font-semibold"
              onClick={() => setShowDbg(s => !s)}
              type="button"
            >
              {showDbg ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Sandbox debug: signature base & fields
            </button>
            {showDbg ? (
              <>
                <p className="mt-2">Signature base:</p>
                <pre className="mt-1 max-h-40 overflow-auto rounded bg-white p-2 ring-1 ring-amber-200">
                  {pf.debug_signature_base}
                </pre>
                <p className="mt-3">Fields:</p>
                <pre className="mt-1 max-h-60 overflow-auto rounded bg-white p-2 ring-1 ring-amber-200">
                  {JSON.stringify(pf.fields, null, 2)}
                </pre>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {pf ? (
            <form action={pf.action} method="post" acceptCharset="UTF-8">
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
