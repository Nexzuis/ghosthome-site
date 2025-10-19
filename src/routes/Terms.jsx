import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, Phone, Mail, Clock8, Lock, Share2, Bot, AlertOctagon } from "lucide-react";

export default function Terms() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <Clock8 className="h-4 w-4" />
          Last updated: 4 October 2025
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Resident Live-View Terms & Conditions
          </span>
        </h1>
        <p className="mt-2 text-slate-600">
          These terms govern how approved residents may use the community CCTV live-view service during the{" "}
          <strong>23:00–04:00</strong> window (adjustable on request). They work together with our{" "}
          <Link to="/privacy" className="text-emerald-700 underline">Privacy Notice (POPIA)</Link>.
        </p>
      </header>

      {/* Who/contacts quick cards */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <Shield className="h-4 w-4 text-emerald-600" />
            Responsible Party / Operator
          </div>
          <ul className="mt-2 leading-6 text-sm text-slate-700">
            <li><strong>Responsible Party:</strong> Ian Jansen van Rensburg</li>
            <li><strong>Operator:</strong> Ghosthome (2025/731979/07)</li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <a className="underline decoration-slate-300 hover:text-emerald-700" href="mailto:support@Ghosthome.co.za">
                support@Ghosthome.co.za
              </a>{" "}
              <span className="text-xs text-slate-500">(general support)</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <FileText className="h-4 w-4 text-emerald-600" />
            Information Officer (POPIA)
          </div>
          <ul className="mt-2 leading-6 text-sm text-slate-700">
            <li>Ian Jansen van Rensburg</li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <a className="underline decoration-slate-300 hover:text-emerald-700" href="mailto:ian@ghosthome.co.za">
                ian@ghosthome.co.za
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <a className="underline decoration-slate-300 hover:text-emerald-700" href="tel:+27794950855">
                079 495 0855
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Body */}
      <article className="space-y-8">
        <Section title="1) Eligibility & access scope">
          <List items={[
            "Adult residents (18+) approved by the Responsible Party; access is address-verified and permission-based.",
            "Access is personal and non-transferable. Do not share your login or show feeds to unauthorised persons.",
            "Households with multiple adults: each adult should use their own account."
          ]}/>
        </Section>

        <Section title="2) Service scope & operating window">
          <List items={[
            "Live-view only: no timeline/archive and no exports from resident accounts.",
            "Night window by default: 23:00–04:00 (customisable on request for special needs).",
            "PTZ control is disabled for residents unless explicitly authorised in writing."
          ]}/>
        </Section>

        <Section title="3) Permitted use">
          <List items={[
            "Improve awareness and deter crime in your community.",
            "Verify relevant activity during the operating window.",
            "Report promptly via CPF/HOA channels and SAPS/armed response as appropriate."
          ]}/>
        </Section>

        <Section title="4) Prohibited conduct (zero-tolerance)">
          <Callout tone="rose">
            Never record, download, screenshot or re-broadcast footage — including WhatsApp groups, Telegram, social media or any public forum (no forwarding or resharing outside authorised channels). <Share2 className="mb-0.5 inline h-4 w-4"/>
          </Callout>
          <List ordered items={[
            "No profiling, harassment, stalking or defamation.",
            "No attempts to bypass restrictions, access unauthorised cameras, or enable recording/PTZ.",
            "No aiming into private property; privacy masks must remain in place.",
            "No facial recognition or bulk vehicle/identity look-ups using third-party tools.",
            "No commercial, political or discriminatory use.",
            "If your device is lost/stolen, notify us immediately so we can revoke access."
          ]}/>
          <p className="text-sm text-slate-600">
            Breaches may lead to immediate suspension/removal and, where applicable, reporting to the Information Regulator and/or SAPS.
          </p>
        </Section>

        <Section title="5) Confidentiality & non-disclosure">
          <Callout>
            Treat all footage, alerts and related information as confidential. Do not disclose, repost, copy or derive any dataset from the service. Automated scraping/data-mining, bots, and similar extraction methods are strictly prohibited. <Bot className="mb-0.5 inline h-4 w-4"/>
          </Callout>
          <p className="text-sm text-slate-600">
            This obligation continues even after your access ends. Misuse may result in civil claims and/or prosecution.
          </p>
        </Section>

        <Section title="6) Privacy, audit & exports">
          <List items={[
            <>Use is subject to our <Link to="/privacy" className="text-emerald-700 underline">Privacy Notice (POPIA)</Link> and these Terms.</>,
            "We keep audit logs of logins, channel views and attempted exports.",
            "Residents cannot export footage. Exports (where lawful and necessary) are done only by the Information Officer or an authorised delegate on substantiated request (e.g., SAPS case number).",
            "Default retention is 7 days unless placed on legal hold."
          ]}/>
        </Section>

        <Section title="7) Availability & disclaimers">
          <List items={[
            "Best-effort service; outages may occur (power, connectivity, maintenance).",
            "No guarantee to prevent or detect every incident.",
            "To the extent permitted by law, we’re not liable for indirect or consequential loss arising from use or unavailability."
          ]}/>
        </Section>

        <Section title="8) Account security">
          <List items={[
            "Use a strong password and enable MFA where offered.",
            "Report suspected compromise immediately; we may suspend on suspicious activity.",
            "You are responsible for activity under your account."
          ]}/>
        </Section>

        <Section title="9) Enforcement & escalation">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            <AlertOctagon className="h-4 w-4" />
            Graduated response
          </div>
          <List items={[
            "Warning → temporary suspension → permanent removal (for repeated or serious breaches).",
            "Serious breaches may be reported to SAPS and/or the Information Regulator.",
            "We may pursue civil claims for losses caused by your breach."
          ]}/>
        </Section>

        <Section title="10) Changes to coverage or window">
          <p className="text-slate-700">
            Coverage or the operating window may change for privacy/safety or operational reasons; we’ll give reasonable notice for material changes.
          </p>
        </Section>

        <Section title="11) Complaints & contacts">
          <p className="text-slate-700">
            General support:{" "}
            <a className="text-emerald-700 underline" href="mailto:support@Ghosthome.co.za">support@Ghosthome.co.za</a>
          </p>
          <p className="text-slate-700">
            Information Officer:{" "}
            <a className="text-emerald-700 underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> •{" "}
            <a className="text-emerald-700 underline" href="tel:+27794950855">079 495 0855</a>
          </p>
          <p className="text-slate-700">
            Information Regulator (South Africa): 010 023 5200 • Toll-free 0800 017 160 •{" "}
            <a className="text-emerald-700 underline" href="https://inforegulator.org.za" target="_blank" rel="noreferrer">
              inforegulator.org.za
            </a>
          </p>
        </Section>

        <Section title="12) Governing law & acceptance">
          <p className="text-slate-700">
            RSA law applies. By using the service or ticking “I agree”, you accept these Terms and our Privacy Notice.
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">
        <span className="mr-2 inline-block h-5 w-1 rounded-full bg-emerald-600 align-middle" />
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function List({ items = [], ordered = false }) {
  if (ordered) {
    return <ol className="list-decimal space-y-1 pl-5 text-slate-700">{items.map((it, i) => <li key={i}>{it}</li>)}</ol>;
  }
  return <ul className="list-disc space-y-1 pl-5 text-slate-700">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
}

function Callout({ children, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-900 ring-emerald-200",
    rose: "bg-rose-50 text-rose-900 ring-rose-200",
    amber: "bg-amber-50 text-amber-900 ring-amber-200",
  };
  return <div className={`rounded-xl px-3 py-2 text-sm ring-1 ${tones[tone]}`}>{children}</div>;
}
