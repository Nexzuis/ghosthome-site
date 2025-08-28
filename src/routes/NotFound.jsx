import React from "react";
import { Link } from "react-router-dom";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-slate-100">
          <Ghost className="h-7 w-7 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">404 — Page not found</h1>
        <p className="mt-2 text-slate-600">
          The page you’re looking for doesn’t exist. Use the navigation or head home.
        </p>
        <div className="mt-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
