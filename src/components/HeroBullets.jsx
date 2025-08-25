import { Camera, BellRing, ShieldAlert, AlarmClockCheck } from "lucide-react";

const ITEMS = [
  {
    id: "ai",
    icon: Camera,
    base: "AI detection",
    hover: "Detect person — fewer false alarms.",
    grad: "from-blue-600 to-indigo-500",
  },
  {
    id: "chime",
    icon: BellRing,
    base: "Indoor chime",
    hover: "Ring an alarm inside your house to wake you up.",
    grad: "from-rose-500 to-fuchsia-500",
  },
  {
    id: "night",
    icon: ShieldAlert,
    base: "Night colour vision",
    hover: "Detect accurately at night when it matters.",
    grad: "from-amber-500 to-orange-500",
  },
  {
    id: "record",
    icon: AlarmClockCheck,
    base: "24/7 recording",
    hover: "Smart recordings and clips.",
    grad: "from-sky-500 to-blue-500",
  },
];

function Bullet({ item }) {
  const Icon = item.icon;
  return (
    <div className="group flex items-center gap-3">
      {/* colourful icon badge */}
      <span
        className={`inline-flex items-center justify-center rounded-lg w-9 h-9 text-white shadow-sm
                    bg-gradient-to-br ${item.grad}
                    transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className="w-5 h-5" />
      </span>

      {/* text swaps on hover/tap */}
      <span className="relative text-sm text-neutral-800 leading-tight">
        <span className="block group-hover:hidden">{item.base}</span>
        <span className="hidden group-hover:block transition-opacity duration-150">
          {item.hover}
        </span>
      </span>
    </div>
  );
}

export default function HeroBullets() {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {ITEMS.map((it) => (
        <Bullet key={it.id} item={it} />
      ))}
    </div>
  );
}
