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

// ✅ Add the missing pages so the routes resolve in Production
import Signup from "./routes/Signup.jsx";
import Pay from "./routes/pay.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "features", element: <Features /> },
      { path: "packages", element: <Packages /> },
      { path: "street", element: <SecureStreet /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "admin", element: <Admin /> },
      { path: "upload", element: <Upload /> },

      // ✅ New: routes that were 404ing
      { path: "signup", element: <Signup /> },
      { path: "pay", element: <Pay /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
