import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Shield,
  BellRing,
  ScanEye,
  Lightbulb,
  Megaphone,
  Map,
  Route as RouteIcon,
  PhoneCall,
  Sun,
  Moon,
  Car,
  PlayCircle,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * "Secure Your Street" — interactive page for community street cameras + automations.
 * Visual language: whites/greys/slates + emerald accents (matches site).
 * No new libraries added. Uses framer-motion + Tailwind only.
 */
export default function SecureStreet() {
  const [layout, setLayout] = useState("intersection");
  const [power, setPower] = useState("wired");
  const [mode, setMode] = useState("night");

  const recommendations = useMemo(() => {
    const rec = {
      intersection: {
        wired: [
          "2 × fixed bullet for each approach road (total 4)",
          "1 × pan/tilt at the centre to track movement",
          "Siren/spotlight at centre pole",
        ],
        wirefree: [
          "4 × wire-free bullets on opposite corners",
          "1 × pan/tilt on the busiest corner",
          "Solar panels where possible",
        ],
      },
      culdesac: {
        wired: [
          "1 × fixed bullet at the entrance looking in",
          "1 × pan/tilt at the end of the circle",
          "Spotlight + indoor chime at two nearest homes",
        ],
        wirefree: [
          "2 × wire-free bullets at the entrance",
          "1 × pan/tilt mid-street to follow targets",
          "Solar panels on south-facing poles",
        ],
      },
      straight: {
        wired: [
          "2 × fixed bullets in opposing directions on one pole",
          "1 × pan/tilt mid-street to track",
          "Smart lights along fences triggered by detections",
        ],
        wirefree: [
          "3 × wire-free bullets spaced ~80–100 m",
          "Optional pan/tilt at the hotspot corner",
          "Solar panels to avoid trenching",
        ],
      },
    };
    return rec[layout][power];
  }, [layout, power]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 md:grid-cols-2"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Shield className="h-4 w-4" />
              Secure your street
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Community-first cameras and{" "}
              <span className="text-emerald-600">smart automations</span>
            </h1>
            <p className="mt-3 text-slate-600">
              Alarm and armed response companies often charge{" "}
              <strong>thousands</strong> for what a community can run together.{" "}
              <strong>Community-driven, affordable security</strong> for your street.{" "}
              <span className="font-semibold text-emerald-700">
                Get us involved in your community now!
              </span>{" "}
              Traditional alarms shout “zone.” Ghosthome <strong>acts</strong>: AI
              detects a person/vehicle, sends a <strong>snapshot</strong>, rings an{" "}
              <strong>indoor chime</strong>, fires <strong>lights/sirens</strong>, and
              can escalate to armed response.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://wa.me/27794950855"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
              >
                <PhoneCall className="h-5 w-5" />
                WhatsApp us
              </a>
              {/* Deep-link directly to the Street section on Packages */}
              <Link
                to="/packages#street"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <Camera className="h-5 w-5" />
                See package ideas
              </Link>
            </div>

            {/* Quick explainer chips */}
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <ExplainerChip
                icon={<ScanEye className="h-4 w-4" />}
                label="Detect"
                tone="emerald"
                text="AI person/vehicle classification reduces false alerts."
              />
              <ExplainerChip
                icon={<BellRing className="h-4 w-4" />}
                label="Alert"
                tone="amber"
                text="Snapshot in the notification + indoor chime at night."
              />
              <ExplainerChip
                icon={<Megaphone className="h-4 w-4" />}
                label="Deter"
                tone="rose"
                text="Auto-trigger spotlights & sirens to stop would-be intruders."
              />
              <ExplainerChip
                icon={<RouteIcon className="h-4 w-4" />}
                label="Track"
                tone="indigo"
                text="Pan/tilt models follow motion along the street."
              />
              <ExplainerChip
                icon={<Lightbulb className="h-4 w-4" />}
                label="Automate"
                tone="sky"
                text="Lights, plugs, and switches respond instantly."
              />
              <ExplainerChip
                icon={<Shield className="h-4 w-4" />}
                label="Escalate"
                tone="violet"
                text="Link to alarm panel/armed response when needed."
              />
            </div>
          </div>

          {/* Right: demo video + static image slot */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {/* 16:9 video */}
            <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-slate-200">
              <video
                src="/videos/detection-demo.mp4"
                muted
                playsInline
                loop
                autoPlay
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <PlayCircle className="h-4 w-4" />
              Live detection demo (autoplay, muted).
            </div>

            {/* Static image slot under the video */}
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <Map className="h-4 w-4" />
                Street coverage overview
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                {/* Place your image at: public/images/secure-street-overview.jpg (or .png) */}
                <img
                  src="/images/secure-street-overview.jpg"
                  alt="Street coverage diagram showing intersection, cul-de-sac, and straight-road camera placement"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Tip: Use a high-contrast diagram with labels (cameras, siren, spotlight). 16:9 works best.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* LAYOUT PICKER */}
      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Pick your street layout
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            We’ll suggest a sensible camera mix for quick planning.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <OptionChip
              label="Intersection"
              active={layout === "intersection"}
              onClick={() => setLayout("intersection")}
            />
            <OptionChip
              label="Cul-de-sac"
              active={layout === "culdesac"}
              onClick={() => setLayout("culdesac")}
            />
            <OptionChip
              label="Straight road"
              active={layout === "straight"}
              onClick={() => setLayout("straight")}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <OptionChip
              label="Wired"
              active={power === "wired"}
              onClick={() => setPower("wired")}
            />
            <OptionChip
              label="Wire-free"
              active={power === "wirefree"}
              onClick={() => setPower("wirefree")}
            />
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Map className="h-4 w-4" />
              Suggested kit
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {recommendations.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-600">
              Includes smart zones/line-crossing for fewer false alerts.
            </p>
          </div>
        </div>

        {/* FLIP CARDS — STREET USE-CASES */}
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Car className="h-4 w-4" />
            Street use-cases
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FlipCard
              front={
                <CardFace
                  icon={<ScanEye className="h-5 w-5" />}
                  title="Detect"
                  tone="emerald"
                  text="AI knows people vs. vehicles."
                />
              }
              back={
                <CardFaceBack
                  bullets={[
                    "Person snapshot sent to your phone",
                    "Trigger indoor chimes after hours",
                    "Privacy zones to avoid neighbours’ yards",
                  ]}
                />
              }
            />
            <FlipCard
              front={
                <CardFace
                  icon={<BellRing className="h-5 w-5" />}
                  title="Alert"
                  tone="amber"
                  text="Snapshot + chime = you actually wake up."
                />
              }
              back={
                <CardFaceBack
                  bullets={[
                    "Night mode chimes for households on duty",
                    "Day mode: quiet, only relevant pings",
                    "Share to a WhatsApp monitor group",
                  ]}
                />
              }
            />
            <FlipCard
              front={
                <CardFace
                  icon={<Megaphone className="h-5 w-5" />}
                  title="Deter"
                  tone="rose"
                  text="Lights/sirens fire automatically."
                />
              }
              back={
                <CardFaceBack
                  bullets={[
                    "Spotlight flash when line is crossed",
                    "Siren burst on human loitering",
                    "Audio warning clips (optional)",
                  ]}
                />
              }
            />
            <FlipCard
              front={
                <CardFace
                  icon={<RouteIcon className="h-5 w-5" />}
                  title="Track"
                  tone="indigo"
                  text="Follow motion across the view."
                />
              }
              back={
                <CardFaceBack
                  bullets={[
                    "Pan/tilt cameras auto-track targets",
                    "Multi-camera hand-off down the road",
                    "Bookmarks for hot-spots",
                  ]}
                />
              }
            />
            <FlipCard
              front={
                <CardFace
                  icon={<Lightbulb className="h-5 w-5" />}
                  title="Automate"
                  tone="sky"
                  text="Lights, plugs, and switches."
                />
              }
              back={
                <CardFaceBack
                  bullets={[
                    "Turn on perimeter lights after 22:00 on person",
                    "Gate relay pulse when trusted car is detected",
                    "Street siren test every Sunday 12:00",
                  ]}
                />
              }
            />
            <FlipCard
              front={
                <CardFace
                  icon={<Shield className="h-5 w-5" />}
                  title="Escalate"
                  tone="violet"
                  text="Link to armed response."
                />
              }
              back={
                <CardFaceBack
                  bullets={[
                    "Dry-contact into alarm/armed response radio",
                    "Only escalates on verified human",
                    "Audit trail kept in cloud clips",
                  ]}
                />
              }
            />
          </div>

          {/* MODE TOGGLE */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Zap className="h-4 w-4 text-emerald-600" />
                Always-on modes
              </div>
              <div className="flex items-center gap-2">
                <ModeChip
                  icon={<Sun className="h-4 w-4" />}
                  label="Day"
                  active={mode === "day"}
                  onClick={() => setMode("day")}
                />
                <ModeChip
                  icon={<Moon className="h-4 w-4" />}
                  label="Night"
                  active={mode === "night"}
                  onClick={() => setMode("night")}
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {mode === "day"
                ? "Day: lower sensitivity, no chimes, snapshot only for people/vehicles crossing a line."
                : "Night: higher sensitivity, indoor chime enabled, lights/siren can trigger on verified person."}
            </p>
          </div>

          {/* COMPLIANCE + CTA */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">
                Responsible, compliant installs
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>POPIA-aware setup with privacy zones and signage available.</li>
                <li>Wi-Fi dependent — we can add mesh/extenders if coverage is weak.</li>
                <li>Wired kits can include UPS options for power cuts.</li>
                <li>Site survey may affect final equipment mix and installation time.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">
                Ready to plan your street?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                We’ll propose a layout, bill of materials, and automation recipes
                based on your road shape and coverage goals.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/27794950855"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
                >
                  <PhoneCall className="h-5 w-5" />
                  WhatsApp us
                </a>
                <Link
                  to="/features"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---- UI bits ---- */
function OptionChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold ring-1",
        active
          ? "bg-emerald-600 text-white ring-emerald-600"
          : "bg-white text-emerald-700 ring-emerald-200 hover:bg-emerald-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ModeChip({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1",
        active
          ? "bg-emerald-600 text-white ring-emerald-600"
          : "bg-white text-emerald-700 ring-emerald-200 hover:bg-emerald-50",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function ExplainerChip({ icon, label, text, tone = "emerald" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    rose: "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200",
    indigo: "bg-indigo-50 text-indigo-800 ring-1 ring-inset ring-indigo-200",
    sky: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200",
    violet: "bg-violet-50 text-violet-800 ring-1 ring-inset ring-violet-200",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div
        className={`mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
      >
        <span className="grid h-4 w-4 place-items-center">{icon}</span>
        {label}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

function FlipCard({ front, back }) {
  return (
    <div className="group relative h-44 w-full cursor-pointer rounded-2xl bg-transparent [perspective:1000px]">
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm [backface-visibility:hidden]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

function CardFace({ icon, title, text, tone = "emerald" }) {
  const tint = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    indigo: "text-indigo-600",
    sky: "text-sky-600",
    violet: "text-violet-600",
  }[tone];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-full bg-slate-100 ${tint}`}>
          {icon}
        </span>
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

function CardFaceBack({ bullets = [] }) {
  return (
    <ul className="flex h-full list-disc flex-col justify-center gap-2 pl-5 text-sm text-slate-700">
      {bullets.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}
