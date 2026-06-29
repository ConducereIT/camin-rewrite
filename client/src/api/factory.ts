import { useCallback, useEffect, useState } from "react";

const generalOptions: RequestInit = {};

type NewApiFactory = {
  baseUrl: string;
  factoryOptions?: RequestInit;
  onUnauthorizedAccess?: () => Promise<void>;
};

type MutationParameters = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  location: string;
  options?: RequestInit;
};
type CommonFetchOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  location: string;
  options?: RequestInit;
  body?: any;
};

export function ApiFactory({
  baseUrl,
  factoryOptions,
  onUnauthorizedAccess,
}: NewApiFactory) {
  // Returns a Custom Hook instead of a plain function
  function useFetcher<T>({
    method,
    location,
    options,
    body,
  }: CommonFetchOptions): [T | null, boolean, boolean] {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [loading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
      let isMounted = true;
      setIsLoading(true);
      setError(false);

      const controller = new AbortController();
      const signal = controller.signal;

      fetch(baseUrl + location, {
        method: method,
        ...generalOptions,
        ...factoryOptions,
        ...options,
        body: JSON.stringify(body),
        signal,
      })
        .then(async (response) => {
          if (response.status == 401) {
            onUnauthorizedAccess && onUnauthorizedAccess();
          }
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const jsonData = await response.json();
          if (isMounted) {
            setData(jsonData);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError" && isMounted) {
            setError(true);
            setIsLoading(false);
            setData(null);
          }
        });

      return () => {
        isMounted = false;
        controller.abort(); // Cancel the request if the component unmounts
      };
    }, [method, location, options, body]);

    return [data, loading, error];
  }

  function useMutation<RequestData, ResponseData>({
    method,
    location,
    options,
  }: CommonFetchOptions) {
    const [data, setData] = useState<ResponseData | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [loading, setIsLoading] = useState<boolean>(false);

    const trigger = useCallback(
      async (reqData: RequestData) => {
        setIsLoading(true);
        setError(false);
        console.table([reqData]);
        try {
          const response = await fetch(baseUrl + location, {
            method: method,
            ...generalOptions,
            ...factoryOptions,
            ...options,
            headers: {
              "Content-Type": "application/json",
            },
            body: reqData ? JSON.stringify(reqData) : undefined,
          });

          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }
          const jsonData = await response.json();
          setData(jsonData);
          setIsLoading(false);
        } catch (err) {
          setError(true);
          setIsLoading(false);
          return err;
        }
      },
      [method, location, options],
    );

    return { trigger, data, loading, error };
  }

  return { useFetcher, useMutation };
}
