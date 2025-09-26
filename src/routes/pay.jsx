// /src/routes/pay.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const tidy = (v) => (typeof v === "string" ? v.trim() : v);

export default function Pay() {
  const location = useLocation();
  const navigate = useNavigate();
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // from /signup redirect
  const plan = tidy(qs.get("plan")) || "basic";
  const billing = tidy(qs.get("billing")) || "monthly";
  const recurring = qs.get("recurring") === "true"; // not used now but kept
  const amount = tidy(qs.get("amount")) || (plan === "basic" ? "99.00" : "149.00");

  const [err, setErr] = useState("");
  const [diag, setDiag] = useState(null);
  const [busy, setBusy] = useState(false);

  const planLine =
    plan === "basic"
      ? "Ghosthome Street Access — 2 cams / 1 account"
      : "Ghosthome Street Access — 4 cams / 2 accounts";

  const onPay = async (withDiagnostics = false) => {
    setErr("");
    setBusy(true);
    setDiag(null);
    try {
      const url = new URL("/api/payfast-initiate", window.location.origin);
      url.searchParams.set("plan", plan);
      url.searchParams.set("billing", billing);
      url.searchParams.set("amount", amount);
      if (withDiagnostics) url.searchParams.set("diagnostics", "true");

      const r = await fetch(url.toString(), { method: "GET" });
      const data = await r.json();

      if (!data?.ok) {
        setErr(data?.error || "Server error");
        return;
      }
      if (withDiagnostics) setDiag(data);
      window.location.href = data.redirect;
    } catch (e) {
      setErr(e?.message || "Failed to connect");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    // no auto-redirect; user clicks the button
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Payment</h1>
      <p className="mt-1 text-slate-600">
        You’re subscribing to <span className="font-bold">{plan.toUpperCase()}</span>{" "}
        (monthly) — <span className="font-bold">R{Number(amount).toFixed(0)}</span>.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
          Subscription: billed monthly until you cancel.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
          <li>Plan: {plan}</li>
          <li>Billing: {billing}</li>
          <li>Amount: R{Number(amount).toFixed(0)}</li>
        </ul>

        {err && (
          <div className="mt-4 whitespace-pre-wrap rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700">
            <p className="font-medium">Server error</p>
            <p className="text-sm">{err}</p>
            {diag && (
              <pre className="mt-3 max-h-60 overflow-auto rounded bg-white p-2 text-xs text-slate-800">
{JSON.stringify(diag, null, 2)}
              </pre>
            )}
            <button
              onClick={() => onPay(true)}
              className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
            >
              Run diagnostics
            </button>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => onPay(false)}
            disabled={busy}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? "Please wait…" : "Pay with PayFast"}
          </button>
          <Link
            to="/street"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
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
