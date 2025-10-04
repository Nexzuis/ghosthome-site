import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
} from "lucide-react";

export default function Cancel() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false)
  const [signupId, setSignupId] = useState(
    localStorage.getItem("ghosthome_signup_id")
  );

  // State for the lookup form
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);

  async function lookupSignupId(e) {
    e.preventDefault();
    setError("");
    setLookupBusy(true);

    try {
      const res = await fetch("/api/upload?getSignupId=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      if (!data?.ok || !data?.signupId) {
        throw new Error(data?.error || "No matching signup found");
      }
      localStorage.setItem("ghosthome_signup_id", data.signupId);
      setSignupId(data.signupId);
    } catch (e) {
      setError(e.message || "Lookup failed");
    } finally {
      setLookupBusy(false);
    }
  }

  async function start(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId: localStorage.getItem("ghosthome_signup_id") }),
      });
      console.log(res)
      if (!res.ok) throw new Error(`Server responded: ${res.status}`);
      const data = await res.json();
      setSuccess(true)
    } catch (e) {
      setError(e.message || "Lookup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {!signupId ? (
        <form
          onSubmit={lookupSignupId}
          className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Find your signup
          </h2>
          <p className="text-sm text-slate-600">
            Enter the email or phone number you used when signing up.
          </p>
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="submit"
            disabled={lookupBusy || (!email.trim() && !phone.trim())}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {lookupBusy ? "Looking up…" : "Continue"}
          </button>
        </form>
      ) : (
        success ? (
          <div>
            <div className="rounded-xl border p-5 bg-green-50 border-green-200 text-green-800 mb-5">
              <p className="font-medium">Subscription cancelled.</p>
            </div>
          </div>
        ) : (
          <button
            onClick={start}
            disabled={busy}
            className="inline-flex items-center rounded-xl px-5 py-3 bg-black text-white hover:bg-gray-900 disabled:opacity-60"
          >
            {busy ? "Contacting PayFast…" : "Cancel Subscription with PayFast"}
          </button>
        )
      )}

      {error ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
          {error}
        </p>
      ) : null}

    </main>
  );
}
