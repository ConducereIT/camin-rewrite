import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
// @ts-ignore
import("bootstrap/dist/js/bootstrap.bundle.min.js");

import { PreloaderProvider } from "./components/PreloaderProvider.component.tsx";
import Preloader from "./components/Preloader.component.tsx";

import { AuthProvider } from "./provider/authProvider.tsx";
import { MaintenanceController } from "./components/maintananceController.tsx";

import Login from "./routes/login.tsx";
import Register from "./routes/register.tsx";
import { RouteProtector } from "./routes/routeProtector.tsx";
import Account from "./routes/account.tsx";
import Calendars from "./routes/calendar.tsx";
import MyAppointments from "./routes/myAppointments.tsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      element: <RouteProtector />,
      children: [
        {
          path: "/",
          element: <Calendars />,
        },
        {
          path: "/myappointments",
          element: <MyAppointments />,
        },
        {
          path: "/account",
          element: <Account />,
        },
      ],
    },
  ]);

  return (
    <PreloaderProvider>
      <Preloader />
      <MaintenanceController>
        <AuthProvider>
          {/* <GoogleOAuthProvider clientId="886547719913-k21ok74kivm5ej2cop7ua8pvb1bh8p2e.apps.googleusercontent.com"> */}
          <RouterProvider router={router} />
          {/* </GoogleOAuthProvider> */}
        </AuthProvider>
      </MaintenanceController>
    </PreloaderProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
