import React from "react";
import { Link } from "react-router-dom";
import {
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
  Route as RouteIcon,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Secure Street — Community Access (Generic)
 * Purpose: Narrative landing page that explains the street-camera concept,
 * why it exists, and how it works — then funnels to Packages/Signup.
 * - No zone names; generic, address-verified access.
 * - Primary CTAs go to /signup and /packages#community-access.
 * - Email goes to support@Ghosthome.co.za.
 * - Night alerts aligned to 22:00–04:00.
 */

export default function SecureStreet() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO — narrative intro matching Home style */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 shadow-sm sm:p-8">
        {/* soft glow accents */}
        <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative grid gap-8 md:grid-cols-2"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Community Access
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Street-camera access for residents —{" "}
              <span className="text-emerald-600">see your route, act faster</span>
            </h1>

            <p className="mt-3 text-slate-700">
              A calm, rules-based way for neighbours to view the route cameras closest to their address.
              You get focused night alerts (22:00–04:00) with context — while access stays permission-based
              and POPIA-aware.
            </p>

            <ul className="mt-4 grid gap-2 text-sm text-slate-700">
              <Benefit icon={<ScanEye className="h-4 w-4" />} text="AI flags the events that matter; you see a snapshot and can review quickly." />
              <Benefit icon={<BellRing className="h-4 w-4" />} text="Night alerts only (22:00–04:00) by default — less noise, more signal." />
              <Benefit icon={<Lock className="h-4 w-4" />} text="POPIA-aware: privacy masks on private areas; access is limited & activity logged." />
              <Benefit icon={<Users className="h-4 w-4" />} text="Built with CPF leaders & security partners for faster, more coordinated response." />
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Get Community Access
              </Link>
              <Link
                to="/packages#community-access"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                <Camera className="h-5 w-5" />
                View plans & pricing
              </Link>
              <a
                href="mailto:support@Ghosthome.co.za"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                <Mail className="h-5 w-5" />
                support@Ghosthome.co.za
              </a>
            </div>
          </div>

          {/* Right: demo video + static image slot (paths unchanged) */}
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
                Views are focused on public streets/sidewalks; privacy masks applied to private areas.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* WHY THIS EXISTS — give the page a reason */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Why Community Access exists</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<RouteIcon className="h-5 w-5" />}
            title="Route context matters"
            text="Criminal movement follows streets and paths. Seeing your approach routes gives earlier warning and better decisions."
          />
          <InfoCard
            icon={<BellRing className="h-5 w-5" />}
            title="Signal over noise"
            text="Night-hours alerts (22:00–04:00) reduce notification fatigue and increase the odds that residents act on the right events."
          />
          <InfoCard
            icon={<Shield className="h-5 w-5" />}
            title="Shared accountability"
            text="Access is logged, clips/bookmarks are traceable, and partners engage with context. It builds trust in the process."
          />
        </div>
      </section>

      {/* HOW IT WORKS — consistent with Home page */}
      <section className="mt-12">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 sm:p-8">
          <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Street network
            </div>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">How it works</h2>
            <p className="mt-2 max-w-3xl text-slate-700">
              Residents get permission-based access to the route cameras closest to their address. Alerts are focused on the night window.
              CPF leaders coordinate; security partners respond with the right context.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Step
                icon={<Camera className="h-6 w-6" />}
                title="Detect"
                text="Strategic poles cover routes & entrances. AI flags people/vehicles that matter."
              />
              <Step
                icon={<BellRing className="h-6 w-6" />}
                title="Alert"
                text="You receive a night-hours alert with snapshot + short clip for quick review."
              />
              <Step
                icon={<RouteIcon className="h-6 w-6" />}
                title="Review"
                text="Trace movement across adjoining streets via simple bookmarks."
              />
              <Step
                icon={<Shield className="h-6 w-6" />}
                title="Escalate"
                text="One-tap call to response; partners join with clear context."
              />
            </div>
          </div>
        </div>
      </section>

      {/* LIGHT PRICING CUE — don’t duplicate Packages; link through */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Plans & eligibility</h2>
        <p className="mt-2 max-w-3xl text-slate-700">
          Access is address-verified and permission-based. Pricing and plan details are listed on the Street Access
          packages page. You can start with 2 route cameras (1 user) or upgrade to 4 (2 users).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/packages#community-access"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            View plans & sign up
          </Link>
          <a
            href="mailto:support@Ghosthome.co.za"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            support@Ghosthome.co.za
          </a>
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Fair-use applies. WhatsApp delivery optional; email/phone alerts can be discussed with partners. Data retention follows the community policy.
        </p>
      </section>

      {/* FAQ — light, useful context */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Frequently asked</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FAQ
            q="Can I watch all cameras?"
            a="No. Access is permission-based and scoped to the route cameras nearest your address. This keeps it useful and privacy-respectful."
          />
          <FAQ
            q="Do I get alerts all day?"
            a="By default, alerts are focused on night-hours (22:00–04:00). We can adjust the window for special needs on request."
          />
          <FAQ
            q="Who can get access?"
            a="Residents in the coverage area, CPF leaders under an MoU, and vetted security partners may receive scoped access."
          />
          <FAQ
            q="Are my views tracked?"
            a="Yes. Activity is logged and incident clips/bookmarks are released only by authorised officers on lawful request."
          />
        </div>
      </section>

      {/* CTA STRIP — final push */}
      <section className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Ready to support your street?</h3>
            <p className="mt-1 text-sm text-slate-700">
              We’ll verify your address, confirm the nearest cameras, and activate your access under the rules.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              Get Community Access
            </Link>
            <Link
              to="/packages#community-access"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              View plans
            </Link>
            <a
              href="mailto:support@Ghosthome.co.za"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              Contact support
            </a>
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

function Step({ icon, title, text }) {
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

function FAQ({ q, a }) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-5 transition">
      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300">
        {q}
      </summary>
      <p className="mt-2 text-sm text-slate-600">{a}</p>
    </details>
  );
}
