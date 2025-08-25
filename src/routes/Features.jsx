import {
  User, Car, Dog, MoveRight, AlertTriangle,       // detections
  Zap, BellRing, ShieldCheck, ShieldAlert, Lightbulb // extras
} from "lucide-react";

const DETECTIONS = [
  { icon: User,          title: "Person Detection" },
  { icon: Car,           title: "Vehicle Detection" },
  { icon: Dog,           title: "Pet Detection" },
  { icon: MoveRight,     title: "Line-Crossing" },
  { icon: AlertTriangle, title: "Tamper Detection" },
];

const EXTRAS = [
  {
    icon: Zap,
    title: "Smart actions & automations",
    desc: "Trigger indoor chime, lights, and siren automatically on detections.",
  },
  {
    icon: ShieldCheck,
    title: "Integration to normal alarm",
    desc: "Link camera events to your alarm panel via relay/bridge for verified triggers.",
  },
  {
    icon: ShieldAlert,
    title: "Integration to armed response",
    desc: "Work with your monitoring provider for signal + video verification (site survey required).",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-8 space-y-8">
      {/* Detections strip (blue like your screenshot) */}
      <div className="rounded-2xl border border-feature/20 bg-feature-50 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {DETECTIONS.map((d) => (
            <div
              key={d.title}
              className="flex items-center gap-3 rounded-xl bg-white/60 md:bg-transparent p-3 md:p-2"
            >
              <div className="inline-flex items-center justify-center rounded-lg border border-feature/30 bg-white text-feature w-9 h-9">
                <d.icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium text-neutral-800">{d.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Extras / integrations (white cards) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXTRAS.map((x) => (
          <div key={x.title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-lg border border-feature/30 bg-feature-50 text-feature w-10 h-10">
              <x.icon className="w-5 h-5" />
            </div>
            <h3 className="mt-3 font-semibold text-neutral-900">{x.title}</h3>
            <p className="text-sm text-neutral-600 mt-1">{x.desc}</p>
            {x.title.includes("armed response") && (
              <p className="text-xs text-neutral-500 mt-2">
                *Optional pro setup. Consent & POPIA-aware zones apply.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
