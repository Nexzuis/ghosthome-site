import { useState } from "react";
import {
  User, Car, Dog, MoveRight, AlertTriangle, // detections
  Zap, ShieldCheck, ShieldAlert               // extras
} from "lucide-react";

// --- Detections shown in the top strip ---
const DETECTIONS = [
  { icon: User,          title: "Person Detection" },
  { icon: Car,           title: "Vehicle Detection" },
  { icon: Dog,           title: "Pet Detection" },
  { icon: MoveRight,     title: "Line-Crossing" },
  { icon: AlertTriangle, title: "Tamper Detection" },
];

// --- Your three “extras” with flip text ---
const EXTRAS = [
  {
    icon: Zap,
    title: "Smart actions & automations",
    desc: "Trigger indoor chime, lights, and siren automatically on detections.",
    back: "Get an alarm inside your house when a person is detected — wake-up chime/siren so you actually wake up.",
    disclaimer: "Optional setup based on site conditions and consent.",
  },
  {
    icon: ShieldCheck,
    title: "Integration: normal alarm",
    desc: "Link events to your alarm panel and trigger armed response.",
    back: "We integrate into your normal alarm for armed response, sending a proper alarm signal to your monitoring provider.",
    disclaimer: "Professional configuration required. POPIA-aware zones apply.",
  },
  {
    icon: ShieldAlert,
    title: "Integration: armed response",
    desc: "Work with your alarm monitoring provider for triggers",
    back: "Other triggers can be added: turn on lights, enable camera motion-tracking, and use on-camera alarms to deter intruders.",
    disclaimer: "Optional add-ons; final design depends on your site survey.",
  },
];

// Reusable flip card (hover desktop, tap mobile)
function FlipCard({ icon: Icon, title, desc, back, disclaimer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(v => !v)}
      style={{ perspective: "1000px" }}
      aria-label={title}
    >
      <div
        className="relative rounded-2xl border border-neutral-200 shadow-sm min-h-[190px]"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 600ms",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl bg-white p-5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="inline-flex items-center justify-center rounded-lg w-11 h-11 text-white"
               style={{ backgroundColor: "#00C2A6" }}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="mt-3 font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-700 mt-1">{desc}</p>
        </div>

        {/* BACK (solid teal) */}
        <div
          className="absolute inset-0 rounded-2xl p-5 text-white"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", backgroundColor: "#00C2A6" }}
        >
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm mt-2 leading-relaxed">{back}</p>
          {disclaimer && (
            <p className="text-[11px] mt-3 opacity-90">{disclaimer}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeatureStripHome() {
  return (
    <section className="mt-8 space-y-6">
      {/* Detections strip – now in logo teal tint */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#EAFBF7", borderColor: "rgba(0, 194, 166, 0.25)" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {DETECTIONS.map((d) => (
            <div key={d.title} className="flex items-center gap-3 rounded-xl p-2">
              <span
                className="inline-flex items-center justify-center rounded-lg w-11 h-11 text-white"
                style={{ backgroundColor: "#00C2A6" }}
              >
                <d.icon className="w-6 h-6" />
              </span>
              <span className="text-sm font-medium text-neutral-900">{d.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations / automations (flip cards) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXTRAS.map((x) => (
          <FlipCard
            key={x.title}
            icon={x.icon}
            title={x.title}
            desc={x.desc}
            back={x.back}
            disclaimer={x.disclaimer}
          />
        ))}
      </div>
    </section>
  );
}
