// /src/routes/pay.jsx
import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";

/**
 * Client builds plan → asks /api/payfast-initiate to return {action, fields}
 * → we create a hidden <form> and POST to PayFast.
 */
export default function Pay() {
  const [sp] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const plan = (sp.get("plan") || "basic").toLowerCase();
  const billing = (sp.get("billing") || "monthly").toLowerCase();
  const amount = useMemo(() => {
    if (plan === "basic" && billing === "monthly") return "99.00";
    if (plan === "plus" && billing === "monthly") return "149.00";
    if (plan === "basic" && billing === "annual") return "1099.00";
    if (plan === "plus" && billing === "annual") return "1299.00";
    return "99.00";
  }, [plan, billing]);

  const isRecurring = billing === "monthly";
  const displayTitle =
    plan === "plus" ? "PLUS (monthly)" : isRecurring ? "BASIC (monthly)" : plan === "plus-annual" ? "PLUS (annual)" : "BASIC (annual)";

  const itemName = useMemo(() => {
    if (plan === "plus") return "Ghosthome Street Access - 4 cams / 2 accounts - Monthly";
    if (plan === "basic" && isRecurring) return "Ghosthome Street Access - 2 cams / 1 account - Monthly";
    if (plan === "plus" && !isRecurring) return "Ghosthome Street Access - 4 cams / 2 accounts - 12 months";
    return "Ghosthome Street Access - 2 cams / 1 account - 12 months";
  }, [plan, isRecurring]);

  const itemDescription =
    "Community live-view access with night notifications (customisable hours).";

  const startPayFast = async () => {
    setError("");
    setSubmitting(true);
    try {
      const resp = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          item_name: itemName,
          item_description: itemDescription,
          custom_str1: "", // reserve for your references
          custom_str2: plan,
          custom_str3: isRecurring ? "monthly" : "annual",
          is_recurring: isRecurring,
          frequency: 3, // monthly
          cycles: isRecurring ? 0 : 1, // annual uses once-off via 1 cycle (or you can treat as once-off by is_recurring:false)
          recurring_amount: amount,
        }),
      });

      const data = await resp.json(); // if server fails, this would throw with HTML; now we always send JSON
      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || "Could not start PayFast");
      }

      // Build and submit POST form to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.action;

      Object.entries(data.fields).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to start payment");
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Payment</h1>
      <p className="mt-1 text-slate-600">
        You’re subscribing to <span className="font-semibold">{displayTitle}</span> — <span className="font-semibold">R{Number(amount).toFixed(0)}</span>.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <span className="font-semibold">Subscription:</span>{" "}
          {isRecurring ? "billed monthly until you cancel." : "12 months once-off."}
        </div>

        <ul className="mt-3 list-disc pl-5 text-slate-700">
          <li>Plan: {plan}</li>
          <li>Billing: {isRecurring ? "monthly" : "annual"}</li>
          <li>Amount: R{Number(amount).toFixed(0)}</li>
        </ul>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
            <div className="font-semibold">Server error</div>
            <div className="text-xs">{error}</div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startPayFast}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {submitting ? "Connecting…" : "Pay with PayFast"}
          </button>
          <Link
            to="/street"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
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
