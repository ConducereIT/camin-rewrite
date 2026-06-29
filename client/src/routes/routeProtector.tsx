import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../provider/authProvider";
import { useAuthApi } from "../hooks/api";

type response = {
  phone: string;
  camera: string;
};

export const RouteProtector: React.FC = () => {
  const navigate = useNavigate();

  // because useAuthApi does the check in case the res.status is 401 there is no need to check if the user is authenticated
  const [data, loading, error] = useAuthApi<response>({
    method: "GET",
    location: "/getPhoneAndCamera",
  });
  useEffect(() => {
    if (data?.phone.length == 0 && data.camera.length == 0) {
      navigate("/account");
    }
  }, [data?.phone, data?.camera]);

  if (
    !loading &&
    !error &&
    data?.camera.length != 0 &&
    data?.phone.length != 0
  ) {
    return (
      <>
        <Outlet />
      </>
    );
  }
};
