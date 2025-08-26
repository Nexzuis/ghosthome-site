import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./routes/RootLayout.jsx";

// Make sure these point to different files:
import Home from "./routes/Home.jsx";
import Features from "./routes/Features.jsx";
import Packages from "./routes/Packages.jsx";
import About from "./routes/About.jsx";   // ← not Features.jsx by accident
import Contact from "./routes/Contact.jsx";
import "./index.css";

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-600">Use the navigation above to continue.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/features" element={<Features />} /> {/* ← Features component */}
          <Route path="/packages" element={<Packages />} />
          <Route path="/about" element={<About />} />       {/* ← About component */}
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
