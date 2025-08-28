import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PackagesInlineNav from "../components/PackagesInlineNav.jsx";
import CommunityStreetPackages from "../components/CommunityStreetPackages.jsx";

/**
 * Site chrome: header (brand button + nav), footer, and Outlet.
 * - Brand button: ghost logo + "Ghosthome" routes to "/"
 * - Keeps your existing pages untouched.
 * - When the current route is "/packages", we append a tiny toolbar
 *   (Back to Features / Street page) and the Community Street Packages section
 *   AFTER the existing Packages content — without modifying your Packages.jsx file.
 * - Hash-aware scroll: visiting /packages#street scrolls to the Street section.
 */
export default function RootLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Smooth-scroll to hash targets like /packages#street
    if (location.pathname === "/packages" && location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // delay ensures the section is in the DOM after Outlet renders
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      }
    }
  }, [location]);

  const NavItem = ({ to, label }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-semibold",
          isActive
            ? "bg-emerald-600 text-white"
            : "text-slate-700 hover:bg-slate-100",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Brand button (logo + text) */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-slate-800 hover:bg-slate-100"
            aria-label="Ghosthome Home"
          >
            <img
              src="/logo.png"
              onError={(e) => (e.currentTarget.src = "/logo192.png")}
              alt="Ghosthome"
              className="h-7 w-7 rounded-full"
            />
            <span className="text-base font-bold">Ghosthome</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavItem to="/features" label="Features" />
            <NavItem to="/packages" label="Packages" />
            <NavItem to="/street" label="Secure Street" />
            <NavItem to="/about" label="About" />
            <NavItem to="/contact" label="Contact" />
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden">
            <nav className="mx-3 mb-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="grid gap-1">
                <NavItem to="/features" label="Features" />
                <NavItem to="/packages" label="Packages" />
                <NavItem to="/street" label="Secure Street" />
                <NavItem to="/about" label="About" />
                <NavItem to="/contact" label="Contact" />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4">
        <Outlet />

        {/* Append-only: show extra bits ONLY on /packages, below the existing page content */}
        {location.pathname === "/packages" && (
          <>
            <PackagesInlineNav />
            <CommunityStreetPackages />
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600">
          <p>
            © 2025 Ghosthome • Security & Automation that acts, not just records •{" "}
            A brand of Alpha Research CC
          </p>
          <p className="mt-1">
            WhatsApp:{" "}
            <a className="underline" href="https://wa.me/27794950855">
              +27 79 495 0855
            </a>{" "}
            • Email: <span className="underline">ian@ghosthome.co.za</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
