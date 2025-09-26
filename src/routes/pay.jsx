import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, CreditCard, ArrowLeft, AlertTriangle, CheckCircle2, Bug } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Pay() {
  const q = useQuery();
  const navigate = useNavigate();

  const plan = q.get("plan") || "basic";            // "basic" | "plus" etc (for future)
  const billing = q.get("billing") || "monthly";    // "monthly" | "annual"
  const amount = q.get("amount") || (billing === "annual" ? "1099" : "99");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [diag, setDiag] = useState(null);

  const human = {
    title: "Payment",
    blurb: `You're subscribing to ${plan.toUpperCase()} (${billing}) — R${Number(amount) || 0}.`,
    summaryItems: [
      { k: "Plan", v: plan },
      { k: "Billing", v: billing },
      { k: "Amount", v: `R${Number(amount) || 0}` },
    ],
    subText:
      billing === "monthly"
        ? "Subscription: billed monthly until you cancel."
        : "Subscription: billed yearly; renews every 12 months unless you cancel.",
  };

  const startPayFast = async () => {
    setBusy(true);
    setError("");
    setDiag(null);

    try {
      const resp = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          amount: Number(amount) || 0,
          // optional overrides:
          // itemName: "Your product",
          // itemDescription: "Your description",
        }),
      });

      // Network-level issue
      if (!resp.ok) {
        const maybeJson = await safeJson(resp);
        setError(maybeJson?.error || `Server error HTTP ${resp.status}`);
        setBusy(false);
        return;
      }

      const data = await resp.json();
      if (!data?.ok) {
        setError(data?.error || "Could not create a PayFast request");
        setDiag(data);
        setBusy(false);
        return;
      }

      setDiag(data);

      // Build a temporary <form> that posts directly to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.endpoint;

      Object.entries(data.fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      // Note: browser navigates to PayFast; ITN will notify our /api/payfast-itn
    } catch (e) {
      setError(e?.message || "Failed to start payment");
      setBusy(false);
    }
  };

  const goBack = () => navigate("/street");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">{human.title}</h1>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-slate-700">
            {human.blurb}
          </p>

          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {human.subText}
          </div>

          <ul className="mt-4 grid gap-2 text-sm text-slate-700">
            {human.summaryItems.map((it) => (
              <li key={it.k} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">{it.k}:</span>
                <span>{it.v}</span>
              </li>
            ))}
          </ul>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <div className="mb-1 flex items-center gap-2 font-semibold uppercase tracking-wide">
                <AlertTriangle className="h-4 w-4" />
                Server error
              </div>
              <pre className="whitespace-pre-wrap break-words">{error}</pre>

              {diag && (
                <details className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  <summary className="flex cursor-pointer items-center gap-2 text-slate-800">
                    <Bug className="h-4 w-4" />
                    Diagnostics
                  </summary>
                  <div className="mt-2 overflow-auto text-xs">
                    <pre className="whitespace-pre-wrap break-words">
                      {JSON.stringify(diag, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={startPayFast}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
            >
              <CreditCard className="h-5 w-5" />
              {busy ? "Connecting…" : "Pay with PayFast"}
            </button>

            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Street page
            </button>

            <Link
              to="/privacy"
              className="ml-auto text-sm text-slate-500 underline-offset-2 hover:underline"
            >
              Privacy (POPIA)
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Your card is processed by PayFast. We receive secure notifications (ITN) to activate your access automatically.
          </p>
        </div>
      </div>
    </main>
  );
}

async function safeJson(resp) {
  try {
    return await resp.json();
  } catch {
    try {
      const t = await resp.text();
      return { error: t || `HTTP ${resp.status}` };
    } catch {
      return null;
    }
  }
}
