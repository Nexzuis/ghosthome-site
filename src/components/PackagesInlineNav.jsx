import React from "react";
import { Link } from "react-router-dom";

/**
 * Small helper toolbar shown under /packages.
 * Links to normal packages (top) and the street/community section anchor.
 */
export default function PackagesInlineNav() {
  return (
    <nav className="mt-12 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          to="/packages"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
        >
          ↑ Back to top of packages
        </Link>
        <a
          href="#charlie-zone"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          Jump to Community Access
        </a>
      </div>
    </nav>
  );
}
