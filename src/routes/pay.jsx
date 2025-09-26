import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShieldCheck, AlertCircle, CreditCard } from "lucide-react";

export default function Pay() {
  const [sp] = useSearchParams();
  const plan = sp.get("plan") || "basic";
  const billing = sp.get("billing") || "monthly";
  const amount = Number(sp.get("amount") || 0);
  const recurring = sp.get("recurring") !== "false"; // default true
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const planTitle = useMemo(() => {
    if (plan === "standard") return "STANDARD";
    return "BASIC";
  }, [plan]);

  const blurb = useMemo(
    () =>
      billing === "annual"
        ? "Subscription: billed annually until you cancel."
        : "Subscription: billed monthly until you cancel.",
    [billing]
  );

  async function start() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/payfast-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          amount,
          recurring,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setError(j?.error || "Server responded 500");
        setResult(j);
        setBusy(false);
        return;
      }
      setResult(j);
      setBusy(false);
    } catch (e) {
      setError("Failed to fetch");
      setBusy(false);
    }
  }

  function submitToPayFast() {
    if (!result?.action || !result?.fields) return;
    const form = document.createElement("form");
    form.method = "POST";
    form.action = result.action;
    Object.entries(result.fields).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = String(v);
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
      <p className="mt-1 text-slate-600">
        You’re subscribing to <span className="font-semibold">{planTitle}</span> ({billing}) —{" "}
        <span className="font-semibold">R{amount || 0}</span>.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800 ring-1 ring-emerald-200">
          {blurb}
        </div>

        <ul className="mb-4 list-disc pl-5 text-sm text-slate-700">
          <li>Plan: {plan}</li>
          <li>Billing: {billing}</li>
          <li>Amount: R{amount || 0}</li>
        </ul>

        {error && (
          <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-rose-700 ring-1 ring-rose-200">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              Server error
            </div>
            <div className="text-xs mt-1">{error}</div>
            {result && (
              <>
                <button
                  onClick={() =>
                    alert(JSON.stringify(result, null, 2))
                  }
                  className="mt-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
                >
                  Run diagnostics
                </button>
              </>
            )}
          </div>
        )}

        {/* Sandbox debug panel */}
        {result?.debug_signature_base && (
          <div className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-amber-800 ring-1 ring-amber-200">
            <div className="font-semibold">Sandbox debug: signature base &amp; fields</div>
            <div className="mt-1 text-[11px]">
              <div className="rounded bg-white p-2 ring-1 ring-amber-200">
                <div className="font-mono whitespace-pre overflow-x-auto">
                  <strong>Signature base:</strong>
                  <br />
                  {result.debug_signature_base}
                </div>
              </div>
              <div className="mt-2 rounded bg-white p-2 ring-1 ring-amber-200">
                <div className="font-mono whitespace-pre overflow-x-auto">
                  <strong>Fields:</strong>
                  <br />
                  {JSON.stringify(result.fields, null, 2)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {!result ? (
            <button
              onClick={start}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white shadow-sm hover:bg-black disabled:opacity-60"
            >
              <CreditCard className="h-5 w-5" />
              {busy ? "Preparing…" : "Retry PayFast"}
            </button>
          ) : (
            <button
              onClick={submitToPayFast}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
            >
              <ShieldCheck className="h-5 w-5" />
              Pay with PayFast
            </button>
          )}

          <Link
            to="/street"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Back to Street page
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
        </p>
      </section>
    </main>
  );
}
