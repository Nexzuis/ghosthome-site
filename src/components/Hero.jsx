import React from "react";
import { Link } from "react-router-dom";
import { Shield, Camera, ArrowRight } from "lucide-react";

/**
 * Street-first hero with subtle gradient energy behind it,
 * clearer headline hierarchy and stronger CTA hover states.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
      {/* Decorative soft gradients (non-intrusive) */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-12 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Copy column */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <Camera className="h-4 w-4" />
            <span>Community street-camera network</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Safer streets through shared visibility & partner escalation
          </h1>

          <p className="mt-3 text-base text-slate-700">
            We deploy street-level cameras across your neighbourhood, give residents route access,
            and integrate security partners for faster, context-rich response. Less noise. More action when it counts.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" /> Night alerts focus (23:00–04:00) so you only get what matters</li>
            <li className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" /> Shareable snapshots & clips for neighbours and partners</li>
            <li className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" /> Transparent audit trail keeps everyone accountable</li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Sign up for street access
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              How it works
            </a>
          </div>

          <p className="mt-3 text-xs text-slate-600">
            POPIA-aware setup with privacy masking & signage. Access is permission-based; data retention follows community policy.
          </p>
        </div>

        {/* Minimal emblem to balance space without noise */}
        <div className="shrink-0">
          <div className="grid h-28 w-28 place-items-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
            <Shield className="h-10 w-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
