import { Outlet, NavLink } from "react-router-dom";
import { Phone, Menu } from "lucide-react";
import { useState } from "react";
import FlashSiren from "../components/FlashSiren.jsx";

export default function RootLayout() {
  const [open, setOpen] = useState(false);
  const link = (nav) =>
    `px-3 py-2 rounded-xl text-sm font-medium ${
      nav.isActive ? "bg-brand/10 text-neutral-900" : "text-neutral-600 hover:text-neutral-900"
    }`;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* subtle 2s siren indicator on first load */}
      <FlashSiren duration={2000} />

      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2" aria-label="Ghosthome home">
            <img
              src="/logo.png"
              alt="Ghosthome"
              className="h-12 md:h-14 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </NavLink>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/features" className={link}>Features</NavLink>
            <NavLink to="/packages" className={link}>Packages</NavLink>
            <NavLink to="/gallery" className={link}>Gallery</NavLink>
            <NavLink to="/about" className={link}>About</NavLink>
            <NavLink
              to="/contact"
              className="ml-2 inline-flex items-center gap-2 bg-brand hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-xl"
            >
              <Phone className="w-4 h-4" />
              079 495 0855
            </NavLink>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu />
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-neutral-200">
            <div className="px-4 py-3 flex flex-col gap-2">
              <NavLink to="/features" className={link} onClick={() => setOpen(false)}>Features</NavLink>
              <NavLink to="/packages" className={link} onClick={() => setOpen(false)}>Packages</NavLink>
              <NavLink to="/gallery" className={link} onClick={() => setOpen(false)}>Gallery</NavLink>
              <NavLink to="/about" className={link} onClick={() => setOpen(false)}>About</NavLink>
              <NavLink to="/contact" className={link} onClick={() => setOpen(false)}>Contact</NavLink>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 py-10 mt-10 text-sm text-neutral-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Ghosthome. Smart CCTV & Automations — Pretoria, South Africa.</p>
          <p>Responsible use of CCTV. POPIA signage available on request.</p>
        </div>
      </footer>
    </div>
  );
}
