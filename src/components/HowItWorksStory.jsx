// src/components/HowItWorksStory.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  BellRing,
  Shield,
  ScanEye,
  Lightbulb,
  PhoneCall,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Interactive “How it works” story + right-side controls.
 * Includes a hover-flip Ghosthome logo card that links to /packages.
 */
export default function HowItWorksStory() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);

  const steps = [
    "Detect",
    "Alert",
    "Deter",
    "Track",
    "Automate",
    "Escalate",
    "Call armed response",
  ];

  const timerRef = useRef(null);

  const startDemo = () => {
    clearInterval(timerRef.current);
    setIsPlaying(true);
    setStepIndex(-1);
  };

  useEffect(() => {
    if (!isPlaying) return;
    let i = -1;
    timerRef.current = setInterval(() => {
      i += 1;
      setStepIndex(i);
      if (i >= steps.length) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
      }
    }, 900);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps.length]);

  return (
    <section className="mt-12">
      {/* Heading */}
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
          <Camera className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          What it is & how it works
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* LEFT / STORY */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xl font-semibold text-slate-900">
            Your alarm, but <span className="text-emerald-600">smarter</span>
          </h4>
          <p className="text-slate-600">
            Traditional alarms scream a zone. Ghosthome shows you{" "}
            <strong>who/what</strong>, rings an <strong>indoor chime</strong>{" "}
            to wake you, can flash lights or trigger a{" "}
            <strong>loud siren</strong>, and even{" "}
            <strong>links to armed response</strong>. It’s the difference
            between guessing and acting.
          </p>

          {/* Story chips (colours reintroduced per step) */}
          <div className="grid gap-3 sm:grid-cols-2">
            <StoryChip
              icon={<Camera className="h-4 w-4" />}
              badge="1. Detect"
              text="AI tags people, pets, vehicles — cutting false alarms."
              tone="emerald"
            />
            <StoryChip
              icon={<BellRing className="h-4 w-4" />}
              badge="2. Alert"
              text="Snapshot in your notification + indoor chime at night."
              tone="amber"
            />
            <StoryChip
              icon={<Shield className="h-4 w-4" />}
              badge="3. Deter"
              text="Spotlights and sirens can fire automatically."
              tone="rose"
            />
            <StoryChip
              icon={<ScanEye className="h-4 w-4" />}
              badge="4. Track"
              text="Pan/tilt models follow the target in view."
              tone="indigo"
            />
            <StoryChip
              icon={<Lightbulb className="h-4 w-4" />}
              badge="5. Automate"
              text="Smart lights, plugs and switches respond instantly."
              tone="sky"
            />
            <StoryChip
              icon={<PhoneCall className="h-4 w-4" />}
              badge="6. Escalate"
              text="Link to your alarm panel / armed response when needed."
              tone="violet"
            />
          </div>

          {/* Notes */}
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
            <li>Fewer false alerts via smart zones and line crossing.</li>
            <li>Always-on day/night modes, tuned to how you live.</li>
            <li>
              Wi-Fi dependent — extenders/mesh may be needed for coverage. We
              can add mesh/extenders as part of install.
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
            >
              Build my system
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Explore features
            </Link>
          </div>
        </div>

        {/* RIGHT / CONTROLS + FLIP CARD */}
        <div className="space-y-4 md:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <PlayCircle className="h-4 w-4" />
                Auto-play a quick demo
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                onClick={startDemo}
              >
                <PlayCircle className="h-4 w-4" />
                Play
              </button>
            </div>

            {/* Hover-flip logo card */}
            <Link
              to="/packages"
              className="group relative mt-3 block h-44 w-full cursor-pointer rounded-2xl"
              aria-label="See packages"
            >
              <div className="absolute inset-0 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" />
              <div className="relative h-full w-full p-4 [perspective:1000px]">
                <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* FRONT */}
                  <div
                    className="absolute inset-0 grid place-items-center gap-3 rounded-2xl bg-white [backface-visibility:hidden]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src="/logo.png"
                      onError={(e) => (e.currentTarget.src = "/logo192.png")}
                      alt="Ghosthome"
                      className="h-16 w-16 rounded-full"
                    />
                    <p className="text-sm font-medium text-slate-700">
                      Hover me
                    </p>
                  </div>

                  {/* BACK */}
                  <div
                    className="absolute inset-0 grid place-items-center gap-1 rounded-2xl bg-slate-900 text-white [transform:rotateY(180deg)] [backface-visibility:hidden]"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <p className="text-xs uppercase tracking-wide text-emerald-300">
                      Ghosthome
                    </p>
                    <p className="px-6 text-center text-sm">
                      Security that <span className="text-emerald-300">acts</span>
                      —not just records.
                    </p>
                    <p className="mt-1 text-xs text-emerald-100">
                      Packages from R3 999 → full custom installs.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-emerald-700">
                      Click me
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Auto-play Flashcards Demo */}
            <div className="mt-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Demo sequence
              </div>

              {/* Make last item span full width and keep on one line */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {steps.map((label, idx) => {
                  const isLast = idx === steps.length - 1;
                  return (
                    <motion.div
                      key={label}
                      initial={{ rotateY: 0, opacity: 0.2, y: 6 }}
                      animate={{
                        rotateY: stepIndex === idx ? 180 : 0,
                        opacity: stepIndex >= idx ? 1 : 0.5,
                        y: stepIndex >= idx ? 0 : 6,
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className={[
                        "h-10 rounded-lg border text-sm font-semibold flex items-center justify-center px-3 whitespace-nowrap",
                        stepIndex >= idx
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-emerald-700 border-emerald-200",
                        isLast ? "col-span-2 sm:col-span-3" : "",
                      ].join(" ")}
                      aria-live="polite"
                    >
                      {label}
                    </motion.div>
                  );
                })}
              </div>

              {!isPlaying && (
                <p className="mt-2 text-xs text-slate-500">
                  Click <span className="font-semibold text-slate-700">Play</span> to
                  animate through: Detect → Alert → Deter → Track → Automate → Escalate
                  → Call armed response.
                </p>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Tip: set{" "}
              <strong className="text-slate-700">always-on night mode</strong>{" "}
              with indoor chime + snapshot so you actually wake up when a{" "}
              <strong className="text-slate-700">person</strong> enters your property.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryChip({ icon, badge, text, tone = "emerald" }) {
  const tones = {
    emerald:
      "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    rose: "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200",
    indigo: "bg-indigo-50 text-indigo-800 ring-1 ring-inset ring-indigo-200",
    sky: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200",
    violet:
      "bg-violet-50 text-violet-800 ring-1 ring-inset ring-violet-200",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div
        className={`mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
      >
        <span className="grid h-4 w-4 place-items-center">{icon}</span>
        {badge}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}
