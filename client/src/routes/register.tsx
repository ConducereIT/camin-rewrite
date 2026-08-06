import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoogleButton from "react-google-signin-button";
import "react-google-signin-button/dist/button.css";
import { useAuth } from "../provider/authProvider";

const Register: React.FC = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [registerLoading, setRegisterLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterLoading(true);

    authContext
      .signUpWithEmail({
        name: name, // required
        email: email, // required
        password: password, // required
      })
      .then(() => {
        navigate("/login");
      })
      .catch((e) => {
        alert("User with the same email already exists");
      });

    setRegisterLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="mb-1 text-center">
          <div className="d-flex justify-content-center">
            {googleLoginLoading ? (
              <div
                className="spinner-border text-muted"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
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
            <label htmlFor="name" className="form-label">
              Nume:
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              required
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
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary w-100">
            {registerLoading ? "Loading..." : "Crează cont"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="btn btn-secondary w-100 mt-3"
          >
            Autentificare
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
