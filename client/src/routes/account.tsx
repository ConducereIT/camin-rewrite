import React, { useEffect, useState } from "react";
import NavbarComponent from "../components/navbar.component.tsx";
import { useNavigate } from "react-router-dom";
import { useAuthApi, useAuthMutation } from "../hooks/api.ts";

type response = {
  phone: string;
  camera: string;
};
const Account: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [cameraModel, setCameraModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const [data, loadingUserData, errorLoadinUserData] = useAuthApi<response>({
    method: "GET",
    location: "/getPhoneAndCamera",
  });

  const {
    trigger,
    loading: loadingMutation,
    error: errorMutatuion,
  } = useAuthMutation<response, any>({
    method: "POST",
    location: "/insertOrUpdateUserInfo",
  });

  useEffect(() => {
    console.log(data);
    console.log(loadingUserData);
    setPhoneNumber(data?.phone || "");
    setCameraModel(data?.camera || "");
    setEditMode(!!data?.phone || !!data?.camera);
  }, [data?.camera, data?.phone, loadingUserData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !cameraModel.trim()) {
      setError("Completați toate câmpurile");
      return;
    }

    const phoneRegex = new RegExp("^[0-9]{10}$");
    if (!phoneRegex.test(phoneNumber)) {
      setError("Numărul de telefon nu este valid");
      return;
    }

    const cameraModelRegex = new RegExp("^[A-Z]{1}[0-9]{3,4}$");
    if (!cameraModelRegex.test(cameraModel)) {
      setError("Modelul camerei nu este valid (ex: A1234, A123, C1234, C123)");
      return;
    }

    setLoading(true);

    try {
      await trigger({
        phone: phoneNumber,
        camera: cameraModel,
      });
      setLoading(false);
      setError("");
      navigate("/");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Error updating user details");
      alert("Error saving new data");
    }
  };

  return (
    <>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <NavbarComponent />
        <div className="container mt-5">
          <div className="bg-white p-4 rounded shadow">
            <h1 style={{ color: "#212529" }}>
              Account Settings - {user?.name}
            </h1>
            <form onSubmit={handleSubmit} className="mt-2">
              {error && (
                <p
                  className="text-danger alert alert-danger mt-4"
                  style={{ marginBottom: "-2rem;" }}
                >
                  {error}
                </p>
              )}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label mt-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="camera" className="form-label">
                  Camera Model
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="camera"
                  value={cameraModel}
                  onChange={(e) => setCameraModel(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary bg-hover-primary"
                style={{ border: "1px solid black" }}
              >
                {loading ? "Loading..." : editMode ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
