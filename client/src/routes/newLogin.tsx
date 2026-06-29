import React, { useEffect, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth";
// import { AuthService } from "@genezio/auth";
// import { BackendService } from "genezio-sdk";

const NewLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("HANDLE EMAIL AND PASSWORD");
    setLoginLoading(true);

    try {
      //   await AuthService.getInstance().login(email, password);
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
    setLoginLoading(false);
  };

  // login to check if the user is authenticated and redirecting him to the schedule an appointment or to complete the profile with info
  //   useEffect(() => {
  //     let isMounted = true;

  //     const isLoggedIn = async () => {
  //       try {
  //         const token = localStorage.getItem("token");

  //         if (!token) {
  //           console.log("No token found");
  //           return;
  //         }

  //         const response =
  //           await AuthService.getInstance().userInfoForToken(token);

  //         if (
  //           isMounted &&
  //           response &&
  //           (await BackendService.checkHasPhoneAndCamera())
  //         ) {
  //           navigate("/");
  //         } else {
  //           navigate("/account");
  //         }
  //       } catch (error) {
  //         console.log("Not logged in", error);
  //       }
  //     };

  //     isLoggedIn();

  //     return () => {
  //       isMounted = false;
  //     };
  //   }, [navigate]);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setGoogleLoginLoading(true);

    try {
      await AuthService.getInstance().googleRegistration(
        credentialResponse.credential!,
      );

      if (await BackendService.checkHasPhoneAndCamera()) {
        navigate("/");
      } else {
        navigate("/account");
      }
    } catch (error: any) {
      console.log("Login Failed", error);
      alert("Login Failed");
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="mb-1 text-center">
          <div className="d-flex justify-content-center">
            {googleLoginLoading ? (
              <div className="text-muted">Loading...</div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleLogin(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                  alert("Login Failed");
                }}
                theme="outline"
                shape="circle"
                text="signup_with"
              />
            )}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center my-4">
          <div className="flex-grow-1 border-top"></div>
          <span className="mx-2 text-muted">OR</span>
          <div className="flex-grow-1 border-top"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Parolă:
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3 text-end">
            <a
              href="/forgot-password"
              className="text-decoration-none"
              style={{ color: "#212529" }}
            >
              Ai uitat parola?
            </a>
          </div>
          <button
            type="submit"
            className="btn btn-secondary w-100"
            style={{ background: "#FFAE1F" }}
          >
            {loginLoading ? "Loading..." : "Autentificare"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="btn btn-secondary w-100 mt-3"
          >
            Crează cont
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewLogin;
