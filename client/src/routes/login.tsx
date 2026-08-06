import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoogleButton from "react-google-signin-button";
import "react-google-signin-button/dist/button.css";
import { useAuth } from "../provider/authProvider";

const Login: React.FC = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);
    authContext.loginWithEmail({
      email: email,
      password: password,
      callbackURL: import.meta.env.VITE_BASE_URL + "/login",
    });

    setLoginLoading(false);
  };

  useEffect(() => {
    if (authContext.isAuthenticated) {
      navigate("/");
    }
  }, [authContext.isAuthenticated]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="mb-1 text-center">
          <div className="d-flex justify-content-center">
            {googleLoginLoading ? (
              <div className="text-muted">Loading...</div>
            ) : (
              <GoogleButton
                onClick={() => {
                  authContext.loginWithSocial({
                    provider: "google",
                    callbackURL: import.meta.env.VITE_BASE_URL + "/",
                  });
                }}
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
          {/*<div className="mb-3 text-end">*/}
          {/*  <a href="/forgot-password" className="text-decoration-none" style={{color: "#212529"}}>*/}
          {/*    Ai uitat parola?*/}
          {/*  </a>*/}
          {/*</div>*/}
          <button
            type="submit"
            className="btn btn-secondary w-100"
            style={{ background: "#FFAE1F" }}
          >
            {loginLoading ? "Loading..." : "Autentificare"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn btn-secondary w-100 mt-3"
          >
            Crează cont
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
