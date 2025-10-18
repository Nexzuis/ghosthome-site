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
  PlayCircle,
  ArrowRight,
  ArrowUpCircle,
} from "lucide-react";
import Hero from "../components/Hero.jsx";
import HowItWorksStory from "../components/HowItWorksStory.jsx";

export default function Home() {
  // simple smooth scroll helpers
  const toPartners = () =>
    document.getElementById("partners")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const toResidents = () =>
    document.getElementById("residents")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO — street-first */}
      <Hero />

      {/* RESIDENT SECTION ANCHOR */}
      <div id="residents" />

      {/* TRUST STRIP (Residents) */}
      <section aria-labelledby="trust-strip" className="mt-10">
        <h2 id="trust-strip" className="sr-only">What makes it effective</h2>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            We <span className="font-semibold">virtually close off streets after dark</span> with AI: only high-signal person events reach residents.
          </p>
          <button
            onClick={toPartners}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:-translate-y-0.5 hover:shadow-sm"
          >
            Security partners <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <TrustItem
            icon={<BellRing className="h-5 w-5" />}
            title="Smart night alerts (23:00–04:00)"
            text="AI focuses on real person activity when risk is highest."
          />
          <TrustItem
            icon={<Camera className="h-5 w-5" />}
            title="Live view + night alerts"
            text="Residents use the Ghosthome app for live access and person alerts."
          />
          <TrustItem
            icon={<FileText className="h-5 w-5" />}
            title="Transparent audit trail"
            text="Authorised bookmarks/exports keep operations accountable."
          />
        </div>

        {/* Heads-up explainer (tiny, neutral) */}
        <p className="mt-3 text-[12px] text-slate-600">
          Heads-up: vetted <span className="font-semibold">CPF patrollers</span> may receive extra Telegram clip notifications during the night window. Vehicle analytics and advanced searches are reserved for security partners.
        </p>
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
              Built for neighbourhoods with real crime pressure. Residents get live access to nearby routes; CPF leaders help coordinate; security partners escalate and respond with context to gain the edge.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StepCard
                icon={<Camera className="h-6 w-6" />}
                title="Detect"
                text="Strategic poles cover routes & entrances. AI prioritises people between 23:00–04:00."
              />
              <StepCard
                icon={<BellRing className="h-6 w-6" />}
                title="Alert"
                text="Residents receive real-time person alerts in the Ghosthome app. Vetted CPF patrollers may receive Telegram clips."
              />
              <StepCard
                icon={<RouteIcon className="h-6 w-6" />}
                title="Stay oriented"
                text="Use simple bookmarks and corner-to-corner context to see what matters in real time."
              />
              <StepCard
                icon={<Shield className="h-6 w-6" />}
                title="Escalate"
                text="One-tap call to armed response; partners join with the right context."
              />
            </div>
            <p className="mt-4 text-[12px] text-slate-600">
              Privacy by design under POPIA: encrypted data, access control, and lawful sharing overseen by Ghosthome’s Information Officer.
            </p>
          </div>
        </div>
      </section>

      {/* STREET-ACCESS PACKAGES — moved up beneath residents */}
      <section aria-labelledby="packages" className="mt-14">
        <h2 id="packages" className="text-xl font-semibold text-slate-900">Street-access packages</h2>
        <p className="mt-2 text-slate-600">Access is permission-based. Data retention follows the community policy. Prices include VAT (15%).</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <PriceCard
            title="Neighbour Plan"
            price="R99"
            subtitle="/month"
            features={[
              "Live view to 2 route cameras",
              "1 user account",
              "Smart person alerts (23:00–04:00)"
            ]}
            ctaLabel="Sign up"
            to="/signup"
          />
          <PriceCard
            title="Street Plan"
            price="R149"
            subtitle="/month"
            features={[
              "Live view to 4 route cameras",
              "2 user accounts",
              "Smart person alerts (23:00–04:00)"
            ]}
            highlight
            ctaLabel="Sign up"
            to="/signup"
          />
          <PriceCard
            title="Security Partner"
            price="POA"
            subtitle=""
            features={[
              "Advanced analytics incl. vehicles",
              "Investigations & audit support",
              "SOP alignment"
            ]}
            ctaLabel="Talk to us"
            to="/partners"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-xs text-slate-600">
            Residents receive live person-event alerts via the Ghosthome app. CPF-vetted patrollers may receive Telegram clip notifications during 23:00–04:00.
          </p>
          <button
            onClick={toPartners}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:-translate-y-0.5 hover:shadow"
          >
            See partner capabilities <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* Divider */}
      <div className="my-14 h-px w-full bg-slate-200" aria-hidden="true"></div>

      {/* SECURITY PARTNER SECTION ANCHOR */}
      <div id="partners" />

      {/* DEEPER SECURITY COMPANY INTEGRATION — now full white background */}
      <DeeperSecurityIntegrationWhite onBackToResidents={toResidents} />

      {/* SMART HOME */}
      <section aria-labelledby="smart-home" className="mt-14">
        <h2 id="smart-home" className="text-xl font-semibold text-slate-900">We also do Smart Home Systems</h2>
        <p className="mt-2 text-slate-600">
          If you’d like connected cameras and automations at home, we can add indoor alarms, spotlights and simple “if person → do X” routines using reliable, mainstream gear — always performing better than traditional alarms.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <AddOnCard
            icon={<Lightbulb className="h-6 w-6" />}
            title="Automations & scenes"
            points={[
              "Turn on spotlights on verified person events",
              "Trigger other camera lights/sirens automatically",
              "Simple buttons to arm/disarm modes"
            ]}
          />
          <AddOnCard
            icon={<Camera className="h-6 w-6" />}
            title="Home cameras & hubs"
            points={[
              "Reliable app control and notifications",
              "Indoor alarm sounders (quiet day / loud night)",
              "Privacy zones and signage support"
            ]}
          />
          <AddOnCard
            icon={<PhoneCall className="h-6 w-6" />}
            title="Assist & support"
            points={[
              "Install, configure, and fine-tune alerts",
              "False-alarm reduction & zones",
              "Integration with your response radio/panel"
            ]}
          />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Ask about Smart Home
          </Link>
          <Link
            to="/privacy"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
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

/* ——— Partner integration block ——— */
function DeeperSecurityIntegrationWhite({ onBackToResidents }) {
  return (
    <section aria-labelledby="partner-integration" className="mt-14">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Deeper security company integration
          </div>
          <h2 id="partner-integration" className="mt-3 text-2xl font-bold text-slate-900">
            Give partners superpowers on the street grid
          </h2>
          <p className="mt-2 max-w-3xl text-slate-700">
            We layer advanced video analytics directly onto the street cameras <span className="font-semibold">we install</span> — or, if a partner prefers to build their own network, <span className="font-semibold">we integrate</span> with that too. The result is signal—not noise—so teams can <span className="font-semibold">detect earlier</span>, <span className="font-semibold">deter faster</span>, and <span className="font-semibold">prove more</span>.
          </p>

          {/* Capability pills (refined wording) */}
          <div className="mt-4 flex flex-wrap gap-2">
            <CapPill icon={<Radar className="h-4 w-4" />} label="Virtual lines & zones (entries/lanes)" />
            <CapPill icon={<Activity className="h-4 w-4" />} label="Loitering & tailgating detection" />
            <CapPill icon={<ChartBar className="h-4 w-4" />} label="Large-crowd estimation" />
            <CapPill icon={<ChartBar className="h-4 w-4" />} label="Occupancy counts" />
            <CapPill icon={<Search className="h-4 w-4" />} label="Appearance search (vehicle/clothing colour)" />
            <CapPill icon={<Siren className="h-4 w-4" />} label="On-camera lights & sirens" />
            <CapPill icon={<Layers className="h-4 w-4" />} label="Object left / removed detection" />
          </div>

          {/* Media strip — small video tiles */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <VideoTile
              src="/videos/cvedia-tripwire.mp4"
              poster="/videos/cvedia-tripwire.jpg"
              label="CVEDIA RT — Lines, zones & behaviours"
            />
            <VideoTile
              src="/videos/nxw-demo.mp4"
              poster="/videos/nxw-demo.jpg"
              label="NX Witness — Bookmarks & search"
            />
            <VideoTile
              src="/videos/ghosthome-grid.mp4"
              poster="/videos/ghosthome-grid.jpg"
              label="Ghosthome — Street-first grid"
            />
          </div>

          {/* Analytics Catalog */}
          <AnalyticsCatalog />

          {/* Partner logos marquee (white background) */}
          <PartnersMarquee />

          {/* Jump buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/partners"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Talk to Security Partners
            </Link>
            <button
              onClick={onBackToResidents}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 hover:shadow-sm"
            >
              Back to Residents <ArrowUpCircle className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Privacy by design: no facial recognition; privacy masks where required; strict export controls; and full access logs.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */
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
      <Link
        to={to}
        className={[
          "mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none",
          highlight
            ? "bg-emerald-600 text-white hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-300"
            : "border border-slate-300 text-slate-700 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-300",
        ].join(" ")}
      >
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

function VideoTile({ src, poster, label }) {
  return (
    <figure className="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="relative">
        <video
          className="h-48 w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-label={label}
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-blue-100/70" />
        <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-3 w-3" />
            Preview
          </span>
        </div>
      </div>
      <figcaption className="px-3 py-2 text-xs font-medium text-slate-700">{label}</figcaption>
    </figure>
  );
}

/* -------- Analytics Catalog (CVEDIA + NX wording) -------- */
function AnalyticsCatalog() {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-900">Analytics catalog</h3>
      <p className="mt-1 text-sm text-slate-600">
        Deploy what you need, per site. People-first signals for the street, plus advanced tools for partners. Models run on-camera, on NVRs or at the edge.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FeatureGroup
          title="People"
          items={[
            "People detection (visible & thermal)",
            "Aerial human detection (overviews, drones)",
            "Dwell / loiter monitoring",
            "Fall/accident indicator",
            "Person in water detection",
            "Social distancing mapping",
            "Face anonymizer (privacy-first)",
          ]}
        />
        <FeatureGroup
          title="Vehicles"
          items={[
            "Vehicle detection (multi-angle)",
            "Make/model classifier",
            "Thermal vehicle detection",
            "Vehicle pose & direction estimation",
            "Lane/entry violations via virtual lines",
          ]}
        />
        <FeatureGroup
          title="Safety & perimeter"
          items={[
            "Virtual lines & zones (entries/lanes/fence lines)",
            "Left/removed object watch",
            "Perimeter guarding",
            "Tailgating at gates",
            "Area entry/exit rules & exceptions",
          ]}
        />
        <FeatureGroup
          title="Industrial"
          items={[
            "Ship & aerial-ship detection",
            "UAS / drone detection",
            "Airplane detection",
            "Weather/sea-state aware boat detection",
          ]}
        />
        <FeatureGroup
          title="Wildlife"
          items={["Animal detection (common species)", "Thermal wildlife detection"]}
        />
        <FeatureGroup
          title="Residential"
          items={[
            "Package presence/collection",
            "Armed-person indicator",
            "Face covered (beta)",
            "Speed screening (beta corridors)",
          ]}
        />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 ring-1 ring-slate-200">
          <MonitorCog className="h-3.5 w-3.5" />
          NX Witness — VMS enhancements
        </div>
        <ul className="grid list-disc gap-2 pl-5 text-sm text-slate-700 md:grid-cols-2">
          <li>Enhanced search: filter by clothing/vehicle colour, direction, line/zone, and time</li>
          <li>One-click bookmarks, incident timelines and export bundles</li>
          <li>Picture-in-picture review while monitoring live</li>
          <li>License plate recognition (LPR) with access logs</li>
          <li>Chain-of-custody friendly exports under POPIA</li>
        </ul>
      </div>
    </div>
  );
}

function FeatureGroup({ title, items = [] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <ul className="mt-2 space-y-1">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------- Partner logo marquee (full white) -------- */
function PartnersMarquee() {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
      {/* local keyframes so we don’t touch global CSS */}
      <style>{`
        @keyframes gh-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="mb-2 px-1 text-center text-[11px] font-semibold tracking-wide text-slate-700">
        TRUSTED BY &amp; PARTNERED WITH:
      </div>

      <div className="relative overflow-hidden">
        {/* subtle fades on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

        {/* track */}
        <div
          className="flex w-[200%] items-center gap-6 opacity-95"
          style={{ animation: "gh-marquee 22s linear infinite" }}
          aria-hidden="true"
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-6 px-2">
              <LogoTile src="/partners/tplink.png" alt="TP-Link" />
              <LogoTile src="/partners/nxw.png" alt="Network Optix" />
              <LogoTile src="/partners/cvedia.png" alt="CVEDIA" />
              <LogoTile src="/partners/tplink.png" alt="TP-Link" />
              <LogoTile src="/partners/nxw.png" alt="Network Optix" />
              <LogoTile src="/partners/cvedia.png" alt="CVEDIA" />
            </div>
          ))}
        </div>
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
