// src/components/PackageCard.jsx
import React from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PackageCard({
  title,
  bullets = [],
  tags = [],
  badge,               // e.g. "Starter" | "Advanced" | "Premium"
  to = "/packages",    // click-through (kept same as before)
  whatsapp = "https://wa.me/27794950855?text=Hi%20Ghosthome%2C%20I%27m%20interested%20in%20a%20package",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className="group relative h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-transparent hover:shadow-md"
    >
      {/* top row */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {badge ? (
          <span
            className={[
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              badge === "Premium"
                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                : badge === "Advanced"
                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                : "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
            ].join(" ")}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {/* tags / chips */}
      {tags?.length ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span
              key={i}
              className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* bullets */}
      <ul className="mb-4 space-y-2 text-sm text-slate-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* CTA row (note: NO price shown anywhere) */}
      <div className="mt-auto flex items-center gap-2">
        <Link
          to={to}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          See details
          <ChevronRight className="h-4 w-4" />
        </Link>

        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <MessageSquare className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </div>

      {/* subtle hover outline */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl ring-1 ring-transparent transition group-hover:ring-emerald-200/70" />
    </motion.div>
  );
}
