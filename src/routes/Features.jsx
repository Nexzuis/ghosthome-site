import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BellRing,
  Shield,
  Route as RouteIcon,
  Target,
  MapPinned,
  Radar,
  Scan,
  ScanFace,
  Crosshair,
  Timer,
  Footprints,
  Users,
  UserCheck,
  Car,
  Bus,
  Bike,
  TrafficCone,
  ChartBar,
  LineChart,
  ClipboardList,
  Lock,
  ShieldAlert,
  Video,
  Camera,
  Lightbulb,
  AlarmClockCheck,
  PlugZap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  FileText,
} from "lucide-react";

/**
 * FEATURES — Street-first edition
 * - Emphasises the street network (virtual closure of corners & routes).
 * - Brags about the VMS (without naming) + advanced analytics (without naming).
 * - Security partners: on-request elevated analytics workspace.
 * - Keeps a compact Home section at the bottom.
 * - CTAs = Sign up + Resident Plans + support@ghosthome.co.za
 */

export default function Features() {
  const [flash, setFlash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setFlash(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      {/* Local animations */}
      <style>{`
        @keyframes flashGlow { 0%,100%{ box-shadow:0 0 0 0 rgba(16,185,129,.45)} 50%{ box-shadow:0 0 0 14px rgba(16,185,129,.10)} }
        .flash-on{ animation: flashGlow 1.1s ease-in-out infinite }
        .flash-off{ animation: none }
        @keyframes floaty { 0%,100%{ transform:translateY(0)} 50%{ transform:translateY(-6px)} }
        .floaty{ animation: floaty 4s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce){ .flash-on,.floaty{ animation: none } }
      `}</style>

      {/* STREET-FIRST HERO */}
      <section
        className={[
          "relative mb-8 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8",
          flash ? "flash-on" : "flash-off",
        ].join(" ")}
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Shield className="h-4 w-4" />
              Community Street Network
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Virtually close your neighbourhood —{" "}
              <span className="text-emerald-600">corners, routes, and hotspots</span>
            </h1>
            <p className="mt-3 text-slate-700">
              We work with residents and security partners to cover{" "}
              <span className="font-semibold">nearly every street corner</span> and approach route. If
              new hotspots emerge, we adapt the grid. Residents get{" "}
              <span className="font-semibold">night person-movement alerts (22:00–04:00)</span> with
              a snapshot + live view. Partners escalate faster with real context.
            </p>

            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              <HeroPoint icon={<MapPinned className="h-4 w-4" />} text="Strategic pole placement: public space only, with privacy masks" />
              <HeroPoint icon={<BellRing className="h-4 w-4" />} text="Night alerts tuned to people on streets — fewer false alarms" />
              <HeroPoint icon={<RouteIcon className="h-4 w-4" />} text="Route tracing across adjoining streets with quick bookmarks" />
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white shadow transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Sign up <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              <Link
                to="/packages#community-access"
                className="inline-flex items-center rounded-xl border border-emerald-300 bg-white px-4 py-2 text-emerald-700 transition hover:bg-emerald-50"
              >
                View resident plans
              </Link>
              <a
                href="mailto:support@ghosthome.co.za"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-800 transition hover:bg-slate-50"
              >
                support@ghosthome.co.za
              </a>
            </div>
          </div>

          {/* Right: “What makes it pro-grade” */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-3 text-lg font-bold text-slate-900">Why our street system works</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <WhyItem icon={<Video />} title="Instant timeline" desc="Scrub & sync multiple cameras; ultra-fast review with smart bookmarks." />
              <WhyItem icon={<ClipboardList />} title="Audit first" desc="Every view/export is logged. Resident access is live-view only." />
              <WhyItem icon={<Lock />} title="Principled privacy" desc="No audio. Masks on private areas. Exports via Information Officer only." />
              <WhyItem icon={<ShieldAlert />} title="Ops-ready" desc="Stable streams, resilient storage, and role-based permissions." />
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS SUITE — brag without brand names */}
      <section className="mb-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <Radar className="h-4 w-4" />
          Advanced Video Analytics (partner-grade, on request)
        </div>
        <p className="text-slate-700">
          Beyond basic motion, our analytics suite identifies and reasons about activity on streets. Security partners can be
          provisioned with an <span className="font-semibold">elevated analytics workspace</span> on request.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnalyticCard icon={<Scan className="h-6 w-6" />} title="Object & class detection" bullets={[
            "People, vehicles (car/bakkie/bus/bike), animals",
            "Direction & speed tendencies",
            "Confidence scoring to reduce noise",
          ]}/>
          <AnalyticCard icon={<Crosshair className="h-6 w-6" />} title="Zones & rules" bullets={[
            "Line-crossing, region entry/exit, intrusion",
            "Dwell/loitering & linger time",
            "Left/removed object alerts",
          ]}/>
          <AnalyticCard icon={<ScanFace className="h-6 w-6" />} title="Appearance search" bullets={[
            "Find ‘person with red top, backpack’ across cameras",
            "Partial attribute matches; no biometric ID",
            "Filter by time window & route path",
          ]}/>
          <AnalyticCard icon={<Users className="h-6 w-6" />} title="Crowd & occupancy" bullets={[
            "Crowd counting & density thresholds",
            "Queue/backlog detection on pinch points",
            "Heatmaps for route pressure",
          ]}/>
          <AnalyticCard icon={<LineChart className="h-6 w-6" />} title="Patterns & hotspots" bullets={[
            "Recurring time-of-night patterns",
            "Corner/approach pressure trends",
            "Rapid hotspot surfacing after incidents",
          ]}/>
          <AnalyticCard icon={<Car className="h-6 w-6" />} title="Vehicle-focused tooling" bullets={[
            "Type, colour & direction filters",
            "Frequent-pass lists and watch candidates",
            "Context clips for partner escalation",
          ]}/>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <span className="font-semibold">Good to know:</span> resident access stays simple (night alerts + live view).
          The advanced tools above are made available to authorised security partners and community officers{" "}
          <span className="font-semibold">on request and under strict audit</span>.
        </div>
      </section>

      {/* HOW WE ROLL OUT A STREET GRID */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900">Rollout plan that adapts</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StepCard
            icon={<Target className="h-6 w-6" />}
            title="Plan & prioritise"
            text="Map entrances, corners, cut-throughs. Start with highest-risk routes."
          />
          <StepCard
            icon={<TrafficCone className="h-6 w-6" />}
            title="Install & mask"
            text="Mount for public-space views. Apply permanent privacy masks."
          />
          <StepCard
            icon={<Footprints className="h-6 w-6" />}
            title="Alerts that help"
            text="Night person-movement alerts (22:00–04:00 by default) with snapshots."
          />
          <StepCard
            icon={<ChartBar className="h-6 w-6" />}
            title="Adapt to hotspots"
            text="Shift/add poles as patterns move. Keep ‘virtual closure’ as the goal."
          />
        </div>
        <p className="mt-3 text-xs text-slate-600">
          POPIA-aware: logged access, no audio, exports by Information Officer on lawful request.
        </p>
      </section>

      {/* COMPARISON: TRAD vs STREET NETWORK */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <CompareCard
          title="Traditional alarm perimeter"
          tone="bad"
          points={[
            "Reactive — you hear a siren, then guess.",
            "No street context; can’t trace movement.",
            "False alarms cause fatigue and delays.",
            "No shared, auditable community view.",
          ]}
        />
        <CompareCard
          title="Community street network + alerts"
          tone="good"
          points={[
            "Street-level context with snapshots at night.",
            "Trace routes across corners in seconds.",
            "Analytics reduce noise and surface what matters.",
            "Resident live-view + partner escalation, all logged.",
          ]}
        />
      </div>

      {/* SMALL HOME SECTION (compact) */}
      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <HomeDot /> Home add-ons (optional)
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <HomeBit icon={<Camera className="h-5 w-5 text-emerald-700" />} title="Smart cameras" text="Person/vehicle detection, tracking on supported models." />
          <HomeBit icon={<BellRing className="h-5 w-5 text-emerald-700" />} title="Night chime" text="Indoor chime wakes you for verified person alerts." />
          <HomeBit icon={<Lightbulb className="h-5 w-5 text-emerald-700" />} title="Automations" text="Turn on lights/sirens; link to your alarm panel." />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/packages" className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-emerald-700">
            See packages
          </Link>
          <a href="mailto:support@ghosthome.co.za" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
            support@ghosthome.co.za
          </a>
        </div>
      </section>

      {/* FLOATING SLOGANS (street-flavoured) */}
      <div className="mx-auto mb-14 max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "Close the gaps, corner by corner",
            "See the street, not just a zone",
            "Night alerts with proof",
            "Hotspot-aware, not static",
            "Built for residents + response",
            "Street today, home tomorrow",
          ].map((label, i) => (
            <span
              key={label}
              className="floaty rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm"
              style={{ animationDelay: `${(i % 4) * 0.25}s` }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* CTA STRIP */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Ready to help your area ‘virtually close’?</h3>
            <p className="mt-1 text-sm text-slate-700">
              Sign up as a resident or request partner analytics access for your security provider.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/signup" className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-emerald-700">
              Sign up
            </Link>
            <Link to="/packages#community-access" className="inline-flex items-center rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
              View resident plans
            </Link>
            <a href="mailto:support@ghosthome.co.za" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
              Request partner access
            </a>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Resident live-view is 22:00–04:00 by default (customisable). Partner analytics access is role-based and fully audited.
        </p>
      </section>
    </div>
  );
}

/* ───────── helpers ───────── */

function HeroPoint({ icon, text }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-slate-700 ring-1 ring-slate-200">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

function WhyItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mt-0.5 text-emerald-700">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function AnalyticCard({ icon, title, bullets = [] }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        {icon}
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-700">{text}</p>
    </div>
  );
}

function HomeDot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />;
}

function HomeBit({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-700">{text}</p>
      </div>
    </div>
  );
}

function CompareCard({ title, points, tone }) {
  const good = tone === "good";
  return (
    <div
      className={[
        "rounded-2xl border p-6",
        good ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-white",
      ].join(" ")}
    >
      <h3 className={["mb-4 text-lg font-bold", good ? "text-emerald-900" : "text-slate-900"].join(" ")}>
        {title}
      </h3>
      <ul className="space-y-2">
        {points.map((p, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {good ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 text-slate-400" />
            )}
            <span className="text-sm text-slate-700">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
