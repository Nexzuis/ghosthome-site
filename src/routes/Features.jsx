import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BellRing,
  Siren,
  Camera,
  Scan,
  Crosshair,
  Dog,
  Car,
  User,
  ShieldAlert,
  AlarmClockCheck,
  Lightbulb,
  PlugZap,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";

export default function Features() {
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setFlash(false), 5000); // flash for 5s
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      {/* local styles for subtle flash + float animations */}
      <style>{`
        @keyframes flashGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, .55); }
          50% { box-shadow: 0 0 0 14px rgba(239, 68, 68, .08); }
        }
        .flash-on { animation: flashGlow 1.2s ease-in-out infinite; }
        .flash-off { animation: none; }
        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .floaty { animation: floaty 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .flash-on, .floaty { animation: none; } }
      `}</style>

      {/* TOP FLASHING TIP (now RED) */}
      <div
        className={[
          "relative mb-10 rounded-2xl border border-red-200 bg-red-50/70 p-5 sm:p-6",
          flash ? "flash-on" : "flash-off",
        ].join(" ")}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-red-600/10 p-2 text-red-700">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-red-900">
                Always-on modes (day & night) + indoor chime = you actually wake up.
              </p>
              <p className="mt-1 text-sm text-red-900/80">
                Uses a <span className="font-semibold">separate loud alarm</span> outside, rings an{" "}
                <span className="font-semibold">indoor chime</span> for night alerts, and{" "}
                <span className="font-semibold">links to your existing alarm panel & armed response</span> when needed.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 pt-2 sm:pt-0">
            <Link
              to="/packages"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
            >
              View packages <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/27794950855"
              className="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-red-700 hover:bg-red-50"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* HERO EXPLAINER BOX */}
      <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Smart CCTV that <span className="text-emerald-600">acts</span>, not just records
            </h1>
            <p className="mt-3 text-slate-600">
              Traditional alarms shout and flash a zone. <span className="font-semibold">Ghosthome</span> gives you
              context: <span className="font-medium">AI</span> detects who/what, sends a snapshot, follows movement,
              rings an indoor chime at night, and can turn lights/sirens on automatically — or even link to{" "}
              <span className="font-medium">armed response</span>.
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FeatureLine icon={<User />} text="Person detection (cut false alarms)" />
              <FeatureLine icon={<Dog />} text="Pet detection" />
              <FeatureLine icon={<Car />} text="Vehicle detection" />
              <FeatureLine icon={<Crosshair />} text="Line-crossing zones" />
              <FeatureLine icon={<Camera />} text="Motion tracking on supported cams" />
              <FeatureLine icon={<BellRing />} text="Indoor chime (night wake-ups)" />
              <FeatureLine icon={<Siren />} text="Separate loud outdoor siren ready" />
              <FeatureLine icon={<PlugZap />} text="Links to normal alarm & armed response" />
            </ul>
            <div className="mt-6 flex gap-3">
              <Link
                to="/packages"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700"
              >
                See smart packages <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/27794950855"
                className="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-emerald-700 hover:bg-emerald-50"
              >
                Chat to design yours
              </a>
            </div>
          </div>

          {/* Advantages card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Why it’s better (at a glance)</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Advantage icon={<Scan />} title="AI identification" desc="Person / pet / vehicle, not just 'motion'." />
              <Advantage icon={<Camera />} title="Tracking" desc="Pan/tilt follow on supported models." />
              <Advantage icon={<BellRing />} title="Snapshot + chime" desc="See faces in the alert, wake up at night." />
              <Advantage icon={<Lightbulb />} title="Automations" desc="Turn on lights / plugs / sirens automatically." />
              <Advantage icon={<AlarmClockCheck />} title="Always-on" desc="Day & night modes stay armed." />
              <Advantage icon={<ShieldAlert />} title="Integrates" desc="Link to your alarm & armed response." />
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON: TRAD VS GHOSTHOME */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <CompareCard
          title="Traditional alarm (PIR + beams)"
          tone="bad"
          points={[
            "Loud siren + vague zone. No visual.",
            "No snapshot or proof in the moment.",
            "Reactive: wake up, guess, call a patrol.",
            "False alarms lead to alarm fatigue.",
          ]}
        />
        <CompareCard
          title="Ghosthome smart CCTV & automations"
          tone="good"
          points={[
            "AI: person / pet / vehicle with line-crossing.",
            "Snapshot preview in notification (see the face).",
            "Spotlight, tracking & siren for active deterrence.",
            "Indoor chime + always-on modes = you respond.",
          ]}
        />
      </div>

      {/* FLOATING SLOGANS */}
      <div className="mx-auto mb-14 max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            "Proof, not guesswork",
            "Wake-up alerts that matter",
            "Fewer false alarms",
            "Deterrence built-in",
            "Works with your alarm",
            "Street & home ready",
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

      {/* FINAL CTA */}
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-xl font-extrabold text-slate-900">
          Ready to upgrade from <span className="text-emerald-600">guesswork</span> to{" "}
          <span className="text-emerald-600">proof</span>?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/packages"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700"
          >
            Build my package
          </Link>
          <a
            href="https://wa.me/27794950855"
            className="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-emerald-700 hover:bg-emerald-50"
          >
            WhatsApp a specialist
          </a>
        </div>
      </div>
    </div>
  );
}

/* ───────── helpers ───────── */

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
            {good ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <XCircle className="mt-0.5 h-5 w-5 text-slate-400" />}
            <span className="text-sm text-slate-700">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
