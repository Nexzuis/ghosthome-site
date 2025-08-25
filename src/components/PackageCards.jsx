import { useState } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { makeWaLink, packageMessage } from "../lib/whatsapp.js";

/** ─────────────────────────────────────────────────────────
 *  DATA (shorter copy on the back; bigger, cleaner layout)
 *  ───────────────────────────────────────────────────────── */
const PACKS = [
  {
    slug: "streetsmart-2cam-ages-starter",
    name: "StreetSmart2CamAgesStarter",
    price: "R7 999",
    bullets: [
      "2× outdoor AI cameras",
      "Indoor chime + phone notifications",
      "Install & setup included",
    ],
    back: {
      includes: ["2× outdoor AI cams", "Indoor chime + alerts", "Install & setup"],
      addons: ["SD cards", "Smart light", "Wi-Fi extender"],
      note: "Wi-Fi dependent; extenders priced separately.",
    },
  },
  {
    slug: "family-guard-4cam",
    name: "FamilyGuard 4-Camera",
    price: "R11 499",
    bullets: [
      "4× mixed indoor/outdoor cameras",
      "Automations: lights + siren on detection",
      "Install & setup included",
    ],
    back: {
      includes: ["4× AI cams (in/outdoor)", "Lights + siren on detection", "Install & setup"],
      addons: ["Extra siren/chime", "Smart bulbs", "SD/NAS recording"],
      note: "Wi-Fi dependent; extenders priced separately.",
    },
  },
  {
    slug: "perimeter-pro-immortal-8cam",
    name: "PerimeterPro Immortal (8-Cam Wi-Fi)",
    price: "R19 999",
    bullets: [
      "8× Wi-Fi cameras",
      "Smart hub integration",
      "2× smart lights included",
      "Install & setup included",
    ],
    back: {
      includes: ["8× Wi-Fi AI cams", "Smart hub integration", "2× smart lights", "Install & setup"],
      addons: ["Mesh Wi-Fi nodes", "Extra lights", "UPS/mini-UPS"],
      note: "Wi-Fi dependent; extenders priced separately.",
    },
  },
];

/** ─────────────────────────────────────────────────────────
 *  CARD
 *  ───────────────────────────────────────────────────────── */
function PackCard({ p }) {
  const [flipped, setFlipped] = useState(false);

  const waHref = makeWaLink({
    message: packageMessage({ packageName: p.name, price: p.price }),
  });
  const contactHref = `/contact?package=${encodeURIComponent(p.slug)}`;

  const toggle = () => setFlipped(v => !v);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  };

  return (
    <div
      className="relative group cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={toggle}
      onKeyDown={onKey}
      tabIndex={0}
      aria-expanded={flipped}
      role="button"
      aria-label={`${p.name} details`}
    >
      <div
        className="relative rounded-2xl border border-neutral-200 bg-white shadow-sm min-h-[320px] transition-transform duration-500 group-hover:shadow-md"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl p-6" style={{ backfaceVisibility: "hidden" }}>
          <h3 className="font-semibold text-lg text-neutral-900">{p.name}</h3>
          <p className="text-3xl font-extrabold mt-2 text-neutral-900">
            {p.price}
            <span className="text-base text-neutral-500 font-normal"> incl. VAT</span>
          </p>
          <ul className="mt-4 space-y-2 text-[15px] text-neutral-700 list-disc list-inside">
            {p.bullets.map(b => <li key={b}>{b}</li>)}
          </ul>

          <div className="mt-6 flex items-center gap-2 text-brand">
            <span className="text-sm font-medium">More details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* BACK (bigger type, shorter copy) */}
        <div
          className="absolute inset-0 rounded-2xl p-7 text-white"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #00C2A6 0%, #008673 100%)",
          }}
        >
          <h3 className="font-semibold text-lg">{p.name}</h3>

          <div className="mt-4 grid gap-3">
            <div>
              <p className="text-base font-semibold">Includes</p>
              <p className="text-[15px] leading-snug opacity-95">{p.back.includes.join(" • ")}</p>
            </div>

            <div>
              <p className="text-base font-semibold">Add-ons</p>
              <p className="text-[15px] leading-snug opacity-95">{p.back.addons.join(" • ")}</p>
            </div>

            <p className="text-[13px] leading-snug opacity-95">{p.back.note}</p>
          </div>

          {/* CTAs */}
          <div className="mt-5 flex gap-2">
            <a
              href={contactHref}
              className="pointer-events-auto inline-flex items-center justify-center rounded-xl bg-white text-neutral-900 font-semibold px-5 py-2.5"
            >
              Get a quote
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white font-semibold px-4 py-2.5"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ─────────────────────────────────────────────────────────
 *  GRID WRAPPER
 *  ───────────────────────────────────────────────────────── */
export default function PackageCards() {
  return (
    <section className="py-8">
      <div className="grid md:grid-cols-3 gap-4">
        {PACKS.map(p => <PackCard key={p.slug} p={p} />)}
      </div>

      <p className="text-xs text-neutral-500 mt-3">
        Final layout confirmed after site check. Wi-Fi signal dependent; Wi-Fi extenders/mesh units priced separately.
      </p>
    </section>
  );
}
