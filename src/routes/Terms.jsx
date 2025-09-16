import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, Phone, Mail, Clock8 } from "lucide-react";

export default function Terms() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <Clock8 className="h-4 w-4" />
          Last updated: 16 September 2025
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Resident Live-View Terms & Conditions
          </span>
        </h1>
        <p className="mt-2 text-slate-600">
          These terms govern how registered residents may use the community CCTV
          live-view service between <strong>21:00 and 05:00</strong>. They work together with our{" "}
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
          <ul className="mt-2 text-sm text-slate-700 leading-6">
            <li><strong>Responsible Party:</strong> [CPF/HOA full legal name]</li>
            <li><strong>Operator:</strong> Ghosthome (Alpha Research CC)</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <FileText className="h-4 w-4 text-emerald-600" />
            Information Officer
          </div>
          <ul className="mt-2 text-sm text-slate-700 leading-6">
            <li>Ian Jansen van Rensburg</li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <a className="underline decoration-slate-300 hover:text-emerald-700" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-500" />
              <a className="underline decoration-slate-300 hover:text-emerald-700" href="tel:+27794950855">079 495 0855</a>
            </li>
          </ul>
        </div>
      </section>

      {/* Body */}
      <article className="space-y-8">
        <Section title="1) Who may use the service">
          <List items={[
            "Adult residents (18+) approved by the Responsible Party.",
            "Access is personal and non-transferable. Don’t share your login.",
            "Households with multiple adults: each adult has their own login.",
          ]}/>
        </Section>

        <Section title="2) What the service is (and is not)">
          <List items={[
            "Live-view only (21:00–05:00): no timeline/archive, no exports, no PTZ unless authorised.",
            "Not an emergency/monitoring service. Call SAPS/EMS/armed response first.",
            "If third-party monitoring is used later, it will be by a PSiRA-registered provider under a separate agreement.",
          ]}/>
        </Section>

        <Section title="3) Permitted use (plain English)">
          <List items={[
            "Increase community awareness and deter crime.",
            "Verify relevant activity during the operating window.",
            "Report promptly via CPF/HOA channels (and SAPS/response as needed).",
          ]}/>
        </Section>

        <Section title="4) Prohibited conduct (zero-tolerance)">
          <Callout tone="rose">
            Never record, download, screenshot or re-broadcast footage (including WhatsApp/Telegram/social media).
          </Callout>
          <List ordered items={[
            "No profiling, harassment, stalking, or defamation.",
            "No attempts to bypass restrictions, archives, PTZ, or unauthorised cameras.",
            "No aiming into private property; privacy masks stay on.",
            "No facial recognition/biometric tools, or vehicle-tracking databases.",
            "No tampering with equipment. No shared logins; no use by minors.",
            "No commercial, political, or discriminatory use.",
          ]}/>
          <p className="text-sm text-slate-600">
            Violations may result in immediate suspension or removal and may be reported to the Information Regulator/SAPS/PSiRA.
          </p>
        </Section>

        <Section title="5) Privacy & confidentiality">
          <List items={[
            "Footage may contain personal information. Treat access as confidential.",
            <>Use is subject to our <Link to="/privacy" className="text-emerald-700 underline">Privacy Notice (POPIA)</Link>.</>,
            "We keep audit logs of logins, channel views and attempted exports.",
          ]}/>
        </Section>

        <Section title="6) Exports, incidents & legal holds">
          <List items={[
            "Residents cannot export footage. Exports are done only by the Information Officer on lawful request.",
            "Flag incidents immediately. Provide SAPS case number within 48 hours where applicable.",
            "Default retention is 7 days unless placed on legal hold.",
          ]}/>
        </Section>

        <Section title="7) Service availability & disclaimers">
          <List items={[
            "Best-effort service; outages may occur (power, connectivity, maintenance).",
            "No guarantee to prevent or detect every incident.",
            "To the extent permitted by law, no liability for indirect/consequential loss from use or unavailability.",
          ]}/>
        </Section>

        <Section title="8) Security of your account">
          <List items={[
            "Use a strong password and enable MFA where offered.",
            "Notify us immediately if you suspect compromise.",
            "We may suspend access on suspicious activity.",
          ]}/>
        </Section>

        <Section title="9) Enforcement">
          <List items={[
            "Graduated response: warning → temporary suspension → permanent removal.",
            "Serious breaches may be reported to SAPS/Information Regulator and may lead to civil claims.",
            "You indemnify the Responsible Party and Operator against losses from your breach.",
          ]}/>
        </Section>

        <Section title="10) Changes to the system">
          <p className="text-slate-700">
            Coverage or operating window may change for privacy/safety compliance; reasonable notice will be given for material changes.
          </p>
        </Section>

        <Section title="11) Complaints & contacts">
          <p className="text-slate-700">
            Information Officer: <a className="text-emerald-700 underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> •{" "}
            <a className="text-emerald-700 underline" href="tel:+27794950855">079 495 0855</a>
          </p>
          <p className="text-slate-700">
            Information Regulator (South Africa): 010 023 5200 • Toll-free 0800 017 160 •{" "}
            <a className="text-emerald-700 underline" href="https://inforegulator.org.za" target="_blank" rel="noreferrer">inforegulator.org.za</a>
          </p>
        </Section>

        <Section title="12) Governing law & acceptance">
          <p className="text-slate-700">
            RSA law applies. By using the service or ticking “I agree”, you accept these terms and our Privacy Notice.
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
    return (
      <ol className="list-decimal space-y-1 pl-5 text-slate-700">{items.map((it, i) => <li key={i}>{it}</li>)}</ol>
    );
  }
  return (
    <ul className="list-disc space-y-1 pl-5 text-slate-700">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
  );
}

function Callout({ children, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-900 ring-emerald-200",
    rose: "bg-rose-50 text-rose-900 ring-rose-200",
    amber: "bg-amber-50 text-amber-900 ring-amber-200",
  };
  return (
    <div className={`rounded-xl px-3 py-2 text-sm ring-1 ${tones[tone]}`}>{children}</div>
  );
}
