import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-2 text-sm font-medium",
          isActive ? "text-emerald-700 bg-emerald-50" : "text-slate-700 hover:bg-slate-50",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand: logo + Ghosthome as one Home button */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-emerald-50"
          >
            <img
              src="/logo.png"
              onError={(e) => (e.currentTarget.src = "/logo192.png")}
              alt="Ghosthome"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-semibold tracking-wide text-slate-800 group-hover:text-emerald-700">
              Ghosthome
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/packages">Packages</NavItem>
            <NavItem to="/features">Features</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
