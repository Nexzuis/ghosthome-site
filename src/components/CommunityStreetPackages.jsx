import React from "react";
import { PhoneCall, Mail, Shield, Camera, Map, Cloud, Users } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * CommunityStreetPackages — UPDATED for Charlie Zone (Moreletapark)
 * - Keeps the original idea of a section appended to /packages
 * - Presents subscription access plans (R99 / R149) with clear terms
 * - Includes pilot facts (±20 poles • ±40 cameras), partners note, CTAs
 * - Back-compat anchor: has both #charlie-zone and hidden #street anchors
 * - Dark neutral card backgrounds to match Packages visual language
 */

export default function CommunityStreetPackages() {
  return (
    <section className="mt-16" id="charlie-zone" aria-labelledby="cz-heading">
      {/* Back-compat for older links */}
      <div id="street" className="sr-only" aria-hidden="true" />

      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <Shield className="h-4 w-4" />
        Charlie Zone • Moreletapark — Community Access
      </div>

      <h2 id="cz-heading" className="text-2xl font-bold tracking-tight text-slate-900">
        Street Cameras — Community Access Plans
      </h2>
      <p className="mt-1 text-slate-600">
        Pilot coverage on street corners and key entrances/exits. Residents can subscribe to view
        cameras nearest their home at night, with simple, POPIA-aware rules.
      </p>

      {/* Pilot facts */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact icon={<Map className="h-4 w-4" />} label="Area" value="Charlie Zone, Moreletapark" />
        <Fact icon={<Camera className="h-4 w-4" />} label="Scale (pilot)" value="±20 poles • ±40 cameras" />
        <Fact icon={<Cloud className="h-4 w-4" />} label="Platform" value="VG Cloud + NVR" />
        <Fact icon={<Users className="h-4 w-4" />} label="Partners" value="Works with security companies" />
      </div>

      {/* Plans */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Plan
          name="Neighbour Access — 2 Cameras"
          price="R99 / month"
          bullets={[
            "Live view to 2 nearby street cameras",
            "1 account (single user)",
            "Night viewing window: 21:00–05:00",
            "No timeline export; activity is logged",
          ]}
        />

        <Plan
          name="Route Access — 4 Cameras"
          price="R149 / month"
          bullets={[
            "Live view to 4 nearby/route cameras",
            "2 accounts (e.g., you + partner)",
            "Night viewing window: 21:00–05:00",
            "No timeline export; activity is logged",
          ]}
          highlight
        />
      </div>

      {/* Contact + partner note */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Get access or ask a question</h3>
          <p className="mt-1 text-sm text-slate-600">
            We’ll confirm your nearest cameras and activate your account under the community rules.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
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
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              <Mail className="h-5 w-5" />
              ian@ghosthome.co.za
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            POPIA-aware: live view only; no audio; privacy masks on private areas; misuse leads to removal.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-base font-semibold text-slate-900">Working with security companies</h3>
          <p className="mt-1 text-sm text-slate-700">
            We partner with local security providers — granting controlled access to street cameras to help
            them monitor and respond. This augments their services without replacing existing alarm systems.
          </p>
          <div className="mt-3 text-xs text-slate-600">
            Access is limited, logged, and scoped to the community’s rules. Incident clips are released only by authorised officers on lawful request.
          </div>
        </div>
      </div>

      {/* Gentle cross-link */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          to="/street"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back to Secure Street
        </Link>
        <Link
          to="/features"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          See how the system acts
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
      <p className="mt-3 text-xs opacity-80">
        Coverage is determined by nearest vantage points. Access window and device limits apply. Terms subject to change per community rules.
      </p>
    </div>
  );
}
