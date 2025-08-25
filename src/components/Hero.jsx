import { motion } from "framer-motion";
import HeroBullets from "./HeroBullets.jsx";
import { genericMessage, makeWaLink } from "../lib/whatsapp.js";

export default function Hero() {
  const waGeneric = makeWaLink({ message: genericMessage() });

  return (
    <section className="py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left: copy + CTAs */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900"
          >
            Smart CCTV that <span className="text-brand">acts</span>, not just records
          </motion.h1>

          <p className="mt-4 text-neutral-600">
            AI detection for people, pets, and vehicles. Instant indoor chime, siren and lights.
            Sleep easy — Ghosthome is on watch.
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="/packages"
              className="bg-brand hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-xl"
            >
              View Packages
            </a>

            <a
              href={waGeneric}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M19.11 17.41c-.29-.14-1.69-.83-1.95-.92-.26-.1-.45-.14-.64.14s-.73.92-.9 1.11c-.17.19-.33.21-.62.07-.29-.14-1.23-.45-2.35-1.44-.87-.76-1.45-1.7-1.62-1.99-.17-.29-.02-.44.13-.58.14-.14.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.49-.64-.5h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .14.19 2.03 3.1 4.92 4.34.69.3 1.22.48 1.64.61.69.22 1.32.19 1.82.12.56-.08 1.69-.69 1.93-1.36.24-.67.24-1.26.17-1.36-.07-.1-.26-.17-.55-.31z" />
                <path d="M26.9 5.1A13.5 13.5 0 1 0 5.1 26.9L4 30l3.2-1.06a13.5 13.5 0 0 0 19.7-19.84zM16 27.16a11.14 11.14 0 0 1-5.67-1.55l-.41-.24-2.36.78.78-2.3-.25-.42A11.18 11.18 0 1 1 27.18 16 11.16 11.16 0 0 1 16 27.16z" />
              </svg>
              WhatsApp us
            </a>

            <span className="text-sm md:text-base text-neutral-700">
              Don’t take a chance on your security.{" "}
              <a href="/contact" className="underline font-medium">Contact us.</a>
            </span>
          </div>

          {/* Colourful interactive bullets */}
          <div className="mt-8">
            <HeroBullets />
          </div>
        </div>

        {/* Right: image frame (16:9) */}
        <div className="relative rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="aspect-video">
            <img
              src="/images/hero.jpg"
              alt="Ghosthome smart CCTV in action"
              className="w-full h-full object-cover"
              loading="eager"
              width="1920"
              height="1080"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
