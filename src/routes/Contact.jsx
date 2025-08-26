import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

export default function Contact() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    suburb: "",
    reason: "Quote",
    message: "",
    botTrap: "", // honeypot
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const emailTo = "ian@ghosthome.co.za";
  const waNumber = "27794950855";

  const isValid = useMemo(() => {
    return fields.name.trim() && fields.email.trim() && fields.message.trim();
  }, [fields]);

  function onChange(e) {
    const { name, value } = e.target;
    setFields((s) => ({ ...s, [name]: value }));
    setError("");
    setOk("");
  }

  function asMailto() {
    const subject = `[Ghosthome] ${fields.reason} — ${fields.name}`;
    const bodyLines = [
      `Name: ${fields.name}`,
      `Email: ${fields.email}`,
      fields.phone ? `Phone: ${fields.phone}` : null,
      fields.suburb ? `Suburb/Area: ${fields.suburb}` : null,
      `Reason: ${fields.reason}`,
      "",
      fields.message,
      "",
      "— sent from ghosthome.co.za/contact",
    ].filter(Boolean);

    const body = bodyLines.join("\n");
    return `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function asWhatsAppLink() {
    const text = [
      `Hi Ghosthome 👋`,
      `I'd like help with: ${fields.reason}`,
      "",
      `Name: ${fields.name}`,
      fields.suburb ? `Suburb/Area: ${fields.suburb}` : null,
      fields.phone ? `Phone: ${fields.phone}` : null,
      fields.email ? `Email: ${fields.email}` : null,
      "",
      fields.message,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (fields.botTrap) {
      // silently drop bots
      return;
    }
    if (!isValid) {
      setError("Please fill your name, email, and message.");
      return;
    }
    setOk("Opening your email app…");
    window.location.href = asMailto();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      {/* Watermark + subtle motion */}
      <style>{`
        @keyframes floaty { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        .floaty { animation: floaty 5s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .floaty { animation: none } }
      `}</style>

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        {/* Faint logo watermark */}
        <div className="pointer-events-none absolute -right-10 -top-10 hidden h-48 w-48 select-none rounded-full bg-emerald-50 ring-1 ring-emerald-100/50 md:block">
          <img
            src="/logo.png"
            onError={(e) => (e.currentTarget.src = "/logo192.png")}
            alt=""
            className="floaty absolute inset-0 m-auto h-32 w-32 opacity-30"
          />
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:items-center">
          <div className="md:col-span-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Let’s design your <span className="text-emerald-600">Security</span> +{" "}
              <span className="text-emerald-600">Automation</span>
            </h1>
            <p className="mt-2 text-slate-600">
              Get a quote, book a site survey, or ask anything. We’ll help you choose the right cameras, chimes, and
              automations — and link it to your existing alarm/armed response.
            </p>

            {/* quick contact chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${emailTo}`}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50"
              >
                <Mail className="h-4 w-4" />
                {emailTo}
              </a>
              <a
                href={`tel:+${waNumber}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Phone className="h-4 w-4" />
                079 495 0855
              </a>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </div>
          </div>

          {/* stacked info card */}
          <div className="md:col-span-2">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <InfoLine icon={<Clock className="h-5 w-5" />} title="Hours" text="Mon–Fri 08:00–17:00" />
              <InfoLine icon={<MapPin className="h-5 w-5" />} title="Based" text="Pretoria • On-site installs in SA" />
              <InfoLine
                icon={<Shield className="h-5 w-5" />}
                title="POPIA"
                text="Privacy-aware camera angles & signage available"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FORM + CONTACT PANELS */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* form */}
        <div className="md:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            noValidate
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                name="name"
                value={fields.name}
                onChange={onChange}
                placeholder="Your name"
                required
              />
              <Field
                label="Email"
                type="email"
                name="email"
                value={fields.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
              <Field
                label="Phone (optional)"
                name="phone"
                value={fields.phone}
                onChange={onChange}
                placeholder="079 123 4567"
              />
              <Field
                label="Suburb/Area (helps plan Wi-Fi & install)"
                name="suburb"
                value={fields.suburb}
                onChange={onChange}
                placeholder="e.g. Lynnwood, Montana, etc."
              />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-800">Reason</label>
                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-500 focus:ring"
                  name="reason"
                  value={fields.reason}
                  onChange={onChange}
                >
                  <option>Quote</option>
                  <option>Site Survey</option>
                  <option>Support</option>
                  <option>General Question</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-800">Message</label>
                <textarea
                  className="min-h-[140px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-500 focus:ring"
                  name="message"
                  value={fields.message}
                  onChange={onChange}
                  placeholder="Tell us what you want to achieve — number of cameras, chime at night, siren, alarm link, etc."
                  required
                />
              </div>

              {/* honeypot */}
              <input
                type="text"
                name="company"
                value={fields.botTrap}
                onChange={(e) => setFields((s) => ({ ...s, botTrap: e.target.value }))}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* alerts */}
            {error ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ) : null}
            {ok ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>{ok}</span>
              </div>
            ) : null}

            {/* actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <Mail className="h-4 w-4" />
                Send email
              </button>
              <a
                href={asWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp now
              </a>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-slate-700 hover:bg-slate-50"
              >
                See packages <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              By contacting us you consent to being contacted about your enquiry. We follow POPIA best-practice and can
              provide signage on request.
            </p>
          </form>
        </div>

        {/* contact panels */}
        <div className="md:col-span-2 space-y-6">
          {/* direct contact */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-slate-900">Direct contact</h3>
            <div className="space-y-2 text-sm">
              <Line icon={<Mail className="h-4 w-4" />} label="Email" value={emailTo} href={`mailto:${emailTo}`} />
              <Line icon={<Phone className="h-4 w-4" />} label="Phone" value="079 495 0855" href={`tel:+${waNumber}`} />
              <Line
                icon={<MessageCircle className="h-4 w-4" />}
                label="WhatsApp"
                value="+27 79 495 0855"
                href={`https://wa.me/${waNumber}`}
              />
            </div>
          </div>

          {/* what to expect */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-3 text-base font-bold text-slate-900">What to expect</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                Quick response with options & pricing ranges.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                Optional site survey to map Wi-Fi and blind spots.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                Clean install, training, and aftercare tweaks.
              </li>
            </ul>
          </div>

          {/* tiny brand stamp */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <img
              src="/logo.png"
              onError={(e) => (e.currentTarget.src = "/logo192.png")}
              alt="Ghosthome"
              className="h-10 w-10 rounded-full ring-1 ring-slate-200"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Ghosthome</p>
              <p className="text-xs text-slate-500">Security & Automation for SA homes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Reusable bits ——— */

function Field({ label, name, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-800">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-emerald-500 focus:ring"
      />
    </div>
  );
}

function Line({ icon, label, value, href }) {
  const C = href ? "a" : "div";
  return (
    <C
      {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {})}
      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50"
    >
      <span className="flex items-center gap-2 text-slate-600">
        <span className="text-emerald-700">{icon}</span>
        <span className="text-slate-800">{label}</span>
      </span>
      <span className="text-slate-700">{value}</span>
    </C>
  );
}

function InfoLine({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="mt-0.5 text-emerald-700">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{text}</p>
      </div>
    </div>
  );
}
