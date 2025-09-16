import React from "react";
import { Link } from "react-router-dom";
import {
  PhoneCall,
  Mail,
  Shield,
  Camera,
  BellRing,
  ScanEye,
  Map,
  PlayCircle,
  Clock,
  Users,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Secure Street — Charlie Zone (Moreletapark)
 * Landing page to convince residents to join Community Watch access.
 * - Plans: R99 (2 cameras, 1 account) / R149 (4 cameras, 2 accounts)
 * - Annual prepay options: R1,099 and R1,299
 * - Benefits-focused; minimal tech specifics
 * - Smart notifications 21:00–05:00 (customisable)
 * - Same visual language; no new libraries
 */
export default function SecureStreet() {
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
              Charlie Zone • Moreletapark
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Join the <span className="text-emerald-600">Community Watch</span> — see your street, stay informed
            </h1>

            <p className="mt-3 text-slate-700">
              Subscribe to **street-camera access** for the roads leading to your home. Get
              night-time person-detection alerts and live view of the cameras closest to you —
              simple, compliant, and community-run.
            </p>

            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              <Benefit icon={<ScanEye className="h-4 w-4" />} text="Smart notifications for your selected cameras (21:00–05:00 by default — customisable on request)." />
              <Benefit icon={<BellRing className="h-4 w-4" />} text="See what triggered the alert with a snapshot + live view, so you can act fast." />
              <Benefit icon={<Lock className="h-4 w-4" />} text="POPIA-aware: privacy masks on private areas; resident access is limited and logged." />
              <Benefit icon={<Users className="h-4 w-4" />} text="Be part of a local watch — support the project and your neighbours." />
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://wa.me/27794950855"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
              >
                <PhoneCall className="h-5 w-5" />
                WhatsApp to join
              </a>
              <a
                href="mailto:ian@ghosthome.co.za"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <Mail className="h-5 w-5" />
                Email us
              </a>
              <Link
                to="/packages#charlie-zone"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <Camera className="h-5 w-5" />
                View plan breakdown
              </Link>
            </div>
          </div>

          {/* Right: demo video + static image slot (unchanged paths) */}
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
                Example street coverage (illustrative)
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                <img
                  src="/images/secure-street-overview.jpg"
                  alt="Illustrative diagram of street-pole camera coverage near home approaches"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                We focus views on public streets/sidewalks; privacy masks applied to private areas.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PLANS — quick choose (also duplicated in /packages#charlie-zone) */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Choose your access</h2>
        <p className="mt-1 text-sm text-slate-600">
          Access is scoped to cameras nearest your home (approach roads / entrances & exits). Times can be customised if needed.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <PlanCard
            name="Neighbour Access — 2 Cameras"
            monthly="R99 / month"
            annual="R1,099 / 12 months"
            saveNote="Save R89/year vs monthly"
            bullets={[
              "Live view to 2 nearby street cameras",
              "1 account (single user)",
              "Smart notifications 21:00–05:00 (customisable)",
              "Resident access is limited and logged",
            ]}
          />
          <PlanCard
            name="Route Access — 4 Cameras"
            monthly="R149 / month"
            annual="R1,299 / 12 months"
            saveNote="Save R489/year vs monthly"
            highlight
            bullets={[
              "Live view to 4 cameras on your routes",
              "2 accounts (e.g., you + partner)",
              "Smart notifications 21:00–05:00 (customisable)",
              "Resident access is limited and logged",
            ]}
          />
        </div>

        <div className="mt-4 text-xs text-slate-600">
          Online payment is coming soon. For now, WhatsApp or email and we’ll activate your access under the community rules.
        </div>
      </section>

      {/* HOW IT HELPS — short, plain sequence */}
      <section className="mt-10 grid gap-6 md:grid-cols-3">
        <InfoCard
          icon={<ScanEye className="h-5 w-5" />}
          title="See what matters"
          text="When a person is detected on your selected cameras at night, you get a clear notification so you can check quickly."
        />
        <InfoCard
          icon={<Clock className="h-5 w-5" />}
          title="Quiet by day"
          text="Daytime can be quieter by default. Need different hours? We can adjust the window to suit your household."
        />
        <InfoCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Simple & responsible"
          text="Resident access is scoped and logged. No public sharing. POPIA-aware setup with privacy masks and signage available."
        />
      </section>

      {/* CTA STRIP */}
      <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Ready to support your street?</h3>
            <p className="mt-1 text-sm text-slate-700">
              Join the Charlie Zone watch. We’ll confirm your nearest cameras and activate your access.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/27794950855"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
            >
              <PhoneCall className="h-5 w-5" />
              WhatsApp 079 495 0855
            </a>
            <a
              href="mailto:ian@ghosthome.co.za"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-emerald-700 hover:bg-emerald-50"
            >
              <Mail className="h-5 w-5" />
              ian@ghosthome.co.za
            </a>
            <Link
              to="/packages#charlie-zone"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-emerald-700 hover:bg-emerald-50"
            >
              View plan details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- Small UI helpers ---------- */

function Benefit({ icon, text }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-slate-700 ring-1 ring-slate-200">
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
        {icon}
        {title}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

function PlanCard({ name, monthly, annual, saveNote, bullets = [], highlight = false }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border p-5 shadow-sm",
        highlight
          ? "border-emerald-300 bg-slate-900 text-white"
          : "border-slate-200 bg-slate-800 text-slate-50",
      ].join(" ")}
    >
      {highlight && (
        <div className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 ring-1 ring-emerald-400/40">
          Popular
        </div>
      )}

      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="mt-1 text-2xl font-bold">{monthly}</div>
      <div className="mt-0.5 text-sm opacity-90">{annual}</div>
      <div className="text-xs opacity-80">{saveNote}</div>

      <ul className="mt-3 space-y-1 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href="https://wa.me/27794950855"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <PhoneCall className="h-4 w-4" />
          WhatsApp to activate
        </a>
        <a
          href="mailto:ian@ghosthome.co.za"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-500/50 bg-transparent px-3 py-1.5 text-sm font-semibold hover:bg-white/5"
        >
          <Mail className="h-4 w-4" />
          Email us
        </a>
      </div>
    </div>
  );
}
