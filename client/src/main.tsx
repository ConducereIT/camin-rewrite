import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthService } from "@genezio/auth";
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

AuthService.getInstance().setTokenAndRegion(
  "1-a3036f2f-8a7c-495c-8d24-06695b1ad57f",
  "eu-central-1",
);

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
      path: "/account",
      element: <Account />,
    },
    {
      element: <RouteProtector />,
      children: [
        {
          path: "/",
          element: <>Home</>,
        },
      ],
    },

    // path: "/",
    // element: <RouteProtector />,
    // children: [
    //   {
    //     path: "",
    //     element: isMentenanta ? <Mentenanta /> : <Calendar />,
    //   },
    //   {
    //     path: "login",
    //     element: isMentenanta ? <Mentenanta /> : <Login />,
    //   },
    //   {
    //     path: "signup",
    //     element: isMentenanta ? <Mentenanta /> : <Register />,
    //   },
    //   {
    //     path: "account",
    //     element: isMentenanta ? <Mentenanta /> : <Account />,
    //   },
    //   {
    //     path: "admin",
    //     element: isMentenanta ? <Mentenanta /> : <Admin />,
    //   },
    //   {
    //     path: "myappointments",
    //     element: isMentenanta ? <Mentenanta /> : <MyAppointments />,
    //   },
    //   {
    //     path: "newLogin",
    //     element: <NewLogin />,
    //   },
    //   {
    //     path: "callback",
    //     element: (
    //       <>
    //         <h1>Success</h1>
    //       </>
    //     ),
    //   },
    // ],
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
