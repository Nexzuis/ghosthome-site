import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10" id="privacy-top">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 shadow-sm sm:p-8">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            Last updated: 16 September 2025
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Privacy Notice (POPIA) & Community CCTV Programme
          </h1>
          <p className="mt-2 text-slate-700">
            This notice explains how <span className="font-semibold">Ghosthome</span> (the <span className="font-semibold">Responsible Party</span>) processes
            personal information under the Protection of Personal Information Act, 2013 (POPIA), including our
            community <span className="font-semibold">street-camera programme</span>. It also links to our PAIA Manual for access requests.
          </p>
        </header>

        <hr className="my-6 border-slate-200" />

        {/* WHO / SCOPE */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">1) Who we are & scope</h2>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <Item term="Responsible Party" desc="Ghosthome — CIPC: 2025/731979/07" />
            <Item term="Trading name" desc="Ghosthome" />
            <Item term="Registered address" desc="838 French Street, Moreletapark, Pretoria" />
            <Item term="Information Officer (IO)" desc="Ian Jansen van Rensburg (Director)" />
            <Item term="Deputy IO(s)" desc="Louisen Jansen van Rensburg" />
            <Item
              term="Contacts"
              desc={
                <>
                  IO: <a className="underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> •{" "}
                  <a className="underline" href="tel:+27794950855">079 495 0855</a> <br />
                  Support: <a className="underline" href="mailto:support@ghosthome.co.za">support@ghosthome.co.za</a> •
                  Privacy requests: <a className="underline" href="mailto:privacy@ghosthome.co.za">privacy@ghosthome.co.za</a>
                </>
              }
            />
            <Item term="Website" desc={<a className="underline" href="https://www.ghosthome.co.za">www.ghosthome.co.za</a>} />
            <Item
              term="Scope"
              desc="This notice covers (a) our website and customer/billing systems, and (b) the CCTV programme on participating private properties viewing public streets/sidewalks. Where a CPF/HOA sponsors a programme, that body may act as joint Responsible Party; Ghosthome acts as Operator under written terms."
            />
          </dl>

          
        </section>

        <hr className="my-6 border-slate-200" />

        {/* WHAT WE COLLECT */}
        <Section title="2) What we collect">
          <h3 className="mt-2 font-semibold text-slate-900">2.1 Website & customer data</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li>Contact details (name, email, phone), account credentials, billing/delivery addresses.</li>
            <li>Billing & payment metadata (invoice details; we do <span className="font-semibold">not</span> store full card numbers).</li>
            <li>Support correspondence and call notes.</li>
            <li>Device & usage data: IP address, browser/OS, pages viewed, cookie preferences, diagnostics.</li>
          </ul>

          <h3 className="mt-4 font-semibold text-slate-900">2.2 CCTV programme data</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Video images</span> of public streets/sidewalks and vehicles in view; no audio is recorded.</li>
            <li><span className="font-semibold">Event metadata</span>: timestamps, camera ID, AI event types (e.g., person/vehicle), audit logs.</li>
            <li><span className="font-semibold">Access control</span>: name, email/phone, role, access times, activity logs.</li>
          </ul>

          <h3 className="mt-4 font-semibold text-slate-900">2.3 Sensitive categories we avoid</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li>No facial recognition or biometric identification.</li>
            <li>Privacy masks applied to avoid filming into windows/private yards.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* SOURCES */}
        <Section title="3) Sources of personal information">
          <ul className="list-disc pl-6 text-slate-700">
            <li>Directly from you (accounts, subscriptions, support).</li>
            <li>Automatically via our website/app (cookies, logs).</li>
            <li>From cameras positioned on private property aimed at public streets/sidewalks.</li>
            <li>From third parties you authorise (payments, identity/anti-fraud checks).</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* PURPOSES + LAWFUL BASES */}
        <Section title="4) Why we process data & legal grounds (POPIA)">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-900">Purpose</th>
                  <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-900">Example activities</th>
                  <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-900">Lawful basis</th>
                </tr>
              </thead>
              <tbody>
                <Row t="CCTV programme" r="Community safety, incident response; resident live-view 23:00–04:00; evidence on lawful request"
                     n="Legitimate/public interest in safety; legal obligation for lawful disclosures" />
                <Row t="Account & billing" r="Manage subscriptions, invoices, payments, service notices"
                     n="Contract; legal obligation (tax/accounting)" />
                <Row t="Service operations & security" r="Platform administration, troubleshooting, preventing abuse, audit logging"
                     n="Legitimate interest; legal obligation (security, fraud prevention)" />
                <Row t="Marketing (optional)" r="Our own updates; no third-party ads"
                     n="Consent where required; opt-out anytime" />
              </tbody>
            </table>
          </div>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* SHARING */}
        <Section title="5) Sharing & disclosures">
          <p className="text-slate-700">We share personal information only when necessary and with safeguards:</p>
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Operators (processors):</span> hosting, email/SMS, payments, CCTV platforms, maintenance — under written operator agreements and confidentiality.</li>
            <li><span className="font-semibold">Law enforcement / insurers / legal advisers:</span> where required or permitted by law, or to establish/exercise/defend legal claims.</li>
            <li><span className="font-semibold">CPF/HOA partners:</span> on a need-to-know basis, per programme rules (may act as joint RP).</li>
          </ul>
          <p className="mt-3 text-xs text-slate-600">
            Residents cannot export or publicly share footage. Exports are restricted to the IO/authorised staff on written request with a lawful basis (e.g., SAPS case number).
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* CROSS BORDER */}
        <Section title="6) Cross-border transfers (POPIA s72)">
          <p className="text-slate-700">
            If a provider stores or processes data outside South Africa, we ensure an appropriate ground under POPIA s72 (adequate protection, binding agreements,
            or your consent). Where feasible, CCTV footage is stored locally and accessed securely.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* RETENTION */}
        <Section title="7) Retention (how long we keep data)">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-900">Record type</th>
                  <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-900">Default retention</th>
                  <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-900">Notes</th>
                </tr>
              </thead>
              <tbody>
                <Row t="CCTV footage" r="7 days" n="Extended only under legal hold (e.g., SAPS case #) or ongoing investigation. Auto-purge enforced." />
                <Row t="CCTV audit logs (user access/actions)" r="12 months" n="Security/audit." />
                <Row t="Resident live-view accounts" r="Life of account + 12 months" n="Audit & dispute resolution." />
                <Row t="Billing & invoices" r="5 years" n="Tax Administration Act." />
                <Row t="Support tickets" r="3 years" n="Service history." />
                <Row t="Website server logs" r="30 days" n="Security & troubleshooting." />
                <Row t="Cookie preferences" r="12 months" n="Remember your choices." />
                <Row t="Marketing opt-out list" r="As long as needed" n="Minimal data to honour opt-out." />
                <Row t="Legal holds" r="Until matter closes" n="Overrides defaults." />
              </tbody>
            </table>
          </div>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* SECURITY */}
        <Section title="8) Security">
          <p className="text-slate-700">
            We implement reasonable and appropriate measures: role-based access; unique accounts; MFA for admins; encryption in transit;
            hardened servers; patching; privacy masks; no audio recording; strict export controls; and operator contracts with security obligations.
            We maintain a breach-response plan and will notify the Information Regulator and affected persons where required.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* RIGHTS */}
        <Section title="9) Your rights (POPIA)">
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Access</span> your personal information we hold (see PAIA Manual).</li>
            <li><span className="font-semibold">Request correction/deletion</span> of inaccurate, irrelevant, excessive or unlawfully obtained information, or deletion of records we are no longer authorised to retain.</li>
            <li><span className="font-semibold">Object</span> to certain processing (including direct marketing) and <span className="font-semibold">opt-out</span> at any time.</li>
            <li><span className="font-semibold">Complain</span> to the Information Regulator (details below).</li>
          </ul>

          <h3 className="mt-3 font-semibold text-slate-900">How to make a request</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li>Access requests: follow the process in our PAIA Manual.</li>
            <li>Correction/Deletion requests: email <a className="underline" href="mailto:privacy@ghosthome.co.za">privacy@ghosthome.co.za</a> (we accept Form 2 or clear written requests).</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* COOKIES */}
        <Section title="10) Cookies & similar technologies">
          <ul className="list-disc pl-6 text-slate-700">
            <li>We use essential cookies (sign-in, security, fraud prevention) and optional analytics/marketing cookies (with your consent where required). Manage preferences via our banner or your browser.</li>
            <li>We don’t sell personal information and don’t track you across unaffiliated websites for third-party targeted advertising.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* CCTV TRANSPARENCY */}
        <Section title="11) The CCTV programme (extra transparency)">
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Operating window:</span> resident live-view <span className="font-semibold">23:00–04:00</span> by default (adjustable on request).</li>
            <li><span className="font-semibold">Access controls:</span> live-view only (no timeline, no export, no PTZ) for residents. All activity is logged. Misuse leads to removal and may be reported to the Regulator/PSiRA (if applicable).</li>
            <li><span className="font-semibold">Placement & masking:</span> cameras on private property view public streets/sidewalks; permanent privacy masks prevent filming into private areas.</li>
            <li><span className="font-semibold">No audio & no facial recognition.</span> AI may classify events (person/vehicle) without biometric identification.</li>
            <li><span className="font-semibold">Signage:</span> entry-point signs state purpose, Responsible Party/Operator, retention, and IO contact. Sample sign text is available on request.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* FOOTAGE REQUESTS */}
        <Section title="12) Requests for CCTV footage">
          <p className="text-slate-700">
            Residents do not receive direct exports. Where legally justified, exports are performed by the Information Officer (or authorised delegate) on written request with sufficient particulars
            (e.g., date/time, location, incident description, SAPS case number). We may refuse or redact where disclosure would violate rights of others or legal restrictions.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* CHILDREN & VULNERABLE */}
        <Section title="13) Children & vulnerable persons">
          <p className="text-slate-700">
            Our services are intended for adults. Resident access is limited to persons 18+. We do not knowingly allow minors to use the live-view service. Camera placement and masking aim to minimise intrusion.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* DPIA */}
        <Section title="14) Impact assessments & governance">
          <p className="text-slate-700">
            We conduct proportionate risk/impact assessments (DPIA-style) for CCTV deployments, covering necessity, proportionality, risks, and mitigations
            (e.g., masking, retention, access limits, signage). A summary may be provided to partners on request.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* COMPLAINTS */}
        <Section title="15) Complaints & regulatory contacts">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <p className="font-semibold text-slate-900">Information Officer</p>
            <p className="text-slate-700">
              Ian Jansen van Rensburg • <a className="underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> •{" "}
              <a className="underline" href="tel:+27794950855">079 495 0855</a>
            </p>
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-900">Information Regulator (South Africa)</p>
            <p className="text-slate-700">
              Website: <a className="underline" href="https://inforegulator.org.za">inforegulator.org.za</a> • Tel: 010 023 5200 • Toll-free: 0800 017 160 • Email:{" "}
              <a className="underline" href="mailto:enquiries@inforegulator.org.za">enquiries@inforegulator.org.za</a><br />
              Address: Woodmead North Office Park, 54 Maxwell Dr, Woodmead, Johannesburg, 2191
            </p>
          </div>
        </Section>

        <hr className="my-6 border-slate-200" />

        {/* CHANGES */}
        <Section title="16) Changes to this notice">
          <p className="text-slate-700">
            We may update this notice from time to time. We’ll change the “Last updated” date above and,
            if material changes are made, notify you via the website or email.
          </p>
        </Section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Back home
          </Link>
          <a
            href="mailto:ian@ghosthome.co.za"
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Contact the Information Officer
          </a>
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

function Item({ term, desc }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{term}</div>
      <div className="text-sm text-slate-900">{desc}</div>
    </div>
  );
}

function Row({ t, r, n }) {
  return (
    <tr className="odd:bg-white even:bg-slate-50 align-top">
      <td className="border border-slate-200 px-3 py-2">{t}</td>
      <td className="border border-slate-200 px-3 py-2">{r}</td>
      <td className="border border-slate-200 px-3 py-2">{n}</td>
    </tr>
  );
}
