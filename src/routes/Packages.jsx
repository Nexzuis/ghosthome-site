import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeInfo,
  ChevronRight,
  X,
  Link2,
  ArrowLeftRight,
  MessageSquare,
  Copy,
  Check,
  Camera,
  CheckCircle2,
  PlayCircle,
  Map,
  Shield,
  Handshake,
  Layers,
  Target,
} from "lucide-react";
import PackagesTopBanner from "../components/PackagesTopBanner.jsx";

/** tiny class joiner (no external deps) */
const cx = (...xs) => xs.filter(Boolean).join(" ");

/* =========================
   THEME — align to signup
   =========================
   If your signup page uses a different brand colour, swap these tokens.
*/
const SIGNUP_SOLID_BTN = "bg-emerald-600 hover:bg-emerald-700 text-white";
const SIGNUP_SOFT_BG   = "bg-emerald-50";
const SIGNUP_SOFT_RING = "ring-emerald-200";
const SIGNUP_BORDER    = "border-emerald-200";
const SIGNUP_TEXT      = "text-emerald-700";

/* ------------------------- SHARED: Street plan card ------------------------- */
function PriceCard({ title, price, subtitle, features = [], highlight = false, ctaLabel, to }) {
  return (
    <div
      className={[
        "rounded-2xl border p-5 transition",
        highlight ? `${SIGNUP_BORDER} ${SIGNUP_SOFT_BG}` : "border-slate-200 bg-white",
        "hover:-translate-y-0.5 hover:shadow-md",
      ].join(" ")}
    >
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-bold text-slate-900">{price}</span>
        {subtitle ? <span className="pb-1 text-sm text-slate-600">{subtitle}</span> : null}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className={cx(
          "mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none",
          highlight
            ? `${SIGNUP_SOLID_BTN} focus-visible:ring-2 focus-visible:ring-emerald-300`
            : "border border-slate-300 text-slate-700 hover:bg-white focus-visible:ring-2 focus-visible:ring-slate-300"
        )}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

/* ------------------------- HOME GRID DATA (unchanged) ------------------------- */
const PACKAGES = [
  {
    id: "pkg-doorbell",
    title: "Doorbell System",
    tags: ["Doorbell", "Starter"],
    bullets: [
      "Smart video doorbell (two-way talk, person detection, visitor chime).",
      "2 × smart buttons (arm/disarm, panic trigger).",
      "Indoor chime + snapshot alerts.",
    ],
    details: {
      bestFor: "Front door control, parcels, intercom replacement.",
      includes: ["1× Video Doorbell", "2× Smart Buttons (assignable)", "Indoor chime-capable hub"],
      features: ["AI person detection", "Snapshot to phone", "Night vision", "Alarm/armed response link capable"],
    },
  },
  {
    id: "pkg-2-wirefree",
    title: "2-Camera Wire-Free Starter",
    tags: ["2 Cam", "Wire-Free", "Starter"],
    bullets: [
      "2 × battery + solar outdoor cameras with AI (person/pet/vehicle).",
      "Spotlight + siren deterrence; snapshot alerts to phone.",
      "Hub with indoor chime for night alerts.",
    ],
    details: {
      bestFor: "Quick perimeter cover with minimal drilling.",
      includes: ["2× Wi-Fi battery cams", "Solar trickle or chargers", "Chime hub"],
      features: ["AI person/pet/vehicle detection", "Line-crossing rules", "Automations (lights/plugs)", "Optional alarm I/O link"],
    },
  },
  {
    id: "pkg-2-wired",
    title: "2-Camera Wired Starter",
    tags: ["2 Cam", "Wired", "Starter"],
    bullets: [
      "2 × wired 3MP outdoor cameras, night vision, spotlight + siren.",
      "Great for entrances/driveways; stable video & power.",
      "Indoor chime for night alerts.",
    ],
    details: {
      bestFor: "Entrances/driveways with stable POE or cabled power.",
      includes: ["2× 3MP wired cams", "Power/POE supplies", "Chime hub"],
      features: ["AI filtering", "Spotlight & siren deterrence", "Schedules & arming profiles", "Alarm/armed response link capable"],
    },
  },
  {
    id: "pkg-doorbell-2wired",
    title: "Doorbell + 2-Camera Wired (Pan/Tilt)",
    tags: ["Doorbell", "2 Cam", "Wired", "Advanced", "Pan/Tilt"],
    bullets: [
      "Doorbell + 2 × pan/tilt outdoor cams with motion tracking.",
      "Line-crossing rules for gates & paths.",
      "Indoor chime + snapshot alerts.",
    ],
    details: {
      bestFor: "Front gate + approach tracking with door control.",
      includes: ["1× Doorbell", "2× Pan/Tilt outdoor cams", "Chime hub"],
      features: ["Motion tracking (PT)", "Line-crossing & zones", "Automations (lights/sirens)", "Alarm panel link capable"],
    },
  },
  {
    id: "pkg-4-wirefree",
    title: "4-Camera Wire-Free System",
    tags: ["4 Cam", "Wire-Free", "Advanced"],
    bullets: [
      "4 × wire-free outdoor cameras for flexible perimeter coverage.",
      "AI detections + spotlight/siren deterrence.",
      "Smart automations for lights & sirens.",
    ],
    details: {
      bestFor: "Medium homes where drilling is hard or rental properties.",
      includes: ["4× Wi-Fi cams", "Hub with chime"],
      features: ["AI person/pet/vehicle", "Line-crossing", "Automations", "Optional alarm link"],
    },
  },
  {
    id: "pkg-4-wired",
    title: "4-Camera Wired System",
    tags: ["4 Cam", "Wired", "Advanced"],
    bullets: [
      "4 × wired 3MP cameras with night vision + deterrence.",
      "Great for higher-traffic angles; strong bitrate and power.",
      "Indoor chime + snapshot alerts.",
    ],
    details: {
      bestFor: "Driveways + street-facing coverage in busy areas.",
      includes: ["4× Wired cams", "Power/POE", "Chime hub"],
      features: ["AI filtering", "Spotlight & siren", "Schedules/arming", "Alarm/armed response link capable"],
    },
  },
  {
    id: "pkg-6-wirefree",
    title: "6-Camera Wire-Free Advanced",
    tags: ["6 Cam", "Wire-Free", "Advanced"],
    bullets: [
      "6 × wire-free cams + advanced hub (AI storage, chime).",
      "Mix of fixed and pan/tilt where needed.",
      "Automations on lights, plugs, sirens.",
    ],
    details: {
      bestFor: "Larger homes needing flexible mounting.",
      includes: ["6× Wi-Fi cams", "Advanced hub"],
      features: ["AI person/pet/vehicle", "PT on selected angles", "Automations", "Optional alarm link"],
    },
  },
  {
    id: "pkg-6-wired",
    title: "6-Camera Wired Advanced",
    tags: ["6 Cam", "Wired", "Advanced"],
    bullets: [
      "6 × wired 3MP cameras + advanced hub for bigger sites.",
      "Line-crossing at gates/driveways; snapshot alerts.",
      "Ready for alarm panel link & armed response.",
    ],
    details: {
      bestFor: "Full perimeter + driveway with stable cabling.",
      includes: ["6× Wired cams", "POE/power", "Advanced hub"],
      features: ["AI + line-crossing", "Lighting siren automations", "Schedules & arming", "Alarm/armed response link"],
    },
  },
  {
    id: "pkg-8-wirefree",
    title: "8-Camera Wire-Free Premium",
    tags: ["8 Cam", "Wire-Free", "Premium", "Pan/Tilt"],
    bullets: [
      "8 × wire-free cams (add pan/tilt on key angles).",
      "Advanced hub for large coverage automations.",
      "Mesh/extenders available if Wi-Fi needs help.",
    ],
    details: {
      bestFor: "Large properties that prefer cable-free installs.",
      includes: ["8× Wi-Fi cams", "Advanced hub"],
      features: ["AI detection suite", "PT tracking on key angles", "Automations", "Alarm link capable"],
    },
  },
];

const TAGS = ["Doorbell", "Wire-Free", "Wired", "Pan/Tilt", "2 Cam", "4 Cam", "6 Cam", "8 Cam", "Starter", "Advanced", "Premium"];

/* ------------------------------ small helpers ------------------------------ */
const useCopySignal = () => {
  const [copied, setCopied] = useState(null);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1200);
    return () => clearTimeout(t);
  }, [copied]);
  return [copied, setCopied];
};

function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  return Promise.resolve();
}

/* -------------------------------- main page -------------------------------- */
export default function Packages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState([]);
  const [drawerPkg, setDrawerPkg] = useState(null);
  const [copiedId, setCopiedId] = useCopySignal();

  // compare
  const [compareSel, setCompareSel] = useState([]); // array of ids
  const [comparePair, setComparePair] = useState(null); // actual objects
  const compareRef = useRef(null);

  // open from deep link
  useEffect(() => {
    const id = searchParams.get("pkg");
    if (!id) return;
    const p = PACKAGES.find((x) => x.id === id);
    if (p) setDrawerPkg(p);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return PACKAGES;
    return PACKAGES.filter((p) => selectedTags.every((t) => p.tags.includes(t)));
  }, [selectedTags]);

  const clearFilters = () => setSelectedTags([]);

  const toggleTag = (t) =>
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const toggleCompare = (id) =>
    setCompareSel((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });

  const doCompare = () => {
    if (compareSel.length !== 2) return;
    const pair = compareSel.map((id) => PACKAGES.find((p) => p.id === id));
    setComparePair(pair);
    setTimeout(() => {
      compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const clearCompare = () => {
    setCompareSel([]);
    setComparePair(null);
  };

  const openDrawer = (pkg) => {
    setDrawerPkg(pkg);
    const next = new URL(window.location.href);
    next.searchParams.set("pkg", pkg.id);
    window.history.replaceState({}, "", next);
  };

  const closeDrawer = () => {
    setDrawerPkg(null);
    const next = new URL(window.location.href);
    next.searchParams.delete("pkg");
    window.history.replaceState({}, "", next);
  };

  return (
    <div className="bg-white">
      <div id="packages-top" className="mx-auto max-w-7xl px-4 py-8">
        {/* Title row */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Street Access, Partner Packages & Home Systems</h1>
          <div className="hidden items-center gap-2 text-slate-500 sm:flex">
            <Camera className="h-4 w-4 text-emerald-600" />
            <span className="text-sm">Choose what fits your need</span>
          </div>
        </div>

        {/* quick anchors for clarity */}
        <div className="mb-6 flex flex-wrap gap-2">
          <a href="#track-street" className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Street Access</a>
          <a href="#track-partners" className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-100">Security Partner Packages</a>
          <a href="#track-home" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 hover:bg-amber-100">Home Systems</a>
        </div>

        {/* ===================== TRACK 1: STREET ACCESS (Residents) ===================== */}
        <section id="track-street" className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-6 sm:p-8">
          {/* soft accents */}
          <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

          <div className="relative">
            <div className={cx("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ring-1", "bg-white/90", SIGNUP_TEXT, "ring-emerald-200")}>
              🟩 Street Access (Residents)
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Live view on your route, focused night alerts</h2>
            <p className="mt-2 max-w-3xl text-slate-700">
              Residents get <span className="font-semibold">permission-based live view</span> on nearby street cameras.
              Alerts are focused on <span className="font-semibold">23:00–04:00</span> to reduce noise.{" "}
              <span className="font-semibold">Vetted CPF patrollers</span> may receive clip notifications. Security partners escalate with context.
            </p>

            {/* small media strip (compact visuals) */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-slate-200">
                <img
                  src="/images/secure-street-overview.jpg"
                  alt="Street-pole camera coverage near approaches"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-slate-200">
                <video
                  src="/videos/detection-demo.mp4"
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-slate-200">
                <img
                  src="/images/street-chip-strip.jpg"
                  alt="Quick visual chips showing alert and live view concepts"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <PlayCircle className="h-4 w-4" /> Detection demo is muted. Residents see live view during the night window.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <PriceCard
                title="Neighbour Plan"
                price="R99"
                subtitle="/month"
                features={["2 route cameras", "1 user account", "Night focus (23:00–04:00) — live view"]}
                ctaLabel="Sign up"
                to="/signup"
              />
              <PriceCard
                title="Street Plan"
                price="R149"
                subtitle="/month"
                features={["4 route cameras", "2 user accounts", "Night focus (23:00–04:00) — live view"]}
                highlight
                ctaLabel="Sign up"
                to="/signup"
              />
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">Need something else?</h3>
                <p className="mt-2 text-sm text-slate-700">We can help you choose the right access based on your address and routes.</p>
                <div className="mt-4 flex gap-2">
                  <Link to="/signup" className={cx("inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition", SIGNUP_SOLID_BTN)}>
                    Sign up
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                  <a href="mailto:info@ghosthome.co.za" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    info@ghosthome.co.za
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HARD SEPARATOR – removes “one big bundle” feeling */}
        <div className="my-10 h-0.5 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* ===================== TRACK 2: SECURITY PARTNER PACKAGES ===================== */}
        <section id="track-partners" className="rounded-3xl border border-sky-200 bg-sky-50 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
            🟦 Security Partner Packages
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">Partnership model — built for real operations</h2>
          <p className="mt-2 max-w-3xl text-slate-700">
            We provide a managed community street network and an <span className="font-semibold">elevated analytics workspace on request</span>.
            Access is role-based, logged and POPIA-aware. Choose the level of collaboration that fits your area strategy.
          </p>

          {/* three partner tiers — NO PRICING, no camera counts, no platform brand names */}
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <PartnerTier
              icon={<Shield className="h-5 w-5 text-sky-700" />}
              title="Operational Access"
              bullets={[
                "Scoped control-room access to live street feeds",
                "AI event stream for people/vehicles at night (23:00–04:00 focus)",
                "Bookmarking & incident tagging (audited)",
              ]}
              footnote="For partners needing clear, logged access to support response and oversight."
            />
            <PartnerTier
              icon={<Handshake className="h-5 w-5 text-sky-700" />}
              title="Co-Branding Partnership"
              bullets={[
                "Everything in Operational Access",
                "Co-branded community signage & comms",
                "Shared alert presence in resident channels (where agreed)",
              ]}
              footnote="Great for visible collaboration with HOAs/CPFs while keeping roles clear."
            />
            <PartnerTier
              icon={<Layers className="h-5 w-5 text-sky-700" />}
              title="Enhanced Add-On"
              bullets={[
                "Everything in Co-Branding Partnership",
                "Limited, watermarked clip exports (logged by role)",
                "Monthly incident summaries & heatmaps for SLAs",
              ]}
              footnote="For partners who report to clients and need clean audit packs."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/partners" className="inline-flex items-center rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-800">
              See partner details
            </Link>
            <Link to="/contact" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              Request partner access
            </Link>
          </div>

          <p className="mt-2 text-xs text-slate-600">
            Privacy by design: no biometric identification; privacy masks; strict export controls; full access logs.
          </p>
        </section>

        {/* HARD SEPARATOR */}
        <div className="my-10 h-0.5 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* ===================== TRACK 3: HOME SYSTEMS ===================== */}
        <section id="track-home" aria-labelledby="home-grid" className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
            🟨 Home & Property Systems
          </div>
          <h2 id="home-grid" className="mt-3 text-2xl font-bold text-slate-900">Reliable kits with AI & deterrence</h2>
          <p className="mt-1 text-slate-700">
            Choose wired or wire-free to suit your property. Add indoor chime for night alerts and simple “if person → do X” automations.
          </p>

          {/* Filters */}
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={clearFilters}
                className={cx(
                  "rounded-full border px-3 py-1 text-sm transition",
                  selectedTags.length === 0
                    ? `${SIGNUP_BORDER} ${SIGNUP_SOFT_BG} ${SIGNUP_TEXT} border ${SIGNUP_BORDER}`
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                All
              </button>
              {TAGS.map((t) => {
                const active = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={cx(
                      "rounded-full border px-3 py-1 text-sm transition",
                      active
                        ? `${SIGNUP_BORDER} ${SIGNUP_SOFT_BG} ${SIGNUP_TEXT} border ${SIGNUP_BORDER}`
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    )}
                    aria-pressed={active}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Tip: Choose a couple of tags (e.g. <span className="font-medium">Wired</span> +{" "}
              <span className="font-medium">4 Cam</span>) to narrow the grid.
            </p>
          </div>

          {/* Quick Compare bar */}
          <section className="mt-6">
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <ArrowLeftRight className="h-4 w-4 text-emerald-700" />
                <span className="font-semibold">Quick Compare:</span>
                <span className="text-slate-600">select up to two cards → click Compare</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={doCompare}
                  disabled={compareSel.length !== 2}
                  className={cx(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                    compareSel.length === 2
                      ? SIGNUP_SOLID_BTN
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  Compare
                </button>
                {compareSel.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Grid — HOME PACKAGES ONLY */}
          <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg) => (
              <motion.article
                key={pkg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
              >
                {/* top row: title + info + copy link */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{pkg.title}</h3>
                    {/* tag chips */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pkg.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* copy link */}
                    <button
                      onClick={async () => {
                        const link = `${window.location.origin}/packages?pkg=${pkg.id}`;
                        await copyToClipboard(link);
                        setCopiedId(pkg.id);
                      }}
                      title="Copy link to this package"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-800"
                    >
                      {copiedId === pkg.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
                    </button>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-2 text-emerald-700">
                      <BadgeInfo className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* bullets */}
                <ul className="mt-2 space-y-2">
                  {pkg.bullets.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* bottom row: actions */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  {/* compare toggle */}
                  <button
                    onClick={() => toggleCompare(pkg.id)}
                    className={cx(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition",
                      compareSel.includes(pkg.id)
                        ? `${SIGNUP_SOFT_BG} ${SIGNUP_TEXT} border ${SIGNUP_BORDER}`
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    )}
                    aria-pressed={compareSel.includes(pkg.id)}
                  >
                    Compare
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDrawer(pkg)}
                      className={cx("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition", SIGNUP_SOLID_BTN)}
                    >
                      Show details
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <a
                      href={`https://wa.me/27794950855?text=${encodeURIComponent(`Hi Ghosthome 👋 I'm interested in: ${pkg.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        </section>

        {/* Compare card (home packages) */}
        <AnimatePresence>
          {comparePair && (
            <motion.section
              ref={compareRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Side-by-side compare</h2>
                <button
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {comparePair.map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                      <button
                        onClick={() => {
                          setDrawerPkg(p);
                          const next = new URL(window.location.href);
                          next.searchParams.set("pkg", p.id);
                          window.history.replaceState({}, "", next);
                        }}
                        className={cx("inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition", SIGNUP_SOLID_BTN)}
                      >
                        View details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {p.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Drawer (outside for overlay) */}
      <DetailDrawer open={!!drawerPkg} pkg={drawerPkg} onClose={closeDrawer} />
    </div>
  );
}

/* ------------------------------- detail drawer ------------------------------- */
function DetailDrawer({ open, pkg, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !pkg) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="drawer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        {/* panel */}
        <motion.aside
          ref={panelRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white text-slate-900 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h3 className="text-base font-semibold">{pkg.title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {pkg.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pkg.details?.bestFor && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                  <span className="font-semibold text-emerald-800">Best for: </span>
                  {pkg.details.bestFor}
                </div>
              )}

              {pkg.bullets?.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-3">
                  <h4 className="mb-2 text-sm font-semibold text-slate-900">Highlights</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {pkg.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.details?.includes && (
                <div className="rounded-xl border border-slate-200 p-3">
                  <h4 className="mb-2 text-sm font-semibold text-slate-900">What’s included</h4>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    {pkg.details.includes.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.details?.features && (
                <div className="rounded-xl border border-slate-200 p-3">
                  <h4 className="mb-2 text-sm font-semibold text-slate-900">Features</h4>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    {pkg.details.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/27794950855?text=${encodeURIComponent(`Hi Ghosthome 👋 I'm looking at: ${pkg.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className={cx("inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold", SIGNUP_SOLID_BTN)}
              >
                <MessageSquare className="h-4 w-4" />
                Chat on WhatsApp
              </a>
              <button
                onClick={async () => {
                  const link = `${window.location.origin}/packages?pkg=${pkg.id}`;
                  await copyToClipboard(link);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <Copy className="h-4 w-4" />
                Copy share link
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Power & connectivity: Wi-Fi must cover camera positions (or choose 4G models). UPS for wired units can be quoted at low cost (recommended). Link to your normal alarm & armed response available.
            </p>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------------------- small local components ---------------------------- */

function PartnerTier({ icon, title, bullets = [], footnote }) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 ring-1 ring-sky-100">
        {icon}
        {title}
      </div>
      <ul className="space-y-2 text-sm text-slate-700">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {footnote ? <p className="mt-3 text-xs text-slate-500">{footnote}</p> : null}
    </div>
  );
}
