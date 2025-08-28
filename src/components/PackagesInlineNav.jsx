import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

/**
 * Small, unobtrusive toolbar that appears on the Packages page ONLY.
 * Buttons:
 * - Back to Features
 * - Street page
 *
 * Visual language: whites/greys/slates + emerald accents (site default).
 * Safe edges: content padded and responsive.
 */
export default function PackagesInlineNav() {
  return (
    <div className="mt-8 mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-slate-900">
        All Packages
      </h2>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/features"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Features
        </Link>
        <Link
          to="/street"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          <Shield className="h-4 w-4" />
          Street page
        </Link>
      </div>
    </div>
  );
}
