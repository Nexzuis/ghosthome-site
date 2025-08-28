import React from "react";
import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function AppError() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const title = isRouteErrorResponse(error) ? error.statusText : "Unexpected Error";

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
          <AlertTriangle className="h-4 w-4" />
          Something went wrong
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {status} — {title}
        </h1>
        <p className="mt-2 text-slate-600">
          Sorry! That page failed to load. You can go back home and try again, or navigate using the menu.
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

        {process.env.NODE_ENV === "development" && !isRouteErrorResponse(error) && (
          <pre className="mt-6 overflow-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
            {String(error)}
          </pre>
        )}
      </div>
    </main>
  );
}
