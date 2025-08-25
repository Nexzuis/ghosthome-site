import { useEffect, useState } from "react";
import { Siren } from "lucide-react";

/**
 * Corner glow + big "PERSON DETECTED!" banner.
 * Shows once per tab for `duration` ms, then hides.
 *
 * Props:
 * - duration  : ms (default 2200)
 * - intensity : 0..1 alpha at the hotspot (default 0.35)
 * - corner    : "top-right" | "top-left" | "bottom-right" | "bottom-left"
 * - message   : override banner text (default "PERSON DETECTED!")
 */
export default function FlashSiren({
  duration = 2200,
  intensity = 0.35,
  corner = "top-right",
  message = "PERSON DETECTED!",
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("gh_siren_seen")) return;
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("gh_siren_seen", "1");
    }, duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (!show) return null;

  const anchor = {
    "top-right": "100% 0%",
    "top-left": "0% 0%",
    "bottom-right": "100% 100%",
    "bottom-left": "0% 100%",
  }[corner] || "100% 0%";

  const a = Math.max(0, Math.min(1, intensity));

  const radial = (rgb) => ({
    background: `radial-gradient(1200px 900px at ${anchor},
      rgba(${rgb}, ${a}) 0%,
      rgba(${rgb}, ${(a * 0.55).toFixed(2)}) 28%,
      rgba(${rgb}, ${(a * 0.28).toFixed(2)}) 50%,
      rgba(${rgb}, 0.12) 68%,
      rgba(${rgb}, 0.04) 80%,
      rgba(${rgb}, 0) 90%)`,
  });

  // chip position for the banner
  const chipPos =
    corner === "top-left"
      ? "top-6 left-6"
      : corner === "bottom-right"
      ? "bottom-6 right-6"
      : corner === "bottom-left"
      ? "bottom-6 left-6"
      : "top-6 right-6";

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {/* Red overlay (strobe) */}
      <div
        className="absolute inset-0"
        style={{
          ...radial("239, 68, 68"), // red-500
          animation: `gh-strobe ${duration}ms ease-out forwards`,
        }}
      />
      {/* Blue overlay (strobe out of phase) */}
      <div
        className="absolute inset-0"
        style={{
          ...radial("37, 99, 235"), // blue-600
          animation: `gh-strobe ${duration}ms ease-out forwards`,
          animationDelay: `${Math.round(duration * 0.15)}ms`,
        }}
      />

      {/* Big banner (top-right by default) */}
      <div className={`absolute ${chipPos}`}>
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-xl border border-neutral-200">
          <span className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-red-500/20">
            <Siren className="w-6 h-6 text-red-500 animate-gh-flash" />
          </span>
          <span className="font-extrabold tracking-wide text-neutral-900 text-lg md:text-xl uppercase">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}
