import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  BellRing,
  Siren,
  Camera,
  Scan,
  Crosshair,
  Dog,
  Car,
  User,
  BatteryCharging,
  Wifi,
  Lightbulb,
  PlugZap,
  Wrench,
  Home,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";

export default function About() {
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setFlash(false), 5000); // 5s flash on first load
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <style>{`
        @keyframes flashGlow { 0%,100%{ box-shadow:0 0 0 0 rgba(239,68,68,.55)} 50%{ box-shadow:0 0 0 14px rgba(239,68,68,.08)} }
        .flash-on{ animation: flashGlow 1.1s ease-in-out infinite }
        .flash-off{ animation: none }
        @keyframes floaty { 0%,100%{ transform:translateY(0)} 50%{ transform:translateY(-6px) }}
        .floaty{ animation: floaty 4.5s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce){ .flash-on,.floaty{ animation: none } }
      `}</style>

      {/* FLASHING SECURITY / AUTOMATION STRIP */}
      <div className={["relative mb-8 rounded-2xl border p-5 sm:p-6",
          flash ? "flash-on border-red-300 bg-red-50/80" : "flash-off border-red-200 bg-red-50"
        ].join(" ")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-red-600/10 p-2 text-emerald-700">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-red-900">
                Always‑On Security + Automation: Indoor Chime, Separate Loud Siren, Alarm Integration.
              </p>
              <p className="mt-1 text-sm text-red-900/80">
                Configure <span className="font-semibold">day & night modes</span> so when a <span className="font-semibold">person</span> enters your property, the <span className="font-semibold">chime wakes you</span>, lights can turn on, and an <span className="font-semibold">external siren</span> or your <span className="font-semibold">existing alarm</span> can trigger armed response.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link to="/packages" className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700">
              Build my system <ChevronRight className="ml-1 h-4 w-4"/>
            </Link>
            <a href="https://wa.me/27794950855" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-emerald-700 hover:bg-emerald-50">
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* STORY HERO */}
      <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Security that thinks. Automation that acts.
            </h1>
            <p className="mt-3 text-slate-600">
              <span className="font-semibold">Ghosthome</span> was born because SA homes needed more than a siren and a guess. After <span className="font-semibold">15 years</span> across military, corporate, and residential security, our founder got a pricey quote for a "normal" alarm that was still blind. He built his own: <span className="font-semibold">AI cameras</span>, <span className="font-semibold">indoor chime</span>, and <span className="font-semibold">automations</span> that wake you, show you <em>who/what</em>, and deter — not just record. Neighbours noticed. Word spread. Ghosthome launched to make this <span className="font-semibold">affordable</span> for more families.
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FeatureLine icon={<User/>} text="Person detection cuts false alarms"/>
              <FeatureLine icon={<Dog/>} text="Pet detection smart filtering"/>
              <FeatureLine icon={<Car/>} text="Vehicle detection & snapshots"/>
              <FeatureLine icon={<Crosshair/>} text="Line‑crossing rules at gates & drives"/>
              <FeatureLine icon={<Camera/>} text="Motion tracking on supported models"/>
              <FeatureLine icon={<BellRing/>} text="Indoor chime for night wake‑ups"/>
              <FeatureLine icon={<Siren/>} text="Separate loud siren ready"/>
              <FeatureLine icon={<PlugZap/>} text="Links to alarm & armed response"/>
            </ul>
          </div>

          {/* Advantages side card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Why homeowners switch</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Advantage icon={<Scan/>} title="AI identification" desc="Person / pet / vehicle — not just 'motion'."/>
              <Advantage icon={<Camera/>} title="Tracking" desc="Pan/tilt follow on supported cams."/>
              <Advantage icon={<BellRing/>} title="Snapshot + chime" desc="See faces in the alert, wake up at night."/>
              <Advantage icon={<Lightbulb/>} title="Automations" desc="Turn on lights / plugs / sirens automatically."/>
              <Advantage icon={<Wifi/>} title="Wi‑Fi survey" desc="We test coverage; extenders/mesh if needed."/>
              <Advantage icon={<BatteryCharging/>} title="Backup power" desc="Router UPS → inverter/solar options."/>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TIMELINE */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900">From one home to many</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TimelineStep icon={<Wrench/>} title="Frustration" desc="Expensive, blind 'normal' alarm quotes."/>
          <TimelineStep icon={<Home/>} title="First build" desc="AI CCTV + chime + automations at home."/>
          <TimelineStep icon={<Users/>} title="Business" desc="Ghosthome rolls out across SA homes."/>
        </div>
      </section>

      {/* WIFI & POWER BANNER (dismissible could be added later if needed) */}
      <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-700 ring-1 ring-slate-200">
              <Wifi className="h-5 w-5"/>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Wi‑Fi dependent</p>
              <p className="text-sm text-slate-600">We validate coverage; recommend <span className="font-medium">extenders/mesh</span> where needed for rock‑solid alerts and streams.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-slate-100 p-2 text-slate-700 ring-1 ring-slate-200">
              <BatteryCharging className="h-5 w-5"/>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Backup power options</p>
              <p className="text-sm text-slate-600">From small router/ONT UPS to full inverter/solar — keep your system live during loadshedding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON CARDS */}
      <section className="mb-14">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Old alarm vs Ghosthome</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CompareCard
            title="Traditional alarm (PIR + beams)"
            tone="bad"
            points={[
              "Loud siren + vague zone. No visual proof.",
              "False alarms (pets, wind, insects) → alarm fatigue.",
              "Reactive: wake up, guess, phone around, then call.",
              "No way to verify who/what triggered it in the moment.",
            ]}
          />
          <CompareCard
            title="Ghosthome smart CCTV & automation"
            tone="good"
            points={[
              "AI identifies person / pet / vehicle + line‑crossing rules.",
              "Snapshot preview in the alert — see the face/vehicle instantly.",
              "On‑camera spotlight/siren + indoor chime to wake the house.",
              "Automations + alarm/armed‑response link for fast action.",
            ]}
          />
        </div>
      </section>

      {/* FLOATING SLOGANS */}
      <section className="mx-auto mb-12 max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "See more. Guess less.",
            "Wake. Verify. Deter.",
            "Snapshot > Siren.",
            "Security + Automation.",
            "Works with your alarm.",
            "Scale as you grow.",
          ].map((label, i) => (
            <span
              key={label}
              className="floaty select-none rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm"
              style={{ animationDelay: `${(i % 4) * 0.25}s` }}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-xl font-extrabold text-slate-900">
          Ready for <span className="text-emerald-600">Security</span> + <span className="text-emerald-600">Automation</span> that actually acts?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/packages" className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700">
            Design my system
          </Link>
          <a href="https://wa.me/27794950855" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-emerald-700 hover:bg-emerald-50">
            WhatsApp a specialist
          </a>
        </div>
      </section>
    </div>
  );
}

/* ——— Helpers ——— */
function FeatureLine({ icon, text }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="mt-0.5 text-emerald-700">{icon}</span>
      <span className="text-sm text-slate-700">{text}</span>
    </li>
  );
}

function Advantage({ icon, title, desc }) {
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

function TimelineStep({ icon, title, desc }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700 ring-1 ring-slate-200">{icon}</div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function CompareCard({ title, points, tone }) {
  const good = tone === "good";
  return (
    <div className={["rounded-2xl border p-6", good ? "border-red-200 bg-red-50/70" : "border-slate-200 bg-white"].join(" ")}>
      <h3 className={["mb-4 text-lg font-bold", good ? "text-red-900" : "text-slate-900"].join(" ")}>{title}</h3>
      <ul className="space-y-2">
        {points.map((p, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {good ? (<CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600"/>) : (<XCircle className="mt-0.5 h-5 w-5 text-slate-400"/>)}
            <span className="text-sm text-slate-700">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
