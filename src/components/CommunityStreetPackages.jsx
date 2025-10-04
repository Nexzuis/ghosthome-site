import React from "react";
import { Mail, Shield, Camera, Map, Cloud, Users } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * CommunityStreetPackages — GENERIC Community Access
 * - Generic (no zones/areas mentioned)
 * - Primary CTAs go to /signup (no WhatsApp)
 * - Email goes to support@Ghosthome.co.za
 * - Back-compat anchor: keeps hidden #street
 * - Visual style aligned with Packages/Home (neutral cards, soft tones)
 */

export default function CommunityStreetPackages() {
  return (
    <section className="mt-16" id="community-access" aria-labelledby="ca-heading">
      {/* Back-compat for older links */}
      <div id="street" className="sr-only" aria-hidden="true" />

      {/* Chip / label */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <Shield className="h-4 w-4" />
        Community Access
      </div>

      <h2 id="ca-heading" className="text-2xl font-bold tracking-tight text-slate-900">
        Street Cameras — Community Access Plans
      </h2>
      <p className="mt-1 text-slate-600">
        Residents may request permission-based access to the nearest route cameras with focused night viewing.
        POPIA-aware rules apply and activity is logged for accountability.
      </p>

      {/* Facts (generic) */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact icon={<Map className="h-4 w-4" />} label="Area" value="Your community (address-verified)" />
        <Fact icon={<Camera className="h-4 w-4" />} label="Coverage" value="Street corners & key routes" />
        <Fact icon={<Cloud className="h-4 w-4" />} label="Platform" value="VIGI Cloud + NVR" />
        <Fact icon={<Users className="h-4 w-4" />} label="Partners" value="Works with security companies" />
      </div>

      {/* Plans (no WhatsApp; CTAs → /signup) */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Plan
          name="Neighbour Access — 2 Cameras"
          price="R99 / month"
          bullets={[
            "Live view to 2 nearby route cameras",
            "1 account (single user)",
            "Night viewing window: 22:00–04:00",
            "No timeline export; activity is logged",
          ]}
        />

        <Plan
          name="Route Access — 4 Cameras"
          price="R149 / month"
          bullets={[
            "Live view to 4 nearby/route cameras",
            "2 accounts (e.g., you + partner)",
            "Night viewing window: 22:00–04:00",
            "No timeline export; activity is logged",
          ]}
          highlight
        />
      </div>

      {/* Contact + info (email → support@Ghosthome.co.za; primary CTA → /signup) */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Get access or ask a question</h3>
          <p className="mt-1 text-sm text-slate-600">
            We’ll verify your address, confirm the nearest cameras, and activate access under the community rules.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              Go to Sign-up
            </Link>
            <a
              href="mailto:support@Ghosthome.co.za"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              <Mail className="h-5 w-5" />
              support@Ghosthome.co.za
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            POPIA-aware: live view only; no audio; privacy masks on private areas; misuse leads to removal.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-base font-semibold text-slate-900">Working with security companies</h3>
          <p className="mt-1 text-sm text-slate-700">
            We partner with local security providers — granting controlled access to street cameras to help monitor and respond.
            This augments their services without replacing existing alarm systems.
          </p>
          <div className="mt-3 text-xs text-slate-600">
            Access is limited, logged, and scoped to the community’s rules. Incident clips are released only by authorised officers on lawful request.
          </div>
        </div>
      </div>

      {/* Gentle cross-links */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          to="/packages#community-access"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          View Street Plans
        </Link>
        <Link
          to="/privacy"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Our privacy approach
        </Link>
      </div>
    </section>
  );
}

/* ---------- UI bits ---------- */

function Fact({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700">
        {icon}
      </span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function Plan({ name, price, bullets = [], highlight = false }) {
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
      <div className="mt-1 text-2xl font-bold">{price}</div>
      <ul className="mt-3 space-y-1 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
        >
          Go to Sign-up
        </Link>
        <a
          href="mailto:support@Ghosthome.co.za"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-500/50 bg-transparent px-3 py-1.5 text-sm font-semibold hover:bg-white/5"
        >
          <Mail className="h-4 w-4" />
          Email support
        </a>
      </div>
      <p className="mt-3 text-xs opacity-80">
        Access windows and device limits apply. Terms subject to change per community rules.
      </p>
    </div>
  );
}
