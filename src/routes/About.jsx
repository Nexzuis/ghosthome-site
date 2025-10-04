import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield, Camera, BellRing, Users, Map, Route as RouteIcon, Lock,
  CheckCircle2, ArrowRight, ScanEye, Clock, LineChart, Lightbulb, PlugZap, Target
} from "lucide-react";

export default function About() {
  const [flash, setFlash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setFlash(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* ORIGIN + PROMISE */}
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Shield className="h-4 w-4" />
              Our story & promise
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              We help communities take back their streets.
            </h1>
            <p className="mt-3 text-slate-700">
              Ghosthome started because alarms were loud but blind. We built a system that can{" "}
              <span className="font-semibold">see</span> and <span className="font-semibold">act</span>:
              street-first cameras, clever human analytics, and night alerts that residents actually notice.
              Today we work with CPFs/HOAs and security partners to <span className="font-semibold">virtually close</span>{" "}
              neighbourhoods — responsibly and at scale.
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="text-base font-bold text-emerald-900">Our coverage promise</h3>
              <ul className="mt-2 space-y-2 text-sm text-emerald-900">
                <li className="flex items-start gap-2">
                  <Target className="mt-0.5 h-4 w-4" />
                  <span><span className="font-semibold">Aim: nearly every street corner</span> in your area watched — approaches, crossings, and cut-throughs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <LineChart className="mt-0.5 h-4 w-4" />
                  <span><span className="font-semibold">Adaptive rollout:</span> when new hotspots arise, we shift/add poles to cover them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4" />
                  <span><span className="font-semibold">Night alerts (22:00–04:00 by default)</span>, tuned for attention — not noise.</span>
                </li>
              </ul>
            </div>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              <Point icon={<Camera />} text="Street-first: entrances, routes & corners" />
              <Point icon={<ScanEye />} text="Clever human analytics (no FR)" />
              <Point icon={<BellRing />} text="Resident alerts with snapshot at night" />
              <Point icon={<Users />} text="Partner monitoring with audit trails" />
              <Point icon={<Lock />} text="POPIA-aware: privacy masks, no audio, logged access" />
            </ul>
          </div>

          {/* Quick impact / proof panel */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900">What a “virtual closure” means</h3>
            <p className="mt-1 text-sm text-slate-700">
              No booms. We design a pole-grid so cameras watch the ways in/out and across your area. Residents see what matters at night; partners can monitor; incidents are quicker to detect, verify and escalate.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Metric label="Street corners" value="Most/near-all" note="phased by priority" />
              <Metric label="Cameras" value="2× per pole" note="both directions" />
              <Metric label="Alert window" value="22:00–04:00" note="customisable" />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Final design after route survey & community input. We adapt as patterns change.
            </p>
          </aside>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-12">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <Map className="h-4 w-4" />
          How we build, monitor and evolve your watch
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <Step
            icon={<RouteIcon className="h-6 w-6" />}
            title="Design the grid"
            text="We map entrances/exits, crossings, and common walk-throughs. Poles are placed to see public space without filming into homes."
          />
          <Step
            icon={<Camera className="h-6 w-6" />}
            title="Deploy & deter"
            text="Reliable cameras with spotlights/sirens where useful. Privacy masks enforced; signage installed."
          />
          <Step
            icon={<ScanEye className="h-6 w-6" />}
            title="Enable analytics"
            text="Human-centric detection + line-crossing rules. Snapshot in the alert so residents verify in seconds."
          />
          <Step
            icon={<BellRing className="h-6 w-6" />}
            title="Alert & escalate"
            text="Residents get night alerts; security partners receive context to prioritise and respond quickly. We adapt coverage as hotspots emerge."
          />
        </div>
      </section>

      {/* VALUE FOR RESIDENTS & PARTNERS */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Card title="For Residents" badge="Live view + focused night alerts">
          <List items={[
            "Choose nearby route cameras; get person-movement alerts at night (22:00–04:00 default).",
            "Snapshot + quick live view = faster verification.",
            "Indoor chime to wake lightly; optional external siren link.",
            "Clear route-based reporting to CPF/HOA and armed response.",
          ]}/>
        </Card>
        <Card title="For Security Partners" badge="Context, not noise">
          <List items={[
            "Scoped, lawful access for control room/patrols.",
            "Context-rich call-outs by route/corner; faster prioritisation.",
            "Evidence bookmarks & exports via Information Officer on lawful request.",
            "Full audit trail to support SLAs and community trust.",
          ]}/>
        </Card>
      </section>

      {/* POWER & CONNECTIVITY */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Info
          icon={<Lightbulb />}
          title="Connectivity that keeps up"
          text="We validate Wi-Fi per pole and specify mesh/4G where needed. Stable links mean faster alerts and clearer streams."
          bullets={["Wi-Fi survey & mesh guidance", "Optional 4G for edge poles", "Bitrate tuned per location"]}
        />
        <Info
          icon={<PlugZap />}
          title="Loadshedding resilience"
          text="From router UPS to dedicated backup for wired/PoE poles, we keep the grid awake when the grid naps."
          bullets={["Low-cost UPS options", "PoE/wired or solar-assist choices", "Health monitoring & maintenance plans"]}
        />
      </section>

      {/* BRING GHOSTHOME TO YOUR AREA */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Bring Ghosthome to your neighbourhood</h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PlayStep n="1" title="Intro & map">
            Share hotspots and routes. We sense-check feasibility and scale.
          </PlayStep>
          <PlayStep n="2" title="Street survey">
            Confirm pole points, power & connectivity; draft phased plan.
          </PlayStep>
          <PlayStep n="3" title="Community brief">
            Coverage, POPIA, partner roles, resident plans — clear and simple.
          </PlayStep>
          <PlayStep n="4" title="Phase 1 install">
            Priority corners go live. Analytics alert. Partners onboard for monitoring.
          </PlayStep>
        </ol>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/packages#community-access"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            View resident plans
          </Link>
          <a
            href="mailto:support@ghosthome.co.za"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            support@ghosthome.co.za
          </a>
        </div>
      </section>

      {/* FAQ / COMPLIANCE */}
      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Common questions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Faq q="Is this POPIA-compliant?" a="Yes. Cameras on private property aimed at public streets/sidewalks; permanent privacy masks; logged resident access; live-view only for residents; exports via IO on lawful request; signage on entry points." />
          <Faq q="Do you really cover almost every corner?" a="That’s the goal. We phase installs, then adapt. If a hotspot pops up, we shift/add a pole. The grid evolves with your area." />
          <Faq q="What will I receive at home?" a="Live view of selected route cameras and human-detection alerts at night (22:00–04:00 default). You’ll get a snapshot and can jump to live view immediately." />
          <Faq q="How do we start?" a="Reach out with a map. We’ll propose a phased plan with clear roles for residents, CPF/HOA and partners." />
        </div>
      </section>
    </main>
  );
}

/* ——— Small components ——— */
function Point({ icon, text }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="mt-0.5 text-emerald-700">{icon}</span>
      <span className="text-sm text-slate-700">{text}</span>
    </li>
  );
}

function Metric({ label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-900">{value}</div>
      {note && <div className="text-xs text-slate-600">{note}</div>}
    </div>
  );
}

function Step({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        {icon}
        {title}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

function Card({ title, badge, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        {badge}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function List({ items = [] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((p) => (
        <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function Info({ icon, title, text, bullets = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
        {icon}
        {title}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
      {bullets?.length > 0 && (
        <ul className="mt-2 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlayStep({ n, title, children }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        {n}
        <span className="text-slate-700">{title}</span>
      </div>
      <p className="text-sm text-slate-700">{children}</p>
    </li>
  );
}

function Faq({ q, a }) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
        {q}
      </summary>
      <p className="mt-2 text-sm text-slate-700">{a}</p>
    </details>
  );
}
