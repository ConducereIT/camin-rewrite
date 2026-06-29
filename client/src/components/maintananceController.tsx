import { useApi, useAuthApi } from "../hooks/api";
import Mentenanta from "../routes/mentenanta";

type serverStatusResponse = {
  ok: boolean;
};

type maintenanceResponse = {
  status: boolean;
  date: string;
};

type Props = {
  children: React.ReactNode;
};

export const MaintenanceController: React.FC<Props> = ({ children }) => {
  const [serverStatus, loadingSrvStatus, serverStatusError] =
    useApi<serverStatusResponse>({
      method: "GET",
      location: "/ok",
    });

  const [btrAuthStatus, loadingBtrAuthStatus, btrAuthError] =
    useApi<serverStatusResponse>({
      method: "GET",
      location: "/auth/ok",
    });

  const [maintenance, loadingMaintenance, errorMaintenance] =
    useApi<maintenanceResponse>({
      method: "GET",
      location: "/isMaintenance",
    });
  if (
    loadingSrvStatus == false &&
    loadingBtrAuthStatus == false &&
    loadingMaintenance == false &&
    (serverStatusError ||
      btrAuthError ||
      !serverStatus?.ok ||
      !btrAuthStatus?.ok ||
      errorMaintenance ||
      maintenance?.status == true)
  ) {
    return (
      <>
        <Mentenanta maintenance={{ ...maintenance }} />
      </>
    );
  }

  return <>{children}</>;
};
