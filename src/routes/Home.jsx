// src/routes/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import HowItWorksStory from "../components/HowItWorksStory.jsx";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8">
      {/* Slogan / Hero summary */}
      <header className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ghosthome — Security that{" "}
            <span className="text-emerald-600">acts</span> — not just records
          </h1>

          <p className="mt-3 max-w-prose text-slate-600">
            Traditional cameras are outdated: they mostly help{" "}
            <span className="font-semibold">after</span> the incident or ping you with{" "}
            <span className="font-semibold">dumb motion alerts</span>. Ghosthome is different — it{" "}
            <span className="font-semibold">responds</span>. AI identifies who/what, rings an{" "}
            <span className="font-semibold">indoor chime</span> so you actually wake up, sends a snapshot to your phone,
            turns on <span className="font-semibold">lights/sirens</span>, and can integrate with your{" "}
            <span className="font-semibold">alarm panel &amp; armed response</span>.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-700"
            >
              Build my system
            </Link>
            <a
              href="https://wa.me/27794950855"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 bg-white px-4 py-2 text-emerald-700 hover:bg-emerald-50"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        {/* Hero video */}
        <div className="rounded-2xl border border-slate-200 bg-black/2 p-2">
          <video
            className="aspect-video w-full rounded-xl"
            autoPlay
            muted
            playsInline
            controls
            preload="auto"
            onCanPlay={(e) => {
              const p = e.currentTarget.play();
              if (p && typeof p.catch === "function") p.catch(() => {});
            }}
          >
            <source src="/videos/detection-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </header>

      {/* NEW: interactive story */}
      <HowItWorksStory />
    </main>
  );
}
