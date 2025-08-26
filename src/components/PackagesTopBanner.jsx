// src/components/PackagesTopBanner.jsx
import React from "react";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";

export default function PackagesTopBanner() {
  return (
    <div className="mt-3 flex flex-col items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white shadow-sm ring-1 ring-emerald-200">
          <Tag className="h-4 w-4 text-emerald-700" />
        </span>
        <p className="text-sm sm:text-base">
          <strong>Packages from R3 999</strong> — all the way to{" "}
          <strong>complete custom</strong> designs & installs.
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          to="/contact"
          className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Get a quote
        </Link>
        <a
          href="https://wa.me/27794950855"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          WhatsApp us
        </a>
      </div>
    </div>
  );
}
