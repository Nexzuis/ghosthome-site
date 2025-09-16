import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const MONTHLY_PRICES = {
  basic: 99,        // 2 cameras, 1 account
  standard: 149,    // 4 cameras, 2 accounts
};
const ANNUAL_PRICES = {
  basic: 1099,
  standard: 1299,
};

export default function Signup() {
  const nav = useNavigate();
  const [plan, setPlan] = useState("basic"); // basic | standard
  const [billing, setBilling] = useState("monthly"); // monthly | annual
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    suburb: "",
    city: "",
    postalCode: "",
    accept: false,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const price =
    billing === "monthly" ? MONTHLY_PRICES[plan] : ANNUAL_PRICES[plan];

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // minimal validation
    if (!form.accept) {
      setErr("Please accept the Terms to continue.");
      return;
    }
    if (!form.fullName || !form.email || !form.phone) {
      setErr("Name, email and phone are required.");
      return;
    }

    setBusy(true);
    let signupId = null;

    try {
      // Try server API (will succeed if DB + /api are wired)
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          price,
          ...form,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        signupId = data?.id || data?.signupId || null;
      } else {
        // swallow API error, continue to client-side redirect
        console.warn("Signup API responded", res.status);
      }
    } catch (e) {
      console.warn("Signup API error", e);
    }

    // Fallback: persist minimal info locally so user can still pay
    if (!signupId) {
      const tmp = {
        plan,
        billing,
        price,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address1: form.address1,
        suburb: form.suburb,
        city: form.city,
        postalCode: form.postalCode,
        at: new Date().toISOString(),
      };
      localStorage.setItem("ghosthome_signup_fallback", JSON.stringify(tmp));
    }

    setBusy(false);
    // Always move customer forward to pay page (PayFast can be wired later)
    nav(`/pay?plan=${encodeURIComponent(plan)}&billing=${encodeURIComponent(billing)}&amount=${price}${signupId ? `&signupId=${encodeURIComponent(signupId)}` : ""}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Sign up</h1>
      <p className="mt-2 text-slate-600">
        Join the community watch access. You can cancel any time.{" "}
        <Link to="/terms" className="text-emerald-700 underline">
          Read the Terms
        </Link>
        .
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Plan */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Choose your plan</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <PlanCard
              label="R99 / month"
              sub="Access to 2 cameras near your home • 1 account"
              active={plan === "basic" && billing === "monthly"}
              onClick={() => { setPlan("basic"); setBilling("monthly"); }}
            />
            <PlanCard
              label="R149 / month"
              sub="Access to 4 cameras near your home • 2 accounts"
              active={plan === "standard" && billing === "monthly"}
              onClick={() => { setPlan("standard"); setBilling("monthly"); }}
            />
            <PlanCard
              label="R1,099 / year"
              sub="Basic (2 cams • 1 account) — annual"
              active={plan === "basic" && billing === "annual"}
              onClick={() => { setPlan("basic"); setBilling("annual"); }}
            />
            <PlanCard
              label="R1,299 / year"
              sub="Standard (4 cams • 2 accounts) — annual"
              active={plan === "standard" && billing === "annual"}
              onClick={() => { setPlan("standard"); setBilling("annual"); }}
            />
          </div>
          <p className="mt-3 text-sm text-slate-700">
            Selected: <span className="font-semibold uppercase">{plan}</span> •{" "}
            <span className="font-semibold">{billing}</span> •{" "}
            <span className="font-semibold">R{price}</span>
          </p>
        </section>

        {/* Details */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Your details</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input label="Full name" name="fullName" value={form.fullName} onChange={handle} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handle} required />
            <Input label="Phone" name="phone" value={form.phone} onChange={handle} required />
            <Input label="Address line" name="address1" value={form.address1} onChange={handle} />
            <Input label="Suburb" name="suburb" value={form.suburb} onChange={handle} />
            <Input label="City" name="city" value={form.city} onChange={handle} />
            <Input label="Postal code" name="postalCode" value={form.postalCode} onChange={handle} />
          </div>

          <label className="mt-4 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="accept"
              checked={form.accept}
              onChange={handle}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
            />
            <span>
              I accept the{" "}
              <Link to="/terms" className="text-emerald-700 underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-emerald-700 underline">
                Privacy Notice (POPIA)
              </Link>.
            </span>
          </label>

          {err ? <p className="mt-3 text-sm text-rose-600">{err}</p> : null}
        </section>

        <div className="flex items-center justify-between">
          <Link to="/street" className="text-slate-600 underline">Back to Street page</Link>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {busy ? "Processing…" : `Continue to payment (R${price})`}
          </button>
        </div>
      </form>
    </main>
  );
}

function PlanCard({ label, sub, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl border p-3 text-left",
        active ? "border-emerald-600 ring-2 ring-emerald-200" : "border-slate-200 hover:border-slate-300"
      ].join(" ")}
    >
      <div className="text-base font-semibold text-slate-900">{label}</div>
      <div className="text-xs text-slate-600">{sub}</div>
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-600 focus:ring-emerald-600"
      />
    </label>
  );
}
