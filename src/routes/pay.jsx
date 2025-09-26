import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function Pay() {
  const [sp] = useSearchParams();
  const plan = (sp.get("plan") || "basic").toLowerCase();       // basic | plus
  const billing = (sp.get("billing") || "monthly").toLowerCase(); // monthly | annual
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [diag, setDiag] = useState(null);

  const summary = useMemo(() => {
    const map = {
      basic: { monthly: { price: 99, label: "BASIC (monthly)" }, annual: { price: 1099, label: "BASIC (12 months)" } },
      plus: { monthly: { price: 149, label: "PLUS (monthly)" }, annual: { price: 1299, label: "PLUS (12 months)" } },
    };
    return map[plan]?.[billing] || map.basic.monthly;
  }, [plan, billing]);

  async function start() {
    setLoading(true);
    setErr("");
    setDiag(null);
    try {
      const res = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setErr(json?.error || `HTTP ${res.status}`);
        setDiag(json);
        setLoading(false);
        return;
      }
      // Optional diagnostics block on the page for sandbox
      if (json.debug) setDiag(json.debug);
      // Jump to PayFast
      window.location.href = json.redirect;
    } catch (e) {
      setErr(e.message || "Failed to start payment");
      setLoading(false);
    }
  }

  useEffect(() => {
    // Don’t auto-run; user clicks the button
  }, []);

  return (
    <div className="min-h-[70vh] max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Payment</h1>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b bg-green-50 text-sm text-green-800 rounded-t-xl">
          Subscription: billed monthly until you cancel.
        </div>

        <div className="px-6 py-5">
          <ul className="list-disc pl-6 text-slate-700 space-y-1 text-sm">
            <li>Plan: <span className="font-medium">{plan}</span></li>
            <li>Billing: <span className="font-medium">{billing}</span></li>
            <li>Amount: <span className="font-semibold">R{summary.price}</span></li>
          </ul>

          {err && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <div className="font-medium mb-1">Server error</div>
              <div>{err}</div>
            </div>
          )}

          {diag && (
            <details className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <summary className="cursor-pointer font-medium">Sandbox diagnostics</summary>
              <pre className="overflow-auto mt-2">{JSON.stringify(diag, null, 2)}</pre>
            </details>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={start}
              disabled={loading}
              className="inline-flex items-center rounded-xl px-4 py-2 font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Contacting PayFast…" : "Pay with PayFast"}
            </button>

            <Link
              to="/street"
              className="inline-flex items-center rounded-xl px-4 py-2 font-medium border border-slate-300 hover:bg-slate-50"
            >
              Back to Street page
            </Link>
          </div>
        </div>

        <div className="px-6 py-4 border-t text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to
          activate your access automatically.
        </div>
      </div>
    </div>
  );
}
