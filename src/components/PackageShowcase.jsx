// src/components/PackageShowcase.jsx
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, RefreshCcw } from "lucide-react";
import PackageCard from "./PackageCard";

const ALL_PACKAGES = [
  {
    id: "street-starter",
    title: "StreetSmart 2-Cam Starter",
    badge: "Starter",
    tags: ["2 Cam", "Wire-Free", "AI"],
    bullets: [
      "2× outdoor AI cameras",
      "Indoor chime + phone notifications",
      "Install & setup included",
    ],
    facets: { cams: 2, type: "wirefree", tier: "starter" },
  },
  {
    id: "family-4cam",
    title: "FamilyGuard 4-Camera",
    badge: "Advanced",
    tags: ["4 Cam", "Mixed wired/wire-free"],
    bullets: [
      "4× mixed indoor/outdoor cameras",
      "Automations: lights + siren on detection",
      "Install & setup included",
    ],
    facets: { cams: 4, type: "mixed", tier: "advanced" },
  },
  {
    id: "perimeter-8cam",
    title: "PerimeterPro Immortal (8-Cam Wi-Fi)",
    badge: "Premium",
    tags: ["8 Cam", "Wire-Free", "Hub integration"],
    bullets: [
      "8× Wi-Fi cameras",
      "Smart hub integration",
      "2× smart lights included",
    ],
    facets: { cams: 8, type: "wirefree", tier: "premium" },
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "2", label: "2 Cam" },
  { key: "4", label: "4 Cam" },
  { key: "8", label: "8 Cam" },
  { key: "wirefree", label: "Wire-Free" },
  { key: "wired", label: "Wired" },
  { key: "mixed", label: "Mixed" },
  { key: "starter", label: "Starter" },
  { key: "advanced", label: "Advanced" },
  { key: "premium", label: "Premium" },
];

export default function PackageShowcase() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return ALL_PACKAGES;
    if (["2", "4", "8"].includes(active)) {
      return ALL_PACKAGES.filter((p) => String(p.facets.cams) === active);
    }
    // type or tier
    return ALL_PACKAGES.filter(
      (p) =>
        p.facets.type === active ||
        p.facets.tier === active
    );
  }, [active]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={[
                "rounded-full border px-3 py-1 text-sm transition",
                active === f.key
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setActive("all")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
            title="Reset filters"
          >
            <RefreshCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((pkg) => (
            <PackageCard
              key={pkg.id}
              title={pkg.title}
              bullets={pkg.bullets}
              tags={pkg.tags}
              badge={pkg.badge}
              to="/packages"
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
