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

  const baseItem =
    "rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300";

  const NavItem = ({ to, label, bold = false }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          baseItem,
          bold ? "font-extrabold" : "",
          isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );

  // Primary CTA — Sign up
  const SignUpItem = () => (
    <NavLink
      to="/signup"
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          "rounded-xl px-3.5 py-2 text-sm font-bold transition transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
          isActive
            ? "bg-emerald-700 text-white shadow-sm"
            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5 shadow",
        ].join(" ")
      }
      aria-label="Sign up"
    >
      Sign up
    </NavLink>
  );

  // Secondary CTA — Upload docs
  const UploadItem = () => (
    <NavLink
      to="/upload"
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
          isActive
            ? "border border-emerald-300 bg-white text-emerald-800"
            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        ].join(" ")
      }
      aria-label="Upload documents"
    >
      Upload documents
    </NavLink>
  );

  // Highlighted info button — Terms (soft rose, bounce on hover)
  const TermsItem = () => (
    <NavLink
      to="/terms"
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          "rounded-xl px-3.5 py-2 text-sm font-extrabold transition transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300",
          isActive
            ? "bg-rose-500 text-white shadow-sm"
            : "bg-rose-400 text-white hover:bg-rose-500 hover:-translate-y-0.5 shadow",
        ].join(" ")
      }
      aria-label="Terms"
    >
      Terms
    </NavLink>
  );

  // NEW: Security Partners (blue accent, sits AFTER Upload)
  const PartnersItem = () => (
    <NavLink
      to="/partners"
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        [
          "rounded-xl px-3.5 py-2 text-sm font-bold transition transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
          isActive
            ? "bg-sky-700 text-white shadow-sm"
            : "bg-sky-600 text-white hover:bg-sky-700 hover:-translate-y-0.5 shadow",
        ].join(" ")
      }
      aria-label="Security Partners"
    >
      Security Partners
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Brand (bigger logo + text) */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-slate-800 hover:bg-slate-100"
              aria-label="Ghosthome Home"
              onClick={() => setOpen(false)}
            >
              <img
                src="/logo.png"
                onError={(e) => (e.currentTarget.src = "/logo192.png")}
                alt="Ghosthome"
                className="h-9 w-9 rounded-full"
              />
              <span className="text-lg font-extrabold">Ghosthome</span>
            </Link>
          </div>

          {/* Desktop nav — ORDERED */}
          <nav className="hidden items-center gap-2 md:flex">
            <SignUpItem />
            <UploadItem />
            <PartnersItem /> {/* ← moved here, blue */}
            <NavItem to="/street" label="Secure Street" />
            <NavItem to="/about" label="About" />
            <NavItem to="/features" label="Features" />
            <NavItem to="/packages" label="Packages" />
            <NavItem to="/contact" label="Contact" />
            <NavItem to="/privacy" label="Privacy" />
            <TermsItem />
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden">
            <nav className="mx-3 mb-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="grid gap-1">
                <SignUpItem />
                <UploadItem />
                <PartnersItem /> {/* ← mobile order too */}
                <NavItem to="/street" label="Secure Street" />
                <NavItem to="/about" label="About" />
                <NavItem to="/features" label="Features" />
                <NavItem to="/packages" label="Packages" />
                <NavItem to="/contact" label="Contact" />
                <NavItem to="/privacy" label="Privacy" />
                <TermsItem />
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
          <p>© 2025 Ghosthome • Streets in sight. Community in sync.</p>
          <p className="mt-1">
            WhatsApp: <a className="underline" href="https://wa.me/27794950855">+27 79 495 0855</a> •
            Email: <span className="underline">ian@ghosthome.co.za</span> •
            <Link to="/privacy" className="underline ml-1">Privacy (POPIA)</Link> •{" "}
            <Link to="/terms" className="underline font-semibold">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
