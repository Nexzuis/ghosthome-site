import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10" id="privacy-top">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Privacy Notice (POPIA) & CCTV Programme
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-semibold">Last updated:</span> 16 September 2025
          </p>
          <p className="mt-4 text-slate-700">
            This notice explains how <span className="font-semibold">Ghosthome</span>{" "}
            (the <span className="font-semibold">Responsible Party</span>) processes personal
            information under South Africa’s Protection of Personal Information Act, 2013 (POPIA),
            including our community <span className="font-semibold">street-camera programme</span>.
            It also links to our PAIA Manual for requesting access to records.
          </p>
        </header>

        <hr className="my-6 border-slate-200" />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">1) Who we are & scope</h2>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <Item term="Responsible Party" desc="Ghosthome — CIPC: 2025/731979/07" />
            <Item term="Trading name" desc="Ghosthome" />
            <Item term="Registered address" desc="838 French Street, Moreletapark, Pretoria" />
            <Item term="Information Officer (IO)" desc="Ian Jansen van Rensburg (Director)" />
            <Item term="Deputy IO(s)" desc="Louisen Jansen van Rensburg" />
            <Item
              term="IO contact"
              desc={
                <>
                  <a className="underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a>{" "}
                  • <a className="underline" href="tel:+27794950855">079 495 0855</a>
                </>
              }
            />
            <Item term="Website" desc={<a className="underline" href="https://www.ghosthome.co.za">www.ghosthome.co.za</a>} />
            <Item
              term="Scope"
              desc="This notice covers (a) our website and customer/billing systems, and (b) the CCTV programme on participating properties and public streets/sidewalks. If a CCTV programme runs under a CPF/HOA, that body is the Responsible Party and Ghosthome acts as Operator."
            />
          </dl>

          <div className="mt-3 text-sm text-slate-700">
            <p className="font-semibold">Related documents:</p>
            <ul className="list-disc pl-6">
              <li>
                PAIA Manual:{" "}
                <a className="underline" href="/docs/paia-manual.pdf">Download (PDF)</a>
              </li>
              <li>
                Resident Live-View Terms (21:00–05:00):{" "}
                <a className="underline" href="/docs/live-view-terms.pdf">Download</a>
              </li>
              <li>
                Operator Agreement Summary (optional):{" "}
                <a className="underline" href="/docs/operator-agreement-summary.pdf">Download</a>
              </li>
            </ul>
          </div>
        </section>

        <hr className="my-6 border-slate-200" />

        <Section title="2) What we collect">
          <h3 className="mt-2 font-semibold text-slate-900">2.1 Website & customer data</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li>Contact details (name, email, phone), account credentials, billing/delivery addresses.</li>
            <li>Billing & payment metadata (invoice details, payment method reference; <span className="font-semibold">we do not store full card numbers</span>).</li>
            <li>Support correspondence and call notes.</li>
            <li>Device & usage data: IP address, browser/OS, pages viewed, cookies, diagnostics.</li>
          </ul>

          <h3 className="mt-4 font-semibold text-slate-900">2.2 CCTV programme data</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Video images</span> of streets/sidewalks and vehicles in view; no audio is recorded.</li>
            <li><span className="font-semibold">Metadata</span>: timestamps, camera ID, event type (e.g., motion/person detection), audit logs.</li>
            <li><span className="font-semibold">Access control</span> for residents/staff: name, email/phone, role, access times.</li>
          </ul>

          <h3 className="mt-4 font-semibold text-slate-900">2.3 Sensitive categories we avoid</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li>No facial recognition or biometric identification.</li>
            <li>Privacy masks applied to avoid filming into windows/private yards.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="3) Sources of personal information">
          <ul className="list-disc pl-6 text-slate-700">
            <li>Directly from you (website account, subscriptions, support).</li>
            <li>Automatically via our website/apps (cookies, logs).</li>
            <li>From cameras on participating private properties aimed at public streets/sidewalks.</li>
            <li>From third parties you authorise (payment providers, identity/anti-fraud checks).</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="4) Why we process personal information (purposes)">
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">CCTV programme:</span> community safety, crime prevention/detection, incident response; providing live viewing to registered residents <span className="font-semibold">21:00–05:00</span>; investigating incidents; supplying clips to SAPS/insurers on lawful request.</li>
            <li><span className="font-semibold">Account & billing:</span> manage accounts, subscriptions, invoices, payments, and service notices.</li>
            <li><span className="font-semibold">Service operations & security:</span> platform administration, troubleshooting, preventing abuse, audit logging.</li>
            <li><span className="font-semibold">Legal duties:</span> records required by law; responding to lawful requests.</li>
            <li><span className="font-semibold">Marketing (optional):</span> our own updates where lawful, with opt-out.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="5) Lawful bases we rely on (POPIA)">
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Legitimate/public interest in safety</span> (CCTV, platform security, proportionate analytics).</li>
            <li><span className="font-semibold">Contract</span> (to provide your subscription and support).</li>
            <li><span className="font-semibold">Legal obligation</span> (tax, accounting, lawful requests).</li>
            <li><span className="font-semibold">Consent</span> where POPIA requires it (e.g., certain electronic direct marketing; optional cookies).</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="6) Sharing & disclosures">
          <p className="text-slate-700">We share personal information only when necessary:</p>
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Service providers (Operators):</span> hosting, email/SMS, payments, CCTV platforms, maintenance—under written operator agreements and confidentiality.</li>
            <li><span className="font-semibold">Law enforcement / insurers / legal advisers:</span> where required or permitted by law, or to establish/exercise/defend legal claims.</li>
            <li><span className="font-semibold">Community structures (CPF/HOA):</span> only as defined in programme rules and on a need-to-know basis.</li>
          </ul>
          <p className="mt-3 text-xs text-slate-600">
            We do <span className="font-semibold">not</span> allow residents to export or publicly share footage.
            Exports are restricted to the IO/authorised staff on written request with a lawful basis.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="7) Cross-border transfers">
          <p className="text-slate-700">
            If a provider stores or processes data outside South Africa, we ensure a lawful ground
            (adequate safeguards, contractual protections, or consent). Where feasible, CCTV footage is
            stored on a local server and accessed securely.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="8) Retention periods (how long we keep data)">
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
                <Row t="Resident live-view accounts" r="Life of account + 12 months" n="Audit and dispute resolution." />
                <Row t="Billing & invoices" r="5 years" n="From submission date (Tax Administration Act)." />
                <Row t="Support tickets" r="3 years" n="Service history." />
                <Row t="Website server logs" r="30 days" n="Security and troubleshooting." />
                <Row t="Cookie preferences" r="12 months" n="So we remember your choices." />
                <Row t="Marketing opt-out list" r="As long as needed" n="Minimal data only; to honour the opt-out." />
                <Row t="Legal holds" r="Until matter closes" n="Overrides any default periods." />
              </tbody>
            </table>
          </div>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="9) Security">
          <p className="text-slate-700">
            We implement reasonable, appropriate technical and organisational measures, including:
            role-based access; unique accounts; multi-factor authentication for admins; encryption in
            transit; hardened servers; regular patching; privacy masks on cameras; no audio recording;
            strict export controls; and operator contracts with security obligations. We maintain a breach-response plan.
          </p>
          <h3 className="mt-3 font-semibold text-slate-900">If there’s a security compromise</h3>
          <p className="text-slate-700">
            We will notify the Information Regulator and affected individuals as soon as reasonably possible,
            in line with our breach procedure.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="10) Your rights">
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Access</span> your personal information we hold.</li>
            <li><span className="font-semibold">Request correction or deletion</span> of inaccurate, irrelevant, excessive or unlawfully obtained information, or deletion of records we are no longer authorised to retain.</li>
            <li><span className="font-semibold">Object</span> to certain processing (including direct marketing) and <span className="font-semibold">opt-out</span> at any time.</li>
            <li><span className="font-semibold">Complain</span> to the Information Regulator (see details below).</li>
          </ul>

          <h3 className="mt-3 font-semibold text-slate-900">How to make a request</h3>
          <ul className="list-disc pl-6 text-slate-700">
            <li>Access requests: use the process in our PAIA Manual.</li>
            <li>Correction/Deletion (Form 2): email <a className="underline" href="mailto:privacy@ghosthome.co.za">privacy@ghosthome.co.za</a> (we also accept clear written requests without the form).</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="11) Cookies & similar technologies">
          <ul className="list-disc pl-6 text-slate-700">
            <li>We use essential cookies (for sign-in, security, fraud prevention) and optional analytics/marketing cookies (with your consent where required). You can manage cookie settings via our banner or your browser.</li>
            <li>We don’t sell personal information and we don’t track you across unaffiliated websites for targeted advertising.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="12) The CCTV programme (extra transparency)">
          <ul className="list-disc pl-6 text-slate-700">
            <li><span className="font-semibold">Operating window:</span> Live viewing for registered residents <span className="font-semibold">21:00–05:00</span> only.</li>
            <li><span className="font-semibold">Access controls:</span> Residents get <span className="font-semibold">live-view only</span> (no timeline, no export, no PTZ). All activity is logged. Misuse leads to removal and may be reported to the Regulator or PSiRA (if applicable).</li>
            <li><span className="font-semibold">Placement & masking:</span> Cameras are positioned on private property to view public streets/sidewalks. We apply permanent privacy masks to avoid filming into windows or private yards.</li>
            <li><span className="font-semibold">No audio & no facial recognition.</span> Person/vehicle detection may be used, but we do not identify individuals by biometric characteristics.</li>
            <li><span className="font-semibold">Signage:</span> Clear signs at entry points and camera zones state the purpose, the Responsible Party/Operator, retention period, and IO contact details.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="13) Complaints & regulatory contacts">
          <p className="text-slate-700">
            <span className="font-semibold">Information Officer (IO):</span> Ian Jansen van Rensburg •{" "}
            <a className="underline" href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> •{" "}
            <a className="underline" href="tel:+27794950855">079 495 0855</a>
          </p>
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">Information Regulator (South Africa)</p>
            <p className="text-slate-700">
              Website: <a className="underline" href="https://inforegulator.org.za">inforegulator.org.za</a> • Tel: 010 023 5200 • Toll-free: 0800 017 160 • Email:{" "}
              <a className="underline" href="mailto:enquiries@inforegulator.org.za">enquiries@inforegulator.org.za</a><br />
              Address: Woodmead North Office Park, 54 Maxwell Dr, Woodmead, Johannesburg, 2191
            </p>
          </div>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="14) Changes to this notice">
          <p className="text-slate-700">
            We may update this notice from time to time. We’ll change the “Last updated” date above and,
            if material changes are made, we’ll notify you via the website or email.
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
    <tr className="odd:bg-white even:bg-slate-50">
      <td className="border border-slate-200 px-3 py-2">{t}</td>
      <td className="border border-slate-200 px-3 py-2 font-semibold">{r}</td>
      <td className="border border-slate-200 px-3 py-2">{n}</td>
    </tr>
  );
}
