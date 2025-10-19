import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-emerald-50"
        >
          <img
            src="/logo.png"
            onError={(e) => (e.currentTarget.src = "/logo192.png")}
            alt="Ghosthome"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-sm font-semibold tracking-wide text-slate-800 group-hover:text-emerald-700">
            Ghosthome
          </span>
        </Link>

        <p className="text-center text-sm text-slate-600">
          © 2025 Ghosthome
        </p>
        <Analytics />
      </div>
    </footer>
  );
}
