// src/routes/Partners.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Handshake,
  Layers,
  BadgeCheck,
  Link2,
  Gauge,
  Target,
  Users,
  Map,
  Binary,
  Siren,
  FileText,
  LineChart,
  Clock4,
  Fuel,
  CheckCircle2,
} from "lucide-react";

export default function Partners() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/70 to-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
          <Shield className="h-4 w-4" />
          For Security Partners
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Deeper Security Integration — <span className="text-sky-700">detect earlier, respond smarter</span>
        </h1>

        <p className="mt-3 max-w-3xl text-slate-700">
          We federate community street cameras into a single control-room view and layer advanced video analytics
          (people/vehicle detection, line-crossing, loiter/dwell, crowd density, appearance cues, and fast forensic search).
          Partners can request zones, schedules, and alert routes that match their SOPs — so teams stop chasing ghosts and
          focus on verifiable events that reduce crime and call-outs.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {/* CHANGED: link to /contact */}
          <Link
            to="/contact"
            className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-white shadow hover:bg-sky-800"
          >
            Request a partner demo
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50"
          >
            <Link2 className="h-4 w-4" />
            Talk to our team
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-600">
          Access is scoped, logged, and POPIA-aware. Export controls and audit trails apply. Co-branded signage available.
        </p>
      </section>

      {/* VALUE PILLARS */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Pillar
          icon={<Layers className="h-5 w-5" />}
          title="Unified camera feeds"
          text="Aggregate multiple estates/streets into one control-room console with health, bookmarks, and incident tags."
        />
        <Pillar
          icon={<Target className="h-5 w-5" />}
          title="Event-driven dispatch"
          text="Line-crossing, person/vehicle filters, loiter/dwell & time-in-area cut the noise and trigger real responses."
        />
        <Pillar
          icon={<Binary className="h-5 w-5" />}
          title="Advanced analytics"
          text="Crowd counting, appearance cues (colour/object), direction filters, and rapid retrospective search."
        />
        <Pillar
          icon={<BadgeCheck className="h-5 w-5" />}
          title="SLA & audit ready"
          text="Every alert and operator touch is logged. Export incident packs for clients, SAPS, and insurers."
        />
      </section>

      {/* WHY THIS MATTERS FOR OPERATIONS */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Operational wins your clients will feel</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Win
            icon={<Clock4 className="h-5 w-5 text-sky-700" />}
            title="Faster time-to-verify"
            text="Snapshot + short clip on verified person/vehicle — operators decide with context in seconds."
          />
          <Win
            icon={<Siren className="h-5 w-5 text-sky-700" />}
            title="Deterrence on arrival"
            text="Spotlights, sirens & loud-hailer on supported cameras reduce loitering and escalate selectively."
          />
          <Win
            icon={<Fuel className="h-5 w-5 text-sky-700" />}
            title="Lower fuel & patrol wastage"
            text="Shift from blind patrol loops to event-led dispatch. Fewer false trips; more presence where it counts."
          />
          <Win
            icon={<Map className="h-5 w-5 text-sky-700" />}
            title="Route-aware coverage"
            text="We aim to blanket the majority of street corners. New hotspots? We adapt pole by pole."
          />
          <Win
            icon={<Users className="h-5 w-5 text-sky-700" />}
            title="Happier residents"
            text="Less noise in their apps. Night-window alerts that matter. Quick sharing to CPF/HOA channels."
          />
          <Win
            icon={<LineChart className="h-5 w-5 text-sky-700" />}
            title="SLA & upsell proof"
            text="Monthly incident summaries, heatmaps, and response stats to retain and grow accounts."
          />
        </div>
      </section>

      {/* ANALYTICS WITHOUT BRAND NAMES */}
      <section className="mt-10 rounded-3xl border border-sky-100 bg-sky-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">Analytics you can point at any street camera</h2>
        <p className="mt-1 max-w-3xl text-slate-700">
          Our pipeline supports both real-time alerts and forensic search across participating feeds. Configure per-camera or per-zone policies to match SOPs.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Person / vehicle detection (with direction filters)",
            "Line-crossing & intrusion zones at gates/driveways",
            "Loiter / dwell / time-in-area thresholds",
            "Crowd density & sudden crowding spikes",
            "Object/colour cues (e.g., red hoodie, white bakkie, blue backpack)*",
            "Left/removed object alerts (where feasible)",
            "Entry/exit routes & path tracing (multi-camera bookmarks)",
            "Rapid retrospective search over recent windows",
            "Schedule-aware arming (night focus by default)",
          ].map((t) => (
            <Bullet key={t} text={t} />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          *Appearance cues are for operator assistance only — not biometric identification.
        </p>
      </section>

      {/* PARTNERSHIP MODELS */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">How we partner in your areas</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Model
            title="Preferred Partner"
            points={[
              "Scoped access for your control room/operators",
              "Co-branding on signage & resident comms",
              "Priority in new pole placements",
            ]}
          />
          <Model
            title="Sole-Area Partner"
            points={[
              "Exclusive or first-right status in defined boundaries",
              "Joint go-to-market with co-branded collateral",
              "Visibility in our signup flows for that area",
            ]}
          />
          <Model
            title="Integrator"
            points={[
              "We federate your existing feeds into one pane",
              "Apply analytics across mixed vendors",
              "Shared SLA dashboards & audit exports",
            ]}
          />
        </div>
      </section>

      {/* ONBOARDING — CLEAR STEPS */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Onboarding in 4 steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
          <li><strong>Area scoping:</strong> define boundaries, hot routes, cameras, and SOPs.</li>
          <li><strong>Access & roles:</strong> create operator logins, set night/day schedules, confirm export controls.</li>
          <li><strong>Analytics plan:</strong> select detections per camera (line-crossing, dwell, appearance cues, etc.).</li>
          <li><strong>Live & iterate:</strong> weekly tuning; monthly SLA report and heatmap review.</li>
        </ol>

        <div className="mt-5 flex flex-wrap gap-3">
          {/* CHANGED: link to /contact */}
          <Link
            to="/contact"
            className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-white shadow hover:bg-sky-800"
          >
            Start partner onboarding
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50"
          >
            Ask a question
          </Link>
        </div>
      </section>

      {/* COMPLIANCE & TRUST */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Privacy, POPIA & export control</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Resident live-view is limited to night windows; all access is logged.</li>
          <li>Exports are restricted to authorised officers on lawful request; audit trail retained.</li>
          <li>Privacy masks are applied to avoid filming into private property; no audio recording.</li>
          <li>No facial recognition or biometric identification.</li>
        </ul>
        <p className="mt-3 text-xs text-slate-600">
          We align with community policies and provide signage templates. Operator agreements available on request.
        </p>
      </section>

      {/* CTA STRIP */}
      <section className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-5">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Ready to protect more streets with fewer false call-outs?</h3>
            <p className="text-sm text-slate-700">Request a demo and we’ll map your area, analytics, and SOPs together.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* CHANGED: link to /contact */}
            <Link
              to="/contact"
              className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-white shadow hover:bg-sky-800"
            >
              Book a partner demo
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── small components ── */
function Pillar({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
        {icon}
        {title}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}
function Win({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}
function Bullet({ text }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-white p-3 ring-1 ring-slate-200">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-700" />
      <span className="text-sm text-slate-700">{text}</span>
    </div>
  );
}
function Model({ title, points = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
