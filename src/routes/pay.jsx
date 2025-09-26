import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function Pay() {
  const [params] = useSearchParams();
  const [state, setState] = useState({ loading: false, error: "", debug: null });

  const info = useMemo(() => {
    const plan = params.get("plan") || "basic";
    const billing = params.get("billing") || "monthly";
    const amount = params.get("amount") || "99";
    const recurring = params.get("recurring") === "true" || true;
    return { plan, billing, amount, recurring };
  }, [params]);

  async function handlePay() {
    try {
      setState({ loading: true, error: "", debug: null });

      const res = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.url) {
        setState({
          loading: false,
          error: data?.error || "Server error",
          debug: data || null,
        });
        return;
      }

      // OPTIONAL: show debug on the page while testing
      setState({ loading: false, error: "", debug: data?.debug || null });

      // redirect to PayFast
      window.location.href = data.url;
    } catch (e) {
      setState({ loading: false, error: e.message || "Failed to fetch", debug: null });
    }
  }

  useEffect(() => {
    // show the page; user clicks button to go
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Payment</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <strong className="font-semibold">Subscription:</strong>{" "}
          billed monthly until you cancel.
        </div>

        <ul className="mt-4 space-y-1 text-sm">
          <li>
            <span className="font-medium">Plan:</span> {info.plan}
          </li>
          <li>
            <span className="font-medium">Billing:</span> {info.billing}
          </li>
          <li>
            <span className="font-medium">Amount:</span> R{Number(info.amount).toFixed(2)}
          </li>
        </ul>

        {state.error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
            <div className="font-medium">Server error</div>
            <div className="text-xs opacity-90">{state.error}</div>
            {state.debug ? (
              <pre className="mt-2 max-h-64 overflow-auto rounded bg-white/60 p-2 text-[11px] leading-relaxed">
                {JSON.stringify(state.debug, null, 2)}
              </pre>
            ) : null}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handlePay}
            disabled={state.loading}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {state.loading ? "Contacting PayFast..." : "Pay with PayFast"}
          </button>

          <Link
            to="/street"
            className="inline-flex items-center rounded-lg border px-3 py-2 text-slate-700 hover:bg-slate-50"
          >
            Back to Street page
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Your card is processed by PayFast. We receive secure notifications (ITN) to
          activate your access automatically.
        </p>
      </div>
    </div>
  );
}
