// src/components/HowItWorksStory.jsx
import React from "react";
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

/**
 * Interactive “How it works” story + right-side controls.
 * Includes a hover-flip Ghosthome logo card that links to /packages.
 */
export default function HowItWorksStory() {
  return (
    <section
      id="how-it-works"
      className="mx-auto mt-8 max-w-6xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm"
    >
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
        <div className="md:col-span-2 space-y-4">
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

          {/* Story chips */}
          <div className="grid gap-3 sm:grid-cols-2">
            <StoryChip
              icon={<Camera className="h-4 w-4" />}
              badge="1. Detect"
              text="AI tags people, pets, vehicles — cutting false alarms."
            />
            <StoryChip
              icon={<BellRing className="h-4 w-4" />}
              badge="2. Alert"
              text="Snapshot + indoor chime (night-mode) so you actually wake up."
            />
            <StoryChip
              icon={<Shield className="h-4 w-4" />}
              badge="3. Deter"
              text="Spotlight + on-camera siren or lights turn on automatically."
              tone="red"
            />
            <StoryChip
              icon={<ScanEye className="h-4 w-4" />}
              badge="4. Track"
              text="Pan/tilt models follow movement. Other cams continue tracking."
              tone="blue"
            />
            <StoryChip
              icon={<Lightbulb className="h-4 w-4" />}
              badge="5. Automate"
              text="Turn lights, plugs and more on with rules (line-crossing, zones)."
              tone="amber"
            />
            <StoryChip
              icon={<PhoneCall className="h-4 w-4" />}
              badge="6. Escalate"
              text="Link to normal alarm panel & dispatch armed response."
              tone="slate"
            />
          </div>

          {/* Requirements / notes */}
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>
              Works during load-shedding: a small router/inverter UPS keeps the
              system online (wired-camera UPS can be quoted at a{" "}
              <strong>very low price — recommended</strong>).
            </li>
            <li>
              <strong>Wi-Fi needs to reach each camera</strong> (unless you pick
              4G models). We can add mesh/extenders as part of install.
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
            >
              Build my system
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Explore features
            </Link>
          </div>
        </div>

        {/* RIGHT / CONTROLS + FLIP CARD */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <PlayCircle className="h-4 w-4" />
                Auto-play a quick demo
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                onClick={() =>
                  alert(
                    "Tip: use the Packages page video at the top for a live feel. (This button is a placeholder.)"
                  )
                }
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
                    className="absolute inset-0 grid place-items-center rounded-2xl bg-emerald-600 px-4 text-center text-white [transform:rotateY(180deg)] [backface-visibility:hidden]"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div>
                      <p className="text-sm/5 font-semibold">
                        Build a system that{" "}
                        <span className="underline decoration-white/60">
                          acts
                        </span>
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
              </div>
            </Link>

            <p className="mt-3 text-xs text-slate-500">
              Tip: set{" "}
              <strong className="text-slate-700">always-on night mode</strong>{" "}
              with indoor chime + snapshot so you actually wake up when a{" "}
              <strong className="text-slate-700">person</strong> enters your
              property.
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
      "bg-emerald-50 ring-emerald-100 text-emerald-700 dark:text-emerald-800",
    red: "bg-rose-50 ring-rose-100 text-rose-700 dark:text-rose-800",
    blue: "bg-sky-50 ring-sky-100 text-sky-700 dark:text-sky-800",
    amber: "bg-amber-50 ring-amber-100 text-amber-800",
    slate: "bg-slate-50 ring-slate-200 text-slate-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div
        className={`mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}
      >
        <span className="grid h-4 w-4 place-items-center">{icon}</span>
        {badge}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}
