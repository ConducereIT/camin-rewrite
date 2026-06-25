import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Calendar from "./routes/calendar";
import Login from "./routes/login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthService } from "@genezio/auth";
import "bootstrap/dist/css/bootstrap.min.css";
// @ts-ignore
import("bootstrap/dist/js/bootstrap.bundle.min.js");

import Account from "./routes/account.tsx";
import Admin from "./routes/admin.tsx";
import MyAppointments from "./routes/myAppointments.tsx";
import { PreloaderProvider } from "./components/PreloaderProvider.component.tsx";
import Preloader from "./components/Preloader.component.tsx";
import Register from "./routes/register.tsx";
import Mentenanta from "./routes/mentenanta.tsx";
import { BackendService } from "genezio-sdk";

AuthService.getInstance().setTokenAndRegion(
  "1-a3036f2f-8a7c-495c-8d24-06695b1ad57f",
  "eu-central-1"
);

const App = () => {
  const [isMentenanta, setIsMentenanta] = useState<boolean>(false);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const response = await BackendService.isMaintenance();
        setIsMentenanta(response.status);
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
      }
    };

    checkMaintenanceStatus();
  }, []);

  const router = createBrowserRouter([
    {
      path: "*",
      element: isMentenanta ? <Mentenanta /> : <Calendar />,
    },
    {
      path: "/login",
      element: isMentenanta ? <Mentenanta /> : <Login />,
    },
    {
      path: "/signup",
      element: isMentenanta ? <Mentenanta /> : <Register />,
    },
    {
      path: "/account",
      element: isMentenanta ? <Mentenanta /> : <Account />,
    },
    {
      path: "/admin",
      element: isMentenanta ? <Mentenanta /> : <Admin />,
    },
    {
      path: "/myappointments",
      element: isMentenanta ? <Mentenanta /> : <MyAppointments />,
    },
  ]);

  return (
    <PreloaderProvider>
      <Preloader />
      <GoogleOAuthProvider clientId="886547719913-k21ok74kivm5ej2cop7ua8pvb1bh8p2e.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </PreloaderProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
