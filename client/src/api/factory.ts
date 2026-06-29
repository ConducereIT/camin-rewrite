import { useEffect, useState } from "react";

const generalOptions: RequestInit = {};

type NewApiFactory = {
  baseUrl: string;
  factoryOptions?: RequestInit;
};

type CommonFetchOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  location: string;
  options?: RequestInit;
  body?: any;
};

export function ApiFactory({ baseUrl, factoryOptions }: NewApiFactory) {
  // Returns a Custom Hook instead of a plain function
  return function useFetcher<T>({
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
  };
}
