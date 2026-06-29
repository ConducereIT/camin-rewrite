import { ApiFactory } from "../api/factory";

export const useApi = ApiFactory({
  baseUrl: import.meta.env.VITE_API_URL + "/api",
  factoryOptions: { credentials: "omit" },
});
export const useAuthApi = ApiFactory({
  baseUrl: import.meta.env.VITE_API_URL + "/api",
  factoryOptions: { credentials: "include" },
});
