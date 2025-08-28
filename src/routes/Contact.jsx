import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Mail,
  ScanEye,
  Lightbulb,
  Shield,
  BellRing,
  Megaphone,
  Route as RouteIcon,
  Sun,
  Moon,
  Home,
  Car,
  Sparkles,
} from "lucide-react";

/**
 * Contact (original + fun, interactive)
 * - Keeps the site's visual language (whites/greys/slates + emerald accents)
 * - No new libraries
 * - Full mailto submit from THIS file (no reliance on ContactForm.jsx)
 * - Flip cards + toggles to make it lively
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

  // Interactive toggles (informative, included in the email subject/body)
  const [projectType, setProjectType] = useState("home"); // home | street
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
      {/* HERO */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-8 md:grid-cols-2">
          {/* LEFT: fun/interactive explainer */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Let’s plan something smart
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              A security system that <span className="text-emerald-600">acts</span> — not just records
            </h1>
            <p className="mt-2 text-slate-600">
              Tell us what you want to secure. We’ll suggest a sensible kit and automation recipe
              (AI detect → snapshot + chime → lights/sirens → track → escalate).
            </p>

            {/* Flip cards row */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FlipCard
                front={
                  <CardFace
                    icon={<ScanEye className="h-5 w-5" />}
                    title="Detect"
                    text="AI tags person/pet/vehicle."
                    tone="emerald"
                  />
                }
                back={
                  <CardFaceBack
                    bullets={[
                      "Fewer false alerts via zones & line crossing",
                      "Snapshot included in the notification",
                    ]}
                  />
                }
              />
              <FlipCard
                front={
                  <CardFace
                    icon={<BellRing className="h-5 w-5" />}
                    title="Alert"
                    text="Snapshot + indoor chime."
                    tone="amber"
                  />
                }
                back={
                  <CardFaceBack
                    bullets={[
                      "Night chime so you actually wake up",
                      "Quiet day mode: relevant pings only",
                    ]}
                  />
                }
              />
              <FlipCard
                front={
                  <CardFace
                    icon={<Megaphone className="h-5 w-5" />}
                    title="Deter"
                    text="Lights & siren auto-fire."
                    tone="rose"
                  />
                }
                back={
                  <CardFaceBack
                    bullets={[
                      "Spotlight flash on line crossing",
                      "Siren burst on loitering",
                    ]}
                  />
                }
              />
              <FlipCard
                front={
                  <CardFace
                    icon={<RouteIcon className="h-5 w-5" />}
                    title="Track"
                    text="Pan/tilt can follow."
                    tone="indigo"
                  />
                }
                back={
                  <CardFaceBack
                    bullets={[
                      "Auto-track moving targets",
                      "Good hand-off between street cameras",
                    ]}
                  />
                }
              />
            </div>

            {/* Toggles */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleGroup
                  label="What are we securing?"
                  options={[
                    { key: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
                    { key: "street", label: "Street", icon: <Car className="h-4 w-4" /> },
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

            {/* Quick contacts strip */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="https://wa.me/27794950855"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
              >
                <PhoneCall className="h-5 w-5" />
                WhatsApp: +27 79 495 0855
              </a>
              <a
                href="mailto:ian@ghosthome.co.za"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
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
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Full name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="e.g., Ian Jansen van Rensburg"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Phone (WhatsApp) *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+27 79 495 0855"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="suburb" className="block text-sm font-medium text-slate-700">
                    Suburb / Area
                  </label>
                  <input
                    id="suburb"
                    name="suburb"
                    type="text"
                    value={form.suburb}
                    onChange={onChange}
                    placeholder="e.g., Pretoria East"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
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
                  placeholder="Tell us about your home/street, wired vs wire-free, and any automations (lights, siren, chime)…"
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
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm",
                    sending
                      ? "bg-emerald-400 text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-700",
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

      {/* Bottom mini features row (keeps page lively) */}
      <section className="mt-10">
        <div className="grid gap-3 sm:grid-cols-3">
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
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1",
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

function FlipCard({ front, back }) {
  return (
    <div className="group relative h-36 w-full cursor-pointer rounded-2xl bg-transparent [perspective:1000px]">
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm [backface-visibility:hidden]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

function CardFace({ icon, title, text, tone = "emerald" }) {
  const tint = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    indigo: "text-indigo-600",
    sky: "text-sky-600",
    violet: "text-violet-600",
  }[tone];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-full bg-slate-100 ${tint}`}>
          {icon}
        </span>
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

function CardFaceBack({ bullets = [] }) {
  return (
    <ul className="flex h-full list-disc flex-col justify-center gap-2 pl-5 text-sm text-slate-700">
      {bullets.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
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
