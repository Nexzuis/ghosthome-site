import React from "react";
import {
  Camera,
  BellRing,
  Shield,
  AlarmClock,
  ArrowDown,
} from "lucide-react";

/**
 * HeroBullets
 * - Pills now FLIP on hover (desktop) and tap (mobile).
 * - "24/7 recording" -> "Smart recording".
 * - Adds a big callout box UNDER the pills with a downward arrow:
 *   "Automations for Home — integrate your security from a single trigger."
 * - No new libraries. Visual language stays: white cards, subtle rings, emerald accents.
 */

export default function HeroBullets() {
  const items = [
    {
      label: "AI detection",
      icon: <Camera className="h-4 w-4" />,
      backText: "Person • Vehicle • Line crossing • Motion",
      tooltip: "Detect: Person • Vehicle • Line crossing • Motion",
    },
    {
      label: "Indoor alarm",
      icon: <BellRing className="h-4 w-4" />,
      backText: "Alarm sounds inside for important events (optional).",
      tooltip: "Alert: Snapshot + alarm so you notice",
    },
    {
      label: "Camera light & siren",
      icon: <Shield className="h-4 w-4" />,
      backText: "Camera spotlight and alarm can activate automatically.",
      tooltip: "Deter/Track: Light on target + camera alarm",
    },
    {
      label: "Smart recording",
      icon: <AlarmClock className="h-4 w-4" />,
      backText: "Clips saved when there’s action—easy to review.",
      tooltip: "Evidence: Smart event clips",
    },
  ];

  return (
    <div className="mx-auto mt-6 max-w-4xl">
      {/* FLIP PILL GRID */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <FlipPill
            key={it.label}
            icon={it.icon}
            label={it.label}
            backText={it.backText}
            tooltip={it.tooltip}
          />
        ))}
      </div>

      {/* DOWN ARROW + BIG CALLOUT */}
      <div className="mt-6 flex flex-col items-center">
        <ArrowDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <div className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Automations for Home
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Single trigger → many actions
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-700">
            Integrate your security from a single camera alert: turn on
            spotlights, turn on camera lights, ring other camera alarms, and
            toggle plugs/switches. Your home becomes a <span className="font-semibold">ghosthome</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI: tiny flip-pill component ---------------- */

function FlipPill({ icon, label, backText, tooltip }) {
  const [flip, setFlip] = React.useState(false);

  return (
    <button
      type="button"
      title={tooltip}
      onClick={() => setFlip((v) => !v)}
      className="group relative h-12 w-full cursor-pointer rounded-2xl bg-transparent outline-none [perspective:800px]"
      aria-pressed={flip ? "true" : "false"}
    >
      <div
        className={[
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
          "group-hover:[transform:rotateY(180deg)]",
          flip ? "[transform:rotateY(180deg)]" : "",
        ].join(" ")}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200 [backface-visibility:hidden]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-700">
            {icon}
          </span>
          <span className="text-sm font-medium text-slate-800">{label}</span>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl bg-slate-50 px-3 py-2 shadow-sm ring-1 ring-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <p className="line-clamp-2 text-center text-sm leading-snug text-slate-700">
            {backText}
          </p>
        </div>
      </div>
    </button>
  );
}
