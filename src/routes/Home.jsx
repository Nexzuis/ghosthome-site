import React from "react";
import {
  ScanEye,
  BellRing,
  Megaphone,
  Route as RouteIcon,
  Lightbulb,
  Shield,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import Hero from "../components/Hero.jsx";
import HowItWorksStory from "../components/HowItWorksStory.jsx";

/**
 * Home — hero + story unchanged.
 * Update: Flip-card row simplified; arrows no longer occupy grid columns.
 * - Plain wording that explains exactly what happens.
 * - Tiny arrow sits next to each card (desktop only) without adding spacing.
 * - Icon hover tooltips (title=...) summarise each step.
 */
export default function Home() {
  const cards = [
    {
      title: "Detect",
      tone: "emerald",
      icon: <ScanEye className="h-5 w-5" />,
      iconHint: "Person • Vehicle • Line crossing • Motion",
      frontText: "Person • Vehicle • Line crossing • Motion",
      backBullets: [
        "Smart zones focus on driveways/paths",
        "Classification reduces false alerts",
        "Snapshot saved for context",
      ],
    },
    {
      title: "Alert",
      tone: "amber",
      icon: <BellRing className="h-5 w-5" />,
      iconHint: "Snapshot + alarm so you actually notice",
      frontText: "Snapshot + alarm (you notice it).",
      backBullets: [
        "Notification includes a snapshot",
        "Indoor alarm can sound after hours",
        "Quieter day mode if needed",
      ],
    },
    {
      title: "Deter",
      tone: "rose",
      icon: <Megaphone className="h-5 w-5" />,
      iconHint: "Tracking ON • Camera alarm • Indoor alarm • Camera light",
      frontText:
        "Camera detects → tracking ON, camera + indoor alarm ring, camera light shines on the target.",
      backBullets: [
        "Turn motion tracking ON automatically",
        "Ring alarm at the camera and inside",
        "Camera spotlight turns ON and stays on target",
      ],
    },
    {
      title: "Track",
      tone: "indigo",
      icon: <RouteIcon className="h-5 w-5" />,
      iconHint: "Camera follows the person with the light on",
      frontText: "Camera follows the person with the light on.",
      backBullets: [
        "Auto-follow while the subject moves",
        "Simple presets (gate → driveway → front door)",
        "Keeps the target lit for clear footage",
      ],
    },
    {
      title: "Automations",
      tone: "sky",
      icon: <Lightbulb className="h-5 w-5" />,
      iconHint: "Camera alerts trigger other devices",
      frontText:
        "From camera alerts: turn on spotlights, turn on camera lights, ring other camera alarms, toggle plugs/switches.",
      backBullets: [
        "Link lights/switches to verified person events",
        "Trigger other cameras’ lights/alarms",
        "Create simple “if person → do X” recipes",
      ],
    },
    {
      title: "Escalate",
      tone: "violet",
      icon: <Shield className="h-5 w-5" />,
      iconHint: "Link to alarm panel / armed response",
      frontText: "Link to your alarm panel / armed response when needed.",
      backBullets: [
        "Dry-contact into alarm/response radio",
        "Only on verified human events",
        "Clips kept for audit trail",
      ],
    },
    {
      title: "Call armed response",
      tone: "emerald",
      icon: <PhoneCall className="h-5 w-5" />,
      iconHint: "Call from the app and share context",
      frontText: "Call from the app and share the snapshot/clip for context.",
      backBullets: [
        "Use the app to place the call",
        "Share the latest snapshot/clip",
        "Add what happened for rapid response",
      ],
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Existing hero (unchanged) */}
      <Hero />

      {/* Flip card row (plain copy, subtle arrows that don't affect layout) */}
      <section aria-labelledby="actions-heading" className="mt-8">
        <h2 id="actions-heading" className="sr-only">
          How Ghosthome acts
        </h2>

        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((c, idx) => (
            <div key={c.title} className="relative">
              <FlipCard front={<CardFace {...c} />} back={<CardFaceBack bullets={c.backBullets} />} />
              {/* Arrow floats beside the card (desktop only). No label; very small; no extra spacing. */}
              {idx < cards.length - 1 && (
                <ArrowRight
                  className="pointer-events-none absolute top-1/2 -right-2 hidden h-4 w-4 -translate-y-1/2 text-slate-300 lg:block"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-600">
          POPIA-aware setup with privacy zones & signage available. Wi-Fi dependent; mesh
          extenders may be required.
        </p>
      </section>

      {/* Existing interactive story (unchanged) */}
      <div className="mt-10">
        <HowItWorksStory />
      </div>
    </main>
  );
}

/* ---------- Local UI (kept inside Home so nothing else is touched) ---------- */

function FlipCard({ front, back }) {
  // Per-card state for mobile tap-to-flip; desktop uses hover.
  const [flipped, setFlipped] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className="group/flip relative h-44 w-full cursor-pointer rounded-2xl bg-transparent outline-none [perspective:1000px]"
      aria-pressed={flipped ? "true" : "false"}
    >
      <div
        className={[
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]",
          "group-hover/flip:[transform:rotateY(180deg)]",
          flipped ? "[transform:rotateY(180deg)]" : "",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm [backface-visibility:hidden]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          {back}
        </div>
      </div>
    </button>
  );
}

function CardFace({ icon, title, frontText, tone = "emerald", iconHint = "" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    rose: "bg-rose-50 text-rose-800 ring-rose-200",
    indigo: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    sky: "bg-sky-50 text-sky-800 ring-sky-200",
    violet: "bg-violet-50 text-violet-800 ring-violet-200",
  };
  const tint = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    indigo: "text-indigo-600",
    sky: "text-sky-600",
    violet: "text-violet-600",
  }[tone];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center gap-2">
        {/* Icon with native tooltip */}
        <span
          className={`grid h-8 w-8 place-items-center rounded-full bg-slate-100 ${tint}`}
          title={iconHint}
        >
          {icon}
        </span>
        {/* Wrap so long labels fit nicely */}
        <h3 className="max-w-[12rem] text-left text-base font-semibold leading-tight text-slate-900">
          {title}
        </h3>
      </div>

      {/* Plain, no-fuss line explaining what it does */}
      <div
        className={[
          "mt-2 inline-flex max-w-full items-center rounded-md px-2.5 py-1 text-xs leading-snug ring-1",
          tones[tone],
        ].join(" ")}
      >
        <span className="break-normal">{frontText}</span>
      </div>
    </div>
  );
}

function CardFaceBack({ bullets = [] }) {
  return (
    <ul className="flex h-full list-disc flex-col justify-center gap-2 pl-5 text-sm text-slate-700">
      {bullets.map((b) => (
        <li key={b} className="leading-snug">
          {b}
        </li>
      ))}
    </ul>
  );
}
