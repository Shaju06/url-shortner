import { useState } from "react";

type UseFetchOptions = {
  [key: string]: any;
};

type UseFetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fn: (...args: any[]) => Promise<void>;
};

const useFetch = <T,>(
  cb: (options: UseFetchOptions, ...args: any[]) => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      ("use server");
      const response = await cb(options, ...args);
      setData(response);
      setError(null);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
