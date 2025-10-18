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
  TrafficCone,
  ChartBar,
  LineChart,
  ClipboardList,
  Lock,
  ShieldAlert,
  Video,
  Camera,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ChevronRight,
  FileText,
} from "lucide-react";

/**
 * FEATURES — Street Network (showpiece)
 * - Distinct look vs Home: bento hero, media mosaic, feature matrix.
 * - Wording aligned with Secure Street & Partners (23:00–04:00, live view for residents, CPF may receive clips).
 * - Uses existing public images (no src/assets required).
 */

export default function Features() {
  const [flash, setFlash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setFlash(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      {/* ───────────────── Hero bento (distinct look) ───────────────── */}
      <section
        className={[
          "relative mb-10 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8",
          flash ? "animate-pulse" : "",
        ].join(" ")}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Headline + core promise */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Shield className="h-4 w-4" />
              Community Street Network
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Virtually close your neighbourhood —{" "}
              <span className="text-emerald-600">corners, routes & hotspots</span>
            </h1>
            <p className="mt-3 max-w-3xl text-slate-700">
              We work with residents, CPF leaders and security partners to blanket key corners and approaches.
              The system focuses on <span className="font-semibold">23:00–04:00</span> for attention, not noise.
              Residents get <span className="font-semibold">permission-based live view</span>;{" "}
              <span className="font-semibold">vetted CPF patrollers may receive clip notifications</span>.
              Partners escalate faster with context.
            </p>

            <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <HeroPoint icon={<MapPinned className="h-4 w-4" />} text="Strategic pole placement — public space only, privacy masks enforced" />
              <HeroPoint icon={<BellRing className="h-4 w-4" />} text="Night focus 23:00–04:00; residents use live view; CPF may receive clips" />
              <HeroPoint icon={<RouteIcon className="h-4 w-4" />} text="Route tracing across adjoining streets with quick bookmarks" />
              <HeroPoint icon={<ClipboardList className="h-4 w-4" />} text="Everything logged; exports controlled by the Information Officer" />
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
                Request partner access
              </a>
            </div>
          </div>

          {/* Right: “Pro-grade stack” */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-3 text-lg font-bold text-slate-900">Why our stack works</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <WhyItem icon={<Video />} title="Fast evidence" desc="Scrub & sync multiple cameras; instant bookmarks per corner." />
              <WhyItem icon={<ShieldAlert />} title="Ops-ready" desc="Stable streams, health checks, role-based permissions." />
              <WhyItem icon={<Lock />} title="POPIA-first" desc="No audio, privacy masks, logged access, controlled exports." />
              <WhyItem icon={<FileText />} title="Audit trail" desc="Every touch recorded; resident access is live view only." />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Media mosaic (visual punch) ───────────────── */}
      <section className="mb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <Figure src="/images/partners/nxw-console.jpg" caption="Unified console: live, search & export" />
          <Figure src="/images/partners/people-detection.jpg" caption="People detection with night focus" />
          <Figure src="/images/partners/vehicle-detection.jpg" caption="Vehicle detection & colour cues" />
        </div>
      </section>

      {/* ───────────────── Feature matrix: who gets what ───────────────── */}
      <section className="mb-12 rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Who gets what — simple and clear</h2>
        <p className="mt-1 text-slate-700">
          Access is permission-based and logged. Residents use <span className="font-semibold">live view</span> during
          the night window; vetted CPF may receive <span className="font-semibold">clip notifications</span>; partners
          get an <span className="font-semibold">ops console</span> with analytics.
        </p>
        <div className="mt-5 overflow-hidden rounded-xl ring-1 ring-slate-200">
          <div className="grid grid-cols-4 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <div />
            <div>Residents</div>
            <div>CPF</div>
            <div>Security partners</div>
          </div>
          {[ // rows
            ["Live view (nearest route cameras)", true, true, true],
            ["Night focus 23:00–04:00", true, true, true],
            ["Clip notifications", false, true, true],
            ["Virtual lines & zones (entries/lanes)", false, true, true],
            ["Appearance cues for search", false, true, true],
            ["Occupancy counts & large-crowd estimation", false, false, true],
            ["Left / removed object alerts", false, false, true],
            ["Audit logs & export controls", true, true, true],
          ].map(([label, r, c, p]) => (
            <div key={label} className="grid grid-cols-4 border-t border-slate-100 px-3 py-2 text-sm">
              <div className="font-medium text-slate-800">{label}</div>
              <Cell ok={r} />
              <Cell ok={c} />
              <Cell ok={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── Analytics gallery (marketing rewrite) ───────────────── */}
      <section className="mb-12">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <Radar className="h-4 w-4" />
          Advanced video analytics (partner-grade)
        </div>
        <p className="max-w-3xl text-slate-700">
          We apply analytics directly to <span className="font-semibold">street cameras</span> you already use — no rip-and-replace.
          Configure per camera or per zone; run alerts in real time and search retrospectively by morning.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnalyticCard
            icon={<Scan className="h-6 w-6" />}
            title="People & vehicles"
            bullets={[
              "Reliable people / vehicle detection (visible or thermal)",
              "Direction & lane filters to cut noise",
              "Confidence thresholds tuned to your routes",
            ]}
          />
          <AnalyticCard
            icon={<Crosshair className="h-6 w-6" />}
            title="Virtual lines & zones"
            bullets={[
              "Entries, lanes & fence lines with rule-based triggers",
              "Time-in-area (loiter/dwell) for pre-incident behaviour",
              "Left / removed object alerts on sensitive corners",
            ]}
          />
          <AnalyticCard
            icon={<ScanFace className="h-6 w-6" />}
            title="Appearance search"
            bullets={[
              "Search: “red hoodie”, “white bakkie”, “blue backpack”",
              "Rapid filtering by time & corner",
              "Operator assist — no biometric identification",
            ]}
          />
          <AnalyticCard
            icon={<Users className="h-6 w-6" />}
            title="Crowds & occupancy"
            bullets={[
              "Large-crowd estimation for events and surges",
              "Occupancy counts on routes or pinch points",
              "Heatmaps for route pressure over time",
            ]}
          />
          <AnalyticCard
            icon={<LineChart className="h-6 w-6" />}
            title="Patterns & hotspots"
            bullets={[
              "Recurring time-of-night patterns",
              "Corner pressure trends after incidents",
              "Fast surfacing of new hotspots",
            ]}
          />
          <AnalyticCard
            icon={<Car className="h-6 w-6" />}
            title="Vehicle-centric"
            bullets={[
              "Type & colour filters for quick narrowing",
              "Frequent-pass lists & watch candidates",
              "Context clips for escalation",
            ]}
          />
        </div>

        {/* visual strip under analytics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Figure src="/images/partners/loiter-tailgate.jpg" caption="Loiter / tailgating (time-in-area)" />
          <Figure src="/images/partners/object-left-removed.jpg" caption="Object left / removed" />
          <Figure src="/images/partners/line-crossing.jpg" caption="Virtual lines & zones for entries/lanes" />
        </div>

        <p className="mt-3 text-xs text-slate-600">
          Appearance cues help operators navigate quickly — they are not biometric identification. Access and exports remain fully audited.
        </p>
      </section>

      {/* ───────────────── Rollout timeline ───────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900">Rollout that adapts pole by pole</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StepCard
            icon={<Target className="h-6 w-6" />}
            title="Plan & prioritise"
            text="Map entrances, corners & cut-throughs. Start with highest-risk routes."
          />
          <StepCard
            icon={<TrafficCone className="h-6 w-6" />}
            title="Install & mask"
            text="Mount for public-space views only. Apply permanent privacy masks."
          />
          <StepCard
            icon={<Timer className="h-6 w-6" />}
            title="Focus 23:00–04:00"
            text="Night window tuned for attention. Residents use live view; CPF may receive clips."
          />
          <StepCard
            icon={<ChartBar className="h-6 w-6" />}
            title="Adapt to hotspots"
            text="Shift/add poles as patterns move. Keep ‘virtual closure’ as the goal."
          />
        </div>
        <p className="mt-3 text-xs text-slate-600">
          POPIA: logged access, no audio; exports by the Information Officer on lawful request. Signage templates available.
        </p>
      </section>

      {/* ───────────────── Compact home add-ons (kept tiny) ───────────────── */}
      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Home add-ons (optional)
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <HomeBit icon={<Camera className="h-5 w-5 text-emerald-700" />} title="Smart cameras" text="Reliable person/vehicle detection on supported models." />
          <HomeBit icon={<BellRing className="h-5 w-5 text-emerald-700" />} title="Night chime" text="Light wake for verified person events (23:00–04:00)." />
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

      {/* ───────────────── Partner logos (optional) ───────────────── */}
      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 text-center text-[11px] font-semibold tracking-wide text-slate-700">
          TRUSTED BY & PARTNERED WITH:
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <LogoTile src="/partners/tplink.png" alt="TP-Link" />
          <LogoTile src="/partners/nxw.png" alt="Network Optix" />
          <LogoTile src="/partners/cvedia.png" alt="CVEDIA" />
        </div>
      </section>

      {/* ───────────────── CTA strip ───────────────── */}
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
          Resident live view in the night window (23:00–04:00). Partner analytics access is role-based and fully audited.
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

function Figure({ src, caption }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <img src={src} alt={caption} className="h-48 w-full object-cover" loading="lazy" />
      <figcaption className="px-3 py-2 text-xs font-medium text-slate-700">{caption}</figcaption>
    </figure>
  );
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

function LogoTile({ src, alt }) {
  return (
    <div className="flex h-12 items-center justify-center rounded-xl bg-white px-4 shadow-sm ring-1 ring-slate-200">
      <img src={src} alt={alt} className="h-6 w-auto object-contain" loading="lazy" />
    </div>
  );
}

function Cell({ ok }) {
  return (
    <div className="flex items-center">
      {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-slate-300" />}
    </div>
  );
}
