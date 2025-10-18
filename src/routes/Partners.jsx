import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Layers,
  BadgeCheck,
  Link2,
  Target,
  Users,
  Map,
  Binary,
  Siren,
  LineChart,
  Clock4,
  Fuel,
} from "lucide-react";

/** Public-asset resolver that respects base URL (Vite/CRA/SPA subfolder) */
const asset = (p) => {
  // Vite base
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) {
    const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
    return `${base}/${p.replace(/^\/+/, "")}`;
  }
  // CRA public URL
  if (typeof process !== "undefined" && process.env && process.env.PUBLIC_URL) {
    const base = process.env.PUBLIC_URL.replace(/\/+$/, "");
    return `${base}/${p.replace(/^\/+/, "")}`;
  }
  // fallback
  return `/${p.replace(/^\/+/, "")}`;
};

/** graceful <img> with onError placeholder */
const Img = ({ src, alt, className }) => {
  const [broken, setBroken] = React.useState(false);
  if (broken) {
    return (
      <div
        className={["flex h-48 w-full items-center justify-center bg-slate-100 text-[11px] text-slate-500", className]
          .filter(Boolean)
          .join(" ")}
        aria-label={`${alt} (placeholder)`}
      >
        image not found
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
};

export default function Partners() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
          <Shield className="h-4 w-4" />
          For Security Partners
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Deeper Security Integration — <span className="text-sky-700">detect earlier, respond smarter</span>
        </h1>

        <p className="mt-3 max-w-3xl text-slate-700">
          We federate community street cameras into a single control-room view and layer advanced analytics:
          people &amp; vehicle detection, <span className="font-semibold">virtual lines &amp; zones</span> for entries/lanes,
          <span className="font-semibold"> loitering / tailgating</span>, <span className="font-semibold">large-crowd estimation</span> and
          <span className="font-semibold"> occupancy counts</span>, appearance search (vehicle/clothing colour), object left/removed and LPR.
          Night focus is <span className="font-semibold">23:00–04:00</span>, so operators see signal—not noise.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-white shadow hover:bg-sky-800">
            Request a partner demo
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50">
            <Link2 className="h-4 w-4" />
            Talk to our team
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-600">
          Access is scoped, logged, and POPIA-aware. Export controls and audit trails apply. Co-branded signage available.
        </p>
      </section>

      {/* QUICK VISUALS ROW (static images, no video) */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <ImageTile
          src={asset("images/partners/nxw-console.jpg")}
          caption="Unified console — live, search, exports"
        />
        <ImageTile
          src={asset("images/partners/people-detection.jpg")}
          caption="People detection with live cues"
        />
        <ImageTile
          src={asset("images/partners/vehicle-detection.jpg")}
          caption="Vehicle detection & colour filters"
        />
      </section>

      {/* VALUE PILLARS */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Pillar
          icon={<Layers className="h-5 w-5" />}
          title="Unified camera feeds"
          text="Aggregate multiple streets/estates into one control-room pane with health, bookmarks and incident tags."
        />
        <Pillar
          icon={<Target className="h-5 w-5" />}
          title="Event-driven dispatch"
          text="Virtual lines & zones, loiter/tailgate and time-in-area cut the noise and trigger real response."
        />
        <Pillar
          icon={<Binary className="h-5 w-5" />}
          title="Advanced analytics"
          text="Large-crowd estimation, occupancy counts, appearance search and object left/removed."
        />
        <Pillar
          icon={<BadgeCheck className="h-5 w-5" />}
          title="SLA & audit ready"
          text="Every alert and operator touch is logged. Export incident bundles for clients, SAPS and insurers."
        />
      </section>

      {/* OPERATIONAL WINS */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Operational wins your clients will feel</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Win
            icon={<Clock4 className="h-5 w-5 text-sky-700" />}
            title="Faster time-to-verify"
            text="High-signal person/vehicle events in the night window let operators decide with context in seconds."
          />
          <Win
            icon={<Siren className="h-5 w-5 text-sky-700" />}
            title="Deterrence on arrival"
            text="On-camera spotlights, sirens and loud-hailer (where available) reduce loitering and escalate selectively."
          />
          <Win
            icon={<Fuel className="h-5 w-5 text-sky-700" />}
            title="Lower fuel & patrol wastage"
            text="Move from blind loops to event-led dispatch. Fewer false trips; more presence where it counts."
          />
          <Win
            icon={<Map className="h-5 w-5 text-sky-700" />}
            title="Route-aware coverage"
            text="We blanket key corners and entrances; new hotspots are added pole by pole."
          />
          <Win
            icon={<Users className="h-5 w-5 text-sky-700" />}
            title="Happier residents"
            text="Night-window alerts that matter; quick sharing to CPF/HOA ops without drowning people in noise."
          />
          <Win
            icon={<LineChart className="h-5 w-5 text-sky-700" />}
            title="SLA & upsell proof"
            text="Monthly incident summaries, heatmaps and response stats to retain and grow accounts."
          />
        </div>
      </section>

      {/* ANALYTICS CATALOG */}
      <section className="mt-10 rounded-3xl border border-sky-100 bg-sky-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">Analytics you can point at any street camera</h2>
        <p className="mt-1 max-w-3xl text-slate-700">
          Run real-time alerts and forensic search across participating feeds. Configure per camera or per zone to match SOPs.
          Models can run on-camera, on NVRs or at the edge.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CatalogGroup
            title="People"
            img={asset("images/partners/line-crossing.jpg")}
            items={[
              "People detection (visible & thermal)",
              "Dwell / loiter monitoring",
              "Tailgating at gates",
              "Fall / accident indicator",
              "Person in water detection",
              "Face anonymizer (privacy-first)",
            ]}
          />
          <CatalogGroup
            title="Vehicles"
            img={asset("images/partners/lpr.jpg")}
            items={[
              "Vehicle detection (multi-angle)",
              "Make/model classification",
              "Thermal vehicle detection",
              "Direction & lane-violation checks via virtual lines",
              "Vehicle colour filtering for search",
            ]}
          />
          <CatalogGroup
            title="Perimeter & sites"
            img={asset("images/partners/crowd-occupancy.jpg")}
            items={[
              "Virtual lines & zones (entries, lanes, fence lines)",
              "Left / removed object watch",
              "Area entry / exit rules & exceptions",
              "Occupancy counts & large-crowd estimation",
              "Schedule-aware arming (default: 23:00–04:00)",
            ]}
          />
        </div>

        <p className="mt-3 text-xs text-slate-600">
          Appearance cues (e.g., “red hoodie”, “white bakkie”) assist operators — they are not biometric identification.
        </p>
      </section>

      {/* STATIC VISUALS ROW 2 */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <ImageTile src={asset("images/partners/loiter-tailgate.jpg")} caption="Loitering & tailgating detection" />
        <ImageTile src={asset("images/partners/object-left-removed.jpg")} caption="Object left / removed" />
        <ImageTile src={asset("images/partners/line-crossing.jpg")} caption="Virtual lines & zones for entries/lanes" />
      </section>

      {/* PARTNERSHIP MODELS */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">How we partner in your areas</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Model
            title="Preferred Partner"
            points={[
              "Scoped logins for your control room/operators",
              "Co-branding on signage & resident comms",
              "Priority in new pole placements",
            ]}
          />
          <Model
            title="Sole-Area Partner"
            points={[
              "Exclusive / first-right status within set boundaries",
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

      {/* ONBOARDING */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Onboarding in 4 steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
          <li><strong>Area scoping:</strong> define boundaries, hot routes, cameras and SOPs.</li>
          <li><strong>Access & roles:</strong> create operator logins, set night/day schedules, confirm export controls.</li>
          <li><strong>Analytics plan:</strong> pick detections per camera (virtual lines &amp; zones, loiter, appearance cues, etc.).</li>
          <li><strong>Live & iterate:</strong> weekly tuning; monthly SLA report and heatmap review.</li>
        </ol>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-white shadow hover:bg-sky-800">
            Start partner onboarding
          </Link>
          <Link to="/contact" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50">
            Ask a question
          </Link>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">Privacy, POPIA &amp; export control</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>Resident live-view is limited to night windows; all access is logged.</li>
          <li>Exports are restricted to authorised officers on lawful request; audit trail retained.</li>
          <li>Privacy masks avoid filming into private property; no audio recording.</li>
          <li>No facial recognition or biometric identification.</li>
        </ul>
        <p className="mt-3 text-xs text-slate-600">
          We align with community policies and provide signage templates. Operator agreements available on request.
        </p>
      </section>

      {/* PARTNER LOGOS */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 text-center text-[11px] font-semibold tracking-wide text-slate-700">
          TRUSTED BY &amp; PARTNERED WITH:
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <LogoTile src={asset("partners/tplink.png")} alt="TP-Link" />
          <LogoTile src={asset("partners/nxw.png")} alt="Network Optix" />
          <LogoTile src={asset("partners/cvedia.png")} alt="CVEDIA" />
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-5">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Ready to protect more streets with fewer false call-outs?
            </h3>
            <p className="text-sm text-slate-700">
              Request a demo and we’ll map your area, analytics and SOPs together.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-white shadow hover:bg-sky-800">
              Book a partner demo
            </Link>
            <Link to="/contact" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50">
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
function ImageTile({ src, caption }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Img src={src} alt={caption} className="h-48 w-full object-cover" />
      <figcaption className="px-3 py-2 text-xs font-medium text-slate-700">{caption}</figcaption>
    </figure>
  );
}
function CatalogGroup({ title, items = [], img }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {img ? <Img src={img} alt={`${title} example`} className="mb-3 h-32 w-full rounded-lg object-cover" /> : null}
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="mt-2 space-y-1">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-sky-600" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
function LogoTile({ src, alt }) {
  return (
    <div className="flex h-12 items-center justify-center rounded-xl bg-white px-4 shadow-sm ring-1 ring-slate-200">
      <Img src={src} alt={alt} className="h-6 w-auto object-contain" />
    </div>
  );
}
