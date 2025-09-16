import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Resident Live-View Terms & Conditions (Community CCTV)
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-semibold">Last updated:</span> 16 September 2025
          </p>
          <p className="mt-4 text-slate-700">
            These terms govern how registered residents may use the community CCTV live-view
            service between <span className="font-semibold">21:00 and 05:00</span>. They work
            together with our{" "}
            <Link to="/privacy" className="underline">
              Privacy Notice (POPIA)
            </Link>{" "}
            and PAIA Manual.
          </p>

          <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            <Item term="Responsible Party (for the CCTV programme)" desc="Ghosthome (or the CPF/HOA if applicable)" />
            <Item term="Operator (technology & maintenance)" desc="Ghosthome (Alpha Research CC), Reg. No 2025/731979/07" />
            <Item term="Information Officer contact" desc="Ian Jansen van Rensburg • ian@ghosthome.co.za • 079 495 0855" />
          </dl>
        </header>

        <hr className="my-6 border-slate-200" />

        <Section title="1) Who may use the service">
          <ul className="list-disc pl-6 text-slate-700">
            <li>
              The service is for <span className="font-semibold">adult residents (18+)</span> who
              live within the participating area and have been approved by the Responsible Party.
            </li>
            <li>
              Access is <span className="font-semibold">personal and non-transferable</span>. Do not share your login.
              You are responsible for all activity under your account.
            </li>
            <li>
              Where household access is granted, <span className="font-semibold">each adult must have their own login</span>.
              No shared or anonymous accounts.
            </li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="2) What the service is (and is not)">
          <ul className="list-disc pl-6 text-slate-700">
            <li>
              <span className="font-semibold">Live-view only:</span> Residents may view live streams{" "}
              <span className="font-semibold">21:00–05:00</span>. There is{" "}
              <span className="font-semibold">no access to the timeline/archive</span>,{" "}
              <span className="font-semibold">no exports</span>, and{" "}
              <span className="font-semibold">no PTZ control</span> unless explicitly authorised.
            </li>
            <li>
              <span className="font-semibold">Not an emergency or monitoring service:</span> The system does not replace
              SAPS/EMS/armed response. Call your normal emergency numbers first.
            </li>
            <li>
              If monitoring/response is provided, it is delivered by{" "}
              <span className="font-semibold">[PSiRA-registered provider name & number]</span> under a separate agreement.
            </li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="3) Permitted use (plain English)">
          <p className="text-slate-700">You may use the service only to:</p>
          <ul className="mt-2 list-disc pl-6 text-slate-700">
            <li>increase community awareness and deter crime;</li>
            <li>verify activity relevant to community safety during the operating window;</li>
            <li>
              promptly <span className="font-semibold">report suspicious activity</span> via the agreed CPF/HOA channels
              (and SAPS/response services as appropriate).
            </li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="4) Prohibited conduct (zero-tolerance)">
          <ol className="list-decimal pl-6 text-slate-700 space-y-1">
            <li>
              <span className="font-semibold">Record, download, screenshot, photograph, or re-broadcast</span> any
              footage or screen images, including to WhatsApp/Telegram/social media.
            </li>
            <li>
              <span className="font-semibold">Identify, profile, harass, stalk, or defame</span> any person seen on the
              cameras (including posting stills or commentary about them).
            </li>
            <li>
              Attempt to <span className="font-semibold">circumvent restrictions</span>, access archives, PTZ, exports,
              or other cameras you are not authorised to view.
            </li>
            <li>
              Aim cameras, or request re-aiming, to view <span className="font-semibold">private property</span> (windows, yards).
            </li>
            <li>
              Use or combine footage with <span className="font-semibold">facial recognition/biometric</span> tools or
              vehicle-tracking databases.
            </li>
            <li>Interfere with, damage, or attempt unauthorised maintenance on equipment.</li>
            <li>Share your login or allow minors to use your account.</li>
            <li>Use the system for any <span className="font-semibold">commercial, political, or discriminatory</span> purpose.</li>
          </ol>
          <p className="mt-3 text-sm text-slate-700">
            Violations may result in <span className="font-semibold">immediate suspension or permanent removal</span> and may be
            reported to the Information Regulator, SAPS and (if applicable) PSiRA.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="5) Privacy and confidentiality">
          <ul className="list-disc pl-6 text-slate-700">
            <li>
              Footage may contain <span className="font-semibold">personal information</span>. Treat all access as{" "}
              <span className="font-semibold">confidential</span>.
            </li>
            <li>
              Your use is subject to our{" "}
              <Link to="/privacy" className="underline">
                Privacy Notice (POPIA)
              </Link>
              . By using the service you agree to comply with POPIA’s principles (lawfulness, minimality, security, purpose
              limitation).
            </li>
            <li>We keep <span className="font-semibold">audit logs</span> of logins, channel views and attempted exports for security and compliance.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="6) Exports, incidents and legal holds">
          <ul className="list-disc pl-6 text-slate-700">
            <li>
              <span className="font-semibold">Residents cannot export</span> footage. Exports are done{" "}
              <span className="font-semibold">only by the Information Officer (or delegate)</span> on written request with
              a lawful basis (e.g., SAPS case number, insurer request, court order).
            </li>
            <li>
              To <span className="font-semibold">flag an incident</span> for preservation, use the in-app/reporting channel immediately and,
              where applicable, provide a SAPS case number within <span className="font-semibold">48 hours</span>. If no lawful basis is
              provided, holds may be lifted and normal auto-deletion rules apply.
            </li>
            <li>
              <span className="font-semibold">Default retention</span> is <span className="font-semibold">7 days</span>, unless placed on legal hold.
              See the Privacy Notice for details.
            </li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="7) Service availability & disclaimers">
          <ul className="list-disc pl-6 text-slate-700">
            <li>
              The service is provided on a <span className="font-semibold">best-effort</span> basis and may be unavailable due
              to power, connectivity, maintenance or other issues.
            </li>
            <li>No warranty is given that the system will prevent or detect every incident.</li>
            <li>
              To the extent permitted by law, the Responsible Party and Operator are{" "}
              <span className="font-semibold">not liable</span> for indirect or consequential loss from use or unavailability of the service.
            </li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="8) Security of your account">
          <ul className="list-disc pl-6 text-slate-700">
            <li>Use a strong password and <span className="font-semibold">enable multi-factor authentication</span> where offered.</li>
            <li>Notify us immediately if you suspect compromise of your account or device.</li>
            <li>We may <span className="font-semibold">suspend access</span> if we detect suspicious activity.</li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="9) Enforcement">
          <ul className="list-disc pl-6 text-slate-700">
            <li>
              We apply a graduated response: <span className="font-semibold">warning → temporary suspension → permanent removal</span>,
              depending on severity.
            </li>
            <li>
              Serious breaches (e.g., sharing images online, harassment, tampering) may be{" "}
              <span className="font-semibold">reported to SAPS</span> and/or the{" "}
              <span className="font-semibold">Information Regulator</span>, and may lead to civil claims.
            </li>
            <li>
              You agree to <span className="font-semibold">indemnify</span> the Responsible Party and Operator against losses arising
              from your breach of these terms or unlawful use of the service.
            </li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="10) Changes to the system">
          <p className="text-slate-700">
            Camera coverage and the operating window may change (for example, to comply with privacy or safety requirements).
            We will give reasonable notice for material changes.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="11) Complaints & contacts">
          <ul className="list-disc pl-6 text-slate-700">
            <li>Information Officer: Ian Jansen van Rensburg • ian@ghosthome.co.za • 079 495 0855</li>
            <li>
              Information Regulator (South Africa): 010&nbsp;023&nbsp;5200 • Toll-free 0800&nbsp;017&nbsp;160 •{" "}
              <a className="underline" href="mailto:enquiries@inforegulator.org.za">
                enquiries@inforegulator.org.za
              </a>{" "}
              •{" "}
              <a className="underline" href="https://inforegulator.org.za">
                https://inforegulator.org.za
              </a>
            </li>
          </ul>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="12) Governing law & venue">
          <p className="text-slate-700">
            These terms are governed by the laws of the <span className="font-semibold">Republic of South Africa</span>.
            You agree to the jurisdiction of the <span className="font-semibold">Gauteng Division of the High Court</span>
            (or another competent court) for disputes that cannot be resolved through the CPF/HOA’s internal process.
          </p>
        </Section>

        <hr className="my-6 border-slate-200" />

        <Section title="13) Acceptance">
          <p className="text-slate-700">
            By creating an account or clicking <span className="font-semibold">“I agree”</span>, you confirm that you’ve read
            and accept these terms and our Privacy Notice (POPIA).
          </p>
        </Section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← Back home
          </Link>
          <Link
            to="/privacy"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Read the Privacy Notice
          </Link>
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
