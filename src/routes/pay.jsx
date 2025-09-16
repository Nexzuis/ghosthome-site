import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CreditCard, Shield, Clipboard, CheckCircle2 } from "lucide-react";

export default function Pay() {
  const [params] = useSearchParams();
  const plan = params.get("plan") || "2c";
  const billing = params.get("billing") || "monthly";
  const signupId = params.get("signupId") || "";
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [last, setLast] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const j = localStorage.getItem("ghosthome_signup_last");
      if (j) setLast(JSON.parse(j));
    } catch {/* no-op */}
  }, []);

  const label = useMemo(() => {
    const names = { "2c": "Neighbour Access — 2 Cameras", "4c": "Route Access — 4 Cameras" };
    const prices = {
      "2c": { monthly: "R99 / month", annual: "R1,099 / 12 months" },
      "4c": { monthly: "R149 / month", annual: "R1,299 / 12 months" },
    };
    const pickedName = names[plan] || names["2c"];
    const pickedPrice =
      (prices[plan] && prices[plan][billing]) || prices["2c"].monthly;
    return { name: pickedName, price: pickedPrice };
  }, [plan, billing]);

  async function startPayFast() {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/payfast-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signup_id: signupId, plan, billing }),
      });
      if (!res.ok) throw new Error("Could not prepare payment");
      const data = await res.json(); // { action, fields }
      // Build and submit a form to PayFast
      const form = document.createElement("form");
      form.action = data.action;
      form.method = "POST";
      for (const [k, v] of Object.entries(data.fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error(e);
      setErr("Payment could not start. Please refresh or WhatsApp 079 495 0855.");
    } finally {
      setBusy(false);
    }
  }

  async function copyJSON() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(last, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {/* no-op */}
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment</h1>
          <p className="mt-1 text-slate-700">
            Review your selection and continue to payment. After payment we’ll email you a secure link to upload verification documents (if needed).
          </p>
        </header>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-semibold text-slate-900">{label.name}</div>
          <div className="text-slate-700">
            {billing === "annual" ? "Prepay 12 months" : "Monthly"}
          </div>
          <div className="text-lg font-bold text-emerald-700">{label.price}</div>
          <ul className="mt-2 list-disc pl-6 text-sm text-slate-700">
            {plan === "2c" ? (
              <>
                <li>Live view to 2 nearby street cameras</li>
                <li>1 account (single user)</li>
              </>
            ) : (
              <>
                <li>Live view to 4 cameras on your routes</li>
                <li>2 accounts (e.g., you + partner)</li>
              </>
            )}
            <li>Smart notifications 21:00–05:00 (customisable)</li>
            <li>Resident access is limited and logged</li>
          </ul>
        </div>

        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <CreditCard className="h-4 w-4" /> PayFast
          </div>
          {!signupId && (
            <p className="text-xs text-emerald-900">
              Missing sign-up reference. Please <Link className="underline" to="/signup">start at the sign-up page</Link>.
            </p>
          )}
          {err && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{err}</p>}
          <button
            type="button"
            disabled={!signupId || busy}
            onClick={startPayFast}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
              !signupId || busy ? "bg-emerald-600/60 text-white cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"
            ].join(" ")}
            title={!signupId ? "Go back to sign-up first" : "Pay with PayFast"}
          >
            <Shield className="h-4 w-4" /> {busy ? "Preparing..." : "Pay with PayFast"}
          </button>
          <p className="mt-2 text-xs text-emerald-900">
            Prefer EFT for now? WhatsApp{" "}
            <a className="underline" href="https://wa.me/27794950855" target="_blank" rel="noreferrer">
              079 495 0855
            </a>{" "}
            or email{" "}
            <a className="underline" href="mailto:ian@ghosthome.co.za">
              ian@ghosthome.co.za
            </a>.
          </p>
        </div>

        {/* Admin helper (kept from your earlier flow; optional) */}
        <details className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            Admin: last captured sign-up JSON (local)
          </summary>
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-50">
{JSON.stringify(last, null, 2)}
          </pre>
          <button
            type="button"
            onClick={copyJSON}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Clipboard className="h-4 w-4" /> {copied ? "Copied!" : "Copy JSON"}
          </button>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Temporary only — server records are now in the database after /api/signup.
          </p>
        </details>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/signup" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            ← Back to sign-up
          </Link>
          <Link to="/" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
