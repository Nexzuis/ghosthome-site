import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Camera,
  Users,
  CalendarDays,
  BellRing,
  ChevronRight,
} from "lucide-react";

const MONTHLY_PRICES = { basic: 99, standard: 149 };
const ANNUAL_PRICES  = { basic: 1099, standard: 1299 };

/* ====== VIDEO SETTINGS ======
   Put your file in: /public/videos/resident-demo.mp4
   Update these if you use a different name.
*/
const RESIDENT_DEMO_SRC = "/videos/resident-demo.mp4"; // change if your file name differs
const RESIDENT_POSTER   = "/videos/resident-demo-poster.jpg"; // optional; remove if you don't have one

export default function Signup() {
  const nav = useNavigate();
  const [plan, setPlan] = useState("basic");
  const [billing, setBilling] = useState("monthly");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    email_2: "",
    phone: "",
    address1: "",
    suburb: "",
    city: "",
    postalCode: "",
    accept: false,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState("");

  // --- robust autoplay helper ---
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Try to (re)play when metadata is ready (helps Safari/iOS)
    const tryPlay = () => {
      if (v.muted && v.paused) {
        const p = v.play();
        if (p && typeof p.catch === "function") {
          p.catch(() => {
            // last-ditch: nudge currentTime then play
            try { v.currentTime = 0.001; } catch {}
            v.play().catch(() => {});
          });
        }
      }
    };

    v.addEventListener("loadedmetadata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    tryPlay(); // also attempt immediately

    return () => {
      v.removeEventListener("loadedmetadata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  const price = billing === "monthly" ? MONTHLY_PRICES[plan] : ANNUAL_PRICES[plan];

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

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
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          price,
          recurring: true,
          cycle: billing === "monthly" ? "monthly" : "annual",
          ...form,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        signupId = data?.id || data?.signupId || null;
      }
    } catch { /* no-op */ }

    if (!signupId) {
      localStorage.setItem(
        "ghosthome_signup_fallback",
        JSON.stringify({
          plan,
          billing,
          price,
          recurring: true,
          cycle: billing === "monthly" ? "monthly" : "annual",
          fullName: form.fullName,
          email: form.email,
          email_2: form.email_2 || null,
          phone: form.phone,
          address1: form.address1,
          suburb: form.suburb,
          city: form.city,
          postalCode: form.postalCode,
          at: new Date().toISOString(),
        })
      );
    } else {
      localStorage.setItem("ghosthome_signup_id", signupId);
    }

    setBusy(false);
    nav(
      `/pay?plan=${encodeURIComponent(plan)}&billing=${encodeURIComponent(
        billing
      )}&amount=${price}&recurring=true${
        signupId ? `&signupId=${encodeURIComponent(signupId)}` : ""
      }`
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-300">
          <Shield className="h-4 w-4" />
          Join your community watch access
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Sign up in two minutes
          </span>
        </h1>
        <p className="mt-2 max-w-3xl text-slate-700">
          Choose a plan, add your details, accept the{" "}
          <Link to="/terms" className="text-emerald-700 underline">Terms</Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-emerald-700 underline">Privacy Notice (POPIA)</Link>.
          You can <a href="/cancel" className="underline font-medium">cancel</a> any time.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip icon={<Camera className="h-4 w-4" />} text="Live-view access" tone="emerald" />
          <Chip icon={<BellRing className="h-4 w-4" />} text="Night notifications (customisable)" tone="amber" />
          <Chip icon={<Users className="h-4 w-4" />} text="Household accounts" tone="violet" />
          <Chip icon={<CalendarDays className="h-4 w-4" />} text="Monthly or annual" tone="sky" />
        </div>
      </section>

      {/* Plans + Details */}
      <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Plan column */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Choose your plan</h2>
          <PlanCard
            active={plan === "basic" && billing === "monthly"}
            onClick={() => { setPlan("basic"); setBilling("monthly"); }}
            badge="Most popular"
            gradient="from-emerald-600 to-emerald-500"
            title="R99 / month"
            bullets={["Access to 2 nearby cameras", "1 account for your home"]}
          />
          <PlanCard
            active={plan === "standard" && billing === "monthly"}
            onClick={() => { setPlan("standard"); setBilling("monthly"); }}
            gradient="from-sky-600 to-indigo-600"
            title="R149 / month"
            bullets={["Access to 4 nearby cameras", "2 accounts for your household"]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <MiniPlan
              active={plan === "basic" && billing === "annual"}
              onClick={() => { setPlan("basic"); setBilling("annual"); }}
              title="R1,099 / year"
              sub="Basic annual"
            />
            <MiniPlan
              active={plan === "standard" && billing === "annual"}
              onClick={() => { setPlan("standard"); setBilling("annual"); }}
              title="R1,299 / year"
              sub="Standard annual"
            />
          </div>

          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
            <strong>Selected:</strong> <span className="uppercase">{plan}</span> • {billing} •{" "}
            <span className="font-semibold">R{price}</span>
            <div className="mt-1 text-xs opacity-90">
              Subscription: billed {billing === "monthly" ? "monthly until you cancel" : "annually with automatic renewal"}.
            </div>
          </div>
        </section>

        {/* Details + Video side-by-side */}
        <section className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-semibold text-slate-800">Your details</h2>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Form card spans two columns */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Full name" name="fullName" value={form.fullName} onChange={handle} required />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handle} required />

                {plan === "standard" && (
                  <Input
                    label="Second household email"
                    name="email_2"
                    type="email"
                    value={form.email_2}
                    onChange={handle}
                    required
                  />
                )}

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
                  <Link to="/terms" className="text-emerald-700 underline">Terms & Conditions</Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-emerald-700 underline">Privacy Notice (POPIA)</Link>.
                </span>
              </label>

              {err ? <p className="mt-3 text-sm text-rose-600">{err}</p> : null}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <Link to="/street" className="inline-flex items-center gap-1 text-slate-600 underline">
                  Back to Street page
                </Link>
                <button
                  type="submit"
                  disabled={busy}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-sky-700 disabled:opacity-60"
                >
                  {busy ? "Processing…" : `Continue to payment (R${price})`}
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Demo video column */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">Resident demo and FAQ below</h3>
              <div className="mt-3">
                <div className="mx-auto w-full overflow-hidden rounded-xl ring-1 ring-emerald-200">
                  <video
                    ref={videoRef}
                    // IMPORTANT: muted before autoplay helps Safari
                    muted
                    playsInline
                    autoPlay
                    loop
                    controls={false}
                    preload="metadata"
                    poster={RESIDENT_POSTER}
                    className="block h-[350px] w-full object-cover sm:h-[320px] lg:h-[350px]"
                    aria-label="Resident alert demo (silent, looped)"
                  >
                    <source src={RESIDENT_DEMO_SRC} type="video/mp4" />
                    {/* If you also have a WebM, add it as a second source above MP4 */}
                    {/* <source src="/videos/resident-demo.webm" type="video/webm" /> */}
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* Residents’ FAQ — accordion, content unchanged */}
      <section className="mt-10 rounded-3xl border border-emerald-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Residents’ FAQ — Ghosthome Community CCTV Network</h2>

        <div className="mt-4 divide-y divide-slate-200">
          <FAQ q="1️⃣ What is Ghosthome for residents?">
            <>
              Ghosthome is a community CCTV network that connects residents, the local CPF, and approved security partners.
              It gives residents live access to nearby street-corner cameras and real-time AI alerts whenever a person is detected at night.
              The goal is simple — to make every street safer through connected visibility and fast, verified alerts.
            </>
          </FAQ>

          <FAQ q="2️⃣ How does it work for residents?">
            <>
              Each monitored street corner is connected to a world-class video management system (VMS) that securely manages all camera feeds.
              <br/>Our AI analytics continuously scan for human movement — especially between 23:00 and 04:00.
              <br/>When the system detects a person, residents receive instant push notifications via the Ghosthome VMS app.
              <br/>You can open the app to view the event live in real time.
              <br/>Residents do not have access to stored or archived footage.
              <br/>All video data remains encrypted and managed exclusively by Ghosthome.
            </>
          </FAQ>

          <FAQ q="3️⃣ Why are Ghosthome’s analytics different?">
            <>
              Traditional alarm or motion systems send false alerts for shadows, pets, or weather.
              Ghosthome uses advanced deep-learning analytics with a near-zero false-alert rate, trained to recognise true human activity.
              This ensures every alert you receive is relevant and trustworthy.
              (Learn more about the analytics platform at{" "}
              <a href="https://www.cvedia.com/vehicle-classifier" target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                www.cvedia.com
              </a>
              ).
            </>
          </FAQ>

          <FAQ q="4️⃣ What do residents get when joining Ghosthome?">
            <ul className="list-disc pl-5">
              <li>Live view access to the street-corner cameras closest to your home.</li>
              <li>Smart night-time person alerts (23:00–04:00).</li>
              <li>Secure login through the Ghosthome VMS app.</li>
              <li>Community-wide protection — every new signup strengthens the network.</li>
              <li>
                CPF access: Residents who are registered and vetted active CPF patrollers may receive additional Telegram clip notifications for
                verified incidents. CPF vetting is handled directly by the CPF before Ghosthome grants access.
              </li>
              <li>
                Security partners have enhanced analytics access — including vehicle detections and search capabilities — to assist with
                investigations and rapid response.
              </li>
            </ul>
          </FAQ>

          <FAQ q="5️⃣ How do I sign up as a resident?">
            <>
              Visit <a href="/signup" className="text-emerald-700 underline">www.ghosthome.co.za/signup</a> and complete the short registration form.
              Upload your ID and proof of residence for verification. Once approved, you’ll receive your login credentials and instant access
              to your nearest cameras for live night-time alerts.
            </>
          </FAQ>

          <FAQ q="6️⃣ Can residents install their own cameras?">
            <>
              The Ghosthome network uses only managed cameras to ensure reliability and legal compliance.
              However, residents can request affordable home CCTV installations using the same AI analytics technology —
              <b> always performing better than traditional alarms.</b> These systems can optionally be linked into the Ghosthome VMS for secure
              monitoring by approved security partners if required.
            </>
          </FAQ>

          <FAQ q="7️⃣ What about privacy and data protection?">
            <>
              Ghosthome operates under full POPIA compliance:
              <ul className="mt-2 list-disc pl-5">
                <li>All monitored areas display privacy signage.</li>
                <li>Only verified residents, approved partners, and vetted CPF patrollers may view live feeds.</li>
                <li>Footage and personal data remain encrypted and protected.</li>
                <li>
                  All data and access requests are managed solely by the Ghosthome Information Officer, who ensures lawful storage,
                  access, and sharing procedures.
                </li>
              </ul>
            </>
          </FAQ>

          <FAQ q="8️⃣ What happens when an alert is triggered?">
            <ul className="list-disc pl-5">
              <li>The analytics detect a verified person event.</li>
              <li>A real-time alert is sent to residents via the Ghosthome VMS app.</li>
              <li>Residents can open the app to view the event live.</li>
              <li>Security partners receive operational notifications, including vehicle detections and searches, to coordinate ground response.</li>
              <li>Any footage required for investigation or law-enforcement support is handled exclusively by the Ghosthome Information Officer in line with POPIA.</li>
            </ul>
          </FAQ>

          <FAQ q="9️⃣ What does it cost and how do I cancel?">
            <>
              Resident access is billed monthly. You can cancel anytime through your online account or by emailing{" "}
              <a href="mailto:support@ghosthome.co.za" className="text-emerald-700 underline">support@ghosthome.co.za</a>.
              Cancellations take effect at the end of your current billing cycle.
            </>
          </FAQ>

          <FAQ q="🔟 What if I move to another address?">
            <>
              Your access is linked to your verified residential address. If you move within a Ghosthome-covered area,
              your camera access will be updated automatically.
            </>
          </FAQ>

          <FAQ q="11️⃣ Who can residents contact for support?">
            <>
              You can email <a href="mailto:support@ghosthome.co.za" className="text-emerald-700 underline">support@ghosthome.co.za</a> or
              message the Ghosthome Support Line (details in your welcome pack). For urgent safety issues, contact your local CPF or security partner.
            </>
          </FAQ>
        </div>
      </section>
    </main>
  );
}

/* ——— UI bits ——— */

function Chip({ icon, text, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-800 ring-emerald-300",
    sky: "bg-sky-100 text-sky-800 ring-sky-300",
    amber: "bg-amber-100 text-amber-800 ring-amber-300",
    violet: "bg-violet-100 text-violet-800 ring-violet-300",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {icon}
      {text}
    </span>
  );
}

function PlanCard({ active, onClick, title, bullets, gradient, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full overflow-hidden rounded-2xl text-left shadow-sm ring-1 transition",
        active ? "ring-emerald-300" : "ring-slate-200 hover:ring-slate-300",
      ].join(" ")}
    >
      <div className={["p-4", active ? `bg-gradient-to-r ${gradient} text-white` : "bg-slate-50"].join(" ")}>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{title}</div>
          {badge && active ? (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">{badge}</span>
          ) : null}
        </div>
        <ul className={["mt-2 space-y-1 text-sm", active ? "text-white/90" : "text-slate-700"].join(" ")}>
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className={active ? "mt-1 h-1.5 w-1.5 rounded-full bg-white" : "mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600"} />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}

function MiniPlan({ active, onClick, title, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-xl border p-3 text-left transition",
        active ? "border-emerald-600 ring-2 ring-emerald-200" : "border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      <div className="text-base font-semibold text-slate-900">{title}</div>
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
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
      />
    </label>
  );
}

function FAQ({ q, children }) {
  return (
    <details className="group py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-200 transition hover:bg-emerald-100">
        <span>{q}</span>
        <span className="ml-4 grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
        {children}
      </div>
    </details>
  );
}
