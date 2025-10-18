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
  Users,
  CheckCircle2,
  Lock,
  Route as RouteIcon,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Secure Street — Community Access
 * - Residents: live view of nearest route cameras; scoped, logged access.
 * - Night focus: 23:00–04:00.
 * - Alerts: CPF patrollers may receive clip notifications; residents use live view + event banners in-app.
 * - Keep three media placeholders (video + two images) in a unified style.
 */

export default function SecureStreet() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Community Access
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Street-camera access for residents —{" "}
            <span className="text-emerald-600">see your route, act faster</span>
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            A calm, rules-based way for neighbours to view the{" "}
            <span className="font-semibold">route cameras closest to their address</span>. The system focuses on
            <span className="font-semibold"> 23:00–04:00</span> so you only see what matters. Access is permission-based and
            POPIA-aware.
          </p>

          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <Benefit
              icon={<ScanEye className="h-4 w-4" />}
              text="AI flags the right activity; you can open the app to view it live with context."
            />
            <Benefit
              icon={<BellRing className="h-4 w-4" />}
              text="Night focus: 23:00–04:00. CPF patrollers may receive clip notifications; residents use live view."
            />
            <Benefit
              icon={<Lock className="h-4 w-4" />}
              text="POPIA-aware: privacy masks where required; access is scoped & logged with audit trails."
            />
            <Benefit
              icon={<Users className="h-4 w-4" />}
              text="Built with CPF leaders & security partners for faster, coordinated response."
            />
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              Get Community Access
            </Link>
            <Link
              to="/packages#community-access"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              <Camera className="h-5 w-5" />
              View plans & pricing
            </Link>
            <a
              href="mailto:support@Ghosthome.co.za"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              <Mail className="h-5 w-5" />
              support@Ghosthome.co.za
            </a>
          </div>
        </motion.div>
      </section>

      {/* MEDIA STRIP — 3 matching cards (video + two images) */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <MediaCard
          kind="video"
          label="Ghosthome camera demo"
          note=""
        >
          <video
            src="/videos/detection-demo.mp4"
            muted
            playsInline
            loop
            autoPlay
            className="h-full w-full object-cover"
          />
        </MediaCard>

        <MediaCard
          label="Street person detection"
          note=""
        >
          <img
            src="/images/secure-street-overview.jpg"
            alt="Illustrative diagram of street-pole camera coverage near home approaches"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </MediaCard>

        <MediaCard
          label="Simple App intergration for residents"
          note=""
        >
          <img
            src="/images/secure-street-ui.jpg"
            alt="Example resident live view UI"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </MediaCard>
      </section>

      {/* WHY THIS EXISTS */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Why Community Access exists</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<RouteIcon className="h-5 w-5" />}
            title="Route context matters"
            text="Criminal movement follows streets and paths. Seeing your approach routes gives earlier warning and cleaner decisions."
          />
          <InfoCard
            icon={<BellRing className="h-5 w-5" />}
            title="Signal over noise"
            text="A focused night window (23:00–04:00) reduces alert fatigue and keeps attention for what matters."
          />
          <InfoCard
            icon={<Shield className="h-5 w-5" />}
            title="Shared accountability"
            text="Access is logged and exports are controlled. Partners engage with context, building trust across the street."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
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
              Residents get permission-based live view of the route cameras closest to their address. CPF leaders coordinate; security partners respond with context. It’s a simple, reliable, and auditable way to support your street at night.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Step
                icon={<Camera className="h-6 w-6" />}
                title="Detect"
                text="Strategic poles cover routes & entrances. AI flags people/vehicles that matter."
              />
              <Step
                icon={<BellRing className="h-6 w-6" />}
                title="Focus"
                text="Night window 23:00–04:00. Residents use live view; CPF patrollers may receive clip notifications."
              />
              <Step
                icon={<RouteIcon className="h-6 w-6" />}
                title="Review"
                text="Quickly check your approach routes and share context into CPF/HOA channels."
              />
              <Step
                icon={<Shield className="h-6 w-6" />}
                title="Escalate"
                text="One-tap call to response; partners align with the community SOP."
              />
            </div>
          </div>
        </div>
      </section>

      {/* LIGHT PRICING CUE */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Plans & eligibility</h2>
        <p className="mt-2 max-w-3xl text-slate-700">
          Access is address-verified and permission-based. Start with two nearby route cameras (1 user) or upgrade to four (2 users) — all scoped to your street network.
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
          Fair-use applies. Access remains scoped to your address; audit logs and privacy signage support are provided.
        </p>
      </section>

      {/* FAQ — concise & resident-friendly */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Frequently asked</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FAQ
            q="What do I get as a resident?"
            a="Live view of the route cameras closest to your address during the night focus, with simple tools to share context into CPF/HOA channels."
          />
          <FAQ
            q="Do I get phone push notifications?"
            a="Push notifications are reserved for vetted CPF patrollers. Residents use the app’s live view and event banners during 23:00–04:00."
          />
          <FAQ
            q="Who verifies access?"
            a="Access is linked to your verified residential address. The community/HOA and Ghosthome team approve and scope it."
          />
          <FAQ
            q="How is privacy handled?"
            a="POPIA-aware by design: privacy masks, scoped roles, logged access, and controlled exports through authorised officers only."
          />
        </div>
      </section>

      {/* CTA STRIP */}
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

function MediaCard({ children, label, note, kind = "image" }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-video w-full overflow-hidden rounded-b-none">
        {children}
      </div>
      <figcaption className="px-3 py-2">
        <div className="text-xs font-semibold text-slate-900">{label}</div>
        <div className="text-[11px] text-slate-600">
          {kind === "video" ? <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" /> {note}</span> : note}
        </div>
      </figcaption>
    </figure>
  );
}

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
