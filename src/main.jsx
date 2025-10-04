// src/main.jsx (or wherever you create your router)
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import RootLayout from "./routes/RootLayout.jsx";
import Home from "./routes/Home.jsx";
import Features from "./routes/Features.jsx";
import Packages from "./routes/Packages.jsx";
import SecureStreet from "./routes/SecureStreet.jsx";
import About from "./routes/About.jsx";
import Contact from "./routes/Contact.jsx";
import Privacy from "./routes/Privacy.jsx";
import Admin from "./routes/Admin.jsx";
import Upload from "./routes/Upload.jsx";
import Terms from "./routes/Terms.jsx";
import Cancel from "./routes/Cancel.jsx";
import Signup from "./routes/Signup.jsx";
import Pay from "./routes/pay.jsx";

// NEW
import Partners from "./routes/Partners.jsx";

// Simple friendly error element
function AppError() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">
        That link doesn’t exist. Try the buttons below.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a href="/" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Go home</a>
        <a href="/packages" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 hover:bg-slate-50">View packages</a>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <AppError />, // ← friendly fallback for unmatched/route errors
    children: [
      { index: true, element: <Home /> },
      { path: "features", element: <Features /> },
      { path: "packages", element: <Packages /> },
      { path: "street", element: <SecureStreet /> },
      { path: "about", element: <About /> },
      { path: "partners", element: <Partners /> }, // ← NEW
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "admin", element: <Admin /> },
      { path: "upload", element: <Upload /> },
      { path: "cancel", element: <Cancel /> },
      { path: "signup", element: <Signup /> },
      { path: "pay", element: <Pay /> },

      // Catch-all inside the layout
      { path: "*", element: <AppError /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
