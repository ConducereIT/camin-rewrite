import { ApiFactory } from "../api/factory";

export const { useFetcher: useApi, useMutation } = ApiFactory({
  baseUrl: import.meta.env.VITE_API_URL + "/api",
  factoryOptions: { credentials: "omit" },
});
export const { useFetcher: useAuthApi, useMutation: useAuthMutation } =
  ApiFactory({
    baseUrl: import.meta.env.VITE_API_URL + "/api/user",
    factoryOptions: { credentials: "include" },
    onUnauthorizedAccess: async () => {
      console.log("redirect /login");
      // window.location.href = "/login";
    },
  });
