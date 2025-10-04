import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Mail,
  ScanEye,
  Lightbulb,
  Shield,
  BellRing,
  Route as RouteIcon,
  Sun,
  Moon,
  Home,
  Car,
  Sparkles,
  Camera,
  FileText,
  CheckCircle2,
} from "lucide-react";

/**
 * Contact — Street-first theme to match Home
 * - Community Street-Camera Network as the primary focus
 * - Smart Home Systems as a secondary offering (clearly separated)
 * - Keeps mailto submit (no backend)
 * - Subtle gradient accents + hover lift, same as Home/Hero styling
 * - No new libraries beyond framer-motion (already imported)
 */
export default function Contact() {
  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    message: "",
  });

  // Interactive toggles (included in email subject/body)
  const [projectType, setProjectType] = useState("street"); // street | home
  const [power, setPower] = useState("wired"); // wired | wirefree
  const [mode, setMode] = useState("night"); // day | night
  const [contactPref, setContactPref] = useState("whatsapp"); // whatsapp | email

  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const subject = useMemo(() => {
    const who = projectType === "street" ? "Street" : "Home";
    const pow = power === "wirefree" ? "Wire-free" : "Wired";
    const md = mode === "day" ? "Day" : "Night";
    return `Ghosthome enquiry (${who}, ${pow}, ${md}) — ${form.name || "New lead"}`;
  }, [projectType, power, mode, form.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      alert("Please add your name, phone number, and a short message.");
      return;
    }
    setSending(true);

    const bodyLines = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email || "-"}`,
      `Suburb/Area: ${form.suburb || "-"}`,
      `Project Type: ${projectType}`,
      `Power: ${power}`,
      `Preferred Mode: ${mode}`,
      `Contact Preference: ${contactPref}`,
      "",
      "Message:",
      form.message,
    ];

    const mailto = `mailto:ian@ghosthome.co.za?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
    setTimeout(() => setSending(false), 800);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* STREET HERO — subtle emerald energy like Home */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        {/* soft glow accents */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-12 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-2">
          {/* LEFT: street-first explainer (aligned with Home copy) */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Camera className="h-4 w-4" />
              Community street-camera network
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Safer streets through shared visibility & partner escalation
            </h1>
            <p className="mt-2 text-slate-700">
              Tell us about your street or area. Residents receive route access and focused night alerts (22:00–04:00).
              CPF leaders coordinate. Security partners escalate with context for faster response.
            </p>

            {/* Small credibility strip (mirrors Home tone) */}
            <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Night alerts (22:00–04:00)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Shareable snapshots & clips
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Transparent audit trail
              </li>
            </ul>

            {/* Mini how-it-works (4 steps) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MiniStep
                icon={<ScanEye className="h-5 w-5" />}
                title="Detect"
                text="Poles cover routes & entrances; AI focuses on people/vehicles."
              />
              <MiniStep
                icon={<BellRing className="h-5 w-5" />}
                title="Alert"
                text="WhatsApp with snapshot + short clip to the right residents."
              />
              <MiniStep
                icon={<RouteIcon className="h-5 w-5" />}
                title="Review"
                text="Bookmarks help you trace movement across adjoining streets."
              />
              <MiniStep
                icon={<Shield className="h-5 w-5" />}
                title="Escalate"
                text="Partners get context for prioritised, faster response."
              />
            </div>

            {/* Quick contacts strip (hover lift) */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="https://wa.me/27794950855"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <PhoneCall className="h-5 w-5" />
                WhatsApp: +27 79 495 0855
              </a>
              <a
                href="mailto:ian@ghosthome.co.za"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                <Mail className="h-5 w-5" />
                ian@ghosthome.co.za
              </a>
            </div>
          </div>

          {/* RIGHT: the form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  id="name"
                  label="Full name *"
                  placeholder="e.g., Ian Jansen van Rensburg"
                  required
                  value={form.name}
                  onChange={onChange}
                />
                <Field
                  id="phone"
                  label="Phone (WhatsApp) *"
                  type="tel"
                  placeholder="+27 79 495 0855"
                  required
                  value={form.phone}
                  onChange={onChange}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                />
                <Field
                  id="suburb"
                  label="Suburb / Area"
                  placeholder="e.g., Pretoria East"
                  value={form.suburb}
                  onChange={onChange}
                />
              </div>

              {/* Toggles (street-first defaults) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ToggleGroup
                    label="What are we securing?"
                    options={[
                      { key: "street", label: "Street", icon: <Car className="h-4 w-4" /> },
                      { key: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
                    ]}
                    value={projectType}
                    onChange={setProjectType}
                  />
                  <ToggleGroup
                    label="Power preference"
                    options={[
                      { key: "wired", label: "Wired" },
                      { key: "wirefree", label: "Wire-free" },
                    ]}
                    value={power}
                    onChange={setPower}
                  />
                  <ToggleGroup
                    label="Mode you care about most"
                    options={[
                      { key: "day", label: "Day", icon: <Sun className="h-4 w-4" /> },
                      { key: "night", label: "Night", icon: <Moon className="h-4 w-4" /> },
                    ]}
                    value={mode}
                    onChange={setMode}
                  />
                  <ToggleGroup
                    label="Contact preference"
                    options={[
                      { key: "whatsapp", label: "WhatsApp" },
                      { key: "email", label: "Email" },
                    ]}
                    value={contactPref}
                    onChange={setContactPref}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  These choices help us tailor the first proposal. We’ll confirm details on a quick call.
                </p>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                  What do you want to secure? *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={onChange}
                  placeholder="Tell us about your street/home, key routes/entrances, night concerns, and any partner details (CPF or private security)…"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Live subject preview */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">Email subject preview</p>
                <p className="mt-1 truncate text-xs text-slate-600">{subject}</p>
              </div>

              {/* POPIA note */}
              <p className="text-xs text-slate-500">
                We respect POPIA. We’ll only use your details to respond to your enquiry. Privacy signage available on request.
              </p>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className={[
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition",
                    sending
                      ? "bg-emerald-400 text-white"
                      : "bg-emerald-600 text-white hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                  ].join(" ")}
                  aria-busy={sending ? "true" : "false"}
                >
                  {sending ? "Opening email…" : "Send enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust strip (mirrors Home tone) */}
      <section className="mt-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <TrustItem
            icon={<BellRing className="h-5 w-5" />}
            title="Night alerts only (22:00–04:00)"
            text="Less noise, more attention when it matters."
          />
          <TrustItem
            icon={<Camera className="h-5 w-5" />}
            title="Push notifications"
            text="Give neighbours & partners instant alerts."
          />
          <TrustItem
            icon={<FileText className="h-5 w-5" />}
            title="Transparent audit trail"
            text="Bookmarks & exports keep everyone accountable."
          />
        </div>
      </section>

      {/* Divider between Street (core) and Home (side) */}
      <div className="my-14 h-px w-full bg-slate-200" aria-hidden="true"></div>

      {/* SMART HOME SYSTEMS — secondary offering, aligned with Home */}
      <section aria-labelledby="smart-home" className="mt-6">
        <h2 id="smart-home" className="text-xl font-semibold text-slate-900">
          We also do Smart Home Systems
        </h2>
        <p className="mt-2 text-slate-600">
          Add connected cameras and automations at home: indoor chimes, spotlights, and simple “if person → do X”
          routines using reliable, mainstream gear.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <AddOnCard
            icon={<Lightbulb className="h-6 w-6" />}
            title="Automations & scenes"
            points={[
              "Turn on spotlights on verified person events",
              "Trigger other camera lights/alarms automatically",
              "Simple buttons to arm/disarm modes",
            ]}
          />
          <AddOnCard
            icon={<Camera className="h-6 w-6" />}
            title="Home cameras & hubs"
            points={[
              "Reliable app control and notifications",
              "Indoor alarm sounders (quiet day / loud night)",
              "Privacy zones and signage support",
            ]}
          />
          <AddOnCard
            icon={<Shield className="h-6 w-6" />}
            title="Assist & support"
            points={[
              "Install, configure, and fine-tune alerts",
              "False-alarm reduction & zones",
              "Integration with your response radio/panel",
            ]}
          />
        </div>

        {/* Mini features row (keeps page lively) */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <MiniCard
            icon={<Lightbulb className="h-5 w-5" />}
            title="Automate"
            text="Lights, plugs & switches react instantly."
            tint="sky"
          />
          <MiniCard
            icon={<Shield className="h-5 w-5" />}
            title="Responsible"
            text="POPIA-aware setup, privacy zones, signage."
            tint="violet"
          />
          <MiniCard
            icon={<ScanEye className="h-5 w-5" />}
            title="Clarity"
            text="Snapshot in the notification = instant context."
            tint="emerald"
          />
        </div>
      </section>
    </main>
  );
}

/* ---------- Small UI helpers (local) ---------- */

function Field({ id, label, value, onChange, type = "text", placeholder, required = false }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

function ToggleGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 transition",
                active
                  ? "bg-emerald-600 text-white ring-emerald-600"
                  : "bg-white text-emerald-700 ring-emerald-200 hover:bg-emerald-50",
              ].join(" ")}
              aria-pressed={active ? "true" : "false"}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MiniStep({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          {icon}
        </div>
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-slate-700">{text}</p>
    </div>
  );
}

function AddOnCard({ icon, title, points = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustItem({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function MiniCard({ icon, title, text, tint = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    sky: "bg-sky-50 text-sky-800 ring-sky-200",
    violet: "bg-violet-50 text-violet-800 ring-violet-200",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
      <div
        className={`mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tint]}`}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white">{icon}</span>
        {title}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}
