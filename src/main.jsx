import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./routes/RootLayout.jsx";
import Home from "./routes/Home.jsx";
import Features from "./routes/Features.jsx";
import About from "./routes/About.jsx";
import Packages from "./routes/Packages.jsx";
import SecureStreet from "./routes/SecureStreet.jsx";
import Contact from "./routes/Contact.jsx";
import AppError from "./routes/AppError.jsx";
import NotFound from "./routes/NotFound.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <AppError />, // Friendly error UI instead of raw stack
    children: [
      { index: true, element: <Home /> },
      { path: "features", element: <Features /> },
      { path: "about", element: <About /> },
      { path: "packages", element: <Packages /> },
      { path: "street", element: <SecureStreet /> }, // New page
      { path: "contact", element: <Contact /> },     // Contact restored
      { path: "*", element: <NotFound /> },          // 404 within app
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
