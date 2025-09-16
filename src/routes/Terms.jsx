import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <article className="prose prose-slate max-w-none">
        <h1>Resident Live-View Terms &amp; Conditions (Community CCTV)</h1>
        <p><strong>Last updated:</strong> 16 September 2025</p>

        <blockquote>
          <p>
            These terms govern how registered residents may use the community CCTV live-view
            service between <strong>21:00 and 05:00</strong>. They work together with our{" "}
            <Link to="/privacy">Privacy Notice (POPIA)</Link> and PAIA Manual.
          </p>
        </blockquote>

        <p><strong>Responsible Party (for the CCTV programme):</strong> [CPF/HOA full legal name]</p>
        <p><strong>Operator (technology &amp; maintenance):</strong> Ghosthome (Alpha Research CC)</p>
        <p><strong>Information Officer contact:</strong> Ian Jansen van Rensburg • <a href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> • 0794950855</p>

        <hr />

        <h2>1) Who may use the service</h2>
        <ul>
          <li>Adult residents (18+) approved by the Responsible Party.</li>
          <li>Access is personal and non-transferable. Don’t share your login.</li>
          <li>Households with multiple adults: each adult gets their own login.</li>
        </ul>

        <h2>2) What the service is (and is not)</h2>
        <ul>
          <li><strong>Live-view only (21:00–05:00):</strong> No timeline/archive, no exports, no PTZ unless authorised.</li>
          <li><strong>Not an emergency service:</strong> Call SAPS/EMS/armed response first.</li>
          <li>If third-party monitoring is provided, it’s by a PSiRA-registered provider under a separate agreement.</li>
        </ul>

        <h2>3) Permitted use</h2>
        <ul>
          <li>Increase community awareness and deter crime.</li>
          <li>Verify relevant activity during the operating window.</li>
          <li>Report promptly via the CPF/HOA’s official channels.</li>
        </ul>

        <h2>4) Prohibited conduct (zero-tolerance)</h2>
        <ol>
          <li>No recording, downloading, screenshots, or re-broadcasting (incl. WhatsApp/social media).</li>
          <li>No profiling, harassment, stalking, or defamation.</li>
          <li>No attempts to bypass restrictions, archives, PTZ, or access unauthorised cameras.</li>
          <li>No aiming into private property; privacy masks stay on.</li>
          <li>No facial recognition/biometric tools.</li>
          <li>No tampering with equipment.</li>
          <li>No shared logins; no use by minors.</li>
          <li>No commercial, political, or discriminatory use.</li>
        </ol>

        <p><em>Violations may result in suspension or removal and may be reported to the Information Regulator/SAPS/PSiRA.</em></p>

        <h2>5) Privacy and confidentiality</h2>
        <ul>
          <li>Treat all access as confidential; footage may contain personal information.</li>
          <li>Use is subject to our <Link to="/privacy">Privacy Notice (POPIA)</Link>.</li>
          <li>We keep audit logs of access and attempted exports.</li>
        </ul>

        <h2>6) Exports, incidents and legal holds</h2>
        <ul>
          <li>Residents cannot export. Exports are handled by the Information Officer on lawful written request.</li>
          <li>Flag incidents immediately; provide a SAPS case number within 48 hours where applicable.</li>
          <li>Default retention is 7 days unless on legal hold.</li>
        </ul>

        <h2>7) Service availability &amp; disclaimers</h2>
        <ul>
          <li>Best-effort service; outages may occur (power, connectivity, maintenance).</li>
          <li>No guarantee to prevent or detect every incident.</li>
          <li>Liability for indirect/consequential loss is excluded where lawful.</li>
        </ul>

        <h2>8) Security of your account</h2>
        <ul>
          <li>Use a strong password and enable MFA where offered.</li>
          <li>Notify us if you suspect compromise.</li>
          <li>We may suspend access on suspicious activity.</li>
        </ul>

        <h2>9) Enforcement</h2>
        <ul>
          <li>Graduated response: warning → suspension → removal.</li>
          <li>Serious breaches may be reported to SAPS/Information Regulator and may lead to civil claims.</li>
          <li>You indemnify the Responsible Party and Operator against losses from your breach.</li>
        </ul>

        <h2>10) Changes to the system</h2>
        <p>Coverage or operating window may change for privacy/safety compliance; reasonable notice will be given for material changes.</p>

        <h2>11) Complaints &amp; contacts</h2>
        <p>Information Officer: <a href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a> • 0794950855</p>
        <p>Information Regulator (South Africa): 010 023 5200 • Toll-free 0800 017 160 • <a href="https://inforegulator.org.za" target="_blank" rel="noreferrer">inforegulator.org.za</a></p>

        <h2>12) Governing law &amp; acceptance</h2>
        <p>RSA law applies. By using the service or ticking “I agree”, you accept these terms and our Privacy Notice.</p>
      </article>
    </main>
  );
}
