import React, { useMemo, useState } from "react";
import { Shield, Camera, Route as RouteIcon } from "lucide-react";

/**
 * Community Street Packages (append-only section for the Packages page)
 * - Pure JSX (no TypeScript syntax)
 * - No prices. Max 2 cameras per package (plus a Custom option).
 * - Dark-neutral cards (not pure black); readable chips.
 * - Local filter + sort chips that do NOT affect the rest of the page.
 * - Drop-in section that can be appended below your existing Packages content.
 */
export default function CommunityStreetPackages() {
  const DATA = useMemo(
    () => [
      {
        id: "intersection-wirefree-2",
        title: "Intersection Corner Watch",
        subtitle: "2-Cam Wire-Free",
        tags: ["Street", "Wire-Free", "2 Cam", "Starter"],
        bullets: [
          "2 × wire-free bullets on opposite corners",
          "AI person/vehicle with fewer false alerts",
          "Snapshot in notification + indoor night chime",
          "Auto-deter: spotlight + short siren burst",
          "Optional solar trickle for chargers",
        ],
        icon: "camera",
      },
      {
        id: "entrance-wired-pt",
        title: "Street Entrance Sentinel",
        subtitle: "2-Cam Wired (PT + Bullet)",
        tags: ["Street", "Wired", "2 Cam", "Pan-Tilt", "Advanced"],
        bullets: [
          "1 × pan/tilt mid-street to track movement",
          "1 × fixed bullet facing entrance/boom",
          "Smart lights on verified human after 22:00",
          "Siren relay pulse on loitering",
          "UPS option for power cuts",
        ],
        icon: "route",
      },
      {
        id: "culdesac-wired-pt",
        title: "Cul-de-sac Guardian",
        subtitle: "2-Cam Wired (PT + Bullet)",
        tags: ["Street", "Wired", "2 Cam", "Pan-Tilt", "Premium"],
        bullets: [
          "PT camera at circle end to follow targets",
          "Fixed bullet at entrance with line-crossing rule",
          "Snapshot to your WhatsApp monitor group",
          "Optional armed-response dry-contact link",
          "POPIA signage & privacy zones available",
        ],
        icon: "shield",
      },
      {
        id: "custom-street-plan",
        title: "Custom Street Plan",
        subtitle: "Tailored layout & automations",
        tags: ["Street", "Custom"],
        bullets: [
          "We map your road and hotspots",
          "Pick wired / wire-free mix (max 2 cams typical)",
          "Optional pan/tilt tracking where it helps",
          "Privacy zones + POPIA signage included",
          "Armed response link available",
        ],
        icon: "shield",
      },
    ],
    []
  );

  const ALL_TAGS = ["Wire-Free", "Wired", "Pan-Tilt", "Starter", "Advanced", "Premium", "Custom"];

  const [activeTags, setActiveTags] = useState([]);
  const [sortBy, setSortBy] = useState("recommended"); // "recommended" | "az"

  const toggleTag = (t) =>
    setActiveTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const clearTags = () => setActiveTags([]);

  const filtered = useMemo(() => {
    let items = DATA.filter((p) =>
      activeTags.length === 0 ? true : activeTags.every((t) => p.tags.includes(t))
    );
    if (sortBy === "az") items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    return items;
  }, [DATA, activeTags, sortBy]);

  return (
    <section id="street" className="mt-10">
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <Shield className="h-4 w-4" />
          Community Street Packages
        </div>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Smart, community-run street security (max 2 cameras)
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          AI detect → snapshot + indoor chime → lights/siren deter → pan/tilt tracking → optional
          armed-response link. Wi-Fi dependent; mesh/UPS options available.
        </p>
      </div>

      {/* Local filter + sort */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {ALL_TAGS.map((t) => {
          const active = activeTags.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={[
                "rounded-md px-2 py-1 text-xs font-semibold ring-1",
                active
                  ? "bg-emerald-600 text-white ring-emerald-600"
                  : "bg-white text-emerald-700 ring-emerald-200 hover:bg-emerald-50",
              ].join(" ")}
              aria-pressed={active ? "true" : "false"}
            >
              {t}
            </button>
          );
        })}
        {activeTags.length > 0 && (
          <button
            type="button"
            onClick={clearTags}
            className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 underline underline-offset-2"
          >
            Clear
          </button>
        )}

        <div className="ml-auto inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortBy("recommended")}
            className={[
              "rounded-md px-2 py-1 text-xs font-semibold ring-1",
              sortBy === "recommended"
                ? "bg-slate-900 text-white ring-slate-900"
                : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            Recommended
          </button>
          <button
            type="button"
            onClick={() => setSortBy("az")}
            className={[
              "rounded-md px-2 py-1 text-xs font-semibold ring-1",
              sortBy === "az"
                ? "bg-slate-900 text-white ring-slate-900"
                : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            A→Z
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <StreetCard key={p.id} pkg={p} />
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Notes: Site survey may adjust final equipment mix. POPIA-aware setup with privacy zones and signage on request.
      </p>
    </section>
  );
}

function StreetCard({ pkg }) {
  const Icon = () => {
    if (pkg.icon === "route") return <RouteIcon className="h-5 w-5" />;
    if (pkg.icon === "shield") return <Shield className="h-5 w-5" />;
    return <Camera className="h-5 w-5" />;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 ring-1 ring-slate-700">
          <Icon />
        </div>
        <div>
          <h4 className="text-base font-semibold text-white">{pkg.title}</h4>
          <p className="text-xs text-slate-300">{pkg.subtitle}</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {pkg.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-100 ring-1 ring-inset ring-slate-600"
          >
            {t}
          </span>
        ))}
      </div>

      <ul className="space-y-1.5 text-sm text-slate-200">
        {pkg.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-x-10 -top-10 h-16 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
