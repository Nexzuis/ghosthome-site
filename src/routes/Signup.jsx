import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Home, FileText, Upload, AlertTriangle } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState("2c");
  const [billing, setBilling] = useState("monthly"); // monthly | annual
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nearest, setNearest] = useState("");
  const [secondUser, setSecondUser] = useState(""); // for 4-cam plan
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const prices = useMemo(() => ({
    "2c": { monthly: "R99 / month", annual: "R1,099 / 12 months" },
    "4c": { monthly: "R149 / month", annual: "R1,299 / 12 months" }
  }), []);

  const planName = plan === "2c" ? "Neighbour Access — 2 Cameras" : "Route Access — 4 Cameras";
  const priceLabel = prices[plan][billing];

  const valid = fullName && email && phone && address && acceptPrivacy && acceptTerms;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          full_name: fullName,
          email,
          phone,
          address,
          nearest,
          second_user_email: plan === "4c" ? secondUser : "",
        }),
      });
      if (!res.ok) throw new Error("Sign-up failed");
      const data = await res.json();
      const signupId = data.signup_id;
      navigate(`/pay?plan=${encodeURIComponent(plan)}&billing=${encodeURIComponent(billing)}&signupId=${encodeURIComponent(signupId)}`);
    } catch (err) {
      setError("Could not create your sign-up. Please try again or WhatsApp 079 495 0855.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign up — Community Street Access</h1>
          <p className="mt-1 text-slate-700">
            Choose your plan, fill in your details, accept the terms, then proceed to payment. We’ll confirm your nearest cameras and activate your access.
          </p>
        </header>

        <div className="grid gap-3 md:grid-cols-2">
          <PlanCard
            active={plan === "2c"}
            title="Neighbour Access — 2 Cameras"
            monthly="R99 / month"
            annual="R1,099 / 12 months"
            onSelect={() => setPlan("2c")}
          />
          <PlanCard
            active={plan === "4c"}
            title="Route Access — 4 Cameras"
            monthly="R149 / month"
            annual="R1,299 / 12 months"
            badge="Popular"
            onSelect={() => setPlan("4c")}
          />
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={["rounded-lg px-3 py-1.5 text-sm font-semibold", billing === "monthly" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-white"].join(" ")}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annual")}
            className={["rounded-lg px-3 py-1.5 text-sm font-semibold", billing === "annual" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-white"].join(" ")}
          >
            Prepay 12 months
          </button>
          <span className="ml-2 text-sm text-slate-600">Selected: <span className="font-semibold">{priceLabel}</span></span>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Field label="Full name" required icon={<User className="h-4 w-4" />}>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" placeholder="e.g., Jane Citizen" required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" required icon={<Mail className="h-4 w-4" />}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </Field>
            <Field label="Phone" required icon={<Phone className="h-4 w-4" />}>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="079 123 4567" required />
            </Field>
          </div>

          <Field label="Home address" required icon={<Home className="h-4 w-4" />}>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input" placeholder="Street, suburb, city" required />
          </Field>

          <Field label="Nearest intersection / landmark (helps assign cameras)">
            <input type="text" value={nearest} onChange={(e) => setNearest(e.target.value)} className="input" placeholder="e.g., Rubenstein & De Villebois" />
          </Field>

          {plan === "4c" && (
            <Field label="Second user email (optional for 2nd account)">
              <input type="email" value={secondUser} onChange={(e) => setSecondUser(e.target.value)} className="input" placeholder="partner@example.com" />
            </Field>
          )}

          {/* Acceptances */}
          <div className="space-y-2">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} className="mt-1" required />
              <span>I’ve read and accept the <Link to="/privacy" className="underline">Privacy Notice (POPIA)</Link>.</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-1" required />
              <span>I agree to the <Link to="/terms" className="underline">Resident Live-View Terms & Conditions</Link>.</span>
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
              <AlertTriangle className="h-4 w-4" />
              You’ll be redirected to payment next. We will activate your account after successful payment.
            </div>
          </div>

          {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</div>}

          <button
            type="submit"
            disabled={!valid || busy}
            className={[
              "w-full rounded-xl px-4 py-2 text-center text-sm font-semibold shadow-sm",
              valid && !busy ? "bg-emerald-600 text-white hover:bg-emerald-700" : "cursor-not-allowed bg-slate-200 text-slate-500"
            ].join(" ")}
          >
            {busy ? "Working..." : "Proceed to payment"}
          </button>

          <div className="text-xs text-slate-500">
            Need help? WhatsApp <a className="underline" href="https://wa.me/27794950855" target="_blank" rel="noreferrer">079 495 0855</a> or email{" "}
            <a className="underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a>
          </div>
        </form>
      </section>
    </main>
  );
}

function PlanCard({ active, title, monthly, annual, badge, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "relative h-full w-full rounded-2xl border p-5 text-left shadow-sm transition",
        active ? "border-emerald-300 ring-2 ring-emerald-300" : "border-slate-200 hover:border-slate-300",
        active ? "bg-slate-900 text-white" : "bg-slate-800 text-slate-50"
      ].join(" ")}
    >
      {badge && (
        <span className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 ring-1 ring-emerald-400/40">
          {badge}
        </span>
      )}
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-2xl font-bold">{monthly}</div>
      <div className="text-sm opacity-90">{annual}</div>
    </button>
  );
}

function Field({ label, required, icon, children }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {icon}{label}{required && <span className="text-rose-600">*</span>}
      </div>
      {children}
    </label>
  );
}

/* Tailwind input class injection */
const inputClass = `
w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200
`;
if (typeof window !== "undefined" && !window.__ghosthome_input_applied) {
  window.__ghosthome_input_applied = true;
  const style = document.createElement("style");
  style.innerHTML = `.input{${inputClass.replace(/\n/g, "")}}`;
  document.head.appendChild(style);
}
