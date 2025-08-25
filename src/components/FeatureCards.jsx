import { CircuitBoard, Siren, BellRing, MousePointer2, LockKeyhole, Cable } from "lucide-react";

const FEATURES = [
  { icon: Siren, title: "Alarms that wake you", desc: "Trigger indoor chime/sirens and smart lights automatically" },
  { icon: MousePointer2, title: "Smart detections", desc: "People, pets, and vehicles — reduce false alerts" },
  { icon: LockKeyhole, title: "POPIA-aware setup", desc: "Privacy signage and sensible zones; you stay compliant" },
  { icon: Cable, title: "Wired or wireless", desc: "From quick installs to pro-grade wiring and PoE" },
  { icon: CircuitBoard, title: "Integrations", desc: "Automations with hubs, lights, and routines" },
];

export default function FeatureCards() {
  return (
    <section className="py-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <f.icon className="w-6 h-6 text-brand" />
            <h3 className="mt-3 font-semibold text-neutral-900">{f.title}</h3>
            <p className="text-sm text-neutral-600 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
