import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PackagesInlineNav from "../components/PackagesInlineNav.jsx";
import CommunityStreetPackages from "../components/CommunityStreetPackages.jsx";

export default function RootLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/packages" && location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  }, [location]);

  const NavItem = ({ to, label }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-semibold",
          isActive ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-100",
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
          {/* Brand + Call */}
          <div className="flex items-center gap-3">
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

            <a
              href="tel:+27794950855"
              className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 sm:text-sm"
              aria-label="Call 079 495 0855"
            >
              Call 079 495 0855
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavItem to="/features" label="Features" />
            <NavItem to="/packages" label="Packages" />
            <NavItem to="/street" label="Secure Street" />
            <NavItem to="/signup" label="Sign up" />
            <NavItem to="/about" label="About" />
            <NavItem to="/contact" label="Contact" />
            <NavItem to="/privacy" label="Privacy" />
            <NavItem to="/terms" label="Terms" />
          </nav>

          {/* Mobile menu */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden">
            <nav className="mx-3 mb-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="grid gap-1">
                <NavItem to="/features" label="Features" />
                <NavItem to="/packages" label="Packages" />
                <NavItem to="/street" label="Secure Street" />
                <NavItem to="/signup" label="Sign up" />
                <NavItem to="/about" label="About" />
                <NavItem to="/contact" label="Contact" />
                <NavItem to="/privacy" label="Privacy" />
                <NavItem to="/terms" label="Terms" />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-4">
        <Outlet />
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
            © 2025 Ghosthome • Security & Automation that acts, not just records • A brand of Alpha Research CC
          </p>
          <p className="mt-1">
            WhatsApp: <a className="underline" href="https://wa.me/27794950855">+27 79 495 0855</a> •
            Email: <span className="underline">ian@ghosthome.co.za</span> •
            <Link to="/privacy" className="underline ml-1">Privacy (POPIA)</Link> •{" "}
            <Link to="/terms" className="underline">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
