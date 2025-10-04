import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  BellRing,
  Camera,
  Route as RouteIcon,
  FileText,
  Users,
  PhoneCall,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
  Radar,
  Search,
  ChartBar,
  Activity,
  MonitorCog,
  Siren,
  Layers,
} from "lucide-react";
import Hero from "../components/Hero.jsx";
import HowItWorksStory from "../components/HowItWorksStory.jsx";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO — street-first */}
      <Hero />

      {/* TRUST STRIP */}
      <section aria-labelledby="trust-strip" className="mt-10">
        <h2 id="trust-strip" className="sr-only">What makes it effective</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <TrustItem
            icon={<BellRing className="h-5 w-5" />}
            title="Night alerts only (22:00–04:00)"
            text="Less noise, more attention when it matters."
          />
          <TrustItem
            icon={<Camera className="h-5 w-5" />}
            title="Push notifications"
            text="Give neighbours & partners instant alerts."
          />
          <TrustItem
            icon={<FileText className="h-5 w-5" />}
            title="Transparent audit trail"
            text="Bookmarks & exports keep everyone accountable."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section aria-labelledby="how-it-works" className="mt-14">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 sm:p-8">
          <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Street network
            </div>
            <h2 id="how-it-works" className="mt-3 text-2xl font-bold text-slate-900">
              How the community street-camera network works
            </h2>
            <p className="mt-2 max-w-3xl text-slate-700">
              Built for neighbourhoods with real crime pressure. Residents get route access; CPF leader involvement; security partners escalate and respond with context to gain the edge.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StepCard icon={<Camera className="h-6 w-6" />} title="Detect" text="Strategic poles cover routes & entrances. AI flags people/vehicles that matter." />
              <StepCard icon={<BellRing className="h-6 w-6" />} title="Alert" text="You receive a WhatsApp alert with a snapshot and short clip (night-hours focus)." />
              <StepCard icon={<RouteIcon className="h-6 w-6" />} title="Review" text="Trace movement across adjoining streets with simple, fast bookmarks." />
              <StepCard icon={<Shield className="h-6 w-6" />} title="Escalate" text="One-tap call to armed response; partners join with the right context." />
            </div>
          </div>
        </div>
      </section>

      {/* DEEPER SECURITY COMPANY INTEGRATION — recoloured to BLUE */}
      <DeeperSecurityIntegrationBlue />

      {/* WHO IT'S FOR */}
      <section aria-labelledby="who-for" className="mt-14">
        <h2 id="who-for" className="text-xl font-semibold text-slate-900">Who it’s for</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <AudienceCard
            icon={<Users className="h-6 w-6" />}
            title="Residents"
            points={["Route camera access", "Night WhatsApp alerts", "Faster situational awareness"]}
          />
          <AudienceCard
            icon={<Shield className="h-6 w-6" />}
            title="CPF / Community Leaders"
            points={["Street-level coordination", "Evidence bookmarks & exports", "Clear roles and processes"]}
          />
          <AudienceCard
            icon={<PhoneCall className="h-6 w-6" />}
            title="Security Partners"
            points={["Context-rich call-outs", "Better response prioritisation", "Transparent audit & SLA support"]}
          />
        </div>
      </section>

      {/* PACKAGES PREVIEW */}
      <section aria-labelledby="packages" className="mt-14">
        <h2 id="packages" className="text-xl font-semibold text-slate-900">Street-access packages</h2>
        <p className="mt-2 text-slate-600">Access is permission-based. Data retention follows the community policy. Prices include VAT (15%).</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <PriceCard title="Neighbour Plan" price="R99" subtitle="/month" features={["2 route cameras", "1 user account", "Night alerts (22:00–04:00)"]} ctaLabel="Sign up" to="/signup" />
          <PriceCard title="Street Plan" price="R149" subtitle="/month" features={["4 route cameras", "2 user accounts", "Night alerts (22:00–04:00)"]} highlight ctaLabel="Sign up" to="/signup" />
          <PriceCard title="Security Partner" price="POA" subtitle="" features={["Context-rich call-outs", "Evidence & audit support", "SOP alignment"]} ctaLabel="Talk to us" to="/partners" />
        </div>
        <p className="mt-3 text-xs text-slate-600">Fair-use applies. WhatsApp delivery preferred; Telegram optional. Access subject to address verification.</p>
      </section>

      {/* Divider */}
      <div className="my-14 h-px w-full bg-slate-200" aria-hidden="true"></div>

      {/* SMART HOME */}
      <section aria-labelledby="smart-home" className="mt-6">
        <h2 id="smart-home" className="text-xl font-semibold text-slate-900">We also do Smart Home Systems</h2>
        <p className="mt-2 text-slate-600">If you’d like connected cameras and automations at home, we can add indoor alarms, spotlights and simple “if person → do X” routines using reliable, mainstream gear.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <AddOnCard icon={<Lightbulb className="h-6 w-6" />} title="Automations & scenes" points={["Turn on spotlights on verified person events", "Trigger other camera lights/alarms automatically", "Simple buttons to arm/disarm modes"]} />
          <AddOnCard icon={<Camera className="h-6 w-6" />} title="Home cameras & hubs" points={["Reliable app control and notifications", "Indoor alarm sounders (quiet day / loud night)", "Privacy zones and signage support"]} />
          <AddOnCard icon={<PhoneCall className="h-6 w-6" />} title="Assist & support" points={["Install, configure, and fine-tune alerts", "False-alarm reduction & zones", "Integration with your response radio/panel"]} />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            Ask about Smart Home
          </Link>
          <Link to="/privacy" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
            Our privacy approach
          </Link>
        </div>
      </section>

      {/* Story */}
      <div className="mt-16">
        <HowItWorksStory />
      </div>
    </main>
  );
}

/* ——— Blue partner integration block ——— */
function DeeperSecurityIntegrationBlue() {
  return (
    <section aria-labelledby="partner-integration" className="mt-14">
      <div className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50/70 via-white to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            Deeper security company integration
          </div>
          <h2 id="partner-integration" className="mt-3 text-2xl font-bold text-slate-900">Give partners superpowers on the street grid</h2>
          <p className="mt-2 max-w-3xl text-slate-700">
            We layer advanced video analytics directly onto the <span className="font-semibold">street cameras</span>.
            Security partners get signal—not noise—so they can <span className="font-semibold">detect earlier</span>, <span className="font-semibold">deter faster</span>, and <span className="font-semibold">prove more</span>.
            It’s built for real operations: clear triggers at night, smart retrospective search by morning.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CapPill icon={<Radar className="h-4 w-4" />} label="Tripwires & guard-zones" />
            <CapPill icon={<Activity className="h-4 w-4" />} label="Loitering / tailgating" />
            <CapPill icon={<ChartBar className="h-4 w-4" />} label="Crowd & occupancy" />
            <CapPill icon={<Search className="h-4 w-4" />} label="Appearance search (vehicle/clothing colour)" />
            <CapPill icon={<Siren className="h-4 w-4" />} label="Deterrence hooks (lights/sirens)" />
            <CapPill icon={<Layers className="h-4 w-4" />} label="Object left / removed" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <IntegrCard title="Detect (real-time)" icon={<Radar className="h-5 w-5 text-blue-700" />} points={["Tripwires & areas trigger people/vehicle alerts at key corners","Loitering around gates/driveways flags pre-incident behaviour","Night window reduces noise; partners see the right events"]} footer="Feeds integrate into partner watchlists for rapid routing." />
            <IntegrCard title="Deter (on the scene)" icon={<Siren className="h-5 w-5 text-blue-700" />} points={["On-camera spotlight/siren or linked strobe/siren triggers","Escalation to response with context-rich snapshots","Rules per site: arm/disarm schedules & exceptions"]} footer="Clear, auditable actions aligned to the community SOP." />
            <IntegrCard title="Investigate (after the fact)" icon={<Search className="h-5 w-5 text-blue-700" />} points={["Search by vehicle type/colour or clothing colour","Filter by lines/zones & time to find the right clip fast","Authorised exports only, with full audit trails"]} footer="From hours to minutes: faster evidence, cleaner handovers." />
          </div>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2">
                <span className="rounded-lg bg-slate-100 p-2 text-slate-700 ring-1 ring-slate-200">
                  <MonitorCog className="h-4 w-4" />
                </span>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Control rooms included:</span> we can plug into existing multi-vendor environments and unify feeds from multiple areas into one view—then apply the analytics across them. No need to replace legacy cameras.
                </p>
              </div>
              <div className="flex shrink-0 gap-2 pt-2 sm:pt-0">
                <Link to="/partners" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700">Security partners</Link>
                <Link to="/contact" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white/60">Partner with us</Link>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Privacy by design: no facial recognition; privacy masks where required; strict export controls; and full access logs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* helpers (unchanged except blue pills/cards) */
function TrustItem({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{text}</p>
      </div>
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

function AudienceCard({ icon, title, points = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceCard({ title, price, subtitle, features = [], highlight = false, ctaLabel, to }) {
  return (
    <div className={["rounded-2xl border p-5 transition", highlight ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"].join(" ")}>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-bold text-slate-900">{price}</span>
        {subtitle ? <span className="pb-1 text-sm text-slate-600">{subtitle}</span> : null}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link to={to} className={["mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none", highlight ? "bg-emerald-600 text-white hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-300" : "border border-slate-300 text-slate-700 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-300"].join(" ")}>
        {ctaLabel}
      </Link>
    </div>
  );
}

function AddOnCard({ icon, title, points = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CapPill({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      <span className="text-blue-700">{icon}</span>
      {label}
    </div>
  );
}

function IntegrCard({ title, icon, points = [], footer }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
        {icon}
        {title}
      </div>
      <ul className="space-y-2 text-sm text-slate-700">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {footer ? <p className="mt-3 text-xs text-slate-500">{footer}</p> : null}
    </div>
  );
}
